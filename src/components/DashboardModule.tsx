/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Company, GroupData } from '../types';
import { COMP_MOCK_LIST, CONTRACTS_SUMMARY } from '../data/mockData';
import {
  TrendingUp,
  Layers,
  Briefcase,
  Users,
  Building,
  ArrowRight,
  Activity,
  ExternalLink,
  Check,
  Plus,
  Trash2,
  Lock,
  ChevronRight,
  DollarSign,
  BarChart3,
  AlertTriangle,
  Sparkles,
  Lightbulb,
  Target,
  Info,
  X
} from 'lucide-react';

interface DashboardProps {
  onNavigateToCompany: (id: string) => void;
  onNavigateToGroup: (id: string) => void;
  onNavigateToTab: (tabId: string) => void;
  onOpenAIChat?: () => void;
}

export default function DashboardModule({
  onNavigateToCompany,
  onNavigateToGroup,
  onNavigateToTab,
  onOpenAIChat
}: DashboardProps) {
  // Enterprise comparison state
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Dashboard analysis state
  const [analysisActive, setAnalysisActive] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // 处理数据大盘分析
  const handleDashboardAnalysis = async () => {
    setAnalysisLoading(true);
    setAnalysisActive(true);

    // 模拟AI分析过程
    setTimeout(() => {
      const totalAmount = parseFloat(CONTRACTS_SUMMARY.totalAmountBillions) * 10000; // 转换为万元
      const growthRate = parseFloat(CONTRACTS_SUMMARY.comparisonYoY) / 100;

      const analysisData = {
        overview: {
          totalAmount: Math.round(totalAmount),
          growthRate: growthRate,
          activeClients: 12678,
          avgContractValue: Math.round(totalAmount / 12678),
          marketPosition: '行业领先'
        },
        keyFindings: [
          {
            category: '业务增长',
            trend: '强劲上升',
            summary: `合同总额同比增长${CONTRACTS_SUMMARY.comparisonYoY}，处于稳健增长通道`,
            insight: 'Q2季度表现超预期，预计全年可实现15%以上的增长目标'
          },
          {
            category: '客户结构',
            trend: '优化升级',
            summary: '战略级客户合作深度持续提升，头部客户贡献占比超过65%',
            insight: '建议重点维护TOP20客户，同时关注腰部客户的成长潜力'
          },
          {
            category: '业务分布',
            trend: '均衡发展',
            summary: '元器件检测、可靠性试验、计量校准三大支柱业务均衡发展',
            insight: '软件测试和低空经济业务增长迅速，建议加大相关领域投入'
          }
        ],
        riskAnalysis: {
          overallRisk: '低风险',
          riskFactors: [
            { level: 'low', issue: '整体业务风险可控，财务状况良好' },
            { level: 'medium', issue: '部分区域市场竞争加剧，需关注价格压力' },
            { level: 'low', issue: '客户集中度适中，单一客户依赖风险较低' }
          ]
        },
        recommendations: [
          {
            priority: '高',
            title: '深化头部客户合作',
            description: '针对AI评分≥90的头部客户，制定专项深化合作方案，提升单客户贡献度'
          },
          {
            priority: '中',
            title: '拓展新兴业务领域',
            description: '抓住低空经济、AI软件测试等新兴业务机遇，抢占市场先机'
          },
          {
            priority: '高',
            title: '优化区域布局',
            description: '加强华东、华北等重点区域的业务拓展，平衡区域业务分布'
          }
        ],
        forecast: {
          nextQuarter: '预计Q3合同额可达8.5亿元，环比增长12%',
          annualTarget: '全年目标完成概率92%，建议提前准备Q4冲刺计划',
          marketOutlook: '行业整体需求旺盛，预计下半年市场空间将进一步释放'
        }
      };

      setAnalysisResult(analysisData);
      setAnalysisLoading(false);
    }, 2500);
  };

  // Line Trend data (12 months overview of contract amounts in 10k yuan unit)
  const trendData = [
    { month: '1月', val2023: 540, val2024: 680 },
    { month: '2月', val2023: 420, val2024: 510 },
    { month: '3月', val2023: 680, val2024: 820 },
    { month: '4月', val2023: 790, val2024: 950 },
    { month: '5月', val2023: 920, val2024: 1220 },
    { month: '6月', val2023: 1100, val2024: 1350 },
    { month: '7月', val2023: 850, val2024: 1020 },
    { month: '8月', val2023: 940, val2024: 1180 },
    { month: '9月', val2023: 1250, val2024: 1490 },
    { month: '10月', val2023: 1050, val2024: 1310 },
    { month: '11月', val2023: 1180, val2024: 1450 },
    { month: '12月', val2023: 1390, val2024: 1720 }
  ];

  // Category values comparison
  const categoryData = [
    { name: '元器件检测', val2022: 45.4, val2023: 58.2 },
    { name: '认证与合规', val2022: 21.0, val2023: 28.5 },
    { name: '精密计量校准', val2022: 15.4, val2023: 20.8 },
    { name: '软硬件数字化开发', val2022: 18.9, val2023: 25.1 },
    { name: 'TSQ职业技能评估', val2022: 8.9, val2023: 11.4 }
  ];

  return (
    <div className="space-y-6">
      {/* Dynamic Header Badge Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
            赛宝智能决策舱 · 运营大盘研判
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            工业和信息化部电子第五研究所（赛宝实验室）面向行业主力企业的合作数据、合同履约及业务大盘管理门户
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 border border-emerald-100 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            全区数据实时贯通
          </span>
          <button
            id="btn-goto-ai-chat"
            onClick={onOpenAIChat}
            className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-indigo-700 transition"
          >
            AI 智能对话
            <ChevronRight className="h-3 w-3" />
          </button>
          <button
            id="btn-dashboard-analysis"
            onClick={handleDashboardAnalysis}
            className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-xs hover:bg-emerald-700 transition"
          >
            大盘分析
            <Sparkles className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Dashboard Analysis Results */}
      {analysisActive && (
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-5 border border-emerald-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <h3 className="font-semibold text-slate-900 text-sm">数据大盘智能分析</h3>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-emerald-100">
                AI驱动
              </span>
            </div>
            <button
              onClick={() => setAnalysisActive(false)}
              className="text-slate-400 hover:text-slate-600 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {analysisLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative w-12 h-12 mb-3">
                <div className="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-sm text-slate-600">AI 正在深度分析大盘数据...</p>
              <p className="text-xs text-slate-400 mt-1">评估业务趋势、风险指标、增长机会</p>
            </div>
          ) : analysisResult ? (
            <div className="space-y-4 animate-fadeIn">
              {/* 总体概览 */}
              <div className="bg-white rounded-lg p-4 border border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">总体概览</div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center">
                    <div className="font-mono text-lg font-bold text-indigo-600">{analysisResult.overview.totalAmount}万</div>
                    <div className="text-[10px] text-slate-400">合作总额</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono text-lg font-bold text-emerald-600">{(analysisResult.overview.growthRate * 100).toFixed(1)}%</div>
                    <div className="text-[10px] text-slate-400">增长率</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono text-lg font-bold text-slate-700">{analysisResult.overview.activeClients.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400">活跃客户</div>
                  </div>
                  <div className="text-center">
                    <div className="font-mono text-lg font-bold text-amber-600">{(analysisResult.overview.avgContractValue / 10000).toFixed(1)}亿</div>
                    <div className="text-[10px] text-slate-400">户均合同</div>
                  </div>
                </div>
              </div>

              {/* 关键发现 */}
              <div className="bg-white rounded-lg p-4 border border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-indigo-600" />
                  关键发现
                </div>
                <div className="space-y-3">
                  {analysisResult.keyFindings.map((finding: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`h-2 w-2 rounded-full mt-1.5 ${
                        finding.trend === '强劲上升' ? 'bg-emerald-500' :
                        finding.trend === '优化升级' ? 'bg-indigo-500' :
                        'bg-amber-500'
                      }`}></div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-slate-800 mb-1">{finding.category} · {finding.trend}</div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{finding.summary}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{finding.insight}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 风险分析 */}
              <div className="bg-white rounded-lg p-4 border border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">风险分析</div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-slate-600">整体风险等级:</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    analysisResult.riskAnalysis.overallRisk === '低风险' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {analysisResult.riskAnalysis.overallRisk}
                  </span>
                </div>
                <div className="space-y-2">
                  {analysisResult.riskAnalysis.riskFactors.map((factor: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <div className={`h-1.5 w-1.5 rounded-full ${
                        factor.level === 'low' ? 'bg-emerald-500' :
                        factor.level === 'medium' ? 'bg-amber-500' :
                        'bg-rose-500'
                      }`}></div>
                      <span className="text-slate-600">{factor.issue}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 智能建议 */}
              <div className="bg-white rounded-lg p-4 border border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
                  智能建议
                </div>
                <div className="space-y-3">
                  {analysisResult.recommendations.map((rec: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                        rec.priority === '高' ? 'bg-rose-500 text-white' :
                        rec.priority === '中' ? 'bg-amber-500 text-white' :
                        'bg-slate-400 text-white'
                      }`}>
                        {rec.priority === '高' ? '高' : rec.priority === '中' ? '中' : '低'}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 text-xs mb-1">{rec.title}</div>
                        <p className="text-slate-500 text-[11px] leading-relaxed">{rec.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 预测展望 */}
              <div className="bg-gradient-to-br from-indigo-50 to-white rounded-lg p-4 border border-indigo-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-indigo-600" />
                  预测展望
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5"></div>
                    <p className="text-slate-600 leading-relaxed">{analysisResult.forecast.nextQuarter}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5"></div>
                    <p className="text-slate-600 leading-relaxed">{analysisResult.forecast.annualTarget}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-sky-500 mt-1.5"></div>
                    <p className="text-slate-600 leading-relaxed">{analysisResult.forecast.marketOutlook}</p>
                  </div>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-center gap-3 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setAnalysisActive(false)}
                  className="px-6 py-2 text-xs bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
                >
                  返回数据看板
                </button>
                <button
                  onClick={handleDashboardAnalysis}
                  className="px-6 py-2 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                  重新分析
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* KPI Card Grid - 3 Core Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1: 合同总额 */}
        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-4 border border-indigo-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <DollarSign className="h-4 w-4 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">合同总额</h4>
              <p className="text-[10px] text-slate-400">年度累计签约总额</p>
            </div>
          </div>
          <div className="text-center my-3">
            <div className="font-mono text-2xl font-bold text-slate-900">
              {CONTRACTS_SUMMARY.totalAmountBillions}
            </div>
            <div className="text-xs text-slate-400 mt-1">亿元</div>
          </div>
          <div className="pt-3 border-t border-indigo-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">同比增长</span>
            <span className="font-mono font-bold text-indigo-600">{CONTRACTS_SUMMARY.comparisonYoY}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-indigo-600">
            <TrendingUp className="h-3 w-3" />
            <span className="font-medium">持续增长</span>
          </div>
        </div>

        {/* KPI 2: 合作客户数 */}
        <div className="bg-gradient-to-br from-sky-50 to-white rounded-xl p-4 border border-sky-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-sky-100 rounded-lg">
              <Users className="h-4 w-4 text-sky-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">合作客户数</h4>
              <p className="text-[10px] text-slate-400">当前在合作客户总数</p>
            </div>
          </div>
          <div className="text-center my-3">
            <div className="font-mono text-2xl font-bold text-slate-900">
              12,678
            </div>
            <div className="text-xs text-slate-400 mt-1">家企业</div>
          </div>
          <div className="pt-3 border-t border-sky-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">同比增长</span>
            <span className="font-mono font-bold text-sky-600">{CONTRACTS_SUMMARY.comparisonYoY}</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-sky-600">
            <TrendingUp className="h-3 w-3" />
            <span className="font-medium">持续增长</span>
          </div>
        </div>

        {/* KPI 3: 累计合作客户数 */}
        <div className="bg-gradient-to-br from-rose-50 to-white rounded-xl p-4 border border-rose-100">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-rose-100 rounded-lg">
              <BarChart3 className="h-4 w-4 text-rose-600" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">累计合作客户数</h4>
              <p className="text-[10px] text-slate-400">历史累计合作客户总数</p>
            </div>
          </div>
          <div className="text-center my-3">
            <div className="font-mono text-2xl font-bold text-slate-900">
              22,043
            </div>
            <div className="text-xs text-slate-400 mt-1">家企业</div>
          </div>
          <div className="pt-3 border-t border-rose-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">同比增长</span>
            <span className="font-mono font-bold text-rose-600">+8.06%</span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-xs text-rose-600">
            <TrendingUp className="h-3 w-3" />
            <span className="font-medium">稳定增长</span>
          </div>
        </div>
      </div>

      {/* Customer Statistics Cards */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-indigo-600" />
          <h3 className="font-semibold text-slate-900">客户统计分析</h3>
          <span className="ml-auto text-xs text-slate-400">统计周期：本年度</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: 首次合作金额 */}
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-4 border border-emerald-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">首次合作金额</h4>
                <p className="text-[10px] text-slate-400">本年度新客户合作总额</p>
              </div>
            </div>
            <div className="text-center my-3">
              <div className="font-mono text-2xl font-bold text-emerald-600">
                ¥8,420
              </div>
              <div className="text-xs text-slate-400 mt-1">万元</div>
            </div>
            <div className="pt-3 border-t border-emerald-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">占总额比例</span>
              <span className="font-mono font-bold text-emerald-600">27.8%</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
              <TrendingUp className="h-3 w-3" />
              <span className="font-medium">同比 +12.5%</span>
            </div>
          </div>

          {/* Card 2: 首次合作客户数量 */}
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">首次合作客户数</h4>
                <p className="text-[10px] text-slate-400">本年度新签约客户数量</p>
              </div>
            </div>
            <div className="text-center my-3">
              <div className="font-mono text-2xl font-bold text-blue-600">
                156
              </div>
              <div className="text-xs text-slate-400 mt-1">家企业</div>
            </div>
            <div className="pt-3 border-t border-blue-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">客户总数</span>
              <span className="font-mono font-bold text-blue-600">12,678家</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
              <TrendingUp className="h-3 w-3" />
              <span className="font-medium">同比 +8.3%</span>
            </div>
          </div>

          {/* Card 3: 连续两年未签订合同金额客户统计 */}
          <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-4 border border-amber-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm">流失风险客户</h4>
                <p className="text-[10px] text-slate-400">连续两年未签订合同客户</p>
              </div>
            </div>
            <div className="text-center my-3">
              <div className="font-mono text-2xl font-bold text-amber-600">
                42
              </div>
              <div className="text-xs text-slate-400 mt-1">家企业</div>
            </div>
            <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">涉及金额</span>
              <span className="font-mono font-bold text-amber-600">¥2,180万</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-amber-600">
              <Briefcase className="h-3 w-3" />
              <span className="font-medium">需重点关注</span>
            </div>
          </div>
        </div>
      </div>

      {/* New Analysis Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 1: 各区域客户合作金额分析 */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">各区域客户合作金额分析</h3>
              <p className="text-xs text-slate-400 mt-0.5">单位：亿元 | 百分比</p>
            </div>
          </div>

          {/* 区域数据 */}
          <div className="space-y-3">
            {[
              { region: '华东', amount: 28.9, percent: 28.9, color: 'bg-indigo-500' },
              { region: '华南', amount: 34.3, percent: 34.3, color: 'bg-sky-500' },
              { region: '华中', amount: 20.0, percent: 9.5, color: 'bg-emerald-500' },
              { region: '华北', amount: 13.8, percent: 13.8, color: 'bg-cyan-500' },
              { region: '西南', amount: 4.5, percent: 4.5, color: 'bg-blue-600' },
              { region: '西北', amount: 6.3, percent: 6.3, color: 'bg-teal-500' },
              { region: '东北', amount: 2.1, percent: 2.1, color: 'bg-slate-400' }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{item.region}</span>
                  <span className="font-mono text-slate-600">
                    {item.amount}亿元 <span className="text-slate-400">({item.percent}%)</span>
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-700`}
                    style={{ width: `${item.percent * 2.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 总计 */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-400">总计合作金额：</span>
            <span className="font-mono text-lg font-bold text-indigo-600 ml-1">109.9亿元</span>
          </div>
        </div>

        {/* Chart 2: 合作客户合同额及客户数量分析 */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">合作客户合同额及客户数量分析</h3>
              <p className="text-xs text-slate-400 mt-0.5">单位：亿元 | 个</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                客户合同总额
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-sky-500" />
                合作客户数量
              </span>
            </div>
          </div>

          {/* 双轴柱状图 */}
          <div className="space-y-3">
            {[
              { range: '10万以下', amount: 12.8, customers: 333 },
              { range: '10-100万', amount: 9.8, customers: 302 },
              { range: '100-500万', amount: 17.8, customers: 232 },
              { range: '500-1000万', amount: 9.8, customers: 91 },
              { range: '1000万以上', amount: 13.6, customers: 73 }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{item.range}</span>
                  <div className="flex gap-3 text-xs">
                    <span className="text-indigo-600">¥{item.amount}亿</span>
                    <span className="text-sky-600">{item.customers}个</span>
                  </div>
                </div>
                <div className="space-y-1 bg-slate-50/50 p-1.5 rounded-md border border-slate-100">
                  {/* 客户合同总额 */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                      style={{ width: `${(item.amount / 20) * 100}%` }}
                    />
                  </div>
                  {/* 合作客户数量 */}
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500 rounded-full transition-all duration-700"
                      style={{ width: `${(item.customers / 400) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 注释 */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 text-center">
              * 横坐标为客户的合作金额区间值
            </p>
          </div>
        </div>

      </div>

      {/* Business Distribution Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 3: 业务类型环形图 */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
            <h3 className="font-semibold text-slate-900 text-sm">业务类型</h3>
          </div>

          <div className="flex items-center gap-6">
            {/* 环形图区域 */}
            <div className="relative w-40 h-40 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* 背景圆环 */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="12" />

                {/* 数据段 - 检验检测 41.35% */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="12"
                  strokeDasharray={`${41.35 * 2.513} 251.3`}
                  strokeDashoffset="0"
                  className="transition-all duration-1000"
                />

                {/* 认证评估 16.35% */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="12"
                  strokeDasharray={`${16.35 * 2.513} 251.3`}
                  strokeDashoffset={`-${41.35 * 2.513}`}
                  className="transition-all duration-1000"
                />

                {/* 计量校准 14.85% */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="12"
                  strokeDasharray={`${14.85 * 2.513} 251.3`}
                  strokeDashoffset={`-${(41.35 + 16.35) * 2.513}`}
                  className="transition-all duration-1000"
                />

                {/* 产品开发 8.85% */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="12"
                  strokeDasharray={`${8.85 * 2.513} 251.3`}
                  strokeDashoffset={`-${(41.35 + 16.35 + 14.85) * 2.513}`}
                  className="transition-all duration-1000"
                />

                {/* TSQ培训 15.85% */}
                <circle
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="12"
                  strokeDasharray={`${15.85 * 2.513} 251.3`}
                  strokeDashoffset={`-${(41.35 + 16.35 + 14.85 + 8.85) * 2.513}`}
                  className="transition-all duration-1000"
                />
              </svg>

              {/* 中心文字 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-mono text-lg font-bold text-slate-900">30.31</div>
                <div className="text-[10px] text-slate-400">亿元</div>
              </div>
            </div>

            {/* 图例 */}
            <div className="flex-1 space-y-2">
              {[
                { name: '检验检测', amount: '19.87亿', percent: '41.35%', color: 'bg-indigo-500' },
                { name: '认证、评估', amount: '5.45亿', percent: '16.35%', color: 'bg-sky-500' },
                { name: '计量校准', amount: '4.86亿', percent: '14.85%', color: 'bg-emerald-500' },
                { name: '产品开发与销售', amount: '3.21亿', percent: '8.85%', color: 'bg-orange-500' },
                { name: 'TSQ（含培训）', amount: '5.21亿', percent: '15.85%', color: 'bg-violet-500' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${item.color}`}></span>
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-mono text-slate-700">{item.amount} <span className="text-slate-400">({item.percent})</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 4: 业务归属部门条形图 */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
            <h3 className="font-semibold text-slate-900 text-sm">业务归属部门</h3>
            <div className="flex gap-1.5">
              <button className="text-[10px] px-2 py-1 bg-indigo-600 text-white rounded-md">总占比</button>
              <button className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded-md">目标占比</button>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { name: '元器件与材料板块', amount: 12.5, percent: 25.23 },
              { name: '装备与整机板块', amount: 9.1, percent: 18.25 },
              { name: '软件与系统板块', amount: 8.1, percent: 16.54 },
              { name: '认证中心', amount: 5.1, percent: 10.32 },
              { name: '计量检测中心', amount: 4.6, percent: 9.58 },
              { name: '广五所', amount: 4.5, percent: 9.24 },
              { name: '随春', amount: 4.3, percent: 8.98 }
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{item.name}</span>
                  <span className="font-mono text-slate-600">
                    {item.amount}亿 <span className="text-slate-400">({item.percent}%)</span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-700"
                    style={{ width: `${(item.amount / 12.5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart A: 合同周期金额趋势 (2023 vs 2024) - SVG Interactive */}
        <div id="chart-card-trend" className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">合同金额月度趋势对比 (万元)</h3>
              <p className="text-xs text-slate-400">横向对比 2023 年与 2024 年同周期签约金额流转</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-300"></span>
                2023 周期
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                2024 周期
              </span>
            </div>
          </div>

          {/* Clean Custom SVG Line Chart */}
          <div className="relative h-60 w-full mt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 240">
              {/* Grid Lines */}
              {[0, 60, 120, 180, 240].map((y, i) => (
                <line 
                  key={i} 
                  x1="40" 
                  y1={y} 
                  x2="680" 
                  y2={y} 
                  stroke="#f1f5f9" 
                  strokeWidth="1" 
                />
              ))}

              {/* Grid Y Axis Labels */}
              <text x="5" y="10" className="text-[10px] font-mono fill-slate-400">1800万</text>
              <text x="5" y="70" className="text-[10px] font-mono fill-slate-400">1350万</text>
              <text x="5" y="130" className="text-[10px] font-mono fill-slate-400">900万</text>
              <text x="5" y="190" className="text-[10px] font-mono fill-slate-400">450万</text>
              <text x="5" y="240" className="text-[10px] font-mono fill-slate-400">0万</text>

              {/* Generate SVG Path coordinates for 2023 and 2024 */}
              {/* X spacing: step is (680 - 40) / 11 = 58.18 */}
              {(() => {
                const getCoords = (yearKey: 'val2023' | 'val2024') => {
                  return trendData.map((d, index) => {
                    const x = 40 + index * 58.18;
                    // Max value of charts is 1800
                    const y = 240 - (d[yearKey] / 1800) * 240;
                    return { x, y, value: d[yearKey], ...d };
                  });
                };
                
                const c2023 = getCoords('val2023');
                const c2024 = getCoords('val2024');

                const path2023Str = c2023.reduce((acc, coord, i) => 
                  acc + `${i === 0 ? 'M' : 'L'} ${coord.x} ${coord.y}`, '');
                const path2024Str = c2024.reduce((acc, coord, i) => 
                  acc + `${i === 0 ? 'M' : 'L'} ${coord.x} ${coord.y}`, '');

                return (
                  <>
                    {/* Shadow Area for 2024 */}
                    <path 
                      d={`${path2024Str} L 680 240 L 40 240 Z`}
                      fill="url(#indigo-gradient-light)"
                      opacity="0.2"
                    />

                    {/* Gradient Definition */}
                    <defs>
                      <linearGradient id="indigo-gradient-light" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f46e5" />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Lines */}
                    <path 
                      d={path2023Str} 
                      fill="none" 
                      stroke="#cbd5e1" 
                      strokeWidth="2" 
                      strokeDasharray="4"
                    />
                    <path 
                      d={path2024Str} 
                      fill="none" 
                      stroke="#4f46e5" 
                      strokeWidth="3" 
                    />

                    {/* Interactive overlay points */}
                    {c2024.map((pt, i) => (
                      <g 
                        key={i} 
                        onMouseEnter={() => setHoveredTrendIndex(i)}
                        onMouseLeave={() => setHoveredTrendIndex(null)}
                        className="cursor-pointer"
                      >
                        {/* Interactive vertical hover indicator line */}
                        {hoveredTrendIndex === i && (
                          <line 
                            x1={pt.x} 
                            y1="0" 
                            x2={pt.x} 
                            y2="240" 
                            stroke="#818cf8" 
                            strokeWidth="1" 
                            strokeDasharray="2"
                          />
                        )}

                        {/* Anchor points */}
                        <circle cx={pt.x} cy={pt.y} r="5" fill="#4f46e5" stroke="white" strokeWidth="2" />
                        <circle cx={pt.x} cy={c2023[i].y} r="4" fill="#94a3b8" stroke="white" strokeWidth="1.5" />
                      </g>
                    ))}
                  </>
                );
              })()}

              {/* Month Titles */}
              {trendData.map((d, i) => (
                <text 
                  key={i} 
                  x={40 + i * 58.18} 
                  y="255" 
                  textAnchor="middle" 
                  className="text-[10px] fill-slate-400 font-sans"
                >
                  {d.month}
                </text>
              ))}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredTrendIndex !== null && (
              <div 
                className="absolute bg-slate-950/95 text-white p-2.5 rounded shadow-lg text-xs font-sans z-30 pointer-events-none"
                style={{
                  left: `${(hoveredTrendIndex / 11) * 82 + 5}%`,
                  top: '10px'
                }}
              >
                <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1 mb-1.5">
                  {trendData[hoveredTrendIndex].month} 数据对标
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">2024年 (今):</span>
                  <span className="font-mono text-indigo-300 font-bold">
                    ￥{trendData[hoveredTrendIndex].val2024} 万元
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">2023年 (昨):</span>
                  <span className="font-mono text-slate-300">
                    ￥{trendData[hoveredTrendIndex].val2023} 万元
                  </span>
                </div>
                <div className="mt-1 text-[10px] text-emerald-400">
                  同比增长 +{((trendData[hoveredTrendIndex].val2024 - trendData[hoveredTrendIndex].val2023) / trendData[hoveredTrendIndex].val2023 * 100).toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chart B: 业务营收分布同比 (Bar Chart) */}
        <div id="chart-card-distribution" className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">业务科目营收分布 (亿元)</h3>
              <p className="text-xs text-slate-400">各年度主力测试校准认证业务累计占比</p>
            </div>
          </div>

          <div className="space-y-4">
            {categoryData.map((cat, index) => {
              const maxVal = 60; // scale limit
              const percent2022 = (cat.val2022 / maxVal) * 100;
              const percent2023 = (cat.val2023 / maxVal) * 100;

              return (
                <div 
                  key={index}
                  className="group space-y-1"
                  onMouseEnter={() => setHoveredBarIndex(index)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                >
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="font-medium text-slate-800">{cat.name}</span>
                    <span className="font-mono text-slate-400">
                      今 <span className="text-indigo-600 font-bold font-mono">{cat.val2023}</span> / 昨 <span className="font-mono">{cat.val2022}</span> 亿
                    </span>
                  </div>

                  <div className="space-y-1 bg-slate-50 rounded-sm p-1.5 border border-slate-100/50">
                    {/* 2023 Bar */}
                    <div className="w-full bg-slate-200/50 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${percent2023}%` }}
                      />
                    </div>
                    {/* 2022 Bar */}
                    <div className="w-full bg-slate-200/50 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-slate-400 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${percent2022}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-3 rounded-lg border border-dashed border-slate-100 bg-slate-50 text-xs text-slate-500">
            赛宝实验室 “元器件检测与失效筛分” 仍是绝对主导业务，但受新型智造影响，“软硬件数字化开发和车规测试” 年增长高达 <span className="font-bold text-slate-700">32.8%</span>。
          </div>
        </div>
      </div>

      {/* Cooperation Ranking / Activity list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table Column - 2/3 width */}
        <div id="section-enterprise-list" className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">赛宝核心合作伙伴往来总览</h3>
              <p className="text-xs text-slate-400">最近汇总签约数据及对接活跃情况评估，支持快速导向深层画像</p>
            </div>
            <button 
              onClick={() => onNavigateToTab('enterpriseSearch')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              高级多维筛选
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-medium text-slate-400 uppercase">
                  <th className="py-2.5 px-3">企业机构</th>
                  <th className="py-2.5 px-3">合作层级</th>
                  <th className="py-2.5 px-3">智能评分</th>
                  <th className="py-2.5 px-3">合作深度</th>
                  <th className="py-2.5 px-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {COMP_MOCK_LIST.map((comp) => {
                  const currentYearTotal = comp.metrics[1] 
                    ? Object.values(comp.metrics[1]).slice(1).reduce((a, b) => (a as number) + (b as number), 0) as number
                    : 0;

                  return (
                    <tr key={comp.id} className="hover:bg-slate-50/50 transition duration-150">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img 
                            src={comp.logo} 
                            alt={comp.name} 
                            className="h-7 w-7 rounded-sm border border-slate-100 object-contain p-0.5"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-semibold text-slate-800">{comp.name}</div>
                            <div className="text-[10px] text-slate-400">{comp.type} | {comp.industry}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium leading-4 ${
                          comp.partnershipLevel.includes('战略') 
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {comp.partnershipLevel}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-8 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${comp.aiScore}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-slate-700">{comp.aiScore}分</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-mono text-slate-800 font-semibold">
                          ￥{(currentYearTotal / 10).toFixed(1)} <span className="text-[10px] text-slate-400">千万</span>
                        </div>
                        <div className="text-[10px] text-slate-400">2023全年在单</div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            id={`btn-view-portrait-${comp.id}`}
                            onClick={() => onNavigateToCompany(comp.id)}
                            className="inline-flex items-center gap-0.5 rounded px-2 py-1 text-slate-600 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 transition"
                          >
                            <ExternalLink className="h-3 w-3" />
                            深剖画像
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Multi-tier Operational Dept Comparison (协同部室表现) */}
      <div id="section-departments-contributions" className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-50 pb-3 mb-4">
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">赛宝核心涉外部室业务承接对标</h3>
            <p className="text-xs text-slate-400">元器件检测所、可靠性试验中心、低空产业处等重点部门季度在手业务额及比重</p>
          </div>
          <span className="text-xs text-slate-400">数据截至昨日下班时间</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { dept: '元器件检测所', role: '元器件失效筛分、可靠性物理鉴定', amount: '1,240万元', trend: '↑ 14.5%', efficiency: '98.5%', statusColor: 'bg-indigo-500' },
            { dept: '低空产业部', role: '低空物联、无人机飞控系统合格审定', amount: '840万元', trend: '↑ 34.2%', efficiency: '96.2%', statusColor: 'bg-sky-500' },
            { dept: '技术成果推广处', role: '大型央国企、地方百强引进入所对接', amount: '620万元', trend: '↓ 2.1%', efficiency: '94.0%', statusColor: 'bg-emerald-500' },
            { dept: '软件测试与评测中心', role: '安全级软件代码审计、车规算法健壮性', amount: '560万元', trend: '↑ 8.8%', efficiency: '99.1%', statusColor: 'bg-violet-500' }
          ].map((item, i) => (
            <div key={i} className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 hover:border-indigo-100 transition duration-300">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${item.statusColor}`} />
                <span className="font-semibold text-slate-800 text-xs">{item.dept}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{item.role}</p>

              <div className="mt-3.5 flex justify-between items-baseline">
                <div>
                  <span className="font-mono text-lg font-bold text-slate-900">{item.amount}</span>
                  <span className="text-[10px] text-slate-400 ml-1">在库合同</span>
                </div>
                <span className={`text-[10px] font-mono leading-none ${item.trend.includes('↑') ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {item.trend}
                </span>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 flex justify-between items-center text-[10px]">
                <span className="text-slate-400">Q2交付合格率:</span>
                <span className="font-mono text-slate-700 font-bold">{item.efficiency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
