/**
 * test_local_payment_flow.js
 * --------------------------
 * Local E2E test script for Netlify Functions:
 * 1. Invokes create-order.js with local environment variables.
 * 2. Inspects HTTP response status (200 vs 500) and orderId generation.
 * 3. Invokes verify-payment.js with test signature payload.
 */

const path = require("path");
const createOrderHandler = require("../frontend/netlify/functions/create-order").handler;
const verifyPaymentHandler = require("../frontend/netlify/functions/verify-payment").handler;

async function runLocalPaymentFlowTest() {
    console.log("=================================================");
    console.log("🧪 STARTING LOCAL RAZORPAY PAYMENT FLOW TEST");
    console.log("=================================================\n");

    // Mock HTTP POST Event for create-order
    const createOrderEvent = {
        httpMethod: "POST",
        body: JSON.stringify({
            amount: 1999,
            templateName: "Sunset Love Keepsake",
            customerName: "Rahul Sharma",
        }),
    };

    console.log("▶ STEP 1: Calling local create-order Netlify function...");
    const createOrderRes = await createOrderHandler(createOrderEvent, {});
    console.log(`[HTTP Status]: ${createOrderRes.statusCode}`);

    let parsedBody = {};
    try {
        parsedBody = JSON.parse(createOrderRes.body);
    } catch {}

    console.log("[create-order Response Body]:");
    console.log(JSON.stringify(parsedBody, null, 2));

    console.log("\n-------------------------------------------------");
    console.log("📊 STEP 1 VERIFICATION RESULTS:");
    console.log(`1. HTTP Status: ${createOrderRes.statusCode}`);
    console.log(`2. Valid order_id created? ${Boolean(parsedBody.orderId)} (${parsedBody.orderId || "NONE"})`);
    console.log(`3. Environment Diagnostics:`, parsedBody.diagnostics || parsedBody.envDiagnostics);
    console.log("-------------------------------------------------\n");

    // If create-order returned orderId, test verify-payment
    if (parsedBody.orderId) {
        console.log("▶ STEP 2: Testing verify-payment with mock signature...");
        const mockPaymentId = `pay_test_${Date.now()}`;
        const crypto = require("crypto");
        const key_secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

        let mockSignature = "";
        if (key_secret) {
            mockSignature = crypto
                .createHmac("sha256", key_secret)
                .update(`${parsedBody.orderId}|${mockPaymentId}`)
                .digest("hex");
        }

        const verifyEvent = {
            httpMethod: "POST",
            body: JSON.stringify({
                razorpay_order_id: parsedBody.orderId,
                razorpay_payment_id: mockPaymentId,
                razorpay_signature: mockSignature,
            }),
        };

        const verifyRes = await verifyPaymentHandler(verifyEvent, {});
        console.log(`[verify-payment HTTP Status]: ${verifyRes.statusCode}`);
        let parsedVerify = {};
        try {
            parsedVerify = JSON.parse(verifyRes.body);
        } catch {}
        console.log("[verify-payment Response Body]:", JSON.stringify(parsedVerify, null, 2));

        console.log("\n-------------------------------------------------");
        console.log(`5. verify-payment verified: ${parsedVerify.verified} (${parsedVerify.message})`);
        console.log("-------------------------------------------------\n");
    } else {
        console.log("⚠️ create-order did not produce an orderId. Skipping verify-payment step.");
    }

    console.log("=================================================");
    console.log("🏁 TEST COMPLETED");
    console.log("=================================================");
}

runLocalPaymentFlowTest();
