import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ChevronDown, Heart } from "lucide-react";

export default function OpenWhenSection({ content = {} }) {
  const openSectionTitle = content.openSectionTitle || "Open When...";
  const openSectionSubtitle = content.openSectionSubtitle || "Written long before you needed them. Tap an envelope whenever your heart asks for it.";

  const cards = [
    {
      title: content.open1Title || "Open when you miss me...",
      text: content.open1Text || "Close your eyes for three seconds. Take a deep, slow breath. Wherever I am right now, I am thinking of you too. My hand is right inside yours."
    },
    {
      title: content.open2Title || "Open when you're sad...",
      text: content.open2Text || "It is okay to rest. You don't have to carry everything alone. Let me hold the weight for a little while."
    },
    {
      title: content.open3Title || "Open when you can't sleep...",
      text: content.open3Text || "Breathe in softly. Picture us sitting together on a quiet porch under a million quiet stars. Goodnight my love."
    },
    {
      title: content.open4Title || "Open when you're angry or overwhelmed...",
      text: content.open4Text || "Take a pause. Nothing between us is broken. I am right here, listening softly whenever you're ready."
    },
    {
      title: content.open5Title || "Open when you need motivation...",
      text: content.open5Text || "Look how far you have already come. I believe in your strength even when you feel tired."
    },
    {
      title: content.open6Title || "Open when you're lonely...",
      text: content.open6Text || "You are never alone. This little corner was built to remind you that my love is always right by your side."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleCard = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="openwhen" className="relative min-h-screen bg-[#16080c] text-[#f7c5d1] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-3xl w-full text-center space-y-8 z-10 py-12">
        {/* Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2a0913] border border-[#f7c5d1]/20 text-xs tracking-widest text-[#f7c5d1]/80 uppercase">
            <Mail size={13} className="text-[#f7c5d1]" />
            <span>Comfort Envelopes</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium">
            {openSectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#f7c5d1]/70 max-w-lg mx-auto font-light">
            {openSectionSubtitle}
          </p>
        </div>

        {/* Expandable Comfort Envelopes */}
        <div className="space-y-4 text-left">
          {cards.map((card, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#2a0913] border border-[#f7c5d1]/20 overflow-hidden shadow-lg transition-colors hover:border-[#f7c5d1]/40"
              >
                <button
                  onClick={() => toggleCard(idx)}
                  className="w-full p-5 sm:p-6 flex items-center justify-between text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Heart size={16} className={`transition-colors ${isOpen ? "fill-[#f7c5d1] text-[#f7c5d1]" : "text-[#f7c5d1]/40"}`} />
                    <span className="text-base sm:text-lg font-serif text-white font-medium">
                      {card.title}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-[#f7c5d1]/60 transition-transform duration-300 ${isOpen ? "rotate-180 text-white" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="px-6 pb-6 pt-2 border-t border-[#f7c5d1]/10 bg-[#16080c]/40"
                    >
                      <p className="text-sm sm:text-base font-serif italic text-[#f7c5d1] leading-relaxed">
                        “{card.text}”
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
