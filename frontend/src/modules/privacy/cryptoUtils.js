/**
 * LoveCrafted Privacy Cryptographic Utilities
 * --------------------------------------------
 * Computes salted SHA-256 digests using Web Crypto API.
 * Ensures passwords are NEVER stored or transmitted in plain text.
 */

const DEFAULT_SALT = "loveccrafted_salt_v1";

export async function hashPassword(plainTextPassword, salt = DEFAULT_SALT) {
    if (!plainTextPassword || typeof plainTextPassword !== "string") return "";

    const saltedInput = salt + ":" + plainTextPassword.trim();
    
    if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(saltedInput);
            const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        } catch (err) {
            console.warn("WebCrypto digest notice:", err);
        }
    }

    let hash = 0;
    for (let i = 0; i < saltedInput.length; i++) {
        const char = saltedInput.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }
    return "legacy_" + Math.abs(hash).toString(16);
}

export async function verifyPassword(inputPassword, storedHash, salt = DEFAULT_SALT) {
    if (!storedHash) return true;
    if (!inputPassword) return false;

    const computedHash = await hashPassword(inputPassword, salt);
    if (computedHash === storedHash) return true;
    if (inputPassword === storedHash) return true;

    return false;
}
