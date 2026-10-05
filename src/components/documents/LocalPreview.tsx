// ============================================================
// 本地真实文件只读预览（方案 §6 / 用户需求：允许本地加载真实文件预览）
// 用户选择本地真实 Excel（账务文件文档 / 案例文件 / 参考示例），
// 前端用 xlsx 解析并展示全部工作表，明确标注"未进入作品集数据"。
// 不持久化、不上传服务端。
// ============================================================
import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Card, SectionTitle } from '../common/ui';
import { sanitizeFieldValue, sanitizeSensitiveText } from '../../lib/privacy/sanitize';

interface SheetView {
  name: string;
  headers: string[];
  rows: string[][];
}

// 文本类文件（.dat/.txt/.csv）按分隔符切分；.dat 真实源文件使用 @!@ 分隔
function detectDelimiter(line: string): string {
  if (line.includes('@!@')) return '@!@';
  if (line.includes('\t')) return '\t';
  if (line.includes(',')) return ',';
  return ' ';
}

function parseTextToSheets(text: string, fileName: string): SheetView[] {
  const lines = text.split(/\r?\n/).map((l) => l.replace(/\r$/, ''));
  const nonEmpty = lines.filter((l, i) => l.length > 0 || i === 0);
  if (nonEmpty.length === 0) return [];
  const delim = detectDelimiter(nonEmpty[0]);
  const splitLine = (l: string) => (delim === ' ' ? [l] : l.split(delim));
  const headers = splitLine(nonEmpty[0]);
  const rows = nonEmpty.slice(1).map(splitLine);
  return [{ name: fileName, headers, rows }];
}

export default function LocalPreview() {
  const [fileName, setFileName] = useState('');
  const [sheets, setSheets] = useState<SheetView[]>([]);
  const [active, setActive] = useState(0);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  async function onFile(f: File | undefined) {
    if (!f) return;
    setErr('');
    setBusy(true);
    setFileName(f.name);
    setActive(0);
    try {
      const lower = f.name.toLowerCase();
      if (lower.endsWith('.csv') || lower.endsWith('.txt') || lower.endsWith('.dat')) {
        const text = await f.text();
        const views = parseTextToSheets(text, f.name);
        if (views.length === 0 || views[0].rows.length === 0) setErr('文件为空或无法识别分隔符');
        else setSheets(views);
      } else {
        const buf = await f.arrayBuffer();
        const wb = XLSX.read(buf, { type: 'array' });
        const views: SheetView[] = wb.SheetNames.map((name) => {
          const ws = wb.Sheets[name];
          const json = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, defval: '' }) as unknown[][];
          const headers = (json[0] ?? []).map((c) => String(c ?? ''));
          const rows = (json.slice(1) as unknown[][]).map((r) => (r as unknown[]).map((c) => (c == null ? '' : String(c))));
          return { name, headers, rows };
        });
        setSheets(views);
      }
    } catch (e) {
      setErr('解析失败：' + String(e));
      setSheets([]);
    } finally {
      setBusy(false);
    }
  }

  const cur = sheets[active];

  return (
    <Card className="p-4 border-ai/30 bg-ai/[0.03]">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="text-14 font-semibold text-ink">本地真实文件只读预览</div>
          <div className="text-12 text-idle mt-0.5">选择本机真实 Excel（账务文件 / 案例 / 参考示例）或源文件（.dat/.txt/.csv）查看完整结构；.dat 按 @!@ 分隔自动分列。文件仅在当前页面内存中解析，不上传、不写入 localStorage；关闭或刷新页面后清除</div>
        </div>
        <button onClick={() => ref.current?.click()} disabled={busy} className="px-3 py-1.5 rounded-md bg-ai text-white text-12 font-medium disabled:opacity-50">
          {busy ? '解析中…' : '选择真实文件'}
        </button>
      </div>
      <input
        ref={ref}
        type="file"
        accept=".xlsx,.xls,.csv,.txt,.dat"
        className="hidden"
        onChange={(e) => { onFile(e.target.files?.[0]); e.currentTarget.value = ''; }}
      />

      {err && <div className="text-12 text-danger mt-3 px-3 py-2 rounded-md bg-danger/10">{err}</div>}

      {sheets.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center gap-2 text-12 text-sub mb-2">
            <span className="px-2 py-0.5 rounded bg-ai/10 text-ai font-medium">本地只读</span>
            <span className="truncate" title={fileName}>{fileName}</span>
            <span className="text-idle">· {sheets.length} 个工作表</span>
          </div>
          <div className="flex flex-wrap gap-1 mb-2">
            {sheets.map((s, i) => (
              <button
                key={s.name}
                onClick={() => setActive(i)}
                className={`px-2.5 py-1 rounded-md text-11 border ${
                  i === active ? 'border-ai text-ai bg-ai/5' : 'border-line text-sub hover:bg-canvas'
                }`}
                title={`${s.name}（${s.rows.length} 行）`}
              >
                {s.name}
                <span className="text-idle ml-1">{s.rows.length}</span>
              </button>
            ))}
          </div>
          {cur && (
            <div className="overflow-x-auto border border-line rounded-md">
              <table className="w-full text-12 border-collapse">
                <thead>
                  <tr className="text-sub bg-canvas border-b border-line">
                    {cur.headers.map((h, i) => (
                      <th key={i} className="text-left py-2 pr-3 font-medium whitespace-nowrap">{sanitizeSensitiveText(h) || `列${i + 1}`}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cur.rows.slice(0, 50).map((r, i) => (
                    <tr key={i} className="border-b border-line/60">
                      {cur.headers.map((_, j) => (
                        <td key={j} className="py-1.5 pr-3 text-sub whitespace-nowrap max-w-[220px] truncate">{sanitizeFieldValue(cur.headers[j] ?? '', r[j] ?? '')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {cur.rows.length > 50 && (
                <div className="text-11 text-idle px-3 py-2 border-t border-line">仅预览前 50 行，共 {cur.rows.length} 行</div>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
