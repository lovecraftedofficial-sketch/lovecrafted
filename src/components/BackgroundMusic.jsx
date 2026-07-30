import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Disc } from "lucide-react";

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Soft, continuous romantic lo-fi / piano instrumental
  const audioSrc = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3";

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.15; // Extremely soft background ambience (15%)
    }

    const handleFirstClick = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
      window.removeEventListener("click", handleFirstClick);
    };

    window.addEventListener("click", handleFirstClick);
    return () => window.removeEventListener("click", handleFirstClick);
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      <audio ref={audioRef} src={audioSrc} loop />
      <button
        onClick={toggleMusic}
        title={isPlaying ? "Mute Background Music" : "Play Background Music"}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 border border-white/10 text-neutral-400 hover:text-white hover:border-white/20 backdrop-blur-md transition-all duration-300 text-[11px] tracking-wide font-sans shadow-none hover:shadow-lg cursor-pointer group"
      >
        <Disc className={`w-3.5 h-3.5 text-neutral-400 group-hover:text-rose-300 transition-colors ${isPlaying ? 'animate-spin [animation-duration:4s]' : ''}`} />
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