import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import type { ApiInterface, UnifiedField } from '../../types';

// ============================================================
// 文件解析模块（方案 §6 / §14 / §23）
// 支持格式：CSV / JSON / XLSX(账务文件) / DOCX(接口文档) / TXT / MD
// 统一输出 UnifiedField[] 与 ApiInterface[]
// 解析失败必须明确返回错误，不生成虚假结果
// ============================================================

export interface ParseResult {
  kind: 'fields' | 'interfaces' | 'mixed' | 'text';
  fields: UnifiedField[];
  interfaces: ApiInterface[];
  rawText: string; // CSV/JSON/TXT 完整原文
  rawPreview: string; // 文本预览（截断）
  parseError?: string; // 解析失败原因
  note?: string; // 解析提示（如“自动抽取，建议人工核对”）
  sheetNames?: string[]; // XLSX 全部工作表名（用于多 sheet 概览）
}

// 字段说明表列名别名（中英文均可命中）
const COL_ALIASES: Record<keyof Omit<UnifiedField, 'source'>, string[]> = {
  fieldName: ['fieldname', '字段名', '字段英文名', '英文', 'english', 'name', '列名'],
  chineseName: ['chinesename', '中文名', '字段中文名', '中文名称', 'cn', '名称'],
  dataType: ['datatype', '类型', '数据类型', 'type'],
  length: ['length', '长度', '精度'],
  required: ['required', '必填', '是否必填', '是否必填项'],
  description: ['description', '说明', '字段说明', '描述', '释义'],
  enumValues: ['enum', '枚举', '枚举值', '取值'],
  exampleValue: ['example', '示例', '示例值', '样例'],
  remark: ['remark', '备注', '注释'],
  format: ['format', '格式', '日期格式'],
};

function splitCsvLines(text: string): string[] {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter((l) => l.trim().length > 0);
}

function splitCsvRow(line: string): string[] {
  // 轻量 CSV 拆分（不处理引号内逗号，足够 Demo 字段表场景）
  return line.split(',').map((c) => c.trim());
}

function inferType(values: string[]): string {
  const nonEmpty = values.filter((v) => v && v.trim().length > 0);
  if (nonEmpty.length === 0) return 'VARCHAR(64)';
  if (nonEmpty.every((v) => /^\d+$/.test(v.trim()))) return 'BIGINT';
  if (nonEmpty.every((v) => /^-?\d+(\.\d+)?$/.test(v.trim()))) return 'DECIMAL(16,2)';
  if (nonEmpty.every((v) => /^\d{4}[-/]\d{2}[-/]\d{2}/.test(v.trim()))) return 'DATE';
  if (nonEmpty.every((v) => /^\d{14}$/.test(v.trim()))) return 'DATETIME';
  return 'VARCHAR(64)';
}

function emptyField(name: string, source: string): UnifiedField {
  return {
    fieldName: name,
    chineseName: '',
    dataType: '',
    length: '',
    required: 'N',
    description: '',
    enumValues: [],
    exampleValue: '',
    remark: '',
    source,
    format: '',
  };
}

// 将一行（键->值）映射为 UnifiedField
function rowToField(row: Record<string, string>, source: string): UnifiedField {
  const get = (key: keyof typeof COL_ALIASES): string => {
    const names = [key as string, ...COL_ALIASES[key]];
    for (const n of names) {
      const found = Object.keys(row).find((k) => k.toLowerCase().trim() === n.toLowerCase());
      if (found) return (row[found] ?? '').toString().trim();
    }
    return '';
  };
  const reqRaw = get('required').toUpperCase();
  const required: 'Y' | 'N' = reqRaw === 'Y' || reqRaw === '是' || reqRaw === '必填' ? 'Y' : 'N';
  const enumRaw = get('enumValues');
  const enumValues = enumRaw
    ? enumRaw.split(/[,，;/、|]/).map((e) => e.trim()).filter(Boolean)
    : [];
  return {
    fieldName: get('fieldName'),
    chineseName: get('chineseName'),
    dataType: get('dataType'),
    length: get('length'),
    required,
    description: get('description'),
    enumValues,
    exampleValue: get('exampleValue'),
    remark: get('remark'),
    source,
    format: get('format'),
  };
}

// 判断一组表头是否为“字段说明表”结构
function isFieldSpecHeader(headers: string[]): boolean {
  const lower = headers.map((h) => h.toLowerCase().trim());
  const hit = (key: keyof typeof COL_ALIASES) =>
    [key as string, ...COL_ALIASES[key]].some((a) => lower.includes(a.toLowerCase()));
  // 字段英文名 +（中文名 或 类型 或 说明）任一出现，即视为字段说明表
  return hit('fieldName') && (hit('chineseName') || hit('dataType') || hit('description'));
}

