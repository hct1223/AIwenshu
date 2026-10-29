export interface MonthlyAmountRecord {
  year: string;
  month: number;
  label: string;
  amount: number;
  mom: number | null;
  customers: number;
}

export interface AnnualAmountRecord {
  year: string;
  amount: number;
  yoy: number;
  customers: number;
}

export interface BusinessAmount {
  businessType: string;
  amount: number;
}

export interface LocationAmountRecord {
  id: string;
  province: string;
  city: string;
  region: string;
  amount: number;
  customers: number;
  yoy: number;
  businessBreakdown: BusinessAmount[];
}

export interface DeclineDriver {
  businessType: string;
  declineAmount: number;
  contributionRate: number;
}

export interface DeclineAttributionRecord {
  subjectType: 'region' | 'customer';
  subject: string;
  previousAmount: number;
  currentAmount: number;
  declineAmount: number;
  declineRate: number;
  drivers: DeclineDriver[];
  conclusion: string;
}

export type RiskLevel = '高风险' | '中风险' | '低风险';
export type CustomerLevel = '战略客户' | '重点客户' | '普通客户';

export interface ChurnWarningRecord {
  id: string;
  rank: number;
  customerName: string;
  customerLevel: CustomerLevel;
  riskLevel: RiskLevel;
  riskScore: number;
  region: string;
  city: string;
  industry: string;
  recentConsumptionDays: number;
  consumptionInterval: string;
  lastAmount: number;
  owner: string;
}

export type BusinessInsightQueryResult =
  | {
      kind: 'monthly';
      year: string;
      rows: MonthlyAmountRecord[];
      totalAmount: number;
      averageAmount: number;
    }
  | {
      kind: 'annual';
      rows: AnnualAmountRecord[];
      totalAmount: number;
      latestGrowth: number;
    }
  | {
      kind: 'region';
      scopeLabel: string;
      rows: LocationAmountRecord[];
      totalAmount: number;
      totalCustomers: number;
      businessBreakdown: BusinessAmount[];
    }
  | {
      kind: 'decline';
      record: DeclineAttributionRecord;
    }
  | {
      kind: 'churn';
      top100: ChurnWarningRecord[];
      riskDistribution: Record<RiskLevel, number>;
      customerLevelDistribution: Record<CustomerLevel, number>;
      intervalDistribution: Record<string, number>;
      conclusion: string;
    };

const MONTHLY_VALUES = {
  '2024': [16200, 15100, 17400, 16800, 18600, 20100, 19400, 21600, 20800, 22500, 23100, 23900],
  '2025': [19800, 17600, 21400, 20700, 23100, 24500, 23900, 25600, 24800, 26400, 27100, 30100],
  '2026': [24800, 22100, 28500, 27600, 31200, 33800, 32600, 34500, 33200, 34800],
} as const;

const percentageChange = (current: number, previous: number): number =>
  Number((((current - previous) / previous) * 100).toFixed(1));

export const MONTHLY_AMOUNTS: MonthlyAmountRecord[] = Object.entries(MONTHLY_VALUES)
  .flatMap(([year, values], yearIndex, allYears) =>
    values.map((amount, index) => {
      const previous = index > 0
        ? values[index - 1]
        : yearIndex > 0
          ? allYears[yearIndex - 1][1][allYears[yearIndex - 1][1].length - 1]
          : null;
      return {
        year,
        month: index + 1,
        label: `${year}-${String(index + 1).padStart(2, '0')}`,
        amount,
        mom: previous ? percentageChange(amount, previous) : null,
        customers: Math.round(105 + amount / 520),
      };
    })
  );

const annualTotal = (year: keyof typeof MONTHLY_VALUES) =>
  MONTHLY_VALUES[year].reduce((sum, amount) => sum + amount, 0);

export const ANNUAL_AMOUNTS: AnnualAmountRecord[] = [
  { year: '2022', amount: 168500, yoy: 12.4, customers: 182 },
  { year: '2023', amount: 194800, yoy: 15.6, customers: 211 },
  { year: '2024', amount: annualTotal('2024'), yoy: 20.9, customers: 246 },
  { year: '2025', amount: annualTotal('2025'), yoy: 21.0, customers: 278 },
  {
    year: '2026',
    amount: annualTotal('2026'),
    yoy: percentageChange(annualTotal('2026'), annualTotal('2025')),
    customers: 301,
  },
];

const createBusinessBreakdown = (total: number, offset: number): BusinessAmount[] => {
  const labels = ['软件评测', '失效分析', '计量校准', '认证评估', '环境试验'];
  const weights = labels.map((_, index) => 27 + ((index * 7 + offset * 3) % 11));
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
  let allocated = 0;
  return labels.map((businessType, index) => {
    const amount = index === labels.length - 1
      ? total - allocated
      : Math.round((total * weights[index]) / weightTotal);
    allocated += amount;
    return { businessType, amount };
  });
};

