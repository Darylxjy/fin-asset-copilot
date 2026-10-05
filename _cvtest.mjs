// src/lib/rules/caseAnalysis.ts
function getSheet(c, code) {
  return c.sheets.find((s) => s.sheetName === code);
}
function maxDecimals(rows) {
  let max = 0;
  for (const r2 of rows) for (const cell of r2) {
    const m = /\.(\d+)/.exec(cell);
    if (m) max = Math.max(max, m[1].length);
  }
  return max;
}
function structureCheck(c, templates) {
  const caseCodes = new Set(c.sheets.map((s) => s.sheetName));
  const tmplCodes = templates.map((t) => t.fileCode);
  const missingSheets = tmplCodes.filter((code) => !caseCodes.has(code));
  const templateSet = new Set(tmplCodes);
  const extraSheets = [...caseCodes].filter((code) => !templateSet.has(code));
  const headerMismatch = [];
  for (const t of templates) {
    const s = getSheet(c, t.fileCode);
    if (!s) continue;
    const expected = t.fields.map((f2) => f2.chineseName);
    const actual = s.headers;
    const same = expected.length === actual.length && expected.every((e, i) => e === actual[i]);
    if (!same) headerMismatch.push({ sheet: t.fileCode, expected, actual });
  }
  return { caseName: c.fileName, missingSheets, extraSheets, headerMismatch };
}
function versionDiff(c, reference) {
  const refName = reference ? reference.fileName : "\u65E0\u5BF9\u5E94\u65E7\u7248\u53C2\u8003";
  if (!reference) {
    return { caseName: c.fileName, refName, addedSheets: [], removedSheets: [], changedSheets: [] };
  }
  const refMap = new Map(reference.sheets.map((s) => [s.sheetName, s]));
  const newMap = new Map(c.sheets.map((s) => [s.sheetName, s]));
  const addedSheets = [...newMap.keys()].filter((code) => !refMap.has(code));
  const removedSheets = [...refMap.keys()].filter((code) => !newMap.has(code));
  const changedSheets = [];
  for (const [code, newS] of newMap) {
    const refS = refMap.get(code);
    if (!refS) continue;
    const changes = [];
    const refHeaderSet = new Set(refS.headers);
    const newHeaderSet = new Set(newS.headers);
    const addedCols = newS.headers.filter((h) => !refHeaderSet.has(h));
    const removedCols = refS.headers.filter((h) => !newHeaderSet.has(h));
    if (addedCols.length) changes.push(`\u65B0\u589E\u5217\uFF1A${addedCols.join("\u3001")}`);
    if (removedCols.length) changes.push(`\u5220\u9664\u5217\uFF1A${removedCols.join("\u3001")}`);
    const refColIdx = {};
    refS.headers.forEach((h, i) => refColIdx[h] = i);
    const newColIdx = {};
    newS.headers.forEach((h, i) => newColIdx[h] = i);
    const isAmountCol = (h) => /金额|本金|利息|罚息|额度/.test(h) && !/利率/.test(h);
    const sharedAmountCols = refS.headers.filter((h) => newHeaderSet.has(h) && isAmountCol(h));
    let oldPrec = 0;
    let newPrec = 0;
    for (const h of sharedAmountCols) {
      const oldCol = refS.rows.map((r2) => r2[refColIdx[h]] ?? "");
      const newCol = newS.rows.map((r2) => r2[newColIdx[h]] ?? "");
      oldPrec = Math.max(oldPrec, maxDecimals([oldCol]));
      newPrec = Math.max(newPrec, maxDecimals([newCol]));
    }
    if (newPrec > oldPrec) changes.push(`\u91D1\u989D/\u6570\u503C\u7CBE\u5EA6\u7531 ${oldPrec} \u4F4D\u63D0\u5347\u81F3 ${newPrec} \u4F4D`);
    if (changes.length) changedSheets.push({ sheet: code, changes });
  }
  return { caseName: c.fileName, refName, addedSheets, removedSheets, changedSheets };
}
function sceneSummary(c, findings) {
  const ev = findings.filter((f2) => !f2.ok).map((f2) => f2.note);
  const abnormal = ev.length ? `\u5F02\u5E38\u70B9\uFF1A${ev.join("\uFF1B")}` : "\u65E0\u5F02\u5E38\u70B9\u3002";
  return `${c.fileName} \u573A\u666F\u65F6\u95F4\u7EBF\u5305\u542B\uFF1A${c.scene.map((s) => s.event).join(" \u2192 ")}\u3002AI \u81EA\u4E3B\u6838\u5BF9\u201C\u573A\u666F\u63CF\u8FF0\u201D\u4E0E\u201C\u5B9E\u9645\u8D26\u52A1\u6570\u636E\u201D\uFF0C${abnormal}`;
}
function analyzeScene(c) {
  const loan = getSheet(c, "LOAN");
  const flow = getSheet(c, "FLOW");
  const plan = getSheet(c, "PLAN");
  const loanRow = loan?.rows[0];
  const loanStatus = loanRow ? loanRow[4] : "";
  const balance = loanRow ? loanRow[6] : "";
  const receiveDate = loanRow ? loanRow[7] : "";
  const findings = [];
  findings.push({
    point: "\u653E\u6B3E\u8BB0\u5F55\u5B58\u5728\u6027",
    ok: !!loanRow && loanStatus !== "0",
    note: loanRow ? `LOAN \u8868\u5B58\u5728\u653E\u6B3E\u8BB0\u5F55\uFF08\u8D37\u6B3E\u72B6\u6001=${loanStatus}\uFF09` : "LOAN \u8868\u65E0\u8BB0\u5F55",
    risk: "low",
    evidence: ["LOAN"]
  });
  const repayEvents = c.scene.filter((s) => /还款|结清/.test(s.event)).length;
  const flowRows = flow?.rows.length ?? 0;
  findings.push({
    point: "\u8FD8\u6B3E\u6D41\u6C34\u4E0E\u573A\u666F\u4E8B\u4EF6\u81EA\u6D3D",
    ok: repayEvents === 0 ? true : flowRows >= repayEvents,
    note: `\u573A\u666F\u542B ${repayEvents} \u4E2A\u8FD8\u6B3E/\u7ED3\u6E05\u4E8B\u4EF6\uFF0CFLOW \u8868 ${flowRows} \u6761\u8BB0\u5F55`,
    risk: "low",
    evidence: ["\u573A\u666F sheet", "FLOW"]
  });
  const refund = c.scene.some((s) => /退款/.test(s.event));
  if (refund) {
    const ok2 = flowRows === 0 && (loan ? loanStatus === "0" : true);
    findings.push({
      point: "\u9000\u6B3E\u573A\u666F\u65E0\u8FD8\u6B3E\u6D41\u6C34",
      ok: ok2,
      note: ok2 ? "\u672A\u51FA\u8D44\u9000\u6B3E\uFF1A\u65E0\u8FD8\u6B3E\u6D41\u6C34\uFF0C\u7B26\u5408\u9884\u671F\uFF08\u8BE5\u6709\u7684\u6570\u636E\u8981\u6709\u3001\u4E0D\u8BE5\u6709\u7684\u4E0D\u80FD\u6709\uFF09" : "\u9000\u6B3E\u573A\u666F\u4E0D\u5E94\u51FA\u73B0\u8FD8\u6B3E\u6D41\u6C34",
      risk: ok2 ? "low" : "high",
      evidence: ["\u573A\u666F sheet", "FLOW"]
    });
  }
  const lendAmt = loanRow ? Number(loanRow[5]) : 0;
  const repaidPrincipal = (flow?.rows ?? []).reduce((s, r2) => s + (Number(r2[3]) || 0), 0);
  const bal = Number(balance) || 0;
  const balanced = Math.abs(lendAmt - repaidPrincipal - bal) < 0.01;
  findings.push({
    point: "\u8D37\u6B3E\u4F59\u989D\u81EA\u6D3D\uFF08\u653E\u6B3E \u2212 \u5DF2\u8FD8\u672C\u91D1 = \u4F59\u989D\uFF09",
    ok: balanced,
    note: `\u653E\u6B3E ${lendAmt} \u2212 \u5DF2\u8FD8\u672C\u91D1 ${repaidPrincipal.toFixed(4)} = \u4F59\u989D ${bal}`,
    risk: balanced ? "low" : "medium",
    evidence: ["LOAN", "FLOW"]
  });
  const overdue = c.scene.some((s) => /逾期/.test(s.event));
  if (overdue) {
    const overdueFlow = (flow?.rows ?? []).find((r2) => r2[2] === "03");
    const pen = overdueFlow ? Number(overdueFlow[5]) : 0;
    findings.push({
      point: "\u903E\u671F\u7F5A\u606F\u5408\u7406\u6027\uFF08\u4E0E\u903E\u671F\u5929\u6570\u5BF9\u5E94\u5173\u7CFB\uFF09",
      ok: true,
      note: `\u903E\u671F\u8FD8\u6B3E FLOW \u542B\u7F5A\u606F ${pen}\uFF0C\u7F5A\u606F\u91D1\u989D\u4E0E\u903E\u671F\u5929\u6570\u7684\u5BF9\u5E94\u5173\u7CFB\u5EFA\u8BAE\u4EBA\u5DE5\u590D\u6838`,
      risk: "medium",
      evidence: ["\u573A\u666F sheet\uFF08\u542B\u903E\u671F\u4E8B\u4EF6\uFF09", "FLOW REPAY_TYPE=03"]
    });
  }
  const timelineOk = findings.every((f2) => f2.ok);
  return { caseName: c.fileName, timelineOk, findings, aiSummary: sceneSummary(c, findings) };
}
function crossProduct(c) {
  const cash = getSheet(c, "CASHFLOW");
  const hasRecon = cash?.headers.includes("\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u8D44\u91D1\u5212\u62E8\u5BF9\u8D26\u7801");
  const newFields = hasRecon ? ["CASHFLOW.\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u8D44\u91D1\u5212\u62E8\u5BF9\u8D26\u7801\uFF08\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u4EA7\u54C1\u4E13\u7528\uFF09"] : [];
  return {
    caseName: c.fileName,
    similarScene: "\u653E\u6B3E/\u8FD8\u6B3E/\u9000\u6B3E/\u91CD\u7EC4 \u7B49\u57FA\u7840\u573A\u666F\u5728\u5176\u4ED6\u4EA7\u54C1\u6848\u4F8B\u4E2D\u5B58\u5728\u7C7B\u4F3C\u5904\u7406",
    structureConsistent: true,
    newFields,
    risk: "low",
    aiSummary: `${c.fileName} \u5F53\u524D\u573A\u666F\u5728\u5176\u4ED6\u4EA7\u54C1\u6848\u4F8B\u4E2D\u5B58\u5728\u7C7B\u4F3C\u5904\u7406\u3002\u65B0\u589E\u5B57\u6BB5\u5747\u4E3A\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u4EA7\u54C1\u4E13\u7528\uFF08\u5982\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u8D44\u91D1\u5212\u62E8\u5BF9\u8D26\u7801\uFF09\uFF0C\u4E0D\u5F71\u54CD\u5176\u4ED6\u4EA7\u54C1\u7EBF\u89E3\u6790\u903B\u8F91\uFF0C\u6574\u4F53\u5F71\u54CD\u8BC4\u4F30\u4E3A\u4F4E\u98CE\u9669\u3002`
  };
}
function q(id, type, content, fields, target, risk, reason, evidence) {
  return { qid: id, type, content, fields, source: "\u6848\u4F8B\u56DB\u7EF4\u5EA6\u6821\u9A8C", evidence, riskLevel: risk, confirmTarget: target, aiReason: reason, status: "pending" };
}
function validateBizRules(cases, rules) {
  const loanRows = cases.flatMap((c) => getSheet(c, "LOAN")?.rows ?? []);
  const flowRows = cases.flatMap((c) => getSheet(c, "FLOW")?.rows ?? []);
  const planRows = cases.flatMap((c) => getSheet(c, "PLAN")?.rows ?? []);
  const repayFlowRows = cases.flatMap((c) => getSheet(c, "REPAYMENTFLOW")?.rows ?? []);
  const loanNos = loanRows.map((r2) => r2[3]);
  const uniqueLoan = new Set(loanNos).size === loanNos.length;
  const rule1ok = cases.every((c) => {
    const r2 = getSheet(c, "LOAN")?.rows[0];
    if (!r2) return true;
    const receive = r2[7];
    const status = r2[4];
    return receive ? status !== "0" : status === "0";
  });
  const hasSeparatePen = flowRows.some((r2) => r2[2] === "03" && (Number(r2[5]) || 0) > 0);
  const hasReplan = planRows.length > 0;
  const flowNos = repayFlowRows.map((r2) => r2[2]);
  const uniqueFlowNo = new Set(flowNos).size === flowNos.length;
  const termPairs = planRows.map((r2) => `${r2[1]}|${r2[2]}`);
  const noTermRepeat = new Set(termPairs).size === termPairs.length;
  const resultBySeq = {
    1: { result: rule1ok ? "pass" : "fail", note: rule1ok ? "\u653E\u6B3E\u5165\u8D26\u65E5\u671F\u975E\u7A7A\u5373\u5DF2\u521B\u5355\uFF0C\u4E0E\u8D37\u6B3E\u72B6\u6001\u4E00\u81F4" : "\u5B58\u5728\u65E5\u671F\u4E0E\u72B6\u6001\u77DB\u76FE" },
    2: { result: "na", note: "\u6F14\u793A\u6848\u4F8B\u4E3A\u5355\u7B14\u501F\u636E\uFF0C\u4E0D\u6D89\u53CA\u8054\u5408\u8D37\u6A21\u5F0F" },
    3: { result: uniqueLoan ? "pass" : "fail", note: uniqueLoan ? "\u8D37\u6B3E\u5355\u53F7\u5168\u5C40\u552F\u4E00\uFF0C\u65E0\u91CD\u590D\u521B\u5355\u98CE\u9669" : "\u5B58\u5728\u91CD\u590D\u8D37\u6B3E\u5355\u53F7" },
    4: { result: "na", note: "\u6F14\u793A\u6570\u636E\u672A\u542B\u8D44\u4EA7\u7C7B\u578B\u5B57\u6BB5" },
    5: { result: "na", note: "\u6F14\u793A\u6570\u636E\u672A\u542B ABS \u6253\u6807/\u89E3\u6807\u573A\u666F" },
    6: { result: "na", note: "\u6F14\u793A\u6570\u636E\u672A\u542B\u51FA\u8D44\u6BD4\u4F8B\u5B57\u6BB5" },
    7: { result: "na", note: "\u6F14\u793A\u6570\u636E\u672A\u542B\u4E1A\u52A1\u6A21\u5F0F\u5B57\u6BB5" },
    8: { result: "na", note: "\u6F14\u793A\u6570\u636E\u672A\u542B\u503A\u8F6C\u627F\u63A5\u573A\u666F" },
    9: { result: hasReplan ? "pass" : "na", note: hasReplan ? "\u542B\u8FD8\u6B3E\u8BA1\u5212\uFF08\u542B\u6539\u5206\u671F/\u91CD\u7EC4\uFF09\u8BB0\u5F55" : "\u4E0D\u9002\u7528" },
    10: { result: hasSeparatePen ? "fail" : "pass", note: hasSeparatePen ? "\u903E\u671F\u7F5A\u606F\u4EE5\u5355\u5217\u5B57\u6BB5\u63D0\u4F9B\uFF0C\u672A\u5E76\u5165\u7F5A\u606F\u5217\uFF0C\u4E0E\u201C\u8FDD\u7EA6\u91D1\u5165\u7F5A\u606F=\u662F\u201D\u4E0D\u7B26" : "\u7F5A\u606F\u5DF2\u5E76\u5165" },
    11: { result: "na", note: "\u6F14\u793A\u6570\u636E\u672A\u542B\u53D6\u73B0\u624B\u7EED\u8D39\u573A\u666F" },
    12: { result: "na", note: "\u6F14\u793A\u6570\u636E\u65E0\u6CD5\u9A8C\u8BC1\u5BBD\u9650\u671F\u5929\u6570" },
    13: { result: "na", note: "\u6F14\u793A\u6570\u636E\u4E1A\u52A1\u65E5\u671F\u4EC5\u5230\u65E5\uFF0C\u65E0\u6CD5\u9A8C\u8BC1\u79D2\u7EA7\u7CBE\u5EA6" },
    14: { result: "pass", note: "\u903E\u671F\u6848\u4F8B\u540E\u672A\u4E8C\u6B21\u5206\u671F" },
    15: { result: hasReplan ? "pass" : "na", note: hasReplan ? "\u5B58\u5728\u91CD\u7EC4\uFF08\u6539\u5206\u671F\uFF09\u573A\u666F" : "\u4E0D\u9002\u7528" },
    16: { result: noTermRepeat ? "pass" : "fail", note: noTermRepeat ? "\u8FD8\u6B3E\u8BA1\u5212\u671F\u6B21\u65E0\u91CD\u590D" : "\u5B58\u5728\u671F\u6B21\u91CD\u590D" },
    17: { result: uniqueFlowNo ? "pass" : "fail", note: uniqueFlowNo ? "\u5B9E\u8FD8\u6D41\u6C34\u53F7\u552F\u4E00" : "\u5B58\u5728\u91CD\u590D\u6D41\u6C34\u53F7" },
    18: { result: uniqueLoan ? "pass" : "fail", note: "\u4E0E\u6CE8\u610F\u70B93\u4E00\u81F4\uFF1A\u8D37\u6B3E\u5355\u53F7\u53BB\u91CD" },
    19: { result: "na", note: "\u6F14\u793A\u6570\u636E\u672A\u542B\u8BA1\u606F\u65E5\u671F\u5B57\u6BB5" },
    20: { result: "na", note: "\u6F14\u793A\u6570\u636E\u672A\u542B\u53D6\u73B0\u8BA1\u606F\u573A\u666F" },
    21: { result: noTermRepeat ? "pass" : "fail", note: noTermRepeat ? "\u671F\u6B21\u65E0\u91CD\u590D" : "\u5B58\u5728\u671F\u6B21\u91CD\u590D" }
  };
  const validations = rules.map((r2) => {
    const res = resultBySeq[r2.seq] ?? { result: "na", note: "\u672A\u7EB3\u5165\u6F14\u793A\u6821\u9A8C\u8303\u56F4" };
    return { seq: r2.seq, rule: r2.rule, result: res.result, note: res.note };
  });
  const questions = [];
  if (hasSeparatePen) {
    questions.push(
      q(
        "Q_CASE_RULE10",
        "internal",
        "\u5386\u53F2\u6CE8\u610F\u70B9 10\uFF08\u8FDD\u7EA6\u91D1\u5165\u7F5A\u606F=\u662F\uFF09\uFF1A\u6848\u4F8B3 \u903E\u671F\u7F5A\u606F\u4EE5\u5355\u5217\u5B57\u6BB5 REPAY_PEN \u63D0\u4F9B\u3001\u672A\u5E76\u5165\u7F5A\u606F\u5217\uFF0C\u8BF7\u786E\u8BA4\u662F\u5426\u7B26\u5408\u201C\u8FDD\u7EA6\u91D1\u5165\u7F5A\u606F\u201D\u89C4\u5219\uFF0C\u6216\u8C03\u6574\u63A5\u5165\u89E3\u6790\u903B\u8F91\u3002",
        ["REPAY_PEN", "FLOW"],
        "\u5185\u90E8\u4EA7\u54C1+\u7814\u53D1",
        "medium",
        "\u6848\u4F8B3 \u903E\u671F\u8FD8\u6B3E FLOW \u4E2D\u7F5A\u606F\u5355\u72EC\u5217\u793A",
        ["\u6848\u4F8B3 FLOW REPAY_TYPE=03", "\u5386\u53F2\u6CE8\u610F\u70B9 10"]
      )
    );
  }
  if (cases.some((c) => getSheet(c, "CASHFLOW")?.headers.includes("\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u8D44\u91D1\u5212\u62E8\u5BF9\u8D26\u7801"))) {
    questions.push(
      q(
        "Q_CASE_CASHFLOW",
        "dev",
        "CASHFLOW \u65B0\u589E\u201C\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u8D44\u91D1\u5212\u62E8\u5BF9\u8D26\u7801\u201D\u4E3A\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u4EA7\u54C1\u4E13\u7528\u5B57\u6BB5\uFF0C\u8BF7\u786E\u8BA4\u662F\u5426\u9700\u5728\u901A\u7528\u89E3\u6790\u4E2D\u65C1\u8DEF\u5904\u7406\uFF0C\u907F\u514D\u5F71\u54CD\u5176\u4ED6\u4EA7\u54C1\u7EBF\u3002",
        ["RECON_CODE", "CASHFLOW"],
        "\u7814\u53D1",
        "low",
        "\u8DE8\u4EA7\u54C1\u7EBF\u7C7B\u6BD4\uFF1A\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u4E13\u7528\u5B57\u6BB5",
        ["CASHFLOW \u6A21\u677F", "\u8DE8\u4EA7\u54C1\u7EBF\u7C7B\u6BD4"]
      )
    );
  }
  return { validations, questions };
}
function runCaseAnalysis(params) {
  const { cases, templates, reference, rules } = params;
  const structureChecks = cases.map((c) => structureCheck(c, templates));
  const versionDiffs = cases.map((c) => versionDiff(c, reference && reference.fileName.startsWith(c.fileName) ? reference : null));
  const sceneAnalyses = cases.map((c) => analyzeScene(c));
  const crossProducts = cases.map((c) => crossProduct(c));
  const { validations, questions } = validateBizRules(cases, rules);
  return {
    generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    isMock: true,
    structureChecks,
    versionDiffs,
    sceneAnalyses,
    crossProducts,
    ruleValidations: validations,
    openQuestions: questions
  };
}

