/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ContactPerson {
  id: string;
  name: string;
  avatar: string;
  role: string;
  phone: string;
  email: string;
}

export interface VisitRecord {
  id: string;
  date: string;
  type: '来访预约' | '实地拜访' | '合同会商' | '技术交流';
  topic: string;
  leader: string;
  location: string;
  handler: string;
  domain?: string;
  department: '技推处' | '低空产业处' | '信息管理处' | '元器件检测所' | '可靠性试验室';
}

export interface EnterpriseMetric {
  year: string;
  testingAmount: number;     // 检验检测 (万元)
  certAmount: number;        // 认证评估 (万元)
  calibrationAmount: number; // 计量校准 (万元)
  devAmount: number;         // 产品开发 (万元)
  trainingAmount: number;    // TSQ培训 (万元)
}

export interface DeptContribution {
  name: string;
  ratio: number; // e.g. 35 for 35%
  amount: number; // 万元
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  title: string;
  type: 'declare' | 'email' | 'meeting' | 'contract';
  phone?: string;
  email?: string;
  summary: string;
  detailsUrl?: string;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  type: string; // 股份有限公司, 国有企业, etc.
  growthCategory: '高增长类' | '稳健型' | '成熟型' | '初创潜力';
  partnershipLevel: '战略级合作伙伴' | '核心供应商' | '意向客户' | '普通客户';
  creditCode: string;
  representative: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  establishmentDate: string;
  registeredCapital: string; // E.g., "405.41 亿人民币"
  employeesScale: string;   // E.g., "10000 人以上"
  insuredEmployees: number; // e.g. 70416
  industry: string;
  taxpayerStatus: string;   // e.g. "一般纳税人"
  aiScore: number;
  complianceRating: number; // e.g. 95
  riskIndex: number;        // e.g. 12 (0-100, lower is better)
  tags: {
    coreDivision: string[];
    businessPreference: string[];
    otherTags: string[];
  };
  metrics: EnterpriseMetric[];
  deptContributions: DeptContribution[];
  contacts: ContactPerson[];
  visitRecords: VisitRecord[];
  activityLogs: ActivityLog[];
  // Saibao Labs specific business往来 summary
  saibaoCooperationSummary: string;
  cooperationContracts?: CooperationContract[];
}

export interface CooperationContract {
  id: string;
  contractNo: string;     // 合同编号
  name: string;           // 合同名称
  amount: number;         // 合同金额 (万元)
  signDate: string;       // 签署日期
  startDate: string;      // 生效日期
  endDate: string;        // 截止日期
  status: '履行中' | '已完成' | '待签署' | '变更中'; // 合同状态
  department: string;     // 承接部室
  projectLeader: string;  // 项目负责人
  summary: string;        // 合同摘要
}

export interface GroupData {
  id: string;
  name: string;
  logo: string;
  controllingEntity: string;
  totalSubCompanies: number;
  partneredCompanies: number;
  growthCategory: string;
  partnershipLevel: string;
  aiPotentialScore: number;
  cooperationSummary: string;
  riskHighlights: {
    level: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    date: string;
  }[];
  recommendationPaths: {
    step: number;
    title: string;
    description: string;
  }[];
  subCompanies: {
    id: string;
    name: string;
    isPartnered: boolean;
    cooperationAmount: number; // 万元
    lastDate: string;
    priority: '极高 P0' | '高 P1' | '中 P2' | '核心挖掘' | '战略储备';
    region: '华南' | '华北' | '华东' | '华中' | '西北';
  }[];
}

export interface AIInsightReport {
  title: string;
  subtitle: string;
  date: string;
  overview: string;
  stats: { label: string; value: string; trend?: string }[];
  recommendations: string[];
  visualData: { label: string; value1: number; value2?: number }[];
}

// 情报速递系统类型定义
export interface IntelligenceItem {
  id: string;
  title: string;
  type: 'policy' | 'standard' | 'technology' | 'tender' | 'competitor' | 'internal' | 'customer' | 'industry_hot';

  // 基础信息
  source: string;           // 来源：工信部、国标委、所内部门、大客户等
  sourceUrl?: string;        // 原文链接
  department: string;        // 相关业务部门
  publishTime: string;       // 发布时间
  tags: string[];            // 标签
  summary: string;           // AI生成的核心摘要
  content?: string;         // 完整内容

