/**
 * Tab5 权限与脱敏（需求说明 §2.5）。
 *
 * 角色沿用 types.ts 中的 ROLE_PERMISSIONS（所领导/板块领导/市场人员），避免出现
 * 两套互不相通的用户角色。在其上叠加数据范围、密级访问级别与脱敏字段规则。
 *
 * 注意：本页的角色切换器是「模拟预览」控件，不参与审计记录 —— 没有登录态时，
 * 让预览控件改写审计主体会产生「到底是谁改的」的歧义。
 */

import React, { useEffect, useState } from 'react';
import { Save, Eye, RotateCcw } from 'lucide-react';
import type { DataScope, MaskStrategy, PermissionConfig, RoleAccessConfig, UserRole } from '../types';
import { DATA_SCOPE_META, MASK_STRATEGY_META, ROLE_PERMISSIONS } from '../types';
import { DATA_SCOPE_BADGE, badgeClass, inputClass, labelClass, primaryBtnClass, secondaryBtnClass, fieldErrorClass } from './metricConfigStyles';
import { PERMISSION_SAMPLE_SOURCES, applyMask } from '../data/metricEngine';

interface PermissionMaskPanelProps {
  permissions: PermissionConfig;
  onSave: (next: PermissionConfig) => Record<string, string>;
}

const ROLES: UserRole[] = ['institute_leader', 'division_leader', 'marketing_staff'];

