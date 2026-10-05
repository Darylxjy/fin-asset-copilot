import type { HistoryItem } from '../types';

// 历史资产接入知识（虚构脱敏）—— 3 条，供 RAG 检索与评测
export const historyItems: HistoryItem[] = [
  {
    id: 'H001',
    assetName: '示例机构甲',
    summary: '2025 年接入，金额字段由对方三位小数调整为我方两位，触发账务解析与对账精度改造。',
    mappings: [
      { external: 'loanAmt', internal: 'loan_amount', note: '对方三位小数，我方两位，需截断并评估对账差额' },
      { external: 'mobile', internal: 'mobile', note: '名称一致，直接映射' },
    ],
    confirmedQuestions: [
      { content: '金额精度差异是否在入账时四舍五入，还是截断处理？', target: '内部产品+研发' },
    ],
    systemChanges: ['账务解析增加精度转换层', '对账逻辑补充差额容忍配置'],
  },
  {
    id: 'H002',
    assetName: '示例机构乙',
    summary: '对方状态机含“处理中”态，我方无对应态，最终由贷后模块新增中间态落库。',
    mappings: [
      { external: 'status', internal: 'loan_status', note: '对方多一态，需映射补充' },
    ],
    confirmedQuestions: [
      { content: '处理中状态的借据是否参与计息与风控策略？', target: '内部产品+研发' },
    ],
    systemChanges: ['贷后状态机新增 PROCESSING 态', '风控策略补充中间态处理分支'],
  },
  {
    id: 'H003',
    assetName: '示例机构丙',
    summary: '对方利率以百分比给出，我方小数存储，接入时统一做除以 100 转换。',
    mappings: [
      { external: 'rate', internal: 'annual_rate', note: '百分比→小数，需规则转换' },
    ],
    confirmedQuestions: [
      { content: '百分比转小数是否统一在接入网关完成，避免下游重复转换？', target: '研发' },
    ],
    systemChanges: ['接入网关增加利率归一化规则', '文档补充字段单位说明'],
  },
];
