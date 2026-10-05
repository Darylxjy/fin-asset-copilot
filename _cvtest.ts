import { runCaseAnalysis } from './src/lib/rules/caseAnalysis';
import { caseFiles } from './src/data/caseFiles';
import { referenceCase } from './src/data/reference';
import { accountTemplates } from './src/data/accountDoc';
import { bizRules } from './src/data/bizRules';

const r = runCaseAnalysis({ cases: caseFiles, templates: accountTemplates, reference: referenceCase, rules: bizRules });
const fail: string[] = [];
const ok = (cond: boolean, msg: string) => { if (!cond) fail.push(msg); };

// 全部案例结构通过
for (const s of r.structureChecks) {
  ok(s.missingSheets.length === 0 && s.extraSheets.length === 0 && s.headerMismatch.length === 0, `结构异常 ${s.caseName}: ${JSON.stringify(s)}`);
}
// 案例数 = 6
ok(caseFiles.length === 6, `案例数应为 6，实际 ${caseFiles.length}`);
// 案例1 新增 Sheet = 8
const v1 = r.versionDiffs.find((v) => v.caseName === '示例分期产品案例1')!;
ok(v1.addedSheets.length === 8, `案例1 新增 Sheet 应为 8，实际 ${v1.addedSheets.length}`);
// 案例5/6 不应有假阳性新增 Sheet
for (const name of ['示例分期产品案例5', '示例分期产品案例6']) {
  const v = r.versionDiffs.find((x) => x.caseName === name)!;
  ok(v.addedSheets.length === 0 && v.changedSheets.length === 0, `${name} 不应有版本差异，实际 ${JSON.stringify({ a: v.addedSheets, c: v.changedSheets })}`);
}
// 案例5 余额 > 0（还款中）
const c5 = caseFiles.find((c) => c.fileName === '示例分期产品案例5')!;
const c5bal = c5.sheets.find((s) => s.sheetName === 'LOAN')!.rows[0][6];
ok(Number(c5bal) > 0, `案例5 余额应 >0，实际 ${c5bal}`);
// 案例5 余额自洽
const c5flow = (c5.sheets.find((s) => s.sheetName === 'FLOW')!.rows).reduce((a, x) => a + Number(x[3]), 0);
ok(Math.abs(1500 - c5flow - Number(c5bal)) < 0.01, `案例5 余额自洽失败：1500-${c5flow}-${c5bal}`);
// 案例6 时间线自洽
const c6 = r.sceneAnalyses.find((s) => s.caseName === '示例分期产品案例6')!;
ok(c6.timelineOk, `案例6 时间线应自洽，实际 ${JSON.stringify(c6.findings)}`);
// rule10 仍仅 1 个 fail
const fails = r.ruleValidations.filter((x) => x.result === 'fail');
ok(fails.length === 1 && fails[0].seq === 10, `rule fail 应为仅 seq10，实际 ${JSON.stringify(fails.map((f) => f.seq))}`);
// 跨产品全部 low
ok(r.crossProducts.every((x) => x.risk === 'low'), '跨产品风险应全为 low');
// 待确认问题仍为 2 条
ok(r.openQuestions.length === 2 && r.openQuestions.some((q) => q.qid === 'Q_CASE_RULE10') && r.openQuestions.some((q) => q.qid === 'Q_CASE_CASHFLOW'), `待确认问题应为 2（RULE10+CASHFLOW），实际 ${JSON.stringify(r.openQuestions.map((q) => q.qid))}`);

console.log('caseCount=', caseFiles.length, 'structPass=', r.structureChecks.length, 'ruleFails=', fails.map((f) => f.seq), 'openQ=', r.openQuestions.map((q) => q.qid));
if (fail.length) { console.log('FAIL:\n' + fail.join('\n')); process.exit(1); }
else console.log('ALL PASS');
