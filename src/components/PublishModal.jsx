import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Copy,
  ExternalLink,
  Heart,
  Loader2,
  Lock,
  QrCode,
  Sparkles,
  AlertCircle
} from "lucide-react";
import HeartQRCard from "./HeartQRCard";

export default function PublishModal({ isOpen, onClose, templateSlug, draftTitle, price = 1499, customContent }) {
  const OWNER_UPI_ID = "8618379301@pz";
  const priceFormatted = (price || 1499).toLocaleString("en-IN");

  const [senderName, setSenderName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [step, setStep] = useState("form"); // "form" | "payment" | "success"
  const [copiedLink, setCopiedLink] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const displayTitle = draftTitle || "My Baby";
  const slugPart = customSlug.trim()
    ? customSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-")
    : `${senderName || "our"}-story`.toLowerCase().replace(/[^a-z0-9-]/g, "-");

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3005";
  const publishedUrl = `${baseUrl}/v/${slugPart}`;

  const handleFormSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("payment");
    }, 800);
  };

  const handlePaymentComplete = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep("success");
    }, 1200);
  };

  const handleCopy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(publishedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full ${step === "success" ? "max-w-md max-h-[92vh] overflow-y-auto" : "max-w-md"} rounded-3xl border border-[#d48b95]/30 bg-[#0e070a] p-6 sm:p-7 text-[#f5e6d3] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] scrollbar-thin`}>
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-[#c5b0a5] hover:text-white transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Top Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-[#d48b95]/40 bg-[#1f0e18] text-[#e8b4b8] text-[0.7rem] font-medium tracking-wide">
            <ShieldCheck className="size-3.5 text-[#e8b4b8]" />
            <span>Secure Razorpay Checkout</span>
          </div>
        </div>

        {/* Modal Header */}
        <div className="text-center mt-4 space-y-1.5">
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium">
            {step === "form" && `Publish For ${displayTitle}`}
            {step === "payment" && `Complete Razorpay Payment`}
            {step === "success" && `Keepsake Published! 🎉`}
          </h2>
          <p className="text-xs text-[#c5b0a5]/80 max-w-sm mx-auto leading-relaxed font-sans">
            {step === "form" && "Enter recipient details and custom slug to unlock public sharing for this Sweet & Personal template."}
            {step === "payment" && `Scan QR or proceed with UPI / Razorpay to activate live URL.`}
            {step === "success" && `Your romantic keepsake is live and ready to share with ${partnerName || "your partner"}!`}
          </p>
        </div>

        {/* STEP 1: FORM */}
        {step === "form" && (
          <form onSubmit={handleFormSubmit} className="mt-6 space-y-4 text-left">
            {/* Price Card */}
            <div className="rounded-2xl border border-[#dfc19c]/15 bg-[#140a0f] p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[0.6rem] font-semibold tracking-wider uppercase text-[#c5b0a5]/60 block">
                  SWEET &amp; PERSONAL TIER TEMPLATE
                </span>
                <h3 className="font-serif text-base font-bold text-white">
                  {displayTitle}
                </h3>
              </div>
              <span className="font-serif text-xl font-bold text-[#dfc19c]">
                ₹{priceFormatted}
              </span>
            </div>

            {/* Your Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#f5e6d3]">
                Your Name <span className="text-[#e8b4b8]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full h-11 bg-[#070305] border border-[#dfc19c]/20 rounded-xl px-4 text-xs text-white placeholder:text-[#c5b0a5]/40 focus:outline-none focus:border-[#e8b4b8]"
              />
            </div>

            {/* Partner Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#f5e6d3]">
                Partner / Recipient Name <span className="text-[#e8b4b8]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ananya"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                className="w-full h-11 bg-[#070305] border border-[#dfc19c]/20 rounded-xl px-4 text-xs text-white placeholder:text-[#c5b0a5]/40 focus:outline-none focus:border-[#e8b4b8]"
              />
            </div>

            {/* Custom Story Slug */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#f5e6d3]">
                Custom Story Slug (Optional)
              </label>
              <div className="flex items-center bg-[#070305] border border-[#dfc19c]/20 rounded-xl px-4 h-11 text-xs">
                <span className="text-[#c5b0a5]/50 font-mono mr-1 select-none">/story/</span>
                <input
                  type="text"
                  placeholder="our-anniversary"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  className="bg-transparent text-white focus:outline-none w-full font-mono text-xs placeholder:text-[#c5b0a5]/40"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full h-12 mt-4 rounded-xl bg-gradient-to-r from-[#e8b4b8] via-[#dfc19c] to-[#d48b95] text-[#0a0507] text-xs font-semibold flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Preparing Checkout...
                </>
              ) : (
                <>
                  Proceed to Razorpay Checkout (₹{priceFormatted}) <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: RAZORPAY / UPI PAYMENT */}
        {step === "payment" && (
          <div className="mt-6 space-y-4 text-left animate-fadeIn">
            <div className="rounded-2xl border border-[#e8b4b8]/30 bg-[#140a0f] p-5 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs text-[#e8b4b8] font-semibold">
                <QrCode className="size-4" /> Scan &amp; Pay via UPI / Cards / NetBanking
              </div>
              <div className="bg-white p-3 rounded-xl inline-block mx-auto">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(`upi://pay?pa=${OWNER_UPI_ID}&am=${price}&cu=INR`)}`}
                  alt="Razorpay UPI QR"
                  className="w-36 h-36 mx-auto"
                />
              </div>
              <p className="text-xs text-[#c5b0a5]">UPI ID: <span className="font-mono text-white">{OWNER_UPI_ID}</span></p>
              <p className="text-xs text-[#dfc19c] font-bold">Total: ₹{priceFormatted} INR</p>
            </div>

            <button
              type="button"
              onClick={handlePaymentComplete}
              disabled={isProcessing}
              className="w-full h-12 rounded-xl bg-[#d48b95] text-[#0a0507] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#e8b4b8] transition-all cursor-pointer"
            >
              {isProcessing ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              Verify &amp; Activate Keepsake Link
            </button>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === "success" && (
          <div className="mt-5 space-y-4 text-center animate-fadeIn">
            <div className="size-11 rounded-full bg-[#d48b95]/20 border border-[#e8b4b8]/40 text-[#e8b4b8] flex items-center justify-center mx-auto">
              <Heart className="size-5 fill-[#e8b4b8] text-[#e8b4b8] animate-bounce" />
            </div>

            <div className="rounded-2xl border border-[#dfc19c]/20 bg-[#140a0f] p-4 text-left space-y-2">
              <span className="text-[0.65rem] uppercase tracking-wider text-[#e8b4b8] font-semibold block">
                YOUR LIVE STORY LINK
              </span>
              <div className="p-2.5 rounded-lg bg-[#070305] border border-[#dfc19c]/15 text-xs font-mono text-white break-all">
                {publishedUrl}
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex-1 h-9 rounded-lg border border-[#dfc19c]/20 text-xs text-[#f5e6d3] hover:bg-[#1f0e18] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="size-3.5" /> {copiedLink ? "Copied!" : "Copy Link"}
                </button>
                <a
                  href={publishedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 h-9 rounded-lg bg-[#d48b95] text-[#0a0507] text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-[#e8b4b8] cursor-pointer"
                >
                  <ExternalLink className="size-3.5" /> Open Story
                </a>
              </div>
            </div>

            {/* Heart-Shaped Red QR Keepsake Card */}
            <div className="pt-3 border-t border-[#dfc19c]/15 text-left space-y-2">
              <span className="text-[0.68rem] uppercase tracking-widest text-[#e8b4b8] font-semibold block text-center">
                ❤️ ROMANTIC KEEPSAKE QR CARD
              </span>
              <HeartQRCard
                url={publishedUrl}
                partnerName={partnerName}
                senderName={senderName}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}