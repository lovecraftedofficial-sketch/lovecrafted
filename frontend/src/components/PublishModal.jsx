import React, { useState } from "react";
import {
    X,
    Send,
    Copy,
    ShieldCheck,
    CheckCircle2,
    ArrowRight,
    Clock,
    Heart,
    Lock,
    QrCode,
    AlertCircle,
    ExternalLink,
    Check,
    Mail,
    Loader2,
    Sparkles,
    RotateCcw,
    CreditCard
} from "lucide-react";
import emailjs from "@emailjs/browser";
import { getTemplate } from "@/data/templateRegistry";
import { processRazorpayPayment } from "@/lib/paymentService";

const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || "service_lovecrafted";
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "template_order";
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "YOUR_EMAILJS_PUBLIC_KEY";

export default function PublishModal({ isOpen, onClose, templateSlug, draftTitle, customContent }) {
    const OWNER_UPI_ID = "8618379301@pz";
    const OWNER_EMAIL = "lovecrafted.official@gmail.com";

    const templateEntry = getTemplate(templateSlug || "sunset-love");
    const priceAmount = templateEntry?.config?.price || 1999;
    const tierName = templateEntry?.config?.tier || "Premium";
    const priceFormatted = priceAmount.toLocaleString("en-IN");

    const [senderName, setSenderName] = useState("");
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [partnerName, setPartnerName] = useState("");
    const [customSlug, setCustomSlug] = useState("");

    // Step state: "form" | "payment" | "payment-failed" | "success"
    const [step, setStep] = useState("form");
    const [paymentErrorMessage, setPaymentErrorMessage] = useState("");
    const [generatedSlug, setGeneratedSlug] = useState("");
    const [copiedLink, setCopiedLink] = useState(false);
    const [paymentRecord, setPaymentRecord] = useState(null);

    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

    const activeSlug = generatedSlug || "our-anniversary";
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://lovecrafted-official.netlify.app";

    // Public Live Link unlocked upon payment
    const publicLiveLink = `${baseUrl}/story/${activeSlug}?slug=${templateSlug || "sunset-love"}&active=true&d=${encodedData}`;

    const handleCopyPublicLink = () => {
        if (navigator.clipboard) navigator.clipboard.writeText(publicLiveLink);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
    };

    // Trigger Razorpay Payment Checkout
    const handleStartRazorpayPayment = () => {
        setIsProcessingPayment(true);
        setPaymentErrorMessage("");

        processRazorpayPayment({
            amount: priceAmount,
            currency: "INR",
            templateName: templateEntry?.config?.name || draftTitle || "Website",
            tier: tierName,
            customerName: senderName,
            customerEmail: "customer@example.com",
            customerPhone: whatsappNumber,
            onSuccess: (paymentData) => {
                setIsProcessingPayment(false);
                setPaymentRecord(paymentData);
                setStep("success");

                // Update local storage gifts registry to Paid & Published
                try {
                    const storedGifts = localStorage.getItem("lws:user_gifts");
                    let giftsList = storedGifts ? JSON.parse(storedGifts) : [];
                    const updatedGifts = giftsList.map((g) => {
                        if (g.templateSlug === templateSlug || g.title === draftTitle) {
                            return {
                                ...g,
                                status: "Published",
                                paymentStatus: "paid",
                                invoiceRef: paymentData.invoiceRef,
                                slug: activeSlug,
                                lastEdited: "Just now",
                            };
                        }
                        return g;
                    });
                    localStorage.setItem("lws:user_gifts", JSON.stringify(updatedGifts));
                } catch {
                    /* ignore */
                }

                // Send background notification email
                try {
                    emailjs.send(
                        EMAILJS_SERVICE_ID,
                        EMAILJS_TEMPLATE_ID,
                        {
                            to_name: "LoveCrafted Owner",
                            to_email: OWNER_EMAIL,
                            customer_name: senderName,
                            partner_name: partnerName,
                            whatsapp_number: whatsappNumber,
                            amount_paid: `₹${priceFormatted} INR`,
                            utr_number: paymentData.paymentId,
                            invoice_ref: paymentData.invoiceRef,
                            template_name: templateEntry?.config?.name || templateSlug,
                            owner_activation_link: publicLiveLink,
                            upi_id: OWNER_UPI_ID,
                        },
                        EMAILJS_PUBLIC_KEY
                    ).catch(() => {});
                } catch {
                    /* ignore */
                }
            },
            onFailure: (errMsg) => {
                setIsProcessingPayment(false);
                setPaymentErrorMessage(errMsg || "Payment could not be processed.");
                setStep("payment-failed");
            },
            onCancel: (cancelMsg) => {
                setIsProcessingPayment(false);
                setPaymentErrorMessage(cancelMsg || "Payment was cancelled.");
                setStep("payment-failed");
            },
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-[#181114] border border-rose-500/30 rounded-3xl p-6 max-w-md w-full text-center relative shadow-2xl overflow-y-auto max-h-[90vh] text-white">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                    <X size={18} />
                </button>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold mb-3">
                    <ShieldCheck size={12} /> Secure Razorpay Checkout
                </div>

                <h3 className="font-display text-2xl text-white mb-1">
                    {step === "form" && `Publish ${templateEntry?.config?.name || draftTitle || "Website"}`}
                    {step === "payment" && `Checkout — ₹${priceFormatted}`}
                    {step === "payment-failed" && "Payment Unsuccessful"}
                    {step === "success" && "Keepsake Unlocked & Published! 🎉"}
                </h3>
                <p className="text-neutral-400 text-xs mb-5">
                    {step === "form" && `Enter recipient details and custom slug to unlock public sharing for this ${tierName} template.`}
                    {step === "payment" && `Pay ₹${priceFormatted} via Razorpay (UPI, Credit/Debit Card, Netbanking) to publish.`}
                    {step === "payment-failed" && "Your payment was not completed. You can retry safely below."}
                    {step === "success" && "Your payment was verified. Your live website is active and ready to share!"}
                </p>

                {/* STEP 1: FORM & CUSTOM SLUG */}
                {step === "form" && (
                    <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
                        <div className="bg-neutral-900/90 border border-white/10 rounded-2xl p-4 flex items-center justify-between text-xs">
                            <div>
                                <span className="text-neutral-400 block text-[10px] uppercase tracking-wider font-semibold">
                                    {tierName} Tier Template
                                </span>
                                <span className="text-white font-serif text-base font-bold">
                                    {templateEntry?.config?.name || "Sunset Love"}
                                </span>
                            </div>
                            <span className="font-bold text-amber-300 text-lg">₹{priceFormatted}</span>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                Your Name *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Rahul Sharma"
                                value={senderName}
                                onChange={(e) => setSenderName(e.target.value)}
                                className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                Partner / Recipient Name *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Ananya"
                                value={partnerName}
                                onChange={(e) => setPartnerName(e.target.value)}
                                className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-neutral-300 mb-1">
                                Custom Story Slug (Optional)
                            </label>
                            <div className="flex items-center bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-400">
                                <span className="text-neutral-500 mr-1 font-mono">/story/</span>
                                <input
                                    type="text"
                                    placeholder={
                                        senderName && partnerName
                                            ? `${senderName.toLowerCase()}-and-${partnerName.toLowerCase()}`
                                            : "our-anniversary"
                                    }
                                    value={customSlug}
                                    onChange={(e) => setCustomSlug(e.target.value)}
                                    className="bg-transparent text-white focus:outline-none w-full font-mono text-xs"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full lws-btn-primary py-3.5 rounded-full flex items-center justify-center gap-2 text-xs font-semibold mt-4 shadow-xl cursor-pointer"
                        >
                            Proceed to Razorpay Checkout (₹{priceFormatted}) <ArrowRight size={15} />
                        </button>
                    </form>
                )}

                {/* STEP 2: RAZORPAY PAYMENT INITIATION */}
                {step === "payment" && (
                    <div className="space-y-5 text-left animate-fadeIn">
                        <div className="bg-neutral-900/90 border border-rose-500/30 rounded-2xl p-5 text-center space-y-3 shadow-xl">
                            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <h4 className="font-serif text-lg font-bold text-white">
                                    Complete Payment to Publish
                                </h4>
                                <p className="text-xs text-neutral-400 mt-1">
                                    Instant 1-click publishing upon payment verification.
                                </p>
                            </div>

                            <div className="bg-black/60 p-3 rounded-xl border border-white/10 text-xs text-neutral-300 space-y-1 text-left">
                                <div className="flex justify-between">
                                    <span className="text-neutral-400">Website Title:</span>
                                    <span className="font-semibold text-white">{draftTitle || "Love Story"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-400">Custom Slug:</span>
                                    <span className="font-mono text-rose-300">/story/{activeSlug}</span>
                                </div>
                                <div className="flex justify-between border-t border-white/5 pt-1 mt-1 font-bold">
                                    <span>Total Payable:</span>
                                    <span className="text-amber-300 text-sm">₹{priceFormatted} INR</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleStartRazorpayPayment}
                                disabled={isProcessingPayment}
                                className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-semibold text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
                            >
                                {isProcessingPayment ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" /> Opening Razorpay Checkout...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={16} /> Pay ₹{priceFormatted} & Publish
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2.5: PAYMENT FAILURE & RETRY */}
                {step === "payment-failed" && (
                    <div className="space-y-4 text-center animate-fadeIn">
                        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-3">
                            <AlertCircle size={32} className="text-rose-400 mx-auto" />
                            <h4 className="font-serif text-lg font-bold text-white">Payment Unsuccessful</h4>
                            <p className="text-xs text-rose-200 leading-relaxed">
                                {paymentErrorMessage || "The payment transaction was cancelled or declined. No amount was deducted."}
                            </p>
                            <button
                                type="button"
                                onClick={handleStartRazorpayPayment}
                                className="w-full py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
                            >
                                <RotateCcw size={14} /> Retry Razorpay Payment (₹{priceFormatted})
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 3: PAYMENT SUCCESS & PUBLISHED LINK */}
                {step === "success" && (
                    <div className="space-y-4 text-left animate-fadeIn">
                        <div className="bg-gradient-to-r from-emerald-950/60 via-neutral-900 to-emerald-950/60 border border-emerald-500/40 rounded-2xl p-5 text-center space-y-3 shadow-xl">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto shadow-inner">
                                <CheckCircle2 size={28} className="text-emerald-400" />
                            </div>

                            <h4 className="font-display text-xl text-white font-bold">
                                Payment Verified & Keepsake Published! 🎉
                            </h4>

                            <div className="bg-black/60 border border-white/10 rounded-xl p-3 text-left space-y-1.5 text-xs text-neutral-300">
                                <div className="flex justify-between">
                                    <span className="text-neutral-400">Invoice Reference:</span>
                                    <span className="font-mono font-bold text-amber-300">{paymentRecord?.invoiceRef || "INV-LC-8921"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-400">Payment ID:</span>
                                    <span className="font-mono text-emerald-400 text-[11px]">{paymentRecord?.paymentId || "pay_verified"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-neutral-400">Amount Paid:</span>
                                    <span className="font-bold text-white">₹{priceFormatted} INR</span>
                                </div>
                            </div>

                            {/* UNLOCKED PUBLIC LIVE LINK BOX */}
                            <div className="bg-black/80 border border-emerald-500/40 rounded-xl p-3.5 space-y-2 text-left">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase tracking-widest text-emerald-300 font-semibold flex items-center gap-1">
                                        <Sparkles size={12} /> Active Public Link
                                    </span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                        ● Live
                                    </span>
                                </div>

                                <div className="text-xs font-mono text-white break-all bg-neutral-900/90 p-2.5 rounded-lg border border-white/10 select-all">
                                    {publicLiveLink}
                                </div>

                                <div className="flex gap-2 pt-1">
                                    <button
                                        type="button"
                                        onClick={handleCopyPublicLink}
                                        className="lws-btn-ghost text-xs py-2 px-3 flex-1 justify-center border border-white/10 hover:bg-white/10 cursor-pointer font-medium"
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
                                        href={publicLiveLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="lws-btn-primary text-xs py-2 px-4 flex-1 justify-center flex items-center gap-1 cursor-pointer font-semibold shadow-md"
                                    >
                                        <ExternalLink size={13} /> Open Live Gift
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
