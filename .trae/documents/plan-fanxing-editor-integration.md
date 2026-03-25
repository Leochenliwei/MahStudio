# 番型编辑器集成计划

## 目标
将 `/Users/zonst/Documents/Programs/WEBconfig/资料/src/views/game-settings/components/ConfigurationModel.vue` 番型配置编辑器移植到项目中，当按钮的 editorType 为 `fanxing` 时打开该编辑器。

## 分析

### 参考组件分析
ConfigurationModel.vue 是一个复杂的番型选择器，具有以下特点：
- 三级分类选择（场景 -> 分类 -> 番型）
- 左侧双列导航（场景列表 + 分类列表）
- 右侧四栏展示（基础番型、增加番型、组合番型、特殊番型）
- 搜索功能
- "只展示已勾选" 筛选
- 长按查看番型详情
- 右侧抽屉展示番型说明和示例牌型

### 数据说明
将 `/Users/zonst/Documents/Programs/WEBconfig/资料/番型数据.json` 迁移到前端项目 `src/assets/mock/fanxing-data.json`，包含：
- `fan_config_list`: 番型配置列表，按场景和分类组织
  - 场景：牌型(scene=3)
  - 分类：所有牌型、鸡胡牌型、七对牌型、十三烂牌型、十三幺、组合牌型、特殊牌型
- `fan_ids`: 已选中的番型ID列表（当前为空数组）
- 每个番型包含：id, name, fan_code, description, example_cards, is_chosen 等字段

## 实施步骤

### 步骤 1: 迁移数据文件
- 创建 `src/assets/mock/` 目录
- 将番型数据.json 复制为 `src/assets/mock/fanxing-data.json`

### 步骤 2: 创建 FanXingDialog.vue 组件
- 复制 ConfigurationModel.vue 的核心逻辑
- 从 `src/assets/mock/fanxing-data.json` 导入 mock 数据
- 适配 EditorDialogContainer 的接口（visible, initData, confirm/close 事件）
- 简化或移除麻将牌图片展示（使用占位符或牌面值）
- 移除 localStorage 提示功能（可选）

### 步骤 3: 更新 EditorDialogContainer.vue
- 导入 FanXingDialog 组件
- 在 dialogState 中添加 fanxing 状态
- 在 openEditor 方法中添加 fanxing 分支
- 更新 EditorType 类型定义

### 步骤 4: 更新 Workbench.vue
- 在 handleButtonClick 方法中添加 fanxing 分支处理
- 传递适当的 initData 和回调函数

### 步骤 5: 测试验证
- 启动开发服务器
- 验证番型编辑器弹窗正常打开
- 验证分类切换、搜索、勾选功能正常
- 验证确认后数据正确同步

## 文件变更清单

### 新增文件
1. `src/assets/mock/fanxing-data.json` - 番型数据（从资料目录迁移）
2. `src/components/editors/FanXingDialog.vue` - 番型编辑器组件

### 修改文件
1. `src/components/editors/EditorDialogContainer.vue` - 添加 fanxing 支持
2. `src/views/Workbench.vue` - 添加 fanxing 按钮处理

## 注意事项
1. 番型编辑器宽度为 1200px，比其他编辑器更宽
2. 需要处理长按事件来显示番型详情
3. 需要支持搜索和筛选功能
4. 选中状态使用 Set 存储，需要注意类型转换
5. 真实数据中的 example_cards 是数字数组，需要映射为牌面显示
