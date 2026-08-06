import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MapPin, Sparkles, Volume2, X } from "lucide-react";

/**
 * Micro Sound Synthesizer for Keepsake Pickups & Sound Triggers
 */
function playKeepsakeSound(type) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "pickup") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === "cassetteClick") {
      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 2000;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    }
  } catch {}
}

/**
 * Chapter 3: The Keepsake Table (Museum of a Relationship)
 * --------------------------------------------------------
 * Not a timeline. An organic table scatter of physical keepsakes.
 * Tapping an item lifts it into focus and unfolds its handwritten memory.
 */
export default function Chapter3KeepsakeTable({ content = {}, onComplete }) {
  // Keepsakes Data Array
  const keepsakes = [
    {
      id: "ticket",
      icon: "🎟️",
      title: "Movie Ticket Stub",
      date: "Nov 12 · 9:15 PM",
      location: "Grand Cinema, Row 7",
      story:
        "We missed the last bus home because we stayed in the theater talking until the staff turned off the lights. It was freezing cold, but walking 3 miles in the rain with you was the happiest night of my year.",
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
      rotation: -8,
      position: "top-4 left-4 sm:top-8 sm:left-12",
    },
    {
      id: "napkin",
      icon: "☕",
      title: "Crinkled Coffee Napkin",
      date: "June 15 · First Meeting",
      location: "Corner Cafe on 4th St.",
      story:
        "You wrote your number on this napkin with a blue ballpoint pen. I was so nervous my hands were shaking when I asked for it. I still have this exact napkin inside my favorite notebook.",
      image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80",
      rotation: 12,
      position: "top-8 right-6 sm:top-12 sm:right-16",
    },
    {
      id: "keyring",
      icon: "🔑",
      title: "Cabin Room Key",
      date: "Oct 04 · Weekend Getaway",
      location: "Pine Hill Cabin #4",
      story:
        "Our first trip away from the noise of the city. We cooked pasta that was slightly burnt, made hot cocoa under three wool blankets, and watched the fog roll over the mountains.",
      image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
      rotation: -14,
      position: "bottom-12 left-6 sm:bottom-16 sm:left-20",
    },
    {
      id: "polaroid",
      icon: "📸",
      title: "Sunset Polaroid Snapshot",
      date: "July 22 · Golden Hour",
      location: "Old Pier Harbor",
      story:
        "The wind was so strong your hair was blowing across your face. You were laughing so genuinely. This single photo is framed right beside my bed.",
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
      rotation: 6,
      position: "bottom-6 right-8 sm:bottom-10 sm:right-24",
    },
  ];

  // Active selected keepsake object
  const [selectedKeepsake, setSelectedKeepsake] = useState(null);
  const [discoveredIds, setDiscoveredIds] = useState([]);

  const handleOpenKeepsake = (item) => {
    playKeepsakeSound("pickup");
    setSelectedKeepsake(item);

    if (!discoveredIds.includes(item.id)) {
      setDiscoveredIds((prev) => [...prev, item.id]);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#040103] text-rose-100 flex flex-col items-center justify-between p-4 sm:p-8 overflow-hidden select-none font-serif">
      {/* Candlelight Ambience Bloom */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-700/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Header Prompt */}
      <div className="pt-6 text-center space-y-2 z-10 max-w-lg">
        <span className="text-[10px] tracking-[0.35em] text-neutral-400 font-light uppercase block">
          Museum of Us
        </span>
        <h2 className="text-2xl sm:text-3xl font-normal text-rose-100 italic">
          Touch a keepsake to discover a memory
        </h2>
        <p className="text-xs text-neutral-400 font-light italic">
          {discoveredIds.length} of {keepsakes.length} discovered
        </p>
      </div>

      {/* THE KEEPSAKE TABLE SURFACE (ORGANIC SCATTERED ARTIFACTS) */}
      <div className="relative w-full max-w-3xl aspect-[16/10] sm:aspect-[16/9] rounded-3xl bg-gradient-to-b from-[#180e12] via-[#110709] to-[#090305] border border-rose-500/20 p-6 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.98)] my-auto flex items-center justify-center overflow-hidden">
        {/* Dark Wood Grain / Paper Fiber Surface Texture Overlay */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* SCATTERED KEEPSAKE ITEMS ON THE TABLE */}
        <div className="relative w-full h-full">
          {keepsakes.map((item) => {
            const isDiscovered = discoveredIds.includes(item.id);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, rotate: item.rotation }}
                whileHover={{ scale: 1.08, zIndex: 30 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleOpenKeepsake(item)}
                className={`absolute cursor-pointer p-4 rounded-2xl bg-gradient-to-b from-[#221419] to-[#140a0e] border border-rose-500/30 shadow-2xl transition-shadow hover:shadow-rose-500/20 flex flex-col items-center gap-2 ${item.position}`}
              >
                {/* Discovery Badge */}
                {isDiscovered && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs shadow-md">
                    ✓
                  </div>
                )}

                {/* Keepsake Physical Icon / Stamp */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-rose-500/10 border border-rose-400/20 flex items-center justify-center text-2xl shadow-inner">
                  {item.icon}
                </div>
                <span className="text-[11px] font-serif text-rose-200/90 italic tracking-wide max-w-[100px] text-center truncate">
                  {item.title}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* EXPANDED KEEPSAKE MEMORY MODAL (WHEN A KEEPSAKE IS PICKED UP) */}
      <AnimatePresence>
        {selectedKeepsake && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedKeepsake(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full rounded-3xl bg-gradient-to-b from-[#1c0f14] via-[#14080b] to-[#0c0406] border border-rose-500/30 p-6 sm:p-8 shadow-2xl space-y-5 text-left"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedKeepsake(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-rose-500/10 border border-rose-400/20 text-rose-300 flex items-center justify-center hover:bg-rose-500/20 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Keepsake Photo / Artifact View */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-rose-500/20 shadow-xl">
                <img
                  src={selectedKeepsake.image}
                  alt={selectedKeepsake.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-rose-500/20 text-[10px] text-amber-300 font-mono">
                  {selectedKeepsake.icon} {selectedKeepsake.title}
                </div>
              </div>

              {/* Keepsake Date & Location Stamps */}
              <div className="flex flex-wrap items-center justify-between text-xs text-neutral-400 pt-1 font-mono border-b border-rose-500/15 pb-3">
                <span className="text-amber-300/90">{selectedKeepsake.date}</span>
                <span className="flex items-center gap-1 text-rose-300/80">
                  <MapPin size={12} /> {selectedKeepsake.location}
                </span>
              </div>

              {/* Handwritten Story Memory */}
              <p className="font-serif text-base sm:text-lg text-rose-100/90 italic leading-relaxed pt-1">
                "{selectedKeepsake.story}"
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
          <span>Continue to Chapter 4...</span>
          <Heart size={13} className="fill-amber-300 text-amber-300 animate-pulse" />
        </button>
      </div>
    </div>
  );
}
