const ID_CARD = /\b(\d{6})\d{8}(\d{3}[0-9Xx])\b/g;
const MOBILE = /\b(1[3-9]\d)\d{4}(\d{4})\b/g;
const LONG_NUMBER = /\b([1-9]\d{3})\d{8,11}(\d{4})\b/g;
const EMAIL = /\b([A-Za-z0-9._%+-])[A-Za-z0-9._%+-]*(@[A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/g;

/**
 * 对无字段上下文的文本做保守脱敏。顺序不可交换，避免身份证被误当成卡号。
 */
export function sanitizeSensitiveText(text: string): string {
  return text
    .replace(ID_CARD, '$1********$2')
    .replace(MOBILE, '$1****$2')
    .replace(LONG_NUMBER, '$1********$2')
    .replace(EMAIL, '$1***$2');
}

function maskName(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/^\u5ba2\u6237[\u7532\u4e59\u4e19\u4e01\u620a\u5df1\u5e9a\u8f9b\u58ec\u7678A-Z0-9]+$/.test(trimmed)) return trimmed;
  if (/^[\u4e00-\u9fff]{2,6}$/.test(trimmed)) return `${trimmed[0]}${'*'.repeat(trimmed.length - 1)}`;
  return trimmed.length <= 2 ? '*'.repeat(trimmed.length) : `${trimmed[0]}***${trimmed[trimmed.length - 1]}`;
}

export function sanitizeFieldValue(label: string, value: string): string {
  const key = label.toLowerCase();
  if (/(\u59d3\u540d|name|borrower|customer)/i.test(key)) return maskName(value);
  return sanitizeSensitiveText(value);
}