export default function PermissionMaskPanel({ permissions, onSave }: PermissionMaskPanelProps) {
  const [draft, setDraft] = useState<PermissionConfig>(permissions);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewRole, setPreviewRole] = useState<UserRole>('marketing_staff');
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    setDraft(permissions);
  }, [permissions]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(permissions);

  const updateRole = (role: UserRole, patch: Partial<RoleAccessConfig>) => {
    setDraft({
      ...draft,
      roles: draft.roles.map((r) => (r.role === role ? { ...r, ...patch } : r))
    });
  };

  const toggleRoleMaskField = (role: UserRole, field: string) => {
    const target = draft.roles.find((r) => r.role === role);
    if (!target) return;
    const has = target.maskFields.includes(field);
    updateRole(role, {
      maskFields: has
        ? target.maskFields.filter((f) => f !== field)
        : [...target.maskFields, field]
    });
  };

  const handleSave = () => {
    const result = onSave(draft);
    setErrors(result);
    if (Object.keys(result).length === 0) setSavedAt(new Date().toLocaleTimeString('zh-CN'));
  };

  const previewRoleConfig = draft.roles.find((r) => r.role === previewRole);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">权限与脱敏</h3>
          <p className="text-sm text-slate-600">
            数据范围、密级访问级别与敏感字段脱敏规则。无权限密级维度的提问将被直接拦截。
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedAt && <span className="text-xs text-emerald-600">已保存 {savedAt}</span>}
          {dirty && (
            <button
              onClick={() => {
                setDraft(permissions);
                setErrors({});
              }}
              className={`${secondaryBtnClass} flex items-center gap-1.5`}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              撤销修改
            </button>
          )}
          <button onClick={handleSave} className={`${primaryBtnClass} ${dirty ? '' : 'opacity-50'}`}>
            <Save className="h-4 w-4" />
            保存权限配置
          </button>
        </div>
      </div>

      {errors._form && (
        <div className="px-4 py-3 bg-rose-50 border border-rose-200 rounded-lg">
          <span className="text-xs text-rose-800">{errors._form}</span>
        </div>
      )}

      {/* 角色访问配置 */}
      <section className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h4 className="text-sm font-semibold text-slate-900 mb-3">角色访问配置</h4>
        <div className="space-y-3">
          {ROLES.map((role) => {
            const config = draft.roles.find((r) => r.role === role);
            if (!config) return null;
            const roleErrors = Object.fromEntries(
              Object.entries(errors)
                .filter(([key]) => key.startsWith(`${role}.`))
                .map(([key, value]) => [key.slice(role.length + 1), value])
            );

            return (
              <div key={role} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-slate-900">
                    {ROLE_PERMISSIONS[role].name}
                  </span>
                  <span className={`${badgeClass} ${DATA_SCOPE_BADGE[config.dataScope]}`}>
                    {DATA_SCOPE_META[config.dataScope].label}
                  </span>
                  <code className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-mono">
                    {role}
                  </code>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>数据范围</label>
                    <select
                      className={inputClass}
                      value={config.dataScope}
                      onChange={(e) =>
                        updateRole(role, { dataScope: e.target.value as DataScope })
                      }
                    >
                      {(Object.keys(DATA_SCOPE_META) as DataScope[]).map((scope) => (
                        <option key={scope} value={scope}>
                          {DATA_SCOPE_META[scope].label}
                        </option>
                      ))}
                    </select>
                    {roleErrors.dataScope && (
                      <p className={fieldErrorClass}>{roleErrors.dataScope}</p>
                    )}
                  </div>
                  <div>
                    <label className={labelClass}>密级访问级别</label>
                    <select
                      className={inputClass}
                      value={config.clearanceLevel}
                      onChange={(e) =>
                        updateRole(role, { clearanceLevel: Number(e.target.value) })
                      }
                    >
                      {draft.clearanceLabels.map((label, index) => (
                        <option key={label} value={index}>
                          {index} - {label}
                        </option>
                      ))}
                    </select>
                    {roleErrors.clearanceLevel && (
                      <p className={fieldErrorClass}>{roleErrors.clearanceLevel}</p>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <label className={labelClass}>对该角色脱敏的字段</label>
                  <div className="flex flex-wrap gap-2">
                    {draft.fieldRules.map((rule) => {
                      const active = config.maskFields.includes(rule.field);
                      return (
                        <button
                          key={rule.field}
                          type="button"
                          onClick={() => toggleRoleMaskField(role, rule.field)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                            active
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {rule.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 敏感字段脱敏规则 */}
      <section className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h4 className="text-sm font-semibold text-slate-900 mb-3">敏感字段脱敏规则</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-medium text-slate-400 uppercase">
                <th className="py-2.5 px-3">字段</th>
                <th className="py-2.5 px-3">展示名</th>
                <th className="py-2.5 px-3">脱敏策略</th>
                <th className="py-2.5 px-3">脱敏样例</th>
                <th className="py-2.5 px-3">启用</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {draft.fieldRules.map((rule) => (
                <tr key={rule.field} className="hover:bg-slate-50/50 transition duration-150">
                  <td className="py-3 px-3">
                    <code className="font-mono text-slate-700">{rule.field}</code>
                  </td>
                  <td className="py-3 px-3 text-slate-800">{rule.label}</td>
                  <td className="py-3 px-3">
                    <select
                      className="text-xs bg-white border border-slate-200 rounded-md py-1.5 px-2 focus:ring-1 focus:ring-indigo-500"
                      value={rule.strategy}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          fieldRules: draft.fieldRules.map((r) =>
                            r.field === rule.field
                              ? { ...r, strategy: e.target.value as MaskStrategy }
                              : r
                          )
                        })
                      }
                    >
                      {(Object.keys(MASK_STRATEGY_META) as MaskStrategy[]).map((s) => (
                        <option key={s} value={s}>
                          {MASK_STRATEGY_META[s].label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-600">
                    {applyMask(rule.strategy, PERMISSION_SAMPLE_SOURCES[rule.field] ?? '')}
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      checked={rule.enabled}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          fieldRules: draft.fieldRules.map((r) =>
                            r.field === rule.field ? { ...r, enabled: e.target.checked } : r
                          )
                        })
                      }
                      className="rounded border-slate-300"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <label className="flex items-start gap-2 cursor-pointer mt-4 pt-4 border-t border-slate-100">
          <input
            type="checkbox"
            checked={draft.blockNoClearance}
            disabled
            readOnly
            className="rounded border-slate-300 mt-0.5"
          />
          <span className="text-sm text-slate-500">
            无权限密级维度提问直接拦截
            <span className="block text-xs text-slate-400 mt-0.5">需求说明固定项，不可修改</span>
          </span>
        </label>
      </section>

      {/* 模拟预览 */}
      <section className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-indigo-600" />
            <h4 className="text-sm font-semibold text-slate-900">脱敏效果模拟（仅预览，不写入审计）</h4>
          </div>
          <select
            className="text-xs bg-white border border-slate-200 rounded-md py-1.5 px-3 focus:ring-1 focus:ring-indigo-500"
            value={previewRole}
            onChange={(e) => setPreviewRole(e.target.value as UserRole)}
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                以 {ROLE_PERMISSIONS[role].name} 身份查看
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {draft.fieldRules.map((rule) => {
            const masked =
              rule.enabled && (previewRoleConfig?.maskFields.includes(rule.field) ?? false);
            const source = PERMISSION_SAMPLE_SOURCES[rule.field] ?? '—';
            return (
              <div
                key={rule.field}
                className="flex items-center justify-between px-3 py-2.5 bg-slate-50 rounded-lg"
              >
                <span className="text-xs text-slate-600">{rule.label}</span>
                <span className="font-mono text-xs text-slate-800">
                  {masked ? applyMask(rule.strategy, source) : source}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-400 mt-3">
          当前预览角色密级级别为 {previewRoleConfig?.clearanceLevel ?? 0}
          （{draft.clearanceLabels[previewRoleConfig?.clearanceLevel ?? 0]}）。
        </p>
      </section>
    </div>
  );
}
