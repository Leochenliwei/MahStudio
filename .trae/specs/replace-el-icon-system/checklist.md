# 替换为 Element Plus Icon 系统检查清单

## 依赖安装检查
- [x] `@element-plus/icons-vue` 已安装到 package.json
- [x] 可以成功导入 Element Plus 图标组件

## 图标映射检查
- [x] 所有 sprite.svg 图标都有对应的 Element Plus 图标映射
- [x] 缺失的图标已找到替代方案或添加自定义图标

## 代码替换检查
- [x] App.vue 中无 `<Icon` 组件引用
- [x] Workbench.vue 中无 `<Icon` 组件引用
- [x] Admin.vue 中无 `<Icon` 组件引用
- [x] GameDirectory.vue 中无 `<Icon` 组件引用
- [x] 所有 Vue 组件中无 `<Icon` 组件引用
- [x] 所有 Vue 组件正确导入 Element Plus 图标

## 文件清理检查
- [x] `src/components/Icon.vue` 已删除
- [x] `src/components/IconTest.vue` 已删除
- [x] `public/icons/sprite.svg` 已删除
- [x] `public/icons/` 目录已清理

## 功能验证
- [x] 开发服务器正常运行
- [x] 浏览器控制台无错误
- [x] 所有页面图标正常显示
- [x] 图标点击/交互功能正常
