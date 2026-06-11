# 行情速递模块实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为云上赛宝数智专盘系统添加行情速递功能模块，提供行业政策、市场趋势、招标信息查看和智能报告生成功能

**Architecture:** 纯前端实现，使用模拟数据，采用 React 组件化架构，分为数据层、组件层、展示层

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Lucide React icons

---

## 文件结构

```
src/
├── types.ts                          # 修改: 添加行情相关类型定义
├── data/
│   └── mockNewsData.ts              # 创建: 模拟新闻数据
├── components/
│   └── NewsFeedModule.tsx           # 创建: 行情速递主组件
src/
├── components/
│   └── NewsFeedModule/
│       ├── CategoryNav.tsx           # 创建: 分类导航组件
│       ├── NewsCard.tsx             # 创建: 信息卡片组件
│       ├── ReportGenerator.tsx      # 创建: 报告生成器组件
│       └── FilterBar.tsx            # 创建: 筛选栏组件
└── App.tsx                          # 修改: 添加导航菜单项
```

---

## Task 1: 扩展类型定义

**Files:**
- Modify: `src/types.ts`

**目标:** 添加行情速递模块所需的 TypeScript 类型定义

- [ ] **Step 1: 在 types.ts 中添加行情相关类型**

在 `src/types.ts` 文件末尾添加以下类型定义：

```typescript
// 行情速递模块类型定义
export interface NewsItem {
  id: string;
  title: string;
  type: 'policy' | 'market' | 'tender' | 'hotspot';
  department: string;
  publishTime: string;
  tags: string[];
  summary: string;
  content?: string;
  isCollected?: boolean;
}

export interface TenderItem extends NewsItem {
  deadline: string;
  budget: string;
  region: string;
  requirements: string;
}

export interface ReportConfig {
  type: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  includePolicy: boolean;
  includeMarket: boolean;
  includeTender: boolean;
  includeHotspot: boolean;
  focusArea: string;
}

export interface UserPreference {
  focusIndustries: string[];
  focusRegions: string[];
  collectedItems: string[];
}

export type NewsCategoryType = 'all' | 'policy' | 'market' | 'tender' | 'hotspot' | 'collected';
export type TimeRangeType = 'today' | 'week' | 'month';
```

- [ ] **Step 2: 验证类型定义**

检查代码是否有语法错误：
```bash
npm run lint
```

预期: 无 TypeScript 错误

- [ ] **Step 3: 提交更改**

```bash
git add src/types.ts
git commit -m "feat: 添加行情速递模块类型定义"
```

---

## Task 2: 创建模拟数据

**Files:**
- Create: `src/data/mockNewsData.ts`

**目标:** 创建行情速递模块的模拟数据

- [ ] **Step 1: 创建模拟数据文件**

创建 `src/data/mockNewsData.ts` 文件：

