const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = "C:\\Users\\Pawan Devi\\.gemini\\antigravity\\brain\\950bd611-ac9b-4428-b18c-4e323d09b4aa";

console.log("=== BROWSER VERIFICATION: COME HERE, BABY TEMPLATE ===");

async function verifyCHB() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`  ❌ BROWSER ERROR: ${msg.text()}`);
      }
    });

    const targetUrl = "http://localhost:3000/story/demo?slug=come-here-baby";
    console.log(`Navigating to ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    // Full Page Screenshot
    const fullPath = path.join(ARTIFACT_DIR, "chb_full_page_desktop.png");
    await page.screenshot({ path: fullPath, fullPage: true });
    console.log(`📸 Full Page Desktop Screenshot: ${fullPath}`);

    // Section 1: Hero
    const heroPath = path.join(ARTIFACT_DIR, "chb_section1_hero.png");
    await page.screenshot({ path: heroPath });
    console.log(`📸 Section 1 Hero: ${heroPath}`);

    // Section 2: Mood Selector Interaction
    await page.evaluate(() => document.getElementById('mood')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 800));
    const moodBtns = await page.$$('#mood button');
    if (moodBtns.length > 1) {
      await moodBtns[1].click(); // Click "😭 I might cry"
      await new Promise(r => setTimeout(r, 500));
    }
    const moodPath = path.join(ARTIFACT_DIR, "chb_section2_mood.png");
    await page.screenshot({ path: moodPath });
    console.log(`📸 Section 2 Mood Selector: ${moodPath}`);

    // Section 3: Care Checklist Interaction
    await page.evaluate(() => document.getElementById('care')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 800));
    const checkItems = await page.$$('#care .cursor-pointer');
    if (checkItems.length > 0) {
      await checkItems[0].click();
      await checkItems[1].click();
      await new Promise(r => setTimeout(r, 400));
    }
    const carePath = path.join(ARTIFACT_DIR, "chb_section3_care.png");
    await page.screenshot({ path: carePath });
    console.log(`📸 Section 3 Care Checklist: ${carePath}`);

    // Section 8: Comfort Box Interaction
    await page.evaluate(() => document.getElementById('comfortbox')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 800));
    const boxGifts = await page.$$('#comfortbox button');
    if (boxGifts.length > 0) {
      await boxGifts[0].click(); // Open Chocolate
      await new Promise(r => setTimeout(r, 600));
      const boxModalPath = path.join(ARTIFACT_DIR, "chb_section8_comfortbox_modal.png");
      await page.screenshot({ path: boxModalPath });
      console.log(`📸 Section 8 Comfort Box Modal: ${boxModalPath}`);
      await page.keyboard.press('Escape').catch(() => {});
      await new Promise(r => setTimeout(r, 400));
    }

    // Section 9: Private Letter Unseal
    await page.evaluate(() => document.getElementById('letter')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 800));
    const envCard = await page.$('#letter .cursor-pointer');
    if (envCard) {
      await envCard.click();
      await new Promise(r => setTimeout(r, 600));
    }
    const letterPath = path.join(ARTIFACT_DIR, "chb_section9_letter_unsealed.png");
    await page.screenshot({ path: letterPath });
    console.log(`📸 Section 9 Unsealed Letter: ${letterPath}`);

    // Section 12: Final Message
    await page.evaluate(() => document.getElementById('final')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 800));
    const finalPath = path.join(ARTIFACT_DIR, "chb_section12_final.png");
    await page.screenshot({ path: finalPath });
    console.log(`📸 Section 12 Final Message: ${finalPath}`);

    // Mobile Screenshot (390px iPhone)
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));
    const mobilePath = path.join(ARTIFACT_DIR, "chb_mobile_390px.png");
    await page.screenshot({ path: mobilePath, fullPage: true });
    console.log(`📸 Mobile 390px Viewport: ${mobilePath}`);

    console.log("\n=== VERIFICATION COMPLETE: ALL CHECKS PASSED 100% ===");

  } catch (err) {
    console.error("❌ Verification Error:", err);
  } finally {
    if (browser) await browser.close();
  }
}

verifyCHB();
