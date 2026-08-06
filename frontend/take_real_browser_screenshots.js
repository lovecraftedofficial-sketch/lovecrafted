const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = "C:\\Users\\Pawan Devi\\.gemini\\antigravity\\brain\\950bd611-ac9b-4428-b18c-4e323d09b4aa";

async function captureScreen(page, fileName, fullPage = false) {
  const filePath = path.join(ARTIFACT_DIR, fileName);
  await page.screenshot({ path: filePath, fullPage });
  console.log(`Saved screenshot: ${filePath}`);
}

(async () => {
  console.log("Launching Puppeteer browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Dashboard Home & Left Sidebar
  console.log("Navigating to Dashboard...");
  try {
    await page.goto("http://localhost:3000/dashboard", { waitUntil: "networkidle2" });
    await new Promise(r => setTimeout(r, 2000));
    await captureScreen(page, "real_browser_dashboard_home.png");
  } catch (e) {
    console.error("Dashboard failed:", e.message);
  }

  // 2. Creator Studio Editor Page
  console.log("Navigating to Creator Studio Until Forever Editor...");
  try {
    await page.goto("http://localhost:3000/dashboard/websites/until-forever/edit", { waitUntil: "networkidle2" });
    await new Promise(r => setTimeout(r, 2000));

    // Full Creator Studio Default view
    await captureScreen(page, "real_browser_creator_studio_full.png");

    // Chapter Sections
    const sectionButtons = await page.$$("button");
    console.log(`Found ${sectionButtons.length} buttons in Creator Studio`);

    // Capture chapters
    await captureScreen(page, "real_browser_creator_studio_ch1.png");
  } catch (e) {
    console.error("Creator Studio failed:", e.message);
  }

  // 3. Recipient Experience
  console.log("Navigating to Recipient Experience...");
  try {
    await page.goto("http://localhost:3000/v", { waitUntil: "networkidle2" });
    await new Promise(r => setTimeout(r, 2000));
    await captureScreen(page, "real_browser_recipient_experience.png");
  } catch (e) {
    console.error("Recipient Experience failed:", e.message);
  }

  // 4. Responsive Viewports Testing
  const viewports = [
    { name: "320px_mobile", w: 320, h: 568 },
    { name: "390px_iphone", w: 390, h: 844 },
    { name: "768px_tablet", w: 768, h: 1024 },
    { name: "1024px_tablet_landscape", w: 1024, h: 768 },
    { name: "1440px_desktop", w: 1440, h: 900 },
    { name: "1920px_large_desktop", w: 1920, h: 1080 },
  ];

  for (const vp of viewports) {
    console.log(`Testing viewport ${vp.name} (${vp.w}x${vp.h})...`);
    await page.setViewport({ width: vp.w, height: vp.h });
    await page.goto("http://localhost:3000/v", { waitUntil: "networkidle2" });
    await new Promise(r => setTimeout(r, 1000));
    await captureScreen(page, `real_browser_recipient_${vp.name}.png`);
  }

  console.log("All real browser screenshots captured successfully!");
  await browser.close();
})();
