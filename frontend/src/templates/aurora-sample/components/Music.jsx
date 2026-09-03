import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, Music as MusicIcon } from "lucide-react";
import { resolveSong } from "@/editor/utils/musicAdapter";

/**
 * Music section.
 * - For remote provider URLs (Spotify / YouTube / Apple Music) we render
 *   a sandboxed iframe with a canonical embed URL. No arbitrary iframe HTML.
 * - For local audio we render a native <audio> element (user-initiated play).
 */
export default function Music({ content }) {
    const song = resolveSong(content?.songUrl);
    const [playing, setPlaying] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        // If the song source changes, stop any current playback.
        setPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, [song?.type, song?.src, song?.embedUrl]);

    if (!song) return null;

    return (
        <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
            <header className="mb-10 text-center">
                <div className="lws-pill mb-4">Our song</div>
                <h2 className="font-display text-4xl md:text-5xl">
                    <span className="lws-gradient-text">
                        Press play, close your eyes
                    </span>
                </h2>
            </header>

            {song.type === "embed" && (
                <div className="lws-card overflow-hidden">
                    <div className="aspect-video w-full">
                        <iframe
                            key={song.embedUrl}
                            src={song.embedUrl}
                            title="Song embed"
                            className="w-full h-full block"
                            loading="lazy"
                            allow="autoplay; encrypted-media; clipboard-write; fullscreen; picture-in-picture"
                            sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
                            referrerPolicy="strict-origin-when-cross-origin"
                        />
                    </div>
                    <div className="px-5 py-3 text-xs uppercase tracking-widest text-[color:var(--lws-text-dim)] border-t border-[color:var(--lws-border)]">
                        {song.provider === "spotify" && "Spotify"}
                        {song.provider === "youtube" && "YouTube"}
                        {song.provider === "apple" && "Apple Music"}
                    </div>
                </div>
            )}

            {song.type === "audio" && (
                <div className="lws-card p-6 md:p-8 flex items-center gap-5">
                    <button
                        type="button"
                        onClick={() => {
                            if (!audioRef.current) return;
                            if (playing) {
                                audioRef.current.pause();
                                setPlaying(false);
                            } else {
                                audioRef.current.play().then(
                                    () => setPlaying(true),
                                    () => setPlaying(false),
                                );
                            }
                        }}
                        className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={{
                            background:
                                "linear-gradient(120deg, #f8b5c4, #d4a574)",
                            color: "#2a0714",
                        }}
                        aria-label={playing ? "Pause" : "Play"}
                    >
                        {playing ? <Pause size={22} /> : <Play size={22} />}
                    </button>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[color:var(--lws-cream)]">
                            <MusicIcon size={14} />
                            <span className="truncate">{song.name}</span>
                        </div>
                        <div className="text-xs uppercase tracking-widest text-[color:var(--lws-text-dim)] mt-1">
                            Local audio · temporary session preview
                        </div>
                    </div>
                    <audio
                        ref={audioRef}
                        src={song.src}
                        preload="metadata"
                        onEnded={() => setPlaying(false)}
                        onPause={() => setPlaying(false)}
                    />
                </div>
            )}
        </section>
    );
}
