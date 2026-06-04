/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GROUP_MOCK_LIST } from '../data/mockData';
import { GroupData } from '../types';
import {
  Building2,
  TrendingUp,
  Users,
  MapPin,
  ShieldCheck,
  ArrowRight,
  ChevronRight
} from 'lucide-react';

interface GroupListModuleProps {
  onNavigateToGroup: (groupId: string) => void;
}

export default function GroupListModule({ onNavigateToGroup }: GroupListModuleProps) {
  return (
    <div className="space-y-6">
      {/* 模块标题 */}
      <div className="border-b border-slate-100 pb-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
          集团画像全景概览
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          查看所有核心企业集团的穿透画像，包括下属机构分布、合作渗透率、风险预警等综合信息
        </p>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2.5 rounded-lg">
              <Building2 className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400">集团总数</div>
              <div className="text-lg font-bold text-slate-800">{GROUP_MOCK_LIST.length} 家</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2.5 rounded-lg">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400">合作集团</div>
              <div className="text-lg font-bold text-slate-800">{GROUP_MOCK_LIST.length} 家</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2.5 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400">平均AI评分</div>
              <div className="text-lg font-bold text-slate-800">
                {(GROUP_MOCK_LIST.reduce((sum, g) => sum + g.aiPotentialScore, 0) / GROUP_MOCK_LIST.length).toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2.5 rounded-lg">
              <MapPin className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400">覆盖大区</div>
              <div className="text-lg font-bold text-slate-800">5 大区</div>
            </div>
          </div>
        </div>
      </div>

      {/* 集团卡片列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {GROUP_MOCK_LIST.map((group) => {
          const partnerRate = ((group.partneredCompanies / group.totalSubCompanies) * 100).toFixed(1);

          return (
            <div
              key={group.id}
              className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
              onClick={() => onNavigateToGroup(group.id)}
            >
              {/* 集团头部 */}
              <div className="flex items-start gap-4">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 shrink-0">
                  <Building2 className="h-7 w-7 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900 text-base truncate">{group.name}</h3>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition" />
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{group.controllingEntity}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                      group.growthCategory === '高增长类'
                        ? 'bg-green-50 text-green-700 border border-green-100'
                        : group.growthCategory === '稳健型'
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : 'bg-slate-50 text-slate-600 border border-slate-200'
                    }`}>
                      {group.growthCategory}
                    </span>
                    <span className="inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {group.partnershipLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* 关键指标 */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-50">
                <div className="text-center">
                  <div className="text-[10px] text-slate-400">总属机构</div>
                  <div className="text-sm font-bold text-slate-800 mt-1">{group.totalSubCompanies} 家</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-400">合作渗透率</div>
                  <div className="text-sm font-bold text-indigo-600 mt-1">{partnerRate}%</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] text-slate-400">AI潜力分</div>
                  <div className="text-sm font-bold text-emerald-600 mt-1">{group.aiPotentialScore}</div>
                </div>
              </div>

              {/* 风险预警 */}
              {group.riskHighlights.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1.5">
                    <div className={`h-1.5 w-1.5 rounded-full ${
                      group.riskHighlights[0].level === 'high' ? 'bg-rose-500' : 'bg-amber-500'
                    }`} />
                    <span className="text-[10px] text-slate-500 truncate flex-1">
                      {group.riskHighlights[0].title}
                    </span>
                    <span className="text-[10px] text-slate-400">{group.riskHighlights[0].date}</span>
                  </div>
                </div>
              )}

              {/* 操作提示 */}
              <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">点击查看集团穿透画像</span>
                <ArrowRight className="h-3.5 w-3.5 text-indigo-500 opacity-0 group-hover:opacity-100 transition" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
