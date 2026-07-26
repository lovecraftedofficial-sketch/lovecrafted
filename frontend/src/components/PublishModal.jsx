import React, { useState } from "react";
import { X, Send, Copy, Check, QrCode, ShieldCheck, CheckCircle2, ArrowRight, ExternalLink } from "lucide-react";
import { getTemplate } from "@/data/templateRegistry";

export default function PublishModal({ isOpen, onClose, templateSlug, draftTitle, customContent }) {
    const OWNER_UPI_ID = "8618379301@pz";
    const OWNER_NAME = "Love Website Studio";

    // Dynamically fetch price from template registry
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
    const [copiedLink, setCopiedLink] = useState(false);

    if (!isOpen) return null;

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const slugPart = customSlug.trim()
            ? customSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-")
            : `${senderName || "love"}-and-${partnerName || "forever"}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");

        setGeneratedSlug(slugPart);
        setStep("payment");
    };

    // Encode content into URL string so live link is ready
    let encodedData = "";
    try {
        const jsonStr = JSON.stringify(customContent || {});
        encodedData = encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
    } catch {
        encodedData = "";
    }

    const baseUrl = window.location.origin;
    const generatedLink = `${baseUrl}/v/${generatedSlug}?slug=${templateSlug}&d=${encodedData}`;

    // Dynamic UPI Payment URL & QR Code link matching template price
    const upiPayUrl = `upi://pay?pa=${OWNER_UPI_ID}&pn=${encodeURIComponent(OWNER_NAME)}&am=${priceAmount}&cu=INR&tn=${encodeURIComponent(`Order-${generatedSlug}`)}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiPayUrl)}`;

    const handleCopyUpi = () => {
        navigator.clipboard.writeText(OWNER_UPI_ID);
        setCopiedUpi(true);
        setTimeout(() => setCopiedUpi(false), 2000);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(generatedLink);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        setStep("success");

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
            localStorage.setItem(`lws:published:${templateSlug}:${generatedSlug}`, JSON.stringify(record));
        } catch {
            /* ignore */
        }
    };

    // Mailto & WhatsApp notification text for Studio Owner
    const emailSubject = encodeURIComponent(`[NEW ₹${priceFormatted} UPI PAYMENT] Order for ${senderName} & ${partnerName}`);
    const emailBody = encodeURIComponent(
        `Hi Love Website Studio!\n\n` +
        `I have completed payment of ₹${priceFormatted} to your UPI ID (${OWNER_UPI_ID}).\n\n` +
        `💳 UPI / UTR Transaction Ref: ${utrNumber || "Payment Done via QR"}\n` +
        `👤 Customer Name: ${senderName}\n` +
        `📱 WhatsApp Number: ${whatsappNumber}\n` +
        `💑 Couple Names: ${senderName} & ${partnerName}\n` +
        `🎨 Template: ${templateEntry?.config?.name || templateSlug} (₹${priceFormatted})\n\n` +
        `🔗 REQUESTED LIVE LINK:\n${generatedLink}\n\n` +
        `Please verify ₹${priceFormatted} in your bank account and send me my active live link!`
    );
    const mailtoUrl = `mailto:lovewebsitestudio@gmail.com?subject=${emailSubject}&body=${emailBody}`;

    const whatsappOwnerText = encodeURIComponent(
        `Hi Love Website Studio! 💖 I paid ₹${priceFormatted} for ${templateEntry?.config?.name || templateSlug} to your UPI (${OWNER_UPI_ID}).\n\n` +
        `👤 *Name*: ${senderName}\n` +
        `📱 *WhatsApp*: ${whatsappNumber}\n` +
        `💑 *Couple*: ${senderName} & ${partnerName}\n` +
        `💳 *UTR / Transaction Ref*: ${utrNumber}\n` +
        `🔗 *Link Requested*:\n${generatedLink}\n\n` +
        `Please verify ₹${priceFormatted} in your account!`
    );
    const whatsappOwnerUrl = `https://wa.me/?text=${whatsappOwnerText}`;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-[#181114] border border-pink-500/30 rounded-2xl p-6 max-w-md w-full text-center relative shadow-2xl overflow-y-auto max-h-[90vh]">
                <button
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
                    {step === "success" && "Order & Payment Submitted! 🎉"}
                </h3>
                <p className="text-neutral-400 text-xs mb-5">
                    {step === "form" && `Enter details to generate your partner's custom website draft for ${templateEntry?.config?.name || "this template"}.`}
                    {step === "payment" && `Scan with Google Pay, PhonePe, or Paytm to pay ₹${priceFormatted} directly to owner's bank account.`}
                    {step === "success" && "Your payment proof has been submitted to Love Website Studio!"}
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
                            className="w-full lws-btn-primary py-3 flex items-center justify-center gap-2 text-sm font-semibold mt-4 shadow-lg"
                        >
                            Proceed to Pay ₹{priceFormatted} <ArrowRight size={15} />
                        </button>
                    </form>
                )}

                {/* STEP 2: UPI PAYMENT & QR CODE */}
                {step === "payment" && (
                    <form onSubmit={handlePaymentSubmit} className="space-y-4 text-left animate-fadeIn">
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
                                />
                            </div>

                            <div className="flex items-center justify-center gap-2">
                                <span className="text-xs text-neutral-300 font-mono bg-neutral-900 px-3 py-1.5 rounded-lg border border-white/10">
                                    {OWNER_UPI_ID}
                                </span>
                                <button
                                    type="button"
                                    onClick={handleCopyUpi}
                                    className="text-xs text-pink-300 hover:text-pink-200 bg-pink-500/10 px-2.5 py-1.5 rounded-lg border border-pink-500/20"
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
                                Enter 12-Digit UPI Ref / UTR No. (after payment)
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

                        <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-3 flex items-center justify-center gap-2 text-sm font-semibold shadow-lg transition-colors"
                        >
                            <CheckCircle2 size={16} /> Submit Payment Proof (₹{priceFormatted})
                        </button>
                    </form>
                )}

                {/* STEP 3: SUCCESS & PROOF SUBMISSION */}
                {step === "success" && (
                    <div className="space-y-4 text-left animate-fadeIn">
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 text-emerald-300 text-xs space-y-1">
                            <div className="flex items-center gap-1.5 font-semibold text-sm">
                                <CheckCircle2 size={16} /> Payment Proof Received!
                            </div>
                            <p className="text-emerald-200/80 text-[11px]">
                                Your payment details for ₹{priceFormatted} (Ref: <span className="font-mono">{utrNumber}</span>) have been sent to Studio for verification.
                            </p>
                        </div>

                        {/* Generated Link Display */}
                        <div className="bg-black/60 border border-pink-500/40 rounded-xl p-3.5 space-y-2">
                            <span className="text-[10px] uppercase tracking-widest text-pink-300 font-semibold block">
                                🔗 Requested Custom Website Link
                            </span>
                            <div className="text-xs font-mono text-neutral-200 break-all bg-neutral-900/80 p-2.5 rounded-lg border border-white/10">
                                {generatedLink}
                            </div>
                            <div className="flex gap-2 pt-1">
                                <button
                                    onClick={handleCopyLink}
                                    className="lws-btn-ghost text-xs py-1.5 px-3 flex-1 justify-center border border-white/10 hover:bg-white/10"
                                >
                                    {copiedLink ? (
                                        <>
                                            <Check size={13} className="text-emerald-400" /> Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={13} /> Copy Link
                                        </>
                                    )}
                                </button>
                                <a
                                    href={generatedLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="lws-btn-ghost text-xs py-1.5 px-3 flex-1 justify-center border border-white/10 hover:bg-white/10"
                                >
                                    <ExternalLink size={13} /> Preview Site
                                </a>
                            </div>
                        </div>

                        {/* Direct Notification Buttons to Studio Owner */}
                        <div className="space-y-2.5 pt-2">
                            <p className="text-xs text-neutral-400 font-medium">
                                Send payment ref to Studio to get instant live link:
                            </p>
                            <a
                                href={whatsappOwnerUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-3 flex items-center justify-center gap-2 text-xs font-semibold shadow-lg transition-colors"
                            >
                                📲 Confirm ₹{priceFormatted} Payment via WhatsApp
                            </a>

                            <a
                                href={mailtoUrl}
                                className="w-full lws-btn-ghost py-2.5 flex items-center justify-center gap-2 text-xs font-medium border border-white/10 hover:bg-white/5"
                            >
                                <Send size={13} /> Confirm Payment via Email
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
