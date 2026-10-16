/**
 * Tab3 表关联配置（需求说明 §2.3）。
 *
 * 标准链路由配置固化，大模型无权修改。统一左连接、自动过滤无效单据。
 * 节点数受「大模型边界」里的单次查询关联表上限约束，跨业务域关联受禁止规则约束 ——
 * 这两条约束由容器校验执行，不是纸面说明。
 */

import React, { useState } from 'react';
import { Edit, Trash2, Plus, X, AlertCircle, Lock, ArrowRight } from 'lucide-react';
import type { JoinChain, JoinNode, LlmBoundaryGuardrails, MetricStatus, TableSchemaStatus } from '../types';
import { METRIC_STATUS_META } from '../types';
import {
  METRIC_STATUS_BADGE,
  SCHEMA_STATUS_BADGE,
  badgeClass,
  cancelBtnClass,
  cardClass,
  fieldErrorClass,
  iconBtnDeleteClass,
  iconBtnEditClass,
  inputClass,
  labelClass,
  lockedFieldClass,
  modalFooterClass,
  modalHeaderClass,
  modalOverlayClass,
  modalPanelClass,
  primaryBtnClass,
  secondaryBtnClass
} from './metricConfigStyles';

interface JoinChainPanelProps {
  chains: JoinChain[];
  boundary: LlmBoundaryGuardrails;
  onSave: (item: JoinChain) => Record<string, string>;
  onDelete: (id: string) => void;
}

interface ChainDraft {
  scene: string;
  businessDomain: string;
  isolated: boolean;
  note: string;
  status: MetricStatus;
  nodes: JoinNode[];
}

const EMPTY_NODE: JoinNode = {
  order: 1,
  label: '',
  tableKey: '',
  schemaStatus: 'planned',
  joinKey: ''
};

const EMPTY_DRAFT: ChainDraft = {
  scene: '',
  businessDomain: 'market',
  isolated: false,
  note: '',
  status: 'draft',
  nodes: [{ ...EMPTY_NODE }]
};

