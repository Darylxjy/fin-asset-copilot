import type { UnifiedField } from '../types';

// 对接方：示例资产方 A —— 账务字段说明 V1（虚构脱敏）
const SRC = '示例资产方账务说明V1';

export const externalV1: UnifiedField[] = [
  { fieldName: 'loanId', chineseName: '借据号', dataType: 'VARCHAR', length: '32', required: 'Y', description: '放款后生成的唯一借据编号', enumValues: [], exampleValue: 'DEMO-LOAN-1001', remark: '', source: SRC },
  { fieldName: 'loanAmt', chineseName: '放款金额', dataType: 'DECIMAL', length: '(12,2)', required: 'Y', description: '放款本金金额，单位元，两位小数', enumValues: [], exampleValue: '12000.00', remark: '', source: SRC },
  { fieldName: 'custName', chineseName: '客户姓名', dataType: 'VARCHAR', length: '64', required: 'Y', description: '借款人姓名', enumValues: [], exampleValue: '客户甲', remark: '', source: SRC },
  { fieldName: 'certNo', chineseName: '证件号码', dataType: 'VARCHAR', length: '18', required: 'Y', description: '借款人身份证号', enumValues: [], exampleValue: '110101********1234', remark: '', source: SRC },
  { fieldName: 'phone', chineseName: '手机号', dataType: 'VARCHAR', length: '11', required: 'Y', description: '借款人手机号', enumValues: [], exampleValue: '138****1234', remark: '', source: SRC },
  { fieldName: 'loanTerm', chineseName: '借款期限', dataType: 'INT', length: '', required: 'Y', description: '借款期数（月）', enumValues: [], exampleValue: '12', remark: '', source: SRC },
  { fieldName: 'yearRate', chineseName: '年化利率', dataType: 'DECIMAL', length: '(8,4)', required: 'Y', description: '年化利率，百分比形式，如 7.2 表示 7.2%', enumValues: [], exampleValue: '7.2000', remark: '文档以百分比给出', source: SRC },
  { fieldName: 'loanStatus', chineseName: '放款状态', dataType: 'VARCHAR', length: '20', required: 'Y', description: '放款处理最终状态', enumValues: ['INIT', 'SUCCESS', 'FAIL'], exampleValue: 'SUCCESS', remark: '', source: SRC },
  { fieldName: 'applyTime', chineseName: '申请时间', dataType: 'DATETIME', length: '', required: 'Y', description: '借款申请提交时间', enumValues: [], exampleValue: '2026-08-01 10:22:33', remark: '格式 YYYY-MM-DD HH:mm:ss', format: 'YYYY-MM-DD HH:mm:ss', source: SRC },
  { fieldName: 'dueDate', chineseName: '到期日', dataType: 'DATE', length: '', required: 'Y', description: '最后一期应还日期', enumValues: [], exampleValue: '2027-08-01', remark: '格式 YYYY-MM-DD', format: 'YYYY-MM-DD', source: SRC },
  { fieldName: 'repayType', chineseName: '还款方式', dataType: 'VARCHAR', length: '20', required: 'Y', description: 'EQUAL 等额 / INTEREST_FIRST 先息后本', enumValues: ['EQUAL', 'INTEREST_FIRST'], exampleValue: 'EQUAL', remark: '', source: SRC },
  { fieldName: 'cardNo', chineseName: '银行卡号', dataType: 'VARCHAR', length: '32', required: 'Y', description: '收款卡号', enumValues: [], exampleValue: '6222********1234', remark: '', source: SRC },
  { fieldName: 'prodCode', chineseName: '产品编码', dataType: 'VARCHAR', length: '20', required: 'Y', description: '产品编码', enumValues: [], exampleValue: 'DEMO_PRODUCT_01', remark: '', source: SRC },
  { fieldName: 'srcChannel', chineseName: '渠道', dataType: 'VARCHAR', length: '20', required: 'Y', description: '流量渠道编码', enumValues: ['APP', 'H5', 'API'], exampleValue: 'APP', remark: '', source: SRC },
  { fieldName: 'interestAmt', chineseName: '利息', dataType: 'DECIMAL', length: '(12,2)', required: 'N', description: '应收利息', enumValues: [], exampleValue: '650.00', remark: '', source: SRC },
  { fieldName: 'overdueFlag', chineseName: '是否逾期', dataType: 'VARCHAR', length: '1', required: 'Y', description: 'Y 逾期 / N 未逾期', enumValues: ['Y', 'N'], exampleValue: 'N', remark: '', source: SRC },
  { fieldName: 'remarkInfo', chineseName: '备注', dataType: 'VARCHAR', length: '255', required: 'N', description: '备注信息', enumValues: [], exampleValue: '', remark: '', source: SRC },
  { fieldName: 'oldChannelCode', chineseName: '旧渠道编码', dataType: 'VARCHAR', length: '10', required: 'N', description: '历史兼容渠道编码', enumValues: [], exampleValue: 'C01', remark: 'V2 计划废弃', source: SRC },
  { fieldName: 'principalBal', chineseName: '剩余本金', dataType: 'DECIMAL', length: '(12,2)', required: 'N', description: '当前剩余本金', enumValues: [], exampleValue: '9000.00', remark: '', source: SRC },
];
