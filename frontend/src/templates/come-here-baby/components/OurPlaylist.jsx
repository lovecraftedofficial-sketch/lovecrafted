import React, { useState, useRef, useMemo } from "react";
import { Play, Pause, Music, AlertCircle } from "lucide-react";

/**
 * OurPlaylist.jsx - Songs For My Baby
 * -----------------------------------
 * Robust multi-provider music player system.
 * Prevents HTMLAudioElement crash by detecting Spotify/YouTube/Apple vs direct MP3.
 */
export default function OurPlaylist({ content = {} }) {
  const songsTitle = content.songsTitle || "Songs For My Baby";
  const songsSubtitle = content.songsSubtitle || "Close your eyes for a minute. Let me keep you company.";

  const featuredSongTitle = content.featuredSongTitle || "Tera Chehra";
  const featuredSongArtist = content.featuredSongArtist || "Himesh Reshammiya, Arijit Singh";
  const featuredSongUrl = content.featuredSongUrl || "https://open.spotify.com/track/0fU73va0bnroitbOzudBU4";
  const featuredSongCover = content.featuredSongCover || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80";

  // Provider resolution logic
  const provider = useMemo(() => {
    const rawType = (content.musicProvider || "").toLowerCase();
    const url = String(featuredSongUrl || "").trim();

    if (rawType === "spotify" || url.includes("spotify.com")) return "spotify";
    if (rawType === "youtube" || url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
    if (rawType === "apple" || url.includes("music.apple.com")) return "apple";
    if (url.endsWith(".mp3") || url.endsWith(".m4a") || url.endsWith(".wav") || url.endsWith(".ogg") || url.includes("cdn.pixabay.com") || rawType === "direct") {
      return "direct";
    }
    return "spotify"; // default fallback for spotify track URLs
  }, [content.musicProvider, featuredSongUrl]);

  // Clean Spotify Embed URL Helper (Conforms to official Spotify Developer Embed spec)
  const spotifyEmbedUrl = useMemo(() => {
    if (!featuredSongUrl) return "";
    let clean = String(featuredSongUrl).split("?")[0]; // Strip tracking query params
    let embedPath = clean;
    if (clean.includes("spotify.com/track/")) {
      embedPath = clean.replace("spotify.com/track/", "spotify.com/embed/track/");
    } else if (clean.includes("spotify.com/album/")) {
      embedPath = clean.replace("spotify.com/album/", "spotify.com/embed/album/");
    }
    return embedPath.includes("?") ? embedPath : `${embedPath}?utm_source=generator`;
  }, [featuredSongUrl]);

  // Direct Audio HTML5 State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => console.error("Audio playback error:", err));
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
    <section id="songs" className="relative min-h-screen bg-[#1c080e] text-[#f8b3c3] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-4xl w-full text-center space-y-8 z-10 py-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3d0a18] border border-[#f8b3c3]/20 text-xs tracking-widest text-[#f8b3c3]">
            <Music size={13} className="text-[#f8b3c3]" />
            <span>Soothing Melodies</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium">
            {songsTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#f8b3c3]/70 max-w-lg mx-auto font-light">
            {songsSubtitle}
          </p>
        </div>

        {/* Music Player Container */}
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-[2.5rem] bg-[#2a0c15] border border-[#f8b3c3]/20 shadow-2xl space-y-6">
          {provider === "spotify" && (
            <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black/40">
              <iframe
                title="Spotify Comfort Track"
                src={spotifyEmbedUrl}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          )}

          {provider === "direct" && (
            <div className="space-y-6">
              {/* Native HTMLAudioElement used ONLY for direct audio streams */}
              <audio
                ref={audioRef}
                src={featuredSongUrl}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
              />

              <div className="flex flex-col sm:flex-row items-center gap-6 text-left">
                {featuredSongCover && (
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border border-[#f8b3c3]/20 shrink-0 shadow-lg relative">
                    <img
                      src={featuredSongCover}
                      alt={featuredSongTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-3 w-full">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif text-white font-medium">
                      {featuredSongTitle}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#f8b3c3]/70 font-light">
                      {featuredSongArtist}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-4">
                    <button
                      onClick={togglePlay}
                      className="w-12 h-12 rounded-full bg-[#3d0a18] hover:bg-[#4d0d20] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                    </button>
                    <span className="text-xs text-[#f8b3c3]/60 font-mono">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="h-1.5 w-full bg-[#1c080e] rounded-full overflow-hidden border border-[#f8b3c3]/10">
                <div
                  className="h-full bg-[#f8b3c3]"
                  style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                />
              </div>
            </div>
          )}

          {!featuredSongUrl && (
            <div className="p-6 rounded-2xl bg-[#1c080e] border border-[#f8b3c3]/20 text-center space-y-2">
              <AlertCircle size={24} className="text-[#f8b3c3] mx-auto opacity-60" />
              <p className="text-xs font-serif italic text-[#f8b3c3]/70">
                No music URL configured yet. Add a Spotify track or MP3 link in Creator Studio settings.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
