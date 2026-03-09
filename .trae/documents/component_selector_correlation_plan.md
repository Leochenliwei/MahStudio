# 组件选择抽屉与规则按钮相关性表达计划

## 需求分析

当组件选择抽屉展开时，需要标记出对应唤出它的规则按钮是哪一个，根据交互原理，需要有相关性表达。

当前问题：
- 用户点击选项配置抽屉中的"规则"按钮后，组件选择抽屉从右侧滑出
- 但用户无法直观知道是哪个选项的"规则"按钮唤出了这个抽屉
- 缺乏视觉关联性，容易造成认知困惑

## 解决方案

### 方案：视觉连线 + 高亮标记

通过以下方式建立强相关性表达：

1. **规则按钮高亮**：被点击的"规则"按钮保持高亮状态（主题色背景）
2. **选项行高亮**：被点击按钮所在的选项行添加边框或背景高亮
3. **连线效果**：从规则按钮到组件选择抽屉添加视觉引导线
4. **抽屉标题关联**：在组件选择抽屉标题中显示当前关联的选项名称

## 实现步骤

### 步骤1：添加当前编辑选项索引状态

**文件**: `/Users/zonst/Documents/Programs/WEBconfig/src/views/RoomCreatorPage.vue`

- 在 `openComponentSelector` 函数中记录当前选项索引
- 将该索引作为 prop 传递给 Drawer 组件

### 步骤2：Drawer 组件接收并显示关联状态

**文件**: `/Users/zonst/Documents/Programs/WEBconfig/src/components/Drawer.vue`

- 添加 `editingOptionIndex` prop
- 在选项列表中，对被编辑的选项行添加高亮样式
- 对被点击的"规则"按钮添加激活样式
- 在组件选择抽屉标题中显示关联的选项名称

### 步骤3：添加视觉连线效果

**文件**: `/Users/zonst/Documents/Programs/WEBconfig/src/components/Drawer.vue`

- 在选项配置抽屉和组件选择抽屉之间添加连接线
- 使用 CSS 伪元素或绝对定位实现
- 连线从被高亮的规则按钮位置延伸到组件选择抽屉

### 步骤4：关闭时清除状态

**文件**: `/Users/zonst/Documents/Programs/WEBconfig/src/views/RoomCreatorPage.vue`

- 在 `closeComponentSelector` 函数中清除当前编辑选项索引

## 具体修改内容

### RoomCreatorPage.vue 修改

1. 修改 `openComponentSelector` 函数，传递选项索引给 Drawer
2. 添加 `editingOptionIndex` 状态
3. 将该状态作为 prop 传递给 Drawer

### Drawer.vue 修改

1. 添加 `editingOptionIndex` prop
2. 修改选项列表渲染，添加高亮逻辑：
   - 选项行添加 `editing` class
   - 规则按钮添加 `active` class
3. 在组件选择抽屉标题中显示："组件选择 - 选项X"
4. 添加 CSS 样式：
   - `.option-wrapper.editing` - 高亮边框和背景
   - `.rule-tag.active` - 主题色背景
   - 添加视觉引导线样式

## 样式规范

根据 design_rule.md：
- 主题色：#3b82f6
- 高亮背景：rgba(59, 130, 246, 0.1)
- 边框色：#3b82f6
- 过渡动画：0.3s ease

## 预期效果

1. 用户点击"规则"按钮后：
   - 该按钮变为激活状态（主题色背景）
   - 所在选项行添加高亮边框
   - 组件选择抽屉标题显示"组件选择 - 选项X"
   - 抽屉滑出时有视觉引导

2. 用户关闭组件选择抽屉后：
   - 所有高亮状态清除
   - 回到正常选项配置界面
