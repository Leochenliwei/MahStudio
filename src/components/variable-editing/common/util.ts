// src/components/variable-editing/common/util.ts

/**
 * 变量编辑数据转换工具函数
 * 提供 API 数据格式和组件数据格式之间的转换
 * 
 * @author 迁移自资料目录
 * @date 2026-03-20
 */

/**
 * 将接口返回的数据格式转换为组件可识别的格式
 * @param sourceData - 接口返回的原始数据数组
 * @returns 转换后的格式，用于 AddMultiplyMaxMin 组件的 modelValue
 */
export function convertToGroupItemsFormat(sourceData: any[]) {
  if (!Array.isArray(sourceData) || sourceData.length === 0) {
    return [{ var: '', value: '' }]
  }

  return sourceData.map(item => {
    // 转换 var 字段
    const varConverted = convertSingleItem(item.var)

    // 转换 value 字段
    const valueConverted = convertValueField(item.value)

    return {
      var: varConverted,
      value: valueConverted,
    }
  })
}

/**
 * 转换单个 var 或 value 对象
 * @param item - 单个对象，可能是 var 或 value
 * @returns 转换后的数组格式
 */
function convertSingleItem(item: any) {
  if (!item) return ''

  // 处理事件类型变量 (type 4)
  if (item.type === 4) {
    return item.name || ''
  }
  // 处理其他类型的变量
  else if (item.type) {
    return item.name || ''
  }
  // 默认返回空字符串
  else {
    return ''
  }
}

/**
 * 转换 value 字段
 * @param value - 原始 value 对象
 * @returns 转换后的数组格式
 */
function convertValueField(value: any) {
  if (!value) return ''

  // 处理常量值
  if (value.const_value !== undefined) {
    return String(value.const_value)
  }
  // 处理嵌套变量
  else if (value.var) {
    return convertSingleItem(value.var)
  }
  // 处理数值类型
  else if (value.type === 1) {
    return String(value.value || '0')
  }
  // 默认返回空字符串
  else {
    return ''
  }
}

/**
 * 将组件的数据格式转换回接口所需的格式
 * @param formattedData - 经过组件处理的数据
 * @returns 转换回接口所需格式的数据
 */
export function convertBackToApiFormat(formattedData: any[]) {
  if (!Array.isArray(formattedData) || formattedData.length === 0) {
    return []
  }

  return formattedData.map(item => {
    const varConverted = convertBackVarField(item.var)
    const valueConverted = convertBackValueField(item.value)

    return {
      var: varConverted,
      operator: '', // 如果需要 operator，可以根据实际需求设置
      value: valueConverted,
    }
  })
}

/**
 * 将 var 字段从组件格式转换回接口格式
 * @param varData - 组件格式的 var 数据
 * @returns 接口格式的 var 数据
 */
function convertBackVarField(varData: string) {
  if (!varData) return null

  return {
    type: 1,
    name: varData,
    unique_key: '',
    var_type: 1,
    params: [],
    identifier: 0,
    is_choice: false,
    group_key: '',
  }
}

/**
 * 将 value 字段从组件格式转换回接口格式
 * @param valueData - 组件格式的 value 数据
 * @returns 接口格式的 value 数据
 */
function convertBackValueField(valueData: string) {
  if (!valueData) return null

  // 尝试解析为数字
  const numValue = Number(valueData)
  if (!isNaN(numValue)) {
    return {
      type: 1,
      const_value: numValue,
      var: null,
    }
  } else {
    // 如果是字符串，作为变量处理
    return {
      type: 1,
      const_value: null,
      var: {
        type: 1,
        name: valueData,
        unique_key: '',
        var_type: 1,
        params: [],
        identifier: 0,
        is_choice: false,
        group_key: '',
      },
    }
  }
}

const typeMap: Record<string, number> = {
  operators: 1,
  number: 2,
  function: 3,
  event: 4,
}

const identifierMap: Record<string, number> = {
  c: 1,
  cw: 2,
  cl: 3,
  z: 4,
  ax: 5,
  all: 6,
  o: 7,
}

