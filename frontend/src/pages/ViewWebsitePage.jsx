import React, { useMemo, useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import AnniversaryKeepsakeView from "@/components/AnniversaryKeepsakeView";
import templateOccasions from "@/data/templateOccasions.json";
import { Heart, Lock, Clock, Send, ShieldCheck, ArrowRight, Eye, ArrowLeft, Edit3, Sparkles } from "lucide-react";
import { openRazorpayCheckout } from "@/lib/paymentService";
import PublishModal from "@/components/PublishModal";
import { toast } from "sonner";

export default function ViewWebsitePage() {
  const navigate = useNavigate();
  const { shareId } = useParams();
  const [searchParams] = useSearchParams();
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // Price for Aurora Noire Anniversary Edition (₹9)
  const templatePrice = templateOccasions["aurora-noire"]?.price || 9;

  // Check if link is preview or activated
  const isPreview =
    searchParams.get("preview") === "true" ||
    searchParams.get("active") === "true" ||
    searchParams.get("verified") === "1" ||
    searchParams.get("v") === "1" ||
    shareId === "aurora-noire" ||
    !shareId;

  const [isActivatedLocally, setIsActivatedLocally] = useState(() => {
    if (isPreview) return true;
    try {
      return (
        localStorage.getItem(`lovecrafted:activated:${shareId}`) === "true" ||
        localStorage.getItem(`lws:activated:${shareId}`) === "true"
      );
    } catch {
      return false;
    }
  });

  // Resolve content/draft for the keepsake
  const draftContent = useMemo(() => {
    const defaultData = templateOccasions["aurora-noire"] || {};

    // 1. Try URL encoded parameter `d`
    const encodedData = searchParams.get("d");
    if (encodedData) {
      try {
        const cleanEncoded = decodeURIComponent(encodedData);
        const rawBinary = atob(cleanEncoded);
        const decodedStr = decodeURIComponent(
          Array.from(rawBinary)
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        return { ...defaultData, ...JSON.parse(decodedStr) };
      } catch (e) {
        try {
          const fallbackStr = decodeURIComponent(escape(atob(decodeURIComponent(encodedData))));
          return { ...defaultData, ...JSON.parse(fallbackStr) };
        } catch (err) {
          console.error("Failed to decode URL content data", err);
        }
      }
    }

    // 2. Try published story from localStorage
    if (shareId && shareId !== "aurora-noire") {
      try {
        const storedStory =
          localStorage.getItem(`lovecrafted:story:${shareId}`) ||
          localStorage.getItem(`lws:story:${shareId}`);
        if (storedStory) {
          const parsed = JSON.parse(storedStory);
          return {
            ...defaultData,
            ...(parsed.customContent || {}),
            partner1_name: parsed.senderName || defaultData.partner1_name,
            partner2_name: parsed.partnerName || defaultData.partner2_name,
          };
        }
      } catch (e) {}
    }

    // 3. Try studio draft from localStorage
    try {
      const storedDraft =
        localStorage.getItem("lws:draft:aurora-noire") ||
        localStorage.getItem("lws:draft:aurora-noire:demo");
      if (storedDraft) {
        return { ...defaultData, ...JSON.parse(storedDraft) };
      }
    } catch (e) {}

    return defaultData;
  }, [shareId, searchParams]);

  // Handle direct activation via Razorpay
  const handlePayAndActivate = async () => {
    try {
      await openRazorpayCheckout({
        amount: templatePrice,
        templateName: "Aurora Noire Keepsake",
        customerName: draftContent.partner1_name || "Romantic Creator",
        customerEmail: "creator@lovecrafted.app",
        onSuccess: () => {
          try {
            localStorage.setItem(`lovecrafted:activated:${shareId}`, "true");
          } catch {}
          setIsActivatedLocally(true);
          toast.success("Payment verified! Keepsake activated instantly 🎉");
        },
        onFailure: (err) => {
          toast.error(err || "Payment failed");
        },
      });
    } catch (err) {
      toast.error("Failed to open Razorpay");
    }
  };

  const handleExitPreview = () => {
    if (window.history?.length > 1) {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  // If not activated and not in preview, show romantic activation card with synced ₹9 price
  if (!isActivatedLocally) {
    return (
      <div className="min-h-screen bg-[#070305] text-white flex flex-col items-center justify-center p-4 sm:p-6 text-center">
        <div className="bg-[#12080f] border border-[#dfc19c]/25 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 relative overflow-hidden">
          <div className="size-14 rounded-full bg-[#dfc19c]/15 border border-[#dfc19c]/30 text-[#dfc19c] flex items-center justify-center mx-auto shadow-inner">
            <Lock size={26} className="text-[#dfc19c]" />
          </div>

          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d48b95]/15 border border-[#d48b95]/30 text-[#e8b4b8] text-[0.65rem] font-medium tracking-wide">
              <Clock size={12} /> Romantic Keepsake Activation
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white pt-2">
              Keepsake Awaiting Activation
            </h2>
          </div>

          <div className="rounded-2xl border border-[#dfc19c]/15 bg-[#0a0507] p-4 text-left space-y-1">
            <p className="text-xs text-[#c5b0a5]/80 leading-relaxed font-sans">
              This handcrafted romantic keepsake is ready. Complete payment of{" "}
              <strong className="text-white font-serif text-sm">₹{templatePrice}</strong> via Razorpay to instantly unlock the full interactive experience.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              onClick={handlePayAndActivate}
              className="w-full h-11 bg-gradient-to-r from-[#e8b4b8] to-[#d48b95] text-[#0a0507] rounded-xl flex items-center justify-center gap-2 text-xs font-semibold shadow-lg hover:opacity-95 transition-all cursor-pointer"
            >
              <ShieldCheck size={14} /> Pay ₹{templatePrice} &amp; Unlock Keepsake
            </button>

            <button
              type="button"
              onClick={() => setIsActivatedLocally(true)}
              className="w-full h-10 border border-[#dfc19c]/20 bg-[#160b11] text-[#f5e6d3] rounded-xl flex items-center justify-center gap-2 text-xs font-medium hover:border-[#e8b4b8] transition-colors cursor-pointer"
            >
              <Eye size={13} /> Preview Keepsake
            </button>

            <button
              type="button"
              onClick={handleExitPreview}
              className="w-full text-center text-xs text-[#c5b0a5]/60 hover:text-[#f5e6d3] transition-colors pt-2 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowLeft size={13} /> Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active / Preview Keepsake: Fullscreen romantic digital keepsake
  return (
    <div className="relative min-h-screen bg-[#070305]">
      {/* Floating Exit & Preview Controls Bar */}
      {isPreview ? (
        <header className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50 flex items-center gap-2 max-w-[calc(100vw-24px)] overflow-x-auto no-scrollbar py-1">
          {/* 1. Exit Preview Button */}
          <button
            type="button"
            data-testid="exit-preview-button"
            onClick={handleExitPreview}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#0a0507]/90 hover:bg-[#1a0c16] border border-[#dfc19c]/40 hover:border-[#dfc19c]/80 text-[#f5e6d3] hover:text-white text-xs font-medium shadow-2xl backdrop-blur-md transition-all active:scale-95 cursor-pointer group shrink-0"
            title="Exit preview and return to Dashboard/Editor"
          >
            <ArrowLeft size={13} className="text-[#dfc19c] group-hover:-translate-x-0.5 transition-transform" />
            <span>Exit</span>
          </button>

          {/* 2. Edit Keepsake in Studio Button - Always visible on mobile & desktop */}
          <Link
            to={`/editor/${shareId === "aurora-noire" || !shareId ? "aurora-noire" : shareId}`}
            data-testid="edit-keepsake-button"
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-[#1e0e18]/90 hover:bg-[#2a1322] border border-[#e8b4b8]/40 hover:border-[#e8b4b8] text-[#f5e6d3] hover:text-[#e8b4b8] text-xs font-semibold shadow-lg backdrop-blur-md transition-all active:scale-95 shrink-0 cursor-pointer"
            title="Edit this Keepsake in Studio"
          >
            <Edit3 size={13} className="text-[#e8b4b8]" />
            <span>Edit Keepsake</span>
          </Link>

          {/* 3. Quick Publish Button */}
          <button
            type="button"
            onClick={() => setIsPublishModalOpen(true)}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#e8b4b8] to-[#d48b95] text-[#0a0507] hover:opacity-95 text-xs font-semibold shadow-lg backdrop-blur-md transition-all active:scale-95 cursor-pointer shrink-0"
            title="Publish Keepsake & Get Live WhatsApp Link"
          >
            <Send size={12} className="text-[#0a0507]" />
            <span className="hidden sm:inline">Publish Keepsake</span>
            <span className="sm:hidden">Publish</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#0a0507]/20 rounded-full">₹{templatePrice}</span>
          </button>

          {/* 4. Live Preview Indicator Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#dfc19c]/10 border border-[#dfc19c]/25 text-[#dfc19c] text-[0.68rem] tracking-wider uppercase font-medium backdrop-blur-md shrink-0">
            <span className="size-1.5 rounded-full bg-[#dfc19c] animate-pulse" />
            Live Preview
          </div>
        </header>
      ) : (
        /* Discreet Back button for visitors navigating within site */
        window.history?.length > 1 && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="fixed top-3 left-3 sm:top-4 sm:left-4 z-50 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0a0507]/80 hover:bg-[#180c14] border border-[#dfc19c]/25 text-[#c5b0a5] hover:text-[#f5e6d3] text-xs backdrop-blur-md transition-all cursor-pointer"
            title="Go back"
          >
            <ArrowLeft size={13} className="text-[#dfc19c]" />
            <span>Back</span>
          </button>
        )
      )}

      {/* Fullscreen Keepsake Experience */}
      <AnniversaryKeepsakeView draft={draftContent} />

      {/* Floating Bottom Edit Button in Preview Mode */}
      {isPreview && (
        <div className="fixed bottom-4 left-4 z-50">
          <Link
            to={`/editor/${shareId === "aurora-noire" || !shareId ? "aurora-noire" : shareId}`}
            data-testid="bottom-edit-button"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#180a14]/95 hover:bg-[#261020] border border-[#e8b4b8]/40 hover:border-[#e8b4b8] text-[#f5e6d3] hover:text-[#e8b4b8] text-xs font-semibold shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Edit this Keepsake in Studio"
          >
            <Edit3 size={13} className="text-[#e8b4b8]" />
            <span>Edit Keepsake</span>
          </Link>
        </div>
      )}

      {/* Subtle Romantic Atelier Floating Pill Badge */}
      <div className="fixed bottom-4 right-4 z-50">
        <Link
          to="/"
          target="_blank"
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a0507]/90 border border-[#dfc19c]/25 text-[#f5e6d3] hover:text-[#e8b4b8] text-xs shadow-2xl backdrop-blur-md transition-all hover:scale-105"
        >
          <Heart size={12} className="text-[#e8b4b8] fill-[#e8b4b8] animate-pulse" />
          <span className="font-serif text-[0.72rem]">
            Crafted with <strong>LoveCrafted</strong>
          </span>
        </Link>
      </div>

      {/* Publish & WhatsApp Share Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        templateSlug="aurora-noire"
        draftTitle={draftContent.title || "Aurora Noire Keepsake"}
        price={templatePrice}
        draft={draftContent}
        customContent={draftContent}
      />
    </div>
  );
}
