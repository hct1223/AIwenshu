/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Download,
  CheckCircle,
  Clock,
  Sparkles,
  Eye,
  ChevronRight,
  ArrowLeft,
  Share2,
  Printer,
  CalendarDays,
  Tag,
  Building2,
  Globe,
  TrendingUp,
  User,
  FileCheck,
  AlertTriangle,
  Target,
  Shield,
  Zap,
  Briefcase,
  Newspaper,
  Award,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Activity,
  Lightbulb,
  Calendar as CalendarIcon,
  PieChart
} from 'lucide-react';
import { MOCK_INTELLIGENCE_REPORTS, MOCK_INTELLIGENCE_ITEMS, INTELLIGENCE_STATS } from '../data/mockIntelligenceData';
import { IntelligenceReport as IReportType, IntelligenceReportType, IntelligenceItem } from '../types';

export default function IntelligenceReportModule() {
  const [selectedType, setSelectedType] = useState<IntelligenceReportType>('daily');
  const [selectedReport, setSelectedReport] = useState<string | null>(MOCK_INTELLIGENCE_REPORTS[0]?.id || null);
  const [showListView, setShowListView] = useState(false);

  // 简报类型配置
  const reportTypes = [
    {
      type: 'daily' as IntelligenceReportType,
      label: '每日快报',
      desc: '每日18:00自动生成，收录当日重要情报',
      icon: Calendar,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
    },
    {
      type: 'weekly' as IntelligenceReportType,
      label: '每周汇总',
      desc: '每周五18:00生成，汇总一周重点情报',
      icon: FileText,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200',
    },
    {
      type: 'monthly' as IntelligenceReportType,
      label: '每月综述',
      desc: '每月末生成，深度分析月度情报趋势',
      icon: Sparkles,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
    },
  ];

  // 按类型过滤简报
  const filteredReports = MOCK_INTELLIGENCE_REPORTS.filter(
    report => report.type === selectedType
  );

  // 获取当前选中的简报
  const currentReport = MOCK_INTELLIGENCE_REPORTS.find(r => r.id === selectedReport);
  const currentReportItems = currentReport ? MOCK_INTELLIGENCE_ITEMS.filter(item =>
    currentReport.selectedItemIds.includes(item.id)
  ) : [];

  // 获取当前选中的类型配置
  const currentTypeConfig = reportTypes.find(config => config.type === selectedType);

  // 切换类型时，选中该类型的第一份简报
  const handleTypeChange = (type: IntelligenceReportType) => {
    setSelectedType(type);
    const firstReport = MOCK_INTELLIGENCE_REPORTS.find(r => r.type === type);
    if (firstReport) {
      setSelectedReport(firstReport.id);
      setShowListView(false);
    }
  };

  // 获取报告状态样式
  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; style: string; icon: any }> = {
      draft: { label: '草稿', style: 'bg-slate-200 text-slate-700', icon: FileText },
      generating: { label: '生成中', style: 'bg-amber-200 text-amber-800', icon: Clock },
      completed: { label: '已完成', style: 'bg-emerald-200 text-emerald-800', icon: CheckCircle },
    };
    return badges[status] || badges.draft;
  };

  // 获取情报类型样式
  const getIntelligenceTypeStyle = (type: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      internal: { bg: 'bg-indigo-50', text: 'text-indigo-700' },
      customer: { bg: 'bg-teal-50', text: 'text-teal-700' },
      policy: { bg: 'bg-blue-50', text: 'text-blue-700' },
      standard: { bg: 'bg-purple-50', text: 'text-purple-700' },
      technology: { bg: 'bg-green-50', text: 'text-green-700' },
      tender: { bg: 'bg-amber-50', text: 'text-amber-700' },
      competitor: { bg: 'bg-red-50', text: 'text-red-700' },
    };
    return styles[type] || { bg: 'bg-slate-50', text: 'text-slate-700' };
  };

  // 获取情报类型标签
  const getIntelligenceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      internal: '所内经营',
      customer: '大客户',
      policy: '政策法规',
      standard: '标准更新',
      technology: '产业技术',
      tender: '招标项目',
      competitor: '竞品动态',
    };
    return labels[type] || type;
  };

  // 获取优先级样式
  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, { label: string; style: string; icon: any }> = {
      urgent: { label: '紧急', style: 'bg-red-500 text-white', icon: AlertTriangle },
      important: { label: '重要', style: 'bg-amber-500 text-white', icon: Target },
      normal: { label: '普通', style: 'bg-slate-200 text-slate-700', icon: FileCheck },
    };
    return badges[priority] || badges.normal;
  };

  // 每日快报图文详情视图
  const DailyReportDetailView = () => {
    if (!currentReport) return null;

    const statusBadge = getStatusBadge(currentReport.status);
    const StatusIcon = statusBadge.icon;

    // 统计各类情报数量
    const stats = {
      internal: currentReportItems.filter(i => i.type === 'internal').length,
      customer: currentReportItems.filter(i => i.type === 'customer').length,
      policy: currentReportItems.filter(i => i.type === 'policy').length,
      standard: currentReportItems.filter(i => i.type === 'standard').length,
      technology: currentReportItems.filter(i => i.type === 'technology').length,
      tender: currentReportItems.filter(i => i.type === 'tender').length,
      competitor: currentReportItems.filter(i => i.type === 'competitor').length,
      urgent: currentReportItems.filter(i => i.priority === 'urgent').length,
      important: currentReportItems.filter(i => i.priority === 'important').length,
      normal: currentReportItems.filter(i => i.priority === 'normal').length,
    };

    // 获取重点情报
    const topItems = currentReportItems.slice(0, 3);

    return (
      <div className="space-y-6">
        {/* 简报头部 */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Newspaper className="h-6 w-6" />
                <h2 className="text-2xl font-bold">{currentReport.title}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.style} flex items-center gap-1.5 bg-white/20`}>
                  <StatusIcon className="h-4 w-4" />
                  {statusBadge.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-blue-100">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  <span>{currentReport.dateRange}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{currentReport.generatedAt}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4" />
                  <span>收录 {currentReport.selectedItemIds.length} 条情报</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                <Download className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                <Printer className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 核心统计 */}
          <div className="grid grid-cols-7 gap-3">
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
              <div className="flex items-center gap-1.5 mb-1 text-blue-100 text-xs">
                <Building2 className="h-3.5 w-3.5" />
                所内经营
              </div>
              <div className="text-2xl font-bold">{stats.internal}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
              <div className="flex items-center gap-1.5 mb-1 text-blue-100 text-xs">
                <User className="h-3.5 w-3.5" />
                大客户
              </div>
              <div className="text-2xl font-bold">{stats.customer}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
              <div className="flex items-center gap-1.5 mb-1 text-blue-100 text-xs">
                <FileText className="h-3.5 w-3.5" />
                政策法规
              </div>
              <div className="text-2xl font-bold">{stats.policy}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
              <div className="flex items-center gap-1.5 mb-1 text-blue-100 text-xs">
                <Award className="h-3.5 w-3.5" />
                标准更新
              </div>
              <div className="text-2xl font-bold">{stats.standard}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
              <div className="flex items-center gap-1.5 mb-1 text-blue-100 text-xs">
                <TrendingUp className="h-3.5 w-3.5" />
                产业技术
              </div>
              <div className="text-2xl font-bold">{stats.technology}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
              <div className="flex items-center gap-1.5 mb-1 text-blue-100 text-xs">
                <Briefcase className="h-3.5 w-3.5" />
                招标项目
              </div>
              <div className="text-2xl font-bold">{stats.tender}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
              <div className="flex items-center gap-1.5 mb-1 text-blue-100 text-xs">
                <Globe className="h-3.5 w-3.5" />
                竞品动态
              </div>
              <div className="text-2xl font-bold">{stats.competitor}</div>
            </div>
          </div>
        </div>

        {/* 优先级分布图表 */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-indigo-600" />
              <h3 className="text-base font-semibold text-slate-900">情报优先级分布</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-slate-700">紧急情报</span>
                  <span className="font-semibold text-red-600">{stats.urgent} 条</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all"
                    style={{ width: `${currentReportItems.length > 0 ? (stats.urgent / currentReportItems.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-slate-700">重要情报</span>
                  <span className="font-semibold text-amber-600">{stats.important} 条</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all"
                    style={{ width: `${currentReportItems.length > 0 ? (stats.important / currentReportItems.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-slate-700">普通情报</span>
                  <span className="font-semibold text-slate-600">{stats.normal} 条</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-slate-400 to-slate-500 rounded-full transition-all"
                    style={{ width: `${currentReportItems.length > 0 ? (stats.normal / currentReportItems.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 业务匹配统计 */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-indigo-600" />
              <h3 className="text-base font-semibold text-slate-900">业务匹配分布</h3>
            </div>
            <div className="space-y-2.5">
              {[
                { name: '军工检测', count: currentReportItems.filter(i => i.businessMatch?.includes('军工检测')).length, color: 'bg-red-500' },
                { name: '计量校准', count: currentReportItems.filter(i => i.businessMatch?.includes('计量校准')).length, color: 'bg-purple-500' },
                { name: '元器件检测', count: currentReportItems.filter(i => i.businessMatch?.includes('元器件检测')).length, color: 'bg-blue-500' },
                { name: '可靠性试验', count: currentReportItems.filter(i => i.businessMatch?.includes('可靠性试验')).length, color: 'bg-green-500' },
              ].map((business) => (
                <div key={business.name} className="flex items-center gap-3">
                  <div className="w-20 text-sm text-slate-700">{business.name}</div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${business.color} rounded-full`}
                      style={{ width: `${currentReportItems.length > 0 ? (business.count / currentReportItems.length) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-sm font-semibold text-slate-700">{business.count}条</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 重点情报摘要 */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-600" />
              <h3 className="text-base font-semibold text-amber-900">重点情报摘要</h3>
            </div>
          </div>
          <div className="p-4">
            <div className="grid md:grid-cols-3 gap-4">
              {topItems.map((item, index) => {
                const typeStyle = getIntelligenceTypeStyle(item.type);
                const priorityBadge = getPriorityBadge(item.priority);
                const PriorityIcon = priorityBadge.icon;

                return (
                  <div key={item.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:shadow-md transition-all">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityBadge.style} flex items-center gap-1`}>
                            <PriorityIcon className="h-3 w-3" />
                            {priorityBadge.label}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs ${typeStyle.bg} ${typeStyle.text}`}>
                            {getIntelligenceTypeLabel(item.type)}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 line-clamp-2">{item.title}</h4>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-2">{item.summary}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{item.source}</span>
                      <span>{item.publishTime.split(' ')[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 今日总结 */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-indigo-900">今日总结</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-indigo-800">
            <div>
              <p className="mb-2">
                <span className="font-semibold">🏢 所内经营：</span>
                今日收录 <span className="font-bold text-indigo-700">{stats.internal}</span> 条所内经营情报，涵盖各部门业务进展、项目状态等经营管理信息。
              </p>
              <p className="mb-2">
                <span className="font-semibold">👥 大客户动态：</span>
                跟踪 <span className="font-bold text-teal-600">{stats.customer}</span> 条大客户情报，包括重点客户需求变化、商机机会等领导关注信息。
              </p>
              <p className="mb-2">
                <span className="font-semibold">⚠️ 紧急关注：</span>
                发现 <span className="font-bold text-red-600">{stats.urgent}</span> 条紧急情报，需要立即处理，特别是工信部发布的新版检测标准规范。
              </p>
              <p>
                <span className="font-semibold">🎯 业务机会：</span>
                发现 <span className="font-bold text-emerald-600">{stats.tender}</span> 个招标项目机会，涉及金额约350万元，建议相关部门重点关注。
              </p>
            </div>
            <div>
              <p className="mb-2">
                <span className="font-semibold">📊 市场趋势：</span>
                今日收录 <span className="font-bold">{stats.policy + stats.standard + stats.technology}</span> 条外部市场情报，政策、标准、技术等动态持续更新。
              </p>
              <p className="mb-2">
                <span className="font-semibold">🔍 竞品动态：</span>
                SGS在华南区布局军工检测业务，可能对本地业务造成影响，建议制定应对策略。
              </p>
              <p>
                <span className="font-semibold">💡 工作建议：</span>
                建议综合部门汇总所内经营数据，业务部门跟进大客户需求，技推处关注新版检测标准，计量校准部门跟进招标项目。
              </p>
            </div>
          </div>
        </div>

        {/* 完整情报列表 */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-600" />
                <h3 className="text-base font-semibold text-slate-900">完整情报列表</h3>
              </div>
              <div className="text-sm text-slate-600">
                共 {currentReportItems.length} 条
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {currentReportItems.map((item, index) => {
              const typeStyle = getIntelligenceTypeStyle(item.type);
              const priorityBadge = getPriorityBadge(item.priority);
              const PriorityIcon = priorityBadge.icon;

              return (
                <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityBadge.style} flex items-center gap-1`}>
                          <PriorityIcon className="h-3 w-3" />
                          {priorityBadge.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${typeStyle.bg} ${typeStyle.text}`}>
                          {getIntelligenceTypeLabel(item.type)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          {item.source}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {item.publishTime}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mb-2">{item.summary}</p>
                      {item.businessMatch && item.businessMatch.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.businessMatch.map((business) => (
                            <span key={business} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs border border-emerald-200">
                              {business}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 每周汇总图文详情视图
  const WeeklyReportDetailView = () => {
    if (!currentReport) return null;

    const statusBadge = getStatusBadge(currentReport.status);
    const StatusIcon = statusBadge.icon;

    // 统计数据
    const stats = {
      internal: currentReportItems.filter(i => i.type === 'internal').length,
      customer: currentReportItems.filter(i => i.type === 'customer').length,
      policy: currentReportItems.filter(i => i.type === 'policy').length,
      standard: currentReportItems.filter(i => i.type === 'standard').length,
      technology: currentReportItems.filter(i => i.type === 'technology').length,
      tender: currentReportItems.filter(i => i.type === 'tender').length,
      competitor: currentReportItems.filter(i => i.type === 'competitor').length,
      urgent: currentReportItems.filter(i => i.priority === 'urgent').length,
      important: currentReportItems.filter(i => i.priority === 'important').length,
    };

    // 模拟对比数据（本周 vs 上周）
    const comparisonData = {
      lastWeek: {
        total: 35,
        urgent: 2,
        important: 8,
      },
      thisWeek: {
        total: currentReportItems.length,
        urgent: stats.urgent,
        important: stats.important,
      }
    };

    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return '+0%';
      const growth = ((current - previous) / previous * 100).toFixed(1);
      return growth.startsWith('-') ? growth : `+${growth}%`;
    };

    return (
      <div className="space-y-6">
        {/* 简报头部 */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-6 w-6" />
                <h2 className="text-2xl font-bold">{currentReport.title}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.style} flex items-center gap-1.5 bg-white/20`}>
                  <StatusIcon className="h-4 w-4" />
                  {statusBadge.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-emerald-100">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  <span>{currentReport.dateRange}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{currentReport.generatedAt}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4" />
                  <span>收录 {currentReport.selectedItemIds.length} 条情报</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                <Download className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                <Printer className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 核心统计 + 对比数据 */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1 text-emerald-100 text-xs">
                  <FileText className="h-3 w-3" />
                  本周总数
                </div>
                <div className={`text-xs font-bold flex items-center gap-0.5 ${
                  comparisonData.thisWeek.total > comparisonData.lastWeek.total ? 'text-emerald-200' : 'text-red-200'
                }`}>
                  {comparisonData.thisWeek.total > comparisonData.lastWeek.total ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {calculateGrowth(comparisonData.thisWeek.total, comparisonData.lastWeek.total)}
                </div>
              </div>
              <div className="text-2xl font-bold">{comparisonData.thisWeek.total}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
              <div className="flex items-center gap-1 mb-1 text-emerald-100 text-xs">
                <Shield className="h-3 w-3" />
                紧急情报
              </div>
              <div className="text-2xl font-bold">{stats.urgent}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
              <div className="flex items-center gap-1 mb-1 text-emerald-100 text-xs">
                <Target className="h-3 w-3" />
                重要情报
              </div>
              <div className="text-2xl font-bold">{stats.important}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
              <div className="flex items-center gap-1 mb-1 text-emerald-100 text-xs">
                <Activity className="h-3 w-3" />
                环比增长
              </div>
              <div className="text-xl font-bold text-emerald-200">
                {calculateGrowth(comparisonData.thisWeek.total, comparisonData.lastWeek.total)}
              </div>
            </div>
          </div>
        </div>

        {/* 分类统计与趋势 */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="h-5 w-5 text-emerald-600" />
              <h3 className="text-base font-semibold text-slate-900">本周情报分类统计</h3>
            </div>
            <div className="space-y-3">
              {[
                { type: '政策法规', count: stats.policy, color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-700' },
                { type: '标准更新', count: stats.standard, color: 'bg-purple-500', lightColor: 'bg-purple-50', textColor: 'text-purple-700' },
                { type: '产业技术', count: stats.technology, color: 'bg-green-500', lightColor: 'bg-green-50', textColor: 'text-green-700' },
                { type: '招标项目', count: stats.tender, color: 'bg-amber-500', lightColor: 'bg-amber-50', textColor: 'text-amber-700' },
                { type: '竞品动态', count: stats.competitor, color: 'bg-red-500', lightColor: 'bg-red-50', textColor: 'text-red-700' },
              ].map((item) => (
                <div key={item.type} className="flex items-center gap-3">
                  <div className="w-20 text-sm text-slate-700">{item.type}</div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${currentReportItems.length > 0 ? (item.count / currentReportItems.length) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-sm font-semibold text-slate-700">{item.count}条</div>
                </div>
              ))}
            </div>
          </div>

          {/* 业务部门表现 */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-emerald-600" />
              <h3 className="text-base font-semibold text-slate-900">各部门本周情报贡献</h3>
            </div>
            <div className="space-y-2.5">
              {[
                { name: '技推处', count: Math.floor(currentReportItems.length * 0.35), change: '+12%', up: true },
                { name: '标准部', count: Math.floor(currentReportItems.length * 0.25), change: '+8%', up: true },
                { name: '军工检测', count: Math.floor(currentReportItems.length * 0.20), change: '-3%', up: false },
                { name: '元器件检测', count: Math.floor(currentReportItems.length * 0.12), change: '+5%', up: true },
                { name: '可靠性试验', count: Math.floor(currentReportItems.length * 0.08), change: '0%', up: true },
              ].map((dept) => (
                <div key={dept.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-sm text-slate-700">{dept.name}</div>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[120px]">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${(dept.count / currentReportItems.length) * 100}%` }}
                      />
                    </div>
                    <div className="w-16 text-right text-sm font-semibold text-slate-700">{dept.count}条</div>
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${dept.up ? 'text-emerald-600' : 'text-red-600'}`}>
                    {dept.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {dept.change}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 本周重点情报 */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-3 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-600" />
              <h3 className="text-base font-semibold text-amber-900">本周重点情报 TOP 5</h3>
            </div>
          </div>
          <div className="p-4">
            <div className="grid md:grid-cols-2 gap-4">
              {currentReportItems.slice(0, 5).map((item, index) => {
                const typeStyle = getIntelligenceTypeStyle(item.type);
                const priorityBadge = getPriorityBadge(item.priority);
                const PriorityIcon = priorityBadge.icon;

                return (
                  <div key={item.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:shadow-md transition-all">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityBadge.style} flex items-center gap-1`}>
                            <PriorityIcon className="h-3 w-3" />
                            {priorityBadge.label}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs ${typeStyle.bg} ${typeStyle.text}`}>
                            {getIntelligenceTypeLabel(item.type)}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-900 line-clamp-2">{item.title}</h4>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 mb-2">{item.summary}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{item.source}</span>
                      <span>{item.publishTime.split(' ')[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 本周工作总结 */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-emerald-900">本周工作总结</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-emerald-800">
            <div>
              <p className="mb-2">
                <span className="font-semibold">📊 情报收录概况：</span>
                本周共收录 <span className="font-bold text-emerald-700">{currentReport.selectedItemIds.length}</span> 条情报，较上周{calculateGrowth(comparisonData.thisWeek.total, comparisonData.lastWeek.total)}。
                其中所内经营 <span className="font-bold">{stats.internal}</span> 条，大客户 <span className="font-bold">{stats.customer}</span> 条，
                政策法规 <span className="font-bold">{stats.policy}</span> 条，标准更新 <span className="font-bold">{stats.standard}</span> 条。
              </p>
              <p className="mb-2">
                <span className="font-semibold">🏢 所内经营：</span>
                本周各业务部门整体运行良好，技推处、计量校准等部门完成重要项目，
                建议继续加强各部门间的信息共享和协同配合。
              </p>
              <p className="mb-2">
                <span className="font-semibold">⚠️ 重点关注：</span>
                本周发现 <span className="font-bold text-red-600">{stats.urgent}</span> 条紧急情报，
                <span className="font-bold text-amber-600">{stats.important}</span> 条重要情报，特别是国标委发布的新版电子设备计量校准规范，
                将对现有业务流程产生重要影响。
              </p>
              <p>
                <span className="font-semibold">💼 业务机会：</span>
                本周发现 <span className="font-bold text-emerald-600">{stats.tender}</span> 个招标机会，
                总预算约 <span className="font-bold">480万元</span>，其中某军区电子装备检测项目金额最大，建议军工检测部门重点跟进。
              </p>
            </div>
            <div>
              <p className="mb-2">
                <span className="font-semibold">👥 大客户动态：</span>
                跟踪到 <span className="font-bold text-teal-600">{stats.customer}</span> 条大客户情报，
                中航工业、中国电科等重点客户有新增检测需求，建议相关部门主动对接。
              </p>
              <p className="mb-2">
                <span className="font-semibold">📈 市场趋势：</span>
                本周竞品动态情报有所增加，SGS、TÜV SÜD等国际机构在华布局加速，
                可能对本地检测认证市场造成影响，建议密切关注并及时调整市场策略。
              </p>
              <p className="mb-2">
                <span className="font-semibold">🎯 部门表现：</span>
                技推处情报贡献最大，标准部紧跟政策法规更新。建议各部门加强情报收集和分析能力，
                提升业务敏锐度。
              </p>
              <p>
                <span className="font-semibold">💡 下周计划：</span>
                建议继续加强标准更新跟踪，重点关注军工检测项目投标，主动对接大客户新需求，分析竞品动态，
                提前布局下半年业务重点。
              </p>
            </div>
          </div>
        </div>

        {/* 完整情报列表 */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-600" />
                <h3 className="text-base font-semibold text-slate-900">完整情报列表</h3>
              </div>
              <div className="text-sm text-slate-600">
                共 {currentReportItems.length} 条
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {currentReportItems.map((item, index) => {
              const typeStyle = getIntelligenceTypeStyle(item.type);
              const priorityBadge = getPriorityBadge(item.priority);
              const PriorityIcon = priorityBadge.icon;

              return (
                <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityBadge.style} flex items-center gap-1`}>
                          <PriorityIcon className="h-3 w-3" />
                          {priorityBadge.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${typeStyle.bg} ${typeStyle.text}`}>
                          {getIntelligenceTypeLabel(item.type)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          {item.source}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {item.publishTime}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mb-2">{item.summary}</p>
                      {item.businessMatch && item.businessMatch.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.businessMatch.map((business) => (
                            <span key={business} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs border border-emerald-200">
                              {business}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 每月综述图文详情视图
  const MonthlyReportDetailView = () => {
    if (!currentReport) return null;

    const statusBadge = getStatusBadge(currentReport.status);
    const StatusIcon = statusBadge.icon;

    // 统计数据
    const stats = {
      internal: currentReportItems.filter(i => i.type === 'internal').length,
      customer: currentReportItems.filter(i => i.type === 'customer').length,
      policy: currentReportItems.filter(i => i.type === 'policy').length,
      standard: currentReportItems.filter(i => i.type === 'standard').length,
      technology: currentReportItems.filter(i => i.type === 'technology').length,
      tender: currentReportItems.filter(i => i.type === 'tender').length,
      competitor: currentReportItems.filter(i => i.type === 'competitor').length,
      urgent: currentReportItems.filter(i => i.priority === 'urgent').length,
      important: currentReportItems.filter(i => i.priority === 'important').length,
    };

    // 模拟月度对比数据
    const monthlyComparison = {
      lastMonth: {
        total: 168,
        urgent: 3,
        important: 15,
      },
      thisMonth: {
        total: currentReportItems.length,
        urgent: stats.urgent,
        important: stats.important,
      }
    };

    const calculateGrowth = (current: number, previous: number) => {
      if (previous === 0) return '+0%';
      const growth = ((current - previous) / previous * 100).toFixed(1);
      return growth.startsWith('-') ? growth : `+${growth}%`;
    };

    // 获取本月重要情报（取前8条）
    const topItems = currentReportItems.slice(0, 8);

    return (
      <div className="space-y-6">
        {/* 简报头部 */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="h-6 w-6" />
                <h2 className="text-2xl font-bold">{currentReport.title}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.style} flex items-center gap-1.5 bg-white/20`}>
                  <StatusIcon className="h-4 w-4" />
                  {statusBadge.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-purple-100">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  <span>{currentReport.dateRange}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{currentReport.generatedAt}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileCheck className="h-4 w-4" />
                  <span>收录 {currentReport.selectedItemIds.length} 条情报</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                <Download className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                <Printer className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 月度核心统计 */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1 text-purple-100 text-xs">
                  <Activity className="h-3 w-3" />
                  本月总数
                </div>
                <div className={`text-xs font-bold flex items-center gap-0.5 ${
                  monthlyComparison.thisMonth.total > monthlyComparison.lastMonth.total ? 'text-purple-200' : 'text-red-200'
                }`}>
                  {monthlyComparison.thisMonth.total > monthlyComparison.lastMonth.total ? (
                    <ArrowUp className="h-3 w-3" />
                  ) : (
                    <ArrowDown className="h-3 w-3" />
                  )}
                  {calculateGrowth(monthlyComparison.thisMonth.total, monthlyComparison.lastMonth.total)}
                </div>
              </div>
              <div className="text-2xl font-bold">{monthlyComparison.thisMonth.total}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
              <div className="flex items-center gap-1 mb-1 text-purple-100 text-xs">
                <Shield className="h-3 w-3" />
                紧急情报
              </div>
              <div className="text-2xl font-bold">{stats.urgent}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
              <div className="flex items-center gap-1 mb-1 text-purple-100 text-xs">
                <Target className="h-3 w-3" />
                重要情报
              </div>
              <div className="text-2xl font-bold">{stats.important}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
              <div className="flex items-center gap-1 mb-1 text-purple-100 text-xs">
                <TrendingUp className="h-3 w-3" />
                环比增长
              </div>
              <div className="text-xl font-bold text-purple-200">
                {calculateGrowth(monthlyComparison.thisMonth.total, monthlyComparison.lastMonth.total)}
              </div>
            </div>
          </div>
        </div>

        {/* 月度趋势分析 */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="h-5 w-5 text-purple-600" />
              <h3 className="text-base font-semibold text-slate-900">本月情报分类</h3>
            </div>
            <div className="space-y-2">
              {[
                { type: '政策法规', count: stats.policy, percent: Math.round((stats.policy / currentReportItems.length) * 100), color: 'bg-blue-500' },
                { type: '标准更新', count: stats.standard, percent: Math.round((stats.standard / currentReportItems.length) * 100), color: 'bg-purple-500' },
                { type: '产业技术', count: stats.technology, percent: Math.round((stats.technology / currentReportItems.length) * 100), color: 'bg-green-500' },
                { type: '招标项目', count: stats.tender, percent: Math.round((stats.tender / currentReportItems.length) * 100), color: 'bg-amber-500' },
                { type: '竞品动态', count: stats.competitor, percent: Math.round((stats.competitor / currentReportItems.length) * 100), color: 'bg-red-500' },
              ].map((item) => (
                <div key={item.type} className="flex items-center gap-2">
                  <div className="w-20 text-xs text-slate-600">{item.type}</div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                  </div>
                  <div className="w-16 text-right text-xs font-semibold text-slate-700">{item.percent}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* 业务匹配分析 */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-purple-600" />
              <h3 className="text-base font-semibold text-slate-900">业务匹配分析</h3>
            </div>
            <div className="space-y-2">
              {[
                { name: '军工检测', count: currentReportItems.filter(i => i.businessMatch?.includes('军工检测')).length, value: 35 },
                { name: '计量校准', count: currentReportItems.filter(i => i.businessMatch?.includes('计量校准')).length, value: 28 },
                { name: '元器件检测', count: currentReportItems.filter(i => i.businessMatch?.includes('元器件检测')).length, value: 22 },
                { name: '可靠性试验', count: currentReportItems.filter(i => i.businessMatch?.includes('可靠性试验')).length, value: 15 },
              ].map((business) => (
                <div key={business.name} className="flex items-center gap-2">
                  <div className="w-24 text-xs text-slate-600">{business.name}</div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${business.value}%` }} />
                  </div>
                  <div className="w-12 text-right text-xs font-semibold text-slate-700">{business.value}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* 长期趋势分析 */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <h3 className="text-base font-semibold text-slate-900">长期趋势</h3>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1"></div>
                <div>标准更新情报持续增加，行业标准化进程加速</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1"></div>
                <div>军工检测项目投标机会增多，市场活跃度提升</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1"></div>
                <div>国际机构在华布局加快，竞争压力增大</div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1"></div>
                <div>产业技术情报持续活跃，技术创新加速</div>
              </div>
            </div>
          </div>
        </div>

        {/* 本月重要情报回顾 */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-4 py-3 border-b border-purple-100">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h3 className="text-base font-semibold text-purple-900">本月重要情报回顾</h3>
            </div>
          </div>
          <div className="p-4">
            <div className="grid md:grid-cols-2 gap-4">
              {topItems.map((item, index) => {
                const typeStyle = getIntelligenceTypeStyle(item.type);
                const priorityBadge = getPriorityBadge(item.priority);
                const PriorityIcon = priorityBadge.icon;

                return (
                  <div key={item.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200 hover:shadow-md transition-all">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${priorityBadge.style} flex items-center gap-0.5`}>
                          <PriorityIcon className="h-2.5 w-2.5" />
                          {priorityBadge.label}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${typeStyle.bg} ${typeStyle.text}`}>
                          {getIntelligenceTypeLabel(item.type)}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">{item.title}</h4>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-600 line-clamp-2">{item.summary}</p>
                </div>
              );
              })}
            </div>
          </div>
        </div>

        {/* 月度工作总结 */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-900">月度工作总结</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-800">
            <div>
              <p className="mb-2">
                <span className="font-semibold">📊 本月情报概况：</span>
                本月共收录 <span className="font-bold text-purple-700">{currentReport.selectedItemIds.length}</span> 条情报，
                较上月{calculateGrowth(monthlyComparison.thisMonth.total, monthlyComparison.lastMonth.total)}。
                其中所内经营 <span className="font-bold">{stats.internal}</span> 条，大客户 <span className="font-bold">{stats.customer}</span> 条。
                情报质量稳步提升，重要情报占比达 <span className="font-bold">{Math.round((stats.important / currentReportItems.length) * 100)}%</span>。
              </p>
              <p className="mb-2">
                <span className="font-semibold">🏢 所内经营总结：</span>
                各业务部门本月经营情况整体良好，技推处、计量校准等部门业绩突出，
                建议继续保持良好势头，加强内部协同，提升整体运营效率。
              </p>
              <p className="mb-2">
                <span className="font-semibold">⚠️ 风险与机遇：</span>
                发现 <span className="font-bold text-red-600">{stats.urgent}</span> 条紧急情报需立即处理，
                同时识别出 <span className="font-bold text-emerald-600">{stats.tender}</span> 个重要业务机会，
                总预算超 <span className="font-bold">1200万元</span>，建议资源优先配置。
              </p>
              <p>
                <span className="font-semibold">🎯 业务布局建议：</span>
                建议加强军工检测和计量校准业务拓展，提升大客户服务能力，
                建立情报快速响应机制，确保不错过重要业务机会。
              </p>
            </div>
            <div>
              <p className="mb-2">
                <span className="font-semibold">👥 大客户分析：</span>
                本月跟踪到 <span className="font-bold text-teal-600">{stats.customer}</span> 条大客户情报，
                中航工业、中国电科、华为等重点客户需求稳定，建议加强客户关系维护，
                深挖潜在业务机会。
              </p>
              <p className="mb-2">
                <span className="font-semibold">📈 长期趋势分析：</span>
                标准更新情报持续增长，显示行业规范化进程加速。
                国际竞争加剧，需要提升服务质量和竞争力。
                技术创新情报活跃，建议加强研发投入。
              </p>
              <p className="mb-2">
                <span className="font-semibold">🔄 竞争态势：</span>
                SGS、TÜV SÜD等国际机构在华布局加快，
                通过降价、并购等方式扩大市场份额。建议制定差异化竞争策略。
              </p>
              <p>
                <span className="font-semibold">💡 下月工作重点：</span>
                继续强化情报收集分析能力，完善业务机会识别机制，
                加强竞品动态监测，优化大客户服务流程，提升核心竞争力。
              </p>
            </div>
          </div>
        </div>

        {/* 完整情报列表 */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-600" />
                <h3 className="text-base font-semibold text-slate-900">完整情报列表</h3>
              </div>
              <div className="text-sm text-slate-600">
                共 {currentReportItems.length} 条
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {currentReportItems.map((item, index) => {
              const typeStyle = getIntelligenceTypeStyle(item.type);
              const priorityBadge = getPriorityBadge(item.priority);
              const PriorityIcon = priorityBadge.icon;

              return (
                <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm font-semibold text-slate-900">{item.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityBadge.style} flex items-center gap-1`}>
                          <PriorityIcon className="h-3 w-3" />
                          {priorityBadge.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs ${typeStyle.bg} ${typeStyle.text}`}>
                          {getIntelligenceTypeLabel(item.type)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          {item.source}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {item.publishTime}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 mb-2">{item.summary}</p>
                      {item.businessMatch && item.businessMatch.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.businessMatch.map((business) => (
                            <span key={business} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs border border-purple-200">
                              {business}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 简报列表视图
  const ReportListView = () => {
    return (
      <div className="space-y-3">
        {/* 头部 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowListView(false)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-slate-600" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {currentTypeConfig?.label}列表
              </h2>
              <p className="text-xs text-slate-600">
                共 {filteredReports.length} 份报告
              </p>
            </div>
          </div>
        </div>

        {/* 简报列表 */}
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <FileText className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <div className="text-slate-600 mb-1">还没有生成{currentTypeConfig?.label}</div>
            <div className="text-xs text-slate-500">系统将在{selectedType === 'daily' ? '每日18:00' : selectedType === 'weekly' ? '每周五18:00' : '每月末'}自动生成简报</div>
          </div>
        ) : (
          filteredReports.map((report) => {
            const statusBadge = getStatusBadge(report.status);
            const StatusIcon = statusBadge.icon;
            const isSelected = selectedReport === report.id;

            return (
              <div
                key={report.id}
                onClick={() => {
                  setSelectedReport(report.id);
                  setShowListView(false);
                }}
                className={`bg-white rounded-xl border-2 overflow-hidden hover:shadow-md transition-all cursor-pointer ${
                  isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-slate-900">{report.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusBadge.style} flex items-center gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {statusBadge.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        {report.dateRange} · 包含 {report.selectedItemIds.length} 条情报
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  </div>

                  {/* 包含的情报类型标签 */}
                  <div className="flex items-center gap-2">
                    {report.includeInternal && (
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs">所内经营</span>
                    )}
                    {report.includeCustomer && (
                      <span className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded text-xs">大客户</span>
                    )}
                    {report.includePolicy && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">政策</span>
                    )}
                    {report.includeStandard && (
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs">标准</span>
                    )}
                    {report.includeTechnology && (
                      <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs">技术</span>
                    )}
                    {report.includeTender && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded text-xs">招标</span>
                    )}
                    {report.includeCompetitor && (
                      <span className="px-2 py-0.5 bg-red-50 text-red-700 rounded text-xs">竞品</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  };

  return (
    <div className="flex gap-6">
      {/* 左侧：简报类型选择 */}
      <div className="w-1/3 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-slate-900">简报类型</h2>
        </div>

        {reportTypes.map((config) => {
          const Icon = config.icon;
          const isActive = selectedType === config.type;
          const count = MOCK_INTELLIGENCE_REPORTS.filter(r => r.type === config.type).length;

          return (
            <button
              key={config.type}
              onClick={() => handleTypeChange(config.type)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                isActive
                  ? `border-indigo-600 ${config.lightColor} bg-opacity-80`
                  : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg ${config.color} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                {isActive && (
                  <ChevronRight className="h-5 w-5 text-indigo-600" />
                )}
              </div>
              <h3 className="font-semibold text-slate-900 mb-1">{config.label}</h3>
              <p className="text-xs text-slate-600 mb-2">{config.desc}</p>
              <div className="text-xs text-slate-500">
                已生成 {count} 份简报
              </div>
            </button>
          );
        })}
      </div>

      {/* 右侧：详情或列表 */}
      <div className="flex-1">
        {showListView ? (
          <ReportListView />
        ) : selectedType === 'daily' ? (
          <DailyReportDetailView />
        ) : selectedType === 'weekly' ? (
          <WeeklyReportDetailView />
        ) : (
          <MonthlyReportDetailView />
        )}
      </div>
    </div>
  );
}
