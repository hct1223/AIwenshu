# Enterprise Search Mock Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 16 complete, searchable mock enterprises and make the existing multidimensional search reliably usable with the expanded dataset.

**Architecture:** Keep the new records in `searchMockCompanies.ts`, generate complete `Company` values from compact seed profiles, and merge them into the shared `COMP_MOCK_LIST`. Extend search aliases and filtering rather than changing the search page architecture.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS.

---

### Task 1: Capture the failing baseline

**Files:**
- Inspect: `src/data/mockData.ts`
- Inspect: `src/components/SearchModule.tsx`

- [x] **Step 1: Verify the shared company count is four**

Run:

```bash
rg -c "^    id: 'comp-" src/data/mockData.ts
```

Expected: `4`.

- [x] **Step 2: Verify the search-only fixture file does not exist**

Run:

```bash
test -f src/data/searchMockCompanies.ts
```

Expected: exit status 1.

- [x] **Step 3: Record existing SearchModule type errors**

Run:

```bash
npx tsc --noEmit 2>&1 | rg "SearchModule.tsx"
```

Expected: errors including `setParsedConditions`, `setComparisonActive`, `compareIds`, and arithmetic operand errors.

### Task 2: Create 16 complete mock companies

**Files:**
- Create: `src/data/searchMockCompanies.ts`

- [x] **Step 1: Add the typed seed helper and all 16 profiles**

```ts
import { Company, EnterpriseMetric } from '../types';

type MetricTuple = [number, number, number, number, number];

interface SearchMockSeed {
  id: string;
  name: string;
  label: string;
  type: string;
  industry: string;
  growthCategory: Company['growthCategory'];
  partnershipLevel: Company['partnershipLevel'];
  address: string;
  region: string;
  aiScore: number;
  complianceRating: number;
  riskIndex: number;
  insuredEmployees: number;
  employeesScale: string;
  registeredCapital: string;
  establishmentDate: string;
  summary: string;
  coreTags: string[];
  businessTags: string[];
  otherTags: string[];
  metrics: [MetricTuple, MetricTuple, MetricTuple];
  departments: string[];
  contactName: string;
  contactRole: string;
  visitTopic: string;
  contractName: string;
}

const mockLogo = (label: string, color: string) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" rx="20" fill="${color}"/><text x="48" y="56" text-anchor="middle" font-size="28" font-family="sans-serif" font-weight="700" fill="white">${label}</text></svg>`
  )}`;

const toMetric = (year: string, values: MetricTuple): EnterpriseMetric => ({
  year,
  testingAmount: values[0],
  certAmount: values[1],
  calibrationAmount: values[2],
  devAmount: values[3],
  trainingAmount: values[4],
});

const metricTotal = (metric: EnterpriseMetric) =>
  metric.testingAmount +
  metric.certAmount +
  metric.calibrationAmount +
  metric.devAmount +
  metric.trainingAmount;

const createCompany = (seed: SearchMockSeed): Company => {
  const metrics = [
    toMetric('2022', seed.metrics[0]),
    toMetric('2023', seed.metrics[1]),
    toMetric('2024', seed.metrics[2]),
  ];
  const total = metricTotal(metrics[2]);
  const weights = [50, 30, 15, 5].slice(0, seed.departments.length);
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);

  return {
    id: seed.id,
    name: seed.name,
    logo: mockLogo(seed.label, '#4f46e5'),
    type: seed.type,
    growthCategory: seed.growthCategory,
    partnershipLevel: seed.partnershipLevel,
    creditCode: `MOCK91310000${seed.id.slice(-6).toUpperCase()}`,
    representative: '演示联系人',
    website: `https://example.com/mock/${seed.id}`,
    phone: `400-000-${seed.id.slice(-4).padStart(4, '0')}`,
    email: `${seed.id}@example.com`,
    address: seed.address,
    establishmentDate: seed.establishmentDate,
    registeredCapital: seed.registeredCapital,
    employeesScale: seed.employeesScale,
    insuredEmployees: seed.insuredEmployees,
    industry: seed.industry,
    taxpayerStatus: '一般纳税人',
    aiScore: seed.aiScore,
    complianceRating: seed.complianceRating,
    riskIndex: seed.riskIndex,
    tags: {
      coreDivision: [seed.region, ...seed.coreTags],
      businessPreference: seed.businessTags,
      otherTags: [seed.region, ...seed.otherTags],
    },
    metrics,
    deptContributions: seed.departments.map((name, index) => ({
      name,
      ratio: Math.round((weights[index] / weightTotal) * 100),
      amount: Math.round((total * weights[index]) / weightTotal),
    })),
    contacts: [{
      id: `${seed.id}-contact`,
      name: seed.contactName,
      avatar: mockLogo(seed.contactName.slice(0, 1), '#0f766e'),
      role: seed.contactRole,
      phone: `400-100-${seed.id.slice(-4).padStart(4, '0')}`,
      email: `${seed.id}.contact@example.com`,
    }],
    visitRecords: [{
      id: `${seed.id}-visit`,
      date: '2024-05-20',
      type: '技术交流',
      topic: seed.visitTopic,
      leader: '演示业务负责人',
      location: '赛宝广州总部',
      handler: '演示客户经理',
      department: '技推处',
    }],
    activityLogs: [{
      id: `${seed.id}-log`,
      timestamp: '2024-05-24 14:30',
      title: `${seed.contractName}项目完成阶段验收`,
      type: 'meeting',
      summary: '演示数据：项目团队完成阶段成果评审，并同步下一阶段测试计划。',
    }],
    saibaoCooperationSummary: seed.summary,
    cooperationContracts: [{
      id: `${seed.id}-contract`,
      contractNo: `MOCK-${seed.id.toUpperCase()}`,
      name: seed.contractName,
      amount: Math.round(total * 0.6),
      signDate: '2024-01-15',
      startDate: '2024-01-20',
      endDate: '2024-12-31',
      status: '履行中',
      department: seed.departments[0],
      projectLeader: '演示项目经理',
      summary: '演示合同：围绕企业核心产品开展检测、认证、计量或软件质量服务。',
    }],
  };
};

