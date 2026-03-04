/* eslint-disable no-unused-vars */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  // Change '/Accextension/' to match your GitHub repository name
  // If your repo is at github.com/username/Accextension, use '/Accextension/'
  // If it's the main repo (github.com/username/username.github.io), use '/'
  const isExtension = mode === 'extension'
  const isGithub = mode === 'github'

  return {
    plugins: [
      react(),
      {
        name: 'copy-content-script',
        closeBundle() {
          // Copy content script
          const contentScriptSrc = join(__dirname, 'src/pages/extensions/colorsense/content.js')
          const contentScriptDest = join(__dirname, 'dist/content.js')

          // Copy CSS files
          const cssSrcDir = join(__dirname, 'src/pages/extensions/colorsense/styles')
          const cssDestDir = join(__dirname, 'dist/styles')

          try {
            // Copy content script
            if (existsSync(contentScriptSrc)) {
              copyFileSync(contentScriptSrc, contentScriptDest)
              console.log('✓ Copied content.js')
            } else {
              console.warn('⚠ content.js not found, skipping...')
            }

            // Create styles directory
            if (!existsSync(cssDestDir)) {
              mkdirSync(cssDestDir, { recursive: true })
            }

            // Copy CSS files
            const cssFiles = ['protanopia.css', 'tritanopia.css', 'deuteranopia.css', 'achromatopsia.css']
            cssFiles.forEach(file => {
              const src = join(cssSrcDir, file)
              const dest = join(cssDestDir, file)
              if (existsSync(src)) {
                copyFileSync(src, dest)
                console.log(`✓ Copied ${file}`)
              } else {
                console.warn(`⚠ ${file} not found, skipping...`)
              }
            })
          } catch (error) {
            console.warn('⚠ Error copying extension files (non-critical):', error.message)
            // Don't fail the build if extension files are missing
          }
        }
      }
    ],
    base: isExtension ? './' : '/Accextension/',
    build: {
      rollupOptions: {
        input: {
          main: 'index.html',
          popup: 'popup.html'
        }
      }
    }
  }
})
