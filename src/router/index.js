import { createRouter, createWebHistory } from 'vue-router'
import Admin from '../views/Admin.vue'
import Workbench from '../views/Workbench.vue'
import RoomCreatorPage from '../views/RoomCreatorPage.vue'
import GameDirectory from '../views/GameDirectory.vue'

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
    path: '/workbench/:id/room-creator',
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
  }
]

const router = createRouter({
  history: createWebHistory('/MahStudio/'),
  routes
})

export default router
