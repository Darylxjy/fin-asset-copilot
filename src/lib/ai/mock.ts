import type { FieldDiff, FieldMapping, OpenQuestion, QuestionType, RiskLevel, SysModule, SystemImpact, UnifiedField } from '../../types';
import { diffFields } from '../rules/diff';
import { buildMappings } from '../rules/mapping';
import { validateDemo } from '../rules/demoValidate';
import type { AIProvider, AIAnalyzeInput, AnalysisResult } from './provider';

// ============================================================
// Mock AI Provider（方案 §10）
// 明确标注“当前为模拟 AI 分析结果”，不假装调用真实大模型
// 结构由规则引擎真实计算，叙事由本文件生成（模拟 LLM 语义分析）
// 对未命中长期沉淀叙事的字段，给出基于规则发现的通用摘要（支持上传的任意资料）
// ============================================================

interface Enrich {
  aiSummary: string;
  evidence: string[];
  affectedModules: SysModule[];
  riskLevel?: RiskLevel;
}

// 差异分析叙事（按字段，基于脱敏示例场景）
const diffEnrich: Record<string, Enrich> = {
  loanAmt: {
    aiSummary: '金额精度由两位提升至四位，我方 loan_amount 仅支持两位小数，可能涉及数据库精度、账务解析与对账逻辑调整。',
    evidence: ['示例资产方账务说明V2 - loanAmt', '示例账务系统字段字典 - loan_amount', '系统规则 R001'],
    affectedModules: ['账务', '放款'],
    riskLevel: 'high',
  },
  custName: {
    aiSummary: '中文名称由“客户姓名”调整为“借款人姓名”，字段含义未变，仅命名口径变化，可忽略适配。',
    evidence: ['示例资产方账务说明V1 - custName', '示例资产方账务说明V2 - custName'],
    affectedModules: ['创单'],
    riskLevel: 'low',
  },
  certId: {
    aiSummary: '字段名称由 certNo 变更为 certId，业务含义一致，建议建立字段别名映射，不影响适配。',
    evidence: ['示例资产方账务说明V1 - certNo', '示例资产方账务说明V2 - certId'],
    affectedModules: ['创单'],
    riskLevel: 'low',
  },
  yearRate: {
    aiSummary: '利率以百分比形式提供（如 7.2 表示 7.2%），我方 annual_rate 以小数存储（0.0720），需在接入层做除以 100 的规则转换。',
    evidence: ['示例资产方账务说明V2 - yearRate', '示例账务系统字段字典 - annual_rate', '系统规则 R003', '历史 H003'],
    affectedModules: ['创单', '账务'],
    riskLevel: 'medium',
  },
  loanStatus: {
    aiSummary: '枚举新增 PROCESSING（处理中）态，我方状态机仅含 INIT/SUCCESS/FAIL，存在业务冲突，贷后与账务流转需评估是否新增中间态。',
    evidence: ['示例资产方账务说明V2 - loanStatus', '示例账务系统字段字典 - loan_status', '系统规则 R002', '历史 H002'],
    affectedModules: ['贷后', '账务', '风控'],
    riskLevel: 'high',
  },
  applyTime: {
    aiSummary: '申请时间格式由 YYYY-MM-DD HH:mm:ss 变更为 YYYYMMDDHHmmss（去分隔符），我方解析器需兼容新格式。',
    evidence: ['示例资产方账务说明V1 - applyTime', '示例资产方账务说明V2 - applyTime', '系统规则 R004'],
    affectedModules: ['创单', '放款'],
    riskLevel: 'medium',
  },
  srcChannel: {
    aiSummary: '渠道由必填改为非必填，我方创单规则仍要求必填，需与资产方确认是否放宽或保留校验。',
    evidence: ['示例资产方账务说明V1 - srcChannel', '示例资产方账务说明V2 - srcChannel', '系统规则 R005'],
    affectedModules: ['创单'],
    riskLevel: 'medium',
  },
  remarkInfo: {
    aiSummary: '备注由非必填改为必填，我方 remark 为非必填，需确认是否同步调整创单与账务落库约束。',
    evidence: ['示例资产方账务说明V1 - remarkInfo', '示例资产方账务说明V2 - remarkInfo', '系统规则 R005'],
    affectedModules: ['创单', '账务'],
    riskLevel: 'medium',
  },
  oldChannelCode: {
    aiSummary: '旧渠道编码字段被删除，我方若曾依赖该字段需评估历史数据兼容与清理。',
    evidence: ['示例资产方账务说明V1 - oldChannelCode'],
    affectedModules: ['创单', '账务'],
    riskLevel: 'medium',
  },
  repaymentChannel: {
    aiSummary: 'V2 新增还款渠道字段，我方示例账务系统 无对应字段，需评估是否新增系统字段以支持还款渠道统计。',
    evidence: ['示例资产方账务说明V2 - repaymentChannel', '示例账务系统字段字典'],
    affectedModules: ['账务', '其他'],
    riskLevel: 'high',
  },
};