const SEARCH_MOCK_SEEDS: SearchMockSeed[] = [
  {
    id: 'comp-tencent', name: '腾讯科技（深圳）有限公司', label: '腾讯',
    type: '有限责任公司 (上市)', industry: '软件与互联网',
    growthCategory: '高增长类', partnershipLevel: '战略级合作伙伴',
    address: '深圳市南山区科技园腾讯滨海大厦', region: '华南地区',
    aiScore: 95, complianceRating: 97, riskIndex: 8, insuredEmployees: 62800,
    employeesScale: '10000 人以上', registeredCapital: '200 亿人民币',
    establishmentDate: '1998-11-11',
    summary: '腾讯与赛宝在云平台安全、软件评测、音视频质量和终端可靠性领域开展长期合作。',
    coreTags: ['中国百强企业', '高新技术企业', '行业龙头企业'],
    businessTags: ['软件评测', '代码审计', '环境试验', '软件安全'],
    otherTags: ['深圳', '近一年高频', '战略合作'],
    metrics: [[2600, 900, 500, 1700, 300], [3100, 1100, 650, 1900, 350], [3600, 1200, 800, 2100, 400]],
    departments: ['软件评测中心', '技推处', '可靠性试验室'],
    contactName: '演示客户甲', contactRole: '质量平台主管',
    visitTopic: '云平台软件质量与安全评测交流',
    contractName: '云平台软件安全评测与代码审计年度服务合同',
  },
  {
    id: 'comp-alibaba', name: '阿里巴巴（中国）有限公司', label: '阿里',
    type: '有限责任公司 (上市)', industry: '软件与互联网',
    growthCategory: '高增长类', partnershipLevel: '战略级合作伙伴',
    address: '杭州市余杭区文一西路阿里巴巴西溪园区', region: '华东地区',
    aiScore: 93, complianceRating: 96, riskIndex: 11, insuredEmployees: 52000,
    employeesScale: '10000 人以上', registeredCapital: '154 亿美元',
    establishmentDate: '2007-03-26',
    summary: '阿里巴巴与赛宝围绕云计算可靠性、电子商务软件测评和数据中心设备检测建立合作。',
    coreTags: ['中国百强企业', '高新技术企业', '行业龙头企业'],
    businessTags: ['软件评测', '认证评估', '环境试验', '代码审计'],
    otherTags: ['杭州', '近两年', '战略合作'],
    metrics: [[2300, 800, 450, 1100, 250], [2800, 950, 600, 1400, 280], [3200, 1100, 700, 1700, 300]],
    departments: ['软件评测中心', '可靠性试验室', '认证中心'],
    contactName: '演示客户乙', contactRole: '基础设施质量总监',
    visitTopic: '云基础设施可靠性测试方案评审',
    contractName: '云基础设施可靠性与软件质量年度测试合同',
  },
  {
    id: 'comp-bytedance', name: '北京字节跳动科技有限公司', label: '字节',
    type: '有限责任公司', industry: '软件与人工智能',
    growthCategory: '高增长类', partnershipLevel: '战略级合作伙伴',
    address: '北京市海淀区知春路甲48号', region: '华北地区',
    aiScore: 96, complianceRating: 95, riskIndex: 7, insuredEmployees: 41000,
    employeesScale: '10000 人以上', registeredCapital: '1000 万人民币',
    establishmentDate: '2012-03-09',
    summary: '字节跳动与赛宝在 AI 平台评测、算法安全性、移动应用质量和数据合规方面合作。',
    coreTags: ['高新技术企业', '行业龙头企业', '独角兽企业'],
    businessTags: ['软件评测', '代码审计', '认证评估', '车规算法'],
    otherTags: ['北京', '近一年高频', '高增长'],
    metrics: [[2100, 500, 300, 1400, 300], [2700, 650, 400, 1700, 350], [3300, 800, 500, 2100, 400]],
    departments: ['软件评测中心', '信息管理处', '技推处'],
    contactName: '演示客户丙', contactRole: 'AI 质量负责人',
    visitTopic: '生成式 AI 平台质量评价体系交流',
    contractName: 'AI 平台质量评测与算法安全审计合同',
  },
  {
    id: 'comp-xiaomi', name: '小米科技有限责任公司', label: '小米',
    type: '有限责任公司 (上市)', industry: '半导体与消费电子',
    growthCategory: '高增长类', partnershipLevel: '核心供应商',
    address: '北京市海淀区西二旗中路33号', region: '华北地区',
    aiScore: 90, complianceRating: 94, riskIndex: 14, insuredEmployees: 35000,
    employeesScale: '10000 人以上', registeredCapital: '18.5 亿人民币',
    establishmentDate: '2010-03-03',
    summary: '小米与赛宝在手机、智能汽车和 IoT 终端的元器件筛选、可靠性及软件测试方面合作。',
    coreTags: ['中国百强企业', '高新技术企业', '行业龙头企业'],
    businessTags: ['失效分析', '环境试验', '车规算法', '计量校准'],
    otherTags: ['北京', '近一年高频', '智能汽车'],
    metrics: [[1600, 700, 500, 400, 200], [2100, 800, 600, 500, 220], [2600, 900, 700, 600, 250]],
    departments: ['元器件检测所', '可靠性试验室', '计量校准所'],
    contactName: '演示客户丁', contactRole: '终端质量平台主管',
    visitTopic: '智能汽车电子可靠性与车规软件测试',
    contractName: '智能终端及车规元器件可靠性测试合同',
  },
  {
    id: 'comp-smic', name: '中芯国际集成电路制造（上海）有限公司', label: '中芯',
    type: '股份有限公司 (上市)', industry: '半导体与集成电路制造',
    growthCategory: '高增长类', partnershipLevel: '战略级合作伙伴',
    address: '上海市浦东新区张江路18号', region: '华东地区',
    aiScore: 91, complianceRating: 98, riskIndex: 13, insuredEmployees: 21000,
    employeesScale: '10000 人以上', registeredCapital: '198 亿人民币',
    establishmentDate: '2000-04-03',
    summary: '中芯国际与赛宝在晶圆制造、集成电路失效分析和供应链质量验证方面保持长期合作。',
    coreTags: ['中国百强企业', '高新技术企业', '行业龙头企业'],
    businessTags: ['失效分析', '元器件检测', '环境试验', '计量校准'],
    otherTags: ['上海', '半导体', '战略合作'],
    metrics: [[1900, 500, 800, 300, 180], [2500, 650, 1000, 350, 190], [3100, 800, 1200, 400, 200]],
    departments: ['元器件检测所', '可靠性试验室', '计量校准所'],
    contactName: '演示客户戊', contactRole: '晶圆质量主管',
    visitTopic: '先进制程芯片失效分析技术交流',
    contractName: '集成电路晶圆可靠性与失效分析框架合同',
  },
  {
    id: 'comp-unisoc', name: '紫光展锐（上海）科技有限公司', label: '展锐',
    type: '有限责任公司', industry: '半导体与集成电路',
    growthCategory: '初创潜力', partnershipLevel: '意向客户',
    address: '上海市浦东新区祖冲之路2288号', region: '华东地区',
    aiScore: 88, complianceRating: 92, riskIndex: 16, insuredEmployees: 4800,
    employeesScale: '1000-5000 人', registeredCapital: '57 亿人民币',
    establishmentDate: '2013-08-26',
    summary: '紫光展锐处在芯片验证与测试体系扩展阶段，是赛宝在通信芯片领域的重点培育客户。',
    coreTags: ['高新技术企业', '独角兽企业', '科技企业'],
    businessTags: ['失效分析', '软件评测', '环境试验', '5G射频模组认证'],
    otherTags: ['上海', '集成电路', '意向重点'],
    metrics: [[500, 180, 220, 120, 60], [700, 250, 320, 150, 80], [900, 350, 450, 180, 100]],
    departments: ['元器件检测所', '可靠性试验室'],
    contactName: '演示客户己', contactRole: '芯片验证主管',
    visitTopic: '通信芯片测试能力导入评估',
    contractName: '通信芯片可靠性与功能验证试运行合同',
  },
  {
    id: 'comp-avic', name: '中国航空工业集团有限公司', label: '航空',
    type: '有限责任公司 (国有)', industry: '航空航天',
    growthCategory: '成熟型', partnershipLevel: '战略级合作伙伴',
    address: '北京市朝阳区曙光西里甲5号', region: '华北地区',
    aiScore: 89, complianceRating: 99, riskIndex: 15, insuredEmployees: 420000,
    employeesScale: '10000 人以上', registeredCapital: '640 亿人民币',
    establishmentDate: '2008-11-06',
    summary: '航空工业集团与赛宝在机载设备、环境试验、可靠性和计量校准领域开展体系化合作。',
    coreTags: ['央企国企', '中国百强企业', '行业龙头企业'],
    businessTags: ['环境试验', '可靠性试验', '计量校准', '失效分析'],
    otherTags: ['北京', '大型集团', '战略合作'],
    metrics: [[1700, 600, 1000, 300, 120], [2100, 750, 1200, 400, 150], [2600, 900, 1500, 500, 200]],
    departments: ['可靠性试验室', '计量校准所', '元器件检测所'],
    contactName: '演示客户庚', contactRole: '质量体系主管',
    visitTopic: '航空装备环境与可靠性试验年度交流',
    contractName: '航空装备环境试验与计量校准年度合同',
  },
  {
    id: 'comp-dji', name: '深圳市大疆创新科技有限公司', label: '大疆',
    type: '有限责任公司', industry: '航空航天与低空经济',
    growthCategory: '高增长类', partnershipLevel: '战略级合作伙伴',
    address: '深圳市南山区西丽街道大疆天空之城', region: '华南地区',
    aiScore: 92, complianceRating: 96, riskIndex: 10, insuredEmployees: 14000,
    employeesScale: '10000 人以上', registeredCapital: '3000 万人民币',
    establishmentDate: '2006-11-06',
    summary: '大疆与赛宝围绕无人机系统、低空飞行器、飞控软件和环境可靠性开展合作。',
    coreTags: ['高新技术企业', '行业龙头企业', '深圳总部企业'],
    businessTags: ['低空产业部', '环境试验', '软件评测', '可靠性试验'],
    otherTags: ['深圳', '无人机', '低空经济'],
    metrics: [[1300, 350, 250, 600, 100], [1700, 450, 350, 750, 130], [2200, 600, 500, 900, 180]],
    departments: ['低空产业部', '可靠性试验室', '软件评测中心'],
    contactName: '演示客户辛', contactRole: '低空产品质量主管',
    visitTopic: '无人机系统合格审定与可靠性试验',
    contractName: '无人机系统环境可靠性与飞控软件评测合同',
  },
  {
    id: 'comp-mindray', name: '深圳迈瑞生物医疗电子股份有限公司', label: '迈瑞',
    type: '股份有限公司 (上市)', industry: '医疗器械与生物医疗',
    growthCategory: '稳健型', partnershipLevel: '核心供应商',
    address: '深圳市南山区高新技术产业园区科技南十二路', region: '华南地区',
    aiScore: 90, complianceRating: 98, riskIndex: 9, insuredEmployees: 19000,
    employeesScale: '10000 人以上', registeredCapital: '12.1 亿人民币',
    establishmentDate: '1999-01-25',
    summary: '迈瑞与赛宝在医疗设备电气安全、环境可靠性、软件确认和计量校准方面合作。',
    coreTags: ['中国百强企业', '高新技术企业', '行业龙头企业'],
    businessTags: ['认证评估', '计量校准', '软件评测', '环境试验'],
    otherTags: ['深圳', '医疗', '长期合作'],
    metrics: [[1000, 500, 600, 300, 180], [1400, 600, 750, 350, 220], [1800, 700, 900, 400, 300]],
    departments: ['计量校准所', '可靠性试验室', '软件评测中心'],
    contactName: '演示客户壬', contactRole: '医疗设备合规负责人',
    visitTopic: '医疗设备软件确认与计量校准',
    contractName: '医疗设备安全认证与计量校准年度服务合同',
  },
  {
    id: 'comp-united-imaging', name: '上海联影医疗科技股份有限公司', label: '联影',
    type: '股份有限公司 (上市)', industry: '医疗器械与医学影像',
    growthCategory: '高增长类', partnershipLevel: '战略级合作伙伴',
    address: '上海市嘉定区城北路2258号', region: '华东地区',
    aiScore: 91, complianceRating: 97, riskIndex: 10, insuredEmployees: 12000,
    employeesScale: '10000 人以上', registeredCapital: '12.3 亿人民币',
    establishmentDate: '2011-03-10',
    summary: '联影医疗与赛宝在医学影像设备、软件质量、电磁兼容和计量校准方面合作。',
    coreTags: ['高新技术企业', '行业龙头企业', '上海总部企业'],
    businessTags: ['软件评测', '认证评估', '计量校准', '环境试验'],
    otherTags: ['上海', '医疗', '高增长'],
    metrics: [[900, 400, 500, 420, 160], [1250, 500, 650, 480, 200], [1700, 650, 800, 500, 250]],
    departments: ['软件评测中心', '计量校准所', '可靠性试验室'],
    contactName: '演示客户癸', contactRole: '影像系统质量主管',
    visitTopic: '医学影像软件质量与计量校准评审',
    contractName: '医学影像系统软件评测与计量校准合同',
  },
  {
    id: 'comp-chengdu-aircraft', name: '成都飞机工业（集团）有限责任公司', label: '成飞',
    type: '有限责任公司 (国有)', industry: '航空航天',
    growthCategory: '成熟型', partnershipLevel: '战略级合作伙伴',
    address: '成都市青羊区黄田坝', region: '西南地区',
    aiScore: 90, complianceRating: 99, riskIndex: 14, insuredEmployees: 26000,
    employeesScale: '10000 人以上', registeredCapital: '50 亿人民币',
    establishmentDate: '1998-09-25',
    summary: '成飞与赛宝在航空装备可靠性、环境试验和计量测试保障方面开展长期合作。',
    coreTags: ['央企国企', '行业龙头企业', '大型集团'],
    businessTags: ['环境试验', '可靠性试验', '计量校准', '失效分析'],
    otherTags: ['成都', '航空', '战略合作'],
    metrics: [[1500, 450, 900, 250, 90], [1900, 600, 1100, 280, 100], [2400, 800, 1300, 300, 120]],
    departments: ['可靠性试验室', '计量校准所'],
    contactName: '演示客户子', contactRole: '试验保障主管',
    visitTopic: '航空装备环境试验能力交流',
    contractName: '航空装备可靠性试验与计量保障合同',
  },
  {
    id: 'comp-longi', name: '隆基绿能科技股份有限公司', label: '隆基',
    type: '股份有限公司 (上市)', industry: '新能源与半导体材料',
    growthCategory: '高增长类', partnershipLevel: '核心供应商',
    address: '西安市航天基地航天中路388号', region: '西北地区',
    aiScore: 87, complianceRating: 95, riskIndex: 17, insuredEmployees: 61000,
    employeesScale: '10000 人以上', registeredCapital: '75.8 亿人民币',
    establishmentDate: '2000-02-14',
    summary: '隆基绿能与赛宝在光伏组件环境试验、材料失效分析和计量校准方面合作。',
    coreTags: ['中国百强企业', '高新技术企业', '行业龙头企业'],
    businessTags: ['环境试验', '失效分析', '计量校准', '认证评估'],
    otherTags: ['西安', '新能源', '高增长'],
    metrics: [[1100, 400, 350, 300, 100], [1450, 550, 450, 400, 120], [1900, 700, 600, 500, 100]],
    departments: ['可靠性试验室', '计量校准所'],
    contactName: '演示客户丑', contactRole: '组件质量负责人',
    visitTopic: '光伏组件环境耐受性测试方案',
    contractName: '光伏组件环境试验与材料失效分析合同',
  },
  {
    id: 'comp-ymtc', name: '长江存储科技有限责任公司', label: '长存',
    type: '有限责任公司', industry: '半导体与存储芯片',
    growthCategory: '高增长类', partnershipLevel: '核心供应商',
    address: '武汉市东湖新技术开发区未来三路88号', region: '华中地区',
    aiScore: 89, complianceRating: 96, riskIndex: 15, insuredEmployees: 8500,
    employeesScale: '5000-10000 人', registeredCapital: '647 亿人民币',
    establishmentDate: '2016-07-26',
    summary: '长江存储与赛宝在存储芯片失效分析、可靠性验证和测试设备计量方面合作。',
    coreTags: ['高新技术企业', '独角兽企业', '科技企业'],
    businessTags: ['失效分析', '可靠性试验', '计量校准', '元器件检测'],
    otherTags: ['武汉', '半导体', '高增长'],
    metrics: [[1200, 350, 500, 300, 80], [1600, 450, 650, 380, 90], [2200, 600, 900, 450, 100]],
    departments: ['元器件检测所', '可靠性试验室'],
    contactName: '演示客户寅', contactRole: '存储芯片质量主管',
    visitTopic: '存储芯片失效分析与可靠性验证',
    contractName: '存储芯片可靠性验证与失效分析合同',
  },
  {
    id: 'comp-catl', name: '宁德时代新能源科技股份有限公司', label: '宁德',
    type: '股份有限公司 (上市)', industry: '新能源与动力电池',
    growthCategory: '高增长类', partnershipLevel: '战略级合作伙伴',
    address: '宁德市蕉城区漳湾镇新港路2号', region: '华东地区',
    aiScore: 95, complianceRating: 98, riskIndex: 8, insuredEmployees: 116000,
    employeesScale: '10000 人以上', registeredCapital: '44 亿人民币',
    establishmentDate: '2011-12-16',
    summary: '宁德时代与赛宝在动力电池安全、环境可靠性、计量校准及 BMS 软件测试方面合作。',
    coreTags: ['中国百强企业', '高新技术企业', '行业龙头企业'],
    businessTags: ['环境试验', '可靠性试验', '计量校准', '软件评测'],
    otherTags: ['宁德', '新能源', '战略合作'],
    metrics: [[1900, 600, 800, 500, 200], [2400, 800, 1000, 600, 280], [3000, 1000, 1200, 700, 350]],
    departments: ['可靠性试验室', '计量校准所', '软件评测中心'],
    contactName: '演示客户卯', contactRole: '电池安全质量主管',
    visitTopic: '动力电池安全与 BMS 软件测试交流',
    contractName: '动力电池安全测试与 BMS 软件评测合同',
  },
  {
    id: 'comp-boe', name: '京东方科技集团股份有限公司', label: '京东方',
    type: '股份有限公司 (上市)', industry: '半导体显示',
    growthCategory: '稳健型', partnershipLevel: '核心供应商',
    address: '北京市大兴区亦庄经济技术开发区西环中路12号', region: '华北地区',
    aiScore: 88, complianceRating: 94, riskIndex: 13, insuredEmployees: 98000,
    employeesScale: '10000 人以上', registeredCapital: '376 亿人民币',
    establishmentDate: '1993-04-09',
    summary: '京东方与赛宝在显示器件可靠性、计量校准、失效分析和环境试验方面合作。',
    coreTags: ['中国百强企业', '高新技术企业', '行业龙头企业'],
    businessTags: ['计量校准', '失效分析', '环境试验', '元器件检测'],
    otherTags: ['北京', '半导体显示', '长期合作'],
    metrics: [[1000, 500, 600, 400, 100], [1350, 650, 750, 500, 150], [1700, 800, 900, 600, 200]],
    departments: ['计量校准所', '可靠性试验室', '元器件检测所'],
    contactName: '演示客户辰', contactRole: '显示器件质量主管',
    visitTopic: '显示器件可靠性与计量测试交流',
    contractName: '显示器件可靠性测试与计量校准合同',
  },
  {
    id: 'comp-iflytek', name: '科大讯飞股份有限公司', label: '讯飞',
    type: '股份有限公司 (上市)', industry: '人工智能与软件',
    growthCategory: '高增长类', partnershipLevel: '意向客户',
    address: '合肥市高新区望江西路666号', region: '华东地区',
    aiScore: 89, complianceRating: 95, riskIndex: 15, insuredEmployees: 15000,
    employeesScale: '10000 人以上', registeredCapital: '23.1 亿人民币',
    establishmentDate: '1999-12-30',
    summary: '科大讯飞与赛宝在人工智能软件评测、代码审计、算法质量及终端环境试验方面合作。',
    coreTags: ['高新技术企业', '行业龙头企业', '科技企业'],
    businessTags: ['软件评测', '代码审计', '车规算法', '环境试验'],
    otherTags: ['合肥', '人工智能', '意向重点'],
    metrics: [[700, 350, 300, 600, 250], [950, 420, 420, 750, 300], [1200, 500, 600, 900, 400]],
    departments: ['软件评测中心', '信息管理处'],
    contactName: '演示客户巳', contactRole: 'AI 软件质量主管',
    visitTopic: '人工智能软件评测与算法质量方案',
    contractName: '人工智能软件评测与算法质量验证合同',
  },
];

