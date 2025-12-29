# GitHub Pages Deployment Guide

## Option 1: Automatic Deployment (Recommended)

1. **Update the base path in `vite.config.js`**:
   - If your repo is `github.com/username/Easeo`, keep `/Easeo/`
   - If your repo is `github.com/username/username.github.io`, change to `/`

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Setup GitHub Pages"
   git push origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repo → Settings → Pages
   - Source: Select "GitHub Actions"
   - The workflow will automatically deploy when you push to main/master

## Option 2: Manual Deployment

1. **Install gh-pages** (if not already installed):
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update base path** in `vite.config.js` (same as Option 1)

3. **Build and deploy**:
   ```bash
   npm run build
   npm run deploy
   ```

4. **Enable GitHub Pages**:
   - Go to your repo → Settings → Pages
   - Source: Select "gh-pages" branch
   - Save

## Troubleshooting

**Problem**: Only seeing empty HTML with `<div id="root"></div>`

**Solutions**:
1. Check that the base path in `vite.config.js` matches your repo name
2. Make sure you ran `npm run build` before deploying
3. Check browser console for 404 errors on JS/CSS files
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

**To find your correct base path**:
- If repo URL is: `github.com/username/Easeo` → use `/Easeo/`
- If repo URL is: `github.com/username/username.github.io` → use `/`

