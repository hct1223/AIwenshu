# Contract Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a persistent contract management module with the supplied Excel fields, CRUD, filtering, XLSX import preview, and XLSX export.

**Architecture:** Keep contract records and pure data helpers independent from React. Use a page container with focused form, detail, and import-preview components; persist records through the existing versioned `usePersistentState` hook.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS, lucide-react, `read-excel-file`, `write-excel-file`, Node test runner through `tsx`.

---

### Task 1: Add the browser XLSX dependencies and test command

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [x] **Step 1: Install browser Excel libraries**

Run:

```bash
npm install read-excel-file write-excel-file
```

Expected: `read-excel-file` and `write-excel-file` are added to production dependencies and the lockfile updates.

- [x] **Step 2: Add the focused test command**

```json
"test:contracts": "tsx --test src/data/contractData.test.ts src/data/contractExcel.test.ts"
```

### Task 2: Write failing contract data tests

**Files:**
- Create: `src/data/contractData.test.ts`
- Create: `src/types/contract.ts`
- Create: `src/data/contractData.ts`

- [x] **Step 1: Add tests for validation, duplicate normalization, filtering, and seed generation**

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSeedContracts,
  filterContracts,
  normalizeContractNumber,
  validateContractInput,
} from './contractData';
import type { ContractInput } from '../types/contract';

const validInput: ContractInput = {
  departmentContractNo: 'SB2026-001',
  contractName: '设备可靠性试验合同',
  customerName: '演示客户有限公司',
  department: '可靠性试验室',
  businessType: '环境试验',
  amount: 128.5,
  contactName: '演示联系人',
  contactPhone: '020-12345678',
  submittedAt: '2026-10-28',
  source: 'manual',
};

test('normalizes contract numbers for duplicate checks', () => {
  assert.equal(normalizeContractNumber(' sb2026-001 '), 'SB2026-001');
});

test('rejects missing required fields and non-positive amount', () => {
  const errors = validateContractInput({
    ...validInput,
    contractName: '',
    amount: 0,
  });
  assert.ok(errors.includes('合同名称不能为空'));
  assert.ok(errors.includes('合同金额必须大于 0'));
});

test('filters by keyword, amount range, department, and date', () => {
  const records = buildSeedContracts();
  const filtered = filterContracts(records, {
    keyword: '芯片',
    department: '全部',
    businessType: '全部',
    amountRange: 'all',
    dateFrom: '',
    dateTo: '',
  });
  assert.ok(filtered.length > 0);
  assert.ok(filtered.every(record =>
    [record.contractName, record.customerName, record.department, record.businessType]
      .join(' ')
      .includes('芯片')
  ));
});

test('builds complete seed contracts from existing enterprise data', () => {
  const records = buildSeedContracts();
  assert.ok(records.length > 0);
  assert.ok(records.every(record =>
    record.departmentContractNo &&
    record.contractName &&
    record.customerName &&
    record.amount > 0 &&
    /^\d{4}-\d{2}-\d{2}$/.test(record.submittedAt)
  ));
});
```

- [x] **Step 2: Run the tests and verify the module is missing**

Run:

```bash
npm run test:contracts
```

Expected: FAIL because `src/data/contractData.ts` does not exist.

- [x] **Step 3: Add the contract types**

```ts
export interface ContractRecord {
  id: string;
  departmentContractNo: string;
  contractName: string;
  customerName: string;
  department: string;
  businessType: string;
  amount: number;
  contactName: string;
  contactPhone: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  source: 'seed' | 'manual' | 'import';
}

export type ContractInput = Omit<ContractRecord, 'id' | 'createdAt' | 'updatedAt'>;

export interface ContractFilters {
  keyword: string;
  department: string;
  businessType: string;
  amountRange: 'all' | 'lt100' | '100to500' | '500to1000' | 'gte1000';
  dateFrom: string;
  dateTo: string;
}
```

- [x] **Step 4: Implement validation, normalization, filtering, and seed generation**

```ts
export const normalizeContractNumber = (value: string) =>
  value.trim().toUpperCase();

