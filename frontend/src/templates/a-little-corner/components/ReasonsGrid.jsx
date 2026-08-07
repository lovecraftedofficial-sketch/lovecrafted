import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, TouchApp } from "lucide-react";

export default function ReasonsGrid({ content = {} }) {
  const reasonsSectionTitle = content.reasonsSectionTitle || "Reasons I Love You";
  const reasonsSectionSubtitle = content.reasonsSectionSubtitle || "Tap any card to uncover a quiet truth.";

  const reasons = [
    {
      title: content.reason1Title || "Your Kindness",
      text: content.reason1Text || "The soft, effortless way you care for everyone around you without expecting anything in return."
    },
    {
      title: content.reason2Title || "Your Morning Smile",
      text: content.reason2Text || "How your eyes crinkle before you even say a word when you wake up."
    },
    {
      title: content.reason3Title || "Your Laugh",
      text: content.reason3Text || "It instantly fills any room with warmth and makes all my worries dissolve."
    },
    {
      title: content.reason4Title || "Our Silence",
      text: content.reason4Text || "Even when we don't speak a single word, being in the same room with you feels completely whole."
    }
  ];

  const [flipped, setFlipped] = useState({});

  const toggleFlip = (index) => {
    setFlipped((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <section id="reasons" className="relative min-h-screen bg-[#16080c] text-[#f7c5d1] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-4xl w-full text-center space-y-8 z-10 py-12">
        {/* Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2a0913] border border-[#f7c5d1]/20 text-xs tracking-widest text-[#f7c5d1]/80 uppercase">
            <Heart size={13} className="fill-[#f7c5d1]" />
            <span>Whispered Truths</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium">
            {reasonsSectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#f7c5d1]/70 max-w-lg mx-auto font-light">
            {reasonsSectionSubtitle}
          </p>
        </div>

        {/* Reasons Interactive Flip Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          {reasons.map((item, idx) => {
            const isFlipped = !!flipped[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleFlip(idx)}
                className="h-64 cursor-pointer perspective-1000"
              >
                <motion.div
                  initial={false}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="relative w-full h-full preserve-3d"
                >
                  {/* Front Card Side */}
                  <div className="absolute inset-0 p-6 rounded-3xl bg-[#2a0913] border border-[#f7c5d1]/20 shadow-xl flex flex-col items-center justify-center space-y-4 backface-hidden text-center hover:border-[#f7c5d1]/40 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-[#4a0e20] flex items-center justify-center">
                      <Heart size={20} className="fill-[#f7c5d1] text-[#f7c5d1]" />
                    </div>
                    <h3 className="text-xl font-serif text-white font-medium">
                      {item.title}
                    </h3>
                    <span className="text-xs text-[#f7c5d1]/60 font-light flex items-center gap-1">
                      <span>Tap to reveal</span>
                    </span>
                  </div>

                  {/* Back Card Side */}
                  <div className="absolute inset-0 p-6 rounded-3xl bg-[#4a0e20] border border-[#f7c5d1]/40 shadow-2xl flex flex-col items-center justify-center space-y-3 backface-hidden text-center rotate-y-180">
                    <Sparkles size={20} className="text-[#f7c5d1]" />
                    <p className="text-sm sm:text-base font-serif text-white leading-relaxed italic">
                      “{item.text}”
                    </p>
                    <span className="text-[10px] text-[#f7c5d1]/70 uppercase tracking-widest pt-2">
                      Reason #{idx + 1}
                    </span>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
