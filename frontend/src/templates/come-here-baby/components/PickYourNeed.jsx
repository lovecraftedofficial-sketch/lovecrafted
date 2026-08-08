import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

export default function PickYourNeed({ content = {} }) {
  const needsSectionTitle = content.needsSectionTitle || "So... what does my baby need right now?";
  const needsSectionSubtitle = content.needsSectionSubtitle || "Pick your comfort order.";

  const options = [
    { label: "🫂 Cuddles", msg: content.need1Msg || "Come here. If I were there right now, you'd already be wrapped in my arms." },
    { label: "💋 Kisses", msg: content.need2Msg || "One forehead kiss, two cheek kisses, and one extra because you're cute." },
    { label: "🎧 Quiet company", msg: content.need3Msg || "Okay. No talking needed. Just you, me, and total peace." },
    { label: "🍫 Chocolate & Snacks", msg: content.need4Msg || "Absolutely. Today you are getting completely spoiled." },
    { label: "💌 Reassurance", msg: content.need5Msg || "You are loved, you are safe, and you are my absolute favorite person." },
    { label: "🤍 Just stay here", msg: content.need6Msg || "I'm not going anywhere. Right here with you." },
  ];

  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <section id="needs" className="relative min-h-screen bg-[#1c080e] text-[#f8b3c3] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-4xl w-full text-center space-y-8 z-10 py-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3d0a18] border border-[#f8b3c3]/20 text-xs tracking-widest text-[#f8b3c3]">
            <Heart size={12} className="fill-[#f8b3c3]" />
            <span>Comfort Menu</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium">
            {needsSectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#f8b3c3]/70 max-w-lg mx-auto font-light">
            {needsSectionSubtitle}
          </p>
        </div>

        {/* Choice Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`p-5 rounded-2xl border text-base font-serif transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#3d0a18] border-[#f8b3c3] text-white shadow-xl shadow-[#3d0a18]/60 scale-105"
                    : "bg-[#2a0c15]/50 border-[#f8b3c3]/15 text-[#f8b3c3]/80 hover:border-[#f8b3c3]/30"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Response Card */}
        <div className="min-h-[120px] flex items-center justify-center pt-4">
          <AnimatePresence mode="wait">
            {selectedIdx !== null && (
              <motion.div
                key={selectedIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="max-w-xl w-full p-8 rounded-[2rem] bg-[#2a0c15] border border-[#f8b3c3]/30 shadow-2xl space-y-3 text-center"
              >
                <Sparkles size={20} className="text-[#f8b3c3] mx-auto" />
                <p className="text-lg sm:text-xl font-serif text-white italic leading-relaxed">
                  “{options[selectedIdx].msg}”
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
