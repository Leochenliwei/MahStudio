<!--
  功能：表达式输入组件（Dropdown 优化版）
  用于替代 ActionLimitEditor.vue 中的 textarea，提供可视化的表达式编辑体验
  优化：输入框和编辑器面板分离，点击输入框以 dropdown 形式展开编辑器
  关联需求：ActionLimitEditor 触发条件输入优化 - Dropdown 形式
  关联需求：表达式输入框嵌套标签块优化 - 嵌套单元渲染
  关联需求：表达式输入框光标显示优化 - 光标定位与键盘导航
-->
<template>
  <div class="expression-input-wrapper" ref="wrapperRef">
    <!-- 输入框触发器 -->
    <div
      class="input-trigger"
      :class="{ 'is-active': isDropdownOpen, 'is-empty': !displayValue, 'is-focused': isFocused }"
      @click="handleInputClick"
      tabindex="0"
      ref="inputTriggerRef"
      @keydown="handleKeydown"
    >
      <div class="input-content" ref="inputContentRef">
        <template v-if="expressionUnits.length > 0">
          <!-- 嵌套标签块渲染 - 表达式单元 -->
          <template v-for="(unit, index) in expressionUnits" :key="index">
            <!-- 光标（在当前单元之前） -->
            <span
              v-if="cursorIndex === index && isFocused"
              class="input-cursor"
              :class="{ 'is-blinking': isCursorBlinking }"
            ></span>

            <!-- 游戏元素单元 -->
            <template v-if="unit.type === 'element'">
              <div
                class="expression-unit"
                :class="{
                  'is-selected': selectedUnitIndex === index,
                  'is-numeric': unit.element.valueType === 2,
                  'is-boolean': unit.element.valueType === 1
                }"
                @click.stop="selectUnit(index, $event)"
              >
                <!-- 身份标签 -->
                <span
                  class="unit-identity-tag"
                  :class="{ 'is-generic': isGenericIdentity(unit.identity) }"
                  @click.stop="openIdentitySelector(index, $event.target)"
                >
                  {{ getIdentityName(unit.identity) }}
                  <!-- 泛身份标识 -->
                  <span v-if="isGenericIdentity(unit.identity)" class="generic-badge">泛</span>
                </span>

                <!-- 数值型单元：[身份] 的 [状态] -->
                <template v-if="unit.element.valueType === 2">
                  <span class="unit-connector">的</span>
                  <span class="unit-status-tag">{{ unit.element.name }}</span>
                </template>

                <!-- 布尔型单元：[身份] 的状态 [为/不为] [状态] -->
                <template v-else-if="unit.element.valueType === 1">
                  <span class="unit-connector">的状态</span>
                  <span
                    class="unit-negation-tag"
                    :class="{ 'is-negated': unit.isNegated }"
                    @click.stop="toggleNegated(index)"
                  >
                    {{ unit.isNegated ? '不为' : '为' }}
                  </span>
                  <span class="unit-status-tag">{{ unit.element.name }}</span>
                </template>

                <!-- 删除按钮 -->
                <span
                  v-if="selectedUnitIndex === index"
                  class="unit-delete-btn"
                  @click.stop="removeUnit(index)"
                >
                  <el-icon :size="12"><Close /></el-icon>
                </span>
              </div>
            </template>

            <!-- 运算符单元 -->
            <template v-else-if="unit.type === 'operator'">
              <div
                class="operator-unit"
                :class="{
                  'is-selected': selectedUnitIndex === index,
                  'is-arithmetic': unit.category === 'arithmetic',
                  'is-compare': unit.category === 'compare',
                  'is-logic': unit.category === 'logic',
                  'is-bracket': unit.category === 'bracket'
                }"
                @click.stop="selectUnit(index, $event)"
              >
                {{ unit.display }}
                <!-- 删除按钮 -->
                <span
                  v-if="selectedUnitIndex === index"
                  class="unit-delete-btn"
                  @click.stop="removeUnit(index)"
                >
                  <el-icon :size="10"><Close /></el-icon>
                </span>
              </div>
            </template>

            <!-- 数字单元 -->
            <template v-else-if="unit.type === 'number'">
              <div
                class="number-unit"
                :class="{ 'is-selected': selectedUnitIndex === index }"
                @click.stop="selectUnit(index, $event)"
              >
                {{ unit.value }}
                <!-- 删除按钮 -->
                <span
                  v-if="selectedUnitIndex === index"
                  class="unit-delete-btn"
                  @click.stop="removeUnit(index)"
                >
                  <el-icon :size="10"><Close /></el-icon>
                </span>
              </div>
            </template>
          </template>

          <!-- 光标（在所有单元之后） -->
          <span
            v-if="cursorIndex >= expressionUnits.length && isFocused"
            class="input-cursor"
            :class="{ 'is-blinking': isCursorBlinking }"
          ></span>
        </template>
        <template v-else>
          <!-- 空状态时的光标 -->
          <span
            v-if="isFocused"
            class="input-cursor"
            :class="{ 'is-blinking': isCursorBlinking }"
          ></span>
          <span class="placeholder">{{ placeholder || '请输入条件表达式' }}</span>
        </template>
      </div>
      <div class="input-suffix">
        <el-icon class="arrow-icon" :class="{ 'is-open': isDropdownOpen }">
          <ArrowDown />
        </el-icon>
      </div>
    </div>

    <!-- 身份选择器 -->
    <IdentitySelector
      v-model="currentIdentityValue"
      v-model:visible="identitySelectorVisible"
      :trigger-ref="identitySelectorTriggerRef"
      @select="onIdentitySelected"
    />

    <!-- Dropdown 编辑器面板 -->
    <Transition name="dropdown">
      <div
        v-if="isDropdownOpen"
        class="editor-dropdown"
        :class="{ 'is-above': dropdownPosition === 'above' }"
        :style="dropdownStyle"
        ref="dropdownRef"
      >
        <!-- 编辑器主体：键盘 + 元素面板 -->
        <div class="editor-main">
          <!-- 虚拟键盘 - 非元素切换模式显示 -->
          <div v-if="!isElementSwitchingMode" class="virtual-keyboard">
            <!-- 第一行：7 8 9 + = -->
            <div class="keyboard-row">
              <button
                v-for="key in row1"
                :key="key.value"
                class="keyboard-btn"
                :class="key.type"
                @click="insertKey(key.value)"
              >
                {{ key.label }}
              </button>
            </div>
            <!-- 第二行：4 5 6 - ( -->
            <div class="keyboard-row">
              <button
                v-for="key in row2"
                :key="key.value"
                class="keyboard-btn"
                :class="key.type"
                @click="insertKey(key.value)"
              >
                {{ key.label }}
              </button>
            </div>
            <!-- 第三行：1 2 3 × ) -->
            <div class="keyboard-row">
              <button
                v-for="key in row3"
                :key="key.value"
                class="keyboard-btn"
                :class="key.type"
                @click="insertKey(key.value)"
              >
                {{ key.label }}
              </button>
            </div>
            <!-- 第四行：0 . ⌫ ÷ ^ -->
            <div class="keyboard-row">
              <button
                v-for="key in row4"
                :key="key.value"
                class="keyboard-btn"
                :class="key.type"
                @click="key.value === 'backspace' ? removeLast() : insertKey(key.value)"
              >
                {{ key.label }}
              </button>
            </div>
            <!-- 比较运算符行：> < ≥ ≤ -->
            <div class="keyboard-row compare-row">
              <button
                v-for="key in compareRow"
                :key="key.value"
                class="keyboard-btn"
                :class="key.type"
                @click="insertKey(key.value)"
              >
                {{ key.label }}
              </button>
            </div>
            <!-- 逻辑运算符行：且 或 非 ≠ -->
            <div class="keyboard-row logic-row">
              <button
                v-for="key in logicRow"
                :key="key.value"
                class="keyboard-btn"
                :class="key.type"
                @click="insertKey(key.value)"
              >
                {{ key.label }}
              </button>
            </div>
            <!-- 函数行：min max -->
            <div class="keyboard-row function-row">
              <button
                v-for="key in functionRow"
                :key="key.value"
                class="keyboard-btn"
                :class="key.type"
                @click="insertKey(key.value)"
              >
                {{ key.label }}
              </button>
            </div>
          </div>

          <!-- 元素选择面板 - 元素切换模式时占满宽度 -->
          <div class="element-panel" :class="{ 'is-full-width': isElementSwitchingMode }">
            <!-- 搜索框 -->
            <div class="search-box">
              <el-icon class="search-icon"><Search /></el-icon>
              <input
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                placeholder="搜索元素..."
                class="search-input"
                @keydown="handleSearchKeydown"
              />
            </div>

            <!-- 分类Tab -->
            <div class="category-tabs">
              <div
                v-for="category in categories"
                :key="category.key"
                class="category-tab"
                :class="{ active: currentCategory === category.key }"
                @click="currentCategory = category.key"
              >
                {{ category.label }}
              </div>
            </div>

            <!-- 元素列表 -->
            <div class="element-list" ref="elementListRef">
              <!-- 加载状态 -->
              <div v-if="isLoadingElements" class="loading-tip">
                <el-icon class="loading-icon"><Loading /></el-icon>
                加载中...
              </div>
              <!-- 元素列表 -->
              <template v-else>
                <div
                  v-for="(element, index) in filteredElements"
                  :key="element.key"
                  class="element-item"
                  :class="{
                    'is-selected': selectedElementIndex === index,
                    'is-highlighted': highlightedElementIndex === index
                  }"
                  @click="insertElement(element)"
                  @mouseenter="highlightedElementIndex = index"
                >
                  <span class="element-name">{{ element.name }}</span>
                  <el-icon v-if="selectedElementIndex === index" class="check-icon"><Check /></el-icon>
                </div>
                <div v-if="filteredElements.length === 0" class="empty-tip">
                  未找到匹配的元素
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { ArrowDown, Search, Check, Loading, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import IdentitySelector from './IdentitySelector.vue'

// ==================== 类型定义 ====================
/**
 * 表达式 Token 类型
 * 关联需求：表达式输入框嵌套标签块优化 - 嵌套单元支持
 */
interface Token {
  type: 'text' | 'element' | 'operator' | 'unit' | 'number'
  value: string
  category?: 'identity' | 'status' | 'fanxing' | 'variable' | 'game' | 'roomOption' | 'number' | 'description'
  valueType?: 1 | 2  // 1=布尔类, 2=数值类
  identity?: string
  isNegated?: boolean
}

/**
 * 游戏元素类型
 */
interface GameElement {
  key: string
  name: string
  category: string
  valueType: 1 | 2  // 1=布尔类, 2=数值类
  requiresIdentity?: boolean
}

/**
 * 运算符类型
 * 关联需求：运算符单元化 - 运算符类型定义
 */
type OperatorCategory = 'arithmetic' | 'compare' | 'logic' | 'bracket' | 'number'

interface OperatorDef {
  value: string
  display: string
  category: OperatorCategory
}

/**
 * 表达式单元类型（联合类型）
 * 关联需求：表达式输入框光标显示优化 - 单元定位
 * 关联需求：运算符单元化 - 支持运算符单元
 */
interface GameElementUnit {
  type: 'element'
  element: GameElement
  identity: string
  isNegated: boolean
  raw: string
}

interface OperatorUnit {
  type: 'operator'
  value: string
  display: string
  category: OperatorCategory
}

interface NumberUnit {
  type: 'number'
  value: string
}

type ExpressionUnit = GameElementUnit | OperatorUnit | NumberUnit

/**
 * 键盘按键类型
 */
interface KeyboardKey {
  value: string
  label: string
  type: 'number' | 'operator' | 'action'
}

// ==================== Props & Emits ====================
const props = defineProps<{
  modelValue: string
  placeholder?: string
  gameId?: string | number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()

// ==================== 状态 ====================
const wrapperRef = ref<HTMLElement>()
const inputTriggerRef = ref<HTMLElement>()
const inputContentRef = ref<HTMLElement>()
const dropdownRef = ref<HTMLElement>()
const searchInputRef = ref<HTMLInputElement>()
const elementListRef = ref<HTMLElement>()
const identitySelectorTriggerRef = ref<HTMLElement>()

const isDropdownOpen = ref(false)
const isFocused = ref(false)
const dropdownPosition = ref<'below' | 'above'>('below')
const dropdownStyle = ref<Record<string, string>>({})
const searchQuery = ref('')
const currentCategory = ref('all')
const isLoadingElements = ref(false)
const highlightedElementIndex = ref(-1)
const selectedElementIndex = ref(-1)

// 元素数据
const availableElements = ref<GameElement[]>([])

/**
 * 获取 JWT Token
 * 优先从环境变量获取，其次从 localStorage 获取，最后使用默认值
 * @returns {string} JWT Token
 */
function getJwtToken(): string {
  // 优先从环境变量获取 token
  const envToken = import.meta.env.VITE_JWT_TOKEN
  if (envToken) {
    return envToken
  }

  // 尝试从 localStorage 获取 token
  const storedToken = localStorage.getItem('xq5_jwt_token')
  if (storedToken) {
    return storedToken
  }

  // 默认 token
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMDE4NywidXNlcl9uYW1lIjoi6ZmI5p2O54KcIiwiZ3JvdXBfaWQiOjIsImlzX3N1cGVydXNlciI6ZmFsc2UsImlzX2V4dGVybmFsIjpmYWxzZSwiZXhwIjoxNzc1MjgyNjMzfQ.9e8QIeewyyVyZBa3xbN70ZfByGnebV3tgLZIfK700fA'
}

// 光标相关状态
const cursorIndex = ref(0)
const isCursorBlinking = ref(true)
const selectedUnitIndex = ref(-1)

// 身份选择器状态
const identitySelectorVisible = ref(false)
const currentIdentityValue = ref('cur_player')
const currentEditingUnitIndex = ref(-1)

// 元素切换模式状态
const isElementSwitchingMode = ref(false)
const editingUnitIndex = ref(-1)

// ==================== 常量 ====================
const categories = [
  { key: 'status', label: '玩家状态' },
  { key: 'game', label: '牌局状态' },
  { key: 'fanxing', label: '番型' },
  { key: 'variable', label: '变量' },
  { key: 'roomOption', label: '房间选项' }
]

const identityMap: Record<string, { name: string; isGeneric: boolean }> = {
  cur_player: { name: '当前玩家', isGeneric: false },
  winner: { name: '当前赢家', isGeneric: false },
  dealer: { name: '庄家', isGeneric: false },
  all_xian: { name: '所有闲家', isGeneric: true },
  all_players: { name: '所有玩家', isGeneric: true },
  other_players: { name: '其他玩家', isGeneric: true }
}

// ==================== API 方法 ====================
/**
 * 从API获取状态配置数据
 * @returns {Promise<GameElement[]>} 状态配置列表
 */
async function fetchStatusConfig(): Promise<GameElement[]> {
  try {
    const response = await fetch('http://mahjong-studio-admin.test.zonst.com/api/admin/component/status-config/list?page=1&page_size=9999', {
      headers: {
        'x-xq5-jwt': getJwtToken(),
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()

    if (result.errno === 0 && result.data && result.data.list) {
      return result.data.list.map((item: any) => ({
        key: item.key || String(item.id),
        name: item.name || item.title,
        category: item.object === 1 ? 'game' : 'status', // object: 1=牌局状态, 2=玩家状态
        valueType: item.value_type || 2,
        requiresIdentity: item.object === 2 // 玩家状态需要身份
      }))
    }
    return []
  } catch (error) {
    console.error('获取状态配置失败:', error)
    return []
  }
}

/**
 * 从API获取番型配置数据
 * @returns {Promise<GameElement[]>} 番型配置列表
 */
async function fetchFanConfig(): Promise<GameElement[]> {
  try {
    const response = await fetch('http://mahjong-studio-admin.test.zonst.com/api/admin/component/fan-config/list?page=1&page_size=9999', {
      headers: {
        'x-xq5-jwt': getJwtToken(),
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()

    if (result.errno === 0 && result.data && result.data.list) {
      return result.data.list.map((item: any) => ({
        key: item.key || String(item.id),
        name: item.name || item.title,
        category: 'fanxing',
        valueType: item.value_type || 1,
        requiresIdentity: true
      }))
    }
    return []
  } catch (error) {
    console.error('获取番型配置失败:', error)
    return []
  }
}

/**
 * 从API获取变量配置数据
 * @returns {Promise<GameElement[]>} 变量配置列表
 */
async function fetchVarConfig(): Promise<GameElement[]> {
  try {
    const response = await fetch('https://mahstudio-admin.test.zonst.com/api/v1/game-var-config/list', {
      headers: {
        'x-xq5-jwt': getJwtToken(),
        'Content-Type': 'application/json'
      }
    })
    const result = await response.json()

    if (result.errno === 0 && result.data && result.data.list) {
      return result.data.list.map((item: any) => ({
        key: item.key || String(item.id),
        name: item.name || item.title,
        category: 'variable',
        valueType: item.value_type || 2,
        requiresIdentity: true
      }))
    }
    return []
  } catch (error) {
    console.error('获取变量配置失败:', error)
    return []
  }
}

/**
 * 加载所有元素数据
 */
async function loadElements() {
  isLoadingElements.value = true
  try {
    const [statusElements, fanElements, varElements] = await Promise.all([
      fetchStatusConfig(),
      fetchFanConfig(),
      fetchVarConfig()
    ])

    // 合并所有元素
    availableElements.value = [
      ...statusElements,
      ...fanElements,
      ...varElements
    ]

    console.log('元素数据加载完成:', availableElements.value.length, '个元素')
  } catch (error) {
    console.error('加载元素数据失败:', error)
    // 使用默认数据作为回退
    availableElements.value = [
      { key: 'maifen', name: '买分/下漂/下嘴的值', category: 'status', valueType: 2, requiresIdentity: true },
      { key: 'laizi_count', name: '手牌中赖子个数', category: 'status', valueType: 2, requiresIdentity: true },
      { key: 'zhigang', name: '进行了直杠', category: 'status', valueType: 1, requiresIdentity: true },
      { key: 'dianzhigang', name: '点直杠', category: 'status', valueType: 1, requiresIdentity: true },
      { key: 'dianpao', name: '点炮', category: 'status', valueType: 1, requiresIdentity: true },
      { key: 'chi_count', name: '吃的次数', category: 'status', valueType: 2, requiresIdentity: true },
      { key: 'peng_count', name: '碰的次数', category: 'status', valueType: 2, requiresIdentity: true },
      { key: 'gang_count', name: '杠的次数', category: 'status', valueType: 2, requiresIdentity: true },
      { key: 'hu_count', name: '胡牌次数', category: 'status', valueType: 2, requiresIdentity: true },
      { key: 'zimo', name: '自摸', category: 'status', valueType: 1, requiresIdentity: true }
    ]
  } finally {
    isLoadingElements.value = false
  }
}

// 虚拟键盘按键定义
// 关联需求：键盘布局优化 - 按分类排列并添加比较运算符

// 第一行：数字 7 8 9 + =
const row1: KeyboardKey[] = [
  { value: '7', label: '7', type: 'number' },
  { value: '8', label: '8', type: 'number' },
  { value: '9', label: '9', type: 'number' },
  { value: '+', label: '+', type: 'operator' },
  { value: '=', label: '=', type: 'operator' }
]

// 第二行：数字 4 5 6 - (
const row2: KeyboardKey[] = [
  { value: '4', label: '4', type: 'number' },
  { value: '5', label: '5', type: 'number' },
  { value: '6', label: '6', type: 'number' },
  { value: '-', label: '-', type: 'operator' },
  { value: '(', label: '(', type: 'operator' }
]

// 第三行：数字 1 2 3 × )
const row3: KeyboardKey[] = [
  { value: '1', label: '1', type: 'number' },
  { value: '2', label: '2', type: 'number' },
  { value: '3', label: '3', type: 'number' },
  { value: '*', label: '×', type: 'operator' },
  { value: ')', label: ')', type: 'operator' }
]

// 第四行：数字 0 . ⌫ ÷ ^
const row4: KeyboardKey[] = [
  { value: '0', label: '0', type: 'number' },
  { value: '.', label: '.', type: 'operator' },
  { value: 'backspace', label: '⌫', type: 'action' },
  { value: '/', label: '÷', type: 'operator' },
  { value: '^', label: '^', type: 'operator' }
]

// 比较运算符行：> < >= <=
const compareRow: KeyboardKey[] = [
  { value: '>', label: '>', type: 'operator' },
  { value: '<', label: '<', type: 'operator' },
  { value: '>=', label: '≥', type: 'operator' },
  { value: '<=', label: '≤', type: 'operator' }
]

// 逻辑运算符行：且 或 非 ≠
const logicRow: KeyboardKey[] = [
  { value: '&&', label: '且', type: 'operator' },
  { value: '||', label: '或', type: 'operator' },
  { value: '!', label: '非', type: 'operator' },
  { value: '!=', label: '≠', type: 'operator' }
]

// 函数行：min max ,
const functionRow: KeyboardKey[] = [
  { value: 'min(', label: 'Min', type: 'operator' },
  { value: 'max(', label: 'max', type: 'operator' },
  { value: ',', label: ',', type: 'operator' }
]

// ==================== 运算符定义 ====================
// 关联需求：运算符单元化 - 运算符映射表
const operatorMap: Record<string, OperatorDef> = {
  // 算术运算符
  '+': { value: '+', display: '+', category: 'arithmetic' },
  '-': { value: '-', display: '-', category: 'arithmetic' },
  '*': { value: '*', display: '×', category: 'arithmetic' },
  '/': { value: '/', display: '÷', category: 'arithmetic' },
  '^': { value: '^', display: '^', category: 'arithmetic' },
  // 比较运算符
  '>': { value: '>', display: '>', category: 'compare' },
  '<': { value: '<', display: '<', category: 'compare' },
  '>=': { value: '>=', display: '≥', category: 'compare' },
  '<=': { value: '<=', display: '≤', category: 'compare' },
  '=': { value: '=', display: '=', category: 'compare' },
  '==': { value: '==', display: '==', category: 'compare' },
  '!=': { value: '!=', display: '≠', category: 'compare' },
  // 逻辑运算符
  '&&': { value: '&&', display: '且', category: 'logic' },
  '||': { value: '||', display: '或', category: 'logic' },
  '!': { value: '!', display: '非', category: 'logic' },
  // 括号
  '(': { value: '(', display: '(', category: 'bracket' },
  ')': { value: ')', display: ')', category: 'bracket' },
  // 函数
  'min(': { value: 'min(', display: 'Min(', category: 'arithmetic' },
  'max(': { value: 'max(', display: 'Max(', category: 'arithmetic' },
  // 分隔符
  ',': { value: ',', display: ',', category: 'bracket' }
}

// 运算符匹配正则（按长度降序，优先匹配长的）
// 关联需求：min/max 函数支持 - 添加函数匹配和逗号
const operatorRegex = /(min\(|max\(|>=|<=|==|!=|\+|-|\*|\/|\^|>|<|=|&&|\|\||!|\(|\)|,)/g

// ==================== 计算属性 ====================
const displayValue = computed(() => props.modelValue || '')

/**
 * 解析表达式为单元数组
 * 关联需求：表达式输入框嵌套标签块优化 - 嵌套单元解析
 * 关联需求：运算符单元化 - 支持运算符和数字单元
 */
const expressionUnits = computed<ExpressionUnit[]>(() => {
  const units: ExpressionUnit[] = []
  const value = props.modelValue || ''

  // 游戏元素正则
  const elementRegex = /\[([a-zA-Z0-9_\u4e00-\u9fa5]+)\.([a-zA-Z0-9_\u4e00-\u9fa5]+)\]/g
  // 数字正则
  const numberRegex = /\d+\.?\d*/g

  // 收集所有匹配项及其位置
  const matches: Array<{ type: 'element' | 'operator' | 'number'; value: string; index: number; length: number; data?: any }> = []

  // 匹配游戏元素
  let match
  while ((match = elementRegex.exec(value)) !== null) {
    const element = findElementByKey(match[2])
    if (element) {
      matches.push({
        type: 'element',
        value: match[0],
        index: match.index,
        length: match[0].length,
        data: {
          element,
          identity: match[1],
          isNegated: false
        }
      })
    }
  }

  // 匹配运算符
  let opMatch: RegExpExecArray | null
  while ((opMatch = operatorRegex.exec(value)) !== null) {
    // 检查是否与游戏元素重叠
    const isOverlapping = matches.some(m =>
      m.type === 'element' &&
      opMatch!.index >= m.index &&
      opMatch!.index < m.index + m.length
    )
    if (!isOverlapping) {
      const opDef = operatorMap[opMatch[0]]
      if (opDef) {
        matches.push({
          type: 'operator',
          value: opMatch[0],
          index: opMatch.index,
          length: opMatch[0].length,
          data: opDef
        })
      }
    }
  }

  // 匹配数字
  let numMatch: RegExpExecArray | null
  while ((numMatch = numberRegex.exec(value)) !== null) {
    // 检查是否与已匹配的项重叠
    const isOverlapping = matches.some(m =>
      numMatch!.index >= m.index &&
      numMatch!.index < m.index + m.length
    )
    if (!isOverlapping) {
      matches.push({
        type: 'number',
        value: numMatch[0],
        index: numMatch.index,
        length: numMatch[0].length
      })
    }
  }

  // 按位置排序
  matches.sort((a, b) => a.index - b.index)

  // 构建单元数组
  for (const m of matches) {
    if (m.type === 'element') {
      units.push({
        type: 'element',
        element: m.data.element,
        identity: m.data.identity,
        isNegated: m.data.isNegated,
        raw: m.value
      })
    } else if (m.type === 'operator') {
      units.push({
        type: 'operator',
        value: m.data.value,
        display: m.data.display,
        category: m.data.category
      })
    } else if (m.type === 'number') {
      units.push({
        type: 'number',
        value: m.value
      })
    }
  }

  return units
})

/**
 * 剩余文本（非单元部分）
 */
const remainingText = computed(() => {
  let text = props.modelValue || ''
  const regex = /\[([a-zA-Z0-9_\u4e00-\u9fa5]+)\.([a-zA-Z0-9_\u4e00-\u9fa5]+)\]/g
  text = text.replace(regex, '').trim()
  return text
})

/**
 * 过滤后的元素列表
 */
const filteredElements = computed(() => {
  let elements = availableElements.value || []

  // 按分类过滤
  if (currentCategory.value !== 'all') {
    elements = elements.filter((el: GameElement) => el.category === currentCategory.value)
  }

  // 按搜索词过滤
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    elements = elements.filter((el: GameElement) =>
      el.name.toLowerCase().includes(query) ||
      el.key.toLowerCase().includes(query)
    )
  }

  return elements
})

// ==================== 方法 ====================
/**
 * 根据 key 查找元素
 * @param key 元素 key
 */
const findElementByKey = (key: string): GameElement | undefined => {
  return availableElements.value?.find((el: GameElement) => el.key === key)
}

/**
 * 获取身份名称
 * @param identity 身份 key
 */
const getIdentityName = (identity: string): string => {
  return identityMap[identity]?.name || identity
}

/**
 * 检查是否为泛身份
 * @param identity 身份 key
 */
const isGenericIdentity = (identity: string): boolean => {
  return identityMap[identity]?.isGeneric || false
}

/**
 * 处理输入框点击
 * 关联需求：表达式输入框光标显示优化 - 点击显示光标
 * 关联需求：点击间隙移动光标 - 根据点击位置设置光标
 */
const handleInputClick = (event: MouseEvent) => {
  isFocused.value = true
  isCursorBlinking.value = true

  // 检查点击目标是否是表达式单元
  const target = event.target as HTMLElement
  const unitElement = target.closest('.expression-unit, .operator-unit, .number-unit') as HTMLElement

  if (!unitElement) {
    // 点击了空白区域（间隙），计算光标位置
    const clickX = event.clientX
    const inputContent = inputContentRef.value
    if (inputContent) {
      const unitElements = Array.from(inputContent.querySelectorAll('.expression-unit, .operator-unit, .number-unit')) as HTMLElement[]
      let newCursorIndex = 0

      for (let i = 0; i < unitElements.length; i++) {
        const rect = unitElements[i].getBoundingClientRect()
        const unitCenterX = rect.left + rect.width / 2

        if (clickX > unitCenterX) {
          newCursorIndex = i + 1
        } else {
          break
        }
      }

      cursorIndex.value = newCursorIndex
    }

    // 取消选中并切换到正常模式
    selectedUnitIndex.value = -1
    isElementSwitchingMode.value = false
    editingUnitIndex.value = -1
  }

  // 打开 dropdown
  if (!isDropdownOpen.value) {
    openDropdown()
  }

  // 如果光标未设置，设置到最后
  if (cursorIndex.value === -1) {
    cursorIndex.value = expressionUnits.value.length
  }
}

/**
 * 打开 Dropdown
 */
const openDropdown = () => {
  isDropdownOpen.value = true
  calculateDropdownPosition()

  // 聚焦搜索框
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

/**
 * 关闭 Dropdown
 */
const closeDropdown = () => {
  isDropdownOpen.value = false

  // 退出元素切换模式
  isElementSwitchingMode.value = false
  editingUnitIndex.value = -1
}

/**
 * 计算 Dropdown 位置
 */
const calculateDropdownPosition = () => {
  if (!inputTriggerRef.value) return

  const rect = inputTriggerRef.value.getBoundingClientRect()
  const dropdownHeight = 400

  // 检查下方空间
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top

  // 计算居中偏移量，使 dropdown 宽度为输入框的 60%
  const dropdownWidth = rect.width * 0.6
  const leftOffset = rect.left + (rect.width - dropdownWidth) / 2

  if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
    dropdownPosition.value = 'above'
    dropdownStyle.value = {
      position: 'fixed',
      bottom: `${window.innerHeight - rect.top + 4}px`,
      left: `${leftOffset}px`,
      width: `${dropdownWidth}px`
    }
  } else {
    dropdownPosition.value = 'below'
    dropdownStyle.value = {
      position: 'fixed',
      top: `${rect.bottom + 4}px`,
      left: `${leftOffset}px`,
      width: `${dropdownWidth}px`
    }
  }
}

/**
 * 处理 Backspace 键 - 删除光标前一个单元
 * 关联需求：键盘删除功能 - Backspace 键支持
 */
const handleBackspace = () => {
  const cursor = cursorIndex.value

  // 光标在最左侧，不操作
  if (cursor <= 0) return

  // 删除光标前一个单元
  const unitIndex = cursor - 1
  const unit = expressionUnits.value[unitIndex]

  if (!unit) return

  const currentValue = props.modelValue || ''

  // 数字单元特殊处理：如果长度大于1，仅删除末尾数字
  if (unit.type === 'number' && unit.value.length > 1) {
    const oldNumber = unit.value
    const newNumber = oldNumber.slice(0, -1)
    const pattern = new RegExp(oldNumber, 'g')
    const newValue = currentValue.replace(pattern, newNumber)
    emit('update:modelValue', newValue)
    emit('change', newValue)
    // 光标位置保持不变（还在数字后）
    return
  }

  // 其他单元直接删除
  let pattern: RegExp | null = null

  if (unit.type === 'element') {
    pattern = new RegExp(`\\[${unit.identity}\\.${unit.element.key}\\]`, 'g')
  } else if (unit.type === 'operator') {
    // 转义特殊字符
    const escaped = unit.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    pattern = new RegExp(escaped, 'g')
  } else if (unit.type === 'number') {
    // 单个数字，直接删除
    pattern = new RegExp(unit.value, 'g')
  }

  if (pattern) {
    const newValue = currentValue.replace(pattern, '').trim()
    emit('update:modelValue', newValue)
    emit('change', newValue)
    // 光标前移
    cursorIndex.value--
  }
}

/**
 * 处理 Delete 键 - 删除光标后一个单元
 * 关联需求：键盘删除功能 - Delete 键支持
 */
const handleDelete = () => {
  const cursor = cursorIndex.value
  const maxIndex = expressionUnits.value.length

  // 光标在最右侧，不操作
  if (cursor >= maxIndex) return

  // 删除光标后一个单元
  const unitIndex = cursor
  const unit = expressionUnits.value[unitIndex]

  if (!unit) return

  const currentValue = props.modelValue || ''

  // 数字单元特殊处理：如果长度大于1，仅删除首位数字
  if (unit.type === 'number' && unit.value.length > 1) {
    const oldNumber = unit.value
    const newNumber = oldNumber.slice(1)
    const pattern = new RegExp(oldNumber, 'g')
    const newValue = currentValue.replace(pattern, newNumber)
    emit('update:modelValue', newValue)
    emit('change', newValue)
    // 光标位置保持不变
    return
  }

  // 其他单元直接删除
  let pattern: RegExp | null = null

  if (unit.type === 'element') {
    pattern = new RegExp(`\\[${unit.identity}\\.${unit.element.key}\\]`, 'g')
  } else if (unit.type === 'operator') {
    // 转义特殊字符
    const escaped = unit.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    pattern = new RegExp(escaped, 'g')
  } else if (unit.type === 'number') {
    // 单个数字，直接删除
    pattern = new RegExp(unit.value, 'g')
  }

  if (pattern) {
    const newValue = currentValue.replace(pattern, '').trim()
    emit('update:modelValue', newValue)
    emit('change', newValue)
    // 光标位置保持不变（后面的单元前移）
  }
}

/**
 * 处理键盘事件
 * 关联需求：表达式输入框光标显示优化 - 键盘导航
 * 关联需求：键盘删除功能 - Backspace/Delete 键支持
 */
const handleKeydown = (e: KeyboardEvent) => {
  if (!isFocused.value) return

  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault()
      moveCursorLeft()
      break
    case 'ArrowRight':
      e.preventDefault()
      moveCursorRight()
      break
    case 'Backspace':
      e.preventDefault()
      handleBackspace()
      break
    case 'Delete':
      e.preventDefault()
      handleDelete()
      break
    case 'Escape':
      closeDropdown()
      break
  }
}

/**
 * 向左移动光标
 */
const moveCursorLeft = () => {
  if (cursorIndex.value > 0) {
    cursorIndex.value--
  }
}

/**
 * 向右移动光标
 */
const moveCursorRight = () => {
  const maxIndex = expressionUnits.value.length
  if (cursorIndex.value < maxIndex) {
    cursorIndex.value++
  }
}

/**
 * 选择单元
 * @param index 单元索引
 * @param event 鼠标事件
 */
const selectUnit = (index: number, event: MouseEvent) => {
  // 阻止事件冒泡，防止触发 input 的点击事件
  event.stopPropagation()

  selectedUnitIndex.value = index
  // 设置光标位置到单元之后
  cursorIndex.value = index + 1

  const unit = expressionUnits.value[index]

  // 只有游戏元素单元才打开 dropdown
  if (unit && unit.type === 'element') {
    // 进入元素切换模式
    isElementSwitchingMode.value = true
    editingUnitIndex.value = index

    // 打开 dropdown
    if (!isDropdownOpen.value) {
      openDropdown()
    }
  } else {
    // 运算符或数字单元，不打开 dropdown
    isElementSwitchingMode.value = false
    editingUnitIndex.value = -1
  }
}

/**
 * 打开身份选择器
 * @param index 单元索引
 * @param target 触发元素
 */
const openIdentitySelector = (index: number, target: EventTarget | null) => {
  currentEditingUnitIndex.value = index
  const unit = expressionUnits.value[index]
  if (unit && unit.type === 'element') {
    currentIdentityValue.value = unit.identity
  }
  identitySelectorTriggerRef.value = target as HTMLElement
  identitySelectorVisible.value = true
}

/**
 * 身份选择回调
 * @param option 身份选项
 */
const onIdentitySelected = (option: { key: string; name: string; isGeneric: boolean }) => {
  if (currentEditingUnitIndex.value >= 0) {
    const unit = expressionUnits.value[currentEditingUnitIndex.value]
    if (unit && unit.type === 'element') {
      // 更新表达式中的身份
      const oldPattern = new RegExp(`\\[${unit.identity}\\.${unit.element.key}\\]`, 'g')
      const newValue = props.modelValue.replace(oldPattern, `[${option.key}.${unit.element.key}]`)
      emit('update:modelValue', newValue)
      emit('change', newValue)
    }
  }
}

/**
 * 切换否定状态
 * @param index 单元索引
 */
const toggleNegated = (index: number) => {
  const unit = expressionUnits.value[index]
  if (unit && unit.type === 'element') {
    unit.isNegated = !unit.isNegated
  }
}

/**
 * 删除单元
 * @param index 单元索引
 */
const removeUnit = (index: number) => {
  const unit = expressionUnits.value[index]
  if (!unit) return

  // 数字单元特殊处理：如果长度大于1，仅删除末尾数字
  if (unit.type === 'number' && unit.value.length > 1) {
    removeLastDigit(index)
    return
  }

  let pattern: RegExp | null = null

  if (unit.type === 'element') {
    pattern = new RegExp(`\\[${unit.identity}\\.${unit.element.key}\\]`, 'g')
  } else if (unit.type === 'operator') {
    // 转义特殊字符
    const escaped = unit.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    pattern = new RegExp(escaped, 'g')
  } else if (unit.type === 'number') {
    // 单个数字，直接删除
    pattern = new RegExp(unit.value, 'g')
  }

  if (pattern) {
    const newValue = props.modelValue.replace(pattern, '').trim()
    emit('update:modelValue', newValue)
    emit('change', newValue)
    selectedUnitIndex.value = -1
  }
}

/**
 * 删除数字末尾一位
 * 关联需求：删除按钮优化 - 数字单元特殊处理
 * @param index 数字单元索引
 */
const removeLastDigit = (index: number) => {
  const unit = expressionUnits.value[index]
  if (!unit || unit.type !== 'number') return

  const currentValue = props.modelValue || ''
  const oldNumber = unit.value
  const newNumber = oldNumber.slice(0, -1)

  if (newNumber.length === 0) {
    // 如果删除后为空，删除整个数字
    const pattern = new RegExp(oldNumber, 'g')
    const newValue = currentValue.replace(pattern, '').trim()
    emit('update:modelValue', newValue)
    emit('change', newValue)
    selectedUnitIndex.value = -1
  } else {
    // 替换原数字为新数字
    const pattern = new RegExp(oldNumber, 'g')
    const newValue = currentValue.replace(pattern, newNumber)
    emit('update:modelValue', newValue)
    emit('change', newValue)
    // 保持选中状态，方便继续删除
  }
}

/**
 * 获取单元之间的操作符
 * @param index 单元索引
 */
const getOperatorBetweenUnits = (index: number): string => {
  // 简化实现，实际应从表达式解析
  return ''
}

/**
 * 设置光标到操作符位置
 * @param index 操作符索引
 */
const setCursorAtOperator = (index: number) => {
  cursorIndex.value = index + 1
}

/**
 * 解析剩余文本为 token
 * @param text 剩余文本
 */
const parseRemainingText = (text: string): Token[] => {
  const tokens: Token[] = []
  const regex = /(\d+\.?\d*)|([+\-*/=^()!&|]+)|(.)/g
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match[1]) {
      tokens.push({ type: 'number', value: match[1] })
    } else if (match[2]) {
      let operator = match[2]
      // 转换操作符为中文显示
      const operatorMap: Record<string, string> = {
        '&&': '且',
        '||': '或',
        '!': '非',
        '*': '×',
        '/': '÷'
      }
      tokens.push({ type: 'operator', value: operatorMap[operator] || operator })
    } else if (match[3] && match[3].trim()) {
      tokens.push({ type: 'text', value: match[3] })
    }
  }

  return tokens
}

/**
 * 插入按键值
 * @param value 按键值
 */
const insertKey = (value: string) => {
  const currentValue = props.modelValue || ''

  // 检查是否是运算符
  if (operatorMap[value]) {
    // 插入运算符单元
    insertOperator(value)
  } else if (/^\d+$/.test(value)) {
    // 插入数字
    insertNumber(value)
  } else {
    // 其他字符直接追加
    const newValue = currentValue + value
    emit('update:modelValue', newValue)
    emit('change', newValue)
  }
}

/**
 * 插入运算符单元
 * @param op 运算符
 */
const insertOperator = (op: string) => {
  const currentValue = props.modelValue || ''
  const opDef = operatorMap[op]
  if (!opDef) return

  // 判断是否是函数调用（min/max）
  const isFunction = op === 'min(' || op === 'max('

  // 构建插入内容
  let insertion = op
  let cursorOffset = 1 // 默认移动1个单元

  if (isFunction) {
    // 函数需要插入完整结构：min(, , )
    insertion = op + ',)'
    cursorOffset = 1 // 光标移动到 min( 后（第1个位置）
  }

  // 在光标位置插入运算符
  let newValue = ''
  const cursor = cursorIndex.value

  if (cursor >= 0 && cursor < expressionUnits.value.length) {
    // 在指定单元之前插入
    const unit = expressionUnits.value[cursor]
    let searchStr = ''
    if (unit.type === 'element') {
      searchStr = `[${unit.identity}.${unit.element.key}]`
    } else if (unit.type === 'operator') {
      searchStr = unit.value
    } else if (unit.type === 'number') {
      searchStr = unit.value
    }
    const pos = currentValue.indexOf(searchStr)
    if (pos >= 0) {
      newValue = currentValue.slice(0, pos) + insertion + currentValue.slice(pos)
    } else {
      newValue = currentValue + insertion
    }
  } else {
    // 在末尾插入
    newValue = currentValue + insertion
  }

  emit('update:modelValue', newValue)
  emit('change', newValue)

  // 移动光标
  cursorIndex.value += cursorOffset
}

/**
 * 插入数字
 * @param num 数字
 */
const insertNumber = (num: string) => {
  const currentValue = props.modelValue || ''

  // 在光标位置插入数字
  let newValue = ''
  const cursor = cursorIndex.value

  if (cursor >= 0 && cursor < expressionUnits.value.length) {
    // 在指定单元之前插入
    const unit = expressionUnits.value[cursor]
    let searchStr = ''
    if (unit.type === 'element') {
      searchStr = `[${unit.identity}.${unit.element.key}]`
    } else if (unit.type === 'operator') {
      searchStr = unit.value
    } else if (unit.type === 'number') {
      searchStr = unit.value
    }
    const pos = currentValue.indexOf(searchStr)
    if (pos >= 0) {
      newValue = currentValue.slice(0, pos) + num + currentValue.slice(pos)
    } else {
      newValue = currentValue + num
    }
  } else {
    // 在末尾插入
    newValue = currentValue + num
  }

  emit('update:modelValue', newValue)
  emit('change', newValue)

  // 移动光标
  cursorIndex.value++
}

/**
 * 删除光标前的运算单元或字符
 * 关联需求：删除按钮优化 - 从光标处开始删除
 */
const removeLast = () => {
  const currentValue = props.modelValue || ''
  if (currentValue.length === 0) return

  // 如果有选中的单元，删除选中的单元
  if (selectedUnitIndex.value >= 0) {
    removeUnit(selectedUnitIndex.value)
    return
  }

  // 获取光标位置
  const cursor = cursorIndex.value

  if (cursor > 0 && cursor <= expressionUnits.value.length) {
    // 删除光标前的单元
    const unitIndex = cursor - 1
    const unit = expressionUnits.value[unitIndex]

    if (unit) {
      // 数字单元特殊处理：如果长度大于1，仅删除末尾数字
      if (unit.type === 'number' && unit.value.length > 1) {
        removeLastDigit(unitIndex)
        return
      }

      // 其他单元直接删除
      let pattern: RegExp | null = null

      if (unit.type === 'element') {
        pattern = new RegExp(`\\[${unit.identity}\\.${unit.element.key}\\]`, 'g')
      } else if (unit.type === 'operator') {
        // 转义特殊字符
        const escaped = unit.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        pattern = new RegExp(escaped, 'g')
      } else if (unit.type === 'number') {
        // 单个数字，直接删除
        pattern = new RegExp(unit.value, 'g')
      }

      if (pattern) {
        const newValue = currentValue.replace(pattern, '').trim()
        emit('update:modelValue', newValue)
        emit('change', newValue)
        // 光标前移
        cursorIndex.value--
      }
    }
  } else {
    // 光标在最前面或没有单元，删除最后一个字符
    const newValue = currentValue.slice(0, -1)
    emit('update:modelValue', newValue)
    emit('change', newValue)
  }
}

/**
 * 替换单元中的元素
 * @param index 单元索引
 * @param newElement 新元素
 */
const replaceUnitElement = (index: number, newElement: GameElement) => {
  const currentValue = props.modelValue || ''
  const unit = expressionUnits.value[index]

  if (!unit || unit.type !== 'element') return

  // 构建旧的元素字符串模式
  const oldPattern = new RegExp(`\\[${unit.identity}\\.${unit.element.key}\\]`, 'g')

  // 构建新的元素字符串
  const newElementStr = `[${unit.identity}.${newElement.key}]`

  // 替换表达式中的对应部分
  const newValue = currentValue.replace(oldPattern, newElementStr)

  emit('update:modelValue', newValue.trim())
  emit('change', newValue.trim())

  // 显示成功提示
  ElMessage.success(`已切换为：${newElement.name}`)

  // 保持 dropdown 打开，方便连续切换
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

/**
 * 插入元素
 * @param element 游戏元素
 */
const insertElement = (element: GameElement) => {
  // 元素切换模式：替换当前元素
  if (isElementSwitchingMode.value && editingUnitIndex.value >= 0) {
    replaceUnitElement(editingUnitIndex.value, element)
    return
  }

  // 正常模式：在光标位置插入新元素
  const currentValue = props.modelValue || ''
  let insertion = ''

  if (element.requiresIdentity !== false) {
    // 需要身份的元素，使用嵌套格式
    insertion = `[cur_player.${element.key}]`
  } else {
    // 不需要身份的元素
    insertion = `[${element.key}]`
  }

  // 根据光标位置插入
  let newValue = ''
  const cursor = cursorIndex.value

  if (cursor >= 0 && cursor < expressionUnits.value.length) {
    // 在指定单元之前插入
    const unit = expressionUnits.value[cursor]
    // 查找该单元在原始文本中的位置
    let searchStr = ''
    if (unit.type === 'element') {
      searchStr = `[${unit.identity}.${unit.element.key}]`
    } else if (unit.type === 'operator') {
      searchStr = unit.value
    } else if (unit.type === 'number') {
      searchStr = unit.value
    }
    const pos = currentValue.indexOf(searchStr)
    if (pos >= 0) {
      newValue = currentValue.slice(0, pos) + insertion + ' ' + currentValue.slice(pos)
    } else {
      newValue = currentValue + ' ' + insertion
    }
  } else {
    // 在末尾插入
    newValue = currentValue + ' ' + insertion
  }

  emit('update:modelValue', newValue.trim())
  emit('change', newValue.trim())

  // 移动光标到插入元素之后
  cursorIndex.value++

  // 显示成功提示
  ElMessage.success(`已插入：${element.name}`)
}

/**
 * 处理搜索框键盘事件
 * @param e 键盘事件
 */
const handleSearchKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    highlightedElementIndex.value = Math.min(
      highlightedElementIndex.value + 1,
      filteredElements.value.length - 1
    )
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    highlightedElementIndex.value = Math.max(highlightedElementIndex.value - 1, 0)
  } else if (e.key === 'Enter' && highlightedElementIndex.value >= 0) {
    e.preventDefault()
    const element = filteredElements.value[highlightedElementIndex.value]
    if (element) {
      insertElement(element)
    }
  }
}

/**
 * 点击外部关闭
 * @param e 鼠标事件
 */
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as Node
  if (!wrapperRef.value?.contains(target)) {
    closeDropdown()
    isFocused.value = false
    selectedUnitIndex.value = -1
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  // 初始化光标位置
  cursorIndex.value = expressionUnits.value.length

  // 加载元素数据
  loadElements()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// ==================== Watch ====================
watch(() => props.modelValue, () => {
  // 表达式变化时更新光标位置
  if (cursorIndex.value > expressionUnits.value.length) {
    cursorIndex.value = expressionUnits.value.length
  }
})
</script>

<style scoped lang="scss">
@use "sass:color";

// ==================== 变量定义 ====================
$primary-color: #3b82f6;
$primary-light: #eff6ff;
$success-color: #10b981;
$success-light: #d1fae5;
$warning-color: #f59e0b;
$warning-light: #fffbeb;
$danger-color: #ef4444;
$border-color: #e5e7eb;
$bg-hover: #f3f4f6;
$text-primary: #374151;
$text-secondary: #6b7280;
$text-tertiary: #9ca3af;

// ==================== 容器 ====================
.expression-input-wrapper {
  position: relative;
  width: 100%;
}

// ==================== 输入框触发器 ====================
.input-trigger {
  display: flex;
  align-items: center;
  min-height: 40px;
  padding: 8px 12px;
  border: 1px solid $border-color;
  border-radius: 6px;
  background: #ffffff;
  cursor: text;
  transition: all 0.2s ease;

  &:hover {
    border-color: color.adjust($primary-color, $lightness: 20%);
  }

  &.is-focused,
  &.is-active {
    border-color: $primary-color;
    box-shadow: 0 0 0 2px rgba($primary-color, 0.1);
  }

  &.is-empty {
    .input-content {
      color: $text-tertiary;
    }
  }
}

.input-content {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  min-height: 24px;
  font-size: 14px;
  line-height: 1.5;
}

.input-suffix {
  display: flex;
  align-items: center;
  margin-left: 8px;
  color: $text-secondary;
}

.arrow-icon {
  transition: transform 0.2s ease;

  &.is-open {
    transform: rotate(180deg);
  }
}

.placeholder {
  color: $text-tertiary;
}

// ==================== 光标 ====================
// 关联需求：表达式输入框光标显示优化 - 闪动动画效果
.input-cursor {
  display: inline-block;
  width: 2px;
  height: 20px;
  background: $primary-color;
  margin: 0 2px;
  vertical-align: middle;
  border-radius: 1px;

  &.is-blinking {
    animation: cursor-blink 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
}

@keyframes cursor-blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

// ==================== 表达式单元 ====================
.expression-unit {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  background: #f9fafb;
  border: 1px solid $border-color;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;

  &:hover {
    border-color: color.adjust($primary-color, $lightness: 20%);
    background: $primary-light;
  }

  &.is-selected {
    border-color: $primary-color;
    border-width: 2px;
    background: $primary-light;
    box-shadow:
      0 4px 12px rgba($primary-color, 0.25),
      0 0 0 3px rgba($primary-color, 0.15),
      inset 0 0 0 1px rgba($primary-color, 0.1);
    transform: scale(1.03) translateY(-2px);
    z-index: 10;
  }

  // 数值型单元
  &.is-numeric {
    .unit-status-tag {
      background: $success-light;
      color: $success-color;
    }
  }

  // 布尔型单元
  &.is-boolean {
    .unit-status-tag {
      background: $warning-light;
      color: $warning-color;
    }
  }
}

// 身份标签
.unit-identity-tag {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 6px;
  border-radius: 3px;
  background: $primary-light;
  color: $primary-color;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: color.adjust($primary-light, $lightness: -5%);
  }

  // 泛身份样式
  &.is-generic {
    background: $warning-light;
    color: $warning-color;

    &:hover {
      background: color.adjust($warning-light, $lightness: -5%);
    }
  }
}

.generic-badge {
  font-size: 10px;
  font-weight: 600;
  opacity: 0.8;
}

// 连接词
.unit-connector {
  font-size: 12px;
  color: $text-secondary;
}

// 状态标签
.unit-status-tag {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
  background: #f3f4f6;
  color: $text-primary;
}

// 否定标签
.unit-negation-tag {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
  font-weight: 500;
  background: #f3f4f6;
  color: $text-secondary;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: color.adjust($danger-color, $lightness: 35%);
    color: $danger-color;
  }

  &.is-negated {
    background: color.adjust($danger-color, $lightness: 35%);
    color: $danger-color;
  }
}

// 删除按钮
.unit-delete-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: $danger-color;
  color: #ffffff;
  cursor: pointer;
  margin-left: 4px;
  transition: all 0.15s ease;

  &:hover {
    background: color.adjust($danger-color, $lightness: -10%);
  }
}

// ==================== 运算符单元 ====================
// 关联需求：运算符单元化 - 运算符单元样式
.operator-unit {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid transparent;

  // 算术运算符 - 蓝色主题
  &.is-arithmetic {
    background: #dbeafe;
    color: #2563eb;
    border-color: #93c5fd;

    &:hover {
      background: #bfdbfe;
      border-color: #60a5fa;
    }

    &.is-selected {
      background: #2563eb;
      color: #ffffff;
      border-color: #1d4ed8;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
    }
  }

  // 比较运算符 - 橙色主题
  &.is-compare {
    background: #ffedd5;
    color: #ea580c;
    border-color: #fdba74;

    &:hover {
      background: #fed7aa;
      border-color: #fb923c;
    }

    &.is-selected {
      background: #ea580c;
      color: #ffffff;
      border-color: #c2410c;
      box-shadow: 0 2px 8px rgba(234, 88, 12, 0.3);
    }
  }

  // 逻辑运算符 - 绿色主题
  &.is-logic {
    background: #d1fae5;
    color: #059669;
    border-color: #6ee7b7;

    &:hover {
      background: #a7f3d0;
      border-color: #34d399;
    }

    &.is-selected {
      background: #059669;
      color: #ffffff;
      border-color: #047857;
      box-shadow: 0 2px 8px rgba(5, 150, 105, 0.3);
    }
  }

  // 括号 - 灰色主题
  &.is-bracket {
    background: #f3f4f6;
    color: #4b5563;
    border-color: #d1d5db;

    &:hover {
      background: #e5e7eb;
      border-color: #9ca3af;
    }

    &.is-selected {
      background: #4b5563;
      color: #ffffff;
      border-color: #374151;
      box-shadow: 0 2px 8px rgba(75, 85, 99, 0.3);
    }
  }
}

// ==================== 数字单元 ====================
// 关联需求：运算符单元化 - 数字单元样式
.number-unit {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  background: #fef3c7;
  color: #d97706;
  border: 1px solid #fcd34d;

  &:hover {
    background: #fde68a;
    border-color: #fbbf24;
  }

  &.is-selected {
    background: #d97706;
    color: #ffffff;
    border-color: #b45309;
    box-shadow: 0 2px 8px rgba(217, 119, 6, 0.3);
  }
}

// 单元间操作符
.operator-between-units {
  padding: 2px 6px;
  font-size: 13px;
  color: $text-secondary;
  background: #f3f4f6;
  border-radius: 3px;
  cursor: pointer;

  &:hover {
    background: $bg-hover;
  }
}

// 数字 token
.number-token {
  padding: 2px 6px;
  font-size: 13px;
  color: $text-primary;
  background: #f3f4f6;
  border-radius: 3px;
  font-weight: 500;
}

// 文本 token
.text-token {
  font-size: 13px;
  color: $text-primary;
}

// ==================== Dropdown 编辑器面板 ====================
.editor-dropdown {
  position: fixed;
  z-index: 10000;
  background: #ffffff;
  border: 1px solid $border-color;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  overflow: hidden;

  &.is-above {
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  }
}

// ==================== 编辑器主体 ====================
// 关联需求：键盘布局优化 - 编辑器主体高度与键盘匹配
.editor-main {
  display: flex;
  height: 400px;

}

// ==================== 虚拟键盘 ====================
// 关联需求：键盘布局优化 - 紧凑排版与右侧元素面板对齐
.virtual-keyboard {
  width: 300px;
  padding: 16px;
  background: #f9fafb;
  border-right: 1px solid $border-color;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
}

.keyboard-row {
  display: flex;
  gap: 8px;

  // 比较运算符行样式
  &.compare-row {
    margin-top: 4px;
    padding-top: 8px;
    border-top: 1px dashed $border-color;

    .keyboard-btn {
      background: #fef3c7;
      color: #92400e;
      font-weight: 600;
      font-size: 16px;

      &:hover {
        background: #fde68a;
      }
    }
  }

  // 逻辑运算符行样式
  &.logic-row {
    margin-top: 4px;
    padding-top: 8px;
    border-top: 1px dashed $border-color;

    .keyboard-btn {
      background: #d1fae5;
      color: #065f46;
      font-weight: 600;
      font-size: 13px;

      &:hover {
        background: #a7f3d0;
      }
    }
  }

  // 函数行样式
  &.function-row {
    margin-top: 4px;
    padding-top: 8px;
    border-top: 1px dashed $border-color;

    .keyboard-btn {
      background: #e0e7ff;
      color: #4338ca;
      font-weight: 600;
      font-size: 14px;

      &:hover {
        background: #c7d2fe;
      }
    }
  }
}

.keyboard-btn {
  flex: 1;
  min-width: 40px;
  height: 42px;
  border: none;
  border-radius: 8px;
  background: #ffffff;
  color: $text-primary;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: $primary-light;
    color: $primary-color;
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  }

  // 数字按钮样式
  &.number {
    font-weight: 600;
    font-size: 16px;
  }

  // 操作符按钮样式
  &.operator {
    background: #eff6ff;
    color: #2563eb;
    font-weight: 600;

    &:hover {
      background: #dbeafe;
    }
  }

  // 删除按钮样式
  &.action {
    background: #fee2e2;
    color: $danger-color;
    font-size: 18px;

    &:hover {
      background: #fecaca;
    }
  }
}

// ==================== 元素选择面板 ====================
.element-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;

  // 元素切换模式：占满整个 dropdown 宽度
  &.is-full-width {
    width: 100%;
  }
}

// 搜索框
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid $border-color;

  .search-icon {
    color: $text-tertiary;
    font-size: 16px;
  }
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: $text-primary;
  background: transparent;

  &::placeholder {
    color: $text-tertiary;
  }
}

// 分类 Tab
.category-tabs {
  display: flex;
  gap: 4px;
  padding: 8px 12px;
  border-bottom: 1px solid $border-color;
  overflow-x: auto;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: $border-color;
    border-radius: 2px;
  }
}

.category-tab {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  color: $text-secondary;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;

  &:hover {
    background: $bg-hover;
    color: $text-primary;
  }

  &.active {
    background: $primary-light;
    color: $primary-color;
    font-weight: 500;
  }
}

// 元素列表
.element-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: $border-color;
    border-radius: 3px;
  }
}

.element-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover,
  &.is-highlighted {
    background: $bg-hover;
  }

  &.is-selected {
    background: $primary-light;

    .element-name {
      color: $primary-color;
      font-weight: 500;
    }
  }
}

.element-name {
  font-size: 13px;
  color: $text-primary;
}

.check-icon {
  color: $primary-color;
  font-size: 14px;
}

// 加载和空状态
.loading-tip,
.empty-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 20px;
  color: $text-secondary;
  font-size: 13px;
}

.loading-icon {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// ==================== Dropdown 动画 ====================
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
