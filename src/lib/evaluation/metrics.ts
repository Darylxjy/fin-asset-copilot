import type { EvaluationCase, HumanDecision, OpenQuestion, FieldDiff, FieldMapping, CaseAnalysisResult } from '../../types';
import { externalV1 } from '../../data/externalV1';
import { externalV2, renameMap } from '../../data/externalV2';
import { internalFields } from '../../data/internalFields';
import { csvDemoRaw } from '../../data/csvDemo';
import { historyItems } from '../../data/history';
import { caseFiles } from '../../data/caseFiles';
import { referenceCase } from '../../data/reference';
import { accountTemplates } from '../../data/accountDoc';
import { bizRules } from '../../data/bizRules';
import { diffFields } from '../rules/diff';
import { buildMappings } from '../rules/mapping';
import { validateDemo, parseCsvRaw } from '../rules/demoValidate';
import { runCaseAnalysis } from '../rules/caseAnalysis';
import { mockProvider } from '../ai/mock';
import { goldenCases } from './goldenCases';

// ============================================================
// 评测执行与指标计算（方案 §21）
// 指标必须根据真实测试记录计算；无记录显示“暂无评测结果”
// ============================================================

export interface Dataset {
  oldFields: typeof externalV1;
  newFields: typeof externalV2;
  internalFields: typeof internalFields;
  demoRaw: string;
  renameMap: typeof renameMap;
  history: typeof historyItems;
}

export const dataset: Dataset = {
  oldFields: externalV1,
  newFields: externalV2,
  internalFields: internalFields,
  demoRaw: csvDemoRaw,
  renameMap,
  history: historyItems,
};

// 真实差异行（ground truth）用于召回/准确率计算
const GROUND_TRUTH_DIFF_KEYS = [
  'repaymentChannel', 'oldChannelCode', 'certId', 'custName', 'loanAmt',
  'srcChannel', 'remarkInfo', 'loanStatus', 'applyTime', 'yearRate',
];

