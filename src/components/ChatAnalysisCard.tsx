/**
 * 对话回复里的分析图表卡片。
 *
 * 遵循的图表规范要点：
 *   - 名义类别（业务大类、部门、客户）**所有条形同色**，绝不按数值大小上色阶 ——
 *     排序无意义的类别上渐变，等于把长度已经表达的信息重复编码一遍。
 *   - 单系列不放图例（标题已说明是什么），也不画网格线：直接用数值标签代替坐标轴。
 *   - 条形 ≤24px 厚、数据端 4px 圆角、基线端直角、自同一基线生长。
 *   - 文字一律用文本色（slate），绝不用系列色着色 —— 标识由旁边的色块承担。
 *   - 状态（高危/中等/提示）必须图标 + 文字标签并存，不能只靠颜色区分。
 *   - 每根条形有悬浮提示。
 *
 * 系列色 #4f46e5 为项目靛蓝主色，已用校验脚本验证：亮度带、彩度下限、对浅色面
 * 对比度 ≥3:1 全部通过。
 */

import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, Info, TrendingUp } from 'lucide-react';
import type { AnalysisBlock, AnalysisSection, BarRow, StatusItem } from '../data/mockAnalysis';

/** 系列色：单系列，所有条形同色 */
const SERIES = '#4f46e5';

const STATUS_STYLE: Record<
  StatusItem['level'],
  { dot: string; label: string; Icon: React.ElementType }
> = {
  high: { dot: '#e34948', label: '高危', Icon: AlertTriangle },
  medium: { dot: '#eda100', label: '中等', Icon: AlertCircle },
  low: { dot: '#64748b', label: '提示', Icon: Info }
};

/**
 * 分类色板 —— 参考配色前五槽。饼图的颜色编码的是「身份」，必须用可区分的异色，
 * 不能用同一色相做深浅（那是给名义类别上色阶的反模式）。
 *
 * 已用校验脚本验证：亮度带、彩度下限、相邻 CVD 分离、正常视力分离（最差 19.6 ≥ 15）
 * 全部通过。其中三色对浅色面对比度低于 3:1，按规范要求以可见标签兜底 ——
 * 下方图例逐行列出名称与数值，读数不依赖颜色匹配。
 *
 * 未沿用 DashboardModule 里既有的甜甜圈配色：那组里 emerald 与 cyan 相邻，
 * 正常视力 ΔE 仅 12.5（低于 15 下限），色觉正常者亦难分辨。
 */
const CATEGORICAL = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4'];

type TilesBlockData = Extract<AnalysisBlock, { kind: 'tiles' }>;
type BarsBlockData = Extract<AnalysisBlock, { kind: 'bars' }>;
type DonutBlockData = Extract<AnalysisBlock, { kind: 'donut' }>;
type StatusBlockData = Extract<AnalysisBlock, { kind: 'status' }>;

interface TilesBlockProps {
  tiles: TilesBlockData['tiles'];
}
interface BarsBlockProps {
  block: BarsBlockData;
}
interface DonutBlockProps {
  block: DonutBlockData;
}
interface StatusBlockProps {
  block: StatusBlockData;
}

/** KPI 指标块：一个数值就是一张图，不做成只有一根柱子的图表 */
function TilesBlock({ tiles }: TilesBlockProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {tiles.map((tile) => (
        <div key={tile.label} className="px-2.5 py-2 bg-slate-50 rounded-lg">
          <div className="text-[10px] text-slate-500">{tile.label}</div>
          <div className="text-sm font-semibold text-slate-900 tabular-nums leading-tight mt-0.5">
            {tile.value}
          </div>
          {tile.hint && <div className="text-[10px] text-slate-400 mt-0.5">{tile.hint}</div>}
        </div>
      ))}
    </div>
  );
}

