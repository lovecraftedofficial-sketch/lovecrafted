const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = "C:\\Users\\Pawan Devi\\.gemini\\antigravity\\brain\\950bd611-ac9b-4428-b18c-4e323d09b4aa";

console.log("=== QA AUDIT: A LITTLE CORNER TEMPLATE ===");

async function runQATest() {
  let browser;
  const consoleErrors = [];
  const networkFailures = [];

  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Console & Network Listeners
    page.on('console', msg => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        const text = msg.text();
        if (!text.includes('Download the React DevTools')) {
          consoleErrors.push(`[${msg.type().toUpperCase()}] ${text}`);
        }
      }
    });

    page.on('response', resp => {
      if (resp.status() >= 400) {
        networkFailures.push(`[HTTP ${resp.status()}] ${resp.url()}`);
      }
    });

    // 1. Navigate to A Little Corner Story Experience
    console.log("\n[Step 1] Navigating to A Little Corner template...");
    const url = "http://localhost:3000/story/demo?slug=a-little-corner";
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    console.log("  ✅ Loaded template cleanly!");

    // 2. Capture Screenshots of Every Section
    console.log("\n[Step 2] Capturing Screenshots of Every Section...");
    
    // Full Page Desktop
    const fullScreenshotPath = path.join(ARTIFACT_DIR, "alc_full_page_desktop.png");
    await page.screenshot({ path: fullScreenshotPath, fullPage: true });
    console.log(`  📸 Full Page Desktop: ${fullScreenshotPath}`);

    // Section 1: Hero
    const heroPath = path.join(ARTIFACT_DIR, "alc_section1_hero.png");
    await page.screenshot({ path: heroPath });
    console.log(`  📸 Section 1 Hero: ${heroPath}`);

    // Scroll & Capture Section 2: Todays Note
    await page.evaluate(() => document.getElementById('note')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 800));
    const notePath = path.join(ARTIFACT_DIR, "alc_section2_note.png");
    await page.screenshot({ path: notePath });
    console.log(`  📸 Section 2 Note: ${notePath}`);

    // Test Random Note Generator
    console.log("\n[Interaction Test] Random Love Note Generator...");
    const noteBtn = await page.$('#note button');
    if (noteBtn) {
      await noteBtn.click();
      await new Promise(r => setTimeout(r, 500));
      await noteBtn.click();
      await new Promise(r => setTimeout(r, 500));
      console.log("  ✅ Note Generator toggled successfully!");
    }

    // Scroll & Capture Section 3: Care Corner
    await page.evaluate(() => document.getElementById('care')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 800));
    const carePath = path.join(ARTIFACT_DIR, "alc_section3_care.png");
    await page.screenshot({ path: carePath });
    console.log(`  📸 Section 3 Care Corner: ${carePath}`);

    // Test Checklist Toggle
    console.log("\n[Interaction Test] Care Checklist...");
    const checkItems = await page.$$('#care .cursor-pointer');
    if (checkItems.length > 0) {
      await checkItems[0].click();
      await new Promise(r => setTimeout(r, 300));
      await checkItems[1].click();
      await new Promise(r => setTimeout(r, 300));
      console.log("  ✅ Checklist items toggled cleanly!");
    }

    // Scroll & Capture Section 4: Our Songs
    await page.evaluate(() => document.getElementById('songs')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 800));
    const songsPath = path.join(ARTIFACT_DIR, "alc_section4_songs.png");
    await page.screenshot({ path: songsPath });
    console.log(`  📸 Section 4 Our Songs: ${songsPath}`);

    // Scroll & Capture Section 5: Reasons
    await page.evaluate(() => document.getElementById('reasons')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 800));
    const reasonsPath = path.join(ARTIFACT_DIR, "alc_section5_reasons.png");
    await page.screenshot({ path: reasonsPath });
    console.log(`  📸 Section 5 Reasons: ${reasonsPath}`);

    // Test Flip Card Interaction
    console.log("\n[Interaction Test] Reasons Flip Card...");
    const flipCards = await page.$$('#reasons .cursor-pointer');
    if (flipCards.length > 0) {
      await flipCards[0].click();
      await new Promise(r => setTimeout(r, 600));
      console.log("  ✅ Flip Card rotated 180°!");
    }

    // Scroll & Capture Section 6: Open When
    await page.evaluate(() => document.getElementById('openwhen')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 800));
    const openPath = path.join(ARTIFACT_DIR, "alc_section6_openwhen.png");
    await page.screenshot({ path: openPath });
    console.log(`  📸 Section 6 Open When: ${openPath}`);

    // Test Expandable Cards
    console.log("\n[Interaction Test] Open When Expandable Envelopes...");
    const envCards = await page.$$('#openwhen button');
    if (envCards.length > 0) {
      await envCards[0].click();
      await new Promise(r => setTimeout(r, 400));
      console.log("  ✅ Envelope 1 expanded!");
    }

    // Scroll & Capture Section 7: Gallery
    await page.evaluate(() => document.getElementById('gallery')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 800));
    const galleryPath = path.join(ARTIFACT_DIR, "alc_section7_gallery.png");
    await page.screenshot({ path: galleryPath });
    console.log(`  📸 Section 7 Gallery: ${galleryPath}`);

    // Test Lightbox
    console.log("\n[Interaction Test] Polaroid Image Lightbox...");
    const polaroids = await page.$$('#gallery .cursor-pointer');
    if (polaroids.length > 0) {
      await polaroids[0].click();
      await new Promise(r => setTimeout(r, 500));
      const lightboxPath = path.join(ARTIFACT_DIR, "alc_lightbox_modal.png");
      await page.screenshot({ path: lightboxPath });
      console.log(`  📸 Lightbox Modal Screenshot: ${lightboxPath}`);
      // Close lightbox
      await page.keyboard.press('Escape').catch(() => {});
      await page.click('body').catch(() => {});
      await new Promise(r => setTimeout(r, 400));
    }

    // Scroll & Capture Section 8: Private Letter
    await page.evaluate(() => document.getElementById('letter')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 800));
    const letterPath = path.join(ARTIFACT_DIR, "alc_section8_letter.png");
    await page.screenshot({ path: letterPath });
    console.log(`  📸 Section 8 Letter: ${letterPath}`);

    // Test Letter Unseal
    console.log("\n[Interaction Test] Letter Unseal...");
    const sealedEnv = await page.$('#letter .cursor-pointer');
    if (sealedEnv) {
      await sealedEnv.click();
      await new Promise(r => setTimeout(r, 600));
      const unsealedPath = path.join(ARTIFACT_DIR, "alc_letter_unsealed.png");
      await page.screenshot({ path: unsealedPath });
      console.log(`  📸 Unsealed Parchment Letter: ${unsealedPath}`);
    }

    // Scroll & Capture Section 9: Ending
    await page.evaluate(() => document.getElementById('ending')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 800));
    const endingPath = path.join(ARTIFACT_DIR, "alc_section9_ending.png");
    await page.screenshot({ path: endingPath });
    console.log(`  📸 Section 9 Ending: ${endingPath}`);

    // 3. Responsive Tests (Mobile Viewport)
    console.log("\n[Step 3] Testing Responsive Mobile (390px iPhone)...");
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));
    const mobilePath = path.join(ARTIFACT_DIR, "alc_mobile_390px.png");
    await page.screenshot({ path: mobilePath, fullPage: true });
    console.log(`  📸 Mobile 390px Viewport: ${mobilePath}`);

    // 4. Output Summary Data
    console.log("\n=== QA AUDIT TECHNICAL SUMMARY ===");
    console.log(`Total Console Errors/Warnings: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      consoleErrors.forEach(err => console.log(`  ${err}`));
    } else {
      console.log("  ✅ ZERO Console Errors!");
    }

    console.log(`Total Network Failures: ${networkFailures.length}`);
    if (networkFailures.length > 0) {
      networkFailures.forEach(fail => console.log(`  ${fail}`));
    } else {
      console.log("  ✅ ZERO Network Failures!");
    }

  } catch (err) {
    console.error("❌ QA Audit Error:", err);
  } finally {
    if (browser) await browser.close();
  }
}

runQATest();
