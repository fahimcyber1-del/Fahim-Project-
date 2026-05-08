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
      if (fullPath.endsWith('Module.tsx')) {
        files.push(fullPath);
      }
    }
  }
  return files;
}

const files = getFiles('src/components');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  let changed = false;

  // If it uses useState with INITIAL_*, we want to replace it
  const match = content.match(/useApiStorage/);
  if (match) {
    // Find the specific INITIAL_ constant used
    const initVarMatch = content.match(/useApiStorage\('aqm_[a-zA-Z0-9_]+',\s*(INITIAL_[A-Z_]+)\)/);
    if (initVarMatch) {
       const initVar = initVarMatch[1];
       
       const moduleNameMatch = file.match(/\/([^\/]+)Module\.tsx$/);
       const moduleName = moduleNameMatch ? moduleNameMatch[1] : 'Module';
       
       // Replace the useState with useApiStorage
       content = content.replace(
         /const\s+\[([a-zA-Z0-9_]+),\s*([a-zA-Z0-9_]+)\]\s*=\s*useApiStorage\('aqm_[a-zA-Z0-9_]+',\s*INITIAL_[A-Z_]+\)/,
         `const [$1, $2] = useApiStorage('aqm_${moduleName.toLowerCase()}_$1', ${initVar})`
       );
       
       changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated:', file);
  }
}

