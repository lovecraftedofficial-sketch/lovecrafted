const puppeteer = require('puppeteer');

console.log("=== FINAL CONFIGURATION AUDIT: FOR MY BABY TEMPLATE ===");

async function runFinalConfigAudit() {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // 1. Audit Creator Studio Section Count for "come-here-baby"
    const editorUrl = "http://localhost:3000/dashboard/websites/come-here-baby/edit";
    console.log(`\n1. Navigating to Creator Studio (${editorUrl})...`);
    await page.goto(editorUrl, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));

    const sectionCountText = await page.evaluate(() => {
      const headerSpan = document.querySelector('aside div div span:nth-child(2)');
      return headerSpan ? headerSpan.innerText.trim() : '';
    });

    console.log(`  Creator Studio Section Count Label for "For My Baby": "${sectionCountText}"`);

    // 2. Audit Creator Studio Section Count for "a-little-corner"
    const alcEditorUrl = "http://localhost:3000/dashboard/websites/a-little-corner/edit";
    console.log(`\n2. Navigating to Creator Studio (${alcEditorUrl})...`);
    await page.goto(alcEditorUrl, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));

    const alcSectionCountText = await page.evaluate(() => {
      const headerSpan = document.querySelector('aside div div span:nth-child(2)');
      return headerSpan ? headerSpan.innerText.trim() : '';
    });

    console.log(`  Creator Studio Section Count Label for "A Little Corner": "${alcSectionCountText}"`);

    console.log("\n=== AUDIT SUMMARY ===");
    console.log(`- For My Baby displays "10 Sections"? ${sectionCountText === "10 Sections" ? "YES ✅" : "NO ❌"}`);
    console.log(`- A Little Corner displays "9 Sections"? ${alcSectionCountText === "9 Sections" ? "YES ✅" : "NO ❌"}`);

  } catch (err) {
    console.error("❌ Audit Error:", err);
  } finally {
    if (browser) await browser.close();
  }
}

runFinalConfigAudit();