export function validateContractInput(input: ContractInput): string[] {
  const errors: string[] = [];
  if (!input.departmentContractNo.trim()) errors.push('部门合同号不能为空');
  if (!input.contractName.trim()) errors.push('合同名称不能为空');
  if (!input.customerName.trim()) errors.push('客户单位名称不能为空');
  if (!input.department.trim()) errors.push('主办部门不能为空');
  if (!input.businessType.trim()) errors.push('业务类型不能为空');
  if (!Number.isFinite(input.amount) || input.amount <= 0) errors.push('合同金额必须大于 0');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.submittedAt)) errors.push('提交时间格式无效');
  if (input.contactPhone.trim() && !/^[0-9+\-\s()]{6,24}$/.test(input.contactPhone.trim())) {
    errors.push('联系电话格式无效');
  }
  return errors;
}

export function buildSeedContracts(): ContractRecord[] {
  return COMP_MOCK_LIST.flatMap(company =>
    (company.cooperationContracts ?? []).map(contract => ({
      id: `seed-${company.id}-${contract.id}`,
      departmentContractNo: contract.contractNo,
      contractName: contract.name,
      customerName: company.name,
      department: contract.department,
      businessType: inferBusinessType(contract.name),
      amount: contract.amount,
      contactName: company.contacts[0]?.name ?? '演示联系人',
      contactPhone: company.contacts[0]?.phone ?? '',
      submittedAt: contract.signDate,
      createdAt: `${contract.signDate}T00:00:00.000Z`,
      updatedAt: `${contract.signDate}T00:00:00.000Z`,
      source: 'seed',
    }))
  );
}

export function filterContracts(records: ContractRecord[], filters: ContractFilters) {
  const keyword = filters.keyword.trim().toLowerCase();
  return records.filter(record => {
    const searchable = [
      record.departmentContractNo,
      record.contractName,
      record.customerName,
      record.department,
      record.businessType,
      record.contactName,
    ].join(' ').toLowerCase();
    if (keyword && !searchable.includes(keyword)) return false;
    if (filters.department !== '全部' && record.department !== filters.department) return false;
    if (filters.businessType !== '全部' && record.businessType !== filters.businessType) return false;
    if (filters.amountRange === 'lt100' && record.amount >= 100) return false;
    if (filters.amountRange === '100to500' && (record.amount < 100 || record.amount >= 500)) return false;
    if (filters.amountRange === '500to1000' && (record.amount < 500 || record.amount >= 1000)) return false;
    if (filters.amountRange === 'gte1000' && record.amount < 1000) return false;
    if (filters.dateFrom && record.submittedAt < filters.dateFrom) return false;
    if (filters.dateTo && record.submittedAt > filters.dateTo) return false;
    return true;
  });
}
```

`inferBusinessType` maps software/algorithm names to `软件评测`, chip/component names to `失效分析`, calibration names to `计量校准`, and otherwise returns `检验检测`.

- [x] **Step 5: Run the contract data tests**

Run:

```bash
npm run test:contracts
```

Expected: contract data tests PASS; Excel test file may still be missing, so create it in Task 3 immediately.

### Task 3: Write failing Excel conversion tests

**Files:**
- Create: `src/data/contractExcel.test.ts`
- Create: `src/data/contractExcel.ts`

- [x] **Step 1: Add tests for import mapping, duplicate detection, missing headers, and export ordering**

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONTRACT_EXPORT_HEADERS,
  buildContractExportMatrix,
  parseContractRows,
} from './contractExcel';
import type { ContractRecord } from '../types/contract';

const headers = [...CONTRACT_EXPORT_HEADERS];
const existing: ContractRecord[] = [{
  id: 'existing',
  departmentContractNo: 'SB2026-001',
  contractName: '已有合同',
  customerName: '已有客户',
  department: '元器件检测所',
  businessType: '失效分析',
  amount: 100,
  contactName: '联系人',
  contactPhone: '020-11112222',
  submittedAt: '2026-10-01',
  createdAt: '2026-10-01T00:00:00.000Z',
  updatedAt: '2026-10-01T00:00:00.000Z',
  source: 'manual',
}];

test('maps Excel rows and preserves phone values as text', () => {
  const rows = [[
    ' SB2026-002 ', '新增合同', '新增客户', '软件评测中心', '软件评测',
    '1,200.50', '张三', '020-12345678', new Date(2026, 9, 28),
  ]];
  const preview = parseContractRows(headers, rows, existing);
  assert.equal(preview.rows[0].status, 'valid');
  assert.equal(preview.rows[0].input.amount, 1200.5);
  assert.equal(preview.rows[0].input.contactPhone, '020-12345678');
  assert.equal(preview.rows[0].input.submittedAt, '2026-10-28');
});

test('marks duplicate contract numbers', () => {
  const rows = [[
    'sb2026-001', '重复合同', '客户', '部门', '检验检测',
    100, '联系人', '020-12345678', '2026-10-28',
  ]];
  const preview = parseContractRows(headers, rows, existing);
  assert.equal(preview.rows[0].status, 'duplicate');
});

test('reports missing required headers', () => {
  const preview = parseContractRows(['部门合同号', '合同名称'], [], existing);
  assert.ok(preview.missingHeaders.includes('客户单位名称'));
});

test('exports the exact nine fields in source order', () => {
  const matrix = buildContractExportMatrix(existing);
  assert.deepEqual(matrix[0], [...CONTRACT_EXPORT_HEADERS]);
  assert.equal(matrix[1][0], 'SB2026-001');
  assert.equal(matrix[1][5], 100);
});
```

