import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sun, CloudRain, Snowflake, Flower2 } from "lucide-react";

/**
 * Micro Sound Synthesizer for Seasonal Ambience Effects
 */
function playSeasonSound(type) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "rain") {
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
      filter.frequency.value = 1200;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } else if (type === "breeze") {
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 800;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    }
  } catch {}
}

/**
 * Chapter 9: The Seasons We Shared (Gratitude & Time Storytelling)
 * ----------------------------------------------------------------
 * No relationship counters. No dashboards. A poetic journey through 4 seasons
 * of love (Spring, Summer, Rain/Autumn, Winter) ending in a poignant closing message.
 */
export default function Chapter9SeasonsWeShared({ content = {}, onComplete }) {
  const seasons = [
    {
      id: "spring",
      icon: <Flower2 size={24} className="text-pink-300" />,
      title: "Spring · The Blooming Days",
      line1: "We turned ordinary coffee into unforgettable afternoons.",
      line2: "Every morning felt brand new, like waking up to quiet sunshine.",
      sound: "breeze",
      bgColor: "from-[#1a0f14] via-[#12080d] to-[#070305]",
      glowColor: "bg-pink-600/15",
    },
    {
      id: "summer",
      icon: <Sun size={24} className="text-amber-300" />,
      title: "Summer · Warm Endless Nights",
      line1: "We watched hundreds of golden sunsets together.",
      line2: "Late night drives with open windows and songs played on repeat.",
      sound: "breeze",
      bgColor: "from-[#1f120e] via-[#140a08] to-[#070304]",
      glowColor: "bg-amber-600/15",
    },
    {
      id: "monsoon",
      icon: <CloudRain size={24} className="text-sky-300" />,
      title: "Monsoon · Soft Rain & Quiet Comfort",
      line1: "We wished each other goodnight over 800 times.",
      line2: "Listening to rain patter against the window, safe in each other's arms.",
      sound: "rain",
      bgColor: "from-[#0e141d] via-[#090d14] to-[#030408]",
      glowColor: "bg-sky-600/15",
    },
    {
      id: "winter",
      icon: <Snowflake size={24} className="text-indigo-200" />,
      title: "Winter · Fireside Warmth",
      line1: "We collected thousands of tiny moments that no camera could capture.",
      line2: "Holding hands under heavy blankets while the world went quiet.",
      sound: "breeze",
      bgColor: "from-[#120f1c] via-[#0b0913] to-[#040307]",
      glowColor: "bg-indigo-600/15",
    },
  ];

  const [activeSeasonIndex, setActiveSeasonIndex] = useState(0);
  const [visitedSeasons, setVisitedSeasons] = useState([0]);

  const currentSeason = seasons[activeSeasonIndex];
  const isFinalSeason = activeSeasonIndex === seasons.length - 1;

  const handleSelectSeason = (index) => {
    playSeasonSound(seasons[index].sound);
    setActiveSeasonIndex(index);

    if (!visitedSeasons.includes(index)) {
      setVisitedSeasons((prev) => [...prev, index]);
    }
  };

  return (
    <div
      className={`relative min-h-screen bg-gradient-to-b ${currentSeason.bgColor} text-rose-100 flex flex-col items-center justify-between p-4 sm:p-8 overflow-x-clip select-none font-serif transition-colors duration-1000`}
    >
      {/* Dynamic Seasonal Ambient Glow */}
      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.12, 0.2, 0.12],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] ${currentSeason.glowColor} rounded-full blur-[170px] pointer-events-none`}
      />

      {/* Header Prompt */}
      <div className="pt-6 text-center space-y-2 z-10 max-w-lg">
        <span className="text-[10px] tracking-[0.35em] text-neutral-400 font-light uppercase block">
          Chapter IX · The Seasons We Shared
        </span>
        <h2 className="text-2xl sm:text-3xl font-normal text-rose-100 italic">
          Love measured by moments, not numbers
        </h2>
      </div>

      {/* SEASONAL POETIC CAROUSEL */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSeason.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative max-w-xl w-full my-auto z-10 text-center space-y-8"
        >
          {/* Season Emblem */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-500/10 border border-rose-400/20 flex items-center justify-center mx-auto shadow-2xl backdrop-blur-md">
            {currentSeason.icon}
          </div>

          {/* Season Title */}
          <span className="text-xs font-mono tracking-[0.3em] text-amber-300/80 uppercase block">
            {currentSeason.title}
          </span>

          {/* Poetic Memory Verses */}
          <div className="space-y-4 max-w-lg mx-auto px-4">
            <p className="font-serif text-xl sm:text-2xl text-rose-100/95 italic leading-relaxed">
              "{currentSeason.line1}"
            </p>
            <p className="font-serif text-base sm:text-lg text-neutral-300/80 italic leading-relaxed pt-2">
              "{currentSeason.line2}"
            </p>
          </div>

          {/* FINAL POIGNANT CODA MESSAGE (SHOWN WHEN ALL SEASONS EXPLORED) */}
          {visitedSeasons.length >= seasons.length && isFinalSeason && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1.4 }}
              className="pt-6 border-t border-rose-500/20 max-w-md mx-auto space-y-2"
            >
              <p className="font-serif text-2xl text-amber-200 italic font-normal">
                "Time never gave me you.
              </p>
              <p className="font-serif text-2xl text-amber-200 italic font-normal">
                It simply gave me more moments to love you."
              </p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* SEASON SELECTOR BUTTONS */}
      <div className="flex items-center justify-center gap-3 z-10 pt-4">
        {seasons.map((item, idx) => {
          const isSelected = idx === activeSeasonIndex;
          const isSeen = visitedSeasons.includes(idx);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectSeason(idx)}
              className={`p-3 rounded-full border transition-all cursor-pointer ${
                isSelected
                  ? "bg-amber-300/20 border-amber-300 shadow-lg scale-110"
                  : isSeen
                  ? "bg-rose-950/40 border-rose-500/30 opacity-80"
                  : "bg-neutral-950/40 border-neutral-800 opacity-50"
              }`}
            >
              {item.icon}
            </button>
          );
        })}
      </div>

      {/* FOOTER TRANSITION PROMPT */}
      <div className="pb-4 text-center z-10 pt-4">
        <button
          type="button"
          onClick={() => {
            if (onComplete) onComplete();
          }}
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-amber-300/90 font-serif italic tracking-widest hover:text-amber-200 transition-colors cursor-pointer"
        >
          <span>Continue to Chapter 10...</span>
          <Heart size={13} className="fill-amber-300 text-amber-300 animate-pulse" />
        </button>
      </div>
    </div>
  );
}
