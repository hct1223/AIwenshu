/**
 * 数据指标配置中心 —— 模块容器。
 *
 * 定位：为 DeepSeek 大模型和语义引擎提供统一、固化、可审计的配置依据，防止大模型
 * 自由生成 SQL 导致口径错乱。DeepSeek 只做意图识别；口径、维度映射、表关联、
 * SQL 生成与权限判断一律由本配置中心约束。
 *
 * 结构约定：
 *   - 容器持有唯一的配置对象与历史对象，执行全部校验与 CRUD；面板只负责展示与表单。
 *   - 所有写入都走 commit() 这一个漏斗，保证没有变更能绕过审计。
 *   - 配置存于 `saibao.metricConfig`，历史存于 `saibao.metricConfig.history`。
 *     两者分离是刻意的：快照会整份保存配置，若历史也在配置里，每次快照都会把
 *     此前全部历史再存一遍，体积指数增长。
 */

import React from 'react';
import {
  BarChart3,
  ListTree,
  Layers,
  Link2,
  SlidersHorizontal,
  ShieldCheck,
  History,
  RotateCcw
} from 'lucide-react';
import type {
  DimensionDefinition,
  JoinChain,
  LlmBoundaryGuardrails,
  MetricConfig,
  MetricDefinition,
  PermissionConfig,
  StatRuleConfig
} from '../types';
import { DIMENSION_CATEGORIES, METRIC_CATEGORIES, METRIC_STATUS_META } from '../types';
import { CONFIG_OPERATOR, METRIC_CONFIG_VERSION } from '../data/metricConfigDefaults';
import { diffRecords } from '../data/metricConfigHistory';
import { buildEnginePreview } from '../data/metricEngine';
import { useMetricConfig } from '../context/MetricConfigContext';
import MetricCatalogPanel from './MetricCatalogPanel';
import DimensionDictionaryPanel from './DimensionDictionaryPanel';
import JoinChainPanel from './JoinChainPanel';
import StatRulePanel from './StatRulePanel';
import PermissionMaskPanel from './PermissionMaskPanel';
import VersionAuditPanel from './VersionAuditPanel';
import LlmBoundaryPanel from './LlmBoundaryPanel';
import { modalFooterClass, modalHeaderClass, modalOverlayClass, secondaryBtnClass } from './metricConfigStyles';

type TabKey =
  | 'metrics'
  | 'dimensions'
  | 'joinChains'
  | 'statRules'
  | 'permissions'
  | 'version'
  | 'boundary';

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'metrics', label: '指标配置', icon: BarChart3 },
  { key: 'dimensions', label: '维度字典', icon: Layers },
  { key: 'joinChains', label: '表关联配置', icon: Link2 },
  { key: 'statRules', label: '统计与过滤规则', icon: SlidersHorizontal },
  { key: 'permissions', label: '权限与脱敏', icon: ShieldCheck },
  { key: 'version', label: '版本与审计', icon: History },
  { key: 'boundary', label: '大模型边界', icon: ListTree }
];

const CODE_PATTERN = /^[A-Za-z][A-Za-z0-9_]*$/;

/**
 * 仅属于市场化业务域的表。科研域的链路引用它们即构成「跨业务域乱关联」
 * （需求说明禁止规则 1 举的例子正是「科研表与回款表」）。
 */
const MARKET_ONLY_TABLES = [
  'entrust_business',
  'cooperation_contracts',
  'payment_flow',
  'tender_filing',
  'service_purchase'
];

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function now(): string {
  return new Date().toISOString();
}

// ---------------- 变更明细的中文字段标签 ----------------

const METRIC_LABELS: Partial<Record<keyof MetricDefinition, string>> = {
  code: '指标编码',
  name: '指标名称',
  category: '指标大类',
  definition: '业务释义',
  formula: '精准计算公式',
  period: '统计周期',
  sourceTables: '关联数据表',
  aggregation: '聚合方式',
  specialNote: '特殊业务说明',
  status: '状态'
};

const DIMENSION_LABELS: Partial<Record<keyof DimensionDefinition, string>> = {
  code: '维度编码',
  name: '维度名称',
  category: '维度大类',
  standardField: '系统标准字段',
  aliases: '口语别名',
  enumValues: '标准枚举取值',
  usageScene: '业务使用场景',
  requireClearance: '所需密级级别',
  status: '状态'
};