  // 价值标注
  priority: 'urgent' | 'important' | 'normal';  // 紧急、重要、普通
  isHighlighted: boolean;    // 是否标红置顶

  // 业务匹配
  businessMatch: string[];   // 关联业务：可靠性、计量校准、军工检测等
  relevanceScore?: number;   // 相关度评分 0-100

  // 情报来源分类
  sourceCategory?: 'internal' | 'external';  // 内部情报 / 外部情报
}

// 所内经营情报
export interface InternalOperationItem extends IntelligenceItem {
  type: 'internal';
  internalType: 'operation' | 'business' | 'project' | 'achievement';  // 经营信息 | 业务情况 | 项目进展 | 重大成果
  metrics?: {
    revenue?: number;        // 收入（万元）
    growth?: number;         // 增长率
    completion?: number;     // 完成率
  };
  department?: string;       // 所属部门：技推处、计量校准、军工检测等
}

// 大客户情报
export interface CustomerIntelligenceItem extends IntelligenceItem {
  type: 'customer';
  customerType: 'key_account' | 'potential' | 'opportunity';  // 重点客户 | 潜在客户 | 商机
  customerName: string;      // 客户名称
  contactPerson?: string;    // 联系人
  opportunityValue?: string;  // 商机金额
  requirement?: string;      // 需求描述
  nextStep?: string;         // 下一步计划
}

export interface StandardItem extends IntelligenceItem {
  standardNumber: string;     // 标准号：GB/T XXXX-2024
  effectiveDate?: string;    // 生效日期
  replaceStandard?: string;  // 替代标准
  status: 'draft' | 'effective' | 'revised' | 'deprecated';  // 草案、现行、修订、废止
}

export interface TenderItem extends IntelligenceItem {
  budget: string;            // 预算金额
  deadline: string;          // 截止时间
  region: string;            // 地区
  requirements: string;       // 采购要求
  contactInfo?: string;      // 联系方式
}

// 采集源配置
export interface IntelligenceSource {
  id: string;
  name: string;              // 采集源名称
  type: 'gov' | 'standard' | 'industry' | 'tender' | 'competitor';
  url: string;               // 采集地址
  enabled: boolean;          // 是否启用
  lastFetchTime?: string;    // 最后采集时间
  fetchFrequency: 'hourly' | 'daily' | 'weekly';  // 采集频率
  keywords?: string[];       // 关键词过滤
}

// 推送配置
export interface PushConfig {
  id: string;
  name: string;              // 推送规则名称
  type: 'realtime' | 'daily' | 'weekly' | 'monthly';  // 推送方式
  channels: ('system' | 'lanxin' | 'email')[];  // 推送渠道

  // 过滤条件
  categories?: IntelligenceItem['type'][];     // 情报类别
  priorities?: IntelligenceItem['priority'][];  // 优先级
  businessMatch?: string[];                     // 业务匹配

  // 推送对象
  targets: {
    type: 'all' | 'department' | 'individual';  // 推送范围
    departments?: string[];                      // 部门列表
    users?: string[];                           // 用户列表
  };

  enabled: boolean;          // 是否启用
}

// 情报简报
export interface IntelligenceReport {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  title: string;
  generatedAt: string;
  dateRange: string;         // 报告时间范围

  includeInternal: boolean;  // 所内经营信息
  includeCustomer: boolean;  // 大客户情况
  includePolicy: boolean;
  includeStandard: boolean;
  includeTechnology: boolean;
  includeTender: boolean;
  includeCompetitor: boolean;

  selectedItemIds: string[]; // 包含的情报ID
  status: 'draft' | 'generating' | 'completed';
  downloadUrl?: string;      // PDF下载链接
}

// 阅读记录
export interface ReadRecord {
  intelligenceId: string;
  userId: string;
  readAt: string;
  channel: 'system' | 'lanxin' | 'email';
}

export type IntelligenceCategoryType = 'all' | 'internal' | 'customer' | 'policy' | 'standard' | 'technology' | 'tender' | 'competitor' | 'industry_hot';
export type IntelligenceReportType = 'daily' | 'weekly' | 'monthly';

