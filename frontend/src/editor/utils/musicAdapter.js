/**
 * Music adapter — modular architecture for supported song providers.
 *
 * Supported (Phase 1, safe):
 *   - Spotify (track/album/playlist share URLs) → embedded iframe via canonical embed URL
 *   - YouTube (watch / youtu.be) → embedded iframe via canonical /embed/ URL
 *   - Apple Music (music.apple.com song/album URLs) → embed.music.apple.com iframe
 *   - Local audio (mp3, m4a) → temporary browser object URL (session only)
 *
 * Security notes:
 *   - We NEVER accept arbitrary iframe HTML from the customer.
 *   - We only construct embed URLs from parsed provider IDs.
 *   - We render iframes with sandbox + explicit allowed features.
 *   - Local audio is not uploaded; object URLs are created client-side only
 *     and must be revoked via revokeMusicSource() when replaced or unmounted.
 *
 * Adding a new provider later:
 *   1. Add a new entry to `providers` with { id, label, match(url), buildEmbed(url) }.
 *   2. Everything else (editor validation, renderer) will pick it up automatically.
 */

const trim = (u) => (u || "").trim();

/* --- Spotify --------------------------------------------------------- */
const spotifyMatch = (url) => {
    const u = trim(url);
    if (!u) return null;
    // https://open.spotify.com/track/xxxxx  |  /album/  |  /playlist/  |  /episode/
    const m = u.match(
        /^https?:\/\/open\.spotify\.com\/(intl-[a-z]{2}\/)?(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)(\?.*)?$/i,
    );
    if (!m) return null;
    return { kind: m[2], id: m[3] };
};
const spotifyEmbed = (url) => {
    const p = spotifyMatch(url);
    if (!p) return null;
    return `https://open.spotify.com/embed/${p.kind}/${p.id}?utm_source=lws`;
};

/* --- YouTube --------------------------------------------------------- */
const youtubeMatch = (url) => {
    const u = trim(url);
    if (!u) return null;
    // youtu.be/<id>  |  youtube.com/watch?v=<id>  |  youtube.com/embed/<id>
    let id = null;
    let m = u.match(/^https?:\/\/youtu\.be\/([A-Za-z0-9_-]{6,})/i);
    if (m) id = m[1];
    if (!id) {
        m = u.match(
            /^https?:\/\/(www\.)?youtube\.com\/watch\?(.*&)?v=([A-Za-z0-9_-]{6,})/i,
        );
        if (m) id = m[3];
    }
    if (!id) {
        m = u.match(/^https?:\/\/(www\.)?youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/i);
        if (m) id = m[2];
    }
    return id ? { id } : null;
};
const youtubeEmbed = (url) => {
    const p = youtubeMatch(url);
    if (!p) return null;
    return `https://www.youtube.com/embed/${p.id}?rel=0&modestbranding=1`;
};

/* --- Apple Music ----------------------------------------------------- */
const appleMatch = (url) => {
    const u = trim(url);
    if (!u) return null;
    // https://music.apple.com/<country>/album/<slug>/<id>?i=<songId>
    // https://music.apple.com/<country>/song/<slug>/<id>
    // https://music.apple.com/<country>/playlist/<slug>/<id>
    const m = u.match(
        /^https?:\/\/music\.apple\.com\/([a-z]{2})\/(album|song|playlist)\/[^/]+\/([0-9a-zA-Z.-]+)(\?.*)?$/i,
    );
    if (!m) return null;
    return { country: m[1], kind: m[2], id: m[3], query: m[4] || "" };
};
const appleEmbed = (url) => {
    const p = appleMatch(url);
    if (!p) return null;
    return `https://embed.music.apple.com/${p.country}/${p.kind}/${p.id}${p.query}`;
};

/* --- Provider registry ---------------------------------------------- */
export const providers = [
    {
        id: "spotify",
        label: "Spotify",
        match: spotifyMatch,
        buildEmbed: spotifyEmbed,
        example: "https://open.spotify.com/track/…",
    },
    {
        id: "youtube",
        label: "YouTube",
        match: youtubeMatch,
        buildEmbed: youtubeEmbed,
        example: "https://youtu.be/… or youtube.com/watch?v=…",
    },
    {
        id: "apple",
        label: "Apple Music",
        match: appleMatch,
        buildEmbed: appleEmbed,
        example: "https://music.apple.com/…/album/…",
    },
];

