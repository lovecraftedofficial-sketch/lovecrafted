import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { pauseGlobalAudio } from "@/components/BackgroundMusic";

/**
 * Chapter 12: The Final Chapter (Closure & Fade to Black)
 * --------------------------------------------------------
 * Emotion: Closure & Quiet Intimacy.
 * Zero UI elements, zero buttons, zero CTAs. Music fades to pure silence.
 * Single handwritten closure message that softly fades to black.
 */
export default function Chapter12FinalClosure({ content = {} }) {
  const recipientName = content.recipientName || "Ananya";
  const [fadeToBlack, setFadeToBlack] = useState(false);

  useEffect(() => {
    // Fade background music into pure silence
    try {
      pauseGlobalAudio();
    } catch {}

    // After 7 seconds, softly fade scene to pure black
    const timer = setTimeout(() => {
      setFadeToBlack(true);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#000000] text-rose-100 flex flex-col items-center justify-center p-6 select-none font-serif overflow-x-clip">
      {/* SOFT FADE TO BLACK OVERLAY */}
      <motion.div
        animate={{ opacity: fadeToBlack ? 1 : 0 }}
        transition={{ duration: 4, ease: "easeInOut" }}
        className="absolute inset-0 bg-[#000000] z-50 pointer-events-none"
      />

      {/* FINAL HANDWRITTEN CLOSURE MESSAGE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2.5, ease: "easeOut" }}
        className="relative max-w-lg w-full text-center space-y-6 z-10"
      >
        <span className="text-[10px] tracking-[0.4em] text-neutral-500 font-mono uppercase block">
          Until Forever
        </span>

        <h2 className="text-2xl sm:text-3xl font-normal text-rose-100 italic">
          "{recipientName}"
        </h2>

        <div className="space-y-4 pt-4">
          <p className="font-serif text-lg sm:text-xl text-rose-100/90 italic leading-relaxed">
            Thank you for sharing your time, your heart, and your life with me.
          </p>
          <p className="font-serif text-lg sm:text-xl text-rose-100/90 italic leading-relaxed">
            Wherever tomorrow leads us, I am yours.
          </p>
          <p className="font-serif text-xl sm:text-2xl text-amber-200 italic font-normal pt-4">
            Until forever. ❤️
          </p>
        </div>
      </motion.div>
    </div>
  );
}
