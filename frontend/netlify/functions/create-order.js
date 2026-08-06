const Razorpay = require("razorpay");

// SERVER-SIDE AUTHORITATIVE PRICING CATALOG (Single Source of Truth - Client cannot override)
const SERVER_PRICING_CATALOG = {
    "until-forever": 4999,
    "sunset-love": 1999,
    "aurora-sample": 1999,
    "midnight-love": 3499,
    "royal-love": 3499,
    "soft-memories": 999,
};

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
        const templateSlug = body.templateSlug || "sunset-love";
        const templateName = body.templateName || "LoveCrafted Keepsake";
        const customerName = body.customerName || "Customer";

        // SECURITY RULE 1 & 2: Ignore client body.amount completely!
        // Calculate authoritative price on the server based on template catalog
        const serverPriceINR = SERVER_PRICING_CATALOG[templateSlug] || 1999;
        const serverAmountPaise = Math.round(serverPriceINR * 100); // Convert to paise

        const instance = new Razorpay({
            key_id,
            key_secret,
        });

        // SECURITY RULE 3, 4 & 5: Create Razorpay Order using ONLY server-calculated amount and persist metadata notes
        const options = {
            amount: serverAmountPaise,
            currency: "INR",
            receipt: `rcpt_${templateSlug}_${Date.now()}`,
            notes: {
                templateSlug,
                serverPriceINR: String(serverPriceINR),
                serverAmountPaise: String(serverAmountPaise),
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
                amount: order.amount, // Server-calculated amount in paise
                amountINR: serverPriceINR,
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
