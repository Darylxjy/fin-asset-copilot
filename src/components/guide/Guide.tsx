// 使用指引：面向"拿到分享链接的人"（面试官/同事）的 2 分钟导览。
import { Link } from 'react-router-dom';

const PAGES: { to: string; name: string; see: string; verify: string }[] = [
  { to: '/', name: '项目首页', see: '全局概览：已上传资料 / 字段总数 / 高风陌项 / 待确认问题 / 交付案例 / 结构一致性', verify: '数字应与「待确认问题」「分析报告」口径一致' },
  { to: '/documents', name: '资料管理', see: '三类资料上传：账务文件文档、demo（多文件）、参考示例；本地真实文件只读预览', verify: '本地预览支持 .xlsx/.dat/.txt/.csv，按 @!@ 或逗号/制表符自动分列，不进入作品集' },
  { to: '/field-template', name: '字段模板', see: '我方（示例账务系统）字段字典 + 资产方账务字段说明（V1/V2）', verify: 'V1→V2 字段增删与精度变化是后续差异分析的基准' },
  { to: '/case-files', name: '案例文件', see: '6 个交付案例（含场景 sheet + 各账务 sheet），按你真实工作流拆出并填充', verify: '案例5 为"还款中"非终态（余额>0）；案例4 为未出资退款（无还款流水）' },
  { to: '/analysis', name: '差异与适配分析', see: '① 文档字段适配（V1/V2）② 案例四维度校验', verify: '四维度：结构一致性 / 新老版本差异 / 业务场景自洽 / 跨产品线类比 + 历史注意点' },
  { to: '/questions', name: '待确认问题', see: '规则引擎 + 模拟 AI 产出的待人工确认项，支持接受/修改/驳回/待确认', verify: '含案例级问题（如罚息单列、示例分期产品专用字段），走人机协同闭环' },
  { to: '/report', name: '分析报告', see: '可导出 HTML/JSON 的结构化报告，含案例四维度校验结论', verify: '报告与「待确认问题」结论应相互印证' },
  { to: '/evaluation', name: '评测中心', see: '9 类 Golden Case 真实执行结果 + 9 项评测指标', verify: 'CASE_VALIDATION 当前 9/9 通过；指标由真实记录计算，非写死' },
];

const DIMS = [
  { t: '维度一 · 结构校验', d: '以账务文件文档为基准，逐案例核对 12 个 sheet 是否齐全、表头字段是否与模板一致。' },
  { t: '维度二 · 新老版本差异对比', d: '案例1 与新版参考比对，识别新增 Sheet（8 个）、插入式新增列、金额精度 2→4 位等变化。' },
  { t: '维度三 · 业务场景自主分析', d: '把"场景描述"与"实际账务数据"对账：放款/还款/结清自洽、退款无流水、余额=放款−已还本金、逾期罚息合理性。' },
  { t: '维度四 · 跨产品线类比 + 历史注意点', d: '示例分期产品专用字段（如资金划拨对账码）是否影响其他产品线；21 条历史注意点程序化验证。' },
];

export default function Guide() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-xl border border-line bg-surface p-5">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-18 font-semibold text-ink">使用指引 · 2 分钟看懂这个 Demo</h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-ai/10 text-ai text-11 font-medium">模拟 AI 分析（非真实大模型）</span>
        </div>
        <p className="text-13 text-sub mt-2 leading-relaxed">
          这是一款面向<strong className="text-ink">金融资产接入与账务适配</strong>的 Copilot 原型：当资产方（如消费金融机构）接入我方账务系统时，
          自动完成<strong className="text-ink">字段差异识别、映射建议、案例四维度校验、待确认问题收敛</strong>，并输出可评审的报告。
          本页帮你快速知道"点哪里、看什么、验证什么"。
        </p>
      </div>

      {/* 30 秒上手 */}
      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="text-14 font-semibold text-ink mb-3">30 秒快速上手</h2>
        <ol className="space-y-2 text-13 text-sub">
          <li className="flex gap-2"><span className="flex-none w-5 h-5 rounded bg-ai/10 text-ai text-12 flex items-center justify-center">1</span><span>先看 <Link to="/case-files" className="text-ai underline">案例文件</Link>，理解交付案例长什么样（含场景 + 各账务 sheet）。</span></li>
          <li className="flex gap-2"><span className="flex-none w-5 h-5 rounded bg-ai/10 text-ai text-12 flex items-center justify-center">2</span><span>进 <Link to="/analysis" className="text-ai underline">差异与适配分析</Link> → "案例四维度校验"，看结构/差异/场景/跨产品四类结论。</span></li>
          <li className="flex gap-2"><span className="flex-none w-5 h-5 rounded bg-ai/10 text-ai text-12 flex items-center justify-center">3</span><span>看 <Link to="/questions" className="text-ai underline">待确认问题</Link>，体验人机协同（接受/修改/驳回/待确认）。</span></li>
          <li className="flex gap-2"><span className="flex-none w-5 h-5 rounded bg-ai/10 text-ai text-12 flex items-center justify-center">4</span><span>导出 <Link to="/report" className="text-ai underline">分析报告</Link>，或去 <Link to="/evaluation" className="text-ai underline">评测中心</Link> 看 Golden Case 通过率。</span></li>
        </ol>
      </section>

      {/* 页面导览 */}
      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="text-14 font-semibold text-ink mb-3">页面导览（看什么 · 验证什么）</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-12 border-collapse">
            <thead>
              <tr className="text-left text-sub border-b border-line">
                <th className="py-2 pr-3 font-medium w-28">页面</th>
                <th className="py-2 pr-3 font-medium">看什么</th>
                <th className="py-2 font-medium">验证点</th>
              </tr>
            </thead>
            <tbody>
              {PAGES.map((p) => (
                <tr key={p.to} className="border-b border-line/60 align-top">
                  <td className="py-2 pr-3"><Link to={p.to} className="text-ai font-medium whitespace-nowrap">{p.name}</Link></td>
                  <td className="py-2 pr-3 text-ink">{p.see}</td>
                  <td className="py-2 text-sub">{p.verify}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 四维度 */}
      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="text-14 font-semibold text-ink mb-3">案例四维度校验（核心能力）</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {DIMS.map((d) => (
            <div key={d.t} className="rounded-lg border border-line/60 p-3">
              <div className="text-13 font-medium text-ink">{d.t}</div>
              <div className="text-12 text-sub mt-1 leading-relaxed">{d.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 数据与免责 */}
      <section className="rounded-xl border border-amber-300/50 bg-amber-50/40 p-5">
        <h2 className="text-14 font-semibold text-ink mb-2">⚠ 数据与免责声明</h2>
        <ul className="space-y-1 text-12 text-sub leading-relaxed list-disc pl-4">
          <li>本 Demo 全部数据为<strong className="text-ink">虚构脱敏</strong>（主体"示例资产方 A / 示例账务系统"为虚构），<strong className="text-ink">禁止对应任何真实企业、产品或文件</strong>。</li>
          <li>AI 分析为<strong className="text-ink">模拟</strong>（规则引擎 + 确定性叙事），页面已全程标注"模拟 AI 分析（非真实大模型）"，未调用任何真实大模型 API。</li>
          <li>分析引擎使用内置虚构案例以保证<strong className="text-ink">演示确定性</strong>；"资料管理"上传的真实文件仅作只读预览，不反向驱动内置分析。</li>
        </ul>
      </section>
    </div>
  );
}
