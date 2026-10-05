// ============================================================
// 交付数据目录级比对引擎（新增模块）
// 对比两个交付目录（旧版/新版）的全部日期/表/字段，
// 并把差异归因到「案例×场景」，再做单版本日期流转自洽校验。
// 规则引擎确定性计算，叙事由调用方（Mock 风格）生成；全程模拟数据。
// ============================================================
import type { OpenQuestion, RiskLevel } from '../../types';
import { accountTemplateByCode } from '../../data/accountDoc';
import {
  OLD_DELIVERY,
  NEW_DELIVERY,
  MASTER_MAPPING,
  SHEET_KEY_COL,
  type DeliveryDir,
  type MasterRow,
} from '../../data/deliverySim';

export interface ChangedField {
  field: string;
  oldVal: string;
  newVal: string;
}
export interface SheetDateDiff {
  bizDate: string;
  sheet: string;
  insertedRows: number;
  deletedRows: number;
  insertedKeys: string[];
  changedRows: { key: string; changes: ChangedField[] }[];
}
export interface AttributedDiff {
  bizDate: string;
  sheet: string;
  field: string;
  oldVal: string;
  newVal: string;
  caseName: string;
  scenario: string;
}
export interface FlowConsistency {
  caseName: string;
  bizDate: string;
  ok: boolean;
  notes: string[];
  risk: RiskLevel;
}
export interface DeliveryDiffResult {
  isMock: true;
  oldLabel: string;
  newLabel: string;
  dateDiffSummary: { bizDate: string; sheet: string; changeType: string; count: number }[];
  sheetDateDiffs: SheetDateDiff[];
  attributedDiffs: AttributedDiff[];
  flowConsistencies: FlowConsistency[];
  openQuestions: OpenQuestion[];
}

function headersOf(sheet: string): string[] {
  const t = accountTemplateByCode[sheet];
  return t ? t.fields.map((f) => f.chineseName) : [];
}
function keyOf(sheet: string, row: string[]): string {
  const idx = SHEET_KEY_COL[sheet];
  return idx != null && row[idx] != null ? row[idx] : row[0] ?? '';
}
/** 仅对 ≤15 位纯数字做数值归一；19 位贷款单号/合同号保持字符串，避免精度丢失致主键失配。 */
function norm(v: string): string {
  if (/^\d{1,15}$/.test(v)) return String(Number(v));
  return v;
}

// ---------- 1. 目录级比对（旧版 vs 新版） ----------
export function compareDeliveries(oldDir: DeliveryDir, newDir: DeliveryDir): {
  sheetDateDiffs: SheetDateDiff[];
  dateDiffSummary: DeliveryDiffResult['dateDiffSummary'];
} {
  const toMap = (d: DeliveryDir) => {
    const m = new Map<string, (typeof d.files)[number]>();
    for (const fl of d.files) {
      const k = `${fl.date}|${fl.sheet}`;
      const ex = m.get(k);
      // 真实 DAT 中同一 (日期,表) 文件会聚合多笔借据；此处合并行，避免同键覆盖丢失数据
      if (ex) ex.rows.push(...fl.rows);
      else m.set(k, { date: fl.date, variant: fl.variant, sheet: fl.sheet, rows: [...fl.rows] });
    }
    return m;
  };
  const om = toMap(oldDir);
  const nm = toMap(newDir);
  const keys = new Set([...om.keys(), ...nm.keys()]);
  const sheetDateDiffs: SheetDateDiff[] = [];

  for (const key of keys) {
    const [bizDate, sheet] = key.split('|');
    const of = om.get(key);
    const nf = nm.get(key);
    const headers = headersOf(sheet);
    const oRows = of?.rows ?? [];
    const nRows = nf?.rows ?? [];
    const oMap = new Map(oRows.map((r) => [norm(keyOf(sheet, r)), r]));
    const nMap = new Map(nRows.map((r) => [norm(keyOf(sheet, r)), r]));

    const changedRows: SheetDateDiff['changedRows'] = [];
    const insertedKeys: string[] = [];
    let deleted = 0;

    for (const [k, nr] of nMap) {
      const or = oMap.get(k);
      if (!or) {
        insertedKeys.push(k);
        continue;
      }
      const changes: ChangedField[] = [];
      const len = Math.max(or.length, nr.length);
      for (let i = 0; i < len; i++) {
        const ov = or[i] ?? '';
        const nv = nr[i] ?? '';
        if (norm(ov) !== norm(nv)) {
          changes.push({ field: headers[i] || `列${i + 1}`, oldVal: ov, newVal: nv });
        }
      }
      if (changes.length) changedRows.push({ key: k, changes });
    }
    for (const k of oMap.keys()) if (!nMap.has(k)) deleted++;

    if (insertedKeys.length || deleted || changedRows.length) {
      sheetDateDiffs.push({ bizDate, sheet, insertedRows: insertedKeys.length, deletedRows: deleted, insertedKeys, changedRows });
    }
  }

  const dateDiffSummary: DeliveryDiffResult['dateDiffSummary'] = [];
  for (const d of sheetDateDiffs) {
    if (d.insertedRows) dateDiffSummary.push({ bizDate: d.bizDate, sheet: d.sheet, changeType: '行新增', count: d.insertedRows });
    if (d.deletedRows) dateDiffSummary.push({ bizDate: d.bizDate, sheet: d.sheet, changeType: '行删除', count: d.deletedRows });
    if (d.changedRows.length) {
      dateDiffSummary.push({
        bizDate: d.bizDate,
        sheet: d.sheet,
        changeType: '字段变更',
        count: d.changedRows.reduce((s, r) => s + r.changes.length, 0),
      });
    }
  }
  return { sheetDateDiffs, dateDiffSummary };
}