export default function JoinChainPanel({
  chains,
  boundary,
  onSave,
  onDelete
}: JoinChainPanelProps) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<JoinChain | null>(null);
  const [draft, setDraft] = useState<ChainDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openAdd = () => {
    setEditing(null);
    setDraft({ ...EMPTY_DRAFT, nodes: [{ ...EMPTY_NODE }] });
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (item: JoinChain) => {
    setEditing(item);
    setDraft({
      scene: item.scene,
      businessDomain: item.businessDomain,
      isolated: item.isolated,
      note: item.note ?? '',
      status: item.status,
      nodes: item.nodes.map((n) => ({ ...n }))
    });
    setErrors({});
    setShowModal(true);
  };

  const updateNode = (index: number, patch: Partial<JoinNode>) => {
    setDraft({
      ...draft,
      nodes: draft.nodes.map((n, i) => (i === index ? { ...n, ...patch } : n))
    });
  };

  /** 重新编号，保证 order 从 1 起连续 */
  const renumber = (nodes: JoinNode[]): JoinNode[] =>
    nodes.map((n, i) => ({ ...n, order: i + 1 }));

  const handleSave = () => {
    const payload: JoinChain = {
      id: editing?.id ?? '',
      scene: draft.scene,
      businessDomain: draft.businessDomain,
      isolated: draft.isolated,
      note: draft.note.trim() || undefined,
      status: draft.status,
      nodes: renumber(draft.nodes),
      // 需求说明指定统一左连接，界面上不可改
      joinType: 'LEFT',
      filterInvalid: true,
      schemaVersion: editing?.schemaVersion ?? '1.0',
      updatedAt: editing?.updatedAt ?? '',
      updatedBy: editing?.updatedBy ?? ''
    };

    const result = onSave(payload);
    if (Object.keys(result).length > 0) {
      setErrors(result);
      return;
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">表关联配置</h3>
          <p className="text-sm text-slate-600">
            共 {chains.length} 条标准链路。统一左连接，单次查询关联表不超过{' '}
            {boundary.maxJoinTables} 张。
          </p>
        </div>
        <button onClick={openAdd} className={primaryBtnClass}>
          <Plus className="h-4 w-4" />
          新增链路
        </button>
      </div>

      <div className="space-y-3">
        {chains.map((chain) => (
          <div key={chain.id} className={`${cardClass(chain.status === 'published')} p-4`}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-slate-900">{chain.scene}</span>
                  <span className={`${badgeClass} bg-slate-100 text-slate-600 font-mono`}>
                    {chain.joinType} JOIN
                  </span>
                  <span className={`${badgeClass} bg-blue-50 text-blue-700`}>
                    {chain.businessDomain === 'research' ? '科研域' : '市场化域'}
                  </span>
                  {chain.isolated && (
                    <span className={`${badgeClass} bg-rose-100 text-rose-700`}>数据隔离</span>
                  )}
                  <span className={`${badgeClass} ${METRIC_STATUS_BADGE[chain.status]}`}>
                    {METRIC_STATUS_META[chain.status].label}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {chain.nodes.length} / {boundary.maxJoinTables} 张表
                  </span>
                </div>

                {/* 关联链路 */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  {chain.nodes.map((nodeItem, index) => (
                    <React.Fragment key={`${nodeItem.tableKey}-${index}`}>
                      {index > 0 && <ArrowRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />}
                      <div className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="text-xs font-medium text-slate-800">{nodeItem.label}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <code className="font-mono text-[10px] text-slate-500">
                            {nodeItem.tableKey}
                          </code>
                          <span
                            className={`${badgeClass} ${SCHEMA_STATUS_BADGE[nodeItem.schemaStatus]}`}
                          >
                            {nodeItem.schemaStatus === 'exists' ? '已建表' : '待建表'}
                          </span>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>

                {chain.note && <p className="mt-2.5 text-xs text-slate-500">{chain.note}</p>}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEdit(chain)} className={iconBtnEditClass} title="编辑">
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(chain.id)}
                  className={iconBtnDeleteClass}
                  title="删除"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {chains.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
            <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">暂无标准链路</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className={modalOverlayClass}>
          <div className={modalPanelClass}>
            <div className="p-6">
              <div className={modalHeaderClass}>
                <h2 className="text-xl font-bold text-slate-900">
                  {editing ? '编辑标准链路' : '新增标准链路'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>场景名称</label>
                    <input
                      className={inputClass}
                      value={draft.scene}
                      onChange={(e) => setDraft({ ...draft, scene: e.target.value })}
                      placeholder="如：市场化经营"
                    />
                    {errors.scene && <p className={fieldErrorClass}>{errors.scene}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>业务域</label>
                    <select
                      className={inputClass}
                      value={draft.businessDomain}
                      onChange={(e) => setDraft({ ...draft, businessDomain: e.target.value })}
                    >
                      <option value="market">市场化域 (market)</option>
                      <option value="research">科研域 (research)</option>
                    </select>
                    {errors.businessDomain && (
                      <p className={fieldErrorClass}>{errors.businessDomain}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>连接方式（固定）</label>
                  <div className={`${lockedFieldClass} flex items-center gap-2`}>
                    <Lock className="h-3.5 w-3.5" />
                    LEFT JOIN（需求说明要求统一左连接）
                  </div>
                </div>

                {/* 节点编辑器 */}
                <div>
                  <label className={labelClass}>
                    关联链路（最多 {boundary.maxJoinTables} 张表）
                  </label>
                  <div className="space-y-2">
                    {draft.nodes.map((nodeItem, index) => (
                      <div
                        key={index}
                        className="border border-slate-200 rounded-lg p-2.5 grid grid-cols-12 gap-2"
                      >
                        <div className="col-span-1 flex items-center justify-center text-xs text-slate-400 font-mono">
                          {index + 1}
                        </div>
                        <input
                          className={`${inputClass} col-span-4`}
                          value={nodeItem.label}
                          placeholder="展示名，如：客户主表"
                          onChange={(e) => updateNode(index, { label: e.target.value })}
                        />
                        <input
                          className={`${inputClass} col-span-4 font-mono`}
                          value={nodeItem.tableKey}
                          placeholder="逻辑表名，如：company_info"
                          onChange={(e) => updateNode(index, { tableKey: e.target.value })}
                        />
                        <select
                          className={`${inputClass} col-span-2`}
                          value={nodeItem.schemaStatus}
                          onChange={(e) =>
                            updateNode(index, {
                              schemaStatus: e.target.value as TableSchemaStatus
                            })
                          }
                        >
                          <option value="exists">已建表</option>
                          <option value="planned">待建表</option>
                        </select>
                        <button
                          type="button"
                          onClick={() =>
                            setDraft({
                              ...draft,
                              nodes: renumber(draft.nodes.filter((_, i) => i !== index))
                            })
                          }
                          className="col-span-1 flex items-center justify-center text-slate-400 hover:text-rose-600"
                          title="移除"
                          disabled={draft.nodes.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          nodes: [...draft.nodes, { ...EMPTY_NODE, order: draft.nodes.length + 1 }]
                        })
                      }
                      className={`${secondaryBtnClass} flex items-center gap-1.5`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      添加节点
                    </button>
                  </div>
                  {errors.nodes && <p className={fieldErrorClass}>{errors.nodes}</p>}
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.isolated}
                    onChange={(e) => setDraft({ ...draft, isolated: e.target.checked })}
                    className="rounded border-slate-300"
                  />
                  <span className="text-sm text-slate-700">
                    与市场化数据隔离
                    <span className="block text-xs text-slate-400">
                      用于科研专项等不得与回款等市场化数据关联的场景
                    </span>
                  </span>
                </label>

                <div>
                  <label className={labelClass}>备注</label>
                  <textarea
                    className={inputClass}
                    rows={2}
                    value={draft.note}
                    onChange={(e) => setDraft({ ...draft, note: e.target.value })}
                    placeholder="选填"
                  />
                </div>

                <div>
                  <label className={labelClass}>状态</label>
                  <select
                    className={inputClass}
                    value={draft.status}
                    onChange={(e) => setDraft({ ...draft, status: e.target.value as MetricStatus })}
                  >
                    {(Object.keys(METRIC_STATUS_META) as MetricStatus[]).map((s) => (
                      <option key={s} value={s}>
                        {METRIC_STATUS_META[s].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={modalFooterClass}>
                <button onClick={() => setShowModal(false)} className={cancelBtnClass}>
                  取消
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
