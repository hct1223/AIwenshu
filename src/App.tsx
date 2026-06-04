/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Building2,
  BarChart3,
  PieChart,
  CircleUser,
  LayoutDashboard,
  MessageSquareCode,
  SearchCode,
  User,
  Users,
  Building,
  Menu,
  X,
  Sparkles,
  FileText,
  Newspaper
} from 'lucide-react';

import DashboardModule from './components/DashboardModule';
import GroupModule from './components/GroupModule';
import GroupListModule from './components/GroupListModule';
import EnterpriseModule from './components/EnterpriseModule';
import SearchModule from './components/SearchModule';
import AIQueryModule from './components/AIQueryModule';
import AIChatSidebar from './components/AIChatSidebar';
import BusinessReportModule from './components/BusinessReportModule';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeCompanyId, setActiveCompanyId] = useState<string>('comp-huawei-tech');
  const [activeGroupId, setActiveGroupId] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [aiChatOpen, setAiChatOpen] = useState<boolean>(false);

  // Dynamic router to switch views
  const renderModule = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <DashboardModule
            onNavigateToCompany={(id) => {
              setActiveCompanyId(id);
              setActiveTab('enterprisePortrait');
            }}
            onNavigateToGroup={(id) => {
              setActiveGroupId(id);
              setActiveTab('groupPortrait');
            }}
            onNavigateToTab={(tabId) => {
              setActiveTab(tabId);
            }}
          />
        );
      case 'groupPortrait':
        // 如果有activeGroupId，显示集团详情，否则显示集团列表
        if (activeGroupId) {
          return (
            <GroupModule
              activeGroupId={activeGroupId}
              onNavigateToCompany={(id) => {
                setActiveCompanyId(id);
                setActiveTab('enterprisePortrait');
              }}
            />
          );
        } else {
          return (
            <GroupListModule
              onNavigateToGroup={(id) => {
                setActiveGroupId(id);
              }}
            />
          );
        }
      case 'enterprisePortrait':
        return (
          <EnterpriseModule
            activeCompanyId={activeCompanyId}
            onNavigateToCompany={(id) => {
              setActiveCompanyId(id);
            }}
          />
        );
      case 'enterpriseSearch':
        return (
          <SearchModule
            onNavigateToCompany={(id) => {
              setActiveCompanyId(id);
              setActiveTab('enterprisePortrait');
            }}
          />
        );
      case 'aiQuery':
        return <AIQueryModule />;
      case 'businessReport':
        return <BusinessReportModule />;
      default:
        return <DashboardModule
          onNavigateToCompany={(id) => {
            setActiveCompanyId(id);
            setActiveTab('enterprisePortrait');
          }}
          onNavigateToGroup={(id) => {
            setActiveGroupId(id);
            setActiveTab('groupPortrait');
          }}
          onNavigateToTab={(tabId) => {
            setActiveTab(tabId);
          }}
        />;
    }
  };

  const navMenuItems = [
    { id: 'aiChat', label: 'AI智能对话', desc: 'AI data analysis chat', icon: Sparkles },
    { id: 'dashboard', label: '数据大盘研判', desc: 'Cockpit overview', icon: LayoutDashboard },
    { id: 'businessReport', label: '每周动态', desc: 'Weekly dynamics', icon: Newspaper },
    { id: 'groupPortrait', label: '集团画像', desc: 'Corporate group profiles', icon: Users },
    { id: 'enterprisePortrait', label: '企业画像', desc: 'Enterprise profile', icon: Building },
    { id: 'enterpriseSearch', label: '企业搜索', desc: 'Enterprise search', icon: SearchCode },
    { id: 'aiQuery', label: 'AI智能问数决策', desc: 'Visual report center', icon: MessageSquareCode },
  ];

  return (
    <div id="saibao-applet-root" className="min-h-screen bg-slate-50/60 text-slate-800 font-sans flex flex-col md:flex-row">
      
      {/* 1. Left Persistent Sidebar - Hidden when standard printer layout activates */}
      <aside 
        id="saibao-sidebar-panel" 
        className="sidebar no-print w-full md:w-64 bg-slate-900 text-slate-100 flex-shrink-0 flex flex-col justify-between border-r border-slate-800 z-50 md:sticky md:top-0 md:h-screen"
      >
        <div className="flex flex-col">
          {/* Logo Brand Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center gap-2.5">
            <div className="bg-indigo-600 h-9 w-9 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
              <Building2 className="h-5 w-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-display font-bold leading-tight tracking-tight text-white text-sm">
                云上赛宝数智专盘
              </h1>
              <span className="text-[10px] text-slate-400 font-sans tracking-wide">工信部五所 · 企业合作大盘</span>
            </div>
          </div>

          {/* Quick Mobile header switcher controls */}
          <div className="md:hidden flex items-center justify-between p-4 bg-slate-850">
            <span className="text-xs font-semibold text-slate-300">功能路径选择菜单</span>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Nav Items */}
          <nav className={`p-3 space-y-1.5 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
            {navMenuItems.map((menu) => {
              const Icon = menu.icon;
              const isActive = activeTab === menu.id;

              return (
                <button
                  key={menu.id}
                  id={`sidebar-tab-button-${menu.id}`}
                  onClick={() => {
                    if (menu.id === 'aiChat') {
                      setAiChatOpen(!aiChatOpen);
                    } else {
                      setActiveTab(menu.id);
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 py-2.5 px-3.5 rounded-lg text-left text-xs font-medium tracking-tight transition duration-150 ${
                    menu.id === 'aiChat'
                      ? (aiChatOpen ? 'bg-indigo-650 text-white font-semibold shadow-xs' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40')
                      : (isActive ? 'bg-indigo-650 text-white font-semibold shadow-xs' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40')
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 shrink-0 ${
                    menu.id === 'aiChat'
                      ? (aiChatOpen ? 'text-white' : 'text-slate-450')
                      : (isActive ? 'text-white' : 'text-slate-450')
                  }`} />
                  <div>
                    <div>{menu.label}</div>
                    <div className="text-[9px] text-slate-500 font-sans tracking-wider mt-0.5 uppercase">
                      {menu.desc}
                    </div>
                  </div>
                  {menu.id === 'aiChat' && (
                    <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-indigo-600/20 text-indigo-300">
                      {aiChatOpen ? '展开中' : '点击展开'}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Panel - Operator ID details */}
        <div className={`p-4 border-t border-slate-800/80 ${mobileMenuOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-slate-850/60 rounded-xl p-3 border border-slate-800/20 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-slate-750 flex items-center justify-center shrink-0 border border-slate-700/50">
              <User className="h-4 w-4 text-slate-300" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-100">陈主任</div>
              <div className="text-[9px] text-indigo-400 font-sans tracking-wide">决策舱主管账户</div>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Main Display Arena Column */}
      <main
        id="saibao-main-stage"
        className={`
          flex-1 overflow-x-hidden min-h-screen transition-all duration-300
          ${aiChatOpen ? 'mr-[480px] sm:mr-[576px]' : ''}
        `}
      >
        {/* Top Floating Dashboard Alert bar (Dynamic non-printable header) */}
        <header className="no-print bg-white border-b border-slate-100/85 px-6 py-4 sticky top-0 z-40 hidden md:flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>当前业务层级:</span>
            <span className="font-semibold text-slate-700">全国总所大盘</span>
            <span className="text-slate-300">/</span>
            <span className="text-indigo-600 font-medium">{navMenuItems.find(m => m.id === activeTab)?.label}</span>
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>当前时间段: 2026年Q2度审计周期</span>
          </div>
        </header>

        {/* Dynamic page wrapper with consistent responsive spacing */}
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {renderModule()}
        </div>
      </main>

      {/* 3. AI Chat Sidebar */}
      <AIChatSidebar
        isOpen={aiChatOpen}
        onToggle={() => setAiChatOpen(!aiChatOpen)}
        onNavigateToCompany={(id) => {
          setActiveCompanyId(id);
          setActiveTab('enterprisePortrait');
        }}
      />

    </div>
  );
}
