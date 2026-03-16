# 替换为 Element Plus Icon 系统任务列表

## 任务1：安装 Element Plus 图标库
- [x] 安装 `@element-plus/icons-vue` 依赖
  ```bash
  npm install @element-plus/icons-vue
  ```

## 任务2：创建图标名称映射表
- [x] 分析 sprite.svg 中所有图标名称
- [x] 创建 sprite.svg 到 Element Plus 图标的映射表
  | sprite.svg 名称 | Element Plus 图标名称 |
  |----------------|----------------------|
  | grid | Grid |
  | box | Box |
  | arrow-undo | ArrowLeft (或类似) |
  | ... | ... |

## 任务3：全局替换图标引用
- [x] 替换 App.vue 中的 Icon 组件
- [x] 替换 Workbench.vue 中的 Icon 组件
- [x] 替换 Admin.vue 中的 Icon 组件
- [x] 替换 GameDirectory.vue 中的 Icon 组件
- [x] 替换 Sidebar.vue 中的 Icon 组件
- [x] 替换 SubmitHistoryModal.vue 中的 Icon 组件
- [x] 替换其他所有组件中的 Icon 组件

## 任务4：删除旧图标系统文件
- [x] 删除 `src/components/Icon.vue`
- [x] 删除 `src/components/IconTest.vue`（如果存在）
- [x] 删除 `public/icons/sprite.svg`
- [x] 删除 `public/icons/` 目录（如果为空）

## 任务5：验证和测试
- [x] 运行开发服务器
- [x] 验证所有页面图标正常显示
- [x] 检查浏览器控制台是否有错误
- [x] 验证所有图标交互功能正常
