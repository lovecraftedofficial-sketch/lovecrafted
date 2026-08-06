/**
 * Security & Binary Validation Module for LoveCrafted
 * ----------------------------------------------------
 * Includes:
 * 1. Cryptographically secure Story ID generator (`crypto.randomBytes`)
 * 2. Binary magic byte signature inspection for JPEG, PNG, MP3, WAV, OGG, M4A
 */

const crypto = require("crypto");

/**
 * Generate a cryptographically secure 12-character short story ID
 */
function generateSecureStoryId() {
  const bytes = crypto.randomBytes(8);
  return `s_${bytes.toString("hex")}`;
}

/**
 * Inspect raw file buffer for binary magic byte signatures to prevent spoofed uploads
 */
function validateMagicBytes(buffer, declaredMimeType) {
  if (!buffer || buffer.length < 4) {
    return { valid: false, error: "Buffer too small for binary signature analysis" };
  }

  // Magic Byte Signatures
  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  const isGif = buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46;

  // Audio Signatures
  const isMp3ID3 = buffer[0] === 0x49 && buffer[1] === 0x44 && buffer[2] === 0x33; // 'ID3'
  const isMp3Raw = buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0; // Sync word 11111111 111
  const isWav = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46; // 'RIFF'
  const isOgg = buffer[0] === 0x4f && buffer[1] === 0x67 && buffer[2] === 0x67 && buffer[3] === 0x53; // 'OggS'
  const isM4a = buffer.length > 8 && buffer.slice(4, 8).toString("ascii") === "ftyp";

  const isAudio = isMp3ID3 || isMp3Raw || isWav || isOgg || isM4a;
  const isImage = isJpeg || isPng || isGif;

  if (!isAudio && !isImage) {
    return {
      valid: false,
      error: "Security Check Failed: File binary signature (magic bytes) does not match supported image or audio formats.",
    };
  }

  return { valid: true, detectedType: isAudio ? "audio" : "image" };
}

module.exports = {
  generateSecureStoryId,
  validateMagicBytes,
};
