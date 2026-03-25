/**
 * 编辑器 Mock 数据
 * 用于原型展示和测试
 */

// 麻将牌数据
export const mockMahjongCards = {
  // 万子 (1-9万)
  wan: [
    { name: '1万', hex: '0x01', type: 'wan', count: 4 },
    { name: '2万', hex: '0x02', type: 'wan', count: 4 },
    { name: '3万', hex: '0x03', type: 'wan', count: 4 },
    { name: '4万', hex: '0x04', type: 'wan', count: 4 },
    { name: '5万', hex: '0x05', type: 'wan', count: 4 },
    { name: '6万', hex: '0x06', type: 'wan', count: 4 },
    { name: '7万', hex: '0x07', type: 'wan', count: 4 },
    { name: '8万', hex: '0x08', type: 'wan', count: 4 },
    { name: '9万', hex: '0x09', type: 'wan', count: 4 },
  ],
  // 条子 (1-9条)
  tiao: [
    { name: '1条', hex: '0x11', type: 'tiao', count: 4 },
    { name: '2条', hex: '0x12', type: 'tiao', count: 4 },
    { name: '3条', hex: '0x13', type: 'tiao', count: 4 },
    { name: '4条', hex: '0x14', type: 'tiao', count: 4 },
    { name: '5条', hex: '0x15', type: 'tiao', count: 4 },
    { name: '6条', hex: '0x16', type: 'tiao', count: 4 },
    { name: '7条', hex: '0x17', type: 'tiao', count: 4 },
    { name: '8条', hex: '0x18', type: 'tiao', count: 4 },
    { name: '9条', hex: '0x19', type: 'tiao', count: 4 },
  ],
  // 筒子 (1-9筒)
  tong: [
    { name: '1筒', hex: '0x21', type: 'tong', count: 4 },
    { name: '2筒', hex: '0x22', type: 'tong', count: 4 },
    { name: '3筒', hex: '0x23', type: 'tong', count: 4 },
    { name: '4筒', hex: '0x24', type: 'tong', count: 4 },
    { name: '5筒', hex: '0x25', type: 'tong', count: 4 },
    { name: '6筒', hex: '0x26', type: 'tong', count: 4 },
    { name: '7筒', hex: '0x27', type: 'tong', count: 4 },
    { name: '8筒', hex: '0x28', type: 'tong', count: 4 },
    { name: '9筒', hex: '0x29', type: 'tong', count: 4 },
  ],
  // 字牌 (东南西北中发白)
  zi: [
    { name: '东风', hex: '0x31', type: 'zi', count: 4 },
    { name: '南风', hex: '0x32', type: 'zi', count: 4 },
    { name: '西风', hex: '0x33', type: 'zi', count: 4 },
    { name: '北风', hex: '0x34', type: 'zi', count: 4 },
    { name: '红中', hex: '0x35', type: 'zi', count: 4 },
    { name: '发财', hex: '0x36', type: 'zi', count: 4 },
    { name: '白板', hex: '0x37', type: 'zi', count: 4 },
  ],
  // 花牌 (春夏秋冬梅兰竹菊)
  hua: [
    { name: '春', hex: '0x41', type: 'hua', count: 0 },
    { name: '夏', hex: '0x42', type: 'hua', count: 0 },
    { name: '秋', hex: '0x43', type: 'hua', count: 0 },
    { name: '冬', hex: '0x44', type: 'hua', count: 0 },
    { name: '梅', hex: '0x45', type: 'hua', count: 0 },
    { name: '兰', hex: '0x46', type: 'hua', count: 0 },
    { name: '竹', hex: '0x47', type: 'hua', count: 0 },
    { name: '菊', hex: '0x48', type: 'hua', count: 0 },
  ],
}

// 玩家选项数据
export const mockPlayerOptions = [
  { label: '庄家', value: 'zhuang' },
  { label: '闲家', value: 'xian' },
  { label: '所有玩家', value: 'all' },
  { label: '点炮者', value: 'dianpao' },
  { label: '自摸者', value: 'zimo' },
  { label: '上家', value: 'shangjia' },
  { label: '下家', value: 'xiajia' },
  { label: '对家', value: 'duijia' },
]

// 算分公式示例数据
export const mockScoreCalcData = {
  expr_list: [
    {
      mark: '自摸胡牌',
      loser: 'all',
      calc_expr: ['底分', '*', '倍数', '*', '3'],
      judge_expr: ['胡牌类型', '==', '自摸'],
    },
    {
      mark: '点炮胡牌',
      loser: 'dianpao',
      calc_expr: ['底分', '*', '倍数'],
      judge_expr: ['胡牌类型', '==', '点炮'],
    },
  ],
  winner: {
    id: 'winner',
    body: {
      expr: '胡牌玩家',
    },
    desc: '胡牌的玩家获得分数',
  },
  toggleMultipleScenarios: true,
}

// 动作约束示例数据
export const mockMotionConstraintData = {
  name: '禁止吃牌',
  type: 'forbid',
  actions: ['chi'],
  condition: '手牌数 <= 4',
  timing: 'always',
  message: '手牌不足，不能吃牌',
}

// 分数修正示例数据
export const mockScoreCorrectionData = {
  name: '自摸加成',
  type: 'multiplier',
  value: 2,
  target: 'winner',
  condition: "胡牌类型 == '自摸'",
  priority: 5,
  enabled: true,
  description: '自摸胡牌时分数翻倍',
}

// 预设牌堆配置
export const mockPresetStacks = [
  {
    label: '标准牌堆',
    value: 'standard',
    description: '136张标准麻将牌',
  },
  {
    label: '无花牌',
    value: 'no_hua',
    description: '去掉8张花牌，共128张',
  },
  {
    label: '仅万条筒',
    value: 'only_suits',
    description: '去掉字牌和花牌，共108张',
  },
  {
    label: '仅字牌',
    value: 'only_zi',
    description: '仅保留字牌，共28张',
  },
  {
    label: '仅万子',
    value: 'only_wan',
    description: '仅保留万子，共36张',
  },
  {
    label: '仅条子',
    value: 'only_tiao',
    description: '仅保留条子，共36张',
  },
  {
    label: '仅筒子',
    value: 'only_tong',
    description: '仅保留筒子，共36张',
  },
]

// 导出所有 mock 数据
export default {
  mockMahjongCards,
  mockPlayerOptions,
  mockScoreCalcData,
  mockMotionConstraintData,
  mockScoreCorrectionData,
  mockPresetStacks,
}
