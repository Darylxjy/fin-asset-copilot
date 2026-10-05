// src/data/externalV1.ts
var SRC = "\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV1";
var externalV1 = [
  { fieldName: "loanId", chineseName: "\u501F\u636E\u53F7", dataType: "VARCHAR", length: "32", required: "Y", description: "\u653E\u6B3E\u540E\u751F\u6210\u7684\u552F\u4E00\u501F\u636E\u7F16\u53F7", enumValues: [], exampleValue: "DEMO-LOAN-1001", remark: "", source: SRC },
  { fieldName: "loanAmt", chineseName: "\u653E\u6B3E\u91D1\u989D", dataType: "DECIMAL", length: "(12,2)", required: "Y", description: "\u653E\u6B3E\u672C\u91D1\u91D1\u989D\uFF0C\u5355\u4F4D\u5143\uFF0C\u4E24\u4F4D\u5C0F\u6570", enumValues: [], exampleValue: "12000.00", remark: "", source: SRC },
  { fieldName: "custName", chineseName: "\u5BA2\u6237\u59D3\u540D", dataType: "VARCHAR", length: "64", required: "Y", description: "\u501F\u6B3E\u4EBA\u59D3\u540D", enumValues: [], exampleValue: "\u5BA2\u6237\u7532", remark: "", source: SRC },
  { fieldName: "certNo", chineseName: "\u8BC1\u4EF6\u53F7\u7801", dataType: "VARCHAR", length: "18", required: "Y", description: "\u501F\u6B3E\u4EBA\u8EAB\u4EFD\u8BC1\u53F7", enumValues: [], exampleValue: "110101********1234", remark: "", source: SRC },
  { fieldName: "phone", chineseName: "\u624B\u673A\u53F7", dataType: "VARCHAR", length: "11", required: "Y", description: "\u501F\u6B3E\u4EBA\u624B\u673A\u53F7", enumValues: [], exampleValue: "138****1234", remark: "", source: SRC },
  { fieldName: "loanTerm", chineseName: "\u501F\u6B3E\u671F\u9650", dataType: "INT", length: "", required: "Y", description: "\u501F\u6B3E\u671F\u6570\uFF08\u6708\uFF09", enumValues: [], exampleValue: "12", remark: "", source: SRC },
  { fieldName: "yearRate", chineseName: "\u5E74\u5316\u5229\u7387", dataType: "DECIMAL", length: "(8,4)", required: "Y", description: "\u5E74\u5316\u5229\u7387\uFF0C\u767E\u5206\u6BD4\u5F62\u5F0F\uFF0C\u5982 7.2 \u8868\u793A 7.2%", enumValues: [], exampleValue: "7.2000", remark: "\u6587\u6863\u4EE5\u767E\u5206\u6BD4\u7ED9\u51FA", source: SRC },
  { fieldName: "loanStatus", chineseName: "\u653E\u6B3E\u72B6\u6001", dataType: "VARCHAR", length: "20", required: "Y", description: "\u653E\u6B3E\u5904\u7406\u6700\u7EC8\u72B6\u6001", enumValues: ["INIT", "SUCCESS", "FAIL"], exampleValue: "SUCCESS", remark: "", source: SRC },
  { fieldName: "applyTime", chineseName: "\u7533\u8BF7\u65F6\u95F4", dataType: "DATETIME", length: "", required: "Y", description: "\u501F\u6B3E\u7533\u8BF7\u63D0\u4EA4\u65F6\u95F4", enumValues: [], exampleValue: "2026-08-01 10:22:33", remark: "\u683C\u5F0F YYYY-MM-DD HH:mm:ss", format: "YYYY-MM-DD HH:mm:ss", source: SRC },
  { fieldName: "dueDate", chineseName: "\u5230\u671F\u65E5", dataType: "DATE", length: "", required: "Y", description: "\u6700\u540E\u4E00\u671F\u5E94\u8FD8\u65E5\u671F", enumValues: [], exampleValue: "2027-08-01", remark: "\u683C\u5F0F YYYY-MM-DD", format: "YYYY-MM-DD", source: SRC },
  { fieldName: "repayType", chineseName: "\u8FD8\u6B3E\u65B9\u5F0F", dataType: "VARCHAR", length: "20", required: "Y", description: "EQUAL \u7B49\u989D / INTEREST_FIRST \u5148\u606F\u540E\u672C", enumValues: ["EQUAL", "INTEREST_FIRST"], exampleValue: "EQUAL", remark: "", source: SRC },
  { fieldName: "cardNo", chineseName: "\u94F6\u884C\u5361\u53F7", dataType: "VARCHAR", length: "32", required: "Y", description: "\u6536\u6B3E\u5361\u53F7", enumValues: [], exampleValue: "6222********1234", remark: "", source: SRC },
  { fieldName: "prodCode", chineseName: "\u4EA7\u54C1\u7F16\u7801", dataType: "VARCHAR", length: "20", required: "Y", description: "\u4EA7\u54C1\u7F16\u7801", enumValues: [], exampleValue: "DEMO_PRODUCT_01", remark: "", source: SRC },
  { fieldName: "srcChannel", chineseName: "\u6E20\u9053", dataType: "VARCHAR", length: "20", required: "Y", description: "\u6D41\u91CF\u6E20\u9053\u7F16\u7801", enumValues: ["APP", "H5", "API"], exampleValue: "APP", remark: "", source: SRC },
  { fieldName: "interestAmt", chineseName: "\u5229\u606F", dataType: "DECIMAL", length: "(12,2)", required: "N", description: "\u5E94\u6536\u5229\u606F", enumValues: [], exampleValue: "650.00", remark: "", source: SRC },
  { fieldName: "overdueFlag", chineseName: "\u662F\u5426\u903E\u671F", dataType: "VARCHAR", length: "1", required: "Y", description: "Y \u903E\u671F / N \u672A\u903E\u671F", enumValues: ["Y", "N"], exampleValue: "N", remark: "", source: SRC },
  { fieldName: "remarkInfo", chineseName: "\u5907\u6CE8", dataType: "VARCHAR", length: "255", required: "N", description: "\u5907\u6CE8\u4FE1\u606F", enumValues: [], exampleValue: "", remark: "", source: SRC },
  { fieldName: "oldChannelCode", chineseName: "\u65E7\u6E20\u9053\u7F16\u7801", dataType: "VARCHAR", length: "10", required: "N", description: "\u5386\u53F2\u517C\u5BB9\u6E20\u9053\u7F16\u7801", enumValues: [], exampleValue: "C01", remark: "V2 \u8BA1\u5212\u5E9F\u5F03", source: SRC },
  { fieldName: "principalBal", chineseName: "\u5269\u4F59\u672C\u91D1", dataType: "DECIMAL", length: "(12,2)", required: "N", description: "\u5F53\u524D\u5269\u4F59\u672C\u91D1", enumValues: [], exampleValue: "9000.00", remark: "", source: SRC }
];

// src/data/externalV2.ts
var SRC2 = "\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2";
var externalV2 = [
  // 1) 字段名称不同但含义相同（映射侧）：phone 对应我方 mobile
  { fieldName: "loanId", chineseName: "\u501F\u636E\u53F7", dataType: "VARCHAR", length: "32", required: "Y", description: "\u653E\u6B3E\u540E\u751F\u6210\u7684\u552F\u4E00\u501F\u636E\u7F16\u53F7", enumValues: [], exampleValue: "DEMO-LOAN-1001", remark: "", source: SRC2 },
  // 6) 金额精度 2->4
  { fieldName: "loanAmt", chineseName: "\u653E\u6B3E\u91D1\u989D", dataType: "DECIMAL", length: "(16,4)", required: "Y", description: "\u653E\u6B3E\u672C\u91D1\u91D1\u989D\uFF0C\u5355\u4F4D\u5143\uFF0C\u56DB\u4F4D\u5C0F\u6570", enumValues: [], exampleValue: "12000.0000", remark: "\u7CBE\u5EA6\u7531\u4E24\u4F4D\u63D0\u5347\u81F3\u56DB\u4F4D", source: SRC2 },
  // 3) 中文名变化：客户姓名 -> 借款人姓名
  { fieldName: "custName", chineseName: "\u501F\u6B3E\u4EBA\u59D3\u540D", dataType: "VARCHAR", length: "64", required: "Y", description: "\u501F\u6B3E\u4EBA\u59D3\u540D", enumValues: [], exampleValue: "\u5BA2\u6237\u7532", remark: "", source: SRC2 },
  // 4) 字段名称变化：certNo -> certId（含义相同）
  { fieldName: "certId", chineseName: "\u8BC1\u4EF6\u53F7\u7801", dataType: "VARCHAR", length: "18", required: "Y", description: "\u501F\u6B3E\u4EBA\u8EAB\u4EFD\u8BC1\u53F7", enumValues: [], exampleValue: "110101********1234", remark: "", source: SRC2 },
  { fieldName: "phone", chineseName: "\u624B\u673A\u53F7", dataType: "VARCHAR", length: "11", required: "Y", description: "\u501F\u6B3E\u4EBA\u624B\u673A\u53F7", enumValues: [], exampleValue: "138****1234", remark: "", source: SRC2 },
  { fieldName: "loanTerm", chineseName: "\u501F\u6B3E\u671F\u9650", dataType: "INT", length: "", required: "Y", description: "\u501F\u6B3E\u671F\u6570\uFF08\u6708\uFF09", enumValues: [], exampleValue: "12", remark: "", source: SRC2 },
  { fieldName: "yearRate", chineseName: "\u5E74\u5316\u5229\u7387", dataType: "DECIMAL", length: "(8,4)", required: "Y", description: "\u5E74\u5316\u5229\u7387\uFF0C\u767E\u5206\u6BD4\u5F62\u5F0F\uFF0C\u5982 7.2 \u8868\u793A 7.2%\uFF0C\u9700\u9664\u4EE5 100 \u540E\u5165\u5E93", enumValues: [], exampleValue: "7.2000", remark: "\u6587\u6863\u4EE5\u767E\u5206\u6BD4\u7ED9\u51FA", source: SRC2 },
  // 5) 字段说明变化 + 10) 枚举新增 PROCESSING
  { fieldName: "loanStatus", chineseName: "\u501F\u636E\u72B6\u6001", dataType: "VARCHAR", length: "20", required: "Y", description: "\u501F\u636E\u751F\u547D\u5468\u671F\u72B6\u6001\uFF0C\u542B\u5904\u7406\u4E2D", enumValues: ["INIT", "SUCCESS", "FAIL", "PROCESSING"], exampleValue: "SUCCESS", remark: "\u65B0\u589E PROCESSING \u5904\u7406\u4E2D\u6001", source: SRC2 },
  // 7) 日期格式变化：YYYY-MM-DD HH:mm:ss -> YYYYMMDDHHmmss
  { fieldName: "applyTime", chineseName: "\u7533\u8BF7\u65F6\u95F4", dataType: "DATETIME", length: "", required: "Y", description: "\u501F\u6B3E\u7533\u8BF7\u63D0\u4EA4\u65F6\u95F4", enumValues: [], exampleValue: "20260801102233", remark: "\u683C\u5F0F\u53D8\u66F4\u4E3A YYYYMMDDHHmmss\uFF08\u53BB\u5206\u9694\u7B26\uFF09", format: "YYYYMMDDHHmmss", source: SRC2 },
  { fieldName: "dueDate", chineseName: "\u5230\u671F\u65E5", dataType: "DATE", length: "", required: "Y", description: "\u6700\u540E\u4E00\u671F\u5E94\u8FD8\u65E5\u671F", enumValues: [], exampleValue: "2027-08-01", remark: "\u683C\u5F0F YYYY-MM-DD", format: "YYYY-MM-DD", source: SRC2 },
  { fieldName: "repayType", chineseName: "\u8FD8\u6B3E\u65B9\u5F0F", dataType: "VARCHAR", length: "20", required: "Y", description: "EQUAL \u7B49\u989D / INTEREST_FIRST \u5148\u606F\u540E\u672C", enumValues: ["EQUAL", "INTEREST_FIRST"], exampleValue: "EQUAL", remark: "", source: SRC2 },
  { fieldName: "cardNo", chineseName: "\u94F6\u884C\u5361\u53F7", dataType: "VARCHAR", length: "32", required: "Y", description: "\u6536\u6B3E\u5361\u53F7", enumValues: [], exampleValue: "6222********1234", remark: "", source: SRC2 },
  { fieldName: "prodCode", chineseName: "\u4EA7\u54C1\u7F16\u7801", dataType: "VARCHAR", length: "20", required: "Y", description: "\u4EA7\u54C1\u7F16\u7801", enumValues: [], exampleValue: "DEMO_PRODUCT_01", remark: "", source: SRC2 },
  // 8) 必填 -> 非必填
  { fieldName: "srcChannel", chineseName: "\u6E20\u9053", dataType: "VARCHAR", length: "20", required: "N", description: "\u6D41\u91CF\u6E20\u9053\u7F16\u7801", enumValues: ["APP", "H5", "API"], exampleValue: "APP", remark: "\u7531\u5FC5\u586B\u6539\u4E3A\u975E\u5FC5\u586B", source: SRC2 },
  { fieldName: "interestAmt", chineseName: "\u5229\u606F", dataType: "DECIMAL", length: "(12,2)", required: "N", description: "\u5E94\u6536\u5229\u606F", enumValues: [], exampleValue: "650.00", remark: "", source: SRC2 },
  { fieldName: "overdueFlag", chineseName: "\u662F\u5426\u903E\u671F", dataType: "VARCHAR", length: "1", required: "Y", description: "Y \u903E\u671F / N \u672A\u903E\u671F", enumValues: ["Y", "N"], exampleValue: "N", remark: "", source: SRC2 },
  // 9) 非必填 -> 必填
  { fieldName: "remarkInfo", chineseName: "\u5907\u6CE8", dataType: "VARCHAR", length: "255", required: "Y", description: "\u5907\u6CE8\u4FE1\u606F\uFF0CV2 \u8D77\u5FC5\u586B", enumValues: [], exampleValue: "\u6E20\u9053\u6D3B\u52A8", remark: "\u7531\u975E\u5FC5\u586B\u6539\u4E3A\u5FC5\u586B", source: SRC2 },
  { fieldName: "principalBal", chineseName: "\u5269\u4F59\u672C\u91D1", dataType: "DECIMAL", length: "(12,2)", required: "N", description: "\u5F53\u524D\u5269\u4F59\u672C\u91D1", enumValues: [], exampleValue: "9000.00", remark: "", source: SRC2 },
  // 1) 字段新增
  { fieldName: "repaymentChannel", chineseName: "\u8FD8\u6B3E\u6E20\u9053", dataType: "VARCHAR", length: "20", required: "N", description: "\u7528\u6237\u5B9E\u9645\u8FD8\u6B3E\u6E20\u9053\uFF0C\u5982 ALIPAY / WECHAT / BANK", enumValues: ["ALIPAY", "WECHAT", "BANK"], exampleValue: "ALIPAY", remark: "V2 \u65B0\u589E\uFF0C\u6211\u65B9\u6682\u65E0\u5BF9\u5E94\u5B57\u6BB5", source: SRC2 }
];
var renameMap = {
  certNo: "certId"
};

