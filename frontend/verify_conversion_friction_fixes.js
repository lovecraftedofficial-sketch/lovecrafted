const puppeteer = require('puppeteer');

async function waitForServer(url, maxAttempts = 30, delayMs = 1000) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 200 || res.status === 304) {
        return true;
      }
    } catch (e) {}
    await new Promise(r => setTimeout(r, delayMs));
  }
  throw new Error(`Server at ${url} did not respond within ${maxAttempts} seconds`);
}

async function runConversionFrictionVerification() {
  console.log("=================================================================");
  console.log("   LOVECRAFTED CONVERSION FRICTION FIX PASS — VERIFICATION SUITE ");
  console.log("=================================================================");

  await waitForServer("http://localhost:3000/");

  let browser;
  const consoleErrors = [];

  try {
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();

    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // 1. DESKTOP HOMEPAGE (1440x900)
    console.log("\n--- 1. TESTING DESKTOP HOMEPAGE (1440x900) ---");
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto("http://localhost:3000/", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    const landingContent = await page.evaluate(() => document.body.innerText);
    const landingContentLower = landingContent.toLowerCase();

    // Hero verification
    const hasHeroPill = landingContentLower.includes("handcrafted romantic keepsakes");
    const hasHeroHeadline = landingContent.includes("Turn your memories") && landingContent.includes("into a digital keepsake they'll never forget.");
    const hasHeroBody = landingContent.includes("Choose a handcrafted experience, personalize it with your names, memories, photos and music, then share a private link with someone you love.");
    console.log(`   Hero Pill ('Handcrafted Romantic Keepsakes'): ${hasHeroPill ? "✅ PASSED" : "❌ FAILED"}`);
    console.log(`   Hero Headline ('Turn your memories...'): ${hasHeroHeadline ? "✅ PASSED" : "❌ FAILED"}`);
    console.log(`   Hero Body ('Choose a handcrafted experience...'): ${hasHeroBody ? "✅ PASSED" : "❌ FAILED"}`);

    // 3-Step Process verification
    const hasStep1 = landingContent.includes("Choose the experience that feels most like your story.");
    const hasStep2 = landingContent.includes("Add names, messages, photos, memories and music. No code required.");
    const hasStep3 = landingContent.includes("Publish your keepsake and send the private link to them.");
    console.log(`   Step 01 ('Choose the experience...'): ${hasStep1 ? "✅ PASSED" : "❌ FAILED"}`);
    console.log(`   Step 02 ('Add names, messages...'): ${hasStep2 ? "✅ PASSED" : "❌ FAILED"}`);
    console.log(`   Step 03 ('Publish your keepsake...'): ${hasStep3 ? "✅ PASSED" : "❌ FAILED"}`);

    // Moments section (replacing fake testimonials)
    const hasMomentsTitle = landingContent.includes("Made for the moments that matter");
    const hasMomentsBody = landingContent.includes("LoveCrafted turns your memories, words, photos and music into a private digital keepsake");
    const hasNoFakeClaims = !landingContent.includes("Verified customer stories") && !landingContent.includes("A very lucky partner") && !landingContent.includes("A romantic somewhere");
    console.log(`   Moments Section Heading: ${hasMomentsTitle ? "✅ PASSED" : "❌ FAILED"}`);
    console.log(`   Moments Explanatory Text: ${hasMomentsBody ? "✅ PASSED" : "❌ FAILED"}`);
    console.log(`   Unsupported / Fake Claims Removed: ${hasNoFakeClaims ? "✅ PASSED" : "❌ FAILED"}`);

    // FAQ verification
    const hasFaq1 = landingContent.includes("What exactly am I buying?");
    const hasFaq2 = landingContent.includes("What can I edit and personalize?");
    const hasFaq3 = landingContent.includes("Do I need any technical or coding knowledge?");
    const hasFaq4 = landingContent.includes("How does the recipient receive it?");
    const hasFaq5 = landingContent.includes("Is my keepsake link private?");
    const hasFaq6 = landingContent.includes("Can I preview my keepsake before publishing?");
    const hasFaq7 = landingContent.includes("How does payment work?");
    const hasFaq8 = landingContent.includes("What happens after payment?");
    console.log(`   FAQ Objection Coverage (8 Core Questions): ${hasFaq1 && hasFaq2 && hasFaq3 && hasFaq4 && hasFaq5 && hasFaq6 && hasFaq7 && hasFaq8 ? "✅ PASSED" : "❌ FAILED"}`);

    // Final CTA verification
    const hasFinalCta = landingContent.includes("Say it with a keepsake");
    console.log(`   Final CTA ('Say it with a keepsake'): ${hasFinalCta ? "✅ PASSED" : "❌ FAILED"}`);

    // 2. MOBILE HOMEPAGE (390x844 - iPhone 13)
    console.log("\n--- 2. TESTING MOBILE HOMEPAGE (390x844) ---");
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.goto("http://localhost:3000/", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`   Mobile Horizontal Overflow: ${mobileOverflow ? "❌ DETECTED" : "✅ NONE (PASSED)"}`);

    // 3. MARKETPLACE PAGE (/templates)
    console.log("\n--- 3. TESTING TEMPLATES MARKETPLACE (/templates) ---");
    await page.goto("http://localhost:3000/templates", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    const marketContent = await page.evaluate(() => document.body.innerText);
    const hasMarketTitle = marketContent.includes("Crafted for Every Special Moment");
    const hasMarketSubtitle = marketContent.includes("Explore luxury digital keepsakes tailored for");
    const hasForMyBabyPrice = marketContent.includes("₹99");
    const hasUntilForeverPrice = marketContent.includes("₹299");
    console.log(`   Marketplace Title & Subtitle: ${hasMarketTitle && hasMarketSubtitle ? "✅ PASSED" : "❌ FAILED"}`);
    console.log(`   Pricing Accuracy (₹99 & ₹299): ${hasForMyBabyPrice && hasUntilForeverPrice ? "✅ PASSED" : "❌ FAILED"}`);

    // 4. TEMPLATE DETAILS PAGE (/templates/come-here-baby)
    console.log("\n--- 4. TESTING TEMPLATE DETAILS PAGE (/templates/come-here-baby) ---");
    await page.goto("http://localhost:3000/templates/come-here-baby", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 800));

    const detailContent = await page.evaluate(() => document.body.innerText);
    const hasCreateYoursBtn = detailContent.includes("Create Yours");
    const hasLinkIncluded = detailContent.includes("Private shareable link included");
    console.log(`   CTA Button ('Create Yours'): ${hasCreateYoursBtn ? "✅ PASSED" : "❌ FAILED"}`);
    console.log(`   Deliverable Info ('Private shareable link included'): ${hasLinkIncluded ? "✅ PASSED" : "❌ FAILED"}`);

    // 5. CONSOLE ERRORS
    console.log("\n--- 5. BROWSER CONSOLE ERRORS CHECK ---");
    if (consoleErrors.length === 0) {
      console.log("   ✅ ZERO console errors detected!");
    } else {
      console.log("   Console Errors:", consoleErrors);
    }

  } catch (err) {
    console.error("❌ Test error:", err.message);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }

  console.log("\n=================================================================");
  console.log("   CONVERSION FRICTION FIX VERIFICATION COMPLETE                ");
  console.log("=================================================================");
}

runConversionFrictionVerification();
