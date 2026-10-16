/**
 * 语义引擎解析器 —— 纯函数，零 React 依赖。
 *
 * 这里是配置中心与 AI 对话之间唯一的桥：把用户提问解析到配置中的指标/维度，
 * 产出「口径 + 查询计划」，或在配置规则不允许时给出结构化拒绝。
 *
 * 设计原则（来自需求说明）：让大模型只做意图识别，不做口径解释、不做表关联、
 * 不做 SQL 自由生成。因此本模块只从配置读取，绝不计算任何数值。
 */

import type {
  Aggregation,
  DimensionDefinition,
  DimensionEnumValue,
  MaskStrategy,
  MetricCategoryName,
  MetricConfig,
  MetricDefinition,
  MetricStatus,
  QueryLogEntry,
  StatPeriod,
  TableSchemaStatus,
  UserRole
} from '../types';
import { METRIC_STATUS_META, ROLE_PERMISSIONS } from '../types';

// ============================================================
// 1. 查询计划（语义引擎视角）
// ============================================================

export interface EnginePreviewTable {
  tableKey: string;
  schemaStatus: TableSchemaStatus | 'unknown';
}

export interface EngineMaskedField {
  field: string;
  label: string;
  strategy: MaskStrategy;
  appliesToRole: UserRole;
}

export interface EnginePreview {
  metricCode: string;
  metricName: string;
  category: MetricCategoryName;
  definition: string;
  formula: string;
  aggregation: Aggregation;
  period: StatPeriod;
  resolvedTables: EnginePreviewTable[];
  joinChain: string[] | null;
  joinType: 'LEFT';
  filters: {
    nodePriority: string[];
    includedStatuses: string[];
    excludedStatuses: string[];
    wipCountOnly: boolean;
    revenueIncludesWip: boolean;
    nullFillValue: number;
    missingDimensionLabel: string;
  };
  defaultScope: string;
  defaultPeriod: StatPeriod;
  maskedFields: EngineMaskedField[];
  boundary: {
    maxJoinTables: number;
    forbidCrossDomainJoin: boolean;
    forbidDirectDbAccess: boolean;
  };
  callable: boolean;
}

/**
 * 把一条指标解析成语义引擎实际会收到的东西。
 * 配置模块的「语义引擎视角」弹窗与 AI 对话共用此函数，保证两边口径不可能不一致。
 */
export function buildEnginePreview(config: MetricConfig, metric: MetricDefinition): EnginePreview {
  const ownedChains = config.joinChains.filter((chain) =>
    metric.sourceTables.some((table) => chain.nodes.some((node) => node.tableKey === table))
  );

  const maskedFields = config.permissions.roles.flatMap((roleConfig) =>
    roleConfig.maskFields.map((field) => {
      const rule = config.permissions.fieldRules.find((f) => f.field === field);
      return {
        field,
        label: rule?.label ?? field,
        strategy: rule?.strategy ?? ('none' as MaskStrategy),
        appliesToRole: roleConfig.role
      };
    })
  );

  return {
    metricCode: metric.code,
    metricName: metric.name,
    category: metric.category,
    definition: metric.definition,
    formula: metric.formula,
    aggregation: metric.aggregation,
    period: metric.period,
    resolvedTables: metric.sourceTables.map((table) => {
      const node = config.joinChains.flatMap((c) => c.nodes).find((n) => n.tableKey === table);
      return { tableKey: table, schemaStatus: node?.schemaStatus ?? 'unknown' };
    }),
    joinChain: ownedChains.length > 0 ? ownedChains.map((c) => c.scene) : null,
    joinType: 'LEFT',
    filters: {
      nodePriority: config.statRules.nodePriority,
      includedStatuses: config.statRules.includedStatuses,
      excludedStatuses: config.statRules.excludedStatuses,
      wipCountOnly: config.statRules.wipCountOnly,
      revenueIncludesWip: config.statRules.revenueIncludesWip,
      nullFillValue: config.statRules.nullFillValue,
      missingDimensionLabel: config.statRules.missingDimensionLabel
    },
    defaultScope: config.statRules.defaultScope,
    defaultPeriod: config.statRules.defaultPeriod,
    maskedFields,
    boundary: {
      maxJoinTables: config.boundary.maxJoinTables,
      forbidCrossDomainJoin: config.boundary.forbidCrossDomainJoin,
      forbidDirectDbAccess: config.boundary.forbidDirectDbAccess
    },
    callable: METRIC_STATUS_META[metric.status]?.callable ?? false
  };
}

