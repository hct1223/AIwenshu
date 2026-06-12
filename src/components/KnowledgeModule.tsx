/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Database,
  Plus,
  Search,
  FileText,
  FolderOpen,
  Lock,
  Unlock,
  Users,
  Clock,
  Eye,
  Download,
  Share2,
  Trash2,
  Edit,
  Pin,
  PinOff,
  Filter,
  Calendar,
  Tag,
  BookOpen,
  ChevronLeft,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { MOCK_KNOWLEDGE_BASES, MOCK_KNOWLEDGE_DOCUMENTS, KNOWLEDGE_STATS } from '../data/mockIntelligenceData';
import { KnowledgeBase, KnowledgeDocument, KnowledgeCategory, KNOWLEDGE_CATEGORIES } from '../types';

type DocTypeFilter = 'all' | 'intelligence' | 'monthly_report' | 'annual_report' | 'manual';

export default function KnowledgeModule() {
  const [selectedKB, setSelectedKB] = useState<KnowledgeBase | null>(MOCK_KNOWLEDGE_BASES[0] || null);
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(null);
  const [kbSearchQuery, setKbSearchQuery] = useState('');
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<KnowledgeCategory | 'all'>('all');
  const [docTypeFilter, setDocTypeFilter] = useState<DocTypeFilter>('all');

  // 过滤知识库
  const filteredKBs = MOCK_KNOWLEDGE_BASES.filter(kb => {
    if (categoryFilter !== 'all' && kb.category !== categoryFilter) return false;
    if (kbSearchQuery) {
      const query = kbSearchQuery.toLowerCase();
      return kb.name.toLowerCase().includes(query) || kb.description.toLowerCase().includes(query);
    }
    return true;
  });

  // 过滤文档
  const filteredDocs = MOCK_KNOWLEDGE_DOCUMENTS.filter(doc => {
    if (selectedKB && doc.kbId !== selectedKB.id) return false;
    if (docTypeFilter !== 'all' && doc.fileType !== docTypeFilter) return false;
    if (docSearchQuery) {
      const query = docSearchQuery.toLowerCase();
      return doc.title.toLowerCase().includes(query) ||
             doc.content.toLowerCase().includes(query) ||
             doc.tags.some(tag => tag.toLowerCase().includes(query));
    }
    return true;
  });

  // 按置顶和时间排序文档
  const sortedDocs = [...filteredDocs].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  // 获取文件类型样式
  const getFileTypeStyle = (fileType: string) => {
    const styles: Record<string, { label: string; icon: any; color: string; bgColor: string }> = {
      intelligence: { label: '情报', icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' },
      monthly_report: { label: '月报', icon: Calendar, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
      annual_report: { label: '年报', icon: BookOpen, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
      manual: { label: '手动', icon: FolderOpen, color: 'text-slate-600', bgColor: 'bg-slate-50' },
    };
    return styles[fileType] || styles.manual;
  };

  // 切换置顶状态
  const togglePin = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Toggle pin:', docId);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      {/* 左侧知识库列表 */}
      <div className="w-80 flex-shrink-0 flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* 头部 */}
        <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-indigo-600 to-indigo-700">
          <div className="flex items-center gap-2 text-white mb-3">
            <Database className="h-5 w-5" />
            <h2 className="font-semibold">知识库</h2>
            <span className="ml-auto text-xs text-white/70">{MOCK_KNOWLEDGE_BASES.length}个</span>
          </div>
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索知识库..."
              value={kbSearchQuery}
              onChange={(e) => setKbSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 bg-white/95"
            />
          </div>
        </div>

        {/* 分类过滤 */}
        <div className="p-3 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                categoryFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              全部
            </button>
            {(Object.keys(KNOWLEDGE_CATEGORIES) as KnowledgeCategory[]).map((cat) => {
              const config = KNOWLEDGE_CATEGORIES[cat];
              const isActive = categoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    isActive ? `bg-${config.color}-600 text-white` : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 知识库列表 */}
        <div className="flex-1 overflow-y-auto">
          {filteredKBs.length === 0 ? (
            <div className="p-6 text-center">
              <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <div className="text-xs text-slate-600">没有找到知识库</div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredKBs.map((kb) => {
                const categoryConfig = KNOWLEDGE_CATEGORIES[kb.category];
                const Icon = categoryConfig.icon as any;
                const docCount = MOCK_KNOWLEDGE_DOCUMENTS.filter(d => d.kbId === kb.id).length;
                const isActive = selectedKB?.id === kb.id;

                return (
                  <div
                    key={kb.id}
                    className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 ${
                      isActive ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''
                    }`}
                    onClick={() => setSelectedKB(kb)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${categoryConfig.color}-50`}>
                        <Icon className={`h-4 w-4 text-${categoryConfig.color}-600`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-slate-900 truncate">{kb.name}</h3>
                          {kb.type === 'system' && (
                            <span className="flex-shrink-0 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px]">
                              系统内置
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1 mb-2">{kb.description}</p>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {docCount}个文档
                          </span>
                          <span className="flex items-center gap-1">
                            {kb.isPublic ? (
                              <><Unlock className="h-3 w-3 text-emerald-600" />公开</>
                            ) : (
                              <><Lock className="h-3 w-3 text-slate-400" />私有</>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 底部新建按钮 */}
        <div className="p-3 border-t border-slate-200">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium">
            <Plus className="h-4 w-4" />
            新建知识库
          </button>
        </div>
      </div>

      {/* 右侧文档列表 */}
      <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
        {!selectedKB ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-slate-500">
              <Database className="h-12 w-12 text-slate-400 mx-auto mb-3" />
              <div className="text-sm">请选择一个知识库查看文档</div>
            </div>
          </div>
        ) : (
          <>
            {/* 头部 */}
            <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-100">
                    <Database className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">{selectedKB.name}</h2>
                    <p className="text-xs text-slate-600">{selectedKB.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition text-xs font-medium text-slate-700">
                    <Edit className="h-3.5 w-3.5" />
                    编辑
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition text-xs font-medium text-slate-700">
                    <Plus className="h-3.5 w-3.5" />
                    添加文档
                  </button>
                </div>
              </div>

              {/* 搜索和过滤 */}
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="搜索文档标题、内容或标签..."
                    value={docSearchQuery}
                    onChange={(e) => setDocSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <select
                  value={docTypeFilter}
                  onChange={(e) => setDocTypeFilter(e.target.value as DocTypeFilter)}
                  className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="all">全部类型</option>
                  <option value="intelligence">情报</option>
                  <option value="monthly_report">月报</option>
                  <option value="annual_report">年报</option>
                  <option value="manual">手动上传</option>
                </select>
              </div>
            </div>

            {/* 文档列表 */}
            <div className="flex-1 overflow-y-auto">
              {sortedDocs.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-slate-500">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                    <div className="text-sm mb-1">该知识库暂无文档</div>
                    <div className="text-xs text-slate-400">生成的情报和报告会自动存入此知识库</div>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {sortedDocs.map((doc) => {
                    const fileTypeStyle = getFileTypeStyle(doc.fileType);
                    const FileTypeIcon = fileTypeStyle.icon;

                    return (
                      <div
                        key={doc.id}
                        className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedDoc(doc)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 p-2 rounded-lg bg-slate-50">
                            <FileTypeIcon className={`h-5 w-5 ${fileTypeStyle.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-semibold text-slate-900 truncate">{doc.title}</h4>
                              {doc.isPinned && <Pin className="h-4 w-4 text-amber-500 flex-shrink-0" />}
                              <span className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-medium ${fileTypeStyle.bgColor} ${fileTypeStyle.color}`}>
                                {fileTypeStyle.label}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2 mb-2">{doc.summary}</p>
                            <div className="flex items-center gap-3 text-[10px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {doc.viewCount}次查看
                              </span>
                              <span>•</span>
                              <span>{doc.updatedAt.split(' ')[0]}</span>
                              <span>•</span>
                              <span>{doc.tags.slice(0, 2).join('、')}</span>
                              {doc.sourceUrl && (
                                <>
                                  <span>•</span>
                                  <a
                                    href={doc.sourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    原文链接
                                  </a>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 底部统计 */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
              显示 {sortedDocs.length} / {MOCK_KNOWLEDGE_DOCUMENTS.filter(d => d.kbId === selectedKB.id).length} 个文档
            </div>
          </>
        )}
      </div>

      {/* 文档详情弹窗 */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDoc(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* 头部 */}
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-100">
                    <FileText className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{selectedDoc.title}</h3>
                    <p className="text-xs text-slate-600">{selectedDoc.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* 内容 */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* 元数据 */}
              <div className="mb-4 pb-4 border-b border-slate-100">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500">来源：</span>
                    <span className="font-medium text-slate-700">{selectedDoc.source}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">创建时间：</span>
                    <span className="font-medium text-slate-700">{selectedDoc.createdAt}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">查看次数：</span>
                    <span className="font-medium text-slate-700">{selectedDoc.viewCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">状态：</span>
                    <span className={`font-medium ${selectedDoc.status === 'published' ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {selectedDoc.status === 'published' ? '已发布' : '草稿'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 正文 */}
              <div className="prose prose-sm max-w-none">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{selectedDoc.content}</p>
              </div>

              {/* 标签 */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedDoc.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium">
                <Download className="h-4 w-4" />
                下载
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition text-sm font-medium">
                <Share2 className="h-4 w-4" />
                分享
              </button>
              {selectedDoc.sourceUrl && (
                <a
                  href={selectedDoc.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition text-sm font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  原文链接
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
