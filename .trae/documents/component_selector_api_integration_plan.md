# ComponentSelector 组件列表 API 集成计划

## 任务概述
将 ComponentSelector.vue 组件的组件列表数据来源从 props 传递改为使用与 Workbench.vue 相同的远程 API 接口获取数据。

## 当前状态分析

### ComponentSelector.vue (当前)
- 通过 props 接收 `components` 数组数据
- 数据由父组件传递，没有独立的数据获取逻辑
- 组件只负责展示和选择逻辑

### Workbench.vue (参考)
- 使用 `loadComponents()` 方法从远程 API 获取组件数据
- API 地址: `import.meta.env.VITE_COMPONENT_DATA_URL` 或默认 `'https://hotupdatedownload2.xq5.com/patch_wg/rupilot_test.json'`
- 使用 `transformRemoteData()` 方法转换远程数据格式
- 组件数据存储在 `components` ref 中

## 实现方案

### 方案选择：提取公共 composable
为了保持代码复用和一致性，建议创建一个公共的 composable 函数来管理组件数据的获取逻辑。

## 具体步骤

### 步骤 1: 创建公共 composable - useComponentData
创建文件: `/src/composables/useComponentData.js`

内容:
1. 提取 Workbench.vue 中的 `loadComponents` 和 `transformRemoteData` 逻辑
2. 提供 `components`, `isLoading`, `loadComponents`, `groupedComponents` 等响应式数据和方法
3. 保持与现有代码兼容的数据格式

### 步骤 2: 更新 ComponentSelector.vue
修改内容:
1. 引入 `useComponentData` composable
2. 移除 `components` prop
3. 在组件挂载时调用 `loadComponents()` 获取数据
4. 使用 composable 提供的 `groupedComponents` 替代原有的计算属性
5. 添加加载状态显示

### 步骤 3: 更新 Workbench.vue
修改内容:
1. 引入 `useComponentData` composable
2. 替换原有的 `loadComponents` 和 `transformRemoteData` 方法
3. 使用 composable 提供的数据和方法

### 步骤 4: 更新父组件 Drawer.vue
检查 Drawer.vue 如何传递组件数据给 ComponentSelector，移除不再需要的 props 传递。

## 数据结构

### 远程 API 数据格式
```json
{
  "elements": [
    {
      "id": "component-id",
      "title": "组件名称",
      "category": "分类名称",
      "isLocked": false,
      "elements": [
        {
          "id": "property-id",
          "title": "属性名称",
          "type": "switch|select|checkbox|...",
          "defaultValue": ...,
          "datas": [...]
        }
      ]
    }
  ]
}
```

### 内部组件数据格式
```javascript
{
  id: string,
  name: string,
  category: string,
  description: string,
  required: boolean,
  locked: boolean,
  enabled: boolean,
  icon: string,
  properties: Array,
  dependencies: Array,
  widthDefine: any,
  heightDefine: any,
  space: any,
  splitLine: any
}
```

## 文件变更清单

1. **新增**: `/src/composables/useComponentData.js` - 公共数据获取逻辑
2. **修改**: `/src/components/ComponentSelector.vue` - 使用 composable 获取数据
3. **修改**: `/src/views/Workbench.vue` - 使用 composable 替代原有逻辑
4. **检查**: `/src/components/Drawer.vue` - 更新 props 传递

## 注意事项

1. **API 错误处理**: 保持与 Workbench 相同的错误提示机制
2. **加载状态**: 添加 loading 状态显示
3. **数据缓存**: 考虑是否需要缓存机制避免重复请求
4. **向后兼容**: 确保修改后其他使用组件的地方不受影响

## 验收标准

1. ComponentSelector 能够独立加载组件列表数据
2. 组件列表数据与 Workbench 一致
3. 搜索、分类展开等功能正常工作
4. 错误处理机制正常工作
5. 代码通过测试验证
