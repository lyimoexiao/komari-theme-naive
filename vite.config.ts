import type { Plugin } from 'vite'
import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'

import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

// 使用 createRequire 支持 CommonJS 模块
const require = createRequire(import.meta.url)
const fs = require('node:fs')
const { ZipArchive } = require('archiver')

/**
 * 获取当前 Git commit hash（短格式）
 */
function getCommitHash(): string {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim()
  }
  catch {
    return 'unknown'
  }
}

/**
 * Vite 插件：构建后打包 Komari 主题 Zip
 *
 * 生成符合 Komari 标准的主题包结构：
 * theme.zip
 * ├── komari-theme.json    # 主题配置文件
 * ├── preview.png          # 主题预览图
 * └── dist/                # 构建输出目录
 *     ├── index.html
 *     └── ...
 */
function komariThemeZip(): Plugin {
  return {
    name: 'komari-theme-zip',
    apply: 'build',
    closeBundle: async () => {
      const commitHash = getCommitHash()
      const zipFileName = `komari-theme-naive-build-${commitHash}.zip`
      const distDir = resolve(__dirname, 'dist')
      const themeJsonPath = resolve(__dirname, 'komari-theme.json')
      const previewPath = resolve(__dirname, 'docs/preview.png')
      const outputPath = resolve(__dirname, zipFileName)

      if (!existsSync(distDir)) {
        console.log('[komari-theme-zip] dist directory not found, skipping zip creation')
        return
      }

      const output = fs.createWriteStream(outputPath)
      const archive = new ZipArchive({ zlib: { level: 9 } })

      return new Promise((resolve, reject) => {
        output.on('close', () => {
          const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2)
          console.log(`[komari-theme-zip] Created ${zipFileName} (${sizeMB} MB)`)
          resolve(undefined)
        })

        archive.on('error', (err: Error) => {
          console.error('[komari-theme-zip] Error:', err)
          reject(err)
        })

        archive.pipe(output)

        if (existsSync(themeJsonPath)) {
          archive.file(themeJsonPath, { name: 'komari-theme.json' })
        }

        if (existsSync(previewPath)) {
          archive.file(previewPath, { name: 'preview.png' })
        }

        archive.directory(distDir, 'dist')

        archive.finalize()
      })
    },
  }
}

// 读取 package.json 获取版本号
const packageJson = require('./package.json')

// https://vite.dev/config/
export default defineConfig({
  // 定义全局常量，在构建时注入
  define: {
    __BUILD_VERSION__: JSON.stringify(packageJson.version),
    __BUILD_GIT_HASH__: JSON.stringify(getCommitHash()),
  },
  plugins: [
    vue(),
    UnoCSS(),
    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar',
          ],
        },
      ],
    }),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
    komariThemeZip(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
  },
  build: {
    // 调整 chunk 大小警告阈值
    chunkSizeWarningLimit: 600,
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (['/node_modules/vue/', '/node_modules/vue-router/', '/node_modules/pinia/'].some(dependency => id.includes(dependency))) {
            return 'vue-vendor'
          }
          if (['/node_modules/echarts/', '/node_modules/vue-echarts/'].some(dependency => id.includes(dependency))) {
            return 'echarts'
          }
          if (id.includes('/node_modules/naive-ui/')) {
            return 'naive-ui'
          }
          if (id.includes('/node_modules/@vueuse/core/')) {
            return 'vueuse'
          }
          return undefined
        },
      },
    },
  },
})
