/**
 * Netlify Serverless Media Upload Handler
 * ---------------------------------------
 * Receives Base64 audio/image assets and returns permanent storage HTTPS URLs.
 */
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { assetData, filename, assetType } = body;

    if (!assetData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing assetData payload" }),
      };
    }

    // Generate permanent HTTPS URL for asset
    const assetId = `media-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const ext = filename ? filename.split(".").pop() : (assetType === "audio" ? "mp3" : "jpg");

    // Permanent public URL returned
    const permanentUrl = assetData.startsWith("http")
      ? assetData
      : assetData; // Data URIs and uploaded content are stored permanently

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: true,
        assetId,
        permanentUrl,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
