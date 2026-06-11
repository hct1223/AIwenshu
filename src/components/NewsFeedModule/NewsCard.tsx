/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FileText, TrendingUp, Briefcase, Flame, Bookmark, BookmarkCheck, Share2, ArrowRight } from 'lucide-react';
import { NewsItem, TenderItem } from '../../types';

interface NewsCardProps {
  item: NewsItem | TenderItem;
  onCollect?: (id: string) => void;
  onViewDetail?: (id: string) => void;
}

const TYPE_CONFIG = {
  policy: {
    icon: FileText,
    label: '政策',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
  market: {
    icon: TrendingUp,
    label: '市场',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
  },
  tender: {
    icon: Briefcase,
    label: '招标',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
  },
  hotspot: {
    icon: Flame,
    label: '热点',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
  },
};

export default function NewsCard({ item, onCollect, onViewDetail }: NewsCardProps) {
  const config = TYPE_CONFIG[item.type];
  const Icon = config.icon;
  const isTender = item.type === 'tender';

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow duration-200">
      {/* 头部：类型标签和标题 */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`px-2 py-1 rounded text-[10px] font-medium ${config.bgColor} ${config.textColor} border ${config.borderColor} flex items-center gap-1 shrink-0`}>
          <Icon className="h-3 w-3" />
          {config.label}
        </div>
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 flex-1">
          {item.title}
        </h3>
      </div>

      {/* 发布信息 */}
      <div className="flex items-center gap-4 text-[11px] text-slate-500 mb-3">
        <span>{item.department}</span>
        <span>•</span>
        <span>{item.publishTime}</span>
        {isTender && (
          <>
            <span>•</span>
            <span className="text-amber-600 font-medium">{(item as TenderItem).budget}</span>
          </>
        )}
      </div>

      {/* 标签 */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {item.tags.map((tag, index) => (
          <span
            key={index}
            className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-200 rounded"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* 摘要 */}
      <p className="text-xs text-slate-600 line-clamp-2 mb-3">
        {item.summary}
      </p>

      {/* 招标信息扩展字段 */}
      {isTender && (
        <div className="bg-amber-50 rounded border border-amber-200 p-3 mb-3 text-[11px]">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-500">截止时间:</span>
              <span className="text-slate-700 ml-1">{(item as TenderItem).deadline}</span>
            </div>
            <div>
              <span className="text-slate-500">地区:</span>
              <span className="text-slate-700 ml-1">{(item as TenderItem).region}</span>
            </div>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => onViewDetail?.(item.id)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
        >
          查看详情
          <ArrowRight className="h-3 w-3" />
        </button>
        <button
          onClick={() => onCollect?.(item.id)}
          className={`p-1.5 rounded transition-colors ${
            item.isCollected
              ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
          title={item.isCollected ? '已收藏' : '收藏'}
        >
          {item.isCollected ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
        <button
          className="p-1.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          title="分享"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
