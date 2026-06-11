/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { TrendingUp, Bell, Settings, Loader2 } from 'lucide-react';
import CategoryNav from './NewsFeedModule/CategoryNav';
import NewsCard from './NewsFeedModule/NewsCard';
import FilterBar from './NewsFeedModule/FilterBar';
import ReportGenerator from './NewsFeedModule/ReportGenerator';
import { MOCK_NEWS_DATA } from '../data/mockNewsData';
import { NewsCategoryType, TimeRangeType, NewsItem, TenderItem, ReportConfig } from '../types';

export default function NewsFeedModule() {
  const [activeCategory, setActiveCategory] = useState<NewsCategoryType>('all');
  const [timeRange, setTimeRange] = useState<TimeRangeType>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [collectedItems, setCollectedItems] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);

  // 根据分类和时间范围过滤数据
  const filteredData = useMemo(() => {
    let data = [...MOCK_NEWS_DATA];

    // 按分类过滤
    if (activeCategory !== 'all') {
      if (activeCategory === 'collected') {
        data = data.filter(item => collectedItems.has(item.id));
      } else {
        data = data.filter(item => item.type === activeCategory);
      }
    }

    // 按搜索关键词过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return data;
  }, [activeCategory, searchQuery, collectedItems]);

  // 处理收藏
  const handleCollect = (id: string) => {
    setCollectedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // 处理查看详情
  const handleViewDetail = (id: string) => {
    console.log('查看详情:', id);
  };

  // 处理报告生成
  const handleGenerateReport = (config: ReportConfig) => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      console.log('生成报告:', config);
    }, 2000);
  };

  // 处理报告预览
  const handlePreviewReport = (config: ReportConfig) => {
    console.log('预览报告:', config);
  };

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 h-10 w-10 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/20">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">行情速递</h1>
            <p className="text-xs text-slate-500">实时掌握行业动态</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 筛选栏 */}
      <FilterBar
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onSearch={setSearchQuery}
      />

      {/* 主内容区 */}
      <div className="flex gap-6">
        {/* 左侧分类导航 */}
        <CategoryNav
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* 中间信息流 */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-700">
              {activeCategory === 'all' ? '全部动态' :
               activeCategory === 'collected' ? '我的收藏' :
               activeCategory === 'policy' ? '政策法规' :
               activeCategory === 'market' ? '市场趋势' :
               activeCategory === 'tender' ? '招标信息' : '热点动态'}
              <span className="text-slate-400 font-normal ml-2">({filteredData.length})</span>
            </h2>
          </div>

          {filteredData.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
              <p className="text-sm text-slate-400">暂无相关内容</p>
            </div>
          ) : (
            filteredData.map((item) => {
              const modifiedItem = { ...item, isCollected: collectedItems.has(item.id) } as NewsItem | TenderItem;
              return React.createElement(NewsCard, {
                key: item.id,
                item: modifiedItem,
                onCollect: handleCollect,
                onViewDetail: handleViewDetail
              });
            })
          )}

          {filteredData.length > 0 && (
            <button className="w-full py-3 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
              加载更多...
            </button>
          )}
        </div>

        {/* 右侧报告生成 */}
        <ReportGenerator
          onGenerateReport={handleGenerateReport}
          onPreviewReport={handlePreviewReport}
        />
      </div>

      {/* 生成中状态 */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
            <span className="text-sm text-slate-700">正在生成报告...</span>
          </div>
        </div>
      )}
    </div>
  );
}
