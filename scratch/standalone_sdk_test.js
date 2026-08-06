/**
 * standalone_sdk_test.js
 * ----------------------
 * Executes real standalone Razorpay Node SDK test reading process.env.RAZORPAY_KEY_ID
 * and process.env.RAZORPAY_KEY_SECRET directly in Node environment.
 */

const Razorpay = require("../frontend/node_modules/razorpay");

async function runStandaloneSdkTest() {
    const key_id_raw = process.env.RAZORPAY_KEY_ID || "";
    const key_secret_raw = process.env.RAZORPAY_KEY_SECRET || "";

    const key_id = key_id_raw.trim();
    const key_secret = key_secret_raw.trim();

    console.log("--- STANDALONE SDK TEST METADATA ---");
    console.log(`3. key_id length: ${key_id.length}`);
    console.log(`4. key_id last 4 characters: ${key_id ? key_id.slice(-4) : "NONE"}`);
    console.log(`5. key_secret length: ${key_secret.length}`);
    console.log(`6. key_secret last 4 characters: ${key_secret ? key_secret.slice(-4) : "NONE"}`);
    console.log("------------------------------------\n");

    if (!key_id || !key_secret) {
        console.log("1. HTTP status: 500 (Local Environment Variables Not Set)");
        console.log('2. Razorpay response: { error: "RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET environment variables not set in local Node process environment." }');
        return;
    }

    try {
        const instance = new Razorpay({
            key_id,
            key_secret,
        });

        const order = await instance.orders.create({
            amount: 100,
            currency: "INR",
            receipt: "sdk_test",
        });

        console.log("1. HTTP status: 200");
        console.log("2. Razorpay response:", JSON.stringify(order, null, 2));
    } catch (err) {
        console.log(`1. HTTP status: ${err.statusCode || 500}`);
        console.log("2. Razorpay response:", JSON.stringify(err.error || err, null, 2));
    }
}

runStandaloneSdkTest();
