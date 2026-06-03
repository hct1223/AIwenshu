/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Company } from '../types';
import { COMP_MOCK_LIST } from '../data/mockData';
import { 
  Building2, 
  User, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  TrendingUp, 
  Activity, 
  AlertCircle,
  Clock,
  ArrowRight,
  FileText,
  UserCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface EnterpriseModuleProps {
  activeCompanyId: string;
  onNavigateToCompany: (id: string) => void;
}

export default function EnterpriseModule({ 
  activeCompanyId, 
  onNavigateToCompany 
}: EnterpriseModuleProps) {
  
  // Local states for cooperation contract tracking
  const [contractStatusFilter, setContractStatusFilter] = useState<string>('ALL');
  const [contractSearchQuery, setContractSearchQuery] = useState<string>('');
  const [expandedContractId, setExpandedContractId] = useState<string | null>(null);
  const [customContracts, setCustomContracts] = useState<{ [companyId: string]: any[] }>({});
  
  // State for appending new contracts locally
  const [showAddContractForm, setShowAddContractForm] = useState(false);
  const [newContractName, setNewContractName] = useState('');
  const [newContractNo, setNewContractNo] = useState('');
  const [newContractAmount, setNewContractAmount] = useState('');
  const [newContractDept, setNewContractDept] = useState('元器件检测所');
  const [newContractLeader, setNewContractLeader] = useState('张工');
  const [newContractSummary, setNewContractSummary] = useState('');
  const [formError, setFormError] = useState('');

  // Local lookup for currently managed company
  const currentCompany = COMP_MOCK_LIST.find(c => c.id === activeCompanyId) || COMP_MOCK_LIST[0];

  // Resolve base contracts merge with locally-created custom contracts for simulation
  const baseContracts = currentCompany.cooperationContracts || [];
  const addedContracts = customContracts[currentCompany.id] || [];
  const contracts = [...baseContracts, ...addedContracts];

  const filteredContracts = contracts.filter(c => {
    const matchesStatus = contractStatusFilter === 'ALL' || c.status === contractStatusFilter;
    const matchesSearch = c.name.toLowerCase().includes(contractSearchQuery.toLowerCase()) || 
                          c.contractNo.toLowerCase().includes(contractSearchQuery.toLowerCase()) ||
                          c.department.toLowerCase().includes(contractSearchQuery.toLowerCase()) ||
                          c.projectLeader.toLowerCase().includes(contractSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalContractAmount = contracts.reduce((acc, c) => acc + c.amount, 0);
  const activeContractsCount = contracts.filter(c => c.status === '履行中').length;

  const handleCreateContract = () => {
    if (!newContractName.trim() || !newContractNo.trim() || !newContractAmount.trim()) {
      setFormError('请完整包含合同名称、合同编号和确切金额值。');
      return;
    }

    const amountNum = parseFloat(newContractAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setFormError('请输入正整数或正确的金额。');
      return;
    }

    const newContract = {
      id: `custom-c-${Date.now()}`,
      contractNo: newContractNo.trim().toUpperCase(),
      name: newContractName.trim(),
      amount: amountNum,
      signDate: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-12-31',
      status: '履行中' as const,
      department: newContractDept,
      projectLeader: newContractLeader,
      summary: newContractSummary.trim() || '本合同具体支撑工信部电子五所与对应客户之间的质量评测和检测校准往来。'
    };

    setCustomContracts(prev => ({
      ...prev,
      [currentCompany.id]: [...(prev[currentCompany.id] || []), newContract]
    }));

    // Reset inputs
    setNewContractName('');
    setNewContractNo('');
    setNewContractAmount('');
    setNewContractSummary('');
    setFormError('');
    setShowAddContractForm(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Module Navigation dropdown and Header wrapper */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
            企业立体透视画像 · 合同穿透洞察
          </h2>
          <p className="mt-1 text-sm text-slate-500 font-sans">
            针对单一合作主体进行全生命周期的资质校验、合同在审账目、部室对接往来、主要利益干系人及关键拜访流转回溯
          </p>
        </div>

        {/* Dynamic drop selector to switch company */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400 font-sans whitespace-nowrap">切换企业主体:</label>
          <select 
            id="company-portrait-selector"
            value={currentCompany.id}
            onChange={(e) => onNavigateToCompany(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-md py-1.5 px-3 max-w-xs focus:ring-1 focus:ring-indigo-500 font-medium text-slate-700"
          >
            {COMP_MOCK_LIST.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid Content - Multi layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Basic Enterprise Profile Card & Tag Systems */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs relative">
            {/* Background decoration ring */}
            <div className="absolute right-0 top-0 h-24 w-24 bg-indigo-50/20 rounded-full blur-xl pointer-events-none" />

            <div className="flex gap-3.5 items-start">
              <img 
                src={currentCompany.logo} 
                alt={currentCompany.name} 
                className="h-12 w-12 rounded-lg border border-slate-100/80 object-contain p-1 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-semibold text-slate-900 text-base">{currentCompany.name}</h3>
                <span className="mt-1 inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-100">
                  {currentCompany.partnershipLevel}
                </span>
              </div>
            </div>

            {/* Registry Info Details block */}
            <div className="mt-6 space-y-3.5 border-t border-slate-50 pt-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">信用统一代代号:</span>
                <span className="font-mono text-slate-700 font-medium">{currentCompany.creditCode}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">代表法人:</span>
                <span className="text-slate-700 font-medium">{currentCompany.representative}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">设立日期:</span>
                <span className="font-mono text-slate-500">{currentCompany.establishmentDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">注册资金:</span>
                <span className="font-mono text-slate-700 font-medium">{currentCompany.registeredCapital}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">参保员工比重:</span>
                <span className="font-mono text-slate-500">{currentCompany.employeesScale} / {currentCompany.insuredEmployees} 实际参保</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">对公网站:</span>
                <span className="text-indigo-600 hover:underline cursor-pointer">{currentCompany.website}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-slate-400 whitespace-nowrap">对公注册宿址:</span>
                <span className="text-slate-600 font-medium text-right leading-relaxed pl-4">{currentCompany.address}</span>
              </div>
            </div>
          </div>

          {/* Collaborative tag structures */}
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs space-y-4">
            <h4 className="font-semibold text-slate-900 border-b border-slate-50 pb-2.5 text-xs uppercase tracking-wider text-slate-400">
              赛宝联合合作画像标签
            </h4>

            <div className="space-y-3.5">
              <div>
                <div className="text-[10px] text-slate-400 font-medium mb-1.5">核心大类和渠道状态:</div>
                <div className="flex flex-wrap gap-1.5">
                  {currentCompany.tags.coreDivision.map((tag, i) => (
                    <span key={i} className="bg-indigo-50/50 text-indigo-700 text-[10px] px-2 py-0.5 rounded border border-indigo-100/30">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 font-medium mb-1.5">业务偏好与在审倾向:</div>
                <div className="flex flex-wrap gap-1.5">
                  {currentCompany.tags.businessPreference.map((tag, i) => (
                    <span key={i} className="bg-emerald-50 text-emerald-800 text-[10px] px-2 py-0.5 rounded border border-emerald-100/50">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 font-medium mb-1.5">运营与效能属性:</div>
                <div className="flex flex-wrap gap-1.5">
                  {currentCompany.tags.otherTags.map((tag, i) => (
                    <span key={i} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Middle Area: Quality Compliance Assessment and Testing comparison charts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Dashboard metrics block - quality compliance */}
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
            <h4 className="font-semibold text-slate-900 text-sm border-b border-slate-50 pb-2.5">
              数智安全与履约信任指标评测
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
              {/* Score card 1: AI rating */}
              <div className="rounded-lg p-3 bg-slate-50/50 border border-slate-100 text-center flex flex-col justify-between">
                <span className="text-[11px] font-medium text-slate-400">赛宝 AI 智能合规信誉度</span>
                <div className="my-2.5">
                  <span className="font-mono text-3xl font-bold text-indigo-600">{currentCompany.aiScore}</span>
                  <span className="text-xs text-slate-400 ml-0.5">/ 100</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${currentCompany.aiScore}%` }} />
                </div>
              </div>

              {/* Score card 2: Compliance indicator */}
              <div className="rounded-lg p-3 bg-slate-50/50 border border-slate-100 text-center flex flex-col justify-between">
                <span className="text-[11px] font-medium text-slate-400 font-sans">财务清账及合规表现</span>
                <div className="my-2.5">
                  <span className="font-mono text-3xl font-bold text-emerald-600">{currentCompany.complianceRating}%</span>
                </div>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded self-center font-medium">
                  无拖账欠账风险
                </span>
              </div>

              {/* Score card 3: Risk alarm coefficient */}
              <div className="rounded-lg p-3 bg-slate-50/50 border border-slate-100 text-center flex flex-col justify-between">
                <span className="text-[11px] font-medium text-slate-400">近期关联舆情及业务波动风险</span>
                <div className="my-2.5">
                  <span className="font-mono text-3xl font-bold text-slate-700">{currentCompany.riskIndex}%</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded self-center font-semibold ${
                  currentCompany.riskIndex > 15 ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {currentCompany.riskIndex > 15 ? '触发中等关注' : '风险指标极低'}
                </span>
              </div>
            </div>

            {/* General cooperation brief */}
            <div className="mt-4 p-3 rounded-lg bg-indigo-50/30 border border-indigo-150/50 text-xs leading-relaxed text-slate-600">
              <span className="font-bold text-indigo-900">赛宝实验室往来评议:</span> {currentCompany.saibaoCooperationSummary}
            </div>
          </div>

          {/* Comparison charts between last year and current year for active company */}
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2.5 mb-4">
              <h4 className="font-semibold text-slate-900 text-sm">
                年度主力测试认证收入指标流转 (万元)
              </h4>
              <div className="flex gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-slate-200" />
                  2022 年
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  2023 年
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: '元器件筛选检测', k2022: currentCompany.metrics[0].testingAmount, k2023: currentCompany.metrics[1].testingAmount },
                { label: '质量认证与安全评估', k2022: currentCompany.metrics[0].certAmount, k2023: currentCompany.metrics[1].certAmount },
                { label: '高精计量与参数校准', k2022: currentCompany.metrics[0].calibrationAmount, k2023: currentCompany.metrics[1].calibrationAmount },
                { label: '软硬件数字化开发支持', k2022: currentCompany.metrics[0].devAmount, k2023: currentCompany.metrics[1].devAmount },
                { label: 'TSQ人才职业效能检验培训', k2022: currentCompany.metrics[0].trainingAmount, k2023: currentCompany.metrics[1].trainingAmount }
              ].map((item, idx) => {
                // Determine layout percentage relative to max of metrics
                const maxBar = 5000;
                const pct2022 = (item.k2022 / maxBar) * 100;
                const pct2023 = (item.k2023 / maxBar) * 100;

                return (
                  <div key={idx} className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-medium text-slate-700">
                      <span>{item.label}</span>
                      <span className="font-mono">
                        ￥{item.k2023} / <span className="text-slate-400 font-medium">￥{item.k2022} 万</span>
                      </span>
                    </div>

                    <div className="space-y-1 bg-slate-50/50 p-1 rounded-md border border-slate-100">
                      {/* Bar 2023 */}
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                          style={{ width: `${pct2023}%` }}
                        />
                      </div>
                      {/* Bar 2022 */}
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden animate-pulse">
                        <div 
                          className="h-full bg-slate-350 rounded-full transition-all duration-1000"
                          style={{ width: `${pct2022}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Horizontal breakdown of Coordinates department proportion */}
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
            <h4 className="font-semibold text-slate-900 text-sm border-b border-slate-50 pb-2.5 mb-4">
              部室合作分流及项目落资沉淀 (单位: 万元)
            </h4>

            <div className="space-y-3.5">
              {currentCompany.deptContributions.map((contrib, i) => (
                <div key={i} className="text-xs space-y-1">
                  <div className="flex justify-between text-slate-600 items-center">
                    <span className="font-medium text-slate-700">{contrib.name}</span>
                    <span className="font-mono font-bold text-slate-800">
                      {contrib.ratio}% <span className="text-slate-400 text-[10px] font-normal">({contrib.amount} 万)</span>
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-slate-800 rounded-full transition-all duration-500"
                      style={{ width: `${contrib.ratio}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 合作合同与履约审计大面板 */}
      <section className="bg-white rounded-xl border border-slate-100 shadow-xs p-5 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-55 bg-indigo-50 text-indigo-600 rounded-lg shadow-sm shadow-indigo-100 shrink-0">
              <FileText className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">
                合作合同穿透与流转审计大盘
              </h4>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                目前累计签约合同总额：<span className="font-bold font-mono text-indigo-600">￥{totalContractAmount.toLocaleString()} 万元</span> | 在研/履行中单体合约：<span className="font-bold text-emerald-600">{activeContractsCount} 份</span>
              </p>
            </div>
          </div>

          {/* Action filters */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
            {/* Real-time search query box */}
            <div className="relative">
              <input 
                type="text"
                placeholder="搜索合同名称/编号/负责人"
                value={contractSearchQuery}
                onChange={(e) => setContractSearchQuery(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-md py-1.5 pl-3 pr-8 w-48 focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:outline-none transition font-sans text-slate-700"
              />
              <span className="absolute right-2.5 top-2 text-slate-400 text-xs">🔍</span>
            </div>

            {/* Segment status switcher tabs */}
            <div className="flex bg-slate-50 border border-slate-200 rounded-md p-0.5">
              {['ALL', '履行中', '已完成'].map(status => (
                <button
                  key={status}
                  onClick={() => setContractStatusFilter(status)}
                  className={`text-[11px] px-3 py-1 rounded font-semibold transition ${
                    contractStatusFilter === status
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {status === 'ALL' ? '全部合同' : status}
                </button>
              ))}
            </div>

            {/* Append simulated contract button */}
            <button
              onClick={() => {
                setShowAddContractForm(!showAddContractForm);
                setFormError('');
              }}
              className="text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1.5 px-3.5 rounded-md transition shadow-xs flex items-center gap-1 shrink-0"
            >
              <span>+</span> 登记新合约
            </button>
          </div>
        </div>

        {/* Custom Form to Register New Contract */}
        {showAddContractForm && (
          <div className="bg-slate-50/70 border border-slate-150 rounded-xl p-4.5 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-200/50 pb-2">
              <h5 className="font-semibold text-xs text-slate-800 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                录入/登记客户最新合作合同 (拟合存入当前大盘主体)
              </h5>
              <button 
                type="button" 
                onClick={() => setShowAddContractForm(false)}
                className="text-slate-400 hover:text-slate-650 text-xs transition font-sans"
              >
                取消
              </button>
            </div>
            
            {formError && (
              <div className="p-2.5 text-xs bg-rose-50 text-rose-700 rounded border border-rose-100 flex items-center gap-1.5 font-medium">
                <AlertCircle className="h-3.5 w-3.5" />
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-650">合同全称 *</label>
                <input 
                  type="text"
                  placeholder="如：智能车载芯片失效性能测算委托"
                  value={newContractName}
                  onChange={(e) => { setNewContractName(e.target.value); setFormError(''); }}
                  className="w-full bg-white border border-slate-200 rounded p-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-650">合同编号 *</label>
                <input 
                  type="text"
                  placeholder="如：SB2024HW0390"
                  value={newContractNo}
                  onChange={(e) => { setNewContractNo(e.target.value); setFormError(''); }}
                  className="w-full bg-white border border-slate-200 rounded p-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-650">承接业务部室 *</label>
                <select 
                  value={newContractDept}
                  onChange={(e) => setNewContractDept(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="元器件检测所">元器件检测所</option>
                  <option value="低空产业部">低空产业部</option>
                  <option value="软件评测中心">软件评测中心</option>
                  <option value="技推处">技推处</option>
                  <option value="可靠性试验中心">可靠性试验中心</option>
                  <option value="计量校准所">计量校准所</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-650">合同标的额 (万元) *</label>
                <input 
                  type="number"
                  placeholder="如：620"
                  value={newContractAmount}
                  onChange={(e) => { setNewContractAmount(e.target.value); setFormError(''); }}
                  className="w-full bg-white border border-slate-200 rounded p-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none font-mono font-bold text-indigo-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-650">赛宝项目负责人 *</label>
                <input 
                  type="text"
                  placeholder="如：李工程师"
                  value={newContractLeader}
                  onChange={(e) => setNewContractLeader(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-650">履约状态</label>
                <input 
                  type="text"
                  value="履行中 (新签约自动归入)"
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded p-1.5 text-slate-500"
                />
              </div>

              <div className="md:col-span-3 space-y-1">
                <label className="font-semibold text-slate-650">合同合作摘要与审计内容说明</label>
                <textarea 
                  placeholder="请详细描述该项目的检测对象、使用设施规范、首付款流转或待办测算摘要..."
                  rows={2}
                  value={newContractSummary}
                  onChange={(e) => setNewContractSummary(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded p-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2.5 justify-end">
              <button
                type="button"
                onClick={() => setShowAddContractForm(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-4 py-2 rounded-md font-medium transition"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleCreateContract}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-md font-semibold transition"
              >
                保存合约
              </button>
            </div>
          </div>
        )}

        {/* Responsive Database Lists */}
        <div className="overflow-x-auto border border-slate-100 rounded-lg">
          {filteredContracts.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400 bg-slate-50/30">
              <HelpCircle className="h-8 w-8 mx-auto text-slate-300 stroke-[1.5] mb-2" />
              <span>本期度未检索到匹配的合作合同。可尝试更变筛选关键词或状态标签</span>
            </div>
          ) : (
            <div className="min-w-[800px] divide-y divide-slate-100 bg-white">
              {/* Row Header */}
              <div className="grid grid-cols-12 gap-4 text-[11px] font-bold text-slate-400 bg-slate-50/50 py-3.5 px-4 font-sans tracking-wide">
                <span className="col-span-4">合同名称 & 契约编号</span>
                <span className="col-span-2">承接处室</span>
                <span className="col-span-2 text-right">标的额 (万元)</span>
                <span className="col-span-2 text-center">签署日期</span>
                <span className="col-span-1 text-center">当前状态</span>
                <span className="col-span-1 text-center">审计档案</span>
              </div>

              {/* Rows details */}
              <div className="divide-y divide-slate-100/60">
                {filteredContracts.map(contract => {
                  const isExpanded = expandedContractId === contract.id;
                  return (
                    <div key={contract.id} className="transition-all">
                      <div 
                        onClick={() =>setExpandedContractId(isExpanded ? null : contract.id)}
                        className={`grid grid-cols-12 gap-4 text-xs py-4 px-4 items-center cursor-pointer transition ${
                          isExpanded ? 'bg-indigo-50/10' : 'hover:bg-slate-50/40'
                        }`}
                      >
                        <div className="col-span-4">
                          <div className="font-semibold text-slate-800 line-clamp-1 hover:text-indigo-600 flex items-center gap-1.5">
                            {contract.name}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{contract.contractNo}</span>
                        </div>

                        <div className="col-span-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-650 border border-slate-200/50">
                            {contract.department}
                          </span>
                        </div>

                        <div className="col-span-2 text-right font-mono font-bold text-indigo-650 pr-2">
                          ￥{contract.amount.toLocaleString()} 万元
                        </div>

                        <div className="col-span-2 text-center text-slate-550 font-mono">
                          {contract.signDate}
                        </div>

                        <div className="col-span-1 text-center">
                          <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold ${
                            contract.status === '履行中'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-150/40'
                              : 'bg-slate-150 text-slate-600'
                          }`}>
                            {contract.status}
                          </span>
                        </div>

                        <div className="col-span-1 text-center font-sans">
                          <button 
                            className={`text-[11px] font-medium transition ${
                              isExpanded ? 'text-indigo-600 font-bold' : 'text-slate-400 hover:text-slate-700'
                            }`}
                          >
                            {isExpanded ? '关闭' : '调阅'}
                          </button>
                        </div>
                      </div>

                      {/* Expandable abstract container */}
                      {isExpanded && (
                        <div className="bg-slate-50/80 border-y border-slate-100 p-4.5 text-xs text-slate-650 leading-relaxed grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                          <div className="md:col-span-2 space-y-2">
                            <h5 className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                              合同合作范畴 & 复审备注
                            </h5>
                            <div className="bg-white p-3.5 rounded-lg border border-slate-200/50 shadow-xs text-slate-600 text-[11px] leading-relaxed">
                              {contract.summary}
                            </div>
                          </div>
                          
                          <div className="bg-indigo-50/20 p-3.5 rounded-lg border border-indigo-100/30 space-y-3 shrink-0">
                            <h5 className="font-bold text-indigo-950 text-[11px] flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                              履约与安全审查指标
                            </h5>
                            <div className="space-y-2 text-[11px] font-sans">
                              <div className="flex justify-between">
                                <span className="text-slate-400">承接部室主管:</span>
                                <span className="font-semibold text-slate-700">{contract.projectLeader} / {contract.department}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">资金到位状态:</span>
                                <span className="font-semibold text-emerald-700">常规全款到账保障</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">合作起止日期:</span>
                                <span className="font-mono text-slate-500">{contract.startDate} 至 {contract.endDate}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Row 3 - Sub details: Physical Visits History & Submissions/Action logs & Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Contacts Decision Makers (2 Column height grid) */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center gap-1.5 border-b border-slate-50 pb-3 mb-4">
            <UserCheck className="h-4 w-4 text-indigo-600" />
            <h4 className="font-semibold text-slate-900 text-sm">企业直系对接利益干系人</h4>
          </div>

          <div className="space-y-4">
            {currentCompany.contacts.map((c) => (
              <div key={c.id} className="p-3 bg-slate-50/50 rounded-lg border border-slate-100/60 flex items-center gap-3">
                <img 
                  src={c.avatar} 
                  alt={c.name} 
                  className="h-10 w-10 rounded-full object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div className="text-xs space-y-1">
                  <div className="font-bold text-slate-800">{c.name}</div>
                  <div className="text-slate-500 text-[10px] font-sans leading-none">{c.role}</div>

                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400">
                    <span className="flex items-center gap-0.5"><Phone className="h-3 w-3" /> {c.phone}</span>
                    <span className="flex items-center gap-0.5"><Mail className="h-3 w-3" /> {c.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visit records log */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center gap-1.5 border-b border-slate-50 pb-3 mb-4">
            <Clock className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold text-slate-900 text-sm">拜访与来台流转回溯</span>
          </div>

          <div className="space-y-3">
            {currentCompany.visitRecords.map((rec) => (
              <div key={rec.id} className="p-3 bg-slate-50/20 rounded-lg border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-mono text-slate-400">{rec.date}</span>
                  <span className="inline-flex rounded bg-emerald-50 text-emerald-800 px-1.5 py-0.5 font-bold scale-90">
                    {rec.type}
                  </span>
                </div>

                <div className="mt-1.5 font-bold text-slate-800 text-xs line-clamp-1">{rec.topic}</div>
                <p className="text-[10px] text-slate-500 mt-1">
                  对标代表: <span className="text-slate-700 font-medium">{rec.leader}</span> | 赛宝接待: <span className="text-slate-700 font-medium">{rec.handler}</span>
                </p>

                <div className="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
                  <span>地点: {rec.location}</span>
                  <span className="font-medium text-indigo-600">{rec.department}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action / submission logs */}
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
          <div className="flex items-center gap-1.5 border-b border-slate-50 pb-3 mb-4">
            <Activity className="h-4 w-4 text-rose-500" />
            <h4 className="font-semibold text-slate-900 text-sm">企业申报与试验履约动态</h4>
          </div>

          <div className="space-y-3">
            {currentCompany.activityLogs.map((log) => (
              <div key={log.id} className="relative pl-4 border-l-2 border-indigo-100/80 pb-3 last:pb-0 text-xs">
                {/* Visual bullet */}
                <div className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-indigo-600" />
                
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>{log.timestamp}</span>
                  {log.type === 'declare' && <span className="text-indigo-600">测试申报</span>}
                  {log.type === 'contract' && <span className="text-emerald-600">首付记账</span>}
                  {log.type === 'email' && <span className="text-slate-400">核对归档</span>}
                </div>

                <div className="font-semibold text-slate-800 mt-1">{log.title}</div>
                <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">{log.summary}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