export const SEARCH_MOCK_COMPANIES: Company[] = SEARCH_MOCK_SEEDS.map(createCompany);
```

- [x] **Step 2: Verify the file contains 16 profiles**

Run:

```bash
rg -c "id: 'comp-" src/data/searchMockCompanies.ts
```

Expected: `16`.

### Task 3: Merge the new companies into the shared list

**Files:**
- Modify: `src/data/mockData.ts:5-8`

- [x] **Step 1: Import the search fixtures**

```ts
import { SEARCH_MOCK_COMPANIES } from './searchMockCompanies';
```

- [x] **Step 2: Merge instead of replacing the existing records**

```ts
export const COMP_MOCK_LIST: Company[] = [
  ...BASE_COMP_MOCK_LIST,
  ...SEARCH_MOCK_COMPANIES,
];
```

Rename the existing array literal `COMP_MOCK_LIST` to `BASE_COMP_MOCK_LIST` so the four existing records remain unchanged.

- [x] **Step 3: Verify the shared list has 20 records**

Run:

```bash
rg -c "^    id: 'comp-" src/data/mockData.ts
```

Expected: `4` literal records plus one imported collection; browser verification in Task 5 must report 20 companies.

### Task 4: Extend aliases and fix search filtering

**Files:**
- Modify: `src/components/SearchModule.tsx:174-193`
- Modify: `src/components/SearchModule.tsx:435-540`
- Modify: `src/components/SearchModule.tsx:590-615`
- Remove dead comparison block after `// 对比功能已移除`.

