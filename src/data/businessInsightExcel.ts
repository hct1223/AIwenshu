import type { ChurnWarningRecord } from './businessInsightMock.ts';

export const CHURN_EXPORT_HEADERS = [
  '排名',
  '客户名称',
  '客户等级',
  '风险等级',
  '风险评分',
  '地区',
  '行业',
  '最近消费间隔（天）',
  '最近合作金额（万元）',
  '负责人',
] as const;

export function buildChurnExportMatrix(
  records: ChurnWarningRecord[],
): (string | number)[][] {
  return [
    [...CHURN_EXPORT_HEADERS],
    ...records.map(record => [
      record.rank,
      record.customerName,
      record.customerLevel,
      record.riskLevel,
      record.riskScore,
      record.region,
      record.industry,
      record.recentConsumptionDays,
      record.lastAmount,
      record.owner,
    ]),
  ];
}

export async function exportChurnTop100(records: ChurnWarningRecord[]): Promise<void> {
  const { default: writeExcelFile } = await import('write-excel-file/browser');
  const matrix = buildChurnExportMatrix(records);
  const styledData = matrix.map((row, rowIndex) =>
    row.map(cell => rowIndex === 0
      ? {
          value: cell,
          fontWeight: 'bold' as const,
          backgroundColor: '#FFF1F2',
          align: 'center' as const,
        }
      : cell)
  );
  await writeExcelFile(styledData).toFile('流失预警客户Top100.xlsx');
}
