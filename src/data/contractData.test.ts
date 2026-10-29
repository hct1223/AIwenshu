import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSeedContracts,
  filterContracts,
  migrateContractRecords,
  normalizeContractNumber,
  validateContractInput,
} from './contractData.ts';
import type { ContractInput } from '../types/contract.ts';

const validInput: ContractInput = {
  departmentContractNo: 'SB2026-001',
  contractName: '设备可靠性试验合同',
  customerName: '演示客户有限公司',
  department: '可靠性试验室',
  businessType: '环境试验',
  amount: 128.5,
  contactName: '演示联系人',
  contactPhone: '020-12345678',
  submittedAt: '2026-10-28',
  source: 'manual',
};

test('normalizes contract numbers for duplicate checks', () => {
  assert.equal(normalizeContractNumber(' sb2026-001 '), 'SB2026-001');
});

test('rejects missing required fields and non-positive amount', () => {
  const errors = validateContractInput({
    ...validInput,
    contractName: '',
    amount: 0,
  });
  assert.ok(errors.includes('合同名称不能为空'));
  assert.ok(errors.includes('合同金额必须大于 0'));
});

test('filters by keyword, amount range, department, and date', () => {
  const records = buildSeedContracts();
  const filtered = filterContracts(records, {
    keyword: '元器件',
    department: '全部',
    businessType: '全部',
    amountRange: '500to1000',
    dateFrom: '2023-01-01',
    dateTo: '2025-12-31',
  });
  assert.ok(filtered.length > 0);
  assert.ok(filtered.every(record =>
    [record.contractName, record.customerName, record.department, record.businessType]
      .join(' ')
    .includes('元器件')
  ));
  assert.ok(filtered.every(record => record.amount >= 500 && record.amount < 1000));
});

test('builds complete seed contracts from existing enterprise data', () => {
  const records = buildSeedContracts();
  assert.ok(records.length > 0);
  assert.ok(records.every(record =>
    record.departmentContractNo &&
    record.contractName &&
    record.customerName &&
    record.amount > 0 &&
    /^\d{4}-\d{2}-\d{2}$/.test(record.submittedAt) &&
    (!record.contactPhone || /^[0-9+\-\s()]{6,24}$/.test(record.contactPhone))
  ));
});

test('migrates invalid seed phone values without discarding records', () => {
  const [seed] = buildSeedContracts();
  const migrated = migrateContractRecords([{ ...seed, contactPhone: '400-100-invalid' }], 1);

  assert.ok(migrated);
  assert.equal(migrated[0].contactPhone, '');
  assert.equal(migrated[0].departmentContractNo, seed.departmentContractNo);
  assert.equal(migrateContractRecords({}, 1), null);
});
