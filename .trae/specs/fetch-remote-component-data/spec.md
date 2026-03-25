# 从公网获取组件列表数据源 Spec

## Why
当前 `Workbench.vue` 的组件列表数据来自本地 `/MahStudio/components_list.json` 文件，需要改为从公网 URL `https://hotupdatedownload2.xq5.com/patch_wg/rupilot_test.json` 动态获取。这样可以实现：
1. 组件配置的实时更新，无需重新部署前端
2. 服务端统一管控组件配置
3. 支持更复杂的组件属性联动关系

## What Changes
- **新增** 环境变量 `VITE_COMPONENT_DATA_URL` 配置远程数据源 URL
- **修改** `Workbench.vue` 中的 `loadComponents()` 函数，从环境变量配置的 URL 获取数据
- **新增** 数据转换逻辑，将远程 JSON 格式转换为组件列表格式
- **新增** 属性联动关系解析，提取 `visibleWhen` 等联动规则
- **新增** 加载状态处理和错误处理

## Impact
- Affected specs: 组件列表展示、属性面板渲染、组件联动逻辑
- Affected code: `src/views/Workbench.vue`

## ADDED Requirements

### Requirement: 环境变量配置
The system SHALL 使用环境变量配置远程数据源 URL

#### Scenario: 环境变量设置
- **GIVEN** 项目使用 Vite 构建工具
- **THEN** 在 `.env` 文件中添加 `VITE_COMPONENT_DATA_URL` 变量
- **AND** 默认值为 `https://hotupdatedownload2.xq5.com/patch_wg/rupilot_test.json`

```bash
# .env 文件
VITE_COMPONENT_DATA_URL=https://hotupdatedownload2.xq5.com/patch_wg/rupilot_test.json
```

#### Scenario: 代码中获取环境变量
- **THEN** 在代码中使用 `import.meta.env.VITE_COMPONENT_DATA_URL` 获取配置值
- **AND** 提供默认值作为回退

```javascript
const COMPONENT_DATA_URL = import.meta.env.VITE_COMPONENT_DATA_URL || 
  'https://hotupdatedownload2.xq5.com/patch_wg/rupilot_test.json'
```

### Requirement: 远程数据获取
The system SHALL 从环境变量配置的 URL 获取组件配置数据

#### Scenario: 成功获取数据
- **WHEN** 页面加载时
- **THEN** 从环境变量读取 URL
- **AND** 发送 HTTP GET 请求获取远程 JSON 数据
- **AND** 解析并转换为组件列表格式

#### Scenario: 获取失败处理
- **WHEN** 远程数据获取失败
- **THEN** 显示错误提示
- **AND** 使用空数组作为回退

### Requirement: 数据格式转换
The system SHALL 将远程 JSON 格式转换为内部组件列表格式

#### Scenario: 组件列表转换
- **GIVEN** 远程 JSON 数据结构如下：
```json
{
  "id": "root",
  "type": "root_container",
  "elements": [
    {
      "id": "iezZIQ",
      "title": "牌库",
      "type": "tab_container",
      "category": "基   础",
      "isLocked": true,
      "elements": [
        {
          "id": "CSwT01",
          "type": "component_switch",
          "title": "是否启用",
          "defaultValue": true
        }
      ]
    }
  ]
}
```
- **THEN** 转换为组件对象：
  - `id` → 组件唯一标识
  - `title` → 组件名称 (`name`)
  - `category` → 组件分类
  - `isLocked` → 锁定状态 (`locked`)
  - `elements` → 属性列表 (`properties`)

#### Scenario: 属性列表转换
- **GIVEN** 属性元素数据结构
- **THEN** 转换属性对象：
  - `id` → 属性唯一标识
  - `title` → 属性名称 (`name`)
  - `type` → 属性类型 (component_switch/switch/toggle/select/checkbox/button)
  - `defaultValue` → 默认值
  - `datas` → 选项列表 (用于 toggle/select/checkbox)
  - `visibleWhen` → 联动条件表达式
  - `extend` → 扩展配置 (如 editorType)
  - `titleWidth`/`itemWidth` → 布局配置

### Requirement: 联动关系解析
The system SHALL 解析并存储属性之间的联动关系

#### Scenario: 可见性联动
- **GIVEN** 属性包含 `visibleWhen` 字段，如 `"{{6t8Ula}} == 1"`
- **THEN** 解析为联动规则：
  - 依赖的属性 ID: `6t8Ula`
  - 条件表达式: `== 1`
  - 当前属性的显示/隐藏状态由依赖属性值决定

#### Scenario: 联动规则存储
- **THEN** 联动关系应存储在组件对象中，便于属性面板动态渲染

