import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowDownRight,
  BarChart3,
  Download,
  FileSpreadsheet,
  LoaderCircle,
  MapPin,
  TrendingDown,
  Users,
} from 'lucide-react';
import type { BusinessInsightQueryResult } from '../data/businessInsightMock.ts';
import { exportChurnTop100 } from '../data/businessInsightExcel.ts';

interface BusinessInsightCardProps {
  result: BusinessInsightQueryResult;
}

const formatAmount = (amount: number) =>
  `¥${amount.toLocaleString('zh-CN', { maximumFractionDigits: 1 })} 万元`;

const cardTitle: Record<BusinessInsightQueryResult['kind'], string> = {
  monthly: '月度合作金额',
  annual: '年度合作金额',
  region: '地区合作金额',
  decline: '合作金额下降归因',
  churn: '流失预警客户',
};

const Distribution = ({
  title,
  entries,
}: {
  title: string;
  entries: [string, number][];
}) => {
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-3">
      <div className="mb-2 text-[11px] font-semibold text-slate-700">{title}</div>
      <div className="space-y-1.5">
        {entries.map(([label, count]) => (
          <div key={label} className="flex items-center gap-2 text-[10px]">
            <span className="w-20 truncate text-slate-500">{label}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-indigo-500"
                style={{ width: `${Math.max(3, (count / Math.max(total, 1)) * 100)}%` }}
              />
            </div>
            <span className="w-7 text-right font-mono text-slate-600">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function BusinessInsightCard({ result }: BusinessInsightCardProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (result.kind !== 'churn' || isExporting) return;
    setIsExporting(true);
    try {
      await exportChurnTop100(result.top100);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-sky-100 bg-sky-50/80 px-4 py-3">
        <div className="flex items-center gap-2">
          {result.kind === 'decline' || result.kind === 'churn'
            ? <AlertTriangle className="h-4 w-4 text-amber-600" />
            : result.kind === 'region'
              ? <MapPin className="h-4 w-4 text-sky-600" />
              : <BarChart3 className="h-4 w-4 text-indigo-600" />}
          <span className="text-xs font-semibold text-slate-900">{cardTitle[result.kind]}</span>
        </div>
        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] text-sky-700">
          {result.kind === 'monthly' && `${result.year} 年`}
          {result.kind === 'annual' && '2022–2026'}
          {result.kind === 'region' && result.scopeLabel}
          {result.kind === 'decline' && result.record.subject}
          {result.kind === 'churn' && '最近三个月'}
        </span>
      </div>

      <div className="space-y-4 p-4">
        {(result.kind === 'monthly' || result.kind === 'annual') && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-indigo-50 p-3">
                <div className="text-[10px] text-indigo-500">
                  {result.kind === 'monthly' ? `${result.year} 年累计` : '五年累计'}
                </div>
                <div className="mt-1 font-mono text-lg font-bold text-indigo-700">
                  {formatAmount(result.totalAmount)}
                </div>
              </div>
              <div className="rounded-lg bg-emerald-50 p-3">
                <div className="text-[10px] text-emerald-500">
                  {result.kind === 'monthly' ? '月均金额' : '最新同比'}
                </div>
                <div className="mt-1 font-mono text-lg font-bold text-emerald-700">
                  {result.kind === 'monthly'
                    ? formatAmount(result.averageAmount)
                    : `${result.latestGrowth.toFixed(1)}%`}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {result.rows.map(row => {
                const maxAmount = Math.max(...result.rows.map(item => item.amount), 1);
                const growth = 'mom' in row ? row.mom : row.yoy;
                return (
                  <div key={'month' in row ? row.label : row.year} className="text-[10px]">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="font-medium text-slate-700">
                        {'month' in row ? row.label : `${row.year} 年`}
                      </span>
                      <span className="font-mono text-slate-600">
                        {formatAmount(row.amount)}
                        {growth != null && (
                          <span className={`ml-2 ${growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${(row.amount / maxAmount) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {result.kind === 'region' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-sky-50 p-3">
                <div className="text-[10px] text-sky-500">地区合作金额</div>
                <div className="mt-1 font-mono text-lg font-bold text-sky-700">
                  {formatAmount(result.totalAmount)}
                </div>
              </div>
              <div className="rounded-lg bg-amber-50 p-3">
                <div className="text-[10px] text-amber-500">覆盖客户</div>
                <div className="mt-1 font-mono text-lg font-bold text-amber-700">
                  {result.totalCustomers} 家
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {result.rows.map(row => (
                <div key={row.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-[11px]">
                  <div>
                    <div className="font-medium text-slate-700">{row.province}{row.city}</div>
                    <div className="mt-0.5 text-[10px] text-slate-400">
                      {row.region} · {row.customers} 家客户
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-semibold text-slate-700">{formatAmount(row.amount)}</div>
                    <div className={`text-[10px] ${row.yoy >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      同比 {row.yoy >= 0 ? '+' : ''}{row.yoy.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="mb-2 text-[11px] font-semibold text-slate-700">业务类型构成</div>
              <div className="space-y-2">
                {result.businessBreakdown.map(item => (
                  <div key={item.businessType} className="flex items-center justify-between text-[10px] text-slate-600">
                    <span>{item.businessType}</span>
                    <span className="font-mono">{formatAmount(item.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {result.kind === 'decline' && (
          <>
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-slate-50 p-2.5 text-center">
                <div className="text-[9px] text-slate-400">上年同期</div>
                <div className="mt-1 font-mono text-xs font-bold text-slate-700">
                  {formatAmount(result.record.previousAmount)}
                </div>
              </div>
              <div className="rounded-lg bg-rose-50 p-2.5 text-center">
                <div className="text-[9px] text-rose-400">本期</div>
                <div className="mt-1 font-mono text-xs font-bold text-rose-700">
                  {formatAmount(result.record.currentAmount)}
                </div>
              </div>
              <div className="rounded-lg bg-amber-50 p-2.5 text-center">
                <div className="text-[9px] text-amber-500">同比下降</div>
                <div className="mt-1 flex items-center justify-center font-mono text-xs font-bold text-amber-700">
                  <ArrowDownRight className="mr-0.5 h-3 w-3" />
                  {result.record.declineRate.toFixed(1)}%
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
                主要业务拖累项
              </div>
              <div className="space-y-2">
                {result.record.drivers.map(driver => (
                  <div key={driver.businessType} className="flex items-center gap-2 text-[10px]">
                    <span className="w-16 text-slate-600">{driver.businessType}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-rose-500"
                        style={{ width: `${driver.contributionRate}%` }}
                      />
                    </div>
                    <span className="w-20 text-right font-mono text-rose-600">
                      -{formatAmount(driver.declineAmount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] leading-relaxed text-amber-900">
              {result.record.conclusion}
            </div>
          </>
        )}

        {result.kind === 'churn' && (
          <>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Distribution title="风险等级分布" entries={Object.entries(result.riskDistribution)} />
              <Distribution title="客户等级分布" entries={Object.entries(result.customerLevelDistribution)} />
              <Distribution title="最近消费间隔分布" entries={Object.entries(result.intervalDistribution)} />
            </div>

            <div className="rounded-lg border border-rose-100 bg-rose-50 p-3 text-[11px] leading-relaxed text-rose-900">
              {result.conclusion}
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                  <Users className="h-3.5 w-3.5 text-indigo-500" />
                  Top10 名单
                </div>
                <span className="text-[10px] text-slate-400">完整名单共 100 家</span>
              </div>
              <div className="overflow-hidden rounded-lg border border-slate-100">
                <table className="w-full border-collapse text-left text-[10px]">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-2 py-2">排名</th>
                      <th className="px-2 py-2">客户</th>
                      <th className="px-2 py-2">等级</th>
                      <th className="px-2 py-2 text-right">风险</th>
                      <th className="px-2 py-2 text-right">间隔</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.top100.slice(0, 10).map(record => (
                      <tr key={record.id}>
                        <td className="px-2 py-2 font-mono text-slate-400">{record.rank}</td>
                        <td className="max-w-40 truncate px-2 py-2 font-medium text-slate-700" title={record.customerName}>
                          {record.customerName}
                        </td>
                        <td className="px-2 py-2 text-slate-500">{record.customerLevel}</td>
                        <td className="px-2 py-2 text-right font-mono font-semibold text-rose-600">
                          {record.riskScore}
                        </td>
                        <td className="px-2 py-2 text-right font-mono text-slate-500">
                          {record.recentConsumptionDays}天
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void handleExport()}
              disabled={isExporting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isExporting
                ? <LoaderCircle className="h-4 w-4 animate-spin" />
                : <Download className="h-4 w-4" />}
              {isExporting ? '正在生成...' : '导出 Top100'}
            </button>
          </>
        )}

        <div className="flex items-center gap-1.5 border-t border-slate-100 pt-3 text-[10px] text-amber-600">
          <FileSpreadsheet className="h-3 w-3" />
          本结果基于预制模拟数据，不是实际业务经营结果。
        </div>
      </div>
    </div>
  );
}
