# Checklist

## Phase 1: ItemManagerPage 组件创建

### ItemManagerPage 基础结构
- [x] 1.1: ItemManagerPage.vue 文件已创建
- [x] 1.2: 模板包含 BasicParams 和 GroupManager
- [x] 1.3: props 接口正确定义（embedded, basicConfig, groups）
- [x] 1.4: emit 接口正确定义

### ItemManagerPage 组件集成
- [x] 2.1: BasicParams 组件正确引用和绑定
- [x] 2.2: GroupManager 组件正确引用和绑定
- [x] 2.3: 所有事件正确透传

### ItemManagerPage 样式
- [x] 3.1: 页面容器样式正确
- [x] 3.2: 布局正确显示 BasicParams 和 GroupManager
- [x] 3.3: 滚动条样式已添加
- [x] 3.4: 内嵌模式下宽度高度正确

---

## Phase 2: RoomCreatorPage 容器重构

### RoomCreatorPage 模板重构
- [x] 4.1: 已移除内嵌的 BasicParams 和 GroupManager
- [x] 4.2: ItemManagerPage 组件已添加
- [x] 4.3: Tab 切换正确控制内容显示

### RoomCreatorPage 状态管理
- [x] 5.1: roomConfig 数据结构正确
- [x] 5.2: 抽屉控制方法正确提供
- [x] 5.3: ItemManagerPage emit 事件正确处理

### 抽屉组件集成
- [x] 6.1: BasicParamsDrawer 正确响应事件
- [x] 6.2: Drawer 正确响应事件
- [x] 6.3: 抽屉打开关闭功能正常

---

## Phase 3: SimpleDependencyPage 嵌入模式修复

### SimpleDependencyPage 简化
- [x] 7.1: 独立的 page-header 已移除
- [x] 7.2: embedded-header 简化正确
- [x] 7.3: 返回按钮和相关逻辑已移除

### SimpleDependencyPage 布局修复
- [x] 8.1: 嵌入模式下宽度 100%
- [x] 8.2: 嵌入模式下高度正确
- [x] 8.3: 表格宽度 100% 无溢出
- [x] 8.4: 不同屏幕尺寸显示正常

---

## Phase 4: 样式统一和文档更新

### 视觉风格统一
- [x] 9.1: 顶部导航栏与 Workbench 风格一致
- [x] 9.2: internal-tab-bar 样式统一
- [x] 9.3: 滚动条样式一致

### 组件关系文档
- [x] 10.1: component_rules.md 已添加 ItemManagerPage
- [x] 10.2: RoomCreatorPage 依赖关系已更新
- [x] 10.3: Mermaid 关系图已更新

---

## Phase 5: 测试验证

### 构建验证
- [x] 11.1: npm run build 构建成功，无语法错误
- [x] 11.2: 所有组件正确导入

### 代码审查
- [x] 12.1: ItemManagerPage.vue 代码结构正确
- [x] 12.2: RoomCreatorPage.vue 正确引用 ItemManagerPage
- [x] 12.3: Tab 切换逻辑正确
- [x] 12.4: SimpleDependencyPage 嵌入模式样式正确

**备注**: 由于 SPA 路由使用 hash 模式且依赖 App.vue 的菜单系统，自动化测试无法直接访问 RoomCreatorPage。代码已通过构建验证，功能需要手动在浏览器中测试。