function rowsToFields(rows: Record<string, string>[], source: string): UnifiedField[] {
  if (rows.length === 0) return [];
  const headers = Object.keys(rows[0]);
  const sampleByCol: Record<string, string[]> = {};
  headers.forEach((h) => (sampleByCol[h] = rows.slice(0, 5).map((r) => (r[h] ?? '').trim())));
  return headers
    .filter((h) => h.trim().length > 0)
    .map((h) => {
      const f = emptyField(h.trim(), source);
      f.chineseName = '';
      f.dataType = inferType(sampleByCol[h]);
      f.exampleValue = (rows[0][h] ?? '').toString().trim();
      f.description = `数据列「${h.trim()}」，示例值 ${(rows[0][h] ?? '').toString().trim()}`.slice(0, 120);
      return f;
    });
}

const PREVIEW_LIMIT = 1200;

function preview(text: string): string {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length > PREVIEW_LIMIT ? t.slice(0, PREVIEW_LIMIT) + '…' : t;
}

// ---------------- CSV ----------------
export function parseCsvText(text: string, source: string): ParseResult {
  const lines = splitCsvLines(text);
  if (lines.length === 0) {
    return { kind: 'text', fields: [], interfaces: [], rawText: text, rawPreview: '', parseError: '文件为空，未识别到任何内容' };
  }
  const headers = splitCsvRow(lines[0]);
  const rows: Record<string, string>[] = lines.slice(1).map((line) => {
    const cells = splitCsvRow(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => (row[h] = cells[i] ?? ''));
    return row;
  });

  if (isFieldSpecHeader(headers)) {
    const fields = rows.map((r) => rowToField(r, source)).filter((f) => f.fieldName);
    return {
      kind: 'fields',
      fields,
      interfaces: [],
      rawText: text,
      rawPreview: preview(text),
      note: '识别为字段说明表，已按列名映射为统一字段对象',
    };
  }
  // 数据表（如 CSV Demo）：抽取表头字段 + 保留原文供 Demo 校验
  const fields = rowsToFields(rows.length ? rows : [Object.fromEntries(headers.map((h) => [h, '']))], source);
  return {
    kind: 'fields',
    fields,
    interfaces: [],
    rawText: text,
    rawPreview: preview(text),
    note: '识别为数据表，已按表头生成字段占位定义；原文保留用于 Demo 校验',
  };
}

// ---------------- JSON ----------------
export function parseJsonText(text: string, source: string): ParseResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (e) {
    return { kind: 'text', fields: [], interfaces: [], rawText: text, rawPreview: preview(text), parseError: 'JSON 解析失败：' + String(e) };
  }
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0) {
    return { kind: 'text', fields: [], interfaces: [], rawText: text, rawPreview: preview(text), parseError: 'JSON 为空数组' };
  }
  const first = arr[0] as Record<string, unknown>;
  const hasInterfaceShape =
    typeof first === 'object' && first !== null && ('interfaceName' in first || 'interfaceCode' in first || '接口名' in first || '接口名称' in first);
  if (hasInterfaceShape) {
    const interfaces = arr
      .map((it) => toInterface(it as Record<string, unknown>, source))
      .filter((i) => i.interfaceName);
    return { kind: 'interfaces', fields: [], interfaces, rawText: text, rawPreview: preview(text), note: '识别为接口定义数组' };
  }
  const hasFieldShape =
    typeof first === 'object' && first !== null && ('fieldName' in first || '字段名' in first);
  if (hasFieldShape) {
    const fields = arr
      .map((it) => rowToField(it as Record<string, string>, source))
      .filter((f) => f.fieldName);
    return { kind: 'fields', fields, interfaces: [], rawText: text, rawPreview: preview(text), note: '识别为字段对象数组' };
  }
  // 数据行
  const rows = arr.map((it) => Object.fromEntries(Object.entries(it as Record<string, unknown>).map(([k, v]) => [k, v == null ? '' : String(v)])));
  const fields = rowsToFields(rows, source);
  return { kind: 'fields', fields, interfaces: [], rawText: text, rawPreview: preview(text), note: '识别为数据对象数组，已按键生成字段' };
}

