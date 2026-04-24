const fs = require('fs');
const path = require('path');

function readDirectory(dir, baseDir = dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.includes('node_modules')) {
      files.push(...readDirectory(fullPath, baseDir));
    } else if (stat.isFile()) {
      files.push({
        path: path.relative(baseDir, fullPath),
        content: fs.readFileSync(fullPath, 'utf8')
      });
    }
  }
  
  return files;
}

module.exports = { readDirectory };
