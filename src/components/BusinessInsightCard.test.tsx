import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import BusinessInsightCard from './BusinessInsightCard.tsx';
import {
  ANNUAL_AMOUNTS,
  answerBusinessInsightQuery,
} from '../data/businessInsightMock.ts';

test('renders annual amount scenario', () => {
  const html = renderToStaticMarkup(
    <BusinessInsightCard
      result={{
        kind: 'annual',
        rows: ANNUAL_AMOUNTS,
        totalAmount: ANNUAL_AMOUNTS.reduce((sum, row) => sum + row.amount, 0),
        latestGrowth: ANNUAL_AMOUNTS[ANNUAL_AMOUNTS.length - 1].yoy,
      }}
    />
  );

  assert.match(html, /年度合作金额/);
  assert.match(html, /2026/);
});

test('renders decline attribution conclusion', () => {
  const result = answerBusinessInsightQuery('华东客户下降归因');
  assert.ok(result);
  const html = renderToStaticMarkup(<BusinessInsightCard result={result} />);

  assert.match(html, /下降归因/);
  assert.match(html, /42.0%/);
  assert.match(html, /软件评测/);
});

test('renders churn distributions, Top10, and export action', () => {
  const result = answerBusinessInsightQuery('最近三个月流失预警 Top100');
  assert.ok(result);
  const html = renderToStaticMarkup(<BusinessInsightCard result={result} />);

  assert.match(html, /风险等级分布/);
  assert.match(html, /客户等级分布/);
  assert.match(html, /最近消费间隔分布/);
  assert.match(html, /Top10/);
  assert.match(html, /导出 Top100/);
});
