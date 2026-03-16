# GroupManager.vue 编辑功能改造计划

## 需求概述
1. SVG图标（编辑图标）点击时，唤起添加分组的弹窗编辑态进行编辑
2. 移除 `span.description-placeholder` 和 `select.columns-select` 两个元素

## 当前代码分析

### 文件结构
- **GroupManager.vue** (`/Users/zonst/Documents/Programs/WEBconfig/src/components/GroupManager.vue`): 分组管理组件
- **AddGroupModal.vue** (`/Users/zonst/Documents/Programs/WEBconfig/src/components/AddGroupModal.vue`): 添加分组弹窗组件
- **RoomCreatorPage.vue**: 父页面，管理弹窗显示状态和数据流

### 当前交互逻辑
1. **编辑分组名称**: 点击 `group-name` 或 `edit-icon` (el-icon Edit) 触发 `$emit('edit-group-name', group)`，使用 `prompt` 简单编辑
2. **添加分组**: 点击"添加分组"按钮触发 `$emit('show-add-group-modal')`，打开 `AddGroupModal` 弹窗
3. **分组说明编辑**: 行内编辑，点击 description-display 区域直接编辑
4. **列数选择**: 使用原生 `select` 元素，触发 `$emit('update:columns', group.id, value)`

### 需要修改的元素

#### 1. SVG 编辑图标 (第25行)
```vue
<el-icon :size="14" class="edit-icon" @click="$emit('edit-group-name', group)"><Edit /></el-icon>
```
- 当前: 触发 `edit-group-name` 事件，使用 prompt 简单编辑
- 目标: 触发弹窗编辑，可以编辑分组名称、列数、说明

#### 2. 分组说明占位符 span (第53行)
```vue
<span v-else class="description-placeholder">请点击编辑提示</span>
```
- 当前: 显示占位文本
- 目标: **移除该元素**

#### 3. 列数选择 select (第60-69行)
```vue
<select class="columns-select" :value="group.columns || 4" @change="$emit('update:columns', group.id, parseInt($event.target.value))">
  <option value="1">1列</option>
  <option value="2">2列</option>
  <option value="3">3列</option>
  <option value="4">4列</option>
</select>
```
- 当前: 原生 select 下拉选择列数
- 目标: **移除该元素**

## 改造方案

### 方案一: 复用 AddGroupModal 弹窗（推荐）

将 `AddGroupModal` 改造为支持「创建」和「编辑」两种模式：

#### 1. 修改 AddGroupModal.vue
- 新增 `mode` prop: `'create' | 'edit'`
- 新增 `groupData` prop: 编辑时传入现有分组数据
- 根据 mode 显示不同标题（"添加分组" / "编辑分组"）
- 编辑模式下，表单初始值为传入的 groupData
- confirm 事件携带 mode 信息，父组件区分处理

#### 2. 修改 GroupManager.vue
- 新增事件 `$emit('edit-group', group)` 用于编辑整个分组
- 移除 `span.description-placeholder`
- 移除 `select.columns-select`
- 编辑图标点击触发 `edit-group` 事件

#### 3. 修改 RoomCreatorPage.vue
- 新增 `editingGroup` 状态存储当前编辑的分组
- 新增 `modalMode` 状态区分创建/编辑模式
- 处理 `edit-group` 事件，设置编辑模式并打开弹窗
- 修改 `handleAddGroupConfirm` 支持创建和编辑两种操作

### 方案二: 新建编辑弹窗
创建一个新的 `EditGroupModal` 组件专门用于编辑。但这样会造成代码重复，不推荐。

## 详细实施步骤

### 步骤1: 修改 AddGroupModal.vue

#### 1.1 添加 Props
```javascript
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'create', // 'create' | 'edit'
    validator: (value) => ['create', 'edit'].includes(value)
  },
  groupData: {
    type: Object,
    default: () => null
  }
})
```

#### 1.2 修改表单初始化逻辑
```javascript
watch(() => props.visible, (newVal) => {
  if (newVal) {
    if (props.mode === 'edit' && props.groupData) {
      // 编辑模式：填充现有数据
      formData.value = {
        name: props.groupData.name,
        columns: props.groupData.columns || 4,
        description: props.groupData.description || ''
      }
    } else {
      // 创建模式：重置表单
      formData.value = {
        name: '',
        columns: 4,
        description: ''
      }
    }
  }
})
```

#### 1.3 修改标题和确认按钮
```vue
<h3 class="modal-title">
  <el-icon :size="18"><FolderAdd /></el-icon>
  {{ mode === 'create' ? '添加分组' : '编辑分组' }}
</h3>

<button class="btn btn-primary" :disabled="!isFormValid" @click="handleConfirm">
  <el-icon :size="14"><Check /></el-icon>
  {{ mode === 'create' ? '确认创建' : '确认修改' }}
</button>
```

#### 1.4 修改 confirm 事件
```javascript
function handleConfirm() {
  if (!isFormValid.value) return
  
  emit('confirm', {
    mode: props.mode,
    groupId: props.mode === 'edit' ? props.groupData.id : undefined,
    name: formData.value.name.trim(),
    columns: parseInt(formData.value.columns),
    description: formData.value.description.trim()
  })
  emit('update:visible', false)
}
```

