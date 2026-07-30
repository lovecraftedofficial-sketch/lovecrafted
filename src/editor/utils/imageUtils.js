/**
 * Image utilities — Client-side Base64 & Fallback Image Handler.
 * Converts uploaded local files to portable Data URLs so images
 * persist seamlessly across URL shares, previews, and exports.
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
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB cap

const DEFAULT_ROMANTIC_COUPLE_PHOTO =
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80";

export function isAcceptedImageFile(file) {
    if (!file) return false;
    const nameOk = ACCEPTED_IMAGE_EXT.some((ext) =>
        (file.name || "").toLowerCase().endsWith(ext),
    );
    const mimeOk = ACCEPTED_IMAGE_MIME.includes(file.type || "");
    return nameOk || mimeOk;
}

/**
 * Compress and convert an image file to a portable compressed Data URL (base64).
 */
export async function createLocalImageAsync(file) {
    if (!isAcceptedImageFile(file)) {
        return {
            ok: false,
            error: "Only JPG, PNG, WEBP, GIF, or AVIF images are supported.",
        };
    }
    if (file.size > MAX_IMAGE_BYTES) {
        return { ok: false, error: "Image exceeds the 10 MB limit." };
    }

    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const rawDataUrl = e.target.result;
            const img = new Image();
            img.onload = () => {
                try {
                    const canvas = document.createElement("canvas");
                    const maxDim = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > maxDim || height > maxDim) {
                        if (width > height) {
                            height = Math.round((height * maxDim) / width);
                            width = maxDim;
                        } else {
                            width = Math.round((width * maxDim) / height);
                            height = maxDim;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    const compressedUrl = canvas.toDataURL("image/jpeg", 0.7);

                    resolve({
                        ok: true,
                        value: {
                            kind: "local",
                            url: compressedUrl,
                            name: file.name,
                            mime: "image/jpeg",
                        },
                    });
                } catch {
                    resolve({
                        ok: true,
                        value: {
                            kind: "local",
                            url: rawDataUrl,
                            name: file.name,
                        },
                    });
                }
            };
            img.onerror = () => {
                resolve({
                    ok: true,
                    value: {
                        kind: "local",
                        url: rawDataUrl,
                        name: file.name,
                    },
                });
            };
            img.src = rawDataUrl;
        };
        reader.onerror = () => {
            resolve({
                ok: false,
                error: "Failed to read image file.",
            });
        };
        reader.readAsDataURL(file);
    });
}

export function createLocalImage(file) {
    if (!isAcceptedImageFile(file)) {
        return {
            ok: false,
            error: "Only JPG, PNG, WEBP, GIF, or AVIF images are supported.",
        };
    }
    const tempUrl = URL.createObjectURL(file);
    return {
        ok: true,
        value: {
            kind: "local",
            url: tempUrl,
            name: file.name,
        },
    };
}

export function revokeLocalImage(value) {
    if (value && value.kind === "local" && value.url && value.url.startsWith("blob:")) {
        try {
            URL.revokeObjectURL(value.url);
        } catch {
            /* ignore */
        }
    }
}

/**
 * Resolve an image field value (used by templates) to a valid src string.
 * Always falls back to a romantic couple photo if no image is present.
 */
export function resolveImage(value) {
    if (!value) return DEFAULT_ROMANTIC_COUPLE_PHOTO;
    if (typeof value === "string" && value.trim()) return value.trim();
    if (value.url && typeof value.url === "string" && value.url.trim()) return value.url.trim();
    if (value.dataUrl && typeof value.dataUrl === "string" && value.dataUrl.trim()) return value.dataUrl.trim();
    return DEFAULT_ROMANTIC_COUPLE_PHOTO;
}