const locationSeeds = [
  { city: '东莞市', province: '广东省', region: '华南', amount: 4280, customers: 16, yoy: -12.4 },
  { city: '深圳市', province: '广东省', region: '华南', amount: 8920, customers: 31, yoy: 8.2 },
  { city: '广州市', province: '广东省', region: '华南', amount: 6340, customers: 25, yoy: 4.6 },
  { city: '佛山市', province: '广东省', region: '华南', amount: 2730, customers: 11, yoy: -3.1 },
  { city: '上海市', province: '上海市', region: '华东', amount: 9860, customers: 34, yoy: 11.5 },
  { city: '苏州市', province: '江苏省', region: '华东', amount: 5420, customers: 19, yoy: 7.2 },
  { city: '杭州市', province: '浙江省', region: '华东', amount: 6780, customers: 23, yoy: 9.8 },
  { city: '北京市', province: '北京市', region: '华北', amount: 8640, customers: 30, yoy: 5.4 },
  { city: '武汉市', province: '湖北省', region: '华中', amount: 3960, customers: 14, yoy: 2.8 },
  { city: '成都市', province: '四川省', region: '西南', amount: 3280, customers: 12, yoy: -6.2 },
  { city: '西安市', province: '陕西省', region: '西北', amount: 2760, customers: 10, yoy: 1.4 },
  { city: '宁德市', province: '福建省', region: '华东', amount: 4150, customers: 8, yoy: 18.2 },
  { city: '合肥市', province: '安徽省', region: '华东', amount: 3460, customers: 13, yoy: 12.7 },
  { city: '南京市', province: '江苏省', region: '华东', amount: 5120, customers: 18, yoy: 6.5 },
  { city: '青岛市', province: '山东省', region: '华东', amount: 6980, customers: 21, yoy: 3.9 },
] as const;

export const LOCATION_AMOUNTS: LocationAmountRecord[] = locationSeeds.map((record, index) => ({
  id: `location-${String(index + 1).padStart(2, '0')}`,
  ...record,
  businessBreakdown: createBusinessBreakdown(record.amount, index),
}));

const eastDrivers: DeclineDriver[] = [
  { businessType: '软件评测', declineAmount: 4120, contributionRate: 43.0 },
  { businessType: '认证评估', declineAmount: 2260, contributionRate: 23.6 },
  { businessType: '环境试验', declineAmount: 1840, contributionRate: 19.2 },
];

const createDeclineRecord = (
  subjectType: DeclineAttributionRecord['subjectType'],
  subject: string,
  previousAmount: number,
  currentAmount: number,
  drivers: DeclineDriver[],
): DeclineAttributionRecord => {
  const declineAmount = previousAmount - currentAmount;
  const declineRate = Number(((declineAmount / previousAmount) * 100).toFixed(1));
  const topDriver = drivers[0];
  return {
    subjectType,
    subject,
    previousAmount,
    currentAmount,
    declineAmount,
    declineRate,
    drivers,
    conclusion: `${subject}合作金额同比下降${declineRate.toFixed(1)}%，减少${declineAmount.toLocaleString('zh-CN')}万元，主要来自${topDriver.businessType}业务，减少${topDriver.declineAmount.toLocaleString('zh-CN')}万元，占全部降幅的${topDriver.contributionRate.toFixed(1)}%。`,
  };
};

