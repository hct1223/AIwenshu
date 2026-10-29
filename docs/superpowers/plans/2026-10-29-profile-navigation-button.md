# Full Profile Navigation Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make “查看完整画像” an explicit accessible button that navigates to the selected company/group portrait and closes the AI sidebar.

**Architecture:** Extract a small `ProfileLink` UI component, then reuse it in enterprise and group chat cards. Both button clicks and existing whole-card clicks use one navigation helper that sets the destination and closes chat.

**Tech Stack:** React 19, TypeScript, Node test runner through `tsx`.

---

### Task 1: Add a failing `ProfileLink` component test

**Files:**
- Create: `src/components/ProfileLink.test.tsx`
- Create: `src/components/ProfileLink.tsx`
- Modify: `package.json`

- [x] **Step 1: Assert that the link renders as a real button**

```tsx
const html = renderToStaticMarkup(<ProfileLink onOpen={() => {}} />);
assert.match(html, /<button/);
assert.match(html, /查看完整画像/);
assert.match(html, /lucide-arrow-right/);
```

- [x] **Step 2: Run the test and confirm it fails**

```bash
npm run test:profile
```

- [x] **Step 3: Implement the reusable button**

```tsx
export default function ProfileLink({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={event => {
        event.stopPropagation();
        onOpen();
      }}
      className="..."
    >
      查看完整画像
      <ArrowRight className="h-3 w-3" />
    </button>
  );
}
```

### Task 2: Wire enterprise and group cards

**Files:**
- Modify: `src/components/AIChatSidebar.tsx`

- [x] **Step 1: Add shared navigation helpers**

```ts
const openCompanyPortrait = (companyId: string) => {
  onNavigateToCompany?.(companyId);
  onToggle();
};

const openGroupPortrait = (groupId: string) => {
  onNavigateToGroup?.(groupId);
  onToggle();
};
```

- [x] **Step 2: Replace the informational text with `ProfileLink`**

Use the company helper in enterprise cards and the group helper in group cards.

- [x] **Step 3: Route whole-card clicks through the same helpers**

Keep card click behavior, but make it close the sidebar consistently.

### Task 3: Verify and commit

**Files:**
- Verify all modified files

- [x] **Step 1: Run tests and build**

```bash
npm run test:profile
npm run test:contracts
npm run test:insights
npm run build
```

- [x] **Step 2: Verify in browser**

Ask for a company portrait, click the explicit “查看完整画像” button, and confirm:

- AI sidebar closes.
- `enterprisePortrait` opens with the selected company.

Repeat for a group portrait and confirm `groupPortrait`.

- [x] **Step 3: Commit**

```bash
git add src/components/ProfileLink.tsx src/components/ProfileLink.test.tsx src/components/AIChatSidebar.tsx package.json docs/superpowers/plans/2026-10-29-profile-navigation-button.md
git commit -m "fix: 支持点击查看完整画像"
```
