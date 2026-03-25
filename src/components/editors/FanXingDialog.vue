<!--
  功能：番型配置编辑器弹窗 - 选择和配置麻将番型
  移植自 game-settings 下的 ConfigurationModel.vue，使用真实番型数据
-->
<template>
  <el-dialog
    v-model="dialogVisible"
    title="配置番型编辑器"
    width="1200px"
    style="position: relative"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <!-- 搜索和筛选 -->
    <div class="search-section">
      <el-input
        v-model="searchKeyword"
        style="width: 40%"
        placeholder="请输入番型名称"
        clearable
        @input="handleSearch"
      />
      <el-checkbox v-model="showCheckedOnly" style="margin-left: 10px" @change="handleShowCheckedOnlyChange">
        只展示已勾选
      </el-checkbox>
    </div>

    <div class="main-container">
      <!-- 左侧双列导航 -->
      <div class="left-panel">
        <el-scrollbar height="400px" class="scrollbar-item">
          <el-button
            v-for="item in formItems"
            :key="item?.scene"
            class="scrollbar-demo-item"
            :class="{ selected: selectedLevel1 === item?.scene }"
            @click="handleLevel1Select(item, 1)"
          >
            {{ item?.name }}
          </el-button>
        </el-scrollbar>
        <el-scrollbar height="400px" class="scrollbar-item">
          <el-button
            v-for="item in levelTwoData"
            :key="item?.category?.id"
            class="scrollbar-demo-item"
            :class="{ selected: selectedLevel2 === item?.category?.id }"
            @click="handleLevel1Select(item, 2)"
          >
            {{ item?.category?.name }}
          </el-button>
        </el-scrollbar>
      </div>

      <!-- 右侧番型展示 -->
      <div class="right-panel">
        <!-- 基础番型 -->
        <div class="category-section" v-if="filteredBaseFans.length > 0">
          <div class="category-title">基础番型</div>
          <div class="option-grid">
            <div
              v-for="item in filteredBaseFans"
              :key="item?.name"
              class="fan-item"
              :class="{ selected: checkedFans.has(Number(item?.id)) }"
            >
              <el-checkbox
                :model-value="checkedFans.has(Number(item?.id))"
                @change="handleCheckboxChange($event, item?.id)"
              >
                {{ item?.name }}
              </el-checkbox>
              <el-icon class="help-icon" @click="showFanDetail(item)">
                <QuestionFilled />
              </el-icon>
            </div>
          </div>
        </div>

        <!-- 增加番型 -->
        <div class="category-section" v-if="filteredBindFans.length > 0">
          <div class="category-title">叠加番型</div>
          <div class="option-grid">
            <div
              v-for="item in filteredBindFans"
              :key="item?.name"
              class="fan-item"
              :class="{ selected: checkedFans.has(Number(item?.id)) }"
            >
              <el-checkbox
                :model-value="checkedFans.has(Number(item?.id))"
                @change="handleCheckboxChange($event, item?.id)"
              >
                {{ item?.name }}
              </el-checkbox>
              <el-icon class="help-icon" @click="showFanDetail(item)">
                <QuestionFilled />
              </el-icon>
            </div>
          </div>
        </div>

        <!-- 组合番型 -->
        <div class="category-section" v-if="filteredCombineFans.length > 0">
          <div class="category-title">组合番型</div>
          <div class="option-grid">
            <div
              v-for="item in filteredCombineFans"
              :key="item?.name"
              class="fan-item"
              :class="{ selected: checkedFans.has(Number(item?.id)) }"
            >
              <el-checkbox
                :model-value="checkedFans.has(Number(item?.id))"
                @change="handleCheckboxChange($event, item?.id)"
              >
                {{ item?.name }}
              </el-checkbox>
              <el-icon class="help-icon" @click="showFanDetail(item)">
                <QuestionFilled />
              </el-icon>
            </div>
          </div>
        </div>

        <!-- 特殊番型 -->
        <div class="category-section" v-if="filteredSpecialFans.length > 0">
          <div class="category-title">特殊番型</div>
          <div class="option-grid">
            <div
              v-for="item in filteredSpecialFans"
              :key="item?.name"
              class="fan-item"
              :class="{ selected: checkedFans.has(Number(item?.id)) }"
            >
              <el-checkbox
                :model-value="checkedFans.has(Number(item?.id))"
                @change="handleCheckboxChange($event, item?.id)"
              >
                {{ item?.name }}
              </el-checkbox>
              <el-icon class="help-icon" @click="showFanDetail(item)">
                <QuestionFilled />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">保存</el-button>
    </template>

    <!-- 番型详情弹窗 -->
    <div v-if="drawerVisible" class="fan-detail-modal-overlay" @click="drawerVisible = false">
      <div class="fan-detail-modal" @click.stop>
        <!-- 顶部标题栏 -->
        <div class="fan-detail-header">
          <h3>{{ selectedFanItem?.name }} · 番型说明</h3>
          <button class="fan-detail-close" @click="drawerVisible = false">
            <el-icon><Close /></el-icon>
          </button>
        </div>
        
        <!-- 弹窗内容区 -->
        <div class="fan-detail-body">
          <div v-if="selectedFanItem" class="fan-detail-content">
            <!-- 番型规则模块 -->
            <div class="rule-section">
              <div class="section-title">番型规则</div>
              <div class="rule-text">
                {{ selectedFanItem?.description || '暂无说明' }}
              </div>
              
            </div>
            
            <!-- 牌型示例模块 -->
            <div v-if="selectedFanItem?.example_cards?.length > 0" class="example-section">
              <div class="section-title">牌型示例</div>
              <div class="tiles-row">
                <img
                  v-for="(cardValue, index) in selectedFanItem.example_cards"
                  :key="index"
                  class="tile-image"
                  :src="getCardImageUrl(cardValue)"
                  :alt="getCardDisplayName(cardValue)"
                />
              </div>
            </div>
          </div>
          
          <div v-else class="empty-state">
            <el-icon class="empty-icon"><Question-Filled /></el-icon>
            <p>请选择一个番型查看说明</p>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { QuestionFilled, Close, Document, InfoFilled, Collection } from '@element-plus/icons-vue'
