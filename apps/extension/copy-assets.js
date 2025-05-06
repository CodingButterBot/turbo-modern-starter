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

// Rename index.html to popup.html
console.log('Renaming index.html to popup.html...');
fs.renameSync(
  path.resolve('dist', 'index.html'),
  path.resolve('dist', 'popup.html')
);

console.log('Assets copied successfully!');