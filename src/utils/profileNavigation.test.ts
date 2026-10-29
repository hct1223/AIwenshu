import test from 'node:test';
import assert from 'node:assert/strict';
import { navigateToProfile } from './profileNavigation.ts';

test('navigates to the selected profile and then closes chat explicitly', () => {
  const calls: string[] = [];
  navigateToProfile(
    'comp-huawei-tech',
    id => calls.push(`navigate:${id}`),
    () => calls.push('close'),
  );

  assert.deepEqual(calls, ['navigate:comp-huawei-tech', 'close']);
});

test('does not throw when optional callbacks are absent', () => {
  assert.doesNotThrow(() => navigateToProfile('missing'));
});