- [x] **Step 1: Add aliases for the new companies**

```ts
'中芯国际': ['中芯国际', '中芯', 'SMIC', 'smic'],
'大疆': ['大疆', 'DJI', 'dji', '大疆创新'],
'迈瑞': ['迈瑞', '迈瑞医疗', 'Mindray', 'mindray'],
'联影': ['联影', '联影医疗', 'United Imaging'],
'航空工业': ['航空工业', 'AVIC', '中国航空工业集团'],
'成飞': ['成飞', '成都飞机工业', 'Chengdu Aircraft'],
'隆基': ['隆基', '隆基绿能', 'LONGi', 'longi'],
'长江存储': ['长江存储', '长存', 'YMTC', 'ymtc'],
'宁德时代': ['宁德时代', '宁德', 'CATL', 'catl'],
'京东方': ['京东方', 'BOE', 'boe'],
'科大讯飞': ['科大讯飞', '讯飞', 'iFlytek', 'iflytek'],
```

- [x] **Step 2: Make partnership filtering match the canonical company levels**

```ts
case 'partnership': {
  const target = String(condition.value);
  if (target.includes('战略')) return company.partnershipLevel === '战略级合作伙伴';
  if (target.includes('核心供应商')) return company.partnershipLevel === '核心供应商';
  if (target.includes('意向')) return company.partnershipLevel === '意向客户';
  if (target.includes('长期')) {
    return company.growthCategory === '稳健型' || company.growthCategory === '成熟型';
  }
  return true;
}
```