function toInterface(obj: Record<string, unknown>, source: string): ApiInterface {
  const get = (k: string): string => {
    const keys = [k, '接口' + k, k + 'Name', k + '名称', k + 'Code', k + '代码', k + '说明', k + '描述', k + '用途'];
    for (const kk of keys) if (typeof obj[kk] === 'string') return obj[kk] as string;
    for (const kk of Object.keys(obj)) if (kk.toLowerCase().includes(k.toLowerCase())) return String(obj[kk]);
    return '';
  };
  const toFields = (v: unknown): UnifiedField[] => {
    if (!Array.isArray(v)) return [];
    return v
      .map((it) => rowToField(it as Record<string, string>, source))
      .filter((f) => f.fieldName);
  };
  return {
    interfaceName: get('interfaceName') || get('name') || '未命名接口',
    interfaceCode: get('interfaceCode') || get('code') || '',
    purpose: get('purpose') || get('desc') || get('description') || get('用途') || '',
    requestFields: toFields(obj.requestFields ?? obj.请求字段 ?? obj.请求参数),
    responseFields: toFields(obj.responseFields ?? obj.返回字段 ?? obj.响应字段 ?? obj.返回参数),
    errorCodes: Array.isArray(obj.errorCodes ?? obj.错误码) ? (obj.errorCodes as unknown[]).map(String) : [],
    businessRules: Array.isArray(obj.businessRules ?? obj.业务规则) ? (obj.businessRules as unknown[]).map(String) : [],
  };
}

// ---------------- XLSX ----------------
export async function parseXlsxBuffer(buf: ArrayBuffer, source: string): Promise<ParseResult> {
  try {
    const wb = XLSX.read(buf, { type: 'array' });
    const firstSheet = wb.SheetNames[0];
    if (!firstSheet) return { kind: 'text', fields: [], interfaces: [], rawText: '', rawPreview: '', parseError: 'Excel 无可读工作表' };
    const sheet = wb.Sheets[firstSheet];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
    if (rows.length === 0) return { kind: 'text', fields: [], interfaces: [], rawText: '', rawPreview: '', parseError: 'Excel 首个工作表无数据行' };
    const normalized = rows.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v == null ? '' : String(v)])));
    const headers = Object.keys(normalized[0]);
    if (isFieldSpecHeader(headers)) {
      const fields = normalized.map((r) => rowToField(r, source)).filter((f) => f.fieldName);
      return { kind: 'fields', fields, interfaces: [], rawText: JSON.stringify(normalized), rawPreview: `Excel 工作表「${firstSheet}」共 ${rows.length} 行`, note: '识别为字段说明表，已按列名映射' };
    }
    const fields = rowsToFields(normalized, source);
    return { kind: 'fields', fields, interfaces: [], rawText: JSON.stringify(normalized), rawPreview: `Excel 工作表「${firstSheet}」共 ${rows.length} 行`, sheetNames: wb.SheetNames };
  } catch (e) {
    return { kind: 'text', fields: [], interfaces: [], rawText: '', rawPreview: '', parseError: 'Excel 解析失败：' + String(e) };
  }
}

// ---------------- DOCX ----------------
export async function parseDocxBuffer(buf: ArrayBuffer): Promise<string> {
  const res = await mammoth.extractRawText({ arrayBuffer: buf });
  return res.value;
}

// ---------------- 接口文档启发式抽取 ----------------
const TYPE_HINT = /^(VARCHAR|CHAR|DECIMAL|NUMERIC|INT|BIGINT|SMALLINT|DATE|DATETIME|TIMESTAMP|BOOLEAN|STRING|TEXT)/i;
const FIELD_LINE = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*[:：]?\s*(.*)$/;

