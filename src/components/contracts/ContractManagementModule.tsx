import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Upload,
  Users,
  WalletCards,
  X,
} from 'lucide-react';
import type {
  ContractFilters,
  ContractInput,
  ContractRecord,
} from '../../types/contract.ts';
import {
  createContractRecord,
  filterContracts,
  getUniqueContractOptions,
  updateContractRecord,
} from '../../data/contractData.ts';
import {
  exportContractsToXlsx,
  mergeImportPreview,
  type ContractImportPreview,
} from '../../data/contractExcel.ts';
import type { ContractQueryResult } from '../../data/contractQuery.ts';
import { useContracts } from '../../context/ContractContext.tsx';
import ContractFormModal, { type ContractFormMode } from './ContractFormModal.tsx';
import ContractImportModal from './ContractImportModal.tsx';

const PAGE_SIZES = [10, 20, 50] as const;

const DEFAULT_FILTERS: ContractFilters = {
  keyword: '',
  department: '全部',
  businessType: '全部',
  amountRange: 'all',
  dateFrom: '',
  dateTo: '',
};

type SortKey = 'submittedAt' | 'amount' | 'contractName';
type SortDirection = 'asc' | 'desc';

interface ContractManagementModuleProps {
  onOpenAIChat?: () => void;
  aiQuery?: ContractQueryResult | null;
  onClearAiQuery?: () => void;
}

interface FormState {
  mode: ContractFormMode;
  contract: ContractRecord | null;
}

interface ToastState {
  type: 'success' | 'error';
  message: string;
}

const amountRangeLabel: Record<ContractFilters['amountRange'], string> = {
  all: '全部金额',
  lt100: '100 万以下',
  '100to500': '100–500 万',
  '500to1000': '500–1000 万',
  gte1000: '1000 万以上',
};

const todayFilePart = () => new Date().toISOString().slice(0, 10);

const formatAmount = (amount: number) =>
  `${amount.toLocaleString('zh-CN', { maximumFractionDigits: 2 })} 万元`;

