# 基础创房面板选项抽屉分离计划

## 需求分析

当前 Drawer.vue 中混合了两种不同类型的抽屉：
1. **基础创房面板选项抽屉**：人数设置、局数设置、底分设置（L6-102）
2. **自定义组件配置抽屉**：选项配置抽屉（L104-433）

这两种抽屉功能和交互方式不同，应该分离：
- 基础创房面板选项：简单的模板选择，单选模式
- 自定义组件配置：复杂的选项编辑，包含增删改查和级联抽屉

## 解决方案

### 方案：创建独立的 BasicParamsDrawer 组件

将人数、局数、底分三个基础创房面板选项抽屉抽离为独立组件，保持原有功能和样式。

## 实现步骤

### 步骤1：创建 BasicParamsDrawer.vue 组件

**文件**: `/Users/zonst/Documents/Programs/WEBconfig/src/components/BasicParamsDrawer.vue`

包含内容：
- 人数设置抽屉（drawer-people）
- 局数设置抽屉（drawer-rounds）
- 底分设置抽屉（drawer-base-score）
- 相关的 props 和 events
- 相关的样式

### 步骤2：修改 Drawer.vue

**文件**: `/Users/zonst/Documents/Programs/WEBconfig/src/components/Drawer.vue`

- 移除基础创房面板相关的三个抽屉代码（L6-102）
- 移除相关的 props（playerCountTemplates, selectedPlayerCountTemplate 等）
- 移除相关的事件 emits
- 保留选项配置抽屉（drawer-props）和组件选择器

### 步骤3：修改 RoomCreatorPage.vue

**文件**: `/Users/zonst/Documents/Programs/WEBconfig/src/views/RoomCreatorPage.vue`

- 导入 BasicParamsDrawer 组件
- 将基础创房面板相关的 props 和 events 传递给 BasicParamsDrawer
- 保留 Drawer 组件用于选项配置

## 具体修改内容

### BasicParamsDrawer.vue 结构

```vue
<template>
  <div v-if="isBasicDrawerActive" class="drawer-container">
    <div class="overlay" @click="$emit('close')"></div>
    
    <!-- 人数设置抽屉 -->
    <div class="drawer" :class="{ active: activeDrawer === 'drawer-people' }">
      <!-- 原有内容 -->
    </div>
    
    <!-- 局数设置抽屉 -->
    <div class="drawer" :class="{ active: activeDrawer === 'drawer-rounds' }">
      <!-- 原有内容 -->
    </div>
    
    <!-- 底分设置抽屉 -->
    <div class="drawer" :class="{ active: activeDrawer === 'drawer-base-score' }">
      <!-- 原有内容 -->
    </div>
  </div>
</template>
```

### Drawer.vue 修改

移除：
- L6-102：三个基础创房面板抽屉的 template 代码
- playerCountTemplates, selectedPlayerCountTemplate 等 props
- select-player-count-template, save-player-count-config 等 events
- 相关的样式（option-select-item, mode-tabs 等）

保留：
- 选项配置抽屉（drawer-props）
- 组件选择器（drawer-component-selector）

### RoomCreatorPage.vue 修改

```vue
<template>
  <!-- 基础创房面板抽屉 -->
  <BasicParamsDrawer
    :active-drawer="activeDrawer"
    :player-count-templates="playerCountTemplates"
    :selected-player-count-template="selectedPlayerCountTemplate"
    :round-count-templates="roundCountTemplates"
    :selected-round-count-template="selectedRoundCountTemplate"
    :base-score-templates="baseScoreTemplates"
    :selected-base-score-template="selectedBaseScoreTemplate"
    :round-mode="roomConfig.basic.roundCount.mode"
    @close="closeAllDrawers"
    @select-player-count-template="selectPlayerCountTemplate"
    @save-player-count-config="savePlayerCountConfig"
    @switch-round-mode="switchRoundMode"
    @select-round-count-template="selectRoundCountTemplate"
    @save-round-count-config="saveRoundCountConfig"
    @select-base-score-template="selectBaseScoreTemplate"
    @save-base-score-config="saveBaseScoreConfig"
  />
  
  <!-- 选项配置抽屉 -->
  <Drawer
    :active-drawer="activeDrawer"
    :editing-component="editingComponent"
    :show-component-selector="showComponentSelector"
    :components="components"
    :editing-option-index="selectedOptionIndex"
    @close-all-drawers="closeAllDrawers"
    @add-option="addOption"
    @remove-option="removeOption"
    @save-component-config="saveComponentConfig"
    @open-component-selector="openComponentSelector"
    @close-component-selector="closeComponentSelector"
    @confirm-component-selection="confirmComponentSelection"
    @toggle-component-status="toggleComponentStatus"
    @update-component-property="updateComponentProperty"
  />
</template>
```

## 预期效果

1. 代码结构更清晰，职责分离
2. 基础创房面板选项和自定义组件配置互不干扰
3. 便于后续维护和扩展
4. 保持原有功能和交互不变
