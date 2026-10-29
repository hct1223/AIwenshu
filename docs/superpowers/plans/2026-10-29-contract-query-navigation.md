# Contract Query Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve an AI contract-query result as the active contract-management filter and allow the user to clear it.

**Architecture:** Add the original query text to `ContractQueryResult`, pass the full result through `AIChatSidebar` to `App`, and filter the shared contract list by the result's record IDs in `ContractManagementModule`.

**Tech Stack:** React 19, TypeScript, Node test runner through `tsx`.

---

### Task 1: Add failing navigation-context tests

**Files:**
- Modify: `src/components/contracts/ContractManagementModule.test.tsx`
- Modify: `src/data/contractQuery.test.ts`

- [x] **Step 1: Test that query results include the original question**

```ts
const result = answerContractQuery('腾讯有哪些合同', buildSeedContracts());
assert.equal(result?.query, '腾讯有哪些合同');
```

- [x] **Step 2: Test that the module renders only query matches**

```tsx
const query = answerContractQuery('腾讯有哪些合同', buildSeedContracts());
const html = renderToStaticMarkup(
  <ContractProvider>
    <ContractManagementModule aiQuery={query} onClearAiQuery={() => {}} />
  </ContractProvider>
);
assert.match(html, /AI 查询结果/);
assert.match(html, /腾讯科技（深圳）有限公司/);
assert.doesNotMatch(html, /华为技术有限公司/);
```

- [x] **Step 3: Run tests and confirm they fail**

```bash
npm run test:contracts
```

### Task 2: Carry query context through the AI-to-page navigation

**Files:**
- Modify: `src/data/contractQuery.ts`
- Modify: `src/components/AIChatSidebar.tsx`
- Modify: `src/App.tsx`

- [x] **Step 1: Add `query` to `ContractQueryResult`**

Every `makeResult` call receives and stores the original query.

- [x] **Step 2: Add `onOpenContractQuery` to AI chat props**

```ts
onOpenContractQuery?: (result: ContractQueryResult) => void;
```

The “打开合同管理” button calls this callback instead of only navigating by tab ID.

- [x] **Step 3: Store the AI query context in `App`**

```ts
const [contractAiQuery, setContractAiQuery] = useState<ContractQueryResult | null>(null);
```

Pass it to the contract page together with a clear callback. Clear it when the sidebar contract menu is clicked directly.

### Task 3: Filter the contract page by query record IDs

**Files:**
- Modify: `src/components/contracts/ContractManagementModule.tsx`

- [x] **Step 1: Add query-focused props**

```ts
aiQuery?: ContractQueryResult | null;
onClearAiQuery?: () => void;
```

- [x] **Step 2: Apply the query ID set after normal filters**

```ts
const queryIds = new Set(aiQuery?.records.map(record => record.id) ?? []);
const visibleByQuery = aiQuery
  ? filteredContracts.filter(record => queryIds.has(record.id))
  : filteredContracts;
```

- [x] **Step 3: Add the result banner**

Show the original query, match count, and “查看全部合同”. Clearing resets both AI context and local filters.

### Task 4: Verify and commit

**Files:**
- Verify all modified files

- [x] **Step 1: Run tests**

```bash
npm run test:contracts
```

- [x] **Step 2: Run build and targeted TypeScript checks**

```bash
npm run build
npx tsc --noEmit 2>&1 | rg "contractQuery|ContractManagementModule|AIChatSidebar|App.tsx"
```

- [x] **Step 3: Verify in the browser**

Ask “腾讯有哪些合同”, click “打开合同管理”, confirm only one contract is visible, then click “查看全部合同” and confirm the full list returns.

- [x] **Step 4: Commit**

```bash
git add src/data/contractQuery.ts src/components/AIChatSidebar.tsx src/components/contracts/ContractManagementModule.tsx src/App.tsx src/components/contracts/ContractManagementModule.test.tsx src/data/contractQuery.test.ts docs/superpowers/plans/2026-10-29-contract-query-navigation.md
git commit -m "fix: 保留合同 AI 查询结果上下文"
```
