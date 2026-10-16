/**
 * Tab4 统计与过滤规则。
 *
 * 这一节是一组全局口径而非可增删的条目，因此用表单而不是列表。
 * 需求说明中固定下来的项（北京时间、不支持自定义周期、在途仅展示数量且不纳入营收）
 * 一律置灰锁定，只展示不可改 —— 它们是刚性配置，正是本模块要固化的东西。
 */

import React, { useEffect, useState } from 'react';
import { Save, AlertCircle, RotateCcw } from 'lucide-react';
import type { StatPeriod, StatRuleConfig } from '../types';
import { STAT_PERIOD_META } from '../types';
import StringListEditor from './StringListEditor';
import {
  fieldErrorClass,
  inputClass,
  labelClass,
  lockedFieldClass,
  primaryBtnClass,
  secondaryBtnClass
} from './metricConfigStyles';

interface StatRulePanelProps {
  statRules: StatRuleConfig;
  onSave: (next: StatRuleConfig) => Record<string, string>;
}

export default function StatRulePanel({ statRules, onSave }: StatRulePanelProps) {
  const [draft, setDraft] = useState<StatRuleConfig>(statRules);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // 外部配置变化（如回滚）时同步草稿
  useEffect(() => {
    setDraft(statRules);
  }, [statRules]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(statRules);

  const togglePeriod = (period: StatPeriod) => {
    const has = draft.allowedPeriods.includes(period);
    setDraft({
      ...draft,
      allowedPeriods: has
        ? draft.allowedPeriods.filter((p) => p !== period)
        : [...draft.allowedPeriods, period]
    });
  };

  const handleSave = () => {
    const result = onSave(draft);
    setErrors(result);
    if (Object.keys(result).length === 0) {
      setSavedAt(new Date().toLocaleTimeString('zh-CN'));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">统计与过滤规则</h3>
          <p className="text-sm text-slate-600">
            全局统计口径，所有指标查询共用。固定项不可修改。
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedAt && <span className="text-xs text-emerald-600">已保存 {savedAt}</span>}
          {dirty && (
            <button
              onClick={() => {
                setDraft(statRules);
                setErrors({});
              }}
              className={`${secondaryBtnClass} flex items-center gap-1.5`}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              撤销修改
            </button>
          )}
          <button onClick={handleSave} className={`${primaryBtnClass} ${dirty ? '' : 'opacity-50'}`}>
            <Save className="h-4 w-4" />
            保存规则
          </button>
        </div>
      </div>

      {errors._form && (
        <div className="flex items-start gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="text-xs text-rose-800">{errors._form}</span>
        </div>
      )}

      {/* 时间口径 */}
      <section className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4">
        <h4 className="text-sm font-semibold text-slate-900">时间口径</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>时区（固定）</label>
            <input className={lockedFieldClass} value={draft.timezone} disabled />
            <p className="text-xs text-slate-400 mt-1">需求说明固定为北京时间</p>
          </div>
          <div>
            <label className={labelClass}>自定义周期（固定）</label>
            <input
              className={lockedFieldClass}
              value={draft.customPeriodAllowed ? '允许' : '不支持'}
              disabled
            />
            <p className="text-xs text-slate-400 mt-1">需求说明：不支持自定义周期</p>
          </div>
        </div>

        <div>
          <label className={labelClass}>允许的统计周期</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(STAT_PERIOD_META) as StatPeriod[]).map((period) => {
              const active = draft.allowedPeriods.includes(period);
              return (
                <button
                  key={period}
                  type="button"
                  onClick={() => togglePeriod(period)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {STAT_PERIOD_META[period].label}
                </button>
              );
            })}
          </div>
          {errors.allowedPeriods && <p className={fieldErrorClass}>{errors.allowedPeriods}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>模糊提问默认范围</label>
            <input
              className={inputClass}
              value={draft.defaultScope}
              onChange={(e) => setDraft({ ...draft, defaultScope: e.target.value })}
            />
            {errors.defaultScope && <p className={fieldErrorClass}>{errors.defaultScope}</p>}
          </div>
          <div>
            <label className={labelClass}>模糊提问默认周期</label>
            <select
              className={inputClass}
              value={draft.defaultPeriod}
              onChange={(e) => setDraft({ ...draft, defaultPeriod: e.target.value as StatPeriod })}
            >
              {(Object.keys(STAT_PERIOD_META) as StatPeriod[]).map((period) => (
                <option key={period} value={period}>
                  {STAT_PERIOD_META[period].label}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-400 mt-1">需求说明：模糊提问默认全院 + 本年度</p>
          </div>
        </div>
      </section>

      {/* 业务节点与单据过滤 */}
      <section className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4">
        <h4 className="text-sm font-semibold text-slate-900">业务节点与单据过滤</h4>

        <div>
          <label className={labelClass}>业务节点优先级（时间口径取用顺序）</label>
          <StringListEditor
            values={draft.nodePriority}
            onChange={(nodePriority) => setDraft({ ...draft, nodePriority })}
            placeholder="如：办结时间"
          />
          {errors.nodePriority && <p className={fieldErrorClass}>{errors.nodePriority}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>纳入统计的单据状态</label>
            <StringListEditor
              values={draft.includedStatuses}
              onChange={(includedStatuses) => setDraft({ ...draft, includedStatuses })}
              placeholder="如：已办结"
            />
            {errors.includedStatuses && <p className={fieldErrorClass}>{errors.includedStatuses}</p>}
          </div>
          <div>
            <label className={labelClass}>剔除的单据状态</label>
            <StringListEditor
              values={draft.excludedStatuses}
              onChange={(excludedStatuses) => setDraft({ ...draft, excludedStatuses })}
              placeholder="如：作废"
            />
            {errors.excludedStatuses && <p className={fieldErrorClass}>{errors.excludedStatuses}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>在途单据处理（固定）</label>
            <input
              className={lockedFieldClass}
              value={draft.wipCountOnly ? '仅展示数量' : '纳入统计'}
              disabled
            />
          </div>
          <div>
            <label className={labelClass}>在途是否纳入营收（固定）</label>
            <input
              className={lockedFieldClass}
              value={draft.revenueIncludesWip ? '纳入' : '不纳入'}
              disabled
            />
            <p className="text-xs text-slate-400 mt-1">
              需求说明：在途单据仅展示数量，不纳入营收统计
            </p>
          </div>
        </div>
      </section>

      {/* 归属与异常处理 */}
      <section className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4">
        <h4 className="text-sm font-semibold text-slate-900">归属与异常处理</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>客户归属依据</label>
            <input
              className={inputClass}
              value={draft.ownershipField}
              onChange={(e) => setDraft({ ...draft, ownershipField: e.target.value })}
            />
            {errors.ownershipField && <p className={fieldErrorClass}>{errors.ownershipField}</p>}
          </div>
          <div>
            <label className={labelClass}>缺失维度归类名称</label>
            <input
              className={inputClass}
              value={draft.missingDimensionLabel}
              onChange={(e) => setDraft({ ...draft, missingDimensionLabel: e.target.value })}
            />
            {errors.missingDimensionLabel && (
              <p className={fieldErrorClass}>{errors.missingDimensionLabel}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>空值填充值</label>
            <input
              type="number"
              step="any"
              className={inputClass}
              value={draft.nullFillValue}
              onChange={(e) => setDraft({ ...draft, nullFillValue: Number(e.target.value) })}
            />
            {errors.nullFillValue && <p className={fieldErrorClass}>{errors.nullFillValue}</p>}
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer pb-2.5">
              <input
                type="checkbox"
                checked={draft.interceptAbnormal}
                onChange={(e) => setDraft({ ...draft, interceptAbnormal: e.target.checked })}
                className="rounded border-slate-300"
              />
              <span className="text-sm text-slate-700">异常值拦截</span>
            </label>
          </div>
        </div>
      </section>
    </div>
  );
}
