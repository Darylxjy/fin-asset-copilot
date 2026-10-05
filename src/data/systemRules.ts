// 我方示例账务系统业务规则（虚构脱敏）—— 供 RAG / 规则引擎引用
export const systemRules: { id: string; title: string; rule: string; scope: string }[] = [
  { id: 'R001', title: '金额精度规则', rule: '所有金额字段（放款金额、利息、罚息、剩余本金）统一使用 DECIMAL(12,2)，即两位小数，对账与账务解析均按两位处理。', scope: '账务' },
  { id: 'R002', title: '借据状态机', rule: 'loan_status 仅含 INIT / SUCCESS / FAIL 三态，不存在“处理中”中间态；贷后与账务模块均按三态流转。', scope: '贷后,账务' },
  { id: 'R003', title: '利率存储规则', rule: 'annual_rate 以小数形式入库（如 0.0720 表示 7.20%），下游计息、展示时再乘以 100 转为百分比。', scope: '创单,账务' },
  { id: 'R004', title: '时间格式规则', rule: 'apply_time、create_time 使用 YYYY-MM-DD HH:mm:ss；due_date 使用 YYYY-MM-DD。解析器强校验格式。', scope: '创单,放款' },
  { id: 'R005', title: '必填约束', rule: '借据号、金额、姓名、证件号、手机号、期限、利率、状态、申请时间、到期日、还款方式、银行卡号、产品编码、逾期标志、备注为必填；其余可选。', scope: '创单' },
  { id: 'R006', title: '渠道枚举', rule: 'channel 仅允许 APP / H5 / API，超出需新增系统配置。', scope: '创单' },
];
