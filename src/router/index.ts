import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/Home.vue'
import Portal from '../views/Portal.vue'
import Dashboard from '../views/design/Dashboard.vue'
import Analysis from '../views/design/Analysis.vue'
import CourseManagement from '../views/design/CourseManagement.vue'
import AppLayout from '../components/AppLayout.vue'
import TeachingMaterials from '../views/design/TeachingMaterials.vue'
import Login from '@/views/login/login.vue'
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path:'/login',
      component: Login
    },
    {
      path: '/portal',
      component: Portal
    },
    {
      path: '/',
      component: AppLayout,
      children: [
        {
          path: 'dashboard',
          component: Dashboard
        },
        {
          path: 'analysis',
          component: Analysis
        },
        {
          path: 'course',
          component: CourseManagement
        },
        {
          path: 'materials',
          component: TeachingMaterials
        }
      ]
    }
  ]
})

export default router