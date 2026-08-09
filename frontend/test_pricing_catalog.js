const createOrderHandler = require('./netlify/functions/create-order.js').handler;
const verifyPaymentHandler = require('./netlify/functions/verify-payment.js').handler;
const fs = require('fs');

console.log("=== TESTING SERVER-SIDE PRICING CATALOG & SAFETY FALLBACK ===");

async function runPricingTests() {
  let passed = 0;
  let failed = 0;

  // Set mock Razorpay env variables so credentials check passes
  process.env.RAZORPAY_KEY_ID = "rzp_test_mock123456789";
  process.env.RAZORPAY_KEY_SECRET = "mock_secret_1234567890123456";

  const testCases = [
    { slug: "come-here-baby", expectedINR: 9, expectedPaise: 900 },
    { slug: "a-little-corner", expectedINR: 2999, expectedPaise: 299900 },
    { slug: "until-forever", expectedINR: 4999, expectedPaise: 499900 },
    { slug: "sunset-love", expectedINR: 1999, expectedPaise: 199900 },
    { slug: "aurora-sample", expectedINR: 1999, expectedPaise: 199900 },
    { slug: "midnight-love", expectedINR: 3499, expectedPaise: 349900 },
    { slug: "royal-love", expectedINR: 3499, expectedPaise: 349900 },
    { slug: "soft-memories", expectedINR: 999, expectedPaise: 99900 },
  ];

  // Read create-order.js to extract SERVER_PRICING_CATALOG object
  const createOrderCode = fs.readFileSync('./netlify/functions/create-order.js', 'utf8');
  const verifyPaymentCode = fs.readFileSync('./netlify/functions/verify-payment.js', 'utf8');

  // Extract SERVER_PRICING_CATALOG object from code
  const matchCo = createOrderCode.match(/const SERVER_PRICING_CATALOG = ({[\s\S]*?});/);
  const matchVp = verifyPaymentCode.match(/const SERVER_PRICING_CATALOG = ({[\s\S]*?});/);

  if (!matchCo || !matchVp) {
    console.error("❌ Could not parse SERVER_PRICING_CATALOG from Netlify functions!");
    process.exit(1);
  }

  const catalogCo = eval("(" + matchCo[1] + ")");
  const catalogVp = eval("(" + matchVp[1] + ")");

  console.log("\n1. Verifying create-order.js & verify-payment.js Catalog Sync...");
  if (JSON.stringify(catalogCo) === JSON.stringify(catalogVp)) {
    console.log("  ✅ PASSED: create-order.js and verify-payment.js catalogs are 100% synchronized!");
    passed++;
  } else {
    console.error("  ❌ FAILED: Catalog mismatch between create-order.js and verify-payment.js!");
    failed++;
  }

  console.log("\n2. Verifying Canonical Template Price Mappings...");
  for (const tc of testCases) {
    const priceCo = catalogCo[tc.slug];
    const priceVp = catalogVp[tc.slug];

    if (priceCo === tc.expectedINR && priceVp === tc.expectedINR) {
      console.log(`  ✅ Slug ["${tc.slug}"]: ₹${priceCo} (Paise: ${priceCo * 100})`);
      passed++;
    } else {
      console.error(`  ❌ Mismatch for slug "${tc.slug}": expected ₹${tc.expectedINR}, got create-order=₹${priceCo}, verify-payment=₹${priceVp}`);
      failed++;
    }
  }

  // TEST UNKNOWN SLUG - MUST FAIL SAFELY WITH STATUS 400!
  console.log("\n3. Testing Unknown / Invalid Template Slug Handling ('unknown-hacker-template')...");
  const unknownEvent = {
    httpMethod: "POST",
    body: JSON.stringify({
      templateSlug: "unknown-hacker-template",
      templateName: "Hacked Template",
      customerName: "Attacker"
    })
  };

  try {
    const res = await createOrderHandler(unknownEvent, {});
    const body = JSON.parse(res.body || "{}");

    if (res.statusCode === 400 && body.error && body.error.includes("Invalid or unsupported template pricing slug")) {
      console.log("  ✅ PASSED: Unknown template slug rejected cleanly with HTTP 400! Zero fallback charging.");
      passed++;
    } else {
      console.error(`  ❌ FAILED: Unknown slug was NOT rejected safely! Output:`, res);
      failed++;
    }
  } catch (err) {
    console.error("  ❌ Handler Error for unknown slug:", err);
    failed++;
  }

  console.log("\n=== FINAL PRICING TEST SUMMARY ===");
  console.log(`Passed: ${passed}/${testCases.length + 2}`);
  console.log(`Failed: ${failed}/${testCases.length + 2}`);

  if (failed === 0) {
    console.log("\n🎉 ALL PRICING & SAFETY FALLBACK TESTS PASSED 100%!");
  } else {
    process.exit(1);
  }
}

runPricingTests();
