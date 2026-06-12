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