export async function runGoldenCases(): Promise<EvaluationCase[]> {
  const diffs = diffFields({ oldFields: dataset.oldFields, newFields: dataset.newFields, renameMap: dataset.renameMap });
  const mappings = buildMappings(dataset.newFields, dataset.internalFields);
  const { issues } = validateDemo(dataset.demoRaw, dataset.newFields);
  const analysis = await mockProvider.analyze(dataset);
  const caseAnalysis: CaseAnalysisResult = runCaseAnalysis({
    cases: caseFiles,
    templates: accountTemplates,
    reference: referenceCase,
    rules: bizRules,
  });

  const diffByType: Record<string, number> = {};
  diffs.forEach((d) => d.diffType.forEach((t) => (diffByType[t] = (diffByType[t] || 0) + 1)));

  return goldenCases.map((c) => {
    const out: EvaluationCase = { ...c, actualResult: {}, pass: false };
    const inp = c.input as any;
    try {
      switch (c.caseType) {
        case 'FIELD_EXTRACTION': {
          let count = 0;
          if (inp.kind === 'csv') count = parseCsvRaw(dataset.demoRaw).headers.length;
          else if (inp.kind === 'spec') count = dataset.newFields.length;
          else if (inp.kind === 'json') count = JSON.parse(inp.text).length;
          out.actualResult = { count };
          out.pass = count === inp.expectedCount;
          break;
        }
        case 'DIFF_DETECTION': {
          const count = inp.metric === 'total' ? diffs.length : (diffByType[inp.metric] || 0);
          out.actualResult = { count };
          out.pass = count === inp.expected;
          break;
        }
        case 'FIELD_MAPPING': {
          const m = mappings.find((x) => x.externalField === inp.field);
          out.actualResult = { mappingStatus: m?.mappingStatus ?? 'NOT_FOUND' };
          out.pass = !!m && m.mappingStatus === inp.expectedStatus;
          break;
        }
        case 'BUSINESS_CONFLICT': {
          const exists = analysis.questions.some((q) => q.qid === inp.questionId);
          out.actualResult = { exists };
          out.pass = exists === inp.expectedResult.exists;
          break;
        }
        case 'DEMO_VALIDATION': {
          const count = inp.issueType ? issues.filter((i) => i.issueType === inp.issueType).length : issues.length;
          out.actualResult = { count };
          out.pass = count === inp.expected;
          break;
        }
        case 'QUESTION_GENERATION': {
          if (inp.questionId) {
            const exists = analysis.questions.some((q) => q.qid === inp.questionId);
            out.actualResult = { exists };
            out.pass = exists === inp.expectedResult.exists;
          } else {
            const count = analysis.questions.length;
            out.actualResult = { count };
            out.pass = count >= inp.expectedMin;
          }
          break;
        }
        case 'CASE_VALIDATION': {
          const ca = caseAnalysis;
          let pass = false;
          const act: Record<string, unknown> = {};
          if (inp.check === 'structure') {
            const sc = ca.structureChecks.find((s) => s.caseName === inp.caseName);
            const consistent = !!sc && sc.missingSheets.length === 0 && sc.extraSheets.length === 0 && sc.headerMismatch.length === 0;
            act.consistent = consistent;
            pass = consistent === (c.expectedResult?.consistent ?? true);
          } else if (inp.check === 'addedSheets') {
            const v = ca.versionDiffs.find((x) => x.caseName === inp.caseName);
            act.count = v?.addedSheets.length ?? 0;
            pass = (v?.addedSheets.length ?? 0) === c.expectedResult.count;
          } else if (inp.check === 'precision') {
            const v = ca.versionDiffs.find((x) => x.caseName === inp.caseName);
            const sheets = (v?.changedSheets ?? []).filter((cs) => cs.changes.some((ch) => /精度/.test(ch))).map((cs) => cs.sheet).sort();
            act.changedSheets = sheets;
            const exp = (c.expectedResult.changedSheets as string[]).slice().sort();
            pass = JSON.stringify(sheets) === JSON.stringify(exp);
          } else if (inp.check === 'refundNoFlow') {
            const s = ca.sceneAnalyses.find((x) => x.caseName === inp.caseName);
            const f = s?.findings.find((ff) => ff.point.includes('退款'));
            act.ok = f?.ok ?? false;
            pass = (f?.ok ?? false) === (c.expectedResult.ok ?? true);
          } else if (inp.check === 'timeline') {
            const s = ca.sceneAnalyses.find((x) => x.caseName === inp.caseName);
            act.timelineOk = s?.timelineOk;
            pass = (s?.timelineOk ?? false) === (c.expectedResult.timelineOk ?? true);
          } else if (inp.check === 'rule') {
            const r = ca.ruleValidations.find((x) => x.seq === inp.seq);
            act.result = r?.result;
            pass = r?.result === c.expectedResult.result;
          } else if (inp.check === 'crossRisk') {
            const cp = ca.crossProducts.find((x) => x.caseName === inp.caseName);
            act.risk = cp?.risk;
            pass = cp?.risk === c.expectedResult.risk;
          } else if (inp.check === 'inProgressBalance') {
            // 案例5：还款中（非终态）余额应 > 0
            const cf = caseFiles.find((x) => x.fileName === inp.caseName);
            const loanRow = cf?.sheets.find((s) => s.sheetName === 'LOAN')?.rows[0];
            const bal = loanRow ? Number(loanRow[6]) : 0;
            act.balance = bal;
            pass = bal > 0;
          } else if (inp.check === 'replanNoPenalty') {
            // 案例6：重组改分期、无逾期罚息、且时间线自洽（区别于案例3 重组+逾期罚息）
            const s = ca.sceneAnalyses.find((x) => x.caseName === inp.caseName);
            const cf = caseFiles.find((x) => x.fileName === inp.caseName);
            const hasPen = (cf?.sheets.find((sh) => sh.sheetName === 'FLOW')?.rows ?? []).some((r) => r[2] === '03' && Number(r[5]) > 0);
            act.timelineOk = s?.timelineOk;
            act.hasPenalty = hasPen;
            pass = (s?.timelineOk ?? false) === true && hasPen === false;
          }
          out.actualResult = act;
          out.pass = pass;
          break;
        }
      }
    } catch (e) {
      out.actualResult = { error: String(e) };
      out.pass = false;
    }
    return out;
  });
}

