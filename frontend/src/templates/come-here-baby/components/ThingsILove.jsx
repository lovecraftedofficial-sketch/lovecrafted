import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

export default function ThingsILove({ content = {} }) {
  const thingsTitle = content.thingsTitle || "Things I Love About You";
  const thingsSubtitle = content.thingsSubtitle || "Just in case you ever forget.";

  const items = [
    { title: content.love1Title || "♡ Your Little Smile", msg: content.love1Msg || "How your whole face lights up and makes all my worries vanish in a second." },
    { title: content.love2Title || "♡ Your Random Mood Swings", msg: content.love2Msg || "Even when you're grumpy, you're still my baby. Your little moods don't scare me away." },
    { title: content.love3Title || "♡ The Way You Talk", msg: content.love3Msg || "The soft, adorable way you explain things when you're super excited or sleepy." },
    { title: content.love4Title || "♡ Your Cute Anger", msg: content.love4Msg || "You try so hard to look dangerous when you're mad, but you're just pure cuteness." },
    { title: content.love5Title || "♡ How You Care About Everyone", msg: content.love5Msg || "Your golden heart that's always thinking about making everyone around you happy." },
    { title: content.love6Title || "♡ Your Silly Side", msg: content.love6Msg || "The goofy version of you that nobody else in the world gets to see except me." },
    { title: content.love7Title || "♡ How You Make Ordinary Days Better", msg: content.love7Msg || "Just knowing you exist and you're mine makes every mundane day feel special." },
    { title: content.love8Title || "♡ Simply... You.", msg: content.love8Msg || "I love every single version of you — happy, sleepy, grumpy, or emotional. Always." },
  ];

  const [activeIdx, setActiveIdx] = useState(null);

  return (
    <section id="things" className="relative min-h-screen bg-[#1c080e] text-[#f8b3c3] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-4xl w-full text-center space-y-8 z-10 py-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3d0a18] border border-[#f8b3c3]/20 text-xs tracking-widest text-[#f8b3c3]">
            <Heart size={12} className="fill-[#f8b3c3]" />
            <span>Forever Adored</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium">
            {thingsTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#f8b3c3]/70 max-w-lg mx-auto font-light">
            {thingsSubtitle}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-left">
          {items.map((item, idx) => {
            const isOpen = activeIdx === idx;
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.01 }}
                onClick={() => setActiveIdx(isOpen ? null : idx)}
                className={`p-6 rounded-[2rem] border cursor-pointer transition-all space-y-3 ${
                  isOpen
                    ? "bg-[#3d0a18] border-[#f8b3c3]/50 shadow-2xl"
                    : "bg-[#2a0c15] border-[#f8b3c3]/20 hover:border-[#f8b3c3]/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-serif text-white font-medium">
                    {item.title}
                  </h3>
                  <Sparkles size={16} className={isOpen ? "text-[#f8b3c3]" : "text-[#f8b3c3]/40"} />
                </div>
                <p className="text-sm font-serif italic text-[#f8b3c3]/90 leading-relaxed">
                  “{item.msg}”
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
