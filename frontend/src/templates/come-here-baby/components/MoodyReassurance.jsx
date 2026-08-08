import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronDown } from "lucide-react";

export default function MoodyReassurance({ content = {} }) {
  const moodySectionTitle = content.moodySectionTitle || "You can be a little difficult today. I can handle you.";
  const moodySectionSubtitle = content.moodySectionSubtitle || "Tap any card below to see my answer.";

  const cards = [
    { q: content.moody1Q || "Want to yell at me?", a: content.moody1A || "I'll survive. Go ahead." },
    { q: content.moody2Q || "Want to cry for no reason?", a: content.moody2A || "Come here. Tissues and hugs ready." },
    { q: content.moody3Q || "Don't want to talk?", a: content.moody3A || "Okay. I'll just sit beside you in quiet." },
    { q: content.moody4Q || "Want endless attention?", a: content.moody4A || "Congratulations. You have 100% of mine." },
    { q: content.moody5Q || "Want to be left alone?", a: content.moody5A || "I'll give you space. But I'm right in the next room if you need me." },
    { q: content.moody6Q || "Want to complain for 45 minutes?", a: content.moody6A || "Go ahead. I'm listening to every word." },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleCard = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="moody" className="relative min-h-screen bg-[#1c080e] text-[#f8b3c3] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-3xl w-full text-center space-y-8 z-10 py-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3d0a18] border border-[#f8b3c3]/20 text-xs tracking-widest text-[#f8b3c3]">
            <Heart size={12} className="fill-[#f8b3c3]" />
            <span>Zero Judgment Allowed</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium">
            {moodySectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#f8b3c3]/70 max-w-lg mx-auto font-light">
            {moodySectionSubtitle}
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-3 text-left">
          {cards.map((card, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#2a0c15] border border-[#f8b3c3]/20 overflow-hidden shadow-lg transition-colors hover:border-[#f8b3c3]/40"
              >
                <button
                  onClick={() => toggleCard(idx)}
                  className="w-full p-5 flex items-center justify-between text-left cursor-pointer"
                >
                  <span className="text-base sm:text-lg font-serif text-white font-medium">
                    "{card.q}"
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
                      <p className="text-sm sm:text-base font-serif italic text-[#f8b3c3]">
                        👉 {card.a}
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
