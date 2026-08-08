import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ChevronDown } from "lucide-react";

export default function OpenWhenSection({ content = {} }) {
  const openTitle = content.openTitle || "For The Days You Need Me";
  const openSubtitle = content.openSubtitle || "Open one whenever you need a little piece of me.";

  const cards = [
    { title: "Open when you're tired...", note: content.openTired || "Hey baby. Take off your shoes, lie down, and let your body rest. You've done enough for today. I'm so proud of how hard you try every day." },
    { title: "Open when you're sad...", note: content.openSad || "If you're feeling sad right now, come sit beside me. You don't have to explain why. I'll just hold your hand until it feels lighter." },
    { title: "Open when you miss me...", note: content.openMiss || "Close your eyes for three seconds. I am thinking of you right at this exact moment. My arms are wrapped right around you." },
    { title: "Open when you're angry...", note: content.openAngry || "You're allowed to be mad at the world today! Vent to me all you want. I won't get defensive, I'm on your team forever." },
    { title: "Open when you need reassurance...", note: content.openReassurance || "You are safe, you are cherished, and nothing you do or feel today will ever change how deeply I love you." },
    { title: "Open when you need a little love...", note: content.openLoved || "You are my favorite human in the entire universe. Thank you for being my girl." },
  ];

  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section id="openwhen" className="relative min-h-screen bg-[#1c080e] text-[#f8b3c3] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-3xl w-full text-center space-y-8 z-10 py-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3d0a18] border border-[#f8b3c3]/20 text-xs tracking-widest text-[#f8b3c3]">
            <Mail size={13} className="text-[#f8b3c3]" />
            <span>Comfort Envelopes</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium">
            {openTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#f8b3c3]/70 max-w-lg mx-auto font-light">
            {openSubtitle}
          </p>
        </div>

        {/* Envelopes List */}
        <div className="space-y-3 text-left">
          {cards.map((c, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#2a0c15] border border-[#f8b3c3]/20 overflow-hidden shadow-lg transition-colors hover:border-[#f8b3c3]/40"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="text-base sm:text-lg font-serif text-white font-medium">
                    {c.title}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-[#f8b3c3]/60 transition-transform duration-300 ${isOpen ? "rotate-180 text-white" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-5 pt-1 border-t border-[#f8b3c3]/10 bg-[#1c080e]/40"
                    >
                      <p className="text-sm sm:text-base font-serif italic text-[#f8b3c3] leading-relaxed whitespace-pre-line">
                        “{c.note}”
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