// ============================================================
// 2. 脱敏
// ============================================================

/** 脱敏预览用的原始样例值。与 PermissionMaskPanel 共用，保证两边显示一致。 */
export const PERMISSION_SAMPLE_SOURCES: Record<string, string> = {
  contact_name: '张伟',
  contact_phone: '13812345678',
  company_address: '广州市天河区中山大道西 1 号',
  secret_code: 'MM-2026-0871'
};

/**
 * 真实的脱敏计算。
 *
 * 规则刻意设计成能精确复现 MASK_STRATEGY_META 里原有的静态样例字符串 ——
 * 这样配置页的显示外观不变，但样例从此是算出来的而不是写死的。
 */
export function applyMask(strategy: MaskStrategy, value: string): string {
  const raw = value ?? '';
  if (!raw || strategy === 'none') return raw;

  switch (strategy) {
    case 'name':
      return raw.length <= 1 ? raw : `${raw.slice(0, 1)}${'*'.repeat(raw.length - 1)}`;
    case 'phone':
      // 11 位手机号保留前 3 后 4；其它长度整体遮蔽，避免泄露位数结构
      return raw.length === 11 ? `${raw.slice(0, 3)}****${raw.slice(-4)}` : '****';
    case 'address':
      return raw.length <= 6 ? '***' : `${raw.slice(0, 6)}***`;
    case 'code': {
      // 取前导的非数字段作为前缀，如 MM-2026-0871 → MM-****
      const prefix = raw.match(/^[^\d]*/)?.[0] ?? '';
      return prefix ? `${prefix}****` : '****';
    }
    default:
      return raw;
  }
}

export interface ResolvedMaskedField {
  field: string;
  label: string;
  strategy: MaskStrategy;
  sample: string;
}

/** 当前角色实际生效的脱敏字段（角色 maskFields ∩ 启用中的 fieldRules） */
export function resolveMaskedFields(config: MetricConfig, role: UserRole): ResolvedMaskedField[] {
  const roleConfig = config.permissions.roles.find((r) => r.role === role);
  if (!roleConfig) return [];

  return roleConfig.maskFields
    .map((field) => config.permissions.fieldRules.find((f) => f.field === field))
    .filter((rule): rule is NonNullable<typeof rule> => Boolean(rule) && rule!.enabled)
    .map((rule) => ({
      field: rule.field,
      label: rule.label,
      strategy: rule.strategy,
      sample: applyMask(rule.strategy, PERMISSION_SAMPLE_SOURCES[rule.field] ?? '')
    }));
}

// ============================================================
// 3. 匹配
// ============================================================

/**
 * 置信度阈值与长度权重。
 *
 * score = base + LENGTH_WEIGHT × 归一化词长，因此阈值实际等价于要求命中词
 * 至少 4 个字符（短词一律够不到）。各来源的产出：
 *
 *   客户合同总额(指标名,6) = 40+48 = 88  ✅ 指标
 *   客户总数    (指标名,4) = 40+32 = 72  ✅ 指标
 *   可靠性测试(枚举别名,5) = 26+40 = 66  ✅ 维度   ← 需求说明点名的归并场景
 *   客户密级    (维度名,4) = 30+32 = 62  ✅ 维度 → 触发密级校验
 *   环境试验(枚举别名,4) = 26+32 = 58  ✅ 维度（恰好压线）
 *   试验类型(维度别名,4) = 26+32 = 58  ✅ 维度
 *   客户/企业(维度别名,2) = 26+16 = 42  ❌ 落回存量逻辑
 *   战略级    (枚举别名,3) = 26+24 = 50  ❌
 *
 * 所有 2-3 字的泛化别名在结构上就够不到阈值，因此无需维护停用词表。
 * ⚠️ 调整 LENGTH_WEIGHT 时「环境试验」会最先受影响。
 */
