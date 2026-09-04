import React, { useState, useEffect, useMemo } from "react";
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
  Sparkles,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import HeartQRCard from "./HeartQRCard";
import { openRazorpayCheckout } from "../lib/paymentService";

export default function PublishModal({
  isOpen,
  onClose,
  templateSlug,
  templateId,
  draftTitle,
  price = 9,
  customContent,
  draft,
}) {
  const actualSlug = templateSlug || templateId || "aurora-noire";
  const actualContent = useMemo(() => customContent || draft || {}, [customContent, draft]);
  const priceFormatted = (price || 9).toLocaleString("en-IN");

  const [senderName, setSenderName] = useState(
    () => actualContent.partner1_name || actualContent.partner1 || ""
  );
  const [partnerName, setPartnerName] = useState(
    () => actualContent.partner2_name || actualContent.partner2 || ""
  );
  const [customSlug, setCustomSlug] = useState("");
  const [step, setStep] = useState("form"); // "form" | "success"
  const [copiedLink, setCopiedLink] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (actualContent.partner1_name || actualContent.partner1) {
      setSenderName(actualContent.partner1_name || actualContent.partner1);
    }
    if (actualContent.partner2_name || actualContent.partner2) {
      setPartnerName(actualContent.partner2_name || actualContent.partner2);
    }
  }, [actualContent]);

  if (!isOpen) return null;

  const displayTitle = draftTitle || "Aurora Noire Keepsake";
  const slugPart = customSlug.trim()
    ? customSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-")
    : `${senderName || "our"}-story`.toLowerCase().replace(/[^a-z0-9-]/g, "-");

  const baseUrl =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://lovecrafted-official.netlify.app";
  const publishedUrl = `${baseUrl}/v/${slugPart}?active=true`;

  const handleLaunchRazorpay = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsProcessing(true);

    try {
      await openRazorpayCheckout({
        amount: price || 9,
        templateName: displayTitle,
        customerName: senderName || "Romantic Creator",
        customerEmail: `${(senderName || "love").toLowerCase().replace(/[^a-z0-9]/g, "")}@lovecrafted.me`,
        onSuccess: (paymentData) => {
          try {
            const storyData = {
              slug: slugPart,
              senderName,
              partnerName,
              templateSlug: actualSlug,
              customContent: actualContent,
              payment: paymentData,
              publishedAt: new Date().toISOString(),
            };
            localStorage.setItem(`lovecrafted:story:${slugPart}`, JSON.stringify(storyData));
            localStorage.setItem(`lws:story:${slugPart}`, JSON.stringify(storyData));
            localStorage.setItem(`lovecrafted:activated:${slugPart}`, "true");
          } catch {}
          setIsProcessing(false);
          setStep("success");
          toast.success("Payment verified! Your keepsake is now published! 🎉💍");
        },
        onFailure: (errMsg) => {
          setIsProcessing(false);
          toast.error(errMsg || "Payment could not be completed.");
        },
        onDismiss: () => {
          setIsProcessing(false);
        },
      });
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      toast.error("Failed to open Razorpay modal.");
    }
  };

  const handleCopy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(publishedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-[#d48b95]/30 bg-[#0e070a] p-5 sm:p-7 text-[#f5e6d3] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] scrollbar-thin">
        
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
            <span>Official Razorpay Checkout</span>
          </div>
        </div>

        {/* Modal Header */}
        <div className="text-center mt-4 space-y-1.5">
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-medium">
            {step === "form" && `Publish ${displayTitle}`}
            {step === "success" && `Keepsake Published! 🎉`}
          </h2>
          <p className="text-xs text-[#c5b0a5]/80 max-w-sm mx-auto leading-relaxed font-sans">
            {step === "form" && "Complete payment via Razorpay (UPI, Cards, NetBanking) to instantly activate your live keepsake URL."}
            {step === "success" && `Your romantic keepsake is live and ready to share with ${partnerName || "your partner"}!`}
          </p>
        </div>

        {/* STEP 1: FORM & DIRECT RAZORPAY CHECKOUT */}
        {step === "form" && (
          <form onSubmit={handleLaunchRazorpay} className="mt-6 space-y-4 text-left">
            {/* Price Card */}
            <div className="rounded-2xl border border-[#dfc19c]/15 bg-[#140a0f] p-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[0.6rem] font-semibold tracking-wider uppercase text-[#c5b0a5]/60 block">
                  ROMANTIC KEEPSAKE EDITION
                </span>
                <h3 className="font-serif text-base font-bold text-white">
                  {displayTitle}
                </h3>
              </div>
              <span className="font-serif text-2xl font-bold text-[#dfc19c]">
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
                placeholder="e.g. Kabir"
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
                Custom Keepsake Slug (Optional)
              </label>
              <div className="flex items-center bg-[#070305] border border-[#dfc19c]/20 rounded-xl px-4 h-11 text-xs">
                <span className="text-[#c5b0a5]/50 font-mono mr-1 select-none">/v/</span>
                <input
                  type="text"
                  placeholder="our-anniversary"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  className="bg-transparent text-white focus:outline-none w-full font-mono text-xs placeholder:text-[#c5b0a5]/40"
                />
              </div>
            </div>

            {/* Payment Method Badges */}
            <div className="flex items-center justify-center gap-4 py-1 text-[0.65rem] text-[#c5b0a5]/60 font-sans">
              <span>💳 Credit/Debit Cards</span>
              <span>•</span>
              <span>📲 UPI / GPay / PhonePe</span>
              <span>•</span>
              <span>🏦 NetBanking</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full h-12 mt-2 rounded-xl bg-gradient-to-r from-[#e8b4b8] via-[#dfc19c] to-[#d48b95] text-[#0a0507] text-xs font-semibold flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-lg cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Opening Razorpay...
                </>
              ) : (
                <>
                  Pay ₹{priceFormatted} with Razorpay <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>
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

              {/* Direct WhatsApp Share Button */}
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `Hey ${partnerName || "my love"}! ❤️ I have crafted a special romantic digital keepsake for our anniversary. Open our story here:\n${publishedUrl}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex w-full h-10 items-center justify-center gap-2 rounded-xl bg-[#25D366] text-black font-semibold text-xs hover:bg-[#20bd5a] transition-all shadow-md cursor-pointer mt-1"
              >
                <span>📲 Share Directly on WhatsApp 💌</span>
              </a>
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