import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { playGlobalAudio } from "@/components/BackgroundMusic";

/**
 * Web Audio API Sound Synthesizer for Hyper-Realistic Micro Sound Design
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
      osc.frequency.setValueAtTime(60, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === "waxCrack") {
      // Noise burst for crisp wax cracking
      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 1000;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } else if (type === "paperRustle") {
      const bufferSize = ctx.sampleRate * 0.2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.3;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 2500;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    }
  } catch {}
}

/**
 * Chapter 1: The Invitation (Flagship Masterclass Edition)
 * --------------------------------------------------------
 * Pacing: 5-Beat Conversation -> Timeless Minimal Calligraphy -> 2-Second Hold Wax Seal
 * -> Tactile Crack & Rustle -> Surprise Flower & "You found it" note -> Chapter 2.
 */
export default function Chapter1Invitation({ content = {}, onComplete }) {
  const recipientName = content.recipientName || "Ananya";
  const bgMusicUrl = content.bgMusicUrl || "/audio/romantic.mp3";

  // Intimate conversation beat index (0 to 4)
  const [whisperBeat, setWhisperBeat] = useState(0);

  // Stage state: "conversation" | "envelope" | "surprise" | "completed"
  const [stage, setStage] = useState("conversation");

  // 2-Second Hold-to-Break Wax Seal State
  const [holdProgress, setHoldProgress] = useState(0); // 0 to 100%
  const isHoldingRef = useRef(false);
  const holdIntervalRef = useRef(null);

  // Paced emotional conversation sequence (15-second unhurried opening)
  useEffect(() => {
    const b1 = setTimeout(() => setWhisperBeat(1), 3000);  // "Before you continue..."
    const b2 = setTimeout(() => setWhisperBeat(2), 6500);  // "Promise me one thing."
    const b3 = setTimeout(() => setWhisperBeat(3), 9500);  // "Don't rush."
    const b4 = setTimeout(() => setWhisperBeat(4), 12500); // "Some moments deserve to be felt slowly."
    const tEnv = setTimeout(() => setStage("envelope"), 16000); // Reveal Envelope

    return () => {
      clearTimeout(b1);
      clearTimeout(b2);
      clearTimeout(b3);
      clearTimeout(b4);
      clearTimeout(tEnv);
    };
  }, []);

  // Handle Press & Hold on Wax Seal
  const handleHoldStart = () => {
    if (stage !== "envelope") return;
    isHoldingRef.current = true;

    // Start background music ambience cleanly
    try {
      playGlobalAudio(bgMusicUrl);
    } catch {}

    // Trigger haptic feedback if supported
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

        // Pulse heartbeat sound every 25% progress
        if (Math.floor(prev) % 25 === 0) {
          playMicroSound("heartbeat");
        }

        return prev + 4; // Reaches 100% in ~2 seconds (50ms interval)
      });
    }, 50);
  };

  const handleHoldEnd = () => {
    isHoldingRef.current = false;
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);

    // If released before 100%, reset smoothly
    if (holdProgress < 100) {
      setHoldProgress(0);
    }
  };

  // Called when 2-second hold completes successfully
  const handleSealBreakSuccess = () => {
    playMicroSound("waxCrack");
    playMicroSound("paperRustle");

    // Trigger stronger haptic feedback
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([50, 100, 50]);
      }
    } catch {}

    // Transition to Surprise Inside Envelope
    setTimeout(() => {
      setStage("surprise");
    }, 600);

    // Complete chapter transition after flower & note surprise
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
    <div className="relative min-h-screen bg-[#060205] text-white flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none font-sans">
      {/* Warm Soft Candlelight Ambient Glow */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.12, 0.18, 0.12],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-rose-600/15 rounded-full blur-[150px] pointer-events-none"
      />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-amber-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Floating Stardust Embers */}
      <div className="absolute inset-0 opacity-30 pointer-events-none bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:40px_40px] animate-pulse" />

      <AnimatePresence mode="wait">
        {/* STAGE 1: INTIMATE CONVERSATIONAL DIALOGUE */}
        {stage === "conversation" && (
          <motion.div
            key={`whisper-${whisperBeat}`}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="text-center space-y-4 max-w-lg z-10 px-6"
          >
            <p className="font-serif text-2xl sm:text-4xl text-rose-100/90 font-light italic leading-relaxed tracking-wide">
              "{whisperBeat < whispers.length ? whispers[whisperBeat] : whispers[4]}"
            </p>
            {whisperBeat < 4 && (
              <p className="text-[11px] uppercase tracking-[0.3em] text-amber-300/60 font-light pt-4 animate-pulse">
                • Pause & Breathe •
              </p>
            )}
          </motion.div>
        )}

        {/* STAGE 2: THE TIMELESS LUXURY ENVELOPE */}
        {stage === "envelope" && (
          <motion.div
            key="envelope-stage"
            initial={{ opacity: 0, scale: 0.94, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="relative max-w-md w-full flex flex-col items-center z-10"
          >
            {/* Parchment Paper Envelope */}
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[4/3] rounded-3xl bg-gradient-to-b from-[#1c1216] via-[#150b0f] to-[#0e0609] border border-rose-500/25 p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col justify-between overflow-hidden">
              {/* Paper Texture Overlay */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

              {/* Minimal Timeless Calligraphy Address */}
              <div className="pt-3 text-center space-y-1.5 z-10 font-serif">
                <span className="text-[11px] tracking-[0.3em] text-neutral-400 font-light uppercase block">
                  For
                </span>
                <h2 className="text-2xl sm:text-3xl font-normal text-rose-100 tracking-wide italic">
                  {recipientName} <span className="text-rose-500 not-italic">❤️</span>
                </h2>
                <span className="text-[10px] tracking-[0.25em] text-amber-300/70 font-light uppercase block pt-0.5">
                  Only.
                </span>
              </div>

              {/* Signature Hold-to-Break Wax Seal */}
              <div className="relative my-auto flex flex-col items-center justify-center z-20">
                <div
                  onMouseDown={handleHoldStart}
                  onMouseUp={handleHoldEnd}
                  onMouseLeave={handleHoldEnd}
                  onTouchStart={handleHoldStart}
                  onTouchEnd={handleHoldEnd}
                  className="relative cursor-pointer focus:outline-none select-none group/seal"
                >
                  {/* Dynamic Golden Glow Halo during Hold */}
                  <motion.div
                    animate={{
                      scale: holdProgress > 0 ? 1.2 + holdProgress / 200 : 1,
                      opacity: holdProgress > 0 ? 0.8 : 0.3,
                    }}
                    className="absolute -inset-4 rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-rose-600 blur-lg pointer-events-none"
                  />

                  {/* Wax Seal Object */}
                  <div
                    className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-rose-950 via-rose-800 to-amber-900 border-2 border-rose-300/40 shadow-2xl flex items-center justify-center text-rose-100 transition-transform ${
                      holdProgress > 0 ? "scale-105" : ""
                    }`}
                  >
                    {/* Organic Crack Lines when progress increases */}
                    {holdProgress > 30 && (
                      <div className="absolute inset-0 rounded-full border border-amber-300/50 animate-ping opacity-60" />
                    )}

                    <Heart
                      size={30}
                      className={`fill-rose-100 text-rose-100 drop-shadow-md transition-transform ${
                        holdProgress > 0 ? "scale-110 animate-pulse" : ""
                      }`}
                    />

                    {/* Circular Hold Progress Ring */}
                    <svg
                      className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="46"
                        className="stroke-amber-400/80 fill-none"
                        strokeWidth="3"
                        strokeDasharray="289"
                        strokeDashoffset={289 - (289 * holdProgress) / 100}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Instruction Pill */}
                <p className="mt-4 text-[11px] text-rose-300/80 font-light tracking-widest flex items-center gap-1.5">
                  <Sparkles size={12} className="text-amber-300 animate-spin [animation-duration:5s]" />
                  <span>{holdProgress > 0 ? `Holding... ${Math.round(holdProgress)}%` : "Press & hold wax seal for 2 seconds"}</span>
                </p>
              </div>

              {/* Envelope Footer */}
              <div className="pb-1 text-center text-[10px] text-neutral-500 tracking-widest font-mono">
                LoveCrafted Keepsake · Chapter I
              </div>
            </div>
          </motion.div>
        )}

        {/* STAGE 3: THE SURPRISE INSIDE THE ENVELOPE (PRESSED FLOWER & KEEPSAKE NOTE) */}
        {stage === "surprise" && (
          <motion.div
            key="surprise-stage"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative max-w-sm w-full text-center space-y-6 z-20"
          >
            {/* Falling Pressed Flower / Rose Petal Animation */}
            <motion.div
              initial={{ opacity: 0, y: -30, rotate: -20 }}
              animate={{ opacity: 1, y: 0, rotate: 10 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-400/30 text-rose-300 flex items-center justify-center mx-auto shadow-2xl backdrop-blur-md"
            >
              <span className="text-3xl select-none">🌸</span>
            </motion.div>

            {/* Keepsake Handwritten Note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="p-6 rounded-2xl bg-gradient-to-b from-[#180d11] to-[#0f0709] border border-rose-500/30 shadow-2xl space-y-2"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-amber-300/80 font-semibold block">
                Found Inside
              </span>
              <p className="font-serif text-2xl text-rose-100 italic">
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
