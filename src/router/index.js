import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../vues/Login/Login.vue';

// 配置路由
const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../vues/hall/hall.vue'),  // 假设登录成功后跳转到 Dashboard 页面
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
