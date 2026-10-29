import type { ContractInput, ContractRecord } from '../types/contract.ts';
import {
  createContractRecord,
  normalizeContractNumber,
  updateContractRecord,
  validateContractInput,
} from './contractData.ts';

export const CONTRACT_EXPORT_HEADERS = [
  '部门合同号',
  '合同名称',
  '客户单位名称',
  '主办部门',
  '业务类型',
  '单个合同金额',
  '客户单位联系人',
  '客户单位联系电话',
  '提交时间',
] as const;

export type ContractImportStatus = 'valid' | 'duplicate' | 'error';

export interface ContractImportRow {
  rowNumber: number;
  input: ContractInput;
  status: ContractImportStatus;
  errors: string[];
}

export interface ContractImportPreview {
  headers: string[];
  rows: ContractImportRow[];
  missingHeaders: string[];
  validCount: number;
  duplicateCount: number;
  errorCount: number;
  errorMessage?: string;
}

export interface ContractImportResult {
  records: ContractRecord[];
  added: number;
  updated: number;
  skipped: number;
}

const textValue = (value: unknown): string =>
  value == null ? '' : String(value).trim();

const padDatePart = (value: number): string => String(value).padStart(2, '0');

export function normalizeExcelDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return `${value.getFullYear()}-${padDatePart(value.getMonth() + 1)}-${padDatePart(value.getDate())}`;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const date = new Date(Date.UTC(1899, 11, 30) + value * 86400000);
    return `${date.getUTCFullYear()}-${padDatePart(date.getUTCMonth() + 1)}-${padDatePart(date.getUTCDate())}`;
  }

  const text = textValue(value).replace(/\//g, '-').replace(/[年月]/g, '-').replace(/日/g, '');
  const match = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) {
    return `${match[1]}-${padDatePart(Number(match[2]))}-${padDatePart(Number(match[3]))}`;
  }
  return text;
}

export function normalizeExcelAmount(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : Number.NaN;

  const raw = textValue(value).replace(/[¥￥,\s]/g, '');
  if (!raw) return Number.NaN;

  if (raw.includes('亿')) {
    return Number(raw.replace('亿', '').replace(/元$/, '')) * 10000;
  }
  if (raw.includes('万')) {
    return Number(raw.replace('万', '').replace(/元$/, ''));
  }
  if (raw.endsWith('元')) {
    return Number(raw.slice(0, -1)) / 10000;
  }
  return Number(raw);
}

const emptyPreview = (errorMessage: string): ContractImportPreview => ({
  headers: [],
  rows: [],
  missingHeaders: [...CONTRACT_EXPORT_HEADERS],
  validCount: 0,
  duplicateCount: 0,
  errorCount: 0,
  errorMessage,
});

