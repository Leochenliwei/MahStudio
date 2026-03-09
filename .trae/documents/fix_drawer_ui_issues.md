# 修复 Drawer UI 问题计划

## 问题描述

根据截图和描述，需要修复以下两个 UI 问题：

### 问题1：锁定图标位置
- **当前位置**：锁定图标（🔒）显示在开关右侧，远离"已启用"标签
- **期望位置**：将锁定图标放到"已启用"标签的右侧，与状态标签靠近

### 问题2：属性面板行高错乱
- **问题**：右侧属性面板中，部分元件的行高显示错乱（如截图所示，"小局结束条件"组件的属性行高不一致）
- **原因**：`.property-item.layout-inline` 使用了 `align-items: center`，但内容高度不一致时会导致错位

## 修复方案

### 问题1修复：调整锁定图标位置

**当前结构分析：**
```vue
<div class="component-info">
  <h4>{{ component.name }}</h4>
  <div v-if="component.enabled" class="component-status enabled">
    已启用
  </div>
</div>
<div class="component-toggle">
  <label class="toggle-switch" :class="{ 'locked': component.locked }">
    <!-- 开关和锁定图标 -->
    <span v-if="component.locked" class="lock-icon">
      <Icon name="lock" size="14" />
    </span>
  </label>
</div>
```

**修复方案：**
将锁定图标移动到 `component-info` 区域，放在"已启用"标签旁边：

```vue
<div class="component-info">
  <h4>{{ component.name }}</h4>
  <div class="component-meta">
    <div v-if="component.enabled" class="component-status enabled">
      已启用
    </div>
    <span v-if="component.locked" class="lock-icon-inline">
      <Icon name="lock" size="12" />
    </span>
  </div>
</div>
```

**样式调整：**
- 添加 `.component-meta` 容器使用 flex 布局
- 调整锁定图标样式为行内显示

### 问题2修复：属性面板行高对齐

**当前样式：**
```css
.property-item.layout-inline {
  flex-direction: row;
  align-items: center;
}
```

**问题分析：**
当 label 和 property-control 内容高度不一致时，`align-items: center` 会导致视觉上错位。

**修复方案：**
将 `align-items: center` 改为 `align-items: flex-start`，让内容顶部对齐：

```css
.property-item.layout-inline {
  flex-direction: row;
  align-items: flex-start; /* 改为顶部对齐 */
}

.property-item.layout-inline label {
  flex: 0 0 120px;
  margin-bottom: 0;
  margin-top: 6px; /* 添加顶部间距，与控件对齐 */
}
```

## 具体修改步骤

### 步骤1：修改组件模板结构

在 `Drawer.vue` 中修改组件项模板，将锁定图标移到 `component-info` 内：

```vue
<div class="component-info" @click="toggleComponentSelection(component)">
  <h4>{{ component.name }}</h4>
  <div class="component-meta">
    <div v-if="component.enabled" class="component-status enabled">
      已启用
    </div>
    <span v-if="component.locked" class="lock-icon-inline">
      <Icon name="lock" size="12" />
    </span>
  </div>
</div>
<div class="component-toggle">
  <label class="toggle-switch" :class="{ 'locked': component.locked }" @click.stop>
    <input 
      type="checkbox" 
      v-model="component.enabled"
      @change="toggleComponentStatus(component)"
      :disabled="component.locked"
    >
    <span class="toggle-slider"></span>
  </label>
</div>
```

### 步骤2：添加/修改样式

添加 `.component-meta` 和 `.lock-icon-inline` 样式：

```css
.component-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-top: 2px;
}

.lock-icon-inline {
  color: var(--color-primary);
  font-size: 12px;
  display: inline-flex;
  align-items: center;
}
```

### 步骤3：修复属性面板行高

修改 `.property-item.layout-inline` 样式：

```css
.property-item.layout-inline {
  flex-direction: row;
  align-items: flex-start; /* 改为顶部对齐 */
}

.property-item.layout-inline label {
  flex: 0 0 120px;
  margin-bottom: 0;
  margin-top: 6px; /* 添加顶部间距，与输入控件对齐 */
  line-height: 1.4;
}
```

## 文件修改清单

1. **src/components/Drawer.vue**
   - 修改组件项模板，调整锁定图标位置
   - 添加 `.component-meta` 和 `.lock-icon-inline` 样式
   - 修改 `.property-item.layout-inline` 的 `align-items` 属性
   - 调整 `.property-item.layout-inline label` 的样式

## 预期效果

1. 锁定图标显示在"已启用"标签右侧，视觉上更紧凑
2. 属性面板的行内属性项顶部对齐，不再出现行高错乱

## 相关需求
- 创房选项配置功能
- UI 样式优化
