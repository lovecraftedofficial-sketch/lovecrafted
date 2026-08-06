/**
 * test_raw_razorpay_error.js
 * --------------------------
 * Directly calls Razorpay SDK instance.orders.create() using environment keys
 * and outputs the raw error object, error code, description, response body, and stack trace.
 */

const Razorpay = require("razorpay");

async function testRazorpayOrderCreation() {
    const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_invalid_placeholder";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "invalid_secret_placeholder";

    console.log(`[TEST] Testing Razorpay instance with key_id prefix: ${key_id.substring(0, 12)}...`);

    const instance = new Razorpay({
        key_id,
        key_secret,
    });

    const options = {
        amount: 199900,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: {
            templateName: "LoveCrafted Keepsake",
            customerName: "Customer",
            studio: "LoveCrafted",
        },
    };

    try {
        const order = await instance.orders.create(options);
        console.log("[SUCCESS] Order created:", order);
    } catch (err) {
        console.log("\n=================== RAW RAZORPAY ERROR OUTPUT ===================");
        console.log("1. COMPLETE ERROR OBJECT BEING CAUGHT:");
        console.dir(err, { depth: null });

        console.log("\n2. EXACT RAZORPAY API ERROR CODE:");
        console.log(err.error?.code || err.code || "BAD_REQUEST_ERROR");

        console.log("\n3. EXACT RAZORPAY API ERROR DESCRIPTION:");
        console.log(err.error?.description || err.message || "Authentication failed");

        console.log("\n4. RESPONSE BODY RETURNED BY RAZORPAY:");
        console.log(JSON.stringify(err.error || err, null, 2));

        console.log("\n5. STACK TRACE:");
        console.log(err.stack);
        console.log("=================================================================\n");
    }
}

testRazorpayOrderCreation();
