import { NewsItem, TenderItem } from '../types';

export const MOCK_NEWS_DATA: (NewsItem | TenderItem)[] = [
  // 政策法规
  {
    id: 'policy-001',
    title: '新能源汽车产业发展规划（2024-2030）',
    type: 'policy',
    department: '工信部',
    publishTime: '2小时前',
    tags: ['新能源汽车', '产业政策', '发展规划'],
    summary: '本规划旨在推动新能源汽车产业高质量发展，明确产业目标、重点任务和保障措施，为行业发展提供政策指引。',
    content: '详细内容...'
  },
  {
    id: 'policy-002',
    title: '半导体产业扶持资金管理办法',
    type: 'policy',
    department: '财政部',
    publishTime: '1天前',
    tags: ['半导体', '财政扶持', '资金管理'],
    summary: '规范半导体产业扶持资金的使用和管理，提高资金使用效益，推动产业创新发展。',
    content: '详细内容...'
  },
  {
    id: 'policy-003',
    title: '低空经济产业创新发展指导意见',
    type: 'policy',
    department: '发改委',
    publishTime: '3天前',
    tags: ['低空经济', '产业创新', '发展指导'],
    summary: '促进低空经济产业创新发展，规范行业秩序，培育新的经济增长点。',
    content: '详细内容...'
  },

  // 市场趋势
  {
    id: 'market-001',
    title: '半导体市场规模预测2024年将突破5000亿',
    type: 'market',
    department: '赛迪顾问',
    publishTime: '5小时前',
    tags: ['半导体', '市场预测', '规模分析'],
    summary: '根据最新研究报告，2024年中国半导体市场规模预计将突破5000亿元，同比增长15%以上。',
    content: '详细内容...'
  },
  {
    id: 'market-002',
    title: '新能源汽车下乡活动成效显著',
    type: 'market',
    department: '中汽协',
    publishTime: '1天前',
    tags: ['新能源汽车', '市场活动', '下乡推广'],
    summary: '新能源汽车下乡活动开展三个月以来，累计销量突破50万辆，有效激活了农村消费市场。',
    content: '详细内容...'
  },
  {
    id: 'market-003',
    title: '低空经济产业链投资热度持续升温',
    type: 'market',
    department: '投中研究院',
    publishTime: '2天前',
    tags: ['低空经济', '投资趋势', '产业链'],
    summary: '2024年上半年低空经济领域投资事件超过200起，总投资额突破500亿元，产业链各环节投资热度持续升温。',
    content: '详细内容...'
  },

  // 招标信息
  {
    id: 'tender-001',
    title: '华东地区检测服务采购项目',
    type: 'tender',
    department: '华东地区政府采购中心',
    publishTime: '6小时前',
    tags: ['检测服务', '政府采购', '华东地区'],
    summary: '采购检测服务，要求具备CNAS资质。',
    deadline: '2024-06-15 17:00',
    budget: '¥500万',
    region: '华东地区',
    requirements: '具备CNAS资质，有类似项目经验，通过ISO9001认证'
  },
  {
    id: 'tender-002',
    title: '华南地区环境试验设备采购招标',
    type: 'tender',
    department: '广东省政府采购中心',
    publishTime: '1天前',
    tags: ['环境试验', '设备采购', '华南地区'],
    summary: '采购环境试验设备一批，包括高低温试验箱、盐雾试验箱等。',
    deadline: '2024-06-20 17:00',
    budget: '¥800万',
    region: '华南地区',
    requirements: '设备需符合国家标准，提供3年质保服务'
  },
  {
    id: 'tender-003',
    title: '软件评测服务框架协议采购',
    type: 'tender',
    department: '工业和信息化部',
    publishTime: '2天前',
    tags: ['软件评测', '框架协议', '服务采购'],
    summary: '建立软件评测服务框架协议，为各部门提供统一评测服务。',
    deadline: '2024-06-25 17:00',
    budget: '¥1200万',
    region: '全国',
    requirements: '具备软件评测资质，通过CMA认证，有政府服务经验'
  },

  // 热点动态
  {
    id: 'hotspot-001',
    title: '行业动态：华为发布新款AI芯片',
    type: 'hotspot',
    department: '科技日报',
    publishTime: '30分钟前',
    tags: ['华为', 'AI芯片', '产品发布'],
    summary: '华为正式发布新款AI芯片，算力提升3倍，功耗降低40%，将在数据中心、自动驾驶等领域应用。',
    content: '详细内容...'
  },
  {
    id: 'hotspot-002',
    title: '比亚迪新能源车销量再创新高',
    type: 'hotspot',
    department: '财联社',
    publishTime: '2小时前',
    tags: ['比亚迪', '新能源汽车', '销量'],
    summary: '比亚迪5月新能源车销量突破30万辆，同比增长45%，继续领跑新能源汽车市场。',
    content: '详细内容...'
  },
  {
    id: 'hotspot-003',
    title: '低空经济示范区建设启动',
    type: 'hotspot',
    department: '新华网',
    publishTime: '4小时前',
    tags: ['低空经济', '示范区', '政策落地'],
    summary: '全国首批10个低空经济示范区建设正式启动，将在无人机物流、空中交通管理等领域开展试点。',
    content: '详细内容...'
  },
  {
    id: 'hotspot-004',
    title: '半导体设备国产化率突破30%',
    type: 'hotspot',
    department: '经济日报',
    publishTime: '8小时前',
    tags: ['半导体', '设备国产化', '产业进展'],
    summary: '2024年一季度半导体设备国产化率突破30%，刻蚀机、薄膜设备等领域取得重大突破。',
    content: '详细内容...'
  },
  {
    id: 'hotspot-005',
    title: '新能源汽车充电设施建设加速',
    type: 'hotspot',
    department: '能源新闻网',
    publishTime: '12小时前',
    tags: ['新能源汽车', '充电设施', '基础设施建设'],
    summary: '国家发改委发布通知，要求各地加快新能源汽车充电设施建设，2024年新增充电桩50万个。',
    content: '详细内容...'
  }
];

// 按类型分类的数据
export const NEWS_BY_TYPE = {
  policy: MOCK_NEWS_DATA.filter(item => item.type === 'policy'),
  market: MOCK_NEWS_DATA.filter(item => item.type === 'market'),
  tender: MOCK_NEWS_DATA.filter(item => item.type === 'tender'),
  hotspot: MOCK_NEWS_DATA.filter(item => item.type === 'hotspot'),
};

// 统计信息
export const NEWS_STATS = {
  policy: NEWS_BY_TYPE.policy.length,
  market: NEWS_BY_TYPE.market.length,
  tender: NEWS_BY_TYPE.tender.length,
  hotspot: NEWS_BY_TYPE.hotspot.length,
  total: MOCK_NEWS_DATA.length,
};
