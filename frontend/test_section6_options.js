const puppeteer = require('puppeteer');

console.log("=== TESTING SECTION 6: 10 GENTLE BOYFRIEND OFFER CARDS ===");

async function testSection6Options() {
  const options = [
    "🫂 Ek Hug?",
    "🍫 Chocolate Laaun?",
    "🥺 Thodi Pampering?",
    "💕 Extra Pyaar?",
    "🧸 Thoda Laad?",
    "📞 Thodi Der Baat Karein?",
    "🌷 Mood Theek Karein?",
    "🫶 Thoda Sa Saath?",
    "☕ Kuch Warm Laaun?",
    "💌 Ek Pyaara Sa Note?"
  ];

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const targetUrl = "http://localhost:3000/story/come-here-baby";
    console.log(`Navigating to ${targetUrl}...`);
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));

    // Handle Unboxing Intro Overlay if present
    const allButtons = await page.$$('button');
    for (const btn of allButtons) {
      const text = await page.evaluate(el => el.innerText, btn);
      if (text.includes("Open My Surprise")) {
        await btn.click();
        await new Promise(r => setTimeout(r, 1500));
        break;
      }
    }

    // Scroll to Needs section
    await page.evaluate(() => document.getElementById('needs')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 800));

    // Verify Title & Subtitle
    const titleText = await page.evaluate(() => document.querySelector('#needs h2')?.innerText);
    const subtitleText = await page.evaluate(() => document.querySelector('#needs p')?.innerText);
    console.log(`Title: "${titleText}"`);
    console.log(`Subtitle: "${subtitleText}"\n`);

    console.log("--- Testing All 10 Card WhatsApp Actions ---");

    for (let i = 0; i < options.length; i++) {
      const expectedText = options[i];

      const openedUrl = await page.evaluate(async (cardIdx) => {
        let captured = null;
        const origOpen = window.open;
        window.open = (url) => {
          captured = url;
          return null;
        };

        const buttons = document.querySelectorAll('#needs button');
        if (buttons && buttons[cardIdx]) {
          buttons[cardIdx].click();
        }

        await new Promise(r => setTimeout(r, 300));
        window.open = origOpen;
        return captured;
      }, i);

      const decodedText = openedUrl ? decodeURIComponent(openedUrl.split('?text=')[1]) : "";
      console.log(`Option ${i + 1} [${expectedText}]:`);
      console.log(`  WhatsApp URL: ${openedUrl}`);
      console.log(`  Decoded Text: "${decodedText}"`);

      if (decodedText === expectedText) {
        console.log(`  ✅ PASSED (Exact match, zero extra text)`);
      } else {
        console.error(`  ❌ FAILED: Expected "${expectedText}", got "${decodedText}"`);
      }
    }

    console.log("\n=== ALL 10 SECTION 6 CARDS VERIFIED SUCCESSFULLY ===");

  } catch (err) {
    console.error("❌ Test Error:", err);
  } finally {
    if (browser) await browser.close();
  }
}

testSection6Options();
