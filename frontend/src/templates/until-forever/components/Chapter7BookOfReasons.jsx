import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ChevronRight, ChevronLeft, BookOpen } from "lucide-react";

/**
 * Micro Sound Synthesizer for Leather Journal & Page Turns
 */
function playJournalSound(type) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "pageTurn") {
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.2;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 2200;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    }
  } catch {}
}

/**
 * Chapter 7: The Book of Reasons (Leather-Bound Journal)
 * ----------------------------------------------------
 * A gold-embossed leather journal filled with deeply personal handwritten reasons,
 * habits, coffee stains, margin doodles, and satin bookmark.
 */
export default function Chapter7BookOfReasons({ content = {}, onComplete }) {
  const reasonsList = [
    {
      number: 1,
      reason:
        "I still smile every time you steal food off my plate and pretend it wasn't you.",
      doodle: "🍕",
      note: "Written on a Friday pizza night",
    },
    {
      number: 2,
      reason:
        "The quiet way you squeeze my hand three times whenever we walk through a crowded room.",
      doodle: "🤝",
      note: "Our secret code",
    },
    {
      number: 3,
      reason:
        "How you always remember exactly how I take my morning coffee, even on mornings when I forget.",
      doodle: "☕",
      note: "Extra cream, no sugar",
    },
    {
      number: 4,
      reason:
        "Because even after all this time, your laugh is still my absolute favorite sound in the entire world.",
      doodle: "✨",
      note: "Heard in a crowded room",
    },
    {
      number: 5,
      reason:
        "The gentle look in your eyes when you think I'm not paying attention.",
      doodle: "💖",
      note: "Forever my favorite view",
    },
  ];

  // Stage state: "cover" | "open"
  const [stage, setStage] = useState("cover");
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const handleOpenJournal = () => {
    if (stage !== "cover") return;
    playJournalSound("pageTurn");
    setStage("open");
  };

  const handleNextPage = () => {
    if (currentPageIndex < reasonsList.length - 1) {
      playJournalSound("pageTurn");
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      playJournalSound("pageTurn");
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const currentReason = reasonsList[currentPageIndex];

  return (
    <div className="relative min-h-screen bg-[#040103] text-rose-100 flex flex-col items-center justify-between p-4 sm:p-8 overflow-x-clip select-none font-serif">
      {/* Soft Warm Candlelight Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-700/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Header Prompt */}
      <div className="pt-6 text-center space-y-2 z-10 max-w-lg">
        <span className="text-[10px] tracking-[0.35em] text-neutral-400 font-light uppercase block">
          Chapter VII · The Book of Reasons
        </span>
        <h2 className="text-2xl sm:text-3xl font-normal text-rose-100 italic">
          {stage === "cover"
            ? "A leather-bound journal written over years..."
            : `Reason #${currentReason.number} of ${reasonsList.length}`}
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {/* STAGE 1: CLOSED GOLD-EMBOSSED LEATHER JOURNAL */}
        {stage === "cover" && (
          <motion.div
            key="journal-cover"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            onClick={handleOpenJournal}
            className="relative max-w-sm sm:max-w-md w-full cursor-pointer my-auto z-10 group"
          >
            {/* Mahogany Leather Book Cover */}
            <div className="relative aspect-[3/4] rounded-3xl bg-gradient-to-b from-[#2a141a] via-[#1f0d12] to-[#140609] border-2 border-amber-500/40 p-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.98)] flex flex-col items-center justify-between text-center overflow-hidden">
              {/* Gold Leaf Border Framing */}
              <div className="absolute inset-4 border border-amber-400/30 rounded-2xl pointer-events-none" />

              {/* Gold Embossed Title */}
              <div className="pt-8 space-y-2 z-10">
                <span className="text-[10px] tracking-[0.4em] text-amber-300/80 uppercase font-mono block">
                  Vol. I · Private Journal
                </span>
                <h3 className="text-2xl sm:text-3xl font-normal text-amber-200 italic">
                  Reasons Why I Love You
                </h3>
              </div>

              {/* Center Gold Stamp Emblem */}
              <div className="my-auto z-10 flex flex-col items-center gap-3">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-950 via-amber-800 to-amber-900 border-2 border-amber-400/50 shadow-2xl flex items-center justify-center text-amber-200 group-hover:scale-105 transition-transform">
                  <BookOpen size={28} className="text-amber-300" />
                </div>
              </div>

              <p className="pb-4 text-xs text-amber-300/80 font-light italic tracking-widest animate-pulse">
                Tap journal to open pages...
              </p>
            </div>
          </motion.div>
        )}

        {/* STAGE 2: OPEN JOURNAL PAGES WITH HANDWRITTEN REASONS */}
        {stage === "open" && (
          <motion.div
            key={`page-${currentPageIndex}`}
            initial={{ opacity: 0, rotateY: -15, scale: 0.95 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, rotateY: 15 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative max-w-xl w-full my-auto z-10"
          >
            {/* Satin Ribbon Bookmark */}
            <div className="absolute -top-6 right-12 w-4 h-24 bg-rose-600 rounded-b-md shadow-lg z-20 pointer-events-none" />

            {/* Open Journal Double-Page Sheet */}
            <div className="relative w-full aspect-[4/3] rounded-3xl bg-gradient-to-b from-[#1c0e13] via-[#14080b] to-[#0c0406] border-2 border-amber-900/30 p-8 sm:p-12 shadow-[0_50px_110px_-20px_rgba(0,0,0,0.98)] flex flex-col justify-between overflow-hidden">
              {/* Paper Fibers & Coffee Stain Overlay */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              <div className="absolute bottom-8 left-8 w-20 h-20 rounded-full border-2 border-amber-900/20 opacity-30 pointer-events-none blur-[1px]" />

              {/* Page Header */}
              <div className="flex items-center justify-between border-b border-rose-500/15 pb-4 z-10">
                <span className="text-xs font-mono text-amber-300/80 tracking-widest">
                  REASON #{currentReason.number}
                </span>
                <span className="text-xl">{currentReason.doodle}</span>
              </div>

              {/* Handwritten Memory Reason Text */}
              <div className="my-auto py-4 z-10 space-y-3">
                <p className="font-serif text-xl sm:text-2xl text-rose-100/95 italic leading-relaxed tracking-wide">
                  "{currentReason.reason}"
                </p>
                <p className="text-xs text-neutral-400 font-light italic text-right pt-2">
                  — {currentReason.note}
                </p>
              </div>

              {/* Page Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-rose-500/15 z-10">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  disabled={currentPageIndex === 0}
                  className={`flex items-center gap-1 text-xs text-amber-300/80 font-mono tracking-widest ${
                    currentPageIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:text-amber-200 cursor-pointer"
                  }`}
                >
                  <ChevronLeft size={14} /> Previous
                </button>

                <span className="text-[11px] font-mono text-neutral-500">
                  {currentPageIndex + 1} / {reasonsList.length}
                </span>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={currentPageIndex === reasonsList.length - 1}
                  className={`flex items-center gap-1 text-xs text-amber-300/80 font-mono tracking-widest ${
                    currentPageIndex === reasonsList.length - 1
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:text-amber-200 cursor-pointer"
                  }`}
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER TRANSITION PROMPT */}
      <div className="pb-4 text-center z-10">
        <button
          type="button"
          onClick={() => {
            if (onComplete) onComplete();
          }}
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-amber-300/90 font-serif italic tracking-widest hover:text-amber-200 transition-colors cursor-pointer"
        >
          <span>Continue to Chapter 8...</span>
          <Heart size={13} className="fill-amber-300 text-amber-300 animate-pulse" />
        </button>
      </div>
    </div>
  );
}
