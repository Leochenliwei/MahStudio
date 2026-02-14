<template>
  <div class="advanced-rules-page">
    <!-- 顶部导航栏 -->
    <div class="page-header">
      <div class="breadcrumb">
        <button class="breadcrumb-item" @click="goBack">
          <Icon name="arrow-left" size="16" />
          返回工作台
        </button>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-item current">详细规则配置</span>
      </div>
      <div class="header-actions">
        <h1>详细规则配置</h1>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="page-content">
      <!-- 左侧导航 -->
      <div class="left-navigation">
        <div class="nav-section">
          <h3>游戏阶段</h3>
          <div class="nav-items">
            <button 
              v-for="navItem in navItems" 
              :key="navItem.id"
              class="nav-item"
              :class="{ active: activeNav === navItem.id }"
              @click="activeNav = navItem.id"
            >
              <Icon :name="navItem.icon" size="16" />
              <span>{{ navItem.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧内容 -->
      <div class="right-content">
        <!-- 基础规则 -->
        <div v-if="activeNav === 'basic'" class="rule-section">
          <h2>基础规则</h2>
          <div class="rule-card">
            <div class="rule-header">
              <h3>游戏基础设置</h3>
              <label class="toggle-option">
                <input type="checkbox" v-model="rules.basic.enabled">
                <span>启用</span>
              </label>
            </div>
            <div class="rule-content">
              <div class="form-group">
                <label>游戏名称</label>
                <input type="text" v-model="rules.basic.gameName" class="form-input">
              </div>
              <div class="form-group">
                <label>游戏版本</label>
                <input type="text" v-model="rules.basic.version" class="form-input">
              </div>
              <div class="form-group">
                <label>游戏描述</label>
                <textarea v-model="rules.basic.description" class="form-textarea" rows="3"></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- 发牌前阶段 -->
        <div v-if="activeNav === 'preDeal'" class="rule-section">
          <h2>发牌前阶段</h2>
          <div class="rule-card">
            <div class="rule-header">
              <h3>准备阶段设置</h3>
              <label class="toggle-option">
                <input type="checkbox" v-model="rules.preDeal.enabled">
                <span>启用</span>
              </label>
            </div>
            <div class="rule-content">
              <div class="form-group">
                <label>准备时间限制</label>
                <input type="number" v-model.number="rules.preDeal.prepareTime" class="form-input" min="5" max="120">
                <span class="form-help">秒</span>
              </div>
              <div class="form-group">
                <label>人数确认方式</label>
                <select v-model="rules.preDeal.playerConfirmMode" class="form-select">
                  <option value="auto">自动确认</option>
                  <option value="manual">手动确认</option>
                  <option value="hybrid">混合模式</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- 发牌后阶段 -->
        <div v-if="activeNav === 'postDeal'" class="rule-section">
          <h2>发牌后阶段</h2>
          <div class="rule-card">
            <div class="rule-header">
              <h3>发牌后设置</h3>
              <label class="toggle-option">
                <input type="checkbox" v-model="rules.postDeal.enabled">
                <span>启用</span>
              </label>
            </div>
            <div class="rule-content">
              <div class="form-group">
                <label>看牌时间限制</label>
                <input type="number" v-model.number="rules.postDeal.viewTime" class="form-input" min="5" max="60">
                <span class="form-help">秒</span>
              </div>
              <div class="form-group">
                <label>初始操作</label>
                <div class="checkbox-group">
                  <label class="checkbox-option">
                    <input type="checkbox" v-model="rules.postDeal.allowSort">
                    <span>允许排序</span>
                  </label>
                  <label class="checkbox-option">
                    <input type="checkbox" v-model="rules.postDeal.allowDiscard">
                    <span>允许弃牌</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 摸打阶段 -->
        <div v-if="activeNav === 'play'" class="rule-section">
          <h2>摸打阶段</h2>
          <div class="rule-card">
            <div class="rule-header">
              <h3>行牌规则</h3>
              <label class="toggle-option">
                <input type="checkbox" v-model="rules.play.enabled">
                <span>启用</span>
              </label>
            </div>
            <div class="rule-content">
              <div class="form-group">
                <label>出牌时间限制</label>
                <input type="number" v-model.number="rules.play.discardTime" class="form-input" min="5" max="60">
                <span class="form-help">秒</span>
              </div>
              <div class="form-group">
                <label>思考时间限制</label>
                <input type="number" v-model.number="rules.play.thinkTime" class="form-input" min="5" max="60">
                <span class="form-help">秒</span>
              </div>
              <div class="form-group">
                <label>超时处理</label>
                <select v-model="rules.play.timeoutAction" class="form-select">
                  <option value="autoDiscard">自动出牌</option>
                  <option value="skip">跳过回合</option>
                  <option value="penalty">扣分处理</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- 天胡 -->
        <div v-if="activeNav === 'tianhu'" class="rule-section">
          <h2>天胡</h2>
          <div class="rule-card">
            <div class="rule-header">
              <h3>天胡规则</h3>
              <label class="toggle-option">
                <input type="checkbox" v-model="rules.tianhu.enabled">
                <span>启用</span>
              </label>
            </div>
            <div class="rule-content">
              <div class="form-group">
                <label>天胡倍数</label>
                <input type="number" v-model.number="rules.tianhu.multiplier" class="form-input" min="1" max="10">
              </div>
              <div class="form-group">
                <label>天胡条件</label>
                <div class="checkbox-group">
                  <label class="checkbox-option">
                    <input type="checkbox" v-model="rules.tianhu.allowDealer">
                    <span>庄家允许</span>
                  </label>
                  <label class="checkbox-option">
                    <input type="checkbox" v-model="rules.tianhu.allowPlayer">
                    <span>闲家允许</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 胡牌阶段 -->
        <div v-if="activeNav === 'hu'" class="rule-section">
          <h2>胡牌阶段</h2>
          <div class="rule-card">
            <div class="rule-header">
              <h3>胡牌规则</h3>
              <label class="toggle-option">
                <input type="checkbox" v-model="rules.hu.enabled">
                <span>启用</span>
              </label>
            </div>
            <div class="rule-content">
              <div class="form-group">
                <label>胡牌方式</label>
                <div class="checkbox-group">
                  <label class="checkbox-option">
                    <input type="checkbox" v-model="rules.hu.allowSelfDraw">
                    <span>自摸</span>
                  </label>
                  <label class="checkbox-option">
                    <input type="checkbox" v-model="rules.hu.allowRobbingKong">
                    <span>抢杠胡</span>
                  </label>
                  <label class="checkbox-option">
                    <input type="checkbox" v-model="rules.hu.allowMultipleWin">
                    <span>一炮多响</span>
                  </label>
                </div>
              </div>
              <div class="form-group">
                <label>特殊胡牌</label>
                <div class="checkbox-group">
                  <label class="checkbox-option">
                    <input type="checkbox" v-model="rules.hu.allowSevenPairs">
                    <span>七对子</span>
                  </label>
                  <label class="checkbox-option">
                    <input type="checkbox" v-model="rules.hu.allowThirteenOrphans">
                    <span>十三幺</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 算分阶段 -->
        <div v-if="activeNav === 'score'" class="rule-section">
          <h2>算分阶段</h2>
          <div class="rule-card">
            <div class="rule-header">
              <h3>算分规则</h3>
              <label class="toggle-option">
                <input type="checkbox" v-model="rules.score.enabled">
                <span>启用</span>
              </label>
            </div>
            <div class="rule-content">
              <div class="form-group">
                <label>基础分数</label>
                <input type="number" v-model.number="rules.score.baseScore" class="form-input" min="1" max="100">
              </div>
              <div class="form-group">
                <label>倍数规则</label>
                <div class="multiplier-rules">
                  <div class="multiplier-item">
                    <label>自摸倍数</label>
                    <input type="number" v-model.number="rules.score.selfDrawMultiplier" class="form-input small" min="1" max="10">
                  </div>
                  <div class="multiplier-item">
                    <label>点炮倍数</label>
                    <input type="number" v-model.number="rules.score.robbingMultiplier" class="form-input small" min="1" max="10">
                  </div>
                  <div class="multiplier-item">
                    <label>杠上开花倍数</label>
                    <input type="number" v-model.number="rules.score.kongFlowerMultiplier" class="form-input small" min="1" max="10">
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label>详细算分规则</label>
                <button class="btn-secondary" @click="showCalcScoreConfig = true">配置算分规则</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="page-footer">
      <button class="btn-secondary" @click="resetRules">重置</button>
      <button class="btn-primary" @click="saveRules">保存并离开</button>
    </div>

    <!-- 算分规则配置弹窗 -->
    <div v-if="showCalcScoreConfig" class="modal-overlay">
      <CalcScoreConfig @close="showCalcScoreConfig = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Icon from '../components/Icon.vue'
import CalcScoreConfig from '../components/CalcScoreConfig.vue'

const router = useRouter()
const route = useRoute()

// 导航项
const navItems = [
  { id: 'basic', label: '基础规则', icon: 'sliders' },
  { id: 'preDeal', label: '发牌前阶段', icon: 'package' },
  { id: 'postDeal', label: '发牌后阶段', icon: 'cards' },
  { id: 'play', label: '摸打阶段', icon: 'activity' },
  { id: 'tianhu', label: '天胡', icon: 'star' },
  { id: 'hu', label: '胡牌阶段', icon: 'trophy' },
  { id: 'score', label: '算分阶段', icon: 'dollar-sign' }
]

// 活跃导航
const activeNav = ref('basic')

// 算分规则配置弹窗状态
const showCalcScoreConfig = ref(false)

// 规则数据
const rules = ref({
  basic: {
    enabled: true,
    gameName: '',
    version: '1.0.0',
    description: ''
  },
  preDeal: {
    enabled: true,
    prepareTime: 30,
    playerConfirmMode: 'auto'
  },
  postDeal: {
    enabled: true,
    viewTime: 15,
    allowSort: true,
    allowDiscard: false
  },
  play: {
    enabled: true,
    discardTime: 20,
    thinkTime: 15,
    timeoutAction: 'autoDiscard'
  },
  tianhu: {
    enabled: true,
    multiplier: 3,
    allowDealer: true,
    allowPlayer: false
  },
  hu: {
    enabled: true,
    allowSelfDraw: true,
    allowRobbingKong: true,
    allowMultipleWin: true,
    allowSevenPairs: true,
    allowThirteenOrphans: true
  },
  score: {
    enabled: true,
    baseScore: 1,
    selfDrawMultiplier: 2,
    robbingMultiplier: 1,
    kongFlowerMultiplier: 2
  }
})

// 返回工作台
function goBack() {
  router.push({ name: 'Workbench', params: { id: route.params.id } })
}

// 保存规则
function saveRules() {
  // 保存到本地存储
  localStorage.setItem(`advancedRules_${route.params.id}`, JSON.stringify(rules.value))
  alert('规则已保存')
  goBack()
}

// 重置规则
function resetRules() {
  if (confirm('确定要重置所有规则吗？')) {
    rules.value = {
      basic: {
        enabled: true,
        gameName: '',
        version: '1.0.0',
        description: ''
      },
      preDeal: {
        enabled: true,
        prepareTime: 30,
        playerConfirmMode: 'auto'
      },
      postDeal: {
        enabled: true,
        viewTime: 15,
        allowSort: true,
        allowDiscard: false
      },
      play: {
        enabled: true,
        discardTime: 20,
        thinkTime: 15,
        timeoutAction: 'autoDiscard'
      },
      tianhu: {
        enabled: true,
        multiplier: 3,
        allowDealer: true,
        allowPlayer: false
      },
      hu: {
        enabled: true,
        allowSelfDraw: true,
        allowRobbingKong: true,
        allowMultipleWin: true,
        allowSevenPairs: true,
        allowThirteenOrphans: true
      },
      score: {
        enabled: true,
        baseScore: 1,
        selfDrawMultiplier: 2,
        robbingMultiplier: 1,
        kongFlowerMultiplier: 2
      }
    }
  }
}

// 加载规则
function loadRules() {
  const savedRules = localStorage.getItem(`advancedRules_${route.params.id}`)
  if (savedRules) {
    rules.value = JSON.parse(savedRules)
  }
}

// 组件挂载时加载规则
onMounted(() => {
  loadRules()
})
</script>

<style scoped>
.advanced-rules-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
}

/* 顶部导航栏 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-6);
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
}

.breadcrumb-item.current {
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.breadcrumb-separator {
  color: var(--color-text-tertiary);
}

.breadcrumb-item button {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-md);
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: var(--spacing-1);
}

.breadcrumb-item button:hover {
  background-color: var(--color-surface-hover);
  color: var(--color-primary);
}

.header-actions h1 {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

/* 主要内容区 */
.page-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 左侧导航 */
.left-navigation {
  width: 240px;
  background-color: var(--color-surface);
  border-right: 1px solid var(--color-border);
  padding: var(--spacing-6);
  overflow-y: auto;
}

.nav-section h3 {
  margin: 0 0 var(--spacing-4) 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  text-align: left;
  font-size: var(--font-size-sm);
}

.nav-item:hover {
  background-color: var(--color-surface);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.nav-item.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* 右侧内容 */
.right-content {
  flex: 1;
  padding: var(--spacing-6);
  overflow-y: auto;
  background-color: var(--color-surface);
}

.rule-section {
  margin-bottom: var(--spacing-8);
}

.rule-section h2 {
  margin: 0 0 var(--spacing-6) 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.rule-card {
  background-color: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  margin-bottom: var(--spacing-6);
}

.rule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-4) var(--spacing-6);
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.rule-header h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.rule-content {
  padding: var(--spacing-6);
}

/* 表单样式 */
.form-group {
  margin-bottom: var(--spacing-4);
}

.form-group label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2);
}

.form-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

.form-textarea {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  resize: vertical;
  transition: all var(--transition-normal);
}

.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

.form-select {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

.form-help {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-left: var(--spacing-2);
}

/* 复选框组 */
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.toggle-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  cursor: pointer;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

/* 倍数规则 */
.multiplier-rules {
  display: flex;
  gap: var(--spacing-4);
  flex-wrap: wrap;
}

.multiplier-item {
  flex: 1;
  min-width: 120px;
}

.form-input.small {
  width: 80px;
}

/* 底部操作栏 */
.page-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-4);
  padding: var(--spacing-6);
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  padding: var(--spacing-3) var(--spacing-6);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
}

.btn-secondary:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-primary);
}

.btn-primary {
  padding: var(--spacing-3) var(--spacing-6);
  background-color: var(--color-primary);
  color: white;
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  transition: all var(--transition-normal);
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

/* 小屏幕适配 */
@media (max-width: 768px) {
  .left-navigation {
    width: 200px;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
  }
  
  .header-actions h1 {
    font-size: var(--font-size-lg);
  }
}

/* 弹窗遮罩 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>