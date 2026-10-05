import type { UnifiedField } from '../types';

// 我方系统：示例账务系统 —— 字段字典（虚构脱敏）
// source 统一标识，供判断依据（evidence）引用
const SRC = '示例账务系统字段字典';

export const internalFields: UnifiedField[] = [
  { fieldName: 'loan_no', chineseName: '借据号', dataType: 'VARCHAR', length: '32', required: 'Y', description: '资产方放款后生成的唯一借据编号，用于全生命周期追踪', enumValues: [], exampleValue: 'DEMO-INTERNAL-1001', remark: '主键，不可变更', source: SRC },
  { fieldName: 'loan_amount', chineseName: '放款金额', dataType: 'DECIMAL', length: '(12,2)', required: 'Y', description: '实际放款本金金额，单位元，固定两位小数', enumValues: [], exampleValue: '12000.00', remark: '账务与对账均以两位小数处理', source: SRC },
  { fieldName: 'borrower_name', chineseName: '借款人姓名', dataType: 'VARCHAR', length: '64', required: 'Y', description: '借款人真实姓名，需与证件一致', enumValues: [], exampleValue: '客户甲', remark: '', source: SRC },
  { fieldName: 'id_no', chineseName: '证件号码', dataType: 'VARCHAR', length: '18', required: 'Y', description: '借款人身份证号，18 位', enumValues: [], exampleValue: '110101********1234', remark: '需做脱敏存储', source: SRC },
  { fieldName: 'mobile', chineseName: '手机号', dataType: 'VARCHAR', length: '11', required: 'Y', description: '借款人预留手机号', enumValues: [], exampleValue: '138****1234', remark: '', source: SRC },
  { fieldName: 'loan_term', chineseName: '借款期限', dataType: 'INT', length: '', required: 'Y', description: '借款总期数（月）', enumValues: [], exampleValue: '12', remark: '', source: SRC },
  { fieldName: 'annual_rate', chineseName: '年化利率', dataType: 'DECIMAL', length: '(8,4)', required: 'Y', description: '年化利率，小数形式存储，如 0.0720 表示 7.20%', enumValues: [], exampleValue: '0.0720', remark: '内部统一以小数存储，非百分比', source: SRC },
  { fieldName: 'loan_status', chineseName: '放款状态', dataType: 'VARCHAR', length: '20', required: 'Y', description: '借据状态：INIT 初始化 / SUCCESS 成功 / FAIL 失败', enumValues: ['INIT', 'SUCCESS', 'FAIL'], exampleValue: 'SUCCESS', remark: '不含处理中态', source: SRC },
  { fieldName: 'apply_time', chineseName: '申请时间', dataType: 'DATETIME', length: '', required: 'Y', description: '用户提交借款申请的时间', enumValues: [], exampleValue: '2026-08-01 10:22:33', remark: '格式 YYYY-MM-DD HH:mm:ss', source: SRC },
  { fieldName: 'due_date', chineseName: '到期日', dataType: 'DATE', length: '', required: 'Y', description: '最后一期应还日期', enumValues: [], exampleValue: '2027-08-01', remark: '格式 YYYY-MM-DD', source: SRC },
  { fieldName: 'repay_method', chineseName: '还款方式', dataType: 'VARCHAR', length: '20', required: 'Y', description: 'EQUAL 等额本息 / INTEREST_FIRST 先息后本', enumValues: ['EQUAL', 'INTEREST_FIRST'], exampleValue: 'EQUAL', remark: '', source: SRC },
  { fieldName: 'bank_card', chineseName: '银行卡号', dataType: 'VARCHAR', length: '32', required: 'Y', description: '放款收款卡号', enumValues: [], exampleValue: '6222********1234', remark: '', source: SRC },
  { fieldName: 'product_code', chineseName: '产品编码', dataType: 'VARCHAR', length: '20', required: 'Y', description: '我方产品中心分配的产品编码', enumValues: [], exampleValue: 'DEMO_PRODUCT_01', remark: '', source: SRC },
  { fieldName: 'channel', chineseName: '渠道', dataType: 'VARCHAR', length: '20', required: 'Y', description: '流量来源渠道编码', enumValues: ['APP', 'H5', 'API'], exampleValue: 'APP', remark: '', source: SRC },
  { fieldName: 'interest', chineseName: '利息', dataType: 'DECIMAL', length: '(12,2)', required: 'N', description: '应收利息合计', enumValues: [], exampleValue: '650.00', remark: '', source: SRC },
  { fieldName: 'overdue_flag', chineseName: '是否逾期', dataType: 'VARCHAR', length: '1', required: 'Y', description: 'Y 逾期 / N 未逾期', enumValues: ['Y', 'N'], exampleValue: 'N', remark: '', source: SRC },
  { fieldName: 'remaining_principal', chineseName: '剩余本金', dataType: 'DECIMAL', length: '(12,2)', required: 'N', description: '当前未还本金余额', enumValues: [], exampleValue: '9000.00', remark: '', source: SRC },
  { fieldName: 'penalty', chineseName: '罚息', dataType: 'DECIMAL', length: '(12,2)', required: 'N', description: '逾期产生的罚息', enumValues: [], exampleValue: '0.00', remark: '', source: SRC },
  { fieldName: 'remark', chineseName: '备注', dataType: 'VARCHAR', length: '255', required: 'N', description: '业务备注信息', enumValues: [], exampleValue: '', remark: '', source: SRC },
  { fieldName: 'create_time', chineseName: '创建时间', dataType: 'DATETIME', length: '', required: 'Y', description: '记录落库时间', enumValues: [], exampleValue: '2026-08-01 10:25:00', remark: '', source: SRC },
];
