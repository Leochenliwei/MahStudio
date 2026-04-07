# 元素切换功能实施计划

## 需求描述
当点击表达式中的元素时，只弹出元素选择列表（隐藏虚拟键盘），点击任意元素可以切换当前元素。

## 实施步骤

### Step 1: 添加状态管理
- 添加 `isElementSwitchingMode` ref，标记是否处于元素切换模式
- 添加 `editingUnitIndex` ref，记录正在编辑的单元索引

### Step 2: 修改表达式单元点击事件
- 修改 `selectUnit` 方法
- 点击单元时：
  - 设置 `isElementSwitchingMode = true`
  - 设置 `editingUnitIndex = index`
  - 打开 dropdown
  - 隐藏虚拟键盘

### Step 3: 修改 Dropdown 布局
- 使用 `v-if` 或 `v-show` 控制虚拟键盘显示
- 当 `isElementSwitchingMode` 为 true 时，隐藏虚拟键盘
- 元素选择面板宽度自适应（占满整个 dropdown）

### Step 4: 修改元素选择逻辑
- 修改 `insertElement` 方法
- 当处于元素切换模式时：
  - 替换当前单元的元素，而不是追加
  - 保持 dropdown 打开，方便连续切换
  - 更新表达式值

### Step 5: 添加退出切换模式
- 点击 dropdown 外部或按 Esc 时退出切换模式
- 重置 `isElementSwitchingMode` 和 `editingUnitIndex`

### Step 6: 样式调整
- 元素切换模式下，元素选择面板占满整个 dropdown 宽度
- 添加切换模式的视觉提示（如标题显示"切换元素"）

## 文件变更
- `/Users/zonst/Documents/Programs/WEBconfig/src/components/editors/ExpressionInput.vue`

## 关键代码变更点

### 1. 添加状态
```typescript
const isElementSwitchingMode = ref(false)
const editingUnitIndex = ref(-1)
```

### 2. 修改 selectUnit 方法
```typescript
const selectUnit = (index: number, event?: MouseEvent) => {
  selectedUnitIndex.value = index
  isElementSwitchingMode.value = true
  editingUnitIndex.value = index
  openDropdown()
}
```

### 3. 修改 Dropdown 模板
```vue
<!-- 虚拟键盘 - 非元素切换模式显示 -->
<div v-if="!isElementSwitchingMode" class="virtual-keyboard">
  ...
</div>

<!-- 元素选择面板 - 元素切换模式时占满宽度 -->
<div class="element-panel" :class="{ 'is-full-width': isElementSwitchingMode }">
  ...
</div>
```

### 4. 修改 insertElement 方法
```typescript
const insertElement = (element: GameElement) => {
  if (isElementSwitchingMode.value && editingUnitIndex.value >= 0) {
    // 替换当前元素
    replaceUnitElement(editingUnitIndex.value, element)
  } else {
    // 追加新元素
    appendElement(element)
  }
}
```

### 5. 添加替换元素方法
```typescript
const replaceUnitElement = (index: number, newElement: GameElement) => {
  const units = expressionUnits.value
  if (index >= 0 && index < units.length) {
    const oldUnit = units[index]
    const newUnitStr = `[${oldUnit.identity}.${newElement.key}]`
    // 替换表达式中的对应部分
    ...
  }
}
```

## 验收标准
- [ ] 点击表达式中的元素，dropdown 只显示元素选择面板（无键盘）
- [ ] 点击元素列表中的任意元素，当前元素被替换
- [ ] 元素切换后表达式值正确更新
- [ ] 点击外部或按 Esc 退出切换模式
- [ ] 正常输入模式下（点击输入框），键盘和元素面板都显示