export const MIN_CONFIDENCE = 58;
export const LENGTH_WEIGHT = 8;

export type MatchSource =
  | 'metric_name'
  | 'metric_code'
  | 'dimension_name'
  | 'dimension_alias'
  | 'dimension_code'
  | 'enum_value'
  | 'enum_alias';

interface Candidate {
  term: string;
  source: MatchSource;
  base: number;
  metric?: MetricDefinition;
  dimension?: DimensionDefinition;
  enumValue?: DimensionEnumValue;
}

interface Scored {
  candidate: Candidate;
  score: number;
}

/** 只保留字母、数字与中日韩汉字，去掉空白与全部标点 */
function normalize(input: string): string {
  return (input ?? '').toLowerCase().replace(/[^0-9a-z一-龥]/g, '');
}

/**
 * 机构后缀守卫：命中维度类词汇后若紧跟「室/部/所/院/中心/处/科」，
 * 说明用户说的是机构名而非维度。
 * 例：「可靠性试验室有多少人」中的「可靠性试验」不应劫持提问 ——
 * 可靠性试验室是 ROLE_PERMISSIONS 里真实存在的部门名。
 */
const INSTITUTION_SUFFIXES = ['室', '部', '所', '院', '中心', '处', '科'];

function isInstitutionHit(normalizedQuery: string, index: number, termLength: number): boolean {
  const following = normalizedQuery.slice(index + termLength, index + termLength + 1);
  return INSTITUTION_SUFFIXES.includes(following);
}

const isDimensionSource = (source: MatchSource): boolean =>
  source === 'dimension_name' ||
  source === 'dimension_alias' ||
  source === 'dimension_code' ||
  source === 'enum_value' ||
  source === 'enum_alias';

export interface MatchOutcome {
  metric?: Scored;
  dimension?: Scored;
}

/**
 * 在配置中查找与提问最相关的指标与维度。
 * 遍历顺序固定（配置数组顺序），同分时先到者胜，结果确定可复现。
 */
export function matchMetricOrDimension(config: MetricConfig, query: string): MatchOutcome {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return {};

  const candidates: Candidate[] = [];

  config.metrics.forEach((metric) => {
    candidates.push({ term: metric.name, source: 'metric_name', base: 40, metric });
    candidates.push({ term: metric.code, source: 'metric_code', base: 35, metric });
  });

  config.dimensions.forEach((dimension) => {
    candidates.push({ term: dimension.name, source: 'dimension_name', base: 30, dimension });
    candidates.push({ term: dimension.code, source: 'dimension_code', base: 28, dimension });
    (dimension.aliases ?? []).forEach((alias) => {
      candidates.push({ term: alias, source: 'dimension_alias', base: 26, dimension });
    });
    (dimension.enumValues ?? []).forEach((enumValue) => {
      candidates.push({
        term: enumValue.value,
        source: 'enum_value',
        base: 22,
        dimension,
        enumValue
      });
      (enumValue.aliases ?? []).forEach((alias) => {
        candidates.push({
          term: alias,
          source: 'enum_alias',
          base: 26,
          dimension,
          enumValue
        });
      });
    });
  });

  let bestMetric: Scored | undefined;
  let bestDimension: Scored | undefined;

  candidates.forEach((candidate) => {
    const term = normalize(candidate.term);
    if (term.length < 2) return;

    const index = normalizedQuery.indexOf(term);
    if (index === -1) return;

    if (isDimensionSource(candidate.source) && isInstitutionHit(normalizedQuery, index, term.length)) {
      return;
    }

    const scored: Scored = { candidate, score: candidate.base + LENGTH_WEIGHT * term.length };
    const isMetric = candidate.source === 'metric_name' || candidate.source === 'metric_code';
    const current = isMetric ? bestMetric : bestDimension;

    if (
      !current ||
      scored.score > current.score ||
      // 同分时取更长的词，更具体者优先
      (scored.score === current.score &&
        normalize(scored.candidate.term).length > normalize(current.candidate.term).length)
    ) {
      if (isMetric) bestMetric = scored;
      else bestDimension = scored;
    }
  });

  const outcome: MatchOutcome = {};
  if (bestMetric) outcome.metric = bestMetric;
  if (bestDimension) outcome.dimension = bestDimension;
  return outcome;
}

