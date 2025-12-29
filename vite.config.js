import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-content-script',
      closeBundle() {
        // Copy content script
        const contentScriptSrc = join(__dirname, 'src/pages/Extensions/colorblind/content.js')
        const contentScriptDest = join(__dirname, 'dist/content.js')
        
        // Copy CSS files
        const cssSrcDir = join(__dirname, 'src/pages/Extensions/colorblind/styles')
        const cssDestDir = join(__dirname, 'dist/styles')
        
        try {
          // Copy content script
          if (existsSync(contentScriptSrc)) {
            copyFileSync(contentScriptSrc, contentScriptDest)
            console.log('✓ Copied content.js')
          }
          
          // Create styles directory
          if (!existsSync(cssDestDir)) {
            mkdirSync(cssDestDir, { recursive: true })
          }
          
          // Copy CSS files
          const cssFiles = ['protanopia.css', 'tritanopia.css']
          cssFiles.forEach(file => {
            const src = join(cssSrcDir, file)
            const dest = join(cssDestDir, file)
            if (existsSync(src)) {
              copyFileSync(src, dest)
              console.log(`✓ Copied ${file}`)
            }
          })
        } catch (error) {
          console.error('Error copying files:', error)
        }
      }
    }
  ],
  // Change '/Easeo/' to match your GitHub repository name
  // If your repo is at github.com/username/Easeo, use '/Easeo/'
  // If it's the main repo (github.com/username/username.github.io), use '/'
  base: import.meta.env.PROD ? '/Easeo/' : '/',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        popup: 'popup.html'
      }
    }
  }
})
