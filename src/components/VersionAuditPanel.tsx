/**
 * Tab6 版本与审计（需求说明 §2.6）。
 *
 * 三块内容：
 *   版本快照 —— 每次保存生成一个快照，可回滚。回滚本身也走 commit()，因此会再产生
 *               一条 rollback 审计记录，历史永不截断，所以回滚是非破坏性的。
 *   变更流水 —— 字段级 before → after 明细，字段设计对齐 operation_logs 表。
 *   查询日志 —— 向 AI 助手提问并命中配置的记录（提问人/角色/时间/命中项/是否可调用）。
 *               存于独立键，不递增 configVersion、不进入变更流水。
 *
 * 正式环境中查询日志、DSL 报文与 SQL 需留存不少于 3 年；前端演示实现保留最近 500 条，
 * 该差异以只读说明形式呈现在页脚。
 */

import React, { useState } from 'react';
import { History, RotateCcw, FileClock, ShieldCheck, AlertCircle, SearchCode, Trash2 } from 'lucide-react';
import type { ChangeAction, ConfigArea, ConfigHistory, QueryLogEntry, QueryLogOutcome } from '../types';
import { ROLE_PERMISSIONS } from '../types';
import { callableBadgeClass, notCallableBadgeClass, secondaryBtnClass } from './metricConfigStyles';

interface VersionAuditPanelProps {
  history: ConfigHistory;
  queryLog: QueryLogEntry[];
  currentVersion: string;
  onRollback: (version: string) => void;
  onClearQueryLog: () => void;
}

const AREA_LABELS: Record<ConfigArea, string> = {
  metrics: '指标配置',
  dimensions: '维度字典',
  joinChains: '表关联配置',
  statRules: '统计规则',
  permissions: '权限与脱敏',
  boundary: '大模型边界'
};

const ACTION_LABELS: Record<ChangeAction, string> = {
  create: '新增',
  update: '修改',
  delete: '删除',
  toggle: '启停',
  rollback: '回滚',
  reset: '重置'
};

const OUTCOME_LABELS: Record<QueryLogOutcome, string> = {
  answered_metric: '命中指标',
  answered_dimension: '命中维度',
  refused: '已拒绝'
};

const OUTCOME_BADGES: Record<QueryLogOutcome, string> = {
  answered_metric: 'bg-emerald-100 text-emerald-700',
  answered_dimension: 'bg-sky-100 text-sky-700',
  refused: 'bg-rose-100 text-rose-700'
};

const ACTION_BADGES: Record<ChangeAction, string> = {
  create: 'bg-emerald-100 text-emerald-700',
  update: 'bg-blue-100 text-blue-700',
  delete: 'bg-rose-100 text-rose-700',
  toggle: 'bg-slate-100 text-slate-600',
  rollback: 'bg-amber-100 text-amber-700',
  reset: 'bg-rose-100 text-rose-700'
};

function formatTime(iso: string): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('zh-CN', { hour12: false });
}

