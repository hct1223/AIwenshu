import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSeedContracts } from './contractData.ts';
import {
  answerContractQuery,
  isContractManagementQuery,
} from './contractQuery.ts';

const records = buildSeedContracts();

test('recognizes contract-related questions', () => {
  assert.equal(isContractManagementQuery('帮我查询最近的合同'), true);
  assert.equal(isContractManagementQuery('软件评测中心有哪些合约'), true);
  assert.equal(isContractManagementQuery('本月经营概况'), false);
});

test('summarizes all contracts and total amount', () => {
  const result = answerContractQuery('合同一共有多少份，总金额是多少', records);
  assert.ok(result);
  assert.equal(result.mode, 'summary');
  assert.equal(result.totalCount, records.length);
  assert.equal(result.totalAmount, records.reduce((sum, record) => sum + record.amount, 0));
});

test('filters contracts by customer alias', () => {
  const result = answerContractQuery('腾讯有哪些合同', records);
  assert.ok(result);
  assert.ok(result.records.length > 0);
  assert.ok(result.records.every(record => record.customerName.includes('腾讯')));
});

test('filters contracts by department and exact contract number', () => {
  const departmentResult = answerContractQuery('软件评测中心有哪些合同', records);
  assert.ok(departmentResult);
  assert.ok(departmentResult.records.length > 0);
  assert.ok(departmentResult.records.every(record => record.department === '软件评测中心'));

  const numberResult = answerContractQuery('合同编号 SB2024HW0891', records);
  assert.ok(numberResult);
  assert.equal(numberResult.records[0].departmentContractNo, 'SB2024HW0891');
});

test('summarizes contract amount by department', () => {
  const result = answerContractQuery('按部门汇总合同金额', records);
  assert.ok(result);
  assert.equal(result.mode, 'department-summary');
  assert.ok(result.groups && result.groups.length > 0);
  assert.equal(
    result.groups?.reduce((sum, group) => sum + group.amount, 0),
    records.reduce((sum, record) => sum + record.amount, 0),
  );
});

test('returns recent contracts in descending date order', () => {
  const result = answerContractQuery('最近有哪些合同', records);
  assert.ok(result);
  assert.equal(result.mode, 'recent');
  assert.ok(result.records.length <= 5);
  assert.deepEqual(
    result.records.map(record => record.submittedAt),
    [...result.records].sort((left, right) => right.submittedAt.localeCompare(left.submittedAt)).map(record => record.submittedAt),
  );
});
