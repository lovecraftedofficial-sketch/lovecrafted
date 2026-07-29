import React, { useState } from "react";
import { X, Send, Copy, ShieldCheck, CheckCircle2, ArrowRight, Clock, Heart, Lock } from "lucide-react";
import { getTemplate } from "@/data/templateRegistry";

export default function PublishModal({ isOpen, onClose, templateSlug, draftTitle, customContent }) {
    const OWNER_UPI_ID = "8618379301@pz";
    const OWNER_NAME = "LoveCrafted";

    const templateEntry = getTemplate(templateSlug || "sunset-love");
    const priceAmount = templateEntry?.config?.price || 1999;
    const priceFormatted = priceAmount.toLocaleString("en-IN");

    const [senderName, setSenderName] = useState("");
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [partnerName, setPartnerName] = useState("");
    const [customSlug, setCustomSlug] = useState("");
    const [utrNumber, setUtrNumber] = useState("");
    const [step, setStep] = useState("form"); // "form" | "payment" | "success"
    const [generatedSlug, setGeneratedSlug] = useState("");
    const [copiedUpi, setCopiedUpi] = useState(false);

    if (!isOpen) return null;

    const handleFormSubmit = (e) => {
        if (e && e.preventDefault) e.preventDefault();

        const cleanSender = senderName.trim() || "love";
        const cleanPartner = partnerName.trim() || "forever";
        const slugPart = customSlug.trim()
            ? customSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-")
            : `${cleanSender}-and-${cleanPartner}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");

        setGeneratedSlug(slugPart);
        setStep("payment");
    };

    // Safely encode content into URL string
    let encodedData = "";
    try {
        const jsonStr = JSON.stringify(customContent || {});
        const bytes = new TextEncoder().encode(jsonStr);
        let binaryStr = "";
        for (let i = 0; i < bytes.length; i++) {
            binaryStr += String.fromCharCode(bytes[i]);
        }
        encodedData = encodeURIComponent(btoa(binaryStr));
    } catch {
        try {
            encodedData = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(customContent || {})))));
        } catch {
            encodedData = "";
        }
    }

    const activeSlug = generatedSlug || "love-and-forever";
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://lovewebsitestudio.netlify.app";
    const generatedLink = `${baseUrl}/v/${activeSlug}?slug=${templateSlug || "sunset-love"}&d=${encodedData}`;

    const upiPayUrl = `upi://pay?pa=${OWNER_UPI_ID}&pn=${encodeURIComponent(OWNER_NAME)}&am=${priceAmount}&cu=INR&tn=${encodeURIComponent(`Order-${activeSlug}`)}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiPayUrl)}`;

    const handleCopyUpi = () => {
        if (navigator.clipboard) navigator.clipboard.writeText(OWNER_UPI_ID);
        setCopiedUpi(true);
        setTimeout(() => setCopiedUpi(false), 2000);
    };

    // Mailto & WhatsApp notification text sent EXCLUSIVELY to Studio Owner
    const emailSubject = encodeURIComponent(`[NEW ₹${priceFormatted} ORDER] Verification Required for ${senderName || "Customer"} & ${partnerName || "Partner"}`);
    const emailBody = encodeURIComponent(
        `Hi LoveCrafted!\n\n` +
        `I have completed payment of ₹${priceFormatted} to your UPI ID (${OWNER_UPI_ID}).\n\n` +
        `💳 UPI / UTR Transaction Ref: ${utrNumber || "Payment Done via QR"}\n` +
        `👤 Customer Name: ${senderName}\n` +
        `📱 WhatsApp Number: ${whatsappNumber}\n` +
        `💑 Couple Names: ${senderName} & ${partnerName}\n` +
        `🎨 Template: ${templateEntry?.config?.name || templateSlug} (₹${priceFormatted})\n\n` +
        `======================================\n` +
        `🔗 CUSTOMER'S CUSTOMIZED WEBSITE LINK:\n` +
        `${generatedLink}\n` +
        `======================================\n\n` +
        `Please verify ₹${priceFormatted} in your bank app (GPay/PhonePe). After verification, reply with this link to the customer!`
    );
    const mailtoUrl = `mailto:lovewebsitestudio@gmail.com?subject=${emailSubject}&body=${emailBody}`;

    const whatsappOwnerText = encodeURIComponent(
        `Hi Love Website Studio! 💖 I paid ₹${priceFormatted} for ${templateEntry?.config?.name || templateSlug} to your UPI (${OWNER_UPI_ID}).\n\n` +
        `👤 *Name*: ${senderName}\n` +
        `📱 *WhatsApp*: ${whatsappNumber}\n` +
        `💑 *Couple*: ${senderName} & ${partnerName}\n` +
        `💳 *UTR Ref*: ${utrNumber}\n\n` +
        `🔗 *Customized Website Link*:\n${generatedLink}\n\n` +
        `Please verify ₹${priceFormatted} in your bank account!`
    );
    const whatsappOwnerUrl = `https://wa.me/?text=${whatsappOwnerText}`;

    const handlePaymentSubmit = (e, targetMethod = "whatsapp") => {
        if (e && e.preventDefault) e.preventDefault();

        // Save persistent record locally
        try {
            const record = {
                senderName,
                partnerName,
                whatsappNumber,
                templateSlug,
                price: priceAmount,
                utrNumber,
                generatedLink,
                submittedAt: new Date().toISOString(),
            };
            localStorage.setItem(`lws:published:${templateSlug}:${activeSlug}`, JSON.stringify(record));
        } catch {
            /* ignore */
        }

        setStep("success");

        // AUTOMATICALLY open WhatsApp or Email to transmit details & link EXCLUSIVELY to Studio Owner!
        if (targetMethod === "email") {
            window.location.href = mailtoUrl;
        } else {
            window.open(whatsappOwnerUrl, "_blank");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-[#181114] border border-pink-500/30 rounded-2xl p-6 max-w-md w-full text-center relative shadow-2xl overflow-y-auto max-h-[90vh]">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
                >
                    <X size={18} />
                </button>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-medium mb-3">
                    <ShieldCheck size={12} /> Direct Bank UPI Payment
                </div>

                <h3 className="font-display text-2xl text-white mb-1">
                    {step === "form" && `Publish ${templateEntry?.config?.name || draftTitle || "Website"}`}
                    {step === "payment" && `Scan & Pay ₹${priceFormatted}`}
                    {step === "success" && "Order Submitted Successfully! 🎉"}
                </h3>
                <p className="text-neutral-400 text-xs mb-5">
                    {step === "form" && `Enter details to generate your partner's custom website draft for ${templateEntry?.config?.name || "this template"}.`}
                    {step === "payment" && `Scan with Google Pay, PhonePe, or Paytm to pay ₹${priceFormatted} directly to owner's bank account.`}
                    {step === "success" && "Your order details have been sent to Studio Owner for payment verification."}
                </p>

                {/* STEP 1: FORM */}
                {step === "form" && (
                    <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
                        <div className="bg-neutral-900/90 border border-white/10 rounded-xl p-3 flex items-center justify-between text-xs">
                            <span className="text-neutral-400">Template Price:</span>
                            <span className="font-bold text-amber-300 text-sm">₹{priceFormatted} INR</span>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                Your Full Name *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Rahul Sharma"
                                value={senderName}
                                onChange={(e) => setSenderName(e.target.value)}
                                className="w-full bg-neutral-900/80 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                Your WhatsApp / Phone Number *
                            </label>
                            <input
                                type="tel"
                                required
                                placeholder="e.g. +91 9876543210"
                                value={whatsappNumber}
                                onChange={(e) => setWhatsappNumber(e.target.value)}
                                className="w-full bg-neutral-900/80 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                Partner's Name *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Ananya"
                                value={partnerName}
                                onChange={(e) => setPartnerName(e.target.value)}
                                className="w-full bg-neutral-900/80 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                Custom Link Name (Optional)
                            </label>
                            <div className="flex items-center bg-neutral-900/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-400">
                                <span className="text-neutral-500 mr-1">/v/</span>
                                <input
                                    type="text"
                                    placeholder={
                                        senderName && partnerName
                                            ? `${senderName.toLowerCase()}-and-${partnerName.toLowerCase()}`
                                            : "rahul-and-ananya"
                                    }
                                    value={customSlug}
                                    onChange={(e) => setCustomSlug(e.target.value)}
                                    className="bg-transparent text-white focus:outline-none w-full"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full lws-btn-primary py-3 flex items-center justify-center gap-2 text-sm font-semibold mt-4 shadow-lg cursor-pointer"
                        >
                            Proceed to Pay ₹{priceFormatted} <ArrowRight size={15} />
                        </button>
                    </form>
                )}

                {/* STEP 2: UPI PAYMENT & AUTOMATIC CONTACT OWNER */}
                {step === "payment" && (
                    <div className="space-y-4 text-left animate-fadeIn">
                        <div className="bg-black/70 border border-pink-500/40 rounded-xl p-4 text-center space-y-3">
                            <div className="flex items-center justify-center gap-2 text-xs text-pink-300 font-semibold uppercase tracking-wider">
                                <QrCode size={16} /> Pay via GPay / PhonePe / Paytm
                            </div>

                            {/* Direct Dynamic UPI QR Code */}
                            <div className="bg-white p-3 rounded-xl inline-block mx-auto shadow-2xl">
                                <img
                                    src={qrCodeUrl}
                                    alt="Owner UPI QR Code"
                                    className="w-40 h-40 mx-auto"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                    }}
                                />
                            </div>

                            <div className="flex items-center justify-center gap-2">
                                <span className="text-xs text-neutral-300 font-mono bg-neutral-900 px-3 py-1.5 rounded-lg border border-white/10">
                                    {OWNER_UPI_ID}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleCopyUpi}
                                    className="text-xs text-pink-300 hover:text-pink-200 bg-pink-500/10 px-2.5 py-1.5 rounded-lg border border-pink-500/20 cursor-pointer"
                                >
                                    {copiedUpi ? "Copied!" : <Copy size={13} />}
                                </button>
                            </div>

                            <div className="text-xs text-neutral-300">
                                💰 Total Amount: <span className="text-amber-300 font-bold text-sm">₹{priceFormatted} INR</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                Enter 12-Digit UPI Ref / UTR No. (after payment) *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. 420987654321"
                                value={utrNumber}
                                onChange={(e) => setUtrNumber(e.target.value)}
                                className="w-full bg-neutral-900/80 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
                            />
                        </div>

                        <div className="space-y-2 pt-1">
                            <button
                                type="button"
                                onClick={(e) => handlePaymentSubmit(e, "whatsapp")}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-3 flex items-center justify-center gap-2 text-xs font-semibold shadow-lg transition-colors cursor-pointer"
                            >
                                📲 Submit & Send Order via WhatsApp
                            </button>

                            <button
                                type="button"
                                onClick={(e) => handlePaymentSubmit(e, "email")}
                                className="w-full lws-btn-ghost py-2.5 flex items-center justify-center gap-2 text-xs font-medium border border-white/10 hover:bg-white/5 cursor-pointer"
                            >
                                <Send size={13} /> Submit & Send Order via Email
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: SUCCESS & PAYMENT VERIFICATION PROMPT (LINK IS HELD UNTIL OWNER VERIFIES) */}
                {step === "success" && (
                    <div className="space-y-4 text-left animate-fadeIn">
                        {/* Romantic Confirmation Card */}
                        <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/15 to-amber-500/10 border border-amber-400/30 rounded-2xl p-5 text-center space-y-3 shadow-xl">
                            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 flex items-center justify-center mx-auto shadow-inner">
                                <Heart size={24} className="fill-rose-400 text-rose-400 animate-pulse" />
                            </div>

                            <h4 className="font-display text-xl text-amber-100 font-bold">
                                Thank You For Ordering! 💖
                            </h4>

                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                                <Clock size={13} className="animate-spin" /> Payment Verification In Progress
                            </div>

                            <div className="bg-neutral-900/90 border border-white/10 rounded-xl p-3 text-left space-y-1.5 text-xs text-neutral-300">
                                <div><span className="text-neutral-400">Customer:</span> <span className="text-white font-medium">{senderName}</span></div>
                                <div><span className="text-neutral-400">Partner:</span> <span className="text-white font-medium">{partnerName}</span></div>
                                <div><span className="text-neutral-400">Amount Paid:</span> <span className="text-amber-300 font-bold">₹{priceFormatted}</span></div>
                                <div><span className="text-neutral-400">UTR / Ref:</span> <span className="font-mono text-emerald-300">{utrNumber || "Submitted"}</span></div>
                            </div>

                            <div className="bg-black/70 border border-amber-400/30 rounded-xl p-3.5 text-xs text-amber-200 text-center font-medium space-y-1">
                                <div className="flex items-center justify-center gap-1.5 text-amber-300 font-semibold">
                                    <Lock size={14} /> Link Reserved For Payment Verification
                                </div>
                                <p className="text-[11px] text-neutral-300">
                                    Your customized website link has been sent directly to <b>Studio Owner</b> via WhatsApp/Email. As soon as Studio Owner verifies ₹{priceFormatted} in bank account, your live website link will be sent to you on WhatsApp/Email!
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2 pt-1">
                            <a
                                href={whatsappOwnerUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-3 flex items-center justify-center gap-2 text-xs font-semibold shadow-lg transition-colors"
                            >
                                📲 Re-send Order Details to Studio WhatsApp
                            </a>
                        </div>
                    </div>
                )}

                <p className="text-[10px] text-neutral-500 mt-4">
                    Direct UPI: {OWNER_UPI_ID} · Support: lovewebsitestudio@gmail.com
                </p>
            </div>
        </div>
    );
}
