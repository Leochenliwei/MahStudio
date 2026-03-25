# Workbench 只读模式设计方案

## 需求概述
为 Workbench.vue 工作台添加只读状态 UI：
1. 在顶部操作栏添加"只读"按钮
2. 点击按钮显示/隐藏只读提示条
3. 提示条显示"当前为查看模式，无法保存和提测，可以点击组件查看"

## 设计思路

### 1. 文件位置
- 文件：`/Users/zonst/Documents/Programs/WEBconfig/src/views/Workbench.vue`

### 2. UI 改造方案

#### 2.1 顶部操作栏添加"只读"按钮
- 位置：在"返回控制台"按钮旁边
- 样式：使用眼睛图标（View）+ "只读"文字
- 交互：点击切换只读模式状态

#### 2.2 只读提示条
- 位置：在顶部操作栏（`.top-action-bar`）和 Tab 栏（`.tab-bar`）之间
- 显示条件：当 `isReadonlyMode` 为 `true` 时显示
- 样式：黄色背景（#fef3c7），深黄色文字（#92400e）
- 内容：眼睛图标 + "当前为查看模式，无法保存和提测，可以点击组件查看配置详情"

### 3. 实现步骤

#### 步骤 1：添加响应式状态
在 script setup 中添加：
```javascript
// 只读模式状态
const isReadonlyMode = ref(false)

// 切换只读模式
function toggleReadonlyMode() {
  isReadonlyMode.value = !isReadonlyMode.value
}
```

#### 步骤 2：导入 View 图标
在 import 中添加 View 图标：
```javascript
import {
  // ... 其他图标
  View
} from '@element-plus/icons-vue'
```

#### 步骤 3：在顶部操作栏添加只读按钮
在 `.top-bar-left` 中的"返回控制台"按钮后添加：
```html
<button 
  class="action-btn readonly-btn" 
  :class="{ active: isReadonlyMode }"
  @click="toggleReadonlyMode" 
  title="切换只读模式"
>
  <el-icon :size="16"><View /></el-icon>
  <span>只读</span>
</button>
```

#### 步骤 4：添加只读提示条
在 `</div>`（top-action-bar 结束）和 `<div class="tab-bar">` 之间添加：
```html
<!-- 只读模式提示条 -->
<div v-if="isReadonlyMode" class="readonly-banner">
  <el-icon :size="16"><View /></el-icon>
  <span>当前为查看模式，无法保存和提测，可以点击组件查看配置详情</span>
</div>
```

#### 步骤 5：添加样式
在 style 部分添加：
```css
/* 只读按钮样式 */
.action-btn.readonly-btn {
  background-color: #ffffff;
  color: #374151;
  border-color: #d1d5db;
}

.action-btn.readonly-btn:hover {
  background-color: rgba(245, 158, 11, 0.1);
  border-color: #f59e0b;
  color: #f59e0b;
}

.action-btn.readonly-btn.active {
  background-color: rgba(245, 158, 11, 0.15);
  border-color: #f59e0b;
  color: #f59e0b;
}

/* 只读提示条样式 */
.readonly-banner {
  height: 40px;
  background-color: #fef3c7;
  border-bottom: 1px solid #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #92400e;
  font-size: 14px;
  flex-shrink: 0;
}

.readonly-banner .el-icon {
  color: #f59e0b;
}
```

### 4. 效果预览

#### 正常模式：
```
┌─────────────────────────────────────────────────────────────┐
│  返回控制台 [👁️只读]  游戏名称    [保存] [提测]              │
├─────────────────────────────────────────────────────────────┤
│  [规则配置] [创房选项] [选项联动] [变量管理] [游戏表现]     │
```

#### 只读模式（点击只读按钮后）：
```
┌─────────────────────────────────────────────────────────────┐
│  返回控制台 [👁️只读]  游戏名称    [保存] [提测]              │  ← 只读按钮高亮
├─────────────────────────────────────────────────────────────┤
│  👁️ 当前为查看模式，无法保存和提测，可以点击组件查看配置详情 │  ← 黄色提示条
├─────────────────────────────────────────────────────────────┤
│  [规则配置] [创房选项] [选项联动] [变量管理] [游戏表现]     │
```

### 5. 代码变更位置

| 位置 | 变更内容 |
|------|----------|
| template 第 8 行后 | 添加只读按钮 |
| template 第 33 行后 | 添加只读提示条 v-if |
| script import | 添加 View 图标导入 |
| script setup | 添加 isReadonlyMode 和 toggleReadonlyMode |
| style | 添加 .readonly-btn 和 .readonly-banner 样式 |
