import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Disc } from "lucide-react";

const DEFAULT_AUDIO_SRC = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3";

/**
 * Helper function to trigger background music from anywhere in the app
 * (e.g. UnboxingIntro, Template detail page, etc.)
 */
export function playGlobalAudio(customSrc) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("lws:play_music", { detail: { src: customSrc } }));
}

export function pauseGlobalAudio() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("lws:pause_music"));
}

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.15; // Soft background ambience (15%)
    }

    // Auto-play on first click interaction if not already playing
    const handleFirstClick = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
      window.removeEventListener("click", handleFirstClick);
    };

    window.addEventListener("click", handleFirstClick);

    // Custom event handlers for UnboxingIntro / template triggers
    const handleCustomPlay = (e) => {
      if (!audioRef.current) return;
      const customSrc = e.detail?.src;
      if (customSrc && audioRef.current.src !== customSrc) {
        audioRef.current.src = customSrc;
      }
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    };

    const handleCustomPause = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    window.addEventListener("lws:play_music", handleCustomPlay);
    window.addEventListener("lws:pause_music", handleCustomPause);

    return () => {
      window.removeEventListener("click", handleFirstClick);
      window.removeEventListener("lws:play_music", handleCustomPlay);
      window.removeEventListener("lws:pause_music", handleCustomPause);
    };
  }, []);

  const toggleMusic = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <audio ref={audioRef} src={DEFAULT_AUDIO_SRC} loop preload="auto" />
      <button
        type="button"
        onClick={toggleMusic}
        title={isPlaying ? "Mute Background Music" : "Play Background Music"}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 backdrop-blur-md transition-all duration-300 text-[11px] tracking-wide font-sans shadow-lg cursor-pointer group"
      >
        <Disc
          className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-rose-300 transition-colors ${
            isPlaying ? "animate-spin [animation-duration:4s]" : ""
          }`}
        />
        <span className="font-light opacity-80 group-hover:opacity-100">
          {isPlaying ? "Sound On" : "Sound Off"}
        </span>
        {isPlaying ? (
          <Volume2 className="w-3 h-3 text-rose-300/80" />
        ) : (
          <VolumeX className="w-3 h-3 text-neutral-500" />
        )}
      </button>
    </div>
  );
}