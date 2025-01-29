import { createRouter, createWebHistory } from 'vue-router';

// 配置路由
const routes = [
  {
    path: '/',
    name: 'hall',
    component: () => import('../views/hall/hall.vue'),
  },
  {
    path: '/design',
    name: 'design',
    component: () => import('../views/design.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/design/Dashboard.vue'),
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: () => import('../views/design/Analysis.vue'),
  },
  {
    path: '/course',
    name: 'CourseManagement',
    component: () => import('../views/design/CourseManagement.vue'),
  },
  {
    path: '/backend',
    name: 'backend',
    component: () => import('../views/backend/backend.vue'),
  },
  {
    path: '/ppt-generator',
    name: 'ppt-generator',
    component: () => import('../views/ppt-generator/ppt-generator.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;