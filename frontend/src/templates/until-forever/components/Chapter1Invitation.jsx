import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { playGlobalAudio } from "@/components/BackgroundMusic";

/**
 * Web Audio API Micro Sound Design
 * (Wax cracking, paper rustle, heartbeat pulse)
 */
function playMicroSound(type) {
  if (typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === "heartbeat") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(50, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === "waxCrack") {
      const bufferSize = ctx.sampleRate * 0.15;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 1400;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } else if (type === "paperRustle") {
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.2;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 2000;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    }
  } catch {}
}

/**
 * Chapter 1: The Invitation (Ultimate Physical Memory Realism)
 * -----------------------------------------------------------
 * Zero digital UI. Pure paper, candlelit silence, tactile wax seal, and pressed rose petal.
 */
export default function Chapter1Invitation({ content = {}, onComplete }) {
  const recipientName = content.recipientName || "Ananya";
  const bgMusicUrl = content.bgMusicUrl || "/audio/romantic.mp3";

  // Intimate dialogue beat (0 to 4)
  const [whisperBeat, setWhisperBeat] = useState(0);

  // Stage state: "conversation" | "envelope" | "surprise" | "completed"
  const [stage, setStage] = useState("conversation");

  // Hold-to-Break Wax Seal State (0 to 100%)
  const [holdProgress, setHoldProgress] = useState(0);
  const isHoldingRef = useRef(false);
  const holdIntervalRef = useRef(null);

  // Unhurried emotional dialogue pacing (16-second unhurried opening)
  useEffect(() => {
    const b1 = setTimeout(() => setWhisperBeat(1), 3200);  // "Before you continue..."
    const b2 = setTimeout(() => setWhisperBeat(2), 6800);  // "Promise me one thing."
    const b3 = setTimeout(() => setWhisperBeat(3), 10000); // "Don't rush."
    const b4 = setTimeout(() => setWhisperBeat(4), 13200); // "Some moments deserve to be felt slowly."
    const tEnv = setTimeout(() => setStage("envelope"), 17000); // Reveal Envelope

    return () => {
      clearTimeout(b1);
      clearTimeout(b2);
      clearTimeout(b3);
      clearTimeout(b4);
      clearTimeout(tEnv);
    };
  }, []);

  // Handle Physical Hold on Wax Seal
  const handleHoldStart = () => {
    if (stage !== "envelope") return;
    isHoldingRef.current = true;

    try {
      playGlobalAudio(bgMusicUrl);
    } catch {}

    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([15, 30, 15]);
      }
    } catch {}

    playMicroSound("heartbeat");

    holdIntervalRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          clearInterval(holdIntervalRef.current);
          handleSealBreakSuccess();
          return 100;
        }

        if (Math.floor(prev) % 25 === 0) {
          playMicroSound("heartbeat");
        }

        return prev + 3.5;
      });
    }, 50);
  };

  const handleHoldEnd = () => {
    isHoldingRef.current = false;
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);

    if (holdProgress < 100) {
      setHoldProgress(0);
    }
  };

  const handleSealBreakSuccess = () => {
    playMicroSound("waxCrack");
    playMicroSound("paperRustle");

    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([50, 100, 50]);
      }
    } catch {}

    setTimeout(() => {
      setStage("surprise");
    }, 600);

    setTimeout(() => {
      setStage("completed");
      if (onComplete) onComplete();
    }, 3800);
  };

  const whispers = [
    "I made something for you...",
    "Before you continue...",
    "Promise me one thing.",
    "Don't rush.",
    "Some moments deserve to be felt slowly.",
  ];

  return (
    <div className="relative min-h-screen bg-[#040103] text-white flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none font-serif">
      {/* Candlelight Warmth Bloom */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.12, 0.2, 0.12],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[540px] bg-rose-600/15 rounded-full blur-[150px] pointer-events-none"
      />

      <AnimatePresence mode="wait">
        {/* STAGE 1: INTIMATE HANDWRITTEN DIALOGUE */}
        {stage === "conversation" && (
          <motion.div
            key={`whisper-${whisperBeat}`}
            initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(3px)" }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            className="text-center space-y-4 max-w-lg z-10 px-6"
          >
            <p className="text-2xl sm:text-4xl text-rose-100/95 font-light italic leading-relaxed tracking-wide">
              "{whisperBeat < whispers.length ? whispers[whisperBeat] : whispers[4]}"
            </p>
          </motion.div>
        )}

        {/* STAGE 2: PHYSICAL PARCHMENT ENVELOPE */}
        {stage === "envelope" && (
          <motion.div
            key="envelope-stage"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="relative max-w-md w-full flex flex-col items-center z-10"
          >
            {/* Real Parchment Envelope Object with Physical Drop Shadow */}
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[4/3] rounded-3xl bg-gradient-to-b from-[#1b1013] via-[#130a0c] to-[#0a0406] border border-rose-500/20 p-8 shadow-[0_40px_90px_-20px_rgba(0,0,0,0.98)] flex flex-col justify-between overflow-hidden">
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:14px_14px] pointer-events-none" />

              {/* Minimal Calligraphic Address */}
              <div className="pt-2 text-center space-y-1.5 z-10 font-serif">
                <span className="text-xs tracking-[0.35em] text-neutral-400 font-light uppercase block">
                  For
                </span>
                <h2 className="text-2xl sm:text-3xl font-normal text-rose-100 tracking-wide italic">
                  {recipientName} <span className="text-rose-500 not-italic">❤️</span>
                </h2>
                <span className="text-[11px] tracking-[0.3em] text-amber-300/70 font-light uppercase block pt-0.5">
                  Only.
                </span>
              </div>

              {/* Pure Physical Wax Seal Interaction */}
              <div className="relative my-auto flex flex-col items-center justify-center z-20">
                <div
                  onMouseDown={handleHoldStart}
                  onMouseUp={handleHoldEnd}
                  onMouseLeave={handleHoldEnd}
                  onTouchStart={handleHoldStart}
                  onTouchEnd={handleHoldEnd}
                  className="relative cursor-pointer focus:outline-none select-none group/seal"
                >
                  {/* Organic Candlelight Warmth Expansion during Hold */}
                  <motion.div
                    animate={{
                      scale: holdProgress > 0 ? 1.3 + holdProgress / 200 : 1,
                      opacity: holdProgress > 0 ? 0.9 : 0.25,
                    }}
                    className="absolute -inset-5 rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-rose-600 blur-xl pointer-events-none"
                  />

                  {/* Crimson Wax Seal Stamp */}
                  <div
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-rose-950 via-rose-850 to-amber-900 border-2 border-rose-300/35 shadow-2xl flex items-center justify-center text-rose-100 transition-transform ${
                      holdProgress > 0 ? "scale-105" : ""
                    }`}
                  >
                    {/* Organic Crack Lines Spread */}
                    {holdProgress > 25 && (
                      <div className="absolute inset-0 rounded-full border border-amber-300/40 animate-ping opacity-60 pointer-events-none" />
                    )}

                    <Heart
                      size={28}
                      className={`fill-rose-100 text-rose-100 drop-shadow-md transition-transform ${
                        holdProgress > 0 ? "scale-110 animate-pulse" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Tactile Handwritten Prompt */}
                <p className="mt-4 text-xs text-rose-200/80 font-light italic tracking-wider">
                  {holdProgress > 0 ? "Hold tight..." : "Hold wax seal to open..."}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* STAGE 3: PRESSED ROSE PETAL & KEEPSAKE NOTE */}
        {stage === "surprise" && (
          <motion.div
            key="surprise-stage"
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative max-w-sm w-full text-center space-y-6 z-20"
          >
            {/* Real Pressed Rose Petal Falling Animation */}
            <motion.div
              initial={{ opacity: 0, y: -35, rotate: -25 }}
              animate={{ opacity: 1, y: 0, rotate: 12 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-400/30 text-rose-300 flex items-center justify-center mx-auto shadow-2xl backdrop-blur-md"
            >
              <span className="text-3xl select-none">🌸</span>
            </motion.div>

            {/* Handwritten Keepsake Note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1.2 }}
              className="p-7 rounded-2xl bg-gradient-to-b from-[#180c10] to-[#0d0608] border border-rose-500/25 shadow-2xl space-y-2"
            >
              <p className="font-serif text-3xl text-rose-100 italic">
                "You found it."
              </p>
              <p className="text-xs text-neutral-400 font-light pt-2 italic">
                Unfolding your handwritten story...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
