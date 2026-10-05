// ============================================================
// 字段模板页（v2 新增）
// 展示解析自虚构账务文件文档的 12 个 账务文件明细_ sheet 模板。
// fileCode 对应案例文件中的 sheet 名（如 LOAN）。
// ============================================================
import { useState } from 'react';
import { accountTemplates } from '../../data/accountDoc';
import { Card, SectionTitle, Pill, cn } from '../common/ui';

export default function FieldTemplate() {
  const [openKey, setOpenKey] = useState<string | null>(accountTemplates[0]?.sheetKey ?? null);

  return (
    <div className="space-y-6">
      <SectionTitle
        title="字段模板"
        desc="解析自预置虚构「账务文件文档」的 12 个 账务文件明细_ sheet 模板。fileCode（如 LOAN）即案例文件中对应 sheet 的名称；下方中文名为字段表头。"
      />

      <div className="space-y-3">
        {accountTemplates.map((t) => {
          const open = openKey === t.sheetKey;
          return (
            <Card key={t.sheetKey} className="p-4">
              <button
                onClick={() => setOpenKey(open ? null : t.sheetKey)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-13 font-semibold text-ai">{t.fileCode}</span>
                  <span className="text-13 text-ink truncate">{t.cnName}</span>
                  <Pill tone="idle">{t.fields.length} 字段</Pill>
                </div>
                <span className="text-11 text-sub shrink-0">{open ? '收起' : '展开字段'}</span>
              </button>

              {open && (
                <div className="mt-3 border-t border-line pt-3">
                  <div className="text-11 text-idle mb-2">来源 sheet：{t.sheetKey}（文件传输说明→文件名称 {t.fileCode}）</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-12 border-collapse">
                      <thead>
                        <tr className="text-sub border-b border-line">
                          <th className="text-left py-2 pr-3 font-medium">字段名</th>
                          <th className="text-left py-2 pr-3 font-medium">中文名</th>
                          <th className="text-left py-2 pr-3 font-medium">类型</th>
                          <th className="text-left py-2 pr-3 font-medium">必填</th>
                          <th className="text-left py-2 pr-3 font-medium">枚举</th>
                          <th className="text-left py-2 pr-3 font-medium">说明</th>
                        </tr>
                      </thead>
                      <tbody>
                        {t.fields.map((f) => (
                          <tr key={f.fieldName} className="border-b border-line/60">
                            <td className="py-1.5 pr-3 font-mono text-ink">{f.fieldName}</td>
                            <td className="py-1.5 pr-3 text-ink">{f.chineseName}</td>
                            <td className="py-1.5 pr-3 text-sub">{f.dataType}</td>
                            <td className="py-1.5 pr-3"><span className={f.required === 'Y' ? 'text-danger' : 'text-sub'}>{f.required}</span></td>
                            <td className="py-1.5 pr-3 text-sub max-w-[160px] truncate" title={f.enumValues.join(', ')}>{f.enumValues.length ? f.enumValues.join(', ') : '-'}</td>
                            <td className="py-1.5 pr-3 text-sub max-w-[280px] truncate" title={f.description || f.remark}>{f.description || f.remark || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className={cn('text-12 text-idle px-3 py-2 rounded-md bg-canvas')}>
        提示：上述模板为虚构脱敏数据，结构还原真实工作流。如需查看真实文件结构，请到「资料管理」页使用「本地真实文件只读预览」。
      </div>
    </div>
  );
}