// ---------- 2. 跨案例 × 场景归因 ----------
export function attributeToCases(sheetDateDiffs: SheetDateDiff[]): AttributedDiff[] {
  const byId = new Map<string, MasterRow>();
  for (const m of MASTER_MAPPING) byId.set(`${m.date}|${m.id}`, m);

  const out: AttributedDiff[] = [];
  for (const sd of sheetDateDiffs) {
    for (const cr of sd.changedRows) {
      const m = byId.get(`${sd.bizDate}|${cr.key}`);
      for (const ch of cr.changes) {
        out.push({
          bizDate: sd.bizDate,
          sheet: sd.sheet,
          field: ch.field,
          oldVal: ch.oldVal,
          newVal: ch.newVal,
          caseName: m?.caseName ?? '未归因',
          scenario: m?.scenario ?? '—',
        });
      }
    }
    // 新增行（如全新案例）也尝试归因
    for (const k of sd.insertedKeys) {
      const m = byId.get(`${sd.bizDate}|${k}`);
      out.push({
        bizDate: sd.bizDate,
        sheet: sd.sheet,
        field: '整行新增',
        oldVal: '—',
        newVal: '—',
        caseName: m?.caseName ?? '未归因',
        scenario: m?.scenario ?? '—',
      });
    }
  }
  return out;
}

