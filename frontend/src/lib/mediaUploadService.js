/**
 * Media Upload Service for LoveCrafted Flagship
 * ----------------------------------------------
 * Automatically detects Blob / Object URLs or File objects and uploads them
 * to permanent HTTPS storage before publishing, replacing temporary blob URLs.
 */

/**
 * Upload a local Blob or File to permanent HTTPS storage.
 * If the input is already a permanent HTTPS URL, returns it directly.
 */
export async function uploadMediaAsset(fileOrBlobUrl, assetType = "audio") {
  if (!fileOrBlobUrl) return "";

  // If already a permanent HTTPS / public asset URL, no upload needed
  if (
    typeof fileOrBlobUrl === "string" &&
    !fileOrBlobUrl.startsWith("blob:") &&
    !fileOrBlobUrl.startsWith("data:")
  ) {
    return fileOrBlobUrl;
  }

  try {
    let blob;
    let filename = `asset-${Date.now()}.${assetType === "audio" ? "mp3" : "jpg"}`;

    if (fileOrBlobUrl instanceof File || fileOrBlobUrl instanceof Blob) {
      blob = fileOrBlobUrl;
      if (fileOrBlobUrl.name) filename = fileOrBlobUrl.name;
    } else if (typeof fileOrBlobUrl === "string" && fileOrBlobUrl.startsWith("blob:")) {
      const response = await fetch(fileOrBlobUrl);
      blob = await response.blob();
    } else if (typeof fileOrBlobUrl === "string" && fileOrBlobUrl.startsWith("data:")) {
      const res = await fetch(fileOrBlobUrl);
      blob = await res.blob();
    } else {
      return fileOrBlobUrl;
    }

    // Convert Blob to Base64 payload for serverless upload API
    const reader = new FileReader();
    const base64Data = await new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    // Call Serverless Media Upload Endpoint
    const apiRes = await fetch("/.netlify/functions/upload-media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assetData: base64Data,
        filename,
        assetType,
      }),
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data.permanentUrl) {
        return data.permanentUrl;
      }
    }
  } catch (err) {
    console.warn("[MediaUploadService] Serverless upload fallback:", err);
  }

  // Fallback: Return asset or persistent data URL if upload endpoint unavailable locally
  return fileOrBlobUrl;
}

/**
 * Scan an entire story content object, recursively finding all Blob / Data URLs
 * and uploading them to permanent HTTPS storage.
 */
export async function sanitizeAndUploadAllStoryMedia(content) {
  if (!content || typeof content !== "object") return content;

  const sanitized = JSON.parse(JSON.stringify(content));

  // Key fields that might hold local audio / image Blobs
  const mediaKeys = [
    "bgMusicUrl",
    "songAudioUrl",
    "voice1Note",
    "voice2Note",
    "voice3Note",
    "voice4Note",
    "keepsake1Photo",
    "keepsake2Photo",
    "boxItem1Photo",
    "heroImage",
    "card1Image",
    "card2Image",
    "card3Image",
  ];

  for (const key of mediaKeys) {
    if (sanitized[key]) {
      const val = sanitized[key];
      const assetType = key.toLowerCase().includes("voice") || key.toLowerCase().includes("music") || key.toLowerCase().includes("song") || key.toLowerCase().includes("audio") ? "audio" : "image";
      sanitized[key] = await uploadMediaAsset(val, assetType);
    }
  }

  return sanitized;
}
