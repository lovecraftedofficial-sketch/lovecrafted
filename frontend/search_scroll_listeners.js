const fs = require('fs');
const path = require('path');

function scanDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      scanDir(filePath, fileList);
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.html')) {
      const content = fs.readFileSync(filePath, 'utf8');
      fileList.push({ filePath, content });
    }
  });
  return fileList;
}

const srcDir = path.join(__dirname, 'src');
const allFiles = scanDir(srcDir);

const terms = [
  'addEventListener',
  'removeEventListener',
  'wheel',
  'touchmove',
  'touchstart',
  'touchend',
  'preventDefault',
  'body',
  'overflow',
  'overscroll',
  'lenis',
  'locomotive',
  'gsap',
  'ScrollTrigger'
];

console.log("=== LISTENER & OVERFLOW AUDIT ===");

allFiles.forEach(f => {
  const rel = f.filePath.replace(__dirname, '');
  const lines = f.content.split('\n');

  lines.forEach((line, i) => {
    const l = line.trim();
    terms.forEach(term => {
      if (l.toLowerCase().includes(term.toLowerCase())) {
        if (
          l.includes('addEventListener("keydown"') ||
          l.includes('addEventListener("resize"') ||
          l.includes('addEventListener("online"') ||
          l.includes('addEventListener("lws:play_music"') ||
          l.includes('removeEventListener("keydown"') ||
          l.includes('removeEventListener("resize"')
        ) {
          // ignore non-scroll listeners
          return;
        }
        console.log(`[${rel}:L${i+1}] (${term}) ${l.slice(0, 100)}`);
      }
    });
  });
});
