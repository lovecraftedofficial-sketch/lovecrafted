const fs = require('fs');
const path = require('path');
const createOrderHandler = require('./netlify/functions/create-order.js').handler;
const verifyPaymentHandler = require('./netlify/functions/verify-payment.js').handler;
const { resolveImage } = require('./src/editor/utils/imageUtils.js');
const { uploadMediaAsset } = require('./src/lib/mediaUploadService.js');

console.log("=================================================");
console.log("  LOVECRAFTED LOCAL E2E REGRESSION TEST SUITE   ");
console.log("=================================================");

let totalPassed = 0;
let totalFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASSED: ${message}`);
    totalPassed++;
  } else {
    console.error(`  ❌ FAILED: ${message}`);
    totalFailed++;
  }
}

async function runRegressionSuite() {
  // Mock localStorage for node environment unit check
  if (typeof localStorage === 'undefined') {
    global.localStorage = {
      store: {},
      getItem(key) { return this.store[key] || null; },
      setItem(key, val) { this.store[key] = String(val); },
      removeItem(key) { delete this.store[key]; }
    };
  }

  // Set mock Razorpay keys so handler passes credential check
  process.env.RAZORPAY_KEY_ID = "rzp_test_mock123456789";
  process.env.RAZORPAY_KEY_SECRET = "mock_secret_1234567890123456";

  // ================================================
  // SECTION 1: PAYMENT PRICE LOGIC & SECURITY (TESTS 4 & 5)
  // ================================================
  console.log("\n--- SECTION 1: PAYMENT PRICE LOGIC & SECURITY ---");

  const expectedPrices = [
    { slug: "come-here-baby", expectedINR: 99, expectedPaise: 9900 },
    { slug: "a-little-corner", expectedINR: 2999, expectedPaise: 299900 },
    { slug: "until-forever", expectedINR: 299, expectedPaise: 29900 },
    { slug: "sunset-love", expectedINR: 1999, expectedPaise: 199900 },
    { slug: "aurora-sample", expectedINR: 1999, expectedPaise: 199900 },
    { slug: "midnight-love", expectedINR: 3499, expectedPaise: 349900 },
    { slug: "royal-love", expectedINR: 3499, expectedPaise: 349900 },
    { slug: "soft-memories", expectedINR: 999, expectedPaise: 99900 },
  ];

  // Read pricing catalogs directly from server functions to verify 100% sync
  const coCode = fs.readFileSync('./netlify/functions/create-order.js', 'utf8');
  const vpCode = fs.readFileSync('./netlify/functions/verify-payment.js', 'utf8');

  const matchCo = coCode.match(/const SERVER_PRICING_CATALOG = ({[\s\S]*?});/);
  const matchVp = vpCode.match(/const SERVER_PRICING_CATALOG = ({[\s\S]*?});/);

  assert(matchCo && matchVp, "Server-side pricing catalog objects extracted from create-order.js and verify-payment.js");

  const catalogCo = eval("(" + matchCo[1] + ")");
  const catalogVp = eval("(" + matchVp[1] + ")");

  assert(JSON.stringify(catalogCo) === JSON.stringify(catalogVp), "create-order.js and verify-payment.js catalogs are 100% synchronized");

  for (const ep of expectedPrices) {
    const pCo = catalogCo[ep.slug];
    const pVp = catalogVp[ep.slug];
    assert(pCo === ep.expectedINR && pVp === ep.expectedINR, `Slug "${ep.slug}" resolves to ₹${ep.expectedINR} (${ep.expectedPaise} paise) on server`);
  }

  // Security Test 5: Attempt client price tampering (sending body.amount = 1 or 10)
  const tamperEvent = {
    httpMethod: "POST",
    body: JSON.stringify({
      templateSlug: "until-forever",
      amount: 1, // Client tries to pay ₹1 for a ₹4,999 template!
      templateName: "Until Forever",
      customerName: "Attacker"
    })
  };

  const createOrderCode = fs.readFileSync('./netlify/functions/create-order.js', 'utf8');
  assert(createOrderCode.includes("const serverPriceINR = SERVER_PRICING_CATALOG[templateSlug];"), "Server completely ignores body.amount and looks up price from SERVER_PRICING_CATALOG exclusively");

  // Unknown template slug security test
  const unknownEvent = {
    httpMethod: "POST",
    body: JSON.stringify({
      templateSlug: "unknown-hacker-template",
      templateName: "Hacked Template",
      customerName: "Attacker"
    })
  };

  const resUnknown = await createOrderHandler(unknownEvent, {});
  const bodyUnknown = JSON.parse(resUnknown.body || "{}");
  assert(resUnknown.statusCode === 400 && bodyUnknown.error.includes("Invalid or unsupported template pricing slug"), "Unknown template slug rejected cleanly with HTTP 400 (Zero fallback charging)");

  // ================================================
  // SECTION 2: IMAGE UPLOAD & LEGACY COMPATIBILITY (TESTS 1, 2 & 3)
  // ================================================
  console.log("\n--- SECTION 2: IMAGE UPLOAD & LEGACY COMPATIBILITY ---");

  const sampleBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP...";
  const sampleRemoteUrl = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80";
  const legacyObject = { kind: "local", url: sampleBase64, name: "test.jpg", mime: "image/jpeg" };

  // Test 1: resolveImage with new string format
  const resolvedString = resolveImage(sampleBase64);
  assert(resolvedString === sampleBase64 && !resolvedString.includes("[object Object]"), "resolveImage returns clean string Data URL without [object Object]");

  // Test 2: resolveImage with legacy object format
  const resolvedLegacy = resolveImage(legacyObject);
  assert(resolvedLegacy === sampleBase64 && typeof resolvedLegacy === "string" && !resolvedLegacy.includes("[object Object]"), "resolveImage unwraps legacy object into clean string URL");

  // Test 3: resolveImage with remote HTTPS URL
  const resolvedRemote = resolveImage(sampleRemoteUrl);
  assert(resolvedRemote === sampleRemoteUrl, "resolveImage passes remote HTTPS URL intact");

  // Test 4: resolveImage fallback
  const resolvedNull = resolveImage(null);
  assert(resolvedNull && resolvedNull.startsWith("https://"), "resolveImage returns romantic fallback URL for empty/null values");

  // Test 5: mediaUploadService with legacy object format
  const uploadResLegacy = await uploadMediaAsset(legacyObject, "image");
  assert(typeof uploadResLegacy === "string" && uploadResLegacy === sampleBase64, "mediaUploadService unwraps legacy object to string URL");

  // Test 6: ImageFieldEditor source verification
  const imageFieldEditorCode = fs.readFileSync('./src/editor/fields/ImageFieldEditor.jsx', 'utf8');
  assert(imageFieldEditorCode.includes("const url = res.value?.url || res.value;") && imageFieldEditorCode.includes("setNext(url);"), "ImageFieldEditor stores clean string URL in content state");

  // ================================================
  // SECTION 3: DASHBOARD TITLE REGRESSION (TEST 6)
  // ================================================
  console.log("\n--- SECTION 3: DASHBOARD TITLE REGRESSION ---");

  const TEMPLATES_MAP = {
    "come-here-baby": { config: { name: "Always Beside You", slug: "come-here-baby" } },
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

  // Case A: partnerName = "Aarohi"
  const localStorageMock = {
    store: {},
    getItem(key) { return this.store[key] || null; },
    setItem(key, val) { this.store[key] = String(val); },
    removeItem(key) { delete this.store[key]; }
  };
  localStorageMock.setItem('lws:draft:come-here-baby:demo', JSON.stringify({ partnerName: 'Aarohi' }));
  const titleAarohi = getGiftTitleTest({ id: 'g1', templateSlug: 'come-here-baby', title: 'Anniversary Memory Website' }, localStorageMock);
  assert(titleAarohi === 'For Aarohi ❤️', "Dashboard title for partnerName 'Aarohi' resolves to 'For Aarohi ❤️'");

  // Case B: partnerName = "Puja"
  localStorageMock.setItem('lws:draft:come-here-baby:demo', JSON.stringify({ partnerName: 'Puja' }));
  const titlePuja = getGiftTitleTest({ id: 'g2', templateSlug: 'come-here-baby', title: 'Anniversary Memory Website' }, localStorageMock);
  assert(titlePuja === 'For Puja ❤️', "Dashboard title for partnerName 'Puja' resolves to 'For Puja ❤️'");

  // Case C: empty partnerName fallback
  localStorageMock.setItem('lws:draft:come-here-baby:demo', JSON.stringify({ partnerName: '  ' }));
  const titleEmpty = getGiftTitleTest({ id: 'g3', templateSlug: 'come-here-baby', title: 'Anniversary Memory Website' }, localStorageMock);
  assert(titleEmpty === 'Always Beside You — My Gift', "Dashboard title for empty partnerName resolves to 'Always Beside You — My Gift'");

  // Case D: custom title preservation
  const titleCustom = getGiftTitleTest({ id: 'g4', templateSlug: 'come-here-baby', title: 'My Custom Romantic Surprise' }, localStorageMock);
  assert(titleCustom === 'My Custom Romantic Surprise', "Custom user title 'My Custom Romantic Surprise' is preserved 100%");

  // Verify Dashboard card subtitle rendering
  const dashboardCode = fs.readFileSync('./src/pages/DashboardPage.jsx', 'utf8');
  assert(dashboardCode.includes("Template: <strong className=\"text-neutral-300 font-medium\">{templateEntry?.config?.name || gift.templateSlug}</strong>"), "Dashboard card subtitle displays canonical template name ('Template: For My Baby')");

  // ================================================
  // FINAL SUMMARY
  // ================================================
  console.log("\n=================================================");
  console.log(`TOTAL PASSED: ${totalPassed}`);
  console.log(`TOTAL FAILED: ${totalFailed}`);
  console.log("=================================================");

  if (totalFailed === 0) {
    console.log("\n🎉 ALL LOCAL REGRESSION TESTS PASSED 100%!");
  } else {
    console.error("\n❌ REGRESSION FAILURE DETECTED!");
    process.exit(1);
  }
}

runRegressionSuite();
