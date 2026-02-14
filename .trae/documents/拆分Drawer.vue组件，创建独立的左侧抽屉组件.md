# 拆分Drawer.vue组件，创建独立的左侧抽屉组件

## 1. 分析当前结构

当前的 `Drawer.vue` 组件包含多个抽屉：
- 左侧抽屉：人数设置、局数设置、底分设置
- 右侧抽屉：元件属性配置、组件选择器

组件选择器目前是右侧抽屉（`drawer right`），需要将其剥离出来，做成独立的左侧抽屉组件。

## 2. 实现计划

### 2.1 创建新组件文件
- 创建 `src/components/ComponentSelectorDrawer.vue` 文件
- 专门用于组件选择的左侧抽屉

### 2.2 迁移相关代码

**模板部分**：
- 迁移组件选择器的模板代码
- 修改为左侧抽屉布局（移除 `right` 类）
- 保持左右分栏布局结构

**脚本部分**：
- 迁移组件选择器相关的 props
- 迁移响应式数据（searchKeyword, expandedCategories, selectedComponents）
- 迁移计算属性（groupedComponents）
- 迁移方法（toggleCategory, toggleComponentSelection, getComponentProperties, updateComponentProperty, toggleComponentStatus, confirmComponentSelection）

**样式部分**：
- 迁移组件选择器相关的样式
- 保持左右分栏布局样式
- 保持属性编辑样式

### 2.3 更新原组件

**修改 Drawer.vue**：
- 移除组件选择器的模板代码
- 移除组件选择器相关的脚本代码
- 移除组件选择器相关的样式代码

### 2.4 集成新组件

**在需要的地方集成**：
- 在 `RoomCreatorPage.vue` 中引入新组件
- 确保正确传递 props 和事件处理

## 3. 技术要点

### 3.1 组件通信
- 使用 props 传递组件数据和状态
- 使用 emit 传递事件
- 确保与原有系统的兼容性

### 3.2 样式一致性
- 保持与原有系统一致的设计风格
- 确保左右分栏布局正常显示
- 保持响应式设计

### 3.3 功能完整性
- 确保组件选择功能完整
- 确保属性编辑功能完整
- 确保状态管理功能完整

## 4. 预期效果

- 组件选择器从右侧抽屉变为独立的左侧抽屉
- 保持原有的所有功能
- 代码结构更清晰，维护性更好
- 与原有系统无缝集成

## 5. 风险评估

- **风险**：组件通信可能出现问题
  **缓解**：仔细检查 props 和事件传递

- **风险**：样式可能出现不一致
  **缓解**：保持样式代码的完整性

- **风险**：功能可能出现缺失
  **缓解**：仔细迁移所有相关代码

## 6. 实施步骤

1. 创建 `ComponentSelectorDrawer.vue` 文件
2. 迁移组件选择器相关代码
3. 更新 `Drawer.vue` 组件
4. 集成新组件到需要的地方
5. 测试功能是否正常
6. 优化代码结构和性能