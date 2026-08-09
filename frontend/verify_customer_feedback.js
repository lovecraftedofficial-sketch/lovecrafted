const puppeteer = require('puppeteer');

async function verifyCustomerFeedback() {
  console.log("=== TESTING CUSTOMER FEEDBACK SYSTEM & MODERATION ===");
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

    console.log("1. Navigating to Landing Page (http://localhost:3000)...");
    await page.goto("http://localhost:3000/", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // Scroll to feedback section
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.scrollIntoView();
    });
    await new Promise(r => setTimeout(r, 500));

    const formExists = await page.evaluate(() => {
      return document.querySelector('form') !== null && document.body.innerText.includes("How did LoveCrafted feel?");
    });
    assert(formExists, "Customer Feedback section and form render on public landing page");

    // 2. Submit new feedback with permission = true
    console.log("2. Submitting test customer feedback with permission...");
    await page.type('textarea', 'LoveCrafted made our anniversary truly unforgettable! The starry sky and vinyl player were magical.');
    await page.type('input[placeholder*="call you"]', 'Rohan & Priya');
    await page.click('input[type="checkbox"]');
    
    await new Promise(r => setTimeout(r, 500));
    await page.click('button[type="submit"]');

    await new Promise(r => setTimeout(r, 1500));

    const successMsgVisible = await page.evaluate(() => {
      return document.body.innerText.includes("Thank you for sharing a little of your story with us.");
    });
    assert(successMsgVisible, "Feedback submission displays elegant inline success state without page refresh");

    // 3. Verify Dashboard Moderation Area
    console.log("3. Navigating to Dashboard Feedback Moderation (/dashboard)...");
    await page.goto("http://localhost:3000/dashboard", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // Click Feedback tab in Dashboard
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const fbBtn = buttons.find(b => b.innerText.includes("Feedback"));
      if (fbBtn) fbBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    const dbContent = await page.evaluate(() => {
      return {
        text: document.body.innerText,
        storage: localStorage.getItem('lws:feedback_records')
      };
    });

    console.log("   DEBUG STORAGE AFTER SUBMIT:", dbContent.storage);
    const moderationPanelVisible = dbContent.text.includes("Customer Feedback & Review Moderation") && dbContent.text.includes("Rohan & Priya");
    assert(moderationPanelVisible, "Dashboard Feedback Moderation tab displays submitted feedback with customer details");

    // 4. Moderate feedback: Approve for public testimonials
    console.log("4. Approving feedback for public testimonials...");
    await page.evaluate(() => {
      const approveBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes("Approve for Testimonials"));
      if (approveBtn) approveBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    const approvedBadgeVisible = await page.evaluate(() => {
      return document.body.innerText.includes("Approved & Live");
    });
    assert(approvedBadgeVisible, "Feedback status updated to 'Approved & Live'");

    const storageAfterApprove = await page.evaluate(() => localStorage.getItem('lws:feedback_records'));
    console.log("   DEBUG STORAGE AFTER APPROVE:", storageAfterApprove);

    // 5. Verify approved feedback now appears in public Testimonials on landing page
    console.log("5. Verifying approved feedback renders on public landing page...");
    await page.goto("http://localhost:3000/", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    const pageText = await page.evaluate(() => document.body.innerText);
    console.log("   STEP 5 PAGE TEXT PREVIEW:", pageText.substring(pageText.indexOf("From the people"), pageText.indexOf("From the people") + 800));

    const publicTestimonialContainsRohan = pageText.includes("Rohan & Priya") || pageText.includes("anniversary truly unforgettable");
    assert(publicTestimonialContainsRohan, "Approved feedback with permission appears in public landing page Testimonials section!");

  } catch (err) {
    console.error("  ❌ Test Error:", err.message);
    failed++;
  } finally {
    if (browser) await browser.close();
  }

  console.log("\n=== FEEDBACK SYSTEM VERIFICATION SUMMARY ===");
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed === 0) {
    console.log("🎉 CUSTOMER FEEDBACK & MODERATION VERIFICATION PASSED 100%!");
  } else {
    process.exit(1);
  }
}

verifyCustomerFeedback();
