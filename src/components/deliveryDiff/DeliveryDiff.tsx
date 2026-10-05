// ============================================================
// 交付数据目录级比对页（新增）
// 展示：日期级差异总览 / 案例×场景归因 / 单版本自洽校验（矛盾标红）。
// 数据全程模拟（交付目录 DAT 由 deliverySim 生成），isMock=true。
// ============================================================
import { useEffect } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { Card, SectionTitle, Pill, RiskBadge, cn } from '../common/ui';

function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto border border-line rounded-md">
      <table className="w-full text-12 border-collapse">
        <thead>
          <tr className="text-sub bg-canvas border-b border-line">
            {headers.map((h, i) => (
              <th key={i} className="text-left py-2 pr-3 font-medium whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export default function DeliveryDiff() {
  const deliveryDiff = useProjectStore((s) => s.deliveryDiff);
  const ensureDeliveryDiff = useProjectStore((s) => s.ensureDeliveryDiff);

  useEffect(() => {
    ensureDeliveryDiff();
  }, [ensureDeliveryDiff]);

  if (!deliveryDiff) {
    return <div className="text-13 text-sub py-20 text-center">正在生成交付数据目录级比对（规则引擎 + 模拟 AI）…</div>;
  }

  const fieldChangeCount = deliveryDiff.dateDiffSummary
    .filter((d) => d.changeType === '字段变更')
    .reduce((s, d) => s + d.count, 0);
  const insertCount = deliveryDiff.dateDiffSummary
    .filter((d) => d.changeType === '行新增')
    .reduce((s, d) => s + d.count, 0);
  const diffDates = new Set(deliveryDiff.dateDiffSummary.map((d) => d.bizDate)).size;
  const contradictions = deliveryDiff.flowConsistencies.filter((f) => !f.ok).length;

  return (
    <div className="space-y-6">
      <SectionTitle
        title="交付数据目录级比对"
        desc="对比两个模拟交付目录（旧版/新版）的全部日期、全部表、全部字段，将差异归因到具体案例与场景，并校验单版本日期流转自洽。"
        right={<Pill tone="ai">模拟 AI 分析模式</Pill>}
      />

      {/* 概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4">
          <div className="text-12 text-sub">涉及差异日期</div>
          <div className="text-24 font-semibold text-ink mt-1">{diffDates}</div>
        </Card>
        <Card className="p-4">
          <div className="text-12 text-sub">字段变更处</div>
          <div className="text-24 font-semibold text-ai mt-1">{fieldChangeCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-12 text-sub">行新增</div>
          <div className="text-24 font-semibold text-ink mt-1">{insertCount}</div>
        </Card>
        <Card className="p-4">
          <div className="text-12 text-sub">自洽矛盾</div>
          <div className={cn('text-24 font-semibold mt-1', contradictions ? 'text-danger' : 'text-ok')}>{contradictions}</div>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2 text-12 text-sub">
        <Pill tone="idle">旧版：{deliveryDiff.oldLabel}</Pill>
        <Pill tone="idle">新版：{deliveryDiff.newLabel}</Pill>
      </div>

      {/* 日期级差异总览 */}
      <Card className="p-4">
        <SectionTitle title="一、日期级差异总览" desc="哪些业务日期有差异、差在哪张表、变化类型与数量。" />
        {deliveryDiff.dateDiffSummary.length === 0 ? (
          <div className="text-12 text-idle py-6 text-center">两个交付目录无差异。</div>
        ) : (
          <Table headers={['业务日期', '账务表', '变化类型', '数量']}>
            {deliveryDiff.dateDiffSummary.map((d, i) => (
              <tr key={i} className="border-b border-line/60">
                <td className="py-1.5 pr-3 font-mono text-ink whitespace-nowrap">{d.bizDate}</td>
                <td className="py-1.5 pr-3 font-mono text-ai whitespace-nowrap">{d.sheet}</td>
                <td className="py-1.5 pr-3 text-sub whitespace-nowrap">
                  <span className={cn(d.changeType === '字段变更' ? 'text-ai' : d.changeType === '行新增' ? 'text-ok' : 'text-warn')}>{d.changeType}</span>
                </td>
                <td className="py-1.5 pr-3 text-ink whitespace-nowrap">{d.count}</td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {/* 案例×场景归因 */}
      <Card className="p-4">
        <SectionTitle title="二、案例 × 场景归因" desc="每条差异定位到具体案例与场景（依据案例主文件的「日期→案例→场景」映射）。" />
        {deliveryDiff.attributedDiffs.length === 0 ? (
          <div className="text-12 text-idle py-6 text-center">无归因差异。</div>
        ) : (
          <Table headers={['业务日期', '表', '字段', '旧值', '新值', '案例', '场景']}>
            {deliveryDiff.attributedDiffs.map((a, i) => (
              <tr key={i} className="border-b border-line/60">
                <td className="py-1.5 pr-3 font-mono text-ink whitespace-nowrap">{a.bizDate}</td>
                <td className="py-1.5 pr-3 font-mono text-ai whitespace-nowrap">{a.sheet}</td>
                <td className="py-1.5 pr-3 text-sub whitespace-nowrap">{a.field}</td>
                <td className="py-1.5 pr-3 font-mono text-sub whitespace-nowrap max-w-[160px] truncate" title={a.oldVal}>{a.oldVal}</td>
                <td className="py-1.5 pr-3 font-mono text-ink whitespace-nowrap max-w-[160px] truncate" title={a.newVal}>{a.newVal}</td>
                <td className="py-1.5 pr-3 text-ink whitespace-nowrap">{a.caseName}</td>
                <td className="py-1.5 pr-3 text-sub whitespace-nowrap max-w-[220px] truncate" title={a.scenario}>{a.scenario}</td>
              </tr>
            ))}
          </Table>
        )}
      </Card>

      {/* 单版本自洽校验 */}
      <Card className="p-4">
        <SectionTitle title="三、单版本日期流转自洽校验" desc="不跨版本，仅校验新版自身：行为描述（场景）应与余额递减、流水笔数等账务数据吻合。" />
        <div className="space-y-2">
          {deliveryDiff.flowConsistencies.map((fc, i) => (
            <div
              key={i}
              className={cn('border rounded-md p-3', fc.ok ? 'border-line bg-canvas' : 'border-danger/40 bg-danger/5')}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-13 font-medium text-ink">{fc.caseName}</span>
                <RiskBadge risk={fc.risk} />
              </div>
              <div className="text-11 text-idle font-mono mb-1">业务日期：{fc.bizDate}</div>
              <ul className="text-12 text-sub space-y-0.5 list-disc list-inside">
                {fc.notes.map((n, j) => (
                  <li key={j} className={cn(!fc.ok && 'text-danger')}>{n}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>

      {deliveryDiff.openQuestions.length > 0 && (
        <Card className="p-4">
          <SectionTitle title="四、待确认问题（自动生成）" desc="由比对与自洽结果派生的待确认事项。" />
          <ul className="space-y-1.5">
            {deliveryDiff.openQuestions.map((q) => (
              <li key={q.qid} className="text-12 text-sub border-b border-line/50 pb-1.5 last:border-0">
                <span className={cn('mr-2', q.riskLevel === 'high' ? 'text-danger' : q.riskLevel === 'medium' ? 'text-warn' : 'text-ok')}>[{q.riskLevel === 'high' ? '高' : q.riskLevel === 'medium' ? '中' : '低'}风险]</span>
                {q.content}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className={cn('text-12 text-idle px-3 py-2 rounded-md bg-canvas')}>
        提示：本页数据由「交付目录 DAT 模拟生成器」产生，全程虚构脱敏，用于演示目录级比对、案例场景归因与单版本自洽校验。所有结论由规则引擎确定性计算，标记为模拟 AI 分析。
      </div>
    </div>
  );
}
