import type { CaseType, EvaluationCase } from '../../types';

// ============================================================
// Golden Test Cases（方案 §20）—— 仅定义输入与期望，由 metrics 真实执行
// 覆盖：正常 / 边界 / 数据缺失 / 格式错误 / 语义冲突 / 知识不足 / AI 无法确定
// ============================================================

export const goldenCases: EvaluationCase[] = [
  // ---------- FIELD_EXTRACTION ----------
  { caseId: 'EX01', caseType: 'FIELD_EXTRACTION', title: '解析 CSV Demo 表头字段数', input: { kind: 'csv', expectedCount: 19 }, expectedResult: { count: 19 }, actualResult: {}, pass: false, remark: '正常情况' },
  { caseId: 'EX02', caseType: 'FIELD_EXTRACTION', title: '解析 V2 账务说明字段数', input: { kind: 'spec', expectedCount: 19 }, expectedResult: { count: 19 }, actualResult: {}, pass: false, remark: '正常情况' },
  { caseId: 'EX03', caseType: 'FIELD_EXTRACTION', title: '解析粘贴 JSON 字段数', input: { kind: 'json', text: '[{"fieldName":"a"},{"fieldName":"b"},{"fieldName":"c"}]', expectedCount: 3 }, expectedResult: { count: 3 }, actualResult: {}, pass: false, remark: '边界情况' },

  // ---------- DIFF_DETECTION ----------
  { caseId: 'DF01', caseType: 'DIFF_DETECTION', title: 'V1→V2 差异行总数', input: { metric: 'total', expected: 10 }, expectedResult: { count: 10 }, actualResult: {}, pass: false, remark: '召回优先：漏掉重要差异风险高于多报' },
  { caseId: 'DF02', caseType: 'DIFF_DETECTION', title: '识别新增字段', input: { metric: 'ADDED', expected: 1 }, expectedResult: { count: 1 }, actualResult: {}, pass: false, remark: '正常情况' },
  { caseId: 'DF03', caseType: 'DIFF_DETECTION', title: '识别删除字段', input: { metric: 'REMOVED', expected: 1 }, expectedResult: { count: 1 }, actualResult: {}, pass: false, remark: '正常情况' },
  { caseId: 'DF04', caseType: 'DIFF_DETECTION', title: '识别精度/长度变化', input: { metric: 'LENGTH_CHANGED', expected: 1 }, expectedResult: { count: 1 }, actualResult: {}, pass: false, remark: '金额精度 2→4' },
  { caseId: 'DF05', caseType: 'DIFF_DETECTION', title: '识别枚举新增', input: { metric: 'ENUM_CHANGED', expected: 1 }, expectedResult: { count: 1 }, actualResult: {}, pass: false, remark: 'PROCESSING 新增' },
  { caseId: 'DF06', caseType: 'DIFF_DETECTION', title: '识别必填规则变化', input: { metric: 'REQUIRED_CHANGED', expected: 2 }, expectedResult: { count: 2 }, actualResult: {}, pass: false, remark: 'srcChannel/remarkInfo' },

  // ---------- FIELD_MAPPING ----------
  { caseId: 'MP01', caseType: 'FIELD_MAPPING', title: 'loanAmt 精度不同需转换', input: { field: 'loanAmt', expectedStatus: 'TRANSFORM_REQUIRED' }, expectedResult: { mappingStatus: 'TRANSFORM_REQUIRED' }, actualResult: {}, pass: false, remark: '我方类型不同' },
  { caseId: 'MP02', caseType: 'FIELD_MAPPING', title: 'repaymentChannel 我方缺失', input: { field: 'repaymentChannel', expectedStatus: 'INTERNAL_FIELD_MISSING' }, expectedResult: { mappingStatus: 'INTERNAL_FIELD_MISSING' }, actualResult: {}, pass: false, remark: '我方不存在对应字段' },
  { caseId: 'MP03', caseType: 'FIELD_MAPPING', title: 'certId 名称不同含义相同', input: { field: 'certId', expectedStatus: 'DIRECT_MAPPING' }, expectedResult: { mappingStatus: 'DIRECT_MAPPING' }, actualResult: {}, pass: false, remark: '字段名称不同但含义相同' },
  { caseId: 'MP04', caseType: 'FIELD_MAPPING', title: 'loanStatus 枚举差异需规则转换', input: { field: 'loanStatus', expectedStatus: 'RULE_TRANSFORM_REQUIRED' }, expectedResult: { mappingStatus: 'RULE_TRANSFORM_REQUIRED' }, actualResult: {}, pass: false, remark: '语义冲突/规则转换' },
  { caseId: 'MP05', caseType: 'FIELD_MAPPING', title: 'phone 映射到 mobile', input: { field: 'phone', expectedStatus: 'DIRECT_MAPPING' }, expectedResult: { mappingStatus: 'DIRECT_MAPPING' }, actualResult: {}, pass: false, remark: '名称不同含义相同' },

  // ---------- BUSINESS_CONFLICT ----------
  { caseId: 'BC01', caseType: 'BUSINESS_CONFLICT', title: '状态机冲突生成待确认问题', input: { questionId: 'Q_CONFLICT_STATUS' }, expectedResult: { exists: true }, actualResult: {}, pass: false, remark: '知识不足/语义冲突' },
  { caseId: 'BC02', caseType: 'BUSINESS_CONFLICT', title: '金额精度冲突生成待确认问题', input: { questionId: 'Q_CONFLICT_AMT' }, expectedResult: { exists: true }, actualResult: {}, pass: false, remark: 'AI 无法确定，需内部确认' },
  { caseId: 'BC03', caseType: 'BUSINESS_CONFLICT', title: '字段缺失生成待确认问题', input: { questionId: 'Q_CONFLICT_CHANNEL' }, expectedResult: { exists: true }, actualResult: {}, pass: false, remark: '我方能力缺失' },

  // ---------- DEMO_VALIDATION ----------
  { caseId: 'DV01', caseType: 'DEMO_VALIDATION', title: 'Demo 必填字段缺失', input: { issueType: 'MISSING_REQUIRED', expected: 1 }, expectedResult: { count: 1 }, actualResult: {}, pass: false, remark: '数据缺失' },
  { caseId: 'DV02', caseType: 'DEMO_VALIDATION', title: 'Demo 未定义枚举', input: { issueType: 'UNDEFINED_ENUM', expected: 1 }, expectedResult: { count: 1 }, actualResult: {}, pass: false, remark: '格式错误/越界' },
  { caseId: 'DV03', caseType: 'DEMO_VALIDATION', title: 'Demo 校验问题总数', input: { expected: 4 }, expectedResult: { count: 4 }, actualResult: {}, pass: false, remark: '边界情况' },

  // ---------- QUESTION_GENERATION ----------
  { caseId: 'QG01', caseType: 'QUESTION_GENERATION', title: '生成待确认问题数量', input: { expectedMin: 8 }, expectedResult: { min: 8 }, actualResult: {}, pass: false, remark: '正常情况' },
  { caseId: 'QG02', caseType: 'QUESTION_GENERATION', title: '生成处理中态完成时间冲突问题', input: { questionId: 'Q_DEMO_FINISH' }, expectedResult: { exists: true }, actualResult: {}, pass: false, remark: '文档与 Demo 矛盾' },

  // ---------- CASE_VALIDATION（案例四维度校验，对应真实工作流） ----------
  { caseId: 'CV01', caseType: 'CASE_VALIDATION', title: '案例结构校验一致（案例1 vs 账务文件文档）', input: { caseName: '示例分期产品案例1', check: 'structure' }, expectedResult: { consistent: true }, actualResult: {}, pass: false, remark: '以账务文件文档为准' },
  { caseId: 'CV02', caseType: 'CASE_VALIDATION', title: '案例1 vs 旧版参考新增 Sheet 数量', input: { caseName: '示例分期产品案例1', check: 'addedSheets' }, expectedResult: { count: 8 }, actualResult: {}, pass: false, remark: 'CUS/CUSCREDIT/QUOTAADJUST/FEEADJUST/CUSCHANGE/COMFLOW/REPAYMENTFLOW/CASHFLOW' },
  { caseId: 'CV03', caseType: 'CASE_VALIDATION', title: '案例1 金额精度 2→4 位变化被识别', input: { caseName: '示例分期产品案例1', check: 'precision' }, expectedResult: { changedSheets: ['LOAN', 'PLAN', 'FLOW', 'QUOTAFEE'] }, actualResult: {}, pass: false, remark: '边界/格式变化' },
  { caseId: 'CV04', caseType: 'CASE_VALIDATION', title: '案例4 未出资退款无还款流水（场景自洽）', input: { caseName: '示例分期产品案例4', check: 'refundNoFlow' }, expectedResult: { ok: true }, actualResult: {}, pass: false, remark: '不该有的数据不能有' },
  { caseId: 'CV05', caseType: 'CASE_VALIDATION', title: '案例1 业务场景时间线自洽', input: { caseName: '示例分期产品案例1', check: 'timeline' }, expectedResult: { timelineOk: true }, actualResult: {}, pass: false, remark: '放款/还款/结清自洽' },
  { caseId: 'CV06', caseType: 'CASE_VALIDATION', title: '历史注意点10（违约金入罚息）验证结果', input: { seq: 10, check: 'rule' }, expectedResult: { result: 'fail' }, actualResult: {}, pass: false, remark: '逾期罚息单列，未并入罚息列' },
  { caseId: 'CV07', caseType: 'CASE_VALIDATION', title: '跨产品线类比：示例分期产品专用字段影响评估为低风险', input: { caseName: '示例分期产品案例1', check: 'crossRisk' }, expectedResult: { risk: 'low' }, actualResult: {}, pass: false, remark: '不影响其他产品线' },
  { caseId: 'CV08', caseType: 'CASE_VALIDATION', title: '案例5 还款中状态余额 > 0（非终态场景）', input: { caseName: '示例分期产品案例5', check: 'inProgressBalance' }, expectedResult: { balanceGt0: true }, actualResult: {}, pass: false, remark: '展示余额未结清的还款中状态' },
  { caseId: 'CV09', caseType: 'CASE_VALIDATION', title: '案例6 重组改分期无罚息且时间线自洽', input: { caseName: '示例分期产品案例6', check: 'replanNoPenalty' }, expectedResult: { timelineOk: true, noPenalty: true }, actualResult: {}, pass: false, remark: '区别于案例3 的重组+逾期罚息' },
];
