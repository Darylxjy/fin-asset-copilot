import type { DemoIssue, RiskLevel, UnifiedField } from '../../types';

// ============================================================
// 规则引擎：CSV Demo 校验（确定性判断，对应方案 §4/§19 第 11-13 类）
// 校验：必填缺失、未定义枚举、列名与文档不一致、日期格式
// ============================================================

export interface DemoParseResult {
  headers: string[];
  rows: Record<string, string>[];
}

export function parseCsvRaw(raw: string): DemoParseResult {
  const lines = raw.trim().split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(',').map((h) => h.trim());
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(',');
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => (row[h] = (cells[idx] ?? '').trim()));
    rows.push(row);
  }
  return { headers, rows };
}

// 已知别名：Demo 列名 -> 文档字段名（用于识别“列名不一致”）
const aliasMap: Record<string, string> = {
  mobileNo: 'phone',
};

function checkDateFormat(format: string | undefined, value: string): boolean {
  if (!format) return true;
  if (format === 'YYYYMMDDHHmmss') return /^\d{14}$/.test(value);
  if (format === 'YYYY-MM-DD') return /^\d{4}-\d{2}-\d{2}$/.test(value);
  if (format === 'YYYY-MM-DD HH:mm:ss') return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value);
  return true;
}

export function validateDemo(raw: string, spec: UnifiedField[]): { issues: DemoIssue[]; parsed: DemoParseResult } {
  const parsed = parseCsvRaw(raw);
  const issues: DemoIssue[] = [];
  const specByName = new Map(spec.map((f) => [f.fieldName, f]));
  const headerSet = new Set(parsed.headers);

  // 1) 必填缺失 + 列名不一致
  for (const f of spec) {
    if (headerSet.has(f.fieldName)) continue;
    const aliased = Object.entries(aliasMap).find(([, target]) => target === f.fieldName);
    if (aliased) {
      issues.push({
        issueId: `DEMO_MISMATCH_${f.fieldName}`,
        issueType: 'COLUMN_NAME_MISMATCH',
        detail: `Demo 列名 "${aliased[0]}" 与文档字段 "${f.fieldName}"（${f.chineseName}）不一致，解析时需建立映射`,
        column: aliased[0],
        riskLevel: 'medium',
        evidence: [`${f.source} - ${f.fieldName}`, `demo_v2.csv 表头`],
      });
      continue;
    }
    if (f.required === 'Y') {
      issues.push({
        issueId: `DEMO_MISSING_${f.fieldName}`,
        issueType: 'MISSING_REQUIRED',
        detail: `Demo 缺少必填字段 "${f.fieldName}"（${f.chineseName}），V2 要求必填`,
        column: f.fieldName,
        riskLevel: 'high',
        evidence: [`${f.source} - ${f.fieldName} 必填=Y`, `demo_v2.csv 表头`],
      });
    }
  }

  // 2) 逐行校验：枚举、日期格式
  parsed.rows.forEach((row, idx) => {
    const rowRef = idx + 1;
    for (const f of spec) {
      const colName = headerSet.has(f.fieldName) ? f.fieldName : Object.keys(aliasMap).find((k) => aliasMap[k] === f.fieldName);
      if (!colName) continue;
      const val = (row[colName] ?? '').trim();
      if (!val) continue;
      if (f.enumValues.length && !f.enumValues.includes(val)) {
        issues.push({
          issueId: `DEMO_ENUM_${f.fieldName}_${rowRef}`,
          issueType: 'UNDEFINED_ENUM',
          detail: `第 ${rowRef} 行 ${f.chineseName}="${val}" 不在文档枚举 [${f.enumValues.join(', ')}] 内`,
          rowRef,
          column: f.fieldName,
          riskLevel: 'high',
          evidence: [`${f.source} - ${f.fieldName} 枚举定义`, `demo_v2.csv 第 ${rowRef} 行`],
        });
      }
      if (!checkDateFormat(f.format, val)) {
        issues.push({
          issueId: `DEMO_FMT_${f.fieldName}_${rowRef}`,
          issueType: 'FORMAT_ERROR',
          detail: `第 ${rowRef} 行 ${f.chineseName}="${val}" 不符合文档格式 ${f.format}`,
          rowRef,
          column: f.fieldName,
          riskLevel: 'medium',
          evidence: [`${f.source} - ${f.fieldName} 格式 ${f.format}`, `demo_v2.csv 第 ${rowRef} 行`],
        });
      }
    }
  });

  return { issues, parsed };
}
