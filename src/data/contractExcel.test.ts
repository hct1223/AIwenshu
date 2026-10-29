import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONTRACT_EXPORT_HEADERS,
  buildContractExportMatrix,
  mergeImportPreview,
  parseContractRows,
} from './contractExcel.ts';
import type { ContractRecord } from '../types/contract.ts';

const existing: ContractRecord[] = [{
  id: 'existing',
  departmentContractNo: 'SB2026-001',
  contractName: '已有合同',
  customerName: '已有客户',
  department: '元器件检测所',
  businessType: '失效分析',
  amount: 100,
  contactName: '联系人',
  contactPhone: '020-11112222',
  submittedAt: '2026-10-01',
  createdAt: '2026-10-01T00:00:00.000Z',
  updatedAt: '2026-10-01T00:00:00.000Z',
  source: 'manual',
}];

test('maps Excel rows and preserves phone values as text', () => {
  const rows = [[
    ' SB2026-002 ',
    '新增合同',
    '新增客户',
    '软件评测中心',
    '软件评测',
    '1,200.50',
    '张三',
    '020-12345678',
    new Date(2026, 9, 28),
  ]];
  const preview = parseContractRows([...CONTRACT_EXPORT_HEADERS], rows, existing);

  assert.equal(preview.rows[0].status, 'valid');
  assert.equal(preview.rows[0].input.departmentContractNo, 'SB2026-002');
  assert.equal(preview.rows[0].input.amount, 1200.5);
  assert.equal(preview.rows[0].input.contactPhone, '020-12345678');
  assert.equal(preview.rows[0].input.submittedAt, '2026-10-28');
});

test('marks duplicate contract numbers', () => {
  const rows = [[
    'sb2026-001',
    '重复合同',
    '客户',
    '部门',
    '检验检测',
    100,
    '联系人',
    '020-12345678',
    '2026-10-28',
  ]];
  const preview = parseContractRows([...CONTRACT_EXPORT_HEADERS], rows, existing);

  assert.equal(preview.rows[0].status, 'duplicate');
  assert.equal(preview.duplicateCount, 1);
});

test('reports missing required headers', () => {
  const preview = parseContractRows(['部门合同号', '合同名称'], [], existing);

  assert.ok(preview.missingHeaders.includes('客户单位名称'));
  assert.equal(preview.rows.length, 0);
});

test('exports the exact nine fields in source order', () => {
  const matrix = buildContractExportMatrix(existing);

  assert.deepEqual(matrix[0], [...CONTRACT_EXPORT_HEADERS]);
  assert.equal(matrix[1][0], 'SB2026-001');
  assert.equal(matrix[1][5], 100);
  assert.equal(matrix[1][7], '020-11112222');
});

test('adds valid rows and skips duplicates by default', () => {
  const preview = parseContractRows([...CONTRACT_EXPORT_HEADERS], [
    ['SB2026-002', '新增合同', '新增客户', '部门', '检验检测', 200, '联系人', '020-12345678', '2026-10-28'],
    ['SB2026-001', '重复合同', '已有客户', '部门', '检验检测', 300, '联系人', '020-12345678', '2026-10-28'],
  ], existing);

  const result = mergeImportPreview(existing, preview, false);
  assert.equal(result.added, 1);
  assert.equal(result.updated, 0);
  assert.equal(result.skipped, 1);
  assert.equal(result.records.length, 2);
});

test('overwrites duplicates when explicitly enabled', () => {
  const preview = parseContractRows([...CONTRACT_EXPORT_HEADERS], [
    ['sb2026-001', '已更新合同', '更新客户', '更新部门', '软件评测', 900, '新联系人', '020-99998888', '2026-10-29'],
  ], existing);

  const result = mergeImportPreview(existing, preview, true);
  assert.equal(result.added, 0);
  assert.equal(result.updated, 1);
  assert.equal(result.records[0].contractName, '已更新合同');
  assert.equal(result.records[0].amount, 900);
  assert.equal(result.records[0].id, 'existing');
});
