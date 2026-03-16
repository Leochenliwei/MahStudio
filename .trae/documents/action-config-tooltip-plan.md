# ActionConfig.vue 添加提示语和规则说明功能计划

## 需求分析

在 `ActionConfig.vue` 组件中添加：
1. **公共提示语输入框**：放在外层，所有 action 共用，使用单一文本输入（不区分条件）
2. **整体规则说明文本输入框**：用于描述当前规则的作用

业务逻辑：当满足条件时，显示/隐藏一些选项，并同时显示提示语

## 当前组件结构分析

`ActionConfig.vue` 当前 props：
- `targets`: 动作列表数组
- `formSchema`: 表单 schema 数据
- `allComponents`: 所有组件列表

需要新增 props：
- `tooltip`: 公共提示语文本（字符串）
- `description`: 规则说明文本

## 实现方案

### 1. 数据结构扩展

新增两个 v-model 绑定的数据：

```javascript
// 公共提示语（单一文本）
tooltip: ''

// 规则说明
description: ''
```

### 2. Props 定义更新

```javascript
const props = defineProps({
  targets: { type: Array, default: () => [] },
  formSchema: { type: Array, default: () => [] },
  allComponents: { type: Array, default: () => [] },
  tooltip: {      // 新增 - 公共提示语
    type: String,
    default: ''
  },
  description: {  // 新增 - 规则说明
    type: String,
    default: ''
  }
})
```

### 3. Emits 定义更新

```javascript
const emit = defineEmits([
  'update:targets',
  'update:tooltip',      // 新增
  'update:description'   // 新增
])
```

### 4. UI 布局设计

在面板标题下方、动作列表上方添加两个配置区域：

```
┌─────────────────────────────────────┐
│ 执行动作 (THEN)          + 新增动作 │  ← 原有标题
├─────────────────────────────────────┤
│ 💬 提示语                            │  ← 新增
│ [输入框]                             │
├─────────────────────────────────────┤
│ 📝 规则说明                          │  ← 新增
│ [文本域]                             │
├─────────────────────────────────────┤
│ [动作卡片 1]                         │  ← 原有动作列表
│ [动作卡片 2]                         │
└─────────────────────────────────────┘
```

### 5. 具体实现步骤

#### 步骤 1: 更新 Props 和 Emits
- 添加 `tooltip`（字符串类型）和 `description` 的 prop 定义
- 添加对应的 update 事件

#### 步骤 2: 添加模板代码
在 `.scroll-area` 的开头添加：

**提示语配置区域：**
```html
<!-- 公共提示语配置 -->
<div class="global-config-section">
  <div class="global-config-title">💬 提示语</div>
  <input 
    type="text" 
    class="edit-input tooltip-input"
    :value="tooltip"
    @input="$emit('update:tooltip', $event.target.value)"
    placeholder="请输入提示语内容"
  >
</div>
```

**规则说明配置区域：**
```html
<!-- 规则说明配置 -->
<div class="global-config-section">
  <div class="global-config-title">📝 规则说明</div>
  <textarea 
    class="edit-textarea description-textarea"
    :value="description"
    @input="$emit('update:description', $event.target.value)"
    placeholder="请输入规则说明，用于描述此联动规则的作用..."
    rows="2"
  ></textarea>
</div>
```

#### 步骤 3: 添加样式

```css
/* 全局配置区域 */
.global-config-section {
  background: #f8f9fa;
  border: 1px dashed #d0d0d0;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
}

.global-config-title {
  font-size: 12px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

/* 提示语输入框 */
.tooltip-input {
  width: 100%;
}

/* 规则说明文本域 */
.description-textarea {
  width: 100%;
  resize: vertical;
  min-height: 50px;
  font-family: inherit;
}

/* 文本域基础样式 */
.edit-textarea {
  border: 1px solid #eee;
  background: #F5F6FA;
  border-radius: 4px;
  padding: 8px;
  font-size: 12px;
  color: var(--text-main);
  line-height: 1.5;
}

.edit-textarea:focus {
  outline: none;
  border-color: var(--primary);
}
```

### 6. 使用方式

父组件使用时通过 v-model 绑定：

```html
<ActionConfig 
  v-model:targets="rule.targets"
  v-model:tooltip="rule.tooltip"
  v-model:description="rule.description"
  :formSchema="formSchema"
  :allComponents="allComponents"
/>
```

数据格式：
```javascript
{
  targets: [...],      // 动作列表
  tooltip: '提示语内容', // 公共提示语（单一文本）
  description: '规则说明文本'  // 规则说明
}
```

## 设计规范遵循

根据 `.trae/rules/design_rule.md`：

1. **颜色规范**: 
   - 背景使用 `#f8f9fa`（表面色）
   - 边框使用 `#d0d0d0`
   - 文本使用 `#333`（主要）、`#666`（次要）

2. **组件规范**: 
   - 输入框使用圆角矩形（4px），有 focus 效果
   - 文本域支持垂直调整大小
   - 区域使用虚线边框区分

3. **间距规范**: 
   - 区域内边距 12px
   - 元素间距 8px
   - 区域间间距 16px

4. **字体规范**: 
   - 标题使用 12px，font-weight: 600
   - 输入框使用 12px

## 实施步骤

1. ✅ 分析现有代码结构和业务逻辑
2. ✅ 理解需求：公共提示语（单一文本）+ 规则说明，都放在外层
3. ⏳ 更新 Props 定义，添加 tooltip（字符串）和 description
4. ⏳ 更新 Emits 定义，添加 update:tooltip 和 update:description
5. ⏳ 在模板中添加提示语和规则说明配置区域
6. ⏳ 添加对应的 CSS 样式
7. ⏳ 使用 webapp-testing skill 进行测试验证

## 预期效果

用户可以在配置动作时：
1. 在顶部的"提示语"区域输入提示语内容（所有动作共用，单一文本）
2. 在"规则说明"区域输入当前规则的描述文本
3. 提示语和规则说明通过 v-model 与父组件数据双向绑定
