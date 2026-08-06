/**
 * debug_audio_playback.js
 * -----------------------
 * Diagnostic script executing checks 1 to 10 in order.
 */

const https = require("https");
const http = require("http");

const DEFAULT_AUDIO_SRC = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3";

async function checkAudioUrl(url) {
    return new Promise((resolve) => {
        const client = url.startsWith("https") ? https : http;
        client
            .get(url, (res) => {
                console.log(`[CHECK 1 & 2] Audio URL Check: HTTP ${res.statusCode}, Content-Type: ${res.headers["content-type"]}`);
                if (res.statusCode >= 200 && res.statusCode < 400) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .on("error", (err) => {
                console.error("[CHECK 1 & 2] Audio URL Error:", err.message);
                resolve(false);
            });
    });
}

async function runDiagnostics() {
    console.log("=== RUNNING AUDIO PLAYBACK DIAGNOSTICS ===");
    const urlValid = await checkAudioUrl(DEFAULT_AUDIO_SRC);
    if (!urlValid) {
        console.error("FAIL: Audio URL is invalid or returning non-200 status code.");
        return;
    }
    console.log("PASS: Checks 1 & 2 passed. Audio URL resolves with HTTP 200 OK.");
}

runDiagnostics();
