// ============================================================
// 虚构：两个交付目录的原始 DAT 数据（模拟，禁止对应真实企业/产品）
// 目的：演示「交付数据目录级比对 + 案例×场景归因 + 单版本自洽校验」。
// 数据仅存在于内存，不读写真实文件；机构/产品/客户/单号均为模拟占位。
// DAT 约定：ledgerFile-decrypt/JD{业务日期}{变体}/JD_{表}_{业务日期}.dat，字段以 @!@ 分隔。
// 此处用结构化行数组表示 DAT 内容，解析层会按 @!@ 还原（见 deliveryCompare）。
// ============================================================
import { accountTemplateByCode } from './accountDoc';

export interface DeliveryFile {
  date: string; // 业务日期
  variant: string; // 口径变体，如 42
  sheet: string; // 表名
  rows: string[][]; // 该 DAT 的数据行
}
export interface DeliveryDir {
  label: string;
  files: DeliveryFile[];
}

/** 各表主键列（索引，0 基）。贷款类取贷款单号列，客户类取合同号列（非客户名称列）。 */
export const SHEET_KEY_COL: Record<string, number> = {
  LOAN: 3, // LOAN 行：[业务日期,合同号,客户编号,贷款单号,...]
  PLAN: 1,
  FLOW: 1,
  COMFLOW: 1,
  REPAYMENTFLOW: 1,
  CASHFLOW: 1,
  CUS: 2, // 客户编号列（非客户名称列）
  CUSCREDIT: 1, // 合同号列
  QUOTAFEE: 1,
  CUSCHANGE: 1,
  QUOTAADJUST: 1,
};

// ---------- 行构造助手（列顺序严格对齐 accountDoc 模板） ----------
const f = (date: string, sheet: string, rows: string[][]): DeliveryFile => ({ date, variant: '42', sheet, rows });

function cus(date: string, contract: string, cust: string, name: string, idno: string, mobile: string): string[] {
  return [date, contract, cust, name, '01', idno, mobile, '1'];
}
function cusCredit(date: string, contract: string, limit: string): string[] {
  return [date, contract, limit, '12', '1', '14.8000', date];
}
function loan(date: string, contract: string, cust: string, loanNo: string, status: string, amt: string, bal: string, rate: string): string[] {
  return [date, contract, cust, loanNo, status, amt, bal, '2025-09-20', 'CNY', rate];
}
function planRow(date: string, loanNo: string, term: string, due: string, prin: string, int: string): string[] {
  return [date, loanNo, term, due, prin, int, '0.0000', '2'];
}
function flow(date: string, loanNo: string, type: string, prin: string, int: string, pen: string, total: string): string[] {
  return [date, loanNo, type, prin, int, pen, total, '01'];
}
function repayFlow(date: string, loanNo: string, no: string, prin: string, int: string, pen: string): string[] {
  return [date, loanNo, no, prin, int, pen];
}
function cash(date: string, loanNo: string, code: string, amt: string): string[] {
  return [date, loanNo, code, '1', amt, 'XH' + code];
}

/**
 * 生成一份交付目录。version='new' 时植入若干可控差异：
 *  - 案例A：CUSCREDIT 授信额度 8000→7500（客户级）
 *  - 案例B：LOAN 贷款利率 14.8000→15.6000（贷款级）
 *  - 案例C：逾期认定分歧 —— 旧版判逾期(03+罚息)，新版判正常(01+无罚息)（系统性分歧）
 *  - 案例D：仅新版存在，且单版本不自洽（提前还款+连续3次还款，但余额未变、FLOW 仅 1 笔）
 */
