import { runGoldenCases } from './src/lib/evaluation/metrics';

(async () => {
  const cases = await runGoldenCases();
  const cv = cases.filter((c) => c.caseType === 'CASE_VALIDATION');
  const failed = cv.filter((c) => !c.pass);
  console.log('CASE_VALIDATION total=', cv.length, 'pass=', cv.length - failed.length, 'fail=', failed.length);
  if (failed.length) {
    console.log('FAILED:', JSON.stringify(failed.map((f) => ({ id: f.caseId, title: f.title, act: f.actualResult })), null, 2));
    process.exit(1);
  } else {
    console.log('ALL CV PASS');
  }
  // 打印每条实际结果，便于核对
  cv.forEach((c) => console.log(c.caseId, JSON.stringify(c.actualResult)));
})();