// src/data/internalFields.ts
var SRC3 = "\u793A\u4F8B\u8D26\u52A1\u7CFB\u7EDF\u5B57\u6BB5\u5B57\u5178";
var internalFields = [
  { fieldName: "loan_no", chineseName: "\u501F\u636E\u53F7", dataType: "VARCHAR", length: "32", required: "Y", description: "\u8D44\u4EA7\u65B9\u653E\u6B3E\u540E\u751F\u6210\u7684\u552F\u4E00\u501F\u636E\u7F16\u53F7\uFF0C\u7528\u4E8E\u5168\u751F\u547D\u5468\u671F\u8FFD\u8E2A", enumValues: [], exampleValue: "DEMO-INTERNAL-1001", remark: "\u4E3B\u952E\uFF0C\u4E0D\u53EF\u53D8\u66F4", source: SRC3 },
  { fieldName: "loan_amount", chineseName: "\u653E\u6B3E\u91D1\u989D", dataType: "DECIMAL", length: "(12,2)", required: "Y", description: "\u5B9E\u9645\u653E\u6B3E\u672C\u91D1\u91D1\u989D\uFF0C\u5355\u4F4D\u5143\uFF0C\u56FA\u5B9A\u4E24\u4F4D\u5C0F\u6570", enumValues: [], exampleValue: "12000.00", remark: "\u8D26\u52A1\u4E0E\u5BF9\u8D26\u5747\u4EE5\u4E24\u4F4D\u5C0F\u6570\u5904\u7406", source: SRC3 },
  { fieldName: "borrower_name", chineseName: "\u501F\u6B3E\u4EBA\u59D3\u540D", dataType: "VARCHAR", length: "64", required: "Y", description: "\u501F\u6B3E\u4EBA\u771F\u5B9E\u59D3\u540D\uFF0C\u9700\u4E0E\u8BC1\u4EF6\u4E00\u81F4", enumValues: [], exampleValue: "\u5BA2\u6237\u7532", remark: "", source: SRC3 },
  { fieldName: "id_no", chineseName: "\u8BC1\u4EF6\u53F7\u7801", dataType: "VARCHAR", length: "18", required: "Y", description: "\u501F\u6B3E\u4EBA\u8EAB\u4EFD\u8BC1\u53F7\uFF0C18 \u4F4D", enumValues: [], exampleValue: "110101********1234", remark: "\u9700\u505A\u8131\u654F\u5B58\u50A8", source: SRC3 },
  { fieldName: "mobile", chineseName: "\u624B\u673A\u53F7", dataType: "VARCHAR", length: "11", required: "Y", description: "\u501F\u6B3E\u4EBA\u9884\u7559\u624B\u673A\u53F7", enumValues: [], exampleValue: "138****1234", remark: "", source: SRC3 },
  { fieldName: "loan_term", chineseName: "\u501F\u6B3E\u671F\u9650", dataType: "INT", length: "", required: "Y", description: "\u501F\u6B3E\u603B\u671F\u6570\uFF08\u6708\uFF09", enumValues: [], exampleValue: "12", remark: "", source: SRC3 },
  { fieldName: "annual_rate", chineseName: "\u5E74\u5316\u5229\u7387", dataType: "DECIMAL", length: "(8,4)", required: "Y", description: "\u5E74\u5316\u5229\u7387\uFF0C\u5C0F\u6570\u5F62\u5F0F\u5B58\u50A8\uFF0C\u5982 0.0720 \u8868\u793A 7.20%", enumValues: [], exampleValue: "0.0720", remark: "\u5185\u90E8\u7EDF\u4E00\u4EE5\u5C0F\u6570\u5B58\u50A8\uFF0C\u975E\u767E\u5206\u6BD4", source: SRC3 },
  { fieldName: "loan_status", chineseName: "\u653E\u6B3E\u72B6\u6001", dataType: "VARCHAR", length: "20", required: "Y", description: "\u501F\u636E\u72B6\u6001\uFF1AINIT \u521D\u59CB\u5316 / SUCCESS \u6210\u529F / FAIL \u5931\u8D25", enumValues: ["INIT", "SUCCESS", "FAIL"], exampleValue: "SUCCESS", remark: "\u4E0D\u542B\u5904\u7406\u4E2D\u6001", source: SRC3 },
  { fieldName: "apply_time", chineseName: "\u7533\u8BF7\u65F6\u95F4", dataType: "DATETIME", length: "", required: "Y", description: "\u7528\u6237\u63D0\u4EA4\u501F\u6B3E\u7533\u8BF7\u7684\u65F6\u95F4", enumValues: [], exampleValue: "2026-08-01 10:22:33", remark: "\u683C\u5F0F YYYY-MM-DD HH:mm:ss", source: SRC3 },
  { fieldName: "due_date", chineseName: "\u5230\u671F\u65E5", dataType: "DATE", length: "", required: "Y", description: "\u6700\u540E\u4E00\u671F\u5E94\u8FD8\u65E5\u671F", enumValues: [], exampleValue: "2027-08-01", remark: "\u683C\u5F0F YYYY-MM-DD", source: SRC3 },
  { fieldName: "repay_method", chineseName: "\u8FD8\u6B3E\u65B9\u5F0F", dataType: "VARCHAR", length: "20", required: "Y", description: "EQUAL \u7B49\u989D\u672C\u606F / INTEREST_FIRST \u5148\u606F\u540E\u672C", enumValues: ["EQUAL", "INTEREST_FIRST"], exampleValue: "EQUAL", remark: "", source: SRC3 },
  { fieldName: "bank_card", chineseName: "\u94F6\u884C\u5361\u53F7", dataType: "VARCHAR", length: "32", required: "Y", description: "\u653E\u6B3E\u6536\u6B3E\u5361\u53F7", enumValues: [], exampleValue: "6222********1234", remark: "", source: SRC3 },
  { fieldName: "product_code", chineseName: "\u4EA7\u54C1\u7F16\u7801", dataType: "VARCHAR", length: "20", required: "Y", description: "\u6211\u65B9\u4EA7\u54C1\u4E2D\u5FC3\u5206\u914D\u7684\u4EA7\u54C1\u7F16\u7801", enumValues: [], exampleValue: "DEMO_PRODUCT_01", remark: "", source: SRC3 },
  { fieldName: "channel", chineseName: "\u6E20\u9053", dataType: "VARCHAR", length: "20", required: "Y", description: "\u6D41\u91CF\u6765\u6E90\u6E20\u9053\u7F16\u7801", enumValues: ["APP", "H5", "API"], exampleValue: "APP", remark: "", source: SRC3 },
  { fieldName: "interest", chineseName: "\u5229\u606F", dataType: "DECIMAL", length: "(12,2)", required: "N", description: "\u5E94\u6536\u5229\u606F\u5408\u8BA1", enumValues: [], exampleValue: "650.00", remark: "", source: SRC3 },
  { fieldName: "overdue_flag", chineseName: "\u662F\u5426\u903E\u671F", dataType: "VARCHAR", length: "1", required: "Y", description: "Y \u903E\u671F / N \u672A\u903E\u671F", enumValues: ["Y", "N"], exampleValue: "N", remark: "", source: SRC3 },
  { fieldName: "remaining_principal", chineseName: "\u5269\u4F59\u672C\u91D1", dataType: "DECIMAL", length: "(12,2)", required: "N", description: "\u5F53\u524D\u672A\u8FD8\u672C\u91D1\u4F59\u989D", enumValues: [], exampleValue: "9000.00", remark: "", source: SRC3 },
  { fieldName: "penalty", chineseName: "\u7F5A\u606F", dataType: "DECIMAL", length: "(12,2)", required: "N", description: "\u903E\u671F\u4EA7\u751F\u7684\u7F5A\u606F", enumValues: [], exampleValue: "0.00", remark: "", source: SRC3 },
  { fieldName: "remark", chineseName: "\u5907\u6CE8", dataType: "VARCHAR", length: "255", required: "N", description: "\u4E1A\u52A1\u5907\u6CE8\u4FE1\u606F", enumValues: [], exampleValue: "", remark: "", source: SRC3 },
  { fieldName: "create_time", chineseName: "\u521B\u5EFA\u65F6\u95F4", dataType: "DATETIME", length: "", required: "Y", description: "\u8BB0\u5F55\u843D\u5E93\u65F6\u95F4", enumValues: [], exampleValue: "2026-08-01 10:25:00", remark: "", source: SRC3 }
];

// src/data/csvDemo.ts
var csvDemoRaw = `loanId,loanAmt,custName,certId,mobileNo,loanTerm,yearRate,loanStatus,applyTime,dueDate,repayType,cardNo,prodCode,srcChannel,interestAmt,overdueFlag,principalBal,repaymentChannel,finishTime
DEMO-LOAN-1001,12000.0000,\u5BA2\u6237\u7532,110101********1234,138****1234,12,7.2000,SUCCESS,20260801102233,2027-08-01,EQUAL,6222********1234,DEMO_PRODUCT_01,APP,650.00,N,9000.00,ALIPAY,
DEMO-LOAN-1002,8000.0000,\u5BA2\u6237\u4E59,110101********2345,139****2345,6,6.5000,PROCESSING,20260802103000,2027-02-02,EQUAL,6222********2345,DEMO_PRODUCT_01,APP,300.00,N,7500.00,WECHAT,2026-08-05 10:00:00
DEMO-LOAN-1003,5000.0000,\u5BA2\u6237\u4E19,110101********3456,137****3456,3,5.8000,PROCESSING_FINAL,20260803104000,2026-11-03,INTEREST_FIRST,6222********3456,DEMO_PRODUCT_01,H5,80.00,N,4900.00,BANK,
DEMO-LOAN-1004,3000.0000,\u5BA2\u6237\u4E01,110101********4567,136****4567,12,0.0720,SUCCESS,20260804105000,2027-08-04,EQUAL,6222********4567,DEMO_PRODUCT_01,APP,120.00,N,2800.00,ALIPAY,
DEMO-LOAN-1005,9000.0000,\u5BA2\u6237\u620A,110101********5678,135****5678,9,7.0000,SUCCESS,2026/08/05 11:20,2027-05-05,EQUAL,6222********5678,DEMO_PRODUCT_01,H5,400.00,N,8500.00,BANK,
DEMO-LOAN-1006,15000.0000,\u5BA2\u6237\u5DF1,110101********6789,134****6789,12,7.5000,SUCCESS,20260806110000,2027-08-06,EQUAL,6222********6789,DEMO_PRODUCT_01,APP,800.00,N,14000.00,ALIPAY,`;