### 步骤2: 修改 GroupManager.vue

#### 2.1 修改编辑图标点击事件
```vue
<el-icon :size="14" class="edit-icon" @click="$emit('edit-group', group)"><Edit /></el-icon>
```

#### 2.2 移除 description-placeholder
删除第53行：
```vue
<!-- 删除以下代码 -->
<span v-else class="description-placeholder">请点击编辑提示</span>
```

#### 2.3 移除 columns-select
删除第60-69行整个 select 元素

#### 2.4 更新 emits 定义
```javascript
const emit = defineEmits([
  'edit-group-name', // 保留兼容性或移除
  'edit-group',      // 新增：编辑整个分组
  'add-component',
  'open-drawer',
  'show-add-group-modal',
  'update:columns',  // 可能不再需要，通过 edit-group 处理
  'update:group-description'
])
```

### 步骤3: 修改 RoomCreatorPage.vue

#### 3.1 添加状态
```javascript
// 添加分组弹窗显示状态
const showAddGroupModal = ref(false)
// 弹窗模式：'create' | 'edit'
const groupModalMode = ref('create')
// 当前编辑的分组
const editingGroupData = ref(null)
```

#### 3.2 修改 GroupManager 事件绑定
```vue
<GroupManager 
  :groups="roomConfig.groups"
  @edit-group="handleEditGroup"           <!-- 修改：新增编辑分组事件 -->
  @add-component="addComponent"
  @open-drawer="openDrawer"
  @show-add-group-modal="openCreateGroupModal"  <!-- 修改：方法名更清晰 -->
  @update:group-description="updateGroupDescription"
/>
```

#### 3.3 添加事件处理方法
```javascript
/**
 * 打开创建分组弹窗
 * 关联需求：分组管理 - 创建新分组
 */
function openCreateGroupModal() {
  groupModalMode.value = 'create'
  editingGroupData.value = null
  showAddGroupModal.value = true
}

/**
 * 处理编辑分组
 * @param {Object} group - 分组对象
 * 关联需求：分组管理 - 编辑分组
 */
function handleEditGroup(group) {
  groupModalMode.value = 'edit'
  editingGroupData.value = group
  showAddGroupModal.value = true
}
```

#### 3.4 修改弹窗组件绑定
```vue
<AddGroupModal
  v-model:visible="showAddGroupModal"
  :mode="groupModalMode"
  :group-data="editingGroupData"
  @confirm="handleGroupModalConfirm"
/>
```

#### 3.5 修改确认处理方法
```javascript
/**
 * 处理分组弹窗确认
 * @param {Object} data - 弹窗返回数据
 * @param {string} data.mode - 'create' | 'edit'
 * @param {string} data.groupId - 编辑时的分组ID
 * @param {string} data.name - 分组名称
 * @param {number} data.columns - 列数
 * @param {string} data.description - 说明
 */
function handleGroupModalConfirm(data) {
  if (data.mode === 'create') {
    // 创建新分组
    const newGroup = {
      id: `group_${Date.now()}`,
      name: data.name,
      columns: data.columns,
      description: data.description,
      components: []
    }
    roomConfig.value.groups.push(newGroup)
    
    ElNotification({
      title: '成功',
      message: `分组 "${data.name}" 创建成功`,
      type: 'success',
      duration: 2000
    })
  } else if (data.mode === 'edit' && data.groupId) {
    // 编辑现有分组
    const group = roomConfig.value.groups.find(g => g.id === data.groupId)
    if (group) {
      group.name = data.name
      group.columns = data.columns
      group.description = data.description
      
      ElNotification({
        title: '成功',
        message: `分组 "${data.name}" 修改成功`,
        type: 'success',
        duration: 2000
      })
    }
  }
}
```

#### 3.6 移除或保留 editGroupName
原有的 `editGroupName` 方法可以移除，或者保留作为快速编辑名称的备选方案。

### 步骤4: 清理无用代码

#### 4.1 GroupManager.vue 中移除的样式
以下样式在移除元素后可以清理（可选）：
- `.description-placeholder`
- `.columns-select`
- `.columns-select:hover`
- `.columns-select:focus`

## 影响范围

### 修改的文件
1. `/Users/zonst/Documents/Programs/WEBconfig/src/components/AddGroupModal.vue` - 支持编辑模式
2. `/Users/zonst/Documents/Programs/WEBconfig/src/components/GroupManager.vue` - 修改编辑触发方式，移除元素
3. `/Users/zonst/Documents/Programs/WEBconfig/src/views/RoomCreatorPage.vue` - 更新事件处理逻辑

### 向后兼容性
- `edit-group-name` 事件可以保留或标记为废弃
- `update:columns` 事件可以保留供其他场景使用，但 GroupManager 内部不再直接触发

## 验证清单

- [ ] 点击编辑图标（Edit SVG）正确打开编辑弹窗
- [ ] 编辑弹窗预填充当前分组数据
- [ ] 修改分组信息后保存成功
- [ ] 创建新分组功能正常
- [ ] span.description-placeholder 已移除
- [ ] select.columns-select 已移除
- [ ] 分组说明编辑功能仍可正常使用（行内编辑）
- [ ] 页面布局正常，无样式问题
