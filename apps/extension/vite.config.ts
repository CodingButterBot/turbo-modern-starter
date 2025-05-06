import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

// Extension file copying plugin
function extensionAssetsPlugin(): Plugin {
  return {
    name: 'extension-assets',
    
    // Copy extension files to dist folder after build
    closeBundle() {
      try {
        // Create dist directory if it doesn't exist
        const distDir = path.resolve(__dirname, 'dist');
        if (!fs.existsSync(distDir)) {
          fs.mkdirSync(distDir, { recursive: true });
        }
        
        // Copy manifest.json to dist folder
        const manifestPath = path.resolve(__dirname, 'manifest.json');
        const destManifestPath = path.resolve(distDir, 'manifest.json');
        
        if (fs.existsSync(manifestPath)) {
          fs.copyFileSync(manifestPath, destManifestPath);
          console.log('✅ Copied manifest.json to dist folder');
        } else {
          console.error('❌ manifest.json not found');
        }
        
        // Copy background.js to dist folder if it exists
        const backgroundPath = path.resolve(__dirname, 'background.js');
        const destBackgroundPath = path.resolve(distDir, 'background.js');
        
        if (fs.existsSync(backgroundPath)) {
          fs.copyFileSync(backgroundPath, destBackgroundPath);
          console.log('✅ Copied background.js to dist folder');
        }

        // Create a public directory in dist if it doesn't exist
        const distPublicDir = path.resolve(distDir, 'public');
        if (!fs.existsSync(distPublicDir)) {
          fs.mkdirSync(distPublicDir, { recursive: true });
        }

        // Copy logout.js from public directory to dist/public
        const logoutJsPath = path.resolve(__dirname, 'public', 'logout.js');
        const destLogoutJsPath = path.resolve(distPublicDir, 'logout.js');
        if (fs.existsSync(logoutJsPath)) {
          fs.copyFileSync(logoutJsPath, destLogoutJsPath);
          // Also copy to root for backward compatibility
          fs.copyFileSync(logoutJsPath, path.resolve(distDir, 'logout.js'));
          console.log('✅ Copied logout.js to dist folder');
        } else {
          console.error('❌ logout.js not found in public directory');
        }
        
        // Copy icon files and other public assets
        const publicDir = path.resolve(__dirname, 'public');
        
        if (fs.existsSync(publicDir)) {
          // First copy icon files (high priority for manifest references)
          const iconFiles = ['icon-16.svg', 'icon-48.svg', 'icon-128.svg', 'icon-16.png', 'icon-48.png', 'icon-128.png'];
          
          // Copy icon files directly to dist root for manifest.json references
          for (const icon of iconFiles) {
            // Check both in public root and in icons subdirectory
            let srcFile = path.resolve(publicDir, icon);
            const iconSubDirFile = path.resolve(publicDir, 'icons', icon);
            
            if (fs.existsSync(iconSubDirFile)) {
              srcFile = iconSubDirFile;
            }
            
            if (fs.existsSync(srcFile)) {
              const destFile = path.resolve(distDir, icon);
              fs.copyFileSync(srcFile, destFile);
              console.log(`✅ Copied ${icon} to dist folder root`);
            } else {
              console.warn(`⚠️ Icon file ${icon} not found in public or public/icons directory`);
            }
          }
          
          // Copy README.md from public to dist if it exists
          const readmePath = path.resolve(publicDir, 'README.md');
          if (fs.existsSync(readmePath)) {
            const destReadmePath = path.resolve(distDir, 'README.md');
            fs.copyFileSync(readmePath, destReadmePath);
            console.log('✅ Copied README.md to dist folder');
          }
          
          // Copy entire public/icons directory if it exists
          const iconsDir = path.resolve(publicDir, 'icons');
          if (fs.existsSync(iconsDir)) {
            const destIconsDir = path.resolve(distDir, 'icons');
            
            // Create destination directory if it doesn't exist
            if (!fs.existsSync(destIconsDir)) {
              fs.mkdirSync(destIconsDir, { recursive: true });
            }
            
            // Copy all files from icons directory
            const iconFiles = fs.readdirSync(iconsDir);
            for (const file of iconFiles) {
              const srcFile = path.resolve(iconsDir, file);
              const destFile = path.resolve(destIconsDir, file);
              
              if (fs.statSync(srcFile).isFile()) {
                fs.copyFileSync(srcFile, destFile);
                console.log(`✅ Copied ${file} to dist/icons folder`);
              }
            }
          }
        }
        
        // Let's create options.html and sidepanel.html files using the generated assets
        // Create options.html
        const destOptionsPath = path.resolve(distDir, 'options.html');
        const optionsHtmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Extension Options</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./assets/options.js"></script>
  </body>
</html>`;
        fs.writeFileSync(destOptionsPath, optionsHtmlContent);
        console.log('✅ Created options.html in dist folder');
        
        // Create sidepanel.html
        const destSidepanelPath = path.resolve(distDir, 'sidepanel.html');
        const sidepanelHtmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Extension Side Panel</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./assets/sidepanel.js"></script>
  </body>
</html>`;
        fs.writeFileSync(destSidepanelPath, sidepanelHtmlContent);
        console.log('✅ Created sidepanel.html in dist folder');
        
        // Create popup.html (copy of index.html)
        const indexHtmlPath = path.resolve(distDir, 'index.html');
        const popupHtmlPath = path.resolve(distDir, 'popup.html');
        if (fs.existsSync(indexHtmlPath)) {
          fs.copyFileSync(indexHtmlPath, popupHtmlPath);
          console.log('✅ Created popup.html from index.html');
        } else {
          // Create popup.html manually
          const popupHtmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Extension Popup</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./assets/main.js"></script>
  </body>
</html>`;
          fs.writeFileSync(popupHtmlPath, popupHtmlContent);
          console.log('✅ Created popup.html in dist folder');
        }
        
        // Fix HTML file paths to use relative paths instead of absolute
        const htmlFiles = ['index.html', 'options.html', 'sidepanel.html', 'popup.html'];
        for (const htmlFile of htmlFiles) {
          const htmlPath = path.resolve(distDir, htmlFile);
          if (fs.existsSync(htmlPath)) {
            let content = fs.readFileSync(htmlPath, 'utf8');
            
            // Replace absolute paths with relative paths
            content = content.replace(/src="\//g, 'src="./');
            content = content.replace(/href="\//g, 'href="./');
            
            fs.writeFileSync(htmlPath, content);
            console.log(`✅ Fixed asset paths in ${htmlFile}`);
          }
        }
      } catch (error) {
        console.error('❌ Error copying extension files:', error);
      }
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    extensionAssetsPlugin()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/main.tsx'),
        options: resolve(__dirname, 'src/options.tsx'),
        sidepanel: resolve(__dirname, 'src/sidepanel.tsx')
      }
    }
  },
  // Load environment variables from .env file
  envPrefix: 'VITE_'
});