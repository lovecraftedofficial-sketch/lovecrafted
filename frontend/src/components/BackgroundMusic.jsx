import React, { useState, useRef, useEffect } from "react";
import { VolumeX, Disc } from "lucide-react";

const DEFAULT_AUDIO_SRC = "/audio/romantic.mp3";

/**
 * Helper function to trigger background music from anywhere in the app
 */
export function playGlobalAudio(customSrc) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("lws:play_music", { detail: { src: customSrc } }));
}

export function pauseGlobalAudio() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("lws:pause_music"));
}

export function duckGlobalAudio() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("lws:duck_music"));
}

export function restoreGlobalAudio() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("lws:restore_music"));
}

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.15; // Soft background ambience (15%)

    audio.onplay = () => {
      setIsPlaying(true);
    };

    audio.onpause = () => {
      setIsPlaying(false);
    };

    audio.onerror = (err) => {
      console.warn("[BackgroundMusic] Media loading error:", err);
      setIsPlaying(false);
    };

    const safePlay = async () => {
      if (!audioRef.current) return;
      try {
        await audioRef.current.play();
      } catch (err) {
        console.warn("[BackgroundMusic] audio.play() rejected:", err);
        setIsPlaying(false);
      }
    };

    const handleFirstClick = () => {
      if (audioRef.current && audioRef.current.paused) {
        safePlay();
      }
      window.removeEventListener("click", handleFirstClick);
      window.removeEventListener("touchstart", handleFirstClick);
    };

    window.addEventListener("click", handleFirstClick);
    window.addEventListener("touchstart", handleFirstClick, { passive: true });

    const handleCustomPlay = async (e) => {
      if (!audioRef.current) return;
      const customSrc = e.detail?.src || DEFAULT_AUDIO_SRC;

      if (customSrc && typeof window !== "undefined") {
        try {
          const resolvedCustomUrl = new URL(customSrc, window.location.href).href;
          if (audioRef.current.src !== resolvedCustomUrl) {
            audioRef.current.src = resolvedCustomUrl;
            audioRef.current.load();
          }
        } catch (err) {
          console.warn("[BackgroundMusic] URL resolution error:", err);
          if (audioRef.current.src !== customSrc) {
            audioRef.current.src = customSrc;
            audioRef.current.load();
          }
        }
      }

      await safePlay();
    };

    const handleCustomPause = () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };

    // Smooth Volume Ducking for Chapter 6 / Voice Notes
    const handleCustomDuck = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.02;
      }
    };

    const handleCustomRestore = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.15;
      }
    };

    window.addEventListener("lws:play_music", handleCustomPlay);
    window.addEventListener("lws:pause_music", handleCustomPause);
    window.addEventListener("lws:duck_music", handleCustomDuck);
    window.addEventListener("lws:restore_music", handleCustomRestore);

    return () => {
      if (audio) {
        audio.onplay = null;
        audio.onpause = null;
        audio.onerror = null;
      }
      window.removeEventListener("click", handleFirstClick);
      window.removeEventListener("touchstart", handleFirstClick);
      window.removeEventListener("lws:play_music", handleCustomPlay);
      window.removeEventListener("lws:pause_music", handleCustomPause);
      window.removeEventListener("lws:duck_music", handleCustomDuck);
      window.removeEventListener("lws:restore_music", handleCustomRestore);
    };
  }, []);

  const toggleMusic = async (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
    } else {
      try {
        await audio.play();
      } catch (err) {
        console.warn("[BackgroundMusic] toggleMusic play() failed:", err);
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <audio ref={audioRef} src={DEFAULT_AUDIO_SRC} loop preload="auto" />
      <button
        type="button"
        onClick={toggleMusic}
        title={isPlaying ? "Mute Background Ambience" : "Play Background Ambience"}
        className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full transition-all duration-200 ease-out hover:scale-105 active:scale-95 cursor-pointer group text-[11px] font-sans tracking-wide ${
          isPlaying
            ? "bg-black/60 border border-rose-500/30 hover:border-rose-400/60 text-white shadow-xl shadow-rose-950/30 backdrop-blur-xl"
            : "bg-black/40 border border-white/10 hover:border-white/20 text-neutral-400 hover:text-neutral-200 shadow-md backdrop-blur-lg"
        }`}
      >
        <Disc
          className={`w-3.5 h-3.5 transition-colors ${
            isPlaying
              ? "text-rose-400 group-hover:text-rose-300 animate-spin [animation-duration:5s]"
              : "text-neutral-500 group-hover:text-neutral-400"
          }`}
        />

        <span className="font-light opacity-90 group-hover:opacity-100 select-none">
          {isPlaying ? "Background Ambience" : "Muted"}
        </span>

        {isPlaying ? (
          <div className="flex items-end gap-0.5 h-3 shrink-0 px-0.5" aria-hidden="true">
            <span className="w-0.5 h-2.5 bg-rose-400 rounded-full animate-bounce [animation-duration:0.8s]" />
            <span className="w-0.5 h-3.5 bg-pink-300 rounded-full animate-bounce [animation-duration:1.1s] [animation-delay:0.2s]" />
            <span className="w-0.5 h-2 bg-rose-400 rounded-full animate-bounce [animation-duration:0.9s] [animation-delay:0.4s]" />
          </div>
        ) : (
          <VolumeX className="w-3 h-3 text-neutral-500 group-hover:text-neutral-400 shrink-0" />
        )}
      </button>
    </div>
  );
}