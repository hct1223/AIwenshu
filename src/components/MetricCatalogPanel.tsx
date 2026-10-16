/**
 * Tab1 指标配置（需求说明 §2.1）。
 *
 * 指标口径（业务释义 + 精准计算公式）是本模块的核心资产 —— 它们取代了大模型对口径的
 * 自由解释，因此在校验中被强制要求非空。
 *
 * 「可调用」标记严格跟随状态：只有已发布的指标才能被语义引擎调用，其余一律显示不可调用。
 */

import React, { useMemo, useState } from 'react';
import { CheckCircle, XCircle, Edit, Trash2, Plus, X, AlertCircle, Eye } from 'lucide-react';
import type {
  Aggregation,
  MetricCategoryName,
  MetricDefinition,
  MetricStatus,
  StatPeriod
} from '../types';
import {
  AGGREGATION_META,
  METRIC_CATEGORIES,
  METRIC_STATUS_META,
  STAT_PERIOD_META
} from '../types';
import StringListEditor from './StringListEditor';
import {
  METRIC_STATUS_BADGE,
  badgeClass,
  callableBadgeClass,
  cancelBtnClass,
  cardClass,
  fieldErrorClass,
  iconBtnDeleteClass,
  iconBtnEditClass,
  iconBtnActiveClass,
  iconBtnInactiveClass,
  inputClass,
  labelClass,
  modalFooterClass,
  modalHeaderClass,
  modalOverlayClass,
  modalPanelClass,
  notCallableBadgeClass,
  primaryBtnClass
} from './metricConfigStyles';

interface MetricCatalogPanelProps {
  metrics: MetricDefinition[];
  /** 已知的全部逻辑表名，用于关联数据表的可选项提示 */
  knownTables: string[];
  onSave: (item: MetricDefinition) => Record<string, string>;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (metric: MetricDefinition) => void;
}

interface MetricDraft {
  category: MetricCategoryName;
  name: string;
  code: string;
  definition: string;
  formula: string;
  period: StatPeriod;
  sourceTables: string[];
  aggregation: Aggregation;
  specialNote: string;
  status: MetricStatus;
}

const EMPTY_DRAFT: MetricDraft = {
  category: '客户经营',
  name: '',
  code: '',
  definition: '',
  formula: '',
  period: 'month',
  sourceTables: [],
  aggregation: 'sum',
  specialNote: '',
  status: 'draft'
};

const STATUS_FILTERS: (MetricStatus | 'all')[] = ['all', 'published', 'draft', 'disabled', 'deprecated'];