```typescript
import { NewsItem, TenderItem } from '../types';

export const MOCK_NEWS_DATA: (NewsItem | TenderItem)[] = [
  // 政策法规
  {
    id: 'policy-001',
    title: '新能源汽车产业发展规划（2024-2030）',
    type: 'policy',
    department: '工信部',
    publishTime: '2小时前',
    tags: ['新能源汽车', '产业政策', '发展规划'],
    summary: '本规划旨在推动新能源汽车产业高质量发展，明确产业目标、重点任务和保障措施，为行业发展提供政策指引。',
    content: '详细内容...'
  },
  {
    id: 'policy-002',
    title: '半导体产业扶持资金管理办法',
    type: 'policy',
    department: '财政部',
    publishTime: '1天前',
    tags: ['半导体', '财政扶持', '资金管理'],
    summary: '规范半导体产业扶持资金的使用和管理，提高资金使用效益，推动产业创新发展。',
    content: '详细内容...'
  },
  {
    id: 'policy-003',
    title: '低空经济产业创新发展指导意见',
    type: 'policy',
    department: '发改委',
    publishTime: '3天前',
    tags: ['低空经济', '产业创新', '发展指导'],
    summary: '促进低空经济产业创新发展，规范行业秩序，培育新的经济增长点。',
    content: '详细内容...'
  },

  // 市场趋势
  {
    id: 'market-001',
    title: '半导体市场规模预测2024年将突破5000亿',
    type: 'market',
    department: '赛迪顾问',
    publishTime: '5小时前',
    tags: ['半导体', '市场预测', '规模分析'],
    summary: '根据最新研究报告，2024年中国半导体市场规模预计将突破5000亿元，同比增长15%以上。',
    content: '详细内容...'
  },
  {
    id: 'market-002',
    title: '新能源汽车下乡活动成效显著',
    type: 'market',
    department: '中汽协',
    publishTime: '1天前',
    tags: ['新能源汽车', '市场活动', '下乡推广'],
    summary: '新能源汽车下乡活动开展三个月以来，累计销量突破50万辆，有效激活了农村消费市场。',
    content: '详细内容...'
  },
  {
    id: 'market-003',
    title: '低空经济产业链投资热度持续升温',
    type: 'market',
    department: '投中研究院',
    publishTime: '2天前',
    tags: ['低空经济', '投资趋势', '产业链'],
    summary: '2024年上半年低空经济领域投资事件超过200起，总投资额突破500亿元，产业链各环节投资热度持续升温。',
    content: '详细内容...'
  },

  // 招标信息
  {
    id: 'tender-001',
    title: '华东地区检测服务采购项目',
    type: 'tender',
    department: '华东地区政府采购中心',
    publishTime: '6小时前',
    tags: ['检测服务', '政府采购', '华东地区'],
    summary: '采购检测服务，要求具备CNAS资质。',
    deadline: '2024-06-15 17:00',
    budget: '¥500万',
    region: '华东地区',
    requirements: '具备CNAS资质，有类似项目经验，通过ISO9001认证'
  },
  {
    id: 'tender-002',
    title: '华南地区环境试验设备采购招标',
    type: 'tender',
    department: '广东省政府采购中心',
    publishTime: '1天前',
    tags: ['环境试验', '设备采购', '华南地区'],
    summary: '采购环境试验设备一批，包括高低温试验箱、盐雾试验箱等。',
    deadline: '2024-06-20 17:00',
    budget: '¥800万',
    region: '华南地区',
    requirements: '设备需符合国家标准，提供3年质保服务'
  },
  {
    id: 'tender-003',
    title: '软件评测服务框架协议采购',
    type: 'tender',
    department: '工业和信息化部',
    publishTime: '2天前',
    tags: ['软件评测', '框架协议', '服务采购'],
    summary: '建立软件评测服务框架协议，为各部门提供统一评测服务。',
    deadline: '2024-06-25 17:00',
    budget: '¥1200万',
    region: '全国',
    requirements: '具备软件评测资质，通过CMA认证，有政府服务经验'
  },

  // 热点动态
  {
    id: 'hotspot-001',
    title: '行业动态：华为发布新款AI芯片',
    type: 'hotspot',
    department: '科技日报',
    publishTime: '30分钟前',
    tags: ['华为', 'AI芯片', '产品发布'],
    summary: '华为正式发布新款AI芯片，算力提升3倍，功耗降低40%，将在数据中心、自动驾驶等领域应用。',
    content: '详细内容...'
  },
  {
    id: 'hotspot-002',
    title: '比亚迪新能源车销量再创新高',
    type: 'hotspot',
    department: '财联社',
    publishTime: '2小时前',
    tags: ['比亚迪', '新能源汽车', '销量'],
    summary: '比亚迪5月新能源车销量突破30万辆，同比增长45%，继续领跑新能源汽车市场。',
    content: '详细内容...'
  },
  {
    id: 'hotspot-003',
    title: '低空经济示范区建设启动',
    type: 'hotspot',
    department: '新华网',
    publishTime: '4小时前',
    tags: ['低空经济', '示范区', '政策落地'],
    summary: '全国首批10个低空经济示范区建设正式启动，将在无人机物流、空中交通管理等领域开展试点。',
    content: '详细内容...'
  },
  {
    id: 'hotspot-004',
    title: '半导体设备国产化率突破30%',
    type: 'hotspot',
    department: '经济日报',
    publishTime: '8小时前',
    tags: ['半导体', '设备国产化', '产业进展'],
    summary: '2024年一季度半导体设备国产化率突破30%，刻蚀机、薄膜设备等领域取得重大突破。',
    content: '详细内容...'
  },
  {
    id: 'hotspot-005',
    title: '新能源汽车充电设施建设加速',
    type: 'hotspot',
    department: '能源新闻网',
    publishTime: '12小时前',
    tags: ['新能源汽车', '充电设施', '基础设施建设'],
    summary: '国家发改委发布通知，要求各地加快新能源汽车充电设施建设，2024年新增充电桩50万个。',
    content: '详细内容...'
  }
];

// 按类型分类的数据
export const NEWS_BY_TYPE = {
  policy: MOCK_NEWS_DATA.filter(item => item.type === 'policy'),
  market: MOCK_NEWS_DATA.filter(item => item.type === 'market'),
  tender: MOCK_NEWS_DATA.filter(item => item.type === 'tender'),
  hotspot: MOCK_NEWS_DATA.filter(item => item.type === 'hotspot'),
};

// 统计信息
export const NEWS_STATS = {
  policy: NEWS_BY_TYPE.policy.length,
  market: NEWS_BY_TYPE.market.length,
  tender: NEWS_BY_TYPE.tender.length,
  hotspot: NEWS_BY_TYPE.hotspot.length,
  total: MOCK_NEWS_DATA.length,
};
```

