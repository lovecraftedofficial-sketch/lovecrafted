const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk(srcDir);
let modifiedCount = 0;

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace min-h-screen ... overflow-hidden with min-h-screen ... overflow-x-clip
  // match lines with min-h-screen and overflow-hidden or overflow-x-hidden
  const lines = content.split('\n');
  const newLines = lines.map(line => {
    if (line.includes('min-h-screen') && (line.includes('overflow-hidden') || line.includes('overflow-x-hidden'))) {
      let newLine = line.replace('overflow-hidden', 'overflow-x-clip').replace('overflow-x-hidden', 'overflow-x-clip');
      console.log(`Replacing in ${path.relative(srcDir, filePath)}:`);
      console.log(`  OLD: ${line.trim().slice(0, 100)}`);
      console.log(`  NEW: ${newLine.trim().slice(0, 100)}`);
      return newLine;
    }
    return line;
  });

  const updatedContent = newLines.join('\n');
  if (updatedContent !== original) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    modifiedCount++;
  }
});

console.log(`\nSuccessfully updated ${modifiedCount} files.`);
