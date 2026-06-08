/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Company } from '../types';
import { COMP_MOCK_LIST, GROUP_MOCK_LIST } from '../data/mockData';
import {
  Building,
  Building2,
  Users,
  Search,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Star,
  Filter
} from 'lucide-react';

interface EnterpriseListModuleProps {
  onNavigateToCompany: (id: string) => void;
  onNavigateToGroup: (id: string) => void;
}

interface EnterpriseItem {
  id: string;
  name: string;
  logo: string;
  type: 'enterprise' | 'group';
  partnershipLevel?: string;
  aiScore?: number;
  cooperationAmount?: number;
  subCompanyCount?: number;
  industry?: string;
  region?: string;
}

export default function EnterpriseListModule({
  onNavigateToCompany,
  onNavigateToGroup
}: EnterpriseListModuleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'enterprise' | 'group'>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'amount' | 'score'>('amount');

  // Combine enterprise and group data
  const allEnterprises: EnterpriseItem[] = useMemo(() => {
    const enterprises: EnterpriseItem[] = COMP_MOCK_LIST.map(company => ({
      id: company.id,
      name: company.name,
      logo: company.logo,
      type: 'enterprise',
      partnershipLevel: company.partnershipLevel,
      aiScore: company.aiScore,
      cooperationAmount: company.cooperationContracts?.reduce((sum, c) => sum + c.amount, 0) || 0,
      industry: company.industry,
      region: company.tags?.coreDivision?.find(t => t.includes('华东') || t.includes('华南') || t.includes('华北'))?.split('：')[1] || '全国'
    }));

    const groups: EnterpriseItem[] = GROUP_MOCK_LIST.map(group => ({
      id: group.id,
      name: group.name,
      logo: group.logo,
      type: 'group',
      partnershipLevel: group.partnershipLevel,
      aiScore: group.aiPotentialScore,
      cooperationAmount: group.subCompanies?.filter(c => c.isPartnered).reduce((sum, c) => sum + (c.cooperationAmount || 0), 0) || 0,
      subCompanyCount: group.totalSubCompanies,
      industry: '多元化集团',
      region: '全国'
    }));

    return [...groups, ...enterprises];
  }, [GROUP_MOCK_LIST]);

  // Filter and sort enterprises
  const filteredEnterprises = useMemo(() => {
    let filtered = allEnterprises;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.industry && item.industry.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
    }

    // Level filter
    if (levelFilter !== 'all') {
      filtered = filtered.filter(item => item.partnershipLevel?.includes(levelFilter));
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'zh-CN');
        case 'amount':
          return (b.cooperationAmount || 0) - (a.cooperationAmount || 0);
        case 'score':
          return (b.aiScore || 0) - (a.aiScore || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allEnterprises, searchQuery, typeFilter, levelFilter, sortBy]);

  const getPartnershipColor = (level?: string) => {
    if (!level) return 'text-slate-500 bg-slate-50 border-slate-200';

    if (level.includes('战略') || level.includes('顶尖')) {
      return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    } else if (level.includes('核心') || level.includes('重要')) {
      return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    } else if (level.includes('潜力') || level.includes('培育')) {
      return 'text-amber-700 bg-amber-50 border-amber-200';
    }
    return 'text-slate-500 bg-slate-50 border-slate-200';
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-slate-400';
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-indigo-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-rose-600';
  };

  const handleItemClick = (item: EnterpriseItem) => {
    if (item.type === 'group') {
      onNavigateToGroup(item.id);
    } else {
      onNavigateToCompany(item.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
            企业管理中心
          </h2>
          <p className="mt-1 text-sm text-slate-500 font-sans">
            统一管理所有企业客户和集团合作伙伴信息
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-xs">
          <div className="bg-white rounded-lg p-3 border border-slate-100 shadow-xs">
            <div className="font-mono text-lg font-bold text-indigo-600">
              {allEnterprises.length}
            </div>
            <div className="text-slate-400">总数</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-slate-100 shadow-xs">
            <div className="font-mono text-lg font-bold text-emerald-600">
              {allEnterprises.filter(e => e.type === 'enterprise').length}
            </div>
            <div className="text-slate-400">企业</div>
          </div>
          <div className="bg-white rounded-lg p-3 border border-slate-100 shadow-xs">
            <div className="font-mono text-lg font-bold text-amber-600">
              {allEnterprises.filter(e => e.type === 'group').length}
            </div>
            <div className="text-slate-400">集团</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-xs space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索企业名称、行业类型..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Type filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-600">类型:</span>
            <div className="flex bg-slate-50 border border-slate-200 rounded-md p-0.5">
              {[
                { value: 'all', label: '全部' },
                { value: 'enterprise', label: '企业' },
                { value: 'group', label: '集团' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setTypeFilter(option.value as any)}
                  className={`text-[11px] px-3 py-1 rounded font-medium transition ${
                    typeFilter === option.value
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Level filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600">级别:</span>
            <div className="flex bg-slate-50 border border-slate-200 rounded-md p-0.5">
              {[
                { value: 'all', label: '全部' },
                { value: '战略', label: '战略级' },
                { value: '核心', label: '核心' },
                { value: '重要', label: '重要' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setLevelFilter(option.value)}
                  className={`text-[11px] px-3 py-1 rounded font-medium transition ${
                    levelFilter === option.value
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs font-medium text-slate-600">排序:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-white border border-slate-200 rounded-md py-1.5 px-3 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="amount">合作金额</option>
              <option value="score">AI评分</option>
              <option value="name">名称</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enterprise List */}
      <div className="grid gap-4">
        {filteredEnterprises.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
            <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">没有找到匹配的企业或集团</p>
          </div>
        ) : (
          filteredEnterprises.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="relative">
                  <div className={`p-3 rounded-xl ${
                    item.type === 'group'
                      ? 'bg-amber-50 border border-amber-200'
                      : 'bg-indigo-50 border border-indigo-200'
                  }`}>
                    {item.type === 'group' ? (
                      <Users className={`h-6 w-6 ${item.type === 'group' ? 'text-amber-600' : 'text-indigo-600'}`} />
                    ) : (
                      <Building className={`h-6 w-6 ${item.type === 'group' ? 'text-amber-600' : 'text-indigo-600'}`} />
                    )}
                  </div>
                  {item.type === 'group' && (
                    <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      集团
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900 text-base truncate group-hover:text-indigo-600 transition">
                      {item.name}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${getPartnershipColor(item.partnershipLevel)}`}>
                      {item.partnershipLevel}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    {item.industry && (
                      <span className="truncate">{item.industry}</span>
                    )}
                    {item.region && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span>{item.region}</span>
                      </>
                    )}
                    {item.subCompanyCount && (
                      <>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-0.5">
                          <Users className="h-3 w-3" />
                          {item.subCompanyCount} 子公司
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">合作金额</div>
                    <div className="font-mono font-bold text-indigo-600">
                      ¥{((item.cooperationAmount || 0) / 10000).toFixed(1)}千万
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400">AI评分</div>
                    <div className={`font-mono font-bold ${getScoreColor(item.aiScore)}`}>
                      {item.aiScore || '-'}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-600 transition" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}