const mappingEnrich: Record<string, Enrich> = {
  loanAmt: {
    aiSummary: '金额精度不一致，需在接入网关做精度转换，并评估对账差额处理。',
    evidence: ['示例资产方账务说明V2 - loanAmt', '示例账务系统字段字典 - loan_amount', '系统规则 R001'],
    affectedModules: ['账务', '放款'],
    riskLevel: 'high',
  },
  yearRate: {
    aiSummary: '百分比与小数表示差异，需规则转换（除以 100），建议在接入网关统一处理。',
    evidence: ['示例资产方账务说明V2 - yearRate', '示例账务系统字段字典 - annual_rate', '系统规则 R003'],
    affectedModules: ['创单', '账务'],
    riskLevel: 'medium',
  },
  loanStatus: {
    aiSummary: '枚举存在差异且涉及状态机冲突，需规则映射并评估新增中间态。',
    evidence: ['示例资产方账务说明V2 - loanStatus', '示例账务系统字段字典 - loan_status', '系统规则 R002'],
    affectedModules: ['贷后', '账务', '风控'],
    riskLevel: 'high',
  },
  repaymentChannel: {
    aiSummary: '我方无对应字段，映射缺失，需人工确认是否新增字段。',
    evidence: ['示例资产方账务说明V2 - repaymentChannel', '示例账务系统字段字典'],
    affectedModules: ['账务', '其他'],
    riskLevel: 'high',
  },
};

// 业务冲突类待确认问题（沉淀自脱敏示例场景）
const conflictQuestions: OpenQuestion[] = [
  q('Q_CONFLICT_AMT', 'internal', '对方 loanAmt 支持四位小数，我方 loan_amount 仅支持两位，是否同步调整账务解析及金额计算精度？', ['loanAmt', 'loan_amount'], '内部产品+研发', 'high', '金额精度差异影响账务与对账', ['示例资产方账务说明V2 - loanAmt', '示例账务系统字段字典 - loan_amount', '系统规则 R001']),
  q('Q_CONFLICT_STATUS', 'internal', '对方 loanStatus 新增 PROCESSING 处理中态，我方状态机无对应态，是否新增中间态并明确计息与风控规则？', ['loanStatus', 'loan_status'], '内部产品+研发', 'high', '状态机冲突，影响贷后与账务流转', ['示例资产方账务说明V2 - loanStatus', '示例账务系统字段字典 - loan_status', '系统规则 R002', '历史 H002']),
  q('Q_CONFLICT_CHANNEL', 'dev', '对方新增 repaymentChannel，我方无对应字段，是否新增系统字段以支持还款渠道统计？', ['repaymentChannel'], '研发', 'medium', '我方字段缺失', ['示例资产方账务说明V2 - repaymentChannel', '示例账务系统字段字典']),
  q('Q_CONFLICT_RATE', 'internal', 'yearRate 文档以百分比给出（如 7.2），我方 annual_rate 以小数存储（0.0720），是否在接入层统一除以 100？', ['yearRate', 'annual_rate'], '内部产品+研发', 'medium', '单位表示差异需规则转换', ['示例资产方账务说明V2 - yearRate', '示例账务系统字段字典 - annual_rate', '系统规则 R003', '历史 H003']),
  q('Q_DEMO_RATE', 'external', 'Demo 中 yearRate 存在 0.0720（小数）与文档百分比 7.2 矛盾，请确认利率提供形式。', ['yearRate'], '资产方', 'medium', '文档与 Demo 字段含义矛盾', ['示例资产方账务说明V2 - yearRate', 'demo_v2.csv']),
  q('Q_DEMO_FINISH', 'external', 'loanStatus=PROCESSING（处理中）的记录已存在 finishTime，请确认处理中状态是否允许存在完成时间。', ['loanStatus'], '资产方', 'medium', '状态定义与数据矛盾', ['示例资产方账务说明V2 - loanStatus', 'demo_v2.csv 第 2 行']),
];