// src/data/accountDoc.ts
function f(p) {
  return {
    dataType: "VARCHAR(64)",
    length: "",
    required: "N",
    description: "",
    enumValues: [],
    exampleValue: "",
    remark: "",
    source: "accountDoc",
    ...p
  };
}
var accountTemplates = [
  {
    sheetKey: "\u8D26\u52A1\u6587\u4EF6\u660E\u7EC6_\u5BA2\u6237\u4FE1\u606F",
    fileCode: "CUS",
    cnName: "\u5BA2\u6237\u4FE1\u606F",
    fields: [
      f({ fieldName: "BIZ_DATE", chineseName: "\u4E1A\u52A1\u65E5\u671F", dataType: "DATE", required: "Y", format: "yyyyMMdd" }),
      f({ fieldName: "CONTRACT_NO", chineseName: "\u5408\u540C\u53F7", dataType: "VARCHAR(32)", required: "Y" }),
      f({ fieldName: "CUST_NO", chineseName: "\u5BA2\u6237\u7F16\u53F7", dataType: "VARCHAR(32)", required: "Y" }),
      f({ fieldName: "CUST_NAME", chineseName: "\u5BA2\u6237\u59D3\u540D", dataType: "VARCHAR(64)", required: "Y" }),
      f({ fieldName: "ID_TYPE", chineseName: "\u8BC1\u4EF6\u7C7B\u578B", dataType: "VARCHAR(2)", enumValues: ["01", "02", "03"], remark: "01=\u8EAB\u4EFD\u8BC1 02=\u62A4\u7167 03=\u5176\u4ED6" }),
      f({ fieldName: "ID_NO", chineseName: "\u8BC1\u4EF6\u53F7\u7801", dataType: "VARCHAR(32)", required: "Y" }),
      f({ fieldName: "MOBILE", chineseName: "\u624B\u673A\u53F7", dataType: "VARCHAR(11)", required: "Y" }),
      f({ fieldName: "CUST_TYPE", chineseName: "\u5BA2\u6237\u7C7B\u578B", dataType: "VARCHAR(2)", enumValues: ["1", "2"], remark: "1=\u4E2A\u4EBA 2=\u4F01\u4E1A" })
    ]
  },
  {
    sheetKey: "\u8D26\u52A1\u6587\u4EF6\u660E\u7EC6_\u5BA2\u6237\u6388\u4FE1",
    fileCode: "CUSCREDIT",
    cnName: "\u5BA2\u6237\u6388\u4FE1",
    fields: [
      f({ fieldName: "BIZ_DATE", chineseName: "\u4E1A\u52A1\u65E5\u671F", dataType: "DATE", required: "Y", format: "yyyyMMdd" }),
      f({ fieldName: "CONTRACT_NO", chineseName: "\u5408\u540C\u53F7", dataType: "VARCHAR(32)", required: "Y" }),
      f({ fieldName: "CREDIT_LIMIT", chineseName: "\u6388\u4FE1\u989D\u5EA6", dataType: "DECIMAL(16,4)", required: "Y" }),
      f({ fieldName: "CREDIT_TERM", chineseName: "\u6388\u4FE1\u671F\u9650", dataType: "INT", required: "Y" }),
      f({ fieldName: "CREDIT_STATUS", chineseName: "\u6388\u4FE1\u72B6\u6001", dataType: "VARCHAR(2)", enumValues: ["0", "1", "2"], remark: "0=\u5931\u6548 1=\u751F\u6548 2=\u51BB\u7ED3" }),
      f({ fieldName: "CREDIT_RATE", chineseName: "\u6388\u4FE1\u5229\u7387", dataType: "DECIMAL(8,4)", required: "Y" }),
      f({ fieldName: "EFFECTIVE_DATE", chineseName: "\u989D\u5EA6\u751F\u6548\u65E5", dataType: "DATE", required: "Y", format: "yyyyMMdd" })
    ]
  },
  {
    sheetKey: "\u8D26\u52A1\u6587\u4EF6\u660E\u7EC6_\u989D\u5EA6\u8C03\u6574",
    fileCode: "QUOTAADJUST",
    cnName: "\u989D\u5EA6\u8C03\u6574",
    fields: [
      f({ fieldName: "BIZ_DATE", chineseName: "\u4E1A\u52A1\u65E5\u671F", dataType: "DATE", required: "Y", format: "yyyyMMdd" }),
      f({ fieldName: "CONTRACT_NO", chineseName: "\u5408\u540C\u53F7", dataType: "VARCHAR(32)", required: "Y" }),
      f({ fieldName: "PRE_QUOTA", chineseName: "\u8C03\u6574\u524D\u989D\u5EA6", dataType: "DECIMAL(16,4)", required: "Y" }),
      f({ fieldName: "POST_QUOTA", chineseName: "\u8C03\u6574\u540E\u989D\u5EA6", dataType: "DECIMAL(16,4)", required: "Y" }),
      f({ fieldName: "ADJUST_TYPE", chineseName: "\u8C03\u6574\u7C7B\u578B", dataType: "VARCHAR(2)", enumValues: ["1", "2"], remark: "1=\u63D0\u5347 2=\u964D\u4F4E" }),
      f({ fieldName: "ADJUST_REASON", chineseName: "\u8C03\u6574\u539F\u56E0", dataType: "VARCHAR(128)" })
    ]
  },
  {
    sheetKey: "\u8D26\u52A1\u6587\u4EF6\u660E\u7EC6_\u8D39\u7528\u8C03\u6574",
    fileCode: "FEEADJUST",
    cnName: "\u8D39\u7528\u8C03\u6574",
    fields: [
      f({ fieldName: "BIZ_DATE", chineseName: "\u4E1A\u52A1\u65E5\u671F", dataType: "DATE", required: "Y", format: "yyyyMMdd" }),
      f({ fieldName: "CONTRACT_NO", chineseName: "\u5408\u540C\u53F7", dataType: "VARCHAR(32)", required: "Y" }),
      f({ fieldName: "FEE_ITEM", chineseName: "\u8D39\u7528\u9879", dataType: "VARCHAR(32)", enumValues: ["01", "02", "03"], remark: "01=\u624B\u7EED\u8D39 02=\u670D\u52A1\u8D39 03=\u7F5A\u606F" }),
      f({ fieldName: "PRE_AMT", chineseName: "\u8C03\u6574\u524D\u91D1\u989D", dataType: "DECIMAL(16,4)", required: "Y" }),
      f({ fieldName: "POST_AMT", chineseName: "\u8C03\u6574\u540E\u91D1\u989D", dataType: "DECIMAL(16,4)", required: "Y" }),
      f({ fieldName: "ADJUST_TYPE", chineseName: "\u8C03\u6574\u7C7B\u578B", dataType: "VARCHAR(2)", enumValues: ["1", "2"], remark: "1=\u8C03\u589E 2=\u8C03\u51CF" })
    ]
  },
  {
    sheetKey: "\u8D26\u52A1\u6587\u4EF6\u660E\u7EC6_\u5BA2\u6237\u4FE1\u606F\u53D8\u66F4",
    fileCode: "CUSCHANGE",
    cnName: "\u5BA2\u6237\u4FE1\u606F\u53D8\u66F4",
    fields: [
      f({ fieldName: "BIZ_DATE", chineseName: "\u4E1A\u52A1\u65E5\u671F", dataType: "DATE", required: "Y", format: "yyyyMMdd" }),
      f({ fieldName: "CONTRACT_NO", chineseName: "\u5408\u540C\u53F7", dataType: "VARCHAR(32)", required: "Y" }),
      f({ fieldName: "CHANGE_ITEM", chineseName: "\u53D8\u66F4\u9879", dataType: "VARCHAR(32)", enumValues: ["01", "02"], remark: "01=\u624B\u673A\u53F7 02=\u5730\u5740" }),
      f({ fieldName: "CHANGE_BEFORE", chineseName: "\u53D8\u66F4\u524D", dataType: "VARCHAR(64)" }),
      f({ fieldName: "CHANGE_AFTER", chineseName: "\u53D8\u66F4\u540E", dataType: "VARCHAR(64)" })
    ]
  },
  {
    sheetKey: "\u8D26\u52A1\u6587\u4EF6\u660E\u7EC6_\u8D37\u6B3E\u501F\u636E\u4FE1\u606F",
    fileCode: "LOAN",
    cnName: "\u8D37\u6B3E\u501F\u636E\u4FE1\u606F",
    fields: [
      f({ fieldName: "BIZ_DATE", chineseName: "\u4E1A\u52A1\u65E5\u671F", dataType: "DATE", required: "Y", format: "yyyyMMdd" }),
      f({ fieldName: "CONTRACT_NO", chineseName: "\u5408\u540C\u53F7", dataType: "VARCHAR(32)", required: "Y" }),
      f({ fieldName: "CUST_NO", chineseName: "\u5BA2\u6237\u7F16\u53F7", dataType: "VARCHAR(32)", required: "Y" }),
      f({ fieldName: "LOAN_NO", chineseName: "\u8D37\u6B3E\u5355\u53F7", dataType: "VARCHAR(32)", required: "Y" }),
      f({ fieldName: "LOAN_STATUS", chineseName: "\u8D37\u6B3E\u72B6\u6001", dataType: "VARCHAR(2)", required: "Y", enumValues: ["0", "1", "2", "3"], remark: "0=\u672A\u653E\u6B3E 1=\u6B63\u5E38 2=\u7ED3\u6E05 3=\u903E\u671F" }),
      f({ fieldName: "LOAN_AMT", chineseName: "\u653E\u6B3E\u91D1\u989D", dataType: "DECIMAL(16,4)", required: "Y" }),
      f({ fieldName: "LOAN_BALANCE", chineseName: "\u8D37\u6B3E\u4F59\u989D", dataType: "DECIMAL(16,4)", required: "Y" }),
      f({ fieldName: "RECEIVE_DATE", chineseName: "\u653E\u6B3E\u5165\u8D26\u65E5\u671F", dataType: "DATE", required: "N", format: "yyyy-MM-dd", remark: "\u65B0\u589E\u5B57\u6BB5\uFF0C\u521B\u5355\u65E5\u8D77\u624D\u6709\u503C" }),
      f({ fieldName: "CURRENCY", chineseName: "\u5E01\u79CD", dataType: "VARCHAR(3)", enumValues: ["CNY"] }),
      f({ fieldName: "LOAN_RATE", chineseName: "\u8D37\u6B3E\u5229\u7387", dataType: "DECIMAL(8,4)", required: "Y" })
    ]
  },
  {
    sheetKey: "\u8D26\u52A1\u6587\u4EF6\u660E\u7EC6_\u8FD8\u6B3E\u8BA1\u5212",
    fileCode: "PLAN",
    cnName: "\u8FD8\u6B3E\u8BA1\u5212",
    fields: [
      f({ fieldName: "BIZ_DATE", chineseName: "\u4E1A\u52A1\u65E5\u671F", dataType: "DATE", required: "Y", format: "yyyyMMdd" }),
      f({ fieldName: "LOAN_NO", chineseName: "\u8D37\u6B3E\u5355\u53F7", dataType: "VARCHAR(32)", required: "Y" }),
      f({ fieldName: "TERM_NO", chineseName: "\u671F\u6B21", dataType: "INT", required: "Y" }),
      f({ fieldName: "DUE_DATE", chineseName: "\u5E94\u8FD8\u65E5\u671F", dataType: "DATE", required: "Y", format: "yyyyMMdd" }),
      f({ fieldName: "DUE_PRIN", chineseName: "\u5E94\u8FD8\u672C\u91D1", dataType: "DECIMAL(16,4)", required: "Y" }),
      f({ fieldName: "DUE_INT", chineseName: "\u5E94\u8FD8\u5229\u606F", dataType: "DECIMAL(16,4)", required: "Y" }),
      f({ fieldName: "DUE_PEN", chineseName: "\u5E94\u8FD8\u7F5A\u606F", dataType: "DECIMAL(16,4)", required: "N" }),
      f({ fieldName: "PLAN_STATUS", chineseName: "\u8FD8\u6B3E\u8BA1\u5212\u72B6\u6001", dataType: "VARCHAR(2)", enumValues: ["0", "1", "2"], remark: "0=\u5F85\u8FD8 1=\u5DF2\u8FD8 2=\u903E\u671F" })
    ]
  },
  {
    sheetKey: "\u8D26\u52A1\u6587\u4EF6\u660E\u7EC6_\u8FD8\u6B3E\u6D41\u6C34",
    fileCode: "FLOW",
    cnName: "\u8FD8\u6B3E\u6D41\u6C34",
    fields: [
      f({ fieldName: "BIZ_DATE", chineseName: "\u4E1A\u52A1\u65E5\u671F", dataType: "DATE", required: "Y", format: "yyyyMMdd" }),
      f({ fieldName: "LOAN_NO", chineseName: "\u8D37\u6B3E\u5355\u53F7", dataType: "VARCHAR(32)", required: "Y" }),
      f({ fieldName: "REPAY_TYPE", chineseName: "\u8FD8\u6B3E\u7C7B\u578B", dataType: "VARCHAR(2)", required: "Y", enumValues: ["01", "02", "03"], remark: "01=\u6B63\u5E38 02=\u63D0\u524D\u7ED3\u6E05 03=\u903E\u671F\u8FD8\u6B3E" }),
      f({ fieldName: "REPAY_PRIN", chineseName: "\u8FD8\u6B3E\u672C\u91D1", dataType: "DECIMAL(16,4)", required: "Y" }),
      f({ fieldName: "REPAY_INT", chineseName: "\u8FD8\u6B3E\u5229\u606F", dataType: "DECIMAL(16,4)", required: "Y" }),
      f({ fieldName: "REPAY_PEN", chineseName: "\u8FD8\u6B3E\u7F5A\u606F", dataType: "DECIMAL(16,4)", required: "N" }),
      f({ fieldName: "REPAY_TOTAL", chineseName: "\u5B9E\u8FD8\u603B\u989D", dataType: "DECIMAL(16,4)", required: "Y" }),
      f({ fieldName: "REPAY_CHANNEL", chineseName: "\u8FD8\u6B3E\u6E20\u9053", dataType: "VARCHAR(2)", enumValues: ["01", "02"], remark: "01=\u4EE3\u6263 02=\u4E3B\u52A8\u8FD8\u6B3E" })
    ]
  },
  {
    sheetKey: "\u8D26\u52A1\u6587\u4EF6\u660E\u7EC6_\u4EE3\u507F\u6D41\u6C34",
    fileCode: "COMFLOW",
    cnName: "\u4EE3\u507F\u6D41\u6C34",
    fields: [
      f({ fieldName: "BIZ_DATE", chineseName: "\u4E1A\u52A1\u65E5\u671F", dataType: "DATE", required: "Y", format: "yyyyMMdd" }),
      f({ fieldName: "LOAN_NO", chineseName: "\u8D37\u6B3E\u5355\u53F7", dataType: "VARCHAR(32)", required: "Y" }),
      f({ fieldName: "COMP_TYPE", chineseName: "\u4EE3\u507F\u7C7B\u578B", dataType: "VARCHAR(2)", enumValues: ["1", "2"], remark: "1=\u62C5\u4FDD\u4EE3\u507F 2=\u4FDD\u9669\u4EE3\u507F" }),
      f({ fieldName: "COMP_AMT", chineseName: "\u4EE3\u507F\u91D1\u989D", dataType: "DECIMAL(16,4)", required: "Y" }),
      f({ fieldName: "COMP_ORG", chineseName: "\u4EE3\u507F\u673A\u6784", dataType: "VARCHAR(64)" })
    ]
  },
  {
    sheetKey: "\u8D26\u52A1\u6587\u4EF6\u660E\u7EC6_\u5B9E\u8FD8\u6D41\u6C34",
    fileCode: "REPAYMENTFLOW",
    cnName: "\u5B9E\u8FD8\u6D41\u6C34",
    fields: [
      f({ fieldName: "BIZ_DATE", chineseName: "\u4E1A\u52A1\u65E5\u671F", dataType: "DATE", required: "Y", format: "yyyyMMdd" }),
      f({ fieldName: "LOAN_NO", chineseName: "\u8D37\u6B3E\u5355\u53F7", dataType: "VARCHAR(32)", required: "Y" }),
      f({ fieldName: "FLOW_NO", chineseName: "\u6D41\u6C34\u53F7", dataType: "VARCHAR(32)", required: "Y" }),
      f({ fieldName: "ACT_PRIN", chineseName: "\u5B9E\u8FD8\u672C\u91D1", dataType: "DECIMAL(16,4)", required: "Y" }),
      f({ fieldName: "ACT_INT", chineseName: "\u5B9E\u8FD8\u5229\u606F", dataType: "DECIMAL(16,4)", required: "Y" }),
      f({ fieldName: "ACT_PEN", chineseName: "\u5B9E\u8FD8\u7F5A\u606F", dataType: "DECIMAL(16,4)", required: "N" })
    ]
  },
  {
    sheetKey: "\u8D26\u52A1\u6587\u4EF6\u660E\u7EC6_\u8D44\u91D1\u6D41\u6C34",
    fileCode: "CASHFLOW",
    cnName: "\u8D44\u91D1\u6D41\u6C34",
    fields: [
      f({ fieldName: "BIZ_DATE", chineseName: "\u4E1A\u52A1\u65E5\u671F", dataType: "DATE", required: "Y", format: "yyyyMMdd" }),
      f({ fieldName: "LOAN_NO", chineseName: "\u8D37\u6B3E\u5355\u53F7", dataType: "VARCHAR(32)", required: "Y" }),
      f({ fieldName: "CASH_CODE", chineseName: "\u8D44\u91D1\u5212\u62E8\u7801", dataType: "VARCHAR(32)", required: "Y" }),
      f({ fieldName: "CASH_DIR", chineseName: "\u5212\u62E8\u65B9\u5411", dataType: "VARCHAR(2)", enumValues: ["1", "2"], remark: "1=\u5165 2=\u51FA" }),
      f({ fieldName: "CASH_AMT", chineseName: "\u5212\u62E8\u91D1\u989D", dataType: "DECIMAL(16,4)", required: "Y" }),
      f({ fieldName: "RECON_CODE", chineseName: "\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u8D44\u91D1\u5212\u62E8\u5BF9\u8D26\u7801", dataType: "VARCHAR(32)", remark: "\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u4EA7\u54C1\u4E13\u7528\uFF0C\u5176\u4ED6\u4EA7\u54C1\u7EBF\u65E0\u6B64\u5B57\u6BB5" })
    ]
  },
  {
    sheetKey: "\u8D26\u52A1\u6587\u4EF6\u660E\u7EC6_\u989D\u5EA6\u8D39\u7528",
    fileCode: "QUOTAFEE",
    cnName: "\u989D\u5EA6\u8D39\u7528",
    fields: [
      f({ fieldName: "BIZ_DATE", chineseName: "\u4E1A\u52A1\u65E5\u671F", dataType: "DATE", required: "Y", format: "yyyyMMdd" }),
      f({ fieldName: "CONTRACT_NO", chineseName: "\u5408\u540C\u53F7", dataType: "VARCHAR(32)", required: "Y" }),
      f({ fieldName: "FEE_TYPE", chineseName: "\u8D39\u7528\u7C7B\u578B", dataType: "VARCHAR(2)", enumValues: ["01", "02"], remark: "01=\u53D6\u73B0\u624B\u7EED\u8D39 02=\u5206\u671F\u624B\u7EED\u8D39" }),
      f({ fieldName: "FEE_AMT", chineseName: "\u8D39\u7528\u91D1\u989D", dataType: "DECIMAL(16,4)", required: "Y" }),
      f({ fieldName: "FEE_MODE", chineseName: "\u8BA1\u8D39\u65B9\u5F0F", dataType: "VARCHAR(2)", enumValues: ["1", "2"], remark: "1=\u4E00\u6B21\u6027 2=\u5206\u671F" })
    ]
  }
];
var accountTemplateByCode = Object.fromEntries(
  accountTemplates.map((t) => [t.fileCode, t])
);

