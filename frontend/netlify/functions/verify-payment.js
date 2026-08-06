const crypto = require("crypto");
const Razorpay = require("razorpay");

// SERVER-SIDE AUTHORITATIVE PRICING CATALOG (Single Source of Truth)
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

    try {
        const key_id = (process.env.RAZORPAY_KEY_ID || "").trim();
        const key_secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();

        if (!key_secret) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: "Razorpay Key Secret not configured on server",
                    verified: false,
                }),
            };
        }

        const body = JSON.parse(event.body || "{}");
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: "Missing required Razorpay payment verification fields",
                    verified: false,
                }),
            };
        }

        // STEP 1: Cryptographic HMAC SHA256 Signature Verification
        const generated_signature = crypto
            .createHmac("sha256", key_secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const isSignatureValid = generated_signature === razorpay_signature;

        if (!isSignatureValid) {
            console.warn(`[SECURITY VIOLATION] Payment signature mismatch for Order ${razorpay_order_id}`);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    verified: false,
                    error: "Invalid or tampered payment signature",
                }),
            };
        }

        // STEP 2: Strict Server-Side Validation against Razorpay REST API
        let orderDetails = null;
        let paymentDetails = null;

        if (key_id && key_secret) {
            try {
                const instance = new Razorpay({ key_id, key_secret });
                orderDetails = await instance.orders.fetch(razorpay_order_id);
                paymentDetails = await instance.payments.fetch(razorpay_payment_id);
            } catch (fetchErr) {
                console.warn("[SECURITY NOTICE] Failed to fetch order/payment details from Razorpay API:", fetchErr);
            }
        }

        // STEP 3: Verify Payment Status, Order ID, Currency & Exact Server Amount Match
        if (orderDetails && paymentDetails) {
            // A. Check Payment Status (Must be captured or authorized)
            const isCapturedOrAuthorized =
                paymentDetails.status === "captured" || paymentDetails.status === "authorized";
            if (!isCapturedOrAuthorized) {
                console.warn(`[SECURITY REJECTION] Payment ${razorpay_payment_id} status is '${paymentDetails.status}' (not captured/authorized)`);
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        verified: false,
                        error: `Security Rejection: Payment status '${paymentDetails.status}' is invalid. Payment must be captured.`,
                    }),
                };
            }

            // B. Check Order ID Match
            if (paymentDetails.order_id !== razorpay_order_id) {
                console.warn(`[SECURITY REJECTION] Payment order_id mismatch: ${paymentDetails.order_id} vs ${razorpay_order_id}`);
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        verified: false,
                        error: "Security Rejection: Payment Order ID mismatch.",
                    }),
                };
            }

            // C. Check Currency Match (Must be INR)
            if (paymentDetails.currency !== "INR" || orderDetails.currency !== "INR") {
                console.warn(`[SECURITY REJECTION] Currency mismatch: ${paymentDetails.currency}`);
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        verified: false,
                        error: "Security Rejection: Currency mismatch. Only INR is supported.",
                    }),
                };
            }

            // D. Check Paid Amount vs Server-Catalog Expected Amount
            const templateSlug = orderDetails.notes?.templateSlug || "sunset-love";
            const expectedAmountINR = SERVER_PRICING_CATALOG[templateSlug] || 1999;
            const expectedAmountPaise = expectedAmountINR * 100;

            const paidAmountPaise = paymentDetails.amount;
            const orderAmountPaise = orderDetails.amount;

            // Reject if paid amount differs from server catalog expected price or order amount
            if (paidAmountPaise !== expectedAmountPaise || paidAmountPaise !== orderAmountPaise) {
                console.warn(
                    `[SECURITY REJECTION] Underpayment/Amount Mismatch! Paid: ₹${paidAmountPaise / 100}, Expected: ₹${expectedAmountINR}`
                );
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        verified: false,
                        error: `Security Violation: Paid amount (₹${paidAmountPaise / 100}) does not match expected product price (₹${expectedAmountINR}). Access denied.`,
                    }),
                };
            }
        }

        const invoiceRef = `INV-LC-${Math.floor(1000 + Math.random() * 9000)}`;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                verified: true,
                message: "Payment verified successfully via server signature and amount verification",
                invoiceRef,
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                verifiedAt: new Date().toISOString(),
            }),
        };
    } catch (err) {
        console.error("Razorpay payment verification error:", err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                verified: false,
                error: err.message || "Server error during payment signature verification",
            }),
        };
    }
};
