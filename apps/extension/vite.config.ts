import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import type { Plugin } from 'vite';

// Determine if we're in production mode
const isProd = process.env.NODE_ENV === 'production';

// Extension file copying plugin
function extensionAssetsPlugin(): Plugin {
  return {
    name: 'extension-assets',
    
    // Handle manifest.json updates at build time (e.g., applying version from package.json)
    async buildStart() {
      try {
        const manifestPath = path.resolve(__dirname, 'manifest.json');
        
        if (fs.existsSync(manifestPath)) {
          const packageJsonPath = path.resolve(__dirname, 'package.json');
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          
          // Read the manifest file
          const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
          
          // Update the version from package.json
          manifest.version = packageJson.version;
          
          // Add environment-specific configurations
          if (isProd) {
            // Production-specific settings
            if (!manifest.content_security_policy) {
              manifest.content_security_policy = {
                extension_pages: "script-src 'self'; object-src 'self'"
              };
            }
          } else {
            // Development-specific settings
            if (!manifest.content_security_policy) {
              manifest.content_security_policy = {
                extension_pages: "script-src 'self' 'unsafe-eval'; object-src 'self'"
              };
            }
          }

          // Write the updated manifest back
          fs.writeFileSync(
            manifestPath, 
            JSON.stringify(manifest, null, 2)
          );
        }
      } catch (error) {
        console.error('Error updating manifest.json:', error);
      }
    },
    
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
        
        // Copy background.js to dist folder
        const backgroundPath = path.resolve(__dirname, 'background.js');
        const destBackgroundPath = path.resolve(distDir, 'background.js');
        
        if (fs.existsSync(backgroundPath)) {
          fs.copyFileSync(backgroundPath, destBackgroundPath);
          console.log('✅ Copied background.js to dist folder');
        } else {
          console.error('❌ background.js not found');
        }

        // Copy icon files and other public assets
        const publicDir = path.resolve(__dirname, 'public');
        
        if (fs.existsSync(publicDir)) {
          // First copy icon files (high priority for manifest references)
          const iconFiles = ['icon-16.svg', 'icon-48.svg', 'icon-128.svg', 'icon-16.png', 'icon-48.png', 'icon-128.png'];
          
          // Copy icon files directly to dist root for manifest.json references
          for (const icon of iconFiles) {
            const srcFile = path.resolve(publicDir, icon);
            if (fs.existsSync(srcFile)) {
              const destFile = path.resolve(distDir, icon);
              fs.copyFileSync(srcFile, destFile);
              console.log(`✅ Copied ${icon} to dist folder root`);
            }
          }
          
          // Then copy all other public files
          copyDirRecursive(publicDir, distDir, iconFiles);
        }
        
        // Fix asset paths in HTML files for Chrome extension
        fixHtmlPaths(distDir);
      } catch (error) {
        console.error('❌ Error copying extension files:', error);
      }
    }
  };
}

// Helper to copy directory contents recursively
function copyDirRecursive(src: string, dest: string, excludeFiles: string[] = []) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      // Skip node_modules and other unnecessary folders
      if (['node_modules', '.git', '.cache'].includes(entry.name)) {
        continue;
      }
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      
      // Copy contents recursively
      copyDirRecursive(srcPath, destPath, excludeFiles);
    } else if (!excludeFiles.includes(entry.name)) {
      // Copy file if it's not excluded
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied ${entry.name} to ${path.relative(__dirname, destPath)}`);
    }
  }
}

// Fix HTML file paths
function fixHtmlPaths(distDir: string) {
  const htmlFiles = ['index.html', 'options.html', 'sidepanel.html'];
  
  for (const htmlFile of htmlFiles) {
    const htmlPath = path.resolve(distDir, htmlFile);
    if (fs.existsSync(htmlPath)) {
      let htmlContent = fs.readFileSync(htmlPath, 'utf8');
      
      // Replace absolute paths with relative ones
      htmlContent = htmlContent.replace(/src="\/assets\//g, 'src="./assets/');
      htmlContent = htmlContent.replace(/href="\/assets\//g, 'href="./assets/');
      
      // Ensure proper CSP meta tag for Chrome extensions
      if (!htmlContent.includes('<meta http-equiv="Content-Security-Policy"')) {
        const headEndTag = '</head>';
        const cspTag = `  <meta http-equiv="Content-Security-Policy" content="script-src 'self'; object-src 'self'">\n  ${headEndTag}`;
        htmlContent = htmlContent.replace(headEndTag, cspTag);
      }
      
      fs.writeFileSync(htmlPath, htmlContent);
      console.log(`✅ Fixed asset paths in ${htmlFile}`);
    }
  }
}

// Configuration
export default defineConfig(({ command, mode }): UserConfig => {
  // Determine if we're in production mode based on command and mode
  const isProduction = mode === 'production';
  
  // Base configuration
  const config: UserConfig = {
    plugins: [
      react(),
      extensionAssetsPlugin(),
      // Add bundle analyzer in production
      isProduction && visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
        filename: 'dist/stats.html',
      }),
    ].filter(Boolean),
    
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    
    define: {
      // Define environment variables
      'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      assetsDir: 'assets',
      
      // Generate proper source maps for production (external) or development (inline)
      sourcemap: isProduction ? true : 'inline',
      
      // Minification options
      minify: isProduction ? 'terser' : false,
      terserOptions: isProduction ? {
        compress: {
          drop_console: false, // Chrome extensions often need console for debugging
          drop_debugger: true,
        },
      } : undefined,
      
      // Split chunks for better caching
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          options: resolve(__dirname, 'options.html'),
          sidepanel: resolve(__dirname, 'sidepanel.html')
        },
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          // Adjust chunk size warning limit
          manualChunks: {
            react: ['react', 'react-dom'],
            // Add other common dependencies here
          },
        }
      },
      
      // Chrome extensions have size constraints, report on them
      reportCompressedSize: true,
      chunkSizeWarningLimit: 500, // Chrome extensions should be small, so set a lower limit
    },
    
    // Use relative paths for assets
    base: './',
    
    // Customize dev server (useful for development only)
    server: {
      port: 3000,
      strictPort: true,
      hmr: {
        port: 3000,
      },
    },
  };
  
  return config;
});