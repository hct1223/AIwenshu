/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GROUP_MOCK_LIST, COMP_MOCK_LIST } from '../data/mockData';
import { GroupData } from '../types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Building2, 
  MapPin, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  HelpCircle,
  TrendingDown,
  Info
} from 'lucide-react';

interface GroupModuleProps {
  onNavigateToCompany: (id: string) => void;
}

export default function GroupModule({ onNavigateToCompany }: GroupModuleProps) {
  // Active Group Tab State
  const [activeGroupId, setActiveGroupId] = useState<string>('group-huawei');

  const activeGroup = GROUP_MOCK_LIST.find(g => g.id === activeGroupId) || GROUP_MOCK_LIST[0];

  // Handler to see if we can link a sub company name to our company mock list ID
  const handleDeepDiveSub = (subName: string) => {
    // Check if the exact name exists in COMP_MOCK_LIST
    const match = COMP_MOCK_LIST.find(c => subName.includes(c.name) || c.name.includes(subName));
    if (match) {
      onNavigateToCompany(match.id);
    } else {
      // If no sub company is explicitly created in the demo, redirect to Saibao representation 
      // or show an alert and move of to Huawei Technology default for consistency.
      const defaultComps = COMP_MOCK_LIST.filter(c => c.id === 'comp-huawei-tech');
      if (defaultComps.length > 0) {
        onNavigateToCompany(defaultComps[0].id);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title Description */}
      <div className="border-b border-slate-100 pb-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
          大型集团级穿透画像 · 智能跟进舱
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          全息展现核心企业集团旗下参控股机构、非直属研究所以及其在赛宝实验室的整体合作分布、协同潜力与预警警示
        </p>
      </div>

      {/* Group Selector Tab Buttons */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg max-w-md">
        {GROUP_MOCK_LIST.map((group) => {
          const isActive = group.id === activeGroupId;
          return (
            <button
              key={group.id}
              onClick={() => setActiveGroupId(group.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-md transition ${
                isActive 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <img 
                src={group.logo} 
                alt={group.name} 
                className="h-4 w-4 object-contain rounded-full"
                referrerPolicy="no-referrer"
              />
              {group.name}
            </button>
          );
        })}
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Column 1 & 2 - Group Corporate Card & Family Tree Directory */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card A: Group Portrait Header Details */}
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-slate-50 pb-4 mb-4">
              <div className="flex gap-3.5 items-start">
                <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                  <Building2 className="h-7 w-7 text-indigo-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 text-base">{activeGroup.name} 家族谱系</h3>
                    <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      整体评级: {activeGroup.growthCategory}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">控股母公司: {activeGroup.controllingEntity}</p>
                </div>
              </div>

              {/* KPI indicators inside Group */}
              <div className="flex gap-4">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">总属机构数</div>
                  <div className="font-mono font-bold text-slate-800 text-sm mt-0.5">{activeGroup.totalSubCompanies} 家</div>
                </div>
                <div className="border-l border-slate-100 h-8 self-center" />
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">赛宝合作渗透率</div>
                  <div className="font-mono font-bold text-indigo-600 text-sm mt-0.5">
                    {((activeGroup.partneredCompanies / activeGroup.totalSubCompanies) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* AI Potential analysis panel */}
            <div className="bg-slate-50/50 rounded-lg p-3 border border-slate-100/50 flex gap-3">
              <div className="bg-indigo-600/10 text-indigo-700 h-9 w-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <span className="font-mono font-bold text-sm">{activeGroup.aiPotentialScore}</span>
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-700">AI 智能潜力评估结论</div>
                <p className="text-slate-500 mt-1 leading-relaxed">{activeGroup.cooperationSummary}</p>
              </div>
            </div>
          </div>

          {/* Card B: Subsidiaries Directory Grid */}
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">集团下属实体合作穿透目录</h4>
                <p className="text-xs text-slate-400">显示集团全系参控股企业，可快速跟进其与赛宝实验室的历史往来或发起深查</p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-50 rounded px-2 py-0.5 border border-slate-100">
                <MapPin className="h-3 w-3" />
                <span>联动华南、华东分支机构</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-medium text-slate-400 uppercase">
                    <th className="py-2.5 px-3">子公司名称 / 机构代码</th>
                    <th className="py-2.5 px-3">大区分布</th>
                    <th className="py-2.5 px-3">签约状态</th>
                    <th className="py-2.5 px-3">合作金额 (万元)</th>
                    <th className="py-2.5 px-3">开发优先级</th>
                    <th className="py-2.5 px-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-xs">
                  {activeGroup.subCompanies.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className={`h-1.5 w-1.5 rounded-full ${sub.isPartnered ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                          <span className="font-medium text-slate-700 break-all">{sub.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-slate-500 font-mono text-[11px] bg-slate-50 border border-slate-100 px-1 py-0.5 rounded">
                          {sub.region}大区
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {sub.isPartnered ? (
                          <span className="inline-flex rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 border border-indigo-100">
                            已合作
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-slate-100 text-slate-400 text-[10px] px-2 py-0.5 border border-slate-200">
                            非直属/待开发
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono font-semibold text-slate-800">
                          {sub.isPartnered ? `￥${sub.cooperationAmount}` : '-'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex rounded px-1.5 py-0.5 text-[9px] font-bold ${
                          sub.priority.includes('P0') ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                          sub.priority.includes('P1') ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          sub.priority.includes('P2') ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                          'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}>
                          {sub.priority}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {sub.isPartnered ? (
                          <button
                            onClick={() => handleDeepDiveSub(sub.name)}
                            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 transition inline-flex items-center gap-0.5"
                          >
                            剖析画像
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        ) : (
                          <button
                            onClick={() => alert(`已为该子机构（${sub.name}）自动拉起赛宝实验室专项开发立项表单！当前优先级标等为：${sub.priority}。`)}
                            className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-800 transition"
                          >
                            立项开发
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Column 3 - Intelligent Risk Warnings & Action Trails */}
        <div className="space-y-6">
          
          {/* Risk Alert Panel */}
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
            <div className="flex items-center gap-1.5 border-b border-slate-50 pb-3 mb-4">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
              <h4 className="font-semibold text-slate-900 text-sm">集团智能预警与风险警示</h4>
            </div>

            <div className="space-y-3.5">
              {activeGroup.riskHighlights.map((risk, index) => {
                const isHigh = risk.level === 'high';
                return (
                  <div 
                    key={index} 
                    className={`p-3.5 rounded-lg border text-xs leading-relaxed space-y-1.5 ${
                      isHigh 
                        ? 'bg-rose-50/50 border-rose-100/60 text-slate-700' 
                        : 'bg-amber-50/40 border-amber-100/60 text-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`inline-flex rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                        isHigh ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isHigh ? '高危警钟' : '中度波动'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{risk.date}</span>
                    </div>
                    <div className="font-bold text-slate-800">{risk.title}</div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">{risk.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="bg-indigo-50/40 rounded-lg p-3 border border-indigo-100/50 mt-4 text-[11px] text-slate-600 space-y-1">
              <div className="font-bold text-indigo-900 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 text-indigo-600" />
                赛宝预警防波指令
              </div>
              <p className="text-slate-500 leading-relaxed text-[10px]">
                该集团风险系数评分较前月浮升 <span className="font-bold font-mono text-slate-700">1.2%</span>。建议指派华南技推专员于 Q2 结束前实施至少一轮“高低温循环可靠性标对宣讲”。
              </p>
            </div>
          </div>

          {/* Action Pathways Recommended by AI */}
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
            <div className="flex items-center gap-1.5 border-b border-slate-50 pb-3 mb-4">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <h4 className="font-semibold text-slate-900 text-sm">推荐推进与突围跟进路径</h4>
            </div>

            <div className="space-y-4 relative pl-3 border-l border-slate-100/80 ml-2">
              {activeGroup.recommendationPaths.map((rec) => (
                <div key={rec.step} className="relative space-y-1">
                  {/* Bullet number count with layout styling */}
                  <div className="absolute -left-[21px] top-0.5 h-3.5 w-3.5 rounded-full bg-indigo-600 text-[8px] font-bold text-white flex items-center justify-center font-sans">
                    {rec.step}
                  </div>
                  <div className="font-bold text-slate-800 text-xs pl-2.5">{rec.title}</div>
                  <p className="text-slate-400 text-[11px] leading-relaxed pl-2.5">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
