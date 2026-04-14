import { promises as fs } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

const normalizeBasePath = (value?: string): string => {
  const trimmed = value?.trim()

  if (!trimmed) {
    return '/'
  }

  if (trimmed === './' || trimmed === '../') {
    return trimmed
  }

  if (trimmed.startsWith('./') || trimmed.startsWith('../')) {
    return trimmed.endsWith('/') ? trimmed : `${trimmed}/`
  }

  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`
}

const createSpaFallbackPlugin = (outDir: string): Plugin => ({
  name: 'spa-fallback-artifacts',
  apply: 'build',
  async closeBundle() {
    const indexHtmlPath = path.resolve(outDir, 'index.html')
    const fallbackHtmlPath = path.resolve(outDir, '404.html')

    try {
      await fs.copyFile(indexHtmlPath, fallbackHtmlPath)
    } catch (error) {
      console.error('Failed to create SPA fallback HTML:', error)
    }
  },
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:8080'
  const base = normalizeBasePath(env.VITE_BASE_PATH)
  const outDir = 'dist'

  return {
    base,
    plugins: [react(), createSpaFallbackPlugin(outDir)],
    root: '.',
    publicDir: 'public',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      port: 5173,
      open: true,
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
        }
      }
    },
    build: {
      outDir,
      assetsDir: 'assets',
      sourcemap: false,
    }
  }
})
