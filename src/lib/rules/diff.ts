import type { DiffType, FieldDiff, RiskLevel, UnifiedField, MappingStatus } from '../../types';

// ============================================================
// 规则引擎：新旧版本字段差异比对（确定性判断，对应方案 §8/§9）
// 比较整行字段定义，不只看 fieldName
// ============================================================

const riskOrder: RiskLevel[] = ['low', 'medium', 'high'];
function maxRisk(a: RiskLevel, b: RiskLevel): RiskLevel {
  return riskOrder.indexOf(a) >= riskOrder.indexOf(b) ? a : b;
}

function enumDiff(oldE: string[], newE: string[]): { added: string[]; removed: string[] } {
  const added = newE.filter((e) => !oldE.includes(e));
  const removed = oldE.filter((e) => !newE.includes(e));
  return { added, removed };
}

export interface DiffInput {
  oldFields: UnifiedField[];
  newFields: UnifiedField[];
  renameMap?: Record<string, string>; // 旧名 -> 新名，用于识别 FIELD_NAME_CHANGED
}

export function diffFields(input: DiffInput): FieldDiff[] {
  const { oldFields, newFields, renameMap = {} } = input;
  const oldMap = new Map(oldFields.map((f) => [f.fieldName, f]));
  const newMap = new Map(newFields.map((f) => [f.fieldName, f]));

  const renameTargets = new Set(Object.values(renameMap));
  const renameSources = new Set(Object.keys(renameMap));

  const result: FieldDiff[] = [];

  // 1) 删除：仅存在于旧版
  for (const f of oldFields) {
    if (!newMap.has(f.fieldName) && !renameSources.has(f.fieldName)) {
      result.push(buildDiff({
        fieldKey: f.fieldName,
        diffType: ['REMOVED'],
        oldField: f,
        newField: undefined,
        findings: [`字段 ${f.fieldName}（${f.chineseName}）在 V2 中已删除`],
        risk: 'medium',
        status: 'MANUAL_REVIEW_REQUIRED',
      }));
    }
  }

  // 2) 新增：仅存在于新版（排除重命名目标）
  for (const f of newFields) {
    if (!oldMap.has(f.fieldName) && !renameTargets.has(f.fieldName)) {
      result.push(buildDiff({
        fieldKey: f.fieldName,
        diffType: ['ADDED'],
        oldField: undefined,
        newField: f,
        findings: [`新增字段 ${f.fieldName}（${f.chineseName}）`],
        risk: 'medium',
        status: 'MANUAL_REVIEW_REQUIRED',
      }));
    }
  }

  // 3) 匹配字段（同名字段 + 重命名字段）逐属性比对
  const matched: { oldF: UnifiedField; newF: UnifiedField }[] = [];
  for (const f of newFields) {
    if (oldMap.has(f.fieldName)) {
      matched.push({ oldF: oldMap.get(f.fieldName)!, newF: f });
    }
  }
  for (const [oldName, newName] of Object.entries(renameMap)) {
    const oldF = oldMap.get(oldName);
    const newF = newMap.get(newName);
    if (oldF && newF) matched.push({ oldF, newF });
  }

  for (const { oldF, newF } of matched) {
    const types: DiffType[] = [];
    const findings: string[] = [];
    let risk: RiskLevel = 'low';

    if (renameMap[oldF.fieldName] === newF.fieldName) {
      types.push('FIELD_NAME_CHANGED');
      findings.push(`字段名称变化：${oldF.fieldName} → ${newF.fieldName}（含义一致）`);
      risk = maxRisk(risk, 'low');
    }
    if (oldF.chineseName !== newF.chineseName) {
      types.push('CHINESE_NAME_CHANGED');
      findings.push(`中文名称：${oldF.chineseName} → ${newF.chineseName}`);
      risk = maxRisk(risk, 'low');
    }
    if (oldF.dataType !== newF.dataType) {
      types.push('TYPE_CHANGED');
      findings.push(`数据类型：${oldF.dataType} → ${newF.dataType}`);
      risk = maxRisk(risk, 'high');
    }
    if (oldF.length !== newF.length) {
      types.push('LENGTH_CHANGED');
      findings.push(`长度/精度：${oldF.length || '-'} → ${newF.length || '-'}`);
      risk = maxRisk(risk, 'medium');
    }
    if (oldF.required !== newF.required) {
      types.push('REQUIRED_CHANGED');
      findings.push(`必填规则：${oldF.required} → ${newF.required}`);
      risk = maxRisk(risk, 'medium');
    }
    if (oldF.description !== newF.description) {
      types.push('DESCRIPTION_CHANGED');
      findings.push(`字段说明发生变化`);
      risk = maxRisk(risk, 'medium');
    }
    const ed = enumDiff(oldF.enumValues, newF.enumValues);
    if (ed.added.length || ed.removed.length) {
      types.push('ENUM_CHANGED');
      if (ed.added.length) findings.push(`枚举新增：${ed.added.join(', ')}`);
      if (ed.removed.length) findings.push(`枚举移除：${ed.removed.join(', ')}`);
      risk = maxRisk(risk, 'medium');
    }
    if ((oldF.format || '') !== (newF.format || '')) {
      types.push('DESCRIPTION_CHANGED');
      findings.push(`日期/时间格式：${oldF.format || '-'} → ${newF.format || '-'}`);
      risk = maxRisk(risk, 'medium');
    }
    if (oldF.remark !== newF.remark) {
      types.push('REMARK_CHANGED');
      findings.push(`备注发生变化`);
      risk = maxRisk(risk, 'low');
    }

    if (types.length > 0) {
      result.push(buildDiff({
        fieldKey: newF.fieldName,
        diffType: types,
        oldField: oldF,
        newField: newF,
        findings,
        risk,
        status: 'MANUAL_REVIEW_REQUIRED',
      }));
    }
  }

  return result;
}

function buildDiff(p: {
  fieldKey: string;
  diffType: DiffType[];
  oldField?: UnifiedField;
  newField?: UnifiedField;
  findings: string[];
  risk: RiskLevel;
  status: MappingStatus;
}): FieldDiff {
  return {
    diffId: `DIFF_${p.fieldKey}`,
    fieldKey: p.fieldKey,
    diffType: p.diffType,
    oldField: p.oldField,
    newField: p.newField,
    ruleFindings: p.findings,
    aiSummary: '',
    evidence: [],
    riskLevel: p.risk,
    status: p.status,
    affectedModules: [],
  };
}
