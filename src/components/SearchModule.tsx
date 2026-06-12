/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { COMP_MOCK_LIST } from '../data/mockData';
import { Company } from '../types';
import {
  Search,
  SlidersHorizontal,
  X,
  Check,
  ArrowLeftRight,
  Building2,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Tag,
  Calendar,
  Building,
  DollarSign,
  Clock,
  TrendingUp,
  MapPin,
  Award,
  Star,
  Target,
  BarChart3,
  Lightbulb
} from 'lucide-react';

interface SearchModuleProps {
  onNavigateToCompany: (id: string) => void;
}

// 常用搜索提示词
const COMMON_SEARCHES = [
  {
    id: 'high-value-strategic',
    title: '🎯 高价值战略客户',
    description: '寻找合作金额高、战略级、高质量的企业',
    keywords: '5000万以上 战略级 AI评分90分以上 低风险'
  },
  {
    id: 'growth-potential',
    title: '🚀 高增长潜力企业',
    description: '快速成长、华南地区、高新技术、初创潜力',
    keywords: '高增长类 华南地区 高新技术 初创潜力'
  },
  {
    id: 'stable-partners',
    title: '🤝 稳健长期合作伙伴',
    description: '合作时间长、稳健型、低风险、计量校准业务',
    keywords: '历史合作 稳健型 低风险 计量校准'
  },
  {
    id: 'tech-innovation',
    title: '💡 科技创新重点企业',
    description: '软件评测、失效分析、华东地区、上市企业',
    keywords: '软件评测 失效分析 华东地区 上市企业'
  },
  {
    id: 'emerging-markets',
    title: '🌟 新兴市场潜力客户',
    description: '近一年高频、意向重点、华北地区、行业龙头',
    keywords: '近一年高频 意向重点 华北地区 行业龙头'
  },
  {
    id: 'low-aerospace',
    title: '✈️ 低空产业专项客户',
    description: '低空产业部、环境试验、高增长、华中地区',
    keywords: '低空产业部 环境试验 高增长类 华中地区'
  },
  {
    id: 'semiconductor-leaders',
    title: '🔧 半导体行业领军企业',
    description: '芯片、集成电路、华东华南、上市企业、高增长',
    keywords: '半导体 芯片 集成电路 华东地区 上市企业'
  },
  {
    id: 'automotive-supply',
    title: '🚗 汽车供应链优质企业',
    description: '车载、新能源车、汽车电子、华南地区、元器件检测',
    keywords: '汽车 车载 新能源车 汽车电子 元器件检测'
  },
  {
    id: 'state-owned- giants',
    title: '🏛️ 央企国企重点客户',
    description: '央企、国企、大型集团、战略合作、计量校准',
    keywords: '央企 国企 大型集团 战略合作 计量校准'
  },
  {
    id: 'software-testing',
    title: '💻 软件测试专项客户',
    description: '软件评测、代码审计、车规算法、华为、腾讯、字节',
    keywords: '软件评测 代码审计 车规算法 华为 腾讯'
  },
  {
    id: 'high-growth-clusters',
    title: '📈 高增长产业集群客户',
    description: '高增长类、AI评分85+、近一年高频、意向重点',
    keywords: '高增长类 AI评分85分以上 近一年高频 意向重点'
  },
  {
    id: 'regional-distribution',
    title: '🗺️ 华东地区优质客户',
    description: '华东地区、失效分析、环境试验、计量校准、元器件检测',
    keywords: '华东地区 失效分析 环境试验 计量校准'
  }
];

// 搜索模板标签（按维度分类）
const SEARCH_TEMPLATES = [
  {
    id: 'region',
    category: '地区',
    tags: ['华南地区', '华东地区', '华北地区', '华中地区', '西北地区', '西南地区']
  },
  {
    id: 'industry',
    category: '行业',
    tags: ['汽车', '半导体', '通信', '软件', '航空', '医疗']
  },
  {
    id: 'amount',
    category: '合作金额',
    tags: ['5000万以上', '1000万以上', '500-1000万', '大客户', '高价值']
  },
  {
    id: 'partnership',
    category: '合作层级',
    tags: ['战略级', '核心供应商', '重要客户']
  },
  {
    id: 'growth',
    category: '增长类别',
    tags: ['高增长类', '稳健型', '快速成长', '爆发式增长']
  },
  {
    id: 'risk',
    category: '风险指数',
    tags: ['低风险', '安全', '可靠']
  },
  {
    id: 'tag',
    category: '企业标签',
    tags: ['上市企业', '高新技术企业', '行业龙头企业', '百强企业']
  },
  {
    id: 'business',
    category: '业务类型',
    tags: ['失效分析', '计量校准', '软件评测', '环境试验', '认证评估']
  },
  {
    id: 'time',
    category: '合作时间',
    tags: ['2024年活跃', '2023年合作', '近一年', '近两年']
  }
];

