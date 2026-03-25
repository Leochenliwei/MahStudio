# Checklist - 从公网获取组件列表数据源

## 功能实现检查项

### 环境变量配置
- [x] `.env.example` 文件中添加了 `VITE_COMPONENT_DATA_URL` 变量说明
- [x] `.env` 文件配置了默认 URL `https://hotupdatedownload2.xq5.com/patch_wg/rupilot_test.json`
- [x] 代码中使用 `import.meta.env.VITE_COMPONENT_DATA_URL` 读取配置
- [x] 提供了默认值作为回退

### 远程数据获取
- [x] loadComponents 函数从环境变量读取 URL
- [x] 正确处理 HTTP 响应，验证 content-type 为 application/json
- [x] 网络错误时显示友好的错误提示
- [x] 加载过程中显示加载状态

### 数据格式转换
- [x] 远程数据正确转换为内部组件列表格式
- [x] 字段映射正确：title → name, isLocked → locked/required
- [x] 属性列表完整转换，包含所有字段（id, title, type, defaultValue, datas, visibleWhen, extend 等）
- [x] 组件 enabled 状态从 component_switch 的 defaultValue 获取
- [x] 组件图标使用默认 '📦'

### 联动关系解析
- [x] visibleWhen 表达式正确解析（如 `"{{6t8Ula}} == 1"`）
- [x] 正确提取依赖属性 ID、运算符和比较值
- [x] 联动规则存储在组件对象中

### 属性面板联动渲染
- [x] 属性面板根据 visibleWhen 条件动态显示/隐藏属性
- [x] 依赖属性值变化时，联动属性可见性自动更新
- [x] 联动逻辑支持多种运算符（==, !=, >, <, >=, <=）

### 组件启用逻辑
- [x] isLocked 组件正确显示锁定状态（不可切换）
- [x] 组件启用/禁用功能正常工作
- [x] 强制启用的组件（isLocked=true）自动添加到对应分类

### 分类排序
- [x] 组件按正确顺序分组：基 础 → 发牌前 → 发牌后 → 行 牌 → 胡 牌 → 算 分

## 代码质量检查项

- [x] 函数级注释完整
- [x] 代码遵循项目现有风格
- [x] 错误处理完善

## 测试检查项

- [x] 远程数据加载成功
- [x] 组件列表正确显示（21 个组件，6 个分类）
- [x] 属性面板正确渲染
- [x] 联动关系工作正常（如牌库组件中切换牌堆模式，预设选择/自定义选择正确显示/隐藏）
- [x] 组件启用/禁用功能正常
