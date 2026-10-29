import type { ContractRecord } from '../types/contract.ts';

export type ContractQueryMode =
  | 'summary'
  | 'recent'
  | 'customer'
  | 'department'
  | 'business-type'
  | 'contract-number'
  | 'search'
  | 'department-summary'
  | 'business-type-summary';

export interface ContractQueryGroup {
  label: string;
  count: number;
  amount: number;
}

export interface ContractQueryResult {
  query: string;
  mode: ContractQueryMode;
  records: ContractRecord[];
  totalCount: number;
  totalAmount: number;
  groups?: ContractQueryGroup[];
}

const CONTRACT_KEYWORDS = ['合同', '合约', '协议', '签约', 'contract'];
const SUMMARY_KEYWORDS = ['总数', '多少', '总额', '总金额', '合计', '汇总', '金额'];

export const isContractManagementQuery = (query: string): boolean =>
  CONTRACT_KEYWORDS.some(keyword => query.toLowerCase().includes(keyword));

const uniqueCustomerAliases = (records: ContractRecord[]): Map<string, string> => {
  const aliases = new Map<string, string>();
  records.forEach(record => {
    const name = record.customerName;
    const beforeParenthesis = name.split(/[（(]/)[0];
    const stripped = beforeParenthesis
      .replace(/有限责任公司$/, '')
      .replace(/股份有限公司$/, '')
      .replace(/有限公司$/, '')
      .replace(/集团$/, '')
      .replace(/科技$/, '');
    [name, beforeParenthesis, stripped, beforeParenthesis.slice(0, 2)]
      .filter(alias => alias.length >= 2)
      .forEach(alias => aliases.set(alias, name));
  });
  return aliases;
};

const summarizeGroups = (
  records: ContractRecord[],
  field: 'department' | 'businessType'
): ContractQueryGroup[] => {
  const grouped = new Map<string, { count: number; amount: number }>();
  records.forEach(record => {
    const label = record[field] || '未分类';
    const current = grouped.get(label) ?? { count: 0, amount: 0 };
    grouped.set(label, {
      count: current.count + 1,
      amount: current.amount + record.amount,
    });
  });

  return Array.from(grouped.entries())
    .map(([label, summary]) => ({ label, ...summary }))
    .sort((left, right) => right.amount - left.amount);
};

export function answerContractQuery(
  query: string,
  records: ContractRecord[],
): ContractQueryResult | null {
  if (!isContractManagementQuery(query)) return null;

  const makeResult = (
    mode: ContractQueryMode,
    matchedRecords: ContractRecord[],
    groups?: ContractQueryGroup[],
  ): ContractQueryResult => ({
    query,
    mode,
    records: matchedRecords,
    totalCount: matchedRecords.length,
    totalAmount: matchedRecords.reduce((sum, record) => sum + record.amount, 0),
    groups,
  });

  if (/按部门|部门汇总|各部门/.test(query)) {
    return makeResult('department-summary', records, summarizeGroups(records, 'department'));
  }
  if (/按业务(?:类型)?|业务类型汇总|各业务类型/.test(query)) {
    return makeResult('business-type-summary', records, summarizeGroups(records, 'businessType'));
  }

  const numberMatch = query.match(/(?:部门合同号|合同编号|合同号)\s*[:：]?\s*([A-Za-z0-9_-]+)/i);
  if (numberMatch) {
    const contractNumber = numberMatch[1].toUpperCase();
    return makeResult(
      'contract-number',
      records.filter(record => record.departmentContractNo.toUpperCase() === contractNumber),
    );
  }

  if (/最近|最新/.test(query)) {
    const recent = [...records]
      .sort((left, right) => right.submittedAt.localeCompare(left.submittedAt))
      .slice(0, 5);
    return makeResult('recent', recent);
  }

  const customerAliases = uniqueCustomerAliases(records);
  const customerMatches = Array.from(customerAliases.entries())
    .filter(([alias]) => query.includes(alias))
    .sort((left, right) => right[0].length - left[0].length);
  if (customerMatches.length > 0) {
    const customerName = customerMatches[0][1];
    return makeResult(
      'customer',
      records.filter(record => record.customerName === customerName),
    );
  }

  const department = Array.from(new Set(records.map(record => record.department)))
    .sort((left, right) => right.length - left.length)
    .find(value => value && query.includes(value));
  if (department) {
    return makeResult(
      'department',
      records.filter(record => record.department === department),
    );
  }

  const businessType = Array.from(new Set(records.map(record => record.businessType)))
    .sort((left, right) => right.length - left.length)
    .find(value => value && query.includes(value));
  if (businessType) {
    return makeResult(
      'business-type',
      records.filter(record => record.businessType === businessType),
    );
  }

  if (SUMMARY_KEYWORDS.some(keyword => query.includes(keyword))) {
    return makeResult('summary', records);
  }

  const searchText = query
    .replace(/请问|帮我|查询|查找|看看|有哪些|哪些|相关|所有|的|吗|呢/g, '')
    .replace(new RegExp(CONTRACT_KEYWORDS.join('|'), 'gi'), '')
    .trim();
  if (searchText) {
    return makeResult(
      'search',
      records.filter(record =>
        [
          record.departmentContractNo,
          record.contractName,
          record.customerName,
          record.department,
          record.businessType,
          record.contactName,
        ].join(' ').includes(searchText)
      ),
    );
  }

  return makeResult('summary', records);
}
