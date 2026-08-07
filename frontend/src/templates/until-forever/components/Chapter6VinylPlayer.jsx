import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Disc, Music, AlertCircle, Play, Pause } from "lucide-react";
import { playGlobalAudio, pauseGlobalAudio } from "@/components/BackgroundMusic";

/**
 * Music Provider Detection Helper
 */
function detectMusicProvider(url = "") {
  if (!url || typeof url !== "string") return { type: "mp3", embedUrl: "" };

  const spotifyMatch = url.match(/spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
  if (spotifyMatch) {
    return {
      type: "spotify",
      embedUrl: `https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}?utm_source=generator&theme=0`,
    };
  }

  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (ytMatch) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&enablejsapi=1`,
    };
  }

  const appleMatch = url.match(/music\.apple\.com\/([a-z]{2})\/(album|song|playlist)\/([^/]+)\/([0-9]+)/);
  if (appleMatch) {
    return {
      type: "apple",
      embedUrl: `https://embed.music.apple.com/${appleMatch[1]}/${appleMatch[2]}/${appleMatch[3]}/${appleMatch[4]}`,
    };
  }

  return { type: "mp3", embedUrl: url };
}

/**
 * Micro Sound Synthesizer for Vinyl Record Needle Drop & Crackle
 */
function playVinylFxSound(type) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "needleDrop") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === "crackle") {
      const bufferSize = ctx.sampleRate * 0.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.15;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 1600;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    }
  } catch {}
}

/**
 * Chapter 6: Our Song (Vintage Spinning Vinyl Record Player)
 * ---------------------------------------------------------
 * Emotion: Warmth & Shared Happiness.
 * Handles provider detection (Spotify, YouTube, Apple Music, MP3)
 * Ducks global background music during playback & restores on exit.
 */