// src/data/caseFiles.ts
function sheet(code, rows) {
  const t = accountTemplateByCode[code];
  return {
    sheetName: code,
    cnName: t.cnName,
    headers: t.fields.map((f2) => f2.chineseName),
    rows
  };
}
var caseFiles = [
  {
    fileName: "\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u6848\u4F8B1",
    scene: [
      { bizDate: "20250918", event: "\u653E\u6B3E", loanNo: "DEMO-LOAN-0001", detail: "\u653E\u6B3E 1500 \u5143\uFF0C3 \u671F" },
      { bizDate: "20251110", event: "\u7B2C1\u671F\u8FD8\u6B3E", loanNo: "DEMO-LOAN-0001" },
      { bizDate: "20251220", event: "\u7B2C2\u671F\u8FD8\u6B3E", loanNo: "DEMO-LOAN-0001" },
      { bizDate: "20260110", event: "\u7B2C3\u671F\u8FD8\u6B3E\uFF08\u7ED3\u6E05\uFF09", loanNo: "DEMO-LOAN-0001" }
    ],
    sheets: [
      sheet("CUS", [["20250918", "HT20250918001", "C20250918001", "\u5BA2\u6237\u7532", "01", "110101********4321", "139****1111", "1"]]),
      sheet("CUSCREDIT", [["20250918", "HT20250918001", "8000.0000", "12", "1", "14.8000", "20250918"]]),
      sheet("QUOTAADJUST", []),
      sheet("FEEADJUST", []),
      sheet("CUSCHANGE", []),
      sheet("LOAN", [["20250918", "HT20250918001", "C20250918001", "DEMO-LOAN-0001", "2", "1500.0000", "0.0000", "2025-09-20", "CNY", "14.8000"]]),
      sheet("PLAN", [
        ["20250918", "DEMO-LOAN-0001", "1", "20251110", "500.0000", "19.5000", "0.0000", "2"],
        ["20250918", "DEMO-LOAN-0001", "2", "20251220", "500.0000", "14.8000", "0.0000", "2"],
        ["20250918", "DEMO-LOAN-0001", "3", "20260110", "500.0000", "9.8000", "0.0000", "2"]
      ]),
      sheet("FLOW", [
        ["20251110", "DEMO-LOAN-0001", "01", "500.0000", "19.5000", "0.0000", "519.5000", "01"],
        ["20251220", "DEMO-LOAN-0001", "01", "500.0000", "14.8000", "0.0000", "514.8000", "01"],
        ["20260110", "DEMO-LOAN-0001", "01", "500.0000", "9.8000", "0.0000", "509.8000", "01"]
      ]),
      sheet("COMFLOW", []),
      sheet("REPAYMENTFLOW", [
        ["20251110", "DEMO-LOAN-0001", "F20251110001", "500.0000", "19.5000", "0.0000"],
        ["20251220", "DEMO-LOAN-0001", "F20251220001", "500.0000", "14.8000", "0.0000"],
        ["20260110", "DEMO-LOAN-0001", "F20260110001", "500.0000", "9.8000", "0.0000"]
      ]),
      sheet("CASHFLOW", [["20250918", "DEMO-LOAN-0001", "CASH1001", "1", "1500.0000", "XH20250918001"]]),
      sheet("QUOTAFEE", [["20250918", "HT20250918001", "02", "45.0000", "2"]])
    ]
  },
  {
    fileName: "\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u6848\u4F8B2",
    scene: [
      { bizDate: "20250918", event: "\u653E\u6B3E", loanNo: "DEMO-LOAN-0002", detail: "\u653E\u6B3E 1500 \u5143\uFF0C3 \u671F" },
      { bizDate: "20251110", event: "\u7B2C1\u671F\u8FD8\u6B3E", loanNo: "DEMO-LOAN-0002" },
      { bizDate: "20250925", event: "\u63D0\u524D\u7ED3\u6E05", loanNo: "DEMO-LOAN-0002", detail: "\u7B2C1\u671F\u540E\u63D0\u524D\u7ED3\u6E05\u5269\u4F59\u672C\u91D1" }
    ],
    sheets: [
      sheet("CUS", [["20250918", "HT20250918002", "C20250918002", "\u5BA2\u6237\u4E59", "01", "110101********6532", "139****2222", "1"]]),
      sheet("CUSCREDIT", [["20250918", "HT20250918002", "8000.0000", "12", "1", "14.8000", "20250918"]]),
      sheet("QUOTAADJUST", []),
      sheet("FEEADJUST", []),
      sheet("CUSCHANGE", []),
      sheet("LOAN", [["20250918", "HT20250918002", "C20250918002", "DEMO-LOAN-0002", "2", "1500.0000", "0.0000", "2025-09-20", "CNY", "14.8000"]]),
      sheet("PLAN", [
        ["20250918", "DEMO-LOAN-0002", "1", "20251110", "500.0000", "19.5000", "0.0000", "2"],
        ["20250918", "DEMO-LOAN-0002", "2", "20251220", "500.0000", "14.8000", "0.0000", "2"],
        ["20250918", "DEMO-LOAN-0002", "3", "20260110", "500.0000", "9.8000", "0.0000", "2"]
      ]),
      sheet("FLOW", [
        ["20251110", "DEMO-LOAN-0002", "01", "500.0000", "19.5000", "0.0000", "519.5000", "01"],
        ["20250925", "DEMO-LOAN-0002", "02", "1000.0000", "29.6000", "0.0000", "1029.6000", "02"]
      ]),
      sheet("COMFLOW", []),
      sheet("REPAYMENTFLOW", [
        ["20251110", "DEMO-LOAN-0002", "F20251110002", "500.0000", "19.5000", "0.0000"],
        ["20250925", "DEMO-LOAN-0002", "F20250925002", "1000.0000", "29.6000", "0.0000"]
      ]),
      sheet("CASHFLOW", [["20250918", "DEMO-LOAN-0002", "CASH1002", "1", "1500.0000", "XH20250918002"]]),
      sheet("QUOTAFEE", [["20250918", "HT20250918002", "02", "45.0000", "2"]])
    ]
  },
  {
    fileName: "\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u6848\u4F8B3",
    scene: [
      { bizDate: "20250918", event: "\u653E\u6B3E", loanNo: "DEMO-LOAN-0003", detail: "\u653E\u6B3E 1500 \u5143\uFF0C3 \u671F" },
      { bizDate: "20251008", event: "\u91CD\u7EC4", loanNo: "DEMO-LOAN-0003", detail: "\u8FD8\u6B3E\u8BA1\u5212\u53D8\u66F4\uFF08\u6539\u5206\u671F\uFF09" },
      { bizDate: "20251221", event: "\u903E\u671F\u8FD8\u6B3E\uFF08\u542B\u672C\u5229\u7F5A\uFF09", loanNo: "DEMO-LOAN-0003", detail: "\u903E\u671F\u8FD8\u6B3E\uFF0C\u5B9E\u8FD8\u7F5A\u606F>0" },
      { bizDate: "20260110", event: "\u7B2C3\u671F\u8FD8\u6B3E", loanNo: "DEMO-LOAN-0003" }
    ],
    sheets: [
      sheet("CUS", [["20250918", "HT20250918003", "C20250918003", "\u5BA2\u6237\u4E19", "01", "110101********8643", "139****3333", "1"]]),
      sheet("CUSCREDIT", [["20250918", "HT20250918003", "8000.0000", "12", "1", "14.8000", "20250918"]]),
      sheet("QUOTAADJUST", []),
      sheet("FEEADJUST", []),
      sheet("CUSCHANGE", []),
      sheet("LOAN", [["20250918", "HT20250918003", "C20250918003", "DEMO-LOAN-0003", "2", "1500.0000", "0.0000", "2025-09-20", "CNY", "14.8000"]]),
      sheet("PLAN", [
        ["20250918", "DEMO-LOAN-0003", "1", "20251110", "500.0000", "19.5000", "0.0000", "2"],
        ["20251008", "DEMO-LOAN-0003", "2", "20251221", "500.0000", "14.8000", "9.3600", "2"],
        ["20251008", "DEMO-LOAN-0003", "3", "20260110", "500.0000", "9.8000", "0.0000", "2"]
      ]),
      sheet("FLOW", [
        ["20251110", "DEMO-LOAN-0003", "01", "500.0000", "19.5000", "0.0000", "519.5000", "01"],
        ["20251221", "DEMO-LOAN-0003", "03", "500.0000", "14.8000", "9.3600", "524.1600", "01"],
        ["20260110", "DEMO-LOAN-0003", "01", "500.0000", "9.8000", "0.0000", "509.8000", "01"]
      ]),
      sheet("COMFLOW", []),
      sheet("REPAYMENTFLOW", [
        ["20251110", "DEMO-LOAN-0003", "F20251110003", "500.0000", "19.5000", "0.0000"],
        ["20251221", "DEMO-LOAN-0003", "F20251221003", "500.0000", "14.8000", "9.3600"],
        ["20260110", "DEMO-LOAN-0003", "F20260110003", "500.0000", "9.8000", "0.0000"]
      ]),
      sheet("CASHFLOW", [["20250918", "DEMO-LOAN-0003", "CASH1003", "1", "1500.0000", "XH20250918003"]]),
      sheet("QUOTAFEE", [["20250918", "HT20250918003", "02", "45.0000", "2"]])
    ]
  },
  {
    fileName: "\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u6848\u4F8B4",
    scene: [
      { bizDate: "20250918", event: "\u653E\u6B3E\u7533\u8BF7", loanNo: "DEMO-LOAN-0004", detail: "\u7533\u8BF7 1500 \u5143" },
      { bizDate: "20250924", event: "\u672A\u51FA\u8D44\u9000\u6B3E", loanNo: "DEMO-LOAN-0004", detail: "\u653E\u6B3E\u672A\u6210\u529F\uFF0C\u89E6\u53D1\u9000\u6B3E\uFF0C\u4E0D\u5E94\u6709\u8FD8\u6B3E\u6D41\u6C34" }
    ],
    sheets: [
      sheet("CUS", [["20250918", "HT20250918004", "C20250918004", "\u5BA2\u6237\u4E01", "01", "110101********9754", "139****4444", "1"]]),
      sheet("CUSCREDIT", [["20250918", "HT20250918004", "8000.0000", "12", "1", "14.8000", "20250918"]]),
      sheet("QUOTAADJUST", []),
      sheet("FEEADJUST", []),
      sheet("CUSCHANGE", []),
      // 放款未成功：贷款状态 0，余额 0，放款入账日期为空（未创单）
      sheet("LOAN", [["20250918", "HT20250918004", "C20250918004", "DEMO-LOAN-0004", "0", "1500.0000", "0.0000", "", "CNY", "14.8000"]]),
      sheet("PLAN", []),
      sheet("FLOW", []),
      sheet("COMFLOW", []),
      sheet("REPAYMENTFLOW", []),
      sheet("CASHFLOW", []),
      sheet("QUOTAFEE", [])
    ]
  },
  {
    // 差异化场景：还款中（非终态）——已还 2 期，第 3 期尚未发生，余额 > 0，无逾期无罚息
    fileName: "\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u6848\u4F8B5",
    scene: [
      { bizDate: "20250918", event: "\u653E\u6B3E", loanNo: "DEMO-LOAN-0005", detail: "\u653E\u6B3E 1500 \u5143\uFF0C3 \u671F" },
      { bizDate: "20251110", event: "\u7B2C1\u671F\u8FD8\u6B3E", loanNo: "DEMO-LOAN-0005" },
      { bizDate: "20251220", event: "\u7B2C2\u671F\u8FD8\u6B3E", loanNo: "DEMO-LOAN-0005" },
      { bizDate: "20260110", event: "\u7B2C3\u671F\u5F85\u507F\u8FD8\uFF08\u8BA1\u5212\u5185\uFF0C\u5C1A\u672A\u53D1\u751F\uFF09", loanNo: "DEMO-LOAN-0005", detail: "\u5F53\u524D\u4E3A\u8FD8\u6B3E\u4E2D\u72B6\u6001\uFF0C\u4F59\u989D 500 \u5143" }
    ],
    sheets: [
      sheet("CUS", [["20250918", "HT20250918005", "C20250918005", "\u5BA2\u6237\u620A", "01", "110101********4555", "139****5555", "1"]]),
      sheet("CUSCREDIT", [["20250918", "HT20250918005", "8000.0000", "12", "1", "14.8000", "20250918"]]),
      sheet("QUOTAADJUST", []),
      sheet("FEEADJUST", []),
      sheet("CUSCHANGE", []),
      sheet("LOAN", [["20250918", "HT20250918005", "C20250918005", "DEMO-LOAN-0005", "2", "1500.0000", "500.0000", "2025-09-20", "CNY", "14.8000"]]),
      sheet("PLAN", [
        ["20250918", "DEMO-LOAN-0005", "1", "20251110", "500.0000", "19.5000", "0.0000", "2"],
        ["20250918", "DEMO-LOAN-0005", "2", "20251220", "500.0000", "14.8000", "0.0000", "2"],
        ["20250918", "DEMO-LOAN-0005", "3", "20260110", "500.0000", "9.8000", "0.0000", "2"]
      ]),
      sheet("FLOW", [
        ["20251110", "DEMO-LOAN-0005", "01", "500.0000", "19.5000", "0.0000", "519.5000", "01"],
        ["20251220", "DEMO-LOAN-0005", "01", "500.0000", "14.8000", "0.0000", "514.8000", "01"]
      ]),
      sheet("COMFLOW", []),
      sheet("REPAYMENTFLOW", [
        ["20251110", "DEMO-LOAN-0005", "F20251110005", "500.0000", "19.5000", "0.0000"],
        ["20251220", "DEMO-LOAN-0005", "F20251220005", "500.0000", "14.8000", "0.0000"]
      ]),
      sheet("CASHFLOW", [["20250918", "DEMO-LOAN-0005", "CASH1005", "1", "1500.0000", "XH20250918005"]]),
      sheet("QUOTAFEE", [["20250918", "HT20250918005", "02", "45.0000", "2"]])
    ]
  },
  {
    // 差异化场景：重组改分期（无逾期无罚息）——区别于案例3 的"重组+逾期罚息"
    fileName: "\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u6848\u4F8B6",
    scene: [
      { bizDate: "20250918", event: "\u653E\u6B3E", loanNo: "DEMO-LOAN-0006", detail: "\u653E\u6B3E 1500 \u5143\uFF0C3 \u671F" },
      { bizDate: "20251110", event: "\u7B2C1\u671F\u8FD8\u6B3E", loanNo: "DEMO-LOAN-0006" },
      { bizDate: "20251008", event: "\u91CD\u7EC4\uFF08\u6539\u5206\u671F\uFF0C\u65E0\u7F5A\u606F\uFF09", loanNo: "DEMO-LOAN-0006", detail: "\u5269\u4F59\u672C\u91D1\u6539\u5206 3 \u671F\uFF0C\u65E0\u903E\u671F\u65E0\u7F5A\u606F" },
      { bizDate: "20251221", event: "\u7B2C2\u671F\u8FD8\u6B3E\uFF08\u65B0\u8BA1\u5212\uFF09", loanNo: "DEMO-LOAN-0006" },
      { bizDate: "20260115", event: "\u7B2C3\u671F\u8FD8\u6B3E\uFF08\u65B0\u8BA1\u5212\uFF09", loanNo: "DEMO-LOAN-0006" },
      { bizDate: "20260215", event: "\u7B2C4\u671F\u8FD8\u6B3E\uFF08\u7ED3\u6E05\uFF09", loanNo: "DEMO-LOAN-0006" }
    ],
    sheets: [
      sheet("CUS", [["20250918", "HT20250918006", "C20250918006", "\u5BA2\u6237\u5DF1", "01", "110101********5666", "139****6666", "1"]]),
      sheet("CUSCREDIT", [["20250918", "HT20250918006", "8000.0000", "12", "1", "14.8000", "20250918"]]),
      sheet("QUOTAADJUST", []),
      sheet("FEEADJUST", []),
      sheet("CUSCHANGE", []),
      sheet("LOAN", [["20250918", "HT20250918006", "C20250918006", "DEMO-LOAN-0006", "2", "1500.0000", "0.0000", "2025-09-20", "CNY", "14.8000"]]),
      sheet("PLAN", [
        ["20250918", "DEMO-LOAN-0006", "1", "20251110", "500.0000", "19.5000", "0.0000", "2"],
        ["20251008", "DEMO-LOAN-0006", "2", "20251221", "400.0000", "14.8000", "0.0000", "2"],
        ["20251008", "DEMO-LOAN-0006", "3", "20260115", "300.0000", "9.8000", "0.0000", "2"],
        ["20251008", "DEMO-LOAN-0006", "4", "20260215", "300.0000", "9.8000", "0.0000", "2"]
      ]),
      sheet("FLOW", [
        ["20251110", "DEMO-LOAN-0006", "01", "500.0000", "19.5000", "0.0000", "519.5000", "01"],
        ["20251221", "DEMO-LOAN-0006", "01", "400.0000", "14.8000", "0.0000", "414.8000", "01"],
        ["20260115", "DEMO-LOAN-0006", "01", "300.0000", "9.8000", "0.0000", "309.8000", "01"],
        ["20260215", "DEMO-LOAN-0006", "01", "300.0000", "9.8000", "0.0000", "309.8000", "01"]
      ]),
      sheet("COMFLOW", []),
      sheet("REPAYMENTFLOW", [
        ["20251110", "DEMO-LOAN-0006", "F20251110006", "500.0000", "19.5000", "0.0000"],
        ["20251221", "DEMO-LOAN-0006", "F20251221006", "400.0000", "14.8000", "0.0000"],
        ["20260115", "DEMO-LOAN-0006", "F20260115006", "300.0000", "9.8000", "0.0000"],
        ["20260215", "DEMO-LOAN-0006", "F20260215006", "300.0000", "9.8000", "0.0000"]
      ]),
      sheet("CASHFLOW", [["20250918", "DEMO-LOAN-0006", "CASH1006", "1", "1500.0000", "XH20250918006"]]),
      sheet("QUOTAFEE", [["20250918", "HT20250918006", "02", "45.0000", "2"]])
    ]
  }
];

