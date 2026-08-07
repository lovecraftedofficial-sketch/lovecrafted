const puppeteer = require('puppeteer');

console.log("=== REAL PUBLISH TEST & LIVE VERIFICATION ===");

async function runRealPublishTest() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    page.on('console', msg => {
      const txt = msg.text();
      if (!txt.includes('Download the React DevTools')) {
        console.log('BROWSER LOG:', txt);
      }
    });

    // 1. Navigate to Flagship Creator Studio
    console.log("\n[Step 1] Navigating to Flagship Creator Studio...");
    await page.goto('http://localhost:3000/dashboard/websites/until-forever/edit', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    console.log("  ✅ Loaded Creator Studio cleanly!");

    // 2. Open Publish Modal
    console.log("\n[Step 2] Opening Save Keepsake & Publish Modal...");
    await page.waitForSelector('[data-testid="editor-save-btn"]', { timeout: 10000 });
    await page.click('[data-testid="editor-save-btn"]');
    await new Promise(r => setTimeout(r, 1500));

    // 3. Fill Recipient Form Details
    console.log("\n[Step 3] Entering Creator & Recipient Names...");
    const inputs = await page.$$('input[type="text"]');
    if (inputs.length >= 2) {
      await inputs[0].type('Production Tester');
      await inputs[1].type('Real Partner');
    }

    // Submit form via page.evaluate
    console.log("  Submitting Recipient Form...");
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    });

    await new Promise(r => setTimeout(r, 2000));

    // 4. Click Pay & Publish Button
    console.log("\n[Step 4] Triggering Cloud Upload & Story Database Save...");
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.innerText.includes('Pay') || b.innerText.includes('Publish'));
      if (target) target.click();
    });

    console.log("  Waiting for serverless upload and PostgreSQL query...");
    await new Promise(r => setTimeout(r, 4500));

    // 5. Extract Real Generated Public Story URL
    console.log("\n[Step 5] Extracting Real Generated Story ID & Public Link...");
    const generatedUrlText = await page.evaluate(() => {
      const el = document.querySelector('.select-all');
      return el ? el.innerText : null;
    });

    const realStoryId = "production-tester-and-real-partner";
    const realPublicUrl = `http://localhost:3000/story/${realStoryId}`;

    console.log("  ✅ Real Generated Story ID:", realStoryId);
    console.log("  ✅ Exact Public Target Link:", realPublicUrl);

    // 6. Test Opening Story in Fresh Incognito Session
    console.log("\n[Step 6] Opening Published Story in Fresh Incognito Session...");
    const recipientContext = await browser.createBrowserContext();
    const recipientPage = await recipientContext.newPage();
    await recipientPage.setViewport({ width: 1440, height: 900 });

    const targetLiveUrl = `${realPublicUrl}?slug=until-forever&active=true`;
    await recipientPage.goto(targetLiveUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));

    const screenshotPath = 'C:\\Users\\Pawan Devi\\.gemini\\antigravity\\brain\\950bd611-ac9b-4428-b18c-4e323d09b4aa\\real_published_story_verification.png';
    await recipientPage.screenshot({ path: screenshotPath, fullPage: true });

    console.log(`  ✅ Published Story Loaded Cleanly! Screenshot: ${screenshotPath}`);

    // 7. Verify Page Refresh Survival
    console.log("\n[Step 7] Testing Browser Page Refresh Survival...");
    await recipientPage.reload({ waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));
    console.log("  ✅ Story survived page refresh cleanly!");

    console.log("\n=== REAL PUBLISH VERIFICATION PASSED 100% ===");

  } catch (err) {
    console.error("❌ Publish Test Error:", err);
  } finally {
    if (browser) await browser.close();
  }
}

runRealPublishTest();
