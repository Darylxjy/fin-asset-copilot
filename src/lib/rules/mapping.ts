import type { FieldMapping, MappingStatus, RiskLevel, UnifiedField } from '../../types';

// ============================================================
// 规则引擎：外部字段 → 我方字段映射（确定性判断，对应方案 §7/§15）
// 规则负责：名称匹配、类型/长度/枚举比对、是否存在我方字段
// 语义判断（如“名称不同含义相同”）由 AI 层补充依据
// ============================================================

// 外部字段名 -> 我方字段名（含义相同映射）
export const synonymMap: Record<string, string> = {
  loanId: 'loan_no',
  loanAmt: 'loan_amount',
  custName: 'borrower_name',
  certId: 'id_no',
  phone: 'mobile',
  loanTerm: 'loan_term',
  yearRate: 'annual_rate',
  loanStatus: 'loan_status',
  applyTime: 'apply_time',
  dueDate: 'due_date',
  repayType: 'repay_method',
  cardNo: 'bank_card',
  prodCode: 'product_code',
  srcChannel: 'channel',
  interestAmt: 'interest',
  overdueFlag: 'overdue_flag',
  remarkInfo: 'remark',
  principalBal: 'remaining_principal',
};

export function buildMappings(external: UnifiedField[], internal: UnifiedField[]): FieldMapping[] {
  const internalMap = new Map(internal.map((f) => [f.fieldName, f]));
  const out: FieldMapping[] = [];

  for (const ext of external) {
    const internalName = synonymMap[ext.fieldName] ?? (internalMap.has(ext.fieldName) ? ext.fieldName : undefined);
    if (!internalName || !internalMap.has(internalName)) {
      out.push(base({
        externalField: ext.fieldName,
        internalField: '',
        mappingStatus: 'INTERNAL_FIELD_MISSING',
        confidence: 0.95,
        reason: `我方示例账务系统 无对应字段，需评估是否新增系统字段或忽略`,
        risk: 'high',
      }));
      continue;
    }
    const intl = internalMap.get(internalName)!;
    const nameDiff = ext.fieldName !== intl.fieldName;
    if (ext.dataType !== intl.dataType || ext.length !== intl.length) {
      out.push(base({
        externalField: ext.fieldName,
        internalField: intl.fieldName,
        mappingStatus: 'TRANSFORM_REQUIRED',
        confidence: 0.85,
        reason: `字段${nameDiff ? '名称不同但含义相同' : '名称一致'}，需类型/精度转换（${ext.dataType}${ext.length} → ${intl.dataType}${intl.length}）`,
        risk: 'high',
      }));
      continue;
    }
    const enumDiff = ext.enumValues.length !== intl.enumValues.length ||
      ext.enumValues.some((e) => !intl.enumValues.includes(e));
    if (enumDiff) {
      out.push(base({
        externalField: ext.fieldName,
        internalField: intl.fieldName,
        mappingStatus: 'RULE_TRANSFORM_REQUIRED',
        confidence: 0.82,
        reason: `字段${nameDiff ? '名称不同但含义相同' : '名称一致'}，枚举存在差异，需规则转换`,
        risk: 'medium',
      }));
      continue;
    }
    out.push(base({
      externalField: ext.fieldName,
      internalField: intl.fieldName,
      mappingStatus: 'DIRECT_MAPPING',
      confidence: nameDiff ? 0.9 : 0.98,
      reason: nameDiff ? `字段名称不同但业务含义相同，可直接映射` : `字段名称与含义一致，直接映射`,
      risk: 'low',
    }));
  }
  return out;
}

function base(p: {
  externalField: string;
  internalField: string;
  mappingStatus: MappingStatus;
  confidence: number;
  reason: string;
  risk: RiskLevel;
}): FieldMapping {
  return {
    mappingId: `MAP_${p.externalField}`,
    externalField: p.externalField,
    internalField: p.internalField,
    mappingStatus: p.mappingStatus,
    confidence: p.confidence,
    reason: p.reason,
    aiSummary: '',
    riskLevel: p.risk,
    evidence: [],
    affectedModules: [],
  };
}