export default function MetricCatalogPanel({
  metrics,
  knownTables,
  onSave,
  onToggle,
  onDelete,
  onPreview
}: MetricCatalogPanelProps) {
  const [statusFilter, setStatusFilter] = useState<MetricStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<MetricCategoryName | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<MetricDefinition | null>(null);
  const [draft, setDraft] = useState<MetricDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const visible = useMemo(
    () =>
      metrics.filter(
        (m) =>
          (statusFilter === 'all' || m.status === statusFilter) &&
          (categoryFilter === 'all' || m.category === categoryFilter)
      ),
    [metrics, statusFilter, categoryFilter]
  );

  const callableCount = metrics.filter((m) => METRIC_STATUS_META[m.status].callable).length;

  const openAdd = () => {
    setEditing(null);
    setDraft({
      ...EMPTY_DRAFT,
      category: categoryFilter === 'all' ? '客户经营' : categoryFilter
    });
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (item: MetricDefinition) => {
    setEditing(item);
    setDraft({
      category: item.category,
      name: item.name,
      code: item.code,
      definition: item.definition,
      formula: item.formula,
      period: item.period,
      sourceTables: [...item.sourceTables],
      aggregation: item.aggregation,
      specialNote: item.specialNote ?? '',
      status: item.status
    });
    setErrors({});
    setShowModal(true);
  };

  const handleSave = () => {
    const payload: MetricDefinition = {
      id: editing?.id ?? '',
      category: draft.category,
      name: draft.name,
      code: draft.code,
      definition: draft.definition,
      formula: draft.formula,
      period: draft.period,
      sourceTables: draft.sourceTables,
      aggregation: draft.aggregation,
      specialNote: draft.specialNote.trim() || undefined,
      status: draft.status,
      schemaVersion: editing?.schemaVersion ?? '1.0',
      updatedAt: editing?.updatedAt ?? '',
      updatedBy: editing?.updatedBy ?? ''
    };

    const result = onSave(payload);
    if (Object.keys(result).length > 0) {
      setErrors(result);
      return;
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">指标配置</h3>
          <p className="text-sm text-slate-600">
            共 {metrics.length} 项指标，其中 {callableCount} 项已发布可被语义引擎调用。
            显示 {visible.length} 项。
          </p>
        </div>
        <button onClick={openAdd} className={primaryBtnClass}>
          <Plus className="h-4 w-4" />
          添加指标
        </button>
      </div>

      {/* 筛选 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-slate-400 w-10">状态</span>
          <div className="flex bg-slate-50 border border-slate-200 rounded-md p-0.5">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`text-[11px] px-3 py-1 rounded font-medium transition ${
                  statusFilter === status
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status === 'all' ? '全部' : METRIC_STATUS_META[status].label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-[11px] text-slate-400 w-10 pt-1.5 shrink-0">大类</span>
          <div className="flex bg-slate-50 border border-slate-200 rounded-md p-0.5 flex-wrap">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`text-[11px] px-3 py-1 rounded font-medium transition ${
                categoryFilter === 'all'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              全部
            </button>
            {METRIC_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`text-[11px] px-3 py-1 rounded font-medium transition ${
                  categoryFilter === category
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {visible.map((item) => {
          const statusMeta = METRIC_STATUS_META[item.status];
          return (
            <div key={item.id} className={`${cardClass(statusMeta.callable)} p-4`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-900">{item.name}</span>
                    <code className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-mono">
                      {item.code}
                    </code>
                    <span className={`${badgeClass} bg-indigo-50 text-indigo-700`}>
                      {item.category}
                    </span>
                    <span className={`${badgeClass} ${METRIC_STATUS_BADGE[item.status]}`}>
                      {statusMeta.label}
                    </span>
                    <span
                      className={`${badgeClass} ${
                        statusMeta.callable ? callableBadgeClass : notCallableBadgeClass
                      }`}
                    >
                      {statusMeta.callable ? '可调用' : '不可调用'}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-600">{item.definition}</p>

                  <div className="mt-2.5 px-3 py-2 bg-slate-50 rounded-lg">
                    <div className="text-[10px] text-slate-400 mb-0.5">精准计算公式</div>
                    <code className="font-mono text-xs text-slate-800 break-all">
                      {item.formula}
                    </code>
                  </div>

                  <div className="mt-2.5 flex items-center gap-3 flex-wrap text-[11px] text-slate-500">
                    <span>周期：{STAT_PERIOD_META[item.period].label}</span>
                    <span>聚合：{AGGREGATION_META[item.aggregation].label}</span>
                    <span>
                      关联表：
                      {item.sourceTables.map((table) => (
                        <code key={table} className="ml-1 font-mono text-slate-700">
                          {table}
                        </code>
                      ))}
                    </span>
                  </div>

                  {item.specialNote && (
                    <p className="mt-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-100 rounded px-2 py-1">
                      {item.specialNote}
                    </p>
                  )}

                  {/* 软警告：关联表不在任何标准链路中，语义引擎没有可用的连接路径 */}
                  {item.sourceTables.some((t) => !knownTables.includes(t)) && (
                    <p className="mt-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-100 rounded px-2 py-1">
                      关联表{' '}
                      {item.sourceTables.filter((t) => !knownTables.includes(t)).join('、')}{' '}
                      未登记在任何标准链路中，语义引擎缺少连接路径，请到「表关联配置」补充。
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onPreview(item)}
                    className="p-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                    title="语义引擎视角（仅查看口径）"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onToggle(item.id)}
                    className={statusMeta.callable ? iconBtnActiveClass : iconBtnInactiveClass}
                    title={statusMeta.callable ? '停用' : '发布'}
                  >
                    {statusMeta.callable ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                  </button>
                  <button onClick={() => openEdit(item)} className={iconBtnEditClass} title="编辑">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className={iconBtnDeleteClass}
                    title="删除（仅停用/废弃状态可删）"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {visible.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
            <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">当前筛选条件下没有指标</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className={modalOverlayClass}>
          <div className={modalPanelClass}>
            <div className="p-6">
              <div className={modalHeaderClass}>
                <h2 className="text-xl font-bold text-slate-900">
                  {editing ? '编辑指标' : '添加指标'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>指标大类</label>
                    <select
                      className={inputClass}
                      value={draft.category}
                      onChange={(e) =>
                        setDraft({ ...draft, category: e.target.value as MetricCategoryName })
                      }
                    >
                      {METRIC_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>状态</label>
                    <select
                      className={inputClass}
                      value={draft.status}
                      onChange={(e) => setDraft({ ...draft, status: e.target.value as MetricStatus })}
                    >
                      {(Object.keys(METRIC_STATUS_META) as MetricStatus[]).map((s) => (
                        <option key={s} value={s}>
                          {METRIC_STATUS_META[s].label}
                          {METRIC_STATUS_META[s].callable ? '（可被调用）' : '（不可调用）'}
                        </option>
                      ))}
                    </select>
                    {errors.status && <p className={fieldErrorClass}>{errors.status}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>指标名称</label>
                    <input
                      className={inputClass}
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      placeholder="如：检验检测收入"
                    />
                    {errors.name && <p className={fieldErrorClass}>{errors.name}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>指标编码</label>
                    <input
                      className={`${inputClass} font-mono`}
                      value={draft.code}
                      onChange={(e) => setDraft({ ...draft, code: e.target.value })}
                      placeholder="如：testing_amount"
                    />
                    {errors.code && <p className={fieldErrorClass}>{errors.code}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>业务释义</label>
                  <textarea
                    className={inputClass}
                    rows={2}
                    value={draft.definition}
                    onChange={(e) => setDraft({ ...draft, definition: e.target.value })}
                    placeholder="用业务语言说明该指标含义。大模型不得自行解释口径，只能引用这里的内容。"
                  />
                  {errors.definition && <p className={fieldErrorClass}>{errors.definition}</p>}
                </div>

                <div>
                  <label className={labelClass}>精准计算公式</label>
                  <textarea
                    className={`${inputClass} font-mono text-xs`}
                    rows={2}
                    value={draft.formula}
                    onChange={(e) => setDraft({ ...draft, formula: e.target.value })}
                    placeholder="如：SUM(company_metrics.testing_amount)"
                  />
                  {errors.formula && <p className={fieldErrorClass}>{errors.formula}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>统计周期</label>
                    <select
                      className={inputClass}
                      value={draft.period}
                      onChange={(e) => setDraft({ ...draft, period: e.target.value as StatPeriod })}
                    >
                      {(Object.keys(STAT_PERIOD_META) as StatPeriod[]).map((p) => (
                        <option key={p} value={p}>
                          {STAT_PERIOD_META[p].label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>聚合方式</label>
                    <select
                      className={inputClass}
                      value={draft.aggregation}
                      onChange={(e) =>
                        setDraft({ ...draft, aggregation: e.target.value as Aggregation })
                      }
                    >
                      {(Object.keys(AGGREGATION_META) as Aggregation[]).map((a) => (
                        <option key={a} value={a}>
                          {AGGREGATION_META[a].label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>关联数据表</label>
                  <StringListEditor
                    values={draft.sourceTables}
                    onChange={(sourceTables) => setDraft({ ...draft, sourceTables })}
                    placeholder="输入逻辑表名后回车，如 company_metrics"
                  />
                  {errors.sourceTables && <p className={fieldErrorClass}>{errors.sourceTables}</p>}
                  {draft.sourceTables.some((t) => !knownTables.includes(t)) && (
                    <p className="text-[11px] text-amber-700 mt-1">
                      警告：
                      {draft.sourceTables.filter((t) => !knownTables.includes(t)).join('、')}
                      未登记在任何标准链路中，保存后语义引擎将缺少连接路径。
                    </p>
                  )}
                  {knownTables.length > 0 && (
                    <p className="text-[11px] text-slate-400 mt-1">
                      标准链路中已登记的表：{knownTables.slice(0, 8).join('、')}
                      {knownTables.length > 8 ? ' 等' : ''}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>特殊业务说明</label>
                  <textarea
                    className={inputClass}
                    rows={2}
                    value={draft.specialNote}
                    onChange={(e) => setDraft({ ...draft, specialNote: e.target.value })}
                    placeholder="选填。如：与市场化数据隔离，禁止与回款表关联"
                  />
                </div>
              </div>

              <div className={modalFooterClass}>
                <button onClick={() => setShowModal(false)} className={cancelBtnClass}>
                  取消
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
