import type { ContractFilters, ContractInput, ContractRecord } from '../types/contract.ts';
import { COMP_MOCK_LIST } from './mockData.ts';

const BUSINESS_TYPE_RULES = [
  { keywords: ['软件', '算法', '代码', '系统', '数字化'], value: '软件评测' },
  { keywords: ['失效', '芯片', '元器件', '半导体', '晶圆'], value: '失效分析' },
  { keywords: ['计量', '校准', '标定'], value: '计量校准' },
  { keywords: ['认证', '安全', '合规'], value: '认证评估' },
  { keywords: ['环境', '可靠性', '试验', '测试'], value: '环境试验' },
];

export const inferBusinessType = (contractName: string): string => {
  const matched = BUSINESS_TYPE_RULES.find(rule =>
    rule.keywords.some(keyword => contractName.includes(keyword))
  );
  return matched?.value ?? '检验检测';
};

export const normalizeContractNumber = (value: string): string =>
  value.trim().toUpperCase();

const isValidDateOnly = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return false;
  return date.getFullYear() === Number(value.slice(0, 4))
    && date.getMonth() + 1 === Number(value.slice(5, 7))
    && date.getDate() === Number(value.slice(8, 10));
};

export function validateContractInput(input: ContractInput): string[] {
  const errors: string[] = [];
  if (!input.departmentContractNo.trim()) errors.push('部门合同号不能为空');
  if (!input.contractName.trim()) errors.push('合同名称不能为空');
  if (!input.customerName.trim()) errors.push('客户单位名称不能为空');
  if (!input.department.trim()) errors.push('主办部门不能为空');
  if (!input.businessType.trim()) errors.push('业务类型不能为空');
  if (!Number.isFinite(input.amount) || input.amount <= 0) errors.push('合同金额必须大于 0');
  if (!isValidDateOnly(input.submittedAt)) errors.push('提交时间格式无效');
  if (input.contactPhone.trim() && !/^[0-9+\-\s()]{6,24}$/.test(input.contactPhone.trim())) {
    errors.push('联系电话格式无效');
  }
  return errors;
}

export function buildSeedContracts(): ContractRecord[] {
  return COMP_MOCK_LIST.flatMap((company, companyIndex) => {
    const sourcePhone = company.contacts[0]?.phone?.trim() ?? '';
    const contactPhone = /^[0-9+\-\s()]{6,24}$/.test(sourcePhone)
      ? sourcePhone
      : `400-100-${String(companyIndex + 1).padStart(4, '0')}`;

    return (company.cooperationContracts ?? []).map(contract => ({
      id: `seed-${company.id}-${contract.id}`,
      departmentContractNo: contract.contractNo,
      contractName: contract.name,
      customerName: company.name,
      department: contract.department,
      businessType: inferBusinessType(contract.name),
      amount: contract.amount,
      contactName: company.contacts[0]?.name ?? '演示联系人',
      contactPhone,
      submittedAt: contract.signDate,
      createdAt: `${contract.signDate}T00:00:00.000Z`,
      updatedAt: `${contract.signDate}T00:00:00.000Z`,
      source: 'seed' as const,
    }));
  });
}

export function filterContracts(
  records: ContractRecord[],
  filters: ContractFilters
): ContractRecord[] {
  const keyword = filters.keyword.trim().toLowerCase();

  return records.filter(record => {
    const searchable = [
      record.departmentContractNo,
      record.contractName,
      record.customerName,
      record.department,
      record.businessType,
      record.contactName,
      record.contactPhone,
    ].join(' ').toLowerCase();

    if (keyword && !searchable.includes(keyword)) return false;
    if (filters.department !== '全部' && record.department !== filters.department) return false;
    if (filters.businessType !== '全部' && record.businessType !== filters.businessType) return false;
    if (filters.amountRange === 'lt100' && record.amount >= 100) return false;
    if (filters.amountRange === '100to500' && (record.amount < 100 || record.amount >= 500)) return false;
    if (filters.amountRange === '500to1000' && (record.amount < 500 || record.amount >= 1000)) return false;
    if (filters.amountRange === 'gte1000' && record.amount < 1000) return false;
    if (filters.dateFrom && record.submittedAt < filters.dateFrom) return false;
    if (filters.dateTo && record.submittedAt > filters.dateTo) return false;
    return true;
  });
}

export const getUniqueContractOptions = (
  records: ContractRecord[],
  field: 'department' | 'businessType'
): string[] =>
  Array.from(new Set(records.map(record => record[field]).filter(Boolean)))
    .sort((left, right) => left.localeCompare(right, 'zh-CN'));

export const createContractRecord = (
  input: ContractInput,
  now = new Date()
): ContractRecord => {
  const timestamp = now.toISOString();
  const randomId = globalThis.crypto?.randomUUID?.() ?? `${now.getTime()}-${Math.random()}`;
  return {
    ...input,
    id: `contract-${randomId}`,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

export const updateContractRecord = (
  record: ContractRecord,
  input: ContractInput,
  now = new Date()
): ContractRecord => ({
  ...record,
  ...input,
  updatedAt: now.toISOString(),
});

export function migrateContractRecords(
  data: unknown,
  fromVersion: number
): ContractRecord[] | null {
  if (!Array.isArray(data)) return null;

  const records = data.filter((record): record is ContractRecord =>
    Boolean(record)
    && typeof record === 'object'
    && typeof (record as ContractRecord).id === 'string'
    && typeof (record as ContractRecord).departmentContractNo === 'string'
  );

  if (records.length !== data.length) return null;
  if (fromVersion >= 2) return records;

  return records.map(record => {
    const invalidPhone = record.contactPhone
      && !/^[0-9+\-\s()]{6,24}$/.test(record.contactPhone);
    return invalidPhone ? { ...record, contactPhone: '' } : record;
  });
}