// src/data/history.ts
var historyItems = [
  {
    id: "H001",
    assetName: "\u793A\u4F8B\u673A\u6784\u7532",
    summary: "2025 \u5E74\u63A5\u5165\uFF0C\u91D1\u989D\u5B57\u6BB5\u7531\u5BF9\u65B9\u4E09\u4F4D\u5C0F\u6570\u8C03\u6574\u4E3A\u6211\u65B9\u4E24\u4F4D\uFF0C\u89E6\u53D1\u8D26\u52A1\u89E3\u6790\u4E0E\u5BF9\u8D26\u7CBE\u5EA6\u6539\u9020\u3002",
    mappings: [
      { external: "loanAmt", internal: "loan_amount", note: "\u5BF9\u65B9\u4E09\u4F4D\u5C0F\u6570\uFF0C\u6211\u65B9\u4E24\u4F4D\uFF0C\u9700\u622A\u65AD\u5E76\u8BC4\u4F30\u5BF9\u8D26\u5DEE\u989D" },
      { external: "mobile", internal: "mobile", note: "\u540D\u79F0\u4E00\u81F4\uFF0C\u76F4\u63A5\u6620\u5C04" }
    ],
    confirmedQuestions: [
      { content: "\u91D1\u989D\u7CBE\u5EA6\u5DEE\u5F02\u662F\u5426\u5728\u5165\u8D26\u65F6\u56DB\u820D\u4E94\u5165\uFF0C\u8FD8\u662F\u622A\u65AD\u5904\u7406\uFF1F", target: "\u5185\u90E8\u4EA7\u54C1+\u7814\u53D1" }
    ],
    systemChanges: ["\u8D26\u52A1\u89E3\u6790\u589E\u52A0\u7CBE\u5EA6\u8F6C\u6362\u5C42", "\u5BF9\u8D26\u903B\u8F91\u8865\u5145\u5DEE\u989D\u5BB9\u5FCD\u914D\u7F6E"]
  },
  {
    id: "H002",
    assetName: "\u793A\u4F8B\u673A\u6784\u4E59",
    summary: "\u5BF9\u65B9\u72B6\u6001\u673A\u542B\u201C\u5904\u7406\u4E2D\u201D\u6001\uFF0C\u6211\u65B9\u65E0\u5BF9\u5E94\u6001\uFF0C\u6700\u7EC8\u7531\u8D37\u540E\u6A21\u5757\u65B0\u589E\u4E2D\u95F4\u6001\u843D\u5E93\u3002",
    mappings: [
      { external: "status", internal: "loan_status", note: "\u5BF9\u65B9\u591A\u4E00\u6001\uFF0C\u9700\u6620\u5C04\u8865\u5145" }
    ],
    confirmedQuestions: [
      { content: "\u5904\u7406\u4E2D\u72B6\u6001\u7684\u501F\u636E\u662F\u5426\u53C2\u4E0E\u8BA1\u606F\u4E0E\u98CE\u63A7\u7B56\u7565\uFF1F", target: "\u5185\u90E8\u4EA7\u54C1+\u7814\u53D1" }
    ],
    systemChanges: ["\u8D37\u540E\u72B6\u6001\u673A\u65B0\u589E PROCESSING \u6001", "\u98CE\u63A7\u7B56\u7565\u8865\u5145\u4E2D\u95F4\u6001\u5904\u7406\u5206\u652F"]
  },
  {
    id: "H003",
    assetName: "\u793A\u4F8B\u673A\u6784\u4E19",
    summary: "\u5BF9\u65B9\u5229\u7387\u4EE5\u767E\u5206\u6BD4\u7ED9\u51FA\uFF0C\u6211\u65B9\u5C0F\u6570\u5B58\u50A8\uFF0C\u63A5\u5165\u65F6\u7EDF\u4E00\u505A\u9664\u4EE5 100 \u8F6C\u6362\u3002",
    mappings: [
      { external: "rate", internal: "annual_rate", note: "\u767E\u5206\u6BD4\u2192\u5C0F\u6570\uFF0C\u9700\u89C4\u5219\u8F6C\u6362" }
    ],
    confirmedQuestions: [
      { content: "\u767E\u5206\u6BD4\u8F6C\u5C0F\u6570\u662F\u5426\u7EDF\u4E00\u5728\u63A5\u5165\u7F51\u5173\u5B8C\u6210\uFF0C\u907F\u514D\u4E0B\u6E38\u91CD\u590D\u8F6C\u6362\uFF1F", target: "\u7814\u53D1" }
    ],
    systemChanges: ["\u63A5\u5165\u7F51\u5173\u589E\u52A0\u5229\u7387\u5F52\u4E00\u5316\u89C4\u5219", "\u6587\u6863\u8865\u5145\u5B57\u6BB5\u5355\u4F4D\u8BF4\u660E"]
  }
];

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

// src/lib/rules/diff.ts
var riskOrder = ["low", "medium", "high"];
function maxRisk(a, b) {
  return riskOrder.indexOf(a) >= riskOrder.indexOf(b) ? a : b;
}
function enumDiff(oldE, newE) {
  const added = newE.filter((e) => !oldE.includes(e));
  const removed = oldE.filter((e) => !newE.includes(e));
  return { added, removed };
}
function diffFields(input) {
  const { oldFields, newFields, renameMap: renameMap2 = {} } = input;
  const oldMap = new Map(oldFields.map((f2) => [f2.fieldName, f2]));
  const newMap = new Map(newFields.map((f2) => [f2.fieldName, f2]));
  const renameTargets = new Set(Object.values(renameMap2));
  const renameSources = new Set(Object.keys(renameMap2));
  const result = [];
  for (const f2 of oldFields) {
    if (!newMap.has(f2.fieldName) && !renameSources.has(f2.fieldName)) {
      result.push(buildDiff({
        fieldKey: f2.fieldName,
        diffType: ["REMOVED"],
        oldField: f2,
        newField: void 0,
        findings: [`\u5B57\u6BB5 ${f2.fieldName}\uFF08${f2.chineseName}\uFF09\u5728 V2 \u4E2D\u5DF2\u5220\u9664`],
        risk: "medium",
        status: "MANUAL_REVIEW_REQUIRED"
      }));
    }
  }
  for (const f2 of newFields) {
    if (!oldMap.has(f2.fieldName) && !renameTargets.has(f2.fieldName)) {
      result.push(buildDiff({
        fieldKey: f2.fieldName,
        diffType: ["ADDED"],
        oldField: void 0,
        newField: f2,
        findings: [`\u65B0\u589E\u5B57\u6BB5 ${f2.fieldName}\uFF08${f2.chineseName}\uFF09`],
        risk: "medium",
        status: "MANUAL_REVIEW_REQUIRED"
      }));
    }
  }
  const matched = [];
  for (const f2 of newFields) {
    if (oldMap.has(f2.fieldName)) {
      matched.push({ oldF: oldMap.get(f2.fieldName), newF: f2 });
    }
  }
  for (const [oldName, newName] of Object.entries(renameMap2)) {
    const oldF = oldMap.get(oldName);
    const newF = newMap.get(newName);
    if (oldF && newF) matched.push({ oldF, newF });
  }
  for (const { oldF, newF } of matched) {
    const types = [];
    const findings = [];
    let risk = "low";
    if (renameMap2[oldF.fieldName] === newF.fieldName) {
      types.push("FIELD_NAME_CHANGED");
      findings.push(`\u5B57\u6BB5\u540D\u79F0\u53D8\u5316\uFF1A${oldF.fieldName} \u2192 ${newF.fieldName}\uFF08\u542B\u4E49\u4E00\u81F4\uFF09`);
      risk = maxRisk(risk, "low");
    }
    if (oldF.chineseName !== newF.chineseName) {
      types.push("CHINESE_NAME_CHANGED");
      findings.push(`\u4E2D\u6587\u540D\u79F0\uFF1A${oldF.chineseName} \u2192 ${newF.chineseName}`);
      risk = maxRisk(risk, "low");
    }
    if (oldF.dataType !== newF.dataType) {
      types.push("TYPE_CHANGED");
      findings.push(`\u6570\u636E\u7C7B\u578B\uFF1A${oldF.dataType} \u2192 ${newF.dataType}`);
      risk = maxRisk(risk, "high");
    }
    if (oldF.length !== newF.length) {
      types.push("LENGTH_CHANGED");
      findings.push(`\u957F\u5EA6/\u7CBE\u5EA6\uFF1A${oldF.length || "-"} \u2192 ${newF.length || "-"}`);
      risk = maxRisk(risk, "medium");
    }
    if (oldF.required !== newF.required) {
      types.push("REQUIRED_CHANGED");
      findings.push(`\u5FC5\u586B\u89C4\u5219\uFF1A${oldF.required} \u2192 ${newF.required}`);
      risk = maxRisk(risk, "medium");
    }
    if (oldF.description !== newF.description) {
      types.push("DESCRIPTION_CHANGED");
      findings.push(`\u5B57\u6BB5\u8BF4\u660E\u53D1\u751F\u53D8\u5316`);
      risk = maxRisk(risk, "medium");
    }
    const ed = enumDiff(oldF.enumValues, newF.enumValues);
    if (ed.added.length || ed.removed.length) {
      types.push("ENUM_CHANGED");
      if (ed.added.length) findings.push(`\u679A\u4E3E\u65B0\u589E\uFF1A${ed.added.join(", ")}`);
      if (ed.removed.length) findings.push(`\u679A\u4E3E\u79FB\u9664\uFF1A${ed.removed.join(", ")}`);
      risk = maxRisk(risk, "medium");
    }
    if ((oldF.format || "") !== (newF.format || "")) {
      types.push("DESCRIPTION_CHANGED");
      findings.push(`\u65E5\u671F/\u65F6\u95F4\u683C\u5F0F\uFF1A${oldF.format || "-"} \u2192 ${newF.format || "-"}`);
      risk = maxRisk(risk, "medium");
    }
    if (oldF.remark !== newF.remark) {
      types.push("REMARK_CHANGED");
      findings.push(`\u5907\u6CE8\u53D1\u751F\u53D8\u5316`);
      risk = maxRisk(risk, "low");
    }
    if (types.length > 0) {
      result.push(buildDiff({
        fieldKey: newF.fieldName,
        diffType: types,
        oldField: oldF,
        newField: newF,
        findings,
        risk,
        status: "MANUAL_REVIEW_REQUIRED"
      }));
    }
  }
  return result;
}
function buildDiff(p) {
  return {
    diffId: `DIFF_${p.fieldKey}`,
    fieldKey: p.fieldKey,
    diffType: p.diffType,
    oldField: p.oldField,
    newField: p.newField,
    ruleFindings: p.findings,
    aiSummary: "",
    evidence: [],
    riskLevel: p.risk,
    status: p.status,
    affectedModules: []
  };
}

// src/lib/rules/mapping.ts
var synonymMap = {
  loanId: "loan_no",
  loanAmt: "loan_amount",
  custName: "borrower_name",
  certId: "id_no",
  phone: "mobile",
  loanTerm: "loan_term",
  yearRate: "annual_rate",
  loanStatus: "loan_status",
  applyTime: "apply_time",
  dueDate: "due_date",
  repayType: "repay_method",
  cardNo: "bank_card",
  prodCode: "product_code",
  srcChannel: "channel",
  interestAmt: "interest",
  overdueFlag: "overdue_flag",
  remarkInfo: "remark",
  principalBal: "remaining_principal"
};
function buildMappings(external, internal) {
  const internalMap = new Map(internal.map((f2) => [f2.fieldName, f2]));
  const out = [];
  for (const ext of external) {
    const internalName = synonymMap[ext.fieldName] ?? (internalMap.has(ext.fieldName) ? ext.fieldName : void 0);
    if (!internalName || !internalMap.has(internalName)) {
      out.push(base({
        externalField: ext.fieldName,
        internalField: "",
        mappingStatus: "INTERNAL_FIELD_MISSING",
        confidence: 0.95,
        reason: `\u6211\u65B9\u793A\u4F8B\u8D26\u52A1\u7CFB\u7EDF \u65E0\u5BF9\u5E94\u5B57\u6BB5\uFF0C\u9700\u8BC4\u4F30\u662F\u5426\u65B0\u589E\u7CFB\u7EDF\u5B57\u6BB5\u6216\u5FFD\u7565`,
        risk: "high"
      }));
      continue;
    }
    const intl = internalMap.get(internalName);
    const nameDiff = ext.fieldName !== intl.fieldName;
    if (ext.dataType !== intl.dataType || ext.length !== intl.length) {
      out.push(base({
        externalField: ext.fieldName,
        internalField: intl.fieldName,
        mappingStatus: "TRANSFORM_REQUIRED",
        confidence: 0.85,
        reason: `\u5B57\u6BB5${nameDiff ? "\u540D\u79F0\u4E0D\u540C\u4F46\u542B\u4E49\u76F8\u540C" : "\u540D\u79F0\u4E00\u81F4"}\uFF0C\u9700\u7C7B\u578B/\u7CBE\u5EA6\u8F6C\u6362\uFF08${ext.dataType}${ext.length} \u2192 ${intl.dataType}${intl.length}\uFF09`,
        risk: "high"
      }));
      continue;
    }
    const enumDiff2 = ext.enumValues.length !== intl.enumValues.length || ext.enumValues.some((e) => !intl.enumValues.includes(e));
    if (enumDiff2) {
      out.push(base({
        externalField: ext.fieldName,
        internalField: intl.fieldName,
        mappingStatus: "RULE_TRANSFORM_REQUIRED",
        confidence: 0.82,
        reason: `\u5B57\u6BB5${nameDiff ? "\u540D\u79F0\u4E0D\u540C\u4F46\u542B\u4E49\u76F8\u540C" : "\u540D\u79F0\u4E00\u81F4"}\uFF0C\u679A\u4E3E\u5B58\u5728\u5DEE\u5F02\uFF0C\u9700\u89C4\u5219\u8F6C\u6362`,
        risk: "medium"
      }));
      continue;
    }
    out.push(base({
      externalField: ext.fieldName,
      internalField: intl.fieldName,
      mappingStatus: "DIRECT_MAPPING",
      confidence: nameDiff ? 0.9 : 0.98,
      reason: nameDiff ? `\u5B57\u6BB5\u540D\u79F0\u4E0D\u540C\u4F46\u4E1A\u52A1\u542B\u4E49\u76F8\u540C\uFF0C\u53EF\u76F4\u63A5\u6620\u5C04` : `\u5B57\u6BB5\u540D\u79F0\u4E0E\u542B\u4E49\u4E00\u81F4\uFF0C\u76F4\u63A5\u6620\u5C04`,
      risk: "low"
    }));
  }
  return out;
}
function base(p) {
  return {
    mappingId: `MAP_${p.externalField}`,
    externalField: p.externalField,
    internalField: p.internalField,
    mappingStatus: p.mappingStatus,
    confidence: p.confidence,
    reason: p.reason,
    aiSummary: "",
    riskLevel: p.risk,
    evidence: [],
    affectedModules: []
  };
}