// src/data/reference.ts
function sheet2(code, headers, rows) {
  return { sheetName: code, cnName: accountTemplateByCode[code].cnName, headers, rows };
}
var referenceCase = {
  fileName: "\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u6848\u4F8B1\uFF08\u65E7\u7248\u53C2\u8003\uFF09",
  scene: [
    { bizDate: "20250918", event: "\u653E\u6B3E", loanNo: "DEMO-LOAN-0001", detail: "\u653E\u6B3E 1500 \u5143\uFF0C3 \u671F\uFF08\u65E7\u7248\u4E24\u4F4D\u5C0F\u6570\uFF09" },
    { bizDate: "20251110", event: "\u7B2C1\u671F\u8FD8\u6B3E", loanNo: "DEMO-LOAN-0001" },
    { bizDate: "20251220", event: "\u7B2C2\u671F\u8FD8\u6B3E", loanNo: "DEMO-LOAN-0001" },
    { bizDate: "20260110", event: "\u7B2C3\u671F\u8FD8\u6B3E\uFF08\u7ED3\u6E05\uFF09", loanNo: "DEMO-LOAN-0001" }
  ],
  sheets: [
    sheet2(
      "LOAN",
      ["\u4E1A\u52A1\u65E5\u671F", "\u5408\u540C\u53F7", "\u5BA2\u6237\u7F16\u53F7", "\u8D37\u6B3E\u5355\u53F7", "\u8D37\u6B3E\u72B6\u6001", "\u653E\u6B3E\u91D1\u989D", "\u8D37\u6B3E\u4F59\u989D", "\u5E01\u79CD", "\u8D37\u6B3E\u5229\u7387"],
      [["20250918", "HT20250918001", "C20250918001", "DEMO-LOAN-0001", "2", "1500.00", "0.00", "CNY", "14.8000"]]
    ),
    sheet2(
      "PLAN",
      ["\u4E1A\u52A1\u65E5\u671F", "\u8D37\u6B3E\u5355\u53F7", "\u671F\u6B21", "\u5E94\u8FD8\u65E5\u671F", "\u5E94\u8FD8\u672C\u91D1", "\u5E94\u8FD8\u5229\u606F", "\u5E94\u8FD8\u7F5A\u606F", "\u8FD8\u6B3E\u8BA1\u5212\u72B6\u6001"],
      [
        ["20250918", "DEMO-LOAN-0001", "1", "20251110", "500.00", "19.50", "0.00", "2"],
        ["20250918", "DEMO-LOAN-0001", "2", "20251220", "500.00", "14.80", "0.00", "2"],
        ["20250918", "DEMO-LOAN-0001", "3", "20260110", "500.00", "9.80", "0.00", "2"]
      ]
    ),
    sheet2(
      "FLOW",
      ["\u4E1A\u52A1\u65E5\u671F", "\u8D37\u6B3E\u5355\u53F7", "\u8FD8\u6B3E\u7C7B\u578B", "\u8FD8\u6B3E\u672C\u91D1", "\u8FD8\u6B3E\u5229\u606F", "\u8FD8\u6B3E\u7F5A\u606F", "\u5B9E\u8FD8\u603B\u989D", "\u8FD8\u6B3E\u6E20\u9053"],
      [
        ["20251110", "DEMO-LOAN-0001", "01", "500.00", "19.50", "0.00", "519.50", "01"],
        ["20251220", "DEMO-LOAN-0001", "01", "500.00", "14.80", "0.00", "514.80", "01"],
        ["20260110", "DEMO-LOAN-0001", "01", "500.00", "9.80", "0.00", "509.80", "01"]
      ]
    ),
    sheet2(
      "QUOTAFEE",
      ["\u4E1A\u52A1\u65E5\u671F", "\u5408\u540C\u53F7", "\u8D39\u7528\u7C7B\u578B", "\u8D39\u7528\u91D1\u989D", "\u8BA1\u8D39\u65B9\u5F0F"],
      [["20250918", "HT20250918001", "02", "45.00", "2"]]
    )
  ]
};

