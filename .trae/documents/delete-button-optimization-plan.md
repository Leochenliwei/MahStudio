# 删除按钮优化计划

## 目标
优化 ExpressionInput 组件中删除按钮的行为：
1. 删除按钮应该删除整个运算元素（游戏元素、运算符、数字）
2. 对常数元素（数字）特殊处理：仅删除末尾数字，而不是整个数字

## 当前状态
- 删除按钮会删除整个单元
- 数字单元也是整体删除

## 改造方案

### 1. 删除逻辑分类

**游戏元素单元**：
- 删除整个元素 `[身份.元素]`

**运算符单元**：
- 删除整个运算符

**数字单元**：
- 如果数字长度 > 1：删除末尾一个数字
- 如果数字长度 = 1：删除整个数字单元

### 2. 实现步骤

#### 步骤1：修改 removeUnit 方法
- 根据单元类型执行不同删除逻辑
- 数字单元特殊处理：修改原始值中的数字，而不是删除整个单元

#### 步骤2：添加 removeLastDigit 方法
- 专门处理数字末尾删除
- 更新表达式中的数字值

#### 步骤3：优化删除按钮显示
- 数字单元hover时显示删除按钮
- 点击删除按钮时根据数字长度决定行为

### 3. 关键代码变更

**removeUnit 方法改造**：
```typescript
const removeUnit = (index: number) => {
  const unit = expressionUnits.value[index]
  if (!unit) return

  if (unit.type === 'number') {
    // 数字特殊处理
    if (unit.value.length > 1) {
      // 删除末尾数字
      removeLastDigit(index)
      return
    }
  }
  
  // 其他单元直接删除
  // ...
}
```

**removeLastDigit 方法**：
```typescript
const removeLastDigit = (index: number) => {
  const unit = expressionUnits.value[index]
  if (!unit || unit.type !== 'number') return
  
  const newValue = unit.value.slice(0, -1)
  // 更新表达式中的数字
  // ...
}
```

## 文件变更
- `/Users/zonst/Documents/Programs/WEBconfig/src/components/editors/ExpressionInput.vue`
  - 修改 `removeUnit` 方法
  - 添加 `removeLastDigit` 方法

## 预期效果
- 游戏元素 `[cur_player.hand_count]`：点击删除 → 整个删除
- 运算符 `+`：点击删除 → 整个删除
- 数字 `123`：
  - 第一次点击删除 → 变为 `12`
  - 第二次点击删除 → 变为 `1`
  - 第三次点击删除 → 整个删除