export default function ContractManagementModule({
  onOpenAIChat,
  aiQuery,
  onClearAiQuery,
}: ContractManagementModuleProps) {
  const { contracts, setContracts } = useContracts();
  const [filters, setFilters] = useState<ContractFilters>(DEFAULT_FILTERS);
  const [sortKey, setSortKey] = useState<SortKey>('submittedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(20);
  const [formState, setFormState] = useState<FormState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContractRecord | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const departments = useMemo(
    () => getUniqueContractOptions(contracts, 'department'),
    [contracts]
  );
  const businessTypes = useMemo(
    () => getUniqueContractOptions(contracts, 'businessType'),
    [contracts]
  );
  const baseFilteredContracts = useMemo(
    () => filterContracts(contracts, filters),
    [contracts, filters]
  );
  const filteredContracts = useMemo(() => {
    if (!aiQuery) return baseFilteredContracts;
    const queryIds = new Set(aiQuery.records.map(record => record.id));
    return baseFilteredContracts.filter(record => queryIds.has(record.id));
  }, [aiQuery, baseFilteredContracts]);
  const sortedContracts = useMemo(() => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    return [...filteredContracts].sort((left, right) => {
      if (sortKey === 'amount') return (left.amount - right.amount) * multiplier;
      if (sortKey === 'contractName') {
        return left.contractName.localeCompare(right.contractName, 'zh-CN') * multiplier;
      }
      return left.submittedAt.localeCompare(right.submittedAt) * multiplier;
    });
  }, [filteredContracts, sortDirection, sortKey]);

  const totalAmount = filteredContracts.reduce((sum, record) => sum + record.amount, 0);
  const customerCount = new Set(filteredContracts.map(record => record.customerName)).size;
  const pageCount = Math.max(1, Math.ceil(sortedContracts.length / pageSize));
  const visibleContracts = sortedContracts.slice((page - 1) * pageSize, page * pageSize);
  const hasActiveFilters = filters.keyword.trim() !== ''
    || filters.department !== '全部'
    || filters.businessType !== '全部'
    || filters.amountRange !== 'all'
    || filters.dateFrom !== ''
    || filters.dateTo !== '';

  useEffect(() => {
    setPage(1);
  }, [filters, pageSize]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const notify = (message: string, type: ToastState['type'] = 'success') => {
    setToast({ message, type });
  };

  const updateFilter = <K extends keyof ContractFilters>(
    field: K,
    value: ContractFilters[K]
  ) => {
    setFilters(current => ({ ...current, [field]: value }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const clearAiQuery = () => {
    resetFilters();
    onClearAiQuery?.();
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(current => current === 'asc' ? 'desc' : 'asc');
      return;
    }
    setSortKey(key);
    setSortDirection(key === 'contractName' ? 'asc' : 'desc');
  };

  const openCreate = () => setFormState({ mode: 'create', contract: null });

  const saveContract = (input: ContractInput) => {
    if (!formState) return;
    if (formState.mode === 'create') {
      const record = createContractRecord(input);
      setContracts(current => [record, ...current]);
      notify('合同已新增');
    } else if (formState.mode === 'edit' && formState.contract) {
      setContracts(current => current.map(record =>
        record.id === formState.contract?.id
          ? updateContractRecord(record, input)
          : record
      ));
      notify('合同已更新');
    }
    setFormState(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setContracts(current => current.filter(record => record.id !== deleteTarget.id));
    setDeleteTarget(null);
    notify('合同已删除');
  };

  const handleImport = (
    preview: ContractImportPreview,
    overwriteDuplicates: boolean
  ) => {
    const result = mergeImportPreview(contracts, preview, overwriteDuplicates);
    setContracts(result.records);
    setImportOpen(false);
    notify(`导入完成：新增 ${result.added} 条，更新 ${result.updated} 条，跳过 ${result.skipped} 条`);
  };

  const exportRecords = async (records: ContractRecord[], suffix: string) => {
    if (records.length === 0) {
      notify('当前没有可导出的合同数据', 'error');
      return;
    }
    await exportContractsToXlsx(records, `合同管理_${suffix}_${todayFilePart()}.xlsx`);
    notify(`已导出 ${records.length} 条合同数据`);
  };

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />;
    return sortDirection === 'asc'
      ? <ArrowUp className="h-3.5 w-3.5 text-indigo-600" />
      : <ArrowDown className="h-3.5 w-3.5 text-indigo-600" />;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-indigo-600">
            <FileSpreadsheet className="h-4 w-4" />
            Contract lifecycle management
          </div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
            合同管理
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            统一管理合同台账，支持条件查询、本地持久化和 Excel 导入导出
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {onOpenAIChat && (
            <button
              type="button"
              onClick={onOpenAIChat}
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100"
            >
              <Sparkles className="h-4 w-4" />
              问 AI 查合同
            </button>
          )}
          <button
            id="btn-contract-import"
            type="button"
            onClick={() => setImportOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Upload className="h-4 w-4" />
            导入 Excel
          </button>
          <button
            id="btn-contract-export"
            type="button"
            onClick={() => void exportRecords(filteredContracts, '筛选结果')}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <Download className="h-4 w-4" />
            导出 Excel
          </button>
          <button
            type="button"
            onClick={() => void exportRecords(contracts, '全部')}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
          >
            导出全部
          </button>
          <button
            id="btn-contract-create"
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            新增合同
          </button>
        </div>
      </div>

      {aiQuery && (
        <div className="flex flex-col gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-indigo-900">AI 查询结果</div>
              <div className="mt-0.5 text-xs text-indigo-700">
                “{aiQuery.query}” · 命中 {filteredContracts.length} 条合同
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={clearAiQuery}
            className="shrink-0 rounded-lg border border-indigo-200 bg-white px-3 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100"
          >
            查看全部合同
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">合同总数</span>
            <FileText className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-slate-900">{contracts.length}</div>
          <div className="mt-1 text-[10px] text-slate-400">当前台账全部记录</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">筛选结果</span>
            <Search className="h-4 w-4 text-sky-500" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-sky-700">{filteredContracts.length}</div>
          <div className="mt-1 text-[10px] text-slate-400">符合当前筛选条件</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">合同金额</span>
            <WalletCards className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 truncate font-mono text-xl font-bold text-emerald-700" title={formatAmount(totalAmount)}>
            {formatAmount(totalAmount)}
          </div>
          <div className="mt-1 text-[10px] text-slate-400">当前筛选结果合计</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">涉及客户</span>
            <Users className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-amber-700">{customerCount}</div>
          <div className="mt-1 text-[10px] text-slate-400">当前筛选结果客户数</div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
          <label className="relative xl:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={filters.keyword}
              onChange={event => updateFilter('keyword', event.target.value)}
              placeholder="搜索合同号、名称、客户、联系人..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-xs outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
          <select
            value={filters.department}
            onChange={event => updateFilter('department', event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600 outline-none focus:border-indigo-500"
          >
            <option>全部</option>
            {departments.map(option => <option key={option}>{option}</option>)}
          </select>
          <select
            value={filters.businessType}
            onChange={event => updateFilter('businessType', event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600 outline-none focus:border-indigo-500"
          >
            <option>全部</option>
            {businessTypes.map(option => <option key={option}>{option}</option>)}
          </select>
          <select
            value={filters.amountRange}
            onChange={event => updateFilter(
              'amountRange',
              event.target.value as ContractFilters['amountRange']
            )}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600 outline-none focus:border-indigo-500"
          >
            {Object.entries(amountRangeLabel).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <input
              type="date"
              value={filters.dateFrom}
              onChange={event => updateFilter('dateFrom', event.target.value)}
              aria-label="提交开始日期"
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-2 py-2 text-xs text-slate-600 outline-none focus:border-indigo-500"
            />
            <input
              type="date"
              value={filters.dateTo}
              onChange={event => updateFilter('dateTo', event.target.value)}
              aria-label="提交结束日期"
              className="min-w-0 flex-1 rounded-lg border border-slate-300 px-2 py-2 text-xs text-slate-600 outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
          <div className="text-xs text-slate-500">
            共 {filteredContracts.length} 条结果
            {hasActiveFilters && <span className="ml-1 text-indigo-600">（已应用筛选）</span>}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs text-slate-500 transition hover:text-indigo-600"
              >
                <X className="h-3.5 w-3.5" />
                清除筛选
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {visibleContracts.length === 0 ? (
          <div className="px-6 py-20 text-center">
            <FileSpreadsheet className="mx-auto mb-4 h-12 w-12 text-slate-300" />
            <div className="text-sm font-medium text-slate-500">
              {contracts.length === 0 ? '暂无合同数据' : '没有符合当前条件的合同'}
            </div>
            <div className="mt-1 text-xs text-slate-400">
              {contracts.length === 0 ? '新增合同或导入 Excel 后开始管理' : '请调整筛选条件后重试'}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1480px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-500">
                  <th className="px-4 py-3">部门合同号</th>
                  <th className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleSort('contractName')}
                      className="inline-flex items-center gap-1 hover:text-indigo-600"
                    >
                      合同名称 {sortIcon('contractName')}
                    </button>
                  </th>
                  <th className="px-4 py-3">客户单位名称</th>
                  <th className="px-4 py-3">主办部门</th>
                  <th className="px-4 py-3">业务类型</th>
                  <th className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => toggleSort('amount')}
                      className="inline-flex items-center gap-1 hover:text-indigo-600"
                    >
                      单个合同金额 {sortIcon('amount')}
                    </button>
                  </th>
                  <th className="px-4 py-3">客户单位联系人</th>
                  <th className="px-4 py-3">客户单位联系电话</th>
                  <th className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleSort('submittedAt')}
                      className="inline-flex items-center gap-1 hover:text-indigo-600"
                    >
                      提交时间 {sortIcon('submittedAt')}
                    </button>
                  </th>
                  <th className="sticky right-0 bg-slate-50 px-4 py-3 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {visibleContracts.map(contract => (
                  <tr key={contract.id} className="group hover:bg-indigo-50/30">
                    <td className="px-4 py-3 font-mono font-medium text-indigo-700">
                      {contract.departmentContractNo}
                    </td>
                    <td className="max-w-[280px] px-4 py-3 font-medium text-slate-800">
                      <div className="line-clamp-2">{contract.contractName}</div>
                    </td>
                    <td className="max-w-[240px] px-4 py-3 text-slate-600">
                      <div className="line-clamp-2">{contract.customerName}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{contract.department}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full border border-sky-100 bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700">
                        {contract.businessType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-700">
                      {contract.amount.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{contract.contactName || '—'}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">{contract.contactPhone || '—'}</td>
                    <td className="px-4 py-3 font-mono text-slate-600">{contract.submittedAt}</td>
                    <td className="sticky right-0 bg-white px-4 py-3 group-hover:bg-indigo-50/30">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setFormState({ mode: 'view', contract })}
                          className="rounded-md p-1.5 text-slate-400 transition hover:bg-sky-50 hover:text-sky-600"
                          title="查看合同"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormState({ mode: 'edit', contract })}
                          className="rounded-md p-1.5 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                          title="编辑合同"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(contract)}
                          className="rounded-md p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                          title="删除合同"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <div>
            第 {sortedContracts.length === 0 ? 0 : (page - 1) * pageSize + 1}–
            {Math.min(page * pageSize, sortedContracts.length)} 条，共 {sortedContracts.length} 条
          </div>
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={event => setPageSize(Number(event.target.value) as (typeof PAGE_SIZES)[number])}
              className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs outline-none"
              aria-label="每页条数"
            >
              {PAGE_SIZES.map(size => <option key={size} value={size}>每页 {size} 条</option>)}
            </select>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage(current => Math.max(1, current - 1))}
              className="rounded-md border border-slate-200 p-1.5 transition enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="上一页"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-16 text-center">{page} / {pageCount}</span>
            <button
              type="button"
              disabled={page >= pageCount}
              onClick={() => setPage(current => Math.min(pageCount, current + 1))}
              className="rounded-md border border-slate-200 p-1.5 transition enabled:hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="下一页"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {formState && (
        <ContractFormModal
          mode={formState.mode}
          contract={formState.contract}
          existingContracts={contracts}
          onClose={() => setFormState(null)}
          onSave={saveContract}
        />
      )}

      {importOpen && (
        <ContractImportModal
          existingContracts={contracts}
          onClose={() => setImportOpen(false)}
          onConfirm={handleImport}
        />
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">确认删除合同？</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  “{deleteTarget.contractName}”将从合同台账中永久删除，此操作无法撤销。
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-[100] flex max-w-md items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-xl ${
            toast.type === 'success'
              ? 'border-emerald-200 bg-white text-emerald-700'
              : 'border-rose-200 bg-white text-rose-700'
          }`}
        >
          {toast.type === 'success'
            ? <FileSpreadsheet className="h-4 w-4 text-emerald-500" />
            : <AlertTriangle className="h-4 w-4 text-rose-500" />}
          {toast.message}
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 text-slate-400 hover:text-slate-600"
            aria-label="关闭提示"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
