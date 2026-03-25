<!--
  功能：牌堆选择器弹窗 - 选择麻将牌的种类和数量
  移植自 game-settings 下的参考实现，支持 mock 数据
-->
<template>
  <el-dialog v-model="dialogVisible" title="自定义牌堆" width="75%" :before-close="handleCancel">
    <div class="mahjong-stack-container">
      <!-- 第1行：万子 (1-9万) -->
      <div class="row">
        <div v-for="(item, index) in wanCards" :key="`wan-${index}`" class="card-item">
          <div class="card-placeholder" :class="`card-${item.type}`">
            <span class="card-name">{{ item.name }}</span>
          </div>
          <div class="count-control">
            <el-button size="small" @click="decrement(item)">
              <el-icon><Minus /></el-icon>
            </el-button>
            <span class="count">{{ item.count }}</span>
            <el-button size="small" @click="increment(item)">
              <el-icon><Plus /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
      <!-- 第2行：条子 (1-9条) -->
      <div class="row">
        <div v-for="(item, index) in tiaoCards" :key="`tiao-${index}`" class="card-item">
          <div class="card-placeholder" :class="`card-${item.type}`">
            <span class="card-name">{{ item.name }}</span>
          </div>
          <div class="count-control">
            <el-button size="small" @click="decrement(item)">
              <el-icon><Minus /></el-icon>
            </el-button>
            <span class="count">{{ item.count }}</span>
            <el-button size="small" @click="increment(item)">
              <el-icon><Plus /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
      <!-- 第3行：筒子 (1-9筒) -->
      <div class="row">
        <div v-for="(item, index) in tongCards" :key="`tong-${index}`" class="card-item">
          <div class="card-placeholder" :class="`card-${item.type}`">
            <span class="card-name">{{ item.name }}</span>
          </div>
          <div class="count-control">
            <el-button size="small" @click="decrement(item)">
              <el-icon><Minus /></el-icon>
            </el-button>
            <span class="count">{{ item.count }}</span>
            <el-button size="small" @click="increment(item)">
              <el-icon><Plus /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
      <!-- 第4行：字牌 (东南西北中发白) -->
      <div class="row">
        <div v-for="(item, index) in ziCards" :key="`zi-${index}`" class="card-item">
          <div class="card-placeholder" :class="`card-${item.type}`">
            <span class="card-name">{{ item.name }}</span>
          </div>
          <div class="count-control">
            <el-button size="small" @click="decrement(item)">
              <el-icon><Minus /></el-icon>
            </el-button>
            <span class="count">{{ item.count }}</span>
            <el-button size="small" @click="increment(item)">
              <el-icon><Plus /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
      <!-- 第5行：花牌 (梅兰竹菊春夏秋冬) -->
      <div class="row">
        <div v-for="(item, index) in huaCards" :key="`hua-${index}`" class="card-item">
          <div class="card-placeholder" :class="`card-${item.type}`">
            <span class="card-name">{{ item.name }}</span>
          </div>
          <div class="count-control">
            <el-button size="small" @click="decrement(item)">
              <el-icon><Minus /></el-icon>
            </el-button>
            <span class="count">{{ item.count }}</span>
            <el-button size="small" @click="increment(item)">
              <el-icon><Plus /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer-wrapper">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { Minus, Plus } from '@element-plus/icons-vue'

// 属性定义
const props = defineProps<{
  visible: boolean
  initData?: {
    defaultSelect?: string[]
  }
}>()

// 事件定义
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', value: string[]): void
}>()

const dialogVisible = ref(false)

// 麻将牌数据结构
interface MahjongCard {
  name: string
  hex: string
  type: string
  count: number
}

// 万子 (1-9万)
const wanCards = reactive<MahjongCard[]>([
  { name: '1万', hex: '0x01', type: 'wan', count: 4 },
  { name: '2万', hex: '0x02', type: 'wan', count: 4 },
  { name: '3万', hex: '0x03', type: 'wan', count: 4 },
  { name: '4万', hex: '0x04', type: 'wan', count: 4 },
  { name: '5万', hex: '0x05', type: 'wan', count: 4 },
  { name: '6万', hex: '0x06', type: 'wan', count: 4 },
  { name: '7万', hex: '0x07', type: 'wan', count: 4 },
  { name: '8万', hex: '0x08', type: 'wan', count: 4 },
  { name: '9万', hex: '0x09', type: 'wan', count: 4 },
])

// 条子 (1-9条)
const tiaoCards = reactive<MahjongCard[]>([
  { name: '1条', hex: '0x11', type: 'tiao', count: 4 },
  { name: '2条', hex: '0x12', type: 'tiao', count: 4 },
  { name: '3条', hex: '0x13', type: 'tiao', count: 4 },
  { name: '4条', hex: '0x14', type: 'tiao', count: 4 },
  { name: '5条', hex: '0x15', type: 'tiao', count: 4 },
  { name: '6条', hex: '0x16', type: 'tiao', count: 4 },
  { name: '7条', hex: '0x17', type: 'tiao', count: 4 },
  { name: '8条', hex: '0x18', type: 'tiao', count: 4 },
  { name: '9条', hex: '0x19', type: 'tiao', count: 4 },
])

