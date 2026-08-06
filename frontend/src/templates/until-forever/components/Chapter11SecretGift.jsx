import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Volume2 } from "lucide-react";

/**
 * Micro Sound Synthesizer for Velvet Ribbon Unclasp
 */
function playGiftSound(type) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "ribbonUnclasp") {
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.15;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1400;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    }
  } catch {}
}

/**
 * Chapter 11: The Secret Gift (Intimate Saved Promise)
 * ----------------------------------------------------
 * Emotion: Deep Personal Intimacy.
 * A ribbon-bound secret keepsake box containing a private voice recording and handwritten promise.
 */
export default function Chapter11SecretGift({ content = {}, onComplete }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenGift = () => {
    if (isOpen) return;
    playGiftSound("ribbonUnclasp");
    setIsOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#040103] text-rose-100 flex flex-col items-center justify-between p-4 sm:p-8 overflow-hidden select-none font-serif">
      {/* Soft Warm Candlelight Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-700/10 rounded-full blur-[180px] pointer-events-none" />

      {/* Header Prompt */}
      <div className="pt-6 text-center space-y-2 z-10 max-w-lg">
        <span className="text-[10px] tracking-[0.35em] text-neutral-400 font-light uppercase block">
          Chapter XI · The Secret Gift
        </span>
        <h2 className="text-2xl sm:text-3xl font-normal text-rose-100 italic">
          {isOpen ? "Saved until the very end..." : "A private promise saved for you"}
        </h2>
      </div>

      {/* SECRET GIFT BOX OBJECT */}
      <div className="relative max-w-md w-full my-auto z-10 flex flex-col items-center">
        {!isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={handleOpenGift}
            className="cursor-pointer p-8 rounded-3xl bg-gradient-to-b from-[#241117] via-[#1a0a0f] to-[#0f0407] border border-amber-500/30 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.98)] text-center space-y-6 group"
          >
            {/* Satin Ribbon Frame */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-950 via-amber-800 to-amber-900 border border-amber-400/50 flex items-center justify-center mx-auto shadow-inner text-amber-200 text-2xl group-hover:scale-105 transition-transform">
              🎁
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-[0.3em] text-amber-300/80 uppercase block">
                Intimate Keepsake
              </span>
              <h3 className="text-xl font-normal text-rose-100 italic">
                "Untie the ribbon to open..."
              </h3>
            </div>

            <p className="text-xs text-neutral-400 font-light italic animate-pulse">
              Touch to untie ribbon
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#1c0d12] via-[#12070a] to-[#090305] border border-amber-500/30 shadow-2xl text-center space-y-6 max-w-lg w-full"
          >
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-400/20 flex items-center justify-center mx-auto text-amber-300">
              <Volume2 size={22} />
            </div>

            <span className="text-xs font-mono tracking-[0.3em] text-amber-300/80 uppercase block">
              A Voice & Forever Promise
            </span>

            <p className="font-serif text-lg sm:text-xl text-rose-100/95 italic leading-relaxed">
              "I saved this until the very end because it is the promise I carry in my heart every single day: No matter where life takes us, my hand is forever in yours."
            </p>

            <p className="text-xs text-neutral-400 font-light italic pt-2">
              — Recorded with all my love.
            </p>
          </motion.div>
        )}
      </div>

      {/* SEAMLESS TRANSITION TO CHAPTER 12 */}
      {isOpen && (
        <div className="pb-4 text-center z-10 animate-fadeIn">
          <button
            type="button"
            onClick={() => {
              if (onComplete) onComplete();
            }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-amber-300/90 font-serif italic tracking-widest hover:text-amber-200 transition-colors cursor-pointer"
          >
            <span>Proceed to the Final Chapter...</span>
            <Heart size={13} className="fill-amber-300 text-amber-300 animate-pulse" />
          </button>
        </div>
      )}
    </div>
  );
}
