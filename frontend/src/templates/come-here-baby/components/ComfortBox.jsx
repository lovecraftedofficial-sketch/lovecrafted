import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Sparkles, X } from "lucide-react";

export default function ComfortBox({ content = {} }) {
  const boxSectionTitle = content.boxSectionTitle || "Your Little Virtual Comfort Box";
  const boxSectionSubtitle = content.boxSectionSubtitle || "Open any gift inside whenever you need a boost.";

  const gifts = [
    { icon: "🍫", label: "Chocolate", msg: content.boxChocolateMsg || "🍫 Emergency chocolate delivered right to your heart. No questions asked." },
    { icon: "🧸", label: "Cuddle", msg: content.boxCuddleMsg || "🧸 Come here. You're not escaping this long, tight hug." },
    { icon: "💋", label: "Kiss", msg: content.boxKissMsg || "💋 One forehead kiss, two cheek kisses, and a long one on your head." },
    { icon: "😂", label: "Bad Joke", msg: content.boxJokeMsg || "😂 Why did the blanket go to school? Because it wanted to be a little smarter! (Okay bad joke, but smile for me?)" },
    { icon: "💌", label: "Love Note", msg: content.boxNoteMsg || "💌 Reminder: You are the best thing that ever happened to me." },
    { icon: "🫂", label: "Big Hug", msg: content.boxHugMsg || "🫂 Squeezing you tight until all the tension melts out of your shoulders." },
  ];

  const [activeGift, setActiveGift] = useState(null);

  return (
    <section id="comfortbox" className="relative min-h-screen bg-[#1c080e] text-[#f8b3c3] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-4xl w-full text-center space-y-8 z-10 py-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3d0a18] border border-[#f8b3c3]/20 text-xs tracking-widest text-[#f8b3c3]">
            <Gift size={13} className="text-[#f8b3c3]" />
            <span>Virtual Care Package</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium">
            {boxSectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#f8b3c3]/70 max-w-lg mx-auto font-light">
            {boxSectionSubtitle}
          </p>
        </div>

        {/* Gift Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
          {gifts.map((g, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveGift(g)}
              className="p-6 rounded-3xl bg-[#2a0c15] border border-[#f8b3c3]/20 hover:border-[#f8b3c3]/40 shadow-xl space-y-2 text-center cursor-pointer transition-all"
            >
              <div className="text-4xl">{g.icon}</div>
              <p className="text-sm font-serif text-white font-medium">{g.label}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Gift Unseal Modal */}
      <AnimatePresence>
        {activeGift && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveGift(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full bg-[#2a0c15] p-8 rounded-[2.5rem] border border-[#f8b3c3]/40 shadow-2xl space-y-4 text-center relative"
            >
              <button
                onClick={() => setActiveGift(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-[#f8b3c3] hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
              <div className="text-5xl">{activeGift.icon}</div>
              <h3 className="text-xl font-serif text-white">{activeGift.label} Delivered</h3>
              <p className="text-base font-serif italic text-[#f8b3c3] leading-relaxed pt-1">
                “{activeGift.msg}”
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