// 知识库相关类型定义
export interface KnowledgeBase {
  id: string;
  name: string;                    // 知识库名称
  description: string;             // 知识库描述
  category: KnowledgeCategory;     // 知识库分类
  type: 'user' | 'system';         // 知识库类型：用户创建/系统内置
  createdBy: string;               // 创建者
  createdAt: string;              // 创建时间
  updatedAt: string;              // 更新时间
  documentCount: number;          // 文档数量
  isPublic: boolean;             // 是否公开（其他用户可见）
}

export type KnowledgeCategory = 'policy' | 'business' | 'technology' | 'report' | 'custom';

export interface KnowledgeDocument {
  id: string;
  kbId: string;                    // 所属知识库ID
  title: string;                  // 文档标题
  content: string;                // 文档内容
  summary: string;               // 文档摘要
  source: string;                 // 来源
  sourceUrl?: string;            // 来源链接
  tags: string[];                 // 标签
  category: string;               // 分类
  fileType: 'intelligence' | 'monthly_report' | 'annual_report' | 'manual'; // 文件类型
  createdAt: string;             // 创建时间
  updatedAt: string;             // 更新时间
  createdBy: string;              // 创建者
  status: 'draft' | 'published';   // 状态
  viewCount: number;             // 查看次数
  isPinned: boolean;             // 是否置顶
}

// 知识库分类配置
export const KNOWLEDGE_CATEGORIES = {
  policy: { label: '政策法规', icon: 'FileText', color: 'blue', description: '国家政策、法律法规等' },
  business: { label: '业务经营', icon: 'Building2', color: 'indigo', description: '经营数据、业务分析等' },
  technology: { label: '技术标准', icon: 'TrendingUp', color: 'green', description: '技术标准、行业动态等' },
  report: { label: '报告文档', icon: 'FileText', color: 'purple', description: '月报、年报等报告文档' },
  custom: { label: '自定义', icon: 'Folder', color: 'slate', description: '用户自定义知识库' }
};

// ============================================================
// 数据指标配置中心 v2
// 对应《数据指标配置模块需求说明（简化版）》§2.1 - §2.6
//
// 定位：为 DeepSeek 大模型和语义引擎提供统一、固化、可审计的配置依据，
// 防止大模型自由生成 SQL 导致口径错乱。
//
// 注意：这里只放文案与标记，Tailwind 类名统一收在 components/metricConfigStyles.ts
// 中作为完整字面量，避免动态拼接导致 Tailwind JIT 扫描不到。
// ============================================================

// ---- 通用枚举 ----

/** 配置条目的生命周期状态。只有 published 可被语义引擎调用。 */
export type MetricStatus = 'draft' | 'published' | 'disabled' | 'deprecated';

export const METRIC_STATUS_META: Record<MetricStatus, { label: string; callable: boolean }> = {
  draft: { label: '草稿', callable: false },
  published: { label: '已发布', callable: true },
  disabled: { label: '已停用', callable: false },
  deprecated: { label: '已废弃', callable: false }
};

/** 统计周期。需求说明：自然日/周/月/季/年，不支持自定义周期。 */
export type StatPeriod = 'day' | 'week' | 'month' | 'quarter' | 'year';

export const STAT_PERIOD_META: Record<StatPeriod, { label: string }> = {
  day: { label: '自然日' },
  week: { label: '自然周' },
  month: { label: '自然月' },
  quarter: { label: '自然季' },
  year: { label: '自然年' }
};

/** 聚合方式 */
export type Aggregation = 'sum' | 'count' | 'count_distinct' | 'avg' | 'ratio' | 'max' | 'min';

export const AGGREGATION_META: Record<Aggregation, { label: string }> = {
  sum: { label: '求和' },
  count: { label: '计数' },
  count_distinct: { label: '去重计数' },
  avg: { label: '平均' },
  ratio: { label: '比率' },
  max: { label: '最大值' },
  min: { label: '最小值' }
};

// ---- §2.1 指标配置 ----

/** 指标大类 —— 逐字采用需求说明给出的九个分类 */
export type MetricCategoryName =
  | '客户经营'
  | '检测业务'
  | '科研专项'
  | '客户基础信息'
  | '客户联系人'
  | '合同管理'
  | '投标备案'
  | '服务采购'
  | '培训管理';

export const METRIC_CATEGORIES: MetricCategoryName[] = [
  '客户经营',
  '检测业务',
  '科研专项',
  '客户基础信息',
  '客户联系人',
  '合同管理',
  '投标备案',
  '服务采购',
  '培训管理'
];

