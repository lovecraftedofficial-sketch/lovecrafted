const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = "C:\\Users\\Pawan Devi\\.gemini\\antigravity\\brain\\950bd611-ac9b-4428-b18c-4e323d09b4aa";

async function captureScreen(page, fileName) {
  const filePath = path.join(ARTIFACT_DIR, fileName);
  await page.screenshot({ path: filePath });
  console.log(`Saved screenshot: ${filePath}`);
}

(async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log("Navigating to Creator Studio...");
  await page.goto("http://localhost:3000/dashboard/websites/until-forever/edit", { waitUntil: "networkidle2" });
  await new Promise(r => setTimeout(r, 2000));

  // Find section navigation buttons
  const sectionIds = [
    "ch1", "ch2", "ch3", "ch4", "ch5", "ch6", "ch7", "ch8", "ch9", "ch10", "ch11", "ch12", "theme"
  ];

  for (const secId of sectionIds) {
    console.log(`Clicking section ${secId}...`);
    try {
      // Find button by section label text or index
      const buttons = await page.$$("button");
      for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text.includes(secId.replace("ch", "Ch ")) || text.includes("Theme")) {
          await btn.click();
          await new Promise(r => setTimeout(r, 500));
          break;
        }
      }
      await captureScreen(page, `real_browser_creator_studio_${secId}.png`);
    } catch (e) {
      console.error(`Failed for section ${secId}:`, e.message);
    }
  }

  // Also capture responsive views of Creator Studio
  const studioViewports = [
    { name: "320px_mobile", w: 320, h: 568 },
    { name: "390px_iphone", w: 390, h: 844 },
    { name: "768px_tablet", w: 768, h: 1024 },
    { name: "1024px_tablet_landscape", w: 1024, h: 768 },
    { name: "1440px_desktop", w: 1440, h: 900 },
    { name: "1920px_large_desktop", w: 1920, h: 1080 },
  ];

  for (const vp of studioViewports) {
    console.log(`Testing Creator Studio viewport ${vp.name}...`);
    await page.setViewport({ width: vp.w, height: vp.h });
    await page.goto("http://localhost:3000/dashboard/websites/until-forever/edit", { waitUntil: "networkidle2" });
    await new Promise(r => setTimeout(r, 1000));
    await captureScreen(page, `real_browser_creator_studio_${vp.name}.png`);
  }

  await browser.close();
  console.log("All detailed real browser screenshots captured!");
})();
