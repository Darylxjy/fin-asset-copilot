import { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { Card, SectionTitle, RiskBadge, QTypeBadge, QStatusBadge, cn } from '../common/ui';
import type { OpenQuestion, QuestionStatus, QuestionType } from '../../types';

const TABS: { key: QuestionType | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'external', label: '资产方' },
  { key: 'internal', label: '内部产品/业务' },
  { key: 'dev', label: '研发' },
];

export default function Questions() {
  const analysis = useProjectStore((s) => s.analysis);
  const caseAnalysis = useProjectStore((s) => s.caseAnalysis);
  const setStatus = useProjectStore((s) => s.setQuestionStatus);
  const setCaseStatus = useProjectStore((s) => s.setCaseQuestionStatus);
  const record = useProjectStore((s) => s.recordDecision);
  const caseStatus = useProjectStore((s) => s.caseQuestionStatus);
  const [tab, setTab] = useState<QuestionType | 'all'>('all');

  const docQuestions = (analysis?.questions ?? []).map((q) => ({ ...q, _case: false as const }));
  const caseQuestions = (caseAnalysis?.openQuestions ?? []).map((q) => ({ ...q, _case: true as const, status: caseStatus[q.qid] ?? 'pending' }));
  const questions: (OpenQuestion & { _case: boolean })[] = [...docQuestions, ...caseQuestions];
  const filtered = tab === 'all' ? questions : questions.filter((q) => q.type === tab);

  const apply = (q: OpenQuestion & { _case: boolean }, status: QuestionStatus, action: 'accept' | 'modify' | 'reject' | 'mark_pending') => {
    if (q._case) setCaseStatus(q.qid, status);
    else setStatus(q.qid, status);
    record(q.qid, action);
  };

  return (
    <div className="space-y-5">
      <SectionTitle title="待确认问题" desc="AI 生成、需人工确认的问题；关键判断始终保留人工确认权" />
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} className={cn('px-3 py-1 rounded-full border text-12', tab === t.key ? 'border-ai text-ai bg-ai/10' : 'border-line text-sub')}>{t.label}</button>
        ))}
        <span className="ml-auto text-12 text-sub self-center">共 {filtered.length} 条</span>
      </div>
      <div className="space-y-3">
        {filtered.length === 0 && <div className="text-13 text-sub text-center py-10 border border-dashed border-line rounded-lg bg-canvas">暂无问题</div>}
        {filtered.map((q) => (
          <Card key={q.qid} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <QTypeBadge type={q.type} />
                  <QStatusBadge status={q.status} />
                  <RiskBadge risk={q.riskLevel} />
                  <span className="text-11 text-idle">确认对象：{q.confirmTarget}</span>
                </div>
                <div className="text-13 text-ink">{q.content}</div>
                <div className="mt-2 grid md:grid-cols-2 gap-x-4 gap-y-1 text-12">
                  <div className="text-sub">涉及字段：<span className="font-mono text-ink">{q.fields.join(', ') || '—'}</span></div>
                  <div className="text-sub">来源：<span className="text-ink">{q.source}</span></div>
                </div>
                <div className="mt-1 text-12 text-sub">AI 生成原因：{q.aiReason}</div>
                <div className="mt-1 text-11 text-idle">判断依据：{q.evidence.join(' · ')}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button onClick={() => apply(q, 'confirmed', 'accept')} className="px-2.5 py-1 rounded border border-ok/40 text-ok text-12 font-medium hover:bg-ok/10">接受</button>
              <button onClick={() => apply(q, 'modified', 'modify')} className="px-2.5 py-1 rounded border border-ai/40 text-ai text-12 font-medium hover:bg-ai/10">修改</button>
              <button onClick={() => apply(q, 'rejected', 'reject')} className="px-2.5 py-1 rounded border border-danger/40 text-danger text-12 font-medium hover:bg-danger/10">驳回</button>
              <button onClick={() => apply(q, 'pending', 'mark_pending')} className="px-2.5 py-1 rounded border border-warn/40 text-warn text-12 font-medium hover:bg-warn/10">标记待确认</button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