/**
 * 指标定义。
 *
 * definition（业务释义）与 formula（精准计算公式）是本模块的核心：它们取代了大模型
 * 对口径的自由解释，因此校验中被强制要求非空。
 */
export interface MetricDefinition {
  id: string;
  code: string;                 // 唯一编码，如 testing_amount
  name: string;                 // 指标名称
  category: MetricCategoryName; // 指标大类
  definition: string;           // 业务释义
  formula: string;              // 精准计算公式
  period: StatPeriod;           // 统计周期
  sourceTables: string[];       // 关联数据表（logical tableKey）
  aggregation: Aggregation;     // 聚合方式
  specialNote?: string;         // 特殊业务说明
  status: MetricStatus;         // 只有 published 才能被调用
  schemaVersion: string;        // 该条目自身的小版本号
  updatedAt: string;
  updatedBy: string;
}

// ---- §2.2 维度字典 ----

export type DimensionCategory = '客户维度' | '时间维度' | '业务维度' | '部门维度' | '密级维度';

export const DIMENSION_CATEGORIES: DimensionCategory[] = [
  '客户维度',
  '时间维度',
  '业务维度',
  '部门维度',
  '密级维度'
];

/** 标准枚举取值。aliases 承载归并别名，如「可靠性测试」「环境试验」→ 可靠性试验。 */
export interface DimensionEnumValue {
  value: string;        // 标准取值
  label: string;        // 展示名
  aliases?: string[];   // 归并到此取值的口语说法
}

export interface DimensionDefinition {
  id: string;
  code: string;
  category: DimensionCategory;      // 维度大类
  name: string;                     // 维度名称
  standardField: string;            // 系统标准字段
  aliases: string[];                // 口语别名 / 专业术语
  enumValues: DimensionEnumValue[]; // 标准枚举取值
  usageScene: string;               // 业务使用场景
  requireClearance?: number;        // 密级维度所需访问级别 0-3；0 或未填 = 无限制
  status: MetricStatus;
  schemaVersion: string;
  updatedAt: string;
  updatedBy: string;
}

// ---- §2.3 表关联配置 ----

/** 节点对应的物理表在本仓库中是否已存在 */
export type TableSchemaStatus = 'exists' | 'planned';

/** 需求说明指定统一左连接 */
export type JoinType = 'LEFT' | 'INNER';

export interface JoinNode {
  order: number;                    // 从 1 开始的顺序
  label: string;                    // 展示名，如「客户主表」
  tableKey: string;                 // 逻辑表名
  schemaStatus: TableSchemaStatus;  // 是否已建表
  joinKey?: string;                 // 关联键
}

export interface JoinChain {
  id: string;
  scene: string;                    // 场景，如「市场化经营」
  nodes: JoinNode[];                // 节点数受 boundary.maxJoinTables 约束
  joinType: JoinType;
  filterInvalid: boolean;           // 自动过滤无效单据
  isolated: boolean;                // true = 与市场化数据隔离（科研专项）
  businessDomain: string;           // 业务域，跨域关联拦截的依据
  note?: string;
  status: MetricStatus;
  schemaVersion: string;
  updatedAt: string;
  updatedBy: string;
}

// ---- §2.4 统计与过滤规则 ----

/** 单对象而非列表：这一节是一组全局口径，不是可增删的条目 */
export interface StatRuleConfig {
  timezone: string;              // 固定北京时间
  allowedPeriods: StatPeriod[];
  customPeriodAllowed: boolean;  // 需求说明：不支持自定义周期
  defaultScope: string;          // 模糊提问默认范围
  defaultPeriod: StatPeriod;     // 模糊提问默认周期
  nodePriority: string[];        // 业务节点优先级
  includedStatuses: string[];    // 纳入统计的单据状态
  excludedStatuses: string[];    // 剔除的单据状态
  wipCountOnly: boolean;         // 在途单据仅展示数量
  revenueIncludesWip: boolean;   // 在途是否纳入营收
  ownershipField: string;        // 客户归属依据
  nullFillValue: number;         // 空值填充
  interceptAbnormal: boolean;    // 异常值拦截
  missingDimensionLabel: string; // 缺失维度归类
}

// ---- §2.5 权限与脱敏 ----

/** 数据范围 */
export type DataScope = 'all' | 'division' | 'self';