const CHAIN_LABELS: Partial<Record<keyof JoinChain, string>> = {
  scene: '场景名称',
  businessDomain: '业务域',
  nodes: '关联链路',
  joinType: '连接方式',
  filterInvalid: '过滤无效单据',
  isolated: '数据隔离',
  note: '备注',
  status: '状态'
};

export default function MetricConfigModule() {
  const [activeTab, setActiveTab] = React.useState<TabKey>('metrics');

  // 配置状态由 MetricConfigProvider 统一持有，供本模块与 AI 对话共享。
  const { config, history, queryLog, commit, rollback, reset, clearQueryLog } = useMetricConfig();

  const [previewMetric, setPreviewMetric] = React.useState<MetricDefinition | null>(null);

  // ---------------- 派生数据 ----------------

  /** 标准链路中登记的全部逻辑表名 */
  const knownTables = React.useMemo(
    () => [...new Set(config.joinChains.flatMap((c) => c.nodes.map((n) => n.tableKey)))],
    [config.joinChains]
  );

  const maxChainNodes = React.useMemo(
    () => config.joinChains.reduce((max, c) => Math.max(max, c.nodes.length), 0),
    [config.joinChains]
  );

  const callableCount = config.metrics.filter(
    (m) => METRIC_STATUS_META[m.status].callable
  ).length;

  // ---------------- §2.1 指标 ----------------

  const validateMetric = (item: MetricDefinition): Record<string, string> => {
    const errors: Record<string, string> = {};
    const code = item.code.trim();

    if (!item.name.trim()) errors.name = '指标名称为必填项';

    if (!code) {
      errors.code = '指标编码为必填项';
    } else if (!CODE_PATTERN.test(code)) {
      errors.code = '编码需以字母开头，且只能包含字母、数字和下划线';
    } else if (
      config.metrics.some((m) => m.id !== item.id && m.code.toLowerCase() === code.toLowerCase())
    ) {
      errors.code = '该编码已存在，请更换';
    }

    if (!METRIC_CATEGORIES.includes(item.category)) errors.category = '指标大类取值非法';

    // 口径载体，不能为空 —— 它们替代大模型对口径的解释
    if (!item.definition.trim()) errors.definition = '业务释义为必填项，大模型只能引用此处口径';
    if (!item.formula.trim()) errors.formula = '精准计算公式为必填项';

    if (item.sourceTables.length === 0) {
      errors.sourceTables = '至少需要关联一张数据表';
    } else if (item.sourceTables.length > config.boundary.maxJoinTables) {
      errors.sourceTables = `关联表数量不能超过 ${config.boundary.maxJoinTables} 张（大模型边界限制）`;
    }
    // 注：未登记在标准链路中的表不在此拦截，仅由面板给出软警告。
    // 需求说明 §2.3 给出的是六个场景的链路枚举，并非完整的表清单 ——
    // 诸如 company_metrics 这类真实存在的表并不在其中，硬拦截会导致
    // 检测业务类的指标无法编辑保存。

    // 发布闸门：只有口径完整的指标才允许发布
    if (item.status === 'published') {
      if (!item.definition.trim() || !item.formula.trim() || item.sourceTables.length === 0) {
        errors.status = '口径、公式与关联表均完整后才能发布';
      }
    }

    return errors;
  };

  const upsertMetric = (item: MetricDefinition): Record<string, string> => {
    const errors = validateMetric(item);
    if (Object.keys(errors).length > 0) return errors;

    const before = config.metrics.find((m) => m.id === item.id) ?? null;
    const normalized: MetricDefinition = {
      ...item,
      id: item.id || makeId('metric'),
      code: item.code.trim(),
      name: item.name.trim(),
      definition: item.definition.trim(),
      formula: item.formula.trim(),
      schemaVersion: before ? before.schemaVersion : '1.0',
      updatedAt: now(),
      updatedBy: CONFIG_OPERATOR.name
    };

    commit(
      'metrics',
      before ? 'update' : 'create',
      normalized.id,
      normalized.name,
      {
        ...config,
        metrics: before
          ? config.metrics.map((m) => (m.id === normalized.id ? normalized : m))
          : [...config.metrics, normalized]
      },
      diffRecords(before, normalized, METRIC_LABELS),
      `${before ? '修改' : '新增'}指标「${normalized.name}」`
    );
    return {};
  };

  const toggleMetric = (id: string): void => {
    const target = config.metrics.find((m) => m.id === id);
    if (!target) return;

    const next = METRIC_STATUS_META[target.status].callable ? 'disabled' : 'published';
    const updated: MetricDefinition = {
      ...target,
      status: next,
      updatedAt: now(),
      updatedBy: CONFIG_OPERATOR.name
    };

    // 发布前仍需通过口径完整性校验
    if (next === 'published') {
      const gate = validateMetric(updated);
      if (gate.definition || gate.formula || gate.sourceTables || gate.status) {
        window.alert(
          '该指标口径不完整，无法发布。请先补全业务释义、精准计算公式与关联数据表。'
        );
        return;
      }
    }

    commit(
      'metrics',
      'toggle',
      id,
      target.name,
      { ...config, metrics: config.metrics.map((m) => (m.id === id ? updated : m)) },
      diffRecords(target, updated, METRIC_LABELS),
      `${next === 'published' ? '发布' : '停用'}指标「${target.name}」`
    );
  };

  const deleteMetric = (id: string): void => {
    const target = config.metrics.find((m) => m.id === id);
    if (!target) return;

    // 删除闸门：已发布的必须先停用，避免误删正在被引擎引用的口径
    if (METRIC_STATUS_META[target.status].callable) {
      window.alert(`指标「${target.name}」处于已发布状态，请先停用后再删除。`);
      return;
    }
    if (!window.confirm(`确定删除指标「${target.name}」吗？`)) return;

    commit(
      'metrics',
      'delete',
      id,
      target.name,
      { ...config, metrics: config.metrics.filter((m) => m.id !== id) },
      diffRecords(target, null, METRIC_LABELS),
      `删除指标「${target.name}」`
    );
  };

  // ---------------- §2.2 维度 ----------------

  const validateDimension = (item: DimensionDefinition): Record<string, string> => {
    const errors: Record<string, string> = {};
    const code = item.code.trim();

    if (!item.name.trim()) {
      errors.name = '维度名称为必填项';
    } else if (
      config.dimensions.some(
        (d) =>
          d.id !== item.id &&
          d.category === item.category &&
          d.name.toLowerCase() === item.name.trim().toLowerCase()
      )
    ) {
      errors.name = '同一维度大类下已存在同名维度';
    }

    if (!code) {
      errors.code = '维度编码为必填项';
    } else if (!CODE_PATTERN.test(code)) {
      errors.code = '编码需以字母开头，且只能包含字母、数字和下划线';
    } else if (
      config.dimensions.some(
        (d) => d.id !== item.id && d.code.toLowerCase() === code.toLowerCase()
      )
    ) {
      errors.code = '该编码已存在，请更换';
    }

    if (!item.standardField.trim()) errors.standardField = '系统标准字段为必填项';

    // 需求说明：用户口语必须映射到标准字段
    if (item.aliases.length === 0) errors.aliases = '至少需要一条口语别名，否则用户提问无法映射';

    if (!item.usageScene.trim()) errors.usageScene = '业务使用场景为必填项';

    if (item.category === '业务维度' && item.enumValues.length === 0) {
      errors.enumValues = '业务维度至少需要一个标准枚举取值';
    }

    // 同一维度内两个枚举值声明相同别名 → 引擎无法判定，属于真实的口径冲突
    const aliasOwners = new Map<string, string>();
    for (const value of item.enumValues) {
      for (const alias of value.aliases ?? []) {
        const key = alias.trim().toLowerCase();
        if (!key) continue;
        const owner = aliasOwners.get(key);
        if (owner && owner !== value.value) {
          errors.enumValues = `别名「${alias}」同时指向「${owner}」和「${value.value}」，映射存在歧义`;
          break;
        }
        aliasOwners.set(key, value.value);
      }
      if (errors.enumValues) break;
    }

    if (item.category === '密级维度') {
      const level = item.requireClearance ?? 0;
      if (!Number.isInteger(level) || level < 0 || level > 3) {
        errors.requireClearance = '密级访问级别需为 0 到 3 的整数';
      }
    }

    return errors;
  };

  const upsertDimension = (item: DimensionDefinition): Record<string, string> => {
    const errors = validateDimension(item);
    if (Object.keys(errors).length > 0) return errors;

    const before = config.dimensions.find((d) => d.id === item.id) ?? null;
    const normalized: DimensionDefinition = {
      ...item,
      id: item.id || makeId('dim'),
      code: item.code.trim(),
      name: item.name.trim(),
      standardField: item.standardField.trim(),
      usageScene: item.usageScene.trim(),
      enumValues: item.enumValues.filter((v) => v.value.trim() !== ''),
      requireClearance: item.category === '密级维度' ? item.requireClearance ?? 0 : undefined,
      schemaVersion: before ? before.schemaVersion : '1.0',
      updatedAt: now(),
      updatedBy: CONFIG_OPERATOR.name
    };

    commit(
      'dimensions',
      before ? 'update' : 'create',
      normalized.id,
      normalized.name,
      {
        ...config,
        dimensions: before
          ? config.dimensions.map((d) => (d.id === normalized.id ? normalized : d))
          : [...config.dimensions, normalized]
      },
      diffRecords(before, normalized, DIMENSION_LABELS),
      `${before ? '修改' : '新增'}维度「${normalized.name}」`
    );
    return {};
  };

  const toggleDimension = (id: string): void => {
    const target = config.dimensions.find((d) => d.id === id);
    if (!target) return;
    const next: DimensionDefinition = { ...target, status: target.status === 'published' ? 'disabled' : 'published' };
    commit(
      'dimensions',
      'toggle',
      id,
      target.name,
      { ...config, dimensions: config.dimensions.map((d) => (d.id === id ? next : d)) },
      diffRecords(target, next, DIMENSION_LABELS),
      `${next.status === 'published' ? '启用' : '停用'}维度「${target.name}」`
    );
  };

  const deleteDimension = (id: string): void => {
    const target = config.dimensions.find((d) => d.id === id);
    if (!target) return;
    if (!window.confirm(`确定删除维度「${target.name}」吗？`)) return;
    commit(
      'dimensions',
      'delete',
      id,
      target.name,
      { ...config, dimensions: config.dimensions.filter((d) => d.id !== id) },
      diffRecords(target, null, DIMENSION_LABELS),
      `删除维度「${target.name}」`
    );
  };

  // ---------------- §2.3 表关联 ----------------

  const validateChain = (item: JoinChain): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!item.scene.trim()) {
      errors.scene = '场景名称为必填项';
    } else if (
      config.joinChains.some(
        (c) => c.id !== item.id && c.scene.trim() === item.scene.trim()
      )
    ) {
      errors.scene = '该场景已存在';
    }

    if (item.nodes.length === 0) {
      errors.nodes = '至少需要一个节点';
    } else if (item.nodes.length > config.boundary.maxJoinTables) {
      errors.nodes = `节点数不能超过 ${config.boundary.maxJoinTables} 张表（大模型边界限制）`;
    } else if (item.nodes.some((n) => !n.tableKey.trim() || !n.label.trim())) {
      errors.nodes = '每个节点都需要填写展示名与逻辑表名';
    }

    // 需求说明：统一左连接
    if (item.joinType !== 'LEFT') {
      errors.joinType = '需求说明要求统一使用左连接，不接受其它连接方式';
    }

    // 禁止规则 1：禁止跨业务域乱关联
    if (config.boundary.forbidCrossDomainJoin && item.businessDomain === 'research') {
      const crossed = item.nodes
        .map((n) => n.tableKey)
        .filter((table) => MARKET_ONLY_TABLES.includes(table));
      if (crossed.length > 0) {
        errors.businessDomain = `禁止跨业务域乱关联：科研域链路不得引用市场化数据表（${crossed.join('、')}）`;
      }
    }

    return errors;
  };

  const upsertChain = (item: JoinChain): Record<string, string> => {
    const errors = validateChain(item);
    if (Object.keys(errors).length > 0) return errors;

    const before = config.joinChains.find((c) => c.id === item.id) ?? null;
    const normalized: JoinChain = {
      ...item,
      id: item.id || makeId('chain'),
      scene: item.scene.trim(),
      joinType: 'LEFT',
      filterInvalid: true,
      schemaVersion: before ? before.schemaVersion : '1.0',
      updatedAt: now(),
      updatedBy: CONFIG_OPERATOR.name
    };

    commit(
      'joinChains',
      before ? 'update' : 'create',
      normalized.id,
      normalized.scene,
      {
        ...config,
        joinChains: before
          ? config.joinChains.map((c) => (c.id === normalized.id ? normalized : c))
          : [...config.joinChains, normalized]
      },
      diffRecords(before, normalized, CHAIN_LABELS),
      `${before ? '修改' : '新增'}标准链路「${normalized.scene}」`
    );
    return {};
  };

  const deleteChain = (id: string): void => {
    const target = config.joinChains.find((c) => c.id === id);
    if (!target) return;
    if (!window.confirm(`确定删除标准链路「${target.scene}」吗？`)) return;
    commit(
      'joinChains',
      'delete',
      id,
      target.scene,
      { ...config, joinChains: config.joinChains.filter((c) => c.id !== id) },
      diffRecords(target, null, CHAIN_LABELS),
      `删除标准链路「${target.scene}」`
    );
  };

  // ---------------- §2.4 统计规则 ----------------

  const saveStatRules = (next: StatRuleConfig): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (next.allowedPeriods.length === 0) errors.allowedPeriods = '至少需要允许一个统计周期';
    if (next.nodePriority.length === 0) errors.nodePriority = '业务节点优先级不能为空';
    if (next.includedStatuses.length === 0) errors.includedStatuses = '纳入状态不能为空';
    if (next.excludedStatuses.length === 0) errors.excludedStatuses = '剔除状态不能为空';

    const overlap = next.includedStatuses.filter((s) => next.excludedStatuses.includes(s));
    if (overlap.length > 0) {
      errors._form = `以下状态同时出现在纳入与剔除清单中，口径冲突：${overlap.join('、')}`;
    }

    if (!next.defaultScope.trim()) errors.defaultScope = '默认范围不能为空';
    if (!next.ownershipField.trim()) errors.ownershipField = '归属依据不能为空';
    if (!next.missingDimensionLabel.trim()) errors.missingDimensionLabel = '缺失维度归类名称不能为空';
    if (!Number.isFinite(next.nullFillValue)) errors.nullFillValue = '空值填充值必须为数字';

    if (Object.keys(errors).length > 0) return errors;

    commit(
      'statRules',
      'update',
      'stat-rules',
      '统计与过滤规则',
      { ...config, statRules: next },
      diffRecords(config.statRules as unknown as Record<string, unknown>, next as unknown as Record<string, unknown>),
      '修改统计与过滤规则'
    );
    return {};
  };

  // ---------------- §2.5 权限与脱敏 ----------------

  const savePermissions = (next: PermissionConfig): Record<string, string> => {
    const errors: Record<string, string> = {};
    const validFields = next.fieldRules.map((r) => r.field);

    next.roles.forEach((roleConfig) => {
      if (!Number.isInteger(roleConfig.clearanceLevel) || roleConfig.clearanceLevel < 0 || roleConfig.clearanceLevel > 3) {
        errors[`${roleConfig.role}.clearanceLevel`] = '密级访问级别需为 0 到 3 的整数';
      }
      const dangling = roleConfig.maskFields.filter((f) => !validFields.includes(f));
      if (dangling.length > 0) {
        errors[`${roleConfig.role}.maskFields`] = `以下字段不存在于脱敏规则中：${dangling.join('、')}`;
      }
    });

    if (errors._form || Object.keys(errors).length > 0) return errors;

    commit(
      'permissions',
      'update',
      'permissions',
      '权限与脱敏',
      { ...config, permissions: next },
      diffRecords(config.permissions as unknown as Record<string, unknown>, next as unknown as Record<string, unknown>),
      '修改权限与脱敏配置'
    );
    return {};
  };

  // ---------------- §3 / §4 大模型边界 ----------------

  const saveBoundary = (next: LlmBoundaryGuardrails): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!Number.isInteger(next.maxJoinTables) || next.maxJoinTables < 1 || next.maxJoinTables > 4) {
      errors.maxJoinTables = '关联表上限需为 1 到 4 的整数';
    }
    if (!next.forbidDirectDbAccess) {
      errors._form = '禁止直连底层数据库为硬约束，不可关闭';
    }

    if (Object.keys(errors).length > 0) return errors;

    commit(
      'boundary',
      'update',
      'boundary',
      '大模型边界',
      { ...config, boundary: next },
      diffRecords(config.boundary as unknown as Record<string, unknown>, next as unknown as Record<string, unknown>),
      '修改大模型边界护栏'
    );
    return {};
  };

  // ---------------- §2.6 版本与审计 ----------------
  // 回滚与重置由 MetricConfigProvider 提供（context.rollback / context.reset），
  // 逻辑与审计记录完全一致，此处不再重复实现。

  // ---------------- 语义引擎视角 ----------------
  // buildEnginePreview 已抽到 data/metricEngine.ts（纯函数，config 作首参），
  // 使本模块的预览弹窗与 AI 对话共用同一份实现，两边口径不可能不一致。

  const departmentCount = config.dimensions.filter((d) => d.category === '部门维度').length;

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="border-b border-slate-100 pb-5">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
          数据指标配置
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          智能问数系统的指标与维度配置中心。把《指标口径说明书》《维度字典手册》《数据表关联规范》
          固化为系统刚性配置，让 DeepSeek 只做意图识别，不做口径解释、不做表关联、不做 SQL 自由生成。
          所有变更均记入审计。
        </p>
      </div>

      {/* 汇总条 */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-xl border border-slate-100 shadow-sm px-5 py-4">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <div className="text-[10px] text-slate-400">指标（可调用 / 总数）</div>
            <div className="text-lg font-bold text-slate-800">
              {callableCount} / {config.metrics.length}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">维度</div>
            <div className="text-lg font-bold text-slate-800">{config.dimensions.length}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">标准链路</div>
            <div className="text-lg font-bold text-slate-800">{config.joinChains.length}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">部门维度</div>
            <div className="text-lg font-bold text-slate-800">{departmentCount}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">当前版本</div>
            <div className="font-mono text-lg font-bold text-slate-800">
              v{config.configVersion}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400">审计记录</div>
            <div className="text-lg font-bold text-slate-800">{history.changeLog.length}</div>
          </div>
        </div>
        <button onClick={reset} className={`${secondaryBtnClass} flex items-center gap-1.5`}>
          <RotateCcw className="h-3.5 w-3.5" />
          恢复默认配置
        </button>
      </div>

      {/* Tab 栏 */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-lg w-fit flex-wrap">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 面板 */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        {activeTab === 'metrics' && (
          <MetricCatalogPanel
            metrics={config.metrics}
            knownTables={knownTables}
            onSave={upsertMetric}
            onToggle={toggleMetric}
            onDelete={deleteMetric}
            onPreview={setPreviewMetric}
          />
        )}

        {activeTab === 'dimensions' && (
          <DimensionDictionaryPanel
            dimensions={config.dimensions}
            onSave={upsertDimension}
            onToggle={toggleDimension}
            onDelete={deleteDimension}
          />
        )}

        {activeTab === 'joinChains' && (
          <JoinChainPanel
            chains={config.joinChains}
            boundary={config.boundary}
            onSave={upsertChain}
            onDelete={deleteChain}
          />
        )}

        {activeTab === 'statRules' && (
          <StatRulePanel statRules={config.statRules} onSave={saveStatRules} />
        )}

        {activeTab === 'permissions' && (
          <PermissionMaskPanel permissions={config.permissions} onSave={savePermissions} />
        )}

        {activeTab === 'version' && (
          <VersionAuditPanel
            history={history}
            queryLog={queryLog}
            currentVersion={config.configVersion}
            onRollback={rollback}
            onClearQueryLog={clearQueryLog}
          />
        )}

        {activeTab === 'boundary' && (
          <LlmBoundaryPanel
            boundary={config.boundary}
            maxChainNodes={maxChainNodes}
            onSave={saveBoundary}
          />
        )}
      </div>

      {/* 语义引擎视角 */}
      {previewMetric && (
        <div className={modalOverlayClass}>
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className={modalHeaderClass}>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">语义引擎视角</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    只读预览：语义引擎按此配置生成查询，DeepSeek 不参与口径解释与表关联。
                  </p>
                </div>
                <button
                  onClick={() => setPreviewMetric(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <span className="text-2xl leading-none">×</span>
                </button>
              </div>

              <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-xs overflow-x-auto font-mono leading-relaxed">
                {JSON.stringify(buildEnginePreview(config, previewMetric), null, 2)}
              </pre>

              <div className={modalFooterClass}>
                <button
                  onClick={() => setPreviewMetric(null)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