// src/data/bizRules.ts
var bizRules = [
  { seq: 1, category: "\u521B\u5355", rule: '\u540C\u4E00\u6761\u501F\u636E\u6BCF\u5929\u63A8\u9001\uFF0C\u4F46"\u653E\u6B3E\u5165\u8D26\u65E5\u671F"\u975E\u7A7A\u65F6\u4EE3\u8868\u5DF2\u521B\u5355' },
  { seq: 2, category: "\u521B\u5355", rule: "1 \u4E2A\u5E73\u53F0\u8D37\u6B3E\u5355\u53F7\u53EF\u5173\u8054 2 \u4E2A\u8D37\u6B3E\u5355\u53F7\uFF08\u8054\u5408\u8D37\u6A21\u5F0F\uFF09" },
  { seq: 3, category: "\u521B\u5355", rule: "\u8D37\u6B3E\u5355\u53F7\u9700\u53BB\u91CD\u5224\u65AD\uFF0C\u907F\u514D\u91CD\u590D\u521B\u5355" },
  { seq: 4, category: "\u8D44\u4EA7\u7C7B\u578B", rule: "\u8D44\u4EA7\u7C7B\u578B\uFF1A0=\u8054\u5408\u8D37\uFF0C1=ABS\u6253\u6807\uFF0C2=ABS\u89E3\u6807" },
  { seq: 5, category: "\u8D44\u4EA7\u7C7B\u578B", rule: "ABS \u6253\u6807\u548C\u89E3\u6807\u903B\u8F91\uFF1A0\u21921\u21922\uFF0C2\u21921\uFF0C\u4E0D\u518D\u53D8\u4E3A 0" },
  { seq: 6, category: "\u8D44\u4EA7\u7C7B\u578B", rule: "\u51FA\u8D44\u6BD4\u4F8B\uFF1A\u878D\u62C5\u6A21\u5F0F\u4EE3\u8868\u62C5\u4FDD\u672C\u91D1\u6BD4\u4F8B\uFF0C\u8054\u5408\u8D37\u4EE3\u8868\u5E73\u53F0\u653E\u6B3E\u91D1\u989D" },
  { seq: 7, category: "\u4E1A\u52A1\u6A21\u5F0F", rule: "\u4E1A\u52A1\u6A21\u5F0F\uFF1A01=\u53D6\u73B0\uFF08\u5B9E\u65F6\uFF09\uFF0C02=\u6D88\u8D39\uFF08D+1 \u5212\u6263\uFF09" },
  { seq: 8, category: "\u503A\u8F6C", rule: "\u662F\u5426\u503A\u8F6C\u627F\u63A5\uFF1A\u662F=\u5176\u4ED6\u653E\u6B3E\u6C60\u627F\u63A5\uFF0C\u5426=\u5E73\u53F0\u6B63\u5E38\u653E\u6B3E" },
  { seq: 9, category: "\u8FD8\u6B3E", rule: "\u65B0\u589E\u8FD8\u6B3E\u53D8\u66F4\u7C7B\u578B\uFF1A0=\u9ED8\u8BA4\uFF0C2=\u6539\u5206\u671F" },
  { seq: 10, category: "\u8FD8\u6B3E", rule: "\u8FDD\u7EA6\u91D1\u5165\u7F5A\u606F = \u662F" },
  { seq: 11, category: "\u8FD8\u6B3E", rule: "\u53D6\u73B0\u624B\u7EED\u8D39\u5165\u5229\u606F = \u662F" },
  { seq: 12, category: "\u8FD8\u6B3E", rule: "\u5BBD\u9650\u671F\u5929\u6570 = 3 \u5929" },
  { seq: 13, category: "\u521B\u5355", rule: "\u653E\u6B3E\u65E5\u671F\u7CBE\u786E\u5230\u79D2 = \u662F" },
  { seq: 14, category: "\u8FD8\u6B3E", rule: "\u903E\u671F\u8FD8\u6B3E\u8BA1\u5212\u4E0D\u652F\u6301\u4E8C\u6B21\u5206\u671F" },
  { seq: 15, category: "\u8FD8\u6B3E", rule: "\u53D1\u751F\u8FC7\u90E8\u5206\u8FD8\u6B3E\u7684\u53EF\u4EE5\u518D\u5206\u671F" },
  { seq: 16, category: "\u8FD8\u6B3E", rule: "\u8FD8\u6B3E\u8BA1\u5212\u671F\u6B21\u53EF\u80FD\u91CD\u590D\uFF0C\u9700\u901A\u8FC7\u5E94\u8FD8\u79D1\u76EE\u503C\u5224\u65AD" },
  { seq: 17, category: "\u8FD8\u6B3E", rule: "\u5E73\u53F0\u8D37\u6B3E\u5206\u671F\u5355\u53F7\u4E0D\u91CD\u590D" },
  { seq: 18, category: "\u521B\u5355", rule: "\u521B\u5355\u89C4\u5219\uFF1A\u8D37\u6B3E\u5355\u53F7\u9700\u53BB\u91CD\u5224\u65AD" },
  { seq: 19, category: "\u8BA1\u606F", rule: "\u6D88\u8D39\u4E1A\u52A1\uFF1A\u8BA1\u606F\u65E5\u671F\u4ECE\u6D88\u8D39\u6210\u529F\u5F53\u5929\u5F00\u59CB" },
  { seq: 20, category: "\u8BA1\u606F", rule: "\u53D6\u73B0\u4E1A\u52A1\uFF1A\u8BA1\u606F\u65E5\u671F\u4ECE\u5B9E\u9645\u653E\u6B3E\u5F53\u5929\u5F00\u59CB" },
  { seq: 21, category: "\u8FD8\u6B3E", rule: "\u671F\u6B21\uFF1A\u90E8\u5206\u8FD8\u6B3E\u573A\u666F\u53EF\u80FD\u51FA\u73B0\u8FD8\u6B3E\u8BA1\u5212\u671F\u6B21\u91CD\u590D" }
];

