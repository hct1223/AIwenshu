/**
 * 数据指标配置中心 v2 —— 存储键、种子数据与迁移。
 *
 * 种子数据的依据：
 *   - 指标大类、表关联链路、统计与过滤规则、大模型边界：逐字取自
 *     《数据指标配置模块需求说明（简化版）》§2.1 / §2.3 / §2.4 / §3 / §4
 *   - 具体指标的口径与关联表：对齐《数据库设计说明书》的真实表结构
 *
 * ⚠️ 表名诚实性：需求说明 §2.3 的链路里，客户主表、委托业务表、合同表、回款流水表等
 * 大部分在《数据库设计说明书》中并不存在。这些节点一律标记 schemaStatus: 'planned'，
 * 界面上以「待建表」徽章呈现，绝不伪装成已建好的表。只有 company_info / company_contacts /
 * company_metrics / department_contributions / cooperation_contracts 是仓库中真实存在的表。
 */

import type {
  Aggregation,
  ConfigHistory,
  DimensionCategory,
  DimensionDefinition,
  JoinChain,
  JoinNode,
  MetricCategoryName,
  MetricConfig,
  MetricDefinition,
  MetricStatus,
  QueryLogEntry,
  StatPeriod,
  UserRole
} from '../types';

export const METRIC_CONFIG_STORAGE_KEY = 'saibao.metricConfig';
export const METRIC_CONFIG_VERSION = 2;

export const METRIC_HISTORY_STORAGE_KEY = 'saibao.metricConfig.history';
export const METRIC_HISTORY_VERSION = 1;

/**
 * 查询日志使用独立存储键，刻意不并入 ConfigHistory。
 *
 * 并入的话必须把 METRIC_HISTORY_VERSION 从 1 升到 2，而 migrateMetricHistory 对
 * 版本不符一律返回 null → usePersistentState 回退默认值，会静默清空现有全部快照与
 * 变更流水。此外 commit 每次写入的都是整份 history（最多约 1.5MB），而提问是高频
 * 动作，并入会造成严重的写放大。
 */
export const QUERY_LOG_STORAGE_KEY = 'saibao.metricConfig.queryLog';
export const QUERY_LOG_VERSION = 1;

/**
 * 操作人。与侧边栏的操作人保持一致。
 *
 * 注意：权限页里的角色切换器是「模拟预览」控件，不参与审计记录 —— 在没有登录态的
 * 情况下，让预览控件改写审计主体会产生「到底是谁改的」的歧义。
 */
export const CONFIG_OPERATOR = {
  name: '陈主任',
  account: '决策舱主管账户',
  role: 'institute_leader' as UserRole
};

const SEED_AT = '2026-10-16T00:00:00.000Z';
const SEED_VERSION = '1.0';

// ---------------- 种子构造函数（仅为让下方的数据表更易读） ----------------

function metric(
  id: string,
  code: string,
  name: string,
  category: MetricCategoryName,
  definition: string,
  formula: string,
  period: StatPeriod,
  sourceTables: string[],
  aggregation: Aggregation,
  status: MetricStatus = 'published',
  specialNote?: string
): MetricDefinition {
  return {
    id,
    code,
    name,
    category,
    definition,
    formula,
    period,
    sourceTables,
    aggregation,
    specialNote,
    status,
    schemaVersion: SEED_VERSION,
    updatedAt: SEED_AT,
    updatedBy: CONFIG_OPERATOR.name
  };
}

function dimension(
  id: string,
  code: string,
  category: DimensionCategory,
  name: string,
  standardField: string,
  aliases: string[],
  usageScene: string,
  enumValues: DimensionDefinition['enumValues'] = [],
  requireClearance?: number
): DimensionDefinition {
  return {
    id,
    code,
    category,
    name,
    standardField,
    aliases,
    enumValues,
    usageScene,
    requireClearance,
    status: 'published',
    schemaVersion: SEED_VERSION,
    updatedAt: SEED_AT,
    updatedBy: CONFIG_OPERATOR.name
  };
}

function node(
  order: number,
  label: string,
  tableKey: string,
  schemaStatus: JoinNode['schemaStatus'],
  joinKey?: string
): JoinNode {
  return { order, label, tableKey, schemaStatus, joinKey };
}