export function parseApiDoc(text: string, source: string): ApiInterface[] {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const interfaces: ApiInterface[] = [];
  let cur: ApiInterface | null = null;
  let section: 'req' | 'resp' | 'err' | null = null;

  const pushCur = () => {
    if (cur && (cur.interfaceName || cur.requestFields.length || cur.responseFields.length)) interfaces.push(cur);
    cur = null;
    section = null;
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    // 接口标题：含“接口”且简短，或 markdown 标题
    const isTitle =
      /^(#{1,4}\s*|接口\s*[:：]|API\s*[:：]|Interface\s*[:：])/i.test(line) ||
      (line.includes('接口') && line.length <= 40 && !line.includes('字段'));
    if (isTitle) {
      pushCur();
      cur = { interfaceName: line.replace(/^#+\s*/, '').replace(/^接口\s*[:：]/i, '').trim(), interfaceCode: '', purpose: '', requestFields: [], responseFields: [], errorCodes: [], businessRules: [] };
      continue;
    }
    if (!cur) {
      // 没有标题但出现请求/返回字段块，开一个匿名接口
      if (/请求字段|请求参数|入参/.test(line)) {
        cur = { interfaceName: '未命名接口', interfaceCode: '', purpose: '', requestFields: [], responseFields: [], errorCodes: [], businessRules: [] };
        section = 'req';
        continue;
      }
      if (/返回字段|返回参数|响应字段|出参/.test(line)) {
        if (!cur) cur = { interfaceName: '未命名接口', interfaceCode: '', purpose: '', requestFields: [], responseFields: [], errorCodes: [], businessRules: [] };
        section = 'resp';
        continue;
      }
      continue;
    }
    if (/用途|描述|说明/.test(line) && cur && !cur.purpose) {
      const m = line.match(/[:：]\s*(.+)$/);
      if (m) cur.purpose = m[1].trim();
      continue;
    }
    if (/请求字段|请求参数|入参/.test(line)) { section = 'req'; continue; }
    if (/返回字段|返回参数|响应字段|出参/.test(line)) { section = 'resp'; continue; }
    if (/错误码/.test(line)) { section = 'err'; continue; }

    const fm = line.match(FIELD_LINE);
    if (fm && section && (section === 'req' || section === 'resp')) {
      const name = fm[1];
      const rest = fm[2];
      const typeMatch = rest.match(TYPE_HINT);
      const dataType = typeMatch ? typeMatch[0].toUpperCase() : '';
      const cnMatch = rest.match(/[\u4e00-\u9fa5]+/);
      const chineseName = cnMatch ? cnMatch[0] : '';
      const desc = rest.replace(TYPE_HINT, '').replace(/[\u4e00-\u9fa5]+/, '').trim();
      const f: UnifiedField = { ...emptyField(name, source), dataType, chineseName, description: desc, required: /必填/.test(rest) ? 'Y' : 'N' };
      if (section === 'req') cur.requestFields.push(f);
      else cur.responseFields.push(f);
      continue;
    }
    if (section === 'err') {
      const em = line.match(/^(\w+)\s*[-—:：]?\s*(.*)$/);
      if (em) cur.errorCodes.push(`${em[1]}${em[2] ? ' ' + em[2].trim() : ''}`);
    }
  }
  pushCur();
  return interfaces;
}

// ---------------- 文件调度 ----------------
export async function parseFile(file: File): Promise<ParseResult> {
  const name = file.name.toLowerCase();
  const source = file.name;
  try {
    if (name.endsWith('.csv')) {
      const text = await file.text();
      return parseCsvText(text, source);
    }
    if (name.endsWith('.json')) {
      const text = await file.text();
      return parseJsonText(text, source);
    }
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
      const buf = await file.arrayBuffer();
      return parseXlsxBuffer(buf, source);
    }
    if (name.endsWith('.docx')) {
      const buf = await file.arrayBuffer();
      const text = await parseDocxBuffer(buf);
      const interfaces = parseApiDoc(text, source);
      const fields = extractInlineFields(text, source);
      const kind: ParseResult['kind'] = interfaces.length ? 'interfaces' : fields.length ? 'fields' : 'text';
      return {
        kind,
        fields,
        interfaces,
        rawText: text,
        rawPreview: preview(text),
        note: interfaces.length ? '已从 Word 文档抽取接口定义（启发式，建议人工核对）' : '未识别到结构化接口，已保留原文预览',
      };
    }
    if (name.endsWith('.txt') || name.endsWith('.md')) {
      const text = await file.text();
      const interfaces = parseApiDoc(text, source);
      if (interfaces.length) {
        return { kind: 'interfaces', fields: [], interfaces, rawText: text, rawPreview: preview(text), note: '已从文本抽取接口定义（启发式，建议人工核对）' };
      }
      return parseCsvText(text, source);
    }
    return { kind: 'text', fields: [], interfaces: [], rawText: '', rawPreview: '', parseError: `不支持的文件类型：${file.name}（支持 CSV / JSON / XLSX / DOCX / TXT / MD）` };
  } catch (e) {
    return { kind: 'text', fields: [], interfaces: [], rawText: '', rawPreview: '', parseError: '文件读取或解析失败：' + String(e) };
  }
}

// 从长文本中按“字段名 类型 说明”模式抽取零散字段
function extractInlineFields(text: string, source: string): UnifiedField[] {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const fields: UnifiedField[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    const fm = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s+([A-Z]+[A-Z0-9(),\s]*)\s+([\u4e00-\u9fa5].*)$/);
    if (fm) {
      fields.push({ ...emptyField(fm[1], source), dataType: fm[2].trim().toUpperCase(), description: fm[3].trim() });
    }
  }
  return fields;
}