// ---------- 3. 单版本日期流转自洽校验（仅新版，不跨版本） ----------
export function checkFlowConsistency(newDir: DeliveryDir): FlowConsistency[] {
  const cases = new Map<string, MasterRow[]>();
  for (const m of MASTER_MAPPING) {
    if (!cases.has(m.caseName)) cases.set(m.caseName, []);
    cases.get(m.caseName)!.push(m);
  }

  const out: FlowConsistency[] = [];
  for (const [caseName, rows] of cases) {
    const loanNo = rows.find((r) => /^3099/.test(r.id))?.id ?? '';
    const loanByDate = new Map<string, string[]>();
    const flowByDate = new Map<string, string[][]>();
    for (const fl of newDir.files) {
      if (fl.sheet === 'LOAN') for (const r of fl.rows) if (r[3] === loanNo) loanByDate.set(fl.date, r);
      if (fl.sheet === 'FLOW') for (const r of fl.rows) if (r[1] === loanNo) {
        if (!flowByDate.has(fl.date)) flowByDate.set(fl.date, []);
        flowByDate.get(fl.date)!.push(r);
      }
    }

    const dates = [...loanByDate.keys()].sort();
    const notes: string[] = [];
    let ok = true;

    // 规则1：还款/结清/提前 场景下，贷款余额应较上一日下降（持平或上升均视为不自洽）
    for (let i = 1; i < dates.length; i++) {
      const prev = Number(loanByDate.get(dates[i - 1])![6]);
      const cur = Number(loanByDate.get(dates[i])![6]);
      const sceneHere = rows.find((r) => r.date === dates[i]);
      if (sceneHere && /还款|结清|提前/.test(sceneHere.scenario) && !(cur < prev - 1e-6)) {
        ok = false;
        notes.push(`${dates[i]} 场景「${sceneHere.scenario}」但贷款余额 ${prev} → ${cur} 未下降`);
      }
    }

    // 规则2：场景描述“连续N次/多次/N次还款”应与 FLOW 笔数匹配（按日期去重，避免映射重复）
    const seenMulti = new Set<string>();
    for (const r of rows) {
      const multi = /连续\s*(\d+)\s*次|(\d+)\s*次还款|多次还款/.exec(r.scenario);
      if (multi && !seenMulti.has(r.date)) {
        seenMulti.add(r.date);
        const want = multi[1] ? Number(multi[1]) : multi[2] ? Number(multi[2]) : 3;
        const got = flowByDate.get(r.date)?.length ?? 0;
        if (got < want) {
          ok = false;
          notes.push(`${r.date} 场景「${r.scenario}」预期 ≥${want} 笔还款，FLOW 实有 ${got} 笔（缺 ${want - got} 笔）`);
        }
      }
    }

    out.push({
      caseName,
      bizDate: dates.join('、'),
      ok,
      notes: notes.length ? notes : ['日期流转自洽：余额随还款递减、流水笔数匹配场景'],
      risk: ok ? 'low' : 'high',
    });
  }
  return out;
}

// ---------- 汇总（Mock 风格：规则算结构 + 生成叙事/待确认问题） ----------
export function runDeliveryDiff(): DeliveryDiffResult {
  const { sheetDateDiffs, dateDiffSummary } = compareDeliveries(OLD_DELIVERY, NEW_DELIVERY);
  const attributedDiffs = attributeToCases(sheetDateDiffs);
  const flowConsistencies = checkFlowConsistency(NEW_DELIVERY);

  const openQuestions: OpenQuestion[] = [];
  for (const a of attributedDiffs.filter((x) => x.field !== '整行新增').slice(0, 8)) {
    openQuestions.push({
      qid: `Q_DELIV_${a.bizDate}_${a.sheet}_${a.field}`,
      type: 'internal',
      content: `${a.caseName} 的 ${a.bizDate} ${a.sheet}.${a.field} 在新版发生变化（${a.oldVal} → ${a.newVal}），请确认是否需系统适配。`,
      fields: [a.field],
      source: '交付数据目录级比对',
      evidence: [`${a.sheet} ${a.bizDate}`, `场景：${a.scenario}`],
      riskLevel: 'medium',
      confirmTarget: '内部产品+研发',
      aiReason: '目录级比对 + 案例场景归因：规则引擎检测到字段变化',
      status: 'pending',
    });
  }
  for (const fc of flowConsistencies.filter((x) => !x.ok)) {
    openQuestions.push({
      qid: `Q_FLOW_${fc.caseName}`,
      type: 'dev',
      content: `${fc.caseName} 单版本日期流转不自洽：${fc.notes.join('；')}`,
      fields: ['FLOW', 'LOAN'],
      source: '交付数据目录级比对',
      evidence: fc.notes,
      riskLevel: 'high',
      confirmTarget: '研发',
      aiReason: '单版本自洽校验：行为描述与账务数据矛盾',
      status: 'pending',
    });
  }

  return {
    isMock: true,
    oldLabel: OLD_DELIVERY.label,
    newLabel: NEW_DELIVERY.label,
    dateDiffSummary,
    sheetDateDiffs,
    attributedDiffs,
    flowConsistencies,
    openQuestions,
  };
}
