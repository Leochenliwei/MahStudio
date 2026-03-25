/**
 * 菜单配置文件
 * 
 * 定义后台管理系统的菜单结构，每个菜单项可以独立打开为虚拟标签页
 * 
 * @author Frontend Architect
 * @since 2026-03-19
 */

/**
 * 菜单项类型枚举
 */
export const MenuType = {
  /** 游戏管理 - 测试环境 */
  GAME_MANAGEMENT_TEST: 'game-management-test',
  /** 游戏管理 - 线上环境 */
  GAME_MANAGEMENT_ONLINE: 'game-management-online',
  /** APK管理 */
  APK_MANAGEMENT: 'apk-management',
  /** 用户管理 */
  USER_MANAGEMENT: 'user-management',
  /** 系统设置 */
  SYSTEM_SETTINGS: 'system-settings',
  /** 操作日志 */
  OPERATION_LOGS: 'operation-logs',
  /** 数据统计 */
  DATA_STATISTICS: 'data-statistics',
}

/**
 * 菜单配置列表
 * 每个菜单项定义了图标、名称、路由路径等属性
 */
export const menuConfig = [
  {
    id: MenuType.GAME_MANAGEMENT_TEST,
    name: '游戏管理-test',
    icon: 'Grid',
    path: '/admin/game-management',
    query: { env: 'test' },
    description: '测试环境游戏配置管理',
    category: 'main',
    order: 1
  },
  {
    id: MenuType.GAME_MANAGEMENT_ONLINE,
    name: '游戏管理-online',
    icon: 'Grid',
    path: '/admin/game-management',
    query: { env: 'online' },
    description: '线上环境游戏配置管理',
    category: 'main',
    order: 2
  },
  {
    id: MenuType.APK_MANAGEMENT,
    name: 'APK管理',
    icon: 'Box',
    path: '/admin/apk-management',
    description: 'APK包管理和版本控制',
    category: 'main',
    order: 3
  },
  {
    id: MenuType.USER_MANAGEMENT,
    name: '用户管理',
    icon: 'User',
    path: '/admin/user-management',
    description: '系统用户和权限管理',
    category: 'system',
    order: 4
  },
  {
    id: MenuType.SYSTEM_SETTINGS,
    name: '系统设置',
    icon: 'Setting',
    path: '/admin/system-settings',
    description: '系统参数和全局配置',
    category: 'system',
    order: 5
  },
  {
    id: MenuType.OPERATION_LOGS,
    name: '操作日志',
    icon: 'Document',
    path: '/admin/operation-logs',
    description: '用户操作记录审计',
    category: 'system',
    order: 6
  },
  {
    id: MenuType.DATA_STATISTICS,
    name: '数据统计',
    icon: 'TrendCharts',
    path: '/admin/data-statistics',
    description: '业务数据统计分析',
    category: 'system',
    order: 7
  }
]

/**
 * 根据菜单ID获取菜单配置
 * @param {string} menuId - 菜单ID
 * @returns {Object|null} 菜单配置对象
 */
export function getMenuConfigById(menuId) {
  return menuConfig.find(menu => menu.id === menuId) || null
}

/**
 * 根据分类获取菜单列表
 * @param {string} category - 菜单分类
 * @returns {Array} 菜单配置数组
 */
export function getMenusByCategory(category) {
  return menuConfig.filter(menu => menu.category === category)
}

/**
 * 获取所有主菜单
 * @returns {Array} 主菜单配置数组
 */
export function getMainMenus() {
  return menuConfig.filter(menu => menu.category === 'main')
}

/**
 * 获取所有系统菜单
 * @returns {Array} 系统菜单配置数组
 */
export function getSystemMenus() {
  return menuConfig.filter(menu => menu.category === 'system')
}

/**
 * 生成菜单标签页的唯一ID
 * @param {string} menuId - 菜单ID
 * @param {Object} query - 查询参数
 * @returns {string} 唯一标签页ID
 */
export function generateMenuTabId(menuId, query = {}) {
  const queryStr = Object.keys(query).length > 0 
    ? '-' + Object.entries(query).map(([k, v]) => `${k}-${v}`).join('-')
    : ''
  return `menu-${menuId}${queryStr}-${Date.now()}`
}

/**
 * 构建菜单路由路径
 * @param {Object} menuConfig - 菜单配置
 * @returns {string} 完整路由路径
 */
export function buildMenuPath(menuConfig) {
  let path = menuConfig.path
  if (menuConfig.query && Object.keys(menuConfig.query).length > 0) {
    const queryParams = new URLSearchParams(menuConfig.query)
    path += `?${queryParams.toString()}`
  }
  return path
}
