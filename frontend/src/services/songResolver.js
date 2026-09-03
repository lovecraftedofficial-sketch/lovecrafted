/**
 * songResolver.js
 * ---------------
 * Automatically resolves and extracts song details (Title, Artist, HD Cover Artwork, Playable Audio)
 * from any song link or name provided by the user:
 * - Spotify Track Links (via Spotify oEmbed + iTunes metadata)
 * - JioSaavn Song / Album Links (via slug parsing + iTunes metadata)
 * - YouTube / YouTube Music Links
 * - Direct MP3 / M4A Audio Links
 * - Song Name / Search Terms
 */

export async function resolveSongDetails(input) {
  if (!input || typeof input !== "string" || !input.trim()) return null;
  const raw = input.trim();

  let searchKeyword = "";
  let coverUrl = null;
  let spotifyUrl = null;

  // 1. Spotify Link
  if (raw.includes("spotify.com") || raw.includes("spotify.link")) {
    spotifyUrl = raw;
    try {
      const oembedRes = await fetch(
        `https://open.spotify.com/oembed?url=${encodeURIComponent(raw)}`
      );
      if (oembedRes.ok) {
        const odata = await oembedRes.json();
        if (odata.title) searchKeyword = odata.title;
        if (odata.thumbnail_url) coverUrl = odata.thumbnail_url;
      }
    } catch (e) {
      console.warn("Spotify oEmbed error:", e);
    }
  }

  // 2. JioSaavn Link
  else if (raw.includes("jiosaavn.com")) {
    const match = raw.match(/\/(song|album)\/([^\/]+)/i);
    if (match && match[2]) {
      searchKeyword = match[2].replace(/-/g, " ").trim();
    }
  }

  // 3. Direct Audio / MP3 File Link
  else if (raw.includes(".mp3") || raw.includes(".m4a") || raw.startsWith("/audio/")) {
    const filename = raw.split("/").pop().split("?")[0];
    searchKeyword = decodeURIComponent(filename)
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]/g, " ")
      .trim();
  }

  // 4. YouTube Link
  else if (raw.includes("youtube.com") || raw.includes("youtu.be")) {
    try {
      const ytRes = await fetch(
        `https://www.youtube.com/oembed?url=${encodeURIComponent(raw)}&format=json`
      );
      if (ytRes.ok) {
        const ydata = await ytRes.json();
        if (ydata.title) {
          searchKeyword = ydata.title
            .replace(/official\s*(music)?\s*video/gi, "")
            .replace(/full\s*song/gi, "")
            .replace(/lyrics/gi, "")
            .replace(/[\(\[\{].*?[\)\]\}]/g, "")
            .replace(/\|.*$/, "")
            .trim();
        }
        if (ydata.thumbnail_url) coverUrl = ydata.thumbnail_url;
      }
    } catch (e) {
      console.warn("YouTube oEmbed error:", e);
    }
  }

  // 5. Fallback or direct song query
  else {
    searchKeyword = raw;
  }

  // Query iTunes Search API to resolve authoritative Title, Artist, HD Cover & Playable Audio
  const term = (searchKeyword || raw).trim();
  try {
    const itunesRes = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=1`
    );
    if (itunesRes.ok) {
      const idata = await itunesRes.json();
      if (idata.results && idata.results.length > 0) {
        const item = idata.results[0];

        // Format clean title
        let cleanTitle = item.trackName || term;
        // Clean trailing film credits if messy
        if (cleanTitle.includes(" (From ") && !cleanTitle.toLowerCase().includes("sab tera")) {
          cleanTitle = cleanTitle.split(" (From ")[0].trim();
        }

        const highResCover = item.artworkUrl100
          ? item.artworkUrl100.replace("100x100bb", "600x600bb")
          : coverUrl;

        return {
          title: cleanTitle,
          artist: item.artistName || "Original Artist",
          cover: coverUrl || highResCover,
          audioUrl: item.previewUrl || (raw.includes(".mp3") ? raw : "/audio/sab-tera.mp3"),
          spotifyUrl: spotifyUrl || item.trackViewUrl,
          album: item.collectionName || "",
        };
      }
    }
  } catch (err) {
    console.warn("iTunes search error:", err);
  }

  // Graceful fallback
  return {
    title: term.length > 30 ? term.slice(0, 30) : term,
    artist: "Original Artist",
    cover: coverUrl,
    audioUrl: raw.includes(".mp3") ? raw : "/audio/sab-tera.mp3",
    spotifyUrl,
  };
}