export function buildAll(version: 'old' | 'new'): DeliveryDir {
  const isNew = version === 'new';
  const files: DeliveryFile[] = [];

  // ---------- 案例A 客户甲（3 期正常还款至结清） ----------
  const A = 'DEMO-DLV-LOAN-0001', Aht = 'HT900000000001', Acu = 'C900000000001';
  files.push(f('20250918', 'CUS', [cus('20250918', Aht, Acu, '客户甲', '110101********4321', '139****1111')]));
  files.push(f('20250918', 'CUSCREDIT', [cusCredit('20250918', Aht, isNew ? '7500.0000' : '8000.0000')]));
  files.push(f('20250918', 'LOAN', [loan('20250918', Aht, Acu, A, '2', '1500.0000', '0.0000', '14.8000')]));
  files.push(f('20250918', 'PLAN', [planRow('20250918', A, '1', '20251110', '500.0000', '19.5000'), planRow('20250918', A, '2', '20251220', '500.0000', '14.8000'), planRow('20250918', A, '3', '20260110', '500.0000', '9.8000')]));
  files.push(f('20250918', 'CASHFLOW', [cash('20250918', A, 'CASH9001', '1500.0000')]));
  files.push(f('20251110', 'FLOW', [flow('20251110', A, '01', '500.0000', '19.5000', '0.0000', '519.5000')]));
  files.push(f('20251110', 'REPAYMENTFLOW', [repayFlow('20251110', A, 'F20251110001', '500.0000', '19.5000', '0.0000')]));
  files.push(f('20251220', 'FLOW', [flow('20251220', A, '01', '500.0000', '14.8000', '0.0000', '514.8000')]));
  files.push(f('20251220', 'REPAYMENTFLOW', [repayFlow('20251220', A, 'F20251220002', '500.0000', '14.8000', '0.0000')]));
  files.push(f('20260110', 'FLOW', [flow('20260110', A, '01', '500.0000', '9.8000', '0.0000', '509.8000')]));
  files.push(f('20260110', 'REPAYMENTFLOW', [repayFlow('20260110', A, 'F20260110003', '500.0000', '9.8000', '0.0000')]));

  // ---------- 案例B 客户乙（第1期后提前结清） ----------
  const B = 'DEMO-DLV-LOAN-0002', Bht = 'HT900000000002', Bcu = 'C900000000002';
  files.push(f('20250918', 'CUS', [cus('20250918', Bht, Bcu, '客户乙', '110101********6532', '139****2222')]));
  files.push(f('20250918', 'CUSCREDIT', [cusCredit('20250918', Bht, '8000.0000')]));
  files.push(f('20250918', 'LOAN', [loan('20250918', Bht, Bcu, B, '2', '1500.0000', '0.0000', isNew ? '15.6000' : '14.8000')]));
  files.push(f('20250918', 'PLAN', [planRow('20250918', B, '1', '20251110', '500.0000', '19.5000'), planRow('20250918', B, '2', '20251220', '500.0000', '14.8000'), planRow('20250918', B, '3', '20260110', '500.0000', '9.8000')]));
  files.push(f('20250918', 'CASHFLOW', [cash('20250918', B, 'CASH9002', '1500.0000')]));
  files.push(f('20251110', 'FLOW', [flow('20251110', B, '01', '500.0000', '19.5000', '0.0000', '519.5000')]));
  files.push(f('20251110', 'REPAYMENTFLOW', [repayFlow('20251110', B, 'F20251110002', '500.0000', '19.5000', '0.0000')]));
  files.push(f('20250925', 'FLOW', [flow('20250925', B, '02', '1000.0000', '29.6000', '0.0000', '1029.6000')]));
  files.push(f('20250925', 'REPAYMENTFLOW', [repayFlow('20250925', B, 'F20250925002', '1000.0000', '29.6000', '0.0000')]));

  // ---------- 案例C 客户丙（逾期认定分歧） ----------
  const C = 'DEMO-DLV-LOAN-0003', Cht = 'HT900000000003', Ccu = 'C900000000003';
  files.push(f('20250918', 'CUS', [cus('20250918', Cht, Ccu, '客户丙', '110101********8643', '139****3333')]));
  files.push(f('20250918', 'CUSCREDIT', [cusCredit('20250918', Cht, '8000.0000')]));
  files.push(f('20250918', 'LOAN', [loan('20250918', Cht, Ccu, C, '2', '1500.0000', '0.0000', '14.8000')]));
  files.push(f('20250918', 'PLAN', [planRow('20250918', C, '1', '20251110', '500.0000', '19.5000'), planRow('20250918', C, '2', '20251221', '500.0000', '14.8000'), planRow('20250918', C, '3', '20260110', '500.0000', '9.8000')]));
  files.push(f('20250918', 'CASHFLOW', [cash('20250918', C, 'CASH9003', '1500.0000')]));
  files.push(f('20251110', 'FLOW', [flow('20251110', C, '01', '500.0000', '19.5000', '0.0000', '519.5000')]));
  files.push(f('20251110', 'REPAYMENTFLOW', [repayFlow('20251110', C, 'F20251110003', '500.0000', '19.5000', '0.0000')]));
  // 逾期还款 20251221：旧版判逾期(03+罚息)，新版判正常(01+无罚息)
  const cOverdue = isNew
    ? flow('20251221', C, '01', '500.0000', '14.8000', '0.0000', '514.8000')
    : flow('20251221', C, '03', '500.0000', '14.8000', '9.3600', '524.1600');
  files.push(f('20251221', 'FLOW', [cOverdue]));
  files.push(f('20251221', 'REPAYMENTFLOW', [repayFlow('20251221', C, 'F20251221003', '500.0000', '14.8000', isNew ? '0.0000' : '9.3600')]));
  files.push(f('20260110', 'FLOW', [flow('20260110', C, '01', '500.0000', '9.8000', '0.0000', '509.8000')]));
  files.push(f('20260110', 'REPAYMENTFLOW', [repayFlow('20260110', C, 'F20260110003', '500.0000', '9.8000', '0.0000')]));

  // ---------- 案例D 客户丁（仅新版存在，单版本不自洽） ----------
  if (isNew) {
    const D = 'DEMO-DLV-LOAN-0004', Dht = 'HT900000000004', Dcu = 'C900000000004';
    files.push(f('20251011', 'CUS', [cus('20251011', Dht, Dcu, '客户丁', '110101********9754', '139****4444')]));
    files.push(f('20251011', 'CUSCREDIT', [cusCredit('20251011', Dht, '8000.0000')]));
    files.push(f('20251011', 'LOAN', [loan('20251011', Dht, Dcu, D, '2', '1500.0000', '299.1500', '14.8000')]));
    files.push(f('20251011', 'CASHFLOW', [cash('20251011', D, 'CASH9004', '1500.0000')]));
    files.push(f('20251011', 'PLAN', [planRow('20251011', D, '1', '20251012', '100.0000', '5.0000'), planRow('20251011', D, '2', '20251012', '100.0000', '5.0000'), planRow('20251011', D, '3', '20251012', '99.1500', '5.0000')]));
    // 20251012：场景描述“提前还款 + 连续3次还款”，但余额未变、FLOW 仅 1 笔（缺 2 笔）
    files.push(f('20251012', 'LOAN', [loan('20251012', Dht, Dcu, D, '2', '1500.0000', '299.1500', '14.8000')]));
    files.push(f('20251012', 'FLOW', [flow('20251012', D, '02', '299.1500', '15.0000', '0.0000', '314.1500')]));
    files.push(f('20251012', 'REPAYMENTFLOW', [repayFlow('20251012', D, 'F20251012004', '299.1500', '15.0000', '0.0000')]));
  }

  return { label: isNew ? '新版交付目录（模拟）' : '旧版交付目录（模拟）', files };
}

