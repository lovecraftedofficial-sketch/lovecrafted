/**
 * LoveCrafted Privacy Session Manager
 * ------------------------------------
 * Manages signed unlock session tokens with configurable expiration timestamps.
 */

const SESSION_PREFIX = "lws_privacy_session:";

export function createUnlockSession(siteKey, durationHours = 24) {
    if (!siteKey || typeof window === "undefined") return;

    const now = Date.now();
    const expiresAt = durationHours > 0 ? now + durationHours * 3600 * 1000 : 0;

    const sessionData = {
        siteKey: siteKey,
        unlockedAt: now,
        expiresAt: expiresAt,
    };

    try {
        sessionStorage.setItem(SESSION_PREFIX + siteKey, JSON.stringify(sessionData));
    } catch (err) {
        /* ignore */
    }
}

export function isSessionUnlocked(siteKey) {
    if (!siteKey || typeof window === "undefined") return false;

    try {
        const raw = sessionStorage.getItem(SESSION_PREFIX + siteKey);
        if (!raw) return false;

        const session = JSON.parse(raw);
        if (!session || session.siteKey !== siteKey) return false;

        if (session.expiresAt > 0 && Date.now() > session.expiresAt) {
            clearUnlockSession(siteKey);
            return false;
        }

        return true;
    } catch (err) {
        return false;
    }
}

export function clearUnlockSession(siteKey) {
    if (!siteKey || typeof window === "undefined") return;
    try {
        sessionStorage.removeItem(SESSION_PREFIX + siteKey);
    } catch (err) {
        /* ignore */
    }
}
