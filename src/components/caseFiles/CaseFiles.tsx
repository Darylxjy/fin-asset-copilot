// ============================================================
// 案例文件页（v2 新增）
// 展示预置虚构案例文件：每个含 场景 sheet（业务时间线）+ 各账务 sheet（表头+数据）。
// 对应真实工作流"解析并填充的案例文件"。
// ============================================================
import { useState } from 'react';
import { caseFiles } from '../../data/caseFiles';
import { Card, SectionTitle, Pill, cn } from '../common/ui';

function SheetTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  if (rows.length === 0) {
    return <div className="text-12 text-idle px-3 py-6 text-center border border-line rounded-md bg-canvas">该 sheet 无数据行（空表头模板）</div>;
  }
  return (
    <div className="overflow-x-auto border border-line rounded-md">
      <table className="w-full text-12 border-collapse">
        <thead>
          <tr className="text-sub bg-canvas border-b border-line">
            {headers.map((h, i) => (
              <th key={i} className="text-left py-2 pr-3 font-medium whitespace-nowrap">{h || `列${i + 1}`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-line/60">
              {headers.map((_, j) => (
                <td key={j} className="py-1.5 pr-3 text-sub whitespace-nowrap max-w-[220px] truncate" title={r[j]}>{r[j] || <span className="text-idle">—</span>}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CaseFiles() {
  const [idx, setIdx] = useState(0);
  const [sheetIdx, setSheetIdx] = useState(0);
  const cf = caseFiles[idx];
  const activeSheet = cf.sheets[sheetIdx] ?? cf.sheets[0];

  function selectCase(i: number) {
    setIdx(i);
    setSheetIdx(0);
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title="案例文件"
        desc="预置虚构交付案例文件，每个含 场景 sheet（业务时间线）+ 各账务 sheet（CUS/LOAN/FLOW/PLAN…）。可直接查看解析并填充后的完整结构。"
      />

      {/* 案例切换 */}
      <div className="flex flex-wrap gap-2">
        {caseFiles.map((c, i) => (
          <button
            key={c.fileName}
            onClick={() => selectCase(i)}
            className={cn(
              'px-3 py-1.5 rounded-md text-12 border font-medium',
              i === idx ? 'border-ai text-ai bg-ai/5' : 'border-line text-sub hover:bg-canvas',
            )}
          >
            {c.fileName}
          </button>
        ))}
      </div>

      {/* 场景 sheet 时间线 */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-13 font-semibold text-ink">场景 sheet（业务时间线）</div>
          <Pill tone="idle">{cf.scene.length} 个事件</Pill>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-12 border-collapse">
            <thead>
              <tr className="text-sub border-b border-line">
                <th className="text-left py-2 pr-3 font-medium">业务时间</th>
                <th className="text-left py-2 pr-3 font-medium">事件</th>
                <th className="text-left py-2 pr-3 font-medium">出资方贷款单号</th>
                <th className="text-left py-2 pr-3 font-medium">说明</th>
              </tr>
            </thead>
            <tbody>
              {cf.scene.map((s, i) => (
                <tr key={i} className="border-b border-line/60">
                  <td className="py-1.5 pr-3 font-mono text-ink whitespace-nowrap">{s.bizDate}</td>
                  <td className="py-1.5 pr-3 text-ink whitespace-nowrap">{s.event}</td>
                  <td className="py-1.5 pr-3 font-mono text-sub whitespace-nowrap max-w-[240px] truncate" title={s.loanNo}>{s.loanNo}</td>
                  <td className="py-1.5 pr-3 text-sub">{s.detail || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 账务 sheet tabs */}
      <div>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-12 text-sub">账务 sheet：</span>
          {cf.sheets.map((s, i) => (
            <button
              key={s.sheetName}
              onClick={() => setSheetIdx(i)}
              className={cn(
                'px-2.5 py-1 rounded-md text-11 border font-mono',
                i === sheetIdx ? 'border-ai text-ai bg-ai/5' : 'border-line text-sub hover:bg-canvas',
              )}
              title={`${s.cnName}（${s.rows.length} 行）`}
            >
              {s.sheetName}
              <span className="text-idle ml-1">{s.rows.length}</span>
            </button>
          ))}
        </div>
        {activeSheet && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-13 font-medium text-ink">
                <span className="font-mono text-ai">{activeSheet.sheetName}</span>
                <span className="text-sub ml-2">{activeSheet.cnName}</span>
              </div>
              <Pill tone="idle">{activeSheet.rows.length} 行</Pill>
            </div>
            <SheetTable headers={activeSheet.headers} rows={activeSheet.rows} />
          </Card>
        )}
      </div>

      <div className={cn('text-12 text-idle px-3 py-2 rounded-md bg-canvas')}>
        提示：案例为虚构脱敏数据，场景描述与各账务 sheet 数据自洽，用于演示「业务场景自主分析」。如需查看真实案例文件，请到「资料管理」页使用「本地真实文件只读预览」。
      </div>
    </div>
  );
}
