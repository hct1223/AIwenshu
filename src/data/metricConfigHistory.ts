/**
 * 版本与审计的纯函数。
 *
 * 本文件不依赖 React，也不接触 localStorage —— 只做数据变换，
 * 由 MetricConfigModule 的 commit() 统一调用，保证所有写入都经过审计。
 *
 * 防递归说明：VersionSnapshot.payload 的类型是 MetricConfig，而 MetricConfig
 * 不含 snapshots / changeLog 字段，历史另存于 saibao.metricConfig.history 键。
 * 因此快照在任何深度上都不可能包含历史，这是类型层面的保证，而非约定。
 */

import type {
  ChangeLogEntry,
  ConfigHistory,
  FieldChange,
  MetricConfig,
  QueryLogEntry,
  VersionSnapshot
} from '../types';

/** 保留上限，超出丢弃最旧的。约 30KB/快照 × 50 ≈ 1.5MB，安全低于 5MB 配额。 */
export const HISTORY_RETENTION = {
  snapshots: 50,
  changeLog: 2000
};

/** 查询日志保留上限。约 250 字节/条 × 500 ≈ 125KB。 */
export const QUERY_LOG_RETENTION = 500;

/** 小版本号递增：'1.7' → '1.8'。非法输入按 '1.0' 处理。 */
export function bumpMinor(version: string): string {
  const parts = version.split('.');
  const major = Number(parts[0]);
  const minor = Number(parts[1]);
  if (!Number.isFinite(major) || !Number.isFinite(minor)) return '1.1';
  return `${major}.${minor + 1}`;
}

/** 把任意值渲染成可读的短字符串，用于变更明细的 before/after 展示 */
function render(value: unknown): string {
  if (value === null || value === undefined) return '（空）';
  if (Array.isArray(value)) {
    return value.length === 0 ? '（空）' : value.join('、');
  }
  if (typeof value === 'object') return JSON.stringify(value);
  if (typeof value === 'boolean') return value ? '是' : '否';
  return String(value);
}

/**
 * 比较两个记录，产出字段级变更明细。
 * labels 提供字段的中文名，缺失时回退到字段名本身。
 *
 * 泛型约束用 `object` 而非 `Record<string, unknown>`：TS 的 interface 没有隐式索引
 * 签名，后者会导致所有接口类型的调用点报错。
 */
export function diffRecords<T extends object>(
  before: T | null,
  after: T | null,
  labels: Partial<Record<keyof T, string>> = {}
): FieldChange[] {
  const changes: FieldChange[] = [];

  const read = (source: T, key: string): unknown =>
    (source as unknown as Record<string, unknown>)[key];

  if (!before && after) {
    // 新增：只记录有值的字段
    Object.keys(after).forEach((key) => {
      const value = read(after, key);
      if (value === undefined || value === null) return;
      changes.push({
        field: key,
        label: labels[key as keyof T] ?? key,
        before: '（新增）',
        after: render(value)
      });
    });
    return changes;
  }

  if (before && !after) {
    // 删除：记录被删掉的值
    Object.keys(before).forEach((key) => {
      const value = read(before, key);
      if (value === undefined || value === null) return;
      changes.push({
        field: key,
        label: labels[key as keyof T] ?? key,
        before: render(value),
        after: '（已删除）'
      });
    });
    return changes;
  }

  if (!before || !after) return changes;

  const keys = new Set<string>([...Object.keys(before), ...Object.keys(after)]);
  keys.forEach((key) => {
    const bs = render(read(before, key));
    const as = render(read(after, key));
    if (bs !== as) {
      changes.push({
        field: key,
        label: labels[key as keyof T] ?? key,
        before: bs,
        after: as
      });
    }
  });

  return changes;
}

/** 生成一条版本快照 */
export function makeSnapshot(
  config: MetricConfig,
  version: string,
  operator: string,
  summary: string
): VersionSnapshot {
  return {
    version,
    at: config.updatedAt,
    operator,
    summary,
    // 深拷贝，避免快照与当前配置共享引用后被后续变更污染
    payload: JSON.parse(JSON.stringify(config)) as MetricConfig
  };
}

/** 生成一条变更流水 */
export function makeChangeEntry(
  version: string,
  area: ChangeLogEntry['area'],
  entityId: string,
  entityName: string,
  action: ChangeLogEntry['action'],
  fieldChanges: FieldChange[],
  operator: string,
  operatorRole: string,
  at: string
): ChangeLogEntry {
  return {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    version,
    area,
    entityId,
    entityName,
    action,
    fieldChanges,
    operator,
    operatorRole,
    at
  };
}

/** 生成一条查询日志 */
export function makeQueryLogEntry(
  entry: Omit<QueryLogEntry, 'id' | 'at'>
): QueryLogEntry {
  return {
    ...entry,
    id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString()
  };
}

/** 查询日志的保留上限裁剪 */
export function trimQueryLog(log: QueryLogEntry[]): QueryLogEntry[] {
  return log.length > QUERY_LOG_RETENTION ? log.slice(-QUERY_LOG_RETENTION) : log;
}

/** 应用保留上限，丢弃最旧的记录 */
export function trimHistory(history: ConfigHistory): ConfigHistory {
  const snapshots =
    history.snapshots.length > HISTORY_RETENTION.snapshots
      ? history.snapshots.slice(-HISTORY_RETENTION.snapshots)
      : history.snapshots;

  const changeLog =
    history.changeLog.length > HISTORY_RETENTION.changeLog
      ? history.changeLog.slice(-HISTORY_RETENTION.changeLog)
      : history.changeLog;

  return { ...history, snapshots, changeLog };
}

/** 从快照取回配置载荷，并刷新人/时间，使其成为一次新的变更 */
export function rollbackPayload(
  payload: MetricConfig,
  operator: string,
  at: string,
  schemaVersion: number
): MetricConfig {
  return {
    ...(JSON.parse(JSON.stringify(payload)) as MetricConfig),
    schemaVersion,
    updatedAt: at,
    updatedBy: operator
  };
}