/** Identify which provider a URL belongs to. */
export function detectProvider(url) {
    for (const p of providers) {
        if (p.match(url)) return p.id;
    }
    return null;
}

/** Validate a song URL. Returns { valid, provider, error }. */
export function validateSongUrl(url) {
    const u = trim(url);
    if (!u) return { valid: false, provider: null, error: null };
    try {
        void new URL(u);
    } catch {
        return { valid: false, provider: null, error: "Enter a valid URL." };
    }
    const provider = detectProvider(u);
    if (!provider) {
        return {
            valid: false,
            provider: null,
            error: "Only Spotify, YouTube, and Apple Music links are supported.",
        };
    }
    return { valid: true, provider, error: null };
}

/**
 * Build a safe embed URL from a supported provider URL.
 * Returns { provider, embedUrl } or null.
 */
export function buildEmbed(url) {
    for (const p of providers) {
        const embed = p.buildEmbed(url);
        if (embed) return { provider: p.id, embedUrl: embed };
    }
    return null;
}

/* --- Local audio ---------------------------------------------------- */

export const ACCEPTED_AUDIO_MIME = [
    "audio/mpeg",
    "audio/mp3",
    "audio/mp4",
    "audio/x-m4a",
    "audio/m4a",
];
export const ACCEPTED_AUDIO_EXT = [".mp3", ".m4a"];
export const MAX_AUDIO_BYTES = 12 * 1024 * 1024; // 12MB soft cap for Phase 1

export function isAcceptedAudioFile(file) {
    if (!file) return false;
    const nameOk = ACCEPTED_AUDIO_EXT.some((ext) =>
        (file.name || "").toLowerCase().endsWith(ext),
    );
    const mimeOk = ACCEPTED_AUDIO_MIME.includes(file.type || "");
    return nameOk || mimeOk;
}

/**
 * Create a temporary browser-only object URL for a local audio file.
 * This URL lives only within the current page session and is NOT uploaded.
 * Callers MUST call URL.revokeObjectURL(previousUrl) when replacing/unmounting.
 */
export function createLocalAudioSource(file) {
    if (!isAcceptedAudioFile(file)) {
        return { ok: false, error: "Only .mp3 or .m4a files are supported." };
    }
    if (file.size > MAX_AUDIO_BYTES) {
        return { ok: false, error: "Audio file exceeds the 12 MB Phase 1 limit." };
    }
    const url = URL.createObjectURL(file);
    return {
        ok: true,
        source: {
            kind: "local",
            url,
            name: file.name,
            mime: file.type || "audio/mpeg",
            size: file.size,
        },
    };
}

export function revokeLocalAudioSource(source) {
    if (source && source.kind === "local" && source.url) {
        try {
            URL.revokeObjectURL(source.url);
        } catch {
            /* ignore */
        }
    }
}

/**
 * Normalize a "song value" (as stored in customer content) into a renderable
 * descriptor. A song value can be:
 *   - "" or null                    → no song
 *   - { kind: "url", url }          → remote provider URL
 *   - { kind: "local", url, name }  → local temporary audio (session only)
 */
export function resolveSong(value) {
    if (!value) return null;
    if (typeof value === "string") {
        // Legacy: treat plain string as remote URL.
        const embed = buildEmbed(value);
        if (embed) return { type: "embed", ...embed, originalUrl: value };
        return null;
    }
    if (value.kind === "url" && value.url) {
        const embed = buildEmbed(value.url);
        if (embed) return { type: "embed", ...embed, originalUrl: value.url };
        return null;
    }
    if (value.kind === "local" && value.url) {
        return {
            type: "audio",
            src: value.url,
            name: value.name || "audio",
            mime: value.mime || "audio/mpeg",
        };
    }
    return null;
}