// 筒子 (1-9筒)
const tongCards = reactive<MahjongCard[]>([
  { name: '1筒', hex: '0x21', type: 'tong', count: 4 },
  { name: '2筒', hex: '0x22', type: 'tong', count: 4 },
  { name: '3筒', hex: '0x23', type: 'tong', count: 4 },
  { name: '4筒', hex: '0x24', type: 'tong', count: 4 },
  { name: '5筒', hex: '0x25', type: 'tong', count: 4 },
  { name: '6筒', hex: '0x26', type: 'tong', count: 4 },
  { name: '7筒', hex: '0x27', type: 'tong', count: 4 },
  { name: '8筒', hex: '0x28', type: 'tong', count: 4 },
  { name: '9筒', hex: '0x29', type: 'tong', count: 4 },
])

// 字牌 (东南西北中发白)
const ziCards = reactive<MahjongCard[]>([
  { name: '东风', hex: '0x31', type: 'zi', count: 4 },
  { name: '南风', hex: '0x32', type: 'zi', count: 4 },
  { name: '西风', hex: '0x33', type: 'zi', count: 4 },
  { name: '北风', hex: '0x34', type: 'zi', count: 4 },
  { name: '红中', hex: '0x35', type: 'zi', count: 4 },
  { name: '发财', hex: '0x36', type: 'zi', count: 4 },
  { name: '白板', hex: '0x37', type: 'zi', count: 4 },
])

// 花牌 (春夏秋冬梅兰竹菊)
const huaCards = reactive<MahjongCard[]>([
  { name: '春', hex: '0x41', type: 'hua', count: 0 },
  { name: '夏', hex: '0x42', type: 'hua', count: 0 },
  { name: '秋', hex: '0x43', type: 'hua', count: 0 },
  { name: '冬', hex: '0x44', type: 'hua', count: 0 },
  { name: '梅', hex: '0x45', type: 'hua', count: 0 },
  { name: '兰', hex: '0x46', type: 'hua', count: 0 },
  { name: '竹', hex: '0x47', type: 'hua', count: 0 },
  { name: '菊', hex: '0x48', type: 'hua', count: 0 },
])

const allCards = [...wanCards, ...tiaoCards, ...tongCards, ...ziCards, ...huaCards]

// 重置数量函数
const resetAllCount = () => {
  wanCards.forEach(card => (card.count = 4))
  tiaoCards.forEach(card => (card.count = 4))
  tongCards.forEach(card => (card.count = 4))
  ziCards.forEach(card => (card.count = 4))
  huaCards.forEach(card => (card.count = 0))
}

// 初始化数量
const initCardCount = (defaultSelect: string[]) => {
  resetAllCount()
  const countMap = defaultSelect.reduce((map, hex) => {
    map.set(hex, (map.get(hex) || 0) + 1)
    return map
  }, new Map<string, number>())
  allCards.forEach(card => {
    card.count = countMap.get(card.hex) || 0
  })
}

// 监听visible同步弹窗状态
watch(
  () => props.visible,
  (newVal) => {
    dialogVisible.value = newVal
    if (newVal && props.initData?.defaultSelect) {
      initCardCount(props.initData.defaultSelect)
    } else if (newVal) {
      resetAllCount()
    }
  },
  { immediate: true },
)

// 数量增减函数
const increment = (item: MahjongCard) => {
  item.count++
}
const decrement = (item: MahjongCard) => {
  if (item.count > 0) {
    item.count--
  }
}

// 取消按钮
const handleCancel = () => {
  resetAllCount()
  emit('close')
}

// 确定按钮
const handleConfirm = () => {
  const defaultSelect: string[] = []
  allCards.forEach((card) => {
    for (let i = 0; i < card.count; i++) {
      defaultSelect.push(card.hex)
    }
  })
  console.log('最终选中的牌堆数组', defaultSelect)
  emit('confirm', defaultSelect)
  resetAllCount()
}
</script>

<style scoped lang="scss">
.mahjong-stack-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 0;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: flex-start;
}

.card-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

// 牌占位样式
.card-placeholder {
  width: 60px;
  height: 70px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;

  &.card-wan {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
    color: white;
  }

  &.card-tiao {
    background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
    color: white;
  }

  &.card-tong {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  &.card-zi {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
  }

  &.card-hua {
    background: linear-gradient(135deg, #ffd93d 0%, #ff6b6b 100%);
    color: #333;
  }
}

.card-name {
  font-size: 14px;
}

.count-control {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: #f5f7fa;
  padding: 4px 8px;
  border-radius: 16px;
}

.count {
  min-width: 20px;
  text-align: center;
  font-weight: 500;
  color: #346663;
}

.dialog-footer-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 0;
}
</style>