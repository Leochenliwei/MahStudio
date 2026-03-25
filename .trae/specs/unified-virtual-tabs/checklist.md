# 统一虚拟标签页系统 - 验收清单

## 代码实现检查

- [x] App.vue 中的 `openGameTab` 方法已修改为创建虚拟标签页而非新开浏览器标签页
- [x] App.vue 中的路由监听逻辑已更新，支持 `/workbench/` 路由创建虚拟标签页
- [x] Workbench 标签页可以正确关闭
- [x] Workbench 标签页可以正确切换
- [x] GameDirectory.vue 中的 `editFile` 方法正常工作
- [x] GameDirectory.vue 中的 `viewFile` 方法正常工作
- [x] 创建草稿后的跳转正常工作

## 功能测试检查

- [x] 从 GameDirectory 点击"编辑"按钮，Workbench 在虚拟标签页中打开
- [x] 从 GameDirectory 点击"查看"按钮，Workbench 在虚拟标签页中打开
- [x] 打开 Workbench 时不新开浏览器标签页
- [x] Workbench 标签页正确显示游戏配置内容
- [x] 新打开的 Workbench 标签页自动成为活跃标签
- [x] 可以同时打开多个 Workbench 标签页
- [x] 多个 Workbench 标签页之间可以正常切换
- [x] 可以关闭 Workbench 标签页
- [x] Admin、GameDirectory、Workbench 三个页面可以同时存在
- [x] 三个页面之间可以正常切换

## 回归测试检查

- [x] Admin 页面的游戏列表正常显示
- [x] 从 Admin 进入 GameDirectory 正常工作
- [x] GameDirectory 的文件列表正常显示
- [x] 创建新草稿功能正常工作
- [x] 复制文件功能正常工作
- [x] 提测功能正常工作