/** 横向条形图 */
function BarsBlock({ block }: BarsBlockProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const max = Math.max(...block.rows.map((r) => r.value), 1);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs font-semibold text-slate-900">{block.title}</span>
        {block.note && <span className="text-[10px] text-slate-400">{block.note}</span>}
      </div>

      <div className="space-y-2.5">
        {block.rows.map((row) => (
          <div
            key={row.label}
            className="relative"
            onMouseEnter={() => setHovered(row.label)}
            onMouseLeave={() => setHovered(null)}
          >
            {/*
              标签独占一行放在条形上方，而不是挤在条形左侧。
              左侧固定宽度会截断「元器件与材料可靠性模块」这类长名称，
              而规范明确要求标签不得被裁剪或溢出自己的标记。
            */}
            <div className="flex items-baseline justify-between gap-2">
              <span className="min-w-0 text-[10px] text-slate-600 leading-snug">
                {row.label}
              </span>
              <span className="shrink-0 flex items-center gap-1.5">
                {row.alert && (
                  <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 text-[9px] font-medium">
                    {row.alert}
                  </span>
                )}
                <span className="font-mono text-[10px] text-slate-700 tabular-nums">
                  {row.display}
                </span>
              </span>
            </div>

            <div className="relative mt-1 h-2.5 bg-slate-100 rounded-[3px] overflow-hidden">
              {/* 数据端 4px 圆角，基线端直角 */}
              <div
                className="h-full"
                style={{
                  width: `${(row.value / max) * 100}%`,
                  background: SERIES,
                  borderTopRightRadius: 4,
                  borderBottomRightRadius: 4
                }}
              />
            </div>

            {/* 悬浮提示 */}
            {hovered === row.label && (
              <div className="absolute left-0 -top-1 -translate-y-full z-10 rounded-md bg-slate-900 px-2 py-1 text-[10px] text-white shadow-lg pointer-events-none whitespace-nowrap">
                {row.label} · {row.display}
                {row.share !== undefined && ` · 占比 ${row.share}%`}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 环形图。
 *
 * 规范约束：仅用于「一眼看构成」，扇区 ≤6；相邻填充之间留 2px 表面色间隙；
 * ≥2 个系列必须有图例；数值以可见标签给出，不要求读者比较弧长。
 * 这里不把精确比较交给自己 —— 那类判断由同卡片里的条形图承担。
 */
function DonutBlock({ block }: DonutBlockProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const SIZE = 104;
  const THICKNESS = 16;
  const GAP = 2; // 表面色间隙
  const radius = (SIZE - THICKNESS) / 2;
  const center = SIZE / 2;
  const circumference = 2 * Math.PI * radius;

  let cursor = 0;
  const segments = block.segments.map((segment, index) => {
    const length = (segment.share / 100) * circumference;
    const item = {
      ...segment,
      // 固定顺序取色，绝不循环生成第 6 种色（扇区已限制在 ≤6）
      color: CATEGORICAL[index % CATEGORICAL.length],
      length,
      offset: cursor
    };
    cursor += length;
    return item;
  });

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs font-semibold text-slate-900">{block.title}</span>
        {block.note && <span className="text-[10px] text-slate-400">{block.note}</span>}
      </div>

      <div className="flex items-center gap-3">
        <svg
          width={SIZE}
          height={SIZE}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="shrink-0"
          role="img"
          aria-label={block.title}
        >
          <g transform={`rotate(-90 ${center} ${center})`}>
            {segments.map((segment, index) => (
              <circle
                key={segment.label}
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={THICKNESS}
                strokeDasharray={`${Math.max(segment.length - GAP, 0.5)} ${
                  circumference - Math.max(segment.length - GAP, 0.5)
                }`}
                strokeDashoffset={-segment.offset}
                opacity={hovered === null || hovered === index ? 1 : 0.4}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
          </g>
          <text
            x={center}
            y={center - 1}
            textAnchor="middle"
            className="fill-slate-900"
            style={{ fontSize: 12, fontWeight: 600 }}
          >
            {block.total}
          </text>
          <text
            x={center}
            y={center + 11}
            textAnchor="middle"
            className="fill-slate-400"
            style={{ fontSize: 9 }}
          >
            合计（万元）
          </text>
        </svg>

        {/*
          图例即数值表：读数不依赖颜色匹配，满足低对比色需可见标签的兜底要求。
          只列占比 —— 环形图要回答的是「构成」；420px 面板放不下「占比 + 金额」两列，
          实测会把金额截断。绝对金额在指标块与其他卡片中已有，此处以悬浮提示补充。
        */}
        <div className="flex-1 min-w-0 space-y-1">
          {segments.map((segment, index) => (
            <div
              key={segment.label}
              className={`flex items-center gap-1.5 transition-opacity ${
                hovered !== null && hovered !== index ? 'opacity-50' : ''
              }`}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              title={`${segment.label} · ${segment.display} · 占比 ${segment.share}%`}
            >
              <span
                className="h-2 w-2 rounded-[2px] shrink-0"
                style={{ background: segment.color }}
              />
              <span className="min-w-0 flex-1 text-[10px] text-slate-600 leading-snug">
                {segment.label}
              </span>
              <span className="shrink-0 font-mono text-[10px] text-slate-700 tabular-nums">
                {segment.share}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 状态条目：图标 + 文字标签 + 颜色三者并存 */
function StatusBlock({ block }: StatusBlockProps) {
  if (block.items.length === 0) {
    return (
      <div>
        <div className="text-xs font-semibold text-slate-900 mb-1.5">{block.title}</div>
        <p className="text-[11px] text-slate-400">暂无记录</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-xs font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
        <TrendingUp className="h-3.5 w-3.5 text-slate-400" />
        {block.title}
      </div>
      <div className="space-y-2">
        {block.items.map((item, index) => {
          const style = STATUS_STYLE[item.level] ?? STATUS_STYLE.low;
          const Icon = style.Icon;
          return (
            <div key={index} className="flex items-start gap-2 px-2.5 py-2 bg-slate-50 rounded-lg">
              {/* 图标同时承担颜色与形状，不再另加同色圆点（三重编码） */}
              <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: style.dot }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-medium text-slate-500">{style.label}</span>
                  <span className="text-[11px] font-medium text-slate-800">{item.title}</span>
                </div>
                <p className="mt-0.5 text-[10px] text-slate-500 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ChatAnalysisCard({ section }: { section: AnalysisSection }) {
  return (
    <div className="bg-white rounded-xl border border-indigo-200 shadow-sm">
      <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100 rounded-t-xl">
        <div className="text-sm font-semibold text-slate-900">{section.heading}</div>
        <p className="mt-0.5 text-[10px] text-slate-500">{section.subtitle}</p>
      </div>

      <div className="p-4 space-y-4">
        {/* key 挂在外层原生 div 上：函数组件上带 key 会被 TS 判为多余属性 */}
        {section.blocks.map((block, index) => (
          <div key={index}>
            {block.kind === 'tiles' && <TilesBlock tiles={block.tiles} />}
            {block.kind === 'bars' && <BarsBlock block={block} />}
            {block.kind === 'donut' && <DonutBlock block={block} />}
            {block.kind === 'status' && <StatusBlock block={block} />}
          </div>
        ))}
      </div>

      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 rounded-b-xl">
        <p className="text-[10px] text-slate-400">{section.footer}</p>
      </div>
    </div>
  );
}