const identifierMaped: Record<number, string> = {
  1: 'c',
  2: 'cw',
  3: 'cl',
  4: 'z',
  5: 'ax',
  6: 'all',
  7: 'o',
}

const styleMap: Record<string, boolean> = {
  'three-one': true,
  'three-two': true,
  'four-one': true,
  'five-one': true,
  'five-two': true,
}

const styleMaps: Record<number, Record<number, string>> = {
  1: { 1: 'one-one', 2: 'one-two' },
  2: { 1: 'two-one', 2: 'two-two' },
  3: { 1: 'three-one', 2: 'three-two' },
  4: { 1: 'four-one', 2: 'four-two' },
  5: { 1: 'five-one', 2: 'five-two' },
  6: { 1: 'six-one', 2: 'six-two' },
}

/**
 * 将表达式数据转换为提交格式
 * @param data - 表达式数据数组
 * @returns 转换后的提交格式
 */
export function toSubmitExprData(data: any[]) {
  const dataCopy = [...data].filter(item => item.type !== 'insertable-area')
  return {
    node_list: dataCopy.map((item: any) => ({
      type: typeMap[item.type],
      normal_node:
        item.type === 'event'
          ? {
              type: item?.value?.akey?.type,
              name: item?.value?.akey?.name,
              unique_key: item?.value?.akey?.unique_key ? item.value.akey.unique_key.toString() : '',
              var_type: item?.value?.akey?.var_type || 1,
              params: item?.value?.akey?.params || [],
              identifier: styleMap[item?.value?.akey?.styleMap]
                ? identifierMap[item?.value?.bkey?.id] || undefined
                : undefined,
              is_choice: item?.value?.akey?.var_type === 1 ? item?.value?.akey?.is_choice : undefined,
              group_key: item?.value?.akey?.group_key || '',
            }
          : null,
      value: item.type !== 'event' ? item.value : '',
    })),
  }
}

/**
 * 将API返回的expr数据转换为前端渲染格式
 * @param exprData API返回的expr数据
 * @returns 转换后的渲染数据
 */
export function toRenderData(exprData: any) {
  if (!exprData || typeof exprData !== 'object') {
    return []
  }

  // 如果exprData是完整的表达式对象（包含value_type和node_list）
  if (exprData.node_list && Array.isArray(exprData.node_list)) {
    return convertNodeListToRenderFormat(exprData.node_list)
  }

  // 如果exprData直接就是node_list数组
  if (Array.isArray(exprData)) {
    return convertNodeListToRenderFormat(exprData)
  }

  return []
}

/**
 * 将节点列表转换为渲染格式
 * @param nodeList 节点列表
 * @returns 转换后的渲染数据
 */
function convertNodeListToRenderFormat(nodeList: any[]) {
  const result: any[] = []

  nodeList.forEach((node, index) => {
    if (node.normal_node) {
      // 处理normal_node类型的节点
      result.push({
        type: 'event',
        value: {
          akey: {
            type: node.normal_node.type,
            id: node.normal_node.identifier || node.normal_node.id || 0,
            var_type: node.normal_node.var_type,
            name: node.normal_node.name,
            unique_key: node.normal_node.unique_key,
            params: node.normal_node.params || [],
            is_choice: node.normal_node.is_choice || false,
            styleMap: styleMaps[node.normal_node.type]?.[node.normal_node.var_type] || '',
          },
          bkey: {
            type: 7,
            id: identifierMaped[node.normal_node.identifier] || 0, // 这里根据实际需求设置bkey的值
          },
        },
      })
    } else if (node.type === 'number' || typeof node.value === 'number') {
      // 处理数字类型的节点
      result.push({
        type: 'number',
        value: String(node.value),
        insertingNumber: false,
      })
    } else if (node.type === 'operator' || node.type === 'operators') {
      // 处理操作符类型的节点
      result.push({
        type: 'operators',
        value: node.value,
      })
    } else {
      // 处理其他类型的节点
      result.push({
        type: node.type || 'unknown',
        value: node.value || '',
      })
    }

    // 在每个节点后添加插入区域（除了最后一个节点）
    if (index < nodeList.length - 1) {
      result.push({ type: 'insertable-area' })
    }
  })

  return result
}
