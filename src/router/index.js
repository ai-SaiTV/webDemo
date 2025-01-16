import { createRouter, createWebHistory } from 'vue-router';

// 配置路由
const routes = [
  {
    path: '/',
    redirect: '/dashboard' // 设置默认重定向路径
  },
  {
    path: '/Login',
    name: 'Login',
    component: () => import('../views/login/login.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/home/home.vue'),  // 假设登录成功后跳转到 Dashboard 页面
  },
  {
    path: '/api_dev',
    name: 'Api_Dev',
    component: () => import('../views/Dev/api_dev.vue'),  // 假设登录成功后跳转到 Dashboard 页面
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
