import { readFile, readdir } from 'node:fs/promises';
import { extname, relative } from 'node:path';

const root = new URL('../', import.meta.url);
const roots = ['src', 'docs'];
const rootFiles = ['README.md', '_cvtest.ts', '_golden.ts', '_cvtest.mjs', '_golden.mjs'];
const allowedExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.md', '.html', '.json', '.css']);

const rules = [
  { name: '未遮罩的身份证号', pattern: /\b\d{17}[0-9Xx]\b/g },
  { name: '未遮罩的手机号', pattern: /\b1[3-9]\d{9}\b/g },
  { name: '未遮罩的银行卡号', pattern: /\b(?:62\d{14,17}|[345]\d{15})\b/g },
  { name: '19 位纯数字业务标识', pattern: /\b\d{19}\b/g },
  { name: '本机绝对路径', pattern: /\/Users\/[A-Za-z0-9._-]+\//g },
  {
    name: '旧版示例主体或人名',
    pattern: /(星河|云海消费金融|启明小贷|汇通保理|陈嘉宁|林婉清|黄致远|周慕白|苏明哲|顾清欢|张明|李华|王芳|赵强|孙丽|周涛)/g,
  },
];

async function collect(dirUrl) {
  const entries = await readdir(dirUrl, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const next = new URL(`${entry.name}${entry.isDirectory() ? '/' : ''}`, dirUrl);
    if (entry.isDirectory()) files.push(...await collect(next));
    else if (allowedExtensions.has(extname(entry.name))) files.push(next);
  }
  return files;
}

const files = [
  ...(await Promise.all(roots.map((dir) => collect(new URL(`${dir}/`, root))))).flat(),
  ...rootFiles.map((file) => new URL(file, root)),
];

const findings = [];
for (const file of files) {
  const content = await readFile(file, 'utf8');
  const lines = content.split(/\r?\n/);
  for (const rule of rules) {
    lines.forEach((line, index) => {
      rule.pattern.lastIndex = 0;
      if (rule.pattern.test(line)) {
        findings.push(`${relative(root.pathname, file.pathname)}:${index + 1} [${rule.name}] ${line.trim()}`);
      }
    });
  }
}

if (findings.length) {
  console.error(`脱敏检查失败，共 ${findings.length} 项：`);
  findings.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

console.log(`脱敏检查通过：已扫描 ${files.length} 个源码/文档文件。`);
