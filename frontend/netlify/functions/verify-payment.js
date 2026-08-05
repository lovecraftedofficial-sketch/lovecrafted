const crypto = require("crypto");

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
        const key_secret = process.env.RAZORPAY_KEY_SECRET;

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

        // Official Razorpay Cryptographic HMAC SHA256 Signature Verification
        const generated_signature = crypto
            .createHmac("sha256", key_secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        const isSignatureValid = generated_signature === razorpay_signature;

        if (!isSignatureValid) {
            console.warn(`Payment signature mismatch for Order ${razorpay_order_id}`);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    verified: false,
                    error: "Invalid or tampered payment signature",
                }),
            };
        }

        const invoiceRef = `INV-LC-${Math.floor(1000 + Math.random() * 9000)}`;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                verified: true,
                message: "Payment verified successfully via cryptographic signature",
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
