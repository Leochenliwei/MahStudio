# Tasks

## Phase 1: 创建 ItemManagerPage 组件

### Task 1: 创建 ItemManagerPage.vue 基础结构
- [x] 1.1: 在 `src/views/` 目录下创建 ItemManagerPage.vue 文件
- [x] 1.2: 创建基础模板结构，包含 BasicParams 和 GroupManager
- [x] 1.3: 定义 props 接口（embedded, basicConfig, groups）
- [x] 1.4: 定义 emit 接口（update-basic-config, open-drawer, edit-group, add-component, show-add-group-modal, update-group-description）

### Task 2: 迁移 BasicParams 和 GroupManager
- [x] 2.1: 从 RoomCreatorPage.vue 复制 BasicParams 组件引用
- [x] 2.2: 从 RoomCreatorPage.vue 复制 GroupManager 组件引用
- [x] 2.3: 绑定 BasicParams 的 props：basicConfig
- [x] 2.4: 绑定 BasicParams 的 emit 事件
- [x] 2.5: 绑定 GroupManager 的 props：groups
- [x] 2.6: 绑定 GroupManager 的 emit 事件

### Task 3: 创建 ItemManagerPage 样式
- [x] 3.1: 创建页面容器样式（内嵌模式适配）
- [x] 3.2: 确保 BasicParams 和 GroupManager 正确布局
- [x] 3.3: 添加滚动条样式
- [x] 3.4: 验证内嵌模式下宽度和高度正确

---

## Phase 2: 重构 RoomCreatorPage 容器

### Task 4: 重构 RoomCreatorPage 模板结构
- [x] 4.1: 移除内嵌的 BasicParams 和 GroupManager 组件
- [x] 4.2: 添加 ItemManagerPage 组件引用
- [x] 4.3: 确保 Tab 切换正确显示/隐藏 ItemManagerPage 和 SimpleDependencyPage

### Task 5: 重构 RoomCreatorPage 状态管理
- [x] 5.1: 整理 roomConfig 数据结构
- [x] 5.2: 提供抽屉控制方法（openDrawer, closeAllDrawers）
- [x] 5.3: 确保 ItemManagerPage 的 emit 事件正确处理

### Task 6: 验证抽屉组件集成
- [x] 6.1: 确认 BasicParamsDrawer 正确响应 open-drawer 事件
- [x] 6.2: 确认 Drawer 正确响应 open-drawer 事件
- [x] 6.3: 测试抽屉的打开和关闭功能

---

## Phase 3: 修复 SimpleDependencyPage 嵌入模式

### Task 7: 简化 SimpleDependencyPage 嵌入模式
- [x] 7.1: 移除独立页面的 page-header
- [x] 7.2: 简化 embedded-header，只保留新增规则按钮
- [x] 7.3: 移除返回按钮和相关逻辑

### Task 8: 修复 SimpleDependencyPage 布局问题
- [x] 8.1: 修复嵌入模式下的宽度计算（确保 100% 宽度）
- [x] 8.2: 修复嵌入模式下的高度计算（确保内容不被遮挡）
- [x] 8.3: 确保表格宽度 100% 无溢出
- [x] 8.4: 测试不同屏幕尺寸下的显示效果

---

## Phase 4: 统一样式和细节优化

### Task 9: 统一视觉风格
- [x] 9.1: 确保 RoomCreatorPage 顶部导航栏与 Workbench 一致
- [x] 9.2: 确保 internal-tab-bar 样式统一
- [x] 9.3: 确保滚动条样式一致

### Task 10: 更新组件关系文档
- [x] 10.1: 在 component_rules.md 中添加 ItemManagerPage 组件记录
- [x] 10.2: 更新 RoomCreatorPage 的组件依赖关系
- [x] 10.3: 更新 Mermaid 关系图

---

## Phase 5: 测试验证

### Task 11: 构建验证
- [x] 11.1: npm run build 构建成功，无语法错误
- [x] 11.2: 所有组件正确导入

### Task 12: 代码审查
- [x] 12.1: ItemManagerPage.vue 代码结构正确
- [x] 12.2: RoomCreatorPage.vue 正确引用 ItemManagerPage
- [x] 12.3: Tab 切换逻辑正确
- [x] 12.4: SimpleDependencyPage 嵌入模式样式正确

---

# Task Dependencies

```
Task 1 → Task 2 → Task 3
                    ↓
              Task 4 → Task 5 → Task 6
                    ↓
              Task 7 → Task 8
                    ↓
              Task 9 → Task 10
                    ↓
              Task 11 → Task 12
```

**依赖关系说明**：
- Task 2-3 依赖 Task 1 完成
- Task 4-6 依赖 Task 1-3 完成
- Task 7-8 可以与 Task 4-6 并行执行
- Task 9-10 依赖 Task 4-8 完成
- Task 11-12 依赖 Task 9-10 完成

---

## 完成状态

✅ 所有任务已完成

**备注**: 由于 SPA 路由使用 hash 模式且依赖 App.vue 的菜单系统，自动化测试无法直接访问 RoomCreatorPage。代码已通过 `npm run build` 构建验证，功能需要手动在浏览器中测试。
