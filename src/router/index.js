import { createRouter, createWebHistory } from 'vue-router'
import Admin from '../views/Admin.vue'
import Workbench from '../views/Workbench.vue'
import RoomCreatorPage from '../views/RoomCreatorPage.vue'

const routes = [
  {
    path: '/',
    name: 'Admin',
    component: Admin
  },
  {
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
  }
]

const router = createRouter({
  history: createWebHistory('/MahStudio/'),
  routes
})

export default router
