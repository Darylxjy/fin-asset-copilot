import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnalysisResult, AIAnalyzeInput } from '../lib/ai/provider';
import { mockProvider } from '../lib/ai/mock';
import { runCaseAnalysis } from '../lib/rules/caseAnalysis';
import { runDeliveryDiff } from '../lib/rules/deliveryCompare';
import type { DeliveryDiffResult } from '../lib/rules/deliveryCompare';
import { externalV1 } from '../data/externalV1';
import { externalV2, renameMap } from '../data/externalV2';
import { internalFields } from '../data/internalFields';
import { csvDemoRaw } from '../data/csvDemo';
import { historyItems } from '../data/history';
import { caseFiles } from '../data/caseFiles';
import { referenceCase } from '../data/reference';
import { accountTemplates } from '../data/accountDoc';
import { bizRules } from '../data/bizRules';
import type {
  CaseAnalysisResult,
  DocRole,
  DocSide,
  DocType,
  DocumentMeta,
  HumanAction,
  HumanDecision,
  ProjectMeta,
  QuestionStatus,
  UnifiedField,
} from '../types';
import type { ParseResult } from '../lib/parser';

const nowIso = () => new Date().toISOString().slice(0, 19).replace('T', ' ');

const defaultDocuments: DocumentMeta[] = [
  { id: 'doc-internal-dict', name: '示例账务系统字段字典', side: 'internal', docType: 'system_dict', role: 'dict', uploadedAt: nowIso(), parseStatus: 'done', fieldCount: 20, desensitized: true },
  { id: 'doc-internal-rule', name: '示例账务系统业务规则', side: 'internal', docType: 'system_rule', uploadedAt: nowIso(), parseStatus: 'done', fieldCount: 6, desensitized: true },
  { id: 'doc-ext-v1', name: '示例资产方账务字段说明 V1', side: 'external', docType: 'accounting_spec', version: 'V1', role: 'v1', uploadedAt: nowIso(), parseStatus: 'done', fieldCount: 19, desensitized: true },
  { id: 'doc-ext-v2', name: '示例资产方账务字段说明 V2', side: 'external', docType: 'accounting_spec', version: 'V2', role: 'v2', uploadedAt: nowIso(), parseStatus: 'done', fieldCount: 19, desensitized: true },
  { id: 'doc-ext-demo', name: 'demo_v2.csv', side: 'external', docType: 'csv_demo', version: 'V2', role: 'demo', uploadedAt: nowIso(), parseStatus: 'done', fieldCount: 6, desensitized: true, rawText: csvDemoRaw },
  { id: 'doc-history', name: '历史资产接入知识', side: 'history', docType: 'history_case', uploadedAt: nowIso(), parseStatus: 'done', fieldCount: 3, desensitized: true },
];

const projectMeta: ProjectMeta = {
  name: '示例资产方 A 接入',
  assetName: '示例资产方 A',
  systemName: '示例账务系统',
  note: '完全虚构的演示资产方，所有数据已脱敏，禁止对应真实企业。',
};

interface Slots {
  v1: string; // 旧版字段说明文档 id
  v2: string; // 新版字段说明文档 id
  demo: string; // CSV Demo 文档 id
  dict: string; // 我方字段字典文档 id
}

const defaultSlots: Slots = {
  v1: 'doc-ext-v1',
  v2: 'doc-ext-v2',
  demo: 'doc-ext-demo',
  dict: 'doc-internal-dict',
};

function slotsWithoutUploads(slots: Slots): Slots {
  return {
    v1: slots.v1.startsWith('up-') ? defaultSlots.v1 : slots.v1,
    v2: slots.v2.startsWith('up-') ? defaultSlots.v2 : slots.v2,
    demo: slots.demo.startsWith('up-') ? defaultSlots.demo : slots.demo,
    dict: slots.dict.startsWith('up-') ? defaultSlots.dict : slots.dict,
  };
}

interface UploadParam {
  name: string;
  side: DocSide;
  docType: DocType;
  role?: DocRole;
  fileName?: string;
  fileSize?: number;
  result: ParseResult;
}

