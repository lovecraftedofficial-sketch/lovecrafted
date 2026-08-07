import React from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, ArrowDown } from "lucide-react";

export default function Hero({ content = {}, onNavigate = () => {} }) {
  const partnerName = content.partnerName || "My Love";
  const heroGreeting = content.heroGreeting || "Welcome to your safe space,";
  const heroHeadline = content.heroHeadline || "I made a little corner on the internet just for you.";
  const heroSubtext = content.heroSubtext || "Whenever the world gets too loud, or you need a quiet reminder of how deeply you are cherished, come here. I'm always right beside you.";
  const heroImage = content.heroImage || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80";
  const heroBadge = content.heroBadge || "Your Safe Haven · Forever";

  return (
    <section id="hero" className="relative min-h-screen bg-[#16080c] text-[#f7c5d1] flex flex-col justify-between p-6 sm:p-12 overflow-x-clip font-sans">
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#4a0e20]/25 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Spacer for Nav */}
      <div className="h-16" />

      {/* Main Content Grid */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center z-10 py-8">
        {/* Left Column: Text & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2a0913] border border-[#f7c5d1]/20 text-xs tracking-widest text-[#f7c5d1]/80 uppercase"
          >
            <Sparkles size={13} className="text-[#f7c5d1]" />
            <span>{heroBadge}</span>
          </motion.div>

          {/* Personalized Greeting */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-sm sm:text-base font-serif italic text-[#f7c5d1]/70"
          >
            {heroGreeting} <span className="text-[#f7c5d1] font-semibold">{partnerName}</span>
          </motion.p>

          {/* Large Romantic Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-serif text-white leading-tight font-medium"
          >
            {heroHeadline}
          </motion.h1>

          {/* Intro Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="text-base sm:text-lg text-[#f7c5d1]/80 font-light leading-relaxed max-w-xl"
          >
            {heroSubtext}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="pt-4 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={() => onNavigate("note")}
              className="px-6 py-3.5 rounded-full bg-[#4a0e20] hover:bg-[#5a1228] text-white text-sm font-medium border border-[#f7c5d1]/30 shadow-lg shadow-[#4a0e20]/40 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Heart size={16} className="fill-[#f7c5d1] text-[#f7c5d1]" />
              <span>Read Today's Note</span>
            </button>
            <button
              onClick={() => onNavigate("letter")}
              className="px-6 py-3.5 rounded-full bg-[#2a0913]/60 hover:bg-[#2a0913] text-[#f7c5d1] text-sm font-medium border border-[#f7c5d1]/20 transition-all cursor-pointer"
            >
              Open My Letter
            </button>
          </motion.div>
        </div>

        {/* Right Column: Featured Portrait Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="lg:col-span-5 flex justify-center"
        >
          <div className="relative p-3 rounded-[2rem] bg-[#2a0913] border border-[#f7c5d1]/20 shadow-2xl shadow-black/80 max-w-sm w-full">
            <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden border border-white/10">
              <img
                src={heroImage}
                alt={partnerName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#16080c] via-transparent to-transparent opacity-60" />
            </div>
            <div className="p-4 text-center">
              <p className="text-xs font-serif italic text-[#f7c5d1]/70">
                “Always right here for you.”
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Scroll Indicator */}
      <div className="pb-4 text-center z-10">
        <button
          onClick={() => onNavigate("note")}
          className="inline-flex flex-col items-center gap-2 text-xs text-[#f7c5d1]/50 hover:text-[#f7c5d1] transition-colors cursor-pointer"
        >
          <span>Scroll to enter</span>
          <ArrowDown size={14} className="animate-bounce" />
        </button>
      </div>
    </section>
  );
}