export interface Metrics {
  fieldExtractionAccuracy: number | null;
  diffRecall: number | null;
  diffPrecision: number | null;
  mappingAccuracy: number | null;
  questionValidRate: number | null;
  aiAdoptRate: number | null;
  aiModifyRate: number | null;
  noEvidenceRate: number | null;
  avgAnalysisTimeMs: number | null;
  hasRecord: boolean;
}

export function computeMetrics(
  cases: EvaluationCase[],
  analysis: { diffs: FieldDiff[]; mappings: FieldMapping[]; questions: OpenQuestion[] } | null,
  decisions: HumanDecision[],
  avgAnalysisTimeMs: number | null,
): Metrics {
  const hasRecord = cases.length > 0;
  if (!hasRecord) {
    return blankMetrics();
  }

  // 字段抽取准确率
  const exCases = cases.filter((c) => c.caseType === 'FIELD_EXTRACTION');
  let exCorrect = 0, exTotal = 0;
  exCases.forEach((c) => {
    const exp = (c.input as any).expectedCount as number;
    const act = (c.actualResult as any).count as number;
    exCorrect += c.pass ? exp : Math.min(act || 0, exp);
    exTotal += exp;
  });
  const fieldExtractionAccuracy = exTotal ? exCorrect / exTotal : null;

  // 差异召回 / 准确率（按行 key）
  const reportedKeys = new Set(
    diffFields({ oldFields: dataset.oldFields, newFields: dataset.newFields, renameMap: dataset.renameMap }).map((d) => d.fieldKey),
  );
  const gt = new Set(GROUND_TRUTH_DIFF_KEYS);
  let hit = 0;
  gt.forEach((k) => { if (reportedKeys.has(k)) hit++; });
  const diffRecall = gt.size ? hit / gt.size : null;
  const diffPrecision = reportedKeys.size ? hit / reportedKeys.size : null;

  // 映射准确率
  const mpCases = cases.filter((c) => c.caseType === 'FIELD_MAPPING');
  const mappingAccuracy = mpCases.length ? mpCases.filter((c) => c.pass).length / mpCases.length : null;

  // 无依据结论率
  let noEvidence = 0, totalItems = 0;
  if (analysis) {
    const items = [...analysis.diffs, ...analysis.mappings, ...analysis.questions];
    totalItems = items.length;
    noEvidence = items.filter((i) => !i.evidence || i.evidence.length === 0).length;
  }
  const noEvidenceRate = totalItems ? noEvidence / totalItems : null;

  // 人工反馈相关（HITL）
  const qDecisions = decisions.filter((d) => d.targetId.startsWith('Q_'));
  const aiDecisions = decisions;
  const adopt = aiDecisions.filter((d) => d.action === 'accept').length;
  const reject = aiDecisions.filter((d) => d.action === 'reject').length;
  const modify = aiDecisions.filter((d) => d.action === 'modify').length;
  const aiTotal = adopt + reject + modify;
  const qTotal = qDecisions.filter((d) => d.action === 'accept' || d.action === 'reject' || d.action === 'modify').length;

  const aiAdoptRate = aiTotal ? adopt / aiTotal : null;
  const aiModifyRate = aiTotal ? modify / aiTotal : null;
  const questionValidRate = qTotal ? qDecisions.filter((d) => d.action === 'accept').length / qTotal : null;

  return {
    fieldExtractionAccuracy,
    diffRecall,
    diffPrecision,
    mappingAccuracy,
    questionValidRate,
    aiAdoptRate,
    aiModifyRate,
    noEvidenceRate,
    avgAnalysisTimeMs,
    hasRecord: true,
  };
}

function blankMetrics(): Metrics {
  return {
    fieldExtractionAccuracy: null, diffRecall: null, diffPrecision: null, mappingAccuracy: null,
    questionValidRate: null, aiAdoptRate: null, aiModifyRate: null, noEvidenceRate: null,
    avgAnalysisTimeMs: null, hasRecord: false,
  };
}
