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
  const [audioSrc, setAudioSrc] = useState(DEFAULT_AUDIO_SRC);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.15; // 15% soft background ambience

    // 1. Direct Sync: HTMLAudioElement event listeners to keep React state 100% synchronized
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => setIsPlaying(false);

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);

    // Initial sync check
    setIsPlaying(!audio.paused);

    // 2. Single User Interaction Listener for cross-device & mobile autoplay compliance
    const handleFirstUserInteraction = () => {
      if (audio.paused) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            /* Autoplay blocked until explicit tap */
          });
      }
      cleanupInteractionListeners();
    };

    const cleanupInteractionListeners = () => {
      window.removeEventListener("click", handleFirstUserInteraction);
      window.removeEventListener("touchstart", handleFirstUserInteraction);
      window.removeEventListener("touchend", handleFirstUserInteraction);
      window.removeEventListener("pointerdown", handleFirstUserInteraction);
    };

    window.addEventListener("click", handleFirstUserInteraction);
    window.addEventListener("touchstart", handleFirstUserInteraction, { passive: true });
    window.addEventListener("touchend", handleFirstUserInteraction, { passive: true });
    window.addEventListener("pointerdown", handleFirstUserInteraction, { passive: true });

    // 3. Custom Event Listeners for global cross-component control (e.g., UnboxingIntro)
    const handleCustomPlay = (e) => {
      const newSrc = e.detail?.src || DEFAULT_AUDIO_SRC;
      if (newSrc && newSrc !== audio.src) {
        audio.src = newSrc;
        setAudioSrc(newSrc);
      }
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
      cleanupInteractionListeners();
    };

    const handleCustomPause = () => {
      audio.pause();
      setIsPlaying(false);
    };

    const handleCustomToggle = () => {
      if (audio.paused) {
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    };

    window.addEventListener("lws:play_music", handleCustomPlay);
    window.addEventListener("lws:pause_music", handleCustomPause);
    window.addEventListener("lws:toggle_music", handleCustomToggle);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
      cleanupInteractionListeners();
      window.removeEventListener("lws:play_music", handleCustomPlay);
      window.removeEventListener("lws:pause_music", handleCustomPause);
      window.removeEventListener("lws:toggle_music", handleCustomToggle);
    };
  }, []);

  const toggleMusic = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Audio playback failed:", err);
          setIsPlaying(false);
        });
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <audio ref={audioRef} src={audioSrc} loop preload="auto" />
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