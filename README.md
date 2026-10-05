# 金融资产接入与账务适配 Copilot

一个面向金融资产接入场景的作品集 Demo，用于演示账务资料管理、字段差异识别、系统映射建议、交付数据比对、案例校验和报告输出。

## 功能

- 资料管理与本地文件解析
- V1/V2 账务字段差异识别
- 外部字段与内部字段映射建议
- 交付目录级比对与案例场景归因
- 结构、版本、业务场景和历史规则校验
- 待确认问题与分析报告输出
- Golden Case 评测中心

## 技术栈

React 18、TypeScript、Vite、Tailwind CSS、Zustand、SheetJS 和 Mammoth。

## 本地运行

```bash
npm ci
npm run dev
```


## 验证

```bash
npm run privacy:check
npm run build
node _cvtest.mjs
node _golden.mjs
```

## 数据与隐私

项目内置数据均为虚构示例：姓名使用「客户甲/乙」类占位符，证件号、手机号和银行卡号均已遮罩，业务标识使用 `DEMO-*` 前缀。用户上传的文件仅在当前页面内存中处理，不写入浏览器持久化存储。

AI 分析为规则引擎与确定性叙事生成的模拟效果，未调用真实大模型 API。
