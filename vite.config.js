import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vitestring from 'vite-plugin-string';
export default defineConfig({
  plugins: [
    vue(),
    vitestring({
      include: '**/*.docx',
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
})