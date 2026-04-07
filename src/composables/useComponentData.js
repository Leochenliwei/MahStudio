import { ref, computed } from 'vue'
import { ElNotification } from 'element-plus'

/**
 * 组件数据管理 Composable
 * 用于从远程 API 获取和管理组件列表数据
 *
 * @author WEBconfig Team
 * @date 2026-03-19
 */

/**
 * 获取 JWT Token
 * 优先从环境变量获取，其次从 localStorage 获取，最后使用默认值
 * @returns {string} JWT Token
 */
function getJwtToken() {
  // 优先从环境变量获取 token
  const envToken = import.meta.env.VITE_JWT_TOKEN
  if (envToken) {
    return envToken
  }

  // 尝试从 localStorage 获取 token
  const storedToken = localStorage.getItem('xq5_jwt_token')
  if (storedToken) {
    return storedToken
  }

  // 默认 token
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMDE4NywidXNlcl9uYW1lIjoi6ZmI5p2O54KcIiwiZ3JvdXBfaWQiOjIsImlzX3N1cGVydXNlciI6ZmFsc2UsImlzX2V4dGVybmFsIjpmYWxzZSwiZXhwIjoxNzc1MjgyNjMzfQ.9e8QIeewyyVyZBa3xbN70ZfByGnebV3tgLZIfK700fA'
}

/**
 * 解析 visibleWhen 表达式
 * @param {string} expression - 表达式，如 "{{6t8Ula}} == 1"
 * @returns {object|null} - 解析结果 {dependsOn, operator, value}
 */
function parseVisibleWhen(expression) {
  if (!expression) return null

  // 匹配 {{propertyId}} operator value 格式
  const match = expression.match(/\{\{([^}]+)\}\}\s*(==|!=|>|<|>=|<=)\s*(.+)/)
  if (!match) return null

  const [, dependsOn, operator, valueStr] = match

  // 尝试解析值
  let value = valueStr.trim()
  if (value === 'true') value = true
  else if (value === 'false') value = false
  else if (!isNaN(value) && value !== '') value = Number(value)

  return { dependsOn, operator, value }
}

/**
 * 将远程 JSON 数据转换为内部组件列表格式
 * @param {object} remoteData - 远程 JSON 数据
 * @returns {Array} - 组件列表
 */
function transformRemoteData(remoteData) {
  if (!remoteData || !remoteData.elements || !Array.isArray(remoteData.elements)) {
    console.error('无效的远程数据格式')
    return []
  }

  return remoteData.elements.map(element => {
    // 转换属性列表
    const properties = (element.elements || []).map(prop => ({
      id: prop.id,
      name: prop.title,
      type: prop.type,
      defaultValue: prop.defaultValue,
      datas: prop.datas,
      visibleWhen: prop.visibleWhen,
      extend: prop.extend,
      titleWidth: prop.titleWidth,
      itemWidth: prop.itemWidth,
      description: prop.description,
      multiSelect: prop.multiSelect
    }))

    // 查找 component_switch 类型的属性来获取启用状态
    const componentSwitchProp = properties.find(p => p.type === 'component_switch')
    const enabled = componentSwitchProp ? componentSwitchProp.defaultValue : false

    // 解析联动关系
    const dependencies = properties
      .map(prop => {
        const parsed = parseVisibleWhen(prop.visibleWhen)
        if (parsed) {
          return {
            propertyId: prop.id,
            ...parsed
          }
        }
        return null
      })
      .filter(Boolean)

    return {
      id: element.id,
      name: element.title,
      category: element.category,
      description: element.category,
      required: element.isLocked || false,
      locked: element.isLocked || false,
      enabled: enabled,
      icon: '📦',
      properties: properties,
      dependencies: dependencies,
      widthDefine: element.widthDefine,
      heightDefine: element.heightDefine,
      space: element.space,
      splitLine: element.splitLine
    }
  })
}

