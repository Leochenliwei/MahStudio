# 分组分列数配置功能 Spec

## Why
当前创房面板的分组中，选项组件的展示方式是固定的，无法根据选项数量灵活调整布局。用户需要能够自定义每个分组的分列数（1、2、3、4列），以便更好地组织和展示选项，提升配置面板的可读性和美观性。

## What Changes
- 在分组标题后添加分列数选择器，支持选择 1、2、3、4 列
- 默认分列数为 4 列
- 选项展示根据分列数规则进行网格布局展示
- 分列数配置随分组数据持久化保存

## Impact
- Affected specs: 创房面板分组管理、选项展示布局
- Affected code: 
  - `/Users/zonst/Documents/Programs/WEBconfig/src/components/GroupManager.vue`
  - `/Users/zonst/Documents/Programs/WEBconfig/src/views/RoomCreatorPage.vue`

## ADDED Requirements

### Requirement: 分组分列数配置
分组 SHALL 支持设置分列数，控制组内选项的展示列数。

#### Scenario: 设置分列数
- **WHEN** 用户查看分组标题栏
- **THEN** 分组名称右侧显示分列数选择器
- **AND** 选择器选项为 1列、2列、3列、4列
- **AND** 默认选中 4列

#### Scenario: 选项按列展示
- **WHEN** 分组设置了分列数
- **THEN** 组内所有选项组件按照分列数进行网格布局
- **AND** 每列宽度相等，均匀分布
- **AND** 选项按照从左到右、从上到下的顺序填充

#### Scenario: 分列数持久化
- **WHEN** 用户保存创房配置
- **THEN** 分组的分列数配置随分组数据一起保存
- **AND** 重新加载配置时恢复分列数设置

#### Scenario: 响应式适配
- **WHEN** 屏幕宽度较小（如移动端）
- **THEN** 分列数自动适配，确保选项可读性
- **AND** 最小列宽保证选项内容完整显示

## MODIFIED Requirements

### Requirement: 分组数据结构
分组数据结构 SHALL 包含分列数字段。

**修改前:**
```javascript
{
  id: 'group_1',
  name: '分组1',
  components: []
}
```

**修改后:**
```javascript
{
  id: 'group_1',
  name: '分组1',
  columns: 4,  // 新增：分列数，默认4
  components: []
}
```

### Requirement: 选项组件展示布局
选项组件 SHALL 根据分组的分列数进行网格布局展示。

**修改前:**
- 选项使用 flex 布局，水平排列
- 所有选项在一行展示，超出时换行

**修改后:**
- 选项使用 CSS Grid 布局
- 列数由分组的 columns 属性决定
- 列宽均匀分布，间距一致
