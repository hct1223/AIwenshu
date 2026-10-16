/**
 * 基于 localStorage 的持久化状态 hook —— 项目中的第一处持久化实现。
 *
 * 存储格式使用信封包装：
 *   { "version": 1, "data": <值> }
 * 外层 version 为权威版本号，将来迁移结构时无需更换存储键。
 *
 * 容错策略（全部静默降级，绝不因存储问题导致页面崩溃）：
 *   - 无 window / 无 localStorage（SSR、隐私模式、被禁用）→ 直接用默认值
 *   - JSON 解析失败或校验不通过 → 清除损坏数据并回退默认值，仅 console.warn
 *   - 写入失败（QuotaExceededError 等）→ 忽略，状态仍在内存中可用
 *
 * 已知局限：两个同时挂载的消费方之间不会实时同步，只在刷新时对齐、后写者胜。
 * 当前只有一个页面消费该配置，若将来出现第二个消费方需要实时联动，
 * 应把本 hook 提升到 App.tsx 的 Context Provider 中（持久化格式不变，属纯重构）。
 */

import { useCallback, useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

export interface PersistentStateOptions<T> {
  /** 当前结构版本号，默认 1 */
  version?: number;
  /** 版本不匹配时的迁移函数；返回 null 表示回退默认值 */
  migrate?: (data: unknown, fromVersion: number) => T | null;
  /** 可选的形状守卫；不通过则回退默认值 */
  validate?: (data: unknown) => data is T;
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage ?? null;
  } catch {
    // 某些浏览器的隐私模式下访问 localStorage 本身就会抛错
    return null;
  }
}

function readPersisted<T>(
  key: string,
  defaultValue: T,
  options: PersistentStateOptions<T>
): T {
  const storage = getStorage();
  if (!storage) return defaultValue;

  const version = options.version ?? 1;
  let raw: string | null = null;
  try {
    raw = storage.getItem(key);
  } catch {
    return defaultValue;
  }
  if (!raw) return defaultValue;

  let envelope: unknown;
  try {
    envelope = JSON.parse(raw);
  } catch {
    console.warn(`[usePersistentState] "${key}" 内容不是合法 JSON，已清除并回退默认值`);
    clearStorage(storage, key);
    return defaultValue;
  }

  // 兼容没有信封的裸值（例如被手工写入的测试数据）
  const isEnvelope =
    envelope !== null && typeof envelope === 'object' && 'version' in envelope && 'data' in envelope;

  if (!isEnvelope) {
    console.warn(`[usePersistentState] "${key}" 缺少 version/data 信封结构，已清除并回退默认值`);
    clearStorage(storage, key);
    return defaultValue;
  }

  const { version: storedVersion, data } = envelope as { version: unknown; data: unknown };

  if (typeof storedVersion !== 'number') {
    console.warn(`[usePersistentState] "${key}" 的 version 字段非法，已清除并回退默认值`);
    clearStorage(storage, key);
    return defaultValue;
  }

  if (storedVersion !== version) {
    if (!options.migrate) {
      console.warn(
        `[usePersistentState] "${key}" 版本不匹配（存储 ${storedVersion}，当前 ${version}）且未提供迁移函数，回退默认值`
      );
      return defaultValue;
    }
    const migrated = options.migrate(data, storedVersion);
    if (migrated === null) {
      console.warn(
        `[usePersistentState] "${key}" 迁移失败（存储版本 ${storedVersion}），回退默认值`
      );
      return defaultValue;
    }
    return migrated;
  }

  if (options.validate && !options.validate(data)) {
    console.warn(`[usePersistentState] "${key}" 未通过校验，已清除并回退默认值`);
    clearStorage(storage, key);
    return defaultValue;
  }

  return data as T;
}

function clearStorage(storage: Storage, key: string): void {
  try {
    storage.removeItem(key);
  } catch {
    // 忽略：清除失败不影响本次回退默认值
  }
}

/**
 * @returns [值, 设置函数, 恢复默认值]
 */
export function usePersistentState<T>(
  key: string,
  defaultValue: T,
  options: PersistentStateOptions<T> = {}
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const version = options.version ?? 1;

  // 惰性初始化：仅在挂载时读一次存储。
  // StrictMode 下初始化函数会被调用两次，但它是纯读操作，无副作用。
  const [value, setValue] = useState<T>(() => readPersisted(key, defaultValue, options));

  // 写入是幂等的，因此 StrictMode 下 effect 执行两次也不会产生副作用。
  // 这是刻意保留的行为，请勿"修复"。
  useEffect(() => {
    const storage = getStorage();
    if (!storage) return;
    try {
      storage.setItem(key, JSON.stringify({ version, data: value }));
    } catch {
      // 写入失败（配额超限等）时静默忽略，状态仍在内存中可用
    }
  }, [key, version, value]);

  const resetToDefaults = useCallback(() => {
    const storage = getStorage();
    if (storage) clearStorage(storage, key);
    setValue(defaultValue);
    // defaultValue 通常是模块级常量，引用稳定
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, setValue, resetToDefaults];
}
