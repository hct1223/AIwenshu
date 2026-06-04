/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Newspaper,
  TrendingUp,
  Calendar,
  Building2,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Target,
  Sparkles,
  Lightbulb,
  Activity,
  Briefcase,
  FileText,
  Zap,
  Star,
  User,
  Download,
  X
} from 'lucide-react';

// 模拟每周动态数据 - 显示上周已完成的内容
const WEEKLY_DYNAMICS_DATA = {
  weekInfo: {
    weekNumber: '第22周',
    weekRange: '2026年5月25日 - 5月31日',
    generatedDate: '2026-06-01 09:00',
    quarter: '2026年Q2'
  },
  weeklyOverview: {
    totalRevenue: 1250, // 上周营收（万元）
    newContracts: 8, // 新签合同数
    activeProjects: 156, // 进行中的重点项目
    clientVisits: 12, // 客户拜访次数
    completedTests: 342, // 完成检测测试数量
    weekOverWeek: 8.5 // 环比增长
  },
  keyProjects: [
    {
      id: 'P2026-0231',
      name: '华为机器车载芯片可靠性测试项目',
      client: '华为机器有限公司',
      department: '元器件检测所',
      progress: 75,
      status: '正常推进',
      amount: 280,
      weekProgress: '上周完成温循应力筛选测试和寿命评估测试，报告已交付客户',
      riskLevel: 'low',
      projectManager: '张工'
    },
    {
      id: 'P2026-0235',
      name: '比亚迪功率器件第三方检测认证',
      client: '比亚迪集团',
      department: '可靠性试验室',
      progress: 60,
      status: '正常推进',
      amount: 350,
      weekProgress: '上周完成环境试验和EMC测试，阶段性报告已提交',
      riskLevel: 'low',
      projectManager: '李工'
    },
    {
      id: 'P2026-0238',
      name: '亿咖通车机系统信息安全评测',
      client: '亿咖通（湖北）科技有限公司',
      department: '软件评测中心',
      progress: 45,
      status: '按计划进行',
      amount: 180,
      weekProgress: '上周完成代码审计和渗透测试，发现并修复3个中危漏洞，已提交检测报告',
      riskLevel: 'medium',
      projectManager: '王工'
    },
    {
      id: 'P2026-0241',
      name: '小鹏汇天低空航电适航检测',
      client: '小鹏汇天',
      department: '低空产业部',
      progress: 90,
      status: '即将交付',
      amount: 420,
      weekProgress: '上周完成功能测试和适航认证，检测报告已编制完成，等待客户验收',
      riskLevel: 'low',
      projectManager: '刘工'
    }
  ],
  departmentUpdates: [
    {
      department: '元器件检测所',
      thisWeekRevenue: 320,
      keyAchievements: [
        '完成华为机器IC芯片失效分析报告交付',
        '完成中兴通讯5G器件筛选测试项目第一阶段',
        '完成紫光国微新签约客户检测服务启动'
      ]
    },
    {
      department: '可靠性试验室',
      thisWeekRevenue: 280,
      keyAchievements: [
        '完成比亚迪环境试验阶段性检测',
        '通过CNAS能力验证审核',
        '完成高低温试验箱设备验收调试'
      ]
    },
    {
      department: '计量校准所',
      thisWeekRevenue: 240,
      keyAchievements: [
        '完成广汽集团计量校准年度服务',
        '完成美的集团合作协议签订',
        '完成计量标准器周期溯源工作'
      ]
    },
    {
      department: '软件评测中心',
      thisWeekRevenue: 180,
      keyAchievements: [
        '完成亿咖通车机系统安全评测第一阶段',
        '通过公安部信息安全等级保护测评资质复查',
        '完成SonarQube代码审查工具部署'
      ]
    },
    {
      department: '低空产业部',
      thisWeekRevenue: 150,
      keyAchievements: [
        '完成小鹏汇天航电适航检测项目主体工作',
        '完成峰飞航空合作协议签订',
        '完成无人机遥控链路测试能力建设'
      ]
    },
    {
      department: '技推处',
      thisWeekRevenue: 80,
      keyAchievements: [
        '完成华南区域客户技术交流会',
        '完成Q2市场调研报告',
        '完成东莞地区3家新客户拜访'
      ]
    }
  ],
  importantEvents: [
    {
      date: '2026-05-26',
      type: 'milestone',
      title: '低空产业部通过适航检测能力认证',
      description: '成功获得民航局颁发的适航检测资质证书，成为华南地区首家具备该能力的第三方检测机构',
      impact: 'high'
    },
    {
      date: '2026-05-28',
      type: 'client',
      title: '与美的集团签订战略合作协议',
      description: '双方在计量校准、软件评测等领域达成深度合作，年合作金额预计超过500万元',
      impact: 'high'
    },
    {
      date: '2026-05-29',
      type: 'internal',
      title: '召开Q2业务分析会',
      description: '各业务部门负责人汇报Q2工作进展，分析市场形势',
      impact: 'medium'
    },
    {
      date: '2026-05-30',
      type: 'achievement',
      title: '软件评测中心通过资质复查',
      description: '顺利通过公安部信息安全等级保护测评资质复查，检测能力得到进一步认可',
      impact: 'medium'
    },
    {
      date: '2026-05-31',
      type: 'risk',
      title: '华为机器项目样品延迟预警',
      description: '车载芯片测试项目样品延迟送达，需要协调资源确保按时交付',
      impact: 'medium'
    }
  ],
  clientDynamics: [
    {
      company: '华为机器有限公司',
      type: '重点项目',
      update: '上周完成车载芯片测试温循应力筛选和寿命评估，IC失效分析报告已交付',
      contact: '李经理'
    },
    {
      company: '比亚迪集团',
      type: '战略合作',
      update: '上周完成功率器件环境试验阶段性检测，EMC测试已完成并提交报告',
      contact: '王总'
    },
    {
      company: '小鹏汇天',
      type: '新客户',
      update: '上周完成航电适航检测主体测试工作，检测报告已编制完成，等待客户验收',
      contact: '张工程师'
    },
    {
      company: '美的集团',
      type: '新签约',
      update: '上周完成计量校准战略合作协议签订，首期合同金额120万元，合作正式启动',
      contact: '陈主管'
    }
  ],
  riskAlerts: [
    {
      level: 'high',
      title: '华为机器项目交付风险',
      description: '车载芯片测试项目样品延迟2天送达，可能影响6月15日交付节点',
      affectedProject: 'P2026-0231',
      action: '已协调资源加班检测，预计可按时交付'
    },
    {
      level: 'medium',
      title: '增城基地产能预警',
      description: '元器件检测所检测负荷达到94%，部分项目需要排期',
      affectedProject: '多个',
      action: '建议启动设备扩容计划'
    },
    {
      level: 'low',
      title: '人员配置调整',
      description: '软件评测中心下半年需增加2名信息安全测试工程师',
      affectedProject: '-',
      action: '已启动招聘流程'
    }
  ]
};

