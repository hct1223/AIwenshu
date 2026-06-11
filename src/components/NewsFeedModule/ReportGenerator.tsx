/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, Calendar, Sparkles, Download, Eye, Check } from 'lucide-react';
import { ReportConfig } from '../../types';

interface ReportGeneratorProps {
  onGenerateReport: (config: ReportConfig) => void;
  onPreviewReport: (config: ReportConfig) => void;
}

const REPORT_TYPES = [
  { value: 'daily', label: '日报' },
  { value: 'weekly', label: '周报' },
  { value: 'monthly', label: '月报' },
];

const FOCUS_AREAS = [
  '半导体行业',
  '新能源汽车',
  '低空经济',
  '全部行业',
];

const RECOMMENDED_ITEMS = [
  { id: 'rec-001', title: '华为发布新款AI芯片，算力提升3倍', category: '市场趋势' },
  { id: 'rec-002', title: '华东地区检测服务采购项目', category: '招标信息' },
  { id: 'rec-003', title: '新能源汽车产业发展规划发布', category: '政策法规' },
];

export default function ReportGenerator({ onGenerateReport, onPreviewReport }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [includePolicy, setIncludePolicy] = useState(true);
  const [includeMarket, setIncludeMarket] = useState(true);
  const [includeTender, setIncludeTender] = useState(true);
  const [includeHotspot, setIncludeHotspot] = useState(false);
  const [focusArea, setFocusArea] = useState('半导体行业');
  const [selectedItems, setSelectedItems] = useState<string[]>(['rec-001', 'rec-002', 'rec-003']);

  const handleGenerate = () => {
    const config: ReportConfig = {
      type: reportType,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      includePolicy,
      includeMarket,
      includeTender,
      includeHotspot,
      focusArea,
    };
    onGenerateReport(config);
  };

  const handlePreview = () => {
    const config: ReportConfig = {
      type: reportType,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      includePolicy,
      includeMarket,
      includeTender,
      includeHotspot,
      focusArea,
    };
    onPreviewReport(config);
  };

  const toggleItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-72 bg-white rounded-lg border border-slate-200 p-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
        <FileText className="h-4 w-4 text-indigo-600" />
        智能报告生成
      </h3>

      {/* 报告类型 */}
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-600 mb-2 block">报告类型</label>
        <div className="space-y-1.5">
          {REPORT_TYPES.map((type) => (
            <label
              key={type.value}
              className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer"
            >
              <input
                type="radio"
                name="reportType"
                value={type.value}
                checked={reportType === type.value}
                onChange={(e) => setReportType(e.target.value as any)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              {type.label}
            </label>
          ))}
        </div>
      </div>

      {/* 时间范围 */}
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-600 mb-2 block">时间范围</label>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar className="h-3.5 w-3.5" />
          <span>{new Date().toLocaleDateString('zh-CN')}</span>
          <span>至</span>
          <span>{new Date().toLocaleDateString('zh-CN')}</span>
        </div>
      </div>

      {/* 包含内容 */}
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-600 mb-2 block">包含内容</label>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={includePolicy}
              onChange={(e) => setIncludePolicy(e.target.checked)}
              className="text-indigo-600 focus:ring-indigo-500 rounded"
            />
            政策法规
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={includeMarket}
              onChange={(e) => setIncludeMarket(e.target.checked)}
              className="text-indigo-600 focus:ring-indigo-500 rounded"
            />
            市场趋势
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={includeTender}
              onChange={(e) => setIncludeTender(e.target.checked)}
              className="text-indigo-600 focus:ring-indigo-500 rounded"
            />
            招标信息
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={includeHotspot}
              onChange={(e) => setIncludeHotspot(e.target.checked)}
              className="text-indigo-600 focus:ring-indigo-500 rounded"
            />
            热点动态
          </label>
        </div>
      </div>

      {/* 关注领域 */}
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-600 mb-2 block">关注领域</label>
        <select
          value={focusArea}
          onChange={(e) => setFocusArea(e.target.value)}
          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {FOCUS_AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      {/* 智能推荐 */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          <label className="text-xs font-medium text-slate-600">智能推荐内容</label>
        </div>
        <div className="bg-slate-50 rounded border border-slate-200 p-3 space-y-2">
          {RECOMMENDED_ITEMS.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            return (
              <label
                key={item.id}
                className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleItem(item.id)}
                  className="text-indigo-600 focus:ring-indigo-500 rounded mt-0.5"
                />
                <div className="flex-1">
                  <div className="text-slate-700">{item.title}</div>
                  <div className="text-[10px] text-slate-400">{item.category}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="space-y-2">
        <button
          onClick={handlePreview}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
        >
          <Eye className="h-3.5 w-3.5" />
          预览报告
        </button>
        <button
          onClick={handleGenerate}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
        >
          <FileText className="h-3.5 w-3.5" />
          一键生成
        </button>
      </div>
    </div>
  );
}