- [x] **Step 2: Run tests and verify the Excel module is missing**

Run:

```bash
npm run test:contracts
```

Expected: FAIL because `src/data/contractExcel.ts` does not exist.

- [x] **Step 3: Implement pure parsing, preview, export matrix, and file helpers**

```ts
export const CONTRACT_EXPORT_HEADERS = [
  '部门合同号', '合同名称', '客户单位名称', '主办部门', '业务类型',
  '单个合同金额', '客户单位联系人', '客户单位联系电话', '提交时间',
] as const;

export interface ContractImportRow {
  rowNumber: number;
  input: ContractInput;
  status: 'valid' | 'duplicate' | 'error';
  errors: string[];
}

export interface ContractImportPreview {
  headers: string[];
  rows: ContractImportRow[];
  missingHeaders: string[];
  validCount: number;
  duplicateCount: number;
  errorCount: number;
}

export function parseContractRows(
  rawHeaders: unknown[],
  rawRows: unknown[][],
  existing: ContractRecord[],
): ContractImportPreview {
  // Trim headers, map each required header to its column,
  // normalize numbers/dates/text, validate every row,
  // and mark records duplicate by normalized department contract number.
}

export function buildContractExportMatrix(records: ContractRecord[]): (string | number)[][] {
  return [
    [...CONTRACT_EXPORT_HEADERS],
    ...records.map(record => [
      record.departmentContractNo,
      record.contractName,
      record.customerName,
      record.department,
      record.businessType,
      record.amount,
      record.contactName,
      record.contactPhone,
      record.submittedAt,
    ]),
  ];
}
```

- [x] **Step 4: Implement XLSX file helpers**

```ts
export async function parseContractFile(file: File, existing: ContractRecord[]) {
  const { readSheet } = await import('read-excel-file/browser');
  const matrix = await readSheet(file);
  return parseContractRows(matrix[0] ?? [], matrix.slice(1), existing);
}

export async function exportContractsToXlsx(records: ContractRecord[], fileName: string) {
  const { default: writeExcelFile } = await import('write-excel-file/browser');
  await writeExcelFile(buildContractExportMatrix(records)).toFile(fileName);
}
```

- [x] **Step 5: Run tests**

Run:

```bash
npm run test:contracts
```

Expected: all contract data and Excel conversion tests PASS.

### Task 4: Build the contract form and import-preview modals

**Files:**
- Create: `src/components/contracts/ContractFormModal.tsx`
- Create: `src/components/contracts/ContractImportModal.tsx`

- [x] **Step 1: Implement the create/edit/detail form**

The modal receives:

```ts
interface ContractFormModalProps {
  mode: 'create' | 'edit' | 'view';
  contract: ContractRecord | null;
  existingContracts: ContractRecord[];
  onClose: () => void;
  onSave: (input: ContractInput) => void;
}
```

Render the nine required fields, required markers, inline errors, cancel/save actions, and read-only mode when viewing.

- [x] **Step 2: Implement the import preview**

The modal receives parsed preview data, displays summary counts and the first 20 rows with status/error text, supports an overwrite-duplicates checkbox, and only writes after explicit confirmation.