export const DECLINE_ATTRIBUTIONS: DeclineAttributionRecord[] = [
  createDeclineRecord('region', '华东区域', 22800, 13224, eastDrivers),
  createDeclineRecord('region', '华南区域', 18600, 17335, [
    { businessType: '失效分析', declineAmount: 590, contributionRate: 46.7 },
    { businessType: '计量校准', declineAmount: 380, contributionRate: 30.0 },
    { businessType: '环境试验', declineAmount: 295, contributionRate: 23.3 },
  ]),
  createDeclineRecord('region', '华北区域', 16728, 14652, [
    { businessType: '认证评估', declineAmount: 910, contributionRate: 43.8 },
    { businessType: '软件评测', declineAmount: 650, contributionRate: 31.3 },
    { businessType: '计量校准', declineAmount: 516, contributionRate: 24.9 },
  ]),
  createDeclineRecord('region', '华中区域', 7794, 7420, [
    { businessType: '环境试验', declineAmount: 174, contributionRate: 46.5 },
    { businessType: '软件评测', declineAmount: 120, contributionRate: 32.1 },
    { businessType: '认证评估', declineAmount: 80, contributionRate: 21.4 },
  ]),
  createDeclineRecord('region', '西南区域', 6487, 5890, [
    { businessType: '失效分析', declineAmount: 278, contributionRate: 46.6 },
    { businessType: '环境试验', declineAmount: 190, contributionRate: 31.9 },
    { businessType: '计量校准', declineAmount: 129, contributionRate: 21.5 },
  ]),
  createDeclineRecord('region', '西北区域', 4274, 4120, [
    { businessType: '软件评测', declineAmount: 70, contributionRate: 45.5 },
    { businessType: '认证评估', declineAmount: 50, contributionRate: 32.5 },
    { businessType: '计量校准', declineAmount: 34, contributionRate: 22.0 },
  ]),
  createDeclineRecord('customer', '腾讯', 6320, 5157, [
    { businessType: '软件评测', declineAmount: 620, contributionRate: 53.3 },
    { businessType: '认证评估', declineAmount: 323, contributionRate: 27.8 },
    { businessType: '环境试验', declineAmount: 220, contributionRate: 18.9 },
  ]),
  createDeclineRecord('customer', '比亚迪', 6100, 5417, [
    { businessType: '环境试验', declineAmount: 330, contributionRate: 48.3 },
    { businessType: '计量校准', declineAmount: 210, contributionRate: 30.7 },
    { businessType: '失效分析', declineAmount: 143, contributionRate: 21.0 },
  ]),
  createDeclineRecord('customer', '华为', 12630, 11771, [
    { businessType: '失效分析', declineAmount: 420, contributionRate: 48.9 },
    { businessType: '环境试验', declineAmount: 260, contributionRate: 30.3 },
    { businessType: '计量校准', declineAmount: 179, contributionRate: 20.8 },
  ]),
];

const CHURN_CITIES = [
  { city: '东莞市', region: '华南' },
  { city: '深圳市', region: '华南' },
  { city: '广州市', region: '华南' },
  { city: '佛山市', region: '华南' },
  { city: '上海市', region: '华东' },
  { city: '苏州市', region: '华东' },
  { city: '杭州市', region: '华东' },
  { city: '北京市', region: '华北' },
  { city: '武汉市', region: '华中' },
  { city: '成都市', region: '西南' },
] as const;
const CHURN_PREFIXES = ['启明', '鸿达', '华芯', '智联', '恒创', '远航', '博瑞', '联盛', '新域', '中科'] as const;
const CHURN_INDUSTRIES = ['精密电子', '智能装备', '软件科技', '新能源', '医疗器械'] as const;
const CHURN_DAYS = [35, 52, 68, 84, 105, 128, 165, 210, 245, 280] as const;
const CHURN_OWNERS = ['张工', '李经理', '王主任', '赵顾问', '陈主管'] as const;

const getConsumptionBucket = (days: number): string => {
  if (days <= 60) return '31–60天';
  if (days <= 90) return '61–90天';
  if (days <= 180) return '91–180天';
  return '181天以上';
};

const createChurnWarnings = (): ChurnWarningRecord[] =>
  Array.from({ length: 100 }, (_, index) => {
    const city = CHURN_CITIES[index % CHURN_CITIES.length];
    const prefix = CHURN_PREFIXES[Math.floor(index / CHURN_CITIES.length) % CHURN_PREFIXES.length];
    const industry = CHURN_INDUSTRIES[index % CHURN_INDUSTRIES.length];
    const riskScore = Number((98 - index * 0.55).toFixed(1));
    const recentConsumptionDays = CHURN_DAYS[index % CHURN_DAYS.length];
    const riskLevel: RiskLevel = riskScore >= 80 ? '高风险' : riskScore >= 60 ? '中风险' : '低风险';
    const customerLevel: CustomerLevel = index % 3 === 0
      ? '战略客户'
      : index % 3 === 1
        ? '重点客户'
        : '普通客户';

    return {
      id: `churn-${String(index + 1).padStart(3, '0')}`,
      rank: index + 1,
      customerName: `${city.city.replace('市', '')}${prefix}${industry}有限公司`,
      customerLevel,
      riskLevel,
      riskScore,
      region: city.region,
      city: city.city,
      industry,
      recentConsumptionDays,
      consumptionInterval: getConsumptionBucket(recentConsumptionDays),
      lastAmount: 80 + ((index * 73) % 920),
      owner: CHURN_OWNERS[index % CHURN_OWNERS.length],
    };
  });

export const CHURN_WARNINGS: ChurnWarningRecord[] = createChurnWarnings();

const summarize = <T extends string>(records: ChurnWarningRecord[], values: readonly T[], pick: (record: ChurnWarningRecord) => T) =>
  Object.fromEntries(values.map(value => [value, records.filter(record => pick(record) === value).length])) as Record<T, number>;

