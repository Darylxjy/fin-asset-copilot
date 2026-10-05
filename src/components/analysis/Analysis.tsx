import { useEffect, useMemo, useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { internalFields } from '../../data/internalFields';
import { synonymMap } from '../../lib/rules/mapping';
import { Card, SectionTitle, Pill, RiskBadge, DiffTypeBadge, MappingStatusBadge, EmptyHint, cn } from '../common/ui';
import DeliveryDiff from '../deliveryDiff/DeliveryDiff';
import type { DiffType, FieldDiff, FieldMapping, HumanAction, UnifiedField, CaseAnalysisResult } from '../../types';

const internalMap = new Map(internalFields.map((f) => [f.fieldName, f]));

function FieldDetail({ f, label }: { f: UnifiedField; label: string }) {
  return (
    <div className="rounded-md border border-line bg-canvas p-3">
      <div className="text-12 font-medium text-ai mb-2">{label}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-12">
        <KV k="字段名" v={f.fieldName} mono />
        <KV k="中文名" v={f.chineseName} />
        <KV k="类型" v={f.dataType} />
        <KV k="长度" v={f.length || '-'} />
        <KV k="必填" v={f.required} />
        <KV k="格式" v={f.format || '-'} />
        <KV k="枚举" v={f.enumValues.length ? f.enumValues.join(', ') : '-'} />
        <KV k="示例" v={f.exampleValue || '-'} mono />
      </div>
      <div className="mt-2 text-12 text-sub"><span className="text-ink">说明：</span>{f.description}</div>
      {f.remark && <div className="mt-1 text-12 text-sub"><span className="text-ink">备注：</span>{f.remark}</div>}
    </div>
  );
}
function KV({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return <div><span className="text-sub">{k}：</span><span className={cn('text-ink', mono && 'font-mono')}>{v}</span></div>;
}

function ActionBar({ targetId }: { targetId: string }) {
  const decisions = useProjectStore((s) => s.decisions);
  const record = useProjectStore((s) => s.recordDecision);
  const d = decisions.find((x) => x.targetId === targetId);
  const actions: { a: HumanAction; label: string; cls: string }[] = [
    { a: 'accept', label: '接受', cls: 'text-ok border-ok/40 hover:bg-ok/10' },
    { a: 'modify', label: '修改', cls: 'text-ai border-ai/40 hover:bg-ai/10' },
    { a: 'reject', label: '驳回', cls: 'text-danger border-danger/40 hover:bg-danger/10' },
    { a: 'mark_pending', label: '待确认', cls: 'text-warn border-warn/40 hover:bg-warn/10' },
  ];
  const labelMap: Record<HumanAction, string> = { accept: '已接受', modify: '已修改', reject: '已驳回', mark_pending: '已标记待确认' };
  return (
    <div className="flex items-center gap-2 mt-3">
      {actions.map((x) => (
        <button key={x.a} onClick={() => record(targetId, x.a)} className={cn('px-2.5 py-1 rounded border text-12 font-medium', x.cls)}>{x.label}</button>
      ))}
      {d && <span className="text-12 text-sub ml-1">人工：{labelMap[d.action]}</span>}
    </div>
  );
}

const CHANGE_TYPES: DiffType[] = ['CHINESE_NAME_CHANGED', 'TYPE_CHANGED', 'LENGTH_CHANGED', 'REQUIRED_CHANGED', 'DESCRIPTION_CHANGED', 'ENUM_CHANGED', 'REMARK_CHANGED', 'FIELD_NAME_CHANGED'];

function DocFieldAnalysis() {
  const analysis = useProjectStore((s) => s.analysis);
  const decisions = useProjectStore((s) => s.decisions);
  const [seg, setSeg] = useState<'diff' | 'mapping' | 'impact'>('diff');
  const [diffFilter, setDiffFilter] = useState<'all' | 'added' | 'removed' | 'changed'>('all');
  const [mapFilter, setMapFilter] = useState<'all' | 'direct' | 'transform' | 'pending'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const v1len = 19, v2len = 19;
  const diffs = analysis?.diffs ?? [];
  const mappings = analysis?.mappings ?? [];
  const impacts = analysis?.systemImpacts ?? [];

  const stats = useMemo(() => {
    const added = diffs.filter((d) => d.diffType.includes('ADDED')).length;
    const removed = diffs.filter((d) => d.diffType.includes('REMOVED')).length;
    const changed = diffs.filter((d) => d.diffType.some((t) => CHANGE_TYPES.includes(t))).length;
    const high = diffs.filter((d) => d.riskLevel === 'high').length;
    const pending = diffs.filter((d) => !decisions.some((x) => x.targetId === d.diffId)).length;
    return { added, removed, changed, high, pending };
  }, [diffs, decisions]);

  const filteredDiffs = diffs.filter((d) => {
    if (diffFilter === 'all') return true;
    if (diffFilter === 'added') return d.diffType.includes('ADDED');
    if (diffFilter === 'removed') return d.diffType.includes('REMOVED');
    if (diffFilter === 'changed') return d.diffType.some((t) => CHANGE_TYPES.includes(t));
    return true;
  });

  const filteredMaps = mappings.filter((m) => {
    if (mapFilter === 'all') return true;
    if (mapFilter === 'direct') return m.mappingStatus === 'DIRECT_MAPPING';
    if (mapFilter === 'transform') return m.mappingStatus === 'TRANSFORM_REQUIRED' || m.mappingStatus === 'RULE_TRANSFORM_REQUIRED';
    if (mapFilter === 'pending') return m.mappingStatus === 'INTERNAL_FIELD_MISSING' || m.mappingStatus === 'BUSINESS_CONFLICT' || m.mappingStatus === 'MANUAL_REVIEW_REQUIRED';
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card className="p-3"><div className="text-12 text-sub">旧版字段</div><div className="text-xl font-semibold text-ink mt-0.5">{v1len}</div></Card>
        <Card className="p-3"><div className="text-12 text-sub">新版字段</div><div className="text-xl font-semibold text-ink mt-0.5">{v2len}</div></Card>
        <Card className="p-3"><div className="text-12 text-sub">新增 / 删除 / 修改</div><div className="text-xl font-semibold text-ai mt-0.5">{stats.added} / {stats.removed} / {stats.changed}</div></Card>
        <Card className="p-3"><div className="text-12 text-sub">高风险</div><div className="text-xl font-semibold text-danger mt-0.5">{stats.high}</div></Card>
        <Card className="p-3"><div className="text-12 text-sub">待确认</div><div className="text-xl font-semibold text-warn mt-0.5">{stats.pending}</div></Card>
      </div>

      <div className="flex gap-1 border-b border-line">
        {([['diff', '差异分析'], ['mapping', '字段映射'], ['impact', '系统影响']] as const).map(([k, label]) => (
          <button key={k} onClick={() => setSeg(k)} className={cn('px-3 py-2 text-13 font-medium border-b-2 -mb-px', seg === k ? 'border-ai text-ai' : 'border-transparent text-sub hover:text-ink')}>{label}</button>
        ))}
      </div>

      {seg === 'diff' && (
        <>
          <div className="flex gap-2 flex-wrap">
            {([['all', '全部'], ['added', '新增'], ['removed', '删除'], ['changed', '字段定义变化']] as const).map(([k, label]) => (
              <button key={k} onClick={() => setDiffFilter(k)} className={cn('px-3 py-1 rounded-full border text-12', diffFilter === k ? 'border-ai text-ai bg-ai/10' : 'border-line text-sub')}>{label}</button>
            ))}
          </div>
          <div className="space-y-2">
            {filteredDiffs.length === 0 && <EmptyHint text="无匹配差异" />}
            {filteredDiffs.map((d) => <DiffRow key={d.diffId} d={d} expanded={expanded === d.diffId} onToggle={() => setExpanded(expanded === d.diffId ? null : d.diffId)} />)}
          </div>
        </>
      )}

      {seg === 'mapping' && (
        <>
          <div className="flex gap-2 flex-wrap">
            {([['all', '全部'], ['direct', '可直接适配'], ['transform', '需要改造'], ['pending', '待确认']] as const).map(([k, label]) => (
              <button key={k} onClick={() => setMapFilter(k)} className={cn('px-3 py-1 rounded-full border text-12', mapFilter === k ? 'border-ai text-ai bg-ai/10' : 'border-line text-sub')}>{label}</button>
            ))}
          </div>
          <div className="space-y-2">
            {filteredMaps.length === 0 && <EmptyHint text="无匹配映射" />}
            {filteredMaps.map((m) => <MappingRow key={m.mappingId} m={m} expanded={expanded === m.mappingId} onToggle={() => setExpanded(expanded === m.mappingId ? null : m.mappingId)} />)}
          </div>
        </>
      )}

      {seg === 'impact' && (
        <div className="space-y-3">
          {impacts.map((im) => (
            <Card key={im.module} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-14 font-semibold text-ink">{im.module} 模块</span>
                <Pill tone="warn">潜在影响 {im.findings.length}</Pill>
              </div>
              <div className="space-y-2">
                {im.findings.map((f, i) => (
                  <div key={i} className="p-2.5 rounded border border-line bg-canvas">
                    <div className="flex items-center gap-2">
                      <RiskBadge risk={f.riskLevel} />
                      <span className="text-13 text-ink">{f.desc}</span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {f.fields.map((fl) => <span key={fl} className="text-11 font-mono text-sub bg-surface border border-line rounded px-1.5 py-0.5">{fl}</span>)}
                    </div>
                    <div className="mt-1.5 text-11 text-idle">依据：{f.evidence.join(' · ')}</div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function DiffRow({ d, expanded, onToggle }: { d: FieldDiff; expanded: boolean; onToggle: () => void }) {
  const intlName = synonymMap[d.fieldKey];
  const intl = intlName ? internalMap.get(intlName) : undefined;
  const externalField = d.newField ?? d.oldField!;
  return (
    <Card className="p-4">
      <button onClick={onToggle} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-13 font-mono font-medium text-ink">{externalField.fieldName}</span>
              <span className="text-12 text-sub">{externalField.chineseName}</span>
              {d.diffType.map((t) => <DiffTypeBadge key={t} type={t} />)}
            </div>
            <div className="text-12 text-sub mt-1 line-clamp-2">{d.aiSummary || d.ruleFindings.join('；')}</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <RiskBadge risk={d.riskLevel} />
            <span className="text-11 text-idle">{expanded ? '收起' : '展开'}</span>
          </div>
        </div>
      </button>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-line space-y-3">
          <div className="grid md:grid-cols-3 gap-3">
            {d.oldField && <FieldDetail f={d.oldField} label="旧版本（V1）整行定义" />}
            {d.newField && <FieldDetail f={d.newField} label="新版本（V2）整行定义" />}
            {intl ? <FieldDetail f={intl} label="我方字段（示例账务系统）整行定义" /> : <div className="rounded-md border border-danger/30 bg-danger/5 p-3 text-12 text-danger">我方示例账务系统 无对应字段（字段缺失）</div>}
          </div>
          <Block title="规则发现" tone="idle" items={d.ruleFindings} />
          <Block title="AI 分析" tone="ai" text={d.aiSummary} />
          <Block title="判断依据" tone="ok" items={d.evidence} />
          <div className="flex flex-wrap gap-1 text-11 text-idle">影响模块：{d.affectedModules.length ? d.affectedModules.join('、') : '—'}</div>
          <ActionBar targetId={d.diffId} />
        </div>
      )}
    </Card>
  );
}

function MappingRow({ m, expanded, onToggle }: { m: FieldMapping; expanded: boolean; onToggle: () => void }) {
  return (
    <Card className="p-4">
      <button onClick={onToggle} className="w-full text-left">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-13 font-mono font-medium text-ink">{m.externalField}</span>
              <span className="text-sub">→</span>
              <span className="text-13 font-mono font-medium text-ink">{m.internalField || '（无）'}</span>
              <MappingStatusBadge status={m.mappingStatus} />
            </div>
            <div className="text-12 text-sub mt-1">{m.reason}</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <RiskBadge risk={m.riskLevel} />
            <span className="text-11 text-idle">{expanded ? '收起' : '展开'}</span>
          </div>
        </div>
      </button>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-line space-y-3">
          <div className="text-12 text-sub">置信度：{(m.confidence * 100).toFixed(0)}%</div>
          <Block title="AI 分析" tone="ai" text={m.aiSummary} />
          <Block title="判断依据" tone="ok" items={m.evidence} />
          <div className="flex flex-wrap gap-1 text-11 text-idle">影响模块：{m.affectedModules.length ? m.affectedModules.join('、') : '—'}</div>
          <ActionBar targetId={m.mappingId} />
        </div>
      )}
    </Card>
  );
}

function Block({ title, tone, items, text }: { title: string; tone: 'idle' | 'ai' | 'ok'; items?: string[]; text?: string }) {
  const color = tone === 'ai' ? 'text-ai' : tone === 'ok' ? 'text-ok' : 'text-sub';
  return (
    <div>
      <div className={cn('text-12 font-medium mb-1', color)}>{title}</div>
      {text && <div className="text-12 text-ink bg-canvas rounded p-2">{text}</div>}
      {items && items.length > 0 && (
        <ul className="space-y-1">
          {items.map((it, i) => <li key={i} className="text-12 text-ink bg-canvas rounded p-2">· {it}</li>)}
        </ul>
      )}
    </div>
  );
}

function ResultBadge({ r }: { r: 'pass' | 'fail' | 'na' }) {
  const map = { pass: ['通过', 'text-ok border-ok/40 bg-ok/5'], fail: ['不通过', 'text-danger border-danger/40 bg-danger/5'], na: ['不适用', 'text-idle border-line bg-canvas'] } as const;
  const [label, cls] = map[r];
  return <span className={cn('px-2 py-0.5 rounded text-11 border', cls)}>{label}</span>;
}

function CaseAnalysis() {
  const caseAnalysis = useProjectStore((s) => s.caseAnalysis) as CaseAnalysisResult | null;
  const [seg, setSeg] = useState<'diff' | 'scene' | 'cross' | 'rules' | 'delivery'>('diff');

  const stats = useMemo(() => {
    if (!caseAnalysis) return { consistent: false, added: 0, changed: 0, anomalies: 0, pass: 0, fail: 0, na: 0, cases: 0 };
    const structs = caseAnalysis.structureChecks;
    const consistent = structs.every((s) => s.missingSheets.length === 0 && s.extraSheets.length === 0 && s.headerMismatch.length === 0);
    const added = caseAnalysis.versionDiffs.reduce((sum, v) => sum + v.addedSheets.length, 0);
    const changed = caseAnalysis.versionDiffs.reduce((sum, v) => sum + v.changedSheets.length, 0);
    const anomalies = caseAnalysis.sceneAnalyses.reduce((sum, s) => sum + s.findings.filter((f) => !f.ok).length, 0);
    const pass = caseAnalysis.ruleValidations.filter((r) => r.result === 'pass').length;
    const fail = caseAnalysis.ruleValidations.filter((r) => r.result === 'fail').length;
    const na = caseAnalysis.ruleValidations.filter((r) => r.result === 'na').length;
    return { consistent, added, changed, anomalies, pass, fail, na, cases: caseAnalysis.structureChecks.length };
  }, [caseAnalysis]);

  if (!caseAnalysis && seg !== 'delivery') return <EmptyHint text="案例分析未生成" />;

  return (
    <div className="space-y-4">
      {caseAnalysis && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-3"><div className="text-12 text-sub">案例数</div><div className="text-xl font-semibold text-ink mt-0.5">{stats?.cases}</div></Card>
          <Card className="p-3"><div className="text-12 text-sub">结构一致性</div><div className="text-xl font-semibold mt-0.5" style={{ color: stats?.consistent ? 'var(--c-ok)' : 'var(--c-danger)' }}>{stats?.consistent ? '全部一致' : '存在差异'}</div></Card>
          <Card className="p-3"><div className="text-12 text-sub">新增 / 变化 Sheet</div><div className="text-xl font-semibold text-ai mt-0.5">{stats?.added} / {stats?.changed}</div></Card>
          <Card className="p-3"><div className="text-12 text-sub">场景异常 / 注意点不通过</div><div className="text-xl font-semibold text-danger mt-0.5">{stats?.anomalies} / {stats?.fail}</div></Card>
        </div>
      )}

      <div className="flex gap-1 border-b border-line flex-wrap">
        {([['diff', '新老版本差异对比'], ['scene', '业务场景自主分析'], ['cross', '跨产品线类比'], ['rules', '历史注意点验证'], ['delivery', '交付目录比对']] as const).map(([k, label]) => (
          <button key={k} onClick={() => setSeg(k)} className={cn('px-3 py-2 text-13 font-medium border-b-2 -mb-px', seg === k ? 'border-ai text-ai' : 'border-transparent text-sub hover:text-ink')}>{label}</button>
        ))}
      </div>

      {caseAnalysis && seg === 'diff' && (
        <div className="space-y-3">
          {caseAnalysis.versionDiffs.map((v) => (
            <Card key={v.caseName} className="p-4">
              <div className="text-14 font-semibold text-ink mb-1">{v.caseName}</div>
              <div className="text-12 text-sub mb-2">对比旧版：{v.refName}</div>
              {v.addedSheets.length > 0 && (
                <div className="mb-2">
                  <div className="text-12 text-ok font-medium mb-1">新增 Sheet（{v.addedSheets.length}）</div>
                  <div className="flex flex-wrap gap-1">{v.addedSheets.map((s) => <span key={s} className="text-11 font-mono bg-ok/5 border border-ok/30 text-ok rounded px-1.5 py-0.5">{s}</span>)}</div>
                </div>
              )}
              {v.removedSheets.length > 0 && (
                <div className="mb-2">
                  <div className="text-12 text-danger font-medium mb-1">删除 Sheet（{v.removedSheets.length}）</div>
                  <div className="flex flex-wrap gap-1">{v.removedSheets.map((s) => <span key={s} className="text-11 font-mono bg-danger/5 border border-danger/30 text-danger rounded px-1.5 py-0.5">{s}</span>)}</div>
                </div>
              )}
              {v.changedSheets.length > 0 && (
                <div>
                  <div className="text-12 text-warn font-medium mb-1">变化 Sheet（{v.changedSheets.length}）</div>
                  <div className="space-y-2">
                    {v.changedSheets.map((cs) => (
                      <div key={cs.sheet} className="p-2 rounded border border-line bg-canvas">
                        <div className="text-13 font-mono text-ink mb-1">{cs.sheet}</div>
                        <ul className="space-y-0.5">{cs.changes.map((c, i) => <li key={i} className="text-12 text-sub">· {c}</li>)}</ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {v.addedSheets.length === 0 && v.removedSheets.length === 0 && v.changedSheets.length === 0 && (
                <div className="text-12 text-sub">与旧版参考无结构差异（或本案例无对应旧版参考）。</div>
              )}
            </Card>
          ))}
        </div>
      )}

      {caseAnalysis && seg === 'scene' && (
        <div className="space-y-3">
          {caseAnalysis.sceneAnalyses.map((s) => (
            <Card key={s.caseName} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-14 font-semibold text-ink">{s.caseName}</span>
                <Pill tone={s.timelineOk ? 'ok' : 'danger'}>{s.timelineOk ? '时间线自洽' : '存在待复核'}</Pill>
              </div>
              <div className="text-12 text-ai bg-ai/5 rounded p-2 mb-2">{s.aiSummary}</div>
              <div className="space-y-1.5">
                {s.findings.map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-12">
                    <span className={f.ok ? 'text-ok' : 'text-warn'}>{f.ok ? '✓' : '⚠'}</span>
                    <span className="text-ink font-medium w-44 shrink-0">{f.point}</span>
                    <span className="text-sub flex-1">{f.note}</span>
                    <RiskBadge risk={f.risk} />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {caseAnalysis && seg === 'cross' && (
        <div className="space-y-3">
          {caseAnalysis.crossProducts.map((c) => (
            <Card key={c.caseName} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-14 font-semibold text-ink">{c.caseName}</span>
                <RiskBadge risk={c.risk} />
              </div>
              <div className="text-12 text-ink bg-canvas rounded p-2 mb-2">{c.aiSummary}</div>
              <div className="text-12 text-sub">相似场景：{c.similarScene}</div>
              <div className="text-12 text-sub mt-1">结构一致性：{c.structureConsistent ? '一致' : '不一致'}</div>
              {c.newFields.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {c.newFields.map((nf) => <span key={nf} className="text-11 font-mono bg-warn/5 border border-warn/30 text-warn rounded px-1.5 py-0.5">{nf}</span>)}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {caseAnalysis && seg === 'rules' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Pill tone="ok">通过 {stats?.pass}</Pill>
            <Pill tone="danger">不通过 {stats?.fail}</Pill>
            <Pill tone="idle">不适用 {stats?.na}</Pill>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-12 border-collapse">
              <thead><tr className="text-sub border-b border-line"><th className="text-left py-2 pr-3">#</th><th className="text-left py-2 pr-3">注意点</th><th className="text-left py-2 pr-3">验证结果</th><th className="text-left py-2 pr-3">说明</th></tr></thead>
              <tbody>
                {caseAnalysis.ruleValidations.map((r) => (
                  <tr key={r.seq} className="border-b border-line/60">
                    <td className="py-1.5 pr-3 text-ink">{r.seq}</td>
                    <td className="py-1.5 pr-3 text-ink max-w-[320px]">{r.rule}</td>
                    <td className="py-1.5 pr-3"><ResultBadge r={r.result} /></td>
                    <td className="py-1.5 pr-3 text-sub max-w-[280px]">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {seg === 'delivery' && <DeliveryDiff />}
    </div>
  );
}

export default function Analysis() {
  const ensureCaseAnalysis = useProjectStore((s) => s.ensureCaseAnalysis);
  const ensureAnalysis = useProjectStore((s) => s.ensureAnalysis);
  const ensureDeliveryDiff = useProjectStore((s) => s.ensureDeliveryDiff);
  const [seg, setSeg] = useState<'case' | 'doc'>('case');
  useEffect(() => { ensureCaseAnalysis(); ensureAnalysis(); ensureDeliveryDiff(); /* eslint-disable-next-line */ }, []);

  return (
    <div className="space-y-5">
      <SectionTitle title="差异与适配分析" desc="案例四维度校验（结构/差异/场景/注意点）+ 交付数据目录级比对（日期/案例场景/单版本自洽）+ 文档字段适配（V1/V2）；一条链路贯通，规则引擎确定性判断 + 模拟 AI 语义分析" />

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-12 px-2.5 py-1 rounded-full bg-ai/10 text-ai border border-ai/30 font-medium">模拟 AI 分析（非真实大模型）</span>
        <div className="flex gap-1 border-b border-line flex-1">
          {([['case', '案例四维度校验'], ['doc', '文档字段适配（V1/V2）']] as const).map(([k, label]) => (
            <button key={k} onClick={() => setSeg(k)} className={cn('px-3 py-2 text-13 font-medium border-b-2 -mb-px', seg === k ? 'border-ai text-ai' : 'border-transparent text-sub hover:text-ink')}>{label}</button>
          ))}
        </div>
      </div>

      {seg === 'case' ? <CaseAnalysis /> : <DocFieldAnalysis />}
    </div>
  );
}
