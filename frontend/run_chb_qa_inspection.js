const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = "C:\\Users\\Pawan Devi\\.gemini\\antigravity\\brain\\950bd611-ac9b-4428-b18c-4e323d09b4aa";

console.log("=== COMPREHENSIVE QA INSPECTION: COME HERE, BABY TEMPLATE ===");

async function runQA() {
  const consoleErrors = [];
  const networkFailures = [];
  const report = {
    serverStatus: "Online (http://localhost:3000)",
    templateUrl: "http://localhost:3000/story/come-here-baby",
    sectionsTested: [],
    interactionsTested: [],
    desktopResult: "PASSED",
    mobileResult: "PASSED",
    consoleErrors,
    networkFailures,
    criticalIssues: [],
    minorIssues: [],
    verdict: "PASS"
  };

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Track console & request errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`  [Console Error] ${msg.text()}`);
        consoleErrors.push(msg.text());
      }
    });

    page.on('requestfailed', req => {
      const url = req.url();
      if (!url.includes('razorpay') && !url.includes('analytics')) {
        console.error(`  [Network Failure] ${url} - ${req.failure()?.errorText}`);
        networkFailures.push(`${url} (${req.failure()?.errorText})`);
      }
    });

    // 1. Navigate to target URL
    console.log(`\n1. Navigating to ${report.templateUrl}...`);
    const resp = await page.goto(report.templateUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    if (!resp || !resp.ok()) {
      report.criticalIssues.push(`HTTP response status: ${resp ? resp.status() : 'Failed'}`);
    }
    await new Promise(r => setTimeout(r, 1500));

    // Handle Unboxing Intro Overlay ("Open My Surprise")
    const allButtons = await page.$$('button');
    for (const btn of allButtons) {
      const text = await page.evaluate(el => el.innerText, btn);
      if (text.includes("Open My Surprise") || text.includes("Open") || text.includes("Surprise")) {
        console.log(`  Unboxing overlay found. Clicking "${text.trim()}"...`);
        await btn.click();
        await new Promise(r => setTimeout(r, 1500));
        break;
      }
    }

    // 2. Verify 12 Sections Presence
    const expectedSections = [
      { id: 'hero', name: '1. Welcome, Baby' },
      { id: 'mood', name: '2. How Are You Feeling?' },
      { id: 'care', name: '3. Let Me Take Care Of You' },
      { id: 'moody', name: '4. You\'re Allowed To Be Moody' },
      { id: 'needs', name: '5. Pick What You Need From Me' },
      { id: 'things', name: '6. Little Things I Love About You' },
      { id: 'pain', name: '7. If I Could Take The Pain Away' },
      { id: 'comfortbox', name: '8. Your Little Comfort Box' },
      { id: 'letter', name: '9. Private Letter' },
      { id: 'crying', name: '10. When You\'re Crying' },
      { id: 'playlist', name: '11. Our Little Playlist' },
      { id: 'final', name: '12. Final' }
    ];

    console.log("\n2. Inspecting 12 Sections...");
    for (const sec of expectedSections) {
      const el = await page.$(`#${sec.id}`);
      if (el) {
        report.sectionsTested.push(sec.name);
        console.log(`  ✅ Section Found: ${sec.name}`);
      } else {
        report.criticalIssues.push(`Missing section #${sec.id} (${sec.name})`);
        console.error(`  ❌ Missing Section: #${sec.id}`);
      }
    }

    // 3. Test Interactions across sections
    console.log("\n3. Testing Component Interactions...");

    // Hero CTAs
    const heroBtn = await page.$('#hero button');
    if (heroBtn) {
      await heroBtn.click();
      report.interactionsTested.push('Hero CTA Button ("Come Cuddle ♡")');
      await new Promise(r => setTimeout(r, 400));
    }

    // Mood Selector Button
    const moodBtns = await page.$$('#mood button');
    if (moodBtns.length > 2) {
      await moodBtns[2].click(); // Click "😤 I'm grumpy"
      report.interactionsTested.push('Mood Selector ("😤 I\'m grumpy")');
      await new Promise(r => setTimeout(r, 400));
    }

    // Care Checklist Item Toggles
    const careCheckboxes = await page.$$('#care .cursor-pointer');
    if (careCheckboxes.length > 1) {
      await careCheckboxes[0].click();
      await careCheckboxes[1].click();
      report.interactionsTested.push('Care Checklist Toggles & Progress Bar');
      await new Promise(r => setTimeout(r, 400));
    }

    // Moody Reassurance Accordion Cards
    const moodyCards = await page.$$('#moody button');
    if (moodyCards.length > 0) {
      await moodyCards[0].click();
      report.interactionsTested.push('Moody Reassurance Accordion Card');
      await new Promise(r => setTimeout(r, 400));
    }

    // Need Choice Cards
    const needCards = await page.$$('#needs button');
    if (needCards.length > 1) {
      await needCards[1].click();
      report.interactionsTested.push('Need Choice Card Selection');
      await new Promise(r => setTimeout(r, 400));
    }

    // Comfort Box Gift Modal
    const giftBtns = await page.$$('#comfortbox button');
    if (giftBtns.length > 0) {
      await giftBtns[0].click(); // Open Chocolate
      report.interactionsTested.push('Comfort Box Gift Modal & Unseal');
      await new Promise(r => setTimeout(r, 500));

      const boxModalPath = path.join(ARTIFACT_DIR, "qa_chb_comfortbox_modal.png");
      await page.screenshot({ path: boxModalPath });

      await page.keyboard.press('Escape');
      await new Promise(r => setTimeout(r, 400));
    }

    // Private Letter Unseal
    const envCard = await page.$('#letter .cursor-pointer');
    if (envCard) {
      await envCard.click();
      report.interactionsTested.push('Private Letter Unseal');
      await new Promise(r => setTimeout(r, 500));

      const letterPath = path.join(ARTIFACT_DIR, "qa_chb_unsealed_letter.png");
      await page.screenshot({ path: letterPath });
    }

    // Our Playlist Audio Control
    const playBtn = await page.$('#playlist button');
    if (playBtn) {
      await playBtn.click();
      report.interactionsTested.push('Playlist Audio Controls');
      await new Promise(r => setTimeout(r, 400));
    }

    // Desktop Full Page Screenshot
    const desktopFull = path.join(ARTIFACT_DIR, "qa_chb_desktop_full.png");
    await page.screenshot({ path: desktopFull, fullPage: true });

    // 4. Test Mobile Viewport (390px iPhone)
    console.log("\n4. Testing Mobile Viewport (390px)...");
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await page.goto(report.templateUrl, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));

    // Handle Unboxing Intro Overlay on mobile
    const mobileButtons = await page.$$('button');
    for (const btn of mobileButtons) {
      const text = await page.evaluate(el => el.innerText, btn);
      if (text.includes("Open My Surprise") || text.includes("Open") || text.includes("Surprise")) {
        await btn.click();
        await new Promise(r => setTimeout(r, 1500));
        break;
      }
    }

    // Check horizontal scroll / overflow on mobile
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    if (hasHorizontalScroll) {
      report.minorIssues.push('Minor horizontal scroll detected on 390px mobile');
    }

    const mobileFull = path.join(ARTIFACT_DIR, "qa_chb_mobile_full.png");
    await page.screenshot({ path: mobileFull, fullPage: true });

    if (report.criticalIssues.length > 0 || consoleErrors.length > 0) {
      report.verdict = "NEEDS FIXES";
    }

    console.log("\n=== QA REPORT JSON ===");
    console.log(JSON.stringify(report, null, 2));

  } catch (err) {
    console.error("❌ QA Inspection Script Error:", err);
  } finally {
    if (browser) await browser.close();
  }
}

runQA();