const monthlyResult = (query: string): BusinessInsightQueryResult => {
  const yearMatch = query.match(/20\d{2}/);
  const availableYears = Object.keys(MONTHLY_VALUES);
  const year = yearMatch?.[0] && availableYears.includes(yearMatch[0])
    ? yearMatch[0]
    : '2026';
  const rows = MONTHLY_AMOUNTS.filter(record => record.year === year);
  const totalAmount = rows.reduce((sum, record) => sum + record.amount, 0);
  return {
    kind: 'monthly',
    year,
    rows,
    totalAmount,
    averageAmount: Math.round(totalAmount / Math.max(rows.length, 1)),
  };
};

const annualResult = (): BusinessInsightQueryResult => ({
  kind: 'annual',
  rows: ANNUAL_AMOUNTS,
  totalAmount: ANNUAL_AMOUNTS.reduce((sum, record) => sum + record.amount, 0),
  latestGrowth: ANNUAL_AMOUNTS[ANNUAL_AMOUNTS.length - 1].yoy,
});

const locationResult = (query: string): BusinessInsightQueryResult => {
  const exactCity = LOCATION_AMOUNTS.find(record => query.includes(record.city));
  let rows: LocationAmountRecord[];
  let scopeLabel: string;

  if (exactCity) {
    rows = [exactCity];
    scopeLabel = `${exactCity.province}${exactCity.city}`;
  } else {
    const province = Array.from(new Set(LOCATION_AMOUNTS.map(record => record.province)))
      .find(value => query.includes(value));
    const region = ['华东', '华南', '华北', '华中', '西南', '西北']
      .find(value => query.includes(value));
    if (province) {
      rows = LOCATION_AMOUNTS.filter(record => record.province === province);
      scopeLabel = province;
    } else if (region) {
      rows = LOCATION_AMOUNTS.filter(record => record.region === region);
      scopeLabel = `${region}区域`;
    } else {
      rows = LOCATION_AMOUNTS;
      scopeLabel = '重点地区';
    }
  }

  rows = [...rows].sort((left, right) => right.amount - left.amount);
  const businessMap = new Map<string, number>();
  rows.forEach(record => {
    record.businessBreakdown.forEach(item => {
      businessMap.set(item.businessType, (businessMap.get(item.businessType) ?? 0) + item.amount);
    });
  });
  const businessBreakdown = Array.from(businessMap.entries())
    .map(([businessType, amount]) => ({ businessType, amount }))
    .sort((left, right) => right.amount - left.amount);

  return {
    kind: 'region',
    scopeLabel,
    rows,
    totalAmount: rows.reduce((sum, record) => sum + record.amount, 0),
    totalCustomers: rows.reduce((sum, record) => sum + record.customers, 0),
    businessBreakdown,
  };
};

const declineResult = (query: string): BusinessInsightQueryResult => {
  const regionMatch = DECLINE_ATTRIBUTIONS.find(record =>
    record.subjectType === 'region'
    && query.includes(record.subject.replace('区域', ''))
  );
  const customerMatch = DECLINE_ATTRIBUTIONS.find(record =>
    record.subjectType === 'customer'
    && query.includes(record.subject)
  );
  const record = customerMatch ?? regionMatch
    ?? DECLINE_ATTRIBUTIONS.find(item => item.subject === '华东区域')!;
  return { kind: 'decline', record };
};

const churnResult = (): BusinessInsightQueryResult => {
  const intervalLabels = ['31–60天', '61–90天', '91–180天', '181天以上'] as const;
  const highRisk = CHURN_WARNINGS.filter(record => record.riskLevel === '高风险').length;
  return {
    kind: 'churn',
    top100: CHURN_WARNINGS,
    riskDistribution: summarize(CHURN_WARNINGS, ['高风险', '中风险', '低风险'] as const, record => record.riskLevel),
    customerLevelDistribution: summarize(CHURN_WARNINGS, ['战略客户', '重点客户', '普通客户'] as const, record => record.customerLevel),
    intervalDistribution: summarize(CHURN_WARNINGS, intervalLabels, record => record.consumptionInterval as typeof intervalLabels[number]),
    conclusion: `最近三个月识别流失预警客户100家，其中高风险${highRisk}家。风险最高客户最近消费间隔${CHURN_WARNINGS[0].recentConsumptionDays}天，建议优先安排客户回访和业务复盘。`,
  };
};

export function answerBusinessInsightQuery(query: string): BusinessInsightQueryResult | null {
  if (/流失预警|预警客户|客户流失/.test(query)) return churnResult();
  if (/下降|下滑|减少|归因/.test(query)) return declineResult(query);
  if (/月度|每月|按月/.test(query) && /金额|合作额/.test(query)) return monthlyResult(query);
  if (/年度|每年|按年/.test(query) && /金额|合作额/.test(query)) return annualResult();
  if (
    /地区|区域|城市|省份/.test(query)
    || LOCATION_AMOUNTS.some(record => query.includes(record.city) || query.includes(record.province))
  ) {
    if (/金额|合作额/.test(query)) return locationResult(query);
  }
  return null;
}
