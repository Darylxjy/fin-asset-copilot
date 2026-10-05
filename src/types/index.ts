// ============================================================
// 金融资产接入与账务适配 Copilot —— 全局类型定义
// 数据模型严格对应产品方案 §7 / §8 / §15-§22
// ============================================================

/** 来源侧：我方 / 对接方 / 账务 / 历史 */
export type DocSide = 'internal' | 'external' | 'history';

/** 资料在分析中的用途角色（上传后可指定，用于驱动分析链路） */
export type DocRole = 'v1' | 'v2' | 'demo' | 'api' | 'dict' | 'general';

/** 资料类型 */
export type DocType =
  | 'system_dict' // 系统字段字典
  | 'accounting_spec' // 账务字段说明（V1/V2）
  | 'interface_doc' // 接口文档
  | 'csv_demo' // CSV Demo
  | 'system_rule' // 系统规则
  | 'history_case' // 历史案例
  | 'account_doc' // 账务文件文档（含 账务文件明细_ 系列 sheet）
  | 'case_file' // 案例文件（含 场景 sheet + 各账务 sheet）
  | 'reference'; // 参考示例（同类文件做对比基准）

/** v2 资料管理三类分区（账务文件文档 / 案例文件 / 参考示例） */
export type DocCategory = 'accountDoc' | 'caseFile' | 'reference' | 'internal' | 'history';

/** 解析状态 */
export type ParseStatus = 'pending' | 'parsing' | 'done' | 'error';

/** 风险等级 */
export type RiskLevel = 'low' | 'medium' | 'high';

// ---------- §7 统一字段对象 ----------
export interface UnifiedField {
  fieldName: string;
  chineseName: string;
  dataType: string; // 例：DECIMAL(12,2) / VARCHAR(32) / DATE
  length: string;
  required: 'Y' | 'N';
  description: string;
  enumValues: string[];
  exampleValue: string;
  remark: string;
  source: string; // 来源文档标识
  format?: string; // 日期/金额等格式，可选
}

// ---------- §7 接口对象（预留） ----------
export interface ApiInterface {
  interfaceName: string;
  interfaceCode: string;
  purpose: string;
  requestFields: UnifiedField[];
  responseFields: UnifiedField[];
  errorCodes: string[];
  businessRules: string[];
}

// ---------- §8 新旧版本差异类型 ----------
export type DiffType =
  | 'ADDED'
  | 'REMOVED'
  | 'FIELD_NAME_CHANGED'
  | 'CHINESE_NAME_CHANGED'
  | 'TYPE_CHANGED'
  | 'LENGTH_CHANGED'
  | 'REQUIRED_CHANGED'
  | 'DESCRIPTION_CHANGED'
  | 'ENUM_CHANGED'
  | 'REMARK_CHANGED';

// ---------- §7 字段映射状态 ----------
export type MappingStatus =
  | 'DIRECT_MAPPING'
  | 'TRANSFORM_REQUIRED'
  | 'RULE_TRANSFORM_REQUIRED'
  | 'INTERNAL_FIELD_MISSING'
  | 'EXTERNAL_INFO_INSUFFICIENT'
  | 'BUSINESS_CONFLICT'
  | 'MANUAL_REVIEW_REQUIRED';

// ---------- §8 差异结果 ----------
export interface FieldDiff {
  diffId: string;
  fieldKey: string; // 用于跨版本追踪的稳定键
  diffType: DiffType[];
  oldField?: UnifiedField; // 旧版本整行定义
  newField?: UnifiedField; // 新版本整行定义
  ruleFindings: string[]; // 规则引擎发现
  aiSummary: string; // AI 分析摘要
  evidence: string[]; // 判断依据
  riskLevel: RiskLevel;
  status: MappingStatus;
  affectedModules: SysModule[];
}

