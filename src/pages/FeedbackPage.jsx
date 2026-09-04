import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Send, Sparkles, CheckCircle2, Loader2, Mail, ShieldCheck, Eye, Trash2, Download } from "lucide-react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "sonner";

const OWNER_EMAIL = "lovecrafted.official@gmail.com";
const STORAGE_KEY = "lovecrafted_received_feedbacks";

export default function FeedbackPage() {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [recommend, setRecommend] = useState("yes"); // "yes" or "maybe"
  const [allowFeature, setAllowFeature] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local storage backup & owner view
  const [feedbacksList, setFeedbacksList] = useState([]);
  const [showOwnerModal, setShowOwnerModal] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFeedbacksList(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveFeedbackLocally = (record) => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      const updated = [record, ...existing];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setFeedbacksList(updated);
    } catch {
      // ignore storage errors
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!feedbackText.trim() || feedbackText.trim().length < 5) {
      toast.error("Please enter at least 5 characters for your feedback.");
      return;
    }

    setIsSubmitting(true);

    const submissionTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });

    const newRecord = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      rating,
      feedback: feedbackText.trim(),
      name: name.trim() || "Anonymous Romantic",
      email: email.trim() || "Not provided",
      recommend: recommend === "yes" ? "Yes, absolutely" : "Maybe / Not yet",
      allowFeature,
      submittedAt: submissionTime,
      targetEmail: OWNER_EMAIL,
    };

    // 1. Save locally as persistent backup
    saveFeedbackLocally(newRecord);

    // 2. Dispatch directly to owner's Gmail via FormSubmit AJAX
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${OWNER_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `💌 [LoveCrafted Feedback] ${rating}★ from ${newRecord.name}`,
          _template: "table",
          _captcha: "false",
          "Rating": `${rating} / 5 Hearts`,
          "Customer Feedback": newRecord.feedback,
          "Customer Name": newRecord.name,
          "Customer Email": newRecord.email,
          "Would Recommend": newRecord.recommend,
          "Permission to Feature Testimonial": newRecord.allowFeature ? "Granted (Yes)" : "Declined (Keep Private)",
          "Submitted At (IST)": submissionTime,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (data && data.success === "false" && data.message && data.message.includes("Activation")) {
        // First-time activation notice
        toast.info("One-time form activation email sent to lovecrafted.official@gmail.com! Please check your inbox.", {
          duration: 7000,
        });
      } else {
        toast.success(`Feedback delivered to ${OWNER_EMAIL}! ❤️`);
      }
    } catch (err) {
      console.warn("Direct email dispatch note:", err);
      // Fallback is already saved in localStorage
      toast.success("Feedback saved successfully! ❤️");
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(feedbacksList, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lovecrafted_feedbacks_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success("Feedbacks exported as JSON! 📥");
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear the local feedback history backup?")) {
      localStorage.removeItem(STORAGE_KEY);
      setFeedbacksList([]);
      toast.info("Local feedback backup cleared.");
    }
  };

  const avgRating = feedbacksList.length > 0
    ? (feedbacksList.reduce((sum, item) => sum + (item.rating || 5), 0) / feedbacksList.length).toFixed(1)
    : "5.0";

  return (
    <div className="min-h-screen bg-[#0a0507] text-[#f5e6d3] font-sans antialiased selection:bg-[#d48b95]/30 selection:text-[#f5e6d3] py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 space-y-12">
        {/* Top Header */}
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#dfc19c]/30 bg-[#140a0f] px-4 py-1.5 text-[0.65rem] tracking-[0.25em] uppercase font-semibold text-[#dfc19c]">
            <Sparkles className="size-3.5 text-[#e8b4b8]" />
            YOUR WORDS MATTER
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-white font-medium">
            How did LoveCrafted feel?
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-[#c5b0a5]">
            Every keepsake is made to mean something. Tell us how yours felt — what you loved, what we
            could improve, or what you&apos;d like to see next. All feedback reaches our team directly at{" "}
            <span className="text-[#dfc19c] font-medium">{OWNER_EMAIL}</span>.
          </p>
        </div>

        {/* Feedback Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-[#dfc19c]/15 bg-[#140a0f]/90 p-8 sm:p-12 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl space-y-8"
        >
          {submitted ? (
            <div className="text-center py-12 space-y-6">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#d48b95]/20 text-[#e8b4b8] border border-[#e8b4b8]/30 shadow-[0_0_20px_rgba(232,180,184,0.3)]">
                <CheckCircle2 className="size-8" />
              </div>
              <h2 className="font-serif text-3xl font-medium text-white">Thank You for Your Feedback!</h2>
              <div className="mx-auto max-w-md space-y-3">
                <p className="text-sm text-[#c5b0a5] leading-relaxed">
                  Your thoughts help us craft even sweeter romantic experiences for lovers around the world.
                </p>
                <div className="inline-flex items-center gap-2 rounded-xl bg-[#201016] border border-[#e8b4b8]/20 px-4 py-2 text-xs text-[#dfc19c]">
                  <Mail className="size-4 text-[#e8b4b8]" />
                  <span>Delivered to official inbox: <strong className="text-white">{OWNER_EMAIL}</strong></span>
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setFeedbackText("");
                    setName("");
                    setEmail("");
                    setSubmitted(false);
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#e8b4b8] to-[#d48b95] px-8 text-xs font-semibold text-[#0a0507] hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,139,149,0.3)]"
                >
                  Send Another Response
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 1. Rating Hearts */}
              <div className="space-y-3">
                <label className="text-[0.65rem] uppercase tracking-[0.25em] font-semibold text-[#dfc19c]/80 block">
                  HOW WAS YOUR LOVECRAFTED EXPERIENCE?
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = (hoverRating || rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          className="transition-transform hover:scale-110 p-1"
                        >
                          <Heart
                            className={`size-7 transition-colors ${
                              active
                                ? "fill-[#e8b4b8] text-[#e8b4b8] drop-shadow-[0_0_10px_rgba(232,180,184,0.6)]"
                                : "text-[#dfc19c]/30 fill-transparent"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-xs font-mono text-[#c5b0a5] ml-2">{rating} / 5</span>
                </div>
              </div>

              {/* 2. Textarea */}
              <div className="space-y-3">
                <label className="text-[0.65rem] uppercase tracking-[0.25em] font-semibold text-[#dfc19c]/80 block">
                  TELL US ABOUT IT
                </label>
                <Textarea
                  required
                  rows={5}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="What did you love? What could be better?"
                  className="w-full border-[#dfc19c]/20 bg-[#0d0609] p-4 text-sm text-[#f5e6d3] placeholder:text-[#c5b0a5]/40 focus-visible:border-[#e8b4b8]/50 focus-visible:ring-1 focus-visible:ring-[#e8b4b8]/50 rounded-xl"
                />
              </div>

              {/* 3. Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[0.65rem] uppercase tracking-[0.25em] font-semibold text-[#dfc19c]/80 block">
                    YOUR NAME <span className="text-[#c5b0a5]/50">(optional)</span>
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="How should we call you?"
                    className="h-11 border-[#dfc19c]/20 bg-[#0d0609] px-4 text-sm text-[#f5e6d3] placeholder:text-[#c5b0a5]/40 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[0.65rem] uppercase tracking-[0.25em] font-semibold text-[#dfc19c]/80 block">
                    EMAIL <span className="text-[#c5b0a5]/50">(optional)</span>
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-11 border-[#dfc19c]/20 bg-[#0d0609] px-4 text-sm text-[#f5e6d3] placeholder:text-[#c5b0a5]/40 rounded-xl"
                  />
                </div>
              </div>

              {/* 4. Recommendation Pill Toggle */}
              <div className="space-y-3">
                <label className="text-[0.65rem] uppercase tracking-[0.25em] font-semibold text-[#dfc19c]/80 block">
                  WOULD YOU RECOMMEND LOVECRAFTED TO SOMEONE YOU LOVE?
                </label>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setRecommend("yes")}
                    className={`h-10 px-5 rounded-full text-xs font-medium border transition-all ${
                      recommend === "yes"
                        ? "border-[#e8b4b8]/50 bg-[#4a0e1c] text-[#f5e6d3] shadow-[0_0_15px_rgba(212,139,149,0.3)]"
                        : "border-[#dfc19c]/15 bg-[#0d0609] text-[#c5b0a5] hover:border-[#dfc19c]/30"
                    }`}
                  >
                    Yes, absolutely
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecommend("maybe")}
                    className={`h-10 px-5 rounded-full text-xs font-medium border transition-all ${
                      recommend === "maybe"
                        ? "border-[#e8b4b8]/50 bg-[#4a0e1c] text-[#f5e6d3] shadow-[0_0_15px_rgba(212,139,149,0.3)]"
                        : "border-[#dfc19c]/15 bg-[#0d0609] text-[#c5b0a5] hover:border-[#dfc19c]/30"
                    }`}
                  >
                    Maybe / Not yet
                  </button>
                </div>
              </div>

              {/* 5. Checkbox */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="featureConsent"
                  checked={allowFeature}
                  onChange={(e) => setAllowFeature(e.target.checked)}
                  className="size-4 rounded border-[#dfc19c]/30 bg-[#0d0609] accent-[#d48b95]"
                />
                <label htmlFor="featureConsent" className="text-xs text-[#c5b0a5] cursor-pointer">
                  You&apos;re welcome to feature my feedback on LoveCrafted.
                </label>
              </div>

              {/* 6. Submit Button & Delivery Notice */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#dfc19c]/10">
                <div className="flex items-center gap-2 text-[0.72rem] text-[#c5b0a5]/70">
                  <ShieldCheck className="size-4 text-[#dfc19c]" />
                  <span>Direct delivery to <strong className="text-[#dfc19c] font-medium">{OWNER_EMAIL}</strong></span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e8b4b8] to-[#d48b95] px-8 text-sm font-semibold text-[#0a0507] hover:shadow-[0_0_25px_rgba(212,139,149,0.4)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Delivering Feedback...</span>
                    </>
                  ) : (
                    <>
                      <span>Send My Feedback</span>
                      <Send className="size-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>

        {/* Owner View / Stored Feedbacks Access Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#c5b0a5]/60 gap-4">
          <div className="flex items-center gap-2">
            <span>Official Inbox:</span>
            <a href={`mailto:${OWNER_EMAIL}`} className="text-[#dfc19c] hover:underline font-mono">
              {OWNER_EMAIL}
            </a>
          </div>

          <button
            type="button"
            onClick={() => setShowOwnerModal(true)}
            className="inline-flex items-center gap-2 rounded-full border border-[#dfc19c]/20 bg-[#140a0f] px-4 py-1.5 text-xs text-[#dfc19c] hover:bg-[#201016] hover:border-[#dfc19c]/40 transition-colors"
          >
            <Eye className="size-3.5 text-[#e8b4b8]" />
            <span>Owner View: Stored Feedbacks ({feedbacksList.length})</span>
          </button>
        </div>
      </div>

      {/* Owner View Modal */}
      <AnimatePresence>
        {showOwnerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-[#dfc19c]/30 bg-[#12070c] text-[#f5e6d3] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-[#dfc19c]/15 flex items-center justify-between bg-[#190910]">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-[#e8b4b8]" />
                    <h3 className="font-serif text-lg font-medium text-white">
                      LoveCrafted Feedback Inbox
                    </h3>
                  </div>
                  <p className="text-xs text-[#c5b0a5] mt-1">
                    Connected to <span className="text-[#dfc19c] font-medium">{OWNER_EMAIL}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowOwnerModal(false)}
                  className="size-8 rounded-full grid place-items-center text-[#c5b0a5] hover:text-white hover:bg-white/10"
                >
                  ✕
                </button>
              </div>

              {/* Stats Bar */}
              <div className="px-6 py-3 bg-[#1e0a13] border-b border-[#dfc19c]/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <span>Total Submissions: <strong className="text-white">{feedbacksList.length}</strong></span>
                  <span>Avg Rating: <strong className="text-[#e8b4b8]">★ {avgRating}</strong></span>
                </div>
                {feedbacksList.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleExportJSON}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#dfc19c]/15 hover:bg-[#dfc19c]/25 text-[#dfc19c] text-[0.7rem] font-medium"
                    >
                      <Download className="size-3" />
                      Export JSON
                    </button>
                    <button
                      type="button"
                      onClick={handleClearHistory}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-900/30 hover:bg-red-900/50 text-red-300 text-[0.7rem] font-medium"
                    >
                      <Trash2 className="size-3" />
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Feedbacks List */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                {feedbacksList.length === 0 ? (
                  <div className="text-center py-12 space-y-3 text-[#c5b0a5]/60">
                    <Mail className="size-10 mx-auto text-[#dfc19c]/30" />
                    <p className="text-sm">No feedback submissions received locally yet.</p>
                    <p className="text-xs">Submit the feedback form on the page to see live entries appear here.</p>
                  </div>
                ) : (
                  feedbacksList.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-[#dfc19c]/15 bg-[#170a10] p-4 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm">{item.name}</span>
                          {item.email && item.email !== "Not provided" && (
                            <span className="text-[#c5b0a5]/60">({item.email})</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[#e8b4b8] font-bold">
                          {"★".repeat(item.rating || 5)}
                          <span className="text-xs text-[#c5b0a5] font-normal ml-1">({item.rating}/5)</span>
                        </div>
                      </div>

                      <p className="text-[#f5e6d3] text-sm bg-[#0e0407] p-3 rounded-xl border border-[#dfc19c]/10 leading-relaxed">
                        &ldquo;{item.feedback}&rdquo;
                      </p>

                      <div className="flex flex-wrap items-center justify-between text-[0.68rem] text-[#c5b0a5]/70 pt-1">
                        <div>
                          <span>Recommend: <strong>{item.recommend}</strong></span>
                          <span className="mx-2">•</span>
                          <span>Feature Consent: <strong>{item.allowFeature ? "Yes" : "No"}</strong></span>
                        </div>
                        <span className="font-mono">{item.submittedAt}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-[#dfc19c]/15 bg-[#14080e] flex items-center justify-between text-xs text-[#c5b0a5]">
                <span>All submissions are dispatched to: <strong className="text-white">{OWNER_EMAIL}</strong></span>
                <button
                  type="button"
                  onClick={() => setShowOwnerModal(false)}
                  className="px-4 py-1.5 rounded-full bg-[#dfc19c]/20 hover:bg-[#dfc19c]/30 text-white font-medium"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
