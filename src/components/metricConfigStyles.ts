/**
 * 数据指标配置模块的共享样式。
 *
 * 本文件集中存放类名，有两个目的：
 *
 * 1. **避免动态拼接类名**。项目里已有反例（KnowledgeModule.tsx 的 `bg-${color}-600`），
 *    Tailwind 的扫描器看不到模板字符串拼出来的类名，那些类实际上不产出任何 CSS。
 *    这里所有查表值都是完整字面量，扫描器能直接看到。
 *
 * 2. **避免使用不存在的色阶**。项目里现存的 bg-slate-850 / text-slate-450 / bg-slate-750 /
 *    bg-indigo-650 / bg-slate-150 在 Tailwind v4 中并不存在，会静默失效。
 *    本文件只使用真实存在的色阶。
 */

import type {
  DataScope,
  DimensionCategory,
  MetricStatus,
  TableSchemaStatus
} from '../types';

/** 表单控件样式，逐字沿用项目里已反复出现的写法 */
export const inputClass =
  'w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500';

/** 表单标签样式 */
export const labelClass = 'block text-sm font-medium text-slate-900 mb-1';

/** 主操作按钮 */
export const primaryBtnClass =
  'flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium';

/** 弹窗底部取消按钮 */
export const cancelBtnClass =
  'px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors';

/** 次级按钮（描边） */
export const secondaryBtnClass =
  'px-3 py-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition text-xs font-medium text-slate-700';

/** 图标操作按钮：启用态 */
export const iconBtnActiveClass = 'p-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors';

/** 图标操作按钮：停用态 */
export const iconBtnInactiveClass = 'p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors';

/** 图标操作按钮：编辑 */
export const iconBtnEditClass = 'p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors';

/** 图标操作按钮：删除 */
export const iconBtnDeleteClass = 'p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors';

/**
 * 卡片外壳：启用与停用两种状态。
 * 与 PushSettings 的列表卡片保持一致。
 */
export function cardClass(enabled: boolean): string {
  return `bg-white rounded-lg border-2 transition-all ${
    enabled ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 opacity-60'
  }`;
}

/** 配置条目状态徽章 */
export const METRIC_STATUS_BADGE: Record<MetricStatus, string> = {
  draft: 'bg-slate-100 text-slate-600',
  published: 'bg-emerald-100 text-emerald-700',
  disabled: 'bg-amber-100 text-amber-700',
  deprecated: 'bg-rose-100 text-rose-700'
};

/** 可调用标记：只有已发布才允许被语义引擎调用 */
export const callableBadgeClass = 'bg-emerald-100 text-emerald-700';
export const notCallableBadgeClass = 'bg-slate-100 text-slate-500';

/** 维度大类徽章 */
export const DIMENSION_CATEGORY_BADGE: Record<DimensionCategory, string> = {
  客户维度: 'bg-indigo-100 text-indigo-700',
  时间维度: 'bg-sky-100 text-sky-700',
  业务维度: 'bg-blue-100 text-blue-700',
  部门维度: 'bg-teal-100 text-teal-700',
  密级维度: 'bg-rose-100 text-rose-700'
};

/** 物理表是否已建 */
export const SCHEMA_STATUS_BADGE: Record<TableSchemaStatus, string> = {
  exists: 'bg-slate-100 text-slate-600',
  planned: 'bg-amber-100 text-amber-700'
};

/** 数据范围徽章 */
export const DATA_SCOPE_BADGE: Record<DataScope, string> = {
  all: 'bg-emerald-100 text-emerald-700',
  division: 'bg-sky-100 text-sky-700',
  self: 'bg-amber-100 text-amber-700'
};

/** 锁定项（需求说明固定、不可编辑）的输入控件样式 */
export const lockedFieldClass =
  'w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed';

/** 通用小徽章外壳 */
export const badgeClass = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium';

/** 表单字段错误提示 */
export const fieldErrorClass = 'text-xs text-red-600 mt-1';

/** 弹窗遮罩 */
export const modalOverlayClass = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';

/** 弹窗容器 */
export const modalPanelClass = 'bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto';

/** 弹窗头部 */
export const modalHeaderClass = 'flex items-center justify-between mb-6';

/** 弹窗底部 */
export const modalFooterClass = 'flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200';
