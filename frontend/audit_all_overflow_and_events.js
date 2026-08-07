const fs = require('fs');
const path = require('path');

function scanDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      scanDir(filePath, fileList);
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
      const content = fs.readFileSync(filePath, 'utf8');
      fileList.push({ filePath, content });
    }
  });
  return fileList;
}

const srcDir = path.join(__dirname, 'src');
const allFiles = scanDir(srcDir);

console.log("=== FULL SCROLL INTERACTION AUDIT ===");

allFiles.forEach(f => {
  const rel = f.filePath.replace(srcDir, 'src');
  const lines = f.content.split('\n');
  
  lines.forEach((line, i) => {
    const l = line.trim();
    if (
      l.includes('overflow-hidden') ||
      l.includes('overflow: hidden') ||
      l.includes('overflow-y-hidden') ||
      l.includes('overflow-x-hidden') ||
      l.includes('wheel') ||
      l.includes('touchmove') ||
      l.includes('preventDefault') ||
      l.includes('body.style') ||
      l.includes('document.body') ||
      l.includes('overscroll')
    ) {
      console.log(`[${rel}:L${i+1}] ${l.slice(0, 110)}`);
    }
  });
});