// ---------- §7 字段映射 ----------
export interface FieldMapping {
  mappingId: string;
  externalField: string;
  internalField: string; // 为空表示我方无对应字段
  mappingStatus: MappingStatus;
  confidence: number; // 0-1
  reason: string;
  aiSummary: string; // AI 分析摘要（由 Mock/真实 LLM 生成）
  riskLevel: RiskLevel;
  evidence: string[];
  affectedModules: SysModule[];
}

// ---------- §16 系统影响 ----------
export type SysModule = '创单' | '放款' | '风控' | '账务' | '贷后' | '其他';

export interface SystemImpact {
  module: SysModule;
  findings: {
    desc: string;
    fields: string[];
    evidence: string[];
    riskLevel: RiskLevel;
  }[];
}

// ---------- §17 待确认问题 ----------
export type QuestionType = 'external' | 'internal' | 'dev'; // 资产方 / 内部 / 研发
export type QuestionStatus = 'pending' | 'confirmed' | 'modified' | 'rejected';

export interface OpenQuestion {
  qid: string;
  type: QuestionType;
  content: string;
  fields: string[];
  source: string;
  evidence: string[];
  riskLevel: RiskLevel;
  confirmTarget: string;
  aiReason: string;
  status: QuestionStatus;
}

// ---------- §22 Human-in-the-loop 决策 ----------
export type HumanAction = 'accept' | 'modify' | 'reject' | 'mark_pending';

export interface HumanDecision {
  targetId: string; // diffId / mappingId / qid
  action: HumanAction;
  comment?: string;
  timestamp: string;
}

// ---------- §20 评测案例 ----------
export type CaseType =
  | 'FIELD_EXTRACTION'
  | 'DIFF_DETECTION'
  | 'FIELD_MAPPING'
  | 'BUSINESS_CONFLICT'
  | 'DEMO_VALIDATION'
  | 'QUESTION_GENERATION'
  | 'CASE_VALIDATION';

export interface EvaluationCase {
  caseId: string;
  caseType: CaseType;
  title: string;
  input: Record<string, unknown>;
  expectedResult: Record<string, unknown>;
  actualResult: Record<string, unknown>;
  pass: boolean;
  remark: string;
}

// ---------- 资料元信息 ----------
export interface DocumentMeta {
  id: string;
  name: string;
  side: DocSide;
  docType: DocType;
  version?: string;
  uploadedAt: string;
  parseStatus: ParseStatus;
  fieldCount: number;
  desensitized: boolean; // 是否脱敏
  note?: string;
  // ---- 以下为上传资料扩展字段（方案 §14 / §23） ----
  uploaded?: boolean; // 是否用户上传（区别于预置种子）
  fileName?: string; // 原始文件名
  fileSize?: number; // 字节
  role?: DocRole; // 在分析链路中的用途
  parsedFields?: UnifiedField[]; // 解析后的结构化字段（字段说明/账务文件）
  interfaces?: ApiInterface[]; // 解析后的接口对象（接口文档）
  rawText?: string; // 完整原文（CSV/JSON/TXT），用于 Demo 校验
  rawPreview?: string; // 文本预览（截断），用于展示
  parseError?: string; // 解析失败原因
  sheetNames?: string[]; // XLSX 全部工作表名（多 sheet 概览）
}

// ---------- AI 分析上下文（供 analyzeWithAI 使用） ----------
export interface AnalysisContext {
  diffs: FieldDiff[];
  mappings: FieldMapping[];
  demoIssues: DemoIssue[];
  internalFields: UnifiedField[];
  history: HistoryItem[];
}

// ---------- CSV Demo 校验问题 ----------
export interface DemoIssue {
  issueId: string;
  issueType: 'MISSING_REQUIRED' | 'UNDEFINED_ENUM' | 'COLUMN_NAME_MISMATCH' | 'FORMAT_ERROR' | 'LENGTH_EXCEED' | 'PRECISION_MISMATCH';
  detail: string;
  rowRef?: number; // CSV 行号（从数据行 1 计）
  column?: string;
  riskLevel: RiskLevel;
  evidence: string[];
}

