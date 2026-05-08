const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = dir + '/' + file;
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      getFiles(fullPath, files);
    } else {
      if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

const files = getFiles('src');

for (const file of files) {
  if (file === 'src/utils/apiStorage.ts') continue;

  let content = fs.readFileSync(file, 'utf8');

  // Skip if it doesn't have localStorage
  if (!content.includes('localStorage')) continue;

  let changed = false;

  // Replace localStorage.
  content = content.replace(/localStorage\./g, 'apiStorage.');

  // Find depth to add the right import path
  const depth = file.split('/').length - 1;
  let relativePath = '';
  if (depth === 1) relativePath = './utils/apiStorage';
  else if (depth === 2) relativePath = '../utils/apiStorage';
  else if (depth === 3) relativePath = '../../utils/apiStorage';
  else if (depth === 4) relativePath = '../../../utils/apiStorage';
  else relativePath = '../../utils/apiStorage';

  // Add import if not exist
  if (!content.includes('import { apiStorage }')) {
     const importPos = content.indexOf('import ');
     if (importPos !== -1) {
         content = content.slice(0, importPos) + `import { apiStorage } from '${relativePath}';\n` + content.slice(importPos);
     } else {
         content = `import { apiStorage } from '${relativePath}';\n` + content;
     }
  }

  changed = true;

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated:', file);
  }
}
