import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vitestring from 'vite-plugin-string';
import { visualizer } from 'rollup-plugin-visualizer';
export default defineConfig({
  plugins: [
    vue(),
    vitestring({
      include: '**/*.docx',
    }),
    visualizer({
      open: true, // 打包完成后自动打开报告页面
      filename: 'bundle-report.html', // 生成的报告文件名
      gzipSize: true, // 显示 gzip 压缩后的大小
      brotliSize: true, // 显示 brotli 压缩后的大小
    }),
  ],
  assetsInclude: [
    '**/*.docx'
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },

  build: {
    chunkSizeWarningLimit: Infinity,
    rollupOptions: {
      output: {
        manualChunks: {
          lodash: ['lodash'], // 将 lodash 拆分为单独的 chunk
          vue: ['vue', 'vue-router', 'pinia'], // 将 Vue 相关库拆分为单独的 chunk
        },
      },
    },
  },
})