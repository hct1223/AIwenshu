/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Calendar, Filter } from 'lucide-react';
import { TimeRangeType } from '../../types';

interface FilterBarProps {
  timeRange: TimeRangeType;
  onTimeRangeChange: (range: TimeRangeType) => void;
  onSearch: (query: string) => void;
}

const TIME_RANGES: { value: TimeRangeType; label: string }[] = [
  { value: 'today', label: '今日焦点' },
  { value: 'week', label: '本周精选' },
  { value: 'month', label: '本月回顾' },
];

export default function FilterBar({ timeRange, onTimeRangeChange, onSearch }: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* 时间范围选择 */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            {TIME_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() => onTimeRangeChange(range.value)}
                className={`
                  px-4 py-2 text-xs font-medium transition-colors
                  ${timeRange === range.value
                    ? 'bg-indigo-50 text-indigo-700 border-r border-slate-200'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border-r border-slate-200 last:border-r-0'
                  }
                `}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* 搜索框 */}
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="搜索政策、市场、招标信息..."
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 筛选按钮 */}
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
          <Filter className="h-4 w-4" />
          高级筛选
        </button>
      </div>
    </div>
  );
}
