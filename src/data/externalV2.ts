import type { UnifiedField } from '../types';

// 对接方：示例资产方 A —— 账务字段说明 V2（虚构脱敏）
// 相对 V1 人为设置差异，覆盖方案 §19 第 1-10、16 类
const SRC = '示例资产方账务说明V2';

export const externalV2: UnifiedField[] = [
  // 1) 字段名称不同但含义相同（映射侧）：phone 对应我方 mobile
  { fieldName: 'loanId', chineseName: '借据号', dataType: 'VARCHAR', length: '32', required: 'Y', description: '放款后生成的唯一借据编号', enumValues: [], exampleValue: 'DEMO-LOAN-1001', remark: '', source: SRC },
  // 6) 金额精度 2->4
  { fieldName: 'loanAmt', chineseName: '放款金额', dataType: 'DECIMAL', length: '(16,4)', required: 'Y', description: '放款本金金额，单位元，四位小数', enumValues: [], exampleValue: '12000.0000', remark: '精度由两位提升至四位', source: SRC },
  // 3) 中文名变化：客户姓名 -> 借款人姓名
  { fieldName: 'custName', chineseName: '借款人姓名', dataType: 'VARCHAR', length: '64', required: 'Y', description: '借款人姓名', enumValues: [], exampleValue: '客户甲', remark: '', source: SRC },
  // 4) 字段名称变化：certNo -> certId（含义相同）
  { fieldName: 'certId', chineseName: '证件号码', dataType: 'VARCHAR', length: '18', required: 'Y', description: '借款人身份证号', enumValues: [], exampleValue: '110101********1234', remark: '', source: SRC },
  { fieldName: 'phone', chineseName: '手机号', dataType: 'VARCHAR', length: '11', required: 'Y', description: '借款人手机号', enumValues: [], exampleValue: '138****1234', remark: '', source: SRC },
  { fieldName: 'loanTerm', chineseName: '借款期限', dataType: 'INT', length: '', required: 'Y', description: '借款期数（月）', enumValues: [], exampleValue: '12', remark: '', source: SRC },
  { fieldName: 'yearRate', chineseName: '年化利率', dataType: 'DECIMAL', length: '(8,4)', required: 'Y', description: '年化利率，百分比形式，如 7.2 表示 7.2%，需除以 100 后入库', enumValues: [], exampleValue: '7.2000', remark: '文档以百分比给出', source: SRC },
  // 5) 字段说明变化 + 10) 枚举新增 PROCESSING
  { fieldName: 'loanStatus', chineseName: '借据状态', dataType: 'VARCHAR', length: '20', required: 'Y', description: '借据生命周期状态，含处理中', enumValues: ['INIT', 'SUCCESS', 'FAIL', 'PROCESSING'], exampleValue: 'SUCCESS', remark: '新增 PROCESSING 处理中态', source: SRC },
  // 7) 日期格式变化：YYYY-MM-DD HH:mm:ss -> YYYYMMDDHHmmss
  { fieldName: 'applyTime', chineseName: '申请时间', dataType: 'DATETIME', length: '', required: 'Y', description: '借款申请提交时间', enumValues: [], exampleValue: '20260801102233', remark: '格式变更为 YYYYMMDDHHmmss（去分隔符）', format: 'YYYYMMDDHHmmss', source: SRC },
  { fieldName: 'dueDate', chineseName: '到期日', dataType: 'DATE', length: '', required: 'Y', description: '最后一期应还日期', enumValues: [], exampleValue: '2027-08-01', remark: '格式 YYYY-MM-DD', format: 'YYYY-MM-DD', source: SRC },
  { fieldName: 'repayType', chineseName: '还款方式', dataType: 'VARCHAR', length: '20', required: 'Y', description: 'EQUAL 等额 / INTEREST_FIRST 先息后本', enumValues: ['EQUAL', 'INTEREST_FIRST'], exampleValue: 'EQUAL', remark: '', source: SRC },
  { fieldName: 'cardNo', chineseName: '银行卡号', dataType: 'VARCHAR', length: '32', required: 'Y', description: '收款卡号', enumValues: [], exampleValue: '6222********1234', remark: '', source: SRC },
  { fieldName: 'prodCode', chineseName: '产品编码', dataType: 'VARCHAR', length: '20', required: 'Y', description: '产品编码', enumValues: [], exampleValue: 'DEMO_PRODUCT_01', remark: '', source: SRC },
  // 8) 必填 -> 非必填
  { fieldName: 'srcChannel', chineseName: '渠道', dataType: 'VARCHAR', length: '20', required: 'N', description: '流量渠道编码', enumValues: ['APP', 'H5', 'API'], exampleValue: 'APP', remark: '由必填改为非必填', source: SRC },
  { fieldName: 'interestAmt', chineseName: '利息', dataType: 'DECIMAL', length: '(12,2)', required: 'N', description: '应收利息', enumValues: [], exampleValue: '650.00', remark: '', source: SRC },
  { fieldName: 'overdueFlag', chineseName: '是否逾期', dataType: 'VARCHAR', length: '1', required: 'Y', description: 'Y 逾期 / N 未逾期', enumValues: ['Y', 'N'], exampleValue: 'N', remark: '', source: SRC },
  // 9) 非必填 -> 必填
  { fieldName: 'remarkInfo', chineseName: '备注', dataType: 'VARCHAR', length: '255', required: 'Y', description: '备注信息，V2 起必填', enumValues: [], exampleValue: '渠道活动', remark: '由非必填改为必填', source: SRC },
  { fieldName: 'principalBal', chineseName: '剩余本金', dataType: 'DECIMAL', length: '(12,2)', required: 'N', description: '当前剩余本金', enumValues: [], exampleValue: '9000.00', remark: '', source: SRC },
  // 1) 字段新增
  { fieldName: 'repaymentChannel', chineseName: '还款渠道', dataType: 'VARCHAR', length: '20', required: 'N', description: '用户实际还款渠道，如 ALIPAY / WECHAT / BANK', enumValues: ['ALIPAY', 'WECHAT', 'BANK'], exampleValue: 'ALIPAY', remark: 'V2 新增，我方暂无对应字段', source: SRC },
];

// 跨版本重命名映射（用于正确识别 FIELD_NAME_CHANGED 而非 新增+删除）
export const renameMap: Record<string, string> = {
  certNo: 'certId',
};
