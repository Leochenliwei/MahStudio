# 添加分组弹窗功能实现计划

## 需求概述
在 GroupManager.vue 中点击"添加分组"按钮时，打开一个独立的 Vue 弹窗表单，包含：
- 分组名称输入框
- 列数选择（1-4列）
- 说明文本输入框
- 提交后创建分组

## 实现步骤

### 1. 创建 AddGroupModal.vue 组件
**文件路径**: `/Users/zonst/Documents/Programs/WEBconfig/src/components/AddGroupModal.vue`

**组件结构**:
- 使用 Teleport 将弹窗渲染到 body
- 使用 Transition 实现动画效果
- 参考 CopyToModal.vue 的弹窗样式和结构
- 表单字段：
  - 分组名称（必填，文本输入）
  - 列数（必填，下拉选择 1-4）
  - 说明（可选，文本域）

**Props**:
- `visible: Boolean` - 控制弹窗显示/隐藏

**Events**:
- `update:visible` - 更新显示状态
- `confirm` - 确认提交，携带表单数据 `{ name: string, columns: number, description: string }`
- `close` - 关闭弹窗

### 2. 修改 GroupManager.vue
**修改内容**:
- 移除现有的 `$emit('add-group')` 直接触发方式
- 改为打开弹窗的方式
- 添加 `showAddGroupModal` 状态控制
- 处理弹窗提交事件，创建新分组

### 3. 修改 RoomCreatorPage.vue
**修改内容**:
- 注册 AddGroupModal 组件
- 添加 `showAddGroupModal` 响应式数据
- 修改 `addGroup` 方法，接收表单参数创建分组
- 绑定弹窗的 visible 和 confirm 事件

## 设计规范
遵循 `.trae/rules/design_rule.md` 中的规范：
- 使用主题色 #3b82f6
- 圆角矩形按钮和输入框
- 0.3s ease 过渡动画
- 表单间距使用 var(--spacing-3)、var(--spacing-4)

## 文件变更清单
1. 新建: `/Users/zonst/Documents/Programs/WEBconfig/src/components/AddGroupModal.vue`
2. 修改: `/Users/zonst/Documents/Programs/WEBconfig/src/components/GroupManager.vue`
3. 修改: `/Users/zonst/Documents/Programs/WEBconfig/src/views/RoomCreatorPage.vue`

## 测试计划
使用 webapp-testing skill 进行测试：
1. 点击"添加分组"按钮，弹窗正常显示
2. 表单验证：名称为空时提交按钮禁用
3. 填写表单数据，点击确认，分组正确创建
4. 点击取消或遮罩层，弹窗关闭不创建分组
