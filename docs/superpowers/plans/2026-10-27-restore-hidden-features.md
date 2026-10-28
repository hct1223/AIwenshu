# Restore Hidden Features and Menus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore all previously hidden sidebar menus and the dashboard analysis entry without changing their existing business logic.

**Architecture:** Restore the four historical entries in the `navMenuItems` data array and enable the existing dashboard-analysis feature flag. Existing route branches and React components remain unchanged.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS.

---

### Task 1: Verify the hidden state

**Files:**
- Inspect: `src/App.tsx`
- Inspect: `src/components/DashboardModule.tsx`

- [x] **Step 1: Confirm the four menu entries are absent**

Run:

```bash
rg -c "id: '(enterpriseManagement|enterpriseSearch|intelligence|knowledge)'" src/App.tsx
```

Expected: no matches or exit status 1, because only the two current menu entries are present.

- [x] **Step 2: Confirm the dashboard analysis flag is disabled**

Run:

```bash
rg -n "const DASHBOARD_ANALYSIS_ENABLED = false;" src/components/DashboardModule.tsx
```

Expected: one match at the feature flag declaration.

### Task 2: Restore the sidebar menus

**Files:**
- Modify: `src/App.tsx`

- [x] **Step 1: Replace the current two-item menu array with the six-item array**

```tsx
const navMenuItems = [
  { id: 'dashboard', label: '数据大盘研判', desc: 'Cockpit overview', icon: LayoutDashboard },
  { id: 'enterpriseManagement', label: '企业管理', desc: 'Enterprise & Group management', icon: Building2 },
  { id: 'enterpriseSearch', label: '企业搜索', desc: 'Enterprise search', icon: SearchCode },
  { id: 'intelligence', label: '情报速递', desc: 'Intelligence system', icon: Radar },
  { id: 'knowledge', label: '知识库管理', desc: 'Knowledge base system', icon: Database },
  { id: 'metricConfig', label: '数据指标配置', desc: 'Metric & dimension center', icon: BarChart3 },
];
```

- [x] **Step 2: Remove the obsolete hidden-module comment**

Delete the comment beginning `// 已隐藏模块：企业管理...`, because the listed modules are now visible.

- [x] **Step 3: Verify all six menu entries exist**

Run:

```bash
rg -n "id: '(dashboard|enterpriseManagement|enterpriseSearch|intelligence|knowledge|metricConfig)'" src/App.tsx
```

Expected: six matching menu definitions, plus any unrelated route references that use the same quoted IDs.

### Task 3: Restore dashboard analysis

**Files:**
- Modify: `src/components/DashboardModule.tsx`

- [x] **Step 1: Enable the existing feature flag**

```tsx
const DASHBOARD_ANALYSIS_ENABLED = true;
```

- [x] **Step 2: Verify the flag and both guarded render points**

Run:

```bash
rg -n "DASHBOARD_ANALYSIS_ENABLED" src/components/DashboardModule.tsx
```

Expected: three matches: the declaration set to `true`, the button guard, and the results-panel guard.

### Task 4: Verify the restored experience

**Files:**
- Verify: `src/App.tsx`
- Verify: `src/components/DashboardModule.tsx`

- [x] **Step 1: Run the TypeScript check**

Run:

```bash
npm run lint
```

Expected: no new errors in `src/App.tsx` or `src/components/DashboardModule.tsx`. Pre-existing errors in `SearchModule.tsx` and `types.ts` are recorded separately and must not increase.

- [x] **Step 2: Verify the Vite module payload**

Run:

```bash
curl -s http://localhost:3001/src/App.tsx
```

Expected: the response contains all four restored IDs: `enterpriseManagement`, `enterpriseSearch`, `intelligence`, and `knowledge`.

- [x] **Step 3: Verify the restored UI**

Open `http://localhost:3001/` and confirm:

- The sidebar shows six menus.
- Each restored menu switches to its corresponding module.
- “大盘分析” is visible on the dashboard and clicking it shows the existing analysis panel.

- [x] **Step 4: Commit the implementation**

```bash
git add src/App.tsx src/components/DashboardModule.tsx docs/superpowers/specs/2026-10-27-restore-hidden-features-design.md docs/superpowers/plans/2026-10-27-restore-hidden-features.md
git commit -m "feat: 恢复隐藏功能与菜单"
```