import fanxingData from '@/assets/mock/fanxing-data.json'

// 预加载所有麻将牌图片
const mahjongImages = import.meta.glob('@/assets/mahjongcards/*.png', {
  eager: true,
  import: 'default'
})

// 属性定义
const props = defineProps<{
  visible: boolean
  initData?: {
    defaultSelect?: number[]
  }
}>()

// 事件定义
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', value: number[]): void
}>()

const dialogVisible = ref(false)
const searchKeyword = ref('')
const showCheckedOnly = ref(false)
const checkedFans = ref(new Set<number>())
const selectedLevel1 = ref<any>(null)
const selectedLevel2 = ref<any>(null)
const drawerVisible = ref(false)
const selectedFanItem = ref<any>(null)

// 从 JSON 数据获取
const formItems = ref<any[]>(fanxingData.fan_config_list || [])
const levelTwoData = ref<any[]>([])
const eventData = ref<any>({})

// 初始化选中状态
const initCheckedFans = () => {
  const initialIds = props.initData?.defaultSelect || fanxingData.fan_ids || []
  checkedFans.value = new Set(initialIds.map(Number))
}

// 自动选中第一个一级菜单项
const autoSelectFirstItem = () => {
  if (formItems.value.length > 0) {
    const firstItem = formItems.value[0]
    handleLevel1Select(firstItem, 1)
  }
}

