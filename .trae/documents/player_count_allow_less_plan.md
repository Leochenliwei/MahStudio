# 人数属性选择优化计划

## 需求分析

需要在人数设置抽屉中增加"是否允许少人开局"的开关，此开关将影响：
1. 抽屉中保存后，创房面板配置中的"少人开局"勾选项是否显示
2. 基础配置数据结构需要支持 allowLess 字段

当前状态：
- BasicParams.vue 中已经有一个"少人开局"复选框（L24-31）
- 但 BasicParamsDrawer.vue 中没有对应的配置开关
- roomConfig.basic.playerCount 已有 allowLess 字段

## 解决方案

### 方案：在人数设置抽屉中添加开关

在 BasicParamsDrawer.vue 的人数设置抽屉中增加一个切换开关，用于控制是否显示"少人开局"选项。

## 实现步骤

### 步骤1：修改 BasicParamsDrawer.vue

**文件**: `/Users/zonst/Documents/Programs/WEBconfig/src/components/BasicParamsDrawer.vue`

1. 添加 allowLess prop
2. 在人数设置抽屉中添加切换开关
3. 添加切换事件 emit

### 步骤2：修改 RoomCreatorPage.vue

**文件**: `/Users/zonst/Documents/Programs/WEBconfig/src/views/RoomCreatorPage.vue`

1. 将 allowLess 传递给 BasicParamsDrawer
2. 处理 toggle-allow-less 事件，更新 roomConfig

### 步骤3：修改 BasicParams.vue（可选优化）

**文件**: `/Users/zonst/Documents/Programs/WEBconfig/src/components/BasicParams.vue`

根据 allowLess 的值，动态显示/隐藏"少人开局"复选框

## 具体修改内容

### BasicParamsDrawer.vue 修改

1. 添加 props：
```javascript
allowLess: {
  type: Boolean,
  default: false
}
```

2. 在人数设置抽屉 body 中添加切换开关：
```vue
<div class="allow-less-section">
  <label class="toggle-label">
    <span>允许少人开局</span>
    <label class="toggle-switch">
      <input 
        type="checkbox" 
        :checked="allowLess"
        @change="$emit('toggle-allow-less', $event.target.checked)"
      >
      <span class="toggle-slider"></span>
    </label>
  </label>
  <p class="help-text">开启后，创房面板将显示"少人开局"选项</p>
</div>
```

3. 添加事件 emit：
```javascript
'toggle-allow-less'
```

4. 添加样式：
```css
.allow-less-section {
  margin-top: var(--spacing-6);
  padding: var(--spacing-4);
  background: var(--color-surface);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
}

.toggle-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.help-text {
  margin: var(--spacing-2) 0 0 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

/* 切换开关样式 */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-border);
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle-switch input:checked + .toggle-slider {
  background-color: var(--color-primary);
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(20px);
}
```

### RoomCreatorPage.vue 修改

1. 传递 allowLess 给 BasicParamsDrawer：
```vue
<BasicParamsDrawer
  :active-drawer="activeDrawer"
  :player-count-templates="playerCountTemplates"
  :selected-player-count-template="selectedPlayerCountTemplate"
  :allow-less="roomConfig.basic.playerCount.allowLess"
  ...
  @toggle-allow-less="toggleAllowLess"
/>
```

2. 添加 toggleAllowLess 方法：
```javascript
function toggleAllowLess(value) {
  roomConfig.value.basic.playerCount.allowLess = value
}
```

### BasicParams.vue 修改（可选）

根据 allowLess 动态显示/隐藏"少人开局"复选框：
```vue
<label v-if="basicConfig.playerCount.allowLess" class="checkbox-option">
  <input 
    type="checkbox" 
    v-model="basicConfig.playerCount.allowLess"
    @change="$emit('update-basic-config')"
  > 
  <span class="option-text">少人开局</span>
</label>
```

## 预期效果

1. 打开人数设置抽屉后，可以看到"允许少人开局"切换开关
2. 开启开关后，创房面板显示"少人开局"复选框
3. 关闭开关后，创房面板隐藏"少人开局"复选框
4. 配置保存到 roomConfig.basic.playerCount.allowLess