const systemImpacts: SystemImpact[] = [
  { module: '账务', findings: [
    { desc: '放款金额精度由 2 位调整为 4 位，影响账务解析与对账差额处理', fields: ['loanAmt', 'loan_amount'], riskLevel: 'high', evidence: ['示例资产方账务说明V2 - loanAmt', '系统规则 R001'] },
    { desc: '新增 repaymentChannel，我方无对应字段，影响还款渠道账务统计', fields: ['repaymentChannel'], riskLevel: 'medium', evidence: ['示例资产方账务说明V2 - repaymentChannel'] },
    { desc: '备注由非必填改为必填，影响账务落库约束', fields: ['remarkInfo', 'remark'], riskLevel: 'medium', evidence: ['示例资产方账务说明V2 - remarkInfo'] },
  ] },
  { module: '创单', findings: [
    { desc: '渠道由必填改为非必填，需确认创单校验是否放宽', fields: ['srcChannel', 'channel'], riskLevel: 'medium', evidence: ['示例资产方账务说明V2 - srcChannel', '系统规则 R005'] },
    { desc: '利率百分比转小数，需接入层规则转换', fields: ['yearRate', 'annual_rate'], riskLevel: 'medium', evidence: ['示例资产方账务说明V2 - yearRate', '系统规则 R003'] },
    { desc: '借据状态枚举新增 PROCESSING，创单需支持新态', fields: ['loanStatus', 'loan_status'], riskLevel: 'high', evidence: ['示例资产方账务说明V2 - loanStatus', '系统规则 R002'] },
  ] },
  { module: '放款', findings: [
    { desc: '申请时间格式去分隔符 YYYYMMDDHHmmss，放款解析需兼容', fields: ['applyTime', 'apply_time'], riskLevel: 'medium', evidence: ['示例资产方账务说明V2 - applyTime', '系统规则 R004'] },
    { desc: '放款金额四位精度影响金额落库', fields: ['loanAmt', 'loan_amount'], riskLevel: 'high', evidence: ['示例资产方账务说明V2 - loanAmt'] },
  ] },
  { module: '贷后', findings: [
    { desc: '借据状态新增 PROCESSING 处理中态，贷后流转需支持中间态', fields: ['loanStatus', 'loan_status'], riskLevel: 'high', evidence: ['示例资产方账务说明V2 - loanStatus', '历史 H002'] },
  ] },
  { module: '风控', findings: [
    { desc: '处理中态影响风控策略分支，需补充中间态处理', fields: ['loanStatus'], riskLevel: 'medium', evidence: ['示例资产方账务说明V2 - loanStatus'] },
  ] },
  { module: '其他', findings: [
    { desc: '还款渠道统计需新增字段或旁路处理', fields: ['repaymentChannel'], riskLevel: 'low', evidence: ['示例资产方账务说明V2 - repaymentChannel'] },
  ] },
];

// ---------- 通用兜底（支持上传的任意资料） ----------
function inferModules(fieldName: string): SysModule[] {
  const n = (fieldName || '').toLowerCase();
  const m: SysModule[] = [];
  if (/amt|amount|fee|interest|balance|money|金额|费|息|余额|还款/.test(n)) m.push('账务', '放款');
  if (/status|state|状态/.test(n)) m.push('贷后', '账务', '风控');
  if (/time|date|申请|放款|apply/.test(n)) m.push('创单', '放款');
  if (/channel|渠道|src/.test(n)) m.push('创单');
  if (/name|cert|客户|借款人|证件/.test(n)) m.push('创单');
  if (/rate|利率|year/.test(n)) m.push('创单', '账务');
  if (m.length === 0) m.push('其他');
  return Array.from(new Set(m));
}

function genericDiffSummary(d: FieldDiff): string {
  const cn = d.newField?.chineseName || d.oldField?.chineseName || '';
  if (d.diffType.includes('ADDED')) return `新增字段 ${d.fieldKey}${cn ? `（${cn}）` : ''}。规则引擎识别为新增，建议确认是否需在我方系统新增对应字段或建立映射。`;
  if (d.diffType.includes('REMOVED')) return `字段 ${d.fieldKey}${cn ? `（${cn}）` : ''} 在新版中被删除。建议评估我方历史依赖与历史数据兼容。`;
  const findings = d.ruleFindings.join('；');
  return `规则引擎检测到 ${d.diffType.join('/')} 变化：${findings}。建议人工确认该变化对 ${inferModules(d.fieldKey).join('、')} 等模块的影响。`;
}

