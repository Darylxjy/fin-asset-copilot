import { useRef, useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { internalFields } from '../../data/internalFields';
import { externalV1 } from '../../data/externalV1';
import { externalV2 } from '../../data/externalV2';
import { csvDemoRaw } from '../../data/csvDemo';
import { systemRules } from '../../data/systemRules';
import { historyItems } from '../../data/history';
import { accountTemplates } from '../../data/accountDoc';
import { parseCsvRaw } from '../../lib/rules/demoValidate';
import { parseFile } from '../../lib/parser';
import { Card, SectionTitle, Pill, EmptyHint, cn } from '../common/ui';
import type { ApiInterface, DocSide, DocType, DocumentMeta, UnifiedField } from '../../types';
import LocalPreview from './LocalPreview';

function fieldTable(fields: UnifiedField[]) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-12 border-collapse">
        <thead>
          <tr className="text-sub border-b border-line">
            <th className="text-left py-2 pr-3 font-medium">字段名</th>
            <th className="text-left py-2 pr-3 font-medium">中文</th>
            <th className="text-left py-2 pr-3 font-medium">类型</th>
            <th className="text-left py-2 pr-3 font-medium">长度</th>
            <th className="text-left py-2 pr-3 font-medium">必填</th>
            <th className="text-left py-2 pr-3 font-medium">枚举</th>
            <th className="text-left py-2 pr-3 font-medium">说明</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((f) => (
            <tr key={f.fieldName} className="border-b border-line/60">
              <td className="py-1.5 pr-3 font-mono text-ink">{f.fieldName}</td>
              <td className="py-1.5 pr-3 text-ink">{f.chineseName || '-'}</td>
              <td className="py-1.5 pr-3 text-sub">{f.dataType || '-'}</td>
              <td className="py-1.5 pr-3 text-sub">{f.length || '-'}</td>
              <td className="py-1.5 pr-3"><span className={f.required === 'Y' ? 'text-danger' : 'text-sub'}>{f.required}</span></td>
              <td className="py-1.5 pr-3 text-sub max-w-[160px] truncate" title={f.enumValues.join(', ')}>{f.enumValues.length ? f.enumValues.join(', ') : '-'}</td>
              <td className="py-1.5 pr-3 text-sub max-w-[260px] truncate" title={f.description}>{f.description || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function interfaceView(ifaces: ApiInterface[]) {
  return (
    <div className="space-y-3">
      {ifaces.map((it, i) => (
        <div key={i} className="rounded border border-line bg-canvas p-3">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-13 font-semibold text-ink">{it.interfaceName}</span>
            {it.interfaceCode && <span className="font-mono text-11 text-idle">{it.interfaceCode}</span>}
          </div>
          {it.purpose && <div className="text-12 text-sub mt-0.5">用途：{it.purpose}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            <div>
              <div className="text-11 text-idle mb-1">请求字段（{it.requestFields.length}）</div>
              {it.requestFields.length ? fieldTable(it.requestFields) : <span className="text-12 text-idle">—</span>}
            </div>
            <div>
              <div className="text-11 text-idle mb-1">返回字段（{it.responseFields.length}）</div>
              {it.responseFields.length ? fieldTable(it.responseFields) : <span className="text-12 text-idle">—</span>}
            </div>
          </div>
          {it.errorCodes.length > 0 && (
            <div className="mt-2 text-12 text-sub">错误码：{it.errorCodes.join('；')}</div>
          )}
        </div>
      ))}
    </div>
  );
}

function docTypeLabel(t: DocType): string {
  switch (t) {
    case 'account_doc': return '账务文件文档';
    case 'accounting_spec': return '账务字段说明';
    case 'interface_doc': return '接口文档';
    case 'csv_demo': return 'CSV Demo';
    case 'system_dict': return '系统字段字典';
    case 'system_rule': return '系统业务规则';
    case 'history_case': return '历史案例';
    case 'case_file': return '案例文件';
    case 'reference': return '参考示例';
    default: return t;
  }
}

const SECTIONS: {
  key: string;
  title: string;
  hint: string;
  docTypes: DocType[];
  side: DocSide;
  fixedType: DocType;
  accept: string;
  multi: boolean;
}[] = [
  {
    key: 'accountDoc',
    title: '账务文件文档',
    hint: '上传资产方账务文件产品文档（含 账务文件明细_ 系列 sheet）。解析后在「字段模板」页展示字段定义。',
    docTypes: ['account_doc', 'accounting_spec'],
    side: 'external',
    fixedType: 'account_doc',
    accept: '.xlsx,.xls',
    multi: false,
  },
  {
    key: 'caseFile',
    title: '案例文件（Demo，可多个）',
    hint: '上传示例分期产品案例等交付案例文件（含 场景 sheet + 各账务 sheet）。解析后在「案例文件」页展示。',
    docTypes: ['case_file'],
    side: 'external',
    fixedType: 'case_file',
    accept: '.xlsx,.xls',
    multi: true,
  },
  {
    key: 'reference',
    title: '参考示例',
    hint: '上传同类文件做对比基准（旧版本 / 其他产品线示例），用于「新老版本差异对比」。',
    docTypes: ['reference'],
    side: 'external',
    fixedType: 'reference',
    accept: '.xlsx,.xls',
    multi: true,
  },
  {
    key: 'internal',
    title: '我方资料',
    hint: '示例账务系统字段字典、业务规则等。',
    docTypes: ['system_dict', 'system_rule'],
    side: 'internal',
    fixedType: 'system_dict',
    accept: '.csv,.json,.xlsx,.docx,.txt,.md',
    multi: true,
  },
  {
    key: 'history',
    title: '历史知识',
    hint: '历史资产接入案例与经验，可上传补充。',
    docTypes: ['history_case'],
    side: 'history',
    fixedType: 'history_case',
    accept: '.csv,.json,.txt,.md',
    multi: true,
  },
];

export default function Documents() {
  const documents = useProjectStore((s) => s.documents);
  const slots = useProjectStore((s) => s.slots);
  const addUploadedDoc = useProjectStore((s) => s.addUploadedDoc);
  const removeDoc = useProjectStore((s) => s.removeDoc);
  const runAnalysis = useProjectStore((s) => s.runAnalysis);

  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const seedFieldMap: Record<string, UnifiedField[]> = {
    'doc-internal-dict': internalFields,
    'doc-ext-v1': externalV1,
    'doc-ext-v2': externalV2,
  };

  function renderPreview(doc: DocumentMeta) {
    if (doc.parsedFields && doc.parsedFields.length) return fieldTable(doc.parsedFields);
    if (doc.interfaces && doc.interfaces.length) return interfaceView(doc.interfaces);
    if (seedFieldMap[doc.id]) return fieldTable(seedFieldMap[doc.id]);
    if (doc.id === 'doc-ext-demo') {
      const { headers, rows } = parseCsvRaw(doc.rawText || csvDemoRaw);
      return (
        <div className="overflow-x-auto">
          <table className="w-full text-12 border-collapse">
            <thead>
              <tr className="text-sub border-b border-line">{headers.map((h) => <th key={h} className="text-left py-2 pr-3 font-medium whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-b border-line/60">
                  {headers.map((h) => <td key={h} className="py-1.5 pr-3 text-sub whitespace-nowrap">{r[h]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (doc.id === 'doc-internal-rule') {
      return (
        <div className="space-y-2">
          {systemRules.map((r) => (
            <div key={r.id} className="p-2 rounded border border-line bg-canvas">
              <div className="text-13 text-ink font-medium">{r.id} · {r.title} <span className="text-11 text-idle">（{r.scope}）</span></div>
              <div className="text-12 text-sub mt-0.5">{r.rule}</div>
            </div>
          ))}
        </div>
      );
    }
    if (doc.id === 'doc-history') {
      return (
        <div className="space-y-2">
          {historyItems.map((h) => (
            <div key={h.id} className="p-2 rounded border border-line bg-canvas">
              <div className="text-13 text-ink font-medium">{h.id} · {h.assetName}</div>
              <div className="text-12 text-sub mt-0.5">{h.summary}</div>
            </div>
          ))}
        </div>
      );
    }
    if (doc.rawPreview) return <div className="text-12 text-sub whitespace-pre-wrap leading-6">{doc.rawPreview}</div>;
    if (doc.parseError) return <div className="text-12 text-danger">{doc.parseError}</div>;
    return <EmptyHint text="暂无可展示的结构化结果" />;
  }

  async function handleFiles(files: FileList | null, side: DocSide, docType: DocType) {
    if (!files || files.length === 0) return;
    setBusy(true);
    setMsg(null);
    for (const file of Array.from(files)) {
      const result = await parseFile(file);
      addUploadedDoc({
        name: file.name,
        side,
        docType,
        role: docType === 'accounting_spec' ? 'v2' : 'general',
        fileName: file.name,
        fileSize: file.size,
        result,
      });
      if (result.parseError) {
        setMsg({ ok: false, text: `${file.name} 解析失败：${result.parseError}` });
      } else {
        const sheetHint = result.sheetNames && result.sheetNames.length > 1 ? ` · 含 ${result.sheetNames.length} 个 sheet` : '';
        setMsg({ ok: true, text: `已解析 ${file.name}：字段 ${result.fields.length} 个 / 接口 ${result.interfaces.length} 个${sheetHint}${result.note ? ' · ' + result.note : ''} · 文件内容仅在当前页面内存中使用，刷新后需重新上传` });
      }
    }
    setBusy(false);
  }

  const activeNames = (() => {
    const nameOf = (id: string) => documents.find((d) => d.id === id)?.name ?? id;
    return { v1: nameOf(slots.v1), v2: nameOf(slots.v2), demo: nameOf(slots.demo), dict: nameOf(slots.dict) };
  })();

  return (
    <div className="space-y-6">
      <SectionTitle title="资料管理" desc="支持上传三类核心资料（账务文件文档 / 案例文件 / 参考示例）及其它我方与历史资料；亦可在下方直接预览本机真实文件" />

      {/* 本地真实文件只读预览 */}
      <LocalPreview />

      {/* 当前分析基准（向后兼容 V1/V2 差异分析） */}
      <Card className="p-4">
        <div className="text-13 font-medium text-ink mb-2">当前分析基准（账务字段差异分析将基于以下资料）</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-12">
          <div className="rounded border border-line bg-canvas p-2"><div className="text-idle text-11">旧版 V1</div><div className="text-ink mt-0.5 truncate" title={activeNames.v1}>{activeNames.v1}</div></div>
          <div className="rounded border border-line bg-canvas p-2"><div className="text-idle text-11">新版 V2</div><div className="text-ink mt-0.5 truncate" title={activeNames.v2}>{activeNames.v2}</div></div>
          <div className="rounded border border-line bg-canvas p-2"><div className="text-idle text-11">CSV Demo</div><div className="text-ink mt-0.5 truncate" title={activeNames.demo}>{activeNames.demo}</div></div>
          <div className="rounded border border-line bg-canvas p-2"><div className="text-idle text-11">我方字典</div><div className="text-ink mt-0.5 truncate" title={activeNames.dict}>{activeNames.dict}</div></div>
        </div>
        <button onClick={() => runAnalysis()} className="mt-3 px-3 py-1.5 rounded-md bg-ai text-white text-12 font-medium">重新运行分析</button>
      </Card>

      {msg && (
        <div className={cn('text-12 px-3 py-2 rounded-md', msg.ok ? 'bg-ok/10 text-ok' : 'bg-danger/10 text-danger')}>
          {msg.text}
        </div>
      )}

      {SECTIONS.map((z) => (
        <Card key={z.key} className="p-4">
          <div className="text-14 font-semibold text-ink mb-1">{z.title}</div>
          <div className="text-12 text-idle mb-3">{z.hint}</div>

          <Uploader busy={busy} accept={z.accept} multi={z.multi} onFiles={(files) => handleFiles(files, z.side, z.fixedType)} />

          <div className="space-y-2 mt-3">
            {documents.filter((d) => z.docTypes.includes(d.docType)).map((doc) => (
              <div key={doc.id} className="border border-line rounded-md">
                <button
                  onClick={() => setOpenId(openId === doc.id ? null : doc.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-canvas"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-13 font-medium text-ink truncate">{doc.name}</span>
                    {doc.version && <Pill tone="ai">v{doc.version}</Pill>}
                    <Pill tone="idle">{docTypeLabel(doc.docType)}</Pill>
                    {doc.uploaded ? <Pill tone="ai">已上传</Pill> : doc.desensitized ? <Pill tone="ok">已脱敏</Pill> : null}
                    {doc.sheetNames && doc.sheetNames.length > 1 && <Pill tone="idle">{doc.sheetNames.length} sheet</Pill>}
                  </div>
                  <div className="flex items-center gap-3 text-11 text-sub shrink-0">
                    <span>字段 {doc.fieldCount}</span>
                    <span className={cn(doc.parseStatus === 'done' ? 'text-ok' : 'text-danger')}>
                      {doc.parseStatus === 'done' ? '已解析' : '解析失败'}
                    </span>
                    <span>{openId === doc.id ? '收起' : '查看'}</span>
                  </div>
                </button>
                {openId === doc.id && (
                  <div className="px-3 pb-3 border-t border-line pt-2">
                    {doc.parseError && <div className="text-12 text-danger mb-2">{doc.parseError}</div>}
                    {doc.note && <div className="text-11 text-idle mb-2">{doc.note}</div>}
                    {renderPreview(doc)}
                    {doc.uploaded && (
                      <div className="flex items-center gap-2 mt-3">
                        <button onClick={() => removeDoc(doc.id)} className="px-2.5 py-1 rounded border border-line text-danger text-11">删除</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* 预置账务模板提示 */}
      <Card className="p-4 bg-canvas">
        <div className="text-12 text-sub">
          预置虚构「账务文件文档」共 <span className="text-ink font-medium">{accountTemplates.length}</span> 个 账务文件明细_ 模板（CUS/LOAN/FLOW/PLAN…），可在「字段模板」页查看；预置 <span className="text-ink font-medium">6</span> 个虚构案例文件可在「案例文件」页查看。姓名为「客户甲/乙」类占位符，证件号、手机号和卡号均已遮罩，禁止对应真实主体。
        </div>
      </Card>
    </div>
  );
}

function Uploader({ busy, onFiles, accept, multi }: { busy: boolean; onFiles: (files: FileList | null) => void; accept: string; multi: boolean }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); onFiles(e.dataTransfer.files); }}
      className={cn(
        'rounded-lg border-2 border-dashed p-4 text-center transition-colors',
        drag ? 'border-ai bg-ai/5' : 'border-line bg-canvas',
      )}
    >
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <button onClick={() => inputRef.current?.click()} disabled={busy} className="px-3 py-1.5 rounded-md bg-ai text-white text-12 font-medium disabled:opacity-50">
          {busy ? '解析中…' : '选择文件'}
        </button>
        <span className="text-11 text-idle">或将文件拖拽到此处{multi ? '（可多选）' : ''}</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        multiple={multi}
        accept={accept}
        className="hidden"
        onChange={(e) => { onFiles(e.target.files); e.currentTarget.value = ''; }}
      />
      <div className="text-11 text-idle mt-2">支持格式：{accept.replace(/\./g, '').toUpperCase()}</div>
    </div>
  );
}
