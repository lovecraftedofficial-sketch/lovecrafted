import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

export default function MoodSelector({ content = {} }) {
  const moodSectionTitle = content.moodSectionTitle || "Tell me what's going on, baby.";
  const moodSectionSubtitle = content.moodSectionSubtitle || "Tap how you're feeling right now. Zero explanations needed.";

  const moods = [
    { label: "🥺 I want cuddles", response: content.mood1Resp || "I know, baby. Come here. Arms are open and waiting right now." },
    { label: "😭 I might cry", response: content.mood2Resp || "You don't have to explain why you're crying. Just cry. I'm right here holding you." },
    { label: "😤 I'm grumpy", response: content.mood3Resp || "You're allowed to be grumpy. I'll still love you exactly the same." },
    { label: "🫠 Everything hurts", response: content.mood4Resp || "Then today your only job is surviving the day. I'll handle all the loving part." },
    { label: "😴 I just want to sleep", response: content.mood5Resp || "Go to sleep, bub. Blanket tucked in, forehead kissed. I'll be here when you wake up." },
    { label: "🫂 I need you", response: content.mood6Resp || "I'm right here, my girl. I am not going anywhere." },
    { label: "🍫 I need chocolate", response: content.mood7Resp || "Chocolate has officially been approved. Obviously. Emergency stash activated." },
    { label: "💗 I don't even know", response: content.mood8Resp || "You don't have to figure it out. Just rest your head right here." },
  ];

  const [selectedIdx, setSelectedIdx] = useState(0);

  return (
    <section id="mood" className="relative min-h-screen bg-[#1c080e] text-[#f8b3c3] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-4xl w-full text-center space-y-8 z-10 py-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3d0a18] border border-[#f8b3c3]/20 text-xs tracking-widest text-[#f8b3c3]">
            <Heart size={12} className="fill-[#f8b3c3]" />
            <span>Check In With Me</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium">
            {moodSectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#f8b3c3]/70 max-w-lg mx-auto font-light">
            {moodSectionSubtitle}
          </p>
        </div>

        {/* Mood Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {moods.map((m, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedIdx(idx)}
                className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#3d0a18] border-[#f8b3c3] text-white shadow-lg shadow-[#3d0a18]/60 scale-105"
                    : "bg-[#2a0c15]/50 border-[#f8b3c3]/15 text-[#f8b3c3]/80 hover:border-[#f8b3c3]/30"
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Comforting Response Card */}
        <div className="min-h-[140px] flex items-center justify-center pt-2">
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
                  “{moods[selectedIdx].response}”
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