// src/lib/rules/demoValidate.ts
function parseCsvRaw(raw) {
  const lines = raw.trim().split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(",");
    const row = {};
    headers.forEach((h, idx) => row[h] = (cells[idx] ?? "").trim());
    rows.push(row);
  }
  return { headers, rows };
}
var aliasMap = {
  mobileNo: "phone"
};
function checkDateFormat(format, value) {
  if (!format) return true;
  if (format === "YYYYMMDDHHmmss") return /^\d{14}$/.test(value);
  if (format === "YYYY-MM-DD") return /^\d{4}-\d{2}-\d{2}$/.test(value);
  if (format === "YYYY-MM-DD HH:mm:ss") return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value);
  return true;
}
function validateDemo(raw, spec) {
  const parsed = parseCsvRaw(raw);
  const issues = [];
  const specByName = new Map(spec.map((f2) => [f2.fieldName, f2]));
  const headerSet = new Set(parsed.headers);
  for (const f2 of spec) {
    if (headerSet.has(f2.fieldName)) continue;
    const aliased = Object.entries(aliasMap).find(([, target]) => target === f2.fieldName);
    if (aliased) {
      issues.push({
        issueId: `DEMO_MISMATCH_${f2.fieldName}`,
        issueType: "COLUMN_NAME_MISMATCH",
        detail: `Demo \u5217\u540D "${aliased[0]}" \u4E0E\u6587\u6863\u5B57\u6BB5 "${f2.fieldName}"\uFF08${f2.chineseName}\uFF09\u4E0D\u4E00\u81F4\uFF0C\u89E3\u6790\u65F6\u9700\u5EFA\u7ACB\u6620\u5C04`,
        column: aliased[0],
        riskLevel: "medium",
        evidence: [`${f2.source} - ${f2.fieldName}`, `demo_v2.csv \u8868\u5934`]
      });
      continue;
    }
    if (f2.required === "Y") {
      issues.push({
        issueId: `DEMO_MISSING_${f2.fieldName}`,
        issueType: "MISSING_REQUIRED",
        detail: `Demo \u7F3A\u5C11\u5FC5\u586B\u5B57\u6BB5 "${f2.fieldName}"\uFF08${f2.chineseName}\uFF09\uFF0CV2 \u8981\u6C42\u5FC5\u586B`,
        column: f2.fieldName,
        riskLevel: "high",
        evidence: [`${f2.source} - ${f2.fieldName} \u5FC5\u586B=Y`, `demo_v2.csv \u8868\u5934`]
      });
    }
  }
  parsed.rows.forEach((row, idx) => {
    const rowRef = idx + 1;
    for (const f2 of spec) {
      const colName = headerSet.has(f2.fieldName) ? f2.fieldName : Object.keys(aliasMap).find((k) => aliasMap[k] === f2.fieldName);
      if (!colName) continue;
      const val = (row[colName] ?? "").trim();
      if (!val) continue;
      if (f2.enumValues.length && !f2.enumValues.includes(val)) {
        issues.push({
          issueId: `DEMO_ENUM_${f2.fieldName}_${rowRef}`,
          issueType: "UNDEFINED_ENUM",
          detail: `\u7B2C ${rowRef} \u884C ${f2.chineseName}="${val}" \u4E0D\u5728\u6587\u6863\u679A\u4E3E [${f2.enumValues.join(", ")}] \u5185`,
          rowRef,
          column: f2.fieldName,
          riskLevel: "high",
          evidence: [`${f2.source} - ${f2.fieldName} \u679A\u4E3E\u5B9A\u4E49`, `demo_v2.csv \u7B2C ${rowRef} \u884C`]
        });
      }
      if (!checkDateFormat(f2.format, val)) {
        issues.push({
          issueId: `DEMO_FMT_${f2.fieldName}_${rowRef}`,
          issueType: "FORMAT_ERROR",
          detail: `\u7B2C ${rowRef} \u884C ${f2.chineseName}="${val}" \u4E0D\u7B26\u5408\u6587\u6863\u683C\u5F0F ${f2.format}`,
          rowRef,
          column: f2.fieldName,
          riskLevel: "medium",
          evidence: [`${f2.source} - ${f2.fieldName} \u683C\u5F0F ${f2.format}`, `demo_v2.csv \u7B2C ${rowRef} \u884C`]
        });
      }
    }
  });
  return { issues, parsed };
}

