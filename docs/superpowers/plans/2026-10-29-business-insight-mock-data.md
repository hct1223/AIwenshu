# Business Insight Mock Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add deterministic AI-queryable mock data for monthly amounts, annual amounts, regional amounts, decline attribution, and a Top100 churn warning list.

**Architecture:** Add one pure data/query module as the source of truth, one structured result card, and one Excel export helper. Integrate a new intent branch into `AIChatSidebar` before legacy statistics and directional analysis.

**Tech Stack:** React 19, TypeScript, Node test runner through `tsx`, `write-excel-file/browser`.

---

### Task 1: Write failing business insight tests

**Files:**
- Create: `src/data/businessInsightMock.test.ts`
- Create: `src/data/businessInsightMock.ts`

- [x] **Step 1: Add tests for recognition, totals, location filtering, attribution, determinism, churn distributions, and Top100 ordering**

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ANNUAL_AMOUNTS,
  MONTHLY_AMOUNTS,
  answerBusinessInsightQuery,
} from './businessInsightMock.ts';

test('annual totals reconcile with monthly data', () => {
  for (const year of ['2024', '2025', '2026']) {
    const annual = ANNUAL_AMOUNTS.find(record => record.year === year);
    const monthlyTotal = MONTHLY_AMOUNTS
      .filter(record => record.year === year)
      .reduce((sum, record) => sum + record.amount, 0);
    assert.equal(annual?.amount, monthlyTotal);
  }
});

test('answers monthly and annual amount questions', () => {
  const monthly = answerBusinessInsightQuery('2026年月度合作金额列表');
  const annual = answerBusinessInsightQuery('年度合作金额列表');
  assert.equal(monthly?.kind, 'monthly');
  assert.equal(annual?.kind, 'annual');
});

test('answers Dongguan location amount question', () => {
  const result = answerBusinessInsightQuery('广东省东莞市合作金额列表');
  assert.equal(result?.kind, 'region');
  if (result?.kind === 'region') {
    assert.match(result.scopeLabel, /东莞市/);
    assert.ok(result.rows.every(row => row.city === '东莞市'));
  }
});

test('answers East China decline attribution with 42 percent conclusion', () => {
  const result = answerBusinessInsightQuery('华东客户下降归因');
  assert.equal(result?.kind, 'decline');
  if (result?.kind === 'decline') {
    assert.equal(result.record.subject, '华东区域');
    assert.equal(result.record.declineRate, 42);
    assert.match(result.record.conclusion, /软件评测/);
  }
});

test('returns deterministic Top100 churn warnings and distributions', () => {
  const first = answerBusinessInsightQuery('最近三个月流失预警客户分布，列Top100名单');
  const second = answerBusinessInsightQuery('最近三个月流失预警客户分布，列Top100名单');
  assert.deepEqual(first, second);
  if (first?.kind === 'churn') {
    assert.equal(first.top100.length, 100);
    assert.equal(new Set(first.top100.map(record => record.id)).size, 100);
    assert.deepEqual(
      first.top100.map(record => record.riskScore),
      [...first.top100].sort((left, right) => right.riskScore - left.riskScore).map(record => record.riskScore),
    );
    assert.equal(
      Object.values(first.riskDistribution).reduce((sum, value) => sum + value, 0),
      100,
    );
  }
});
```

- [x] **Step 2: Run tests and confirm the module is missing**

```bash
npx tsx --test src/data/businessInsightMock.test.ts
```

Expected: FAIL with module-not-found for `businessInsightMock.ts`.

### Task 2: Implement fixed data and query parsing

**Files:**
- Create: `src/data/businessInsightMock.ts`
- Test: `src/data/businessInsightMock.test.ts`

- [x] **Step 1: Add monthly data with 2026 YTD total of 303,100 万元**

```ts
const MONTHLY_VALUES = {
  '2024': [16200, 15100, 17400, 16800, 18600, 20100, 19400, 21600, 20800, 22500, 23100, 23900],
  '2025': [19800, 17600, 21400, 20700, 23100, 24500, 23900, 25600, 24800, 26400, 27100, 30100],
  '2026': [24800, 22100, 28500, 27600, 31200, 33800, 32600, 34500, 33200, 34800],
} as const;
```

Compute month-over-month from the preceding value, with January using the prior December for the available comparison.

- [x] **Step 2: Derive annual records and preserve the previous-year constants**

```ts
const PRIOR_ANNUAL = [
  { year: '2022', amount: 168500, customers: 182 },
  { year: '2023', amount: 194800, customers: 211 },
];
```

For 2024–2026, annual amount equals the sum of that year's `MONTHLY_AMOUNTS`.

- [x] **Step 3: Add 15 location records**

```ts
export const LOCATION_AMOUNTS = [
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
];
```

Each city receives a fixed business breakdown across software testing, failure analysis, calibration, certification, and environment testing that sums to the city amount.

- [x] **Step 4: Add decline attribution records**

Add regional records for 华东、华南、华北、华中、西南、西北 and customer records for 腾讯、比亚迪、华为. The 华东 record is:

```ts
{
  subjectType: 'region',
  subject: '华东区域',
  previousAmount: 22800,
  currentAmount: 13224,
  declineAmount: 9576,
  declineRate: 42,
  drivers: [
    { businessType: '软件评测', declineAmount: 4120, contributionRate: 43 },
    { businessType: '认证评估', declineAmount: 2260, contributionRate: 23.6 },
    { businessType: '环境试验', declineAmount: 1840, contributionRate: 19.2 },
  ],
  conclusion: '华东区域合作金额同比下降42.0%，减少9,576万元，主要来自软件评测业务，减少4,120万元，占全部降幅的43.0%。',
}
```

- [x] **Step 5: Generate deterministic churn records**

Generate exactly 100 records from fixed city and brand arrays. Assign:

- Risk score descending from 98 in fixed decrements.
- Risk levels: score ≥ 80 `高风险`, score ≥ 60 `中风险`, otherwise `低风险`.
- Customer levels cycle through `战略客户`、`重点客户`、`普通客户`.
- Consumption intervals cycle through `31–60天`、`61–90天`、`91–180天`、`181天以上`.

- [x] **Step 6: Implement `answerBusinessInsightQuery`**

Use this intent order:

```ts
if (/流失预警|预警客户|客户流失/.test(query)) return churnResult();
if (/下降|下滑|减少|归因/.test(query)) return declineResult(query);
if (/月度|每月|按月/.test(query) && /金额|合作额/.test(query)) return monthlyResult(query);
if (/年度|每年|按年/.test(query) && /金额|合作额/.test(query)) return annualResult(query);
if (/地区|区域|城市|省份/.test(query)) return locationResult(query);
return null;
```

- [x] **Step 7: Run tests and confirm all business insight tests pass**

```bash
npx tsx --test src/data/businessInsightMock.test.ts
```

Expected: PASS.

### Task 3: Add Top100 Excel export

**Files:**
- Create: `src/data/businessInsightExcel.ts`

- [x] **Step 1: Add the fixed export matrix builder**

```ts
export const CHURN_EXPORT_HEADERS = [
  '排名', '客户名称', '客户等级', '风险等级', '风险评分',
  '地区', '行业', '最近消费间隔（天）', '最近合作金额（万元）', '负责人',
] as const;

