import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

export default function ThingsILove({ content = {} }) {
  const thingsSectionTitle = content.thingsSectionTitle || "Even on your grumpy days...";
  const thingsSectionSubtitle = content.thingsSectionSubtitle || "...you're still my absolute favorite human.";

  const items = [
    {
      title: content.thing1Title || "Your sleepy voice",
      detail: content.thing1Detail || "How soft and raspy you sound when you first wake up."
    },
    {
      title: content.thing2Title || "Your pretend non-smile",
      detail: content.thing2Detail || "The way you try so hard to look serious when you're secretly fighting a grin."
    },
    {
      title: content.thing3Title || "Your little angry face",
      detail: content.thing3Detail || "Even when you're mad at the world, you are the cutest human alive."
    },
    {
      title: content.thing4Title || "How you need reassurance",
      detail: content.thing4Detail || "Even when you pretend you don't, I love being the one who gets to give it to you."
    }
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
            {thingsSectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#f8b3c3]/70 max-w-lg mx-auto font-light">
            {thingsSectionSubtitle}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          {items.map((item, idx) => {
            const isOpen = activeIdx === idx;
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveIdx(isOpen ? null : idx)}
                className={`p-6 sm:p-8 rounded-[2rem] border cursor-pointer text-left transition-all space-y-3 ${
                  isOpen
                    ? "bg-[#3d0a18] border-[#f8b3c3]/50 shadow-2xl"
                    : "bg-[#2a0c15] border-[#f8b3c3]/20 hover:border-[#f8b3c3]/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest font-mono text-[#f8b3c3]/60">
                    Reason #{idx + 1}
                  </span>
                  <Sparkles size={16} className={isOpen ? "text-[#f8b3c3]" : "text-[#f8b3c3]/40"} />
                </div>
                <h3 className="text-xl font-serif text-white font-medium">
                  {item.title}
                </h3>
                <p className="text-sm font-serif italic text-[#f8b3c3]/90 leading-relaxed pt-1">
                  “{item.detail}”
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