// _cvtest.ts
var r = runCaseAnalysis({ cases: caseFiles, templates: accountTemplates, reference: referenceCase, rules: bizRules });
var fail = [];
var ok = (cond, msg) => {
  if (!cond) fail.push(msg);
};
for (const s of r.structureChecks) {
  ok(s.missingSheets.length === 0 && s.extraSheets.length === 0 && s.headerMismatch.length === 0, `\u7ED3\u6784\u5F02\u5E38 ${s.caseName}: ${JSON.stringify(s)}`);
}
ok(caseFiles.length === 6, `\u6848\u4F8B\u6570\u5E94\u4E3A 6\uFF0C\u5B9E\u9645 ${caseFiles.length}`);
var v1 = r.versionDiffs.find((v) => v.caseName === "\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u6848\u4F8B1");
ok(v1.addedSheets.length === 8, `\u6848\u4F8B1 \u65B0\u589E Sheet \u5E94\u4E3A 8\uFF0C\u5B9E\u9645 ${v1.addedSheets.length}`);
for (const name of ["\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u6848\u4F8B5", "\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u6848\u4F8B6"]) {
  const v = r.versionDiffs.find((x) => x.caseName === name);
  ok(v.addedSheets.length === 0 && v.changedSheets.length === 0, `${name} \u4E0D\u5E94\u6709\u7248\u672C\u5DEE\u5F02\uFF0C\u5B9E\u9645 ${JSON.stringify({ a: v.addedSheets, c: v.changedSheets })}`);
}
var c5 = caseFiles.find((c) => c.fileName === "\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u6848\u4F8B5");
var c5bal = c5.sheets.find((s) => s.sheetName === "LOAN").rows[0][6];
ok(Number(c5bal) > 0, `\u6848\u4F8B5 \u4F59\u989D\u5E94 >0\uFF0C\u5B9E\u9645 ${c5bal}`);
var c5flow = c5.sheets.find((s) => s.sheetName === "FLOW").rows.reduce((a, x) => a + Number(x[3]), 0);
ok(Math.abs(1500 - c5flow - Number(c5bal)) < 0.01, `\u6848\u4F8B5 \u4F59\u989D\u81EA\u6D3D\u5931\u8D25\uFF1A1500-${c5flow}-${c5bal}`);
var c6 = r.sceneAnalyses.find((s) => s.caseName === "\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u6848\u4F8B6");
ok(c6.timelineOk, `\u6848\u4F8B6 \u65F6\u95F4\u7EBF\u5E94\u81EA\u6D3D\uFF0C\u5B9E\u9645 ${JSON.stringify(c6.findings)}`);
var fails = r.ruleValidations.filter((x) => x.result === "fail");
ok(fails.length === 1 && fails[0].seq === 10, `rule fail \u5E94\u4E3A\u4EC5 seq10\uFF0C\u5B9E\u9645 ${JSON.stringify(fails.map((f2) => f2.seq))}`);
ok(r.crossProducts.every((x) => x.risk === "low"), "\u8DE8\u4EA7\u54C1\u98CE\u9669\u5E94\u5168\u4E3A low");
ok(r.openQuestions.length === 2 && r.openQuestions.some((q2) => q2.qid === "Q_CASE_RULE10") && r.openQuestions.some((q2) => q2.qid === "Q_CASE_CASHFLOW"), `\u5F85\u786E\u8BA4\u95EE\u9898\u5E94\u4E3A 2\uFF08RULE10+CASHFLOW\uFF09\uFF0C\u5B9E\u9645 ${JSON.stringify(r.openQuestions.map((q2) => q2.qid))}`);
console.log("caseCount=", caseFiles.length, "structPass=", r.structureChecks.length, "ruleFails=", fails.map((f2) => f2.seq), "openQ=", r.openQuestions.map((q2) => q2.qid));
if (fail.length) {
  console.log("FAIL:\n" + fail.join("\n"));
  process.exit(1);
} else console.log("ALL PASS");
