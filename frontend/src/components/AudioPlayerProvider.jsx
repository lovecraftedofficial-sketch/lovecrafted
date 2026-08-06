import React from "react";
import { Disc, ExternalLink, AlertCircle, Music } from "lucide-react";

/**
 * Music Provider Detection Helper
 */
export function detectAudioProvider(url) {
  if (!url || typeof url !== "string") return { type: "mp3", embedUrl: null };
  const str = url.trim();

  // Spotify Detection
  if (str.includes("spotify.com") || str.startsWith("spotify:")) {
    let trackId = "";
    if (str.includes("/track/")) {
      trackId = str.split("/track/")[1]?.split("?")[0];
    } else if (str.includes("/album/")) {
      trackId = "album/" + str.split("/album/")[1]?.split("?")[0];
    } else if (str.includes("/playlist/")) {
      trackId = "playlist/" + str.split("/playlist/")[1]?.split("?")[0];
    } else if (str.startsWith("spotify:track:")) {
      trackId = str.replace("spotify:track:", "");
    }
    const embedUrl = trackId
      ? `https://open.spotify.com/embed/${trackId.includes("/") ? trackId : "track/" + trackId}?utm_source=generator&theme=0`
      : null;
    return { type: "spotify", embedUrl, rawUrl: str };
  }

  // YouTube Detection
  if (str.includes("youtube.com") || str.includes("youtu.be")) {
    let videoId = "";
    if (str.includes("youtu.be/")) {
      videoId = str.split("youtu.be/")[1]?.split("?")[0];
    } else if (str.includes("watch?v=")) {
      videoId = str.split("watch?v=")[1]?.split("&")[0];
    } else if (str.includes("/embed/")) {
      videoId = str.split("/embed/")[1]?.split("?")[0];
    }
    const embedUrl = videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&enablejsapi=1` : null;
    return { type: "youtube", embedUrl, rawUrl: str };
  }

  // Apple Music Detection
  if (str.includes("music.apple.com")) {
    const embedUrl = str.replace("music.apple.com", "embed.music.apple.com");
    return { type: "applemusic", embedUrl, rawUrl: str };
  }

  // Direct MP3 or Audio URL
  return { type: "mp3", embedUrl: str, rawUrl: str };
}

/**
 * Universal Audio Player Component
 * Renders appropriate player (Spotify Embed, YouTube Embed, Native MP3, or Fallback)
 */
export default function AudioPlayerProvider({ url, title = "Our Special Song", onPlay, onPause }) {
  const provider = detectAudioProvider(url);

  if (provider.type === "spotify" && provider.embedUrl) {
    return (
      <div className="w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl border border-rose-500/20 bg-black/60 p-2">
        <iframe
          src={provider.embedUrl}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={`Spotify - ${title}`}
          className="rounded-xl"
        />
      </div>
    );
  }

  if (provider.type === "youtube" && provider.embedUrl) {
    return (
      <div className="w-full max-w-md mx-auto aspect-video rounded-2xl overflow-hidden shadow-2xl border border-rose-500/20 bg-black">
        <iframe
          src={provider.embedUrl}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={`YouTube - ${title}`}
          className="w-full h-full"
        />
      </div>
    );
  }

  if (provider.type === "applemusic" && provider.embedUrl) {
    return (
      <div className="w-full max-w-md mx-auto rounded-2xl overflow-hidden shadow-2xl border border-rose-500/20 bg-black/60 p-2">
        <iframe
          src={provider.embedUrl}
          width="100%"
          height="175"
          frameBorder="0"
          allow="autoplay *; encrypted-media *; fullscreen *"
          title={`Apple Music - ${title}`}
          className="rounded-xl"
        />
      </div>
    );
  }

  if (provider.type === "mp3" && provider.embedUrl) {
    return (
      <div className="w-full max-w-md mx-auto p-4 rounded-2xl bg-black/60 border border-rose-500/20 shadow-2xl flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 text-rose-300 text-xs font-serif italic">
          <Music size={14} className="text-amber-400" />
          <span>{title}</span>
        </div>
        <audio
          controls
          src={provider.embedUrl}
          onPlay={onPlay}
          onPause={onPause}
          className="w-full accent-rose-500 rounded-lg"
        >
          Your browser does not support audio playback.
        </audio>
      </div>
    );
  }

  // Fallback for unrecognized stream link (User-friendly non-broken card)
  return (
    <div className="w-full max-w-md mx-auto p-5 rounded-2xl bg-black/70 border border-amber-500/30 text-center space-y-3 shadow-2xl">
      <div className="flex items-center justify-center gap-2 text-amber-300 text-xs font-semibold">
        <AlertCircle size={16} />
        <span>External Music Stream</span>
      </div>
      <p className="text-xs text-neutral-300 italic">"{title}"</p>
      <a
        href={provider.rawUrl || url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs hover:bg-rose-500/30 transition-colors"
      >
        <span>Open Track in Music App</span>
        <ExternalLink size={12} />
      </a>
    </div>
  );
}