// 过滤后的各类番型数据
const filteredBaseFans = computed(() => {
  let fans = eventData.value?.base_fans || []
  if (searchKeyword.value.trim()) {
    fans = fans.filter((item: any) =>
      item?.name?.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  if (showCheckedOnly.value) {
    fans = fans.filter((item: any) => checkedFans.value.has(Number(item?.id)))
  }
  return fans
})

const filteredBindFans = computed(() => {
  let fans = eventData.value?.bind_fans || []
  if (searchKeyword.value.trim()) {
    fans = fans.filter((item: any) =>
      item?.name?.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  if (showCheckedOnly.value) {
    fans = fans.filter((item: any) => checkedFans.value.has(Number(item?.id)))
  }
  return fans
})

const filteredCombineFans = computed(() => {
  let fans = eventData.value?.combine_fans || []
  if (searchKeyword.value.trim()) {
    fans = fans.filter((item: any) =>
      item?.name?.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  if (showCheckedOnly.value) {
    fans = fans.filter((item: any) => checkedFans.value.has(Number(item?.id)))
  }
  return fans
})

const filteredSpecialFans = computed(() => {
  let fans = eventData.value?.special_fans || []
  if (searchKeyword.value.trim()) {
    fans = fans.filter((item: any) =>
      item?.name?.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  if (showCheckedOnly.value) {
    fans = fans.filter((item: any) => checkedFans.value.has(Number(item?.id)))
  }
  return fans
})

// 将牌值转换为显示名称
const getCardDisplayName = (cardValue: number): string => {
  // 简单的牌值映射，可根据需要扩展
  const suit = Math.floor((cardValue - 1) / 16)
  const rank = ((cardValue - 1) % 16) + 1

  const suits = ['万', '条', '筒', '字']

  if (suit < 3 && rank <= 9) {
    return `${rank}${suits[suit]}`
  } else if (suit === 3) {
    const ziPai = ['东', '南', '西', '北', '中', '发', '白']
    if (rank >= 1 && rank <= 7) {
      return ziPai[rank - 1]
    }
  }
  return `牌${cardValue}`
}

// 获取牌面样式类名
const getCardClass = (cardValue: number): string => {
  const suit = Math.floor((cardValue - 1) / 16)
  const rank = ((cardValue - 1) % 16) + 1

  if (suit === 0) return 'wan'      // 万
  if (suit === 1) return 'tiao'     // 条
  if (suit === 2) return 'tong'     // 筒
  if (suit === 3) {
    // 字牌
    if (rank >= 1 && rank <= 4) return 'feng'  // 东南西北
    return 'jian'  // 中发白
  }
  return ''
}

// 获取麻将图片路径
const getCardImageUrl = (cardValue: number): string => {
  // 将牌值转换为16进制格式，如 0x01, 0x11, 0x21, 0x31 等
  const suit = Math.floor((cardValue - 1) / 16)
  const rank = ((cardValue - 1) % 16) + 1

  // 计算16进制值
  // 万子: 0x01-0x09 (1-9)
  // 条子: 0x11-0x19 (17-25)
  // 筒子: 0x21-0x29 (33-41)
  // 字牌: 0x31-0x37 (49-55)
  const hexValue = (suit * 16 + rank).toString(16).toUpperCase().padStart(2, '0')

  // 从预加载的图片中获取路径
  const imageKey = `/src/assets/mahjongcards/0x${hexValue}.png`
  return (mahjongImages[imageKey] as string) || ''
}

// 牌组类型定义
interface CardGroup {
  type: string
  label: string
  cards: number[]
}

// 分析牌型分组（将牌/顺子/刻子）
const analyzedCardGroups = computed<CardGroup[]>(() => {
  const cards = selectedFanItem.value?.example_cards || []
  if (cards.length === 0) return []

  // 统计每张牌的数量
  const cardCount = new Map<number, number>()
  cards.forEach(card => {
    cardCount.set(card, (cardCount.get(card) || 0) + 1)
  })

  const groups: CardGroup[] = []
  const usedCards = new Set<number>()

  // 先找将牌（对子）- 需要2张相同的牌
  for (const [card, count] of cardCount.entries()) {
    if (count >= 2 && !usedCards.has(card)) {
      groups.push({
        type: 'jiang',
        label: '将牌（对子）',
        cards: [card, card]
      })
      usedCards.add(card)
      break // 只取一个将牌
    }
  }

  // 找刻子（三张相同的牌）
  for (const [card, count] of cardCount.entries()) {
    if (count >= 3 && !usedCards.has(card)) {
      groups.push({
        type: 'kezi',
        label: '刻子',
        cards: [card, card, card]
      })
      usedCards.add(card)
    }
  }

  // 找顺子（三张连续的牌）
  const sortedCards = [...new Set(cards)].sort((a, b) => a - b)
  for (let i = 0; i < sortedCards.length - 2; i++) {
    const card1 = sortedCards[i]
    const card2 = sortedCards[i + 1]
    const card3 = sortedCards[i + 2]

    // 检查是否是连续的三张牌（同一花色）
    if (card2 === card1 + 1 && card3 === card1 + 2) {
      // 确保这些牌没有被用作刻子或将牌
      const card1Count = cards.filter(c => c === card1).length
      const card2Count = cards.filter(c => c === card2).length
      const card3Count = cards.filter(c => c === card3).length

      // 检查是否还有剩余可用
      const used1 = groups.filter(g => g.cards.includes(card1)).length
      const used2 = groups.filter(g => g.cards.includes(card2)).length
      const used3 = groups.filter(g => g.cards.includes(card3)).length

      if (card1Count > used1 && card2Count > used2 && card3Count > used3) {
        groups.push({
          type: 'shunzi',
          label: '顺子',
          cards: [card1, card2, card3]
        })
      }
    }
  }

  // 如果分组后还有剩余牌，作为其他组
  const groupedCards = groups.flatMap(g => g.cards)
  const remainingCards = cards.filter((card, index) => {
    const usedIndex = groupedCards.indexOf(card)
    if (usedIndex === -1) return true
    groupedCards.splice(usedIndex, 1)
    return false
  })

  if (remainingCards.length > 0) {
    groups.push({
      type: 'other',
      label: '其他',
      cards: remainingCards
    })
  }

  return groups
})

// 处理一级/二级选择
const handleLevel1Select = (item: any, level: number) => {
  if (level === 1) {
    selectedLevel1.value = item?.scene
    levelTwoData.value = item?.categories || []
    selectedLevel2.value = null
    eventData.value = {}
    if (levelTwoData.value.length > 0) {
      const firstLevel2 = levelTwoData.value[0]
      selectedLevel2.value = firstLevel2?.category?.id
      eventData.value = firstLevel2?.content || {}
    }
  } else if (level === 2) {
    selectedLevel2.value = item?.category?.id
    eventData.value = item?.content || {}
  }
  searchKeyword.value = ''
}

// 处理复选框变化
const handleCheckboxChange = (value: any, id: any) => {
  const checked = Boolean(value)
  if (checked) {
    checkedFans.value.add(Number(id))
  } else {
    checkedFans.value.delete(Number(id))
  }
}

// 处理搜索
const handleSearch = () => {
  // 搜索逻辑通过 computed 属性自动处理
}

// 处理"只展示已勾选"变化
const handleShowCheckedOnlyChange = () => {
  // 无需额外逻辑，computed 属性会自动响应
}

// 显示番型详情
const showFanDetail = (item: any) => {
  selectedFanItem.value = item
  drawerVisible.value = true
}

// 关闭弹窗
const handleClose = () => {
  searchKeyword.value = ''
  showCheckedOnly.value = false
  emit('close')
}

// 确认保存
const handleConfirm = () => {
  const result = [...checkedFans.value]
  emit('confirm', result)
}

// 监听 visible 变化
watch(
  () => props.visible,
  (newVal) => {
    dialogVisible.value = newVal
    if (newVal) {
      initCheckedFans()
      autoSelectFirstItem()
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.search-section {
  margin-bottom: 15px;
}

.main-container {
  display: flex;
  gap: 20px;
  width: 100%;
}

.left-panel {
  width: 30%;
  display: flex;
  flex-direction: row;
  border: 1px solid #e6eaee;
  border-radius: 4px;
  gap: 5px;
}

.right-panel {
  width: 70%;
  padding: 20px;
  background-color: #f5f7fa;
  border: 1px solid #e6eaee;
  border-radius: 4px;
  height: 400px;
  overflow-y: auto;
}

.category-section {
  margin-bottom: 20px;
  padding-left: 15px;
}

.category-title {
  border-left: 4px solid #409eff;
  font-weight: bold;
  font-size: 16px;
  padding-left: 10px;
  margin-bottom: 10px;
  color: #333;
}

// 网格布局
.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

// 番型项样式
.fan-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;

  &:hover {
    border-color: #409eff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  // 选中状态样式
  &.selected {
    background-color: #e6f7ff;
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);

    :deep(.el-checkbox__label) {
      color: #1890ff;
      font-weight: 500;
    }
  }

  :deep(.el-checkbox) {
    margin-right: 0;
    flex: 1;
  }
}

// 问号图标样式
.help-icon {
  font-size: 16px;
  color: #909399;
  cursor: pointer;
  margin-left: 8px;
  transition: color 0.3s ease;

  &:hover {
    color: #409eff;
  }
}

.scrollbar-item {
  flex: 1;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0 8px;
}

.scrollbar-demo-item {
  width: 100%;
  height: 42px;
  border: none;
  background-color: #e6eaee;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
  text-align: center;
  transition: all 0.3s ease;
}

.scrollbar-demo-item:hover {
  background-color: #fbddd5;
  cursor: pointer;
}

.scrollbar-demo-item.selected {
  background-color: #fbddd5;
}

// 番型详情弹窗样式
.fan-detail-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: transparent;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-bottom: 60px;
  animation: fadeIn 0.2s ease;
  pointer-events: none;
}

.fan-detail-modal {
  width: 900px;
  max-width: 95%;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.2s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  pointer-events: auto;
  max-height: 50vh;
}

// 顶部标题栏
.fan-detail-header {
  height: 48px;
  background-color: #1677ff;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fan-detail-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

// 关闭按钮 - 扩大点击热区
.fan-detail-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  cursor: pointer;
  border: none;
  background: transparent;
  font-size: 20px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
}

// 弹窗内容区
.fan-detail-body {
  padding: 24px;
  flex: 1;
  overflow-y: visible;
  background-color: #ffffff;
}

.fan-detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

// 规则模块
.rule-section {
  margin-bottom: 4px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #1d2129;
  margin-bottom: 12px;
  display: flex;
  align-items: center;

  &::before {
    content: "📋";
    margin-right: 8px;
    font-size: 16px;
  }
}

.rule-text {
  font-size: 14px;
  line-height: 1.6;
  color: #4e5969;
}

// 核心规则高亮
:deep(.key-rule) {
  color: #1677ff;
  font-weight: 600;
}

.supplement-rule {
  margin-top: 8px;
  font-size: 13px;
  color: #86909c;
}

// 牌型示例模块
.example-section {
  background-color: #f7f8fa;
  border-radius: 8px;
  padding: 16px;

  .section-title::before {
    content: "🀄";
  }
}

// 牌组容器 - 响应式换行
.tile-groups {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 12px;
}

// 单个牌组（将牌/顺子/刻子）
.tile-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.tile-group-label {
  font-size: 12px;
  color: #86909c;
}

// 麻将牌单行展示
.tiles-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 2px;
  justify-content: center;
  padding: 12px;
  overflow-x: auto;
}

// 麻将图片样式
.tile-image {
  width: 44px;
  height: 62px;
  object-fit: contain;
  border-radius: 4px;
  transition: transform 0.2s ease;
  cursor: default;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-4px);
  }
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  color: #9ca3af;

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    color: #d1d5db;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
}

/* 动画效果 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 确保 dialog 内容区域有足够的空间 */
:deep(.el-dialog__body) {
  position: relative;
  overflow: hidden;
}
</style>