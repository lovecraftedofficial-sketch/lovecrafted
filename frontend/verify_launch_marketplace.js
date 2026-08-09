const puppeteer = require('puppeteer');

async function testLaunchMarketplace() {
  console.log("=== TESTING LAUNCH MARKETPLACE & HOMEPAGE PRICING ===");
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

    // 1. Test Homepage
    console.log("\n1. Testing Homepage (http://localhost:3000)...");
    await page.goto("http://localhost:3000/", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    const homeContent = await page.content();
    assert(homeContent.includes("Choose your story"), "Homepage headline includes 'Choose your story'");
    assert(homeContent.includes("Every LoveCrafted website is made to feel personal"), "Homepage subtitle matches Launch Pricing copy");
    assert((homeContent.includes("SWEET") || homeContent.includes("Sweet")) && homeContent.includes("₹99"), "Homepage includes Sweet & Personal card at ₹99");
    assert(homeContent.includes("CINEMATIC") && homeContent.includes("₹299"), "Homepage includes Cinematic card at ₹299");

    const featuredTitles = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('[data-testid="landing-featured-section"] article h3'));
      return cards.map(c => c.innerText);
    });

    console.log("   Featured Templates on Homepage:", featuredTitles);
    assert(!featuredTitles.some(t => t.includes("A Little Corner")), "Homepage featured section does NOT list 'A Little Corner'");
    assert(featuredTitles.some(t => t.includes("For My Baby")), "Homepage featured section lists 'For My Baby'");
    assert(featuredTitles.some(t => t.includes("Until Forever")), "Homepage featured section lists 'Until Forever'");

    // 2. Test Marketplace Page
    console.log("\n2. Testing Marketplace Page (http://localhost:3000/templates)...");
    await page.goto("http://localhost:3000/templates", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    const marketplaceCards = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('article'));
      return cards.map(c => {
        const title = c.querySelector('h3')?.innerText || '';
        return title;
      });
    });

    console.log("   Marketplace Cards:", marketplaceCards);
    assert(!marketplaceCards.some(t => t.includes("A Little Corner")), "Marketplace page does NOT list 'A Little Corner' for new purchases");
    assert(marketplaceCards.some(t => t.includes("For My Baby")), "Marketplace page lists 'For My Baby' at launch price");
    assert(marketplaceCards.some(t => t.includes("Until Forever")), "Marketplace page lists 'Until Forever' at launch price");

  } catch (err) {
    console.error("  ❌ Test Error:", err.message);
    failed++;
  } finally {
    if (browser) await browser.close();
  }

  console.log("\n=== FINAL LAUNCH MARKETPLACE TEST SUMMARY ===");
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed === 0) {
    console.log("🎉 LAUNCH MARKETPLACE VERIFICATION PASSED 100%!");
  } else {
    process.exit(1);
  }
}

testLaunchMarketplace();
