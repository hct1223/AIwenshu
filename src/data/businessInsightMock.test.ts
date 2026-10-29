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
    assert.ok(result.businessBreakdown.length > 0);
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
      [...first.top100]
        .sort((left, right) => right.riskScore - left.riskScore)
        .map(record => record.riskScore),
    );
    assert.equal(
      Object.values(first.riskDistribution).reduce((sum, value) => sum + value, 0),
      100,
    );
  }
});
