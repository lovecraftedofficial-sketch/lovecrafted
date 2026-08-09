const puppeteer = require('puppeteer');

async function testMarketplaceCoverArtwork() {
  console.log("=== TESTING MARKETPLACE COVER ARTWORK UPDATE ===");
  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    await page.goto("http://localhost:3000/templates", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    const cardData = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('article, [data-testid^="template-card-"]'));
      return cards.map(c => {
        const title = c.querySelector('h3')?.innerText || '';
        const img = c.querySelector('img')?.src || '';
        const badges = Array.from(c.querySelectorAll('span, div')).map(e => e.innerText).join(' ');
        return { title, img, badges };
      });
    });

    console.log("  Marketplace Cards Extracted:");
    cardData.forEach(c => {
      console.log(`  • Title: "${c.title}" | Img: "${c.img.slice(0, 70)}..."`);
    });

    const chbCard = cardData.find(c => c.title.includes("For My Baby"));
    if (chbCard) {
      if (chbCard.img.includes("/images/for_my_baby_cover.jpg")) {
        console.log("  ✅ PASSED: 'For My Baby' template card uses the new romantic couple artwork!");
      } else {
        console.error(`  ❌ FAILED: Unexpected cover image URL: ${chbCard.img}`);
        process.exit(1);
      }
    } else {
      console.error("  ❌ FAILED: 'For My Baby' card not found on templates page!");
      process.exit(1);
    }
  } catch (err) {
    console.error("  ❌ Test Execution Error:", err.message);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
  console.log("🎉 MARKETPLACE COVER ARTWORK VERIFICATION COMPLETE!");
}

testMarketplaceCoverArtwork();
