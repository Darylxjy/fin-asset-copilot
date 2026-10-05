import { useMemo } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { externalV1 } from '../../data/externalV1';
import { Card, SectionTitle, RiskBadge, MappingStatusBadge, QTypeBadge, QStatusBadge, DiffTypeBadge, cn } from '../common/ui';
import type { DiffType } from '../../types';

export default function Report() {
  const project = useProjectStore((s) => s.project);
  const documents = useProjectStore((s) => s.documents);
  const analysis = useProjectStore((s) => s.analysis);
  const caseAnalysis = useProjectStore((s) => s.caseAnalysis);

  const diffs = analysis?.diffs ?? [];
  const mappings = analysis?.mappings ?? [];
  const questions = analysis?.questions ?? [];
  const impacts = analysis?.systemImpacts ?? [];
  const caseQ = caseAnalysis?.openQuestions ?? [];

  const added = diffs.filter((d) => d.diffType.includes('ADDED'));
  const removed = diffs.filter((d) => d.diffType.includes('REMOVED'));
  const changed = diffs.filter((d) => d.diffType.some((t: DiffType) => ['CHINESE_NAME_CHANGED', 'TYPE_CHANGED', 'LENGTH_CHANGED', 'REQUIRED_CHANGED', 'DESCRIPTION_CHANGED', 'ENUM_CHANGED', 'REMARK_CHANGED', 'FIELD_NAME_CHANGED'].includes(t)));
  const high = [...diffs, ...mappings, ...questions].filter((x: any) => x.riskLevel === 'high');
  const externalQ = questions.filter((q) => q.type === 'external');
  const internalQ = questions.filter((q) => q.type !== 'external');
  const confirmed = questions.filter((q) => q.status === 'confirmed' || q.status === 'modified');

  const text = useMemo(() => buildText({ project, documents, diffs, mappings, questions, impacts, added, removed, changed, high, externalQ, internalQ, confirmed, caseAnalysis }), [project, documents, analysis, caseAnalysis]);

  const copy = () => navigator.clipboard?.writeText(text);
  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ project, documents, analysis, caseAnalysis }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = '示例资产接入分析报告.json'; a.click();
    URL.revokeObjectURL(url);
  };
  const print = () => {
    const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>资产接入分析报告</title>
      <style>body{font-family:'PingFang SC',system-ui;color:#1f2933;padding:32px;line-height:1.6}
      h1{font-size:22px}h2{font-size:16px;margin-top:24px;border-left:4px solid #6366F1;padding-left:8px}
      pre{white-space:pre-wrap;font-family:ui-monospace,monospace;font-size:12px;background:#f7f8fa;padding:12px;border-radius:6px}
      .muted{color:#6b7280}</style></head><body><pre>${escapeHtml(text)}</pre></body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  };

  return (
    <div className="space-y-5">
      <SectionTitle
        title="资产接入分析报告"
        desc="自动生成 · AI 结论均保留判断依据"
        right={
          <div className="flex gap-2">
            <button onClick={copy} className="px-3 py-1.5 rounded-md border border-line text-12 text-ink hover:bg-canvas">复制文本</button>
            <button onClick={exportJson} className="px-3 py-1.5 rounded-md border border-line text-12 text-ink hover:bg-canvas">导出 JSON</button>
            <button onClick={print} className="px-3 py-1.5 rounded-md bg-ai text-white text-12 font-medium">打印 / PDF</button>
          </div>
        }
      />

      <Card className="p-5 space-y-5">
        <Sec n={1} title="项目概况">
          <p className="text-13 text-ink">项目名称：{project.name}</p>
          <p className="text-13 text-sub">资产方：{project.assetName}（虚构脱敏） · 我方系统：{project.systemName}</p>
          <p className="text-13 text-sub">生成时间：{analysis?.analyzedAt ? new Date(analysis.analyzedAt).toLocaleString('zh-CN') : '—'} · AI 模式：{analysis?.mock ? '模拟 AI 分析（非真实大模型）' : '真实模型'}</p>
        </Sec>

        <Sec n={2} title="对接资料">
          <ul className="text-13 text-sub list-disc list-inside">
            {documents.map((d) => <li key={d.id}>{d.name}（{d.side === 'internal' ? '我方' : d.side === 'external' ? '对接方' : '历史'} · {d.version || '-'} · 字段 {d.fieldCount} · 已脱敏）</li>)}
          </ul>
        </Sec>

        <Sec n={3} title="字段整体情况">
          <p className="text-13 text-ink">旧版（V1）字段 {externalV1.length} 个，新版（V2）字段 {diffs.length >= 0 ? 19 : 0} 个；共识别差异 {diffs.length} 项（新增 {added.length} / 删除 {removed.length} / 定义变化 {changed.length}）。</p>
        </Sec>

        <Sec n={4} title="新增字段">
          {added.length ? <DiffList diffs={added} /> : <p className="text-13 text-sub">无</p>}
        </Sec>
        <Sec n={5} title="删除字段">
          {removed.length ? <DiffList diffs={removed} /> : <p className="text-13 text-sub">无</p>}
        </Sec>
        <Sec n={6} title="字段定义变化">
          {changed.length ? <DiffList diffs={changed} /> : <p className="text-13 text-sub">无</p>}
        </Sec>

        <Sec n={7} title="系统字段映射">
          <div className="overflow-x-auto">
            <table className="w-full text-12 border-collapse">
              <thead><tr className="text-sub border-b border-line"><th className="text-left py-2 pr-3">对方字段</th><th className="text-left py-2 pr-3">我方字段</th><th className="text-left py-2 pr-3">适配状态</th><th className="text-left py-2 pr-3">风险</th><th className="text-left py-2 pr-3">依据</th></tr></thead>
              <tbody>
                {mappings.map((m) => (
                  <tr key={m.mappingId} className="border-b border-line/60">
                    <td className="py-1.5 pr-3 font-mono text-ink">{m.externalField}</td>
                    <td className="py-1.5 pr-3 font-mono text-ink">{m.internalField || '（无）'}</td>
                    <td className="py-1.5 pr-3"><MappingStatusBadge status={m.mappingStatus} /></td>
                    <td className="py-1.5 pr-3"><RiskBadge risk={m.riskLevel} /></td>
                    <td className="py-1.5 pr-3 text-sub max-w-[280px] truncate">{m.evidence.join('；')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Sec>

        <Sec n={8} title="系统影响范围">
          <div className="space-y-2">
            {impacts.map((im) => (
              <div key={im.module} className="p-2.5 rounded border border-line bg-canvas">
                <div className="text-13 font-medium text-ink">{im.module} 模块（{im.findings.length} 项）</div>
                {im.findings.map((f, i) => <div key={i} className="text-12 text-sub mt-1">· {f.desc} <span className="text-idle">[{f.evidence.join('；')}]</span></div>)}
              </div>
            ))}
          </div>
        </Sec>

        {caseAnalysis && (
          <div>
            <h2 className="text-14 font-semibold text-ink mb-2 flex items-center gap-2"><span className="w-5 h-5 rounded bg-ai/10 text-ai text-12 flex items-center justify-center">★</span>案例四维度校验结论（示例分期产品交付案例）</h2>
            <div className="space-y-3">
              <div>
                <div className="text-13 font-medium text-ink mb-1">① 新老版本差异汇总</div>
                {caseAnalysis.versionDiffs.map((v) => (
                  <div key={v.caseName} className="text-12 text-sub mt-1">· {v.caseName}：新增 Sheet {v.addedSheets.length}（{v.addedSheets.join('/') || '无'}）、变化 Sheet {v.changedSheets.length}（{v.changedSheets.map((c) => c.sheet).join('/') || '无'}）</div>
                ))}
              </div>
              <div>
                <div className="text-13 font-medium text-ink mb-1">② 业务场景自主分析</div>
                {caseAnalysis.sceneAnalyses.map((s) => <div key={s.caseName} className="text-12 text-sub mt-1">· {s.caseName}：{s.aiSummary}</div>)}
              </div>
              <div>
                <div className="text-13 font-medium text-ink mb-1">③ 跨产品线影响评估</div>
                {caseAnalysis.crossProducts.map((c) => <div key={c.caseName} className="text-12 text-sub mt-1">· {c.caseName}：{c.aiSummary}</div>)}
              </div>
              <div>
                <div className="text-13 font-medium text-ink mb-1">④ 历史注意点验证</div>
                <div className="text-12 text-sub">通过 {caseAnalysis.ruleValidations.filter((r) => r.result === 'pass').length} / 不通过 {caseAnalysis.ruleValidations.filter((r) => r.result === 'fail').length} / 不适用 {caseAnalysis.ruleValidations.filter((r) => r.result === 'na').length}（共 {caseAnalysis.ruleValidations.length} 条）</div>
                {caseAnalysis.ruleValidations.filter((r) => r.result === 'fail').map((r) => <div key={r.seq} className="text-12 text-danger mt-0.5">· 注意点 {r.seq} 不通过：{r.rule}（{r.note}）</div>)}
              </div>
              <div>
                <div className="text-13 font-medium text-ink mb-1">⑤ 异常点汇总</div>
                {(() => {
                  const anomalies = caseAnalysis.sceneAnalyses.flatMap((s) => s.findings.filter((f) => !f.ok).map((f) => ({ c: s.caseName, p: f.point, n: f.note })));
                  if (anomalies.length === 0) return <div className="text-12 text-sub">· 无（场景时间线均自洽）</div>;
                  return anomalies.map((a, i) => <div key={i} className="text-12 text-warn mt-0.5">· [{a.c}] {a.p}：{a.n}</div>);
                })()}
                {caseQ.map((q) => <div key={q.qid} className="text-12 text-warn mt-0.5">· 待确认：{q.content}</div>)}
              </div>
              <div>
                <div className="text-13 font-medium text-ink mb-1">⑥ 整体结论</div>
                <div className="text-12 text-ink">案例结构校验全部一致；案例1 与旧版参考存在 8 个新增 Sheet 及金额精度 2→4 位变化；案例3 逾期罚息单列（注意点10 待确认）；整体结论：需复核后通过。</div>
              </div>
            </div>
          </div>
        )}

        <Sec n={9} title="高风险问题">
          {high.length ? high.map((x: any, i) => <div key={i} className="flex items-start gap-2 mt-1"><RiskBadge risk="high" /><span className="text-13 text-ink">{x.aiSummary || x.content || x.ruleFindings?.join('；')}</span></div>) : <p className="text-13 text-sub">无</p>}
        </Sec>

        <Sec n={10} title="对外待确认问题（资产方）">
          {externalQ.length ? externalQ.map((q) => <QItem key={q.qid} q={q} />) : <p className="text-13 text-sub">无</p>}
        </Sec>
        <Sec n={11} title="内部待确认问题（产品/业务/研发）">
          {internalQ.length ? internalQ.map((q) => <QItem key={q.qid} q={q} />) : <p className="text-13 text-sub">无</p>}
        </Sec>

        <Sec n={12} title="已确认结论">
          {confirmed.length ? confirmed.map((q) => <div key={q.qid} className="text-13 text-ink mt-1">· [{q.status === 'confirmed' ? '已接受' : '已修改'}] {q.content}</div>) : <p className="text-13 text-sub">暂无人工确认记录</p>}
        </Sec>

        <Sec n={13} title="后续改造建议">
          <ul className="text-13 text-sub list-disc list-inside space-y-1">
            <li>账务模块：评估金额精度由 2 位提升至 4 位的解析与对账改造（依据：示例资产方账务说明V2 - loanAmt、系统规则 R001）。</li>
            <li>贷后/账务：评估借据状态新增 PROCESSING 处理中态的流转与计息规则（依据：示例资产方账务说明V2 - loanStatus、系统规则 R002、历史 H002）。</li>
            <li>创单：利率百分比转小数的接入层规则转换（依据：示例资产方账务说明V2 - yearRate、系统规则 R003、历史 H003）。</li>
            <li>账务：评估新增 repaymentChannel 还款渠道字段（依据：示例资产方账务说明V2 - repaymentChannel）。</li>
            <li>解析兼容：申请时间格式 YYYYMMDDHHmmss 的解析适配（依据：示例资产方账务说明V2 - applyTime、系统规则 R004）。</li>
          </ul>
        </Sec>
      </Card>
    </div>
  );
}

function Sec({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-14 font-semibold text-ink mb-2 flex items-center gap-2"><span className="w-5 h-5 rounded bg-ai/10 text-ai text-12 flex items-center justify-center">{n}</span>{title}</h2>
      {children}
    </div>
  );
}

function DiffList({ diffs }: { diffs: { fieldKey: string; diffType: DiffType[]; newField?: any; oldField?: any; evidence: string[]; aiSummary: string }[] }) {
  return (
    <div className="space-y-1.5">
      {diffs.map((d, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="font-mono text-13 text-ink">{d.newField?.fieldName || d.oldField?.fieldName}</span>
          {d.diffType.map((t) => <DiffTypeBadge key={t} type={t} />)}
          <span className="text-12 text-sub">{d.aiSummary || d.evidence.join('；')}</span>
        </div>
      ))}
    </div>
  );
}

function QItem({ q }: { q: any }) {
  return (
    <div className="p-2 rounded border border-line bg-canvas mt-1">
      <div className="flex items-center gap-2">
        <QTypeBadge type={q.type} /><QStatusBadge status={q.status} /><RiskBadge risk={q.riskLevel} />
      </div>
      <div className="text-13 text-ink mt-1">{q.content}</div>
      <div className="text-11 text-idle mt-0.5">依据：{q.evidence.join('；')}</div>
    </div>
  );
}

function escapeHtml(s: string) {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string));
}

function buildText(data: any): string {
  const { project, documents, diffs, mappings, questions, added, removed, changed, high, externalQ, internalQ, confirmed, caseAnalysis } = data;
  const L: string[] = [];
  L.push(`金融资产接入与账务适配分析报告`);
  L.push(`========================================`);
  L.push(`项目：${project.name}`);
  L.push(`资产方：${project.assetName}（虚构脱敏）  我方系统：${project.systemName}`);
  L.push(`AI 模式：${data.analysis?.mock ? '模拟 AI 分析' : '真实模型'}`);
  L.push(``);
  L.push(`一、字段整体情况`);
  L.push(`V1 字段 19，V2 字段 19，识别差异 ${diffs.length} 项（新增 ${added.length}/删除 ${removed.length}/变化 ${changed.length}）。`);
  L.push(``);
  L.push(`二、新增字段`); added.forEach((d: any) => L.push(`- ${d.newField?.fieldName}（${d.newField?.chineseName}）${d.evidence.length ? ' 依据：' + d.evidence.join('；') : ''}`));
  L.push(`三、删除字段`); removed.forEach((d: any) => L.push(`- ${d.oldField?.fieldName}（${d.oldField?.chineseName}）`));
  L.push(`四、字段定义变化`); changed.forEach((d: any) => L.push(`- ${d.newField?.fieldName || d.oldField?.fieldName}：${d.diffType.join(',')} | ${d.aiSummary}`));
  L.push(``);
  L.push(`五、系统字段映射`); mappings.forEach((m: any) => L.push(`- ${m.externalField} → ${m.internalField || '（无）'} [${m.mappingStatus}] 依据：${m.evidence.join('；')}`));
  L.push(``);
  L.push(`六、高风险问题（${high.length}）`); high.forEach((x: any) => L.push(`- ${x.aiSummary || x.content || (x.ruleFindings || []).join('；')}`));
  L.push(``);
  L.push(`七、对外待确认问题（资产方，${externalQ.length}）`); externalQ.forEach((q: any) => L.push(`- [${q.riskLevel}] ${q.content} 依据：${q.evidence.join('；')}`));
  L.push(`八、内部待确认问题（${internalQ.length}）`); internalQ.forEach((q: any) => L.push(`- [${q.riskLevel}] ${q.content} 依据：${q.evidence.join('；')}`));
  if (caseAnalysis) {
    const v = caseAnalysis.versionDiffs;
    const sc = caseAnalysis.sceneAnalyses;
    const cp = caseAnalysis.crossProducts;
    const rv = caseAnalysis.ruleValidations;
    const fail = rv.filter((r: any) => r.result === 'fail');
    L.push(``);
    L.push(`九、案例四维度校验（示例分期产品交付案例）`);
    L.push(`9.1 新老版本差异汇总`);
    v.forEach((vv: any) => L.push(`- ${vv.caseName}：新增 Sheet ${vv.addedSheets.length}（${vv.addedSheets.join('/') || '无'}）、变化 Sheet ${vv.changedSheets.length}（${vv.changedSheets.map((c: any) => c.sheet).join('/') || '无'}）`));
    L.push(`9.2 业务场景自主分析`);
    sc.forEach((s: any) => L.push(`- ${s.caseName}：${s.aiSummary}`));
    L.push(`9.3 跨产品线影响评估`);
    cp.forEach((c: any) => L.push(`- ${c.caseName}：${c.aiSummary}`));
    L.push(`9.4 历史注意点验证：通过 ${rv.filter((r: any) => r.result === 'pass').length}/不通过 ${fail.length}/不适用 ${rv.filter((r: any) => r.result === 'na').length}`);
    fail.forEach((r: any) => L.push(`  · 注意点 ${r.seq} 不通过：${r.rule}（${r.note}）`));
    L.push(`9.5 整体结论：结构一致；案例1 与旧版存在 8 新增 Sheet 及精度 2→4 位变化；案例3 逾期罚息单列（注意点10 待确认）；需复核后通过。`);
  }
  L.push(``);
  L.push(`十、已确认结论（${confirmed.length}）`); confirmed.forEach((q: any) => L.push(`- [${q.status}] ${q.content}`));
  L.push(``);
  L.push(`十一、后续改造建议`);
  L.push(`- 账务：金额精度 2→4 改造；新增 repaymentChannel 字段。`);
  L.push(`- 贷后/账务：PROCESSING 处理中态流转与计息规则。`);
  L.push(`- 创单：利率百分比转小数规则转换；applyTime 格式兼容。`);
  L.push(``);
  L.push(`（本报告由规则引擎 + 模拟 AI 生成，所有结论保留判断依据，关键判断需产品经理人工确认）`);
  return L.join('\n');
}
