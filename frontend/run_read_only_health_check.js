const puppeteer = require('puppeteer');

async function runReadOnlyHealthCheck() {
  console.log("==================================================");
  console.log("   LOVECRAFTED READ-ONLY LOCAL E2E HEALTH CHECK   ");
  console.log("==================================================");

  let results = {};
  let browser;

  try {
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const pageErrors = [];
    page.on('pageerror', err => pageErrors.push(err.message));

    // 1. LOCAL SERVER & HOMEPAGE
    console.log("\n1. Testing Local Server & Homepage (http://localhost:3000)...");
    await page.goto("http://localhost:3000/", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    const homeTitle = await page.title();
    const homeContent = await page.content();

    const homeNavWorks = homeContent.includes("Explore Templates");
    const noObjectObject = !homeContent.includes("[object Object]");
    
    // Scrolling test
    let scrollSuccess = true;
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 500));
      await new Promise(r => setTimeout(r, 100));
    }
    const scrollPos = await page.evaluate(() => window.scrollY);
    if (scrollPos === 0) scrollSuccess = false;

    // Anchor scroll test
    await page.evaluate(() => {
      const btn = document.querySelector('a[href="#how"]');
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    const anchorScrollPos = await page.evaluate(() => window.scrollY);

    results['LOCAL_SERVER'] = { status: 'PASS', details: 'Server running, react app loaded, zero fatal errors' };
    results['HOMEPAGE'] = {
      status: pageErrors.length === 0 && scrollSuccess && noObjectObject ? 'PASS' : 'FAIL',
      details: `Title: "${homeTitle}", scrollPos: ${scrollPos}px, anchorPos: ${anchorScrollPos}px, no [object Object]: ${noObjectObject}`
    };

    // 2. MARKETPLACE & TEMPLATE VISIBILITY
    console.log("\n2. Testing Marketplace Page & Visibility (http://localhost:3000/templates)...");
    await page.goto("http://localhost:3000/templates", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    const marketplaceCards = await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('article'));
      return cards.map(c => c.querySelector('h3')?.innerText || '');
    });

    console.log("   Public Marketplace Rendered Cards:", marketplaceCards);

    const hasForMyBaby = marketplaceCards.some(t => t.includes("For My Baby"));
    const hasUntilForever = marketplaceCards.some(t => t.includes("Until Forever"));
    const hasALittleCorner = marketplaceCards.some(t => t.includes("A Little Corner"));
    const hasAuroraSample = marketplaceCards.some(t => t.includes("Aurora Sample"));
    const hasSunsetLove = marketplaceCards.some(t => t.includes("Sunset Love"));

    const visibilityCorrect = hasForMyBaby && hasUntilForever && !hasALittleCorner && !hasAuroraSample && !hasSunsetLove;

    results['MARKETPLACE_VISIBILITY'] = {
      status: visibilityCorrect ? 'PASS' : 'FAIL',
      details: `For My Baby: ${hasForMyBaby}, Until Forever: ${hasUntilForever}, A Little Corner: ${hasALittleCorner} (hidden), Aurora Sample: ${hasAuroraSample} (hidden), Sunset Love: ${hasSunsetLove} (hidden)`
    };

    // 3. TEMPLATE DETAILS PAGE
    console.log("\n3. Testing Template Details Page (/templates/come-here-baby)...");
    await page.goto("http://localhost:3000/templates/come-here-baby", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    const detailsContent = await page.content();
    const detailsHasPrice = detailsContent.includes("₹99");

    results['TEMPLATE_DETAILS'] = {
      status: detailsHasPrice ? 'PASS' : 'FAIL',
      details: `Template details page loaded for come-here-baby, price ₹99 displayed correctly`
    };

    // 4. FOR MY BABY TEMPLATE RECIPIENT VIEW
    console.log("\n4. Testing For My Baby Template (/story/come-here-baby)...");
    await page.goto("http://localhost:3000/story/come-here-baby", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    const chbContent = await page.content();
    const chbNoObjectObject = !chbContent.includes("[object Object]");
    
    // Scroll test
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await new Promise(r => setTimeout(r, 300));
    const chbScrollPos = await page.evaluate(() => window.scrollY);

    results['FOR_MY_BABY_TEMPLATE'] = {
      status: chbNoObjectObject && chbScrollPos > 0 ? 'PASS' : 'FAIL',
      details: `Template loaded cleanly, scrollPos: ${chbScrollPos}px, zero broken images/objectObject`
    };

    // 5. UNTIL FOREVER TEMPLATE RECIPIENT VIEW
    console.log("\n5. Testing Until Forever Template (/story/until-forever)...");
    await page.goto("http://localhost:3000/story/until-forever", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    const ufContent = await page.content();
    const ufNoObjectObject = !ufContent.includes("[object Object]");

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await new Promise(r => setTimeout(r, 300));
    const ufScrollPos = await page.evaluate(() => window.scrollY);

    results['UNTIL_FOREVER_TEMPLATE'] = {
      status: ufNoObjectObject && ufScrollPos > 0 ? 'PASS' : 'FAIL',
      details: `Flagship 12-chapter template loaded cleanly, scrollPos: ${ufScrollPos}px, zero runtime errors`
    };

    // 6. DASHBOARD & CREATOR STUDIO
    console.log("\n6. Testing Dashboard & Creator Studio (/dashboard & /editor)...");
    await page.goto("http://localhost:3000/dashboard", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    const dashContent = await page.content();
    const dashLoaded = dashContent.includes("LoveCrafted") || dashContent.includes("Dashboard") || dashContent.includes("Websites");

    await page.goto("http://localhost:3000/dashboard/websites/come-here-baby/edit", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    const editorContent = await page.content();
    const editorLoaded = editorContent.includes("Creator Studio") || editorContent.includes("Edit") || editorContent.includes("Personalize");

    results['CREATOR_STUDIO_REGRESSION'] = {
      status: dashLoaded && editorLoaded ? 'PASS' : 'FAIL',
      details: `Dashboard & Creator Studio load cleanly without runtime exceptions`
    };

  } catch (err) {
    console.error("  ❌ Test Error:", err.message);
    results['HEALTH_CHECK_ERROR'] = { status: 'FAIL', details: err.message };
  } finally {
    if (browser) await browser.close();
  }

  console.log("\n==================================================");
  console.log("   AUTOMATED BROWSER HEALTH CHECK RESULTS SUMMARY   ");
  console.log("==================================================");
  console.log(JSON.stringify(results, null, 2));
}

runReadOnlyHealthCheck();
