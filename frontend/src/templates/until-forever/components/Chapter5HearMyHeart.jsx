import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Volume2, VolumeX, Sparkles } from "lucide-react";

/**
 * Micro Sound Synthesizer for Physical Cassette & Radio Clicks
 */
function playVoiceKeepsakeSound(type) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "cassetteClick") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }
  } catch {}
}

/**
 * Chapter 5: Hear My Heart (Discovered Voice Keepsakes)
 * ---------------------------------------------------
 * No standard digital audio players. Physical memory objects that happen to contain voices.
 */
export default function Chapter5HearMyHeart({ content = {}, onComplete }) {
  const voiceKeepsakes = [
    {
      id: "miss-me",
      icon: "📼",
      title: "Vintage Mixtape Cassette",
      situationalLabel: "Listen when you miss me...",
      note: "I recorded this in the quiet hours of the night so you could hear my voice whenever distance feels too wide.",
      audioSrc: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
    },
    {
      id: "sleep-well",
      icon: "📻",
      title: "Bedside Vintage Radio",
      situationalLabel: "Listen before sleeping...",
      note: "A quiet goodnight message recorded right before falling asleep, wishing sweet dreams to my favorite person.",
      audioSrc: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
    },
    {
      id: "hard-day",
      icon: "🎵",
      title: "Chime Music Box Pendant",
      situationalLabel: "Listen after a difficult day...",
      note: "Take a deep breath. You are stronger than you know, and I am always right here holding your hand.",
      audioSrc: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
    },
    {
      id: "need-hug",
      icon: "🧸",
      title: "Handcrafted Ribbon Heart",
      situationalLabel: "Listen when you need a hug...",
      note: "Close your eyes and picture me wrapping my arms around you. Consider this a warm, endless embrace.",
      audioSrc: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
    },
  ];

  const [activeItem, setActiveItem] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const handleSelectKeepsake = (item) => {
    playVoiceKeepsakeSound("cassetteClick");

    if (activeItem?.id === item.id && isPlaying) {
      // Pause
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Play new item
      setActiveItem(item);
      setIsPlaying(true);

      if (audioRef.current) {
        audioRef.current.src = item.audioSrc;
        audioRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-[#040103] text-rose-100 flex flex-col items-center justify-between p-4 sm:p-8 overflow-hidden select-none font-serif">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      {/* Soft Ambient Candlelight Bloom */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-700/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Header Prompt */}
      <div className="pt-6 text-center space-y-2 z-10 max-w-lg">
        <span className="text-[10px] tracking-[0.35em] text-neutral-400 font-light uppercase block">
          Chapter V · Hear My Heart
        </span>
        <h2 className="text-2xl sm:text-3xl font-normal text-rose-100 italic">
          Recorded voices preserved inside physical keepsakes
        </h2>
        <p className="text-xs text-neutral-400 font-light italic">
          Touch an object to hear its hidden recording
        </p>
      </div>

      {/* VOICE KEEPSAKE OBJECTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl my-auto z-10">
        {voiceKeepsakes.map((item) => {
          const isActive = activeItem?.id === item.id;
          const isThisPlaying = isActive && isPlaying;

          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelectKeepsake(item)}
              className={`relative cursor-pointer p-6 rounded-3xl border transition-all duration-500 overflow-hidden ${
                isActive
                  ? "bg-gradient-to-b from-[#251218] via-[#1a0a0f] to-[#100407] border-rose-500/50 shadow-[0_20px_50px_rgba(244,63,94,0.25)]"
                  : "bg-gradient-to-b from-[#180d12] to-[#0c0507] border-rose-500/20 shadow-xl"
              }`}
            >
              {/* Active Sound Aura Pulse */}
              {isThisPlaying && (
                <div className="absolute inset-0 rounded-3xl bg-rose-500/10 animate-pulse pointer-events-none" />
              )}

              <div className="flex items-start gap-4">
                {/* Physical Object Icon */}
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-950 to-amber-900 border border-rose-400/30 flex items-center justify-center text-3xl shadow-inner shrink-0">
                  {item.icon}
                  {isThisPlaying && (
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px]"
                    >
                      <Volume2 size={11} />
                    </motion.div>
                  )}
                </div>

                {/* Keepsake Details */}
                <div className="space-y-1 text-left">
                  <span className="text-[11px] text-amber-300/90 font-mono italic block">
                    {item.situationalLabel}
                  </span>
                  <h3 className="font-serif text-lg font-normal text-rose-100">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-400 font-light italic leading-relaxed pt-1">
                    "{item.note}"
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FOOTER TRANSITION PROMPT */}
      <div className="pb-4 text-center z-10">
        <button
          type="button"
          onClick={() => {
            if (audioRef.current) audioRef.current.pause();
            if (onComplete) onComplete();
          }}
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-amber-300/90 font-serif italic tracking-widest hover:text-amber-200 transition-colors cursor-pointer"
        >
          <span>Continue to Chapter 6...</span>
          <Heart size={13} className="fill-amber-300 text-amber-300 animate-pulse" />
        </button>
      </div>
    </div>
  );
}
