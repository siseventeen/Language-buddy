import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync } from 'fs'

function copyExtensionFiles(): Plugin {
  return {
    name: 'copy-extension-files',
    writeBundle() {
      const distDir = resolve(__dirname, 'dist')
      copyFileSync(
        resolve(__dirname, 'manifest.json'),
        resolve(distDir, 'manifest.json'),
      )
      // Copy YouGlish sandbox page
      const sandboxSrc = resolve(__dirname, 'public/youglish-sandbox.html')
      if (existsSync(sandboxSrc)) {
        copyFileSync(sandboxSrc, resolve(distDir, 'youglish-sandbox.html'))
      }

      const iconsDir = resolve(distDir, 'icons')
      if (!existsSync(iconsDir)) {
        mkdirSync(iconsDir, { recursive: true })
      }
      const srcIcons = resolve(__dirname, 'public/icons')
      if (existsSync(srcIcons)) {
        for (const name of ['icon-16.png', 'icon-48.png', 'icon-128.png']) {
          const src = resolve(srcIcons, name)
          if (existsSync(src)) {
            copyFileSync(src, resolve(iconsDir, name))
          }
        }
      }
    },
  }
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), copyExtensionFiles()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, 'sidepanel.html'),
        'service-worker': resolve(__dirname, 'src/background/service-worker.ts'),
        'content-script': resolve(__dirname, 'src/content/content-script.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
