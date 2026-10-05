import { useEffect } from 'react';
import { BrowserRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useProjectStore } from './store/useProjectStore';
import Dashboard from './components/dashboard/Dashboard';
import Documents from './components/documents/Documents';
import FieldTemplate from './components/fieldTemplate/FieldTemplate';
import CaseFiles from './components/caseFiles/CaseFiles';
import DeliveryDiff from './components/deliveryDiff/DeliveryDiff';
import Analysis from './components/analysis/Analysis';
import Questions from './components/questions/Questions';
import Report from './components/report/Report';
import Evaluation from './components/evaluation/Evaluation';
import Guide from './components/guide/Guide';

const NAV = [
  { to: '/', label: '项目首页', en: 'Dashboard' },
  { to: '/documents', label: '资料管理', en: 'Documents' },
  { to: '/field-template', label: '字段模板', en: 'Field Template' },
  { to: '/case-files', label: '案例文件', en: 'Case Files' },
  { to: '/delivery-diff', label: '交付比对', en: 'Delivery Diff' },
  { to: '/analysis', label: '差异与适配分析', en: 'Analysis' },
  { to: '/questions', label: '待确认问题', en: 'Questions' },
  { to: '/report', label: '分析报告', en: 'Report' },
  { to: '/evaluation', label: '评测中心', en: 'Evaluation' },
  { to: '/guide', label: '使用指引', en: 'Guide' },
];

// 仅这些页面依赖 runAnalysis 的产出
const ANALYSIS_PAGES = new Set(['/analysis', '/questions', '/report']);

function NavItems({ horizontal }: { horizontal?: boolean }) {
  return (
    <>
      {NAV.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.to === '/'}
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md text-13 font-medium transition-colors ${
              isActive ? 'bg-ai/10 text-ai' : 'text-sub hover:bg-canvas hover:text-ink'
            } ${horizontal ? 'whitespace-nowrap' : ''}`
          }
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
          <span>{n.label}</span>
        </NavLink>
      ))}
    </>
  );
}

function Layout() {
  const ensureAnalysis = useProjectStore((s) => s.ensureAnalysis);
  const ensureCaseAnalysis = useProjectStore((s) => s.ensureCaseAnalysis);
  const ensureDeliveryDiff = useProjectStore((s) => s.ensureDeliveryDiff);
  const analysis = useProjectStore((s) => s.analysis);
  const caseAnalysis = useProjectStore((s) => s.caseAnalysis);
  const project = useProjectStore((s) => s.project);
  const location = useLocation();

  useEffect(() => {
    ensureAnalysis();
    ensureCaseAnalysis();
    ensureDeliveryDiff();
  }, [ensureAnalysis, ensureCaseAnalysis, ensureDeliveryDiff]);

  const needsAnalysis = ANALYSIS_PAGES.has(location.pathname);

  return (
    <div className="min-h-screen flex bg-canvas">
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-line bg-surface">
        <div className="px-4 py-4 border-b border-line">
          <div className="text-14 font-semibold text-ink">金融资产接入与账务适配</div>
          <div className="text-12 text-ai mt-0.5">Copilot</div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <NavItems />
        </nav>
        <div className="px-4 py-3 border-t border-line text-11 text-sub">
          {project.systemName}
          <div className="mt-1 text-11 text-idle">MVP · 账务文件适配分析</div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-10 bg-surface/90 backdrop-blur border-b border-line">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="lg:hidden text-14 font-semibold text-ink truncate">{project.name}</div>
            <div className="hidden lg:block text-14 font-semibold text-ink truncate">{project.name}</div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-ai/10 text-ai text-11 font-medium">
                模拟 AI 分析模式
              </span>
            </div>
          </div>
          <div className="lg:hidden flex gap-1 px-3 pb-2 overflow-x-auto">
            <NavItems horizontal />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 max-w-[1280px] w-full mx-auto">
          {needsAnalysis && !analysis ? (
            <div className="text-13 text-sub py-20 text-center">正在生成分析（规则引擎 + 模拟 AI）…</div>
          ) : (
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/field-template" element={<FieldTemplate />} />
              <Route path="/case-files" element={<CaseFiles />} />
              <Route path="/delivery-diff" element={<DeliveryDiff />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/questions" element={<Questions />} />
              <Route path="/report" element={<Report />} />
              <Route path="/evaluation" element={<Evaluation />} />
              <Route path="/guide" element={<Guide />} />
            </Routes>
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
