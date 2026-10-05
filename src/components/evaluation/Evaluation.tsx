import { useEffect, useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { runGoldenCases, computeMetrics } from '../../lib/evaluation/metrics';
import type { EvaluationCase } from '../../types';
import { Card, SectionTitle, Pill, cn } from '../common/ui';

export default function Evaluation() {
  const analysis = useProjectStore((s) => s.analysis);
  const decisions = useProjectStore((s) => s.decisions);
  const analysisTimeMs = useProjectStore((s) => s.analysisTimeMs);
  const [cases, setCases] = useState<EvaluationCase[]>([]);
  const [running, setRunning] = useState(false);

  const run = async () => {
    setRunning(true);
    const r = await runGoldenCases();
    setCases(r);
    setRunning(false);
  };
  useEffect(() => { run(); /* eslint-disable-next-line */ }, []);

  const m = computeMetrics(cases, analysis, decisions, analysisTimeMs);
  const passed = cases.filter((c) => c.pass).length;

  const metricsList = [
    { label: '字段抽取准确率', v: m.fieldExtractionAccuracy, fmt: pct, none: '暂无评测结果' },
    { label: '字段差异召回率', v: m.diffRecall, fmt: pct, none: '暂无评测结果', hint: '优先保证召回' },
    { label: '字段差异准确率', v: m.diffPrecision, fmt: pct, none: '暂无评测结果' },
    { label: '字段映射准确率', v: m.mappingAccuracy, fmt: pct, none: '暂无评测结果' },
    { label: '待确认问题有效率', v: m.questionValidRate, fmt: pct, none: '待人工评估' },
    { label: 'AI 建议采纳率', v: m.aiAdoptRate, fmt: pct, none: '暂无人工反馈' },
    { label: 'AI 建议人工修改率', v: m.aiModifyRate, fmt: pct, none: '暂无人工反馈' },
    { label: '无依据结论率', v: m.noEvidenceRate, fmt: pct, none: '暂无评测结果', invert: true },
    { label: '平均分析耗时', v: m.avgAnalysisTimeMs == null ? null : m.avgAnalysisTimeMs, fmt: (x: number) => `${x} ms`, none: '暂无记录' },
  ];

  return (
    <div className="space-y-5">
      <SectionTitle
        title="评测中心"
        desc="所有指标由真实测试记录计算；无记录显示“暂无评测结果”，不虚构数字"
        right={<button onClick={run} disabled={running} className="px-3 py-1.5 rounded-md bg-ai text-white text-12 font-medium disabled:opacity-50">{running ? '运行中…' : '重新运行评测'}</button>}
      />

      {/* 指标卡 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {metricsList.map((x) => (
          <Card key={x.label} className="p-4">
            <div className="text-12 text-sub flex items-center gap-1">{x.label}{x.hint && <span className="text-11 text-ai">·{x.hint}</span>}</div>
            <div className={cn('text-xl font-semibold mt-1', x.v == null ? 'text-idle text-14 font-normal' : x.invert ? (x.v > 0 ? 'text-danger' : 'text-ok') : 'text-ink')}>
              {x.v == null ? x.none : x.fmt(x.v as number)}
            </div>
          </Card>
        ))}
      </div>

      {/* Golden Cases */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-14 font-semibold text-ink">Golden Test Cases</div>
          <Pill tone={passed === cases.length && cases.length ? 'ok' : 'warn'}>{cases.length ? `${passed}/${cases.length} 通过` : '未运行'}</Pill>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-12 border-collapse">
            <thead>
              <tr className="text-sub border-b border-line">
                <th className="text-left py-2 pr-3">ID</th>
                <th className="text-left py-2 pr-3">类型</th>
                <th className="text-left py-2 pr-3">用例</th>
                <th className="text-left py-2 pr-3">期望</th>
                <th className="text-left py-2 pr-3">实际</th>
                <th className="text-left py-2 pr-3">结果</th>
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.caseId} className="border-b border-line/60">
                  <td className="py-1.5 pr-3 font-mono text-ink">{c.caseId}</td>
                  <td className="py-1.5 pr-3 text-sub whitespace-nowrap">{c.caseType}</td>
                  <td className="py-1.5 pr-3 text-ink max-w-[280px]">{c.title}<div className="text-11 text-idle">{c.remark}</div></td>
                  <td className="py-1.5 pr-3 text-sub whitespace-nowrap">{json(c.expectedResult)}</td>
                  <td className="py-1.5 pr-3 text-sub whitespace-nowrap">{json(c.actualResult)}</td>
                  <td className="py-1.5 pr-3">{c.pass ? <span className="text-ok">通过</span> : <span className="text-danger">未通过</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function pct(v: number) { return (v * 100).toFixed(1) + '%'; }
function json(o: unknown) { try { return JSON.stringify(o); } catch { return String(o); } }