export function buildChurnExportMatrix(records: ChurnWarningRecord[]) {
  return [
    [...CHURN_EXPORT_HEADERS],
    ...records.map(record => [
      record.rank, record.customerName, record.customerLevel, record.riskLevel,
      record.riskScore, record.region, record.industry,
      record.recentConsumptionDays, record.lastAmount, record.owner,
    ]),
  ];
}
```

- [x] **Step 2: Add browser download**

```ts
export async function exportChurnTop100(records: ChurnWarningRecord[]) {
  const { default: writeExcelFile } = await import('write-excel-file/browser');
  await writeExcelFile(buildChurnExportMatrix(records)).toFile('流失预警客户Top100.xlsx');
}
```

### Task 4: Add structured AI result card

**Files:**
- Create: `src/components/BusinessInsightCard.tsx`

- [x] **Step 1: Render monthly, annual, and region results**

Use compact bars with labels, amounts, YoY/MoM values, totals, and a source note.

- [x] **Step 2: Render decline attribution**

Show previous amount, current amount, decline amount, decline rate, driver bars, and the final conclusion.

- [x] **Step 3: Render churn distributions and Top10**

Show three distribution blocks for risk level, customer level, and consumption interval. Render Top10 rows with rank, customer, level, risk score, interval, and amount. Add an “导出 Top100” button that calls `exportChurnTop100`.

### Task 5: Integrate the new card into AI chat

**Files:**
- Modify: `src/components/AIChatSidebar.tsx`
- Modify: `src/data/mockAnalysis.ts`

- [x] **Step 1: Add message type and result field**

```ts
type?: ... | 'business-insight';
businessInsight?: BusinessInsightQueryResult;
```

- [x] **Step 2: Insert the business insight branch**

Call `answerBusinessInsightQuery` after contract Q&A and before directional/statistical handling. Attach the structured result to a `BusinessInsightCard`.

- [x] **Step 3: Add quick prompts**

Add three visible quick questions:

- `2026年月度合作金额列表`
- `华东客户下降归因`
- `最近三个月流失预警 Top100`

- [x] **Step 4: Mark results as mock-derived**

Add `business-insight` to `MOCK_DERIVED_TYPES`.

### Task 6: Verify and commit

**Files:**
- Verify: all new and modified files

- [x] **Step 1: Run automated tests**

```bash
npx tsx --test src/data/businessInsightMock.test.ts
npm run test:contracts
```

Expected: PASS.

- [x] **Step 2: Run build and targeted type check**

```bash
npm run build
npx tsc --noEmit 2>&1 | rg "businessInsight|BusinessInsight|AIChatSidebar"
```

Expected: build passes; no new TypeScript errors from this feature.

- [x] **Step 3: Verify all five prompts in the browser**

Confirm monthly, annual, Dongguan, East China attribution, and churn distribution results. Confirm Top10 is visible and Top100 export triggers.

- [x] **Step 4: Commit**

```bash
git add src/data/businessInsightMock.ts src/data/businessInsightMock.test.ts src/data/businessInsightExcel.ts src/components/BusinessInsightCard.tsx src/components/AIChatSidebar.tsx src/data/mockAnalysis.ts docs/superpowers/plans/2026-10-29-business-insight-mock-data.md
git commit -m "feat: 增加业务洞察模拟数据问答"
```
