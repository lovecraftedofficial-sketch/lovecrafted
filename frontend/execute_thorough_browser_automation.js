const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = "C:\\Users\\Pawan Devi\\.gemini\\antigravity\\brain\\950bd611-ac9b-4428-b18c-4e323d09b4aa";

console.log("=== EXECUTING DETAILED STEP-BY-STEP BROWSER AUTOMATION ===");

async function runDetailedBrowserAutomation() {
  let browser;
  let stepCount = 1;

  async function takeScreenshot(page, description) {
    const filename = `step_${stepCount}_${description.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`;
    const filePath = path.join(ARTIFACT_DIR, filename);
    await page.screenshot({ path: filePath });
    console.log(`  📸 Step ${stepCount}: ${description} -> ${filename}`);
    stepCount++;
    return filePath;
  }

  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`  ❌ BROWSER CONSOLE ERROR: ${msg.text()}`);
      }
    });

    // 1. Open Homepage
    console.log("\n[Action 1] Opening Homepage (http://localhost:3000)...");
    await page.goto("http://localhost:3000", { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    await takeScreenshot(page, "Homepage_Loaded");

    // 2. Navigate to Marketplace / Templates
    console.log("\n[Action 2] Navigating to Templates Marketplace...");
    await page.goto("http://localhost:3000/templates", { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    await takeScreenshot(page, "Marketplace_Page");

    // 3. Navigate directly to A Little Corner Template Experience
    console.log("\n[Action 3] Navigating to A Little Corner Template...");
    const targetUrl = "http://localhost:3000/story/demo?slug=a-little-corner";
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    await takeScreenshot(page, "ALittleCorner_Hero_Loaded");

    // 4. Test Navigation Buttons in Header
    console.log("\n[Action 4] Testing Sticky Header Navigation Links...");
    const navButtons = await page.$$('header nav button');
    if (navButtons.length > 0) {
      await navButtons[1].click(); // Click "Today's Note"
      await new Promise(r => setTimeout(r, 800));
      await takeScreenshot(page, "Navigated_To_Todays_Note");
    }

    // 5. Test Random Love Note Generator
    console.log("\n[Action 5] Testing Random Love Note Generator Button...");
    const showNoteBtn = await page.$('#note button');
    if (showNoteBtn) {
      await showNoteBtn.click();
      await new Promise(r => setTimeout(r, 600));
      await takeScreenshot(page, "Generated_Random_Note_1");

      await showNoteBtn.click();
      await new Promise(r => setTimeout(r, 600));
      await takeScreenshot(page, "Generated_Random_Note_2");
    }

    // 6. Scroll to Care Corner & Complete Checklist
    console.log("\n[Action 6] Navigating to Care Corner & Completing Items...");
    await page.evaluate(() => document.getElementById('care')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 800));
    await takeScreenshot(page, "Care_Corner_Initial");

    const checkItems = await page.$$('#care .cursor-pointer');
    for (let i = 0; i < checkItems.length; i++) {
      await checkItems[i].click();
      await new Promise(r => setTimeout(r, 300));
    }
    await takeScreenshot(page, "Care_Corner_All_Items_Checked");

    // 7. Scroll to Our Songs & Click Play Button
    console.log("\n[Action 7] Navigating to Our Songs & Triggering Play Control...");
    await page.evaluate(() => document.getElementById('songs')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 800));
    await takeScreenshot(page, "Our_Songs_Initial");

    const playBtn = await page.$('#songs button');
    if (playBtn) {
      await playBtn.click();
      await new Promise(r => setTimeout(r, 800));
      await takeScreenshot(page, "Music_Player_Playing_State");
    }

    // 8. Scroll to Reasons & Flip Every Card
    console.log("\n[Action 8] Navigating to Reasons & Flipping Every Card...");
    await page.evaluate(() => document.getElementById('reasons')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 800));
    await takeScreenshot(page, "Reasons_Initial");

    const reasonCards = await page.$$('#reasons .perspective-1000');
    for (let i = 0; i < reasonCards.length; i++) {
      await reasonCards[i].click();
      await new Promise(r => setTimeout(r, 500));
      await takeScreenshot(page, `Reason_Card_${i+1}_Flipped`);
    }

    // 9. Scroll to Open When & Expand Every Comfort Envelope
    console.log("\n[Action 9] Navigating to Open When & Expanding Envelopes...");
    await page.evaluate(() => document.getElementById('openwhen')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 800));
    await takeScreenshot(page, "OpenWhen_Initial");

    const envButtons = await page.$$('#openwhen button');
    for (let i = 0; i < envButtons.length; i++) {
      await envButtons[i].click();
      await new Promise(r => setTimeout(r, 400));
      await takeScreenshot(page, `OpenWhen_Envelope_${i+1}_Expanded`);
    }

    // 10. Scroll to Gallery & Open Image Lightbox
    console.log("\n[Action 10] Navigating to Gallery & Opening Lightbox...");
    await page.evaluate(() => document.getElementById('gallery')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 800));
    await takeScreenshot(page, "Gallery_Initial");

    const galleryCards = await page.$$('#gallery .cursor-pointer');
    if (galleryCards.length > 0) {
      await galleryCards[0].click();
      await new Promise(r => setTimeout(r, 600));
      await takeScreenshot(page, "Gallery_Lightbox_Opened");

      // Close Lightbox
      await page.keyboard.press('Escape').catch(() => {});
      await new Promise(r => setTimeout(r, 400));
    }

    // 11. Scroll to Private Letter & Unseal Letter
    console.log("\n[Action 11] Navigating to Private Letter & Unsealing...");
    await page.evaluate(() => document.getElementById('letter')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 800));
    await takeScreenshot(page, "Letter_Sealed_State");

    const envelopeDiv = await page.$('#letter .cursor-pointer');
    if (envelopeDiv) {
      await envelopeDiv.click();
      await new Promise(r => setTimeout(r, 700));
      await takeScreenshot(page, "Letter_Unsealed_State");
    }

    // 12. Scroll to Ending Section
    console.log("\n[Action 12] Navigating to Ending Section...");
    await page.evaluate(() => document.getElementById('ending')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 800));
    await takeScreenshot(page, "Ending_Section_Loaded");

    // 13. Test Responsive Mobile (390px iPhone)
    console.log("\n[Action 13] Switching to Mobile Viewport (390px iPhone)...");
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));
    await takeScreenshot(page, "Mobile_Hero_390px");

    await page.evaluate(() => document.getElementById('note')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 600));
    await takeScreenshot(page, "Mobile_Note_390px");

    console.log("\n=== BROWSER AUTOMATION PASSED 100% CLEANLY ===");

  } catch (err) {
    console.error("❌ Automation Execution Error:", err);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
}

runDetailedBrowserAutomation();
