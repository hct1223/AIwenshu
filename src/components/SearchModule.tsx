/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { COMP_MOCK_LIST } from '../data/mockData';
import { Company } from '../types';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  SlidersHorizontal, 
  X, 
  Check, 
  ArrowLeftRight, 
  Building2, 
  TrendingUp, 
  Calendar,
  DollarSign,
  User,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface SearchModuleProps {
  onNavigateToCompany: (id: string) => void;
}

export default function SearchModule({ onNavigateToCompany }: SearchModuleProps) {
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedPartnership, setSelectedPartnership] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedAiScoreRange, setSelectedAiScoreRange] = useState('All');

  // Comparison selector inside search
  const [compareIds, setCompareIds] = useState<string[]>(['comp-huawei-tech', 'comp-zte']);
  const [comparisonActive, setComparisonActive] = useState(false);

  // Industries list extracted for selector
  const industries = useMemo(() => {
    const list = new Set<string>();
    COMP_MOCK_LIST.forEach(c => list.add(c.industry));
    return ['All', ...Array.from(list)];
  }, []);

  // Filtered companies computed
  const filteredCompanies = useMemo(() => {
    return COMP_MOCK_LIST.filter(c => {
      // 1. Text Search query matching name, representative, code, or tags
      const normQuery = searchQuery.toLowerCase().trim();
      const matchText = normQuery === '' || 
        c.name.toLowerCase().includes(normQuery) ||
        c.representative.toLowerCase().includes(normQuery) ||
        c.creditCode.toLowerCase().includes(normQuery) ||
        c.tags.coreDivision.some(t => t.toLowerCase().includes(normQuery)) ||
        c.tags.businessPreference.some(t => t.toLowerCase().includes(normQuery));

      // 2. Industry filter
      const matchIndustry = selectedIndustry === 'All' || c.industry === selectedIndustry;

      // 3. Partnership Level filter
      const matchPartnership = selectedPartnership === 'All' || 
        c.partnershipLevel.includes(selectedPartnership);

      // 4. Region filter matching visit record or address address
      const matchRegion = selectedRegion === 'All' || 
        c.address.includes(selectedRegion) || 
        c.tags.otherTags.some(t => t.includes(selectedRegion));

      // 5. AI Score Range filter
      let matchAiScore = true;
      if (selectedAiScoreRange === 'high') {
        matchAiScore = c.aiScore >= 90;
      } else if (selectedAiScoreRange === 'medium') {
        matchAiScore = c.aiScore >= 80 && c.aiScore < 90;
      } else if (selectedAiScoreRange === 'low') {
        matchAiScore = c.aiScore < 80;
      }

      return matchText && matchIndustry && matchPartnership && matchRegion && matchAiScore;
    });
  }, [searchQuery, selectedIndustry, selectedPartnership, selectedRegion, selectedAiScoreRange]);

  const toggleCompareId = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(prev => prev.filter(cId => cId !== id));
    } else {
      if (compareIds.length >= 3) {
        alert('为了多主体并列排版美观，单次对比最大支持 3 家主体');
        return;
      }
      setCompareIds(prev => [...prev, id]);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('All');
    setSelectedPartnership('All');
    setSelectedRegion('All');
    setSelectedAiScoreRange('All');
  };

  return (
    <div className="space-y-6">
      
      {/* Search Header Banner */}
      <div className="border-b border-slate-100 pb-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
          多维度指标筛选 · 企业级对比对标仓
        </h2>
        <p className="mt-1 text-sm text-slate-500 font-sans">
          通过多维度核心指标精准筛选高潜及已签大客户，支持多企业资质、财务表现、信任评分、主协技术部室在手合同金额的横向对标分析
        </p>
      </div>

      {!comparisonActive ? (
        <>
          {/* Section: Filtering Controls Grid */}
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs space-y-4">
            
            {/* Row 1 - Search Input with Clear Button */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="搜索企业全称、主要法人表、统一社会信用代号、合作偏好关键词..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs text-slate-700 font-sans"
                />
                {searchQuery !== '' && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={handleClearFilters}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-100/50 hover:text-slate-700 transition"
                >
                  重置筛选条件
                </button>
                <button
                  disabled={compareIds.length < 2}
                  onClick={() => setComparisonActive(true)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
                    compareIds.length >= 2 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                      : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  }`}
                >
                  <ArrowLeftRight className="h-3.5 w-3.5" />
                  开始对标 analysis ({compareIds.length}家)
                </button>
              </div>
            </div>

            {/* Row 2 - Dropdown Filters Panels */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              {/* Filter 1: Industry */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">所属实体行业</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2.5 text-xs text-slate-700 font-medium"
                >
                  <option value="All">全部行业目录</option>
                  {industries.filter(ind => ind !== 'All').map((ind, i) => (
                    <option key={i} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              {/* Filter 2: Partnership Level */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">赛宝合作层级</label>
                <select
                  value={selectedPartnership}
                  onChange={(e) => setSelectedPartnership(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2.5 text-xs text-slate-700 font-medium"
                >
                  <option value="All">全部合作关系</option>
                  <option value="战略级">战略级合作伙伴</option>
                  <option value="核心供应商">核心供应商代表</option>
                  <option value="意向">意向重点开发客户</option>
                </select>
              </div>

              {/* Filter 3: Region Geography */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">地理大区覆盖</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2.5 text-xs text-slate-700 font-medium"
                >
                  <option value="All">全部区域分布</option>
                  <option value="深圳">华南地区（深圳/广州）</option>
                  <option value="北京">华北地区（北京）</option>
                </select>
              </div>

              {/* Filter 4: AI Intelligent score */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">AI 质量水平判定</label>
                <select
                  value={selectedAiScoreRange}
                  onChange={(e) => setSelectedAiScoreRange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md py-1.5 px-2.5 text-xs text-slate-700 font-medium"
                >
                  <option value="All">全部质量分数区间</option>
                  <option value="high">超高高潜级 (&gt;= 90分)</option>
                  <option value="medium">稳健中坚级 (80-89分)</option>
                  <option value="low">待考察观察期 (&lt; 80分)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Results Grid & Tables list */}
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3.5 mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">
                  过滤比对检索列表
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  找到符合您筛选条件的合作子机构共 <span className="font-mono text-indigo-600 font-bold">{filteredCompanies.length}</span> 家
                </p>
              </div>

              <div className="text-xs text-slate-400 font-sans">
                勾选左侧选择栏可将其拖入对比池进行对标
              </div>
            </div>

            {filteredCompanies.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center justify-center space-y-2">
                <SlidersHorizontal className="h-8 w-8 text-slate-350" />
                <div>未检索到满足当前筛选约束的企业。请调整关键词或清除过滤条件。</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-medium text-slate-400 uppercase">
                      <th className="py-2.5 px-3 w-10">对标</th>
                      <th className="py-2.5 px-3">实体企业全称</th>
                      <th className="py-2.5 px-3">信用大类特征</th>
                      <th className="py-2.5 px-3">行业类别</th>
                      <th className="py-2.5 px-3">法人表</th>
                      <th className="py-2.5 px-3">AI 质量度</th>
                      <th className="py-2.5 px-3 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-xs text-slate-600">
                    {filteredCompanies.map((comp) => {
                      const isComparing = compareIds.includes(comp.id);
                      return (
                        <tr key={comp.id} className="hover:bg-slate-50/50 transition">
                          {/* Checkbox selector for comparison */}
                          <td className="py-3 px-3">
                            <button
                              id={`comp-tick-${comp.id}`}
                              onClick={() => toggleCompareId(comp.id)}
                              className={`h-4 w-4 rounded border flex items-center justify-center transition-all ${
                                isComparing 
                                  ? 'bg-indigo-600 border-indigo-600 text-white' 
                                  : 'border-slate-300 hover:border-slate-400 bg-white'
                              }`}
                            >
                              {isComparing && <Check className="h-3 w-3 stroke-[3]" />}
                            </button>
                          </td>

                          {/* Basic Profile info */}
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <img 
                                src={comp.logo} 
                                alt={comp.name} 
                                className="h-7 w-7 rounded-sm border border-slate-100 object-contain p-0.5"
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <span 
                                  onClick={() => onNavigateToCompany(comp.id)} 
                                  className="font-bold text-slate-800 hover:text-indigo-600 hover:underline cursor-pointer"
                                >
                                  {comp.name}
                                </span>
                                <div className="text-[10px] text-slate-400">信用号: {comp.creditCode}</div>
                              </div>
                            </div>
                          </td>

                          {/* Partnership Status Badge */}
                          <td className="py-3 px-3">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium leading-4 ${
                              comp.partnershipLevel.includes('战略') 
                                ? 'bg-indigo-50 text-indigo-700' 
                                : 'bg-emerald-50 text-emerald-700'
                            }`}>
                              {comp.partnershipLevel}
                            </span>
                          </td>

                          {/* Industry */}
                          <td className="py-3 px-3 font-medium text-slate-700">{comp.industry}</td>

                          {/* Representative */}
                          <td className="py-3 px-3 font-mono text-slate-500">{comp.representative}</td>

                          {/* AI Quality score */}
                          <td className="py-3 px-3 font-mono">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800">{comp.aiScore}分</span>
                              <div className="w-8 bg-slate-100 h-1 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${comp.aiScore}%` }} />
                              </div>
                            </div>
                          </td>

                          {/* Navigate to Profile */}
                          <td className="py-3 px-3 text-right">
                            <button
                              id={`trigger-deep-from-list-${comp.id}`}
                              onClick={() => onNavigateToCompany(comp.id)}
                              className="text-[11px] font-semibold text-indigo-650 hover:text-indigo-800 hover:underline inline-flex items-center gap-0.5"
                            >
                              深层画像
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Section: Side-by-Side Comparison Desk Output */
        <div className="bg-white rounded-xl p-5 border border-slate-150/60 shadow-md space-y-6 animate-fade-in">
          
          {/* Compare Top Back Row controls */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setComparisonActive(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 transition mr-1"
              >
                <X className="h-5 w-5" />
              </button>
              <div>
                <h3 className="font-semibold text-slate-900 text-base">企业多维属性并列对标分析</h3>
                <p className="text-xs text-slate-400">目前对比的主页有 {compareIds.length} 家核心合作企业</p>
              </div>
            </div>

            <button 
              onClick={() => setComparisonActive(false)}
              className="text-xs font-semibold text-indigo-600 border border-indigo-100 hover:bg-indigo-50/50 px-3 py-1.5 rounded-lg transition"
            >
              返回筛选列表
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COMP_MOCK_LIST.filter(c => compareIds.includes(c.id)).map((comp) => {
              const currentYearTotal = comp.metrics[1] 
                ? Object.values(comp.metrics[1]).slice(1).reduce((a, b) => (a as number) + (b as number), 0) as number
                : 0;

              return (
                <div key={comp.id} className="border border-slate-100 rounded-xl p-5 bg-slate-50/20 shadow-xs space-y-5">
                  
                  {/* Top entity header */}
                  <div className="flex gap-3 items-center border-b border-slate-100/60 pb-3">
                    <img 
                      src={comp.logo} 
                      alt={comp.name} 
                      className="h-9 w-9 rounded border border-slate-200/50 object-contain p-0.5 bg-white"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="font-bold text-slate-800 text-sm truncate max-w-[170px]" title={comp.name}>
                        {comp.name}
                      </div>
                      <div className="text-[10px] text-slate-400">{comp.type}</div>
                    </div>
                  </div>

                  {/* Attribute compares */}
                  <div className="space-y-3.5 text-xs">
                    
                    {/* Dimension 1: Representative */}
                    <div className="flex justify-between">
                      <span className="text-slate-400 font-sans">代表法人:</span>
                      <span className="font-medium text-slate-700">{comp.representative}</span>
                    </div>

                    {/* Dimension 2: Registered Capital */}
                    <div className="flex justify-between font-sans">
                      <span className="text-slate-400">注册资本规模:</span>
                      <span className="font-mono font-bold text-slate-700">{comp.registeredCapital}</span>
                    </div>

                    {/* Dimension 3: Establishment Date */}
                    <div className="flex justify-between">
                      <span className="text-slate-400">设立时间:</span>
                      <span className="font-mono text-slate-500">{comp.establishmentDate}</span>
                    </div>

                    {/* Dimension 4: Social Code */}
                    <div className="flex justify-between line-clamp-1">
                      <span className="text-slate-400">社会信用号:</span>
                      <span className="font-mono text-slate-750 text-[11px] truncate max-w-[120px]">{comp.creditCode}</span>
                    </div>

                    {/* Dimension 5: Regional */}
                    <div className="flex justify-between">
                      <span className="text-slate-400">核心往来省市:</span>
                      <span className="text-slate-600 font-medium">华南大区 ({comp.address.slice(0, 3)})</span>
                    </div>

                    {/* Score Compare */}
                    <div className="border-t border-dashed border-slate-100 pt-3.5 space-y-2.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-bold">赛宝合规信用分:</span>
                        <span className="font-mono font-bold text-emerald-600 text-sm">{comp.complianceRating}分</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-bold">AI 质量效能分评:</span>
                        <span className="font-mono font-bold text-indigo-650 text-sm">{comp.aiScore}分</span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-505 font-bold">赛宝年度累计合同额:</span>
                        <span className="font-mono font-semibold text-slate-800 text-xs">￥{(currentYearTotal/10).toFixed(1)} 千万元</span>
                      </div>
                    </div>

                    {/* Department Ratio highlight */}
                    <div className="border-t border-slate-100 pt-3.5 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">主要合作占比部室:</span>
                      <div className="space-y-1.5 max-h-24 overflow-y-auto">
                        {comp.deptContributions.slice(0, 3).map((dept, dIdx) => (
                          <div key={dIdx} className="flex justify-between text-[10px] text-slate-500">
                            <span className="truncate max-w-[140px]">{dept.name.slice(0, 9)}...</span>
                            <span className="font-mono text-slate-700 font-bold">{dept.ratio}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Navigation footer target */}
                  <div className="pt-2 border-t border-slate-100">
                    <button 
                      onClick={() => onNavigateToCompany(comp.id)}
                      className="w-full text-center text-xs bg-indigo-600 text-white font-medium py-1.5 rounded-lg hover:bg-indigo-700 transition"
                    >
                      深入查看该厂立体画像
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
