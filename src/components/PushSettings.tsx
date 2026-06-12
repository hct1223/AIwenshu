/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Settings,
  Database,
  Bell,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  User,
  Users,
  Building,
  Mail,
  MessageSquare,
  X,
  Zap,
  Globe,
  FileText,
  Calendar,
  Target,
  Shield
} from 'lucide-react';
import { MOCK_INTELLIGENCE_SOURCES, MOCK_PUSH_CONFIGS, INTELLIGENCE_STATS } from '../data/mockIntelligenceData';
import { IntelligenceSource, PushConfig } from '../types';

type TabType = 'sources' | 'push';

export default function PushSettings() {
  const [activeTab, setActiveTab] = useState<TabType>('sources');
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [showPushModal, setShowPushModal] = useState(false);
  const [editingSource, setEditingSource] = useState<IntelligenceSource | null>(null);
  const [editingPush, setEditingPush] = useState<PushConfig | null>(null);
  const [sources, setSources] = useState<IntelligenceSource[]>(MOCK_INTELLIGENCE_SOURCES);
  const [pushConfigs, setPushConfigs] = useState<PushConfig[]>(MOCK_PUSH_CONFIGS);

  // 获取采集源类型样式
  const getSourceTypeStyle = (type: string) => {
    const styles: Record<string, { bg: string; text: string; border: string }> = {
      gov: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      standard: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
      industry: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      tender: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
      competitor: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    };
    return styles[type] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
  };

  // 获取采集源类型标签
  const getSourceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      gov: '政府网站',
      standard: '标准组织',
      industry: '行业媒体',
      tender: '招标平台',
      competitor: '竞品监测',
    };
    return labels[type] || type;
  };

  // 获取推送类型标签
  const getPushTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      realtime: '实时推送',
      daily: '每日推送',
      weekly: '每周推送',
      monthly: '每月推送',
    };
    return labels[type] || type;
  };

  // 获取推送类型样式
  const getPushTypeStyle = (type: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      realtime: { bg: 'bg-red-100', text: 'text-red-700' },
      daily: { bg: 'bg-blue-100', text: 'text-blue-700' },
      weekly: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
      monthly: { bg: 'bg-purple-100', text: 'text-purple-700' },
    };
    return styles[type] || { bg: 'bg-slate-100', text: 'text-slate-700' };
  };

  // 切换采集源启用状态
  const toggleSourceEnabled = (id: string) => {
    setSources(sources.map(source =>
      source.id === id ? { ...source, enabled: !source.enabled } : source
    ));
  };

  // 切换推送配置启用状态
  const togglePushEnabled = (id: string) => {
    setPushConfigs(pushConfigs.map(config =>
      config.id === id ? { ...config, enabled: !config.enabled } : config
    ));
  };

  // 删除采集源
  const deleteSource = (id: string) => {
    if (confirm('确定要删除这个采集源吗？')) {
      setSources(sources.filter(source => source.id !== id));
    }
  };

  // 删除推送配置
  const deletePush = (id: string) => {
    if (confirm('确定要删除这个推送配置吗？')) {
      setPushConfigs(pushConfigs.filter(config => config.id !== id));
    }
  };

  // 编辑采集源
  const editSource = (source: IntelligenceSource) => {
    setEditingSource(source);
    setShowSourceModal(true);
  };

  // 编辑推送配置
  const editPush = (config: PushConfig) => {
    setEditingPush(config);
    setShowPushModal(true);
  };

  return (
    <div className="space-y-6">
      {/* 标签切换 */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('sources')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'sources'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="h-4 w-4" />
          采集源配置
        </button>
        <button
          onClick={() => setActiveTab('push')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'push'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bell className="h-4 w-4" />
          推送规则
        </button>
      </div>

      {/* 采集源配置 */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          {/* 头部 */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">采集源管理</h3>
              <p className="text-sm text-slate-600">
                已配置 {sources.filter(s => s.enabled).length} / {sources.length} 个采集源
              </p>
            </div>
            <button
              onClick={() => {
                setEditingSource(null);
                setShowSourceModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              添加采集源
            </button>
          </div>

          {/* 采集源列表 */}
          <div className="space-y-3">
            {sources.map((source) => {
              const typeStyle = getSourceTypeStyle(source.type);
              return (
                <div
                  key={source.id}
                  className={`bg-white rounded-lg border-2 transition-all ${
                    source.enabled ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 opacity-60'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-base font-semibold text-slate-900">{source.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeStyle.bg} ${typeStyle.text}`}>
                            {getSourceTypeLabel(source.type)}
                          </span>
                          {source.enabled && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              运行中
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-slate-600 mb-2">{source.url}</div>
                        {source.keywords && source.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {source.keywords.map((keyword) => (
                              <span key={keyword} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleSourceEnabled(source.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            source.enabled
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {source.enabled ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => editSource(source)}
                          className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteSource(source.id)}
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* 采集源详情 */}
                    <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-200">
                      <div>
                        <div className="text-xs text-slate-600 mb-1">采集频率</div>
                        <div className="text-sm font-medium text-slate-900 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {source.fetchFrequency === 'hourly' ? '每小时' :
                           source.fetchFrequency === 'daily' ? '每天' : '每周'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-600 mb-1">最后采集</div>
                        <div className="text-sm font-medium text-slate-900">
                          {source.lastFetchTime ? source.lastFetchTime.split(' ')[1] : '未运行'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-600 mb-1">状态</div>
                        <div className="text-sm font-medium text-slate-900">
                          {source.enabled ? '正常' : '已停用'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 推送规则配置 */}
      {activeTab === 'push' && (
        <div className="space-y-4">
          {/* 头部 */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">推送规则管理</h3>
              <p className="text-sm text-slate-600">
                已配置 {pushConfigs.filter(p => p.enabled).length} / {pushConfigs.length} 个推送规则
              </p>
            </div>
            <button
              onClick={() => {
                setEditingPush(null);
                setShowPushModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              创建推送规则
            </button>
          </div>

          {/* 推送规则列表 */}
          <div className="space-y-3">
            {pushConfigs.map((config) => {
              const pushTypeStyle = getPushTypeStyle(config.type);
              return (
                <div
                  key={config.id}
                  className={`bg-white rounded-lg border-2 transition-all ${
                    config.enabled ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 opacity-60'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-base font-semibold text-slate-900">{config.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${pushTypeStyle.bg} ${pushTypeStyle.text}`}>
                            {getPushTypeLabel(config.type)}
                          </span>
                          {config.enabled && (
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              已启用
                            </span>
                          )}
                        </div>

                        {/* 推送渠道 */}
                        <div className="flex items-center gap-2 text-xs text-slate-600 mb-2">
                          <span>推送渠道:</span>
                          {config.channels.map((channel) => {
                            const icons: Record<string, any> = {
                              system: Globe,
                              lanxin: MessageSquare,
                              email: Mail,
                            };
                            const Icon = icons[channel];
                            const labels: Record<string, string> = {
                              system: '系统',
                              lanxin: '蓝信',
                              email: '邮件',
                            };
                            return (
                              <span key={channel} className={`px-2 py-0.5 rounded flex items-center gap-1 ${
                                channel === 'system' ? 'bg-blue-50 text-blue-700' :
                                channel === 'lanxin' ? 'bg-emerald-50 text-emerald-700' :
                                'bg-purple-50 text-purple-700'
                              }`}>
                                <Icon className="h-3 w-3" />
                                {labels[channel]}
                              </span>
                            );
                          })}
                        </div>

                        {/* 推送对象 */}
                        <div className="text-xs text-slate-600">
                          推送对象: {
                            config.targets.type === 'all' ? '全员' :
                            config.targets.type === 'department' ? `部门 (${config.targets.departments?.join(', ')})` :
                            `个人 (${config.targets.users?.join(', ')})`
                          }
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => togglePushEnabled(config.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            config.enabled
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {config.enabled ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => editPush(config)}
                          className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deletePush(config.id)}
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* 过滤条件 */}
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200">
                      <div>
                        <div className="text-xs text-slate-600 mb-1">情报类别</div>
                        <div className="flex flex-wrap gap-1">
                          {config.categories ? config.categories.map((cat) => {
                            const labels: Record<string, string> = {
                              policy: '政策',
                              standard: '标准',
                              technology: '技术',
                              tender: '招标',
                              competitor: '竞品',
                            };
                            return (
                              <span key={cat} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                                {labels[cat]}
                              </span>
                            );
                          }) : (
                            <span className="text-xs text-slate-500">全部</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-600 mb-1">优先级</div>
                        <div className="flex flex-wrap gap-1">
                          {config.priorities ? config.priorities.map((priority) => {
                            const labels: Record<string, string> = {
                              urgent: '紧急',
                              important: '重要',
                              normal: '普通',
                            };
                            const colors: Record<string, string> = {
                              urgent: 'bg-red-100 text-red-700',
                              important: 'bg-amber-100 text-amber-700',
                              normal: 'bg-slate-100 text-slate-700',
                            };
                            return (
                              <span key={priority} className={`px-2 py-0.5 rounded text-xs ${colors[priority]}`}>
                                {labels[priority]}
                              </span>
                            );
                          }) : (
                            <span className="text-xs text-slate-500">全部</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 添加/编辑采集源模态框 */}
      {showSourceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingSource ? '编辑采集源' : '添加采集源'}
                </h2>
                <button
                  onClick={() => setShowSourceModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">采集源名称</label>
                  <input
                    type="text"
                    defaultValue={editingSource?.name}
                    placeholder="例如：工信部政策法规"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">采集源类型</label>
                  <select
                    defaultValue={editingSource?.type}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="gov">政府网站</option>
                    <option value="standard">标准组织</option>
                    <option value="industry">行业媒体</option>
                    <option value="tender">招标平台</option>
                    <option value="competitor">竞品监测</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">采集地址</label>
                  <input
                    type="url"
                    defaultValue={editingSource?.url}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">采集频率</label>
                  <select
                    defaultValue={editingSource?.fetchFrequency}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="hourly">每小时</option>
                    <option value="daily">每天</option>
                    <option value="weekly">每周</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">关键词过滤（用逗号分隔）</label>
                  <input
                    type="text"
                    defaultValue={editingSource?.keywords?.join(',')}
                    placeholder="军工,电子,检测"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowSourceModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    setShowSourceModal(false);
                    // 实际应该保存数据
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  {editingSource ? '保存修改' : '添加采集源'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 添加/编辑推送规则模态框 */}
      {showPushModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {editingPush ? '编辑推送规则' : '创建推送规则'}
                </h2>
                <button
                  onClick={() => setShowPushModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">规则名称</label>
                  <input
                    type="text"
                    defaultValue={editingPush?.name}
                    placeholder="例如：紧急情报实时推送"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">推送方式</label>
                  <select
                    defaultValue={editingPush?.type}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="realtime">实时推送</option>
                    <option value="daily">每日推送</option>
                    <option value="weekly">每周推送</option>
                    <option value="monthly">每月推送</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">推送渠道</label>
                  <div className="flex flex-wrap gap-2">
                    {['system', 'lanxin', 'email'].map((channel) => {
                      const labels: Record<string, string> = {
                        system: '系统站内',
                        lanxin: '蓝信',
                        email: '邮件',
                      };
                      const isChecked = editingPush?.channels.includes(channel as any);
                      return (
                        <label key={channel} className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                          <input
                            type="checkbox"
                            defaultChecked={isChecked}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm">{labels[channel]}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">情报类别</label>
                  <div className="flex flex-wrap gap-2">
                    {['policy', 'standard', 'technology', 'tender', 'competitor'].map((category) => {
                      const labels: Record<string, string> = {
                        policy: '政策法规',
                        standard: '标准更新',
                        technology: '产业技术',
                        tender: '招标项目',
                        competitor: '竞品动态',
                      };
                      const isChecked = editingPush?.categories?.includes(category as any);
                      return (
                        <label key={category} className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                          <input
                            type="checkbox"
                            defaultChecked={isChecked}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm">{labels[category]}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">优先级过滤</label>
                  <div className="flex flex-wrap gap-2">
                    {['urgent', 'important', 'normal'].map((priority) => {
                      const labels: Record<string, string> = {
                        urgent: '紧急',
                        important: '重要',
                        normal: '普通',
                      };
                      const isChecked = editingPush?.priorities?.includes(priority as any);
                      return (
                        <label key={priority} className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                          <input
                            type="checkbox"
                            defaultChecked={isChecked}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="text-sm">{labels[priority]}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1">推送对象类型</label>
                  <select
                    defaultValue={editingPush?.targets.type}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">全员推送</option>
                    <option value="department">按部门推送</option>
                    <option value="individual">按个人推送</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowPushModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    setShowPushModal(false);
                    // 实际应该保存数据
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  {editingPush ? '保存修改' : '创建规则'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