export default function Chapter6VinylPlayer({ content = {}, onComplete }) {
  const songTitle = content.songTitle || "Golden Hour Romance";
  const songStory =
    content.songStory ||
    "Remember that late-night drive when this song played on repeat three times? You sang every word out of tune, and I never loved you more.";
  const lyricsExcerpt =
    content.lyricsExcerpt ||
    "“In every lifetime, under every sky, I would still choose you...”";
  const rawMusicUrl = content.songAudioUrl || content.bgMusicUrl || "/audio/romantic.mp3";

  const provider = detectMusicProvider(rawMusicUrl);

  // Stages: "sleeve" | "turntable" | "playing"
  const [stage, setStage] = useState("sleeve");
  const audioRef = useRef(null);

  // Pause global background music when playing vinyl song, restore on unmount
  useEffect(() => {
    return () => {
      pauseGlobalAudio();
      setTimeout(() => {
        playGlobalAudio();
      }, 300);
    };
  }, []);

  // Slide vinyl from sleeve onto turntable
  const handlePlaceVinyl = () => {
    if (stage !== "sleeve") return;
    playVinylFxSound("needleDrop");
    setStage("turntable");
  };

  // Drop brass tonearm needle onto vinyl groove
  const handleDropNeedle = () => {
    if (stage !== "turntable") return;
    playVinylFxSound("needleDrop");
    playVinylFxSound("crackle");

    // Duck global background music
    pauseGlobalAudio();

    if (provider.type === "mp3" && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }

    setStage("playing");
  };

  return (
    <div className="relative min-h-screen bg-[#040103] text-rose-100 flex flex-col items-center justify-between p-4 sm:p-8 overflow-x-clip select-none font-serif">
      {/* Hidden HTML Audio for MP3 files */}
      {provider.type === "mp3" && (
        <audio ref={audioRef} src={provider.embedUrl} preload="auto" loop />
      )}

      {/* Warm Sunset Amber Glow */}
      <motion.div
        animate={{
          scale: stage === "playing" ? [1, 1.08, 1] : [1, 1.03, 1],
          opacity: stage === "playing" ? [0.18, 0.28, 0.18] : [0.12, 0.18, 0.12],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] bg-amber-600/15 rounded-full blur-[160px] pointer-events-none"
      />

      {/* Header Prompt */}
      <div className="pt-6 text-center space-y-2 z-10 max-w-lg">
        <span className="text-[10px] tracking-[0.35em] text-neutral-400 font-light uppercase block">
          Chapter VI · Our Song
        </span>
        <h2 className="text-2xl sm:text-3xl font-normal text-rose-100 italic">
          {stage === "sleeve"
            ? "A vintage record preserved for you..."
            : stage === "turntable"
            ? "Drop the needle onto the spinning groove"
            : songTitle}
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {/* STAGE 1: VINTAGE ALBUM SLEEVE */}
        {stage === "sleeve" && (
          <motion.div
            key="sleeve-stage"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            onClick={handlePlaceVinyl}
            className="relative max-w-sm sm:max-w-md w-full cursor-pointer my-auto z-10 group"
          >
            <div className="relative aspect-square rounded-3xl bg-gradient-to-b from-[#241419] via-[#1a0b0f] to-[#100407] border-2 border-rose-500/25 p-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.98)] flex flex-col items-center justify-between text-center overflow-hidden">
              <div className="pt-4 space-y-1 z-10">
                <span className="text-[10px] tracking-[0.3em] text-amber-300/80 font-mono uppercase block">
                  33 RPM Vinyl Record
                </span>
                <h3 className="text-2xl font-normal text-rose-100 italic">
                  "{songTitle}"
                </h3>
              </div>

              {/* Vinyl Disc Peeking Out */}
              <div className="relative my-auto flex items-center justify-center">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-950 border-4 border-amber-900/40 shadow-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-700">
                  <Disc size={36} className="text-amber-400/80" />
                </div>
              </div>

              <p className="pb-2 text-xs text-amber-300/80 font-light italic tracking-widest animate-pulse">
                Tap to place record on turntable...
              </p>
            </div>
          </motion.div>
        )}

        {/* STAGE 2 & 3: TURNTABLE & EMBEDDED PLAYER */}
        {(stage === "turntable" || stage === "playing") && (
          <motion.div
            key="turntable-stage"
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative max-w-lg w-full my-auto z-10 flex flex-col items-center space-y-6"
          >
            {/* Turntable Plinth */}
            <div className="relative w-full aspect-[4/3] rounded-3xl bg-gradient-to-b from-[#1e1014] via-[#14080b] to-[#0a0305] border-2 border-amber-900/40 p-8 shadow-[0_50px_110px_-20px_rgba(0,0,0,0.98)] flex items-center justify-between overflow-hidden">
              {/* Spinning Vinyl Platter */}
              <div className="relative w-48 h-48 sm:w-60 sm:h-60 mx-auto">
                <motion.div
                  animate={{
                    rotate: stage === "playing" ? 360 : 0,
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-full h-full rounded-full bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-950 border-4 border-amber-900/40 shadow-2xl flex items-center justify-center relative overflow-hidden"
                >
                  <div className="absolute inset-3 rounded-full border border-neutral-800 pointer-events-none" />
                  <div className="absolute inset-7 rounded-full border border-neutral-800 pointer-events-none" />
                  <div className="absolute inset-12 rounded-full border border-neutral-800 pointer-events-none" />

                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-rose-950 to-amber-900 border-2 border-amber-400/50 flex flex-col items-center justify-center text-center p-1 z-10">
                    <Music size={16} className="text-amber-300" />
                    <span className="text-[8px] text-rose-100 font-mono italic truncate max-w-[50px]">
                      {songTitle}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Tonearm Needle Mechanism */}
              <div
                onClick={handleDropNeedle}
                className="absolute top-8 right-8 cursor-pointer group/arm z-20"
              >
                <motion.div
                  animate={{
                    rotate: stage === "playing" ? 22 : 0,
                  }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="w-4 h-36 bg-gradient-to-b from-amber-600 via-amber-800 to-neutral-900 rounded-full origin-top border border-amber-400/40 shadow-xl flex flex-col items-center justify-end p-1"
                >
                  <div className="w-3 h-5 bg-amber-300 rounded-sm shadow-md" />
                </motion.div>
                {stage === "turntable" && (
                  <p className="text-[10px] text-amber-300 font-mono tracking-widest pt-2 animate-pulse">
                    Tap needle to play
                  </p>
                )}
              </div>
            </div>

            {/* Provider Specific Official Embed */}
            {stage === "playing" && provider.type !== "mp3" && (
              <div className="w-full max-w-md rounded-2xl overflow-hidden border border-rose-500/30 shadow-2xl bg-black">
                {provider.type === "spotify" && (
                  <iframe
                    src={provider.embedUrl}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title="Spotify Music Player"
                  />
                )}

                {provider.type === "youtube" && (
                  <div className="aspect-video w-full">
                    <iframe
                      src={provider.embedUrl}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="YouTube Music Player"
                    />
                  </div>
                )}

                {provider.type === "apple" && (
                  <iframe
                    src={provider.embedUrl}
                    width="100%"
                    height="175"
                    frameBorder="0"
                    allow="autoplay *; encrypted-media *; fullscreen *"
                    loading="lazy"
                    title="Apple Music Player"
                  />
                )}
              </div>
            )}

            {/* Song Memory Note & Lyrics Excerpt */}
            {stage === "playing" && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="p-6 rounded-2xl bg-gradient-to-b from-[#180d11] to-[#0f0709] border border-rose-500/25 shadow-2xl text-center space-y-3 max-w-md"
              >
                <p className="font-serif text-lg text-rose-100 italic">
                  {lyricsExcerpt}
                </p>
                <p className="text-xs text-neutral-400 font-light italic leading-relaxed">
                  "{songStory}"
                </p>
              </motion.div>
            )}
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
          <span>Continue to Chapter 7...</span>
          <Heart size={13} className="fill-amber-300 text-amber-300 animate-pulse" />
        </button>
      </div>
    </div>
  );
}
