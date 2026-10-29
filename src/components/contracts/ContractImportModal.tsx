import React, { useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  LoaderCircle,
  Upload,
  X,
} from 'lucide-react';
import type { ContractRecord } from '../../types/contract.ts';
import {
  exportContractTemplate,
  parseContractFile,
  type ContractImportPreview,
} from '../../data/contractExcel.ts';

interface ContractImportModalProps {
  existingContracts: ContractRecord[];
  onClose: () => void;
  onConfirm: (preview: ContractImportPreview, overwriteDuplicates: boolean) => void;
}

const statusMeta = {
  valid: {
    label: '可导入',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  duplicate: {
    label: '重复',
    className: 'bg-amber-50 text-amber-700 border-amber-100',
  },
  error: {
    label: '错误',
    className: 'bg-rose-50 text-rose-700 border-rose-100',
  },
} as const;

export default function ContractImportModal({
  existingContracts,
  onClose,
  onConfirm,
}: ContractImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState<ContractImportPreview | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [overwriteDuplicates, setOverwriteDuplicates] = useState(false);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setFileName(file.name);
    setIsParsing(true);
    setPreview(null);
    const result = await parseContractFile(file, existingContracts);
    setPreview(result);
    setIsParsing(false);
  };

  const importableCount = preview
    ? preview.validCount + (overwriteDuplicates ? preview.duplicateCount : 0)
    : 0;
  const canConfirm = Boolean(
    preview
    && preview.missingHeaders.length === 0
    && !preview.errorMessage
    && importableCount > 0
  );

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contract-import-title"
        className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 id="contract-import-title" className="text-base font-semibold text-slate-900">
                导入合同数据
              </h3>
              <p className="text-xs text-slate-400">
                支持标准 .xlsx 文件，导入前不会修改现有数据
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="关闭"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex min-h-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 px-6 py-6 text-center transition hover:border-indigo-400 hover:bg-indigo-50"
            >
              {isParsing ? (
                <LoaderCircle className="mb-3 h-8 w-8 animate-spin text-indigo-600" />
              ) : (
                <Upload className="mb-3 h-8 w-8 text-indigo-600" />
              )}
              <span className="text-sm font-medium text-slate-800">
                {isParsing ? '正在解析文件...' : fileName || '选择 Excel 文件'}
              </span>
              <span className="mt-1 text-xs text-slate-500">
                第一个工作表将用于导入预览
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={event => {
                void handleFile(event.target.files?.[0] ?? null);
                event.target.value = '';
              }}
            />
            <button
              type="button"
              onClick={() => void exportContractTemplate('合同管理导入模板.xlsx')}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 md:h-32 md:w-40 md:flex-col"
            >
              <Download className="h-5 w-5" />
              下载导入模板
            </button>
          </div>

          {preview?.errorMessage && (
            <div className="flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {preview.errorMessage}
            </div>
          )}

          {preview && preview.missingHeaders.length > 0 && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              <div className="mb-1 flex items-center gap-2 font-medium">
                <AlertCircle className="h-4 w-4" />
                缺少必需表头
              </div>
              <div>{preview.missingHeaders.join('、')}</div>
            </div>
          )}

          {preview && preview.missingHeaders.length === 0 && !preview.errorMessage && (
            <>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
                  <div className="font-mono text-xl font-bold text-slate-800">{preview.rows.length}</div>
                  <div className="text-xs text-slate-500">总行数</div>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-center">
                  <div className="font-mono text-xl font-bold text-emerald-700">{preview.validCount}</div>
                  <div className="text-xs text-emerald-600">可导入</div>
                </div>
                <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-center">
                  <div className="font-mono text-xl font-bold text-amber-700">{preview.duplicateCount}</div>
                  <div className="text-xs text-amber-600">重复</div>
                </div>
                <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-center">
                  <div className="font-mono text-xl font-bold text-rose-700">{preview.errorCount}</div>
                  <div className="text-xs text-rose-600">错误</div>
                </div>
              </div>

              {preview.rows.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <div className="max-h-80 overflow-auto">
                    <table className="w-full min-w-[980px] border-collapse text-left text-xs">
                      <thead className="sticky top-0 bg-slate-100 text-slate-600">
                        <tr>
                          <th className="px-3 py-2.5">行号</th>
                          <th className="px-3 py-2.5">状态</th>
                          <th className="px-3 py-2.5">部门合同号</th>
                          <th className="px-3 py-2.5">合同名称</th>
                          <th className="px-3 py-2.5">客户单位</th>
                          <th className="px-3 py-2.5">金额（万元）</th>
                          <th className="px-3 py-2.5">提交时间</th>
                          <th className="px-3 py-2.5">说明</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {preview.rows.slice(0, 20).map(row => {
                          const meta = statusMeta[row.status];
                          return (
                            <tr key={row.rowNumber} className="align-top hover:bg-slate-50/70">
                              <td className="px-3 py-3 text-slate-400">{row.rowNumber}</td>
                              <td className="px-3 py-3">
                                <span className={`inline-flex rounded-full border px-2 py-0.5 ${meta.className}`}>
                                  {meta.label}
                                </span>
                              </td>
                              <td className="px-3 py-3 font-mono text-slate-700">
                                {row.input.departmentContractNo || '—'}
                              </td>
                              <td className="max-w-64 px-3 py-3 text-slate-700">
                                {row.input.contractName || '—'}
                              </td>
                              <td className="max-w-52 px-3 py-3 text-slate-600">
                                {row.input.customerName || '—'}
                              </td>
                              <td className="px-3 py-3 text-right font-mono text-slate-700">
                                {Number.isFinite(row.input.amount) ? row.input.amount.toLocaleString() : '—'}
                              </td>
                              <td className="px-3 py-3 font-mono text-slate-600">
                                {row.input.submittedAt || '—'}
                              </td>
                              <td className="max-w-64 px-3 py-3 text-slate-500">
                                {row.errors.length > 0 ? row.errors.join('；') : '数据有效'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {preview.rows.length > 20 && (
                    <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-500">
                      仅展示前 20 行，共 {preview.rows.length} 行
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">
                  文件中只有表头，没有可导入的数据行
                </div>
              )}

              {preview.duplicateCount > 0 && (
                <label className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  <input
                    type="checkbox"
                    checked={overwriteDuplicates}
                    onChange={event => setOverwriteDuplicates(event.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span>
                    覆盖重复合同
                    <span className="mt-0.5 block text-xs text-amber-700/80">
                      勾选后，相同部门合同号的数据将更新现有记录；不勾选则跳过。
                    </span>
                  </span>
                </label>
              )}
            </>
          )}

          <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              只有点击确认后才会写入合同数据
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                disabled={!canConfirm}
                onClick={() => preview && onConfirm(preview, overwriteDuplicates)}
                className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
                  canConfirm
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'cursor-not-allowed bg-slate-100 text-slate-400'
                }`}
              >
                确认导入 {canConfirm ? importableCount : 0} 条
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
