/**
 * 对话助手的「四个方向」分析 —— 纯函数，零 React 依赖。
 *
 * 对应欢迎语里承诺的四项能力：
 *   📊 企业整体经营概况
 *   📈 各业务板块运行数据
 *   👥 重点客户合作现状
 *   ⚠️ 经营风险与项目预警
 *
 * 全部基于 src/data/mockData.ts 的模拟数据现场计算（即 COMP_MOCK_LIST / GROUP_MOCK_LIST）。
 * 与配置中心的口径回答不同：这里真的产出数值，因此界面必须标注数据来源为模拟数据
 * （见 MOCK_DERIVED_TYPES）。
 *
 * 本模块返回**结构化数据**而非成稿文本 —— 数值优先交给图表渲染（ChatAnalysisCard），
 * 文字只保留结论与提示，避免同一批数字被文字和图表重复播报。
 */

import { COMP_MOCK_LIST, GROUP_MOCK_LIST } from './mockData';
import type { Company } from '../types';

// ============================================================
// 结构化产出的类型
// ============================================================

/** KPI 指标块：承载单个数值，不做成只有一根柱子的图表 */
export interface StatTile {
  label: string;
  value: string;
  hint?: string;
}

/** 横向条形的一行 */
export interface BarRow {
  label: string;
  value: number;
  /** 显示用数值（已格式化） */
  display: string;
  /** 占比 0-100，可选 */
  share?: number;
  /** 超阈值等需要额外提示的行，用状态点标注而非改变条形颜色 */
  alert?: string;
}

/** 状态条目：风险提示等，必须图标 + 文字标签，不能只靠颜色 */
export interface StatusItem {
  level: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
}

/**
 * 饼图/环形图的扇区。
 *
 * 仅用于「一眼看构成」的场景，且严格限制扇区数 —— 规范要求 ≤6 个，
 * 并且不能用它比较接近的数值（那类比较交给条形图）。
 */
export interface DonutSegment {
  label: string;
  value: number;
  display: string;
  /** 占比 0-100 */
  share: number;
}

export type AnalysisBlock =
  | { kind: 'tiles'; tiles: StatTile[] }
  | { kind: 'bars'; title: string; note?: string; rows: BarRow[] }
  | { kind: 'donut'; title: string; note?: string; total: string; segments: DonutSegment[] }
  | { kind: 'status'; title: string; items: StatusItem[] };

export interface AnalysisSection {
  heading: string;
  subtitle: string;
  blocks: AnalysisBlock[];
  footer: string;
}

// ============================================================
// 基础派生量
// ============================================================

/** 业务大类 → 企业指标字段 */
export const BUSINESS_FIELDS = [
  { key: 'testingAmount', label: '检验检测' },
  { key: 'certAmount', label: '认证评估' },
  { key: 'calibrationAmount', label: '计量校准' },
  { key: 'devAmount', label: '产品开发' },
  { key: 'trainingAmount', label: 'TSQ培训' }
] as const;

/** 风险指数阈值，与既有页面口径保持一致 */
export const RISK_INDEX_THRESHOLD = 15;
/** 低评分关注线 */
export const LOW_SCORE_THRESHOLD = 85;

/** 取企业最新年度的指标记录（mock 数据按年份升序存放） */
export function latestMetric(company: Company) {
  return company.metrics.length > 0 ? company.metrics[company.metrics.length - 1] : null;
}

/** 企业最新年度合作总额（万元） */
export function companyTotal(company: Company): number {
  const metric = latestMetric(company);
  if (!metric) return 0;
  return BUSINESS_FIELDS.reduce((sum, field) => sum + (metric[field.key] ?? 0), 0);
}

