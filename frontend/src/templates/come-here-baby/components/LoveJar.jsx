import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

export default function LoveJar({ content = {} }) {
  const jarTitle = content.jarTitle || "A Little Jar Full of Love";
  const jarSubtitle = content.jarSubtitle || "I put tiny reminders inside for the days when you forget how special you are.";

  const jarMessages = [
    content.jar1 || "You make my life softer.",
    content.jar2 || "I'm proud of you.",
    content.jar3 || "You don't have to earn my love.",
    content.jar4 || "You are my favorite notification.",
    content.jar5 || "You're doing better than you think.",
    content.jar6 || "Somewhere in the world, your boyfriend is thinking about you right now. ❤️",
    content.jar7 || "You're precious to me, even on your messiest days.",
    content.jar8 || "You are loved exactly as you are.",
  ];

  const [revealedIdx, setRevealedIdx] = useState(null);

  const drawFromJar = () => {
    const nextIdx = Math.floor(Math.random() * jarMessages.length);
    setRevealedIdx(nextIdx);
  };

  return (
    <section id="jar" className="relative min-h-[85vh] bg-[#1c080e] text-[#f8b3c3] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-3xl w-full text-center space-y-8 z-10 py-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3d0a18] border border-[#f8b3c3]/20 text-xs tracking-widest text-[#f8b3c3]">
            <Heart size={12} className="fill-[#f8b3c3]" />
            <span>Jar of Reminders</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium">
            {jarTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#f8b3c3]/70 max-w-lg mx-auto font-light">
            {jarSubtitle}
          </p>
        </div>

        {/* Love Jar Graphic & Interaction */}
        <div className="pt-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={drawFromJar}
            className="w-36 h-44 sm:w-44 sm:h-52 mx-auto rounded-b-[3rem] rounded-t-[1.5rem] bg-[#2a0c15] border-2 border-[#f8b3c3]/40 shadow-2xl flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group"
          >
            <div className="absolute top-0 inset-x-0 h-6 bg-[#3d0a18] border-b border-[#f8b3c3]/30" />
            <div className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform">🫙</div>
            <p className="text-[11px] font-serif italic text-[#f8b3c3]/80 pt-2">
              Tap to open jar
            </p>
          </motion.div>
        </div>

        {/* Revealed Message Box */}
        <div className="min-h-[120px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {revealedIdx !== null && (
              <motion.div
                key={revealedIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 sm:p-8 rounded-[2rem] bg-[#2a0c15] border border-[#f8b3c3]/30 shadow-2xl space-y-3 text-center max-w-lg w-full"
              >
                <Sparkles size={20} className="text-[#f8b3c3] mx-auto" />
                <p className="text-lg sm:text-xl font-serif text-white italic leading-relaxed">
                  “{jarMessages[revealedIdx]}”
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
