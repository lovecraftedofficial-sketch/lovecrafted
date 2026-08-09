const puppeteer = require('puppeteer');

async function testHeroVisual() {
  console.log("=== TESTING HERO PHOTOGRAPHIC BACKGROUND VISUAL ===");
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASSED: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${message}`);
      failed++;
    }
  }

  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log("Navigating to http://localhost:3000...");
    await page.goto("http://localhost:3000/", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    const heroImageInfo = await page.evaluate(() => {
      const img = document.querySelector('section img[src*="dark_rose_ambient_hero.jpg"]');
      if (!img) return null;
      return {
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      };
    });

    console.log("   Hero Image Info:", heroImageInfo);
    assert(heroImageInfo !== null, "Hero dark rose photographic image element is present");
    assert(heroImageInfo && heroImageInfo.complete && heroImageInfo.naturalWidth > 0, "Hero dark rose image asset loaded successfully with natural dimensions");

    // Take screenshot of hero section for artifact review
    const heroElement = await page.$('section');
    if (heroElement) {
      await heroElement.screenshot({ path: 'C:/Users/Pawan Devi/.gemini/antigravity/brain/950bd611-ac9b-4428-b18c-4e323d09b4aa/hero_rose_background_verification.png' });
      console.log("   Saved hero screenshot to artifacts: hero_rose_background_verification.png");
    }

  } catch (err) {
    console.error("  ❌ Test Error:", err.message);
    failed++;
  } finally {
    if (browser) await browser.close();
  }

  console.log("\n=== HERO VISUAL VERIFICATION SUMMARY ===");
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed === 0) {
    console.log("🎉 HERO ROSE + CANDLELIGHT BACKGROUND VERIFICATION PASSED 100%!");
  } else {
    process.exit(1);
  }
}

testHeroVisual();