export function parseContractRows(
  rawHeaders: unknown[],
  rawRows: unknown[][],
  existing: ContractRecord[],
): ContractImportPreview {
  const headers = rawHeaders.map(textValue);
  const missingHeaders = CONTRACT_EXPORT_HEADERS.filter(
    header => !headers.includes(header)
  );

  if (missingHeaders.length > 0) {
    return {
      headers,
      rows: [],
      missingHeaders,
      validCount: 0,
      duplicateCount: 0,
      errorCount: 0,
    };
  }

  const headerIndexes = Object.fromEntries(
    CONTRACT_EXPORT_HEADERS.map(header => [header, headers.indexOf(header)])
  ) as Record<(typeof CONTRACT_EXPORT_HEADERS)[number], number>;
  const seenContractNumbers = new Set(
    existing.map(record => normalizeContractNumber(record.departmentContractNo))
  );

  const rows = rawRows.flatMap((row, index): ContractImportRow[] => {
    if (!row.some(cell => textValue(cell) !== '')) return [];

    const input: ContractInput = {
      departmentContractNo: textValue(row[headerIndexes['部门合同号']]),
      contractName: textValue(row[headerIndexes['合同名称']]),
      customerName: textValue(row[headerIndexes['客户单位名称']]),
      department: textValue(row[headerIndexes['主办部门']]),
      businessType: textValue(row[headerIndexes['业务类型']]),
      amount: normalizeExcelAmount(row[headerIndexes['单个合同金额']]),
      contactName: textValue(row[headerIndexes['客户单位联系人']]),
      contactPhone: textValue(row[headerIndexes['客户单位联系电话']]),
      submittedAt: normalizeExcelDate(row[headerIndexes['提交时间']]),
      source: 'import',
    };
    const errors = validateContractInput(input);
    const normalizedNumber = normalizeContractNumber(input.departmentContractNo);
    const isDuplicate = !errors.length
      && normalizedNumber !== ''
      && seenContractNumbers.has(normalizedNumber);

    if (normalizedNumber) seenContractNumbers.add(normalizedNumber);

    return [{
      rowNumber: index + 2,
      input,
      status: errors.length > 0 ? 'error' : isDuplicate ? 'duplicate' : 'valid',
      errors: isDuplicate ? ['部门合同号已存在'] : errors,
    }];
  });

  return {
    headers,
    rows,
    missingHeaders,
    validCount: rows.filter(row => row.status === 'valid').length,
    duplicateCount: rows.filter(row => row.status === 'duplicate').length,
    errorCount: rows.filter(row => row.status === 'error').length,
  };
}

export async function parseContractFile(
  file: File,
  existing: ContractRecord[],
): Promise<ContractImportPreview> {
  try {
    const { readSheet } = await import('read-excel-file/browser');
    const matrix = await readSheet(file);
    if (matrix.length === 0) return emptyPreview('文件内容为空');

    return parseContractRows(matrix[0] ?? [], matrix.slice(1), existing);
  } catch {
    return emptyPreview('文件解析失败，请确认文件为有效的 Excel 或 CSV');
  }
}

export function buildContractExportMatrix(
  records: ContractRecord[],
): (string | number)[][] {
  return [
    [...CONTRACT_EXPORT_HEADERS],
    ...records.map(record => [
      record.departmentContractNo,
      record.contractName,
      record.customerName,
      record.department,
      record.businessType,
      record.amount,
      record.contactName,
      record.contactPhone,
      record.submittedAt,
    ]),
  ];
}

export function mergeImportPreview(
  existing: ContractRecord[],
  preview: ContractImportPreview,
  overwriteDuplicates: boolean,
): ContractImportResult {
  const records = [...existing];
  let added = 0;
  let updated = 0;
  let skipped = 0;

  preview.rows.forEach(row => {
    if (row.status === 'error') {
      skipped += 1;
      return;
    }

    if (row.status === 'valid') {
      records.push(createContractRecord(row.input));
      added += 1;
      return;
    }

    if (row.status === 'duplicate' && overwriteDuplicates) {
      const normalizedNumber = normalizeContractNumber(row.input.departmentContractNo);
      const existingIndex = records.findIndex(record =>
        normalizeContractNumber(record.departmentContractNo) === normalizedNumber
      );
      if (existingIndex >= 0) {
        records[existingIndex] = updateContractRecord(records[existingIndex], row.input);
        updated += 1;
        return;
      }
    }

    skipped += 1;
  });

  return { records, added, updated, skipped };
}

export async function exportContractsToXlsx(
  records: ContractRecord[],
  fileName: string,
): Promise<void> {
  const { default: writeExcelFile } = await import('write-excel-file/browser');
  const matrix = buildContractExportMatrix(records);
  const styledData = matrix.map((row, rowIndex) =>
    row.map(cell => rowIndex === 0
      ? {
          value: cell,
          fontWeight: 'bold' as const,
          backgroundColor: '#EEF2FF',
          align: 'center' as const,
        }
      : cell)
  );
  await writeExcelFile(styledData).toFile(fileName);
}

export async function exportContractTemplate(fileName: string): Promise<void> {
  await exportContractsToXlsx([], fileName);
}
