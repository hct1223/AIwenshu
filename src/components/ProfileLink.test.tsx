import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ProfileLink from './ProfileLink.tsx';

test('renders an accessible full-profile button', () => {
  const html = renderToStaticMarkup(<ProfileLink onOpen={() => {}} />);

  assert.match(html, /<button/);
  assert.match(html, /查看完整画像/);
  assert.match(html, /lucide-arrow-right/);
});
