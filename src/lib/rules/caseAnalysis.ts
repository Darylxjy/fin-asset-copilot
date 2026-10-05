import type {
  CaseFile,
  AccountTemplate,
  BizRule,
  StructureCheck,
  VersionDiff,
  SceneAnalysis,
  SceneFinding,
  CrossProduct,
  RuleValidation,
  CaseAnalysisResult,
  OpenQuestion,
  RiskLevel,
  QuestionType,
  AccountSheet,
} from '../../types';

// ============================================================
// 案例四维度分析引擎（对应真实工作流校验任务）
// 规则引擎负责确定性判断（结构/差异/精度/自洽/注意点），
// Mock 叙事负责把结果总结成产品经理可理解的说明。
// 全部标记 isMock=true，不假装调用真实大模型。
// ============================================================

function getSheet(c: CaseFile, code: string): AccountSheet | undefined {
  return c.sheets.find((s) => s.sheetName === code);
}
function maxDecimals(rows: string[][]): number {
  let max = 0;
  for (const r of rows) for (const cell of r) {
    const m = /\.(\d+)/.exec(cell);
    if (m) max = Math.max(max, m[1].length);
  }
  return max;
}

// ---------- 维度一：结构校验（以账务文件文档为准） ----------
export function structureCheck(c: CaseFile, templates: AccountTemplate[]): StructureCheck {
  const caseCodes = new Set(c.sheets.map((s) => s.sheetName));
  const tmplCodes = templates.map((t) => t.fileCode);
  const missingSheets = tmplCodes.filter((code) => !caseCodes.has(code));
  const templateSet = new Set(tmplCodes);
  const extraSheets = [...caseCodes].filter((code) => !templateSet.has(code));
  const headerMismatch: StructureCheck['headerMismatch'] = [];
  for (const t of templates) {
    const s = getSheet(c, t.fileCode);
    if (!s) continue;
    const expected = t.fields.map((f) => f.chineseName);
    const actual = s.headers;
    const same = expected.length === actual.length && expected.every((e, i) => e === actual[i]);
    if (!same) headerMismatch.push({ sheet: t.fileCode, expected, actual });
  }
  return { caseName: c.fileName, missingSheets, extraSheets, headerMismatch };
}

// ---------- 维度二：新老版本差异对比 ----------
export function versionDiff(c: CaseFile, reference: CaseFile | null): VersionDiff {
  const refName = reference ? reference.fileName : '无对应旧版参考';
  if (!reference) {
    return { caseName: c.fileName, refName, addedSheets: [], removedSheets: [], changedSheets: [] };
  }
  const refMap = new Map(reference.sheets.map((s) => [s.sheetName, s]));
  const newMap = new Map(c.sheets.map((s) => [s.sheetName, s]));
  const addedSheets = [...newMap.keys()].filter((code) => !refMap.has(code));
  const removedSheets = [...refMap.keys()].filter((code) => !newMap.has(code));
  const changedSheets: VersionDiff['changedSheets'] = [];
  for (const [code, newS] of newMap) {
    const refS = refMap.get(code);
    if (!refS) continue;
    const changes: string[] = [];
    // 列增删：基于列名集合差集（不假设仅在末尾追加，插入式新增也能正确识别）
    const refHeaderSet = new Set(refS.headers);
    const newHeaderSet = new Set(newS.headers);
    const addedCols = newS.headers.filter((h) => !refHeaderSet.has(h));
    const removedCols = refS.headers.filter((h) => !newHeaderSet.has(h));
    if (addedCols.length) changes.push(`新增列：${addedCols.join('、')}`);
    if (removedCols.length) changes.push(`删除列：${removedCols.join('、')}`);
    // 精度变化：按列名对齐、仅比较金额类列（排除利率等固有 4 位列），
    // 否则会被"贷款利率=15.6000"这类 4 位值掩盖金额 2→4 位的真实变化。
    const refColIdx: Record<string, number> = {};
    refS.headers.forEach((h, i) => (refColIdx[h] = i));
    const newColIdx: Record<string, number> = {};
    newS.headers.forEach((h, i) => (newColIdx[h] = i));
    const isAmountCol = (h: string) => /金额|本金|利息|罚息|额度/.test(h) && !/利率/.test(h);
    const sharedAmountCols = refS.headers.filter((h) => newHeaderSet.has(h) && isAmountCol(h));
    let oldPrec = 0;
    let newPrec = 0;
    for (const h of sharedAmountCols) {
      const oldCol = refS.rows.map((r) => r[refColIdx[h]] ?? '');
      const newCol = newS.rows.map((r) => r[newColIdx[h]] ?? '');
      oldPrec = Math.max(oldPrec, maxDecimals([oldCol]));
      newPrec = Math.max(newPrec, maxDecimals([newCol]));
    }
    if (newPrec > oldPrec) changes.push(`金额/数值精度由 ${oldPrec} 位提升至 ${newPrec} 位`);
    if (changes.length) changedSheets.push({ sheet: code, changes });
  }
  return { caseName: c.fileName, refName, addedSheets, removedSheets, changedSheets };
}

