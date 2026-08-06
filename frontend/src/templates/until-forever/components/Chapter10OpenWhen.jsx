import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X } from "lucide-react";

/**
 * Micro Sound Synthesizer for Envelope Rustles
 */
function playEnvelopeSound(type) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "paperRustle") {
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
      filter.frequency.value = 2100;
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
 * Chapter 10: Open When... (Sacred Comfort Envelopes)
 * --------------------------------------------------
 * Emotion: Comfort & Safety.
 * 6 sacred envelopes that open into focused quiet reading mode.
 */
export default function Chapter10OpenWhen({ content = {}, onComplete }) {
  const openWhenLetters = [
    {
      id: "miss-me",
      icon: "💌",
      title: "Open when you miss me...",
      color: "from-[#281219] via-[#1c0b11] to-[#100508]",
      borderColor: "border-rose-500/30",
      letter:
        "Close your eyes for three seconds. Take a deep breath. Right at this very moment, wherever I am, I am thinking of you too. Distance is just a test to see how far love can travel.",
    },
    {
      id: "cannot-sleep",
      icon: "🌙",
      title: "Open when you cannot sleep...",
      color: "from-[#101524] via-[#090d18] to-[#04060c]",
      borderColor: "border-sky-500/30",
      letter:
        "Breathe in slowly. Picture us walking together under the quiet midnight stars. The world is quiet now, and you are safe. Let go of today's thoughts and sleep peacefully, my love.",
    },
    {
      id: "difficult-day",
      icon: "☀️",
      title: "Open after a difficult day...",
      color: "from-[#26180e] via-[#1a0f08] to-[#0d0703]",
      borderColor: "border-amber-500/30",
      letter:
        "You fought hard today. I am so proud of you. Take off the heavy coat of the day, rest your shoulders, and know that you don't have to carry everything alone.",
    },
    {
      id: "need-hug",
      icon: "🫂",
      title: "Open when you need a hug...",
      color: "from-[#28141e] via-[#1c0c14] to-[#0f050a]",
      borderColor: "border-pink-500/30",
      letter:
        "Wrap your arms around yourself tight. Feel that warmth? That is me holding you, refusing to let go until you feel safe again.",
    },
    {
      id: "overwhelmed",
      icon: "🌊",
      title: "Open when life feels overwhelming...",
      color: "from-[#101c18] via-[#09120e] to-[#040806]",
      borderColor: "border-emerald-500/30",
      letter:
        "Step back for just one minute. You do not have to solve everything tonight. We will take it one gentle step at a time, together.",
    },
    {
      id: "forget-loved",
      icon: "💖",
      title: "Open when you forget how loved you are...",
      color: "from-[#2a1215] via-[#1d0a0d] to-[#110406]",
      borderColor: "border-rose-400/40",
      letter:
        "If you ever doubt your place in my world, remember this: You are the best thing that ever happened to me. Every single day with you is a gift.",
    },
  ];

  const [selectedEnvelope, setSelectedEnvelope] = useState(null);

  const handleOpenEnvelope = (item) => {
    playEnvelopeSound("paperRustle");
    setSelectedEnvelope(item);
  };

  return (
    <div className="relative min-h-screen bg-[#040103] text-rose-100 flex flex-col items-center justify-between p-4 sm:p-8 overflow-hidden select-none font-serif">
      {/* Candlelight Ambience Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-700/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Header Prompt */}
      <div className="pt-6 text-center space-y-2 z-10 max-w-lg">
        <span className="text-[10px] tracking-[0.35em] text-neutral-400 font-light uppercase block">
          Chapter X · Open When...
        </span>
        <h2 className="text-2xl sm:text-3xl font-normal text-rose-100 italic">
          Written long before they were ever needed
        </h2>
        <p className="text-xs text-neutral-400 font-light italic">
          Touch an envelope to open your letter
        </p>
      </div>

      {/* SACRED ENVELOPES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full max-w-4xl my-auto z-10">
        {openWhenLetters.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleOpenEnvelope(item)}
            className={`cursor-pointer p-6 rounded-3xl bg-gradient-to-b ${item.color} border ${item.borderColor} shadow-2xl flex flex-col items-center justify-between text-center aspect-[4/3] group overflow-hidden`}
          >
            {/* Sealed Flap Line */}
            <div className="w-full border-b border-rose-500/20 pb-2 flex items-center justify-center">
              <span className="text-xs font-mono tracking-widest text-amber-300/80">
                SEALED LETTER
              </span>
            </div>

            {/* Envelope Center Icon & Title */}
            <div className="my-auto space-y-2">
              <div className="text-3xl">{item.icon}</div>
              <h3 className="font-serif text-base text-rose-100 italic">
                {item.title}
              </h3>
            </div>

            <span className="text-[10px] text-neutral-400 font-light italic tracking-wider animate-pulse">
              Tap wax seal to open...
            </span>
          </motion.div>
        ))}
      </div>

      {/* FULL-SCREEN QUIET READING MODE MODAL */}
      <AnimatePresence>
        {selectedEnvelope && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedEnvelope(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full rounded-3xl bg-gradient-to-b from-[#180d12] via-[#12070a] to-[#0a0305] border border-rose-500/30 p-8 sm:p-12 shadow-[0_50px_120px_-20px_rgba(0,0,0,0.98)] text-center space-y-6"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedEnvelope(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-rose-500/10 border border-rose-400/20 text-rose-300 flex items-center justify-center hover:bg-rose-500/20 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="text-4xl">{selectedEnvelope.icon}</div>
              <h3 className="font-serif text-xl sm:text-2xl text-amber-200 italic font-normal">
                "{selectedEnvelope.title}"
              </h3>

              {/* Handwritten Comfort Letter */}
              <p className="font-serif text-base sm:text-lg text-rose-100/95 italic leading-relaxed pt-2">
                "{selectedEnvelope.letter}"
              </p>

              <p className="text-xs text-neutral-400 font-light italic pt-4">
                Written for you, always.
              </p>
            </motion.div>
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
          <span>Continue to Chapter 11...</span>
          <Heart size={13} className="fill-amber-300 text-amber-300 animate-pulse" />
        </button>
      </div>
    </div>
  );
}
