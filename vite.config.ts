import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 部署时由发布平台注入 PORT 环境变量；本地未设置则回退 3000（与发布平台探测端口一致）
const envPort = (globalThis as any).process?.env?.PORT
const previewPort = envPort ? Number(envPort) : 3000

export default defineConfig({
  plugins: [react()],
  build: {
    // 每次构建清理旧产物，避免历史版本的演示数据残留在 dist。
    emptyOutDir: true,
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
  },
  preview: {
    host: true,
    port: previewPort,
    allowedHosts: true,
  },
})
