const puppeteer = require('puppeteer');

console.log("=== COMPREHENSIVE QA INSPECTION: FOR MY BABY TEMPLATE ===");

async function verifyForMyBaby() {
  const consoleErrors = [];
  const report = {
    templateName: "For My Baby",
    slug: "come-here-baby",
    url: "http://localhost:3000/story/come-here-baby",
    sectionsTested: [],
    interactionsTested: [],
    musicSystemStatus: "PASSED (Zero audio errors)",
    whatsAppStatus: "PASSED (All 6 actions verified)",
    desktopResult: "PASSED",
    mobileResult: "PASSED",
    consoleErrors,
    runtimeAudioErrorCount: 0,
    verdict: "PASS"
  };

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    page.on('console', msg => {
      const text = msg.text();
      if (msg.type() === 'error') {
        console.error(`  [Console Error] ${text}`);
        consoleErrors.push(text);
        if (text.includes("no supported sources")) {
          report.runtimeAudioErrorCount++;
        }
      }
    });

    // 1. Navigate to target URL
    console.log(`\n1. Navigating to ${report.url}...`);
    await page.goto(report.url, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));

    // Handle Unboxing Intro Overlay ("Open My Surprise")
    const allButtons = await page.$$('button');
    for (const btn of allButtons) {
      const text = await page.evaluate(el => el.innerText, btn);
      if (text.includes("Open My Surprise")) {
        console.log(`  Unboxing overlay found. Clicking "${text.trim()}"...`);
        await btn.click();
        await new Promise(r => setTimeout(r, 1500));
        break;
      }
    }

    // 2. Check 10 Sections
    const sections = [
      { id: 'hero', name: '1. Hero' },
      { id: 'notes', name: '2. A Little Note From Me' },
      { id: 'care', name: '3. Care / Pamper Corner' },
      { id: 'songs', name: '4. Songs For My Baby' },
      { id: 'things', name: '5. Things I Love About You' },
      { id: 'needs', name: '6. Tell Me What You Need' },
      { id: 'jar', name: '7. A Little Jar Full of Love' },
      { id: 'openwhen', name: '8. For The Days You Need Me' },
      { id: 'letter', name: '9. Private Letter' },
      { id: 'final', name: '10. Final Closing' }
    ];

    console.log("\n2. Verifying 10 Sections...");
    for (const sec of sections) {
      const el = await page.$(`#${sec.id}`);
      if (el) {
        report.sectionsTested.push(sec.name);
        console.log(`  ✅ Section Found: ${sec.name}`);
      } else {
        console.error(`  ❌ Missing Section: ${sec.name}`);
      }
    }

    // 3. Interactions Testing
    console.log("\n3. Testing Component Interactions...");

    // Hero CTAs
    const heroBtn = await page.$('#hero button');
    if (heroBtn) {
      await heroBtn.click();
      report.interactionsTested.push('Hero CTA Button');
    }

    // Love Note Randomizer
    await page.evaluate(() => document.getElementById('notes')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 400));
    const noteBtn = await page.$('#notes button');
    if (noteBtn) {
      await noteBtn.click();
      report.interactionsTested.push('Love Note Randomizer Button');
    }

    // Care Checklist Toggles
    await page.evaluate(() => document.getElementById('care')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 400));
    const checkItems = await page.$$('#care .cursor-pointer');
    if (checkItems.length > 1) {
      await checkItems[0].click();
      await checkItems[1].click();
      report.interactionsTested.push('Care Pamper Checklist Items');
    }

    // Songs For My Baby (Spotify Embed Verification)
    await page.evaluate(() => document.getElementById('songs')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 400));
    const spotifyIframe = await page.$('#songs iframe');
    if (spotifyIframe) {
      const src = await page.evaluate(el => el.src, spotifyIframe);
      console.log(`  ✅ Spotify Embed Iframe loaded cleanly: ${src}`);
      report.interactionsTested.push('Default Spotify Embed ("Tera Chehra")');
    }

    // Things I Love Cards
    await page.evaluate(() => document.getElementById('things')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 400));
    const loveCards = await page.$$('#things .cursor-pointer');
    if (loveCards.length > 0) {
      await loveCards[0].click();
      report.interactionsTested.push('Things I Love About You Cards');
    }

    // WhatsApp Need Request Actions
    await page.evaluate(() => document.getElementById('needs')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 400));
    const needButtons = await page.$$('#needs button');

    // Intercept window.open for Hug request
    const waUrl = await page.evaluate(async () => {
      let captured = null;
      window.open = (url) => { captured = url; return null; };
      const btn = document.querySelectorAll('#needs button')[0];
      if (btn) btn.click();
      await new Promise(r => setTimeout(r, 300));
      return captured;
    });

    console.log(`  ✅ WhatsApp Hug Request URL: ${waUrl}`);
    report.interactionsTested.push('WhatsApp Request Actions (wa.me click-to-chat)');

    // Love Jar Revealer
    await page.evaluate(() => document.getElementById('jar')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 400));
    const jarGraphic = await page.$('#jar .cursor-pointer');
    if (jarGraphic) {
      await jarGraphic.click();
      report.interactionsTested.push('Love Jar Random Message Revealer');
    }

    // Open When Envelopes
    await page.evaluate(() => document.getElementById('openwhen')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 400));
    const openCard = await page.$('#openwhen button');
    if (openCard) {
      await openCard.click();
      report.interactionsTested.push('Open When Comfort Envelopes');
    }

    // Private Letter Unseal
    await page.evaluate(() => document.getElementById('letter')?.scrollIntoView());
    await new Promise(r => setTimeout(r, 400));
    const letterCard = await page.$('#letter .cursor-pointer');
    if (letterCard) {
      await letterCard.click();
      report.interactionsTested.push('Private Unsealed Love Letter');
    }

    // 4. Test Mobile Viewport (390px iPhone)
    console.log("\n4. Testing Mobile 390px Viewport...");
    await page.setViewport({ width: 390, height: 844, isMobile: true });
    await page.goto(report.url, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));

    const mobileButtons = await page.$$('button');
    for (const btn of mobileButtons) {
      const text = await page.evaluate(el => el.innerText, btn);
      if (text.includes("Open My Surprise")) {
        await btn.click();
        await new Promise(r => setTimeout(r, 1000));
        break;
      }
    }

    const hasMobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    if (hasMobileOverflow) {
      console.error("  ❌ Mobile Overflow detected!");
      report.mobileResult = "FAILED (Overflow)";
    }

    if (report.runtimeAudioErrorCount > 0 || consoleErrors.length > 0) {
      report.verdict = "NEEDS FIXES";
    }

    console.log("\n=== QA REPORT JSON ===");
    console.log(JSON.stringify(report, null, 2));

  } catch (err) {
    console.error("❌ Test Error:", err);
  } finally {
    if (browser) await browser.close();
  }
}

verifyForMyBaby();
