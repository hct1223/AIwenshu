/**
 * 字符串列表编辑器（芯片 + 输入框）。
 *
 * 被多个面板复用：统计规则的节点优先级/纳入/剔除状态、维度的口语别名、
 * 指标的关联数据表等。
 */

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { inputClass } from './metricConfigStyles';

interface StringListEditorProps {
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  /** 空列表时展示的提示 */
  emptyHint?: string;
}

export default function StringListEditor({
  values,
  onChange,
  placeholder = '输入后回车添加',
  emptyHint = '暂无条目'
}: StringListEditorProps) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const value = draft.trim();
    if (!value) return;
    if (values.includes(value)) {
      setDraft('');
      return;
    }
    onChange([...values, value]);
    setDraft('');
  };

  const removeAt = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      {values.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {values.map((value, index) => (
            <span
              key={`${value}-${index}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-xs text-slate-700"
            >
              {value}
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="text-slate-400 hover:text-rose-600 transition-colors"
                title="移除"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400">{emptyHint}</p>
      )}

      <div className="flex gap-2">
        <input
          className={inputClass}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors shrink-0"
          title="添加"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