// src/lib/rules/caseAnalysis.ts
function getSheet(c, code) {
  return c.sheets.find((s) => s.sheetName === code);
}
function maxDecimals(rows) {
  let max = 0;
  for (const r of rows) for (const cell of r) {
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
      const oldCol = refS.rows.map((r) => r[refColIdx[h]] ?? "");
      const newCol = newS.rows.map((r) => r[newColIdx[h]] ?? "");
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
    const ok = flowRows === 0 && (loan ? loanStatus === "0" : true);
    findings.push({
      point: "\u9000\u6B3E\u573A\u666F\u65E0\u8FD8\u6B3E\u6D41\u6C34",
      ok,
      note: ok ? "\u672A\u51FA\u8D44\u9000\u6B3E\uFF1A\u65E0\u8FD8\u6B3E\u6D41\u6C34\uFF0C\u7B26\u5408\u9884\u671F\uFF08\u8BE5\u6709\u7684\u6570\u636E\u8981\u6709\u3001\u4E0D\u8BE5\u6709\u7684\u4E0D\u80FD\u6709\uFF09" : "\u9000\u6B3E\u573A\u666F\u4E0D\u5E94\u51FA\u73B0\u8FD8\u6B3E\u6D41\u6C34",
      risk: ok ? "low" : "high",
      evidence: ["\u573A\u666F sheet", "FLOW"]
    });
  }
  const lendAmt = loanRow ? Number(loanRow[5]) : 0;
  const repaidPrincipal = (flow?.rows ?? []).reduce((s, r) => s + (Number(r[3]) || 0), 0);
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
    const overdueFlow = (flow?.rows ?? []).find((r) => r[2] === "03");
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
  const loanNos = loanRows.map((r) => r[3]);
  const uniqueLoan = new Set(loanNos).size === loanNos.length;
  const rule1ok = cases.every((c) => {
    const r = getSheet(c, "LOAN")?.rows[0];
    if (!r) return true;
    const receive = r[7];
    const status = r[4];
    return receive ? status !== "0" : status === "0";
  });
  const hasSeparatePen = flowRows.some((r) => r[2] === "03" && (Number(r[5]) || 0) > 0);
  const hasReplan = planRows.length > 0;
  const flowNos = repayFlowRows.map((r) => r[2]);
  const uniqueFlowNo = new Set(flowNos).size === flowNos.length;
  const termPairs = planRows.map((r) => `${r[1]}|${r[2]}`);
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
  const validations = rules.map((r) => {
    const res = resultBySeq[r.seq] ?? { result: "na", note: "\u672A\u7EB3\u5165\u6F14\u793A\u6821\u9A8C\u8303\u56F4" };
    return { seq: r.seq, rule: r.rule, result: res.result, note: res.note };
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

// src/lib/ai/mock.ts
var diffEnrich = {
  loanAmt: {
    aiSummary: "\u91D1\u989D\u7CBE\u5EA6\u7531\u4E24\u4F4D\u63D0\u5347\u81F3\u56DB\u4F4D\uFF0C\u6211\u65B9 loan_amount \u4EC5\u652F\u6301\u4E24\u4F4D\u5C0F\u6570\uFF0C\u53EF\u80FD\u6D89\u53CA\u6570\u636E\u5E93\u7CBE\u5EA6\u3001\u8D26\u52A1\u89E3\u6790\u4E0E\u5BF9\u8D26\u903B\u8F91\u8C03\u6574\u3002",
    evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - loanAmt", "\u793A\u4F8B\u8D26\u52A1\u7CFB\u7EDF\u5B57\u6BB5\u5B57\u5178 - loan_amount", "\u7CFB\u7EDF\u89C4\u5219 R001"],
    affectedModules: ["\u8D26\u52A1", "\u653E\u6B3E"],
    riskLevel: "high"
  },
  custName: {
    aiSummary: "\u4E2D\u6587\u540D\u79F0\u7531\u201C\u5BA2\u6237\u59D3\u540D\u201D\u8C03\u6574\u4E3A\u201C\u501F\u6B3E\u4EBA\u59D3\u540D\u201D\uFF0C\u5B57\u6BB5\u542B\u4E49\u672A\u53D8\uFF0C\u4EC5\u547D\u540D\u53E3\u5F84\u53D8\u5316\uFF0C\u53EF\u5FFD\u7565\u9002\u914D\u3002",
    evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV1 - custName", "\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - custName"],
    affectedModules: ["\u521B\u5355"],
    riskLevel: "low"
  },
  certId: {
    aiSummary: "\u5B57\u6BB5\u540D\u79F0\u7531 certNo \u53D8\u66F4\u4E3A certId\uFF0C\u4E1A\u52A1\u542B\u4E49\u4E00\u81F4\uFF0C\u5EFA\u8BAE\u5EFA\u7ACB\u5B57\u6BB5\u522B\u540D\u6620\u5C04\uFF0C\u4E0D\u5F71\u54CD\u9002\u914D\u3002",
    evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV1 - certNo", "\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - certId"],
    affectedModules: ["\u521B\u5355"],
    riskLevel: "low"
  },
  yearRate: {
    aiSummary: "\u5229\u7387\u4EE5\u767E\u5206\u6BD4\u5F62\u5F0F\u63D0\u4F9B\uFF08\u5982 7.2 \u8868\u793A 7.2%\uFF09\uFF0C\u6211\u65B9 annual_rate \u4EE5\u5C0F\u6570\u5B58\u50A8\uFF080.0720\uFF09\uFF0C\u9700\u5728\u63A5\u5165\u5C42\u505A\u9664\u4EE5 100 \u7684\u89C4\u5219\u8F6C\u6362\u3002",
    evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - yearRate", "\u793A\u4F8B\u8D26\u52A1\u7CFB\u7EDF\u5B57\u6BB5\u5B57\u5178 - annual_rate", "\u7CFB\u7EDF\u89C4\u5219 R003", "\u5386\u53F2 H003"],
    affectedModules: ["\u521B\u5355", "\u8D26\u52A1"],
    riskLevel: "medium"
  },
  loanStatus: {
    aiSummary: "\u679A\u4E3E\u65B0\u589E PROCESSING\uFF08\u5904\u7406\u4E2D\uFF09\u6001\uFF0C\u6211\u65B9\u72B6\u6001\u673A\u4EC5\u542B INIT/SUCCESS/FAIL\uFF0C\u5B58\u5728\u4E1A\u52A1\u51B2\u7A81\uFF0C\u8D37\u540E\u4E0E\u8D26\u52A1\u6D41\u8F6C\u9700\u8BC4\u4F30\u662F\u5426\u65B0\u589E\u4E2D\u95F4\u6001\u3002",
    evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - loanStatus", "\u793A\u4F8B\u8D26\u52A1\u7CFB\u7EDF\u5B57\u6BB5\u5B57\u5178 - loan_status", "\u7CFB\u7EDF\u89C4\u5219 R002", "\u5386\u53F2 H002"],
    affectedModules: ["\u8D37\u540E", "\u8D26\u52A1", "\u98CE\u63A7"],
    riskLevel: "high"
  },
  applyTime: {
    aiSummary: "\u7533\u8BF7\u65F6\u95F4\u683C\u5F0F\u7531 YYYY-MM-DD HH:mm:ss \u53D8\u66F4\u4E3A YYYYMMDDHHmmss\uFF08\u53BB\u5206\u9694\u7B26\uFF09\uFF0C\u6211\u65B9\u89E3\u6790\u5668\u9700\u517C\u5BB9\u65B0\u683C\u5F0F\u3002",
    evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV1 - applyTime", "\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - applyTime", "\u7CFB\u7EDF\u89C4\u5219 R004"],
    affectedModules: ["\u521B\u5355", "\u653E\u6B3E"],
    riskLevel: "medium"
  },
  srcChannel: {
    aiSummary: "\u6E20\u9053\u7531\u5FC5\u586B\u6539\u4E3A\u975E\u5FC5\u586B\uFF0C\u6211\u65B9\u521B\u5355\u89C4\u5219\u4ECD\u8981\u6C42\u5FC5\u586B\uFF0C\u9700\u4E0E\u8D44\u4EA7\u65B9\u786E\u8BA4\u662F\u5426\u653E\u5BBD\u6216\u4FDD\u7559\u6821\u9A8C\u3002",
    evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV1 - srcChannel", "\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - srcChannel", "\u7CFB\u7EDF\u89C4\u5219 R005"],
    affectedModules: ["\u521B\u5355"],
    riskLevel: "medium"
  },
  remarkInfo: {
    aiSummary: "\u5907\u6CE8\u7531\u975E\u5FC5\u586B\u6539\u4E3A\u5FC5\u586B\uFF0C\u6211\u65B9 remark \u4E3A\u975E\u5FC5\u586B\uFF0C\u9700\u786E\u8BA4\u662F\u5426\u540C\u6B65\u8C03\u6574\u521B\u5355\u4E0E\u8D26\u52A1\u843D\u5E93\u7EA6\u675F\u3002",
    evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV1 - remarkInfo", "\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - remarkInfo", "\u7CFB\u7EDF\u89C4\u5219 R005"],
    affectedModules: ["\u521B\u5355", "\u8D26\u52A1"],
    riskLevel: "medium"
  },
  oldChannelCode: {
    aiSummary: "\u65E7\u6E20\u9053\u7F16\u7801\u5B57\u6BB5\u88AB\u5220\u9664\uFF0C\u6211\u65B9\u82E5\u66FE\u4F9D\u8D56\u8BE5\u5B57\u6BB5\u9700\u8BC4\u4F30\u5386\u53F2\u6570\u636E\u517C\u5BB9\u4E0E\u6E05\u7406\u3002",
    evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV1 - oldChannelCode"],
    affectedModules: ["\u521B\u5355", "\u8D26\u52A1"],
    riskLevel: "medium"
  },
  repaymentChannel: {
    aiSummary: "V2 \u65B0\u589E\u8FD8\u6B3E\u6E20\u9053\u5B57\u6BB5\uFF0C\u6211\u65B9\u793A\u4F8B\u8D26\u52A1\u7CFB\u7EDF \u65E0\u5BF9\u5E94\u5B57\u6BB5\uFF0C\u9700\u8BC4\u4F30\u662F\u5426\u65B0\u589E\u7CFB\u7EDF\u5B57\u6BB5\u4EE5\u652F\u6301\u8FD8\u6B3E\u6E20\u9053\u7EDF\u8BA1\u3002",
    evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - repaymentChannel", "\u793A\u4F8B\u8D26\u52A1\u7CFB\u7EDF\u5B57\u6BB5\u5B57\u5178"],
    affectedModules: ["\u8D26\u52A1", "\u5176\u4ED6"],
    riskLevel: "high"
  }
};
var mappingEnrich = {
  loanAmt: {
    aiSummary: "\u91D1\u989D\u7CBE\u5EA6\u4E0D\u4E00\u81F4\uFF0C\u9700\u5728\u63A5\u5165\u7F51\u5173\u505A\u7CBE\u5EA6\u8F6C\u6362\uFF0C\u5E76\u8BC4\u4F30\u5BF9\u8D26\u5DEE\u989D\u5904\u7406\u3002",
    evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - loanAmt", "\u793A\u4F8B\u8D26\u52A1\u7CFB\u7EDF\u5B57\u6BB5\u5B57\u5178 - loan_amount", "\u7CFB\u7EDF\u89C4\u5219 R001"],
    affectedModules: ["\u8D26\u52A1", "\u653E\u6B3E"],
    riskLevel: "high"
  },
  yearRate: {
    aiSummary: "\u767E\u5206\u6BD4\u4E0E\u5C0F\u6570\u8868\u793A\u5DEE\u5F02\uFF0C\u9700\u89C4\u5219\u8F6C\u6362\uFF08\u9664\u4EE5 100\uFF09\uFF0C\u5EFA\u8BAE\u5728\u63A5\u5165\u7F51\u5173\u7EDF\u4E00\u5904\u7406\u3002",
    evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - yearRate", "\u793A\u4F8B\u8D26\u52A1\u7CFB\u7EDF\u5B57\u6BB5\u5B57\u5178 - annual_rate", "\u7CFB\u7EDF\u89C4\u5219 R003"],
    affectedModules: ["\u521B\u5355", "\u8D26\u52A1"],
    riskLevel: "medium"
  },
  loanStatus: {
    aiSummary: "\u679A\u4E3E\u5B58\u5728\u5DEE\u5F02\u4E14\u6D89\u53CA\u72B6\u6001\u673A\u51B2\u7A81\uFF0C\u9700\u89C4\u5219\u6620\u5C04\u5E76\u8BC4\u4F30\u65B0\u589E\u4E2D\u95F4\u6001\u3002",
    evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - loanStatus", "\u793A\u4F8B\u8D26\u52A1\u7CFB\u7EDF\u5B57\u6BB5\u5B57\u5178 - loan_status", "\u7CFB\u7EDF\u89C4\u5219 R002"],
    affectedModules: ["\u8D37\u540E", "\u8D26\u52A1", "\u98CE\u63A7"],
    riskLevel: "high"
  },
  repaymentChannel: {
    aiSummary: "\u6211\u65B9\u65E0\u5BF9\u5E94\u5B57\u6BB5\uFF0C\u6620\u5C04\u7F3A\u5931\uFF0C\u9700\u4EBA\u5DE5\u786E\u8BA4\u662F\u5426\u65B0\u589E\u5B57\u6BB5\u3002",
    evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - repaymentChannel", "\u793A\u4F8B\u8D26\u52A1\u7CFB\u7EDF\u5B57\u6BB5\u5B57\u5178"],
    affectedModules: ["\u8D26\u52A1", "\u5176\u4ED6"],
    riskLevel: "high"
  }
};
var conflictQuestions = [
  q2("Q_CONFLICT_AMT", "internal", "\u5BF9\u65B9 loanAmt \u652F\u6301\u56DB\u4F4D\u5C0F\u6570\uFF0C\u6211\u65B9 loan_amount \u4EC5\u652F\u6301\u4E24\u4F4D\uFF0C\u662F\u5426\u540C\u6B65\u8C03\u6574\u8D26\u52A1\u89E3\u6790\u53CA\u91D1\u989D\u8BA1\u7B97\u7CBE\u5EA6\uFF1F", ["loanAmt", "loan_amount"], "\u5185\u90E8\u4EA7\u54C1+\u7814\u53D1", "high", "\u91D1\u989D\u7CBE\u5EA6\u5DEE\u5F02\u5F71\u54CD\u8D26\u52A1\u4E0E\u5BF9\u8D26", ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - loanAmt", "\u793A\u4F8B\u8D26\u52A1\u7CFB\u7EDF\u5B57\u6BB5\u5B57\u5178 - loan_amount", "\u7CFB\u7EDF\u89C4\u5219 R001"]),
  q2("Q_CONFLICT_STATUS", "internal", "\u5BF9\u65B9 loanStatus \u65B0\u589E PROCESSING \u5904\u7406\u4E2D\u6001\uFF0C\u6211\u65B9\u72B6\u6001\u673A\u65E0\u5BF9\u5E94\u6001\uFF0C\u662F\u5426\u65B0\u589E\u4E2D\u95F4\u6001\u5E76\u660E\u786E\u8BA1\u606F\u4E0E\u98CE\u63A7\u89C4\u5219\uFF1F", ["loanStatus", "loan_status"], "\u5185\u90E8\u4EA7\u54C1+\u7814\u53D1", "high", "\u72B6\u6001\u673A\u51B2\u7A81\uFF0C\u5F71\u54CD\u8D37\u540E\u4E0E\u8D26\u52A1\u6D41\u8F6C", ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - loanStatus", "\u793A\u4F8B\u8D26\u52A1\u7CFB\u7EDF\u5B57\u6BB5\u5B57\u5178 - loan_status", "\u7CFB\u7EDF\u89C4\u5219 R002", "\u5386\u53F2 H002"]),
  q2("Q_CONFLICT_CHANNEL", "dev", "\u5BF9\u65B9\u65B0\u589E repaymentChannel\uFF0C\u6211\u65B9\u65E0\u5BF9\u5E94\u5B57\u6BB5\uFF0C\u662F\u5426\u65B0\u589E\u7CFB\u7EDF\u5B57\u6BB5\u4EE5\u652F\u6301\u8FD8\u6B3E\u6E20\u9053\u7EDF\u8BA1\uFF1F", ["repaymentChannel"], "\u7814\u53D1", "medium", "\u6211\u65B9\u5B57\u6BB5\u7F3A\u5931", ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - repaymentChannel", "\u793A\u4F8B\u8D26\u52A1\u7CFB\u7EDF\u5B57\u6BB5\u5B57\u5178"]),
  q2("Q_CONFLICT_RATE", "internal", "yearRate \u6587\u6863\u4EE5\u767E\u5206\u6BD4\u7ED9\u51FA\uFF08\u5982 7.2\uFF09\uFF0C\u6211\u65B9 annual_rate \u4EE5\u5C0F\u6570\u5B58\u50A8\uFF080.0720\uFF09\uFF0C\u662F\u5426\u5728\u63A5\u5165\u5C42\u7EDF\u4E00\u9664\u4EE5 100\uFF1F", ["yearRate", "annual_rate"], "\u5185\u90E8\u4EA7\u54C1+\u7814\u53D1", "medium", "\u5355\u4F4D\u8868\u793A\u5DEE\u5F02\u9700\u89C4\u5219\u8F6C\u6362", ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - yearRate", "\u793A\u4F8B\u8D26\u52A1\u7CFB\u7EDF\u5B57\u6BB5\u5B57\u5178 - annual_rate", "\u7CFB\u7EDF\u89C4\u5219 R003", "\u5386\u53F2 H003"]),
  q2("Q_DEMO_RATE", "external", "Demo \u4E2D yearRate \u5B58\u5728 0.0720\uFF08\u5C0F\u6570\uFF09\u4E0E\u6587\u6863\u767E\u5206\u6BD4 7.2 \u77DB\u76FE\uFF0C\u8BF7\u786E\u8BA4\u5229\u7387\u63D0\u4F9B\u5F62\u5F0F\u3002", ["yearRate"], "\u8D44\u4EA7\u65B9", "medium", "\u6587\u6863\u4E0E Demo \u5B57\u6BB5\u542B\u4E49\u77DB\u76FE", ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - yearRate", "demo_v2.csv"]),
  q2("Q_DEMO_FINISH", "external", "loanStatus=PROCESSING\uFF08\u5904\u7406\u4E2D\uFF09\u7684\u8BB0\u5F55\u5DF2\u5B58\u5728 finishTime\uFF0C\u8BF7\u786E\u8BA4\u5904\u7406\u4E2D\u72B6\u6001\u662F\u5426\u5141\u8BB8\u5B58\u5728\u5B8C\u6210\u65F6\u95F4\u3002", ["loanStatus"], "\u8D44\u4EA7\u65B9", "medium", "\u72B6\u6001\u5B9A\u4E49\u4E0E\u6570\u636E\u77DB\u76FE", ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - loanStatus", "demo_v2.csv \u7B2C 2 \u884C"])
];
var systemImpacts = [
  { module: "\u8D26\u52A1", findings: [
    { desc: "\u653E\u6B3E\u91D1\u989D\u7CBE\u5EA6\u7531 2 \u4F4D\u8C03\u6574\u4E3A 4 \u4F4D\uFF0C\u5F71\u54CD\u8D26\u52A1\u89E3\u6790\u4E0E\u5BF9\u8D26\u5DEE\u989D\u5904\u7406", fields: ["loanAmt", "loan_amount"], riskLevel: "high", evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - loanAmt", "\u7CFB\u7EDF\u89C4\u5219 R001"] },
    { desc: "\u65B0\u589E repaymentChannel\uFF0C\u6211\u65B9\u65E0\u5BF9\u5E94\u5B57\u6BB5\uFF0C\u5F71\u54CD\u8FD8\u6B3E\u6E20\u9053\u8D26\u52A1\u7EDF\u8BA1", fields: ["repaymentChannel"], riskLevel: "medium", evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - repaymentChannel"] },
    { desc: "\u5907\u6CE8\u7531\u975E\u5FC5\u586B\u6539\u4E3A\u5FC5\u586B\uFF0C\u5F71\u54CD\u8D26\u52A1\u843D\u5E93\u7EA6\u675F", fields: ["remarkInfo", "remark"], riskLevel: "medium", evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - remarkInfo"] }
  ] },
  { module: "\u521B\u5355", findings: [
    { desc: "\u6E20\u9053\u7531\u5FC5\u586B\u6539\u4E3A\u975E\u5FC5\u586B\uFF0C\u9700\u786E\u8BA4\u521B\u5355\u6821\u9A8C\u662F\u5426\u653E\u5BBD", fields: ["srcChannel", "channel"], riskLevel: "medium", evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - srcChannel", "\u7CFB\u7EDF\u89C4\u5219 R005"] },
    { desc: "\u5229\u7387\u767E\u5206\u6BD4\u8F6C\u5C0F\u6570\uFF0C\u9700\u63A5\u5165\u5C42\u89C4\u5219\u8F6C\u6362", fields: ["yearRate", "annual_rate"], riskLevel: "medium", evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - yearRate", "\u7CFB\u7EDF\u89C4\u5219 R003"] },
    { desc: "\u501F\u636E\u72B6\u6001\u679A\u4E3E\u65B0\u589E PROCESSING\uFF0C\u521B\u5355\u9700\u652F\u6301\u65B0\u6001", fields: ["loanStatus", "loan_status"], riskLevel: "high", evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - loanStatus", "\u7CFB\u7EDF\u89C4\u5219 R002"] }
  ] },
  { module: "\u653E\u6B3E", findings: [
    { desc: "\u7533\u8BF7\u65F6\u95F4\u683C\u5F0F\u53BB\u5206\u9694\u7B26 YYYYMMDDHHmmss\uFF0C\u653E\u6B3E\u89E3\u6790\u9700\u517C\u5BB9", fields: ["applyTime", "apply_time"], riskLevel: "medium", evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - applyTime", "\u7CFB\u7EDF\u89C4\u5219 R004"] },
    { desc: "\u653E\u6B3E\u91D1\u989D\u56DB\u4F4D\u7CBE\u5EA6\u5F71\u54CD\u91D1\u989D\u843D\u5E93", fields: ["loanAmt", "loan_amount"], riskLevel: "high", evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - loanAmt"] }
  ] },
  { module: "\u8D37\u540E", findings: [
    { desc: "\u501F\u636E\u72B6\u6001\u65B0\u589E PROCESSING \u5904\u7406\u4E2D\u6001\uFF0C\u8D37\u540E\u6D41\u8F6C\u9700\u652F\u6301\u4E2D\u95F4\u6001", fields: ["loanStatus", "loan_status"], riskLevel: "high", evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - loanStatus", "\u5386\u53F2 H002"] }
  ] },
  { module: "\u98CE\u63A7", findings: [
    { desc: "\u5904\u7406\u4E2D\u6001\u5F71\u54CD\u98CE\u63A7\u7B56\u7565\u5206\u652F\uFF0C\u9700\u8865\u5145\u4E2D\u95F4\u6001\u5904\u7406", fields: ["loanStatus"], riskLevel: "medium", evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - loanStatus"] }
  ] },
  { module: "\u5176\u4ED6", findings: [
    { desc: "\u8FD8\u6B3E\u6E20\u9053\u7EDF\u8BA1\u9700\u65B0\u589E\u5B57\u6BB5\u6216\u65C1\u8DEF\u5904\u7406", fields: ["repaymentChannel"], riskLevel: "low", evidence: ["\u793A\u4F8B\u8D44\u4EA7\u65B9\u8D26\u52A1\u8BF4\u660EV2 - repaymentChannel"] }
  ] }
];
function inferModules(fieldName) {
  const n = (fieldName || "").toLowerCase();
  const m = [];
  if (/amt|amount|fee|interest|balance|money|金额|费|息|余额|还款/.test(n)) m.push("\u8D26\u52A1", "\u653E\u6B3E");
  if (/status|state|状态/.test(n)) m.push("\u8D37\u540E", "\u8D26\u52A1", "\u98CE\u63A7");
  if (/time|date|申请|放款|apply/.test(n)) m.push("\u521B\u5355", "\u653E\u6B3E");
  if (/channel|渠道|src/.test(n)) m.push("\u521B\u5355");
  if (/name|cert|客户|借款人|证件/.test(n)) m.push("\u521B\u5355");
  if (/rate|利率|year/.test(n)) m.push("\u521B\u5355", "\u8D26\u52A1");
  if (m.length === 0) m.push("\u5176\u4ED6");
  return Array.from(new Set(m));
}
function genericDiffSummary(d) {
  const cn = d.newField?.chineseName || d.oldField?.chineseName || "";
  if (d.diffType.includes("ADDED")) return `\u65B0\u589E\u5B57\u6BB5 ${d.fieldKey}${cn ? `\uFF08${cn}\uFF09` : ""}\u3002\u89C4\u5219\u5F15\u64CE\u8BC6\u522B\u4E3A\u65B0\u589E\uFF0C\u5EFA\u8BAE\u786E\u8BA4\u662F\u5426\u9700\u5728\u6211\u65B9\u7CFB\u7EDF\u65B0\u589E\u5BF9\u5E94\u5B57\u6BB5\u6216\u5EFA\u7ACB\u6620\u5C04\u3002`;
  if (d.diffType.includes("REMOVED")) return `\u5B57\u6BB5 ${d.fieldKey}${cn ? `\uFF08${cn}\uFF09` : ""} \u5728\u65B0\u7248\u4E2D\u88AB\u5220\u9664\u3002\u5EFA\u8BAE\u8BC4\u4F30\u6211\u65B9\u5386\u53F2\u4F9D\u8D56\u4E0E\u5386\u53F2\u6570\u636E\u517C\u5BB9\u3002`;
  const findings = d.ruleFindings.join("\uFF1B");
  return `\u89C4\u5219\u5F15\u64CE\u68C0\u6D4B\u5230 ${d.diffType.join("/")} \u53D8\u5316\uFF1A${findings}\u3002\u5EFA\u8BAE\u4EBA\u5DE5\u786E\u8BA4\u8BE5\u53D8\u5316\u5BF9 ${inferModules(d.fieldKey).join("\u3001")} \u7B49\u6A21\u5757\u7684\u5F71\u54CD\u3002`;
}
function genericMappingSummary(m) {
  switch (m.mappingStatus) {
    case "DIRECT_MAPPING":
      return `\u5B57\u6BB5 ${m.externalField} \u53EF\u76F4\u63A5\u6620\u5C04\u81F3 ${m.internalField || "\uFF08\u5F85\u5B9A\uFF09"}\u3002`;
    case "TRANSFORM_REQUIRED":
    case "RULE_TRANSFORM_REQUIRED":
      return `\u5B57\u6BB5 ${m.externalField} \u9700\u8F6C\u6362\u540E\u6620\u5C04\u81F3 ${m.internalField || "\uFF08\u5F85\u5B9A\uFF09"}\uFF0C\u5EFA\u8BAE\u5728\u63A5\u5165\u7F51\u5173\u7EDF\u4E00\u5904\u7406\u3002`;
    case "INTERNAL_FIELD_MISSING":
      return `\u6211\u65B9\u65E0 ${m.externalField} \u5BF9\u5E94\u5B57\u6BB5\uFF0C\u6620\u5C04\u7F3A\u5931\uFF0C\u9700\u4EBA\u5DE5\u786E\u8BA4\u662F\u5426\u65B0\u589E\u7CFB\u7EDF\u5B57\u6BB5\u3002`;
    case "BUSINESS_CONFLICT":
      return `\u5B57\u6BB5 ${m.externalField} \u5B58\u5728\u4E1A\u52A1\u51B2\u7A81\uFF0C\u9700\u5185\u90E8\u4E1A\u52A1\u4E0E\u7814\u53D1\u786E\u8BA4\u3002`;
    default:
      return `\u5B57\u6BB5 ${m.externalField} \u9002\u914D\u72B6\u6001\u4E3A ${m.mappingStatus}\uFF0C\u5EFA\u8BAE\u4EBA\u5DE5\u786E\u8BA4\u3002`;
  }
}
function buildGenericQuestions(diffs, mappings, newFields) {
  const out = [];
  const newSet = new Set(newFields.map((f2) => f2.fieldName));
  diffs.forEach((d) => {
    if (d.riskLevel !== "high" && !d.diffType.includes("TYPE_CHANGED") && !d.diffType.includes("ENUM_CHANGED")) return;
    if (!newSet.has(d.fieldKey)) return;
    const cn = d.newField?.chineseName || d.oldField?.chineseName || "";
    out.push(
      q2(
        `Q_GEN_D_${d.fieldKey}`,
        "internal",
        `\u5B57\u6BB5 ${d.fieldKey}${cn ? `\uFF08${cn}\uFF09` : ""} \u53D1\u751F ${d.diffType.join("/")} \u53D8\u5316\uFF08${d.ruleFindings.join("\uFF1B")}\uFF09\uFF0C\u8BF7\u786E\u8BA4\u662F\u5426\u9700\u7CFB\u7EDF\u9002\u914D\u53CA\u5F71\u54CD\u8303\u56F4\u3002`,
        [d.fieldKey],
        "\u5185\u90E8\u4EA7\u54C1+\u7814\u53D1",
        d.riskLevel,
        "\u4E0A\u4F20\u8D44\u6599\u81EA\u52A8\u5206\u6790\uFF1A\u89C4\u5219\u5F15\u64CE\u68C0\u6D4B\u5230\u9AD8\u98CE\u9669\u5B57\u6BB5\u53D8\u5316",
        ["\uFF08\u4E0A\u4F20\u8D44\u6599\u81EA\u52A8\u5206\u6790\uFF09"]
      )
    );
  });
  mappings.forEach((m) => {
    if (m.mappingStatus !== "INTERNAL_FIELD_MISSING" && m.mappingStatus !== "BUSINESS_CONFLICT") return;
    out.push(
      q2(
        `Q_GEN_M_${m.externalField}`,
        m.mappingStatus === "INTERNAL_FIELD_MISSING" ? "dev" : "internal",
        genericMappingSummary(m),
        [m.externalField],
        m.mappingStatus === "INTERNAL_FIELD_MISSING" ? "\u7814\u53D1" : "\u5185\u90E8\u4EA7\u54C1+\u7814\u53D1",
        m.riskLevel,
        "\u4E0A\u4F20\u8D44\u6599\u81EA\u52A8\u5206\u6790\uFF1A\u5B57\u6BB5\u6620\u5C04\u72B6\u6001\u4E3A " + m.mappingStatus,
        ["\uFF08\u4E0A\u4F20\u8D44\u6599\u81EA\u52A8\u5206\u6790\uFF09"]
      )
    );
  });
  return out;
}
function buildGenericSystemImpacts(diffs, mappings) {
  const byModule = /* @__PURE__ */ new Map();
  const add = (mod, f2) => {
    const arr = byModule.get(mod) ?? [];
    arr.push(f2);
    byModule.set(mod, arr);
  };
  diffs.forEach((d) => {
    if (d.diffType.length === 0 || d.diffType.every((t) => t === "REMARK_CHANGED")) return;
    inferModules(d.fieldKey).forEach(
      (mod) => add(mod, {
        desc: `${d.fieldKey}\uFF1A${d.ruleFindings.join("\uFF1B") || d.diffType.join("/")}`,
        fields: [d.fieldKey],
        riskLevel: d.riskLevel,
        evidence: ["\uFF08\u4E0A\u4F20\u8D44\u6599\u81EA\u52A8\u5206\u6790\uFF09"]
      })
    );
  });
  mappings.forEach((m) => {
    if (m.mappingStatus === "DIRECT_MAPPING") return;
    inferModules(m.externalField).forEach(
      (mod) => add(mod, {
        desc: `${m.externalField}\uFF1A${genericMappingSummary(m)}`,
        fields: [m.externalField],
        riskLevel: m.riskLevel,
        evidence: ["\uFF08\u4E0A\u4F20\u8D44\u6599\u81EA\u52A8\u5206\u6790\uFF09"]
      })
    );
  });
  return Array.from(byModule.entries()).map(([module, findings]) => ({ module, findings }));
}
function q2(id, type, content, fields, target, risk, reason, evidence) {
  return { qid: id, type, content, fields: (fields ?? []).filter((f2) => Boolean(f2)), source: "CSV Demo \u6821\u9A8C", evidence, riskLevel: risk, confirmTarget: target, aiReason: reason, status: "pending" };
}
function applyEnrich(items, table, keyOf) {
  return items.map((it) => {
    const e = table[keyOf(it)];
    if (!e) return it;
    return {
      ...it,
      aiSummary: it.aiSummary || e.aiSummary,
      evidence: e.evidence,
      affectedModules: e.affectedModules,
      riskLevel: e.riskLevel ?? it.riskLevel
    };
  });
}
var MockAIProvider = class {
  id = "mock";
  label = "\u6A21\u62DF AI \u5206\u6790\uFF08Mock\uFF09";
  isMock = true;
  async analyze(input) {
    const rawDiffs = diffFields({ oldFields: input.oldFields, newFields: input.newFields, renameMap: input.renameMap });
    const rawMappings = buildMappings(input.newFields, input.internalFields);
    const { issues } = validateDemo(input.demoRaw, input.newFields);
    const diffs = applyEnrich(rawDiffs, diffEnrich, (d) => d.fieldKey).map(
      (d) => d.aiSummary ? d : { ...d, aiSummary: genericDiffSummary(d), affectedModules: d.affectedModules.length ? d.affectedModules : inferModules(d.fieldKey) }
    );
    const mappings = applyEnrich(rawMappings, mappingEnrich, (m) => m.externalField).map(
      (m) => m.aiSummary ? m : { ...m, aiSummary: genericMappingSummary(m), affectedModules: m.affectedModules.length ? m.affectedModules : inferModules(m.externalField) }
    );
    const demoQuestions = issues.map(demoIssueToQuestion).filter((x) => x !== null);
    const newNames = new Set(input.newFields.map((f2) => f2.fieldName));
    const seedScenario = newNames.has("loanAmt") && newNames.has("loanStatus");
    const seedQuestions = seedScenario ? conflictQuestions.filter((qq) => qq.fields.some((f2) => newNames.has(f2))) : [];
    const genericQuestions = seedScenario ? [] : buildGenericQuestions(diffs, mappings, input.newFields);
    const questions = [...seedQuestions, ...genericQuestions, ...demoQuestions];
    const impacts = seedScenario ? systemImpacts : buildGenericSystemImpacts(diffs, mappings);
    return {
      diffs,
      mappings,
      demoIssues: issues,
      questions,
      systemImpacts: impacts,
      analyzedAt: (/* @__PURE__ */ new Date()).toISOString(),
      mock: true,
      providerId: this.id
    };
  }
};
var mockProvider = new MockAIProvider();
function demoIssueToQuestion(issue) {
  const id = issue.issueId;
  switch (issue.issueType) {
    case "MISSING_REQUIRED":
      return q2(`Q_${id}`, "external", `Demo \u7F3A\u5C11\u5FC5\u586B\u5B57\u6BB5 ${issue.column ?? ""}\uFF0C\u8BF7\u786E\u8BA4\u8BE5\u5B57\u6BB5\u662F\u5426\u5FC5\u987B\u63D0\u4F9B\u3002`, [issue.column], "\u8D44\u4EA7\u65B9", issue.riskLevel, "Demo \u7F3A\u5C11\u6587\u6863\u5B9A\u4E49\u7684\u5FC5\u586B\u5B57\u6BB5", issue.evidence);
    case "COLUMN_NAME_MISMATCH":
      return q2(`Q_${id}`, "external", `Demo \u5217\u540D "${issue.column ?? ""}" \u4E0E\u6587\u6863\u5B57\u6BB5\u4E0D\u4E00\u81F4\uFF0C\u8BF7\u786E\u8BA4\u4EE5\u54EA\u4E2A\u547D\u540D\u4E3A\u51C6\u3002`, [issue.column], "\u8D44\u4EA7\u65B9", "low", "Demo \u5217\u540D\u4E0E\u6587\u6863\u5B9A\u4E49\u4E0D\u4E00\u81F4", issue.evidence);
    case "UNDEFINED_ENUM":
      return q2(`Q_${id}`, "external", `${issue.detail}\uFF0C\u8BF7\u786E\u8BA4\u8BE5\u679A\u4E3E\u503C\u7684\u4E1A\u52A1\u542B\u4E49\u3002`, [issue.column ?? ""], "\u8D44\u4EA7\u65B9", "high", "Demo \u51FA\u73B0\u6587\u6863\u672A\u5B9A\u4E49\u679A\u4E3E", issue.evidence);
    case "FORMAT_ERROR":
      return q2(`Q_${id}`, "dev", `${issue.detail}\uFF0C\u8BF7\u786E\u8BA4\u89E3\u6790\u517C\u5BB9\u65B9\u6848\u3002`, [issue.column ?? ""], "\u5185\u90E8\u4EA7\u54C1+\u7814\u53D1", "medium", "Demo \u65E5\u671F\u683C\u5F0F\u4E0D\u7B26\u5408\u6587\u6863\u5B9A\u4E49", issue.evidence);
    default:
      return null;
  }
}

// src/lib/evaluation/goldenCases.ts
var goldenCases = [
  // ---------- FIELD_EXTRACTION ----------
  { caseId: "EX01", caseType: "FIELD_EXTRACTION", title: "\u89E3\u6790 CSV Demo \u8868\u5934\u5B57\u6BB5\u6570", input: { kind: "csv", expectedCount: 19 }, expectedResult: { count: 19 }, actualResult: {}, pass: false, remark: "\u6B63\u5E38\u60C5\u51B5" },
  { caseId: "EX02", caseType: "FIELD_EXTRACTION", title: "\u89E3\u6790 V2 \u8D26\u52A1\u8BF4\u660E\u5B57\u6BB5\u6570", input: { kind: "spec", expectedCount: 19 }, expectedResult: { count: 19 }, actualResult: {}, pass: false, remark: "\u6B63\u5E38\u60C5\u51B5" },
  { caseId: "EX03", caseType: "FIELD_EXTRACTION", title: "\u89E3\u6790\u7C98\u8D34 JSON \u5B57\u6BB5\u6570", input: { kind: "json", text: '[{"fieldName":"a"},{"fieldName":"b"},{"fieldName":"c"}]', expectedCount: 3 }, expectedResult: { count: 3 }, actualResult: {}, pass: false, remark: "\u8FB9\u754C\u60C5\u51B5" },
  // ---------- DIFF_DETECTION ----------
  { caseId: "DF01", caseType: "DIFF_DETECTION", title: "V1\u2192V2 \u5DEE\u5F02\u884C\u603B\u6570", input: { metric: "total", expected: 10 }, expectedResult: { count: 10 }, actualResult: {}, pass: false, remark: "\u53EC\u56DE\u4F18\u5148\uFF1A\u6F0F\u6389\u91CD\u8981\u5DEE\u5F02\u98CE\u9669\u9AD8\u4E8E\u591A\u62A5" },
  { caseId: "DF02", caseType: "DIFF_DETECTION", title: "\u8BC6\u522B\u65B0\u589E\u5B57\u6BB5", input: { metric: "ADDED", expected: 1 }, expectedResult: { count: 1 }, actualResult: {}, pass: false, remark: "\u6B63\u5E38\u60C5\u51B5" },
  { caseId: "DF03", caseType: "DIFF_DETECTION", title: "\u8BC6\u522B\u5220\u9664\u5B57\u6BB5", input: { metric: "REMOVED", expected: 1 }, expectedResult: { count: 1 }, actualResult: {}, pass: false, remark: "\u6B63\u5E38\u60C5\u51B5" },
  { caseId: "DF04", caseType: "DIFF_DETECTION", title: "\u8BC6\u522B\u7CBE\u5EA6/\u957F\u5EA6\u53D8\u5316", input: { metric: "LENGTH_CHANGED", expected: 1 }, expectedResult: { count: 1 }, actualResult: {}, pass: false, remark: "\u91D1\u989D\u7CBE\u5EA6 2\u21924" },
  { caseId: "DF05", caseType: "DIFF_DETECTION", title: "\u8BC6\u522B\u679A\u4E3E\u65B0\u589E", input: { metric: "ENUM_CHANGED", expected: 1 }, expectedResult: { count: 1 }, actualResult: {}, pass: false, remark: "PROCESSING \u65B0\u589E" },
  { caseId: "DF06", caseType: "DIFF_DETECTION", title: "\u8BC6\u522B\u5FC5\u586B\u89C4\u5219\u53D8\u5316", input: { metric: "REQUIRED_CHANGED", expected: 2 }, expectedResult: { count: 2 }, actualResult: {}, pass: false, remark: "srcChannel/remarkInfo" },
  // ---------- FIELD_MAPPING ----------
  { caseId: "MP01", caseType: "FIELD_MAPPING", title: "loanAmt \u7CBE\u5EA6\u4E0D\u540C\u9700\u8F6C\u6362", input: { field: "loanAmt", expectedStatus: "TRANSFORM_REQUIRED" }, expectedResult: { mappingStatus: "TRANSFORM_REQUIRED" }, actualResult: {}, pass: false, remark: "\u6211\u65B9\u7C7B\u578B\u4E0D\u540C" },
  { caseId: "MP02", caseType: "FIELD_MAPPING", title: "repaymentChannel \u6211\u65B9\u7F3A\u5931", input: { field: "repaymentChannel", expectedStatus: "INTERNAL_FIELD_MISSING" }, expectedResult: { mappingStatus: "INTERNAL_FIELD_MISSING" }, actualResult: {}, pass: false, remark: "\u6211\u65B9\u4E0D\u5B58\u5728\u5BF9\u5E94\u5B57\u6BB5" },
  { caseId: "MP03", caseType: "FIELD_MAPPING", title: "certId \u540D\u79F0\u4E0D\u540C\u542B\u4E49\u76F8\u540C", input: { field: "certId", expectedStatus: "DIRECT_MAPPING" }, expectedResult: { mappingStatus: "DIRECT_MAPPING" }, actualResult: {}, pass: false, remark: "\u5B57\u6BB5\u540D\u79F0\u4E0D\u540C\u4F46\u542B\u4E49\u76F8\u540C" },
  { caseId: "MP04", caseType: "FIELD_MAPPING", title: "loanStatus \u679A\u4E3E\u5DEE\u5F02\u9700\u89C4\u5219\u8F6C\u6362", input: { field: "loanStatus", expectedStatus: "RULE_TRANSFORM_REQUIRED" }, expectedResult: { mappingStatus: "RULE_TRANSFORM_REQUIRED" }, actualResult: {}, pass: false, remark: "\u8BED\u4E49\u51B2\u7A81/\u89C4\u5219\u8F6C\u6362" },
  { caseId: "MP05", caseType: "FIELD_MAPPING", title: "phone \u6620\u5C04\u5230 mobile", input: { field: "phone", expectedStatus: "DIRECT_MAPPING" }, expectedResult: { mappingStatus: "DIRECT_MAPPING" }, actualResult: {}, pass: false, remark: "\u540D\u79F0\u4E0D\u540C\u542B\u4E49\u76F8\u540C" },
  // ---------- BUSINESS_CONFLICT ----------
  { caseId: "BC01", caseType: "BUSINESS_CONFLICT", title: "\u72B6\u6001\u673A\u51B2\u7A81\u751F\u6210\u5F85\u786E\u8BA4\u95EE\u9898", input: { questionId: "Q_CONFLICT_STATUS" }, expectedResult: { exists: true }, actualResult: {}, pass: false, remark: "\u77E5\u8BC6\u4E0D\u8DB3/\u8BED\u4E49\u51B2\u7A81" },
  { caseId: "BC02", caseType: "BUSINESS_CONFLICT", title: "\u91D1\u989D\u7CBE\u5EA6\u51B2\u7A81\u751F\u6210\u5F85\u786E\u8BA4\u95EE\u9898", input: { questionId: "Q_CONFLICT_AMT" }, expectedResult: { exists: true }, actualResult: {}, pass: false, remark: "AI \u65E0\u6CD5\u786E\u5B9A\uFF0C\u9700\u5185\u90E8\u786E\u8BA4" },
  { caseId: "BC03", caseType: "BUSINESS_CONFLICT", title: "\u5B57\u6BB5\u7F3A\u5931\u751F\u6210\u5F85\u786E\u8BA4\u95EE\u9898", input: { questionId: "Q_CONFLICT_CHANNEL" }, expectedResult: { exists: true }, actualResult: {}, pass: false, remark: "\u6211\u65B9\u80FD\u529B\u7F3A\u5931" },
  // ---------- DEMO_VALIDATION ----------
  { caseId: "DV01", caseType: "DEMO_VALIDATION", title: "Demo \u5FC5\u586B\u5B57\u6BB5\u7F3A\u5931", input: { issueType: "MISSING_REQUIRED", expected: 1 }, expectedResult: { count: 1 }, actualResult: {}, pass: false, remark: "\u6570\u636E\u7F3A\u5931" },
  { caseId: "DV02", caseType: "DEMO_VALIDATION", title: "Demo \u672A\u5B9A\u4E49\u679A\u4E3E", input: { issueType: "UNDEFINED_ENUM", expected: 1 }, expectedResult: { count: 1 }, actualResult: {}, pass: false, remark: "\u683C\u5F0F\u9519\u8BEF/\u8D8A\u754C" },
  { caseId: "DV03", caseType: "DEMO_VALIDATION", title: "Demo \u6821\u9A8C\u95EE\u9898\u603B\u6570", input: { expected: 4 }, expectedResult: { count: 4 }, actualResult: {}, pass: false, remark: "\u8FB9\u754C\u60C5\u51B5" },
  // ---------- QUESTION_GENERATION ----------
  { caseId: "QG01", caseType: "QUESTION_GENERATION", title: "\u751F\u6210\u5F85\u786E\u8BA4\u95EE\u9898\u6570\u91CF", input: { expectedMin: 8 }, expectedResult: { min: 8 }, actualResult: {}, pass: false, remark: "\u6B63\u5E38\u60C5\u51B5" },
  { caseId: "QG02", caseType: "QUESTION_GENERATION", title: "\u751F\u6210\u5904\u7406\u4E2D\u6001\u5B8C\u6210\u65F6\u95F4\u51B2\u7A81\u95EE\u9898", input: { questionId: "Q_DEMO_FINISH" }, expectedResult: { exists: true }, actualResult: {}, pass: false, remark: "\u6587\u6863\u4E0E Demo \u77DB\u76FE" },
  // ---------- CASE_VALIDATION（案例四维度校验，对应真实工作流） ----------
  { caseId: "CV01", caseType: "CASE_VALIDATION", title: "\u6848\u4F8B\u7ED3\u6784\u6821\u9A8C\u4E00\u81F4\uFF08\u6848\u4F8B1 vs \u8D26\u52A1\u6587\u4EF6\u6587\u6863\uFF09", input: { caseName: "\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u6848\u4F8B1", check: "structure" }, expectedResult: { consistent: true }, actualResult: {}, pass: false, remark: "\u4EE5\u8D26\u52A1\u6587\u4EF6\u6587\u6863\u4E3A\u51C6" },
  { caseId: "CV02", caseType: "CASE_VALIDATION", title: "\u6848\u4F8B1 vs \u65E7\u7248\u53C2\u8003\u65B0\u589E Sheet \u6570\u91CF", input: { caseName: "\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u6848\u4F8B1", check: "addedSheets" }, expectedResult: { count: 8 }, actualResult: {}, pass: false, remark: "CUS/CUSCREDIT/QUOTAADJUST/FEEADJUST/CUSCHANGE/COMFLOW/REPAYMENTFLOW/CASHFLOW" },
  { caseId: "CV03", caseType: "CASE_VALIDATION", title: "\u6848\u4F8B1 \u91D1\u989D\u7CBE\u5EA6 2\u21924 \u4F4D\u53D8\u5316\u88AB\u8BC6\u522B", input: { caseName: "\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u6848\u4F8B1", check: "precision" }, expectedResult: { changedSheets: ["LOAN", "PLAN", "FLOW", "QUOTAFEE"] }, actualResult: {}, pass: false, remark: "\u8FB9\u754C/\u683C\u5F0F\u53D8\u5316" },
  { caseId: "CV04", caseType: "CASE_VALIDATION", title: "\u6848\u4F8B4 \u672A\u51FA\u8D44\u9000\u6B3E\u65E0\u8FD8\u6B3E\u6D41\u6C34\uFF08\u573A\u666F\u81EA\u6D3D\uFF09", input: { caseName: "\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u6848\u4F8B4", check: "refundNoFlow" }, expectedResult: { ok: true }, actualResult: {}, pass: false, remark: "\u4E0D\u8BE5\u6709\u7684\u6570\u636E\u4E0D\u80FD\u6709" },
  { caseId: "CV05", caseType: "CASE_VALIDATION", title: "\u6848\u4F8B1 \u4E1A\u52A1\u573A\u666F\u65F6\u95F4\u7EBF\u81EA\u6D3D", input: { caseName: "\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u6848\u4F8B1", check: "timeline" }, expectedResult: { timelineOk: true }, actualResult: {}, pass: false, remark: "\u653E\u6B3E/\u8FD8\u6B3E/\u7ED3\u6E05\u81EA\u6D3D" },
  { caseId: "CV06", caseType: "CASE_VALIDATION", title: "\u5386\u53F2\u6CE8\u610F\u70B910\uFF08\u8FDD\u7EA6\u91D1\u5165\u7F5A\u606F\uFF09\u9A8C\u8BC1\u7ED3\u679C", input: { seq: 10, check: "rule" }, expectedResult: { result: "fail" }, actualResult: {}, pass: false, remark: "\u903E\u671F\u7F5A\u606F\u5355\u5217\uFF0C\u672A\u5E76\u5165\u7F5A\u606F\u5217" },
  { caseId: "CV07", caseType: "CASE_VALIDATION", title: "\u8DE8\u4EA7\u54C1\u7EBF\u7C7B\u6BD4\uFF1A\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u4E13\u7528\u5B57\u6BB5\u5F71\u54CD\u8BC4\u4F30\u4E3A\u4F4E\u98CE\u9669", input: { caseName: "\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u6848\u4F8B1", check: "crossRisk" }, expectedResult: { risk: "low" }, actualResult: {}, pass: false, remark: "\u4E0D\u5F71\u54CD\u5176\u4ED6\u4EA7\u54C1\u7EBF" },
  { caseId: "CV08", caseType: "CASE_VALIDATION", title: "\u6848\u4F8B5 \u8FD8\u6B3E\u4E2D\u72B6\u6001\u4F59\u989D > 0\uFF08\u975E\u7EC8\u6001\u573A\u666F\uFF09", input: { caseName: "\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u6848\u4F8B5", check: "inProgressBalance" }, expectedResult: { balanceGt0: true }, actualResult: {}, pass: false, remark: "\u5C55\u793A\u4F59\u989D\u672A\u7ED3\u6E05\u7684\u8FD8\u6B3E\u4E2D\u72B6\u6001" },
  { caseId: "CV09", caseType: "CASE_VALIDATION", title: "\u6848\u4F8B6 \u91CD\u7EC4\u6539\u5206\u671F\u65E0\u7F5A\u606F\u4E14\u65F6\u95F4\u7EBF\u81EA\u6D3D", input: { caseName: "\u793A\u4F8B\u5206\u671F\u4EA7\u54C1\u6848\u4F8B6", check: "replanNoPenalty" }, expectedResult: { timelineOk: true, noPenalty: true }, actualResult: {}, pass: false, remark: "\u533A\u522B\u4E8E\u6848\u4F8B3 \u7684\u91CD\u7EC4+\u903E\u671F\u7F5A\u606F" }
];

// src/lib/evaluation/metrics.ts
var dataset = {
  oldFields: externalV1,
  newFields: externalV2,
  internalFields,
  demoRaw: csvDemoRaw,
  renameMap,
  history: historyItems
};
async function runGoldenCases() {
  const diffs = diffFields({ oldFields: dataset.oldFields, newFields: dataset.newFields, renameMap: dataset.renameMap });
  const mappings = buildMappings(dataset.newFields, dataset.internalFields);
  const { issues } = validateDemo(dataset.demoRaw, dataset.newFields);
  const analysis = await mockProvider.analyze(dataset);
  const caseAnalysis = runCaseAnalysis({
    cases: caseFiles,
    templates: accountTemplates,
    reference: referenceCase,
    rules: bizRules
  });
  const diffByType = {};
  diffs.forEach((d) => d.diffType.forEach((t) => diffByType[t] = (diffByType[t] || 0) + 1));
  return goldenCases.map((c) => {
    const out = { ...c, actualResult: {}, pass: false };
    const inp = c.input;
    try {
      switch (c.caseType) {
        case "FIELD_EXTRACTION": {
          let count = 0;
          if (inp.kind === "csv") count = parseCsvRaw(dataset.demoRaw).headers.length;
          else if (inp.kind === "spec") count = dataset.newFields.length;
          else if (inp.kind === "json") count = JSON.parse(inp.text).length;
          out.actualResult = { count };
          out.pass = count === inp.expectedCount;
          break;
        }
        case "DIFF_DETECTION": {
          const count = inp.metric === "total" ? diffs.length : diffByType[inp.metric] || 0;
          out.actualResult = { count };
          out.pass = count === inp.expected;
          break;
        }
        case "FIELD_MAPPING": {
          const m = mappings.find((x) => x.externalField === inp.field);
          out.actualResult = { mappingStatus: m?.mappingStatus ?? "NOT_FOUND" };
          out.pass = !!m && m.mappingStatus === inp.expectedStatus;
          break;
        }
        case "BUSINESS_CONFLICT": {
          const exists = analysis.questions.some((q3) => q3.qid === inp.questionId);
          out.actualResult = { exists };
          out.pass = exists === inp.expectedResult.exists;
          break;
        }
        case "DEMO_VALIDATION": {
          const count = inp.issueType ? issues.filter((i) => i.issueType === inp.issueType).length : issues.length;
          out.actualResult = { count };
          out.pass = count === inp.expected;
          break;
        }
        case "QUESTION_GENERATION": {
          if (inp.questionId) {
            const exists = analysis.questions.some((q3) => q3.qid === inp.questionId);
            out.actualResult = { exists };
            out.pass = exists === inp.expectedResult.exists;
          } else {
            const count = analysis.questions.length;
            out.actualResult = { count };
            out.pass = count >= inp.expectedMin;
          }
          break;
        }
        case "CASE_VALIDATION": {
          const ca = caseAnalysis;
          let pass = false;
          const act = {};
          if (inp.check === "structure") {
            const sc = ca.structureChecks.find((s) => s.caseName === inp.caseName);
            const consistent = !!sc && sc.missingSheets.length === 0 && sc.extraSheets.length === 0 && sc.headerMismatch.length === 0;
            act.consistent = consistent;
            pass = consistent === (c.expectedResult?.consistent ?? true);
          } else if (inp.check === "addedSheets") {
            const v = ca.versionDiffs.find((x) => x.caseName === inp.caseName);
            act.count = v?.addedSheets.length ?? 0;
            pass = (v?.addedSheets.length ?? 0) === c.expectedResult.count;
          } else if (inp.check === "precision") {
            const v = ca.versionDiffs.find((x) => x.caseName === inp.caseName);
            const sheets = (v?.changedSheets ?? []).filter((cs) => cs.changes.some((ch) => /精度/.test(ch))).map((cs) => cs.sheet).sort();
            act.changedSheets = sheets;
            const exp = c.expectedResult.changedSheets.slice().sort();
            pass = JSON.stringify(sheets) === JSON.stringify(exp);
          } else if (inp.check === "refundNoFlow") {
            const s = ca.sceneAnalyses.find((x) => x.caseName === inp.caseName);
            const f2 = s?.findings.find((ff) => ff.point.includes("\u9000\u6B3E"));
            act.ok = f2?.ok ?? false;
            pass = (f2?.ok ?? false) === (c.expectedResult.ok ?? true);
          } else if (inp.check === "timeline") {
            const s = ca.sceneAnalyses.find((x) => x.caseName === inp.caseName);
            act.timelineOk = s?.timelineOk;
            pass = (s?.timelineOk ?? false) === (c.expectedResult.timelineOk ?? true);
          } else if (inp.check === "rule") {
            const r = ca.ruleValidations.find((x) => x.seq === inp.seq);
            act.result = r?.result;
            pass = r?.result === c.expectedResult.result;
          } else if (inp.check === "crossRisk") {
            const cp = ca.crossProducts.find((x) => x.caseName === inp.caseName);
            act.risk = cp?.risk;
            pass = cp?.risk === c.expectedResult.risk;
          } else if (inp.check === "inProgressBalance") {
            const cf = caseFiles.find((x) => x.fileName === inp.caseName);
            const loanRow = cf?.sheets.find((s) => s.sheetName === "LOAN")?.rows[0];
            const bal = loanRow ? Number(loanRow[6]) : 0;
            act.balance = bal;
            pass = bal > 0;
          } else if (inp.check === "replanNoPenalty") {
            const s = ca.sceneAnalyses.find((x) => x.caseName === inp.caseName);
            const cf = caseFiles.find((x) => x.fileName === inp.caseName);
            const hasPen = (cf?.sheets.find((sh) => sh.sheetName === "FLOW")?.rows ?? []).some((r) => r[2] === "03" && Number(r[5]) > 0);
            act.timelineOk = s?.timelineOk;
            act.hasPenalty = hasPen;
            pass = (s?.timelineOk ?? false) === true && hasPen === false;
          }
          out.actualResult = act;
          out.pass = pass;
          break;
        }
      }
    } catch (e) {
      out.actualResult = { error: String(e) };
      out.pass = false;
    }
    return out;
  });
}

// _golden.ts
(async () => {
  const cases = await runGoldenCases();
  const cv = cases.filter((c) => c.caseType === "CASE_VALIDATION");
  const failed = cv.filter((c) => !c.pass);
  console.log("CASE_VALIDATION total=", cv.length, "pass=", cv.length - failed.length, "fail=", failed.length);
  if (failed.length) {
    console.log("FAILED:", JSON.stringify(failed.map((f2) => ({ id: f2.caseId, title: f2.title, act: f2.actualResult })), null, 2));
    process.exit(1);
  } else {
    console.log("ALL CV PASS");
  }
  cv.forEach((c) => console.log(c.caseId, JSON.stringify(c.actualResult)));
})();
