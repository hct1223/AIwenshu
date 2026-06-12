/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  Users,
  FileText,
  Briefcase,
  TrendingUp,
  Shield,
  Calendar,
  User,
  Sparkles,
  Heart,
  BarChart3,
  Lightbulb
} from 'lucide-react';
import { MOCK_INTELLIGENCE_ITEMS } from '../data/mockIntelligenceData';
import { IntelligenceCategoryType, UserRole, ROLE_PERMISSIONS, UserInterest } from '../types';

export default function IntelligenceFeed() {
  const [selectedDate, setSelectedDate] = useState<string>('2026-06-11');
  const [currentRole, setCurrentRole] = useState<UserRole>('institute_leader');

  // 模拟用户兴趣数据（实际应从后端获取）
  const [userInterests, setUserInterests] = useState<UserInterest[]>([
    {
      category: 'policy',
      keywords: ['军工', '检测', '标准', '认证'],
      score: 85,
      lastUpdated: '2026-06-11',
    },
    {
      category: 'tender',
      keywords: ['招标', '采购', '预算'],
      score: 78,
      lastUpdated: '2026-06-11',
    },
    {
      category: 'internal',
      keywords: ['经营', '业务', '收入'],
      score: 72,
      lastUpdated: '2026-06-10',
    },
  ]);

  // 计算情报推荐度
  const calculateRecommendationScore = (item: any): number => {
    let score = 0;

    // 基于用户兴趣计算推荐度
    const matchingInterests = userInterests.filter(interest => {
      if (interest.category !== item.type) return false;

      // 检查关键词匹配
      const keywordMatches = interest.keywords.some(keyword =>
        item.title.toLowerCase().includes(keyword.toLowerCase()) ||
        item.summary.toLowerCase().includes(keyword.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
      );

      return keywordMatches;
    });

    if (matchingInterests.length > 0) {
      score = Math.max(...matchingInterests.map(i => i.score));
    }

    return score;
  };

  // 生成可用日期列表（从情报数据中提取）
  const availableDates = useMemo(() => {
    const dates = new Set<string>();
    MOCK_INTELLIGENCE_ITEMS.forEach(item => {
      const date = item.publishTime.split(' ')[0];
      dates.add(date);
    });
    return Array.from(dates).sort().reverse();
  }, []);

  // 格式化日期显示
  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDay = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
    return `${year}年${month}月${day}日 星期${weekDay}`;
  };

  // 按分类组织当前选中日期的情报（基于权限过滤）
  const permission = ROLE_PERMISSIONS[currentRole].permission;

  // 过滤所内经营信息 - 板块领导只能看到板块内信息
  const filterInternalItems = (items: any[]) => {
    if (!permission.canViewInternal) return [];

    const dateFiltered = items.filter(i =>
      i.type === 'internal' && i.publishTime.startsWith(selectedDate)
    );

    // 如果是板块领导，过滤出板块内的信息
    if (currentRole === 'division_leader' && permission.allowedDepartments) {
      return dateFiltered.filter(item =>
        permission.allowedDepartments!.some(dept =>
          item.department === dept || item.businessMatch?.includes(dept)
        )
      );
    }

    return dateFiltered;
  };

  const categories = useMemo(() => [
    {
      id: 'internal' as const,
      label: currentRole === 'division_leader' ? '板块内经营信息' : '所内经营信息',
      icon: Building2,
      color: 'indigo',
      items: filterInternalItems(MOCK_INTELLIGENCE_ITEMS),
    },
    {
      id: 'customer' as const,
      label: '大客户情况',
      icon: Users,
      color: 'teal',
      items: permission.canViewCustomer
        ? MOCK_INTELLIGENCE_ITEMS.filter(i => i.type === 'customer' && i.publishTime.startsWith(selectedDate))
        : [],
    },
    {
      id: 'industry_hot' as const,
      label: '行业热点',
      icon: Sparkles,
      color: 'rose',
      items: permission.canViewTechnology
        ? MOCK_INTELLIGENCE_ITEMS.filter(i => i.type === 'industry_hot' && i.publishTime.startsWith(selectedDate))
        : [],
    },
    {
      id: 'policy' as const,
      label: '政策法规',
      icon: FileText,
      color: 'blue',
      items: permission.canViewPolicy
        ? MOCK_INTELLIGENCE_ITEMS.filter(i => i.type === 'policy' && i.publishTime.startsWith(selectedDate))
        : [],
    },
    {
      id: 'standard' as const,
      label: '标准更新',
      icon: FileText,
      color: 'purple',
      items: permission.canViewStandard
        ? MOCK_INTELLIGENCE_ITEMS.filter(i => i.type === 'standard' && i.publishTime.startsWith(selectedDate))
        : [],
    },
    {
      id: 'technology' as const,
      label: '产业技术',
      icon: TrendingUp,
      color: 'green',
      items: permission.canViewTechnology
        ? MOCK_INTELLIGENCE_ITEMS.filter(i => i.type === 'technology' && i.publishTime.startsWith(selectedDate))
        : [],
    },
    {
      id: 'tender' as const,
      label: '招标项目',
      icon: Briefcase,
      color: 'amber',
      items: permission.canViewTender
        ? MOCK_INTELLIGENCE_ITEMS.filter(i => i.type === 'tender' && i.publishTime.startsWith(selectedDate))
        : [],
    },
    {
      id: 'competitor' as const,
      label: '竞品动态',
      icon: Shield,
      color: 'red',
      items: permission.canViewCompetitor
        ? MOCK_INTELLIGENCE_ITEMS.filter(i => i.type === 'competitor' && i.publishTime.startsWith(selectedDate))
        : [],
    },
  ], [selectedDate, permission, currentRole]);

  // 获取分类样式
  const getCategoryStyle = (color: string) => {
    const styles: Record<string, { header: string; accent: string; border: string }> = {
      indigo: { header: 'bg-indigo-600', accent: 'text-indigo-700', border: 'border-indigo-200' },
      teal: { header: 'bg-teal-600', accent: 'text-teal-700', border: 'border-teal-200' },
      rose: { header: 'bg-rose-600', accent: 'text-rose-700', border: 'border-rose-200' },
      blue: { header: 'bg-blue-600', accent: 'text-blue-700', border: 'border-blue-200' },
      purple: { header: 'bg-purple-600', accent: 'text-purple-700', border: 'border-purple-200' },
      green: { header: 'bg-green-600', accent: 'text-green-700', border: 'border-green-200' },
      amber: { header: 'bg-amber-600', accent: 'text-amber-700', border: 'border-amber-200' },
      red: { header: 'bg-red-600', accent: 'text-red-700', border: 'border-red-200' },
    };
    return styles[color] || styles.blue;
  };

  return (
    <div className="bg-white">
      {/* 报告头部 */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-8 px-6 mb-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">赛宝每日摘要</h1>
            <div className="flex items-center gap-3">
              {/* 角色选择器 */}
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                <User className="h-4 w-4 text-slate-300" />
                <select
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                  className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer"
                >
                  <option value="institute_leader" className="bg-slate-800">所领导</option>
                  <option value="division_leader" className="bg-slate-800">板块领导</option>
                  <option value="marketing_staff" className="bg-slate-800">市场人员</option>
                </select>
              </div>
              {/* 日期选择器 */}
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <Calendar className="h-4 w-4 text-slate-300" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={availableDates[availableDates.length - 1]}
                  max={availableDates[0]}
                  className="bg-transparent text-white text-sm font-medium focus:outline-none cursor-pointer"
                />
                <span className="text-slate-300 text-sm">({formatDateDisplay(selectedDate)})</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-slate-300 text-sm">
            <span>当前角色：{ROLE_PERMISSIONS[currentRole].name}</span>
            <span>·</span>
            <span>收录情报：{categories.reduce((sum, cat) => sum + cat.items.length, 0)} 条</span>
            <span>·</span>
            <span>更新时间：每日18:00</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-12">
        {/* 用户兴趣分析 */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="bg-amber-500 rounded-lg p-2">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                智能推荐 - 基于您的阅读偏好
              </h3>
              <div className="flex flex-wrap gap-2">
                {userInterests.map((interest) => {
                  const categoryNames: Record<string, string> = {
                    internal: '所内经营',
                    customer: '大客户',
                    industry_hot: '行业热点',
                    policy: '政策法规',
                    standard: '标准更新',
                    technology: '产业技术',
                    tender: '招标项目',
                    competitor: '竞品动态',
                  };
                  return (
                    <div
                      key={interest.category}
                      className="bg-white rounded-lg px-3 py-2 border border-amber-200"
                    >
                      <div className="text-xs text-slate-600 mb-1">
                        {categoryNames[interest.category]}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-wrap gap-1">
                          {interest.keywords.slice(0, 3).map((keyword) => (
                            <span key={keyword} className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
                              {keyword}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-amber-600">
                          {interest.score}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 报告说明 */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-1 bg-indigo-600 rounded-full"></div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-2">报告说明</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {currentRole === 'division_leader' ? (
                  <>本报告汇总每日重要情报信息，涵盖板块内经营信息、大客户情况、市场趋势、政策动态、招标项目等内容，为您提供板块运营决策支持。</>
                ) : currentRole === 'marketing_staff' ? (
                  <>本报告汇总每日重要市场情报，涵盖大客户情况、市场趋势、政策动态、招标项目、竞品动态等内容，为市场拓展提供参考。</>
                ) : (
                  <>本报告汇总每日重要情报信息，涵盖所内经营信息、大客户情况、市场趋势、政策动态、招标项目及竞品动态等内容，为领导决策提供参考依据。</>
                )}
                系统会根据您的阅读习惯智能推荐相关情报。
              </p>
              {currentRole === 'division_leader' && permission.division && (
                <div className="mt-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs rounded-lg inline-block">
                  当前板块：{permission.division}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 各分类情报内容 */}
        {categories.map((category) => {
          const Icon = category.icon;
          const style = getCategoryStyle(category.color);

          if (category.items.length === 0) return null;

          return (
            <div key={category.id} className="mb-10">
              {/* 分类标题 */}
              <div className={`${style.header} text-white px-5 py-3 rounded-t-lg flex items-center gap-3`}>
                <Icon className="h-5 w-5" />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{category.label}</h2>
                  <p className="text-xs text-white/80">共 {category.items.length} 条情报</p>
                </div>
              </div>

              {/* 情报列表 */}
              <div className={`border-2 ${style.border} border-t-0 rounded-b-lg bg-white`}>
                {category.items.map((item, index) => {
                  const recommendationScore = calculateRecommendationScore(item);
                  const isRecommended = recommendationScore > 60;

                  return (
                    <div
                      key={item.id}
                      className={`p-5 ${index !== category.items.length - 1 ? 'border-b border-slate-100' : ''} ${
                        isRecommended ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* 序号和标题 */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`flex-shrink-0 w-7 h-7 rounded-full ${style.header} text-white flex items-center justify-center text-sm font-bold`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                            {isRecommended && (
                              <span className="px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                推荐
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span>来源：
                              {item.sourceUrl ? (
                                <a
                                  href={item.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium ml-1 inline-flex items-center gap-1"
                                >
                                  {item.source}
                                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                </a>
                              ) : (
                                <span className="font-medium ml-1">{item.source}</span>
                              )}
                            </span>
                            {item.publishTime && <span>时间：{item.publishTime}</span>}
                            {isRecommended && (
                              <span className="text-amber-600 font-medium">
                                匹配度：{recommendationScore}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 情报内容 */}
                      <div className="ml-10">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* 报告尾部 */}
        <div className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
          <p>本报告由情报速递系统自动生成 · 如有疑问请联系综合管理部门</p>
          <p className="mt-1">中国赛宝 · 情报速递系统 © 2026</p>
        </div>
      </div>
    </div>
  );
}
