const puppeteer = require('puppeteer');

console.log("=== VERIFYING TEMPLATE MARKETPLACE COVER ARTWORK ===");

async function verifyCoverArtwork() {
  const consoleErrors = [];
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        console.error(`  [Console Error] ${text}`);
        consoleErrors.push(text);
      }
    });

    const targetUrl = "http://localhost:3000/templates";
    console.log(`Navigating to ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));

    // Extract cover images from rendered template card elements
    const cardsInfo = await page.evaluate(() => {
      const cards = document.querySelectorAll('.grid > div, article, [class*="group"]');
      const info = [];
      const seenTitles = new Set();

      cards.forEach((card) => {
        const titleEl = card.querySelector('h3, h2, [class*="title"]');
        const imgEl = card.querySelector('img');
        const badgeEl = card.querySelector('span');

        if (titleEl && imgEl) {
          const title = titleEl.innerText.trim();
          if (!seenTitles.has(title)) {
            seenTitles.add(title);
            info.push({
              title,
              img: imgEl.src,
              priceBadge: badgeEl ? badgeEl.innerText.trim() : ''
            });
          }
        }
      });
      return info;
    });

    console.log("\n--- Extracted Cover Artwork & Card Details ---");
    cardsInfo.forEach((card) => {
      console.log(`\nTemplate [${card.title}]:`);
      console.log(`  Price / Tier: ${card.priceBadge}`);
      console.log(`  Cover Image URL: ${card.img}`);
    });

    // Verify distinct image URLs
    const uniqueImages = new Set(cardsInfo.map(c => c.img));
    console.log(`\nTotal Template Cards Inspected: ${cardsInfo.length}`);
    console.log(`Unique Cover Artwork Images Count: ${uniqueImages.size}`);

    if (cardsInfo.length > 0 && uniqueImages.size === cardsInfo.length) {
      console.log("✅ PASSED: Every template card has 100% unique thematic artwork!");
    } else if (cardsInfo.length === 0) {
      console.warn("⚠️ Warning: Could not find card elements with given selector.");
    } else {
      console.error("❌ FAILED: Duplicate cover artwork detected!");
    }

    // Capture screenshot of Marketplace Explore Page
    await page.screenshot({ path: '../marketplace_cover_artwork_verify.png', fullPage: true });
    console.log("✅ Screenshot saved to marketplace_cover_artwork_verify.png");

  } catch (err) {
    console.error("❌ Test Error:", err);
  } finally {
    if (browser) await browser.close();
  }
}

verifyCoverArtwork();