// ---------- 历史资产接入知识 ----------
export interface HistoryItem {
  id: string;
  assetName: string; // 虚构资产方
  summary: string;
  mappings: { external: string; internal: string; note: string }[];
  confirmedQuestions: { content: string; target: string }[];
  systemChanges: string[];
}

// ---------- 项目元信息 ----------
export interface ProjectMeta {
  name: string;
  assetName: string; // 虚构资产方
  systemName: string; // 我方系统
  note: string;
}

// ============================================================
// v2 扩展：案例文件 / 账务模板 / 业务注意点
// 对应真实工作流：账务文件文档(账务文件明细_ sheet) → 案例文件(场景+账务sheet) → 校验
// ============================================================

/** 场景 sheet 一行（业务时间线） */
export interface SceneRecord {
  bizDate: string; // 业务时间，如 20260624
  event: string; // 事件描述（放款/还款/重组/逾期/退款…）
  loanNo: string; // 出资方贷款单号（首空格前数字）
  detail?: string; // 补充说明
}

/** 一个账务 sheet 的填充数据 */
export interface AccountSheet {
  sheetName: string; // LOAN / FLOW / PLAN ...
  cnName: string; // 贷款借据信息
  headers: string[]; // 字段中文名表头
  rows: string[][]; // 填充数据（@!@ 拆分，连续分隔保留空字符串）
}

/** 一个案例文件（对应交付"示例分期产品案例N.xlsx"） */
export interface CaseFile {
  fileName: string; // 示例分期产品案例1
  scene: SceneRecord[];
  sheets: AccountSheet[];
}

/** 账务文件字段模板（来自"账务文件明细_" sheet） */
export interface AccountTemplate {
  sheetKey: string; // 账务文件明细_贷款借据信息
  fileCode: string; // LOAN（文件传输说明→文件名称）
  cnName: string; // 贷款借据信息
  fields: UnifiedField[]; // 科目说明→字段
}

/** 业务注意点（对应真实 21 条历史注意点） */
export interface BizRule {
  seq: number;
  rule: string;
  category?: string; // 创单 / 重组 / 还款 / 计息 / 资产类型 等
}

// ---------- v2 四维度分析结果 ----------
export interface StructureCheck {
  caseName: string;
  missingSheets: string[]; // 账务模板有、案例无
  extraSheets: string[]; // 案例有、模板无
  headerMismatch: { sheet: string; expected: string[]; actual: string[] }[];
}

export interface VersionDiffSheet {
  sheet: string;
  changes: string[]; // 字段/数据变化描述
}

export interface VersionDiff {
  caseName: string;
  refName: string;
  addedSheets: string[];
  removedSheets: string[];
  changedSheets: VersionDiffSheet[];
}

export interface SceneFinding {
  point: string;
  ok: boolean;
  note: string;
  risk: RiskLevel;
  evidence: string[];
}

export interface SceneAnalysis {
  caseName: string;
  timelineOk: boolean;
  findings: SceneFinding[];
  aiSummary: string;
}

export interface CrossProduct {
  caseName: string;
  similarScene: string;
  structureConsistent: boolean;
  newFields: string[];
  risk: RiskLevel;
  aiSummary: string;
}

export interface RuleValidation {
  seq: number;
  rule: string;
  result: 'pass' | 'fail' | 'na';
  note: string;
}

export interface CaseAnalysisResult {
  generatedAt: string;
  isMock: boolean; // 始终为 true：模拟 AI 分析
  structureChecks: StructureCheck[];
  versionDiffs: VersionDiff[];
  sceneAnalyses: SceneAnalysis[];
  crossProducts: CrossProduct[];
  ruleValidations: RuleValidation[];
  openQuestions: OpenQuestion[];
}
