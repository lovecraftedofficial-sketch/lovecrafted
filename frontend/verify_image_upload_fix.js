const { resolveImage } = require('./src/editor/utils/imageUtils');
const { uploadMediaAsset } = require('./src/lib/mediaUploadService');

console.log("=== TESTING IMAGE UPLOAD & RENDERING COMPATIBILITY FIX ===");

async function runImageTests() {
  let passed = 0;
  let failed = 0;

  const sampleBase64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP...";
  const sampleRemoteUrl = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80";
  const legacyObject = { kind: "local", url: sampleBase64, name: "photo.jpg", mime: "image/jpeg" };

  // TEST 1: resolveImage with new string format
  console.log("\nTest 1: resolveImage with clean string URL...");
  const res1 = resolveImage(sampleBase64);
  if (res1 === sampleBase64 && !res1.includes("[object Object]")) {
    console.log("  ✅ PASSED: Returns clean string Base64 URL.");
    passed++;
  } else {
    console.error(`  ❌ FAILED: Got ${res1}`);
    failed++;
  }

  // TEST 2: resolveImage with legacy object format
  console.log("\nTest 2: resolveImage with legacy object format ({ kind: 'local', url: '...' })...");
  const res2 = resolveImage(legacyObject);
  if (res2 === sampleBase64 && typeof res2 === "string" && !res2.includes("[object Object]")) {
    console.log("  ✅ PASSED: Safely unwraps legacy object into clean string URL.");
    passed++;
  } else {
    console.error(`  ❌ FAILED: Got ${res2}`);
    failed++;
  }

  // TEST 3: resolveImage with normal remote URL
  console.log("\nTest 3: resolveImage with remote HTTPS URL...");
  const res3 = resolveImage(sampleRemoteUrl);
  if (res3 === sampleRemoteUrl) {
    console.log("  ✅ PASSED: Remote HTTPS URL returned intact.");
    passed++;
  } else {
    console.error(`  ❌ FAILED: Got ${res3}`);
    failed++;
  }

  // TEST 4: resolveImage fallback when null/undefined/empty
  console.log("\nTest 4: resolveImage with empty/null value...");
  const res4 = resolveImage(null);
  if (res4 && res4.startsWith("https://")) {
    console.log("  ✅ PASSED: Safe default fallback romantic image URL returned.");
    passed++;
  } else {
    console.error(`  ❌ FAILED: Got ${res4}`);
    failed++;
  }

  // TEST 5: mediaUploadService with legacy object format
  console.log("\nTest 5: uploadMediaAsset with legacy object format...");
  const res5 = await uploadMediaAsset(legacyObject, "image");
  if (typeof res5 === "string" && res5 === sampleBase64) {
    console.log("  ✅ PASSED: mediaUploadService unwraps legacy object to string URL.");
    passed++;
  } else {
    console.error(`  ❌ FAILED: Got ${JSON.stringify(res5)}`);
    failed++;
  }

  // TEST 6: mediaUploadService with clean string Data URL
  console.log("\nTest 6: uploadMediaAsset with clean string Data URL...");
  const res6 = await uploadMediaAsset(sampleBase64, "image");
  if (typeof res6 === "string" && res6 === sampleBase64) {
    console.log("  ✅ PASSED: mediaUploadService passes string Data URL cleanly.");
    passed++;
  } else {
    console.error(`  ❌ FAILED: Got ${JSON.stringify(res6)}`);
    failed++;
  }

  console.log("\n=== FINAL TEST SUMMARY ===");
  console.log(`Passed: ${passed}/6`);
  console.log(`Failed: ${failed}/6`);

  if (failed === 0) {
    console.log("🎉 ALL IMAGE UPLOAD & COMPATIBILITY TESTS PASSED 100%!");
  } else {
    process.exit(1);
  }
}

runImageTests();