export const DATA_SCOPE_META: Record<DataScope, { label: string }> = {
  all: { label: '全院' },
  division: { label: '本院/本板块' },
  self: { label: '本人业务' }
};

/** 脱敏策略。example 用于界面上的实时样例预览。 */
export type MaskStrategy = 'none' | 'name' | 'phone' | 'address' | 'code';

export const MASK_STRATEGY_META: Record<MaskStrategy, { label: string; example: string }> = {
  none: { label: '不脱敏', example: '张伟' },
  name: { label: '姓名脱敏', example: '张*' },
  phone: { label: '电话脱敏', example: '138****5678' },
  address: { label: '地址脱敏', example: '广州市天河区***' },
  code: { label: '密级编号脱敏', example: 'MM-****' }
};

/** 敏感字段的脱敏规则 */
export interface SensitiveFieldRule {
  field: string;        // 对应的标准字段
  label: string;
  strategy: MaskStrategy;
  enabled: boolean;
}

/**
 * 角色访问配置。
 * role 直接复用本文件下方的 UserRole，避免出现两套互不相通的用户角色。
 */
export interface RoleAccessConfig {
  role: UserRole;
  dataScope: DataScope;
  clearanceLevel: number;   // 密级访问级别 0-3
  maskFields: string[];     // 命中的 SensitiveFieldRule.field
}

export interface PermissionConfig {
  roles: RoleAccessConfig[];
  fieldRules: SensitiveFieldRule[];
  blockNoClearance: boolean;   // 无权限密级维度提问直接拦截
  clearanceLabels: string[];   // 密级级别名称，索引即级别
}

// ---- §3 / §4 大模型边界与禁止规则 ----

export interface LlmBoundaryGuardrails {
  maxJoinTables: number;             // 单次查询关联表上限（禁止规则 3）
  forbidCrossDomainJoin: boolean;    // 禁止规则 1
  forbidCustomJoinFields: boolean;   // 禁止规则 2
  forbidDirectDbAccess: boolean;     // 禁止规则 4，锁定为 true
}

/** §3 能力矩阵的一行。只读展示，是契约而非旋钮。 */
export interface LlmCapabilityRow {
  capability: string;
  deepseek: 'allowed' | 'forbidden' | 'none';
  configCenter: string;
}

export const LLM_CAPABILITY_MATRIX: LlmCapabilityRow[] = [
  { capability: '意图识别', deepseek: 'allowed', configCenter: '—' },
  { capability: '指标口径', deepseek: 'forbidden', configCenter: '必须引用配置' },
  { capability: '维度映射', deepseek: 'forbidden', configCenter: '必须匹配字典' },
  { capability: '表关联', deepseek: 'forbidden', configCenter: '必须走标准链路' },
  { capability: 'SQL 生成', deepseek: 'forbidden', configCenter: '引擎按配置生成' },
  { capability: '权限判断', deepseek: 'forbidden', configCenter: '配置中心执行' }
];

// ---- 配置根对象 ----

/**
 * 配置根对象，也是 localStorage 中 `saibao.metricConfig` 的 data 载荷。
 *
 * 刻意不包含任何历史/审计字段：版本快照会整份保存 MetricConfig，若历史也放在这里，
 * 每次快照都会把此前全部历史再存一遍，体积指数增长。历史走独立的存储键，
 * 由 ConfigHistory 承载（见下方类型与 data/metricConfigHistory.ts）。
 */
export interface MetricConfig {
  schemaVersion: number;
  configVersion: string;   // 当前小版本号，如 '1.0'
  metrics: MetricDefinition[];
  dimensions: DimensionDefinition[];
  joinChains: JoinChain[];
  statRules: StatRuleConfig;
  permissions: PermissionConfig;
  boundary: LlmBoundaryGuardrails;
  updatedAt: string;
  updatedBy: string;
}

// ---- §2.6 版本与审计 ----

export type ConfigArea =
  | 'metrics'
  | 'dimensions'
  | 'joinChains'
  | 'statRules'
  | 'permissions'
  | 'boundary';

export type ChangeAction = 'create' | 'update' | 'delete' | 'toggle' | 'rollback' | 'reset';

/** 字段级变更明细 */
export interface FieldChange {
  field: string;
  label: string;
  before: string;
  after: string;
}

/**
 * 变更流水条目。
 * 字段设计对齐《数据库设计说明书》3.7.2 的 operation_logs 表
 * （operation_module / operation_action / target_id / target_type / operation_time），
 * 便于将来接后端时直接落库。
 */