export default function VersionAuditPanel({
  history,
  queryLog,
  currentVersion,
  onRollback,
  onClearQueryLog
}: VersionAuditPanelProps) {
  const [tab, setTab] = useState<'snapshots' | 'changelog' | 'queryLog'>('snapshots');

  // 最新的快照就是当前状态，回滚它没有意义
  const latestSnapshotVersion = history.snapshots[history.snapshots.length - 1]?.version;
  const snapshots = [...history.snapshots].reverse();
  const changeLog = [...history.changeLog].reverse();
  const queries = [...queryLog].reverse();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">版本与审计</h3>
          <p className="text-sm text-slate-600">
            当前版本 <span className="font-mono font-semibold text-slate-800">v{currentVersion}</span>
            ，共 {history.snapshots.length} 个快照、{history.changeLog.length} 条变更流水、
            {queryLog.length} 条查询日志。
          </p>
        </div>
        <div className="flex bg-slate-50 border border-slate-200 rounded-md p-0.5">
          <button
            onClick={() => setTab('snapshots')}
            className={`flex items-center gap-1.5 text-[11px] px-3 py-1 rounded font-medium transition ${
              tab === 'snapshots' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            版本快照
          </button>
          <button
            onClick={() => setTab('changelog')}
            className={`flex items-center gap-1.5 text-[11px] px-3 py-1 rounded font-medium transition ${
              tab === 'changelog' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            <FileClock className="h-3.5 w-3.5" />
            变更流水
          </button>
          <button
            onClick={() => setTab('queryLog')}
            className={`flex items-center gap-1.5 text-[11px] px-3 py-1 rounded font-medium transition ${
              tab === 'queryLog' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            <SearchCode className="h-3.5 w-3.5" />
            查询日志
          </button>
        </div>
      </div>

      {tab === 'snapshots' && (
        <>
          {snapshots.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
              <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">暂无版本快照，修改任意配置后自动生成</p>
            </div>
          ) : (
            <div className="space-y-3">
              {snapshots.map((snapshot) => {
                const isCurrent = snapshot.version === latestSnapshotVersion;
                return (
                  <div
                    key={snapshot.version}
                    className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm font-semibold text-slate-900">
                          v{snapshot.version}
                        </span>
                        {isCurrent && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
                            当前版本
                          </span>
                        )}
                        <span className="text-xs text-slate-500">{snapshot.operator}</span>
                        <span className="text-xs text-slate-400">{formatTime(snapshot.at)}</span>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-600">{snapshot.summary}</p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        含 {snapshot.payload.metrics.length} 项指标 ·{' '}
                        {snapshot.payload.dimensions.length} 个维度 ·{' '}
                        {snapshot.payload.joinChains.length} 条链路
                      </p>
                    </div>
                    <button
                      onClick={() => onRollback(snapshot.version)}
                      disabled={isCurrent}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
                        isCurrent
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      回滚至此
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {tab === 'changelog' && (
        <>
          {changeLog.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
              <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">暂无变更记录</p>
            </div>
          ) : (
            <div className="space-y-3">
              {changeLog.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-xl border border-slate-100 shadow-sm p-4"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-semibold text-slate-900">
                      v{entry.version}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${ACTION_BADGES[entry.action]}`}
                    >
                      {ACTION_LABELS[entry.action]}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                      {AREA_LABELS[entry.area]}
                    </span>
                    <span className="text-xs text-slate-700">{entry.entityName}</span>
                    <span className="text-xs text-slate-400">
                      {entry.operator} · {formatTime(entry.at)}
                    </span>
                  </div>

                  {entry.fieldChanges.length > 0 ? (
                    <div className="mt-3 border border-slate-100 rounded-lg overflow-hidden">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-[10px] text-slate-500 uppercase">
                            <th className="py-1.5 px-3 font-medium">字段</th>
                            <th className="py-1.5 px-3 font-medium">变更前</th>
                            <th className="py-1.5 px-3 font-medium">变更后</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {entry.fieldChanges.map((change, index) => (
                            <tr key={`${change.field}-${index}`}>
                              <td className="py-2 px-3 text-slate-600">{change.label}</td>
                              <td className="py-2 px-3 text-slate-500 line-through decoration-slate-300">
                                {change.before}
                              </td>
                              <td className="py-2 px-3 text-slate-800">{change.after}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="mt-2 text-xs text-slate-400">
                      {entry.action === 'rollback'
                        ? '整份配置回滚，字段级差异见目标版本快照'
                        : '无字段级明细'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'queryLog' && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              记录向 AI 助手提问并命中配置的细节。未命中配置的提问走存量对话逻辑，不在此记录。
            </p>
            {queryLog.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('确定清空全部查询日志吗？该操作不可撤销。')) onClearQueryLog();
                }}
                className={`${secondaryBtnClass} flex items-center gap-1.5`}
              >
                <Trash2 className="h-3.5 w-3.5" />
                清空日志
              </button>
            )}
          </div>

          {queries.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
              <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">暂无查询日志，向 AI 助手提问命中配置后自动记录</p>
            </div>
          ) : (
            <div className="space-y-3">
              {queries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-xl border border-slate-100 shadow-sm p-4"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${OUTCOME_BADGES[entry.outcome]}`}
                    >
                      {OUTCOME_LABELS[entry.outcome]}
                    </span>
                    <span className="text-xs text-slate-700">
                      {entry.metricName ?? entry.dimensionName ?? '—'}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        entry.callable ? callableBadgeClass : notCallableBadgeClass
                      }`}
                    >
                      {entry.callable ? '可调用' : '不可调用'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {entry.asker}（{ROLE_PERMISSIONS[entry.role]?.name ?? entry.role}） ·{' '}
                      {formatTime(entry.at)}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-800">{entry.question}</p>

                  {entry.hitTerm && (
                    <p className="mt-1.5 text-[11px] text-slate-500">
                      命中词汇「{entry.hitTerm}」→{' '}
                      <code className="font-mono text-slate-700">
                        {entry.metricCode ?? entry.dimensionCode ?? '—'}
                      </code>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* 审计留存策略（只读说明） */}
      <div className="flex items-start gap-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg">
        <ShieldCheck className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-600 space-y-1">
          <p>留存策略（只读）：配置变更随版本升级留存；查询日志、DSL 报文、SQL、账号与时间需留存不少于 3 年，时间口径为北京时间。</p>
          <p>关联规则（表关联配置）的变更需经甲乙双方技术评审后方可发布。</p>
          <p className="text-slate-400">
            当前为前端演示实现，记录保存在浏览器本地：最近 50 个快照、2000 条变更流水、500 条查询日志。
            查询日志独立存放于 saibao.metricConfig.queryLog，不参与配置版本递增。
          </p>
        </div>
      </div>
    </div>
  );
}
