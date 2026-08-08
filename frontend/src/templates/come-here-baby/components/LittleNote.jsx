import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, RefreshCw } from "lucide-react";

export default function LittleNote({ content = {} }) {
  const notesTitle = content.notesTitle || "A Little Note From Me";
  const notesSubtitle = content.notesSubtitle || "Whenever you need a tiny reminder that you're loved.";

  const notesList = [
    content.note1 || "Drink some water for me, okay? ❤️",
    content.note2 || "Today you get to be a little lazy. I won't complain.",
    content.note3 || "Even your grumpy face is cute.",
    content.note4 || "You don't have to pretend you're okay with me.",
    content.note5 || "I'm proud of you, baby.",
    content.note6 || "If today hurts a little more than usual, come sit here with me for a while.",
    content.note7 || "Even on your most tired days, you're still my favorite person.",
    content.note8 || "Nothing about one difficult day can make me love you less.",
  ];

  const [currentIdx, setCurrentIdx] = useState(0);

  const getNextNote = () => {
    setCurrentIdx((prev) => (prev + 1) % notesList.length);
  };

  return (
    <section id="notes" className="relative min-h-[85vh] bg-[#1c080e] text-[#f8b3c3] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-3xl w-full text-center space-y-8 z-10 py-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3d0a18] border border-[#f8b3c3]/20 text-xs tracking-widest text-[#f8b3c3]">
            <Heart size={12} className="fill-[#f8b3c3]" />
            <span>Whisper of Love</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium">
            {notesTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#f8b3c3]/70 max-w-lg mx-auto font-light">
            {notesSubtitle}
          </p>
        </div>

        {/* Note Card */}
        <div className="min-h-[180px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="p-8 sm:p-12 rounded-[2.5rem] bg-[#2a0c15] border border-[#f8b3c3]/30 shadow-2xl space-y-4 text-center max-w-xl w-full"
            >
              <Sparkles size={22} className="text-[#f8b3c3] mx-auto" />
              <p className="text-lg sm:text-2xl font-serif text-white italic leading-relaxed">
                “{notesList[currentIdx]}”
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div>
          <button
            onClick={getNextNote}
            className="px-8 py-3.5 rounded-full bg-[#3d0a18] hover:bg-[#4d0d20] text-white text-sm font-medium border border-[#f8b3c3]/30 shadow-lg shadow-[#3d0a18]/50 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw size={16} className="text-[#f8b3c3]" />
            <span>Give Me Another Note</span>
          </button>
        </div>
      </div>
    </section>
  );
}
