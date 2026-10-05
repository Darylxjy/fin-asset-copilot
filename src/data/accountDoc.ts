// ============================================================
// 虚构：账务文件文档（对应真实"账务文件产品文档"）
// 含 12 个 账务文件明细_ 系列 sheet 模板，结构还原真实工作流：
//   文件传输说明 → 文件名称(fileCode，如 LOAN)
//   科目说明 → 字段中文名 + 类型/长度/枚举
// 全部虚构脱敏，禁止对应真实企业。
// ============================================================
import type { AccountTemplate, UnifiedField } from '../types';

function f(p: Partial<UnifiedField> & { fieldName: string; chineseName: string }): UnifiedField {
  return {
    dataType: 'VARCHAR(64)',
    length: '',
    required: 'N',
    description: '',
    enumValues: [],
    exampleValue: '',
    remark: '',
    source: 'accountDoc',
    ...p,
  };
}

export const accountTemplates: AccountTemplate[] = [
  {
    sheetKey: '账务文件明细_客户信息',
    fileCode: 'CUS',
    cnName: '客户信息',
    fields: [
      f({ fieldName: 'BIZ_DATE', chineseName: '业务日期', dataType: 'DATE', required: 'Y', format: 'yyyyMMdd' }),
      f({ fieldName: 'CONTRACT_NO', chineseName: '合同号', dataType: 'VARCHAR(32)', required: 'Y' }),
      f({ fieldName: 'CUST_NO', chineseName: '客户编号', dataType: 'VARCHAR(32)', required: 'Y' }),
      f({ fieldName: 'CUST_NAME', chineseName: '客户姓名', dataType: 'VARCHAR(64)', required: 'Y' }),
      f({ fieldName: 'ID_TYPE', chineseName: '证件类型', dataType: 'VARCHAR(2)', enumValues: ['01', '02', '03'], remark: '01=身份证 02=护照 03=其他' }),
      f({ fieldName: 'ID_NO', chineseName: '证件号码', dataType: 'VARCHAR(32)', required: 'Y' }),
      f({ fieldName: 'MOBILE', chineseName: '手机号', dataType: 'VARCHAR(11)', required: 'Y' }),
      f({ fieldName: 'CUST_TYPE', chineseName: '客户类型', dataType: 'VARCHAR(2)', enumValues: ['1', '2'], remark: '1=个人 2=企业' }),
    ],
  },
  {
    sheetKey: '账务文件明细_客户授信',
    fileCode: 'CUSCREDIT',
    cnName: '客户授信',
    fields: [
      f({ fieldName: 'BIZ_DATE', chineseName: '业务日期', dataType: 'DATE', required: 'Y', format: 'yyyyMMdd' }),
      f({ fieldName: 'CONTRACT_NO', chineseName: '合同号', dataType: 'VARCHAR(32)', required: 'Y' }),
      f({ fieldName: 'CREDIT_LIMIT', chineseName: '授信额度', dataType: 'DECIMAL(16,4)', required: 'Y' }),
      f({ fieldName: 'CREDIT_TERM', chineseName: '授信期限', dataType: 'INT', required: 'Y' }),
      f({ fieldName: 'CREDIT_STATUS', chineseName: '授信状态', dataType: 'VARCHAR(2)', enumValues: ['0', '1', '2'], remark: '0=失效 1=生效 2=冻结' }),
      f({ fieldName: 'CREDIT_RATE', chineseName: '授信利率', dataType: 'DECIMAL(8,4)', required: 'Y' }),
      f({ fieldName: 'EFFECTIVE_DATE', chineseName: '额度生效日', dataType: 'DATE', required: 'Y', format: 'yyyyMMdd' }),
    ],
  },
  {
    sheetKey: '账务文件明细_额度调整',
    fileCode: 'QUOTAADJUST',
    cnName: '额度调整',
    fields: [
      f({ fieldName: 'BIZ_DATE', chineseName: '业务日期', dataType: 'DATE', required: 'Y', format: 'yyyyMMdd' }),
      f({ fieldName: 'CONTRACT_NO', chineseName: '合同号', dataType: 'VARCHAR(32)', required: 'Y' }),
      f({ fieldName: 'PRE_QUOTA', chineseName: '调整前额度', dataType: 'DECIMAL(16,4)', required: 'Y' }),
      f({ fieldName: 'POST_QUOTA', chineseName: '调整后额度', dataType: 'DECIMAL(16,4)', required: 'Y' }),
      f({ fieldName: 'ADJUST_TYPE', chineseName: '调整类型', dataType: 'VARCHAR(2)', enumValues: ['1', '2'], remark: '1=提升 2=降低' }),
      f({ fieldName: 'ADJUST_REASON', chineseName: '调整原因', dataType: 'VARCHAR(128)' }),
    ],
  },
  {
    sheetKey: '账务文件明细_费用调整',
    fileCode: 'FEEADJUST',
    cnName: '费用调整',
    fields: [
      f({ fieldName: 'BIZ_DATE', chineseName: '业务日期', dataType: 'DATE', required: 'Y', format: 'yyyyMMdd' }),
      f({ fieldName: 'CONTRACT_NO', chineseName: '合同号', dataType: 'VARCHAR(32)', required: 'Y' }),
      f({ fieldName: 'FEE_ITEM', chineseName: '费用项', dataType: 'VARCHAR(32)', enumValues: ['01', '02', '03'], remark: '01=手续费 02=服务费 03=罚息' }),
      f({ fieldName: 'PRE_AMT', chineseName: '调整前金额', dataType: 'DECIMAL(16,4)', required: 'Y' }),
      f({ fieldName: 'POST_AMT', chineseName: '调整后金额', dataType: 'DECIMAL(16,4)', required: 'Y' }),
      f({ fieldName: 'ADJUST_TYPE', chineseName: '调整类型', dataType: 'VARCHAR(2)', enumValues: ['1', '2'], remark: '1=调增 2=调减' }),
    ],
  },
  {
    sheetKey: '账务文件明细_客户信息变更',
    fileCode: 'CUSCHANGE',
    cnName: '客户信息变更',
    fields: [
      f({ fieldName: 'BIZ_DATE', chineseName: '业务日期', dataType: 'DATE', required: 'Y', format: 'yyyyMMdd' }),
      f({ fieldName: 'CONTRACT_NO', chineseName: '合同号', dataType: 'VARCHAR(32)', required: 'Y' }),
      f({ fieldName: 'CHANGE_ITEM', chineseName: '变更项', dataType: 'VARCHAR(32)', enumValues: ['01', '02'], remark: '01=手机号 02=地址' }),
      f({ fieldName: 'CHANGE_BEFORE', chineseName: '变更前', dataType: 'VARCHAR(64)' }),
      f({ fieldName: 'CHANGE_AFTER', chineseName: '变更后', dataType: 'VARCHAR(64)' }),
    ],
  },
  {
    sheetKey: '账务文件明细_贷款借据信息',
    fileCode: 'LOAN',
    cnName: '贷款借据信息',
    fields: [
      f({ fieldName: 'BIZ_DATE', chineseName: '业务日期', dataType: 'DATE', required: 'Y', format: 'yyyyMMdd' }),
      f({ fieldName: 'CONTRACT_NO', chineseName: '合同号', dataType: 'VARCHAR(32)', required: 'Y' }),
      f({ fieldName: 'CUST_NO', chineseName: '客户编号', dataType: 'VARCHAR(32)', required: 'Y' }),
      f({ fieldName: 'LOAN_NO', chineseName: '贷款单号', dataType: 'VARCHAR(32)', required: 'Y' }),
      f({ fieldName: 'LOAN_STATUS', chineseName: '贷款状态', dataType: 'VARCHAR(2)', required: 'Y', enumValues: ['0', '1', '2', '3'], remark: '0=未放款 1=正常 2=结清 3=逾期' }),
      f({ fieldName: 'LOAN_AMT', chineseName: '放款金额', dataType: 'DECIMAL(16,4)', required: 'Y' }),
      f({ fieldName: 'LOAN_BALANCE', chineseName: '贷款余额', dataType: 'DECIMAL(16,4)', required: 'Y' }),
      f({ fieldName: 'RECEIVE_DATE', chineseName: '放款入账日期', dataType: 'DATE', required: 'N', format: 'yyyy-MM-dd', remark: '新增字段，创单日起才有值' }),
      f({ fieldName: 'CURRENCY', chineseName: '币种', dataType: 'VARCHAR(3)', enumValues: ['CNY'] }),
      f({ fieldName: 'LOAN_RATE', chineseName: '贷款利率', dataType: 'DECIMAL(8,4)', required: 'Y' }),
    ],
  },
  {
    sheetKey: '账务文件明细_还款计划',
    fileCode: 'PLAN',
    cnName: '还款计划',
    fields: [
      f({ fieldName: 'BIZ_DATE', chineseName: '业务日期', dataType: 'DATE', required: 'Y', format: 'yyyyMMdd' }),
      f({ fieldName: 'LOAN_NO', chineseName: '贷款单号', dataType: 'VARCHAR(32)', required: 'Y' }),
      f({ fieldName: 'TERM_NO', chineseName: '期次', dataType: 'INT', required: 'Y' }),
      f({ fieldName: 'DUE_DATE', chineseName: '应还日期', dataType: 'DATE', required: 'Y', format: 'yyyyMMdd' }),
      f({ fieldName: 'DUE_PRIN', chineseName: '应还本金', dataType: 'DECIMAL(16,4)', required: 'Y' }),
      f({ fieldName: 'DUE_INT', chineseName: '应还利息', dataType: 'DECIMAL(16,4)', required: 'Y' }),
      f({ fieldName: 'DUE_PEN', chineseName: '应还罚息', dataType: 'DECIMAL(16,4)', required: 'N' }),
      f({ fieldName: 'PLAN_STATUS', chineseName: '还款计划状态', dataType: 'VARCHAR(2)', enumValues: ['0', '1', '2'], remark: '0=待还 1=已还 2=逾期' }),
    ],
  },
  {
    sheetKey: '账务文件明细_还款流水',
    fileCode: 'FLOW',
    cnName: '还款流水',
    fields: [
      f({ fieldName: 'BIZ_DATE', chineseName: '业务日期', dataType: 'DATE', required: 'Y', format: 'yyyyMMdd' }),
      f({ fieldName: 'LOAN_NO', chineseName: '贷款单号', dataType: 'VARCHAR(32)', required: 'Y' }),
      f({ fieldName: 'REPAY_TYPE', chineseName: '还款类型', dataType: 'VARCHAR(2)', required: 'Y', enumValues: ['01', '02', '03'], remark: '01=正常 02=提前结清 03=逾期还款' }),
      f({ fieldName: 'REPAY_PRIN', chineseName: '还款本金', dataType: 'DECIMAL(16,4)', required: 'Y' }),
      f({ fieldName: 'REPAY_INT', chineseName: '还款利息', dataType: 'DECIMAL(16,4)', required: 'Y' }),
      f({ fieldName: 'REPAY_PEN', chineseName: '还款罚息', dataType: 'DECIMAL(16,4)', required: 'N' }),
      f({ fieldName: 'REPAY_TOTAL', chineseName: '实还总额', dataType: 'DECIMAL(16,4)', required: 'Y' }),
      f({ fieldName: 'REPAY_CHANNEL', chineseName: '还款渠道', dataType: 'VARCHAR(2)', enumValues: ['01', '02'], remark: '01=代扣 02=主动还款' }),
    ],
  },
  {
    sheetKey: '账务文件明细_代偿流水',
    fileCode: 'COMFLOW',
    cnName: '代偿流水',
    fields: [
      f({ fieldName: 'BIZ_DATE', chineseName: '业务日期', dataType: 'DATE', required: 'Y', format: 'yyyyMMdd' }),
      f({ fieldName: 'LOAN_NO', chineseName: '贷款单号', dataType: 'VARCHAR(32)', required: 'Y' }),
      f({ fieldName: 'COMP_TYPE', chineseName: '代偿类型', dataType: 'VARCHAR(2)', enumValues: ['1', '2'], remark: '1=担保代偿 2=保险代偿' }),
      f({ fieldName: 'COMP_AMT', chineseName: '代偿金额', dataType: 'DECIMAL(16,4)', required: 'Y' }),
      f({ fieldName: 'COMP_ORG', chineseName: '代偿机构', dataType: 'VARCHAR(64)' }),
    ],
  },
  {
    sheetKey: '账务文件明细_实还流水',
    fileCode: 'REPAYMENTFLOW',
    cnName: '实还流水',
    fields: [
      f({ fieldName: 'BIZ_DATE', chineseName: '业务日期', dataType: 'DATE', required: 'Y', format: 'yyyyMMdd' }),
      f({ fieldName: 'LOAN_NO', chineseName: '贷款单号', dataType: 'VARCHAR(32)', required: 'Y' }),
      f({ fieldName: 'FLOW_NO', chineseName: '流水号', dataType: 'VARCHAR(32)', required: 'Y' }),
      f({ fieldName: 'ACT_PRIN', chineseName: '实还本金', dataType: 'DECIMAL(16,4)', required: 'Y' }),
      f({ fieldName: 'ACT_INT', chineseName: '实还利息', dataType: 'DECIMAL(16,4)', required: 'Y' }),
      f({ fieldName: 'ACT_PEN', chineseName: '实还罚息', dataType: 'DECIMAL(16,4)', required: 'N' }),
    ],
  },
  {
    sheetKey: '账务文件明细_资金流水',
    fileCode: 'CASHFLOW',
    cnName: '资金流水',
    fields: [
      f({ fieldName: 'BIZ_DATE', chineseName: '业务日期', dataType: 'DATE', required: 'Y', format: 'yyyyMMdd' }),
      f({ fieldName: 'LOAN_NO', chineseName: '贷款单号', dataType: 'VARCHAR(32)', required: 'Y' }),
      f({ fieldName: 'CASH_CODE', chineseName: '资金划拨码', dataType: 'VARCHAR(32)', required: 'Y' }),
      f({ fieldName: 'CASH_DIR', chineseName: '划拨方向', dataType: 'VARCHAR(2)', enumValues: ['1', '2'], remark: '1=入 2=出' }),
      f({ fieldName: 'CASH_AMT', chineseName: '划拨金额', dataType: 'DECIMAL(16,4)', required: 'Y' }),
      f({ fieldName: 'RECON_CODE', chineseName: '示例分期产品资金划拨对账码', dataType: 'VARCHAR(32)', remark: '示例分期产品产品专用，其他产品线无此字段' }),
    ],
  },
  {
    sheetKey: '账务文件明细_额度费用',
    fileCode: 'QUOTAFEE',
    cnName: '额度费用',
    fields: [
      f({ fieldName: 'BIZ_DATE', chineseName: '业务日期', dataType: 'DATE', required: 'Y', format: 'yyyyMMdd' }),
      f({ fieldName: 'CONTRACT_NO', chineseName: '合同号', dataType: 'VARCHAR(32)', required: 'Y' }),
      f({ fieldName: 'FEE_TYPE', chineseName: '费用类型', dataType: 'VARCHAR(2)', enumValues: ['01', '02'], remark: '01=取现手续费 02=分期手续费' }),
      f({ fieldName: 'FEE_AMT', chineseName: '费用金额', dataType: 'DECIMAL(16,4)', required: 'Y' }),
      f({ fieldName: 'FEE_MODE', chineseName: '计费方式', dataType: 'VARCHAR(2)', enumValues: ['1', '2'], remark: '1=一次性 2=分期' }),
    ],
  },
];

/** 文件名称 → 模板 映射，便于按 sheet 名取字段 */
export const accountTemplateByCode: Record<string, AccountTemplate> = Object.fromEntries(
  accountTemplates.map((t) => [t.fileCode, t]),
);
