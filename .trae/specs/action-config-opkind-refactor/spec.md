# ActionConfig 联动配置 opKind 重构规格说明

## 背景

当前 ActionConfig.vue 组件在配置联动规则时，所有目标类型（显示组、元件、选项）都显示相同的三个属性配置（可见性、交互性、选中性）。但实际上不同目标类型应该支持不同的操作类型和 opKind 值。

## 需求规格

### 目标类型与可操作属性映射

| 目标类型 | 标识 | 可配置属性 | 说明 |
|---------|------|-----------|------|
| 显示组 | `group` | 仅可见性 | 控制整个组的显示/隐藏 |
| 元件 | `comp` | 可见性、交互性、选中性 | 交互性和选中性仅对 `select_switch` 类型元件可用 |
| 选项 | `item` | 可见性、交互性、选中性 | 控制具体选项的状态 |

### opKind 值映射规则

#### 1. 显示组 (group)
- 可见性: `opKind: show` / `opKind: hide`

#### 2. 元件 (comp)
- 可见性: `opKind: show` / `opKind: hide`
- 交互性: `opKind: enable` / `opKind: disable` (仅 select_switch 类型)
- 选中性: `opKind: select` / `opKind: unSelect` (仅 select_switch 类型)

#### 3. 选项 (item)
- 可见性: `opKind: showItem` / `opKind: hideItem`
- 交互性: `opKind: enableItem` / `opKind: disableItem`
- 选中性: `opKind: selectItem` / `opKind: unSelectItem`

## 数据结构变更

### 当前数据结构
```javascript
{
  level: 'group' | 'comp' | 'item',
  id: string,
  name: string,
  targetVal?: string,  // 仅 item 类型
  parentName?: string, // 仅 item 类型
  props: {
    visible: { enabled: boolean, when: 'show'|'hide', else: 'hide'|'show' },
    disabled: { enabled: boolean, when: 'lock'|'unlock', else: 'unlock'|'lock' },
    selected: { enabled: boolean, when: 'true'|'false', else: 'false'|'true' }
  }
}
```

### 目标数据结构
```javascript
{
  level: 'group' | 'comp' | 'item',
  id: string,
  name: string,
  targetVal?: string,
  parentName?: string,
  props: {
    visible: { enabled: boolean, when: string, else: string },
    disabled: { enabled: boolean, when: string, else: string },  // comp/item 可用
    selected: { enabled: boolean, when: string, else: string }   // comp/item 可用
  },
  // 生成的动作配置
  actions: [{
    targetType: 'container' | 'element' | 'data',
    targetKey: string,
    opKind: string
  }]
}
```

## 界面变更

### 显示组 (group)
- 仅显示"可见性"配置行
- 选项值: 显示(show) / 隐藏(hide)

### 元件 (comp)
- 显示"可见性"配置行（所有元件类型）
- 显示"交互性"配置行（仅当元件类型为 select_switch 时）
- 显示"选中性"配置行（仅当元件类型为 select_switch 时）
- 需要传入 componentType 来判断元件类型

### 选项 (item)
- 显示全部三个属性配置行
- 可见性选项: 显示(showItem) / 隐藏(hideItem)
- 交互性选项: 启用(enableItem) / 禁用(disableItem)
- 选中性选项: 选中(selectItem) / 取消选中(unSelectItem)

## 接口变更

### Props 新增
```typescript
{
  // 新增：元件类型映射表，用于判断元件是否为 select_switch 类型
  componentTypes?: Map<string, string> // componentId -> componentType
}
```

### 数据转换方法
需要新增方法将 props 配置转换为 actions 数组：
```typescript
function convertPropsToActions(action: ActionConfig): Action[]
```

## 验收标准

1. 选择"显示组"时，仅显示可见性配置
2. 选择"元件"时：
   - 所有元件显示可见性配置
   - select_switch 类型元件额外显示交互性和选中性配置
3. 选择"选项"时，显示全部三个属性配置
4. 生成的 opKind 值符合规格映射表
5. 切换目标类型时，自动重置不支持的属性配置
