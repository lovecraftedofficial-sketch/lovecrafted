import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Send, Sparkles, CheckCircle2 } from "lucide-react";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";

export default function FeedbackPage() {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [recommend, setRecommend] = useState("yes"); // "yes" or "maybe"
  const [allowFeature, setAllowFeature] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

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
            could improve, or what you&apos;d like to see next.
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
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#d48b95]/20 text-[#e8b4b8] border border-[#e8b4b8]/30">
                <CheckCircle2 className="size-8" />
              </div>
              <h2 className="font-serif text-3xl font-medium text-white">Thank You for Your Feedback!</h2>
              <p className="mx-auto max-w-md text-sm text-[#c5b0a5] leading-relaxed">
                Your thoughts help us craft even sweeter romantic experiences for lovers around the world.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#d48b95] px-8 text-xs font-semibold text-[#0a0507] hover:bg-[#e8b4b8] transition-all"
              >
                Send Another Response
              </button>
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

              {/* 6. Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e8b4b8] to-[#d48b95] px-8 text-sm font-semibold text-[#0a0507] hover:shadow-[0_0_25px_rgba(212,139,149,0.4)] transition-all"
                >
                  <span>Send My Feedback</span>
                  <Send className="size-4" />
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