// ============================================================
// 4. 解析与拒绝
// ============================================================

export interface MetricResolution {
  metric: MetricDefinition;
  preview: EnginePreview;
  hitTerm: string;
  matchedBy: MatchSource;
  confidence: number;
  callable: boolean;
}

export interface DimensionResolution {
  dimension: DimensionDefinition;
  enumValue: DimensionEnumValue | null;
  requiresClearance: number;
  fields: ResolvedMaskedField[];
  hitTerm: string;
  matchedBy: MatchSource;
  confidence: number;
}

export type RefusalReason =
  | 'metric_not_published'
  | 'dimension_not_published'
  | 'dimension_no_clearance';

export interface Refusal {
  reason: RefusalReason;
  role: UserRole;
  metric?: MetricDefinition;
  dimension?: DimensionDefinition;
  status?: MetricStatus;
  requiredClearance?: number;
  roleClearance?: number;
}

export type ResolveResult =
  | { kind: 'none' }
  | { kind: 'metric'; resolution: MetricResolution }
  | { kind: 'dimension'; resolution: DimensionResolution }
  | { kind: 'refused'; refusal: Refusal };

/** 当前角色的密级访问级别。角色缺失时保守取 0，绝不抛错。 */
export function roleClearanceOf(config: MetricConfig, role: UserRole): number {
  return config.permissions.roles.find((r) => r.role === role)?.clearanceLevel ?? 0;
}

/**
 * 把用户提问解析为配置口径，或在配置规则不允许时给出拒绝。
 *
 * 指标优先于维度：只有当指标的置信度不低于维度时才走指标分支。
 */
export function resolveChatQuery(
  config: MetricConfig,
  query: string,
  role: UserRole
): ResolveResult {
  const { metric, dimension } = matchMetricOrDimension(config, query);
  const roleClearance = roleClearanceOf(config, role);

  if (
    metric &&
    metric.score >= MIN_CONFIDENCE &&
    metric.score >= (dimension?.score ?? -1)
  ) {
    const target = metric.candidate.metric;
    if (!target) return { kind: 'none' };

    const callable = METRIC_STATUS_META[target.status]?.callable ?? false;
    if (!callable) {
      return {
        kind: 'refused',
        refusal: {
          reason: 'metric_not_published',
          metric: target,
          status: target.status,
          role
        }
      };
    }

    return {
      kind: 'metric',
      resolution: {
        metric: target,
        preview: buildEnginePreview(config, target),
        hitTerm: metric.candidate.term,
        matchedBy: metric.candidate.source,
        confidence: metric.score,
        callable: true
      }
    };
  }

  if (dimension && dimension.score >= MIN_CONFIDENCE) {
    const target = dimension.candidate.dimension;
    if (!target) return { kind: 'none' };

    if (target.status !== 'published') {
      return {
        kind: 'refused',
        refusal: {
          reason: 'dimension_not_published',
          dimension: target,
          status: target.status,
          role
        }
      };
    }

    const requiresClearance =
      target.category === '密级维度' ? target.requireClearance ?? 0 : 0;

    if (
      requiresClearance > 0 &&
      config.permissions.blockNoClearance &&
      roleClearance < requiresClearance
    ) {
      return {
        kind: 'refused',
        refusal: {
          reason: 'dimension_no_clearance',
          dimension: target,
          requiredClearance: requiresClearance,
          roleClearance,
          role
        }
      };
    }

    return {
      kind: 'dimension',
      resolution: {
        dimension: target,
        enumValue: dimension.candidate.enumValue ?? null,
        requiresClearance,
        fields: resolveMaskedFields(config, role),
        hitTerm: dimension.candidate.term,
        matchedBy: dimension.candidate.source,
        confidence: dimension.score
      }
    };
  }

  return { kind: 'none' };
}