- [x] **Step 3: Complete tag filtering**

```ts
case 'tag': {
  const target = String(condition.value);
  if (target === '上市企业') return company.type.includes('上市');
  return [
    ...company.tags.coreDivision,
    ...company.tags.businessPreference,
    ...company.tags.otherTags,
  ].some((tag) => tag.includes(target) || target.includes(tag));
}
```

- [x] **Step 4: Remove invalid state calls**

Replace `setParsedConditions(parseSearchQuery);` in `handleTagClick` with no statement, and remove `setParsedConditions(parseNaturalLanguageQuery);` from the `handleSearch` callback.

- [x] **Step 5: Remove the unreachable comparison block**

Delete:

```ts
// 对比功能已移除
if (false) {
  // entire unreachable comparison UI
}
```

This removes references to undefined `compareIds` and `setComparisonActive`.

### Task 5: Verify search behavior and company portraits

**Files:**
- Verify: `src/data/searchMockCompanies.ts`
- Verify: `src/data/mockData.ts`
- Verify: `src/components/SearchModule.tsx`

- [x] **Step 1: Run the TypeScript check**

Run:

```bash
npm run lint
```

Expected: no `SearchModule.tsx` errors. Pre-existing `AIChatSidebar.tsx`, `DashboardModule.tsx`, and `types.ts` errors must not increase.

- [x] **Step 2: Run the production build**

Run:

```bash
npm run build
```

Expected: successful Vite build.

- [x] **Step 3: Verify representative searches in the browser**

Open `http://localhost:3001/`, switch to “企业搜索”, and verify these queries:

| Query | Minimum expected result |
| --- | --- |
| `半导体` | 4 companies |
| `软件` | 4 companies |
| `航空` | 3 companies |
| `医疗` | 2 companies |
| `央企国企` | 2 companies |
| `西北地区` | 1 company |
| `西南地区` | 1 company |
| `5000万以上 战略级 AI评分90分以上 低风险` | 2 companies |

- [x] **Step 4: Verify portrait navigation**

Click a new result such as “中芯国际集成电路制造（上海）有限公司” and confirm the enterprise portrait displays its name, three-year metrics, department contribution, and contract.

- [x] **Step 5: Commit the implementation**

```bash
git add src/data/searchMockCompanies.ts src/data/mockData.ts src/components/SearchModule.tsx docs/superpowers/plans/2026-10-28-enterprise-search-mock-data.md
git commit -m "feat: 补充企业智能搜索 Mock 数据"
```
