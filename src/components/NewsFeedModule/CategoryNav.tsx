/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FileText, TrendingUp, Briefcase, Flame, Folder, Layers } from 'lucide-react';
import { NewsCategoryType } from '../../types';
import { NEWS_STATS } from '../../data/mockNewsData';

interface CategoryNavProps {
  activeCategory: NewsCategoryType;
  onCategoryChange: (category: NewsCategoryType) => void;
}

const CATEGORIES = [
  { id: 'all' as NewsCategoryType, label: '全部', icon: Layers, count: NEWS_STATS.total },
  { id: 'policy' as NewsCategoryType, label: '政策法规', icon: FileText, count: NEWS_STATS.policy, hasNew: true },
  { id: 'market' as NewsCategoryType, label: '市场趋势', icon: TrendingUp, count: NEWS_STATS.market, hasNew: true },
  { id: 'tender' as NewsCategoryType, label: '招标信息', icon: Briefcase, count: NEWS_STATS.tender, hasNew: true },
  { id: 'hotspot' as NewsCategoryType, label: '热点动态', icon: Flame, count: NEWS_STATS.hotspot },
  { id: 'collected' as NewsCategoryType, label: '我的收藏', icon: Folder, count: 3 },
];

export default function CategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
  return (
    <div className="w-48 bg-white rounded-lg border border-slate-200 p-3">
      <h3 className="text-sm font-semibold text-slate-700 mb-3 px-2">分类导航</h3>

      <nav className="space-y-1">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs font-medium transition duration-150
                ${isActive
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                }
              `}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="flex-1">{category.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
                category.hasNew
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {category.count}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
