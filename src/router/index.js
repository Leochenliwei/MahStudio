import { createRouter, createWebHistory } from 'vue-router'
import Admin from '../views/Admin.vue'
import Workbench from '../views/Workbench.vue'
import RoomCreatorPage from '../views/RoomCreatorPage.vue'
import GameDirectory from '../views/GameDirectory.vue'
import SimpleDependencyPage from '../views/SimpleDependencyPage.vue'

// Admin 子页面
import GameManagement from '../views/admin/GameManagement.vue'
import ApkManagement from '../views/admin/ApkManagement.vue'
import UserManagement from '../views/admin/UserManagement.vue'
import SystemSettings from '../views/admin/SystemSettings.vue'
import OperationLogs from '../views/admin/OperationLogs.vue'
import DataStatistics from '../views/admin/DataStatistics.vue'

/**
 * 路由配置
 * 需求关联: 路由导航功能
 * 说明: 配置应用的所有路由路径、组件和参数
 */
const routes = [
  {
    path: '/',
    name: 'Admin',
    component: Admin
  },
  {
    // 游戏管理路由 - 支持test/online环境
    // query参数:
    //   - env: 环境 (test/online)
    path: '/admin/game-management',
    name: 'GameManagement',
    component: GameManagement
  },
  {
    // APK管理路由
    path: '/admin/apk-management',
    name: 'ApkManagement',
    component: ApkManagement
  },
  {
    // 用户管理路由
    path: '/admin/user-management',
    name: 'UserManagement',
    component: UserManagement
  },
  {
    // 系统设置路由
    path: '/admin/system-settings',
    name: 'SystemSettings',
    component: SystemSettings
  },
  {
    // 操作日志路由
    path: '/admin/operation-logs',
    name: 'OperationLogs',
    component: OperationLogs
  },
  {
    // 数据统计路由
    path: '/admin/data-statistics',
    name: 'DataStatistics',
    component: DataStatistics
  },
  {
    // 工作台路由 - 支持从草稿/测试文件进入
    // query参数:
    //   - fileId: 文件ID
    //   - fileType: 文件类型 (draft/testMatch/testGold)
    //   - env: 环境 (test/online)
    path: '/workbench/:id',
    name: 'Workbench',
    component: Workbench,
    props: true
  },
  {
    path: '/room-creator/:id',
    name: 'RoomCreator',
    component: RoomCreatorPage,
    props: true
  },
  {
    // 游戏目录路由 - 展示游戏文件目录结构
    // params参数:
    //   - gameId: 游戏ID
    // query参数:
    //   - env: 环境 (test/online)
    path: '/game-directory/:gameId',
    name: 'GameDirectory',
    component: GameDirectory,
    props: true
  },
  {
    // 简版联动规则管理页面
    // params参数:
    //   - id: 游戏ID
    path: '/workbench/:id/simple-dependency',
    name: 'SimpleDependency',
    component: SimpleDependencyPage,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory('/MahStudio/'),
  routes
})

export default router