/** 部门名归并：去掉括号中的说明（如「技推处 (技术创新与成果推广)」→「技推处」） */
export function normalizeDeptName(name: string): string {
  return name.replace(/\s*[（(].*$/, '').trim();
}

function fmtWan(n: number): string {
  return `¥${n.toLocaleString('zh-CN')}`;
}

function pct(part: number, whole: number): number {
  return whole > 0 ? Number(((part / whole) * 100).toFixed(1)) : 0;
}

/** 模拟数据的统计年份 */
export function dataYear(): string {
  return COMP_MOCK_LIST.length > 0 ? latestMetric(COMP_MOCK_LIST[0])?.year ?? '' : '';
}

// ============================================================
// 意图判定
// ============================================================

// 注意：这些关键词刻意避开「经营情况」「数据」等已被既有分支占用的词。
// 特别是「经营情况」——「生成企业经营情况月报」必须继续落到月报分支。
export const isBusinessOverviewQuery = (query: string): boolean =>
  ['概况', '总览', '全景', '整体经营', '经营概览'].some((k) => query.includes(k));

export const isSegmentPerformanceQuery = (query: string): boolean => query.includes('板块');

export const isKeyCustomerQuery = (query: string): boolean =>
  ['重点客户', '大客户', '核心客户', '战略客户'].some((k) => query.includes(k));

export const isRiskAlertQuery = (query: string): boolean =>
  query.includes('风险') || query.includes('预警');

// ============================================================
// 四个分析
// ============================================================

/** 📊 企业整体经营概况 */
export function buildBusinessOverview(): AnalysisSection {
  const total = COMP_MOCK_LIST.reduce((sum, c) => sum + companyTotal(c), 0);
  const avg = (pick: (c: Company) => number) =>
    (COMP_MOCK_LIST.reduce((sum, c) => sum + pick(c), 0) / COMP_MOCK_LIST.length).toFixed(1);

  const strategic = COMP_MOCK_LIST.filter((c) => c.partnershipLevel.includes('战略')).length;
  const core = COMP_MOCK_LIST.filter((c) => c.partnershipLevel.includes('核心')).length;
  const high = COMP_MOCK_LIST.filter((c) => c.growthCategory === '高增长类').length;
  const steady = COMP_MOCK_LIST.filter((c) => c.growthCategory === '稳健型').length;

  const ranked = [...COMP_MOCK_LIST].sort((a, b) => companyTotal(b) - companyTotal(a));

  return {
    heading: '📊 企业整体经营概况',
    subtitle: `统计口径：${dataYear()} 年度 · 金额单位：万元`,
    blocks: [
      {
        kind: 'tiles',
        tiles: [
          { label: '年度合作总额', value: fmtWan(total), hint: '万元' },
          { label: '在库客户', value: `${COMP_MOCK_LIST.length}`, hint: '家' },
          { label: '覆盖集团', value: `${GROUP_MOCK_LIST.length}`, hint: '个' },
          { label: '平均智能评分', value: avg((c) => c.aiScore), hint: '分' },
          { label: '平均合规率', value: `${avg((c) => c.complianceRating)}%` },
          { label: '平均风险指数', value: avg((c) => c.riskIndex), hint: '越低越好' },
          {
            label: '合作层级',
            value: `${strategic} / ${core}`,
            hint: `战略级 ${strategic} 家 · 核心供应商 ${core} 家`
          },
          {
            label: '增长类别',
            value: `${high} / ${steady}`,
            hint: `高增长类 ${high} 家 · 稳健型 ${steady} 家`
          }
        ]
      },
      {
        kind: 'bars',
        title: '各客户年度合作额',
        note: `合计 ${fmtWan(total)} 万元`,
        rows: ranked.map((c) => ({
          label: c.name.replace(/有限公司|股份有限公司|\(.*\)/g, '').trim(),
          value: companyTotal(c),
          display: fmtWan(companyTotal(c)),
          share: pct(companyTotal(c), total)
        }))
      }
    ],
    footer: '数据来源：系统内置模拟台账'
  };
}

/** 📈 各业务板块运行数据 */
export function buildSegmentPerformance(): AnalysisSection {
  const byBusiness = BUSINESS_FIELDS.map((field) => ({
    label: field.label,
    amount: COMP_MOCK_LIST.reduce((sum, c) => sum + (latestMetric(c)?.[field.key] ?? 0), 0)
  })).sort((a, b) => b.amount - a.amount);
  const businessTotal = byBusiness.reduce((sum, b) => sum + b.amount, 0);

  // 部门维度：跨企业归并同名部门
  const deptMap = new Map<string, number>();
  COMP_MOCK_LIST.forEach((c) => {
    c.deptContributions.forEach((d) => {
      const key = normalizeDeptName(d.name);
      deptMap.set(key, (deptMap.get(key) ?? 0) + d.amount);
    });
  });
  const depts = [...deptMap.entries()]
    .map(([label, amount]) => ({ label, amount }))
    .sort((a, b) => b.amount - a.amount);
  const deptTotal = depts.reduce((sum, d) => sum + d.amount, 0);

  return {
    heading: '📈 各业务板块运行数据',
    subtitle: `统计口径：${dataYear()} 年度 · 金额单位：万元`,
    blocks: [
      {
        // 构成类数据：一眼看「检测占了多大头」，5 个扇区在 ≤6 的限制内。
        // 精确比较（谁比谁多多少）交给下面的条形图。
        kind: 'donut',
        title: '业务大类收入构成',
        note: `业务口径合计 ${fmtWan(businessTotal)} 万元`,
        total: fmtWan(businessTotal),
        segments: byBusiness.map((b) => ({
          label: b.label,
          value: b.amount,
          display: fmtWan(b.amount),
          share: pct(b.amount, businessTotal)
        }))
      },
      {
        kind: 'bars',
        title: '承接部门（按累计承接额）',
        // 部门摊销口径与业务口径并不相等，注明以免被误认为算错
        note: `部门摊销口径合计 ${fmtWan(deptTotal)} 万元`,
        rows: depts.slice(0, 6).map((d) => ({
          label: d.label,
          value: d.amount,
          display: fmtWan(d.amount),
          share: pct(d.amount, deptTotal)
        }))
      }
    ],
    footer: '数据来源：系统内置模拟台账'
  };
}

/** 👥 重点客户合作现状 */
export function buildKeyCustomers(): AnalysisSection {
  const key = COMP_MOCK_LIST.filter(
    (c) => c.partnershipLevel.includes('战略') || c.partnershipLevel.includes('核心')
  ).sort((a, b) => companyTotal(b) - companyTotal(a));

  if (key.length === 0) {
    return {
      heading: '👥 重点客户合作现状',
      subtitle: `统计口径：${dataYear()} 年度`,
      blocks: [{ kind: 'status', title: '提示', items: [] }],
      footer: '当前台账中没有标记为战略级合作伙伴或核心供应商的客户。'
    };
  }

  const total = key.reduce((sum, c) => sum + companyTotal(c), 0);

  return {
    heading: '👥 重点客户合作现状',
    subtitle: `战略级合作伙伴 / 核心供应商 · ${dataYear()} 年度 · 金额单位：万元`,
    blocks: [
      {
        // 4 个扇区，看各重点客户在总量中的份额
        kind: 'donut',
        title: '重点客户合作额构成',
        note: `合计 ${fmtWan(total)} 万元`,
        total: fmtWan(total),
        segments: key.map((c) => ({
          label: c.name.replace(/有限公司|股份有限公司|\(.*\)/g, '').trim(),
          value: companyTotal(c),
          display: fmtWan(companyTotal(c)),
          share: pct(companyTotal(c), total)
        }))
      },
      {
        kind: 'tiles',
        tiles: key.map((c) => {
          const topDept = [...c.deptContributions].sort((a, b) => b.amount - a.amount)[0];
          return {
            label: c.name.replace(/有限公司|股份有限公司|\(.*\)/g, '').trim(),
            value: `${c.aiScore} 分`,
            hint: `${c.partnershipLevel} · ${c.growthCategory} · 合规 ${c.complianceRating}% · 风险 ${c.riskIndex}${
              topDept ? ` · 主要承接 ${normalizeDeptName(topDept.name)}` : ''
            }`
          };
        })
      }
    ],
    footer: '数据来源：系统内置模拟台账'
  };
}

/** ⚠️ 经营风险与项目预警 */
export function buildRiskAlert(): AnalysisSection {
  const byRisk = [...COMP_MOCK_LIST].sort((a, b) => b.riskIndex - a.riskIndex);
  const highRisk = byRisk.filter((c) => c.riskIndex > RISK_INDEX_THRESHOLD);
  const lowScore = COMP_MOCK_LIST.filter((c) => c.aiScore <= LOW_SCORE_THRESHOLD).sort(
    (a, b) => a.aiScore - b.aiScore
  );
  const groupRisks = GROUP_MOCK_LIST.flatMap((g) =>
    g.riskHighlights.map((r) => ({ group: g.name, ...r }))
  );

  const maxRisk = Math.max(...byRisk.map((c) => c.riskIndex), RISK_INDEX_THRESHOLD);

  return {
    heading: '⚠️ 经营风险与项目预警',
    subtitle: `风险指数阈值 ${RISK_INDEX_THRESHOLD} · 超过阈值触发关注`,
    blocks: [
      {
        kind: 'tiles',
        tiles: [
          { label: '高风险企业', value: `${highRisk.length}`, hint: `风险指数 > ${RISK_INDEX_THRESHOLD}` },
          { label: '低评分关注', value: `${lowScore.length}`, hint: `智能评分 ≤ ${LOW_SCORE_THRESHOLD}` },
          { label: '集团风险提示', value: `${groupRisks.length}`, hint: '条' },
          { label: '最高风险指数', value: `${maxRisk}`, hint: byRisk[0]?.name.replace(/有限公司|股份有限公司|\(.*\)/g, '').trim() }
        ]
      },
      {
        kind: 'bars',
        title: '各企业风险指数',
        note: `阈值 ${RISK_INDEX_THRESHOLD}，超出即触发关注`,
        rows: byRisk.map((c) => ({
          label: c.name.replace(/有限公司|股份有限公司|\(.*\)/g, '').trim(),
          value: c.riskIndex,
          display: String(c.riskIndex),
          alert: c.riskIndex > RISK_INDEX_THRESHOLD ? `超阈值 ${c.riskIndex - RISK_INDEX_THRESHOLD}` : undefined
        }))
      },
      ...(groupRisks.length > 0
        ? [
            {
              kind: 'status' as const,
              title: '集团层面风险提示',
              items: groupRisks.map((r) => ({
                level: (r.level as StatusItem['level']) ?? 'low',
                title: `${r.group} · ${r.title}`,
                detail: `${r.description}（${r.date}）`
              }))
            }
          ]
        : [])
    ],
    footer: '数据来源：系统内置模拟台账'
  };
}

/**
 * 按提问分派到四个分析之一；无匹配返回 null（调用方继续走既有分支）。
 * 顺序即优先级：风险最具体，概况最宽泛。
 */
export function buildDirectionalAnalysis(query: string): AnalysisSection | null {
  if (isRiskAlertQuery(query)) return buildRiskAlert();
  if (isSegmentPerformanceQuery(query)) return buildSegmentPerformance();
  if (isKeyCustomerQuery(query)) return buildKeyCustomers();
  if (isBusinessOverviewQuery(query)) return buildBusinessOverview();
  return null;
}

/**
 * 由 mockData 现场计算得出的回复类型 —— 需要在界面上标注数据来源。
 *
 * 刻意不包含 'metric-explanation' 与 'config-refusal'：配置中心的口径回答不做任何
 * 数值计算，给它标「模拟数据」反而是误导。也不包含 'text'（兜底提示文案，无数据）。
 */
export const MOCK_DERIVED_TYPES = new Set<string>([
  'company-profile',
  'company-comparison',
  'group-profile',
  'group-comparison',
  'statistics',
  'contract-info',
  'contract-management',
  'business-insight',
  'monthly-report',
  'annual-report',
  'mock-analysis'
]);
