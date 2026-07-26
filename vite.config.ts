import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'

export default defineConfig(({ mode }) => {
  const isElectron = mode === 'electron'
  // 由 VSCode 调试拉起时会设置该环境变量，避免 vite-plugin-electron 再自动启动 Electron，导致出现两个客户端
  const isVSCodeDebug = !!process.env.VSCODE_DEBUG

  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'src/auto-imports.d.ts',
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/components.d.ts',
      }),
      ...(isElectron ? [
        electron([
          {
            entry: 'electron/main.ts',
            onstart(options) {
              // VSCode 调试模式下，不由插件启动 Electron，交给 launch.json
              if (!isVSCodeDebug) {
                options.startup()
              }
            },
            vite: {
              build: {
                outDir: 'dist-electron',
                sourcemap: true,
                minify: false,
                rollupOptions: {
                  external: ['electron']
                }
              }
            }
          },
          {
            entry: 'electron/preload/index.ts',
            onstart(options) {
              options.reload()
            },
            vite: {
              build: {
                outDir: 'dist-electron/preload',
                sourcemap: 'inline',
                minify: false,
                rollupOptions: {
                  external: ['electron']
                }
              }
            }
          }
        ]),
        renderer(),
      ] : []),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    base: './',
    server: {
      port: 5173,
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
  }
})
