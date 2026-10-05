import type { HistoryItem, UnifiedField } from '../../types';
import { systemRules } from '../../data/systemRules';
import { historyItems } from '../../data/history';

// ============================================================
// RAG（Mock）：内部业务知识检索（方案 §9/§11）
// 真实场景接入向量库；此处用关键词检索演示“知识来源”能力
// ============================================================

export interface RagChunk {
  source: string;
  text: string;
}

export function retrieveContext(query: string, internalFields: UnifiedField[]): RagChunk[] {
  const q = query.toLowerCase();
  const chunks: RagChunk[] = [];

  for (const r of systemRules) {
    if (match(q, [r.title, r.rule, r.scope])) {
      chunks.push({ source: `系统规则 ${r.id} - ${r.title}`, text: r.rule });
    }
  }
  for (const f of internalFields) {
    if (match(q, [f.fieldName, f.chineseName, f.description])) {
      chunks.push({ source: `示例账务系统字段字典 - ${f.fieldName}`, text: `${f.chineseName}（${f.dataType}${f.length}，必填=${f.required}）：${f.description}` });
    }
  }
  for (const h of historyItems as HistoryItem[]) {
    if (match(q, [h.assetName, h.summary, ...h.systemChanges, ...h.confirmedQuestions.map((c) => c.content)])) {
      chunks.push({ source: `历史接入 ${h.id} - ${h.assetName}`, text: h.summary });
    }
  }
  return chunks.slice(0, 6);
}

function match(q: string, texts: string[]): boolean {
  return texts.some((t) => t.toLowerCase().includes(q) || q.includes(t.toLowerCase().slice(0, 4)));
}
