// Script to verify extension build
const fs = require('fs');
const path = require('path');

// Path to the dist directory
const distPath = path.resolve(__dirname, '..', 'dist');

console.log('Verifying extension build in:', distPath);

// Check if dist directory exists
if (!fs.existsSync(distPath)) {
  console.error('ERROR: dist directory does not exist. Run the build first.');
  process.exit(1);
}

// Define required files for a Chrome extension
const requiredFiles = [
  'manifest.json',
  'background.js',
  'index.html',
  'icon-16.svg',
  'icon-48.svg',
  'icon-128.svg',
  'options.html',
  'sidepanel.html'
];

// Check for required files
console.log('\nChecking required files:');
let missingRequired = false;

for (const file of requiredFiles) {
  const filePath = path.join(distPath, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ Found ${file}`);
  } else {
    console.error(`❌ Missing required file: ${file}`);
    missingRequired = true;
  }
}

// Check manifest.json for correct paths
console.log('\nValidating manifest.json:');
const manifestPath = path.join(distPath, 'manifest.json');

try {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Check for valid action section
  if (manifest.action && manifest.action.default_popup) {
    if (fs.existsSync(path.join(distPath, manifest.action.default_popup))) {
      console.log(`✅ Valid default_popup: ${manifest.action.default_popup}`);
    } else {
      console.error(`❌ Invalid default_popup path: ${manifest.action.default_popup}`);
      missingRequired = true;
    }
  }
  
  // Check background script
  if (manifest.background && manifest.background.service_worker) {
    if (fs.existsSync(path.join(distPath, manifest.background.service_worker))) {
      console.log(`✅ Valid service_worker: ${manifest.background.service_worker}`);
    } else {
      console.error(`❌ Invalid service_worker path: ${manifest.background.service_worker}`);
      missingRequired = true;
    }
  }
  
  // Check icons
  if (manifest.icons) {
    for (const [size, iconPath] of Object.entries(manifest.icons)) {
      if (fs.existsSync(path.join(distPath, iconPath))) {
        console.log(`✅ Valid icon ${size}: ${iconPath}`);
      } else {
        console.error(`❌ Invalid icon path for ${size}: ${iconPath}`);
        missingRequired = true;
      }
    }
  }
  
} catch (error) {
  console.error(`❌ Error parsing manifest.json: ${error.message}`);
  missingRequired = true;
}

// Final result
console.log('\nBuild verification result:');
if (missingRequired) {
  console.error('❌ Build verification FAILED - missing required files');
  process.exit(1);
} else {
  console.log('✅ Build verification PASSED - all required files present');
}

// Check for HTML files with correct paths
const htmlFiles = ['index.html', 'options.html', 'sidepanel.html'];
console.log('\nChecking HTML file paths:');

for (const file of htmlFiles) {
  const filePath = path.join(distPath, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    // Check if there are any absolute paths (starting with /)
    if (content.match(/(src|href)="\/[^"]+"/)) {
      console.error(`❌ ${file} contains absolute paths which won't work in extensions`);
    } else {
      console.log(`✅ ${file} has correct relative paths`);
    }
  }
}