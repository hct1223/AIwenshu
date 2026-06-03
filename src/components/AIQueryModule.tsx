/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { COMMON_AI_QUESTIONS } from '../data/mockData';
import { 
  Send, 
  MessageSquare, 
  Sparkles, 
  Download, 
  Trash2, 
  FileText, 
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  RefreshCw,
  ChevronRight,
  Info
} from 'lucide-react';

interface AIReportPayload {
  title: string;
  subtitle: string;
  date: string;
  overview: string;
  meta: {
    baseVolume: string;
    yoyRatio: string;
    riskTrend: string;
  };
  metrics: { label: string; value: string; trend: string }[];
  visualData: { label: string; curYear: number; prevYear: number }[];
  bulletPoints: string[];
}

export default function AIQueryModule() {
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState<{
    id: string;
    role: 'user' | 'assistant';
    text: string;
    report?: AIReportPayload;
  }[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: '领导您好！我是赛宝智能大盘助手。您可以直接向我询问特定业务指标、项目签约同比、或者高风险客户流变等课题。我将即刻调集赛宝实验室的检测数据及合约大盘，为您构建可视化分析报告，并支持一键导出为标准的 PDF A4 规格文档。'
    }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Hardcoded generative logic matching predefined keys to make the reports realistic
  const generateMockReport = (prompt: string): AIReportPayload => {
    const isSouthYoY = prompt.includes('华南') || prompt.includes('增速') || prompt.includes('同比');
    const isRisk = prompt.includes('风险') || prompt.includes('流失') || prompt.includes('预警');
    const isEast = prompt.includes('华东') || prompt.includes('潜力');

    if (isRisk) {
      return {
        title: '赛宝华南大客户流失风险评级与供应链外包异动研判报告',
        subtitle: '基于最近半年回账速率、走访交流频度及第三方替代倾向评估',
        date: '2026年Q2度最新出具',
        overview: '本报告对华南区近12个月存在合作记录的 88 家核心大型子公司进行全量信用透视。结果显示，74% 的主体合作流变处于“极度安全与粘度上升”通道，但部分关联机构在外部商业检测机构（如合肥微测、华测）的低价外包干涉下，签约份额出现 4.8% 的局部回撤。',
        meta: {
          baseVolume: '1.24 亿元',
          yoyRatio: '微幅下滑 -2.5%',
          riskTrend: '中度波动预警'
        },
        metrics: [
          { label: '高危关注实体名单', value: '3 家子公司', trend: '关联比重 4.8%' },
          { label: '财务回溯账款均值', value: '45 天内付讫', trend: '付款情绪稳健' },
          { label: '季度访谈覆盖率', value: '92.6%', trend: '技推处专人跟进' }
        ],
        visualData: [
          { label: '精密设备外协', curYear: 780, prevYear: 920 },
          { label: '车载芯片失效', curYear: 1840, prevYear: 1450 },
          { label: '常规计量标定', curYear: 510, prevYear: 680 },
          { label: 'TSQ职业培训', curYear: 280, prevYear: 210 }
        ],
        bulletPoints: [
          '华为机器子公司在常规环境耐受试验中出现份额微缩，需尽快升级发布赛宝【高精高速温循应力筛选】最新方案。',
          '对中兴、比亚迪旗下子机构在手长单实施“月度返访”，强化实验室主任级联动，降低采购整合引发的合同缩编风险。',
          '利用增城基地的低空评测试验资质，配合地方低空产业专班，将物联模块失效评价作为增量锚点。'
        ]
      };
    } else if (isEast) {
      return {
        title: '华东区高潜力、高粘度高新技术企业开发推荐书',
        subtitle: '基于注册规模、参保员工实力及检测合规评测挖掘',
        date: '2026年Q2度最新出具',
        overview: '对华东区域（江苏、浙江、安徽）近期存在半导体封装、轨道电磁相容需求的科技独角兽开展全网多指标画像穿透。本季度筛选并推荐共 5 家具备赛宝实验室核心合作强粘度契合特征的企业。',
        meta: {
          baseVolume: '3.80 亿元',
          yoyRatio: '潜在年签约增速估计 +38%',
          riskTrend: '战略挖掘储备'
        },
        metrics: [
          { label: '待重点攻坚主体', value: '5 家独角兽', trend: '行业覆盖 100%' },
          { label: '平均参保员工数', value: '450 人以上', trend: '规模体质极佳' },
          { label: '首批合作概率评估', value: '78.5%', trend: '技术成果推广' }
        ],
        visualData: [
          { label: '电科14所外延', curYear: 3800, prevYear: 2900 },
          { label: '中车信号所', curYear: 1200, prevYear: 850 },
          { label: '极氪智慧物流', curYear: 950, prevYear: 620 },
          { label: '晶合半导体', curYear: 1800, prevYear: 1100 }
        ],
        bulletPoints: [
          '依托南京研究分所，迅速推进【军规级元器件可靠性评估推广会】。',
          '聚焦智慧车载及信号控制的芯片电磁兼容门槛升级，提供“审定咨询+检测检验”一站式托管长周服务。',
          '对于拟IPO科技主体，主推赛宝【QMS ISO9001 高密合规资质认证】，开通绿色初审通道。'
        ]
      };
    } else {
      // Default: YoY Contract analysis (华南区增速)
      return {
        title: '2026年度赛宝实验室华南大区大客户合作同周期增速分析报告',
        subtitle: '基于华为、比亚迪、中兴等核心客户2022-2023签约额的比对提取',
        date: '2026年Q2度最新出具',
        overview: '本可视化报告由 AI 自动读取赛宝天河、增城、广州科学城等核心检测园区的高新在单账目生成。分析指出：华南大区大客户合作形势极佳，在手有效合同额呈现加速增长趋势。这主要由于汽车电动化对硅晶圆失效筛选及低空产业航电适航检测的拉动。',
        meta: {
          baseVolume: '1.63 亿元',
          yoyRatio: '同比提速 +25.4%',
          riskTrend: '安全合规推荐'
        },
        metrics: [
          { label: '本年累计到位签约额', value: '￥1.34 亿元', trend: 'YoY +32.1%' },
          { label: '检验检测科目增幅', value: '达到 48.5%', trend: '为绝对主导科目' },
          { label: '出具合格校准报告', value: '11,240 份', trend: '多大区流转' }
        ],
        visualData: [
          { label: '检验检测', curYear: 4920, prevYear: 3820 },
          { label: '认证评估', curYear: 1650, prevYear: 1240 },
          { label: '精密计量校准', curYear: 2240, prevYear: 1820 },
          { label: '软硬件协同开发', curYear: 1100, prevYear: 950 }
        ],
        bulletPoints: [
          '华南大客户中，“华为技术有限公司”在失效分析和高参数校准上年均单量均列榜首，双方联合认证机制健全。',
          '比亚迪集团车规IGBT芯片在增城基地的检测负荷趋近于120%，建议增补元器件检测所的自动化分析硬件投入。',
          '主协协同方面，技推处与低空产业处的联合签单耗时已经缩短至 8.2 天，极度方便领导统筹调度。'
        ]
      };
    }
  };

  const handleSendPrompt = (text: string) => {
    if (!text.trim()) return;

    // Push User prompt first
    const userMsgId = `u-${Date.now()}`;
    const userText = text;
    setChatHistory(prev => [...prev, { id: userMsgId, role: 'user', text: userText }]);
    setInputText('');
    setIsGenerating(true);

    // Simulate AI computing latency (1.4 seconds)
    setTimeout(() => {
      const generatedReport = generateMockReport(userText);
      const assistantMsgId = `a-${Date.now()}`;
      setChatHistory(prev => [...prev, {
        id: assistantMsgId,
        role: 'assistant',
        text: `我已基于您的核心诉求："${userText.slice(0, 30)}..." 实时整理了赛宝大数据，成功为您构建了定制可视化报告。详情展现如下，可滑动底端并点击按钮导出 PDF 格式：`,
        report: generatedReport
      }]);
      setIsGenerating(false);

      // Scroll nicely to bottom of panel
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1200);
  };

  // Safe Print Trigger to simulate standard PDF download
  const handleExportPdf = () => {
    setExportingPdf(true);
    setTimeout(() => {
      setExportingPdf(false);
      // Actual native invoke
      window.print();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      
      {/* Module Title info */}
      <div className="border-b border-slate-100 pb-5 no-print">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
          AI 智能问数对话 · 动态可视化报告生成中心
        </h2>
        <p className="mt-1 text-sm text-slate-500 font-sans">
          通过与赛宝大数据助手进行交互式问答，动态提取大区合作数据并搭建可视化图表报告，一键调起标准的 PDF A4 规格进行保存
        </p>
      </div>

      {/* Grid container divided into left-side active chat, and right-side pre-defined questions */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left 3 Columns - Core Chat and Report Display */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Chat Window logs container */}
          <div className="bg-white rounded-xl border border-slate-150/60 p-5 shadow-xs space-y-4 max-h-[420px] overflow-y-auto no-print">
            {chatHistory.map((item) => (
              <div 
                key={item.id} 
                className={`flex gap-3.5 items-start max-w-[85%] ${
                  item.role === 'user' ? 'ml-auto flex-row-reverse text-right' : ''
                }`}
              >
                {/* Micro avatar */}
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  item.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-150'
                }`}>
                  {item.role === 'user' ? 'L' : 'AI'}
                </div>

                <div className={`space-y-1 text-xs text-left leading-relaxed ${
                  item.role === 'user' 
                    ? 'bg-indigo-50/50 text-indigo-900 rounded-2xl rounded-tr-none px-3.5 py-2.5 border border-indigo-100/60' 
                    : 'bg-slate-50 text-slate-700 rounded-2xl rounded-tl-none px-4 py-3 border border-slate-100/60'
                }`}>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}

            {/* Simulated generation loading state */}
            {isGenerating && (
              <div className="flex gap-3.5 items-start">
                <div className="h-8 w-8 rounded-full bg-slate-950 text-white flex items-center justify-center font-bold text-xs shrink-0 animate-spin">
                  ⭐
                </div>
                <div className="bg-slate-50 text-slate-600 rounded-2xl rounded-tl-none px-4 py-3 text-xs border border-slate-100 flex items-center gap-2 font-medium">
                  <RefreshCw className="h-4.5 w-4.5 text-indigo-600 animate-spin" />
                  <span>赛宝AI正在审计相关检测账簿及年度多维报表，组装可视化分析块...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Interactive Chat Input Area */}
          <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-xs no-print">
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="在此输入您的特定业务提问（如：‘分析今年华南区合同同比变化’）..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendPrompt(inputText);
                }}
                disabled={isGenerating}
                className="flex-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded-lg border border-slate-200 px-4 py-2.5 text-xs text-slate-700 font-sans"
              />
              <button
                disabled={isGenerating || !inputText.trim()}
                onClick={() => handleSendPrompt(inputText)}
                className={`px-4 py-2.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition ${
                  inputText.trim() 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                    : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                }`}
              >
                <Send className="h-3.5 w-3.5" />
                智能问数
              </button>
            </div>
          </div>

          {/* Render Active generated Report in deep structure - Fully Printable printing-area */}
          {(() => {
            const lastReportWithData = [...chatHistory].reverse().find(h => h.report !== undefined);
            if (!lastReportWithData || !lastReportWithData.report) return null;

            const rep: AIReportPayload = lastReportWithData.report;

            return (
              <div 
                id="active-visual-report-canvas" 
                className="bg-white rounded-xl border border-slate-200 p-8 shadow-md relative print-area animate-fade-in"
              >
                {/* Floating controls specifically for non-printable trigger */}
                <div className="absolute right-6 top-6 flex gap-2.5 no-print">
                  <button 
                    id="btn-export-pdf-report"
                    onClick={handleExportPdf}
                    disabled={exportingPdf}
                    className="inline-flex items-center gap-1 bg-slate-900 text-white px-3.5 py-1.5 text-xs font-semibold rounded-md hover:bg-slate-800 transition shadow-sm"
                  >
                    {exportingPdf ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin text-slate-400" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    {exportingPdf ? '准备排版纸张...' : '导出 PDF 格式文件'}
                  </button>
                </div>

                {/* Report Printable Design A4 Sheet layout */}
                <div className="space-y-6">
                  
                  {/* Page A4 Letterhead */}
                  <div className="border-b-2 border-slate-900 pb-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-indigo-710 bg-indigo-50 px-2 py-0.5 rounded tracking-wide max-w-fit block">
                          赛宝数智专盘 · AI 自动研判业务报表
                        </span>
                        <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 leading-tight">
                          {rep.title}
                        </h2>
                        <p className="text-slate-400 text-[11px] font-medium">{rep.subtitle}</p>
                      </div>

                      <div className="text-right text-[10px] font-mono text-slate-400 whitespace-nowrap pt-2">
                        <div>报告编号: CEP-2026-AI-{Math.floor(Math.random() * 90000) + 10000}</div>
                        <div>出具日期: {rep.date}</div>
                      </div>
                    </div>
                  </div>

                  {/* Core Summary overview */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                      <FileText className="h-4 w-4 text-slate-400" />
                      一、 决策层经营概要阐明
                    </h4>
                    <p className="text-xs text-slate-650 leading-relaxed indent-6">
                      {rep.overview}
                    </p>
                  </div>

                  {/* High level KPI key metric stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {rep.metrics.map((stat, sIdx) => (
                      <div key={sIdx} className="bg-slate-50 border border-slate-100 p-4 rounded-lg space-y-1.5">
                        <div className="text-[10px] text-slate-400 font-sans leading-none">{stat.label}</div>
                        <div className="font-mono font-bold text-slate-900 text-lg leading-tight">{stat.value}</div>
                        <div className="text-[9px] text-emerald-600 font-medium">{stat.trend}</div>
                      </div>
                    ))}
                  </div>

                  {/* Visual Chart rendered in Report - Custom SVG bar chart to avoid render crash */}
                  <div className="space-y-3.5 page-break pt-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-indigo-500" />
                      二、 核心业务数据流转同比 (单位: 万元)
                    </h4>

                    {/* Styled Bar Columns Grid inside report */}
                    <div className="relative h-44 w-full border border-slate-100 rounded-lg p-4 bg-slate-50/20">
                      <div className="absolute inset-x-8 bottom-6 top-4 flex justify-between items-end gap-6">
                        {rep.visualData.map((bar, bIdx) => {
                          const maxVal = 5000;
                          const ratioCur = (bar.curYear / maxVal) * 100;
                          const ratioPrev = (bar.prevYear / maxVal) * 100;

                          return (
                            <div key={bIdx} className="flex-1 flex flex-col justify-end items-center h-full space-y-1.5">
                              {/* Parallel Bars */}
                              <div className="flex h-full w-full items-end justify-center gap-2">
                                <div 
                                  className="w-3 rounded-t bg-slate-300 hover:bg-slate-400 transition"
                                  style={{ height: `${ratioPrev}%` }}
                                  title={`去年: ${bar.prevYear}万`}
                                />
                                <div 
                                  className="w-3.5 rounded-t bg-indigo-600 hover:bg-indigo-700 transition"
                                  style={{ height: `${ratioCur}%` }}
                                  title={`今年: ${bar.curYear}万`}
                                />
                              </div>

                              {/* Label text */}
                              <span className="text-[9px] text-slate-500 font-sans font-medium text-center line-clamp-1 truncate max-w-full">
                                {bar.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Legend info inside report chart */}
                      <div className="absolute right-4 top-3 flex items-center gap-3 text-[9px] text-slate-400">
                        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-slate-200" />同周期相比</span>
                        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />本季在库</span>
                      </div>
                    </div>
                  </div>

                  {/* Bullet recommendations */}
                  <div className="space-y-2.5 pt-2">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1">
                      <Lightbulb className="h-4 w-4 text-emerald-500" />
                      三、 赛宝决策改善改进意见
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-500 list-decimal pl-4 leading-relaxed">
                      {rep.bulletPoints.map((rec, rIdx) => (
                        <li key={rIdx}>{rec}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Professional Seal or signature panel at bottom of PDF */}
                  <div className="border-t border-dashed border-slate-100 pt-6 mt-8 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <div>工信部电子五所质量可靠性大数据决策云系统</div>
                    <div className="text-right">
                      <div>报告机阅代号: CEP-AI-V19</div>
                      <div className="text-slate-350">打印原件具备防伪数字要素水印</div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })()}

        </div>

        {/* Right 1 Column - Quick predefined tag options */}
        <div className="space-y-5 no-print">
          
          <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-xs space-y-4">
            <div>
              <h3 className="font-semibold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
                AI 智能快捷标签
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                点击下方预设大类，赛宝AI将调用后端大盘算法，构建专业的可视化数据分析报告
              </p>
            </div>

            <div className="space-y-3">
              {COMMON_AI_QUESTIONS.map((q, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSendPrompt(q.promptText)}
                  className="group p-3 border border-slate-100 bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-150 rounded-lg text-xs cursor-pointer transition"
                >
                  <div className="flex justify-between items-center text-[10px] text-indigo-700 font-bold mb-1.5">
                    <span className="bg-indigo-50 px-1.5 py-0.5 rounded leading-none">{q.tag}</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                  </div>
                  <div className="font-bold text-slate-800 line-clamp-1">{q.title}</div>
                  <p className="text-slate-430 text-[10px] mt-1 line-clamp-2 leading-relaxed">{q.overview}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Info className="h-4 w-4 text-indigo-500" />
              流转报告支持导出及彩打
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              生成的分析报告在底端配备 “导出 PDF 格式文件” 控制键。点击后将剔除网页中的非必要菜单及对话流，自动适配 A4 单页或多页排版打印。
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
