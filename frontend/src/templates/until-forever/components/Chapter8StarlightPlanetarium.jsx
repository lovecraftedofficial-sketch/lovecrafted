import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MapPin, Lock } from "lucide-react";

/**
 * Micro Sound Synthesizer for Quiet Starlight Awakening
 */
function playPlanetariumSound(type) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "starAwaken") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch {}
}

/**
 * Chapter 8: The Starlight Planetarium (Cinematic Atmosphere Edition)
 * -------------------------------------------------------------------
 * Timeless Constellations ("The Spark", "Midnight Whispers", "Where Time Stood Still", "The Road We Chose", "Still To Come..."),
 * unhurried cinematic memory reveal, and peaceful breathing night sky ambience.
 */
export default function Chapter8StarlightPlanetarium({ content = {}, onComplete }) {
  const constellations = [
    {
      id: "the-spark",
      icon: "✨",
      title: "The Spark",
      subtitle: "The night everything began",
      date: "June 15 · 8:30 PM",
      location: "Riverfront Park",
      note: "We sat on the bench until midnight talking about our favorite songs, dreams, and childhood memories. Neither of us wanted the night to end.",
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "midnight-whispers",
      icon: "🌙",
      title: "Midnight Whispers",
      subtitle: "Whispers in the dark",
      date: "August 02 · 2:14 AM",
      location: "Our Bedrooms",
      note: "Hours of talking about everything and nothing. We fell asleep with the phone still connected.",
      image: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "where-time-stood-still",
      icon: "☕",
      title: "Where Time Stood Still",
      subtitle: "A quiet promise",
      date: "February 14 · Sunset",
      location: "Corner Cafe",
      note: "The day we looked at each other and realized we weren't just dating anymore—we were building a lifetime.",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "the-road-we-chose",
      icon: "🛤️",
      title: "The Road We Chose",
      subtitle: "Escaping the world",
      date: "November 04 · Weekend",
      location: "Mountain Pass",
      note: "Hot cocoa, wrong turns on fog-covered roads, and finding the quietest cabin in the woods.",
      image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "still-to-come",
      icon: "🔒",
      title: "Still To Come...",
      subtitle: "A secret constellation",
      locked: true,
      note: "This constellation remains hidden until your story reaches its final chapter...",
    },
  ];

  const [activeConstellationIndex, setActiveConstellationIndex] = useState(0);
  const [awakenedIds, setAwakenedIds] = useState([]);

  // Cinematic Memory Reveal Steps: 0 (Hidden) -> 1 (Photo) -> 2 (Note) -> 3 (Date)
  const [revealStep, setRevealStep] = useState(0);

  const currentConstellation = constellations[activeConstellationIndex];
  const isAwakened = awakenedIds.includes(currentConstellation.id);

  const handleAwakenStars = () => {
    if (currentConstellation.locked) return;

    playPlanetariumSound("starAwaken");

    if (!isAwakened) {
      setAwakenedIds((prev) => [...prev, currentConstellation.id]);
    }
  };

  // Cinematic step-by-step memory reveal loop
  useEffect(() => {
    if (isAwakened && !currentConstellation.locked) {
      setRevealStep(1); // Show Photo first
      const t1 = setTimeout(() => setRevealStep(2), 1800); // Show Note after 1.8s
      const t2 = setTimeout(() => setRevealStep(3), 3600); // Show Date after 3.6s

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      setRevealStep(0);
    }
  }, [activeConstellationIndex, isAwakened, currentConstellation.locked]);

  return (
    <div className="relative min-h-screen bg-[#030208] text-rose-100 flex flex-col items-center justify-between p-4 sm:p-8 overflow-hidden select-none font-serif">
      {/* Soft Breathing Night Sky Glow */}
      <motion.div
        animate={{
          opacity: [0.12, 0.22, 0.12],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-indigo-950/25 rounded-full blur-[180px] pointer-events-none"
      />

      {/* Gentle Shooting Star Crossings */}
      <motion.div
        animate={{
          x: [-100, 550],
          y: [-50, 280],
          opacity: [0, 1, 0],
        }}
        transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 7, ease: "easeOut" }}
        className="absolute top-16 left-12 w-24 h-[1px] bg-gradient-to-r from-amber-200 to-transparent blur-[0.5px] pointer-events-none"
      />

      {/* Header Prompt */}
      <div className="pt-6 text-center space-y-2 z-10 max-w-lg">
        <span className="text-[10px] tracking-[0.35em] text-neutral-400 font-light uppercase block">
          Chapter VIII · The Starlight Planetarium
        </span>
        <h2 className="text-2xl sm:text-3xl font-normal text-rose-100 italic">
          {currentConstellation.title}
        </h2>
      </div>

      {/* PLANETARIUM CONSTELLATION CANVAS */}
      <div className="relative w-full max-w-xl aspect-square sm:aspect-[4/3] rounded-3xl bg-gradient-to-b from-[#0a0614] via-[#06030c] to-[#030208] border border-indigo-500/20 p-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.98)] my-auto flex flex-col items-center justify-between overflow-hidden">
        {/* Breathing Starfield Texture Overlay */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none animate-pulse" />

        {/* Constellation Star Nodes Container */}
        <div
          onMouseEnter={handleAwakenStars}
          onClick={handleAwakenStars}
          className="relative w-full h-full cursor-pointer flex items-center justify-center"
        >
          {/* Starlight Constellation Lines */}
          {isAwakened && !currentConstellation.locked && (
            <motion.svg
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 w-full h-full pointer-events-none stroke-amber-300/60 fill-none"
            >
              <line x1="25%" y1="35%" x2="50%" y2="20%" strokeWidth="1.5" strokeDasharray="4" />
              <line x1="50%" y1="20%" x2="75%" y2="35%" strokeWidth="1.5" strokeDasharray="4" />
              <line x1="75%" y1="35%" x2="50%" y2="65%" strokeWidth="1.5" strokeDasharray="4" />
              <line x1="50%" y1="65%" x2="25%" y2="35%" strokeWidth="1.5" strokeDasharray="4" />
            </motion.svg>
          )}

          {/* Center Breathing Star Object */}
          <div className="relative flex flex-col items-center justify-center space-y-3 z-10 text-center">
            <motion.div
              animate={{
                scale: currentConstellation.locked ? 1 : isAwakened ? 1.15 : [1, 1.08, 1],
                opacity: currentConstellation.locked ? 0.4 : isAwakened ? 1 : [0.6, 0.9, 0.6],
              }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 flex items-center justify-center text-3xl shadow-2xl transition-all duration-700 ${
                currentConstellation.locked
                  ? "bg-neutral-950 border-neutral-800 text-neutral-600"
                  : isAwakened
                  ? "bg-gradient-to-tr from-amber-950 via-amber-800 to-amber-950 border-amber-300 shadow-[0_0_40px_rgba(252,211,77,0.3)]"
                  : "bg-gradient-to-tr from-indigo-950 to-neutral-900 border-indigo-400/40"
              }`}
            >
              {currentConstellation.locked ? <Lock size={26} /> : <span>{currentConstellation.icon}</span>}
            </motion.div>

            <p className="text-xs text-amber-300/80 font-mono tracking-widest pt-1">
              {currentConstellation.locked
                ? "Locked · Still To Come..."
                : isAwakened
                ? "Constellation Awakened"
                : "Gently move over stars to awaken..."}
            </p>
          </div>
        </div>

        {/* CINEMATIC SEQUENCED MEMORY REVEAL (STEP 1: PHOTO -> STEP 2: NOTE -> STEP 3: DATE) */}
        <AnimatePresence>
          {isAwakened && !currentConstellation.locked && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="p-6 rounded-2xl bg-gradient-to-b from-[#140b15] to-[#09040a] border border-amber-500/25 shadow-2xl text-left space-y-4 max-w-lg w-full z-20"
            >
              {/* STEP 1: PHOTO REVEAL */}
              {revealStep >= 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2 }}
                  className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-rose-500/20 shadow-xl"
                >
                  <img
                    src={currentConstellation.image}
                    alt={currentConstellation.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              )}

              {/* STEP 2: HANDWRITTEN MEMORY NOTE REVEAL */}
              {revealStep >= 2 && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2 }}
                  className="font-serif text-sm sm:text-base text-rose-100/90 italic leading-relaxed pt-1"
                >
                  "{currentConstellation.note}"
                </motion.p>
              )}

              {/* STEP 3: DATE & LOCATION REVEAL */}
              {revealStep >= 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2 }}
                  className="flex items-center justify-between text-xs font-mono text-amber-300/80 border-t border-amber-500/15 pt-3"
                >
                  <span>{currentConstellation.date}</span>
                  <span className="flex items-center gap-1 text-rose-300">
                    <MapPin size={12} /> {currentConstellation.location}
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CONSTELLATION SELECTOR SWITCHES */}
      <div className="flex items-center justify-center gap-2.5 z-10 pt-2 flex-wrap">
        {constellations.map((item, idx) => {
          const isDone = awakenedIds.includes(item.id);
          const isSelected = idx === activeConstellationIndex;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveConstellationIndex(idx)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer ${
                isSelected
                  ? "bg-amber-300 text-neutral-950 font-semibold shadow-lg"
                  : item.locked
                  ? "bg-neutral-950 border border-neutral-800 text-neutral-600 opacity-60"
                  : isDone
                  ? "bg-amber-950/60 border border-amber-500/30 text-amber-300"
                  : "bg-indigo-950/40 border border-indigo-500/20 text-neutral-400"
              }`}
            >
              {item.icon} {item.title}
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
          <span>Continue to Chapter 9...</span>
          <Heart size={13} className="fill-amber-300 text-amber-300 animate-pulse" />
        </button>
      </div>
    </div>
  );
}
