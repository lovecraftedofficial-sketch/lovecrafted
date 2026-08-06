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

const keywords = [
  '<BackgroundMusic',
  'BackgroundMusic',
  'fixed bottom-',
  'bottom-5',
  'bottom-6',
  'right-5',
  'right-6',
  'AudioPlayer',
  'lws:play_music'
];

console.log(`Auditing ${allFiles.length} source files...`);

const matches = [];

allFiles.forEach(f => {
  const lines = f.content.split('\n');
  lines.forEach((line, idx) => {
    keywords.forEach(kw => {
      if (line.includes(kw)) {
        matches.push({
          file: f.filePath,
          lineNum: idx + 1,
          lineContent: line.trim(),
          matchedKeyword: kw
        });
      }
    });
  });
});

console.log("\n=== AUDIT RESULTS ===");
matches.forEach(m => {
  console.log(`[File] ${m.file}`);
  console.log(`  Line ${m.lineNum} (${m.matchedKeyword}): ${m.lineContent}\n`);
});