- [ ] **Step 2: 验证数据文件**

检查代码是否有语法错误：
```bash
npm run lint
```

预期: 无 TypeScript 错误

- [ ] **Step 3: 提交更改**

```bash
git add src/data/mockNewsData.ts
git commit -m "feat: 添加行情速递模块模拟数据"
```

---

## Task 3: 创建分类导航组件

**Files:**
- Create: `src/components/NewsFeedModule/CategoryNav.tsx`

**目标:** 创建左侧分类导航组件

- [ ] **Step 1: 创建 CategoryNav 组件**

创建 `src/components/NewsFeedModule/CategoryNav.tsx` 文件：

```typescript
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FileText, TrendingUp, Briefcase, Flame, Folder, Layers } from 'lucide-react';
import { NewsCategoryType, NEWS_STATS } from '../../data/mockNewsData';

interface CategoryNavProps {
  activeCategory: NewsCategoryType;
  onCategoryChange: (category: NewsCategoryType) => void;
}

const CATEGORIES = [
  { id: 'all' as NewsCategoryType, label: '全部', icon: Layers, count: NEWS_STATS.total },
  { id: 'policy' as NewsCategoryType, label: '政策法规', icon: FileText, count: NEWS_STATS.policy, hasNew: true },
  { id: 'market' as NewsCategoryType, label: '市场趋势', icon: TrendingUp, count: NEWS_STATS.market, hasNew: true },
  { id: 'tender' as NewsCategoryType, label: '招标信息', icon: Briefcase, count: NEWS_STATS.tender, hasNew: true },
  { id: 'hotspot' as NewsCategoryType, label: '热点动态', icon: Flame, count: NEWS_STATS.hotspot },
  { id: 'collected' as NewsCategoryType, label: '我的收藏', icon: Folder, count: 3 },
];

export default function CategoryNav({ activeCategory, onCategoryChange }: CategoryNavProps) {
  return (
    <div className="w-48 bg-white rounded-lg border border-slate-200 p-3">
      <h3 className="text-sm font-semibold text-slate-700 mb-3 px-2">分类导航</h3>

      <nav className="space-y-1">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs font-medium transition duration-150
                ${isActive
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                }
              `}
            >
              <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span className="flex-1">{category.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded shrink-0 ${
                category.hasNew
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {category.count}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
```

- [ ] **Step 2: 验证组件**

检查代码是否有语法错误：
```bash
npm run lint
```

预期: 无 TypeScript 错误

- [ ] **Step 3: 提交更改**

```bash
git add src/components/NewsFeedModule/CategoryNav.tsx
git commit -m "feat: 添加分类导航组件"
```

---

## Task 4: 创建信息卡片组件

**Files:**
- Create: `src/components/NewsFeedModule/NewsCard.tsx`

**目标:** 创建信息卡片组件，支持不同类型的展示

- [ ] **Step 1: 创建 NewsCard 组件**

创建 `src/components/NewsFeedModule/NewsCard.tsx` 文件：

```typescript
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FileText, TrendingUp, Briefcase, Flame, Bookmark, BookmarkCheck, Share2, ArrowRight } from 'lucide-react';
import { NewsItem, TenderItem } from '../../types';

interface NewsCardProps {
  item: NewsItem | TenderItem;
  onCollect?: (id: string) => void;
  onViewDetail?: (id: string) => void;
}

const TYPE_CONFIG = {
  policy: {
    icon: FileText,
    label: '政策',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
  market: {
    icon: TrendingUp,
    label: '市场',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
  },
  tender: {
    icon: Briefcase,
    label: '招标',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
  },
  hotspot: {
    icon: Flame,
    label: '热点',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
  },
};

export default function NewsCard({ item, onCollect, onViewDetail }: NewsCardProps) {
  const config = TYPE_CONFIG[item.type];
  const Icon = config.icon;
  const isTender = item.type === 'tender';

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow duration-200">
      {/* 头部：类型标签和标题 */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`px-2 py-1 rounded text-[10px] font-medium ${config.bgColor} ${config.textColor} border ${config.borderColor} flex items-center gap-1 shrink-0`}>
          <Icon className="h-3 w-3" />
          {config.label}
        </div>
        <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 flex-1">
          {item.title}
        </h3>
      </div>

      {/* 发布信息 */}
      <div className="flex items-center gap-4 text-[11px] text-slate-500 mb-3">
        <span>{item.department}</span>
        <span>•</span>
        <span>{item.publishTime}</span>
        {isTender && (
          <>
            <span>•</span>
            <span className="text-amber-600 font-medium">{(item as TenderItem).budget}</span>
          </>
        )}
      </div>

      {/* 标签 */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {item.tags.map((tag, index) => (
          <span
            key={index}
            className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-200 rounded"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* 摘要 */}
      <p className="text-xs text-slate-600 line-clamp-2 mb-3">
        {item.summary}
      </p>

      {/* 招标信息扩展字段 */}
      {isTender && (
        <div className="bg-amber-50 rounded border border-amber-200 p-3 mb-3 text-[11px]">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-500">截止时间:</span>
              <span className="text-slate-700 ml-1">{(item as TenderItem).deadline}</span>
            </div>
            <div>
              <span className="text-slate-500">地区:</span>
              <span className="text-slate-700 ml-1">{(item as TenderItem).region}</span>
            </div>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => onViewDetail?.(item.id)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
        >
          查看详情
          <ArrowRight className="h-3 w-3" />
        </button>
        <button
          onClick={() => onCollect?.(item.id)}
          className={`p-1.5 rounded transition-colors ${
            item.isCollected
              ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
          title={item.isCollected ? '已收藏' : '收藏'}
        >
          {item.isCollected ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
        <button
          className="p-1.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          title="分享"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 验证组件**

检查代码是否有语法错误：
```bash
npm run lint
```

预期: 无 TypeScript 错误

- [ ] **Step 3: 提交更改**

```bash
git add src/components/NewsFeedModule/NewsCard.tsx
git commit -m "feat: 添加信息卡片组件"
```

---

## Task 5: 创建筛选栏组件

**Files:**
- Create: `src/components/NewsFeedModule/FilterBar.tsx`

**目标:** 创建顶部筛选栏组件

- [ ] **Step 1: 创建 FilterBar 组件**

创建 `src/components/NewsFeedModule/FilterBar.tsx` 文件：

```typescript
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Calendar, Filter } from 'lucide-react';
import { TimeRangeType } from '../../types';

interface FilterBarProps {
  timeRange: TimeRangeType;
  onTimeRangeChange: (range: TimeRangeType) => void;
  onSearch: (query: string) => void;
}

const TIME_RANGES: { value: TimeRangeType; label: string }[] = [
  { value: 'today', label: '今日焦点' },
  { value: 'week', label: '本周精选' },
  { value: 'month', label: '本月回顾' },
];

export default function FilterBar({ timeRange, onTimeRangeChange, onSearch }: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* 时间范围选择 */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            {TIME_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() => onTimeRangeChange(range.value)}
                className={`
                  px-4 py-2 text-xs font-medium transition-colors
                  ${timeRange === range.value
                    ? 'bg-indigo-50 text-indigo-700 border-r border-slate-200'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border-r border-slate-200 last:border-r-0'
                  }
                `}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* 搜索框 */}
        <div className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="搜索政策、市场、招标信息..."
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 筛选按钮 */}
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200">
          <Filter className="h-4 w-4" />
          高级筛选
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 验证组件**

检查代码是否有语法错误：
```bash
npm run lint
```

预期: 无 TypeScript 错误

- [ ] **Step 3: 提交更改**

```bash
git add src/components/NewsFeedModule/FilterBar.tsx
git commit -m "feat: 添加筛选栏组件"
```

---

## Task 6: 创建报告生成器组件

**Files:**
- Create: `src/components/NewsFeedModule/ReportGenerator.tsx`

**目标:** 创建右侧报告生成面板组件

- [ ] **Step 1: 创建 ReportGenerator 组件**

创建 `src/components/NewsFeedModule/ReportGenerator.tsx` 文件：

```typescript
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, Calendar, Sparkles, Download, Eye, Check } from 'lucide-react';
import { ReportConfig } from '../../types';

interface ReportGeneratorProps {
  onGenerateReport: (config: ReportConfig) => void;
  onPreviewReport: (config: ReportConfig) => void;
}

const REPORT_TYPES = [
  { value: 'daily', label: '日报' },
  { value: 'weekly', label: '周报' },
  { value: 'monthly', label: '月报' },
];

const FOCUS_AREAS = [
  '半导体行业',
  '新能源汽车',
  '低空经济',
  '全部行业',
];

const RECOMMENDED_ITEMS = [
  { id: 'rec-001', title: '华为发布新款AI芯片，算力提升3倍', category: '市场趋势' },
  { id: 'rec-002', title: '华东地区检测服务采购项目', category: '招标信息' },
  { id: 'rec-003', title: '新能源汽车产业发展规划发布', category: '政策法规' },
];

export default function ReportGenerator({ onGenerateReport, onPreviewReport }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [includePolicy, setIncludePolicy] = useState(true);
  const [includeMarket, setIncludeMarket] = useState(true);
  const [includeTender, setIncludeTender] = useState(true);
  const [includeHotspot, setIncludeHotspot] = useState(false);
  const [focusArea, setFocusArea] = useState('半导体行业');
  const [selectedItems, setSelectedItems] = useState<string[]>(['rec-001', 'rec-002', 'rec-003']);

  const handleGenerate = () => {
    const config: ReportConfig = {
      type: reportType,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      includePolicy,
      includeMarket,
      includeTender,
      includeHotspot,
      focusArea,
    };
    onGenerateReport(config);
  };

  const handlePreview = () => {
    const config: ReportConfig = {
      type: reportType,
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
      includePolicy,
      includeMarket,
      includeTender,
      includeHotspot,
      focusArea,
    };
    onPreviewReport(config);
  };

  const toggleItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="w-72 bg-white rounded-lg border border-slate-200 p-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
        <FileText className="h-4 w-4 text-indigo-600" />
        智能报告生成
      </h3>

      {/* 报告类型 */}
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-600 mb-2 block">报告类型</label>
        <div className="space-y-1.5">
          {REPORT_TYPES.map((type) => (
            <label
              key={type.value}
              className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer"
            >
              <input
                type="radio"
                name="reportType"
                value={type.value}
                checked={reportType === type.value}
                onChange={(e) => setReportType(e.target.value as any)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              {type.label}
            </label>
          ))}
        </div>
      </div>

      {/* 时间范围 */}
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-600 mb-2 block">时间范围</label>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar className="h-3.5 w-3.5" />
          <span>{new Date().toLocaleDateString('zh-CN')}</span>
          <span>至</span>
          <span>{new Date().toLocaleDateString('zh-CN')}</span>
        </div>
      </div>

      {/* 包含内容 */}
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-600 mb-2 block">包含内容</label>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={includePolicy}
              onChange={(e) => setIncludePolicy(e.target.checked)}
              className="text-indigo-600 focus:ring-indigo-500 rounded"
            />
            政策法规
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={includeMarket}
              onChange={(e) => setIncludeMarket(e.target.checked)}
              className="text-indigo-600 focus:ring-indigo-500 rounded"
            />
            市场趋势
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={includeTender}
              onChange={(e) => setIncludeTender(e.target.checked)}
              className="text-indigo-600 focus:ring-indigo-500 rounded"
            />
            招标信息
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={includeHotspot}
              onChange={(e) => setIncludeHotspot(e.target.checked)}
              className="text-indigo-600 focus:ring-indigo-500 rounded"
            />
            热点动态
          </label>
        </div>
      </div>

      {/* 关注领域 */}
      <div className="mb-4">
        <label className="text-xs font-medium text-slate-600 mb-2 block">关注领域</label>
        <select
          value={focusArea}
          onChange={(e) => setFocusArea(e.target.value)}
          className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {FOCUS_AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      {/* 智能推荐 */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
          <label className="text-xs font-medium text-slate-600">智能推荐内容</label>
        </div>
        <div className="bg-slate-50 rounded border border-slate-200 p-3 space-y-2">
          {RECOMMENDED_ITEMS.map((item) => {
            const isSelected = selectedItems.includes(item.id);
            return (
              <label
                key={item.id}
                className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleItem(item.id)}
                  className="text-indigo-600 focus:ring-indigo-500 rounded mt-0.5"
                />
                <div className="flex-1">
                  <div className="text-slate-700">{item.title}</div>
                  <div className="text-[10px] text-slate-400">{item.category}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="space-y-2">
        <button
          onClick={handlePreview}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
        >
          <Eye className="h-3.5 w-3.5" />
          预览报告
        </button>
        <button
          onClick={handleGenerate}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm"
        >
          <FileText className="h-3.5 w-3.5" />
          一键生成
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 验证组件**

检查代码是否有语法错误：
```bash
npm run lint
```

预期: 无 TypeScript 错误

- [ ] **Step 3: 提交更改**

```bash
git add src/components/NewsFeedModule/ReportGenerator.tsx
git commit -m "feat: 添加报告生成器组件"
```

---

## Task 7: 创建主模块组件

**Files:**
- Create: `src/components/NewsFeedModule.tsx`

**目标:** 创建行情速递主模块组件

- [ ] **Step 1: 创建 NewsFeedModule 主组件**

创建 `src/components/NewsFeedModule.tsx` 文件：

```typescript
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { TrendingUp, Bell, Settings, Loader2 } from 'lucide-react';
import CategoryNav from './NewsFeedModule/CategoryNav';
import NewsCard from './NewsFeedModule/NewsCard';
import FilterBar from './NewsFeedModule/FilterBar';
import ReportGenerator from './NewsFeedModule/ReportGenerator';
import { MOCK_NEWS_DATA } from '../data/mockNewsData';
import { NewsCategoryType, TimeRangeType, NewsItem, TenderItem, ReportConfig } from '../types';

export default function NewsFeedModule() {
  const [activeCategory, setActiveCategory] = useState<NewsCategoryType>('all');
  const [timeRange, setTimeRange] = useState<TimeRangeType>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [collectedItems, setCollectedItems] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);

  // 根据分类和时间范围过滤数据
  const filteredData = useMemo(() => {
    let data = [...MOCK_NEWS_DATA];

    // 按分类过滤
    if (activeCategory !== 'all') {
      if (activeCategory === 'collected') {
        data = data.filter(item => collectedItems.has(item.id));
      } else {
        data = data.filter(item => item.type === activeCategory);
      }
    }

    // 按搜索关键词过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return data;
  }, [activeCategory, searchQuery, collectedItems]);

  // 处理收藏
  const handleCollect = (id: string) => {
    setCollectedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // 处理查看详情
  const handleViewDetail = (id: string) => {
    console.log('查看详情:', id);
    // TODO: 打开详情弹窗或导航到详情页
  };

  // 处理报告生成
  const handleGenerateReport = (config: ReportConfig) => {
    setIsGenerating(true);
    // 模拟生成过程
    setTimeout(() => {
      setIsGenerating(false);
      console.log('生成报告:', config);
      // TODO: 显示报告预览或下载
    }, 2000);
  };

  // 处理报告预览
  const handlePreviewReport = (config: ReportConfig) => {
    console.log('预览报告:', config);
    // TODO: 打开报告预览弹窗
  };

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 h-10 w-10 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/20">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">行情速递</h1>
            <p className="text-xs text-slate-500">实时掌握行业动态</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
          </button>
          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 筛选栏 */}
      <FilterBar
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        onSearch={setSearchQuery}
      />

      {/* 主内容区 */}
      <div className="flex gap-6">
        {/* 左侧分类导航 */}
        <CategoryNav
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* 中间信息流 */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-700">
              {activeCategory === 'all' ? '全部动态' :
               activeCategory === 'collected' ? '我的收藏' :
               activeCategory === 'policy' ? '政策法规' :
               activeCategory === 'market' ? '市场趋势' :
               activeCategory === 'tender' ? '招标信息' : '热点动态'}
              <span className="text-slate-400 font-normal ml-2">({filteredData.length})</span>
            </h2>
          </div>

          {filteredData.length === 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
              <p className="text-sm text-slate-400">暂无相关内容</p>
            </div>
          ) : (
            filteredData.map((item) => (
              <NewsCard
                key={item.id}
                item={{
                  ...item,
                  isCollected: collectedItems.has(item.id)
                }}
                onCollect={handleCollect}
                onViewDetail={handleViewDetail}
              />
            ))
          )}

          {filteredData.length > 0 && (
            <button className="w-full py-3 text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
              加载更多...
            </button>
          )}
        </div>

        {/* 右侧报告生成 */}
        <ReportGenerator
          onGenerateReport={handleGenerateReport}
          onPreviewReport={handlePreviewReport}
        />
      </div>

      {/* 生成中状态 */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
            <span className="text-sm text-slate-700">正在生成报告...</span>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 修复 CategoryNav 组件中的导入错误**

修改 `src/components/NewsFeedModule/CategoryNav.tsx` 的导入部分：

```typescript
// 将这行:
import { NewsCategoryType, NEWS_STATS } from '../../data/mockNewsData';

// 改为:
import { NewsCategoryType } from '../../types';
import { NEWS_STATS } from '../../data/mockNewsData';
```

- [ ] **Step 3: 验证组件**

检查代码是否有语法错误：
```bash
npm run lint
```

预期: 无 TypeScript 错误

- [ ] **Step 4: 提交更改**

```bash
git add src/components/NewsFeedModule.tsx src/components/NewsFeedModule/CategoryNav.tsx
git commit -m "feat: 添加行情速递主模块组件"
```

---

## Task 8: 在 App.tsx 中添加导航入口

**Files:**
- Modify: `src/App.tsx`

**目标:** 在主导航菜单中添加"行情速递"入口

- [ ] **Step 1: 添加图标导入**

在 `src/App.tsx` 的图标导入部分添加 `TrendingUp`:

找到这一行：
```typescript
import {
  Building2,
  BarChart3,
  PieChart,
  CircleUser,
  LayoutDashboard,
  SearchCode,
  User,
  Users,
  Building,
  Menu,
  X,
  Sparkles,
  FileText
} from 'lucide-react';
```

改为：
```typescript
import {
  Building2,
  BarChart3,
  PieChart,
  CircleUser,
  LayoutDashboard,
  SearchCode,
  User,
  Users,
  Building,
  Menu,
  X,
  Sparkles,
  FileText,
  TrendingUp
} from 'lucide-react';
```

- [ ] **Step 2: 导入 NewsFeedModule 组件**

找到这一行：
```typescript
import DashboardModule from './components/DashboardModule';
import GroupModule from './components/GroupModule';
import GroupListModule from './components/GroupListModule';
import EnterpriseModule from './components/EnterpriseModule';
import EnterpriseListModule from './components/EnterpriseListModule';
import SearchModule from './components/SearchModule';
import AIChatSidebar from './components/AIChatSidebar';
```

改为：
```typescript
import DashboardModule from './components/DashboardModule';
import GroupModule from './components/GroupModule';
import GroupListModule from './components/GroupListModule';
import EnterpriseModule from './components/EnterpriseModule';
import EnterpriseListModule from './components/EnterpriseListModule';
import SearchModule from './components/SearchModule';
import NewsFeedModule from './components/NewsFeedModule';
import AIChatSidebar from './components/AIChatSidebar';
```

- [ ] **Step 3: 添加导航菜单项**

找到 `navMenuItems` 数组定义：
```typescript
const navMenuItems = [
  { id: 'aiChat', label: 'AI智能对话', desc: 'AI data analysis chat', icon: Sparkles },
  { id: 'dashboard', label: '数据大盘研判', desc: 'Cockpit overview', icon: LayoutDashboard },
  { id: 'enterpriseManagement', label: '企业管理', desc: 'Enterprise & Group management', icon: Building2 },
  { id: 'enterpriseSearch', label: '企业搜索', desc: 'Enterprise search', icon: SearchCode },
];
```

在 `enterpriseSearch` 后面添加新菜单项：
```typescript
const navMenuItems = [
  { id: 'aiChat', label: 'AI智能对话', desc: 'AI data analysis chat', icon: Sparkles },
  { id: 'dashboard', label: '数据大盘研判', desc: 'Cockpit overview', icon: LayoutDashboard },
  { id: 'enterpriseManagement', label: '企业管理', desc: 'Enterprise & Group management', icon: Building2 },
  { id: 'enterpriseSearch', label: '企业搜索', desc: 'Enterprise search', icon: SearchCode },
  { id: 'newsFeed', label: '行情速递', desc: 'Market intelligence', icon: TrendingUp },
];
```

- [ ] **Step 4: 在 renderModule 函数中添加路由分支**

找到 `renderModule` 函数中的 `default` case：
```typescript
default:
  return <DashboardModule
    onNavigateToCompany={(id) => {
      setActiveCompanyId(id);
      setActiveTab('enterprisePortrait');
    }}
    onNavigateToGroup={(id) => {
      setActiveGroupId(id);
      setActiveTab('groupPortrait');
    }}
    onNavigateToTab={(tabId) => {
      setActiveTab(tabId);
    }}
  />;
```

在 `default` case 前面添加新的 case：
```typescript
case 'newsFeed':
  return <NewsFeedModule />;
default:
  return <DashboardModule
    onNavigateToCompany={(id) => {
      setActiveCompanyId(id);
      setActiveTab('enterprisePortrait');
    }}
    onNavigateToGroup={(id) => {
      setActiveGroupId(id);
      setActiveTab('groupPortrait');
    }}
    onNavigateToTab={(tabId) => {
      setActiveTab(tabId);
    }}
  />;
```

- [ ] **Step 5: 验证修改**

检查代码是否有语法错误：
```bash
npm run lint
```

预期: 无 TypeScript 错误

- [ ] **Step 6: 测试导航功能**

启动开发服务器（如果未运行）：
```bash
npm run dev
```

在浏览器中打开应用，点击"行情速递"菜单项，应该能看到新页面。

- [ ] **Step 7: 提交更改**

```bash
git add src/App.tsx
git commit -m "feat: 添加行情速递导航入口"
```

---

## Task 9: 创建目录结构文件

**Files:**
- Create: `src/components/NewsFeedModule/.gitkeep`

**目标:** 确保 NewsFeedModule 子组件目录存在

- [ ] **Step 1: 创建目录占位文件**

```bash
mkdir -p /Users/huangchengtao/AIwenshu/src/components/NewsFeedModule
touch /Users/huangchengtao/AIwenshu/src/components/NewsFeedModule/.gitkeep
```

- [ ] **Step 2: 提交更改**

```bash
git add src/components/NewsFeedModule/.gitkeep
git commit -m "chore: 添加 NewsFeedModule 组件目录"
```

---

## Task 10: 最终测试和验证

**目标:** 完整测试行情速递模块的所有功能

- [ ] **Step 1: 启动开发服务器**

```bash
npm run dev
```

- [ ] **Step 2: 验证导航菜单**

在浏览器中打开应用，验证：
- ✅ 导航菜单中显示"行情速递"选项
- ✅ 点击后能正确跳转到行情速递页面
- ✅ 页面显示正确的标题和图标

- [ ] **Step 3: 验证分类导航功能**

测试：
- ✅ 左侧显示所有分类（全部、政策法规、市场趋势、招标信息、热点动态、我的收藏）
- ✅ 点击分类能正确过滤数据
- ✅ 显示正确的数量统计

- [ ] **Step 4: 验证筛选栏功能**

测试：
- ✅ 时间范围切换（今日焦点、本周精选、本月回顾）
- ✅ 搜索功能正常工作
- ✅ 高级筛选按钮显示

- [ ] **Step 5: 验证信息卡片功能**

测试：
- ✅ 不同类型的卡片显示正确的样式和图标
- ✅ 政策法规卡片显示完整信息
- ✅ 招标信息卡片显示预算、截止时间等扩展字段
- ✅ 收藏按钮能正常切换状态
- ✅ 查看详情按钮有响应

- [ ] **Step 6: 验证报告生成功能**

测试：
- ✅ 右侧报告生成面板正常显示
- ✅ 报告类型切换正常
- ✅ 内容包含复选框正常工作
- ✅ 关注领域选择正常
- ✅ 智能推荐内容显示
- ✅ 预览报告按钮有响应
- ✅ 一键生成按钮显示加载状态

- [ ] **Step 7: 验证响应式布局**

测试：
- ✅ 桌面端布局正常
- ✅ 移动端布局适配正常

- [ ] **Step 8: 提交最终更改**

如果有任何小的调整：
```bash
git add .
git commit -m "fix: 行情速递模块细节调整"
```

- [ ] **Step 9: 创建功能标签（可选）**

```bash
git tag -a v1.0-news-feed -m "添加行情速递功能模块"
git push origin v1.0-news-feed
```

---

## 完成检查清单

在标记任务完成之前，确认以下所有项目：

- [ ] 所有 TypeScript 类型定义已添加到 `types.ts`
- [ ] 模拟数据文件 `mockNewsData.ts` 已创建
- [ ] 所有子组件已创建（CategoryNav, NewsCard, FilterBar, ReportGenerator）
- [ ] 主模块组件 `NewsFeedModule.tsx` 已创建
- [ ] App.tsx 已更新，添加了导航入口
- [ ] 所有功能都已测试通过
- [ ] 代码无 TypeScript 错误
- [ ] 代码无 ESLint 警告
- [ ] 所有更改都已提交到 git

---

## 执行说明

此计划包含 10 个主要任务，每个任务包含多个步骤。建议使用 **subagent-driven-development** 技能按任务顺序执行。

每个任务都是独立的，可以单独验证和提交。如果在执行过程中遇到问题，可以在当前任务中调试和修复，然后继续下一个任务。