export const OLD_DELIVERY = buildAll('old');
export const NEW_DELIVERY = buildAll('new');

/** 案例主文件（日期→案例→场景）映射，用于跨案例×场景归因。id 同时收录贷款单号与合同号。 */
export interface MasterRow {
  date: string;
  id: string; // 贷款单号 或 合同号
  caseName: string;
  scenario: string;
}
export const MASTER_MAPPING: MasterRow[] = [
  { date: '20250918', id: 'DEMO-DLV-LOAN-0001', caseName: '交付案例A（客户甲）', scenario: '放款' },
  { date: '20250918', id: 'HT900000000001', caseName: '交付案例A（客户甲）', scenario: '放款' },
  { date: '20251110', id: 'DEMO-DLV-LOAN-0001', caseName: '交付案例A（客户甲）', scenario: '第1期还款' },
  { date: '20251220', id: 'DEMO-DLV-LOAN-0001', caseName: '交付案例A（客户甲）', scenario: '第2期还款' },
  { date: '20260110', id: 'DEMO-DLV-LOAN-0001', caseName: '交付案例A（客户甲）', scenario: '第3期还款（结清）' },

  { date: '20250918', id: 'DEMO-DLV-LOAN-0002', caseName: '交付案例B（客户乙）', scenario: '放款' },
  { date: '20250918', id: 'HT900000000002', caseName: '交付案例B（客户乙）', scenario: '放款' },
  { date: '20251110', id: 'DEMO-DLV-LOAN-0002', caseName: '交付案例B（客户乙）', scenario: '第1期还款' },
  { date: '20250925', id: 'DEMO-DLV-LOAN-0002', caseName: '交付案例B（客户乙）', scenario: '提前结清' },

  { date: '20250918', id: 'DEMO-DLV-LOAN-0003', caseName: '交付案例C（客户丙）', scenario: '放款' },
  { date: '20250918', id: 'HT900000000003', caseName: '交付案例C（客户丙）', scenario: '放款' },
  { date: '20251110', id: 'DEMO-DLV-LOAN-0003', caseName: '交付案例C（客户丙）', scenario: '第1期还款' },
  { date: '20251221', id: 'DEMO-DLV-LOAN-0003', caseName: '交付案例C（客户丙）', scenario: '逾期还款（含本利罚）' },
  { date: '20260110', id: 'DEMO-DLV-LOAN-0003', caseName: '交付案例C（客户丙）', scenario: '第3期还款（结清）' },

  { date: '20251011', id: 'DEMO-DLV-LOAN-0004', caseName: '交付案例D（客户丁）', scenario: '放款' },
  { date: '20251011', id: 'HT900000000004', caseName: '交付案例D（客户丁）', scenario: '放款' },
  { date: '20251012', id: 'DEMO-DLV-LOAN-0004', caseName: '交付案例D（客户丁）', scenario: '提前还款 + 连续3次还款' },
  { date: '20251012', id: 'HT900000000004', caseName: '交付案例D（客户丁）', scenario: '提前还款 + 连续3次还款' },
];

// 仅用于在 UI 中展示 DAT 原始形态（@!@ 拼接），证明解析层与真实 DAT 一致。
export function toDatContent(file: DeliveryFile): string {
  const headers = accountTemplateByCode[file.sheet]?.fields.map((x) => x.chineseName) ?? [];
  const lines = [headers.join('@!@'), ...file.rows.map((r) => r.join('@!@'))];
  return lines.join('\n');
}
