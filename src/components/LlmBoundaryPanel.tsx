/**
 * Tab7 大模型边界（需求说明 §3 能力矩阵 + §4 禁止规则）。
 *
 * 能力矩阵只读展示 —— 它是契约而不是旋钮。禁止规则中可参数化的部分做成可编辑，
 * 并且真正被其它面板的校验消费（表关联的节点数上限、跨域拦截、临时字段拦截），
 * 而不是一段没人执行的说明文字。
 */

import React, { useEffect, useState } from 'react';
import { Save, ShieldAlert, Lock, RotateCcw } from 'lucide-react';
import type { LlmBoundaryGuardrails } from '../types';
import { LLM_CAPABILITY_MATRIX } from '../types';
import { inputClass, labelClass, primaryBtnClass, secondaryBtnClass, fieldErrorClass } from './metricConfigStyles';

interface LlmBoundaryPanelProps {
  boundary: LlmBoundaryGuardrails;
  /** 当前所有链路中的最大节点数，用于提示下调上限的影响 */
  maxChainNodes: number;
  onSave: (next: LlmBoundaryGuardrails) => Record<string, string>;
}

export default function LlmBoundaryPanel({
  boundary,
  maxChainNodes,
  onSave
}: LlmBoundaryPanelProps) {
  const [draft, setDraft] = useState<LlmBoundaryGuardrails>(boundary);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    setDraft(boundary);
  }, [boundary]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(boundary);

  const handleSave = () => {
    const result = onSave(draft);
    setErrors(result);
    if (Object.keys(result).length === 0) setSavedAt(new Date().toLocaleTimeString('zh-CN'));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">大模型边界</h3>
          <p className="text-sm text-slate-600">
            DeepSeek 只做意图识别；口径、维度映射、表关联、SQL 生成与权限判断一律由配置中心约束。
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedAt && <span className="text-xs text-emerald-600">已保存 {savedAt}</span>}
          {dirty && (
            <button
              onClick={() => {
                setDraft(boundary);
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
            保存护栏
          </button>
        </div>
      </div>

      {/* §3 能力矩阵 —— 只读契约 */}
      <section className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
        <h4 className="text-sm font-semibold text-slate-900 mb-3">能力矩阵（只读契约）</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-medium text-slate-400 uppercase">
                <th className="py-2.5 px-3">能力</th>
                <th className="py-2.5 px-3">DeepSeek</th>
                <th className="py-2.5 px-3">配置中心 / 语义引擎</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {LLM_CAPABILITY_MATRIX.map((row) => (
                <tr key={row.capability} className="hover:bg-slate-50/50 transition duration-150">
                  <td className="py-3 px-3 font-medium text-slate-800">{row.capability}</td>
                  <td className="py-3 px-3">
                    {row.deepseek === 'allowed' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
                        允许
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-700">
                        不允许
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-600">{row.configCenter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* §4 禁止规则 —— 可参数化的部分真正生效 */}
      <section className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-indigo-600" />
          <h4 className="text-sm font-semibold text-slate-900">禁止规则</h4>
        </div>

        <div>
          <label className={labelClass}>单次查询关联表上限（1-4 张）</label>
          <input
            type="number"
            min={1}
            max={4}
            className={inputClass}
            value={draft.maxJoinTables}
            onChange={(e) => setDraft({ ...draft, maxJoinTables: Number(e.target.value) })}
          />
          {errors.maxJoinTables && <p className={fieldErrorClass}>{errors.maxJoinTables}</p>}
          {draft.maxJoinTables < maxChainNodes && (
            <p className="text-xs text-amber-700 mt-1">
              当前已有链路的节点数为 {maxChainNodes}，低于该上限的链路将无法通过校验。
            </p>
          )}
        </div>

        <div className="space-y-3 pt-1">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={draft.forbidCrossDomainJoin}
              onChange={(e) => setDraft({ ...draft, forbidCrossDomainJoin: e.target.checked })}
              className="rounded border-slate-300 mt-0.5"
            />
            <span className="text-sm text-slate-700">
              禁止跨业务域乱关联
              <span className="block text-xs text-slate-400 mt-0.5">
                如科研专项表与回款流水表关联；开启后由表关联配置页强制校验。
              </span>
            </span>
          </label>

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={draft.forbidCustomJoinFields}
              onChange={(e) => setDraft({ ...draft, forbidCustomJoinFields: e.target.checked })}
              className="rounded border-slate-300 mt-0.5"
            />
            <span className="text-sm text-slate-700">
              禁止自定义临时关联字段
              <span className="block text-xs text-slate-400 mt-0.5">
                关联键只能取自标准链路，不允许临时拼接字段。
              </span>
            </span>
          </label>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={draft.forbidDirectDbAccess}
              disabled
              readOnly
              className="rounded border-slate-300 mt-0.5"
            />
            <span className="text-sm text-slate-500">
              禁止直连底层数据库
              <span className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                <Lock className="h-3 w-3" />
                硬约束，锁定开启且不可修改
              </span>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