/**
 * 组件数据管理
 * @returns {object} - 组件数据和相关方法
 */
export function useComponentData() {
  // 组件列表数据
  const components = ref([])
  // 加载状态
  const isLoading = ref(false)
  // 搜索关键词
  const searchKeyword = ref('')

  /**
   * 加载组件列表数据
   * 从环境变量配置的 URL 获取远程 JSON 数据
   * @returns {Promise<Array>} - 组件列表
   */
  async function loadComponents() {
    console.log('开始加载组件列表...')
    isLoading.value = true

    try {
      // 使用代理路径，避免 CORS 问题
      const COMPONENT_DATA_URL = '/MajStudio/api/admin/component/buildjson'

      console.log('尝试从远程获取组件数据:', COMPONENT_DATA_URL)

      // 获取 JWT Token
      const jwtToken = getJwtToken()

      const response = await fetch(COMPONENT_DATA_URL, {
        headers: {
          'x-xq5-jwt': jwtToken,
          'Content-Type': 'application/json'
        }
      })

      // 检查响应状态
      console.log('响应状态:', response.status)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // 检查响应类型
      const contentType = response.headers.get('content-type')
      console.log('响应类型:', contentType)
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        throw new Error(`Invalid content type: ${contentType}. Response: ${text.substring(0, 100)}...`)
      }

      const remoteData = await response.json()
      console.log('获取到远程数据:', remoteData)

      // 检查业务状态码
      if (remoteData.errno !== 0) {
        throw new Error(remoteData.errmsg || '接口返回错误')
      }

      // 解析 data.json 字段（它是 JSON 字符串需要解析）
      let jsonData = remoteData.data
      if (typeof jsonData === 'string') {
        jsonData = JSON.parse(jsonData)
      }
      // 如果 data.json 是嵌套的
      if (jsonData && jsonData.json) {
        if (typeof jsonData.json === 'string') {
          jsonData = JSON.parse(jsonData.json)
        } else {
          jsonData = jsonData.json
        }
      }

      console.log('解析后的 JSON 数据:', jsonData)
      console.log('获取到远程数据，开始转换...')

      // 转换远程数据为内部格式
      components.value = transformRemoteData(jsonData)

      console.log('组件列表加载完成:', components.value.length, '个组件')

      return components.value
    } catch (error) {
      console.error('加载组件列表失败:', error)
      ElNotification({
        title: '错误',
        message: '加载组件列表失败: ' + error.message,
        type: 'error',
        duration: 5000
      })
      components.value = []
      return []
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 过滤后的组件列表
   */
  const filteredComponents = computed(() => {
    return components.value.filter(component => {
      // 搜索过滤
      const matchesSearch = !searchKeyword.value ||
        component.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
        component.description.toLowerCase().includes(searchKeyword.value.toLowerCase())

      return matchesSearch
    })
  })

  /**
   * 按分类分组的组件
   */
  const groupedComponents = computed(() => {
    const filtered = filteredComponents.value
    const grouped = {}

    // 按分类分组
    filtered.forEach(component => {
      if (!grouped[component.category]) {
        grouped[component.category] = []
      }
      grouped[component.category].push(component)
    })

    return grouped
  })

  /**
   * 获取组件属性
   * @param {string} componentId - 组件ID
   * @returns {array} 组件属性列表
   */
  function getComponentProperties(componentId) {
    const component = components.value.find(c => c.id === componentId)
    return component ? component.properties || [] : []
  }

  /**
   * 根据ID获取组件
   * @param {string} componentId - 组件ID
   * @returns {object|null} 组件对象
   */
  function getComponentById(componentId) {
    return components.value.find(c => c.id === componentId) || null
  }

  return {
    // 状态
    components,
    isLoading,
    searchKeyword,
    // 计算属性
    filteredComponents,
    groupedComponents,
    // 方法
    loadComponents,
    getComponentProperties,
    getComponentById
  }
}
