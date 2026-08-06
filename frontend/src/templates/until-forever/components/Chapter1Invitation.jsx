import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Volume2 } from "lucide-react";
import { playGlobalAudio } from "@/components/BackgroundMusic";

/**
 * Chapter 1: The Invitation
 * -------------------------
 * Goal: Transform the recipient's mindset from "I opened a web link" to
 * "Someone who loves me deeply created a quiet, sacred moment just for me."
 */
export default function Chapter1Invitation({ content = {}, onComplete }) {
  const recipientName = content.recipientName || "My Dearest";
  const invitationGreeting = content.invitationGreeting || "I made something for you...";
  const invitationSubtext =
    content.invitationSubtext ||
    "No matter where you are right now, take a quiet breath, turn up your volume, and open your surprise.";
  const bgMusicUrl = content.bgMusicUrl || "/audio/romantic.mp3";

  // Sequence state: "whisper1" | "whisper2" | "envelope" | "opening" | "opened"
  const [stage, setStage] = useState("whisper1");
  const [isBreakingSeal, setIsBreakingSeal] = useState(false);

  // Timed typewriter whisper sequence
  useEffect(() => {
    const t1 = setTimeout(() => setStage("whisper2"), 2200);
    const t2 = setTimeout(() => setStage("envelope"), 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleOpenEnvelope = () => {
    if (isBreakingSeal) return;
    setIsBreakingSeal(true);
    setStage("opening");

    // Trigger background audio ambience cleanly via central controller
    try {
      playGlobalAudio(bgMusicUrl);
    } catch {}

    // Complete chapter transition after seal animation
    setTimeout(() => {
      setStage("opened");
      if (onComplete) onComplete();
    }, 1800);
  };

  return (
    <div className="relative min-h-screen bg-[#070306] text-white flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none font-sans">
      {/* Soft Ambient Golden Sunset Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating Stardust Particles */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#f43f5e_1px,transparent_1px)] [background-size:32px_32px] animate-pulse" />

      <AnimatePresence mode="wait">
        {/* STAGE 1: FIRST EMOTIONAL WHISPER */}
        {stage === "whisper1" && (
          <motion.div
            key="whisper1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-center space-y-3 max-w-lg z-10"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-rose-300/80 font-medium">
              A Private Keepsake
            </p>
            <h1 className="font-serif text-2xl sm:text-4xl text-rose-100/90 font-light italic leading-relaxed">
              "{invitationGreeting}"
            </h1>
          </motion.div>
        )}

        {/* STAGE 2: SECOND EMOTIONAL WHISPER */}
        {stage === "whisper2" && (
          <motion.div
            key="whisper2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-center space-y-3 max-w-md z-10 px-4"
          >
            <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed italic">
              {invitationSubtext}
            </p>
          </motion.div>
        )}

        {/* STAGE 3 & 4: THE HANDCRAFTED 3D WAX-SEALED ENVELOPE */}
        {(stage === "envelope" || stage === "opening") && (
          <motion.div
            key="envelope-stage"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative max-w-md w-full flex flex-col items-center z-10"
          >
            {/* Audio Recommendation Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 text-[11px] text-rose-300/90 bg-rose-950/40 border border-rose-500/20 px-3.5 py-1.5 rounded-full backdrop-blur-md shadow-lg"
            >
              <Volume2 size={13} className="animate-pulse text-rose-400" />
              <span>Turn your sound on for the full experience 🔊</span>
            </motion.div>

            {/* Realistic Parchment Envelope Box */}
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[4/3] rounded-2xl bg-gradient-to-b from-[#1a1114] via-[#140b0e] to-[#0d0608] border border-rose-500/30 p-6 shadow-2xl flex flex-col justify-between overflow-hidden group">
              {/* Subtle Paper Texture Lines */}
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

              {/* Envelope Flap Lines */}
              <svg
                className="absolute top-0 left-0 w-full h-1/2 pointer-events-none opacity-40 stroke-rose-400/30 fill-none"
                viewBox="0 0 100 50"
                preserveAspectRatio="none"
              >
                <path d="M 0,0 L 50,45 L 100,0" strokeWidth="0.5" />
              </svg>

              {/* Recipient Personal Calligraphic Address */}
              <div className="pt-2 text-center space-y-1 z-10">
                <span className="text-[10px] uppercase tracking-[0.25em] text-amber-300/80 font-semibold block">
                  Handcrafted For
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {recipientName}
                </h2>
              </div>

              {/* Center Interactive Wax Seal */}
              <div className="relative my-auto flex flex-col items-center justify-center z-20">
                <button
                  type="button"
                  onClick={handleOpenEnvelope}
                  disabled={isBreakingSeal}
                  title="Touch seal to open invitation"
                  className="relative group/seal cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95"
                >
                  {/* Outer Glowing Seal Halo */}
                  <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 opacity-40 blur-md group-hover/seal:opacity-70 animate-pulse" />

                  {/* Wax Seal Body */}
                  <div
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-rose-900 via-rose-700 to-amber-800 border-2 border-rose-300/50 shadow-2xl flex items-center justify-center text-rose-100 transition-all duration-700 ${
                      stage === "opening" ? "scale-125 opacity-0 rotate-45" : ""
                    }`}
                  >
                    <Heart
                      size={26}
                      className="fill-rose-100 text-rose-100 drop-shadow-md animate-pulse"
                    />

                    {/* Wax Seal Rim Detailing */}
                    <div className="absolute inset-1 rounded-full border border-amber-200/30 pointer-events-none" />
                  </div>
                </button>

                <p className="mt-3 text-[11px] text-rose-300/80 font-light tracking-wide flex items-center gap-1">
                  <Sparkles size={12} className="text-amber-300 animate-spin [animation-duration:4s]" />
                  <span>Tap the wax seal to open</span>
                </p>
              </div>

              {/* Envelope Footer Accent */}
              <div className="pb-1 text-center text-[10px] text-neutral-500 tracking-wider">
                LoveCrafted Keepsake · Chapter I
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
