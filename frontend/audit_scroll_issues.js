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

const srcDir = "C:\\Users\\Pawan Devi\\.gemini\\antigravity\\scratch\\lovecrafted\\frontend\\src";
const allFiles = scanDir(srcDir);

const terms = [
  'overflow',
  'scroll',
  'overflow-hidden',
  'overflow-y-auto',
  'overflow-x-hidden',
  'overscroll',
  'wheel',
  'touchmove',
  'preventDefault',
  'body.style',
  'ScrollTrigger',
  'Lenis',
  'scroll-snap',
  'fixed'
];

console.log(`Auditing ${allFiles.length} files for scroll issues...\n`);

const results = [];

allFiles.forEach(f => {
  const lines = f.content.split('\n');
  lines.forEach((line, idx) => {
    terms.forEach(t => {
      if (line.includes(t)) {
        results.push({
          file: f.filePath.replace(srcDir, 'src'),
          lineNum: idx + 1,
          term: t,
          code: line.trim()
        });
      }
    });
  });
});

console.log(`Found ${results.length} scroll-related occurrences.\n`);

// Group by file
const grouped = {};
results.forEach(r => {
  if (!grouped[r.file]) grouped[r.file] = [];
  grouped[r.file].push(r);
});

for (const [file, items] of Object.entries(grouped)) {
  console.log(`\n=== ${file} (${items.length} items) ===`);
  items.slice(0, 15).forEach(item => {
    console.log(`  L${item.lineNum} [${item.term}]: ${item.code.slice(0, 120)}`);
  });
  if (items.length > 15) {
    console.log(`  ... and ${items.length - 15} more`);
  }
}