function chain(
  id: string,
  scene: string,
  businessDomain: string,
  nodes: JoinNode[],
  isolated = false,
  note?: string
): JoinChain {
  return {
    id,
    scene,
    nodes,
    joinType: 'LEFT',
    filterInvalid: true,
    isolated,
    businessDomain,
    note,
    status: 'published',
    schemaVersion: SEED_VERSION,
    updatedAt: SEED_AT,
    updatedBy: CONFIG_OPERATOR.name
  };
}

// ---------------- 默认配置 ----------------

export const DEFAULT_METRIC_CONFIG: MetricConfig = {
  schemaVersion: METRIC_CONFIG_VERSION,
  configVersion: SEED_VERSION,
  updatedAt: SEED_AT,
  updatedBy: CONFIG_OPERATOR.name,

  // ---- §2.1 指标配置：27 条，覆盖九个大类 ----
  // customer_revenue_rate 与 research_accept_rate 刻意保留为 draft，
  // 用来直观验证「只有已发布才能被调用」。
  metrics: [
    // 客户经营
    metric(
      'm-customer-contract-amount',
      'customer_contract_amount',
      '客户合同总额',
      '客户经营',
      '统计周期内客户签订的合同金额合计，是客户经营规模的核心口径。',
      'SUM(cooperation_contracts.contract_amount)',
      'month',
      ['cooperation_contracts'],
      'sum',
      'published',
      '客户归属以合同签约分院为唯一归属，不按联系人或接单部门归属。'
    ),
    metric(
      'm-customer-payment-amount',
      'customer_payment_amount',
      '客户回款总额',
      '客户经营',
      '统计周期内客户实际回款金额合计，用于评价营收实现情况。',
      'SUM(payment_flow.amount)',
      'month',
      ['payment_flow'],
      'sum',
      'published',
      '在途单据不纳入营收统计。'
    ),
    metric(
      'm-customer-revenue-rate',
      'customer_revenue_rate',
      '客户营收完成率',
      '客户经营',
      '回款金额与合同金额的比值，衡量营收完成进度。',
      '回款总额 / 合同总额 × 100',
      'month',
      ['payment_flow', 'cooperation_contracts'],
      'ratio',
      'draft',
      '草稿状态：口径待与财务确认后再发布，当前不可被语义引擎调用。'
    ),
    metric(
      'm-active-customer-count',
      'active_customer_count',
      '活跃客户数',
      '客户经营',
      '统计周期内有有效合同往来的去重客户数量。',
      'COUNT(DISTINCT cooperation_contracts.company_id) WHERE 单据有效',
      'month',
      ['cooperation_contracts'],
      'count_distinct'
    ),

    // 检测业务
    metric(
      'm-testing-amount',
      'testing_amount',
      '检验检测收入',
      '检测业务',
      '元器件筛选与可靠性检测业务的收入金额。',
      'SUM(company_metrics.testing_amount)',
      'month',
      ['company_metrics'],
      'sum'
    ),
    metric(
      'm-cert-amount',
      'cert_amount',
      '认证评估收入',
      '检测业务',
      '质量认证与安全评估业务的收入金额。',
      'SUM(company_metrics.cert_amount)',
      'month',
      ['company_metrics'],
      'sum'
    ),
    metric(
      'm-calibration-amount',
      'calibration_amount',
      '计量校准收入',
      '检测业务',
      '高精计量与参数校准业务的收入金额。',
      'SUM(company_metrics.calibration_amount)',
      'month',
      ['company_metrics'],
      'sum'
    ),
    metric(
      'm-testing-total-amount',
      'testing_total_amount',
      '检测业务合计',
      '检测业务',
      '检验检测、认证评估、计量校准三项检测类业务的收入合计。',
      '检验检测收入 + 认证评估收入 + 计量校准收入',
      'month',
      ['company_metrics'],
      'sum'
    ),

    // 科研专项
    metric(
      'm-research-contract-amount',
      'research_contract_amount',
      '科研专项合同额',
      '科研专项',
      '科研专项类项目的合同金额合计。',
      'SUM(research_projects.amount)',
      'quarter',
      ['research_projects'],
      'sum',
      'published',
      '与市场化数据隔离，禁止与回款流水表关联。'
    ),
    metric(
      'm-research-project-count',
      'research_project_count',
      '科研专项项目数',
      '科研专项',
      '统计周期内立项的科研专项项目数量。',
      'COUNT(research_projects.id)',
      'quarter',
      ['research_projects'],
      'count',
      'published',
      '与市场化数据隔离，禁止与回款流水表关联。'
    ),
    metric(
      'm-research-accept-rate',
      'research_accept_rate',
      '科研专项验收完成率',
      '科研专项',
      '已验收科研项目数与立项数的比值。',
      '已验收项目数 / 立项数 × 100',
      'year',
      ['research_projects'],
      'ratio',
      'draft',
      '草稿状态：验收标准待科研管理部门确认，当前不可被语义引擎调用。'
    ),

    // 客户基础信息
    metric(
      'm-customer-total-count',
      'customer_total_count',
      '客户总数',
      '客户基础信息',
      '在库客户档案的总数量。',
      'COUNT(company_info.id)',
      'year',
      ['company_info'],
      'count'
    ),
    metric(
      'm-strategic-customer-count',
      'strategic_customer_count',
      '战略级客户数',
      '客户基础信息',
      '合作等级为战略级合作伙伴的客户数量。',
      "COUNT(company_info.id) WHERE partnership_level = '战略级合作伙伴'",
      'year',
      ['company_info'],
      'count'
    ),
    metric(
      'm-customer-industry-count',
      'customer_industry_count',
      '客户行业分布数',
      '客户基础信息',
      '客户覆盖的行业大类去重数量，用于评价客户结构广度。',
      'COUNT(DISTINCT company_info.industry)',
      'year',
      ['company_info'],
      'count_distinct'
    ),

    // 客户联系人
    metric(
      'm-contact-total-count',
      'contact_total_count',
      '联系人总数',
      '客户联系人',
      '在库客户联系人记录总数。',
      'COUNT(company_contacts.id)',
      'month',
      ['company_contacts'],
      'count',
      'published',
      '联系人姓名与联系方式对外展示需脱敏。'
    ),
    metric(
      'm-key-contact-cover-count',
      'key_contact_cover_count',
      '重点客户联系人覆盖数',
      '客户联系人',
      '重点客户中已建立主要联系人档案的去重客户数。',
      'COUNT(DISTINCT company_contacts.company_id) WHERE 主要联系人',
      'month',
      ['company_contacts'],
      'count_distinct',
      'published',
      '联系人姓名与联系方式对外展示需脱敏。'
    ),

    // 合同管理
    metric(
      'm-contract-sign-amount',
      'contract_sign_amount',
      '合同签约额',
      '合同管理',
      '有效状态下合同的签约金额合计。',
      "SUM(cooperation_contracts.contract_amount) WHERE contract_status IN ('履行中','已完成')",
      'month',
      ['cooperation_contracts'],
      'sum',
      'published',
      '草稿、作废、撤销状态单据一律剔除。'
    ),
    metric(
      'm-contract-executing-count',
      'contract_executing_count',
      '在执行合同数',
      '合同管理',
      '当前处于履行中状态的合同数量。',
      "COUNT(cooperation_contracts.id) WHERE contract_status = '履行中'",
      'month',
      ['cooperation_contracts'],
      'count'
    ),
    metric(
      'm-contract-finish-rate',
      'contract_finish_rate',
      '合同办结率',
      '合同管理',
      '已完成合同数与合同总数的比值。',
      '已完成合同数 / 合同总数 × 100',
      'quarter',
      ['cooperation_contracts'],
      'ratio'
    ),

    // 投标备案
    metric(
      'm-tender-filing-count',
      'tender_filing_count',
      '投标备案数',
      '投标备案',
      '统计周期内完成备案的投标项目数量。',
      'COUNT(tender_filing.id)',
      'month',
      ['tender_filing'],
      'count'
    ),
    metric(
      'm-tender-win-amount',
      'tender_win_amount',
      '中标金额',
      '投标备案',
      '已中标项目的金额合计。',
      'SUM(tender_filing.win_amount)',
      'month',
      ['tender_filing'],
      'sum'
    ),
    metric(
      'm-tender-win-rate',
      'tender_win_rate',
      '投标中标率',
      '投标备案',
      '中标项目数与备案项目数的比值。',
      '中标数 / 备案数 × 100',
      'quarter',
      ['tender_filing'],
      'ratio'
    ),

    // 服务采购
    metric(
      'm-service-purchase-amount',
      'service_purchase_amount',
      '服务采购额',
      '服务采购',
      '服务类采购合同的金额合计。',
      'SUM(service_purchase.amount)',
      'month',
      ['service_purchase'],
      'sum'
    ),
    metric(
      'm-service-purchase-count',
      'service_purchase_count',
      '服务采购合同数',
      '服务采购',
      '服务类采购合同的数量。',
      'COUNT(service_purchase.id)',
      'month',
      ['service_purchase'],
      'count'
    ),

    // 培训管理
    metric(
      'm-training-session-count',
      'training_session_count',
      '培训场次',
      '培训管理',
      '统计周期内举办的培训场次数量。',
      'COUNT(training_records.id)',
      'month',
      ['training_records'],
      'count'
    ),
    metric(
      'm-training-amount',
      'training_amount',
      '培训收入',
      '培训管理',
      'TSQ 人才职业效能检验培训业务的收入金额。',
      'SUM(company_metrics.training_amount)',
      'month',
      ['company_metrics'],
      'sum'
    ),
    metric(
      'm-training-attendee-count',
      'training_attendee_count',
      '培训人次',
      '培训管理',
      '统计周期内参加培训的人次合计。',
      'SUM(training_records.attendee_count)',
      'month',
      ['training_records'],
      'sum'
    )
  ],

  // ---- §2.2 维度字典：12 条，覆盖五个大类 ----
  dimensions: [
    dimension(
      'd-customer-name',
      'customer_name',
      '客户维度',
      '客户名称',
      'company_info.company_name',
      ['客户', '公司', '企业', '厂家', '单位'],
      '按客户主体维度下钻经营与业务数据'
    ),
    dimension(
      'd-partnership-level',
      'partnership_level',
      '客户维度',
      '合作等级',
      'company_info.partnership_level',
      ['合作层级', '客户等级', '客户级别'],
      '按合作等级筛选与分组客户',
      [
        { value: '战略级合作伙伴', label: '战略级合作伙伴', aliases: ['战略级', '战略客户'] },
        { value: '核心供应商', label: '核心供应商', aliases: ['核心客户'] },
        { value: '意向客户', label: '意向客户', aliases: ['潜在客户', '意向单位'] },
        { value: '普通客户', label: '普通客户', aliases: ['一般客户'] }
      ]
    ),
    dimension(
      'd-company-type',
      'company_type',
      '客户维度',
      '企业类型',
      'company_info.company_type',
      ['公司类型', '单位性质'],
      '按企业性质分析客户结构',
      [
        { value: '股份有限公司', label: '股份有限公司' },
        { value: '国有企业', label: '国有企业', aliases: ['国企'] }
      ]
    ),
    dimension(
      'd-customer-industry',
      'customer_industry',
      '客户维度',
      '所属行业',
      'company_info.industry',
      ['行业', '行业类别', '所属领域'],
      '按行业分析客户分布'
    ),
    dimension(
      'd-business-node-time',
      'business_node_time',
      '时间维度',
      '业务节点时间',
      'cooperation_contracts.signed_at',
      ['时间', '日期', '什么时候', '本年度', '今年', '上个月'],
      '所有按时间筛选的提问统一落到业务节点优先级最高的时间字段',
      [],
      undefined
    ),
    dimension(
      'd-business-type',
      'business_type',
      '业务维度',
      '业务类型',
      'company_metrics.business_type',
      ['业务', '业务类别', '服务类型'],
      '按业务类型拆分收入与合同',
      [
        { value: '检验检测', label: '检验检测', aliases: ['检测', '检验'] },
        { value: '认证评估', label: '认证评估', aliases: ['认证'] },
        { value: '计量校准', label: '计量校准', aliases: ['校准', '计量'] },
        { value: '产品开发', label: '产品开发', aliases: ['开发'] },
        { value: 'TSQ培训', label: 'TSQ培训', aliases: ['培训'] }
      ]
    ),
    dimension(
      'd-test-category',
      'test_category',
      '业务维度',
      '试验类别',
      'company_metrics.test_category',
      ['试验类型', '测试类别', '试验项目'],
      '按试验类别归类检测业务，口语说法统一归并到标准取值',
      [
        {
          value: '可靠性试验',
          label: '可靠性试验',
          // 需求说明明确要求：「可靠性测试」「环境试验」统一归为可靠性试验
          aliases: ['可靠性测试', '环境试验', '可靠性和环境试验', '环境可靠性']
        },
        { value: '电磁兼容试验', label: '电磁兼容试验', aliases: ['EMC', '电磁兼容'] },
        { value: '失效分析', label: '失效分析', aliases: ['失效筛查'] }
      ]
    ),
    dimension(
      'd-contract-status',
      'contract_status',
      '业务维度',
      '合同状态',
      'cooperation_contracts.contract_status',
      ['合同状态', '单据状态'],
      '统计时按纳入/剔除规则过滤合同状态',
      [
        { value: '履行中', label: '履行中', aliases: ['正常执行'] },
        { value: '已完成', label: '已完成', aliases: ['已办结', '已验收'] },
        { value: '已作废', label: '已作废', aliases: ['作废'] }
      ]
    ),
    dimension(
      'd-undertaking-division',
      'undertaking_division',
      '部门维度',
      '承接分院',
      'cooperation_contracts.signing_division',
      ['分院', '签约分院', '所属分院'],
      '客户归属的唯一依据，也是数据范围的划分依据'
    ),
    dimension(
      'd-undertaking-department',
      'undertaking_department',
      '部门维度',
      '承接部门',
      'department_contributions.department_name',
      ['部门', '承接部门', '科室'],
      '按承接部门拆分业务贡献'
    ),
    dimension(
      'd-customer-classification',
      'customer_classification',
      '密级维度',
      '客户密级',
      'company_info.classification',
      ['密级', '涉密等级', '保密级别'],
      '访问客户密级相关信息时校验提问者密级权限',
      [
        { value: '公开', label: '公开' },
        { value: '内部', label: '内部' },
        { value: '秘密', label: '秘密' },
        { value: '机密', label: '机密' }
      ],
      2
    ),
    dimension(
      'd-contact-secret-code',
      'contact_secret_code',
      '密级维度',
      '联系人密级编号',
      'company_contacts.secret_code',
      ['密级编号', '涉密编号', '文件编号'],
      '涉及密级编号的提问需更高权限，且展示时全程脱敏',
      [],
      3
    )
  ],

  // ---- §2.3 表关联配置：6 条标准链路（逐字取自需求说明） ----
  joinChains: [
    chain('j-market-operation', '市场化经营', 'market', [
      node(1, '客户主表', 'company_info', 'exists', 'company_id'),
      node(2, '委托业务表', 'entrust_business', 'planned', 'company_id'),
      node(3, '合同表', 'cooperation_contracts', 'exists', 'business_id'),
      node(4, '回款流水表', 'payment_flow', 'planned', 'contract_id')
    ]),
    chain('j-customer-contact', '客户联系人', 'market', [
      node(1, '客户主表', 'company_info', 'exists', 'company_id'),
      node(2, '客户联系人表', 'company_contacts', 'exists', 'company_id')
    ]),
    chain('j-tender-filing', '投标备案', 'market', [
      node(1, '客户主表', 'company_info', 'exists', 'company_id'),
      node(2, '投标备案表', 'tender_filing', 'planned', 'company_id'),
      node(3, '合同表', 'cooperation_contracts', 'exists', 'tender_id')
    ]),
    chain('j-service-purchase', '服务采购', 'market', [
      node(1, '客户主表', 'company_info', 'exists', 'company_id'),
      node(2, '服务采购表', 'service_purchase', 'planned', 'company_id'),
      node(3, '合同表', 'cooperation_contracts', 'exists', 'purchase_id')
    ]),
    chain('j-training', '培训情况', 'market', [
      node(1, '部门维度表', 'department_contributions', 'exists', 'department_id'),
      node(2, '培训情况表', 'training_records', 'planned', 'department_id')
    ]),
    chain(
      'j-research-project',
      '科研专项',
      'research',
      [
        node(1, '客户主表', 'company_info', 'exists', 'company_id'),
        node(2, '科研专项项目表', 'research_projects', 'planned', 'company_id')
      ],
      true,
      '与市场化数据隔离，禁止与回款流水表等市场化表关联。'
    )
  ],

  // ---- §2.4 统计与过滤规则（逐字取自需求说明） ----
  statRules: {
    timezone: 'Asia/Shanghai',
    allowedPeriods: ['day', 'week', 'month', 'quarter', 'year'],
    customPeriodAllowed: false, // 需求说明：不支持自定义周期
    defaultScope: '全院',
    defaultPeriod: 'year', // 模糊提问默认全院 + 本年度
    nodePriority: ['办结时间', '签约时间', '下单时间'],
    includedStatuses: ['已办结', '正常执行', '已回款', '已验收'],
    excludedStatuses: ['草稿', '作废', '撤销', '测试', '演练', '异常驳回'],
    wipCountOnly: true, // 在途单据仅展示数量
    revenueIncludesWip: false, // 在途不纳入营收统计
    ownershipField: '合同签约分院',
    nullFillValue: 0,
    interceptAbnormal: true,
    missingDimensionLabel: '未分类'
  },

  // ---- §2.5 权限与脱敏（角色复用 ROLE_PERMISSIONS） ----
  permissions: {
    roles: [
      { role: 'institute_leader', dataScope: 'all', clearanceLevel: 3, maskFields: [] },
      {
        role: 'division_leader',
        dataScope: 'division',
        clearanceLevel: 2,
        maskFields: ['contact_name', 'contact_phone']
      },
      {
        role: 'marketing_staff',
        dataScope: 'self',
        clearanceLevel: 1,
        maskFields: ['contact_name', 'contact_phone', 'company_address', 'secret_code']
      }
    ],
    fieldRules: [
      { field: 'contact_name', label: '联系人姓名', strategy: 'name', enabled: true },
      { field: 'contact_phone', label: '联系电话', strategy: 'phone', enabled: true },
      { field: 'company_address', label: '企业地址', strategy: 'address', enabled: true },
      { field: 'secret_code', label: '密级编号', strategy: 'code', enabled: true }
    ],
    blockNoClearance: true,
    clearanceLabels: ['公开', '内部', '秘密', '机密']
  },

  // ---- §3 / §4 大模型边界 ----
  boundary: {
    maxJoinTables: 4,
    forbidCrossDomainJoin: true,
    forbidCustomJoinFields: true,
    forbidDirectDbAccess: true // 禁止规则 4，界面上锁定不可改
  }
};

