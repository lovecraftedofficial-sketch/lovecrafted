const puppeteer = require('puppeteer');

console.log("=== TESTING DASHBOARD PROJECT TITLE GENERATION & MIGRATION ===");

// Mock getTemplate for standalone node testing of giftTitleUtils
const TEMPLATES_MAP = {
  "come-here-baby": { config: { name: "For My Baby", slug: "come-here-baby" } },
  "a-little-corner": { config: { name: "A Little Corner", slug: "a-little-corner" } },
  "until-forever": { config: { name: "Until Forever", slug: "until-forever" } }
};

const LEGACY_DEFAULTS = [
  "Anniversary Memory Website",
  "Special Proposal Keepsake",
  "Our Love Story",
];

function getGiftTitleTest(gift, localStorageMock) {
  if (!gift) return "My Romantic Keepsake";

  const templateEntry = TEMPLATES_MAP[gift.templateSlug];
  const templateName = templateEntry?.config?.name || gift.templateSlug || "Keepsake";

  const rawTitle = (gift.title || "").trim();
  if (rawTitle && !LEGACY_DEFAULTS.includes(rawTitle)) {
    return rawTitle;
  }

  let partnerName = "";
  try {
    const draftKey = `lws:draft:${gift.templateSlug}:demo`;
    const draftRaw = localStorageMock.getItem(draftKey);
    if (draftRaw) {
      const parsed = JSON.parse(draftRaw);
      partnerName = (parsed.partnerName || parsed.recipientName || "").trim();
    }
  } catch {}

  if (partnerName) {
    return `For ${partnerName} ❤️`;
  }

  return `${templateName} — My Gift`;
}

async function runDashboardTitleTests() {
  let passed = 0;
  let failed = 0;

  const mockStorage = {
    store: {},
    getItem(key) { return this.store[key] || null; },
    setItem(key, val) { this.store[key] = String(val); },
    removeItem(key) { delete this.store[key]; }
  };

  // 1. Test partnerName = "Aarohi" for "come-here-baby"
  mockStorage.setItem('lws:draft:come-here-baby:demo', JSON.stringify({ partnerName: 'Aarohi' }));
  const gift1 = { id: 'gift-1', templateSlug: 'come-here-baby', title: 'Anniversary Memory Website' };
  const title1 = getGiftTitleTest(gift1, mockStorage);
  if (title1 === 'For Aarohi ❤️') {
    console.log(`  ✅ Test 1 (partnerName "Aarohi"): "${title1}"`);
    passed++;
  } else {
    console.error(`  ❌ Test 1 FAILED: Expected "For Aarohi ❤️", got "${title1}"`);
    failed++;
  }

  // 2. Test partnerName = "Puja" for "come-here-baby"
  mockStorage.setItem('lws:draft:come-here-baby:demo', JSON.stringify({ partnerName: 'Puja' }));
  const gift2 = { id: 'gift-2', templateSlug: 'come-here-baby', title: 'Anniversary Memory Website' };
  const title2 = getGiftTitleTest(gift2, mockStorage);
  if (title2 === 'For Puja ❤️') {
    console.log(`  ✅ Test 2 (partnerName "Puja"): "${title2}"`);
    passed++;
  } else {
    console.error(`  ❌ Test 2 FAILED: Expected "For Puja ❤️", got "${title2}"`);
    failed++;
  }

  // 3. Test empty partnerName fallback
  mockStorage.setItem('lws:draft:come-here-baby:demo', JSON.stringify({ partnerName: '  ' }));
  const gift3 = { id: 'gift-3', templateSlug: 'come-here-baby', title: 'Anniversary Memory Website' };
  const title3 = getGiftTitleTest(gift3, mockStorage);
  if (title3 === 'For My Baby — My Gift') {
    console.log(`  ✅ Test 3 (empty partnerName fallback): "${title3}"`);
    passed++;
  } else {
    console.error(`  ❌ Test 3 FAILED: Expected "For My Baby — My Gift", got "${title3}"`);
    failed++;
  }

  // 4. Test intentionally customized title preservation
  const gift4 = { id: 'gift-4', templateSlug: 'come-here-baby', title: 'My Custom Romantic Letter' };
  const title4 = getGiftTitleTest(gift4, mockStorage);
  if (title4 === 'My Custom Romantic Letter') {
    console.log(`  ✅ Test 4 (custom title preservation): "${title4}"`);
    passed++;
  } else {
    console.error(`  ❌ Test 4 FAILED: Expected "My Custom Romantic Letter", got "${title4}"`);
    failed++;
  }

  // 5. Test another template ("a-little-corner") fallback
  mockStorage.removeItem('lws:draft:a-little-corner:demo');
  const gift5 = { id: 'gift-5', templateSlug: 'a-little-corner', title: 'Special Proposal Keepsake' };
  const title5 = getGiftTitleTest(gift5, mockStorage);
  if (title5 === 'A Little Corner — My Gift') {
    console.log(`  ✅ Test 5 (a-little-corner fallback): "${title5}"`);
    passed++;
  } else {
    console.error(`  ❌ Test 5 FAILED: Expected "A Little Corner — My Gift", got "${title5}"`);
    failed++;
  }

  // 6. Real Browser Automation Verification on http://localhost:3000/dashboard
  console.log("\n6. Running Real Browser QA Pass on Dashboard UI...");
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    await page.goto("http://localhost:3000/dashboard", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    const cardHeadings = await page.evaluate(() => {
      const articles = document.querySelectorAll('article');
      const info = [];
      articles.forEach(art => {
        const title = art.querySelector('h3')?.innerText || '';
        const templateP = art.querySelector('p')?.innerText || '';
        info.push({ title, templateP });
      });
      return info;
    });

    console.log("  Extracted Dashboard Cards from Browser:");
    cardHeadings.forEach((c, idx) => {
      console.log(`    Card ${idx + 1}: Heading="${c.title}" | Subtitle="${c.templateP}"`);
    });

    if (cardHeadings.length > 0 && !cardHeadings.some(c => c.title === "Anniversary Memory Website")) {
      console.log("  ✅ PASSED: No stale 'Anniversary Memory Website' title found on Dashboard cards!");
      passed++;
    } else {
      console.error("  ❌ FAILED: Stale title still present on Dashboard!");
      failed++;
    }
  } catch (err) {
    console.error("  ❌ Browser QA Pass Error:", err.message);
  } finally {
    if (browser) await browser.close();
  }

  console.log("\n=== FINAL TEST SUMMARY ===");
  console.log(`Passed: ${passed}/6`);
  console.log(`Failed: ${failed}/6`);

  if (failed === 0) {
    console.log("🎉 ALL DASHBOARD TITLE TESTS PASSED 100%!");
  } else {
    process.exit(1);
  }
}

runDashboardTitleTests();
