/**
 * paymentService.js
 * -----------------
 * Production-Grade Razorpay Payment Architecture for LoveCrafted.
 * 1. Requests server-generated order_id via Netlify Function (`create-order`).
 * 2. Mandatory Order ID validation: Never launches checkout without a valid order_id.
 * 3. Enforces cryptographic HMAC SHA256 server-side signature verification (`verify-payment`)
 *    BEFORE unlocking published gift access.
 */

export function loadRazorpayScript() {
    return new Promise((resolve) => {
        if (typeof window === "undefined") {
            resolve(false);
            return;
        }
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

export function generateInvoiceRef() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `INV-LC-${randomNum}`;
}

export async function processRazorpayPayment({
    amount,
    currency = "INR",
    templateName = "LoveCrafted Template",
    tier = "Premium",
    customerName = "Customer",
    customerEmail = "customer@example.com",
    customerPhone = "",
    onSuccess,
    onFailure,
    onCancel,
}) {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || typeof window === "undefined" || !window.Razorpay) {
        if (onFailure) onFailure("Razorpay Checkout SDK failed to load.");
        return;
    }

    let razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;
    let orderId = null;
    let createOrderError = null;

    // STEP 1: Request Server-Created Razorpay Order from Netlify Function
    try {
        const response = await fetch("/.netlify/functions/create-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                amount,
                templateName,
                tier,
                customerName,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.orderId) {
                orderId = data.orderId;
                if (data.keyId) razorpayKey = data.keyId;
            } else {
                createOrderError = data.error || "Server failed to generate Razorpay Order ID";
            }
        } else {
            let errorText = `Server endpoint create-order returned HTTP ${response.status}`;
            try {
                const errorJson = await response.json();
                if (errorJson.error) errorText = errorJson.error;
            } catch {}
            createOrderError = errorText;
        }
    } catch (err) {
        createOrderError = err.message || "Failed to reach server endpoint create-order";
    }

    // REQUIREMENT 7: If create-order fails or does not return orderId, DO NOT continue!
    if (!orderId) {
        const failureMsg = createOrderError || "Failed to create Razorpay order";
        console.error("[paymentService] Mandatory Order ID missing:", failureMsg);
        if (onFailure) {
            onFailure(failureMsg);
        }
        throw new Error("Failed to create Razorpay order: " + failureMsg);
    }

    // STEP 2: Launch Production Razorpay Checkout SDK with Mandatory Server Order ID
    try {
        const options = {
            key: razorpayKey,
            amount: Math.round(amount * 100), // Amount in paise
            currency: currency,
            name: "LoveCrafted Studio",
            description: `Unlock ${templateName} (${tier} Tier)`,
            image: "https://lovecrafted-official.netlify.app/favicon.ico",
            order_id: orderId, // MANDATORY Server-created Order ID
            handler: async function (response) {
                // STEP 3: Cryptographic Server-Side Signature Verification
                try {
                    const verifyRes = await fetch("/.netlify/functions/verify-payment", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    });

                    if (verifyRes.ok) {
                        const verifyData = await verifyRes.json();
                        if (verifyData.verified) {
                            const paymentData = {
                                paymentId: response.razorpay_payment_id,
                                orderId: response.razorpay_order_id || orderId,
                                signature: response.razorpay_signature,
                                invoiceRef: verifyData.invoiceRef || generateInvoiceRef(),
                                amount,
                                paidAt: new Date().toISOString(),
                                isServerVerified: true,
                            };
                            if (onSuccess) onSuccess(paymentData);
                            return;
                        }
                    }

                    if (onFailure) {
                        onFailure("Cryptographic payment signature verification failed. Access denied.");
                    }
                } catch (verifyErr) {
                    console.error("Signature verification error:", verifyErr);
                    if (onFailure) {
                        onFailure("Server verification error: " + (verifyErr.message || "Failed to verify signature"));
                    }
                }
            },
            prefill: {
                name: customerName,
                email: customerEmail,
                contact: customerPhone,
            },
            theme: {
                color: "#f43f5e",
            },
            modal: {
                ondismiss: function () {
                    if (onCancel) onCancel("Payment cancelled by user.");
                },
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
            if (onFailure) {
                onFailure(response.error?.description || "Payment failed. Please try again.");
            }
        });
        rzp.open();
    } catch (err) {
        console.error("Razorpay SDK launch error:", err);
        if (onFailure) onFailure(err.message || "Failed to launch Razorpay Checkout");
    }
}
