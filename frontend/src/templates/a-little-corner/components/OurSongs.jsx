import React, { useState, useRef } from "react";
import { Play, Pause, Music, Volume2, ExternalLink } from "lucide-react";

export default function OurSongs({ content = {} }) {
  const songsSectionTitle = content.songsSectionTitle || "Our Sanctuary Songs";
  const songsSectionSubtitle = content.songsSectionSubtitle || "Press play whenever you want to feel like we're sharing earphones.";

  const featuredSongTitle = content.featuredSongTitle || "Golden Hour Romance";
  const featuredSongArtist = content.featuredSongArtist || "Our Acoustic Playlist";
  const featuredSongUrl = content.featuredSongUrl || "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3";
  const featuredSongCover = content.featuredSongCover || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80";

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const audioRef = useRef(null);

  const isSpotify = typeof featuredSongUrl === 'string' && featuredSongUrl.includes("spotify.com");

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <section id="songs" className="relative min-h-screen bg-[#16080c] text-[#f7c5d1] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-4xl w-full text-center space-y-8 z-10 py-12">
        {/* Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2a0913] border border-[#f7c5d1]/20 text-xs tracking-widest text-[#f7c5d1]/80 uppercase">
            <Music size={13} className="text-[#f7c5d1]" />
            <span>Comfort Melodies</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium">
            {songsSectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#f7c5d1]/70 max-w-lg mx-auto font-light">
            {songsSectionSubtitle}
          </p>
        </div>

        {/* Featured Music Card */}
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-[2.5rem] bg-[#2a0913] border border-[#f7c5d1]/20 shadow-2xl space-y-6">
          {isSpotify ? (
            /* Spotify Embed Player */
            <div className="w-full rounded-2xl overflow-hidden shadow-lg border border-white/10">
              <iframe
                title="Spotify Sanctuary Track"
                src={featuredSongUrl.replace("spotify.com/track/", "spotify.com/embed/track/")}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          ) : (
            /* Built-in Custom Audio Player */
            <div className="space-y-6">
              <audio
                ref={audioRef}
                src={featuredSongUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
              />

              <div className="flex flex-col sm:flex-row items-center gap-6 text-left">
                {/* Album Cover */}
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border border-[#f7c5d1]/20 shrink-0 shadow-lg relative">
                  <img
                    src={featuredSongCover}
                    alt={featuredSongTitle}
                    className="w-full h-full object-cover"
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    </div>
                  )}
                </div>

                {/* Song Details & Controls */}
                <div className="space-y-3 w-full">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif text-white font-medium">
                      {featuredSongTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#f7c5d1]/70 font-light">
                      {featuredSongArtist}
                    </p>
                  </div>

                  {/* Play/Pause Button */}
                  <div className="pt-2 flex items-center gap-4">
                    <button
                      onClick={togglePlay}
                      className="w-12 h-12 rounded-full bg-[#4a0e20] hover:bg-[#5a1228] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                    </button>
                    <span className="text-xs text-[#f7c5d1]/60 font-mono">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-[#16080c] rounded-full overflow-hidden border border-[#f7c5d1]/10">
                  <div
                    className="h-full bg-[#f7c5d1]"
                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
