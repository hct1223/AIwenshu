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
  ChevronUp
} from 'lucide-react';
import { COMP_MOCK_LIST, GROUP_MOCK_LIST } from '../data/mockData';
import { Company, GroupData } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'company-profile' | 'company-comparison' | 'group-profile' | 'group-comparison' | 'statistics' | 'contract-info';
  companies?: Company[];
  groups?: GroupData[];
  comparisonData?: any;
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
      content: '您好！我是赛宝AI智能助手，已接入全部业务数据库，可以帮您：\n\n📊 企业画像查询\n📄 合同信息查询\n📈 统计分析数据\n💼 业务数据查询\n🔍 多维度对比分析\n💡 智能决策建议\n\n您可以问我：\n• "华为技术的企业画像"\n• "查询华为的合同信息"\n• "比亚迪的AI评分如何？"\n• "对比华为和中兴通讯"\n• "上周营收数据是多少？"\n• "元器件检测所的合作企业统计"',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 根据当前页面生成推荐话题
  const getPageSpecificTopics = () => {
    const topics: { title: string; prompt: string; icon: string }[] = [];

    switch (currentPage) {
      case 'dashboard':
        topics.push(
          { title: '今日数据概览', prompt: '今天新增了多少合作合同？总金额是多少？', icon: '📊' },
          { title: '高价值客户', prompt: '列出合作金额前5的企业及其基本信息', icon: '💼' },
          { title: '本月增长趋势', prompt: '本月与上月相比，合作额增长了多少？', icon: '📈' },
          { title: '风险预警企业', prompt: '有哪些企业风险指数超过15？需要重点关注', icon: '⚠️' }
        );
        break;
      case 'enterpriseSearch':
        topics.push(
          { title: '搜索高增长企业', prompt: '找出AI评分90分以上且属于高增长类的企业', icon: '🚀' },
          { title: '战略客户筛选', prompt: '查找合作金额超过5000万的战略级合作伙伴', icon: '⭐' },
          { title: '华南地区企业', prompt: '列出华南地区的高新技术企业有哪些？', icon: '🌏' },
          { title: '低风险供应商', prompt: '找出风险指数低于10且合规评分95以上的企业', icon: '🛡️' }
        );
        break;
      case 'enterprisePortrait':
        topics.push(
          { title: '企业画像分析', prompt: '分析当前企业的核心竞争力和合作优势', icon: '🏢' },
          { title: '合同履约情况', prompt: '查看当前企业的所有合同及履约状态', icon: '📄' },
          { title: '业务分布', prompt: '展示当前企业与各部门的合作金额分布', icon: '📊' },
          { title: '增长趋势', prompt: '分析当前企业近三年的业务增长趋势', icon: '📈' }
        );
        break;
      case 'groupSearch':
        topics.push(
          { title: '集团整体分析', prompt: '分析集团的整体合作情况和潜力', icon: '🏛️' },
          { title: '子公司覆盖', prompt: '查看集团下有哪些子公司还未合作', icon: '🔍' },
          { title: '集团风险预警', prompt: '分析集团近期有哪些风险点需要关注', icon: '⚠️' },
          { title: '合作建议', prompt: '针对该集团提供下一步合作建议', icon: '💡' }
        );
        break;
      case 'businessReport':
        topics.push(
          { title: '生成月度报告', prompt: '生成本月的业务数据报告，包含关键指标', icon: '📋' },
          { title: '部室业绩对比', prompt: '对比各部门本季度的业绩表现', icon: '🏆' },
          { title: '客户分析', prompt: '分析本月新增客户和流失客户情况', icon: '👥' },
          { title: '业务类型分布', prompt: '统计各业务类型的金额占比和增长情况', icon: '📊' }
        );
        break;
      default:
        topics.push(
          { title: '企业画像查询', prompt: '查询华为技术的企业画像和合作情况', icon: '🏢' },
          { title: '合同信息查询', prompt: '查询华为的合同信息和履约状态', icon: '📄' },
          { title: '企业对比', prompt: '对比华为和中兴的合作情况差异', icon: '⚖️' },
          { title: '数据分析', prompt: '分析近期的业务数据趋势', icon: '📊' }
        );
    }

    return topics;
  };

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
              onClick={() => setInputValue('华为技术的企业画像')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] text-slate-600 transition"
            >
              华为画像
            </button>
            <button
              onClick={() => setInputValue('查询华为的合同信息')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] text-slate-600 transition"
            >
              华为合同
            </button>
            <button
              onClick={() => setInputValue('对比华为和中兴通讯')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] text-slate-600 transition"
            >
              华为vs中兴
            </button>
            <button
              onClick={() => setInputValue('比亚迪的AI评分如何？')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] text-slate-600 transition"
            >
              比亚迪评分
            </button>
            <button
              onClick={() => setInputValue('查询总营收数据')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] text-slate-600 transition"
            >
              营收统计
            </button>
            <button
              onClick={() => setInputValue('企业数量是多少？')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] text-slate-600 transition"
            >
              企业统计
            </button>
          </div>

          {/* Page-Specific Recommended Topics */}
          {messages.length === 1 && (
            <div className="mb-3 p-3 bg-gradient-to-r from-indigo-50 to-sky-50 rounded-xl border border-indigo-100">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span className="text-xs font-semibold text-indigo-900">当前页面推荐话题</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {getPageSpecificTopics().map((topic, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputValue(topic.prompt)}
                    className="text-left px-2.5 py-2 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition group"
                  >
                    <div className="flex items-start gap-1.5">
                      <span className="text-sm">{topic.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-medium text-slate-700 group-hover:text-indigo-700 line-clamp-1">{topic.title}</div>
                        <div className="text-[9px] text-slate-400 line-clamp-1">{topic.prompt}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

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
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-3 py-4 rounded-l-xl shadow-lg hover:bg-indigo-700 transition z-40 group"
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
