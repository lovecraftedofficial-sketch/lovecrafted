import React from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, ArrowDown } from "lucide-react";

export default function Hero({ content = {}, onNavigate = () => {} }) {
  const partnerName = content.partnerName || "Ananya";
  const heroBadge = content.heroBadge || "for my baby ♡";
  const heroHeadline = content.heroHeadline || "Come here, baby.";
  const heroSubheading = content.heroSubheading || "You don't have to be okay today.";
  const heroParagraph = content.heroParagraph || "If your tummy hurts, your mood is everywhere, or you just want to curl up and disappear for a while... come here. I've got you.";
  const heroImage = content.heroImage || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80";
  const heroCaption = content.heroCaption || "my favorite girl.";
  const ctaPrimary = content.ctaPrimary || "Come Cuddle ♡";
  const ctaSecondary = content.ctaSecondary || "I Need Some Love";

  return (
    <section id="hero" className="relative min-h-screen bg-[#1c080e] text-[#f8b3c3] flex flex-col justify-between p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="h-16" />

      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center z-10 py-8">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3d0a18] border border-[#f8b3c3]/20 text-xs tracking-widest text-[#f8b3c3]"
          >
            <Heart size={13} className="fill-[#f8b3c3]" />
            <span>{heroBadge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-serif text-white font-medium leading-tight"
          >
            {heroHeadline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-xl sm:text-2xl font-serif italic text-[#f8b3c3]/90"
          >
            {heroSubheading}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="text-base sm:text-lg text-[#f8b3c3]/75 font-light leading-relaxed max-w-xl"
          >
            {heroParagraph}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="pt-4 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => onNavigate("care")}
              className="px-7 py-3.5 rounded-full bg-[#3d0a18] hover:bg-[#4d0d20] text-white text-sm font-medium border border-[#f8b3c3]/30 shadow-lg shadow-[#3d0a18]/50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Heart size={16} className="fill-[#f8b3c3] text-[#f8b3c3]" />
              <span>{ctaPrimary}</span>
            </button>
            <button
              onClick={() => onNavigate("mood")}
              className="px-7 py-3.5 rounded-full bg-[#2a0c15]/60 hover:bg-[#2a0c15] text-[#f8b3c3] text-sm font-medium border border-[#f8b3c3]/20 transition-all cursor-pointer"
            >
              {ctaSecondary}
            </button>
          </motion.div>
        </div>

        {/* Right Column: Intimate Portrait Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="lg:col-span-5 flex justify-center"
        >
          <div className="relative p-3 rounded-[2.2rem] bg-[#2a0c15] border border-[#f8b3c3]/25 shadow-2xl max-w-sm w-full">
            <div className="relative aspect-[4/5] rounded-[1.6rem] overflow-hidden border border-white/10">
              <img
                src={heroImage}
                alt={partnerName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1c080e] via-transparent to-transparent opacity-50" />
            </div>
            <div className="p-4 text-center">
              <p className="text-xs font-serif italic text-[#f8b3c3]/80">
                ♡ {heroCaption} ♡
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="pb-4 text-center z-10">
        <button
          onClick={() => onNavigate("mood")}
          className="inline-flex flex-col items-center gap-1.5 text-xs text-[#f8b3c3]/50 hover:text-[#f8b3c3] transition-colors cursor-pointer"
        >
          <span>Scroll down for love</span>
          <ArrowDown size={14} className="animate-bounce" />
        </button>
      </div>
    </section>
  );
}
