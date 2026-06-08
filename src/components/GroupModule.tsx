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
  Info,
  Sparkles,
  Lightbulb,
  Target
} from 'lucide-react';

interface GroupModuleProps {
  activeGroupId: string;
  onNavigateToCompany: (id: string) => void;
}

export default function GroupModule({ activeGroupId, onNavigateToCompany }: GroupModuleProps) {
  const activeGroup = GROUP_MOCK_LIST.find(g => g.id === activeGroupId) || GROUP_MOCK_LIST[0];

  // Hover state for region popup
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Hover state for business type popup
  const [hoveredBusiness, setHoveredBusiness] = useState<string | null>(null);

  // State for AI diagnosis
  const [aiDiagnosisActive, setAiDiagnosisActive] = useState(false);
  const [aiDiagnosisResult, setAiDiagnosisResult] = useState<any>(null);
  const [aiDiagnosisLoading, setAiDiagnosisLoading] = useState(false);

  // 定义业务类型的子级业务数据
  const businessSubTypes = {
    '元器件检测与筛分': [
      { name: 'IC芯片失效分析', amount: 680 },
      { name: '功率器件筛选测试', amount: 420 },
      { name: '可靠性环境试验', amount: 300 },
      { name: '物料质量检验', amount: 120 }
    ],
    '可靠性试验认证': [
      { name: '环境应力筛选', amount: 450 },
      { name: '电磁兼容测试', amount: 380 },
      { name: '安全认证测试', amount: 280 },
      { name: '可靠性增长试验', amount: 100 }
    ],
    '计量校准服务': [
      { name: '长度计量校准', amount: 320 },
      { name: '电学计量校准', amount: 280 },
      { name: '热工计量校准', amount: 180 },
      { name: '无线电计量', amount: 100 }
    ],
    '软件评测与安全': [
      { name: '软件安全测试', amount: 280 },
      { name: '系统性能评估', amount: 140 },
      { name: '代码审计服务', amount: 80 },
      { name: '渗透测试', amount: 20 }
    ],
    '其他技术服务': [
      { name: '技术咨询服务', amount: 120 },
      { name: '培训服务', amount: 60 },
      { name: '设备维护服务', amount: 40 }
    ]
  };

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

  const handleAiDiagnosis = async () => {
    setAiDiagnosisLoading(true);
    setAiDiagnosisActive(true);

    // 模拟AI分析过程
    setTimeout(() => {
      const diagnosisResult = {
        overallHealth: activeGroup.aiPotentialScore >= 95 ? '优秀' : activeGroup.aiPotentialScore >= 85 ? '良好' : '一般',
        riskLevel: activeGroup.riskHighlights.length > 0 ? '存在风险预警' : '低风险',
        cooperationTrend: activeGroup.partneredCompanies > 10 ? '深度合作' : '初步合作',
        recommendations: [
          {
            category: '集团战略拓展',
            suggestion: `该集团拥有${activeGroup.totalSubCompanies}家子公司，当前合作渗透率${((activeGroup.partneredCompanies / activeGroup.totalSubCompanies) * 100).toFixed(1)}%，建议制定集团级战略合作框架，提升整体渗透率。`
          },
          {
            category: '风险管控',
            suggestion: activeGroup.riskHighlights.length > 0
              ? `当前存在${activeGroup.riskHighlights.length}个风险预警，建议建立专项小组跟进，重点关注：${activeGroup.riskHighlights[0]?.title || '部分子公司合作频度下降'}`
              : '集团整体运营稳定，建议维持常规客户关系管理，定期跟进重要子公司业务动态'
          },
          {
            category: '业务机会',
            suggestion: activeGroup.recommendationPaths.length > 0
              ? `AI推荐路径：${activeGroup.recommendationPaths[0]?.title || '建立集团级战略合作框架'}，${activeGroup.recommendationPaths[0]?.description || ''}`
              : '建议探索集团在新兴业务领域的合作机会，特别是在AI智能应用、数字化转型等前沿技术领域'
          }
        ],
        keyMetrics: {
          aiScore: activeGroup.aiPotentialScore,
          totalCompanies: activeGroup.totalSubCompanies,
          partneredCompanies: activeGroup.partneredCompanies,
          penetrationRate: ((activeGroup.partneredCompanies / activeGroup.totalSubCompanies) * 100).toFixed(1),
          riskCount: activeGroup.riskHighlights.length
        },
        aiConfidence: 0.89
      };

      setAiDiagnosisResult(diagnosisResult);
      setAiDiagnosisLoading(false);
    }, 2000);
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

          {/* Card B: Group Business Overview */}
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
            <div className="flex items-center gap-1.5 border-b border-slate-50 pb-3 mb-4">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <h4 className="font-semibold text-slate-900 text-sm">集团业务情况概览</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* 总体业务指标 */}
              <div className="space-y-3">
                <div className="text-[11px] font-semibold text-slate-700">集团合作总体指标</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="text-[9px] text-slate-400">合作机构数</div>
                    <div className="text-lg font-bold text-indigo-600">{activeGroup.partneredCompanies} 家</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="text-[9px] text-slate-400">合作渗透率</div>
                    <div className="text-lg font-bold text-emerald-600">
                      {((activeGroup.partneredCompanies / activeGroup.totalSubCompanies) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* 主要合作业务类型 */}
              <div className="space-y-3">
                <div className="text-[11px] font-semibold text-slate-700">主要合作业务类型</div>
                <div className="space-y-2">
                  {[
                    { name: '元器件检测与筛分', percent: 35, amount: 1520 },
                    { name: '可靠性试验认证', percent: 28, amount: 1210 },
                    { name: '计量校准服务', percent: 20, amount: 880 },
                    { name: '软件评测与安全', percent: 12, amount: 520 },
                    { name: '其他技术服务', percent: 5, amount: 220 }
                  ].map((business, idx) => (
                    <div key={idx} className="relative">
                      <div
                        className="space-y-1 cursor-pointer hover:bg-slate-50 p-1.5 rounded transition"
                        onMouseEnter={() => setHoveredBusiness(business.name)}
                        onMouseLeave={() => setHoveredBusiness(null)}
                      >
                        <div className="flex justify-between text-[10px]">
                          <span className="text-slate-600 flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-emerald-500" />
                            {business.name}
                          </span>
                          <span className="text-slate-500">{business.percent}% · ¥{business.amount}万</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${business.percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Hover Popup */}
                      {hoveredBusiness === business.name && (
                        <div className="absolute left-full top-0 ml-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 p-3 z-10">
                          <div className="text-xs font-semibold text-slate-900 mb-2 pb-2 border-b border-slate-100">
                            {business.name} - 子级业务详情
                          </div>
                          <div className="space-y-2">
                            {businessSubTypes[business.name as keyof typeof businessSubTypes]?.map((subType, sIdx) => (
                              <div key={sIdx} className="flex justify-between items-center text-[10px]">
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  <div className="h-1 w-1 rounded-full bg-emerald-500 shrink-0" />
                                  <span className="truncate text-slate-600">{subType.name}</span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="font-mono text-emerald-600 font-semibold">
                                    ¥{subType.amount}万
                                  </span>
                                  <span className="text-[8px] text-slate-400 bg-slate-50 px-1 rounded">
                                    {((subType.amount / business.amount) * 100).toFixed(0)}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 pt-2 border-t border-slate-100 text-[9px] text-slate-400 flex justify-between">
                            <span>该业务类型共包含 {businessSubTypes[business.name as keyof typeof businessSubTypes]?.length || 0} 个子级业务</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 业务分布 */}
              <div className="space-y-3">
                <div className="text-[11px] font-semibold text-slate-700">大区业务分布</div>
                <div className="space-y-2">
                  {['华南', '华北', '华东', '西北'].map((region, idx) => {
                    const regionCount = activeGroup.subCompanies.filter(sub => sub.region === region).length;
                    const regionPercent = ((regionCount / activeGroup.totalSubCompanies) * 100).toFixed(0);
                    const regionTotal = activeGroup.subCompanies
                      .filter(sub => sub.region === region && sub.isPartnered)
                      .reduce((sum, sub) => sum + sub.cooperationAmount, 0);
                    const regionSubs = activeGroup.subCompanies.filter(sub => sub.region === region);

                    return (
                      <div key={idx} className="relative">
                        <div
                          className="space-y-1 cursor-pointer hover:bg-slate-50 p-1.5 rounded transition"
                          onMouseEnter={() => setHoveredRegion(region)}
                          onMouseLeave={() => setHoveredRegion(null)}
                        >
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-600 flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-indigo-500" />
                              {region}大区
                            </span>
                            <span className="text-slate-500">{regionCount}机构 ({regionPercent}%) · ¥{(regionTotal / 1000).toFixed(0)}k万</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${regionPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Hover Popup */}
                        {hoveredRegion === region && (
                          <div className="absolute left-full top-0 ml-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 p-3 z-10">
                            <div className="text-xs font-semibold text-slate-900 mb-2 pb-2 border-b border-slate-100">
                              {region}大区子公司详情
                            </div>
                            <div className="space-y-2">
                              {regionSubs.map((sub, sIdx) => (
                                <div key={sIdx} className="flex justify-between items-center text-[10px]">
                                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                    <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                                      sub.isPartnered ? 'bg-indigo-500' : 'bg-slate-300'
                                    }`} />
                                    <span className="truncate text-slate-600">{sub.name.slice(0, 12)}...</span>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {sub.isPartnered && (
                                      <span className="font-mono text-indigo-600 font-semibold">
                                        ¥{sub.cooperationAmount}万
                                      </span>
                                    )}
                                    <span className={`text-[8px] px-1 rounded ${
                                      sub.priority.includes('P0') ? 'bg-rose-100 text-rose-700' :
                                      sub.priority.includes('P1') ? 'bg-amber-100 text-amber-700' :
                                      'bg-slate-100 text-slate-600'
                                    }`}>
                                      {sub.priority.slice(0, 2)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {regionSubs.length === 0 && (
                              <div className="text-[10px] text-slate-400 text-center py-2">
                                该地区暂无子公司
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 优先级分布 */}
            <div>
              <div className="text-[11px] font-semibold text-slate-700 mb-3">开发优先级分布</div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {['极高 P0', '高 P1', '中 P2', '核心挖掘', '战略储备'].map((priority, idx) => {
                  const priorityCount = activeGroup.subCompanies.filter(sub => sub.priority === priority).length;
                  const priorityPercent = ((priorityCount / activeGroup.totalSubCompanies) * 100).toFixed(0);
                  const isHigh = ['极高 P0', '高 P1'].includes(priority);

                  return (
                    <div
                      key={idx}
                      className={`flex-shrink-0 w-24 rounded-lg p-2 border text-center ${
                        isHigh ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="text-[9px] text-slate-400">{priority}</div>
                      <div className={`text-lg font-bold ${isHigh ? 'text-rose-600' : 'text-slate-700'}`}>
                        {priorityCount}
                      </div>
                      <div className="text-[9px] text-slate-400">{priorityPercent}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card C: Subsidiaries Directory Grid */}
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

            {/* 子公司整行卡片展示 */}
            <div className="space-y-3">
              {activeGroup.subCompanies.map((sub, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* 左侧：基本信息 */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* 状态指示点 */}
                      <div className={`h-2 w-2 rounded-full shrink-0 ${
                        sub.isPartnered ? 'bg-indigo-500' : 'bg-slate-300'
                      }`} />

                      {/* 机构名称 */}
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 text-sm truncate">{sub.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-slate-500 font-mono text-[10px] bg-white border border-slate-100 px-1.5 py-0.5 rounded">
                            {sub.region}大区
                          </span>
                          {sub.isPartnered && (
                            <span className="inline-flex rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 border border-indigo-100">
                              已合作
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 中间：核心指标 */}
                    <div className="flex items-center gap-6 shrink-0">
                      {/* 合作金额 */}
                      <div className="text-center">
                        <div className="text-[9px] text-slate-400">合作金额</div>
                        <div className="font-mono font-semibold text-slate-800 text-sm">
                          {sub.isPartnered ? `￥${sub.cooperationAmount}` : '-'}
                        </div>
                      </div>

                      {/* 最后合作时间 */}
                      <div className="text-center">
                        <div className="text-[9px] text-slate-400">最近合作</div>
                        <div className="font-mono text-slate-600 text-xs">{sub.lastDate}</div>
                      </div>

                      {/* 优先级 */}
                      <div>
                        <span className={`inline-flex rounded px-2 py-1 text-[10px] font-bold ${
                          sub.priority.includes('P0') ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                          sub.priority.includes('P1') ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          sub.priority.includes('P2') ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {sub.priority}
                        </span>
                      </div>
                    </div>

                    {/* 右侧：操作按钮 */}
                    <div className="flex items-center gap-2 shrink-0">
                      {sub.isPartnered ? (
                        <button
                          onClick={() => handleDeepDiveSub(sub.name)}
                          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition flex items-center gap-1.5 shadow-sm"
                        >
                          剖析画像
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => alert(`已为该子机构（${sub.name}）自动拉起赛宝实验室专项开发立项表单！当前优先级标等为：${sub.priority}。`)}
                          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition shadow-sm"
                        >
                          立项开发
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 已合作机构的详细信息展开 */}
                  {sub.isPartnered && (
                    <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-4 gap-3 text-[10px]">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">合作状态:</span>
                        <span className="font-medium text-emerald-700">履行中</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">合作时长:</span>
                        <span className="font-medium text-slate-700">3年+</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">年度频次:</span>
                        <span className="font-medium text-slate-700">高频(12+)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">满意度:</span>
                        <span className="font-medium text-indigo-600">优秀</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Column 3 - AI Smart Diagnosis */}
        <div className="space-y-6">
          {/* AI Smart Diagnosis */}
          <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-5 border border-indigo-100 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <h4 className="font-semibold text-slate-900 text-sm">AI 智能诊断</h4>
              </div>
              {!aiDiagnosisActive && (
                <button
                  onClick={handleAiDiagnosis}
                  className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1.5 px-3 rounded-md transition shadow-xs flex items-center gap-1"
                >
                  <Sparkles className="h-3 w-3" />
                  开始诊断
                </button>
              )}
            </div>

            {aiDiagnosisLoading && (
              <div className="bg-white rounded-lg p-4 border border-slate-100 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                  </div>
                  <div className="text-xs text-slate-600">
                    <p className="font-medium">AI 正在分析集团数据...</p>
                    <p className="text-slate-400 mt-1">评估整体状况、风险预警、合作潜力</p>
                  </div>
                </div>
              </div>
            )}

            {aiDiagnosisResult && !aiDiagnosisLoading && (
              <div className="space-y-3 animate-fadeIn">
                {/* Diagnosis Summary */}
                <div className="bg-white rounded-lg p-3 border border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">诊断概要</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">整体状况:</span>
                      <span className={`font-semibold ${aiDiagnosisResult.overallHealth === '优秀' ? 'text-emerald-600' : aiDiagnosisResult.overallHealth === '良好' ? 'text-indigo-600' : 'text-amber-600'}`}>
                        {aiDiagnosisResult.overallHealth}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">风险等级:</span>
                      <span className={`font-semibold ${aiDiagnosisResult.riskLevel === '低风险' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {aiDiagnosisResult.riskLevel}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">合作状态:</span>
                      <span className="font-semibold text-indigo-600">{aiDiagnosisResult.cooperationTrend}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">AI可信度:</span>
                      <span className="font-semibold text-slate-700">{(aiDiagnosisResult.aiConfidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="bg-white rounded-lg p-3 border border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">关键指标</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">AI评分:</span>
                      <span className="font-mono font-bold text-indigo-600">{aiDiagnosisResult.keyMetrics.aiScore}分</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">子公司总数:</span>
                      <span className="font-mono font-bold text-slate-700">{aiDiagnosisResult.keyMetrics.totalCompanies}家</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">已合作数量:</span>
                      <span className="font-mono font-bold text-emerald-600">{aiDiagnosisResult.keyMetrics.partneredCompanies}家</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">渗透率:</span>
                      <span className="font-mono font-bold text-indigo-600">{aiDiagnosisResult.keyMetrics.penetrationRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">风险预警:</span>
                      <span className="font-mono font-bold text-amber-600">{aiDiagnosisResult.keyMetrics.riskCount}个</span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-lg p-3 border border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">智能建议</div>
                  <div className="space-y-2">
                    {aiDiagnosisResult.recommendations.map((rec: any, idx: number) => (
                      <div key={idx} className="text-xs">
                        <div className="font-semibold text-indigo-700 mb-1">{rec.category}</div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{rec.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Alerts (if any) */}
                {activeGroup.riskHighlights.length > 0 && (
                  <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                    <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-2">风险预警</div>
                    <div className="space-y-2">
                      {activeGroup.riskHighlights.map((risk: any, idx: number) => (
                        <div key={idx} className="text-xs">
                          <div className="font-semibold text-amber-800 mb-1">{risk.title}</div>
                          <p className="text-amber-700 text-[11px] leading-relaxed">{risk.description}</p>
                          <div className="text-[10px] text-amber-600 mt-1">{risk.date}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Re-diagnosis Button */}
                <button
                  onClick={handleAiDiagnosis}
                  className="w-full text-center text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 rounded-lg transition border border-indigo-200"
                >
                  重新诊断
                </button>
              </div>
            )}

            {!aiDiagnosisActive && !aiDiagnosisLoading && !aiDiagnosisResult && (
              <div className="text-center py-4 text-xs text-slate-500">
                <Sparkles className="h-8 w-8 mx-auto text-indigo-300 mb-2" />
                <p>点击"开始诊断"按钮</p>
                <p className="text-slate-400 mt-1">AI将全面分析集团整体状况、风险预警、合作潜力</p>
              </div>
            )}
          </div>

          {/* Recommendation Paths (always visible) */}
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
            <div className="flex items-center gap-1.5 border-b border-slate-50 pb-3 mb-4">
              <Target className="h-4 w-4 text-indigo-600" />
              <h4 className="font-semibold text-slate-900 text-sm">推荐合作路径</h4>
            </div>

            <div className="space-y-3">
              {activeGroup.recommendationPaths.map((rec) => (
                <div key={rec.step} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <div className="flex items-start gap-2">
                    <div className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {rec.step}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800 text-xs mb-1">{rec.title}</div>
                      <p className="text-slate-500 text-[11px] leading-relaxed">{rec.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
