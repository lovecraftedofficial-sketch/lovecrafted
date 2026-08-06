const fs = require('fs');
const path = require('path');

function scanDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      scanDir(filePath, fileList);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('BackgroundMusic') || content.includes('fixed bottom') || content.includes('fixed top') || content.includes('playGlobalAudio')) {
        fileList.push({ filePath, content });
      }
    }
  });
  return fileList;
}

const srcDir = "C:\\Users\\Pawan Devi\\.gemini\\antigravity\\scratch\\lovecrafted\\frontend\\src";
const matches = scanDir(srcDir);

console.log(`Found ${matches.length} files matching audio keywords:`);
matches.forEach(m => {
  console.log(`\n--- File: ${m.filePath}`);
  const lines = m.content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('BackgroundMusic') || line.includes('fixed bottom-') || line.includes('playGlobalAudio') || line.includes('lws:play_music')) {
      console.log(`  Line ${idx + 1}: ${line.trim()}`);
    }
  });
});