function genericMappingSummary(m: FieldMapping): string {
  switch (m.mappingStatus) {
    case 'DIRECT_MAPPING':
      return `字段 ${m.externalField} 可直接映射至 ${m.internalField || '（待定）'}。`;
    case 'TRANSFORM_REQUIRED':
    case 'RULE_TRANSFORM_REQUIRED':
      return `字段 ${m.externalField} 需转换后映射至 ${m.internalField || '（待定）'}，建议在接入网关统一处理。`;
    case 'INTERNAL_FIELD_MISSING':
      return `我方无 ${m.externalField} 对应字段，映射缺失，需人工确认是否新增系统字段。`;
    case 'BUSINESS_CONFLICT':
      return `字段 ${m.externalField} 存在业务冲突，需内部业务与研发确认。`;
    default:
      return `字段 ${m.externalField} 适配状态为 ${m.mappingStatus}，建议人工确认。`;
  }
}

function buildGenericQuestions(diffs: FieldDiff[], mappings: FieldMapping[], newFields: UnifiedField[]): OpenQuestion[] {
  const out: OpenQuestion[] = [];
  const newSet = new Set(newFields.map((f) => f.fieldName));
  diffs.forEach((d) => {
    if (d.riskLevel !== 'high' && !d.diffType.includes('TYPE_CHANGED') && !d.diffType.includes('ENUM_CHANGED')) return;
    if (!newSet.has(d.fieldKey)) return;
    const cn = d.newField?.chineseName || d.oldField?.chineseName || '';
    out.push(
      q(
        `Q_GEN_D_${d.fieldKey}`,
        'internal',
        `字段 ${d.fieldKey}${cn ? `（${cn}）` : ''} 发生 ${d.diffType.join('/')} 变化（${d.ruleFindings.join('；')}），请确认是否需系统适配及影响范围。`,
        [d.fieldKey],
        '内部产品+研发',
        d.riskLevel,
        '上传资料自动分析：规则引擎检测到高风险字段变化',
        ['（上传资料自动分析）'],
      ),
    );
  });
  mappings.forEach((m) => {
    if (m.mappingStatus !== 'INTERNAL_FIELD_MISSING' && m.mappingStatus !== 'BUSINESS_CONFLICT') return;
    out.push(
      q(
        `Q_GEN_M_${m.externalField}`,
        m.mappingStatus === 'INTERNAL_FIELD_MISSING' ? 'dev' : 'internal',
        genericMappingSummary(m),
        [m.externalField],
        m.mappingStatus === 'INTERNAL_FIELD_MISSING' ? '研发' : '内部产品+研发',
        m.riskLevel,
        '上传资料自动分析：字段映射状态为 ' + m.mappingStatus,
        ['（上传资料自动分析）'],
      ),
    );
  });
  return out;
}

function buildGenericSystemImpacts(diffs: FieldDiff[], mappings: FieldMapping[]): SystemImpact[] {
  const byModule = new Map<SysModule, SystemImpact['findings']>();
  const add = (mod: SysModule, f: SystemImpact['findings'][number]) => {
    const arr = byModule.get(mod) ?? [];
    arr.push(f);
    byModule.set(mod, arr);
  };
  diffs.forEach((d) => {
    if (d.diffType.length === 0 || d.diffType.every((t) => t === 'REMARK_CHANGED')) return;
    inferModules(d.fieldKey).forEach((mod) =>
      add(mod, {
        desc: `${d.fieldKey}：${d.ruleFindings.join('；') || d.diffType.join('/')}`,
        fields: [d.fieldKey],
        riskLevel: d.riskLevel,
        evidence: ['（上传资料自动分析）'],
      }),
    );
  });
  mappings.forEach((m) => {
    if (m.mappingStatus === 'DIRECT_MAPPING') return;
    inferModules(m.externalField).forEach((mod) =>
      add(mod, {
        desc: `${m.externalField}：${genericMappingSummary(m)}`,
        fields: [m.externalField],
        riskLevel: m.riskLevel,
        evidence: ['（上传资料自动分析）'],
      }),
    );
  });
  return Array.from(byModule.entries()).map(([module, findings]) => ({ module, findings }));
}

function q(id: string, type: QuestionType, content: string, fields: (string | undefined)[], target: string, risk: RiskLevel, reason: string, evidence: string[]): OpenQuestion {
  return { qid: id, type, content, fields: (fields ?? []).filter((f): f is string => Boolean(f)), source: 'CSV Demo 校验', evidence, riskLevel: risk, confirmTarget: target, aiReason: reason, status: 'pending' };
}