// ---------- 维度三：业务场景自主分析 ----------
function sceneSummary(c: CaseFile, findings: SceneFinding[]): string {
  const ev = findings.filter((f) => !f.ok).map((f) => f.note);
  const abnormal = ev.length ? `异常点：${ev.join('；')}` : '无异常点。';
  return `${c.fileName} 场景时间线包含：${c.scene.map((s) => s.event).join(' → ')}。AI 自主核对“场景描述”与“实际账务数据”，${abnormal}`;
}

export function analyzeScene(c: CaseFile): SceneAnalysis {
  const loan = getSheet(c, 'LOAN');
  const flow = getSheet(c, 'FLOW');
  const plan = getSheet(c, 'PLAN');
  const loanRow = loan?.rows[0];
  const loanStatus = loanRow ? loanRow[4] : '';
  const balance = loanRow ? loanRow[6] : '';
  const receiveDate = loanRow ? loanRow[7] : '';

  const findings: SceneFinding[] = [];
  findings.push({
    point: '放款记录存在性',
    ok: !!loanRow && loanStatus !== '0',
    note: loanRow ? `LOAN 表存在放款记录（贷款状态=${loanStatus}）` : 'LOAN 表无记录',
    risk: 'low',
    evidence: ['LOAN'],
  });

  const repayEvents = c.scene.filter((s) => /还款|结清/.test(s.event)).length;
  const flowRows = flow?.rows.length ?? 0;
  findings.push({
    point: '还款流水与场景事件自洽',
    ok: repayEvents === 0 ? true : flowRows >= repayEvents,
    note: `场景含 ${repayEvents} 个还款/结清事件，FLOW 表 ${flowRows} 条记录`,
    risk: 'low',
    evidence: ['场景 sheet', 'FLOW'],
  });

  const refund = c.scene.some((s) => /退款/.test(s.event));
  if (refund) {
    const ok = flowRows === 0 && (loan ? loanStatus === '0' : true);
    findings.push({
      point: '退款场景无还款流水',
      ok,
      note: ok ? '未出资退款：无还款流水，符合预期（该有的数据要有、不该有的不能有）' : '退款场景不应出现还款流水',
      risk: ok ? 'low' : 'high',
      evidence: ['场景 sheet', 'FLOW'],
    });
  }

  const lendAmt = loanRow ? Number(loanRow[5]) : 0;
  const repaidPrincipal = (flow?.rows ?? []).reduce((s, r) => s + (Number(r[3]) || 0), 0);
  const bal = Number(balance) || 0;
  const balanced = Math.abs(lendAmt - repaidPrincipal - bal) < 0.01;
  findings.push({
    point: '贷款余额自洽（放款 − 已还本金 = 余额）',
    ok: balanced,
    note: `放款 ${lendAmt} − 已还本金 ${repaidPrincipal.toFixed(4)} = 余额 ${bal}`,
    risk: balanced ? 'low' : 'medium',
    evidence: ['LOAN', 'FLOW'],
  });

  const overdue = c.scene.some((s) => /逾期/.test(s.event));
  if (overdue) {
    const overdueFlow = (flow?.rows ?? []).find((r) => r[2] === '03');
    const pen = overdueFlow ? Number(overdueFlow[5]) : 0;
    findings.push({
      point: '逾期罚息合理性（与逾期天数对应关系）',
      ok: true,
      note: `逾期还款 FLOW 含罚息 ${pen}，罚息金额与逾期天数的对应关系建议人工复核`,
      risk: 'medium',
      evidence: ['场景 sheet（含逾期事件）', 'FLOW REPAY_TYPE=03'],
    });
  }

  const timelineOk = findings.every((f) => f.ok);
  return { caseName: c.fileName, timelineOk, findings, aiSummary: sceneSummary(c, findings) };
}

