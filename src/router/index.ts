import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/home/Home.vue'
import Portal from '../views/Portal.vue'
import Dashboard from '../views/design/dashboard/Dashboard.vue'
import Analysis from '../views/design/Analysis.vue'
import CourseManagement from '../views/design/CourseManagement.vue'
import AppLayout from '../components/AppLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home
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
        }
      ]
    }
  ]
})

export default router