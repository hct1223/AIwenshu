import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ContractProvider } from '../../context/ContractContext.tsx';
import ContractManagementModule from './ContractManagementModule.tsx';

test('renders contract management controls and the supplied Excel fields', () => {
  const html = renderToStaticMarkup(
    <ContractProvider>
      <ContractManagementModule />
    </ContractProvider>
  );

  assert.match(html, /合同管理/);
  assert.match(html, /新增合同/);
  assert.match(html, /导入 Excel/);
  assert.match(html, /导出 Excel/);
  assert.match(html, /部门合同号/);
  assert.match(html, /合同名称/);
  assert.match(html, /客户单位名称/);
  assert.match(html, /主办部门/);
  assert.match(html, /业务类型/);
  assert.match(html, /单个合同金额/);
  assert.match(html, /客户单位联系人/);
  assert.match(html, /客户单位联系电话/);
  assert.match(html, /提交时间/);
});
