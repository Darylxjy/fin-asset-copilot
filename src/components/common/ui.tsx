import React from 'react';
import type { DiffType, MappingStatus, QuestionStatus, QuestionType, RiskLevel } from '../../types';

export function cn(...parts: (string | false | undefined | null)[]): string {
  return parts.filter(Boolean).join(' ');
}

const riskStyle: Record<RiskLevel, string> = {
  low: 'bg-ok/10 text-ok border-ok/30',
  medium: 'bg-warn/10 text-warn border-warn/30',
  high: 'bg-danger/10 text-danger border-danger/30',
};
const riskLabel: Record<RiskLevel, string> = { low: '低风险', medium: '中风险', high: '高风险' };

export function RiskBadge({ risk, className }: { risk: RiskLevel; className?: string }) {
  return <span className={cn('inline-flex items-center px-2 py-0.5 rounded border text-12 font-medium', riskStyle[risk], className)}>{riskLabel[risk]}</span>;
}

export const MAPPING_LABEL: Record<MappingStatus, string> = {
  DIRECT_MAPPING: '可直接适配',
  TRANSFORM_REQUIRED: '需要转换',
  RULE_TRANSFORM_REQUIRED: '需要规则转换',
  INTERNAL_FIELD_MISSING: '我方缺失',
  EXTERNAL_INFO_INSUFFICIENT: '资料不足',
  BUSINESS_CONFLICT: '存在冲突',
  MANUAL_REVIEW_REQUIRED: '待人工确认',
};
const mappingStyle: Record<MappingStatus, string> = {
  DIRECT_MAPPING: 'bg-ok/10 text-ok border-ok/30',
  TRANSFORM_REQUIRED: 'bg-warn/10 text-warn border-warn/30',
  RULE_TRANSFORM_REQUIRED: 'bg-warn/10 text-warn border-warn/30',
  INTERNAL_FIELD_MISSING: 'bg-danger/10 text-danger border-danger/30',
  EXTERNAL_INFO_INSUFFICIENT: 'bg-idle/10 text-idle border-idle/30',
  BUSINESS_CONFLICT: 'bg-danger/10 text-danger border-danger/30',
  MANUAL_REVIEW_REQUIRED: 'bg-ai/10 text-ai border-ai/30',
};
export function MappingStatusBadge({ status, className }: { status: MappingStatus; className?: string }) {
  return <span className={cn('inline-flex items-center px-2 py-0.5 rounded border text-12 font-medium', mappingStyle[status], className)}>{MAPPING_LABEL[status]}</span>;
}

export const QTYPE_LABEL: Record<QuestionType, string> = { external: '资产方', internal: '内部产品/业务', dev: '研发' };
const qtypeStyle: Record<QuestionType, string> = {
  external: 'bg-ai/10 text-ai border-ai/30',
  internal: 'bg-ok/10 text-ok border-ok/30',
  dev: 'bg-warn/10 text-warn border-warn/30',
};
export function QTypeBadge({ type, className }: { type: QuestionType; className?: string }) {
  return <span className={cn('inline-flex items-center px-2 py-0.5 rounded border text-12 font-medium', qtypeStyle[type], className)}>{QTYPE_LABEL[type]}</span>;
}

export const QSTATUS_LABEL: Record<QuestionStatus, string> = {
  pending: '待确认', confirmed: '已确认', modified: '已修改', rejected: '已驳回',
};
const qstatusStyle: Record<QuestionStatus, string> = {
  pending: 'bg-warn/10 text-warn border-warn/30',
  confirmed: 'bg-ok/10 text-ok border-ok/30',
  modified: 'bg-ai/10 text-ai border-ai/30',
  rejected: 'bg-danger/10 text-danger border-danger/30',
};
export function QStatusBadge({ status, className }: { status: QuestionStatus; className?: string }) {
  return <span className={cn('inline-flex items-center px-2 py-0.5 rounded border text-12 font-medium', qstatusStyle[status], className)}>{QSTATUS_LABEL[status]}</span>;
}

export const DIFF_LABEL: Record<DiffType, string> = {
  ADDED: '新增', REMOVED: '删除', FIELD_NAME_CHANGED: '字段名变化', CHINESE_NAME_CHANGED: '中文名变化',
  TYPE_CHANGED: '类型变化', LENGTH_CHANGED: '精度/长度变化', REQUIRED_CHANGED: '必填变化',
  DESCRIPTION_CHANGED: '说明变化', ENUM_CHANGED: '枚举变化', REMARK_CHANGED: '备注变化',
};
const diffStyle = 'bg-ai/10 text-ai border-ai/30';
export function DiffTypeBadge({ type, className }: { type: DiffType; className?: string }) {
  return <span className={cn('inline-flex items-center px-1.5 py-0.5 rounded border text-12 font-medium', diffStyle, className)}>{DIFF_LABEL[type]}</span>;
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('bg-surface border border-line rounded-lg', className)}>{children}</div>;
}

export function SectionTitle({ title, desc, right }: { title: string; desc?: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-3">
      <div>
        <h2 className="text-16 font-semibold text-ink">{title}</h2>
        {desc && <p className="text-13 text-sub mt-0.5">{desc}</p>}
      </div>
      {right}
    </div>
  );
}

export function EmptyHint({ text }: { text: string }) {
  return <div className="text-13 text-sub text-center py-10 border border-dashed border-line rounded-lg bg-canvas">{text}</div>;
}

export function Pill({ children, tone = 'idle' }: { children: React.ReactNode; tone?: 'idle' | 'ai' | 'ok' | 'warn' | 'danger' }) {
  const tones = {
    idle: 'bg-idle/10 text-idle',
    ai: 'bg-ai/10 text-ai',
    ok: 'bg-ok/10 text-ok',
    warn: 'bg-warn/10 text-warn',
    danger: 'bg-danger/10 text-danger',
  };
  return <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-12 font-medium', tones[tone])}>{children}</span>;
}
