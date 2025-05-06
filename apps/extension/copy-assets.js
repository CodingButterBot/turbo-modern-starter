import fs from 'fs';
import path from 'path';

// Copy manifest.json to dist folder
console.log('Copying manifest.json to dist folder...');
fs.copyFileSync(
  path.resolve('manifest.json'),
  path.resolve('dist', 'manifest.json')
);

// Copy icons to dist folder
console.log('Copying icons to dist folder...');
const iconSizes = ['16', '48', '128'];
iconSizes.forEach(size => {
  const iconFileName = `icon-${size}.png`;
  fs.copyFileSync(
    path.resolve('public', iconFileName),
    path.resolve('dist', iconFileName)
  );
});

// Rename HTML files
console.log('Renaming HTML files...');
// Handle index.html to popup.html rename if needed
if (fs.existsSync(path.resolve('dist', 'index.html'))) {
  fs.renameSync(
    path.resolve('dist', 'index.html'),
    path.resolve('dist', 'popup.html')
  );
}

// Ensure sidepanel.html exists and is correct
if (fs.existsSync(path.resolve('dist', 'sidepanel.html'))) {
  console.log('sidepanel.html is already in place');
} else {
  console.log('Creating sidepanel.html from template...');
  // If the file doesn't exist for some reason, we'll create it
  const template = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Turbo Modern Starter - Side Panel</title>
      <link rel="stylesheet" href="sidepanel.css" />
    </head>
    <body>
      <div id="root"></div>
      <script type="module" src="sidepanel.js"></script>
    </body>
  </html>`;
  
  fs.writeFileSync(path.resolve('dist', 'sidepanel.html'), template.trim());
}

console.log('Assets copied successfully!');