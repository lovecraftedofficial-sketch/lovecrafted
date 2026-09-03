/**
 * Image utilities — client-side only for Phase 1.
 * Temporary browser object URLs. No uploads. No cloud storage.
 * Backend Phase 2 will replace this with real server-side validated uploads.
 */

export const ACCEPTED_IMAGE_MIME = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
];
export const ACCEPTED_IMAGE_EXT = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
    ".avif",
];
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB soft cap Phase 1

export function isAcceptedImageFile(file) {
    if (!file) return false;
    const nameOk = ACCEPTED_IMAGE_EXT.some((ext) =>
        (file.name || "").toLowerCase().endsWith(ext),
    );
    const mimeOk = ACCEPTED_IMAGE_MIME.includes(file.type || "");
    return nameOk || mimeOk;
}

/**
 * Create a temporary browser-only object URL for a local image file.
 * Callers MUST call revokeLocalImage(previousValue) when replacing/unmounting
 * to avoid memory leaks.
 * Returns { ok, value | error }.
 */
export function createLocalImage(file) {
    if (!isAcceptedImageFile(file)) {
        return {
            ok: false,
            error: "Only JPG, PNG, WEBP, GIF, or AVIF images are supported.",
        };
    }
    if (file.size > MAX_IMAGE_BYTES) {
        return { ok: false, error: "Image exceeds the 8 MB Phase 1 limit." };
    }
    const url = URL.createObjectURL(file);
    return {
        ok: true,
        value: {
            kind: "local",
            url,
            name: file.name,
            mime: file.type || "image/jpeg",
            size: file.size,
        },
    };
}

export function revokeLocalImage(value) {
    if (value && value.kind === "local" && value.url) {
        try {
            URL.revokeObjectURL(value.url);
        } catch {
            /* ignore */
        }
    }
}

/**
 * Resolve an image field value (used by templates) to a plain src string.
 * Accepts:
 *   - null/undefined         → null
 *   - string                 → returned as-is (e.g. Unsplash URL from demoData)
 *   - { kind: "url", url }   → returns url
 *   - { kind: "local", url } → returns url (temp object URL)
 */
export function resolveImage(value) {
    if (!value) return null;
    if (typeof value === "string") return value;
    if (value.url) return value.url;
    return null;
}