export default function BusinessReportModule() {
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('pdf');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P0': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'P1': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'P2': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'client': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'achievement': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'risk': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'internal': return 'text-slate-600 bg-slate-50 border-slate-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case '正常推进': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case '按计划进行': return 'bg-blue-50 text-blue-700 border-blue-200';
      case '即将交付': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case '风险预警': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowExportModal(true);
    }, 2000);
  };

  const handleExportReport = () => {
    alert(`正在导出${exportFormat.toUpperCase()}格式的简报...`);
    setShowExportModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 模块标题 */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-900">
                赛宝每周动态
              </h2>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded">
                {WEEKLY_DYNAMICS_DATA.weekInfo.weekNumber}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              查看上周赛宝实验室业务成果和重要动态
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] text-slate-400">本周周期</div>
              <div className="text-xs font-mono text-slate-700">{WEEKLY_DYNAMICS_DATA.weekInfo.weekRange}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400">更新时间</div>
              <div className="text-xs font-mono text-slate-700">{WEEKLY_DYNAMICS_DATA.weekInfo.generatedDate}</div>
            </div>
            <button
              onClick={handleGenerateReport}
              disabled={isGenerating}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition flex items-center gap-2 ${
                isGenerating
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
              }`}
            >
              {isGenerating ? (
                <>
                  <Activity className="h-4 w-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  生成简报
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 本周概况 */}
      <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 border border-indigo-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Newspaper className="h-5 w-5 text-indigo-600" />
          <h3 className="font-semibold text-slate-900">上周概况</h3>
          <span className="ml-auto text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            环比增长 +{WEEKLY_DYNAMICS_DATA.weeklyOverview.weekOverWeek}%
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              <span className="text-[10px] text-slate-400">上周营收</span>
            </div>
            <div className="font-mono text-xl font-bold text-slate-900">
              ¥{WEEKLY_DYNAMICS_DATA.weeklyOverview.totalRevenue}万
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-indigo-600" />
              <span className="text-[10px] text-slate-400">新签合同</span>
            </div>
            <div className="font-mono text-xl font-bold text-slate-900">
              {WEEKLY_DYNAMICS_DATA.weeklyOverview.newContracts}份
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 text-blue-600" />
              <span className="text-[10px] text-slate-400">重点项目</span>
            </div>
            <div className="font-mono text-xl font-bold text-slate-900">
              {WEEKLY_DYNAMICS_DATA.weeklyOverview.activeProjects}个
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-amber-600" />
              <span className="text-[10px] text-slate-400">客户拜访</span>
            </div>
            <div className="font-mono text-xl font-bold text-slate-900">
              {WEEKLY_DYNAMICS_DATA.weeklyOverview.clientVisits}次
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-purple-600" />
              <span className="text-[10px] text-slate-400">完成检测</span>
            </div>
            <div className="font-mono text-xl font-bold text-slate-900">
              {WEEKLY_DYNAMICS_DATA.weeklyOverview.completedTests}项
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span className="text-[10px] text-slate-400">环比增长</span>
            </div>
            <div className="font-mono text-xl font-bold text-emerald-600">
              +{WEEKLY_DYNAMICS_DATA.weeklyOverview.weekOverWeek}%
            </div>
          </div>
        </div>
      </div>

      {/* 重点项目进展 */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-indigo-600" />
          <h3 className="font-semibold text-slate-900">重点项目进展</h3>
        </div>

        <div className="space-y-4">
          {WEEKLY_DYNAMICS_DATA.keyProjects.map((project, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-slate-500">{project.id}</span>
                    <h4 className="font-semibold text-slate-900 text-sm">{project.name}</h4>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {project.client}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {project.department}</span>
                    <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> ¥{project.amount}万</span>
                    <span className="flex items-center gap-1"><User className="h-3 w-3" /> PM: {project.projectManager}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-[10px] font-semibold rounded ${getProjectStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-500">项目进度</span>
                  <span className="text-xs font-bold text-indigo-600">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${project.progress}%` }} />
                </div>
              </div>

              <div className="mb-3">
                <div className="text-[10px] text-slate-500 mb-1">本周进展</div>
                <div className="text-[11px] text-slate-700 flex items-start gap-1">
                  <span className="text-emerald-500 mt-0.5">•</span>
                  <span>{project.weekProgress}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500">风险等级：</span>
                <span className={`px-2 py-0.5 rounded ${getRiskLevelColor(project.riskLevel)}`}>
                  {project.riskLevel === 'low' ? '低风险' : project.riskLevel === 'medium' ? '中风险' : '高风险'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 各部门动态 */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-indigo-600" />
          <h3 className="font-semibold text-slate-900">各部门上周成果</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WEEKLY_DYNAMICS_DATA.departmentUpdates.map((dept, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-900 text-xs">{dept.department}</h4>
                <span className="font-mono text-xs font-bold text-indigo-600">¥{dept.thisWeekRevenue}万</span>
              </div>

              <div>
                <div className="text-[10px] font-semibold text-emerald-700 mb-1.5 flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  本周成果
                </div>
                <div className="space-y-1">
                  {dept.keyAchievements.map((achievement, aIdx) => (
                    <div key={aIdx} className="text-[10px] text-slate-600 flex items-start gap-1">
                      <span className="text-emerald-500 mt-0.5">•</span>
                      <span>{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 重要事件 */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-amber-600" />
          <h3 className="font-semibold text-slate-900">上周重要事件</h3>
        </div>

        <div className="relative pl-6 border-l-2 border-slate-200 space-y-4">
          {WEEKLY_DYNAMICS_DATA.importantEvents.map((event, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-[31px] top-0.5 h-3 w-3 rounded-full bg-indigo-600 border-2 border-white" />
              <div className="flex items-start gap-3">
                <div className="text-[10px] font-mono text-slate-500 whitespace-nowrap">{event.date}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded ${getEventTypeColor(event.type)}`}>
                      {event.type === 'milestone' ? '里程碑' :
                       event.type === 'client' ? '客户' :
                       event.type === 'achievement' ? '成就' :
                       event.type === 'risk' ? '风险' : '内部'}
                    </span>
                    <span className="font-semibold text-slate-900 text-xs">{event.title}</span>
                    {event.impact === 'high' && <Star className="h-3 w-3 text-amber-500" />}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{event.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 客户动态 */}
      <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-indigo-600" />
          <h3 className="font-semibold text-slate-900">重点客户动态</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {WEEKLY_DYNAMICS_DATA.clientDynamics.map((client, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-900 text-xs">{client.company}</h4>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                  client.type === '重点项目' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                  client.type === '战略合作' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                  client.type === '新客户' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                  'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {client.type}
                </span>
              </div>
              <div className="text-[11px] text-slate-600 mb-2">{client.update}</div>
              <div className="text-[10px] text-slate-500">
                对接人：{client.contact}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 风险预警 */}
      <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-5 border border-amber-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <h3 className="font-semibold text-slate-900">风险预警</h3>
        </div>

        <div className="space-y-3">
          {WEEKLY_DYNAMICS_DATA.riskAlerts.map((risk, idx) => (
            <div key={idx} className={`p-3 rounded-lg border ${getRiskLevelColor(risk.level)}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="font-bold text-xs">{risk.title}</div>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${
                  risk.level === 'high' ? 'bg-rose-100 text-rose-700 border-rose-300' :
                  risk.level === 'medium' ? 'bg-amber-100 text-amber-700 border-amber-300' :
                  'bg-blue-100 text-blue-700 border-blue-300'
                }`}>
                  {risk.level === 'high' ? '高风险' : risk.level === 'medium' ? '中风险' : '低风险'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed mb-2">{risk.description}</p>
              <div className="text-[10px] text-slate-600">
                应对措施：{risk.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 导出模态框 */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 text-lg">导出简报</h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">导出格式</label>
                <div className="grid grid-cols-3 gap-2">
                  {['pdf', 'word', 'excel'].map((format) => (
                    <button
                      key={format}
                      onClick={() => setExportFormat(format)}
                      className={`p-3 rounded-lg border-2 transition ${
                        exportFormat === format
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <div className="text-xs font-semibold uppercase">{format}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">包含内容</label>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <span>本周概况</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <span>重点项目进展</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <span>各部门成果</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <span>重要事件</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    <span>风险预警</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleExportReport}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  导出简报
                </button>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-200 transition"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
