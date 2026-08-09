import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { submitFeedback } from "@/lib/feedbackService";

export default function CustomerFeedbackSection() {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [recommendation, setRecommendation] = useState("Yes, absolutely");
  const [testimonialPermission, setTestimonialPermission] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!feedback.trim() || feedback.trim().length < 5) {
      setErrorMsg("Please write a few words about your experience (at least 5 characters).");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitFeedback({
        rating,
        feedback,
        name,
        email,
        recommendation,
        testimonialPermission,
      });

      setIsSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong while sending feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="lws-pill mb-4 inline-flex items-center gap-1.5">
          <Sparkles size={12} className="text-[#f8b5c4]" />
          <span>YOUR WORDS MATTER</span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl mb-4 lws-gradient-text">
          How did LoveCrafted feel?
        </h2>
        <p className="text-[color:var(--lws-text-muted)] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
          Every keepsake is made to mean something. Tell us how yours felt — what you loved, what we could improve, or what you'd like to see next.
        </p>
      </div>

      {/* Main Form Card or Success Card */}
      <div className="lws-card p-6 md:p-10 relative overflow-hidden bg-gradient-to-b from-[#180912]/90 via-[#12050b]/80 to-[#0a0508] border border-rose-500/20 shadow-2xl rounded-3xl">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="py-12 px-4 text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-[color:var(--lws-pink)] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={32} />
              </div>

              <div className="space-y-2">
                <h3 className="font-display text-3xl md:text-4xl text-[color:var(--lws-cream)]">
                  Thank you for sharing a little of your story with us.
                </h3>
                <p className="text-base text-[color:var(--lws-text-muted)] max-w-md mx-auto leading-relaxed">
                  Your words help us make LoveCrafted better.
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFeedback("");
                    setName("");
                    setEmail("");
                    setTestimonialPermission(false);
                  }}
                  className="lws-btn-ghost text-xs py-2.5 px-6"
                >
                  Send another note
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="feedback-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-8"
            >
              {/* Rating Control (1-5 Hearts) */}
              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-widest text-[color:var(--lws-pink)] font-semibold">
                  How was your LoveCrafted experience?
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating || rating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-2 rounded-xl transition-all transform hover:scale-110 focus:outline-none cursor-pointer"
                        title={`${star} Heart${star > 1 ? "s" : ""}`}
                      >
                        <Heart
                          size={28}
                          className={`transition-colors duration-200 ${
                            active
                              ? "fill-[#f8b5c4] text-[#f8b5c4] drop-shadow-[0_0_8px_rgba(248,181,196,0.6)]"
                              : "text-neutral-600 hover:text-neutral-400"
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="ml-2 text-xs font-mono text-[color:var(--lws-text-muted)]">
                    {rating} / 5
                  </span>
                </div>
              </div>

              {/* Feedback Textarea */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-widest text-[color:var(--lws-cream)] font-medium">
                  Tell us about it
                </label>
                <textarea
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What did you love? What could be better?"
                  className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-sm text-[color:var(--lws-cream)] placeholder-neutral-500 focus:outline-none focus:border-[color:var(--lws-pink)]/60 transition-colors leading-relaxed resize-none"
                />
              </div>

              {/* Name & Email Fields */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest text-[color:var(--lws-cream)] font-medium">
                    Your name <span className="text-neutral-500 text-[10px] lowercase">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="How should we call you?"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-[color:var(--lws-cream)] placeholder-neutral-500 focus:outline-none focus:border-[color:var(--lws-pink)]/60 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-widest text-[color:var(--lws-cream)] font-medium">
                    Email <span className="text-neutral-500 text-[10px] lowercase">(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-[color:var(--lws-cream)] placeholder-neutral-500 focus:outline-none focus:border-[color:var(--lws-pink)]/60 transition-colors"
                  />
                </div>
              </div>

              {/* Recommendation Radio Pills */}
              <div className="space-y-3">
                <label className="block text-xs uppercase tracking-widest text-[color:var(--lws-cream)] font-medium">
                  Would you recommend LoveCrafted to someone you love?
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: "Yes, absolutely", label: "Yes, absolutely" },
                    { id: "Maybe / Not yet", label: "Maybe / Not yet" },
                  ].map((opt) => {
                    const isSelected = recommendation === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setRecommendation(opt.id)}
                        className={`px-4 py-2 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-rose-500/20 border-[#f8b5c4] text-white shadow-md"
                            : "bg-black/40 border-white/10 text-neutral-400 hover:border-white/20 hover:text-neutral-200"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Testimonial Feature Permission Checkbox (Unchecked by default) */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={testimonialPermission}
                    onChange={(e) => setTestimonialPermission(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-white/20 bg-black/60 text-[#f8b5c4] focus:ring-0 focus:ring-offset-0 accent-[#f8b5c4] cursor-pointer"
                  />
                  <span className="text-xs text-[color:var(--lws-text-muted)] leading-relaxed group-hover:text-neutral-300 transition-colors">
                    You're welcome to feature my feedback on LoveCrafted.
                  </span>
                </label>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 animate-fadeIn">
                  {errorMsg}
                </div>
              )}

              {/* Submit CTA Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="lws-btn-primary py-3.5 px-8 inline-flex items-center gap-2 cursor-pointer text-sm shadow-xl"
                >
                  <span>{isSubmitting ? "Sending..." : "Send My Feedback"}</span>
                  <Send size={15} />
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
