/**
 * Tab2 维度字典（需求说明 §2.2）。
 *
 * 关键要求都体现在数据与校验上：
 *   - 用户口语必须映射到标准字段 → aliases 至少一条，且有校验拦截
 *   - 「可靠性测试」「环境试验」统一归为可靠性试验 → 由枚举值的 aliases 承载
 *   - 无权限密级维度直接拦截 → 密级维度带 requireClearance
 */

import React, { useState } from 'react';
import { CheckCircle, XCircle, Edit, Trash2, Plus, X, AlertCircle, ArrowRight } from 'lucide-react';
import type { DimensionCategory, DimensionDefinition, DimensionEnumValue, MetricStatus } from '../types';
import { DIMENSION_CATEGORIES, METRIC_STATUS_META } from '../types';
import StringListEditor from './StringListEditor';
import {
  DIMENSION_CATEGORY_BADGE,
  METRIC_STATUS_BADGE,
  badgeClass,
  cancelBtnClass,
  cardClass,
  fieldErrorClass,
  iconBtnActiveClass,
  iconBtnDeleteClass,
  iconBtnEditClass,
  iconBtnInactiveClass,
  inputClass,
  labelClass,
  lockedFieldClass,
  modalFooterClass,
  modalHeaderClass,
  modalOverlayClass,
  modalPanelClass,
  primaryBtnClass,
  secondaryBtnClass
} from './metricConfigStyles';

