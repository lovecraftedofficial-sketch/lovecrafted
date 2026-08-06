const fs = require('fs');
const path = require('path');

function scanDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      scanDir(filePath, fileList);
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.json')) {
      const content = fs.readFileSync(filePath, 'utf8');
      fileList.push({ filePath, content });
    }
  });
  return fileList;
}

const frontendSrc = "C:\\Users\\Pawan Devi\\.gemini\\antigravity\\scratch\\lovecrafted\\frontend\\src";
const allFiles = scanDir(frontendSrc);

const forbiddenTerms = [
  'SUPABASE_SERVICE_ROLE_KEY',
  'service_role',
  'RAZORPAY_KEY_SECRET',
  'EMAILJS_PRIVATE_KEY',
  'AWS_SECRET_ACCESS_KEY'
];

let leaksFound = 0;

console.log("=== SECURITY CREDENTIAL SCAN IN FRONTEND ===");

allFiles.forEach(f => {
  forbiddenTerms.forEach(term => {
    if (f.content.includes(term)) {
      console.error(`🚨 LEAK WARNING in ${f.filePath}: Contains forbidden privileged term "${term}"`);
      leaksFound++;
    }
  });
});

if (leaksFound === 0) {
  console.log("✅ PERFECT: Zero privileged keys (service_role, secrets) found in frontend source code!");
}
