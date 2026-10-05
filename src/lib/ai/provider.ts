import type { DemoIssue, FieldDiff, FieldMapping, HistoryItem, OpenQuestion, SystemImpact, UnifiedField } from '../../types';

// ============================================================
// AI 分析 Provider 接口（方案 §10）
// 预留真实模型接入（通义千问 / OpenAI / Claude 等）
// 不在此处硬编码任何 API Key
// ============================================================

export interface AIAnalyzeInput {
  oldFields: UnifiedField[];
  newFields: UnifiedField[];
  renameMap?: Record<string, string>;
  internalFields: UnifiedField[];
  demoRaw: string;
  history: HistoryItem[];
}

export interface AnalysisResult {
  diffs: FieldDiff[];
  mappings: FieldMapping[];
  demoIssues: DemoIssue[];
  questions: OpenQuestion[];
  systemImpacts: SystemImpact[];
  analyzedAt: string;
  mock: boolean;
  providerId: string;
}

export interface AIProvider {
  id: string;
  label: string;
  isMock: boolean;
  analyze(input: AIAnalyzeInput): Promise<AnalysisResult>;
}
