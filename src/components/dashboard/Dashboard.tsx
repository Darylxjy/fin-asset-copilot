import { useMemo } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { internalFields } from '../../data/internalFields';
import { externalV2 } from '../../data/externalV2';
import { cn, Card, Pill, RiskBadge, QTypeBadge, QStatusBadge } from '../common/ui';
import type { RiskLevel } from '../../types';

const FLOW = ['资料准备', '文档解析', '差异分析', '系统适配', '问题确认', '分析报告'];

export default function Dashboard() {
  const project = useProjectStore((s) => s.project);
  const documents = useProjectStore((s) => s.documents);
  const analysis = useProjectStore((s) => s.analysis);
  const caseAnalysis = useProjectStore((s) => s.caseAnalysis);
  const caseQuestionStatus = useProjectStore((s) => s.caseQuestionStatus);
  const decisions = useProjectStore((s) => s.decisions);

  // 合并文档级 + 案例级（四维度校验）待确认问题，与「待确认问题/报告/方案说明」页口径一致
  const caseQuestions = (caseAnalysis?.openQuestions ?? []).map((q) => ({ ...q, status: caseQuestionStatus[q.qid] ?? q.status }));

  const m = useMemo(() => {
    const diffs = analysis?.diffs ?? [];
    const mappings = analysis?.mappings ?? [];
    const docQ = analysis?.questions ?? [];
    const questions = [...docQ, ...caseQuestions];
    const highRisk = [...diffs, ...mappings, ...questions].filter((x) => (x as any).riskLevel === 'high').length;
    const pending = questions.filter((q) => q.status === 'pending').length;
    const confirmed = questions.filter((q) => q.status === 'confirmed' || q.status === 'modified').length;
    const caseCount = caseAnalysis?.structureChecks.length ?? 0;
    const structOk = caseAnalysis ? caseAnalysis.structureChecks.every((s) => s.missingSheets.length === 0 && s.extraSheets.length === 0 && s.headerMismatch.length === 0) : false;
    return {
      uploaded: documents.length,
      parsed: documents.filter((d) => d.parseStatus === 'done').length,
      fieldTotal: internalFields.length + externalV2.length,
      diff: diffs.length,
      highRisk,
      pending,
      confirmed,
      caseCount,
      structOk,
    };
  }, [analysis, documents, caseAnalysis, caseQuestions]);

  const progress = useMemo(() => {
    const steps = [true, m.parsed === m.uploaded && m.uploaded > 0, !!analysis, !!analysis, decisions.some((d) => d.targetId.startsWith('Q_')) || caseQuestions.length > 0, !!analysis && !!caseAnalysis];
    return steps;
  }, [m, analysis, decisions, caseAnalysis, caseQuestions]);

  const recent = useMemo(() => {
    const order: Record<RiskLevel, number> = { high: 0, medium: 1, low: 2 };
    const docQ = analysis?.questions ?? [];
    return [...docQ, ...caseQuestions].sort((a, b) => order[a.riskLevel] - order[b.riskLevel]).slice(0, 3);
  }, [analysis, caseQuestions]);

  type Tone = 'idle' | 'ok' | 'ai' | 'danger' | 'warn';
  const metrics: { label: string; value: number | string; tone: Tone }[] = [
    { label: '已上传资料', value: m.uploaded, tone: 'idle' },
    { label: '解析完成', value: m.parsed, tone: 'ok' },
    { label: '字段总数', value: m.fieldTotal, tone: 'idle' },
    { label: '发现差异', value: m.diff, tone: 'ai' },
    { label: '高风险项', value: m.highRisk, tone: 'danger' },
    { label: '待确认问题', value: m.pending, tone: 'warn' },
    { label: '已确认问题', value: m.confirmed, tone: 'ok' },
    { label: '交付案例', value: m.caseCount, tone: 'idle' },
    { label: '结构一致性', value: m.caseCount ? (m.structOk ? '一致' : '有差异') : '—', tone: m.structOk ? 'ok' : 'warn' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-18 font-semibold text-ink">{project.name}</h1>
        <p className="text-13 text-sub mt-1">
          资产方：{project.assetName} · 我方系统：{project.systemName}
        </p>
        <p className="text-12 text-idle mt-1">{project.note}</p>
      </div>

      {/* 核心指标 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-3">
        {metrics.map((x) => (
          <Card key={x.label} className="p-4">
            <div className="text-12 text-sub">{x.label}</div>
            <div className={cnTone(x.tone)}>{x.value}</div>
          </Card>
        ))}
      </div>

      {/* 流程 */}
      <Card className="p-5">
        <div className="text-14 font-semibold text-ink mb-4">分析流程</div>
        <div className="flex flex-wrap items-center gap-2">
          {FLOW.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className={cn('w-6 h-6 rounded-full flex items-center justify-center text-12 font-semibold', progress[i] ? 'bg-ai text-white' : 'bg-canvas text-idle border border-line')}>
                  {i + 1}
                </span>
                <span className={cn('text-13', progress[i] ? 'text-ink font-medium' : 'text-sub')}>{step}</span>
              </div>
              {i < FLOW.length - 1 && <span className="text-idle">→</span>}
            </div>
          ))}
        </div>
        <div className="mt-3 text-12 text-sub">
          当前分析进度：{progress.filter(Boolean).length} / {FLOW.length}
        </div>
      </Card>

      {/* 最近重要问题 */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-14 font-semibold text-ink">最近发现的重要问题</div>
          <Pill tone="warn">Top 3</Pill>
        </div>
        {recent.length === 0 ? (
          <div className="text-13 text-sub py-6 text-center">暂无问题</div>
        ) : (
          <div className="space-y-3">
            {recent.map((q) => (
              <div key={q.qid} className="flex items-start gap-3 p-3 rounded-md border border-line bg-canvas">
                <RiskBadge risk={q.riskLevel} />
                <div className="min-w-0 flex-1">
                  <div className="text-13 text-ink">{q.content}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <QTypeBadge type={q.type} />
                    <QStatusBadge status={q.status} />
                    <span className="text-11 text-idle">确认对象：{q.confirmTarget}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function cnTone(tone: 'idle' | 'ok' | 'ai' | 'danger' | 'warn') {
  const map = {
    idle: 'text-2xl font-semibold text-ink mt-1',
    ok: 'text-2xl font-semibold text-ok mt-1',
    ai: 'text-2xl font-semibold text-ai mt-1',
    danger: 'text-2xl font-semibold text-danger mt-1',
    warn: 'text-2xl font-semibold text-warn mt-1',
  };
  return map[tone];
}