function applyEnrich<T extends FieldDiff | FieldMapping>(items: T[], table: Record<string, Enrich>, keyOf: (i: T) => string): T[] {
  return items.map((it) => {
    const e = table[keyOf(it)];
    if (!e) return it;
    return {
      ...it,
      aiSummary: (it as FieldDiff).aiSummary || e.aiSummary,
      evidence: e.evidence,
      affectedModules: e.affectedModules,
      riskLevel: e.riskLevel ?? (it as FieldDiff).riskLevel,
    } as T;
  });
}

export class MockAIProvider implements AIProvider {
  id = 'mock';
  label = '模拟 AI 分析（Mock）';
  isMock = true;

  async analyze(input: AIAnalyzeInput): Promise<AnalysisResult> {
    const rawDiffs = diffFields({ oldFields: input.oldFields, newFields: input.newFields, renameMap: input.renameMap });
    const rawMappings = buildMappings(input.newFields, input.internalFields);
    const { issues } = validateDemo(input.demoRaw, input.newFields);

    // 叙事：先套用沉淀叙事，未命中则给出通用摘要（支持任意上传资料）
    const diffs: FieldDiff[] = applyEnrich(rawDiffs, diffEnrich, (d) => d.fieldKey).map((d) =>
      d.aiSummary ? d : { ...d, aiSummary: genericDiffSummary(d), affectedModules: d.affectedModules.length ? d.affectedModules : inferModules(d.fieldKey) },
    );
    const mappings: FieldMapping[] = applyEnrich(rawMappings, mappingEnrich, (m) => m.externalField).map((m) =>
      m.aiSummary ? m : { ...m, aiSummary: genericMappingSummary(m), affectedModules: m.affectedModules.length ? m.affectedModules : inferModules(m.externalField) },
    );

    const demoQuestions = issues.map(demoIssueToQuestion).filter((x): x is OpenQuestion => x !== null);

    // 是否为沉淀示例场景：仅当上传数据包含对应字段时才展示沉淀叙事
    const newNames = new Set(input.newFields.map((f) => f.fieldName));
    const seedScenario = newNames.has('loanAmt') && newNames.has('loanStatus');
    const seedQuestions = seedScenario ? conflictQuestions.filter((qq) => qq.fields.some((f) => newNames.has(f))) : [];
    const genericQuestions = seedScenario ? [] : buildGenericQuestions(diffs, mappings, input.newFields);

    const questions = [...seedQuestions, ...genericQuestions, ...demoQuestions];

    const impacts = seedScenario
      ? systemImpacts
      : buildGenericSystemImpacts(diffs, mappings);

    return {
      diffs,
      mappings,
      demoIssues: issues,
      questions,
      systemImpacts: impacts,
      analyzedAt: new Date().toISOString(),
      mock: true,
      providerId: this.id,
    };
  }
}

export const mockProvider = new MockAIProvider();

// 由 Demo 校验问题生成的待确认问题
function demoIssueToQuestion(issue: import('../../types').DemoIssue): OpenQuestion | null {
  const id = issue.issueId;
  switch (issue.issueType) {
    case 'MISSING_REQUIRED':
      return q(`Q_${id}`, 'external', `Demo 缺少必填字段 ${issue.column ?? ''}，请确认该字段是否必须提供。`, [issue.column], '资产方', issue.riskLevel, 'Demo 缺少文档定义的必填字段', issue.evidence);
    case 'COLUMN_NAME_MISMATCH':
      return q(`Q_${id}`, 'external', `Demo 列名 "${issue.column ?? ''}" 与文档字段不一致，请确认以哪个命名为准。`, [issue.column], '资产方', 'low', 'Demo 列名与文档定义不一致', issue.evidence);
    case 'UNDEFINED_ENUM':
      return q(`Q_${id}`, 'external', `${issue.detail}，请确认该枚举值的业务含义。`, [issue.column ?? ''], '资产方', 'high', 'Demo 出现文档未定义枚举', issue.evidence);
    case 'FORMAT_ERROR':
      return q(`Q_${id}`, 'dev', `${issue.detail}，请确认解析兼容方案。`, [issue.column ?? ''], '内部产品+研发', 'medium', 'Demo 日期格式不符合文档定义', issue.evidence);
    default:
      return null;
  }
}