export interface ChangeLogEntry {
  id: string;
  version: string;          // 本次变更产生的小版本号
  area: ConfigArea;
  entityId: string;
  entityName: string;
  action: ChangeAction;
  fieldChanges: FieldChange[];
  operator: string;
  operatorRole: string;
  at: string;
}

/** 版本快照。payload 为全量配置，结构上不含历史，故不可能递归。 */
export interface VersionSnapshot {
  version: string;
  at: string;
  operator: string;
  summary: string;
  payload: MetricConfig;
}

export interface ConfigHistory {
  latestVersion: string;
  snapshots: VersionSnapshot[];
  changeLog: ChangeLogEntry[];
}

/**
 * 查询日志 —— 运行期的提问记录，对应需求说明 §2.6 的
 * 「查询日志、DSL 报文、SQL、账号、时间全程留存」。
 *
 * 与 ConfigHistory 分开存放（独立存储键）：提问不是配置变更，不应递增
 * configVersion 也不应进入 changeLog；两者的保留策略也不同。
 */
export type QueryLogOutcome = 'answered_metric' | 'answered_dimension' | 'refused';

export interface QueryLogEntry {
  id: string;
  at: string;                 // ISO 时间
  asker: string;              // 提问人
  role: UserRole;             // 提问角色
  question: string;           // 原始提问
  outcome: QueryLogOutcome;
  metricCode?: string;
  metricName?: string;
  dimensionCode?: string;
  dimensionName?: string;
  hitTerm?: string;           // 命中的原始词汇，如「可靠性测试」
  callable: boolean;          // 是否可被语义引擎调用
}

// 用户角色定义
export type UserRole = 'institute_leader' | 'division_leader' | 'marketing_staff';

// 数据权限定义
export interface DataPermission {
  canViewInternal: boolean;     // 查看所内经营信息
  canViewCustomer: boolean;     // 查看大客户情况
  canViewPolicy: boolean;       // 查看政策法规
  canViewStandard: boolean;     // 查看标准更新
  canViewTechnology: boolean;   // 查看产业技术
  canViewTender: boolean;       // 查看招标项目
  canViewCompetitor: boolean;   // 查看竞品动态
  allowedDepartments?: string[]; // 允许查看的部门（如果有）
  division?: string;            // 所属板块
}

// 用户角色配置
export const ROLE_PERMISSIONS: Record<UserRole, { name: string; permission: DataPermission }> = {
  institute_leader: {
    name: '所领导',
    permission: {
      canViewInternal: true,
      canViewCustomer: true,
      canViewPolicy: true,
      canViewStandard: true,
      canViewTechnology: true,
      canViewTender: true,
      canViewCompetitor: true,
    },
  },
  division_leader: {
    name: '板块领导',
    permission: {
      canViewInternal: true,
      canViewCustomer: true,
      canViewPolicy: true,
      canViewStandard: true,
      canViewTechnology: true,
      canViewTender: true,
      canViewCompetitor: false,
      allowedDepartments: ['技推处', '计量校准', '军工检测', '元器件检测所', '可靠性试验室'],
      division: '检测业务板块',
    },
  },
  marketing_staff: {
    name: '市场人员',
    permission: {
      canViewInternal: false,
      canViewCustomer: true,
      canViewPolicy: true,
      canViewStandard: true,
      canViewTechnology: true,
      canViewTender: true,
      canViewCompetitor: true,
    },
  },
};

// 用户行为记录
export interface UserBehavior {
  id: string;
  type: 'search' | 'view' | 'bookmark' | 'share';
  timestamp: string;
  content: string;          // 搜索关键词或查看的情报ID
  category?: IntelligenceItem['type'];  // 关联的分类
  userId: string;
}

// 用户兴趣标签
export interface UserInterest {
  category: IntelligenceItem['type'];
  keywords: string[];        // 感兴趣的关键词
  score: number;            // 兴趣评分 0-100
  lastUpdated: string;
}

// 个性化推荐配置
export interface RecommendationConfig {
  enabled: boolean;
  algorithm: 'keyword' | 'collaborative' | 'hybrid';
  refreshInterval: number;  // 推荐刷新间隔（分钟）
  maxRecommendations: number; // 最大推荐数量
}
