import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { VolumeX, Disc } from "lucide-react";

export default function BackgroundMusic() {
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Soft, romantic ambient instrumental
  const audioSrc = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3";

  // Exclude editor and published keepsake pages where template's own Vinyl player is active
  const isExcluded = location.pathname.startsWith("/editor") || location.pathname.startsWith("/v/");

  useEffect(() => {
    if (isExcluded && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isExcluded]);

  useEffect(() => {
    if (isExcluded) return;
    if (audioRef.current) {
      audioRef.current.volume = 0.15; // 15% ultra-soft background ambience
    }

    const handleFirstClick = () => {
      if (audioRef.current && !audioRef.current.paused) return;
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
      window.removeEventListener("click", handleFirstClick);
    };

    window.addEventListener("click", handleFirstClick);
    return () => window.removeEventListener("click", handleFirstClick);
  }, [isExcluded]);

  const toggleMusic = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (isExcluded) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <audio ref={audioRef} src={audioSrc} loop />
      
      <button
        type="button"
        onClick={toggleMusic}
        title={isPlaying ? "Mute Background Music" : "Play Background Music"}
        className={`group flex items-center gap-2.5 px-3.5 py-1.5 rounded-full backdrop-blur-md transition-all duration-300 cursor-pointer ${
          isPlaying
            ? "border border-rose-500/25 bg-[#0f070b]/85 text-rose-100/90 hover:border-rose-400/40"
            : "border border-white/10 bg-[#0a0507]/80 text-neutral-400 hover:border-white/20 hover:text-neutral-200"
        }`}
      >
        {/* Left Sleek Spinning Disc */}
        <Disc
          className={`size-3.5 transition-colors ${
            isPlaying
              ? "text-rose-300/90 animate-spin [animation-duration:6s]"
              : "text-neutral-500 group-hover:text-neutral-300"
          }`}
        />

        {/* Text Label */}
        <span className="text-[11px] font-sans font-light tracking-wide">
          {isPlaying ? "Background Music" : "Sound Off"}
        </span>

        {/* Right Minimalist Equalizer Bars when playing, or Muted icon when off */}
        {isPlaying ? (
          <div className="flex items-end gap-[2px] h-3 px-0.5">
            <span className="w-[1.5px] rounded-full bg-rose-300/80 animate-pulse [animation-duration:0.7s] h-2.5" />
            <span className="w-[1.5px] rounded-full bg-rose-300/90 animate-pulse [animation-duration:0.4s] h-3" />
            <span className="w-[1.5px] rounded-full bg-rose-300/70 animate-pulse [animation-duration:0.8s] h-2" />
          </div>
        ) : (
          <VolumeX className="size-3 text-neutral-500 group-hover:text-neutral-400" />
        )}
      </button>
    </div>
  );
}