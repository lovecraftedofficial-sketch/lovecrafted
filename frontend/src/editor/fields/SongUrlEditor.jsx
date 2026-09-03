import React, { useEffect, useRef, useState } from "react";
import { EDITOR } from "@/constants/testIds";
import { Music, Upload, X, CheckCircle2, AlertCircle } from "lucide-react";
import {
    validateSongUrl,
    createLocalAudioSource,
    revokeLocalAudioSource,
    ACCEPTED_AUDIO_EXT,
    providers,
} from "@/editor/utils/musicAdapter";

/**
 * SongUrlEditor
 * -------------
 * Value shape written to content:
 *   null                              → no song
 *   { kind: "url",   url }            → validated remote provider URL
 *   { kind: "local", url, name, mime, size }
 *                                     → temporary browser object URL for audio
 */
export default function SongUrlEditor({ field, value, onChange }) {
    const [mode, setMode] = useState(() => {
        if (!value) return "url";
        if (value.kind === "local") return "local";
        return "url";
    });
    const [urlDraft, setUrlDraft] = useState(
        value && value.kind === "url" ? value.url : "",
    );
    const inputRef = useRef(null);
    const previousLocalRef = useRef(
        value && value.kind === "local" ? value : null,
    );

    // Revoke any pending local URL on unmount
    useEffect(() => {
        return () => {
            if (previousLocalRef.current) {
                revokeLocalAudioSource(previousLocalRef.current);
            }
        };
    }, []);

    const setNext = (next) => {
        if (previousLocalRef.current && previousLocalRef.current !== next) {
            revokeLocalAudioSource(previousLocalRef.current);
        }
        previousLocalRef.current =
            next && next.kind === "local" ? next : null;
        onChange(next);
    };

    const validation = validateSongUrl(urlDraft);

    const commitUrl = () => {
        if (!urlDraft.trim()) {
            setNext(null);
            return;
        }
        if (!validation.valid) return;
        setNext({ kind: "url", url: urlDraft.trim() });
    };

    const clear = () => {
        setUrlDraft("");
        setNext(null);
    };

    const onLocalPick = (e) => {
        const file = e.target.files && e.target.files[0];
        e.target.value = "";
        if (!file) return;
        const res = createLocalAudioSource(file);
        if (!res.ok) {
            alert(res.error);
            return;
        }
        setNext(res.source);
    };

    return (
        <div data-testid={EDITOR.field.songUrl(field.key)}>
            <div className="flex gap-2 mb-3">
                <button
                    type="button"
                    onClick={() => setMode("url")}
                    className={`text-xs px-3 py-1.5 rounded-full border ${
                        mode === "url"
                            ? "border-[color:var(--lws-pink)] bg-[rgba(248,181,196,0.08)] text-[color:var(--lws-pink)]"
                            : "border-[color:var(--lws-border-strong)] text-[color:var(--lws-text-muted)]"
                    }`}
                >
                    Provider URL
                </button>
                <button
                    type="button"
                    onClick={() => setMode("local")}
                    className={`text-xs px-3 py-1.5 rounded-full border ${
                        mode === "local"
                            ? "border-[color:var(--lws-pink)] bg-[rgba(248,181,196,0.08)] text-[color:var(--lws-pink)]"
                            : "border-[color:var(--lws-border-strong)] text-[color:var(--lws-text-muted)]"
                    }`}
                >
                    Local audio (.mp3 / .m4a)
                </button>
            </div>

            {mode === "url" && (
                <div>
                    <div className="flex items-center gap-2">
                        <input
                            type="url"
                            data-testid={EDITOR.field.songUrlInput(field.key)}
                            value={urlDraft}
                            onChange={(e) => setUrlDraft(e.target.value)}
                            onBlur={commitUrl}
                            onKeyDown={(e) => e.key === "Enter" && commitUrl()}
                            placeholder="https://open.spotify.com/track/…"
                            className="flex-1 bg-[color:var(--lws-surface-2)] border border-[color:var(--lws-border-strong)] rounded-lg px-4 py-2.5 text-[color:var(--lws-cream)] focus:border-[color:var(--lws-pink)]"
                        />
                        <button
                            type="button"
                            onClick={clear}
                            data-testid={EDITOR.field.songClear(field.key)}
                            className="lws-btn-ghost text-xs"
                            aria-label="Clear"
                        >
                            <X size={14} />
                        </button>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                        {urlDraft && validation.valid && (
                            <span className="inline-flex items-center gap-1 text-[color:var(--lws-pink)]">
                                <CheckCircle2 size={12} /> Detected:{" "}
                                {validation.provider}
                            </span>
                        )}
                        {urlDraft && !validation.valid && validation.error && (
                            <span className="inline-flex items-center gap-1 text-[color:#ffb0b0]">
                                <AlertCircle size={12} /> {validation.error}
                            </span>
                        )}
                    </div>
                    <p className="text-[11px] text-[color:var(--lws-text-dim)] mt-2">
                        Supported: {providers.map((p) => p.label).join(", ")}. Arbitrary
                        iframe HTML is not accepted.
                    </p>
                </div>
            )}

            {mode === "local" && (
                <div>
                    {value && value.kind === "local" ? (
                        <div className="lws-card p-4 flex items-center gap-3">
                            <Music size={18} className="text-[color:var(--lws-pink)]" />
                            <div className="flex-1 min-w-0">
                                <div className="truncate text-sm text-[color:var(--lws-cream)]">
                                    {value.name}
                                </div>
                                <div className="text-[11px] uppercase tracking-widest text-[color:var(--lws-text-dim)]">
                                    Temporary session preview · not uploaded
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={clear}
                                data-testid={EDITOR.field.songClear(field.key)}
                                className="lws-btn-ghost text-xs"
                            >
                                <X size={14} /> Remove
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="lws-btn-ghost text-xs"
                        >
                            <Upload size={14} /> Choose .mp3 or .m4a
                        </button>
                    )}
                    <input
                        ref={inputRef}
                        data-testid={EDITOR.field.songLocalFile(field.key)}
                        type="file"
                        accept={ACCEPTED_AUDIO_EXT.join(",")}
                        onChange={onLocalPick}
                        className="hidden"
                    />
                    <p className="text-[11px] text-[color:var(--lws-text-dim)] mt-2">
                        Phase 1: local audio plays only in this browser session and is
                        never uploaded.
                    </p>
                </div>
            )}
        </div>
    );
}