- [x] **Step 3: Verify TypeScript**

Run:

```bash
npx tsc --noEmit 2>&1 | rg "contracts/"
```

Expected: no errors in new contract components.

### Task 5: Build the contract management page and persistent CRUD

**Files:**
- Create: `src/components/contracts/ContractManagementModule.tsx`

- [x] **Step 1: Initialize persistent data**

```ts
const INITIAL_CONTRACTS = buildSeedContracts();
const [contracts, setContracts] = usePersistentState<ContractRecord[]>(
  'saibao.contracts',
  INITIAL_CONTRACTS,
  { version: 1, validate: Array.isArray },
);
```

- [x] **Step 2: Add summary cards and filters**

Show total records, filtered records, filtered amount, and unique customers. Add keyword, department, business type, amount range, date range, reset, import, export, and create controls.

- [x] **Step 3: Add table operations and pagination**

Render all nine fields plus view/edit/delete. Support amount and date sorting and page sizes 10/20/50. Delete requires a custom confirmation dialog.

- [x] **Step 4: Implement create, update, delete, import, and export handlers**

Create and edit generate/update timestamps. Import skips duplicates unless overwrite is enabled. Export all or current filtered rows using the Excel helper.

- [x] **Step 5: Verify TypeScript**

Run:

```bash
npx tsc --noEmit 2>&1 | rg "contracts/"
```

Expected: no errors in the contract module.

### Task 6: Add navigation and verify the complete workflow

**Files:**
- Modify: `src/App.tsx`

- [x] **Step 1: Add the route**

```tsx
case 'contractManagement':
  return <ContractManagementModule />;
```

- [x] **Step 2: Add the sidebar menu**

```tsx
{ id: 'contractManagement', label: '合同管理', desc: 'Contract lifecycle management', icon: FileText },
```

- [x] **Step 3: Run all static checks**

Run:

```bash
npm run test:contracts
npm run build
npm run lint
```

Expected: contract tests and production build pass; `tsc` has no new contract-module errors.

- [x] **Step 4: Verify CRUD in the browser**

At `http://localhost:3001/`, open “合同管理” and verify:

- Seed records render with the exact nine headers.
- Create, detail, edit, and confirmed delete all update the table.
- Filters reset and paginate correctly.
- A page refresh preserves the modified record set.

- [x] **Step 5: Verify import and export**

Import the supplied `合同额.xlsx` header-only file and confirm it reports missing data rather than corrupting the table. Export all and filtered data, then inspect the downloaded workbook headers and row count.

- [x] **Step 6: Commit the implementation**

```bash
git add package.json package-lock.json src/types/contract.ts src/data/contractData.ts src/data/contractData.test.ts src/data/contractExcel.ts src/data/contractExcel.test.ts src/components/contracts src/App.tsx docs/superpowers/plans/2026-10-28-contract-management.md
git commit -m "feat: 新增合同管理模块"
```

### Task 7: Add shared contract Q&A

**Files:**
- Create: `src/context/ContractContext.tsx`
- Create: `src/data/contractQuery.ts`
- Create: `src/data/contractQuery.test.ts`
- Modify: `src/components/AIChatSidebar.tsx`
- Modify: `src/components/EnterpriseModule.tsx`
- Modify: `src/components/contracts/ContractManagementModule.tsx`
- Modify: `src/App.tsx`

- [x] **Step 1: Test natural-language contract queries**

```ts
const result = answerContractQuery('腾讯有哪些合同', buildSeedContracts());
assert.ok(result?.records.every(record => record.customerName.includes('腾讯')));
```

- [x] **Step 2: Share the persistent contract list through a Context provider**

`ContractProvider` owns `saibao.contracts` at storage version 2 and migrates version 1 invalid seed phone values without discarding records.

- [x] **Step 3: Answer contract questions in AI chat**

Handle `isContractManagementQuery(...)` before general statistics, render a contract result card, and expose “打开合同管理”.

- [x] **Step 4: Add cross-module entry points**

Add “问 AI 查合同” on the contract page and “合同管理” in the enterprise contract section.

- [x] **Step 5: Verify in the browser**

Ask “最近有哪些合同”“腾讯有哪些合同”“按部门汇总合同金额” and confirm each card shows the expected count, amount, and navigation action.
