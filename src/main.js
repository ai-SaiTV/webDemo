import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  // 导入路由配置
import './style.css';

// 创建 Vue 应用并使用路由
createApp(App)
  .use(router)  // 使用 Vue Router
  .mount('#app');  // 挂载到 #app 元素
