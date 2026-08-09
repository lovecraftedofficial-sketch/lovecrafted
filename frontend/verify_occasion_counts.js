const puppeteer = require('puppeteer');

async function verifyOccasionCounts() {
  console.log("=== TESTING DYNAMIC PUBLIC MARKETPLACE OCCASION CHIPS & FILTERS ===");
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

    console.log("Navigating to http://localhost:3000/templates...");
    await page.goto("http://localhost:3000/templates", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // Extract rendered occasion pills and their counts
    const pillCounts = await page.evaluate(() => {
      const pills = Array.from(document.querySelectorAll('button'));
      const result = {};
      pills.forEach(p => {
        const text = p.innerText || '';
        if (text.includes("All Occasions")) {
          const match = text.match(/\d+/);
          result["All Occasions"] = match ? parseInt(match[0]) : 0;
        } else if (text.includes("Anniversary")) {
          const match = text.match(/\d+/);
          result["Anniversary"] = match ? parseInt(match[0]) : 0;
        } else if (text.includes("Proposal")) {
          const match = text.match(/\d+/);
          result["Proposal"] = match ? parseInt(match[0]) : 0;
        } else if (text.includes("Wedding")) {
          const match = text.match(/\d+/);
          result["Wedding"] = match ? parseInt(match[0]) : 0;
        } else if (text.includes("Birthday")) {
          const match = text.match(/\d+/);
          result["Birthday"] = match ? parseInt(match[0]) : 0;
        } else if (text.includes("Long Distance")) {
          const match = text.match(/\d+/);
          result["Long Distance"] = match ? parseInt(match[0]) : 0;
        }
      });
      return result;
    });

    console.log("   Rendered Occasion Pill Chips & Counts:", pillCounts);

    assert(pillCounts["All Occasions"] === 2, "All Occasions count is exactly 2");
    assert(pillCounts["Anniversary"] === 2, "Anniversary chip present with count 2");
    assert(pillCounts["Proposal"] === 1, "Proposal chip present with count 1");
    assert(pillCounts["Wedding"] === undefined, "Wedding chip is NOT rendered (0 public templates)");
    assert(pillCounts["Birthday"] === 1, "Birthday chip present with count 1");
    assert(pillCounts["Long Distance"] === 1, "Long Distance chip present with count 1");

    // Test clicking each rendered occasion filter
    const testCases = [
      { slug: "anniversary", expectedCards: ["For My Baby", "Until Forever"], expectedLength: 2 },
      { slug: "proposal", expectedCards: ["Until Forever"], expectedLength: 1 },
      { slug: "birthday", expectedCards: ["Until Forever"], expectedLength: 1 },
      { slug: "long-distance", expectedCards: ["For My Baby"], expectedLength: 1 },
    ];

    for (const tc of testCases) {
      await page.goto(`http://localhost:3000/templates?occasion=${tc.slug}`, { waitUntil: 'networkidle0' });
      await new Promise(r => setTimeout(r, 500));

      const cards = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('article')).map(c => c.querySelector('h3')?.innerText || '');
      });

      console.log(`   Filter ?occasion=${tc.slug} rendered cards:`, cards);

      assert(cards.length === tc.expectedLength, `Filter ?occasion=${tc.slug} returns exactly ${tc.expectedLength} template(s)`);
      tc.expectedCards.forEach(expectedName => {
        assert(cards.some(c => c.includes(expectedName)), `Filter ?occasion=${tc.slug} includes '${expectedName}'`);
      });

      assert(!cards.some(c => c.includes("A Little Corner")), `Filter ?occasion=${tc.slug} does NOT include 'A Little Corner'`);
      assert(!cards.some(c => c.includes("Aurora Sample")), `Filter ?occasion=${tc.slug} does NOT include 'Aurora Sample'`);
      assert(!cards.some(c => c.includes("Sunset Love")), `Filter ?occasion=${tc.slug} does NOT include 'Sunset Love'`);
    }

  } catch (err) {
    console.error("  ❌ Test Error:", err.message);
    failed++;
  } finally {
    if (browser) await browser.close();
  }

  console.log("\n=== DYNAMIC OCCASION CHIPS VERIFICATION SUMMARY ===");
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed === 0) {
    console.log("🎉 DYNAMIC OCCASION CHIPS & FILTER VERIFICATION PASSED 100%!");
  } else {
    process.exit(1);
  }
}

verifyOccasionCounts();
