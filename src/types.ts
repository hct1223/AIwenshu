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

// 行情速递模块类型定义
export interface NewsItem {
  id: string;
  title: string;
  type: 'policy' | 'market' | 'tender' | 'hotspot';
  department: string;
  publishTime: string;
  tags: string[];
  summary: string;
  content?: string;
  isCollected?: boolean;
}

export interface TenderItem extends NewsItem {
  deadline: string;
  budget: string;
  region: string;
  requirements: string;
}

export interface ReportConfig {
  type: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  includePolicy: boolean;
  includeMarket: boolean;
  includeTender: boolean;
  includeHotspot: boolean;
  focusArea: string;
}

export interface UserPreference {
  focusIndustries: string[];
  focusRegions: string[];
  collectedItems: string[];
}

export type NewsCategoryType = 'all' | 'policy' | 'market' | 'tender' | 'hotspot' | 'collected';
export type TimeRangeType = 'today' | 'week' | 'month';
