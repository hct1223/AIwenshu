/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Company, GroupData } from '../types';

export const COMP_MOCK_LIST: Company[] = [
  {
    id: 'comp-huawei-tech',
    name: '华为技术有限公司',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9STMrxE0EKZnq7uWGPUAfMFpG5LIj2_CjHYF2m94ozMiMELeOlLc9gYE76kxXgtzjyuRCHG6MQJ-x838pwy7t82Hi_5GF-vcOGOgOhVxP3qRkwVIiYM4BosMfolcy2O5XjX2UkydgDwUtatrI7oBQ8VmFc0kk-sA8HMheFigDPvwGm8v332xAns18q_sUZLEHl9t4XOEP2E9ECHBZJkwmJhkfZCwAeQRIuyIAueiqx3CSRFhJhOt2barhRlVS8XP7LYvuA-NSiKI',
    type: '股份有限公司 (民营)',
    growthCategory: '高增长类',
    partnershipLevel: '战略级合作伙伴',
    creditCode: '914403001922038216',
    representative: '赵明路',
    website: 'www.huawei.com',
    phone: '15222111256',
    email: 'liulinjun@huawei.com',
    address: '深圳市龙岗区坂田华为基地B区1号楼',
    establishmentDate: '1987-09-15',
    registeredCapital: '405.41 亿人民币',
    employeesScale: '10000 人以上',
    insuredEmployees: 70416,
    industry: '电子信息与通信设备制造',
    taxpayerStatus: '一般纳税人',
    aiScore: 92,
    complianceRating: 98,
    riskIndex: 12,
    tags: {
      coreDivision: ['高级核心客户', '中国百强企业', '渠道：直接签约'],
      businessPreference: ['深度业务：失效分析', '意向引进：高可靠元器件', '计量校准年单'],
      otherTags: ['活跃：华南区', '高合同留存率', '软件安全审查']
    },
    saibaoCooperationSummary: '华为与工信部电子五所（赛宝实验室）合作历史超过25年。双方在元器件失效分析、车载智能网联软硬件可靠性测试、低空飞行雷达标定计量等领域开展全方位合作。作为赛宝的长期战略客户，华为在其核心供应链元器件筛选、软件测试等任务中常年指定赛宝作为第三方检测检验机构。',
    metrics: [
      { year: '2022', testingAmount: 3820, certAmount: 1240, calibrationAmount: 1820, devAmount: 950, trainingAmount: 490 },
      { year: '2023', testingAmount: 4920, certAmount: 1650, calibrationAmount: 2240, devAmount: 1100, trainingAmount: 580 },
      { year: '2024', testingAmount: 5850, certAmount: 1980, calibrationAmount: 2680, devAmount: 1350, trainingAmount: 720 }
    ],
    deptContributions: [
      { name: '技推处 (技术创新与成果推广)', ratio: 35, amount: 2310 },
      { name: '低空产业部 (低空经济软硬件测评)', ratio: 40, amount: 2640 },
      { name: '元器件检测所 (元器件失效筛分)', ratio: 15, amount: 990 },
      { name: '软件评测中心 (鸿蒙安全机制审计)', ratio: 10, amount: 660 }
    ],
    contacts: [
      { id: 'c1', name: '李婷', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0KwWy1Alrn-W5jSeC3a0NqH_uw-CaThC75ieJlHEAPaXoWm0IdSB3bTrVWbW1ij1MPM7mQ6pIBd042XEr-72QDhDn7uEhj88QxJBW43D2siwt8LQuHH4ARs0nXM0bLCi51xGkXM4Uin3G6TMojd7AU4_iAdp_52nc4PxUrsJuSkO7n_2iKChUfS9RDKvF4KxCe-7w74WQ6UtpIOM9y1DjjRjaPsOqnoR42j8serQXX9dHdYE1zjGd8LnGNVGDmYMtEWkJvebEgbk', role: '采购总监/核心供应链主管', phone: '16677275841', email: 'li.ting@huawei.com' },
      { id: 'c2', name: '盖真', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCldR4tD4L6XSSy33YDfvi5T7REZsBXJuKemr04BGFAvOJVnM60DqCpWXNA7GuEWgMkzbkRq_0IFNMEl2YY_xjsqdRw2t-Sh0-bA2T69cVTbOtSGuqFw-P2pFhh48o1ZSvV64ryulQgop-aW7fLXQsbjeZAseXzTotPcgCd_sozPchHLV4kXdLQKsTjJSm9ELiXNTjzsrncFSsG-8voKj-X3suvZVNJgPc_fltSuKm7r1eG_SDnnLuDwWfqr2EGu1gCW3-5tY_dO6k', role: '战略研发总部决策人', phone: '18461051594', email: 'gaizhen@huawei.com' }
    ],
    visitRecords: [
      { id: 'vr1', date: '2024-05-18', type: '技术交流', topic: '智能车载芯片电磁兼容(EMC)可靠性研讨会', leader: '车载事业部葛总', location: '赛宝广州总部科学城园区', handler: '张教授 (元器件所)', department: '元器件检测所' },
      { id: 'vr2', date: '2024-04-10', type: '合同会商', topic: '多口径仪器自标定和计量校准季度框架谈判', leader: '华为供应科主管', location: '深圳坂田基地', handler: '陈工', department: '技推处' },
      { id: 'vr3', date: '2024-03-24', type: '来访预约', topic: '鸿蒙低空物联通讯模块环境适应性检测申报', leader: '低空业务技术专家组', location: '赛宝增城试验基地', handler: '王主任', department: '低空产业处' }
    ],
    activityLogs: [
      { id: 'log1', timestamp: '2024-05-24 14:30', title: '提交【低空经济高精度飞控芯片环境筛选】申报书', type: 'declare', phone: '15200010001', email: 'user1@huawei.com', summary: '华为低空部门向赛宝实验室申报开展军规级可靠性循环加速老化测试，批次共300颗，申请周期12天。' },
      { id: 'log2', timestamp: '2024-05-20 09:15', title: '收到元器件失效分析样品及测试款项到账通知', type: 'contract', summary: '华为技术采购部门到账 ￥620万元 测试首笔合作款，涉及4纳米射频功率放大器工艺批次。' },
      { id: 'log3', timestamp: '2024-04-12 11:00', title: '完成Q2自备标准表及示波器检测报告归档', type: 'email', email: 'cal-admin@huawei.com', summary: '共出具 114 份计量合格证书，归档至赛宝实验室计量校准数据库系统，已通过华为合规部门审查。' }
    ],
    cooperationContracts: [
      {
        id: 'c-hw-01',
        contractNo: 'SB2024HW0891',
        name: '智能车载芯片电磁兼容性(EMC)与高可靠性试验服务合同',
        amount: 1820,
        signDate: '2024-03-10',
        startDate: '2024-03-15',
        endDate: '2024-12-31',
        status: '履行中',
        department: '元器件检测所',
        projectLeader: '张教授',
        summary: '开展智能车载网联主控SOC及射频芯片大批量极限温湿度、振动交变应力及电磁兼容度测试，出具国家一级质量资质认证。'
      },
      {
        id: 'c-hw-02',
        contractNo: 'SB2024HW0322',
        name: '鸿蒙低空物联蜂窝标准通信模块环境耐受性标定年单合同',
        amount: 2640,
        signDate: '2024-01-20',
        startDate: '2024-02-01',
        endDate: '2025-01-31',
        status: '履行中',
        department: '低空产业部',
        projectLeader: '王主任',
        summary: '针对华为智能物流无人机及低空飞行传感器设备提供的恶劣气候模拟、信号稳定性标定及气动结构电磁干扰校准测试。'
      },
      {
        id: 'c-hw-03',
        contractNo: 'SB2023HW1202',
        name: '军规级高可靠元器件筛选与失效分析机理专项技术研发合同',
        amount: 990,
        signDate: '2023-11-15',
        startDate: '2023-11-20',
        endDate: '2024-05-15',
        status: '已完成',
        department: '元器件检测所',
        projectLeader: '张教授',
        summary: '交付对华为海思4纳米微纳工艺射频大功率芯片批次的热应力阻抗漂移建模、空洞率X-Ray扫描及批次筛选分析。'
      }
    ]
  },
  {
    id: 'comp-zte',
    name: '中兴通讯股份有限公司',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTw8rspV4_ttHUiwfOL-eWbLGvjGpQPp3iK6OdmhVaz3mzgDK-Iuximante-cqTQFyrm_W3hCMtb52tTlwwEJvPBNH1fng1DDvNsQsoH_5FUtAyaUtJBnjYiChI0BZAILJwDvexB5z98icnYigtB7NowuMWToZoGSsWa4hDF1NVz9LXQ7iKCWQ9B1gfOU5SGJjghfvFD9aawaT7OJxd3EOV--Srg5Ekk8qUW8J74ifkNq12KmrzpEN6IBPHgpy0HQcAAfj_9XmLT0',
    type: '股份有限公司 (上市)',
    growthCategory: '稳健型',
    partnershipLevel: '核心供应商',
    creditCode: '914403001922038999',
    representative: '李自学',
    website: 'www.zte.com.cn',
    phone: '0755-26770000',
    email: 'contact@zte.com.cn',
    address: '深圳市南山区高新技术产业园科技南路55号',
    establishmentDate: '1997-11-11',
    registeredCapital: '47.37 亿人民币',
    employeesScale: '10000 人以上',
    insuredEmployees: 34520,
    industry: '通信与电子设备制造业',
    taxpayerStatus: '一般纳税人',
    aiScore: 85,
    complianceRating: 92,
    riskIndex: 18,
    tags: {
      coreDivision: ['重点合作商', '国之重器', '通信枢纽'],
      businessPreference: ['5G射频模组认证', '软件健壮性评测', '可靠性试验所'],
      otherTags: ['华南长单', '技术成熟度高']
    },
    saibaoCooperationSummary: '中兴通讯在5G高频通信及天线计量、核心光芯片测试以及供应链环境应力测试中，与赛宝实验室长期建立联合实验室标准。双方共同起草了多项通信领域的国家和行业质量标准。',
    metrics: [
      { year: '2022', testingAmount: 2100, certAmount: 850, calibrationAmount: 1100, devAmount: 430, trainingAmount: 210 },
      { year: '2023', testingAmount: 2450, certAmount: 920, calibrationAmount: 1300, devAmount: 510, trainingAmount: 290 },
      { year: '2024', testingAmount: 2920, certAmount: 1120, calibrationAmount: 1550, devAmount: 620, trainingAmount: 380 }
    ],
    deptContributions: [
      { name: '技推处 (技术成果转化)', ratio: 45, amount: 1200 },
      { name: '元器件检测所 (元器件筛选)', ratio: 30, amount: 800 },
      { name: '可靠性试验中心 (大型结构震动试验)', ratio: 25, amount: 660 }
    ],
    contacts: [
      { id: 'z1', name: '王明', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXRbNfs4WMlA6iYXfKuGpUFkhjpLRt0ZFWnEGautczGcSeP7VGql_oVV3Wfi2BFTcYcgFK6a6MmUkYPFZm1KtRPJV8YWaaR0G71jnGPK6ieBJXb8iQXfXXldOrFejScmPhUXuCeGmS0OfQnJD16QzaPfGw9zoEfw910vfkZHFW2isfSDhPp39wBgtU3EvFfQ8tk6IoFFjmP3XwO8FVHliblI4Yeq7h949ns7hcpn7Pxmx9tieRBt1ltT-KKcIPZ7Nm9CSKKmwxVlM', role: '中兴采购总监', phone: '13911223344', email: 'wang.ming@zte.com' }
    ],
    visitRecords: [
      { id: 'zvr1', date: '2024-04-12', type: '技术交流', topic: '5G基站电源高低温循环测试交流', leader: '中兴基站研发部', location: '赛宝天河园区', handler: '陈主任', department: '可靠性试验室' }
    ],
    activityLogs: [
      { id: 'zl1', timestamp: '2024-05-18 10:00', title: '取得【赛宝环境与可靠性测试中心】合格证书', type: 'declare', summary: '中兴最新车载5G天线模块顺利通过赛宝1000小时盐雾 and 高低温交变震动联调测试。' }
    ],
    cooperationContracts: [
      {
        id: 'c-zt-01',
        contractNo: 'SB2024ZT0112',
        name: '5G基站高频电源模块大型结构振动及环境寿命试验意向年单',
        amount: 800,
        signDate: '2024-02-20',
        startDate: '2024-03-01',
        endDate: '2025-02-28',
        status: '履行中',
        department: '可靠性试验中心',
        projectLeader: '陈主任',
        summary: '对中兴通讯户外型大功率基站电源进行抗拉剪力、三向电磁激振、1000小时高低温交变应力及防雨防尘标定。'
      },
      {
        id: 'c-zt-02',
        contractNo: 'SB2023ZT0944',
        name: '核心高速光传输芯片物理可靠度筛选谈判及合同书',
        amount: 1200,
        signDate: '2023-09-10',
        startDate: '2023-09-15',
        endDate: '2024-03-15',
        status: '已完成',
        department: '元器件检测所',
        projectLeader: '张教授',
        summary: '针对中兴重点光交叉及多路复用芯片实施精密电性能老化及失效分析，成功出具首台套工信部推荐检测凭证。'
      }
    ]
  },
  {
    id: 'comp-byd',
    name: '比亚迪股份有限公司',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6zA-ULNgDN6jwqdEqkcX9xSXBfPwYBG8BKzwgbWLuakzRQCWe71mTEZlHCO162VL7GpJqGdlNMT3g1RqTVCUsEtvUq33o4XbNQ_mo3RzLK6UPEijUFSGr4s2mA-PqBJkjRAM8GWe2pkZt_9BJHslenSOdBK_0UMFY6iNDZN349TJ9UjbXxo8qzDSosKbYjLozzg7CKtRuLEh9DdSJMUns9e4MaTH2KhZncIvDGoF9lE_1FMW91_ixi7aXXNn4VD7zsoqQx9h-LyE',
    type: '股份有限公司',
    growthCategory: '高增长类',
    partnershipLevel: '战略级合作伙伴',
    creditCode: '91440300192203812C',
    representative: '王传福',
    website: 'www.bydauto.com.cn',
    phone: '0755-89888888',
    email: 'byd@byd.com',
    address: '深圳市坪山区比亚迪路3009号',
    establishmentDate: '1995-02-10',
    registeredCapital: '29.11 亿人民币',
    employeesScale: '10000 人以上',
    insuredEmployees: 120450,
    industry: '新能源汽车与轨道交通智造',
    taxpayerStatus: '一般纳税人',
    aiScore: 94,
    complianceRating: 96,
    riskIndex: 9,
    tags: {
      coreDivision: ['新能源巨头', 'A股翘楚', '全产业链布局'],
      businessPreference: ['车规级芯片失效分析', '动力电池系统安全标定', '新能源实验室联建'],
      otherTags: ['巨型成长型', '核心合作方']
    },
    saibaoCooperationSummary: '比亚迪与赛宝实验室合力在新一代车规芯片（如IGBT及碳化硅半导体）失效风险排查、动力电池极端条件热失控测试以及无人智能驾驶系统仿真安全性检测深度对公。目前比亚迪半导体部门在申报车规认证时，将赛宝作为指定的国家一级质量合作检测所。',
    metrics: [
      { year: '2022', testingAmount: 2500, certAmount: 900, calibrationAmount: 1200, devAmount: 600, trainingAmount: 300 },
      { year: '2023', testingAmount: 4100, certAmount: 1800, calibrationAmount: 2100, devAmount: 950, trainingAmount: 450 },
      { year: '2024', testingAmount: 5200, certAmount: 2350, calibrationAmount: 2800, devAmount: 1250, trainingAmount: 620 }
    ],
    deptContributions: [
      { name: '元器件检测所 (多晶圆筛选)', ratio: 45, amount: 1800 },
      { name: '低空与智能装备部 (车规仿真测试)', ratio: 35, amount: 1400 },
      { name: '计量校准所 (产线高精度千分表标定)', ratio: 20, amount: 800 }
    ],
    contacts: [
      { id: 'b1', name: '张经理', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBw0vufFDCMKOgBQVXDh-WhAQj4FOZnNFjfqk0zFKBHKITw-efrzAaAY-PZfaF7HZosZLRuPQGi0oKZVxnPN30VFHwbm75wqCYSgjNO1lC6eEZiIDXueSN9RiVuSUb-13XIQY_JKmxxqegFbuHZI26ZBsl_jjhWaijFyVeVu1rzylMny4o0f2SXdktePC4Am5l239HHiUxbD9kKi9wACUqqzlwshO_DAsyNcLyAnUFMXEPr0WeoupHi7tphsU_GlRDKN82r-EhDWRw', role: '品质控制部供应链总工', phone: '13822119900', email: 'zhang.jf@byd.com' }
    ],
    visitRecords: [
      { id: 'bvr1', date: '2024-05-10', type: '合同会商', topic: '比亚迪半导体车规认证长期框架协议签订', leader: '王半导体研究院副院长', location: '赛宝广州科學城总所', handler: '朱教授', department: '元器件检测所' }
    ],
    activityLogs: [
      { id: 'bl1', timestamp: '2024-05-21 16:10', title: '【大功率碳化硅SiC组件可靠性分析】正式入库签收', type: 'declare', summary: '比亚迪采购一处将15组车端主电机逆变器功率半导体快递至赛宝元器件筛分中心，用于Q3高低温脉冲试验。' }
    ],
    cooperationContracts: [
      {
        id: 'c-byd-01',
        contractNo: 'SB2024BYD0320',
        name: '车规级SiC半导体功率模块失效排查与气密性测试协议',
        amount: 1400,
        signDate: '2024-01-15',
        startDate: '2024-01-20',
        endDate: '2024-12-31',
        status: '履行中',
        department: '元器件检测所',
        projectLeader: '朱教授',
        summary: '对新一代双面冷却SiC功率半导体开展PCT变温、高压加速水分耐受性测试，完成切片扫描与键合线可靠度剥离拉力验证。'
      },
      {
        id: 'c-byd-02',
        contractNo: 'SB2024BYD0502',
        name: '动力电池热失控多工况极端安全测试以及资质认证年单',
        amount: 800,
        signDate: '2024-04-10',
        startDate: '2024-04-15',
        endDate: '2025-04-14',
        status: '履行中',
        department: '计量校准所',
        projectLeader: '张经理',
        summary: '联合比亚迪建立整包锂电池安全极限评测规范，针对电池抗挤压针刺、大爆振、极端跌落性能进行全栈标定服务。'
      }
    ]
  },
  {
    id: 'comp-saibao-labs',
    name: '赛宝智能科技有限公司 (赛宝实验室代表机构/子公司)',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfTA6n2AwXoj5KE2QinC5b-5vy-I4gKlp_GwJ5YBJTBNZxwJ3N5YhEApezxSioYEaP8pLsnLg44-yFcSO_UJGHoq5qJnp16cLxZQQ9WGgv2wTudRqr9WjW-xofjRlxOwtOaJB7s0ppbW2pRZkGoCKt7Ouv7Xff9JLkmnyF_Z_1Im_uHF6Scxazrhtsy1BoB722Mgi4Jdz7RxeP3nfW-HKNvSievhwW14qNhS8eTBGWwwwXGmt3dJK8EufbFkxhY_-rXf_SdLxSRTE',
    type: '股份有限公司',
    growthCategory: '高增长类',
    partnershipLevel: '战略级合作伙伴',
    creditCode: '91440101MA59XXXX',
    representative: '张三丰',
    website: 'www.ceprei.com',
    phone: '020-89882323',
    email: 'marketing@ceprei-biz.com',
    address: '广州市天河区东莞庄路110号',
    establishmentDate: '2016-01-01',
    registeredCapital: '5,000万 RMB',
    employeesScale: '1000 - 5000人',
    insuredEmployees: 1845,
    industry: '专业技术服务、检验检测、数字化研发与系统集成',
    taxpayerStatus: '一般纳税人',
    aiScore: 94,
    complianceRating: 100,
    riskIndex: 2,
    tags: {
      coreDivision: ['部直属研究机构子公司', '高技术服务大中型企业', '数字化先行者'],
      businessPreference: ['元器件检测与筛分', '国防装备试验', '低空无人机系统合格审定'],
      otherTags: ['多维融合', '工信支撑单位']
    },
    saibaoCooperationSummary: '本司作为工业和信息化部电子第五研究所（赛宝实验室）的产业化智能科技开发实体，负责全流程数字化营销体系、多层级业务大盘和AI智能分析系统的集成交付。承担了与华为集团、中国电科、比亚迪等核心企业之间的大型业务对接，是赛宝外部合作数字化连接的主轴承枢纽。',
    metrics: [
      { year: '2022', testingAmount: 4500, certAmount: 2100, calibrationAmount: 1540, devAmount: 1890, trainingAmount: 890 },
      { year: '2023', testingAmount: 5120, certAmount: 2450, calibrationAmount: 1820, devAmount: 2310, trainingAmount: 1100 },
      { year: '2024', testingAmount: 5890, certAmount: 2880, calibrationAmount: 2150, devAmount: 2750, trainingAmount: 1380 }
    ],
    deptContributions: [
      { name: '元器件与材料可靠性模块', ratio: 40, amount: 2500 },
      { name: '装备与整机检测事业部', ratio: 30, amount: 1875 },
      { name: '软件评测与信息安全中心', ratio: 20, amount: 1250 },
      { name: '计量检测与标准开发室', ratio: 10, amount: 625 }
    ],
    contacts: [
      { id: 's1', name: '陈明', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADYp5UIh-PSC_dFiIXcxUN1fNl8toXnWATtxdbFkpCFJw6rgJdSb0QRUiGQVu7JOsXbu-Fvr7jDGKa3Dwf26dv-47GIMSQ-12MR1EGCewZF3kfoIqGMXUafk-j_onwdq1ZyOhEQ0Td8NQEQhFeYOkkAs_XOOH2EmXQmdg2wOC4pXbwqstObRPPSLRIcA5VOd-PGFh6Mast4uep_kO_E_XmlLYOdByR_oL-Ly0Zg2LWMK2FqDPjilqeBwjQ0y1QvBmBxT4AdR--tvA', role: '系统软件中心 CTO 办公室首席架构师', phone: '13500223322', email: 'chenm@ceprei.com' }
    ],
    visitRecords: [
      { id: 'svr1', date: '2024-05-20', type: '技术交流', topic: '工信部数据要素可控交换与深度应用研讨', leader: '总所科研处长', location: '赛宝广州总部大楼101会议室', handler: '陈总', department: '技推处' }
    ],
    activityLogs: [
      { id: 'sl1', timestamp: '2024-05-28 14:00', title: '发布【云上赛宝数智大盘系统】正式部署通告', type: 'declare', summary: '系统成功贯通华南、华中核心测试基地的数据专线，实现面向各主机厂/头部重点客户订单状态的秒级追踪与AI自动合规预测。' }
    ],
    cooperationContracts: [
      {
        id: 'c-sb-01',
        contractNo: 'SB2024SB0001',
        name: '工业级数智协同专盘看板系统及AI智能研判云开发合同',
        amount: 1250,
        signDate: '2024-01-05',
        startDate: '2024-01-10',
        endDate: '2024-12-31',
        status: '履行中',
        department: '软件评测与信息安全中心',
        projectLeader: '陈明',
        summary: '承接赛宝重点数智化工程，支撑全所部室及重点客户合作状态、项目落资、合规履约、走访流转等核心业务系统的全面线上贯通。'
      },
      {
        id: 'c-sb-02',
        contractNo: 'SB2024SB0215',
        name: '装备整机可靠性检测及自主可控审计配套服务协议',
        amount: 1875,
        signDate: '2024-02-15',
        startDate: '2024-02-20',
        endDate: '2024-11-30',
        status: '履行中',
        department: '装备与整机检测事业部',
        projectLeader: '陈明',
        summary: '配套智能科技公司针对国之重器相关高端装备的集成交付检测、软件白盒测试及系统安全机制审计保障。'
      }
    ]
  }
];

export const GROUP_MOCK_LIST: GroupData[] = [
  {
    id: 'group-huawei',
    name: '华为集团',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFRzYC4ZXB23g6qdVUdexaVkdwNE-fD4UoJ2Iq8_eHj6bm3BGhMOtLBbvZIje4cgCg0oHmXIiyDIwrb9ndWDpSHmOv-RaAphyBY_oGP9lXnbyUzvFNadRfQhY4shKnLSuA5S0z3mTtT799k36T-v-cgU_SUsnjZKfC2w-QOlWD7Jp79aNkOm-xKhmKt4-kZuz0a2j56r2hzokiUV_DbtXFjCiIqc5ljBcIae4iPopzgIIE4clM8xN9QuvJRyWk8di8BgpDumgKXRM',
    controllingEntity: '华为投资控股有限公司',
    totalSubCompanies: 121,
    partneredCompanies: 88,
    growthCategory: '高增长类',
    partnershipLevel: '顶尖客户 / 战略协议签订主体',
    aiPotentialScore: 98,
    cooperationSummary: '华为集团依托其投资控股平台，在全国设立多个产业实体。近年来受低空飞行发展、大语言模型安全、车载芯片国产替代三大热潮驱动，其子机构在赛宝实验室的检测鉴定单项合同额屡创新高。数字化AI智能模型推荐我们在接下来的季度深耕华为在广州地区布局的智能车路协同项目。',
    riskHighlights: [
      { level: 'high', title: '高危预警：关联竞聘风险', description: '其子公司“华为机器有限公司”近期在精密设备外协筛选中，将20%的市场份额倾斜给第三方合肥检测机构，存在合作额轻微流失风险。', date: '今日更新' },
      { level: 'medium', title: '舆情动态：采购管理集中化', description: '根据中高层渠道分析，其Q4季度将把集团级精密仪器校准权收拢至深圳松山湖基地采购科。建议我司主动对接大区框架。', date: '上周更新' }
    ],
    recommendationPaths: [
      { step: 1, title: '触达华南区供应链 CTO 团队', description: '推荐由赛宝长期合作对接人“张建国（外接特约代表）”直接递交最新失效分析及车规安全测试成果。' },
      { step: 2, title: '承办联合实验室专项技术路演', description: '在赛宝天河基地进行现场宣讲，重点向华为半导体研发工程师团队展示我们国内一流的SiC芯片失效加速耐受评测量化技术。' },
      { step: 3, title: '邀约华为采购决策层实地参观赛宝决策室', description: '展示云上赛宝数据驾驶舱与国家级重点实验室的检测承接综合体底色，预计转化率可达 78.4%。' }
    ],
    subCompanies: [
      { id: 'comp-huawei-tech', name: '华为技术有限公司', isPartnered: true, cooperationAmount: 6320, lastDate: '2024-05-20', priority: '极高 P0', region: '华南' },
      { id: 'sub-hw-terminal', name: '华为终端有限公司', isPartnered: true, cooperationAmount: 2200, lastDate: '2024-05-20', priority: '高 P1', region: '华南' },
      { id: 'sub-hw-software', name: '华为软件技术有限公司', isPartnered: false, cooperationAmount: 0, lastDate: '-', priority: '核心挖掘', region: '华东' },
      { id: 'sub-hw-digital', name: '华为数字能源技术有限公司', isPartnered: true, cooperationAmount: 1840, lastDate: '2024-04-28', priority: '高 P1', region: '华北' },
      { id: 'sub-hw-cloud', name: '华为云计算技术有限公司', isPartnered: true, cooperationAmount: 1100, lastDate: '2024-02-15', priority: '中 P2', region: '西北' },
      { id: 'sub-hw-car', name: '深圳引望智能技术有限公司 (拟定智能汽车解决方案子集)', isPartnered: false, cooperationAmount: 0, lastDate: '-', priority: '战略储备', region: '华南' }
    ]
  },
  {
    id: 'group-cetc',
    name: '中国电科集团',
    logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpxZWoMXbF9dbRnGLxlJH7LaeBGTw7SeWfg9A0MgKba57N_zb5iPAiVWwZmGIXuKEP2ErHr8O6cC--a7CX_zY6rvecQ_pXAi_zHGIVUrPTKVfsXTqaAsl9QaviiEjtnZNAAFdA5gJGaWXNb-QTEbZ991jAT_6SEOxm4seQu944Yni21jpXDY_0iRWwALVbiPlSqKOTsJjb37kPfrGb7hvSEZppLqpWMJiI1CJr15v-vdfnw20Q7ZQtU5CwSWreUMzg7gOhmlxfLTQ',
    controllingEntity: '中国电子科技集团有限公司',
    totalSubCompanies: 85,
    partneredCompanies: 72,
    growthCategory: '稳健型',
    partnershipLevel: '战略大客户',
    aiPotentialScore: 95,
    cooperationSummary: '中国电科是军工电子和军用芯片质量控制的战略骨干。作为工信部电子直属机构，赛宝实验室长期承担电科旗下数个重研究所（如第14所、第54所、第38所）的军工产品环测试验与元器件失效机理研究，技术粘性极深。',
    riskHighlights: [
      { level: 'medium', title: '指标波动警示', description: '电科某西部研究所近期经费预算审计收紧，Q3试验预约额度有阶段性回撤。', date: '前天更新' }
    ],
    recommendationPaths: [
      { step: 1, title: '聚焦第三代半导体可靠性长周期合同', description: '优先挖掘其宽禁带功率器件筛选检测任务。' }
    ],
    subCompanies: [
      { id: 'sub-cetc-14', name: '中国电科第十四研究所', isPartnered: true, cooperationAmount: 3800, lastDate: '2024-05-12', priority: '极高 P0', region: '华东' },
      { id: 'sub-cetc-54', name: '中国电科第五十四研究所', isPartnered: true, cooperationAmount: 2900, lastDate: '2024-05-01', priority: '高 P1', region: '华北' },
      { id: 'sub-cetc-30', name: '成都卫士通信息产业股份有限公司', isPartnered: true, cooperationAmount: 850, lastDate: '2024-03-24', priority: '中 P2', region: '西北' }
    ]
  }
];

export const CONTRACTS_SUMMARY = {
  totalAmountBillions: 30.31,
  billingCompletedBillions: 7.81,
  initialCoopBillions: 18.33,
  targetBillions: 2000,
  comparisonYoY: '8.06%',
  smartBrief: '根据最新的合同与业务趋势分析：本月赛宝实验室面向华南高新技术集群（如电子信息与新能源汽车）的【开票金额】呈稳健攀升态势。高增长类客户活跃度环比提升 20.4%，AI算法模型预测在低空经济元器件检验测试的强劲需求下，赛宝下季度全渠道合同目标达成进度有很大机会提前12天达成预期标线。'
};

export const COMMON_AI_QUESTIONS = [
  {
    tag: '经营分析',
    metric: 'trending_up',
    title: '分析今年华南区合作合同同比增速',
    overview: '由AI算法深度计算12个华南大区省市级签约全本，对标2023年周期曲线...',
    promptText: '赛宝AI助手，请帮我分析今年华南大区整体以及核心大客户（如华为、比亚迪等项目）的合同同比增速变化，并计算其在检验测试、认证和计量三大核心科目的占比变化。'
  },
  {
    tag: '风险预测',
    metric: 'warning',
    title: '对华南高新核心级客户流失风险进行评估',
    overview: '融合最近半年回账速率、走访交互频次和订单外协异动，自动判定波动区间...',
    promptText: '请基于最近半年以来的回款情绪、业务访谈走访频度、以及是否有部分外包检验试验转向第三方检测机构的情况，帮我研判当前我们在华南主力合作企业的流失风险与供应链异常预警，并给出一份完整的合规审计改善建议。'
  },
  {
    tag: '市场机会',
    metric: 'rocket_launch',
    title: '检索华东大区高潜力、高粘度高新企业名单',
    overview: '结合赛宝近期中标航迹、最新企业注册资本、参保员工等综合特征智能预测...',
    promptText: '赛宝AI助手，请根据华东区域最新的科技招标形势，以及赛宝在华东（如南京、合肥、上海）的科研优势，推荐5家注册资本大于1000万、参保人数大于150人且近期有检验检测资质升级采购高潜力的科技独角兽企业名录。'
  },
  {
    tag: '效能对标',
    metric: 'compare_arrows',
    title: '对赛宝技推处与低空产业处的签单转化耗时对标',
    overview: '针对内部核心部室，提取从商机线索录入到出具正式测试合同的流转日均值...',
    promptText: '我们需要优化业务合同流转审批效率。请对比赛宝技推处、低空产业处、元器件所三大核心业务部门，从获取客户检测需求到最终商务签约和出具首批检验报告的日均耗时差，进行可视化横向比对。'
  }
];
