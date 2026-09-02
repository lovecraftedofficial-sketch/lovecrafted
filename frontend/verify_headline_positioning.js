const puppeteer = require('puppeteer');

async function verifyHeadlinePositioning() {
  console.log("=== TESTING HERO HEADLINE POSITIONING CHANGE ===");
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  // 1. DESKTOP VIEWPORT TEST (1440x900)
  console.log("\n1. Testing Desktop Render (1440x900)...");
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto("http://localhost:3000/", { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  const desktopTitleText = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? h1.innerText.replace(/\n/g, ' ') : '';
  });

  console.log(`   Desktop Headline Text: "${desktopTitleText}"`);
  const desktopMatches = desktopTitleText.includes("Turn your memories") && desktopTitleText.includes("digital keepsake they'll never forget");
  console.log(`   Desktop Headline Verification: ${desktopMatches ? "✅ PASSED" : "❌ FAILED"}`);

  // Test CTA button navigation via href="/templates"
  await page.evaluate(() => {
    const cta = Array.from(document.querySelectorAll('a')).find(a => a.innerText.includes("Explore Templates"));
    if (cta) cta.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const marketplaceUrl = page.url();
  console.log(`   CTA Explore Templates Navigation URL: ${marketplaceUrl}`);
  const ctaNavWorks = marketplaceUrl.includes("/templates");
  console.log(`   CTA Navigation Verification: ${ctaNavWorks ? "✅ PASSED" : "❌ FAILED"}`);

  // 2. MOBILE VIEWPORT TEST (390x844 - iPhone 13)
  console.log("\n2. Testing Mobile Render (390x844)...");
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto("http://localhost:3000/", { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  const mobileTitleText = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? h1.innerText.replace(/\n/g, ' ') : '';
  });

  const mobileOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });

  console.log(`   Mobile Headline Text: "${mobileTitleText}"`);
  console.log(`   Mobile Horizontal Overflow: ${mobileOverflow ? "❌ DETECTED" : "✅ NONE (PASSED)"}`);

  // 3. CONSOLE & COMPILATION ERRORS
  console.log("\n3. Console Errors Check:");
  if (consoleErrors.length === 0) {
    console.log("   ✅ ZERO console errors detected!");
  } else {
    console.log("   Console Errors:", consoleErrors);
  }

  await browser.close();

  if (desktopMatches && ctaNavWorks && !mobileOverflow && consoleErrors.length === 0) {
    console.log("\n🎉 ALL HERO HEADLINE POSITIONING VERIFICATION CHECKS PASSED 100%!");
  } else {
    process.exit(1);
  }
}

verifyHeadlinePositioning();
