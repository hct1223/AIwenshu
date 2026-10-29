import React, { useMemo, useState } from 'react';
import { AlertCircle, FileText, X } from 'lucide-react';
import type { ContractInput, ContractRecord } from '../../types/contract.ts';
import {
  getUniqueContractOptions,
  normalizeContractNumber,
  validateContractInput,
} from '../../data/contractData.ts';

export type ContractFormMode = 'create' | 'edit' | 'view';

interface ContractFormModalProps {
  mode: ContractFormMode;
  contract: ContractRecord | null;
  existingContracts: ContractRecord[];
  onClose: () => void;
  onSave: (input: ContractInput) => void;
}

const EMPTY_INPUT: ContractInput = {
  departmentContractNo: '',
  contractName: '',
  customerName: '',
  department: '',
  businessType: '',
  amount: 0,
  contactName: '',
  contactPhone: '',
  submittedAt: new Date().toISOString().slice(0, 10),
  source: 'manual',
};

const toInput = (contract: ContractRecord | null): ContractInput => {
  if (!contract) return { ...EMPTY_INPUT };
  return {
    departmentContractNo: contract.departmentContractNo,
    contractName: contract.contractName,
    customerName: contract.customerName,
    department: contract.department,
    businessType: contract.businessType,
    amount: contract.amount,
    contactName: contract.contactName,
    contactPhone: contract.contactPhone,
    submittedAt: contract.submittedAt,
    source: contract.source,
  };
};

const titleByMode: Record<ContractFormMode, string> = {
  create: '新增合同',
  edit: '编辑合同',
  view: '合同详情',
};

export default function ContractFormModal({
  mode,
  contract,
  existingContracts,
  onClose,
  onSave,
}: ContractFormModalProps) {
  const [form, setForm] = useState<ContractInput>(() => toInput(contract));
  const [errors, setErrors] = useState<string[]>([]);
  const readOnly = mode === 'view';
  const departments = useMemo(
    () => getUniqueContractOptions(existingContracts, 'department'),
    [existingContracts]
  );
  const businessTypes = useMemo(
    () => getUniqueContractOptions(existingContracts, 'businessType'),
    [existingContracts]
  );

  const updateField = <K extends keyof ContractInput>(field: K, value: ContractInput[K]) => {
    setForm(current => ({ ...current, [field]: value }));
    setErrors([]);
  };

  const fieldHasError = (prefix: string) =>
    errors.some(error => error.startsWith(prefix));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (readOnly) return;

    const nextInput: ContractInput = {
      ...form,
      departmentContractNo: form.departmentContractNo.trim(),
      contractName: form.contractName.trim(),
      customerName: form.customerName.trim(),
      department: form.department.trim(),
      businessType: form.businessType.trim(),
      contactName: form.contactName.trim(),
      contactPhone: form.contactPhone.trim(),
      source: mode === 'create' ? 'manual' : form.source,
    };
    const nextErrors = validateContractInput(nextInput);
    const normalizedNumber = normalizeContractNumber(nextInput.departmentContractNo);
    const duplicate = existingContracts.some(record =>
      record.id !== contract?.id
      && normalizeContractNumber(record.departmentContractNo) === normalizedNumber
    );
    if (duplicate) nextErrors.push('部门合同号已存在，请使用唯一合同号');

    if (nextErrors.length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSave(nextInput);
  };

  const inputClass = (prefix: string) =>
    `w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
      fieldHasError(prefix)
        ? 'border-rose-300 bg-rose-50/40 focus:border-rose-500'
        : 'border-slate-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
    } ${readOnly ? 'bg-slate-50 text-slate-600' : ''}`;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="contract-form-title"
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 id="contract-form-title" className="text-base font-semibold text-slate-900">
                {titleByMode[mode]}
              </h3>
              <p className="text-xs text-slate-400">
                {readOnly ? '合同业务字段只读展示' : '字段规则与导入模板保持一致'}
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

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {errors.length > 0 && (
            <div className="flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div className="space-y-1">
                {errors.map(error => <div key={error}>{error}</div>)}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-600">部门合同号 *</span>
              <input
                value={form.departmentContractNo}
                onChange={event => updateField('departmentContractNo', event.target.value)}
                disabled={readOnly}
                className={inputClass('部门合同号')}
                placeholder="如 SB2026-001"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-600">合同名称 *</span>
              <input
                value={form.contractName}
                onChange={event => updateField('contractName', event.target.value)}
                disabled={readOnly}
                className={inputClass('合同名称')}
                placeholder="请输入完整合同名称"
              />
            </label>

            <label className="space-y-1.5 md:col-span-2">
              <span className="text-xs font-medium text-slate-600">客户单位名称 *</span>
              <input
                value={form.customerName}
                onChange={event => updateField('customerName', event.target.value)}
                disabled={readOnly}
                className={inputClass('客户单位名称')}
                placeholder="请输入客户单位全称"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-600">主办部门 *</span>
              <input
                value={form.department}
                onChange={event => updateField('department', event.target.value)}
                disabled={readOnly}
                list="contract-department-options"
                className={inputClass('主办部门')}
                placeholder="请输入或选择主办部门"
              />
              <datalist id="contract-department-options">
                {departments.map(option => <option key={option} value={option} />)}
              </datalist>
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-600">业务类型 *</span>
              <input
                value={form.businessType}
                onChange={event => updateField('businessType', event.target.value)}
                disabled={readOnly}
                list="contract-business-type-options"
                className={inputClass('业务类型')}
                placeholder="请输入或选择业务类型"
              />
              <datalist id="contract-business-type-options">
                {businessTypes.map(option => <option key={option} value={option} />)}
              </datalist>
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-600">单个合同金额（万元）*</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount || ''}
                onChange={event => updateField('amount', Number(event.target.value))}
                disabled={readOnly}
                className={inputClass('合同金额')}
                placeholder="0.00"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-600">提交时间 *</span>
              <input
                type="date"
                value={form.submittedAt}
                onChange={event => updateField('submittedAt', event.target.value)}
                disabled={readOnly}
                className={inputClass('提交时间')}
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-600">客户单位联系人</span>
              <input
                value={form.contactName}
                onChange={event => updateField('contactName', event.target.value)}
                disabled={readOnly}
                className={inputClass('联系人')}
                placeholder="选填"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-xs font-medium text-slate-600">客户单位联系电话</span>
              <input
                value={form.contactPhone}
                onChange={event => updateField('contactPhone', event.target.value)}
                disabled={readOnly}
                inputMode="tel"
                className={inputClass('联系电话')}
                placeholder="选填，支持座机和手机号"
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
            >
              {readOnly ? '关闭' : '取消'}
            </button>
            {!readOnly && (
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                保存合同
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
