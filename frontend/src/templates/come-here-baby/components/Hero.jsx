import React from "react";
import { motion } from "framer-motion";
import { Heart, ArrowDown } from "lucide-react";

export default function Hero({ content = {}, onNavigate = () => {} }) {
  const partnerName = content.partnerName || "My Baby";
  const heroBadge = content.heroBadge || "♡ just for my baby ♡";
  const heroGreeting = content.heroGreeting || "Heyy, my baby. ❤️";
  const heroHeadline = content.heroHeadline || "Aaj bohot tiring feel ho raha hai na?";
  const heroCopy1 = content.heroCopy1 || "Don't worry, baby. I'm always right beside you.";
  const heroCopy2 = content.heroCopy2 || "I know today might feel a little heavier than usual, so I made something small for you. 🥺";
  const heroCopy3 = content.heroCopy3 || "Come, check it out. I hope it makes you smile. ❤️";
  const heroImage = content.heroImage || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80";
  const ctaPrimary = content.ctaPrimary || "💗 See What I Made For You";
  const ctaSecondary = content.ctaSecondary || "🫂 Come Get Your Hug";

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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="space-y-2"
          >
            <p className="text-xl sm:text-2xl font-serif text-[#f8b3c3]/90 font-light italic">
              {heroGreeting}
            </p>
            <h1 className="text-4xl sm:text-6xl font-serif text-white font-medium leading-tight">
              {heroHeadline}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="space-y-3 text-base sm:text-lg text-[#f8b3c3]/80 font-light leading-relaxed max-w-xl"
          >
            <p className="font-medium text-white/90">{heroCopy1}</p>
            <p>{heroCopy2}</p>
            <p className="italic font-serif text-[#f8b3c3]">{heroCopy3}</p>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="pt-4 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => onNavigate("notes")}
              className="px-7 py-3.5 rounded-full bg-[#3d0a18] hover:bg-[#4d0d20] text-white text-sm font-medium border border-[#f8b3c3]/30 shadow-lg shadow-[#3d0a18]/50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{ctaPrimary}</span>
            </button>
            <button
              onClick={() => onNavigate("needs")}
              className="px-7 py-3.5 rounded-full bg-[#2a0c15]/60 hover:bg-[#2a0c15] text-[#f8b3c3] text-sm font-medium border border-[#f8b3c3]/20 transition-all cursor-pointer"
            >
              <span>{ctaSecondary}</span>
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
                ♡ for {partnerName} ♡
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="pb-4 text-center z-10">
        <button
          onClick={() => onNavigate("notes")}
          className="inline-flex flex-col items-center gap-1.5 text-xs text-[#f8b3c3]/50 hover:text-[#f8b3c3] transition-colors cursor-pointer"
        >
          <span>Scroll down for love</span>
          <ArrowDown size={14} className="animate-bounce" />
        </button>
      </div>
    </section>
  );
}
