import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Heart, Sparkles } from "lucide-react";

export default function CareChecklist({ content = {} }) {
  const careTitle = content.careTitle || "Okay Baby, Let Me Take Care of You";
  const careSubtitle = content.careSubtitle || "Just a few tiny things before you go back to being my adorable little grump. 🥺❤️";

  const items = [
    content.careItem1 || "💧 Drink some water for me",
    content.careItem2 || "🍫 Have something you like",
    content.careItem3 || "🛌 Get some proper rest",
    content.careItem4 || "🫂 Take your virtual hug",
    content.careItem5 || "🌸 Take a little break",
    content.careItem6 || "🥺 Don't be too hard on yourself",
  ];

  const todayKey = `fmb_care_${new Date().toISOString().slice(0, 10)}`;

  const [checked, setChecked] = useState(() => {
    try {
      const saved = localStorage.getItem(todayKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(todayKey, JSON.stringify(checked));
    } catch {}
  }, [checked, todayKey]);

  const toggleItem = (idx) => {
    setChecked((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  return (
    <section id="care" className="relative min-h-screen bg-[#1c080e] text-[#f8b3c3] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-3xl w-full text-center space-y-8 z-10 py-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3d0a18] border border-[#f8b3c3]/20 text-xs tracking-widest text-[#f8b3c3]">
            <Heart size={12} className="fill-[#f8b3c3]" />
            <span>Pamper Corner</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium">
            {careTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#f8b3c3]/70 max-w-lg mx-auto font-light">
            {careSubtitle}
          </p>
        </div>

        {/* Care Progress Indicator */}
        <div className="max-w-md mx-auto space-y-2 text-left">
          <div className="flex justify-between text-xs text-[#f8b3c3]/80 font-mono">
            <span>Pampering: {progressPercent}% {progressPercent === 100 ? "❤️" : ""}</span>
            <span>{completedCount} of {items.length} done</span>
          </div>
          <div className="h-3.5 w-full bg-[#2a0c15] rounded-full overflow-hidden border border-[#f8b3c3]/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-[#3d0a18] to-[#f8b3c3]"
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-2">
          {items.map((itemText, idx) => {
            const isDone = !!checked[idx];
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => toggleItem(idx)}
                className={`p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                  isDone
                    ? "bg-[#3d0a18] border-[#f8b3c3]/50 text-white shadow-lg shadow-[#3d0a18]/40"
                    : "bg-[#2a0c15]/50 border-[#f8b3c3]/15 text-[#f8b3c3]/80 hover:border-[#f8b3c3]/30"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 size={22} className="text-[#f8b3c3] shrink-0" />
                ) : (
                  <Circle size={22} className="text-[#f8b3c3]/40 shrink-0" />
                )}
                <span className={`text-sm sm:text-base font-serif ${isDone ? "line-through opacity-80" : ""}`}>
                  {itemText}
                </span>
              </motion.div>
            );
          })}
        </div>

        {completedCount === items.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 rounded-2xl bg-[#3d0a18]/60 border border-[#f8b3c3]/40 text-sm font-serif italic text-white flex items-center justify-center gap-2"
          >
            <Sparkles size={18} className="text-[#f8b3c3]" />
            <span>Good baby. ❤️ That's my girl! See? I'm taking care of you even from here.</span>
          </motion.div>
        )}
      </div>
    </section>
  );
}
