/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bell,
  Newspaper,
  Settings,
  FileText,
  Sparkles,
  Zap,
  Filter,
  Calendar,
  TrendingUp,
  Shield,
  Target,
  Radio
} from 'lucide-react';
import IntelligenceFeed from './IntelligenceFeed';
import PushSettings from './PushSettings';

type SubTabType = 'feed' | 'settings';

export default function IntelligenceModule() {
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>('feed');

  // 子菜单项
  const subMenuItems = [
    {
      id: 'feed' as SubTabType,
      label: '情报浏览',
      desc: '最新情报流',
      icon: Newspaper,
    },
    {
      id: 'settings' as SubTabType,
      label: '推送设置',
      desc: '采集与推送配置',
      icon: Settings,
    },
  ];

  // 渲染子模块
  const renderSubModule = () => {
    switch (activeSubTab) {
      case 'feed':
        return <IntelligenceFeed />;
      case 'settings':
        return <PushSettings />;
      default:
        return <IntelligenceFeed />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 头部标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Radio className="h-6 w-6 text-indigo-600" />
            情报速递系统
          </h1>
          <p className="text-sm text-slate-600">
            自动采集 · 智能整理 · 精准推送
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Zap className="h-4 w-4 text-amber-500" />
          <span>AI驱动</span>
        </div>
      </div>

      {/* 子功能导航 */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* 导航Tab */}
        <div className="border-b border-slate-200 bg-slate-50/50">
          <nav className="flex overflow-x-auto">
            {subMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSubTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSubTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-indigo-700 border-b-2 border-indigo-600'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <div className="text-left">
                    <div>{item.label}</div>
                    <div className="text-xs text-slate-500">{item.desc}</div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* 子模块内容 */}
        <div className="p-4">
          {renderSubModule()}
        </div>
      </div>
    </div>
  );
}