export default function SearchModule({ onNavigateToCompany }: SearchModuleProps) {
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 群画像分析状态
  const [groupAnalysisActive, setGroupAnalysisActive] = useState(false);
  const [groupAnalysisResult, setGroupAnalysisResult] = useState<any>(null);
  const [groupAnalysisLoading, setGroupAnalysisLoading] = useState(false);

  // 企业别名映射表
  const COMPANY_ALIASES: Record<string, string[]> = {
    '华为': ['华为', '华子', 'HW', 'huawei'],
    '比亚迪': ['比亚迪', '比亚迪', 'BYD', 'byd'],
    '中兴': ['中兴', 'ZTE', 'zte'],
    '腾讯': ['腾讯', '鹅厂', 'TX'],
    '阿里': ['阿里', '阿里巴巴', '巴巴', 'ALI'],
    '字节': ['字节', '字节跳动', '字节跃动'],
    '小米': ['小米', '米厂', 'MI'],
  };

  // 行业关键词映射
  const INDUSTRY_KEYWORDS: Record<string, string[]> = {
    '汽车': ['汽车', '车辆', '车载', '新能源车', '电动车', '汽车电子'],
    '半导体': ['半导体', '芯片', '集成电路', 'IC', '晶圆'],
    '通信': ['通信', '5G', '6G', '基站', '网络'],
    '软件': ['软件', '互联网', 'APP', '应用', '平台'],
    '航空': ['航空', '航天', '低空', '无人机', '飞行器'],
    '医疗': ['医疗', '医药', '健康', '生物', '医疗器械'],
  };

  // 自然语言智能解析
  const parseNaturalLanguageQuery = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const conditions: any[] = [];

    // 1. 检测企业别名（模糊匹配）
    for (const [company, aliases] of Object.entries(COMPANY_ALIASES)) {
      if (aliases.some(alias => query.includes(alias.toLowerCase()))) {
        conditions.push({ type: 'company', label: '企业名称', value: company, color: 'rose' });
        break;
      }
    }

    // 2. 检测行业关键词
    for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
      if (keywords.some(kw => query.includes(kw.toLowerCase()))) {
        conditions.push({ type: 'industry', label: '行业类型', value: industry, color: 'purple' });
        break;
      }
    }

    // 3. 检测地区关键词
    const regionPatterns = [
      { keywords: ['华南', '广东', '广州', '深圳', '东莞'], value: '华南地区' },
      { keywords: ['华北', '北京', '天津', '河北'], value: '华北地区' },
      { keywords: ['华东', '上海', '江苏', '浙江', '安徽'], value: '华东地区' },
      { keywords: ['华中', '湖北', '湖南', '河南'], value: '华中地区' },
      { keywords: ['西北', '陕西', '西安'], value: '西北地区' },
      { keywords: ['西南', '四川', '重庆', '成都'], value: '西南地区' },
    ];

    for (const pattern of regionPatterns) {
      if (pattern.keywords.some(kw => query.includes(kw))) {
        conditions.push({ type: 'region', label: '地区', value: pattern.value, color: 'orange' });
        break;
      }
    }

    // 4. 检测金额关键词（支持模糊表述）
    if (query.includes('千万') || query.includes('1000万') || query.includes('大客户') || query.includes('高价值')) {
      conditions.push({ type: 'amount', label: '合作金额', value: '1000万以上', color: 'amber' });
    } else if (query.includes('亿') || query.includes('巨额') || query.includes('战略')) {
      conditions.push({ type: 'amount', label: '合作金额', value: '5000万以上', color: 'amber' });
    } else if (query.includes('500万') || query.includes('中等')) {
      conditions.push({ type: 'amount', label: '合作金额', value: '500-1000万', color: 'amber' });
    }

    // 5. 检测合作层级（语义匹配）
    if (query.includes('战略') || query.includes('核心') || query.includes('重要')) {
      conditions.push({ type: 'partnership', label: '合作层级', value: '战略级', color: 'indigo' });
    } else if (query.includes('供应') || query.includes('供应商')) {
      conditions.push({ type: 'partnership', label: '合作层级', value: '核心供应商', color: 'indigo' });
    }

    // 6. 检测增长类型（语义匹配）
    if (query.includes('高增长') || query.includes('快速增长') || query.includes('爆发') || query.includes('潜力')) {
      conditions.push({ type: 'growth', label: '增长类别', value: '高增长类', color: 'emerald' });
    } else if (query.includes('稳健') || query.includes('稳定') || query.includes('成熟') || query.includes('持续')) {
      conditions.push({ type: 'growth', label: '增长类别', value: '稳健型', color: 'emerald' });
    }

    // 7. 检测风险等级（语义匹配）
    if (query.includes('低风险') || query.includes('安全') || query.includes('可靠')) {
      conditions.push({ type: 'risk', label: '风险指数', value: '低风险', color: 'teal' });
    }

    // 8. 检测企业标签（语义匹配）
    if (query.includes('上市') || query.includes('IPO')) {
      conditions.push({ type: 'tag', label: '企业标签', value: '上市企业', color: 'cyan' });
    }
    if (query.includes('高新') || query.includes('科技') || query.includes('技术')) {
      conditions.push({ type: 'tag', label: '企业标签', value: '高新技术企业', color: 'cyan' });
    }
    if (query.includes('百强') || query.includes('top') || query.includes('龙头')) {
      conditions.push({ type: 'tag', label: '企业标签', value: '行业龙头企业', color: 'cyan' });
    }

    // 9. 检测时间维度
    if (query.includes('2024') || query.includes('今年') || query.includes('本年') || query.includes('当年')) {
      conditions.push({ type: 'time', label: '合作时间', value: '2024年活跃', color: 'blue' });
    } else if (query.includes('2023') || query.includes('去年') || query.includes('上年')) {
      conditions.push({ type: 'time', label: '合作时间', value: '2023年合作', color: 'blue' });
    }

    // 10. 检测业务类型
    const businessPatterns = [
      { keywords: ['失效分析', '失效', '筛选'], value: '失效分析' },
      { keywords: ['计量', '校准'], value: '计量校准' },
      { keywords: ['软件评测', '评测', '软件安全'], value: '软件评测' },
      { keywords: ['环境试验', '可靠性', '环境'], value: '环境试验' },
      { keywords: ['认证', '资质', '体系'], value: '认证评估' },
    ];

    for (const pattern of businessPatterns) {
      if (pattern.keywords.some(kw => query.includes(kw))) {
        conditions.push({ type: 'business', label: '业务类型', value: pattern.value, color: 'green' });
        break;
      }
    }

    return conditions;
  }, [searchQuery]);

  // 智能解析用户输入，提取多个搜索条件（保留原有逻辑作为备用）
  const parseSearchQuery = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const conditions: any[] = [];

    // 解析合作时间段
    if (query.includes('2023') || query.includes('2024') || query.includes('近两年') || query.includes('近一年') || query.includes('本年度')) {
      if (query.includes('2023')) conditions.push({ type: 'time', label: '合作时间', value: '2023年', color: 'blue' });
      else if (query.includes('2024')) conditions.push({ type: 'time', label: '合作时间', value: '2024年', color: 'blue' });
      else if (query.includes('近两年')) conditions.push({ type: 'time', label: '合作时间', value: '近两年', color: 'blue' });
      else if (query.includes('近一年')) conditions.push({ type: 'time', label: '合作时间', value: '近一年', color: 'blue' });
      else if (query.includes('本年度')) conditions.push({ type: 'time', label: '合作时间', value: '2024年', color: 'blue' });
    }

    // 解析主办部门
    const departments = [
      { keywords: ['元器件检测所', '检测所', '元器件所'], value: '元器件检测所' },
      { keywords: ['低空产业', '低空部', '低空经济'], value: '低空产业部' },
      { keywords: ['技推处', '技术推广', '创新成果'], value: '技推处' },
      { keywords: ['软件评测', '软件部', '信息安全'], value: '软件评测中心' },
      { keywords: ['可靠性试验', '试验室', '可靠性'], value: '可靠性试验室' },
      { keywords: ['计量校准', '计量所', '计量'], value: '计量校准所' },
      { keywords: ['信息管理', '信息处', '大数据'], value: '信息管理处' }
    ];

    departments.forEach(dept => {
      if (dept.keywords.some(kw => query.includes(kw))) {
        conditions.push({ type: 'department', label: '主办部门', value: dept.value, color: 'purple' });
      }
    });

    // 解析业务类型
    const businessTypes = [
      { keywords: ['失效分析', '筛选', '测试', '元器件'], value: '失效分析' },
      { keywords: ['计量校准', '校准', '计量'], value: '计量校准' },
      { keywords: ['软件评测', '评测', '软件安全'], value: '软件评测' },
      { keywords: ['环境试验', '可靠性', '环境应力'], value: '环境试验' },
      { keywords: ['产品开发', '研发', '技术开发'], value: '产品开发' },
      { keywords: ['认证评估', '认证', '资质认证'], value: '认证评估' },
      { keywords: ['tsq', '培训', '人才'], value: 'TSQ培训' }
    ];

    businessTypes.forEach(biz => {
      if (biz.keywords.some(kw => query.includes(kw))) {
        conditions.push({ type: 'business', label: '业务类型', value: biz.value, color: 'green' });
      }
    });

    // 解析合作金额
    if (query.includes('5000万以上') || query.includes('5000万') || query.includes('高价值') || query.includes('大客户')) {
      conditions.push({ type: 'amount', label: '合作金额', value: '5000万以上', color: 'amber' });
    } else if (query.includes('1000-5000万') || query.includes('1000万') || query.includes('3000万')) {
      conditions.push({ type: 'amount', label: '合作金额', value: '1000-5000万', color: 'amber' });
    } else if (query.includes('500-1000万') || query.includes('500万') || query.includes('中价值')) {
      conditions.push({ type: 'amount', label: '合作金额', value: '500-1000万', color: 'amber' });
    } else if (query.includes('100-500万') || query.includes('100万') || query.includes('小客户')) {
      conditions.push({ type: 'amount', label: '合作金额', value: '100-500万', color: 'amber' });
    }

    // 解析合作层级
    if (query.includes('战略级') || query.includes('战略合作伙伴')) {
      conditions.push({ type: 'partnership', label: '合作层级', value: '战略级合作伙伴', color: 'indigo' });
    } else if (query.includes('核心供应商') || query.includes('核心') || query.includes('供应商')) {
      conditions.push({ type: 'partnership', label: '合作层级', value: '核心供应商', color: 'indigo' });
    } else if (query.includes('意向重点') || query.includes('意向') || query.includes('开发客户')) {
      conditions.push({ type: 'partnership', label: '合作层级', value: '意向重点开发客户', color: 'indigo' });
    } else if (query.includes('长期合作') || query.includes('稳定合作')) {
      conditions.push({ type: 'partnership', label: '合作层级', value: '长期合作企业', color: 'indigo' });
    }

    // 解析增长类别
    if (query.includes('高增长') || query.includes('快速增长')) {
      conditions.push({ type: 'growth', label: '增长类别', value: '高增长类', color: 'emerald' });
    } else if (query.includes('稳健') || query.includes('成熟') || query.includes('稳定')) {
      conditions.push({ type: 'growth', label: '增长类别', value: '稳健型', color: 'emerald' });
    } else if (query.includes('初创') || query.includes('潜力') || query.includes('新兴')) {
      conditions.push({ type: 'growth', label: '增长类别', value: '初创潜力', color: 'emerald' });
    }

    // 解析评分
    if (query.includes('90分以上') || query.includes('高质量') || query.includes('高潜')) {
      conditions.push({ type: 'score', label: 'AI评分', value: '90分以上', color: 'rose' });
    } else if (query.includes('80-90分') || query.includes('中高')) {
      conditions.push({ type: 'score', label: 'AI评分', value: '80-90分', color: 'rose' });
    } else if (query.includes('95分以上') || query.includes('高合规')) {
      conditions.push({ type: 'compliance', label: '合规评分', value: '95分以上', color: 'teal' });
    }

    // 解析风险
    if (query.includes('低风险') || query.includes('风险低') || query.includes('稳定')) {
      conditions.push({ type: 'risk', label: '风险指数', value: '低风险', color: 'teal' });
    } else if (query.includes('10以下') || query.includes('风险可控')) {
      conditions.push({ type: 'risk', label: '风险指数', value: '10以下', color: 'teal' });
    }

    // 解析地区
    const regions = [
      { keywords: ['华南', '深圳', '广州', '广东'], value: '华南地区' },
      { keywords: ['华北', '北京', '天津'], value: '华北地区' },
      { keywords: ['华东', '上海', '江苏', '浙江'], value: '华东地区' },
      { keywords: ['华中', '湖北', '湖南'], value: '华中地区' },
      { keywords: ['西北', '西安'], value: '西北地区' }
    ];

    regions.forEach(region => {
      if (region.keywords.some(kw => query.includes(kw))) {
        conditions.push({ type: 'region', label: '地区', value: region.value, color: 'orange' });
      }
    });

    // 解析企业标签
    if (query.includes('百强') || query.includes('top') || query.includes('最大')) {
      conditions.push({ type: 'tag', label: '企业标签', value: '中国百强企业', color: 'cyan' });
    }
    if (query.includes('上市') || query.includes('ipo')) {
      conditions.push({ type: 'tag', label: '企业标签', value: '上市企业', color: 'cyan' });
    }
    if (query.includes('高新') || query.includes('高企') || query.includes('科技')) {
      conditions.push({ type: 'tag', label: '企业标签', value: '高新技术企业', color: 'cyan' });
    }
    if (query.includes('独角兽') || query.includes('创业')) {
      conditions.push({ type: 'tag', label: '企业标签', value: '独角兽企业', color: 'cyan' });
    }
    if (query.includes('龙头') || query.includes('领军')) {
      conditions.push({ type: 'tag', label: '企业标签', value: '行业龙头企业', color: 'cyan' });
    }
    if (query.includes('央企') || query.includes('国企')) {
      conditions.push({ type: 'tag', label: '企业标签', value: '央企国企', color: 'cyan' });
    }

    return conditions;
  }, [searchQuery]);

  // 根据解析的条件过滤企业
  const filteredCompanies = useMemo(() => {
    // 如果正在搜索中，返回空数组
    if (isSearching) return [];
    // 如果没有解析条件，返回所有企业
    if (parseSearchQuery.length === 0) return COMP_MOCK_LIST;

    return COMP_MOCK_LIST.filter(company => {
      return parseSearchQuery.every(condition => {
        switch (condition.type) {
          case 'company':
            // 企业名称过滤（支持别名匹配）
            return company.name.includes(condition.value) ||
                   company.name.toLowerCase().includes(condition.value.toLowerCase());

          case 'industry':
            // 行业类型过滤
            return company.industry.includes(condition.value) ||
                   company.industry.toLowerCase().includes(condition.value.toLowerCase());

          case 'time':
            // 时间范围过滤：检查企业是否有相关年份的业务数据
            return company.metrics.some(m =>
              m.year.includes('2023') || m.year.includes('2024')
            );

          case 'department':
            // 部门过滤：检查企业是否与该部门有业务往来
            return company.deptContributions.some(dept =>
              dept.name.includes(condition.value) ||
              condition.value.includes(dept.name.slice(0, 4))
            );

          case 'business':
            // 业务类型过滤：检查企业标签中的业务偏好
            return company.tags.businessPreference.some(pref =>
              pref.includes(condition.value) ||
              pref.includes(condition.value.slice(0, 4)) ||
              condition.value.includes(pref.slice(0, 4))
            );

          case 'amount':
            // 金额范围过滤
            const latestYear = company.metrics[company.metrics.length - 1];
            const totalAmount = latestYear
              ? Object.values(latestYear).slice(1).reduce((a, b) => (a as number) + (b as number), 0) as number
              : 0;

            if (condition.value === '5000万以上') return totalAmount >= 5000;
            if (condition.value === '1000-5000万') return totalAmount >= 1000 && totalAmount < 5000;
            if (condition.value === '500-1000万') return totalAmount >= 500 && totalAmount < 1000;
            if (condition.value === '100-500万') return totalAmount > 0 && totalAmount < 500;
            return true;

          case 'partnership':
            // 合作层级过滤
            return company.partnershipLevel.includes(condition.value.replace('合作伙伴', '').replace('企业', ''));

          case 'growth':
            // 增长类别过滤
            if (condition.value === '高增长类') return company.growthCategory === '高增长类';
            if (condition.value === '稳健型') return company.growthCategory === '稳健型';
            if (condition.value === '初创潜力') return company.growthCategory === '初创潜力';
            return true;

          case 'score':
            // AI评分过滤
            if (condition.value === '90分以上') return company.aiScore >= 90;
            if (condition.value === '80-90分') return company.aiScore >= 80 && company.aiScore < 90;
            return true;

          case 'compliance':
            // 合规评分过滤
            if (condition.value === '95分以上') return company.complianceRating >= 95;
            return true;

          case 'risk':
            // 风险指数过滤
            if (condition.value === '低风险') return company.riskIndex < 10;
            if (condition.value === '10以下') return company.riskIndex < 10;
            return true;

          case 'region':
            // 地区过滤
            return company.address.includes(condition.value.replace('地区', '')) ||
                   company.tags.otherTags.some(tag => tag.includes(condition.value.replace('地区', '')));

          case 'tag':
            // 标签过滤
            if (condition.value === '中国百强企业') {
              return company.tags.coreDivision.some(tag => tag.includes('百强'));
            }
            if (condition.value === '上市企业') {
              return company.type.includes('上市');
            }
            if (condition.value === '高新技术企业') {
              return company.tags.coreDivision.some(tag => tag.includes('高新') || tag.includes('科技'));
            }
            return true;

          default:
            return true;
        }
      });
    });
  }, [parseSearchQuery]);

  // 生成搜索建议
  const generateSuggestions = (input: string) => {
    if (input.length < 1) return [];

    const suggestions: string[] = [];

    // 添加模板标签建议
    SEARCH_TEMPLATES.forEach(template => {
      template.tags.forEach(tag => {
        if (input.length >= 1 && (tag.includes(input) || input.length >= 2)) {
          suggestions.push(tag);
        }
      });
    });

    // 添加企业名称建议
    const companyMatches = COMP_MOCK_LIST.filter(c =>
      c.name.toLowerCase().includes(input.toLowerCase()) ||
      c.representative.toLowerCase().includes(input.toLowerCase())
    );

    companyMatches.slice(0, 3).forEach(c => {
      suggestions.push(c.name);
    });

    return [...new Set(suggestions)].slice(0, 8);
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    if (value.length >= 1) {
      const suggestions = generateSuggestions(value);
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchSuggestions([]);
  };


  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setSearchSuggestions([]);
  };

  const handleCombinationClick = (keywords: string) => {
    setSearchQuery(keywords);
    setSearchSuggestions([]);
  };

  const handleTagClick = (tagText: string) => {
    // 追加标签文字到输入框，用空格分隔
    const newQuery = searchQuery.trim() ? `${searchQuery} ${tagText}` : tagText;
    setSearchQuery(newQuery);
    setSearchSuggestions([]);
    setParsedConditions(parseSearchQuery);
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);

    // 使用自然语言智能解析
    setTimeout(() => {
      setParsedConditions(parseNaturalLanguageQuery);
      setIsSearching(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleGroupAnalysis = async () => {
    setGroupAnalysisLoading(true);
    setGroupAnalysisActive(true);

    // 模拟AI群画像分析过程
    setTimeout(() => {
      const companies = filteredCompanies;

      // 计算群画像数据
      const totalAmount = companies.reduce((sum, comp) => {
        const latestMetrics = comp.metrics[comp.metrics.length - 1];
        return sum + (latestMetrics ? Object.values(latestMetrics).slice(1).reduce((a: number, b: any) => a + (b as number), 0) : 0);
      }, 0);

      const avgAiScore = companies.reduce((sum, comp) => sum + comp.aiScore, 0) / companies.length;

      const industryDistribution = companies.reduce((acc, comp) => {
        const industry = comp.industry || '其他';
        acc[industry] = (acc[industry] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const partnershipDistribution = companies.reduce((acc, comp) => {
        const level = comp.partnershipLevel || '其他';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const regionDistribution = companies.reduce((acc, comp) => {
        const tags = comp.tags?.coreDivision || [];
        tags.forEach((tag: string) => {
          if (tag.includes('华东') || tag.includes('华南') || tag.includes('华北') || tag.includes('西部')) {
            const region = tag.replace('：', '').split(' ')[0];
            acc[region] = (acc[region] || 0) + 1;
          }
        });
        return acc;
      }, {} as Record<string, number>);

      const highScoreCount = companies.filter(c => c.aiScore >= 90).length;
      const riskCount = companies.filter(c => c.riskIndex > 15).length;

      const analysisResult = {
        totalCompanies: companies.length,
        totalAmount: Math.round(totalAmount),
        avgAiScore: Math.round(avgAiScore),
        highScoreCount,
        riskCount,
        industryDistribution,
        partnershipDistribution,
        regionDistribution,
        recommendations: [
          {
            category: '整体规模',
            summary: `本次搜索共找到${companies.length}家企业，累计合作金额达${Math.round(totalAmount)}万元，平均AI评分${Math.round(avgAiScore)}分。`,
            insights: highScoreCount > 0 ? `其中${highScoreCount}家企业AI评分≥90分，建议作为重点拓展对象。` : '企业整体质量良好，建议维护现有合作。'
          },
          {
            category: '行业分布',
            summary: `企业主要集中在${Object.keys(industryDistribution).slice(0, 3).join('、')}等行业。`,
            insights: '建议针对优势行业制定专项合作方案，提升行业渗透率。'
          },
          {
            category: '合作机会',
            summary: riskCount > 0 ? `发现${riskCount}家企业存在一定风险，建议建立预警机制。` : '企业整体风险较低，合作安全性较高。',
            insights: '建议对高评分企业加大业务拓展力度，对风险企业加强监控。'
          }
        ]
      };

      setGroupAnalysisResult(analysisResult);
      setGroupAnalysisLoading(false);
    }, 2000);
  };

  const hasActiveSearch = parseSearchQuery.length > 0;

  // 对比功能已移除
  if (false) {
    const comparingCompanies = [];
    // 计算累计合作金额
    const calculateTotalCooperationAmount = (company: Company) => {
      if (!company.cooperationContracts || company.cooperationContracts.length === 0) {
        const latestMetrics = company.metrics[company.metrics.length - 1];
        return latestMetrics
          ? Object.values(latestMetrics).slice(1).reduce((a, b) => (a as number) + (b as number), 0) as number
          : 0;
      }
      return company.cooperationContracts.reduce((sum, contract) => sum + contract.amount, 0);
    };

    // 计算三年增长率
    const calculateThreeYearGrowth = (company: Company) => {
      const metrics2022 = company.metrics.find(m => m.year === '2022');
      const metrics2024 = company.metrics.find(m => m.year === '2024');
      if (!metrics2022 || !metrics2024) return 'N/A';

      const total2022 = Object.values(metrics2022).slice(1).reduce((a, b) => (a as number) + (b as number), 0) as number;
      const total2024 = Object.values(metrics2024).slice(1).reduce((a, b) => (a as number) + (b as number), 0) as number;

      if (total2022 === 0) return 'N/A';
      const growth = ((total2024 - total2022) / total2022 * 100).toFixed(1);
      return `${growth}%`;
    };

    return (
      <div className="space-y-6">
        {/* Comparison Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setComparisonActive(false)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition"
            >
              <X className="h-5 w-5" />
            </button>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">企业对比分析</h3>
              <p className="text-xs text-slate-400">已选择 {compareIds.length} 家企业进行多维度对比</p>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-left font-semibold text-slate-700 w-32">对比维度</th>
                {comparingCompanies.map(comp => (
                  <th key={comp.id} className="py-3 px-4 text-center font-semibold text-slate-700">
                    {comp.name.slice(0, 6)}...
                  </th>
                ))}
                <th className="py-3 px-4 text-center font-semibold text-slate-700 w-16">最优</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* AI质量评分 */}
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-slate-700">AI质量评分</td>
                {comparingCompanies.map(comp => {
                  const isBest = comp.aiScore === Math.max(...comparingCompanies.map(c => c.aiScore));
                  return (
                    <td key={comp.id} className="py-3 px-4 text-center">
                      <span className={`font-mono font-bold ${isBest ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {comp.aiScore}分
                      </span>
                      {isBest && <span className="ml-1 text-[10px] text-emerald-500">★</span>}
                    </td>
                  );
                })}
                <td className="py-3 px-4 text-center text-[10px] text-slate-400">最高</td>
              </tr>

              {/* 合规评分 */}
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-slate-700">合规评分</td>
                {comparingCompanies.map(comp => {
                  const isBest = comp.complianceRating === Math.max(...comparingCompanies.map(c => c.complianceRating));
                  return (
                    <td key={comp.id} className="py-3 px-4 text-center">
                      <span className={`font-mono font-bold ${isBest ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {comp.complianceRating}%
                      </span>
                      {isBest && <span className="ml-1 text-[10px] text-emerald-500">★</span>}
                    </td>
                  );
                })}
                <td className="py-3 px-4 text-center text-[10px] text-slate-400">最高</td>
              </tr>

              {/* 风险指数 */}
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-slate-700">风险指数</td>
                {comparingCompanies.map(comp => {
                  const isBest = comp.riskIndex === Math.min(...comparingCompanies.map(c => c.riskIndex));
                  return (
                    <td key={comp.id} className="py-3 px-4 text-center">
                      <span className={`font-mono font-bold ${isBest ? 'text-emerald-600' : comp.riskIndex > 15 ? 'text-rose-600' : 'text-slate-700'}`}>
                        {comp.riskIndex}%
                      </span>
                      {isBest && <span className="ml-1 text-[10px] text-emerald-500">★</span>}
                    </td>
                  );
                })}
                <td className="py-3 px-4 text-center text-[10px] text-slate-400">最低</td>
              </tr>

              {/* 累计合作金额 */}
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-slate-700">累计合作金额</td>
                {comparingCompanies.map(comp => {
                  const amount = calculateTotalCooperationAmount(comp);
                  const isBest = amount === Math.max(...comparingCompanies.map(c => calculateTotalCooperationAmount(c)));
                  return (
                    <td key={comp.id} className="py-3 px-4 text-center">
                      <span className={`font-mono font-bold ${isBest ? 'text-emerald-600' : 'text-slate-700'}`}>
                        ¥{amount.toLocaleString()}万
                      </span>
                      {isBest && <span className="ml-1 text-[10px] text-emerald-500">★</span>}
                    </td>
                  );
                })}
                <td className="py-3 px-4 text-center text-[10px] text-slate-400">最高</td>
              </tr>

              {/* 三年增长率 */}
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-slate-700">三年增长率(2022-2024)</td>
                {comparingCompanies.map(comp => {
                  const growth = calculateThreeYearGrowth(comp);
                  return (
                    <td key={comp.id} className="py-3 px-4 text-center">
                      <span className={`font-mono font-bold ${growth !== 'N/A' && parseFloat(growth) > 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {growth}
                      </span>
                    </td>
                  );
                })}
                <td className="py-3 px-4 text-center text-[10px] text-slate-400">-</td>
              </tr>

              {/* 主要合作部门 */}
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-slate-700">主要合作部门</td>
                {comparingCompanies.map(comp => {
                  const mainDept = comp.deptContributions.length > 0
                    ? comp.deptContributions.reduce((prev, current) => current.ratio > prev.ratio ? current : prev)
                    : null;
                  return (
                    <td key={comp.id} className="py-3 px-4 text-center">
                      <div className="text-[10px] text-slate-700">
                        {mainDept ? `${mainDept.name.slice(0, 10)}...` : 'N/A'}
                        {mainDept && <div className="text-[9px] text-slate-400">{mainDept.ratio}%</div>}
                      </div>
                    </td>
                  );
                })}
                <td className="py-3 px-4 text-center text-[10px] text-slate-400">-</td>
              </tr>

              {/* 2024年合作额 */}
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-slate-700">2024年合作额</td>
                {comparingCompanies.map(comp => {
                  const metrics2024 = comp.metrics.find(m => m.year === '2024');
                  const amount = metrics2024
                    ? Object.values(metrics2024).slice(1).reduce((a, b) => (a as number) + (b as number), 0) as number
                    : 0;
                  const isBest = amount === Math.max(...comparingCompanies.map(c => {
                    const m = c.metrics.find(m => m.year === '2024');
                    return m ? Object.values(m).slice(1).reduce((a, b) => (a as number) + (b as number), 0) as number : 0;
                  }));
                  return (
                    <td key={comp.id} className="py-3 px-4 text-center">
                      <span className={`font-mono font-bold ${isBest ? 'text-emerald-600' : 'text-slate-700'}`}>
                        ¥{amount.toLocaleString()}万
                      </span>
                      {isBest && <span className="ml-1 text-[10px] text-emerald-500">★</span>}
                    </td>
                  );
                })}
                <td className="py-3 px-4 text-center text-[10px] text-slate-400">最高</td>
              </tr>

              {/* 参保人数 */}
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-medium text-slate-700">参保人数</td>
                {comparingCompanies.map(comp => {
                  const isBest = comp.insuredEmployees === Math.max(...comparingCompanies.map(c => c.insuredEmployees));
                  return (
                    <td key={comp.id} className="py-3 px-4 text-center">
                      <span className={`font-mono font-bold ${isBest ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {comp.insuredEmployees}人
                      </span>
                      {isBest && <span className="ml-1 text-[10px] text-emerald-500">★</span>}
                    </td>
                  );
                })}
                <td className="py-3 px-4 text-center text-[10px] text-slate-400">最高</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Business Category Distribution Comparison */}
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <h4 className="font-semibold text-slate-900 text-sm mb-4">合作业务分类金额对比 (2024年)</h4>
          <div className="space-y-4">
            {['元器件筛选检测', '质量认证与安全评估', '高精计量与参数校准', '软硬件数字化开发支持', 'TSQ人才职业效能检验培训'].map((category, idx) => (
              <div key={idx} className="space-y-2">
                <div className="text-xs font-medium text-slate-700">{category}</div>
                <div className="space-y-1">
                  {comparingCompanies.map((comp, compIdx) => {
                    const metrics2024 = comp.metrics.find(m => m.year === '2024');
                    let value = 0;
                    if (metrics2024) {
                      if (idx === 0) value = metrics2024.testingAmount;
                      else if (idx === 1) value = metrics2024.certAmount;
                      else if (idx === 2) value = metrics2024.calibrationAmount;
                      else if (idx === 3) value = metrics2024.devAmount;
                      else if (idx === 4) value = metrics2024.trainingAmount;
                    }
                    const maxValue = 6000;
                    const percent = (value / maxValue) * 100;
                    const colors = ['bg-indigo-500', 'bg-sky-500', 'bg-emerald-500'];
                    const color = colors[compIdx % colors.length];

                    return (
                      <div key={comp.id} className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 w-16 truncate">{comp.name.slice(0, 6)}...</span>
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full ${color} rounded-full transition-all duration-700`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-slate-700 w-16 text-right">¥{value}万</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {comparingCompanies.map(comp => (
            <button
              key={comp.id}
              onClick={() => onNavigateToCompany(comp.id)}
              className="px-6 py-2.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              查看{comp.name.slice(0, 4)}...完整画像
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-6">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
          企业智能多维度搜索
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          支持多条件组合搜索，快速精准定位目标企业
        </p>
      </div>

      {/* Search Input Section */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <div className="mb-4">
          <h3 className="text-sm text-slate-900">自然语言智能搜索：</h3>
          <p className="text-xs text-slate-500 mt-1">
            支持语义搜索，AI自动拆解筛选条件。支持简称、别名自动匹配
          </p>
        </div>

        {/* Unified Search Input */}
        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="用自然语言描述搜索需求，如：华南地区汽车行业千万以上高增长客户、华子公司..."
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-12 pr-28 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="p-2 text-slate-400 hover:text-slate-600 transition"
                title="清除搜索"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition ${
                isSearching || !searchQuery.trim()
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isSearching ? '搜索中...' : '搜索'}
            </button>
          </div>
        </div>

        {/* 9大维度标签展示 */}
        <div className="pt-4 border-t border-slate-100">
          <div className="text-xs font-medium text-slate-700 mb-3">
            AI 支持以下维度智能识别，点击标签可快速追加：
          </div>
          <div className="space-y-2">
            {SEARCH_TEMPLATES.slice(0, 9).map((template) => (
              <div key={template.id} className="flex items-start gap-2">
                <span className="text-xs font-semibold text-indigo-600 min-w-fit">{template.category}:</span>
                <div className="flex flex-wrap gap-1.5">
                  {template.tags.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleTagClick(tag)}
                      className="text-[10px] text-slate-600 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Suggestions */}
        {searchSuggestions.length > 0 && (
          <div className="mt-4 bg-white rounded-lg border border-slate-200 shadow-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] text-slate-400">🔍 搜索建议</div>
              <button
                onClick={() => setSearchSuggestions([])}
                className="text-[10px] text-slate-400 hover:text-slate-600"
              >
                关闭
              </button>
            </div>
            <div className="space-y-1">
              {searchSuggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 rounded cursor-pointer transition"
                >
                  {suggestion}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Parsed Conditions Display */}
      {hasActiveSearch && (
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-semibold text-slate-900">
                搜索结果: <span className="text-indigo-600">{filteredCompanies.length}</span> 家企业
              </span>
            </div>
            <div className="flex items-center gap-2">
              {filteredCompanies.length > 1 && (
                <button
                  onClick={handleGroupAnalysis}
                  disabled={groupAnalysisLoading}
                  className={`px-4 py-2 text-xs rounded-lg transition flex items-center gap-1.5 ${
                    groupAnalysisLoading
                      ? 'bg-indigo-100 text-indigo-600 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {groupAnalysisLoading ? '分析中...' : '群画像分析'}
                </button>
              )}
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 text-xs bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300 transition"
              >
                清除搜索
              </button>
            </div>
          </div>

          {/* Search Query */}
          <div className="mb-3 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-slate-400">搜索:</span>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-900 rounded-full text-xs font-medium">
              "{searchQuery}"
            </span>
          </div>

          {/* Parsed Conditions */}
          <div className="flex flex-wrap gap-2">
            {parseSearchQuery.map((condition, idx) => (
              <div
                key={idx}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${
                  condition.type === 'time' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  condition.type === 'department' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                  condition.type === 'business' ? 'bg-green-50 text-green-700 border-green-200' :
                  condition.type === 'amount' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  condition.type === 'partnership' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                  condition.type === 'growth' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  condition.type === 'score' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  condition.type === 'risk' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                  condition.type === 'region' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                  'bg-cyan-50 text-cyan-700 border-cyan-200'
                }`}
              >
                <span>{condition.label}:</span>
                <span className="font-semibold">{condition.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 群画像分析结果 */}
      {groupAnalysisActive && (
        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-5 border border-indigo-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <h3 className="font-semibold text-slate-900 text-sm">企业群画像分析</h3>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-indigo-100">
                {filteredCompanies.length}家企业
              </span>
            </div>
            <button
              onClick={() => setGroupAnalysisActive(false)}
              className="text-slate-400 hover:text-slate-600 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {groupAnalysisLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative w-12 h-12 mb-3">
                <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-sm text-slate-600">AI 正在分析企业群像...</p>
            </div>
          ) : groupAnalysisResult ? (
            <div className="space-y-4 animate-fadeIn">
              {/* 总体概览 */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 border border-slate-100 text-center">
                  <div className="font-mono text-lg font-bold text-indigo-600">{groupAnalysisResult.totalCompanies}</div>
                  <div className="text-[10px] text-slate-400">企业总数</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-slate-100 text-center">
                  <div className="font-mono text-lg font-bold text-emerald-600">{groupAnalysisResult.totalAmount}万</div>
                  <div className="text-[10px] text-slate-400">合作总额</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-slate-100 text-center">
                  <div className="font-mono text-lg font-bold text-amber-600">{groupAnalysisResult.avgAiScore}分</div>
                  <div className="text-[10px] text-slate-400">平均评分</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-slate-100 text-center">
                  <div className="font-mono text-lg font-bold text-rose-600">{groupAnalysisResult.riskCount}家</div>
                  <div className="text-[10px] text-slate-400">风险企业</div>
                </div>
              </div>

              {/* 分布分析 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 行业分布 */}
                <div className="bg-white rounded-lg p-3 border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 mb-2">行业分布</h4>
                  <div className="space-y-1.5">
                    {Object.entries(groupAnalysisResult.industryDistribution).map(([industry, count]) => (
                      <div key={industry} className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 truncate">{industry}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${(count / groupAnalysisResult.totalCompanies) * 100}%` }}
                            />
                          </div>
                          <span className="font-mono text-slate-700 w-8 text-right">{count}家</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 合作级别分布 */}
                <div className="bg-white rounded-lg p-3 border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 mb-2">合作级别分布</h4>
                  <div className="space-y-1.5">
                    {Object.entries(groupAnalysisResult.partnershipDistribution).map(([level, count]) => (
                      <div key={level} className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 truncate">{level}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${(count / groupAnalysisResult.totalCompanies) * 100}%` }}
                            />
                          </div>
                          <span className="font-mono text-slate-700 w-8 text-right">{count}家</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 智能建议 */}
              <div className="bg-white rounded-lg p-4 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
                  智能分析建议
                </h4>
                <div className="space-y-3">
                  {groupAnalysisResult.recommendations.map((rec: any, idx: number) => (
                    <div key={idx} className="text-xs">
                      <div className="font-semibold text-indigo-700 mb-1">{rec.category}</div>
                      <p className="text-slate-600 leading-relaxed">{rec.summary}</p>
                      <p className="text-slate-500 mt-1">{rec.insights}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => setGroupAnalysisActive(false)}
                  className="px-6 py-2 text-xs bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
                >
                  返回企业列表
                </button>
                <button
                  onClick={handleGroupAnalysis}
                  className="px-6 py-2 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  重新分析
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Empty State */}
      {!hasActiveSearch && (
        <div className="bg-white rounded-xl p-12 border border-slate-200 text-center">
          <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 text-lg">请选择搜索提示词模板或输入搜索条件</p>
          <p className="text-slate-300 text-sm mt-2">支持9大维度多条件组合搜索</p>
        </div>
      )}

      {/* Search Results */}
      {hasActiveSearch && (
        <>
          {/* Loading State - Transition Page */}
          {isSearching && (
            <div className="bg-white rounded-xl p-16 border border-slate-200 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-16 h-16 mb-6">
                  <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">正在搜索企业数据...</h3>
                <p className="text-sm text-slate-500">正在匹配搜索条件，请稍候</p>
              </div>
            </div>
          )}

          {/* Search Results */}
          {!isSearching && filteredCompanies.length === 0 ? (
            <div className="bg-white rounded-xl p-12 border border-slate-200 text-center">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-400 text-sm">未找到符合所有条件的企业</p>
              <p className="text-slate-300 text-xs mt-1">请尝试减少搜索条件或调整组合方式</p>
            </div>
          ) : !isSearching && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredCompanies.map((comp) => {
                const latestMetrics = comp.metrics[comp.metrics.length - 1];
                const totalAmount = latestMetrics
                  ? Object.values(latestMetrics).slice(1).reduce((a, b) => (a as number) + (b as number), 0) as number
                  : 0;

                return (
                  <div
                    key={comp.id}
                    className="bg-white rounded-xl p-4 border border-slate-200 hover:shadow-lg transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 flex-1">
                        <img
                          src={comp.logo}
                          alt={comp.name}
                          className="h-10 w-10 rounded-lg border border-slate-200 object-contain p-1 bg-white"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0 ml-2">
                          <div
                            onClick={() => onNavigateToCompany(comp.id)}
                            className="font-semibold text-slate-900 text-sm truncate hover:text-indigo-600 hover:underline cursor-pointer"
                          >
                            {comp.name}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">{comp.industry}</p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center bg-slate-50 rounded p-2">
                        <div className="text-[9px] text-slate-400">AI</div>
                        <div className="text-sm font-bold text-indigo-600">{comp.aiScore}</div>
                      </div>
                      <div className="text-center bg-slate-50 rounded p-2">
                        <div className="text-[9px] text-slate-400">合规</div>
                        <div className="text-sm font-bold text-emerald-600">{comp.complianceRating}</div>
                      </div>
                      <div className="text-center bg-slate-50 rounded p-2">
                        <div className="text-[9px] text-slate-400">风险</div>
                        <div className="text-sm font-bold text-slate-700">{comp.riskIndex}</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                        comp.partnershipLevel.includes('战略')
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                          : 'bg-slate-50 text-slate-600 border border-slate-200'
                      }`}>
                        {comp.partnershipLevel}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${
                        comp.growthCategory === '高增长类'
                          ? 'bg-green-50 text-green-700 border border-green-100'
                          : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        {comp.growthCategory}
                      </span>
                      {comp.tags.coreDivision.slice(0, 2).map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 text-[10px] rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Key Info */}
                    <div className="space-y-1.5 text-xs mb-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400">法人代表:</span>
                        <span className="font-medium text-slate-700">{comp.representative}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">合作金额:</span>
                        <span className="font-medium text-slate-700">¥{(totalAmount / 100).toFixed(1)}亿</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">参保人数:</span>
                        <span className="font-medium text-slate-700">{comp.insuredEmployees}人</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => onNavigateToCompany(comp.id)}
                        className="flex-1 px-3 py-2 text-[11px] font-medium rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                      >
                        查看画像
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
