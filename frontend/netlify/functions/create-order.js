const Razorpay = require("razorpay");

exports.handler = async (event, context) => {
    // Enable CORS for frontend requests
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json",
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    // Defensive variable reading with .trim()
    const key_id = (process.env.RAZORPAY_KEY_ID || "").trim();
    const key_secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

    // Safe diagnostics metadata (NEVER exposing full secret)
    const diagnostics = {
        keyId: key_id,
        keyIdLength: key_id.length,
        secretLength: key_secret.length,
        keyIdEndsWith: key_id ? key_id.slice(-4) : "",
        secretEndsWith: key_secret ? key_secret.slice(-4) : "",
    };

    console.log("Razorpay Environment Diagnostics:", diagnostics);

    if (!key_id || !key_secret) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Razorpay credentials missing",
                diagnostics,
            }),
        };
    }

    try {
        const body = JSON.parse(event.body || "{}");
        const amount = body.amount || 1999;
        const templateName = body.templateName || "LoveCrafted Keepsake";
        const customerName = body.customerName || "Customer";

        const instance = new Razorpay({
            key_id,
            key_secret,
        });

        const options = {
            amount: Math.round(amount * 100), // Amount in paise
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                templateName,
                customerName,
                studio: "LoveCrafted",
            },
        };

        const order = await instance.orders.create(options);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                keyId: key_id,
                diagnostics,
            }),
        };
    } catch (err) {
        const errorLog = {
            statusCode: err.statusCode || null,
            error: err.error || null,
            message: err.message || null,
            stack: err.stack || null,
        };

        console.error("Razorpay order creation error:", errorLog);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: err.message || "Failed to create Razorpay Order",
                diagnostics,
                razorpayError: errorLog,
            }, null, 2),
        };
    }
};
