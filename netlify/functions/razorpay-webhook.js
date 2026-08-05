const crypto = require("crypto");

// In-memory idempotency cache for duplicate webhook event IDs
const processedEventIds = new Set();

exports.handler = async (event, context) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, X-Razorpay-Signature",
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
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

        if (!webhookSecret) {
            console.error("[RAZORPAY_WEBHOOK_ERROR] RAZORPAY_WEBHOOK_SECRET is not configured.");
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: "Webhook secret unconfigured" }),
            };
        }

        const razorpaySignature = event.headers["x-razorpay-signature"] || event.headers["X-Razorpay-Signature"];

        if (!razorpaySignature) {
            console.warn("[RAZORPAY_WEBHOOK_WARN] Missing X-Razorpay-Signature header.");
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Missing webhook signature header" }),
            };
        }

        // Verify Razorpay Webhook Cryptographic HMAC SHA256 Signature
        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(event.body || "")
            .digest("hex");

        const isSignatureValid = expectedSignature === razorpaySignature;

        if (!isSignatureValid) {
            console.warn("[RAZORPAY_WEBHOOK_WARN] Webhook signature verification failed.");
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Invalid webhook signature" }),
            };
        }

        const payload = JSON.parse(event.body || "{}");
        const eventType = payload.event;
        const eventId = payload.event_id || `${eventType}_${Date.now()}`;

        // Idempotency check to safely ignore duplicate events
        if (processedEventIds.has(eventId)) {
            console.log(`[RAZORPAY_WEBHOOK_AUDIT] Ignored duplicate event: ${eventId}`);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ status: "ok", message: "Duplicate event ignored", eventId }),
            };
        }

        // Cache event ID for idempotency (trim cache to prevent memory leak)
        processedEventIds.add(eventId);
        if (processedEventIds.size > 1000) {
            const iterator = processedEventIds.values();
            processedEventIds.delete(iterator.next().value);
        }

        // Audit Log Entry
        console.log(
            JSON.stringify({
                audit: "RAZORPAY_WEBHOOK",
                eventType,
                eventId,
                timestamp: new Date().toISOString(),
                payloadEntity: payload.payload?.payment?.entity?.id || payload.payload?.refund?.entity?.id || null,
            })
        );

        // Handle specific Razorpay Webhook Events
        switch (eventType) {
            case "payment.captured": {
                const payment = payload.payload?.payment?.entity || {};
                console.log(
                    `[RAZORPAY_WEBHOOK_SUCCESS] Payment Captured: ID=${payment.id}, Order=${payment.order_id}, Amount=₹${payment.amount / 100}, Email=${payment.email}`
                );
                break;
            }

            case "payment.failed": {
                const payment = payload.payload?.payment?.entity || {};
                console.warn(
                    `[RAZORPAY_WEBHOOK_FAILED] Payment Failed: ID=${payment.id}, Order=${payment.order_id}, Reason=${payment.error_description || payment.error_reason}`
                );
                break;
            }

            case "refund.processed": {
                const refund = payload.payload?.refund?.entity || {};
                console.log(
                    `[RAZORPAY_WEBHOOK_REFUND] Refund Processed: ID=${refund.id}, Payment=${refund.payment_id}, Amount=₹${refund.amount / 100}`
                );
                break;
            }

            default:
                console.log(`[RAZORPAY_WEBHOOK_INFO] Received unhandled event type: ${eventType}`);
                break;
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                status: "ok",
                received: true,
                event: eventType,
                eventId,
            }),
        };
    } catch (err) {
        console.error("[RAZORPAY_WEBHOOK_ERROR] Exception in webhook handler:", err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: err.message || "Server error processing webhook" }),
        };
    }
};
