/**
 * 数据指标配置中心的状态宿主。
 *
 * 为什么必须是 Context：AIChatSidebar 常驻挂载，而 MetricConfigModule 在切到配置页时
 * 也挂载 —— 两者会同时存活。同一个 storage key 的两个 usePersistentState 消费者之间
 * 不会实时同步（见 hooks/usePersistentState.ts 的文档），各读各的会导致「刚在配置页
 * 改完口径，回对话里还是旧值」。由 Provider 统一持有，两边读同一份 React 状态。
 *
 * config 与 history 的 key / version / default / migrate 一律未改，持久化格式逐字节不变 ——
 * usePersistentState 的文档早已把这次提升标记为「持久化格式不变，属纯重构」。
 */

import React, { createContext, useCallback, useContext, useMemo } from 'react';
import type {
  ChangeAction,
  ChangeLogEntry,
  ConfigArea,
  ConfigHistory,
  MetricConfig,
  QueryLogEntry
} from '../types';
import {
  CONFIG_OPERATOR,
  DEFAULT_METRIC_CONFIG,
  DEFAULT_METRIC_HISTORY,
  DEFAULT_QUERY_LOG,
  METRIC_CONFIG_STORAGE_KEY,
  METRIC_CONFIG_VERSION,
  METRIC_HISTORY_STORAGE_KEY,
  METRIC_HISTORY_VERSION,
  QUERY_LOG_STORAGE_KEY,
  QUERY_LOG_VERSION,
  migrateMetricConfig,
  migrateMetricHistory,
  migrateQueryLog
} from '../data/metricConfigDefaults';
import {
  bumpMinor,
  makeChangeEntry,
  makeQueryLogEntry,
  makeSnapshot,
  rollbackPayload,
  trimHistory,
  trimQueryLog
} from '../data/metricConfigHistory';
import { usePersistentState } from '../hooks/usePersistentState';

export interface MetricConfigContextValue {
  config: MetricConfig;
  history: ConfigHistory;
  queryLog: QueryLogEntry[];
  /** 唯一的配置写入路径。所有变更（含回滚与重置）都必须经过它，因此不可能漏掉审计。 */
  commit: (
    area: ConfigArea,
    action: ChangeAction,
    entityId: string,
    entityName: string,
    next: MetricConfig,
    fieldChanges: ChangeLogEntry['fieldChanges'],
    summary: string
  ) => void;
  rollback: (version: string) => void;
  reset: () => void;
  /** 记录一次提问。刻意不触碰 history —— 提问不是配置变更。 */
  logQuery: (entry: Omit<QueryLogEntry, 'id' | 'at'>) => void;
  clearQueryLog: () => void;
}

const MetricConfigContext = createContext<MetricConfigContextValue | null>(null);

function now(): string {
  return new Date().toISOString();
}

export function MetricConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = usePersistentState<MetricConfig>(
    METRIC_CONFIG_STORAGE_KEY,
    DEFAULT_METRIC_CONFIG,
    { version: METRIC_CONFIG_VERSION, migrate: migrateMetricConfig }
  );

  const [history, setHistory] = usePersistentState<ConfigHistory>(
    METRIC_HISTORY_STORAGE_KEY,
    DEFAULT_METRIC_HISTORY,
    { version: METRIC_HISTORY_VERSION, migrate: migrateMetricHistory }
  );

  const [queryLog, setQueryLog] = usePersistentState<QueryLogEntry[]>(
    QUERY_LOG_STORAGE_KEY,
    DEFAULT_QUERY_LOG,
    { version: QUERY_LOG_VERSION, migrate: migrateQueryLog }
  );

  const commit = useCallback<MetricConfigContextValue['commit']>(
    (area, action, entityId, entityName, next, fieldChanges, summary) => {
      const at = now();
      const version = bumpMinor(history.latestVersion);
      const stamped: MetricConfig = {
        ...next,
        configVersion: version,
        updatedAt: at,
        updatedBy: CONFIG_OPERATOR.name
      };

      setConfig(stamped);
      setHistory((prev) =>
        trimHistory({
          latestVersion: version,
          snapshots: [
            ...prev.snapshots,
            makeSnapshot(stamped, version, CONFIG_OPERATOR.name, summary)
          ],
          changeLog: [
            ...prev.changeLog,
            makeChangeEntry(
              version,
              area,
              entityId,
              entityName,
              action,
              fieldChanges,
              CONFIG_OPERATOR.name,
              action === 'rollback' || action === 'reset' ? '系统操作' : '所领导',
              at
            )
          ]
        })
      );
    },
    [history.latestVersion, setConfig, setHistory]
  );

  const rollback = useCallback(
    (version: string) => {
      const snapshot = history.snapshots.find((s) => s.version === version);
      if (!snapshot) return;
      if (!window.confirm(`确定回滚到 v${version} 吗？当前配置将被覆盖，该操作会记入审计。`)) {
        return;
      }

      const restored = rollbackPayload(
        snapshot.payload,
        CONFIG_OPERATOR.name,
        now(),
        METRIC_CONFIG_VERSION
      );

      commit(
        'metrics',
        'rollback',
        'config',
        '整份配置',
        restored,
        [
          {
            field: 'configVersion',
            label: '配置版本',
            before: config.configVersion,
            after: '(回滚后重新编号)'
          }
        ],
        `回滚至 v${version}`
      );
    },
    [history.snapshots, config.configVersion, commit]
  );

  const reset = useCallback(() => {
    if (!window.confirm('确定恢复默认配置吗？当前所有修改将被覆盖，该操作会记入审计。')) return;
    commit(
      'metrics',
      'reset',
      'config',
      '整份配置',
      DEFAULT_METRIC_CONFIG,
      [
        {
          field: 'configVersion',
          label: '配置版本',
          before: config.configVersion,
          after: '(重置后重新编号)'
        }
      ],
      '恢复默认配置'
    );
  }, [commit, config.configVersion]);

  const logQuery = useCallback<MetricConfigContextValue['logQuery']>(
    (entry) => {
      setQueryLog((prev) => trimQueryLog([...prev, makeQueryLogEntry(entry)]));
    },
    [setQueryLog]
  );

  const clearQueryLog = useCallback(() => setQueryLog([]), [setQueryLog]);

  const value = useMemo<MetricConfigContextValue>(
    () => ({ config, history, queryLog, commit, rollback, reset, logQuery, clearQueryLog }),
    [config, history, queryLog, commit, rollback, reset, logQuery, clearQueryLog]
  );

  return <MetricConfigContext.Provider value={value}>{children}</MetricConfigContext.Provider>;
}

export function useMetricConfig(): MetricConfigContextValue {
  const value = useContext(MetricConfigContext);
  if (!value) {
    throw new Error('useMetricConfig 必须在 <MetricConfigProvider> 内部使用');
  }
  return value;
}