### Requirement: 属性面板联动渲染
The system SHALL 根据联动规则动态显示/隐藏属性

#### Scenario: 条件满足时显示
- **GIVEN** 属性 A 的 visibleWhen 依赖属性 B 的值
- **WHEN** 属性 B 的值满足条件
- **THEN** 属性 A 在属性面板中显示

#### Scenario: 条件不满足时隐藏
- **GIVEN** 属性 A 的 visibleWhen 依赖属性 B 的值
- **WHEN** 属性 B 的值不满足条件
- **THEN** 属性 A 在属性面板中隐藏

## MODIFIED Requirements

### Requirement: 组件加载函数
**原实现**: 从 `/MahStudio/components_list.json` 本地文件加载
**新实现**: 从环境变量配置的 URL 远程加载

```javascript
// 原代码
const response = await fetch('/MahStudio/components_list.json')

// 新代码
const COMPONENT_DATA_URL = import.meta.env.VITE_COMPONENT_DATA_URL || 
  'https://hotupdatedownload2.xq5.com/patch_wg/rupilot_test.json'
const response = await fetch(COMPONENT_DATA_URL)
```

### Requirement: 组件数据结构
**原数据结构**:
```javascript
{
  id: string,
  name: string,
  category: string,
  description: string,
  required: boolean,
  properties: Array<{
    id: string,
    name: string,
    type: string,
    defaultValue: any,
    datas?: Array<{label, value}>,
    extend?: {editorType}
  }>
}
```

**新数据结构**:
```javascript
{
  id: string,
  name: string,           // 来自 title
  category: string,
  description: string,    // 使用 category 作为描述
  required: boolean,      // 来自 isLocked
  locked: boolean,        // 来自 isLocked
  enabled: boolean,       // component_switch 的 defaultValue
  properties: Array<{
    id: string,
    name: string,         // 来自 title
    type: string,
    defaultValue: any,
    datas?: Array<{label, value}>,
    extend?: object,
    visibleWhen?: string, // 联动条件
    titleWidth?: string,
    itemWidth?: string
  }>,
  dependencies: Array<{   // 解析的联动关系
    propertyId: string,
    dependsOn: string,
    condition: string
  }>
}
```

## Data Mapping Reference

### 远程数据 → 内部数据结构映射表

| 远程字段 | 内部字段 | 说明 |
|---------|---------|------|
| `elements[].id` | `id` | 组件ID |
| `elements[].title` | `name` | 组件名称 |
| `elements[].category` | `category` | 组件分类 |
| `elements[].isLocked` | `locked`/`required` | 是否锁定/强制启用 |
| `elements[].elements` | `properties` | 属性列表 |
| `elements[].elements[].id` | `properties[].id` | 属性ID |
| `elements[].elements[].title` | `properties[].name` | 属性名称 |
| `elements[].elements[].type` | `properties[].type` | 属性类型 |
| `elements[].elements[].defaultValue` | `properties[].defaultValue` | 默认值 |
| `elements[].elements[].datas` | `properties[].datas` | 选项数据 |
| `elements[].elements[].visibleWhen` | `properties[].visibleWhen` | 可见条件 |
| `elements[].elements[].extend` | `properties[].extend` | 扩展配置 |
| `elements[].elements[].titleWidth` | `properties[].titleWidth` | 标题宽度 |
| `elements[].elements[].itemWidth` | `properties[].itemWidth` | 控件宽度 |

### 属性类型映射

| 远程 type | 内部 type | 说明 |
|-----------|----------|------|
| `component_switch` | `component_switch` | 组件启用开关 |
| `switch` | `switch` | 布尔开关 |
| `toggle` | `toggle` | 单选按钮组 |
| `select` | `select` | 下拉选择 |
| `checkbox` | `checkbox` | 复选框组 |
| `button` | `button` | 按钮 |

### 分类顺序

按照游戏流程顺序排序：
1. `基   础`
2. `发牌前`
3. `发牌后`
4. `行   牌`
5. `胡   牌`
6. `算   分`

## visibleWhen 表达式解析

表达式格式: `"{{propertyId}} operator value"`

示例:
- `"{{6t8Ula}} == 1"` → 当 ID 为 6t8Ula 的属性值等于 1 时显示
- `"{{EtTtMA}} == true"` → 当 ID 为 EtTtMA 的属性值为 true 时显示

解析规则:
1. 提取 `{{}}` 中的属性 ID 作为依赖
2. 提取运算符 (`==`, `!=`, `>`, `<`, `>=`, `<=`)
3. 提取比较值
4. 运行时根据依赖属性值计算条件
