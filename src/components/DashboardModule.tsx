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
  ChevronRight,
  DollarSign,
  BarChart3,
  AlertTriangle
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

      {/* KPI Card Grid - 3 Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1: 合同总额 */}
        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-4 border border-indigo-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">合同总额</h4>
              <p className="text-[10px] text-slate-400">年度累计签约总额</p>
            </div>
          </div>
          <div className="text-center my-3">
            <div className="font-mono text-2xl font-bold text-slate-900">
              {CONTRACTS_SUMMARY.totalAmountBillions}
            </div>
            <div className="text-xs text-slate-400 mt-1">亿元</div>
          </div>
          <div className="pt-3 border-t border-indigo-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">同比增长</span>
            <span className="font-mono font-bold text-indigo-600">{CONTRACTS_SUMMARY.comparisonYoY}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-indigo-600">
            <TrendingUp className="h-3 w-3" />
            <span className="font-medium">持续增长</span>
          </div>
        </div>

        {/* KPI 2: 合作客户数 */}
        <div className="bg-gradient-to-br from-sky-50 to-white rounded-xl p-4 border border-sky-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-sky-100 rounded-lg">
              <Users className="h-4 w-4 text-sky-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">合作客户数</h4>
              <p className="text-[10px] text-slate-400">当前在合作客户总数</p>
            </div>
          </div>
          <div className="text-center my-3">
            <div className="font-mono text-2xl font-bold text-slate-900">
              12,678
            </div>
            <div className="text-xs text-slate-400 mt-1">家企业</div>
          </div>
          <div className="pt-3 border-t border-sky-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">同比增长</span>
            <span className="font-mono font-bold text-sky-600">{CONTRACTS_SUMMARY.comparisonYoY}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-sky-600">
            <TrendingUp className="h-3 w-3" />
            <span className="font-medium">持续增长</span>
          </div>
        </div>

        {/* KPI 3: 累计合作客户数 */}
        <div className="bg-gradient-to-br from-rose-50 to-white rounded-xl p-4 border border-rose-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-rose-100 rounded-lg">
              <BarChart3 className="h-4 w-4 text-rose-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">累计合作客户数</h4>
              <p className="text-[10px] text-slate-400">历史累计合作客户总数</p>
            </div>
          </div>
          <div className="text-center my-3">
            <div className="font-mono text-2xl font-bold text-slate-900">
              22,043
            </div>
            <div className="text-xs text-slate-400 mt-1">家企业</div>
          </div>
          <div className="pt-3 border-t border-rose-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">同比增长</span>
            <span className="font-mono font-bold text-rose-600">+8.06%</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-rose-600">
            <TrendingUp className="h-3 w-3" />
            <span className="font-medium">稳定增长</span>
          </div>
        </div>
      </div>

      {/* Customer Statistics Cards */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-indigo-600" />
          <h3 className="font-semibold text-slate-900">客户统计分析</h3>
          <span className="ml-auto text-xs text-slate-400">统计周期：本年度</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: 首次合作金额 */}
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-4 border border-emerald-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">首次合作金额</h4>
                <p className="text-[10px] text-slate-400">本年度新客户合作总额</p>
              </div>
            </div>
            <div className="text-center my-3">
              <div className="font-mono text-2xl font-bold text-emerald-600">
                ¥8,420
              </div>
              <div className="text-xs text-slate-400 mt-1">万元</div>
            </div>
            <div className="pt-3 border-t border-emerald-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">占总额比例</span>
              <span className="font-mono font-bold text-emerald-600">27.8%</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span className="font-medium">同比 +12.5%</span>
            </div>
          </div>

          {/* Card 2: 首次合作客户数量 */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">首次合作客户数</h4>
                <p className="text-[10px] text-slate-400">本年度新签约客户数量</p>
              </div>
            </div>
            <div className="text-center my-3">
              <div className="font-mono text-2xl font-bold text-blue-600">
                156
              </div>
              <div className="text-xs text-slate-400 mt-1">家企业</div>
            </div>
            <div className="pt-3 border-t border-blue-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">客户总数</span>
              <span className="font-mono font-bold text-blue-600">12,678家</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
              <TrendingUp className="h-3 w-3" />
              <span className="font-medium">同比 +8.3%</span>
            </div>
          </div>

          {/* Card 3: 连续两年未签订合同金额客户统计 */}
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-4 border border-amber-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">流失风险客户</h4>
                <p className="text-[10px] text-slate-400">连续两年未签订合同客户</p>
              </div>
            </div>
            <div className="text-center my-3">
              <div className="font-mono text-2xl font-bold text-amber-600">
                42
              </div>
              <div className="text-xs text-slate-400 mt-1">家企业</div>
            </div>
            <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">涉及金额</span>
              <span className="font-mono font-bold text-amber-600">¥2,180万</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
              <Briefcase className="h-3 w-3" />
              <span className="font-medium">需重点关注</span>
            </div>
          </div>
        </div>
      </div>

      {/* New Analysis Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 1: 各区域客户合作金额分析 */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">各区域客户合作金额分析</h3>
              <p className="text-xs text-slate-400 mt-0.5">单位：亿元 | 百分比</p>
            </div>
          </div>

          {/* 区域数据 */}
          <div className="space-y-3">
            {[
              { region: '华东', amount: 28.9, percent: 28.9, color: 'bg-indigo-500' },
              { region: '华南', amount: 34.3, percent: 34.3, color: 'bg-sky-500' },
              { region: '华中', amount: 20.0, percent: 9.5, color: 'bg-emerald-500' },
              { region: '华北', amount: 13.8, percent: 13.8, color: 'bg-cyan-500' },
              { region: '西南', amount: 4.5, percent: 4.5, color: 'bg-blue-600' },
              { region: '西北', amount: 6.3, percent: 6.3, color: 'bg-teal-500' },
              { region: '东北', amount: 2.1, percent: 2.1, color: 'bg-slate-400' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{item.region}</span>
                  <span className="font-mono text-slate-600">
                    {item.amount}亿元 <span className="text-slate-400">({item.percent}%)</span>
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-700`}
                    style={{ width: `${item.percent * 2.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 总计 */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-400">总计合作金额：</span>
            <span className="font-mono text-lg font-bold text-indigo-600 ml-1">109.9亿元</span>
          </div>
        </div>

        {/* Chart 2: 合作客户合同额及客户数量分析 */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">合作客户合同额及客户数量分析</h3>
              <p className="text-xs text-slate-400 mt-0.5">单位：亿元 | 个</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                客户合同总额
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-sky-500" />
                合作客户数量
              </span>
            </div>
          </div>

          {/* 双轴柱状图 */}
          <div className="space-y-3">
            {[
              { range: '10万以下', amount: 12.8, customers: 333 },
              { range: '10-100万', amount: 9.8, customers: 302 },
              { range: '100-500万', amount: 17.8, customers: 232 },
              { range: '500-1000万', amount: 9.8, customers: 91 },
              { range: '1000万以上', amount: 13.6, customers: 73 }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{item.range}</span>
                  <div className="flex gap-3 text-xs">
                    <span className="text-indigo-600">¥{item.amount}亿</span>
                    <span className="text-sky-600">{item.customers}个</span>
                  </div>
                </div>
                <div className="space-y-1 bg-slate-50/50 p-1.5 rounded-md border border-slate-100">
                  {/* 客户合同总额 */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                      style={{ width: `${(item.amount / 20) * 100}%` }}
                    />
                  </div>
                  {/* 合作客户数量 */}
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500 rounded-full transition-all duration-700"
                      style={{ width: `${(item.customers / 400) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 注释 */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 text-center">
              * 横坐标为客户的合作金额区间值
            </p>
          </div>
        </div>

      </div>

      {/* Business Distribution Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 3: 业务类型环形图 */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
            <h3 className="font-semibold text-slate-900 text-sm">业务类型</h3>
          </div>

          <div className="flex items-center gap-6">
            {/* 环形图区域 */}
            <div className="relative w-40 h-40 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* 背景圆环 */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />

                {/* 数据段 - 检验检测 41.35% */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="12"
                  strokeDasharray={`${41.35 * 2.513} 251.3`}
                  strokeDashoffset="0"
                  className="transition-all duration-1000"
                />

                {/* 认证评估 16.35% */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="12"
                  strokeDasharray={`${16.35 * 2.513} 251.3`}
                  strokeDashoffset={`-${41.35 * 2.513}`}
                  className="transition-all duration-1000"
                />

                {/* 计量校准 14.85% */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDasharray={`${14.85 * 2.513} 251.3`}
                  strokeDashoffset={`-${(41.35 + 16.35) * 2.513}`}
                  className="transition-all duration-1000"
                />

                {/* 产品开发 8.85% */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="12"
                  strokeDasharray={`${8.85 * 2.513} 251.3`}
                  strokeDashoffset={`-${(41.35 + 16.35 + 14.85) * 2.513}`}
                  className="transition-all duration-1000"
                />

                {/* TSQ培训 15.85% */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="12"
                  strokeDasharray={`${15.85 * 2.513} 251.3`}
                  strokeDashoffset={`-${(41.35 + 16.35 + 14.85 + 8.85) * 2.513}`}
                  className="transition-all duration-1000"
                />
              </svg>

              {/* 中心文字 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-mono text-lg font-bold text-slate-900">30.31</div>
                <div className="text-[10px] text-slate-400">亿元</div>
              </div>
            </div>

            {/* 图例 */}
            <div className="flex-1 space-y-2">
              {[
                { name: '检验检测', amount: '19.87亿', percent: '41.35%', color: 'bg-indigo-500' },
                { name: '认证、评估', amount: '5.45亿', percent: '16.35%', color: 'bg-sky-500' },
                { name: '计量校准', amount: '4.86亿', percent: '14.85%', color: 'bg-emerald-500' },
                { name: '产品开发与销售', amount: '3.21亿', percent: '8.85%', color: 'bg-orange-500' },
                { name: 'TSQ（含培训）', amount: '5.21亿', percent: '15.85%', color: 'bg-violet-500' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${item.color}`}></span>
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-mono text-slate-700">{item.amount} <span className="text-slate-400">({item.percent})</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 4: 业务归属部门条形图 */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
            <h3 className="font-semibold text-slate-900 text-sm">业务归属部门</h3>
            <div className="flex gap-1.5">
              <button className="text-[10px] px-2 py-1 bg-indigo-600 text-white rounded-md">总占比</button>
              <button className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded-md">目标占比</button>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { name: '元器件与材料板块', amount: 12.5, percent: 25.23 },
              { name: '装备与整机板块', amount: 9.1, percent: 18.25 },
              { name: '软件与系统板块', amount: 8.1, percent: 16.54 },
              { name: '认证中心', amount: 5.1, percent: 10.32 },
              { name: '计量检测中心', amount: 4.6, percent: 9.58 },
              { name: '广五所', amount: 4.5, percent: 9.24 },
              { name: '随春', amount: 4.3, percent: 8.98 }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{item.name}</span>
                  <span className="font-mono text-slate-600">
                    {item.amount}亿 <span className="text-slate-400">({item.percent}%)</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-700"
                    style={{ width: `${(item.amount / 12.5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
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
