const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = "C:\\Users\\Pawan Devi\\.gemini\\antigravity\\brain\\950bd611-ac9b-4428-b18c-4e323d09b4aa";

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log("Navigating to DashboardPage...");
  await page.goto("http://localhost:3000/dashboard", { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 2000));

  const filePath = path.join(ARTIFACT_DIR, "real_browser_dashboard_fixed.png");
  await page.screenshot({ path: filePath });
  console.log(`Verified Dashboard loading cleanly: ${filePath}`);

  await browser.close();
})();