/** 拒绝文案。集中在解析器内，不在聊天组件里散落。 */
export function refusalMessage(config: MetricConfig, refusal: Refusal): string {
  const roleName = ROLE_PERMISSIONS[refusal.role]?.name ?? refusal.role;
  const labels = config.permissions.clearanceLabels ?? [];

  switch (refusal.reason) {
    case 'metric_not_published': {
      const statusLabel = refusal.status
        ? METRIC_STATUS_META[refusal.status]?.label ?? refusal.status
        : '未知';
      return (
        `⚠️ 指标「${refusal.metric?.name ?? ''}」当前状态为「${statusLabel}」，尚未发布。\n\n` +
        `按数据指标配置中心规则「只有已发布才能被调用」，该指标无法生成查询计划。` +
        `请先在 指标配置 中补全口径并发布后再提问。`
      );
    }
    case 'dimension_not_published': {
      const statusLabel = refusal.status
        ? METRIC_STATUS_META[refusal.status]?.label ?? refusal.status
        : '未知';
      return `⚠️ 维度「${refusal.dimension?.name ?? ''}」当前状态为「${statusLabel}」，未发布，无法用于维度映射。`;
    }
    case 'dimension_no_clearance': {
      const required = refusal.requiredClearance ?? 0;
      const own = refusal.roleClearance ?? 0;
      return (
        `⛔ 维度「${refusal.dimension?.name ?? ''}」为密级维度，所需密级级别为 ${required}（${labels[required] ?? '—'}）。\n\n` +
        `当前提问角色「${roleName}」的访问级别为 ${own}（${labels[own] ?? '—'}）。\n\n` +
        `按配置中心权限规则「无权限密级维度提问直接拦截」，本次提问已被拒绝。`
      );
    }
    default:
      return '本次提问已被配置中心拒绝。';
  }
}

// ============================================================
// 5. 查询日志构造
// ============================================================

export function buildQueryLogEntry(
  question: string,
  role: UserRole,
  result: ResolveResult,
  asker: string
): Omit<QueryLogEntry, 'id' | 'at'> {
  const base = { asker, role, question };

  if (result.kind === 'metric') {
    return {
      ...base,
      outcome: 'answered_metric',
      metricCode: result.resolution.metric.code,
      metricName: result.resolution.metric.name,
      hitTerm: result.resolution.hitTerm,
      callable: result.resolution.callable
    };
  }

  if (result.kind === 'dimension') {
    return {
      ...base,
      outcome: 'answered_dimension',
      dimensionCode: result.resolution.dimension.code,
      dimensionName: result.resolution.dimension.name,
      hitTerm: result.resolution.hitTerm,
      callable: result.resolution.dimension.status === 'published'
    };
  }

  if (result.kind === 'refused') {
    return {
      ...base,
      outcome: 'refused',
      metricCode: result.refusal.metric?.code,
      metricName: result.refusal.metric?.name,
      dimensionCode: result.refusal.dimension?.code,
      dimensionName: result.refusal.dimension?.name,
      callable: false
    };
  }

  return { ...base, outcome: 'refused', callable: false };
}
