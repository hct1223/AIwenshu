/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Company, GroupData } from '../types';
import { COMP_MOCK_LIST, CONTRACTS_SUMMARY } from '../data/mockData';
import { 
  TrendingUp, 
  Layers, 
  Briefcase, 
  Users, 
  Building, 
  ArrowRight, 
  Activity, 
  ExternalLink,
  Check,
  Plus,
  Trash2,
  Lock,
  ChevronRight
} from 'lucide-react';

interface DashboardProps {
  onNavigateToCompany: (id: string) => void;
  onNavigateToGroup: (id: string) => void;
  onNavigateToTab: (tabId: string) => void;
}

export default function DashboardModule({ 
  onNavigateToCompany, 
  onNavigateToGroup, 
  onNavigateToTab 
}: DashboardProps) {
  // Enterprise comparison state
  const [selectedComparisons, setSelectedComparisons] = useState<string[]>(['comp-huawei-tech', 'comp-zte']);
  const [compSelectorOpen, setCompSelectorOpen] = useState(false);
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Line Trend data (12 months overview of contract amounts in 10k yuan unit)
  const trendData = [
    { month: '1月', val2023: 540, val2024: 680 },
    { month: '2月', val2023: 420, val2024: 510 },
    { month: '3月', val2023: 680, val2024: 820 },
    { month: '4月', val2023: 790, val2024: 950 },
    { month: '5月', val2023: 920, val2024: 1220 },
    { month: '6月', val2023: 1100, val2024: 1350 },
    { month: '7月', val2023: 850, val2024: 1020 },
    { month: '8月', val2023: 940, val2024: 1180 },
    { month: '9月', val2023: 1250, val2024: 1490 },
    { month: '10月', val2023: 1050, val2024: 1310 },
    { month: '11月', val2023: 1180, val2024: 1450 },
    { month: '12月', val2023: 1390, val2024: 1720 }
  ];

  // Category values comparison
  const categoryData = [
    { name: '元器件检测', val2022: 45.4, val2023: 58.2 },
    { name: '认证与合规', val2022: 21.0, val2023: 28.5 },
    { name: '精密计量校准', val2022: 15.4, val2023: 20.8 },
    { name: '软硬件数字化开发', val2022: 18.9, val2023: 25.1 },
    { name: 'TSQ职业技能评估', val2022: 8.9, val2023: 11.4 }
  ];

  const handleToggleComparison = (id: string) => {
    if (selectedComparisons.includes(id)) {
      setSelectedComparisons(prev => prev.filter(item => item !== id));
    } else {
      if (selectedComparisons.length >= 4) {
        alert('为了保证对比图表的易读性，最多同时对比 4 家企业');
        return;
      }
      setSelectedComparisons(prev => [...prev, id]);
    }
  };

  const currentComparingCompanies = COMP_MOCK_LIST.filter(c => selectedComparisons.includes(c.id));

  return (
    <div className="space-y-6">
      {/* Dynamic Header Badge Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
            赛宝智能决策舱 · 运营大盘研判
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            工业和信息化部电子第五研究所（赛宝实验室）面向行业主力企业的合作数据、合同履约及业务大盘管理门户
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 border border-emerald-100 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            全区数据实时贯通
          </span>
          <button 
            id="btn-goto-ai"
            onClick={() => onNavigateToTab('aiQuery')} 
            className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-indigo-700 transition"
          >
            AI 智能问数对话
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* KPI Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div id="kpi-card-1" className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs hover:border-indigo-100 transition duration-300">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">赛宝年度累计签约额</span>
            <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
              <TrendingUp className="h-3 w-3" />
              {CONTRACTS_SUMMARY.comparisonYoY}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-semibold tracking-tight text-slate-900">
              {CONTRACTS_SUMMARY.totalAmountBillions}
            </span>
            <span className="text-xs text-slate-400">亿元</span>
          </div>
          <div className="mt-1.5 text-xs text-slate-400">
            同比上年同期增加 <span className="font-mono text-slate-600 font-medium">￥2.26 亿</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div id="kpi-card-2" className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs hover:border-indigo-100 transition duration-300">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">已开票资金回笼额</span>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-sm">
              回收率 25.8%
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-semibold tracking-tight text-indigo-700">
              {CONTRACTS_SUMMARY.billingCompletedBillions}
            </span>
            <span className="text-xs text-slate-400">亿元</span>
          </div>
          <div className="mt-1.5 text-xs text-slate-400">
            待到账及中后期批开票额 <span className="font-mono text-indigo-600 font-medium">￥22.5 亿</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div id="kpi-card-3" className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs hover:border-indigo-100 transition duration-300">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 font-sans">关键合作大型企业集团</span>
            <Building className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-semibold tracking-tight text-slate-900">
              {COMP_MOCK_LIST.length}
            </span>
            <span className="text-xs text-slate-400 font-sans">家主力实体</span>
          </div>
          <div className="mt-1.5 text-xs text-slate-400">
            关联子机构及研究机构达 <span className="font-mono text-slate-600 font-medium">206+</span> 家
          </div>
        </div>

        {/* KPI 4 */}
        <div id="kpi-card-4" className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs hover:border-indigo-100 transition duration-300 bg-gradient-to-br from-indigo-50/20 via-white to-indigo-50/10">
          <div className="flex items-center justify-between animate-pulse">
            <span className="text-sm font-medium text-indigo-900">AI 预研大区机会契合度</span>
            <Activity className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-semibold tracking-tight text-slate-900">
              96.8
            </span>
            <span className="text-xs text-indigo-600 font-medium">高评分区</span>
          </div>
          <div className="mt-1.5 text-xs text-slate-500">
            推荐下一季重心：<span className="font-medium text-indigo-700">华南车规芯片</span> 与 <span className="font-medium text-indigo-700">低空航电</span>
          </div>
        </div>
      </div>

      {/* Intelligent Executive Summary Banner */}
      <div id="intelligence-brief-banner" className="bg-slate-900 text-slate-100 rounded-xl p-5 relative overflow-hidden shadow-md">
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
          <Layers className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex rounded-full bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-0.5 border border-indigo-500/30">
              AI 大模型深度研判
            </span>
            <span className="text-slate-400 text-xs">2026年最新批分析反馈</span>
          </div>
          <p className="mt-3 text-slate-200 text-sm leading-relaxed antialiased">
            {CONTRACTS_SUMMARY.smartBrief}
          </p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart A: 合同周期金额趋势 (2023 vs 2024) - SVG Interactive */}
        <div id="chart-card-trend" className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">合同金额月度趋势对比 (万元)</h3>
              <p className="text-xs text-slate-400">横向对比 2023 年与 2024 年同周期签约金额流转</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-300"></span>
                2023 周期
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                2024 周期
              </span>
            </div>
          </div>

          {/* Clean Custom SVG Line Chart */}
          <div className="relative h-60 w-full mt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 240">
              {/* Grid Lines */}
              {[0, 60, 120, 180, 240].map((y, i) => (
                <line 
                  key={i} 
                  x1="40" 
                  y1={y} 
                  x2="680" 
                  y2={y} 
                  stroke="#f1f5f9" 
                  strokeWidth="1" 
                />
              ))}

              {/* Grid Y Axis Labels */}
              <text x="5" y="10" className="text-[10px] font-mono fill-slate-400">1800万</text>
              <text x="5" y="70" className="text-[10px] font-mono fill-slate-400">1350万</text>
              <text x="5" y="130" className="text-[10px] font-mono fill-slate-400">900万</text>
              <text x="5" y="190" className="text-[10px] font-mono fill-slate-400">450万</text>
              <text x="5" y="240" className="text-[10px] font-mono fill-slate-400">0万</text>

              {/* Generate SVG Path coordinates for 2023 and 2024 */}
              {/* X spacing: step is (680 - 40) / 11 = 58.18 */}
              {(() => {
                const getCoords = (yearKey: 'val2023' | 'val2024') => {
                  return trendData.map((d, index) => {
                    const x = 40 + index * 58.18;
                    // Max value of charts is 1800
                    const y = 240 - (d[yearKey] / 1800) * 240;
                    return { x, y, value: d[yearKey], ...d };
                  });
                };
                
                const c2023 = getCoords('val2023');
                const c2024 = getCoords('val2024');

                const path2023Str = c2023.reduce((acc, coord, i) => 
                  acc + `${i === 0 ? 'M' : 'L'} ${coord.x} ${coord.y}`, '');
                const path2024Str = c2024.reduce((acc, coord, i) => 
                  acc + `${i === 0 ? 'M' : 'L'} ${coord.x} ${coord.y}`, '');

                return (
                  <>
                    {/* Shadow Area for 2024 */}
                    <path 
                      d={`${path2024Str} L 680 240 L 40 240 Z`}
                      fill="url(#indigo-gradient-light)"
                      opacity="0.2"
                    />

                    {/* Gradient Definition */}
                    <defs>
                      <linearGradient id="indigo-gradient-light" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f46e5" />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Lines */}
                    <path 
                      d={path2023Str} 
                      fill="none" 
                      stroke="#cbd5e1" 
                      strokeWidth="2" 
                      strokeDasharray="4"
                    />
                    <path 
                      d={path2024Str} 
                      fill="none" 
                      stroke="#4f46e5" 
                      strokeWidth="3" 
                    />

                    {/* Interactive overlay points */}
                    {c2024.map((pt, i) => (
                      <g 
                        key={i} 
                        onMouseEnter={() => setHoveredTrendIndex(i)}
                        onMouseLeave={() => setHoveredTrendIndex(null)}
                        className="cursor-pointer"
                      >
                        {/* Interactive vertical hover indicator line */}
                        {hoveredTrendIndex === i && (
                          <line 
                            x1={pt.x} 
                            y1="0" 
                            x2={pt.x} 
                            y2="240" 
                            stroke="#818cf8" 
                            strokeWidth="1" 
                            strokeDasharray="2"
                          />
                        )}

                        {/* Anchor points */}
                        <circle cx={pt.x} cy={pt.y} r="5" fill="#4f46e5" stroke="white" strokeWidth="2" />
                        <circle cx={pt.x} cy={c2023[i].y} r="4" fill="#94a3b8" stroke="white" strokeWidth="1.5" />
                      </g>
                    ))}
                  </>
                );
              })()}

              {/* Month Titles */}
              {trendData.map((d, i) => (
                <text 
                  key={i} 
                  x={40 + i * 58.18} 
                  y="255" 
                  textAnchor="middle" 
                  className="text-[10px] fill-slate-400 font-sans"
                >
                  {d.month}
                </text>
              ))}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredTrendIndex !== null && (
              <div 
                className="absolute bg-slate-950/95 text-white p-2.5 rounded shadow-lg text-xs font-sans z-30 pointer-events-none"
                style={{
                  left: `${(hoveredTrendIndex / 11) * 82 + 5}%`,
                  top: '10px'
                }}
              >
                <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1 mb-1.5">
                  {trendData[hoveredTrendIndex].month} 数据对标
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">2024年 (今):</span>
                  <span className="font-mono text-indigo-300 font-bold">
                    ￥{trendData[hoveredTrendIndex].val2024} 万元
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">2023年 (昨):</span>
                  <span className="font-mono text-slate-300">
                    ￥{trendData[hoveredTrendIndex].val2023} 万元
                  </span>
                </div>
                <div className="mt-1 text-[10px] text-emerald-400">
                  同比增长 +{((trendData[hoveredTrendIndex].val2024 - trendData[hoveredTrendIndex].val2023) / trendData[hoveredTrendIndex].val2023 * 100).toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chart B: 业务营收分布同比 (Bar Chart) */}
        <div id="chart-card-distribution" className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">业务科目营收分布 (亿元)</h3>
              <p className="text-xs text-slate-400">各年度主力测试校准认证业务累计占比</p>
            </div>
          </div>

          <div className="space-y-4">
            {categoryData.map((cat, index) => {
              const maxVal = 60; // scale limit
              const percent2022 = (cat.val2022 / maxVal) * 100;
              const percent2023 = (cat.val2023 / maxVal) * 100;

              return (
                <div 
                  key={index}
                  className="group space-y-1"
                  onMouseEnter={() => setHoveredBarIndex(index)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                >
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-medium text-slate-800">{cat.name}</span>
                    <span className="font-mono text-slate-400">
                      今 <span className="text-indigo-600 font-bold font-mono">{cat.val2023}</span> / 昨 <span className="font-mono">{cat.val2022}</span> 亿
                    </span>
                  </div>

                  <div className="space-y-1 bg-slate-50 rounded-sm p-1.5 border border-slate-100/50">
                    {/* 2023 Bar */}
                    <div className="w-full bg-slate-200/50 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${percent2023}%` }}
                      />
                    </div>
                    {/* 2022 Bar */}
                    <div className="w-full bg-slate-200/50 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-slate-400 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${percent2022}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-3 rounded-lg border border-dashed border-slate-100 bg-slate-50 text-xs text-slate-500">
            赛宝实验室 “元器件检测与失效筛分” 仍是绝对主导业务，但受新型智造影响，“软硬件数字化开发和车规测试” 年增长高达 <span className="font-bold text-slate-700">32.8%</span>。
          </div>
        </div>
      </div>

      {/* Cooperation Ranking / Activity list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table Column - 2/3 width */}
        <div id="section-enterprise-list" className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">赛宝核心合作伙伴往来总览</h3>
              <p className="text-xs text-slate-400">最近汇总签约数据及对接活跃情况评估，支持快速导向深层画像</p>
            </div>
            <button 
              onClick={() => onNavigateToTab('enterpriseSearch')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              高级多维筛选
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-medium text-slate-400 uppercase">
                  <th className="py-2.5 px-3">企业机构</th>
                  <th className="py-2.5 px-3">合作层级</th>
                  <th className="py-2.5 px-3">智能评分</th>
                  <th className="py-2.5 px-3">合作深度</th>
                  <th className="py-2.5 px-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {COMP_MOCK_LIST.map((comp) => {
                  const currentYearTotal = comp.metrics[1] 
                    ? Object.values(comp.metrics[1]).slice(1).reduce((a, b) => (a as number) + (b as number), 0) as number
                    : 0;

                  return (
                    <tr key={comp.id} className="hover:bg-slate-50/50 transition duration-150">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={comp.logo} 
                            alt={comp.name} 
                            className="h-7 w-7 rounded-sm border border-slate-100 object-contain p-0.5"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-semibold text-slate-800">{comp.name}</div>
                            <div className="text-[10px] text-slate-400">{comp.type} | {comp.industry}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium leading-4 ${
                          comp.partnershipLevel.includes('战略') 
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {comp.partnershipLevel}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-8 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${comp.aiScore}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-slate-700">{comp.aiScore}分</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-mono text-slate-800 font-semibold">
                          ￥{(currentYearTotal / 10).toFixed(1)} <span className="text-[10px] text-slate-400">千万</span>
                        </div>
                        <div className="text-[10px] text-slate-400">2023全年在单</div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            id={`btn-view-portrait-${comp.id}`}
                            onClick={() => onNavigateToCompany(comp.id)}
                            className="inline-flex items-center gap-0.5 rounded px-2 py-1 text-slate-600 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 transition"
                          >
                            <ExternalLink className="h-3 w-3" />
                            深剖画像
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Mini Column - Compare Module Toolkit */}
        <div id="section-comparison-toolkit" className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
              <h3 className="font-semibold text-slate-900 text-sm">企业级对比分析舱</h3>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] px-1.5 py-0.5 font-bold rounded">
                对比池: {selectedComparisons.length}
              </span>
            </div>
            
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              选择多主体在 “AI智能评分”、“在审业务总额”、“财务表现” 等维度的指标进行全景式横向对比，帮助决策层直观理解业务偏好差异。
            </p>

            {/* List of current available options and ticks */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {COMP_MOCK_LIST.map((comp) => {
                const isSelected = selectedComparisons.includes(comp.id);
                return (
                  <div 
                    key={comp.id} 
                    onClick={() => handleToggleComparison(comp.id)}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition ${
                      isSelected 
                        ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900' 
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <span className="font-semibold truncate max-w-[150px]">{comp.name}</span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500 bg-white px-1 py-0.5 rounded border border-slate-100">
                      AI评分 {comp.aiScore}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50">
            {selectedComparisons.length < 2 ? (
              <div className="text-[11px] text-amber-600 bg-amber-50 rounded-lg p-2.5 border border-amber-100 text-center">
                ⚠️ 请至少选择 2 家企业以展示对比对标盘
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-slate-50 rounded-lg p-3 space-y-2 border border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">对标关键指标</div>
                  {currentComparingCompanies.map(c => {
                    return (
                      <div key={c.id} className="flex justify-between items-center text-xs">
                        <span className="text-slate-600 truncate font-medium max-w-[120px]">{c.name}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-slate-400 text-[10px]">信用:{c.complianceRating}</span>
                          <span className="text-indigo-600 font-bold font-sans">{c.aiScore}分</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button 
                  id="btn-trigger-deep-comparison"
                  onClick={() => onNavigateToTab('enterpriseSearch')}
                  className="w-full text-center text-xs bg-indigo-600 hover:bg-indigo-700 font-medium text-white py-1.5 rounded-lg transition shadow-xs"
                >
                  去高级多维筛选 深度探索及对比
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Multi-tier Operational Dept Comparison (协同部室表现) */}
      <div id="section-departments-contributions" className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">赛宝核心涉外部室业务承接对标</h3>
            <p className="text-xs text-slate-400">元器件检测所、可靠性试验中心、低空产业处等重点部门季度在手业务额及比重</p>
          </div>
          <span className="text-xs text-slate-400">数据截至昨日下班时间</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { dept: '元器件检测所', role: '元器件失效筛分、可靠性物理鉴定', amount: '1,240万元', trend: '↑ 14.5%', efficiency: '98.5%', statusColor: 'bg-indigo-500' },
            { dept: '低空产业部', role: '低空物联、无人机飞控系统合格审定', amount: '840万元', trend: '↑ 34.2%', efficiency: '96.2%', statusColor: 'bg-sky-500' },
            { dept: '技术成果推广处', role: '大型央国企、地方百强引进入所对接', amount: '620万元', trend: '↓ 2.1%', efficiency: '94.0%', statusColor: 'bg-emerald-500' },
            { dept: '软件测试与评测中心', role: '安全级软件代码审计、车规算法健壮性', amount: '560万元', trend: '↑ 8.8%', efficiency: '99.1%', statusColor: 'bg-violet-500' }
          ].map((item, i) => (
            <div key={i} className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 hover:border-indigo-100 transition duration-300">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${item.statusColor}`} />
                <span className="font-semibold text-slate-800 text-xs">{item.dept}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{item.role}</p>

              <div className="mt-3.5 flex justify-between items-baseline">
                <div>
                  <span className="font-mono text-lg font-bold text-slate-900">{item.amount}</span>
                  <span className="text-[10px] text-slate-400 ml-1">在库合同</span>
                </div>
                <span className={`text-[10px] font-mono leading-none ${item.trend.includes('↑') ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {item.trend}
                </span>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Q2交付合格率:</span>
                <span className="font-mono text-slate-700 font-bold">{item.efficiency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
