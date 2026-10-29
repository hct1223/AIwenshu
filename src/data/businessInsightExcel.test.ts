import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CHURN_EXPORT_HEADERS,
  buildChurnExportMatrix,
} from './businessInsightExcel.ts';
import { CHURN_WARNINGS } from './businessInsightMock.ts';

test('exports all 100 churn warnings in rank order', () => {
  const matrix = buildChurnExportMatrix(CHURN_WARNINGS);

  assert.deepEqual(matrix[0], [...CHURN_EXPORT_HEADERS]);
  assert.equal(matrix.length, 101);
  assert.equal(matrix[1][0], 1);
  assert.equal(matrix[100][0], 100);
  assert.equal(matrix[100][1], CHURN_WARNINGS[99].customerName);
});
