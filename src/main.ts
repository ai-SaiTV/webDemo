import { createApp } from '@vue/runtime-dom'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './router'
import './style.css'
import App from './App.vue'

console.log('开始初始化 Vue 应用')
const app = createApp(App)
const pinia = createPinia()

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.errorHandler = (err) => {
  console.error('[Vue Error]', err) // 🚨 捕获渲染错误
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')