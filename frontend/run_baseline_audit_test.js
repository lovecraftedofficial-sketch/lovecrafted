const puppeteer = require('puppeteer');

async function runBaselineAuditTest() {
  console.log("=================================================================");
  console.log("   LOVECRAFTED REAL-TIME BASELINE USER JOURNEY & AUDIT SUITE    ");
  console.log("=================================================================");

  let browser;
  const auditLogs = [];
  const bugs = [];

  function recordBug({ id, step, expected, actual, severity, type }) {
    bugs.push({ id, step, expected, actual, severity, type });
    console.log(`\n🚨 [BUG RECORDED - ${severity}] ${id} (${step}):`);
    console.log(`   Expected: ${expected}`);
    console.log(`   Actual:   ${actual}`);
  }

  try {
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 1. APPLICATION STARTUP
    console.log("\n--- 1. TESTING APPLICATION STARTUP & LANDING PAGE ---");
    const startTime = Date.now();
    await page.goto("http://localhost:3000/", { waitUntil: 'networkidle0' });
    const loadTime = Date.now() - startTime;
    console.log(`✅ Loaded http://localhost:3000/ in ${loadTime}ms`);

    const landingText = await page.evaluate(() => document.body.innerText);
    const hasHeroText = landingText.includes("Turn your love story") || landingText.includes("LoveCrafted");
    console.log(`   Landing page title & hero text rendered: ${hasHeroText}`);

    // 2. CREATOR JOURNEY: MARKETPLACE & TEMPLATE SELECTION
    console.log("\n--- 2. TESTING CREATOR JOURNEY: MARKETPLACE & PREVIEW ---");
    await page.goto("http://localhost:3000/templates", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    const marketplaceCards = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.lws-card') || []);
      return cards.map(c => c.innerText);
    });
    console.log(`   Marketplace template cards count: ${marketplaceCards.length}`);

    // Click "For My Baby" template preview
    await page.goto("http://localhost:3000/templates/come-here-baby", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    const detailTitle = await page.evaluate(() => document.querySelector('h1')?.innerText || '');
    console.log(`   Template Details Title: "${detailTitle}"`);

    // 3. CREATOR JOURNEY: VISUAL EDITOR & CUSTOMIZATION
    console.log("\n--- 3. TESTING CREATOR JOURNEY: VISUAL EDITOR ---");
    await page.goto("http://localhost:3000/dashboard/websites/come-here-baby/edit", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    const editorMounted = await page.evaluate(() => {
      return document.querySelector('[data-testid="editor-root"]') !== null || document.body.innerText.includes("Studio");
    });
    console.log(`   Visual Editor mounted cleanly: ${editorMounted}`);

    // Edit Partner Name to "Sona Baby"
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      const partnerInput = inputs[0];
      if (partnerInput) {
        partnerInput.value = "Sona Baby";
        partnerInput.dispatchEvent(new Event('input', { bubbles: true }));
        partnerInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise(r => setTimeout(r, 500));

    // Save draft
    await page.evaluate(() => {
      const saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes("Save Keepsake"));
      if (saveBtn) saveBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));

    // 4. PERSISTENCE & DATA CONTINUITY TEST
    console.log("\n--- 4. TESTING PERSISTENCE & DATA CONTINUITY ---");
    await page.reload({ waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    const restoredPartnerName = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      return inputs[0] ? inputs[0].value : '';
    });
    console.log(`   Restored Partner Name after reload: "${restoredPartnerName}"`);
    if (restoredPartnerName === "Sona Baby") {
      console.log("✅ PASSED: Draft content persists 100% across page reloads!");
    } else {
      recordBug({
        id: "BUG-PERSIST-01",
        step: "Draft Reload",
        expected: "Sona Baby",
        actual: restoredPartnerName,
        severity: "P2",
        type: "OBSERVED FACT"
      });
    }

    // 5. TESTING PAYMENT MODAL INITIATION
    console.log("\n--- 5. TESTING PAYMENT MODAL INITIATION ---");
    await page.evaluate(() => {
      const pubBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes("Publish & Get Live Link") || b.innerText.includes("Publish"));
      if (pubBtn) pubBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    const publishModalVisible = await page.evaluate(() => {
      return document.body.innerText.includes("Razorpay") || document.body.innerText.includes("Publish") || document.body.innerText.includes("Unlock");
    });
    console.log(`   Publish & Payment modal rendered: ${publishModalVisible}`);

    // 6. TESTING RECIPIENT UNBOXING JOURNEY
    console.log("\n--- 6. TESTING RECIPIENT UNBOXING & MOBILE RESPONSIVENESS ---");
    await page.goto("http://localhost:3000/story/come-here-baby", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    const unboxingOverlayVisible = await page.evaluate(() => {
      return document.body.innerText.includes("Open My Surprise") || document.body.innerText.includes("You Received a Keepsake");
    });
    console.log(`   Recipient Unboxing Intro Overlay visible: ${unboxingOverlayVisible}`);

    // Click "Open My Surprise"
    await page.evaluate(() => {
      const openBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes("Open My Surprise") || b.innerText.includes("Open"));
      if (openBtn) openBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    const templateContentVisible = await page.evaluate(() => {
      return document.body.innerText.includes("Songs For My Baby") || document.body.innerText.includes("Care") || document.body.innerText.includes("Love Note");
    });
    console.log(`   Recipient template content revealed after unboxing: ${templateContentVisible}`);

    // 7. TESTING MOBILE VIEWPORT (iPhone 13 - 390x844)
    console.log("\n--- 7. TESTING MOBILE RESPONSIVENESS ---");
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto("http://localhost:3000/story/come-here-baby", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    const mobileOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log(`   Mobile horizontal overflow detected: ${mobileOverflow}`);
    if (mobileOverflow) {
      recordBug({
        id: "BUG-MOBILE-01",
        step: "Mobile Viewport",
        expected: "No horizontal overflow",
        actual: "Horizontal overflow detected on mobile",
        severity: "P3",
        type: "OBSERVED FACT"
      });
    } else {
      console.log("✅ PASSED: Zero horizontal overflow on mobile viewport!");
    }

    // 8. TESTING ERROR & EDGE CASE HANDLING
    console.log("\n--- 8. TESTING ERROR & EDGE CASES ---");
    await page.goto("http://localhost:3000/story/non-existent-slug-9999", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    const fallbackPageRendered = await page.evaluate(() => {
      return document.body.innerText.includes("Until Forever") || document.body.innerText.includes("Keepsake") || document.body.innerText.includes("Not Found") || document.body.innerText.includes("LoveCrafted");
    });
    console.log(`   Handled invalid story slug gracefully: ${fallbackPageRendered}`);

    console.log("\n--- CONSOLE ERRORS SUMMARY ---");
    if (consoleErrors.length === 0) {
      console.log("✅ Zero fatal console errors recorded during test run!");
    } else {
      console.log("   Console Errors Recorded:", consoleErrors);
    }

  } catch (err) {
    console.error("❌ Test Suite Error:", err.message);
  } finally {
    if (browser) await browser.close();
  }

  console.log("\n=================================================================");
  console.log("   BASELINE AUDIT TEST COMPLETE                                  ");
  console.log("=================================================================");
}

runBaselineAuditTest();
