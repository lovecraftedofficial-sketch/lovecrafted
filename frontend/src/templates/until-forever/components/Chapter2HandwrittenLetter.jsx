import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

/**
 * Micro Sound Synthesizer for Paper Rustles & Fountain Pen Strokes
 */
function playLetterSound(type) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "penScratch") {
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.15;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 3200;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } else if (type === "paperFold") {
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.2;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1800;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    }
  } catch {}
}

/**
 * Chapter 2: The Handwritten Letter (Flagship Emotional Heart)
 * -----------------------------------------------------------
 * Real folded parchment paper with visible fibers, fold marks, coffee stain,
 * line-by-line ink rendering, personal keepsakes, and reading mode.
 */
export default function Chapter2HandwrittenLetter({ content = {}, onComplete }) {
  const recipientName = content.recipientName || "My Dearest Ananya";
  const senderName = content.senderName || "Rahul";
  const letterText =
    content.letterMessage ||
    `My Dearest,

I still remember the first time I saw you—how the entire world seemed to slow down, and for a moment, everything else faded away.

I remember that rainy Tuesday afternoon at our favorite little coffee place when you laughed so hard that everyone in the café turned around to look at us. You tried to act embarrassed, but your smile lit up the whole room. That was the exact second I knew I never wanted to spend a single day without you.

Thank you for your quiet comfort, for holding my hand when things felt heavy, and for filling my life with a warmth I didn't even know I was missing.

You are my favorite thought every morning and my safest haven every night.

Yours Always,`;

  // Process lines of the letter
  const lines = letterText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // States: "folded" | "unfolding" | "reading" | "finished"
  const [stage, setStage] = useState("folded");
  const [visibleLineCount, setVisibleLineCount] = useState(0);

  // Unfold paper interaction
  const handleUnfoldPaper = () => {
    if (stage !== "folded") return;
    playLetterSound("paperFold");
    setStage("unfolding");

    setTimeout(() => {
      setStage("reading");
      setVisibleLineCount(1);
    }, 1200);
  };

  // Line-by-line ink rendering loop
  useEffect(() => {
    if (stage !== "reading") return;

    if (visibleLineCount < lines.length) {
      const lineLength = lines[visibleLineCount - 1]?.length || 20;
      const delay = Math.max(1800, lineLength * 45); // Natural writing pace based on line length

      const timer = setTimeout(() => {
        playLetterSound("penScratch");
        setVisibleLineCount((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    } else if (visibleLineCount >= lines.length) {
      // Pause at ending
      const tEnd = setTimeout(() => {
        setStage("finished");
      }, 3000);
      return () => clearTimeout(tEnd);
    }
  }, [stage, visibleLineCount, lines]);

  return (
    <div className="relative min-h-screen bg-[#040103] text-rose-100 flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden select-none font-serif">
      {/* Candlelight Ambience Glow */}
      <motion.div
        animate={{
          scale: [1, 1.04, 1],
          opacity: [0.12, 0.18, 0.12],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-700/10 rounded-full blur-[160px] pointer-events-none"
      />

      <AnimatePresence mode="wait">
        {/* STAGE 1: FOLDED PARCHMENT PAPER (SLIDE UP & UNFOLD) */}
        {stage === "folded" && (
          <motion.div
            key="folded-paper"
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98, y: -20 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            onClick={handleUnfoldPaper}
            className="relative max-w-sm sm:max-w-md w-full cursor-pointer z-10 group"
          >
            {/* Folded Letter Parchment Card */}
            <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-b from-[#1c1115] via-[#140a0e] to-[#0c0507] border border-rose-500/25 p-7 shadow-[0_35px_80px_-15px_rgba(0,0,0,0.98)] flex flex-col items-center justify-center text-center space-y-4 overflow-hidden">
              {/* Paper Crease Line */}
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-rose-500/20 shadow-[0_1px_4px_rgba(0,0,0,0.8)] pointer-events-none" />

              <span className="text-[11px] tracking-[0.35em] text-neutral-400 font-light uppercase block">
                Folded Keepsake
              </span>
              <h2 className="text-2xl sm:text-3xl font-normal text-rose-100 italic tracking-wide">
                {recipientName}
              </h2>
              <p className="text-xs text-amber-300/80 font-light italic pt-2 tracking-widest animate-pulse">
                Tap to unfold letter...
              </p>
            </div>
          </motion.div>
        )}

        {/* STAGE 2 & 3: OPENED PARCHMENT LETTER WITH LIVE INK RENDERING */}
        {(stage === "reading" || stage === "unfolding" || stage === "finished") && (
          <motion.div
            key="reading-paper"
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative max-w-xl w-full my-6 z-10"
          >
            {/* Personal Keepsake Decor Surrounding the Letter */}
            <div className="absolute -top-6 -left-6 w-14 h-14 rounded-full bg-rose-500/10 border border-rose-400/20 flex items-center justify-center text-2xl shadow-xl backdrop-blur-md hidden sm:flex pointer-events-none">
              🌸
            </div>
            <div className="absolute -bottom-6 -right-6 px-3 py-1.5 rounded-lg bg-amber-950/40 border border-amber-500/20 text-[10px] text-amber-300/80 font-mono shadow-xl backdrop-blur-md hidden sm:block pointer-events-none">
              ☕ Cafe Receipt · 02.14
            </div>

            {/* Authentic Parchment Letter Sheet */}
            <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#180d12] via-[#12070a] to-[#0a0305] border border-rose-500/25 p-8 sm:p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.98)] space-y-6 overflow-hidden">
              {/* Paper Fibers & Coffee Stain Texture Overlay */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              <div className="absolute top-10 right-10 w-24 h-24 rounded-full border-4 border-amber-900/20 opacity-30 pointer-events-none blur-[1px]" />

              {/* Line-by-Line Ink Written Paragraphs */}
              <div className="space-y-5 text-rose-100/90 font-serif leading-relaxed text-base sm:text-lg italic tracking-wide">
                {lines.slice(0, visibleLineCount).map((line, idx) => (
                  <motion.p
                    key={idx}
                    initial={{ opacity: 0, y: 4, filter: "blur(2px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className={
                      idx === 0
                        ? "text-xl sm:text-2xl font-normal text-amber-200/90 not-italic pb-2"
                        : idx === lines.length - 1
                        ? "pt-4 font-normal text-rose-300/90 not-italic text-right"
                        : ""
                    }
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              {/* STAGE 4: ENDING PROMPT "Turn the page..." */}
              {stage === "finished" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                  className="pt-8 text-center"
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (onComplete) onComplete();
                    }}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm text-amber-300/90 font-serif italic tracking-widest hover:text-amber-200 transition-colors cursor-pointer"
                  >
                    <span>Turn the page...</span>
                    <Heart size={13} className="fill-amber-300 text-amber-300 animate-pulse" />
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