interface DimensionDictionaryPanelProps {
  dimensions: DimensionDefinition[];
  onSave: (item: DimensionDefinition) => Record<string, string>;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

interface DimensionDraft {
  category: DimensionCategory;
  name: string;
  code: string;
  standardField: string;
  aliases: string[];
  enumValues: DimensionEnumValue[];
  usageScene: string;
  requireClearance: string;
  status: MetricStatus;
}

const EMPTY_DRAFT: DimensionDraft = {
  category: '客户维度',
  name: '',
  code: '',
  standardField: '',
  aliases: [],
  enumValues: [],
  usageScene: '',
  requireClearance: '0',
  status: 'draft'
};

export default function DimensionDictionaryPanel({
  dimensions,
  onSave,
  onToggle,
  onDelete
}: DimensionDictionaryPanelProps) {
  const [activeCategory, setActiveCategory] = useState<DimensionCategory | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<DimensionDefinition | null>(null);
  const [draft, setDraft] = useState<DimensionDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const visible =
    activeCategory === 'all'
      ? dimensions
      : dimensions.filter((d) => d.category === activeCategory);

  const openAdd = () => {
    setEditing(null);
    setDraft({
      ...EMPTY_DRAFT,
      category: activeCategory === 'all' ? '客户维度' : activeCategory
    });
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (item: DimensionDefinition) => {
    setEditing(item);
    setDraft({
      category: item.category,
      name: item.name,
      code: item.code,
      standardField: item.standardField,
      aliases: [...item.aliases],
      enumValues: item.enumValues.map((v) => ({ ...v, aliases: v.aliases ? [...v.aliases] : [] })),
      usageScene: item.usageScene,
      requireClearance: String(item.requireClearance ?? 0),
      status: item.status
    });
    setErrors({});
    setShowModal(true);
  };

  const handleSave = () => {
    const payload: DimensionDefinition = {
      id: editing?.id ?? '',
      category: draft.category,
      name: draft.name,
      code: draft.code,
      standardField: draft.standardField,
      aliases: draft.aliases,
      enumValues: draft.enumValues,
      usageScene: draft.usageScene,
      requireClearance: Number(draft.requireClearance) || 0,
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

  const updateEnum = (index: number, patch: Partial<DimensionEnumValue>) => {
    setDraft({
      ...draft,
      enumValues: draft.enumValues.map((v, i) => (i === index ? { ...v, ...patch } : v))
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">维度字典</h3>
          <p className="text-sm text-slate-600">
            共 {dimensions.length} 个维度，当前分类 {visible.length} 个。口语必须映射到系统标准字段。
          </p>
        </div>
        <button onClick={openAdd} className={primaryBtnClass}>
          <Plus className="h-4 w-4" />
          添加维度
        </button>
      </div>

      {/* 大类筛选 */}
      <div className="flex bg-slate-50 border border-slate-200 rounded-md p-0.5 w-fit flex-wrap">
        <button
          onClick={() => setActiveCategory('all')}
          className={`text-[11px] px-3 py-1 rounded font-medium transition ${
            activeCategory === 'all'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          全部
        </button>
        {DIMENSION_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`text-[11px] px-3 py-1 rounded font-medium transition ${
              activeCategory === category
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map((item) => (
          <div key={item.id} className={`${cardClass(item.status === 'published')} p-4`}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-slate-900">{item.name}</span>
                  <code className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-mono">
                    {item.code}
                  </code>
                  <span className={`${badgeClass} ${DIMENSION_CATEGORY_BADGE[item.category]}`}>
                    {item.category}
                  </span>
                  <span className={`${badgeClass} ${METRIC_STATUS_BADGE[item.status]}`}>
                    {METRIC_STATUS_META[item.status].label}
                  </span>
                  {item.requireClearance !== undefined && item.requireClearance > 0 && (
                    <span className={`${badgeClass} bg-rose-100 text-rose-700`}>
                      需密级 {item.requireClearance}
                    </span>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <span className="text-slate-400">标准字段</span>
                  <code className="font-mono text-slate-700">{item.standardField}</code>
                </div>

                {item.aliases.length > 0 && (
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] text-slate-400">口语别名</span>
                    {item.aliases.map((alias) => (
                      <span
                        key={alias}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]"
                      >
                        {alias}
                      </span>
                    ))}
                  </div>
                )}

                {item.enumValues.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-1.5">
                    <div className="text-[10px] text-slate-500">标准枚举取值与归并别名</div>
                    {item.enumValues.map((value) => (
                      <div key={value.value} className="flex items-center gap-2 flex-wrap text-xs">
                        <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">
                          {value.value}
                        </span>
                        {value.aliases && value.aliases.length > 0 && (
                          <>
                            <ArrowRight className="h-3 w-3 text-slate-300" />
                            {value.aliases.map((alias) => (
                              <span
                                key={alias}
                                className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[11px] line-through decoration-slate-300"
                              >
                                {alias}
                              </span>
                            ))}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <p className="mt-2 text-xs text-slate-500">{item.usageScene}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onToggle(item.id)}
                  className={item.status === 'published' ? iconBtnActiveClass : iconBtnInactiveClass}
                  title={item.status === 'published' ? '停用' : '启用'}
                >
                  {item.status === 'published' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                </button>
                <button onClick={() => openEdit(item)} className={iconBtnEditClass} title="编辑">
                  <Edit className="h-4 w-4" />
                </button>
                <button onClick={() => onDelete(item.id)} className={iconBtnDeleteClass} title="删除">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {visible.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
            <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">该分类下暂无维度</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className={modalOverlayClass}>
          <div className={modalPanelClass}>
            <div className="p-6">
              <div className={modalHeaderClass}>
                <h2 className="text-xl font-bold text-slate-900">
                  {editing ? '编辑维度' : '添加维度'}
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
                    <label className={labelClass}>维度大类</label>
                    <select
                      className={inputClass}
                      value={draft.category}
                      onChange={(e) =>
                        setDraft({ ...draft, category: e.target.value as DimensionCategory })
                      }
                    >
                      {DIMENSION_CATEGORIES.map((category) => (
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
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>维度名称</label>
                    <input
                      className={inputClass}
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      placeholder="如：试验类别"
                    />
                    {errors.name && <p className={fieldErrorClass}>{errors.name}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>维度编码</label>
                    <input
                      className={`${inputClass} font-mono`}
                      value={draft.code}
                      onChange={(e) => setDraft({ ...draft, code: e.target.value })}
                      placeholder="如：test_category"
                    />
                    {errors.code && <p className={fieldErrorClass}>{errors.code}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>系统标准字段</label>
                  <input
                    className={`${inputClass} font-mono`}
                    value={draft.standardField}
                    onChange={(e) => setDraft({ ...draft, standardField: e.target.value })}
                    placeholder="如：company_info.company_type"
                  />
                  {errors.standardField && <p className={fieldErrorClass}>{errors.standardField}</p>}
                </div>

                <div>
                  <label className={labelClass}>口语别名 / 专业术语</label>
                  <StringListEditor
                    values={draft.aliases}
                    onChange={(aliases) => setDraft({ ...draft, aliases })}
                    placeholder="如：客户、公司、厂家"
                  />
                  {errors.aliases && <p className={fieldErrorClass}>{errors.aliases}</p>}
                </div>

                {/* 标准枚举取值 */}
                <div>
                  <label className={labelClass}>标准枚举取值</label>
                  <div className="space-y-2">
                    {draft.enumValues.map((value, index) => (
                      <div key={index} className="border border-slate-200 rounded-lg p-2.5 space-y-2">
                        <div className="flex gap-2">
                          <input
                            className={inputClass}
                            value={value.value}
                            placeholder="标准取值"
                            onChange={(e) => updateEnum(index, { value: e.target.value })}
                          />
                          <input
                            className={inputClass}
                            value={value.label}
                            placeholder="展示名"
                            onChange={(e) => updateEnum(index, { label: e.target.value })}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setDraft({
                                ...draft,
                                enumValues: draft.enumValues.filter((_, i) => i !== index)
                              })
                            }
                            className="px-2 text-slate-400 hover:text-rose-600 shrink-0"
                            title="移除"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <input
                          className={`${inputClass} text-xs`}
                          value={(value.aliases ?? []).join(',')}
                          placeholder="归并别名，逗号分隔。如：可靠性测试,环境试验"
                          onChange={(e) =>
                            updateEnum(index, {
                              aliases: e.target.value
                                .split(',')
                                .map((s) => s.trim())
                                .filter(Boolean)
                            })
                          }
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          enumValues: [...draft.enumValues, { value: '', label: '', aliases: [] }]
                        })
                      }
                      className={`${secondaryBtnClass} flex items-center gap-1.5`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      添加枚举取值
                    </button>
                  </div>
                  {errors.enumValues && <p className={fieldErrorClass}>{errors.enumValues}</p>}
                </div>

                <div>
                  <label className={labelClass}>业务使用场景</label>
                  <textarea
                    className={inputClass}
                    rows={2}
                    value={draft.usageScene}
                    onChange={(e) => setDraft({ ...draft, usageScene: e.target.value })}
                    placeholder="该维度用于哪些提问场景"
                  />
                  {errors.usageScene && <p className={fieldErrorClass}>{errors.usageScene}</p>}
                </div>

                {draft.category === '密级维度' ? (
                  <div>
                    <label className={labelClass}>所需密级访问级别（0-3）</label>
                    <select
                      className={inputClass}
                      value={draft.requireClearance}
                      onChange={(e) => setDraft({ ...draft, requireClearance: e.target.value })}
                    >
                      {['0 - 公开', '1 - 内部', '2 - 秘密', '3 - 机密'].map((label, index) => (
                        <option key={label} value={index}>
                          {label}
                        </option>
                      ))}
                    </select>
                    {errors.requireClearance && (
                      <p className={fieldErrorClass}>{errors.requireClearance}</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className={labelClass}>所需密级访问级别</label>
                    <input className={lockedFieldClass} value="不适用（非密级维度）" disabled />
                  </div>
                )}
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