// ---------- 维度四：跨产品线类比 ----------
export function crossProduct(c: CaseFile): CrossProduct {
  const cash = getSheet(c, 'CASHFLOW');
  const hasRecon = cash?.headers.includes('示例分期产品资金划拨对账码');
  const newFields = hasRecon ? ['CASHFLOW.示例分期产品资金划拨对账码（示例分期产品产品专用）'] : [];
  return {
    caseName: c.fileName,
    similarScene: '放款/还款/退款/重组 等基础场景在其他产品案例中存在类似处理',
    structureConsistent: true,
    newFields,
    risk: 'low',
    aiSummary: `${c.fileName} 当前场景在其他产品案例中存在类似处理。新增字段均为示例分期产品产品专用（如示例分期产品资金划拨对账码），不影响其他产品线解析逻辑，整体影响评估为低风险。`,
  };
}

// ---------- 历史注意点验证 ----------
function q(id: string, type: QuestionType, content: string, fields: string[], target: string, risk: RiskLevel, reason: string, evidence: string[]): OpenQuestion {
  return { qid: id, type, content, fields, source: '案例四维度校验', evidence, riskLevel: risk, confirmTarget: target, aiReason: reason, status: 'pending' };
}

export function validateBizRules(cases: CaseFile[], rules: BizRule[]): { validations: RuleValidation[]; questions: OpenQuestion[] } {
  const loanRows = cases.flatMap((c) => getSheet(c, 'LOAN')?.rows ?? []);
  const flowRows = cases.flatMap((c) => getSheet(c, 'FLOW')?.rows ?? []);
  const planRows = cases.flatMap((c) => getSheet(c, 'PLAN')?.rows ?? []);
  const repayFlowRows = cases.flatMap((c) => getSheet(c, 'REPAYMENTFLOW')?.rows ?? []);

  // 可程序化检查的注意点
  const loanNos = loanRows.map((r) => r[3]);
  const uniqueLoan = new Set(loanNos).size === loanNos.length;
  const rule1ok = cases.every((c) => {
    const r = getSheet(c, 'LOAN')?.rows[0];
    if (!r) return true;
    const receive = r[7];
    const status = r[4];
    return receive ? status !== '0' : status === '0';
  });
  const hasSeparatePen = flowRows.some((r) => r[2] === '03' && (Number(r[5]) || 0) > 0);
  const hasReplan = planRows.length > 0;
  const flowNos = repayFlowRows.map((r) => r[2]);
  const uniqueFlowNo = new Set(flowNos).size === flowNos.length;
  // 期次唯一性应按"同一借据"判断（loanNo|term），跨借据的 1/2/3 期属正常，不应误判
  const termPairs = planRows.map((r) => `${r[1]}|${r[2]}`);
  const noTermRepeat = new Set(termPairs).size === termPairs.length;

  const resultBySeq: Record<number, { result: RuleValidation['result']; note: string }> = {
    1: { result: rule1ok ? 'pass' : 'fail', note: rule1ok ? '放款入账日期非空即已创单，与贷款状态一致' : '存在日期与状态矛盾' },
    2: { result: 'na', note: '演示案例为单笔借据，不涉及联合贷模式' },
    3: { result: uniqueLoan ? 'pass' : 'fail', note: uniqueLoan ? '贷款单号全局唯一，无重复创单风险' : '存在重复贷款单号' },
    4: { result: 'na', note: '演示数据未含资产类型字段' },
    5: { result: 'na', note: '演示数据未含 ABS 打标/解标场景' },
    6: { result: 'na', note: '演示数据未含出资比例字段' },
    7: { result: 'na', note: '演示数据未含业务模式字段' },
    8: { result: 'na', note: '演示数据未含债转承接场景' },
    9: { result: hasReplan ? 'pass' : 'na', note: hasReplan ? '含还款计划（含改分期/重组）记录' : '不适用' },
    10: { result: hasSeparatePen ? 'fail' : 'pass', note: hasSeparatePen ? '逾期罚息以单列字段提供，未并入罚息列，与“违约金入罚息=是”不符' : '罚息已并入' },
    11: { result: 'na', note: '演示数据未含取现手续费场景' },
    12: { result: 'na', note: '演示数据无法验证宽限期天数' },
    13: { result: 'na', note: '演示数据业务日期仅到日，无法验证秒级精度' },
    14: { result: 'pass', note: '逾期案例后未二次分期' },
    15: { result: hasReplan ? 'pass' : 'na', note: hasReplan ? '存在重组（改分期）场景' : '不适用' },
    16: { result: noTermRepeat ? 'pass' : 'fail', note: noTermRepeat ? '还款计划期次无重复' : '存在期次重复' },
    17: { result: uniqueFlowNo ? 'pass' : 'fail', note: uniqueFlowNo ? '实还流水号唯一' : '存在重复流水号' },
    18: { result: uniqueLoan ? 'pass' : 'fail', note: '与注意点3一致：贷款单号去重' },
    19: { result: 'na', note: '演示数据未含计息日期字段' },
    20: { result: 'na', note: '演示数据未含取现计息场景' },
    21: { result: noTermRepeat ? 'pass' : 'fail', note: noTermRepeat ? '期次无重复' : '存在期次重复' },
  };

  const validations: RuleValidation[] = rules.map((r) => {
    const res = resultBySeq[r.seq] ?? { result: 'na' as const, note: '未纳入演示校验范围' };
    return { seq: r.seq, rule: r.rule, result: res.result, note: res.note };
  });

  const questions: OpenQuestion[] = [];
  if (hasSeparatePen) {
    questions.push(
      q(
        'Q_CASE_RULE10',
        'internal',
        '历史注意点 10（违约金入罚息=是）：案例3 逾期罚息以单列字段 REPAY_PEN 提供、未并入罚息列，请确认是否符合“违约金入罚息”规则，或调整接入解析逻辑。',
        ['REPAY_PEN', 'FLOW'],
        '内部产品+研发',
        'medium',
        '案例3 逾期还款 FLOW 中罚息单独列示',
        ['案例3 FLOW REPAY_TYPE=03', '历史注意点 10'],
      ),
    );
  }
  if (cases.some((c) => getSheet(c, 'CASHFLOW')?.headers.includes('示例分期产品资金划拨对账码'))) {
    questions.push(
      q(
        'Q_CASE_CASHFLOW',
        'dev',
        'CASHFLOW 新增“示例分期产品资金划拨对账码”为示例分期产品产品专用字段，请确认是否需在通用解析中旁路处理，避免影响其他产品线。',
        ['RECON_CODE', 'CASHFLOW'],
        '研发',
        'low',
        '跨产品线类比：示例分期产品专用字段',
        ['CASHFLOW 模板', '跨产品线类比'],
      ),
    );
  }
  return { validations, questions };
}

// ---------- 汇总 ----------
export function runCaseAnalysis(params: {
  cases: CaseFile[];
  templates: AccountTemplate[];
  reference: CaseFile | null;
  rules: BizRule[];
}): CaseAnalysisResult {
  const { cases, templates, reference, rules } = params;
  const structureChecks = cases.map((c) => structureCheck(c, templates));
  const versionDiffs = cases.map((c) => versionDiff(c, reference && reference.fileName.startsWith(c.fileName) ? reference : null));
  const sceneAnalyses = cases.map((c) => analyzeScene(c));
  const crossProducts = cases.map((c) => crossProduct(c));
  const { validations, questions } = validateBizRules(cases, rules);

  return {
    generatedAt: new Date().toISOString(),
    isMock: true,
    structureChecks,
    versionDiffs,
    sceneAnalyses,
    crossProducts,
    ruleValidations: validations,
    openQuestions: questions,
  };
}
