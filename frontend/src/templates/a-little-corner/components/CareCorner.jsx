import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Sparkles, Heart } from "lucide-react";

export default function CareCorner({ content = {} }) {
  const careSectionTitle = content.careSectionTitle || "Little Care Corner";
  const careSectionSubtitle = content.careSectionSubtitle || "Your gentle daily reminders. Check them off as you take care of yourself today.";

  const items = [
    content.careItem1 || "Drink a warm glass of water 💧",
    content.careItem2 || "Eat a nourishing meal 🍲",
    content.careItem3 || "Take a 5-minute quiet break 🌸",
    content.careItem4 || "Stretch your body gently 🧘",
    content.careItem5 || "Give yourself a soft smile 😊",
    content.careItem6 || "Promise to rest early tonight 🌙",
  ];

  const todayKey = `alc_care_${new Date().toISOString().slice(0, 10)}`;

  const [checked, setChecked] = useState(() => {
    try {
      const saved = localStorage.getItem(todayKey);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(todayKey, JSON.stringify(checked));
    } catch (e) {}
  }, [checked, todayKey]);

  const toggleItem = (index) => {
    setChecked((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const completedCount = Object.values(checked).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  return (
    <section id="care" className="relative min-h-screen bg-[#16080c] text-[#f7c5d1] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-3xl w-full text-center space-y-8 z-10 py-12">
        {/* Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2a0913] border border-[#f7c5d1]/20 text-xs tracking-widest text-[#f7c5d1]/80 uppercase">
            <Heart size={12} className="fill-[#f7c5d1]" />
            <span>Daily Gentle Reminders</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium">
            {careSectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#f7c5d1]/70 max-w-lg mx-auto font-light">
            {careSectionSubtitle}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto space-y-2 text-left">
          <div className="flex justify-between text-xs text-[#f7c5d1]/80">
            <span>Today's Self-Care Progress</span>
            <span className="font-mono">{progressPercent}%</span>
          </div>
          <div className="h-3 w-full bg-[#2a0913] rounded-full overflow-hidden border border-[#f7c5d1]/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#4a0e20] to-[#f7c5d1]"
            />
          </div>
        </div>

        {/* Interactive Checklist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left pt-2">
          {items.map((itemText, idx) => {
            const isDone = !!checked[idx];
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => toggleItem(idx)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${
                  isDone
                    ? "bg-[#2a0913] border-[#f7c5d1]/40 text-white shadow-lg"
                    : "bg-[#2a0913]/40 border-[#f7c5d1]/15 text-[#f7c5d1]/70 hover:border-[#f7c5d1]/30"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 size={22} className="text-[#f7c5d1] shrink-0" />
                ) : (
                  <Circle size={22} className="text-[#f7c5d1]/40 shrink-0" />
                )}
                <span className={`text-sm sm:text-base font-serif ${isDone ? "line-through opacity-80" : ""}`}>
                  {itemText}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Soft Completion Message */}
        {completedCount === items.length && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-[#4a0e20]/40 border border-[#f7c5d1]/30 text-xs sm:text-sm font-serif italic text-white flex items-center justify-center gap-2"
          >
            <Sparkles size={16} className="text-[#f7c5d1]" />
            <span>Thank you for taking such good care of yourself today. You are so loved.</span>
          </motion.div>
        )}
      </div>
    </section>
  );
}
