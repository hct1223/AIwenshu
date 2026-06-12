/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  X,
  Sparkles,
  User,
  Bot,
  Clock,
  Copy,
  Check,
  Building2,
  TrendingUp,
  ShieldCheck,
  DollarSign,
  Users,
  GitCompare,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertTriangle,
  Download,
  Share2
} from 'lucide-react';
import { COMP_MOCK_LIST, GROUP_MOCK_LIST } from '../data/mockData';
import { Company, GroupData } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'company-profile' | 'company-comparison' | 'group-profile' | 'group-comparison' | 'statistics' | 'contract-info' | 'monthly-report' | 'annual-report';
  companies?: Company[];
  groups?: GroupData[];
  comparisonData?: any;
  monthlyReportData?: any;
  annualReportData?: any;
}

interface AIChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigateToCompany?: (id: string) => void;
  onNavigateToGroup?: (id: string) => void;
  currentPage?: string;
}

export default function AIChatSidebar({ isOpen, onToggle, onNavigateToCompany, onNavigateToGroup, currentPage = 'dashboard' }: AIChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '尊敬的领导，您好！欢迎使用中国赛宝实验室 AI 智能管理助手。\n\n本系统整合产业政策、行业动态、全板块经营业务、重点大客户台账，同步实时风险预警信息，可快速为您提供：\n\n📊 企业整体经营概况\n📈 各业务板块运行数据\n👥 重点客户合作现状\n🔍 市场竞争动态\n⚠️ 经营风险与项目预警\n📋 情报速递专题汇总\n\n等综合研判信息，请您输入查询需求。',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // 智能查询企业
  const findCompanies = (query: string): Company[] => {
    // 企业别名映射表 - 支持简称、别名自动识别
    const COMPANY_ALIASES: Record<string, string> = {
      '华为': '华为技术有限公司',
      '华子': '华为技术有限公司',
      'hw': '华为技术有限公司',
      'huawei': '华为技术有限公司',
      '比亚迪': '比亚迪股份有限公司',
      'byd': '比亚迪股份有限公司',
      '中兴': '中兴通讯股份有限公司',
      'zte': '中兴通讯股份有限公司',
      '赛宝': '赛宝智能科技有限公司',
      '赛宝智能': '赛宝智能科技有限公司'
    };

    const keywords = query.toLowerCase().split(/[，、\s,]+/);
    const foundCompanies = new Set<string>();

    keywords.forEach(keyword => {
      if (keyword.length < 1) return;

      // 检查是否是别名，如果是则替换为全称
      const fullName = COMPANY_ALIASES[keyword] || keyword;

      COMP_MOCK_LIST.forEach(company => {
        // 1. 精确匹配全称
        const matchName = company.name.toLowerCase().includes(fullName);
        // 2. 去除空格匹配
        const matchPinyin = company.name.toLowerCase().replace(/\s/g, '').includes(fullName.replace(/\s/g, ''));
        // 3. 行业匹配
        const matchIndustry = company.industry.toLowerCase().includes(keyword);
        // 4. 法人代表匹配
        const matchRepresentative = company.representative.toLowerCase().includes(keyword);
        // 5. 别名直接匹配
        const matchAlias = fullName === company.name;

        if (matchName || matchPinyin || matchIndustry || matchRepresentative || matchAlias) {
          foundCompanies.add(company.id);
        }
      });
    });

    // 如果没有找到，尝试模糊匹配企业名称中的关键词
    if (foundCompanies.size === 0) {
      COMP_MOCK_LIST.forEach(company => {
        const companyName = company.name.toLowerCase();
        // 检查查询词是否包含在企业名称的关键词中
        const companyKeywords = companyName.split(/[有限公司股份科技集团]/).filter(k => k.length >= 2);
        companyKeywords.forEach(kw => {
          if (query.toLowerCase().includes(kw) || kw.includes(query.toLowerCase())) {
            foundCompanies.add(company.id);
          }
        });
      });
    }

    return Array.from(foundCompanies).map(id => COMP_MOCK_LIST.find(c => c.id === id)!);
  };

  // 智能查询集团
  const findGroups = (query: string): GroupData[] => {
    // 集团别名映射表
    const GROUP_ALIASES: Record<string, string> = {
      '华为集团': '华为集团',
      '华为': '华为集团',
      '中国电科': '中国电科集团',
      '电科': '中国电科集团',
      'cetc': '中国电科集团'
    };

    const keywords = query.toLowerCase().split(/[，、\s,]+/);
    const foundGroups = new Set<string>();

    keywords.forEach(keyword => {
      if (keyword.length < 1) return;

      // 检查是否是别名，如果是则替换为全称
      const fullName = GROUP_ALIASES[keyword] || keyword;

      GROUP_MOCK_LIST.forEach(group => {
        const matchName = group.name.toLowerCase().includes(fullName);
        const matchControlling = group.controllingEntity.toLowerCase().includes(keyword);
        const matchAlias = fullName === group.name;
        const isGroupKeyword = keyword.includes('集团') || keyword.includes('group');

        if (matchName || matchControlling || matchAlias || isGroupKeyword) {
          foundGroups.add(group.id);
        }
      });
    });

    return Array.from(foundGroups).map(id => GROUP_MOCK_LIST.find(g => g.id === id)!);
  };

  // 检测是否是对比查询
  const isComparisonQuery = (query: string, companies: Company[]): boolean => {
    const comparisonKeywords = ['对比', '比较', '差异', '区别', 'vs', 'VS', '和', '与'];
    return comparisonKeywords.some(keyword => query.includes(keyword)) && companies.length >= 2;
  };

  // 检测是否是合同查询
  const isContractQuery = (query: string): boolean => {
    const contractKeywords = ['合同', '合约', '协议', '签约', 'contract'];
    return contractKeywords.some(keyword => query.includes(keyword));
  };

  // 检测是否是统计查询
  const isStatisticsQuery = (query: string): boolean => {
    const statsKeywords = ['统计', '总数', '多少', '排名', '榜单', '数据', '营收', '增长', '分析'];
    return statsKeywords.some(keyword => query.includes(keyword));
  };

  // 检测是否是月报查询
  const isMonthlyReportQuery = (query: string): boolean => {
    const reportKeywords = ['月报', '月度报告', '月度报表', '月度经营'];
    return reportKeywords.some(keyword => query.includes(keyword));
  };

  // 检测是否是年报查询
  const isAnnualReportQuery = (query: string): boolean => {
    const reportKeywords = ['年报', '年度报告', '年度报表', '年度经营', '年度业务'];
    return reportKeywords.some(keyword => query.includes(keyword));
  };

  // 查询企业合同信息
  const queryContractInfo = (query: string, companies: Company[]): string => {
    if (companies.length === 0) return '';

    const company = companies[0];
    const contracts = company.cooperationContracts || [];

    let result = `📄 **${company.name}** 的合同信息：\n\n`;

    // 合同总览
    const totalAmount = contracts.reduce((sum, c) => sum + c.amount, 0);
    result += `• 在研合同：${contracts.filter(c => c.status === '履行中').length}份\n`;
    result += `• 合同总额：¥${totalAmount.toFixed(0)}万元\n`;
    result += `• 历史合作：${contracts.length}份\n\n`;

    // 最近合同
    const recentContracts = contracts.slice(0, 3);
    if (recentContracts.length > 0) {
      result += `📋 **最近合同**：\n`;
      recentContracts.forEach((contract, idx) => {
        result += `${idx + 1}. ${contract.name}\n   合同编号：${contract.contractNo}\n   金额：¥${contract.amount}万元\n   状态：${contract.status}\n   部门：${contract.department}\n\n`;
      });
    }

    return result;
  };

  // 查询统计信息
  const queryStatistics = (query: string): string => {
    let result = '';

    // 营收统计
    if (query.includes('营收') || query.includes('收入') || query.includes('金额')) {
      const totalRevenue = COMP_MOCK_LIST.reduce((sum, c) => {
        const latestMetrics = c.metrics[c.metrics.length - 1];
        return sum + (latestMetrics ? Object.values(latestMetrics).slice(1).reduce((a: any, b: any) => a + b, 0) : 0);
      }, 0);

      result += `💰 **营收统计**：\n`;
      result += `• 全部企业合作总额：¥${(totalRevenue / 10000).toFixed(2)}亿元\n`;
      result += `• 平均企业合作额：¥${(totalRevenue / COMP_MOCK_LIST.length / 10000).toFixed(2)}亿元\n\n`;
    }

    // 企业统计
    if (query.includes('企业') || query.includes('客户') || query.includes('多少')) {
      result += `🏢 **企业统计**：\n`;
      result += `• 总企业数：${COMP_MOCK_LIST.length}家\n`;
      result += `• 战略级合作伙伴：${COMP_MOCK_LIST.filter(c => c.partnershipLevel.includes('战略')).length}家\n`;
      result += `• 高增长类企业：${COMP_MOCK_LIST.filter(c => c.growthCategory === '高增长类').length}家\n`;
      result += `• 高新技术企业：${COMP_MOCK_LIST.filter(c => c.tags.coreDivision.some(t => t.includes('高新'))).length}家\n\n`;
    }

    // 部门统计
    if (query.includes('部门') || query.includes('业务') || query.includes('检测所')) {
      const deptStats = new Map<string, number>();
      COMP_MOCK_LIST.forEach(company => {
        company.deptContributions.forEach(dept => {
          deptStats.set(dept.name, (deptStats.get(dept.name) || 0) + 1);
        });
      });

      result += `🏛️ **部门业务统计**：\n`;
      Array.from(deptStats.entries()).sort((a, b) => b[1] - a[1]).forEach(([dept, count]) => {
        result += `• ${dept}：${count}家企业\n`;
      });
      result += '\n';
    }

    // 集团统计
    if (query.includes('集团') || query.includes('集团')) {
      result += `🏢 **集团统计**：\n`;
      result += `• 总集团数：${GROUP_MOCK_LIST.length}家\n`;
      result += `• 平均机构数：${(GROUP_MOCK_LIST.reduce((sum, g) => sum + g.totalSubCompanies, 0) / GROUP_MOCK_LIST.length).toFixed(0)}家\n`;
      result += `• 平均合作渗透率：${(GROUP_MOCK_LIST.reduce((sum, g) => sum + (g.partneredCompanies / g.totalSubCompanies), 0) / GROUP_MOCK_LIST.length * 100).toFixed(1)}%\n\n`;
    }

    // 评分统计
    if (query.includes('评分') || query.includes('排名') || query.includes('榜单')) {
      const sortedByAI = [...COMP_MOCK_LIST].sort((a, b) => b.aiScore - a.aiScore);
      const topAI = sortedByAI.slice(0, 5);

      result += `🏆 **评分排名**：\n`;
      topAI.forEach((company, idx) => {
        result += `• 第${idx + 1}名：${company.name}（${company.aiScore}分）\n`;
      });

      const avgAI = COMP_MOCK_LIST.reduce((sum, c) => sum + c.aiScore, 0) / COMP_MOCK_LIST.length;
      result += `\n• 平均AI评分：${avgAI.toFixed(1)}分\n`;

      const highScoreCount = COMP_MOCK_LIST.filter(c => c.aiScore >= 90).length;
      result += `• 90分以上企业：${highScoreCount}家\n\n`;
    }

    return result;
  };

  // 生成月报数据
  const generateMonthlyReportData = () => {
    // 模拟当前月份的数据
    const currentMonth = '2026-06';
    const currentYear = '2026';

    // 计算本月合作总额
    const monthlyRevenue = COMP_MOCK_LIST.reduce((sum, company) => {
      const latestMetrics = company.metrics[company.metrics.length - 1];
      return sum + (latestMetrics ? Object.values(latestMetrics).slice(1).reduce((a: any, b: any) => a + b, 0) : 0);
    }, 0);

    // 计算新增合作企业数
    const newCompaniesCount = Math.floor(COMP_MOCK_LIST.length * 0.1); // 假设10%是新增的

    // 按部门统计本月业绩
    const deptPerformance = new Map<string, number>();
    COMP_MOCK_LIST.forEach(company => {
      company.deptContributions.forEach(dept => {
        const deptAmount = (monthlyRevenue / COMP_MOCK_LIST.length) * (dept.ratio / 100);
        deptPerformance.set(dept.name, (deptPerformance.get(dept.name) || 0) + deptAmount);
      });
    });

    // 计算增长率
    const growthRate = 15.8; // 模拟15.8%的增长率

    // 合作客户分析
    const activeCompanies = COMP_MOCK_LIST.filter(c => {
      const latestMetrics = c.metrics[c.metrics.length - 1];
      const totalAmount = latestMetrics ? Object.values(latestMetrics).slice(1).reduce((a: any, b: any) => a + b, 0) : 0;
      return totalAmount > 100; // 合作金额超过100万视为活跃
    }).length;

    return {
      reportInfo: {
        title: '企业经营情况月报',
        month: '2026年6月',
        reportDate: '2026-06-30',
        reportPeriod: '2026-06-01 至 2026-06-30'
      },
      summary: {
        totalRevenue: Math.round(monthlyRevenue),
        newCompanies: newCompaniesCount,
        activeCompanies: activeCompanies,
        totalCompanies: COMP_MOCK_LIST.length,
        growthRate: growthRate
      },
      deptPerformance: Array.from(deptPerformance.entries()).map(([dept, amount]) => ({
        dept,
        amount: Math.round(amount),
        ratio: ((amount / monthlyRevenue) * 100).toFixed(1)
      })),
      topCompanies: COMP_MOCK_LIST.slice(0, 5).map(company => ({
        name: company.name,
        amount: Math.round((monthlyRevenue / COMP_MOCK_LIST.length) * (company.aiScore / 100)),
        growthCategory: company.growthCategory,
        aiScore: company.aiScore
      })),
      businessDistribution: [
        { type: '检验检测', amount: Math.round(monthlyRevenue * 0.35), ratio: 35 },
        { type: '认证评估', amount: Math.round(monthlyRevenue * 0.25), ratio: 25 },
        { type: '计量校准', amount: Math.round(monthlyRevenue * 0.20), ratio: 20 },
        { type: '产品开发', amount: Math.round(monthlyRevenue * 0.12), ratio: 12 },
        { type: 'TSQ培训', amount: Math.round(monthlyRevenue * 0.08), ratio: 8 }
      ],
      riskWarning: COMP_MOCK_LIST.filter(c => c.riskIndex > 15).map(company => ({
        name: company.name,
        riskIndex: company.riskIndex,
        reason: '合规评分下降或经营异常'
      })),
      highlights: [
        { title: '本月营收创历史新高', desc: '较上月增长15.8%，主要得益于军工检测业务的大幅提升' },
        { title: '新增战略合作伙伴', desc: `本月新增${newCompaniesCount}家战略级合作企业，主要集中在华南地区` },
        { title: '重点客户突破', desc: '成功与某军区电子装备检测项目签约，合同金额350万元' }
      ]
    };
  };

  // 生成年报数据
  const generateAnnualReportData = () => {
    const currentYear = '2026';
    const lastYear = '2025';

    // 计算年度合作总额
    const annualRevenue = 28650; // 模拟2.865亿元的年度营收
    const lastYearRevenue = 23380; // 上年度营收

    // 按部门统计年度业绩
    const deptPerformance = [
      { dept: '技推处', amount: 8520, ratio: 29.7, growth: 25.8 },
      { dept: '计量校准', amount: 6250, ratio: 21.8, growth: 18.5 },
      { dept: '军工检测', amount: 5780, ratio: 20.2, growth: 32.1 },
      { dept: '元器件检测所', amount: 4520, ratio: 15.8, growth: 15.3 },
      { dept: '可靠性试验室', amount: 3580, ratio: 12.5, growth: 20.6 }
    ];

    // 年度重点工作回顾
    const keyWorkReview = [
      { category: '资质认证', items: ['通过CNAS实验室复评审', '获得军工体系认证资质', '新增加计标准装置15项'] },
      { category: '业务拓展', items: ['新增战略客户12家', '军工检测业务增长32%', '华南区域业务覆盖率达85%'] },
      { category: '能力建设', items: ['引进高端检测设备8台套', '建成智能化检测实验室', '获得发明专利3项'] },
      { category: '管理创新', items: ['完成质量体系升级', '实施数字化管理平台', '优化客户服务流程'] }
    ];

    // 年度客户分析
    const customerAnalysis = {
      total: 156,
      strategic: 45,
      new: 28,
      lost: 3,
      satisfaction: 96.8
    };

    // 下年度工作计划
    const nextYearPlan = [
      { target: '营收目标', value: '3.5亿元', growth: '同比增长22%' },
      { target: '业务拓展', value: '新增战略客户15家以上', focus: '军工、新能源、汽车电子' },
      { target: '能力建设', value: '建成3个专业化检测实验室', focus: 'SiC器件、功率器件、可靠性' },
      { target: '技术创新', value: '研发投入占比15%', focus: 'AI检测技术、数字化检测' },
      { target: '市场布局', value: '覆盖全国20个省市', focus: '华东、华北、西南地区' }
    ];

    return {
      reportInfo: {
        title: '中国赛宝2026年度工作报告',
        year: '2026年度',
        reportDate: '2026-12-31',
        reportPeriod: '2026年1月1日 至 2026年12月31日'
      },
      executiveSummary: {
        totalRevenue: annualRevenue,
        lastYearRevenue: lastYearRevenue,
        growthRate: ((annualRevenue - lastYearRevenue) / lastYearRevenue * 100).toFixed(1),
        totalProfit: Math.round(annualRevenue * 0.18), // 利润率18%
        profitGrowth: '28.5%',
        totalProjects: 1248,
        completedProjects: 1225,
        completionRate: 98.2
      },
      deptPerformance: deptPerformance,
      businessDistribution: [
        { type: '检验检测', amount: 10850, ratio: 37.9, growth: 28.5 },
        { type: '认证评估', amount: 6300, ratio: 22.0, growth: 19.2 },
        { type: '计量校准', amount: 6250, ratio: 21.8, growth: 18.5 },
        { type: '产品开发', amount: 3430, ratio: 12.0, growth: 35.8 },
        { type: 'TSQ培训', amount: 1820, ratio: 6.3, growth: 12.6 }
      ],
      quarterlyData: [
        { quarter: '第一季度', amount: 5980, growth: '+15.2%', keyAchievements: '军工检测业务开局良好，新签合同45份' },
        { quarter: '第二季度', amount: 6820, growth: '+18.5%', keyAchievements: '通过CNAS复评审，市场竞争力提升' },
        { quarter: '第三季度', amount: 7150, growth: '+22.8%', keyAchievements: '建成SiC器件检测实验室，业务量大幅增长' },
        { quarter: '第四季度', amount: 8700, growth: '+28.3%', keyAchievements: '年底冲刺效果显著，军工检测收入创历史新高' }
      ],
      keyWorkReview: keyWorkReview,
      customerAnalysis: customerAnalysis,
      highlights: [
        { title: '经营业绩创历史新高', desc: '全年实现营收2.865亿元，同比增长22.5%，利润增长28.5%，各项指标均超额完成' },
        { title: '核心业务能力显著提升', desc: '通过CNAS复评审、获得军工体系认证、建成专业化实验室，技术实力和品牌影响力大幅提升' },
        { title: '战略客户拓展成效显著', desc: '新增战略客户12家，军工检测业务增长32%，与中国电科、中航工业等集团合作深化' },
        { title: '创新驱动发展成果丰硕', desc: '获得发明专利3项、引进高端检测设备8台套、建成智能化检测实验室，数字化转型成效显著' }
      ],
      riskWarning: [
        { name: '某地区合作企业', riskIndex: 18, reason: '所属行业景气度下降，需关注业务持续性' },
        { name: '元器件供应链', riskIndex: 16, reason: '上游原材料价格波动，影响项目交付周期' }
      ],
      nextYearPlan: nextYearPlan,
      annualConclusion: '2026年是实施"十四五"规划的关键一年，在所领导班子的正确领导下，全所干部职工团结奋斗，攻坚克难，各项工作取得了显著成绩。2027年，我们将继续坚持创新驱动、质量为本、客户至上的发展理念，力争实现营收3.5亿元目标，为高质量发展再创新辉煌！'
    };
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuery = inputValue;
    setInputValue('');
    setIsTyping(true);

    // 模拟AI处理延迟
    setTimeout(() => {
      const foundCompanies = findCompanies(currentQuery);
      const foundGroups = findGroups(currentQuery);

      // 检测是否是统计查询
      if (isStatisticsQuery(currentQuery)) {
        const statisticsContent = queryStatistics(currentQuery);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: statisticsContent || `抱歉，我无法理解您的统计查询需求。请尝试更具体的询问，如"查询总营收"、"企业数量统计"等。`,
          timestamp: new Date(),
          type: statisticsContent ? 'statistics' : 'text'
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
        return;
      }

      // 检测是否是月报查询
      if (isMonthlyReportQuery(currentQuery)) {
        const monthlyReportData = generateMonthlyReportData();
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `📊 **企业经营情况月报**已生成！\n\n以下是2026年6月的经营数据汇总：`,
          timestamp: new Date(),
          type: 'monthly-report',
          monthlyReportData
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
        return;
      }

      // 检测是否是年报查询
      if (isAnnualReportQuery(currentQuery)) {
        const annualReportData = generateAnnualReportData();
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `📊 **企业经营情况年报**已生成！\n\n以下是2026年度的经营数据汇总：`,
          timestamp: new Date(),
          type: 'annual-report',
          annualReportData
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
        return;
      }

      // 检测是否是合同查询
      if (foundCompanies.length > 0 && isContractQuery(currentQuery)) {
        const contractContent = queryContractInfo(currentQuery, foundCompanies);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: contractContent,
          timestamp: new Date(),
          type: 'contract-info'
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsTyping(false);
        return;
      }

      // 优先处理集团查询
      if (foundGroups.length > 0) {
        if (isComparisonQuery(currentQuery, foundGroups)) {
          // 集团对比模式
          const comparisonData = generateGroupComparisonData(foundGroups);
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `为您找到 ${foundGroups.length} 个集团的对比分析：`,
            timestamp: new Date(),
            type: 'group-comparison',
            groups: foundGroups,
            comparisonData
          };
          setMessages(prev => [...prev, aiMessage]);
        } else {
          // 单个或多个集团画像
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: foundGroups.length === 1
              ? `为您找到集团画像：${foundGroups[0].name}`
              : `为您找到 ${foundGroups.length} 个集团的画像信息：`,
            timestamp: new Date(),
            type: 'group-profile',
            groups: foundGroups
          };
          setMessages(prev => [...prev, aiMessage]);
        }
      } else if (foundCompanies.length === 0) {
        // 未找到企业
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `抱歉，我没有找到与"${currentQuery}"相关的企业或集团信息。\n\n您可以尝试：\n• 输入企业全称，如"华为技术有限公司"\n• 输入企业简称，如"华为"\n• 输入集团名称，如"华为集团"\n• 输入法人代表姓名\n• 输入行业关键词\n• 查询统计数据，如"总营收"、"企业数量"\n• 查询合同信息，如"华为的合同"`,
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, aiMessage]);
      } else if (isComparisonQuery(currentQuery, foundCompanies)) {
        // 企业对比模式
        const comparisonData = generateComparisonData(foundCompanies);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `为您找到 ${foundCompanies.length} 家企业的对比分析：`,
          timestamp: new Date(),
          type: 'company-comparison',
          companies: foundCompanies,
          comparisonData
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // 单个或多个企业画像
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: foundCompanies.length === 1
            ? `为您找到企业画像：${foundCompanies[0].name}`
            : `为您找到 ${foundCompanies.length} 家企业的画像信息：`,
          timestamp: new Date(),
          type: 'company-profile',
          companies: foundCompanies
        };
        setMessages(prev => [...prev, aiMessage]);
      }

      setIsTyping(false);
    }, 1200);
  };

  // 生成对比数据
  const generateComparisonData = (companies: Company[]) => {
    // 计算累计合作金额
    const calculateTotalAmount = (company: Company) => {
      if (!company.cooperationContracts || company.cooperationContracts.length === 0) {
        // 如果没有合同数据，使用metrics总和作为替代
        const latestMetrics = company.metrics[company.metrics.length - 1];
        return latestMetrics
          ? Object.values(latestMetrics).slice(1).reduce((a, b) => (a as number) + (b as number), 0) as number
          : 0;
      }
      return company.cooperationContracts.reduce((sum, contract) => sum + contract.amount, 0);
    };

    // 计算三年增长率
    const calculateGrowthRate = (company: Company) => {
      if (company.metrics.length < 3) return 'N/A';
      const metrics2022 = company.metrics.find(m => m.year === '2022');
      const metrics2024 = company.metrics.find(m => m.year === '2024');
      if (!metrics2022 || !metrics2024) return 'N/A';

      const total2022 = Object.values(metrics2022).slice(1).reduce((a, b) => (a as number) + (b as number), 0) as number;
      const total2024 = Object.values(metrics2024).slice(1).reduce((a, b) => (a as number) + (b as number), 0) as number;

      if (total2022 === 0) return 'N/A';
      const growth = ((total2024 - total2022) / total2022 * 100).toFixed(1);
      return `${growth}%`;
    };

    // 获取主要业务部门
    const getMainDept = (company: Company) => {
      if (!company.deptContributions || company.deptContributions.length === 0) return 'N/A';
      const mainDept = company.deptContributions.reduce((prev, current) =>
        current.ratio > prev.ratio ? current : prev
      );
      return `${mainDept.name.slice(0, 8)}...(${mainDept.ratio}%)`;
    };

    return {
      dimensions: [
        { key: 'aiScore', label: 'AI质量评分', companies: companies.map(c => ({ name: c.name, value: c.aiScore })) },
        { key: 'complianceRating', label: '合规评分', companies: companies.map(c => ({ name: c.name, value: c.complianceRating })) },
        { key: 'riskIndex', label: '风险指数', companies: companies.map(c => ({ name: c.name, value: c.riskIndex })) },
        { key: 'totalCooperationAmount', label: '累计合作金额(万元)', companies: companies.map(c => ({ name: c.name, value: calculateTotalAmount(c) })) },
        { key: 'growthRate', label: '三年增长率(2022-2024)', companies: companies.map(c => ({ name: c.name, value: calculateGrowthRate(c) })) },
        { key: 'mainDept', label: '主要合作部门', companies: companies.map(c => ({ name: c.name, value: getMainDept(c) })) },
        { key: 'insuredEmployees', label: '参保人数', companies: companies.map(c => ({ name: c.name, value: c.insuredEmployees })) },
        {
          key: 'latestYearAmount',
          label: '2024年合作额(万元)',
          companies: companies.map(c => {
            const metrics2024 = c.metrics.find(m => m.year === '2024');
            return {
              name: c.name,
              value: metrics2024 ? Object.values(metrics2024).slice(1).reduce((a, b) => (a as number) + (b as number), 0) as number : 0
            };
          })
        }
      ]
    };
  };

  // 生成集团对比数据
  const generateGroupComparisonData = (groups: GroupData[]) => {
    return {
      dimensions: [
        { key: 'aiPotentialScore', label: 'AI潜力评分', groups: groups.map(g => ({ name: g.name, value: g.aiPotentialScore })) },
        { key: 'totalSubCompanies', label: '总属机构数', groups: groups.map(g => ({ name: g.name, value: g.totalSubCompanies })) },
        { key: 'partneredCompanies', label: '合作机构数', groups: groups.map(g => ({ name: g.name, value: g.partneredCompanies })) },
        {
          key: 'partnerRate',
          label: '合作渗透率(%)',
          groups: groups.map(g => ({
            name: g.name,
            value: parseFloat(((g.partneredCompanies / g.totalSubCompanies) * 100).toFixed(1))
          }))
        }
      ]
    };
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleCardExpansion = (cardId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  // 渲染企业画像卡片
  const renderCompanyCard = (company: Company, messageId: string) => {
    const cardId = `${messageId}-${company.id}`;
    const isExpanded = expandedCards.has(cardId);
    const latestMetrics = company.metrics[company.metrics.length - 1];
    const totalAmount = latestMetrics
      ? Object.values(latestMetrics).slice(1).reduce((a, b) => (a as number) + (b as number), 0) as number
      : 0;

    const handleCardClick = (e: React.MouseEvent) => {
      // 如果点击的是展开/收起按钮，不触发卡片导航
      if ((e.target as HTMLElement).closest('button')) {
        return;
      }
      if (onNavigateToCompany) {
        onNavigateToCompany(company.id);
      }
    };

    return (
      <div
        key={company.id}
        className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all"
        onClick={handleCardClick}
      >
        {/* 企业头部 */}
        <div className="flex items-start gap-3">
          <img
            src={company.logo}
            alt={company.name}
            className="w-12 h-12 rounded-lg border border-slate-200 object-contain p-1 bg-white"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-slate-900 text-sm truncate">{company.name}</h4>
              <span className="text-[10px] text-indigo-600 whitespace-nowrap">点击查看完整画像 →</span>
            </div>
            <p className="text-xs text-slate-500">{company.industry}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full ${
                company.partnershipLevel.includes('战略')
                  ? 'bg-indigo-100 text-indigo-700'
                  : company.partnershipLevel.includes('核心')
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {company.partnershipLevel}
              </span>
              <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full ${
                company.growthCategory === '高增长类'
                  ? 'bg-green-100 text-green-700'
                  : company.growthCategory === '稳健型'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {company.growthCategory}
              </span>
            </div>
          </div>
        </div>

        {/* 核心指标 */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-lg p-2.5 border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1">
              <Sparkles className="h-3 w-3" />
              AI评分
            </div>
            <div className="text-lg font-bold text-indigo-600">{company.aiScore}</div>
          </div>
          <div className="bg-white rounded-lg p-2.5 border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1">
              <ShieldCheck className="h-3 w-3" />
              合规
            </div>
            <div className="text-lg font-bold text-emerald-600">{company.complianceRating}</div>
          </div>
          <div className="bg-white rounded-lg p-2.5 border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1">
              <DollarSign className="h-3 w-3" />
              合作额
            </div>
            <div className="text-sm font-bold text-slate-700">{(totalAmount / 100).toFixed(0)}亿</div>
          </div>
        </div>

        {/* 展开/收起详情 */}
        <div>
          <button
            onClick={() => toggleCardExpansion(cardId)}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 transition"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                收起详情
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                查看更多详情
              </>
            )}
          </button>

          {isExpanded && (
            <div className="mt-3 space-y-3 pt-3 border-t border-slate-200">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">法人代表:</span>
                  <span className="font-medium text-slate-700">{company.representative}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">注册资本:</span>
                  <span className="font-medium text-slate-700">{company.registeredCapital}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">参保人数:</span>
                  <span className="font-medium text-slate-700">{company.insuredEmployees}人</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">成立时间:</span>
                  <span className="font-medium text-slate-700">{company.establishmentDate}</span>
                </div>
              </div>

              {/* 业务分布 */}
              <div>
                <div className="text-xs font-semibold text-slate-700 mb-2">主要业务分布</div>
                <div className="space-y-1.5">
                  {company.deptContributions.slice(0, 3).map((dept, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${dept.ratio}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-600 w-8 text-right">{dept.ratio}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 合作摘要 */}
              <div>
                <div className="text-xs font-semibold text-slate-700 mb-1.5">合作概况</div>
                <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-3">
                  {company.saibaoCooperationSummary}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 渲染企业对比表格
  const renderComparisonTable = (companies: Company[], comparisonData: any) => {
    return (
      <div className="space-y-4">
        {/* 企业头部对比 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {companies.map(company => (
            <div key={company.id} className="flex-shrink-0 w-32 bg-gradient-to-br from-slate-50 to-white rounded-lg p-3 border border-slate-200">
              <img
                src={company.logo}
                alt={company.name}
                className="w-10 h-10 rounded border border-slate-200 object-contain p-1 bg-white mx-auto mb-2"
                referrerPolicy="no-referrer"
              />
              <div className="text-[11px] font-semibold text-slate-900 text-center truncate">{company.name}</div>
            </div>
          ))}
        </div>

        {/* 对比维度表格 */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-2 px-3 text-left font-semibold text-slate-700 w-24">对比维度</th>
                {companies.map(company => (
                  <th key={company.id} className="py-2 px-3 text-center font-semibold text-slate-700">
                    {company.name.slice(0, 4)}...
                  </th>
                ))}
                <th className="py-2 px-3 text-center font-semibold text-slate-700 w-16">最优</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonData.dimensions.map((dimension: any) => {
                const values = dimension.companies.map((c: any) => c.value);
                // 对于字符串类型（如增长率），不计算最优值
                const hasStringValues = values.some((v: any) => typeof v === 'string');
                const isBetter = !hasStringValues && (dimension.key === 'riskIndex'
                  ? Math.min(...values)
                  : Math.max(...values));

                return (
                  <tr key={dimension.key} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-medium text-slate-700">{dimension.label}</td>
                    {dimension.companies.map((companyData: any) => {
                      const isBest = !hasStringValues && isBetter !== undefined && companyData.value === isBetter;
                      const isWorst = !hasStringValues && (dimension.key === 'riskIndex'
                        ? companyData.value === Math.max(...values)
                        : companyData.value === Math.min(...values));

                      return (
                        <td key={companyData.name} className="py-2.5 px-3 text-center">
                          <span className={`font-mono font-bold text-xs ${
                            isBest ? 'text-emerald-600' : isWorst ? 'text-red-500' : 'text-slate-700'
                          }`}>
                            {companyData.value}
                          </span>
                          {isBest && <span className="ml-1 text-[10px] text-emerald-500">★</span>}
                        </td>
                      );
                    })}
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[10px] text-slate-400">
                        {!hasStringValues && isBetter !== undefined ? (dimension.key === 'riskIndex' ? '最低' : '最高') : '-'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 对比总结 */}
        <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
          <div className="text-xs font-semibold text-indigo-900 mb-2">💡 AI分析总结</div>
          <p className="text-[11px] text-indigo-800 leading-relaxed">
            {generateComparisonSummary(companies)}
          </p>
        </div>
      </div>
    );
  };

  // 生成对比总结
  const generateComparisonSummary = (companies: Company[]): string => {
    const bestAI = companies.reduce((prev, current) => (prev.aiScore > current.aiScore) ? prev : current);
    const bestCompliance = companies.reduce((prev, current) => (prev.complianceRating > current.complianceRating) ? prev : current);
    const lowestRisk = companies.reduce((prev, current) => (prev.riskIndex < current.riskIndex) ? prev : current);

    return `在 ${companies.length} 家企业对比中：\n• **{bestAI.name}** AI质量评分最高({bestAI.aiScore}分)，技术实力突出\n• **{bestCompliance.name}** 合规性最优({bestCompliance.complianceRating}分)\n• **{lowestRisk.name}** 风险指数最低({lowestRisk.riskIndex})，经营稳健`
      .replace(/{bestAI\.name}/g, bestAI.name)
      .replace(/{bestAI\.aiScore}/g, bestAI.aiScore.toString())
      .replace(/{bestCompliance\.name}/g, bestCompliance.name)
      .replace(/{bestCompliance\.complianceRating}/g, bestCompliance.complianceRating.toString())
      .replace(/{lowestRisk\.name}/g, lowestRisk.name)
      .replace(/{lowestRisk\.riskIndex}/g, lowestRisk.riskIndex.toString());
  };

  // 渲染集团画像卡片
  const renderGroupCard = (group: GroupData, messageId: string) => {
    const partnerRate = ((group.partneredCompanies / group.totalSubCompanies) * 100).toFixed(1);

    const handleCardClick = (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('button')) {
        return;
      }
      if (onNavigateToGroup) {
        onNavigateToGroup(group.id);
      }
    };

    return (
      <div
        key={group.id}
        className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all"
        onClick={handleCardClick}
      >
        {/* 集团头部 */}
        <div className="flex items-start gap-3">
          <div className="bg-slate-100 rounded-lg p-2.5 border border-slate-200 shrink-0">
            <Building2 className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-slate-900 text-sm truncate">{group.name}</h4>
              <span className="text-[10px] text-indigo-600 whitespace-nowrap">点击查看完整画像 →</span>
            </div>
            <p className="text-xs text-slate-500 truncate">{group.controllingEntity}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full ${
                group.growthCategory === '高增长类'
                  ? 'bg-green-50 text-green-700 border border-green-100'
                  : 'bg-blue-50 text-blue-700 border border-blue-100'
              }`}>
                {group.growthCategory}
              </span>
              <span className="inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                {group.partnershipLevel}
              </span>
            </div>
          </div>
        </div>

        {/* 核心指标 */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-lg p-2.5 border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1">
              <Building2 className="h-3 w-3" />
              总机构
            </div>
            <div className="text-lg font-bold text-slate-700">{group.totalSubCompanies}</div>
          </div>
          <div className="bg-white rounded-lg p-2.5 border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1">
              <ShieldCheck className="h-3 w-3" />
              渗透率
            </div>
            <div className="text-sm font-bold text-indigo-600">{partnerRate}%</div>
          </div>
          <div className="bg-white rounded-lg p-2.5 border border-slate-100">
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1">
              <Sparkles className="h-3 w-3" />
              AI潜力
            </div>
            <div className="text-lg font-bold text-emerald-600">{group.aiPotentialScore}</div>
          </div>
        </div>

        {/* 风险预警 */}
        {group.riskHighlights.length > 0 && (
          <div className={`rounded-lg p-2.5 border text-[11px] ${
            group.riskHighlights[0].level === 'high'
              ? 'bg-rose-50/50 border-rose-100/60 text-slate-700'
              : 'bg-amber-50/40 border-amber-100/60 text-slate-700'
          }`}>
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`inline-flex rounded px-1 py-0.5 text-[9px] font-bold uppercase ${
                group.riskHighlights[0].level === 'high'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {group.riskHighlights[0].level === 'high' ? '高危' : '中度'}
              </span>
              <span className="text-[10px] text-slate-400">{group.riskHighlights[0].date}</span>
            </div>
            <div className="font-bold text-slate-800 text-[11px] truncate">{group.riskHighlights[0].title}</div>
          </div>
        )}

        {/* 合作摘要 */}
        <div className="bg-indigo-50/30 rounded-lg p-2.5 border border-indigo-100/50">
          <p className="text-[10px] text-slate-600 leading-relaxed line-clamp-2">
            {group.cooperationSummary}
          </p>
        </div>
      </div>
    );
  };

  // 渲染集团对比表格
  const renderGroupComparisonTable = (groups: GroupData[], comparisonData: any) => {
    return (
      <div className="space-y-4">
        {/* 集团头部对比 */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {groups.map(group => (
            <div key={group.id} className="flex-shrink-0 w-32 bg-gradient-to-br from-slate-50 to-white rounded-lg p-3 border border-slate-200">
              <Building2 className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
              <div className="text-[11px] font-semibold text-slate-900 text-center truncate">{group.name}</div>
            </div>
          ))}
        </div>

        {/* 对比维度表格 */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-2 px-3 text-left font-semibold text-slate-700 w-24">对比维度</th>
                {groups.map(group => (
                  <th key={group.id} className="py-2 px-3 text-center font-semibold text-slate-700">
                    {group.name.slice(0, 4)}...
                  </th>
                ))}
                <th className="py-2 px-3 text-center font-semibold text-slate-700 w-16">最优</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {comparisonData.dimensions.map((dimension: any) => {
                const values = dimension.groups.map((g: any) => g.value);
                const isBetter = Math.max(...values);

                return (
                  <tr key={dimension.key} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-medium text-slate-700">{dimension.label}</td>
                    {dimension.groups.map((groupData: any) => {
                      const isBest = isBetter !== undefined && groupData.value === isBetter;
                      const isWorst = groupData.value === Math.min(...values);

                      return (
                        <td key={groupData.name} className="py-2.5 px-3 text-center">
                          <span className={`font-mono font-bold ${
                            isBest ? 'text-emerald-600' : isWorst ? 'text-red-500' : 'text-slate-700'
                          }`}>
                            {groupData.value}
                            {dimension.key === 'partnerRate' ? '%' : ''}
                          </span>
                          {isBest && <span className="ml-1 text-[10px] text-emerald-500">★</span>}
                        </td>
                      );
                    })}
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[10px] text-slate-400">最高</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 对比总结 */}
        <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
          <div className="text-xs font-semibold text-indigo-900 mb-2">💡 AI分析总结</div>
          <p className="text-[11px] text-indigo-800 leading-relaxed">
            {generateGroupComparisonSummary(groups)}
          </p>
        </div>
      </div>
    );
  };

  // 生成集团对比总结
  const generateGroupComparisonSummary = (groups: GroupData[]): string => {
    const bestAI = groups.reduce((prev, current) => (prev.aiPotentialScore > current.aiPotentialScore) ? prev : current);
    const highestRate = groups.reduce((prev, current) => {
      const prevRate = (prev.partneredCompanies / prev.totalSubCompanies) * 100;
      const currentRate = (current.partneredCompanies / current.totalSubCompanies) * 100;
      return prevRate > currentRate ? prev : current;
    });

    const prevRate = (highestRate.partneredCompanies / highestRate.totalSubCompanies) * 100;

    return `在 ${groups.length} 个集团对比中：\n• **{bestAI.name}** AI潜力评分最高({bestAI.aiPotentialScore}分)\n• **{highestRate.name}** 合作渗透率最高({prevRate.toFixed(1)}%)`
      .replace(/{bestAI\.name}/g, bestAI.name)
      .replace(/{bestAI\.aiPotentialScore}/g, bestAI.aiPotentialScore.toString())
      .replace(/{highestRate\.name}/g, highestRate.name)
      .replace(/{prevRate}/g, prevRate.toFixed(1));
  };

  // 渲染月报报表
  const renderMonthlyReport = (reportData: any, messageId: string) => {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border border-blue-200 overflow-hidden">
        {/* 报表头部 */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <h3 className="text-sm font-bold">{reportData.reportInfo.title}</h3>
              </div>
              <p className="text-[10px] text-indigo-200">{reportData.reportInfo.month}</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-indigo-200">报告期间</div>
              <div className="text-xs font-medium">{reportData.reportInfo.reportPeriod}</div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* 核心指标 */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white rounded-lg p-2.5 border border-slate-100">
              <div className="flex items-center gap-1 text-[9px] text-slate-500 mb-1">
                <DollarSign className="h-3 w-3" />
                总营收
              </div>
              <div className="text-sm font-bold text-indigo-600">¥{(reportData.summary.totalRevenue / 10000).toFixed(1)}亿</div>
            </div>
            <div className="bg-white rounded-lg p-2.5 border border-slate-100">
              <div className="flex items-center gap-1 text-[9px] text-slate-500 mb-1">
                <TrendingUp className="h-3 w-3" />
                增长率
              </div>
              <div className="text-sm font-bold text-emerald-600">+{reportData.summary.growthRate}%</div>
            </div>
            <div className="bg-white rounded-lg p-2.5 border border-slate-100">
              <div className="flex items-center gap-1 text-[9px] text-slate-500 mb-1">
                <Users className="h-3 w-3" />
                新客户
              </div>
              <div className="text-sm font-bold text-blue-600">{reportData.summary.newCompanies}家</div>
            </div>
            <div className="bg-white rounded-lg p-2.5 border border-slate-100">
              <div className="flex items-center gap-1 text-[9px] text-slate-500 mb-1">
                <Building2 className="h-3 w-3" />
                活跃客户
              </div>
              <div className="text-sm font-bold text-purple-600">{reportData.summary.activeCompanies}家</div>
            </div>
          </div>

          {/* 部门业绩 */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <Building2 className="h-3.5 w-3.5 text-slate-600" />
              <span className="text-xs font-semibold text-slate-700">部门业绩分布</span>
            </div>
            <div className="space-y-1.5">
              {reportData.deptPerformance.map((dept: any) => (
                <div key={dept.dept} className="flex items-center gap-2">
                  <div className="w-20 text-[10px] text-slate-600">{dept.dept}</div>
                  <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                      style={{ width: `${dept.ratio}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-[10px] text-slate-600">
                    ¥{(dept.amount / 10000).toFixed(1)}亿 ({dept.ratio}%)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 业务类型分布 */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <GitCompare className="h-3.5 w-3.5 text-slate-600" />
              <span className="text-xs font-semibold text-slate-700">业务类型分布</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {reportData.businessDistribution.map((business: any) => (
                <div key={business.type} className="bg-white rounded p-2 border border-slate-100">
                  <div className="text-[9px] text-slate-500">{business.type}</div>
                  <div className="text-xs font-bold text-slate-700">¥{(business.amount / 10000).toFixed(1)}亿</div>
                  <div className="text-[9px] text-slate-400">{business.ratio}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* 重点客户 */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-slate-600" />
              <span className="text-xs font-semibold text-slate-700">TOP 5 客户</span>
            </div>
            <div className="space-y-1.5">
              {reportData.topCompanies.map((company: any, idx: number) => (
                <div key={company.name} className="flex items-center gap-2 bg-white rounded p-2 border border-slate-100">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-medium text-slate-900 truncate">{company.name}</div>
                    <div className="text-[9px] text-slate-500">¥{(company.amount / 10000).toFixed(2)}亿</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] px-1 py-0.5 bg-emerald-50 text-emerald-700 rounded">
                      {company.growthCategory}
                    </span>
                    <span className="text-[9px] px-1 py-0.5 bg-indigo-50 text-indigo-700 rounded">
                      {company.aiScore}分
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 月度亮点 */}
          {reportData.highlights && reportData.highlights.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span className="text-xs font-semibold text-slate-700">月度亮点</span>
              </div>
              <div className="space-y-1.5">
                {reportData.highlights.map((highlight: any) => (
                  <div key={highlight.title} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded p-2 border border-amber-100">
                    <div className="text-[10px] font-semibold text-amber-900 mb-0.5">{highlight.title}</div>
                    <div className="text-[9px] text-amber-800">{highlight.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 风险预警 */}
          {reportData.riskWarning && reportData.riskWarning.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-2">
                <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                <span className="text-xs font-semibold text-slate-700">风险预警</span>
              </div>
              <div className="space-y-1.5">
                {reportData.riskWarning.map((risk: any) => (
                  <div key={risk.name} className="bg-red-50 rounded p-2 border border-red-100">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-medium text-red-900">{risk.name}</div>
                      <div className="text-[9px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded">
                        风险 {risk.riskIndex}
                      </div>
                    </div>
                    <div className="text-[9px] text-red-800 mt-0.5">{risk.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-2 pt-2 border-t border-slate-200">
            <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-[10px] font-medium">
              <Download className="h-3 w-3" />
              下载PDF
            </button>
            <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition text-[10px] font-medium">
              <Share2 className="h-3 w-3" />
              分享报告
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 渲染年报报表
  const renderAnnualReport = (reportData: any, messageId: string) => {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 overflow-hidden">
        {/* 报表头部 */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <h3 className="text-sm font-bold">{reportData.reportInfo.title}</h3>
              </div>
              <p className="text-[10px] text-emerald-200">{reportData.reportInfo.year}</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-emerald-200">报告期间</div>
              <div className="text-xs font-medium">{reportData.reportInfo.reportPeriod}</div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* 执行摘要 */}
          <div className="bg-white rounded-lg p-3 border border-emerald-100">
            <div className="flex items-center gap-1 mb-2">
              <FileText className="h-3.5 w-3.5 text-emerald-600" />
              <span className="text-xs font-semibold text-slate-700">执行摘要</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mb-2">
              <div className="text-center">
                <div className="text-[9px] text-slate-500">年度营收</div>
                <div className="text-sm font-bold text-emerald-600">¥{(reportData.executiveSummary.totalRevenue / 10000).toFixed(2)}亿</div>
                <div className="text-[9px] text-emerald-600">+{reportData.executiveSummary.growthRate}%</div>
              </div>
              <div className="text-center">
                <div className="text-[9px] text-slate-500">年度利润</div>
                <div className="text-sm font-bold text-slate-700">¥{(reportData.executiveSummary.totalProfit / 10000).toFixed(2)}亿</div>
                <div className="text-[9px] text-emerald-600">↑{reportData.executiveSummary.profitGrowth}</div>
              </div>
              <div className="text-center">
                <div className="text-[9px] text-slate-500">项目总数</div>
                <div className="text-sm font-bold text-slate-700">{reportData.executiveSummary.totalProjects}项</div>
                <div className="text-[9px] text-slate-500">完成率 {reportData.executiveSummary.completionRate}%</div>
              </div>
              <div className="text-center">
                <div className="text-[9px] text-slate-500">完成项目</div>
                <div className="text-sm font-bold text-slate-700">{reportData.executiveSummary.completedProjects}项</div>
                <div className="text-[9px] text-slate-500">年度目标达成</div>
              </div>
            </div>
          </div>

          {/* 季度营收趋势 */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <TrendingUp className="h-3.5 w-3.5 text-slate-600" />
              <span className="text-xs font-semibold text-slate-700">季度营收趋势</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {reportData.quarterlyData.map((quarter: any) => (
                <div key={quarter.quarter} className="bg-white rounded p-2.5 border border-slate-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-medium text-slate-700">{quarter.quarter}</span>
                    <span className="text-[10px] text-emerald-600 font-medium">{quarter.growth}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-700 mb-1">¥{(quarter.amount / 10000).toFixed(2)}亿元</div>
                  <div className="text-[9px] text-slate-500">{quarter.keyAchievements}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 部门年度业绩 */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <Building2 className="h-3.5 w-3.5 text-slate-600" />
              <span className="text-xs font-semibold text-slate-700">部门年度业绩</span>
            </div>
            <div className="space-y-1.5">
              {reportData.deptPerformance.map((dept: any) => (
                <div key={dept.dept} className="flex items-center gap-2">
                  <div className="w-20 text-[10px] text-slate-600">{dept.dept}</div>
                  <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      style={{ width: `${dept.ratio}%` }}
                    />
                  </div>
                  <div className="w-24 text-right text-[10px] text-slate-600">
                    ¥{(dept.amount / 10000).toFixed(2)}亿 ({dept.ratio}%)
                  </div>
                  <div className="w-16 text-right text-[10px] text-emerald-600 font-medium">
                    +{dept.growth}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 业务类型分布 */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <GitCompare className="h-3.5 w-3.5 text-slate-600" />
              <span className="text-xs font-semibold text-slate-700">业务类型分布</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {reportData.businessDistribution.map((business: any) => (
                <div key={business.type} className="bg-white rounded p-2 border border-slate-100">
                  <div className="text-[9px] text-slate-500 mb-1">{business.type}</div>
                  <div className="text-xs font-bold text-slate-700 mb-0.5">¥{(business.amount / 10000).toFixed(2)}亿</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-slate-400">{business.ratio}%</span>
                    <span className="text-[9px] text-emerald-600">+{business.growth}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 年度重点工作回顾 */}
          <div>
            <div className="flex items-center gap-1 mb-2">
              <FileText className="h-3.5 w-3.5 text-slate-600" />
              <span className="text-xs font-semibold text-slate-700">年度重点工作回顾</span>
            </div>
            <div className="space-y-2">
              {reportData.keyWorkReview.map((work: any) => (
                <div key={work.category} className="bg-white rounded p-2 border border-slate-100">
                  <div className="text-[10px] font-medium text-slate-700 mb-1">{work.category}</div>
                  <div className="flex flex-wrap gap-1">
                    {work.items.map((item: string, idx: number) => (
                      <span key={idx} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 客户分析 */}
          {reportData.customerAnalysis && (
            <div>
              <div className="flex items-center gap-1 mb-2">
                <Users className="h-3.5 w-3.5 text-slate-600" />
                <span className="text-xs font-semibold text-slate-700">年度客户分析</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-white rounded p-2 border border-slate-100 text-center">
                  <div className="text-[9px] text-slate-500">客户总数</div>
                  <div className="text-sm font-bold text-slate-700">{reportData.customerAnalysis.total}家</div>
                </div>
                <div className="bg-white rounded p-2 border border-slate-100 text-center">
                  <div className="text-[9px] text-slate-500">战略客户</div>
                  <div className="text-sm font-bold text-indigo-600">{reportData.customerAnalysis.strategic}家</div>
                </div>
                <div className="bg-white rounded p-2 border border-slate-100 text-center">
                  <div className="text-[9px] text-slate-500">新增客户</div>
                  <div className="text-sm font-bold text-emerald-600">{reportData.customerAnalysis.new}家</div>
                </div>
                <div className="bg-white rounded p-2 border border-slate-100 text-center">
                  <div className="text-[9px] text-slate-500">满意度</div>
                  <div className="text-sm font-bold text-amber-600">{reportData.customerAnalysis.satisfaction}%</div>
                </div>
              </div>
            </div>
          )}

          {/* 年度亮点 */}
          {reportData.highlights && reportData.highlights.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-700">年度亮点</span>
              </div>
              <div className="space-y-1.5">
                {reportData.highlights.map((highlight: any) => (
                  <div key={highlight.title} className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded p-2 border border-emerald-100">
                    <div className="text-[10px] font-semibold text-emerald-900 mb-0.5">{highlight.title}</div>
                    <div className="text-[9px] text-emerald-800">{highlight.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 风险预警 */}
          {reportData.riskWarning && reportData.riskWarning.length > 0 && (
            <div>
              <div className="flex items-center gap-1 mb-2">
                <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                <span className="text-xs font-semibold text-slate-700">风险预警</span>
              </div>
              <div className="space-y-1.5">
                {reportData.riskWarning.map((risk: any) => (
                  <div key={risk.name} className="bg-red-50 rounded p-2 border border-red-100">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-medium text-red-900">{risk.name}</div>
                      <div className="text-[9px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded">
                        风险 {risk.riskIndex}
                      </div>
                    </div>
                    <div className="text-[9px] text-red-800 mt-0.5">{risk.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 下年度工作计划 */}
          {reportData.nextYearPlan && (
            <div>
              <div className="flex items-center gap-1 mb-2">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-700">2027年度工作计划</span>
              </div>
              <div className="space-y-1.5">
                {reportData.nextYearPlan.map((plan: any) => (
                  <div key={plan.target} className="bg-white rounded p-2 border border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-medium text-slate-700">{plan.target}</span>
                      <span className="text-[10px] text-emerald-600 font-medium">{plan.value}</span>
                    </div>
                    <div className="text-[9px] text-slate-500">重点：{plan.focus}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 年度总结 */}
          {reportData.annualConclusion && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-3 border border-emerald-100">
              <div className="flex items-center gap-1 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-900">年度总结</span>
              </div>
              <p className="text-[10px] text-emerald-800 leading-relaxed">{reportData.annualConclusion}</p>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-2 pt-2 border-t border-slate-200">
            <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-[10px] font-medium">
              <Download className="h-3 w-3" />
              下载PDF
            </button>
            <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition text-[10px] font-medium">
              <Share2 className="h-3 w-3" />
              分享报告
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* AI Chat Sidebar */}
      <aside
        className={`
          fixed right-0 top-0 h-screen bg-white border-l border-slate-200 shadow-xl z-50
          transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? 'w-[480px] sm:w-[576px] translate-x-0' : 'w-[480px] sm:w-[576px] translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 flex items-center justify-between border-b border-indigo-500/20">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI智能对话</h3>
              <p className="text-[10px] text-indigo-200">企业数据分析助手</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                ${message.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-emerald-500 text-white'}
              `}>
                {message.role === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>

              {/* Message Content */}
              <div className={`
                flex-1 max-w-[90%]
                ${message.role === 'user' ? 'flex flex-col items-end' : ''}
              `}>
                {/* 文本内容 */}
                {message.content && (
                  <div className={`
                    rounded-2xl p-3 text-sm
                    ${message.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-sm'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm'}
                  `}>
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                )}

                {/* 企业画像卡片 */}
                {message.type === 'company-profile' && message.companies && (
                  <div className="mt-3 space-y-3">
                    {message.companies.map(company => renderCompanyCard(company, message.id))}
                  </div>
                )}

                {/* 企业对比表格 */}
                {message.type === 'company-comparison' && message.companies && message.comparisonData && (
                  <div className="mt-3">
                    {renderComparisonTable(message.companies, message.comparisonData)}
                  </div>
                )}

                {/* 集团画像卡片 */}
                {message.type === 'group-profile' && message.groups && (
                  <div className="mt-3 space-y-3">
                    {message.groups.map(group => renderGroupCard(group, message.id))}
                  </div>
                )}

                {/* 集团对比表格 */}
                {message.type === 'group-comparison' && message.groups && message.comparisonData && (
                  <div className="mt-3">
                    {renderGroupComparisonTable(message.groups, message.comparisonData)}
                  </div>
                )}

                {/* 月报报表 */}
                {message.type === 'monthly-report' && message.monthlyReportData && (
                  <div className="mt-3">
                    {renderMonthlyReport(message.monthlyReportData, message.id)}
                  </div>
                )}

                {/* 年报报表 */}
                {message.type === 'annual-report' && message.annualReportData && (
                  <div className="mt-3">
                    {renderAnnualReport(message.annualReportData, message.id)}
                  </div>
                )}

                {/* Message Footer */}
                <div className="flex items-center gap-2 mt-1.5 px-1">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatTime(message.timestamp)}
                  </span>
                  {message.role === 'assistant' && message.content && (
                    <button
                      onClick={() => handleCopy(message.content, message.id)}
                      className="text-[10px] text-slate-400 hover:text-indigo-600 transition flex items-center gap-1"
                    >
                      {copiedId === message.id ? (
                        <>
                          <Check className="h-3 w-3" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          复制
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-200 bg-white p-4">
          {/* 快捷问题 */}
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => setInputValue('生成企业经营情况月报')}
              className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 rounded-lg text-[11px] font-medium text-indigo-700 transition flex items-center gap-1"
            >
              <FileText className="h-3 w-3" />
              月报报表
            </button>
            <button
              onClick={() => setInputValue('生成企业经营情况年报')}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 rounded-lg text-[11px] font-medium text-emerald-700 transition flex items-center gap-1"
            >
              <FileText className="h-3 w-3" />
              年报报表
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="询问企业信息、合同数据、统计分析..."
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              发送
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            支持企业画像、合同信息、统计分析、智能对比
          </p>
        </div>
      </aside>

      {/* Minimized Toggle Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-3 py-4 rounded-l-xl shadow-lg hover:bg-indigo-700 transition z-50 group"
        >
          <div className="flex flex-col items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span className="text-[10px] writing-vertical">AI对话</span>
          </div>
        </button>
      )}

    </>
  );
}