export const DEFAULT_METRIC_HISTORY: ConfigHistory = {
  latestVersion: SEED_VERSION,
  snapshots: [],
  changeLog: []
};

export const DEFAULT_QUERY_LOG: QueryLogEntry[] = [];

// ---------------- 迁移 ----------------

/**
 * 旧版本迁移。
 *
 * v1 存的是 { definitions, thresholdRules, dictionary }，与 v2 的
 * { metrics, dimensions, joinChains, ... } 语义完全不重叠，没有任何可搬运的内容，
 * 因此对任何非 v2 的数据一律返回 null 表示重置。
 *
 * 该返回值不会让存储留下孤儿数据：usePersistentState 在 migrate 返回 null 时
 * 回退默认值，紧随其后的写入 effect 会用 v2 默认值覆盖旧的 blob。
 */
export function migrateMetricConfig(data: unknown, fromVersion: number): MetricConfig | null {
  if (fromVersion !== METRIC_CONFIG_VERSION) return null;
  if (!data || typeof data !== 'object') return null;

  const stored = data as Partial<MetricConfig>;

  return {
    ...DEFAULT_METRIC_CONFIG,
    ...stored,
    schemaVersion: METRIC_CONFIG_VERSION,
    metrics: Array.isArray(stored.metrics) ? stored.metrics : DEFAULT_METRIC_CONFIG.metrics,
    dimensions: Array.isArray(stored.dimensions)
      ? stored.dimensions
      : DEFAULT_METRIC_CONFIG.dimensions,
    joinChains: Array.isArray(stored.joinChains)
      ? stored.joinChains
      : DEFAULT_METRIC_CONFIG.joinChains,
    statRules: stored.statRules ?? DEFAULT_METRIC_CONFIG.statRules,
    permissions: stored.permissions ?? DEFAULT_METRIC_CONFIG.permissions,
    boundary: stored.boundary ?? DEFAULT_METRIC_CONFIG.boundary
  };
}

/** 查询日志的迁移。就是一个数组，版本不符即重置。 */
export function migrateQueryLog(data: unknown, fromVersion: number): QueryLogEntry[] | null {
  if (fromVersion !== QUERY_LOG_VERSION) return null;
  return Array.isArray(data) ? (data as QueryLogEntry[]) : null;
}

/** 历史数据的迁移。结构简单，版本不符即重置。 */
export function migrateMetricHistory(data: unknown, fromVersion: number): ConfigHistory | null {
  if (fromVersion !== METRIC_HISTORY_VERSION) return null;
  if (!data || typeof data !== 'object') return null;

  const stored = data as Partial<ConfigHistory>;

  return {
    latestVersion:
      typeof stored.latestVersion === 'string'
        ? stored.latestVersion
        : DEFAULT_METRIC_HISTORY.latestVersion,
    snapshots: Array.isArray(stored.snapshots) ? stored.snapshots : [],
    changeLog: Array.isArray(stored.changeLog) ? stored.changeLog : []
  };
}
