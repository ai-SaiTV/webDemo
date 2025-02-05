import { createApp } from 'vue';
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue';
import router from './router';  // 导入路由配置
import './style.css';

// // 创建 Vue 应用并使用路由
// createApp(App)
//   .use(router)  // 使用 Vue Router
//   .mount('#app');  // 挂载到 #app 元素
const app = createApp(App)
const pinia = createPinia()

// 注册 ElementPlus 的图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
