import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Lock, Unlock } from "lucide-react";

/**
 * Micro Sound Synthesizer for Wooden Box & Latch Interactions
 */
function playBoxSound(type) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "latch") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else if (type === "lidOpen") {
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.2;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 800;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    }
  } catch {}
}

/**
 * Chapter 4: The Vintage Wooden Memory Box
 * ----------------------------------------
 * A physical wooden memory box kept secretly for years.
 * Recipient opens the brass latch, lifts the lid, and discovers layered keepsakes inside.
 */
export default function Chapter4MemoryBox({ content = {}, onComplete }) {
  // Layered Treasures Inside the Memory Box
  const boxTreasures = [
    {
      id: "letter-note",
      icon: "💌",
      title: "Folded Secret Letter",
      tagline: "Saved from our 1st year",
      story:
        "I kept this folded letter in my jacket pocket for three weeks before I was brave enough to give it to you. Every word in it still holds true.",
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "key-future",
      icon: "🔑",
      title: "Brass Key & Ribbon",
      tagline: "Symbol of our future",
      story:
        "This is the key from our first apartment door handle mockup. I kept it as a reminder that wherever we go in life, home is wherever you are.",
      image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "photo-strip",
      icon: "🎞️",
      title: "Photo Booth Strip",
      tagline: "Rainy Friday night",
      story:
        "Four silly photos taken in a cramped photo booth while laughing hysterically. You made funny faces in 3 out of 4, and I fell deeper in love.",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "scroll-notes",
      icon: "📜",
      title: "Twine-Tied Parchment Scroll",
      tagline: "10 Things I Never Told You",
      story:
        "1. I still get butterflies when you text me. 2. I love the way your eyes crinkle when you laugh. 3. You make every ordinary day feel extraordinary.",
      image: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=800&q=80",
    },
  ];

  // Stage state: "closed" | "opening" | "open"
  const [stage, setStage] = useState("closed");
  const [selectedTreasure, setSelectedTreasure] = useState(null);

  const handleOpenBox = () => {
    if (stage !== "closed") return;
    playBoxSound("latch");
    playBoxSound("lidOpen");
    setStage("opening");

    setTimeout(() => {
      setStage("open");
    }, 1200);
  };

  return (
    <div className="relative min-h-screen bg-[#040103] text-rose-100 flex flex-col items-center justify-between p-4 sm:p-8 overflow-x-clip select-none font-serif">
      {/* Warm Soft Candlelight Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-700/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Header Prompt */}
      <div className="pt-6 text-center space-y-2 z-10 max-w-lg">
        <span className="text-[10px] tracking-[0.35em] text-neutral-400 font-light uppercase block">
          Secret Keepsakes
        </span>
        <h2 className="text-2xl sm:text-3xl font-normal text-rose-100 italic">
          {stage === "closed"
            ? "A wooden box kept secretly for years..."
            : "Layered treasures preserved inside"}
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {/* STAGE 1 & 2: CLOSED WOODEN BOX WITH BRASS LATCH */}
        {(stage === "closed" || stage === "opening") && (
          <motion.div
            key="closed-box"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            onClick={handleOpenBox}
            className="relative max-w-sm sm:max-w-md w-full cursor-pointer my-auto z-10 group"
          >
            {/* Handcrafted Mahogany Wooden Box Body */}
            <div className="relative aspect-[4/3] rounded-3xl bg-gradient-to-b from-[#241318] via-[#1a0c10] to-[#100609] border-2 border-amber-900/50 p-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.98)] flex flex-col items-center justify-between overflow-hidden">
              {/* Dark Wood Texture Overlay */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

              {/* Wooden Box Lid Carving */}
              <div className="pt-4 text-center space-y-1 font-serif z-10">
                <span className="text-[10px] tracking-[0.3em] text-amber-300/70 uppercase block">
                  Private Keepsakes
                </span>
                <h3 className="text-xl sm:text-2xl font-normal text-rose-100 italic">
                  Do Not Open Except With Love
                </h3>
              </div>

              {/* Brass Latch Lock Centerpiece */}
              <div className="my-auto z-20 flex flex-col items-center gap-3">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-950 via-amber-800 to-amber-900 border-2 border-amber-400/50 shadow-2xl flex items-center justify-center text-amber-200 transition-transform group-hover:scale-105">
                  {stage === "opening" ? (
                    <Unlock size={26} className="text-amber-300 animate-pulse" />
                  ) : (
                    <Lock size={26} className="text-amber-300/90" />
                  )}
                </div>
                <p className="text-xs text-amber-300/80 font-light italic tracking-widest animate-pulse">
                  {stage === "opening" ? "Unlocking lid..." : "Tap brass latch to open..."}
                </p>
              </div>

              <div className="pb-1 text-[10px] text-neutral-500 tracking-widest font-mono">
                Handcrafted Mahogany Box
              </div>
            </div>
          </motion.div>
        )}

        {/* STAGE 3: OPEN WOODEN BOX WITH LAYERED TREASURES INSIDE */}
        {stage === "open" && (
          <motion.div
            key="open-box"
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative max-w-xl w-full my-auto z-10"
          >
            {/* Inside Wooden Box Container with Dark Velvet Lining */}
            <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#180a0e] via-[#100508] to-[#080204] border-2 border-amber-900/40 p-6 sm:p-8 shadow-[0_50px_110px_-20px_rgba(0,0,0,0.98)] space-y-6 overflow-hidden">
              {/* Soft Velvet Surface Texture */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              {/* Layered Treasures Grid */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 z-10 relative">
                {boxTreasures.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTreasure(item)}
                    className="cursor-pointer p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#26151a] to-[#160b0e] border border-rose-500/25 shadow-xl flex flex-col items-center text-center space-y-2 group"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-500/10 border border-rose-400/20 flex items-center justify-center text-2xl shadow-inner group-hover:border-rose-400/50 transition-colors">
                      {item.icon}
                    </div>
                    <h4 className="font-serif text-sm sm:text-base text-rose-100 italic">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-neutral-400 font-light italic">
                      {item.tagline}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EXPANDED TREASURE MEMORY MODAL */}
      <AnimatePresence>
        {selectedTreasure && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedTreasure(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full rounded-3xl bg-gradient-to-b from-[#1c0f14] via-[#14080b] to-[#0c0406] border border-rose-500/30 p-6 sm:p-8 shadow-2xl space-y-5 text-left"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedTreasure(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-rose-500/10 border border-rose-400/20 text-rose-300 flex items-center justify-center hover:bg-rose-500/20 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              {/* Treasure Header */}
              <div className="flex items-center gap-3 pt-2">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-400/20 flex items-center justify-center text-2xl">
                  {selectedTreasure.icon}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-normal text-rose-100 italic">
                    {selectedTreasure.title}
                  </h3>
                  <span className="text-xs text-amber-300/80 font-mono">
                    {selectedTreasure.tagline}
                  </span>
                </div>
              </div>

              {/* Treasure Image */}
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-rose-500/20 shadow-xl">
                <img
                  src={selectedTreasure.image}
                  alt={selectedTreasure.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Memory Story */}
              <p className="font-serif text-base text-rose-100/90 italic leading-relaxed pt-1">
                "{selectedTreasure.story}"
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
          <span>Continue to Chapter 5...</span>
          <Heart size={13} className="fill-amber-300 text-amber-300 animate-pulse" />
        </button>
      </div>
    </div>
  );
}