interface ProjectState {
  project: ProjectMeta;
  documents: DocumentMeta[];
  slots: Slots;
  analysis: AnalysisResult | null;
  caseAnalysis: CaseAnalysisResult | null;
  deliveryDiff: DeliveryDiffResult | null;
  decisions: HumanDecision[];
  caseQuestionStatus: Record<string, QuestionStatus>;
  analysisTimeMs: number | null;
  analyzed: boolean;
  runAnalysis: () => Promise<void>;
  ensureAnalysis: () => Promise<void>;
  runCaseAnalysisNow: () => void;
  ensureCaseAnalysis: () => void;
  runDeliveryDiffNow: () => void;
  ensureDeliveryDiff: () => void;
  addUploadedDoc: (p: UploadParam) => string;
  setSlot: (role: keyof Slots, docId: string) => void;
  removeDoc: (id: string) => void;
  recordDecision: (targetId: string, action: HumanAction, comment?: string) => void;
  setQuestionStatus: (qid: string, status: QuestionStatus) => void;
  setCaseQuestionStatus: (qid: string, status: QuestionStatus) => void;
  resetAll: () => void;
}

function buildRenameMap(oldF: UnifiedField[], newF: UnifiedField[], useSeed: boolean): Record<string, string> {
  if (useSeed) return renameMap;
  const map: Record<string, string> = {};
  const newByName = new Map(newF.filter((f) => f.chineseName).map((f) => [f.chineseName, f]));
  for (const o of oldF) {
    if (!o.chineseName) continue;
    const n = newByName.get(o.chineseName);
    if (n && n.fieldName !== o.fieldName) map[o.fieldName] = n.fieldName;
  }
  return map;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      project: projectMeta,
      documents: defaultDocuments,
      slots: defaultSlots,
      analysis: null,
      caseAnalysis: null,
      deliveryDiff: null,
      decisions: [],
      caseQuestionStatus: {},
      analysisTimeMs: null,
      analyzed: false,

      runAnalysis: async () => {
        const t0 = performance.now();
        const { slots, documents } = get();
        const find = (id: string) => documents.find((d) => d.id === id);

        const getFields = (id: string, fallback: UnifiedField[]): UnifiedField[] => {
          if (id === 'doc-ext-v1') return externalV1;
          if (id === 'doc-ext-v2') return externalV2;
          if (id === 'doc-internal-dict') return internalFields;
          const doc = find(id);
          return doc?.parsedFields ?? fallback;
        };
        const getDemoRaw = (id: string): string => {
          if (id === 'doc-ext-demo') return csvDemoRaw;
          return find(id)?.rawText ?? '';
        };

        const oldFields = getFields(slots.v1, externalV1);
        const newFields = getFields(slots.v2, externalV2);
        const internalFieldsData = getFields(slots.dict, internalFields);
        const demoRaw = getDemoRaw(slots.demo);
        const useSeed = slots.v1 === 'doc-ext-v1' && slots.v2 === 'doc-ext-v2';
        const renameMapUsed = buildRenameMap(oldFields, newFields, useSeed);

        const input: AIAnalyzeInput = {
          oldFields,
          newFields,
          renameMap: renameMapUsed,
          internalFields: internalFieldsData,
          demoRaw,
          history: historyItems,
        };
        const result = await mockProvider.analyze(input);
        const t1 = performance.now();
        set({ analysis: result, analyzed: true, analysisTimeMs: Math.round(t1 - t0), decisions: get().decisions });
      },

      ensureAnalysis: async () => {
        if (!get().analysis) await get().runAnalysis();
      },

      runCaseAnalysisNow: () => {
        // 联动：先确保交付目录级比对结果可用，将其派生的待确认问题并入案例四维度校验，
        // 形成「案例四维度 + 交付目录比对」一条完整分析链路（全程模拟数据）。
        if (!get().deliveryDiff) get().runDeliveryDiffNow();
        const dd = get().deliveryDiff;
        const result = runCaseAnalysis({
          cases: caseFiles,
          templates: accountTemplates,
          reference: referenceCase,
          rules: bizRules,
        });
        if (dd) result.openQuestions = [...result.openQuestions, ...dd.openQuestions];
        set({ caseAnalysis: result });
      },

      ensureCaseAnalysis: () => {
        if (!get().caseAnalysis) get().runCaseAnalysisNow();
      },

      runDeliveryDiffNow: () => {
        set({ deliveryDiff: runDeliveryDiff() });
      },

      ensureDeliveryDiff: () => {
        if (!get().deliveryDiff) get().runDeliveryDiffNow();
      },

      addUploadedDoc: (p) => {
        const id = `up-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const ifaceCount = p.result.interfaces.reduce((s, i) => s + i.requestFields.length + i.responseFields.length, 0);
        const doc: DocumentMeta = {
          id,
          name: p.name,
          side: p.side,
          docType: p.docType,
          uploadedAt: nowIso(),
          parseStatus: p.result.parseError ? 'error' : 'done',
          fieldCount: p.result.fields.length + ifaceCount,
          desensitized: false,
          uploaded: true,
          fileName: p.fileName,
          fileSize: p.fileSize,
          role: p.role,
          parsedFields: p.result.fields,
          interfaces: p.result.interfaces,
          rawText: p.result.rawText,
          rawPreview: p.result.rawPreview,
          parseError: p.result.parseError,
          sheetNames: p.result.sheetNames,
          note: p.result.note,
        };
        set((s) => {
          const documents = [...s.documents, doc];
          const slots = { ...s.slots };
          if (p.role && (p.role === 'v1' || p.role === 'v2' || p.role === 'demo' || p.role === 'dict')) {
            slots[p.role] = id;
          }
          return { documents, slots };
        });
        return id;
      },

      setSlot: (role, docId) => set((s) => ({ slots: { ...s.slots, [role]: docId } })),

      removeDoc: (id) =>
        set((s) => {
          const doc = s.documents.find((d) => d.id === id);
          if (!doc || !doc.uploaded) return {};
          const slots = { ...s.slots };
          (Object.keys(slots) as (keyof Slots)[]).forEach((k) => {
            if (slots[k] === id) slots[k] = defaultSlots[k];
          });
          return { documents: s.documents.filter((d) => d.id !== id), slots };
        }),

      recordDecision: (targetId, action, comment) => {
        set({
          decisions: [
            ...get().decisions.filter((d) => d.targetId !== targetId),
            { targetId, action, comment, timestamp: new Date().toISOString() },
          ],
        });
      },

      setQuestionStatus: (qid, status) => {
        const a = get().analysis;
        if (!a) return;
        set({
          analysis: {
            ...a,
            questions: a.questions.map((q) => (q.qid === qid ? { ...q, status } : q)),
          },
        });
      },

      setCaseQuestionStatus: (qid, status) => {
        set((s) => ({ caseQuestionStatus: { ...s.caseQuestionStatus, [qid]: status } }));
      },

      resetAll: () => {
        set({ analysis: null, caseAnalysis: null, decisions: [], analysisTimeMs: null, analyzed: false });
      },
    }),
    {
      name: 'fin-asset-copilot-store',
      version: 4,
      // 仅持久化用户产生的状态；确定性计算结果（analysis / caseAnalysis）不持久化，
      // 由 ensureAnalysis / ensureCaseAnalysis 在挂载时从当前源码数据重新计算，避免旧版脏状态（如“分分卡”文案）残留。
      partialize: (s) => ({
        // 用户上传内容只存在于当前页面内存，不写入 localStorage。
        documents: s.documents.filter((doc) => !doc.uploaded),
        slots: slotsWithoutUploads(s.slots),
        decisions: s.decisions,
        caseQuestionStatus: s.caseQuestionStatus,
      }),
      migrate: (persisted: any) => {
        // 升级时丢弃旧版可能持久化的计算结果（含已废弃演示文案），强制重新计算
        if (persisted && typeof persisted === 'object') {
          delete persisted.caseAnalysis;
          delete persisted.analysis;
          // 种子资料始终从当前脱敏源码重建；旧版上传内容不再保留。
          persisted.documents = defaultDocuments;
          persisted.slots = slotsWithoutUploads({ ...defaultSlots, ...(persisted.slots ?? {}) });
        }
        return persisted;
      },
    },
  ),
);
