/**
 * Production Netlify Serverless Media Uploader for Supabase Storage
 * Project URL: https://jkszpflktmicbwfkowqx.supabase.co
 */

const { getSupabaseClient, SUPABASE_URL } = require("./lib/supabase");
const { validateMagicBytes } = require("./lib/security");

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

    // Step 1: Decode Base64 Data URL to Buffer
    let buffer;
    let mimeType = "audio/mp3";

    if (assetData.startsWith("data:")) {
      const parts = assetData.split(";base64,");
      mimeType = parts[0].replace("data:", "");
      buffer = Buffer.from(parts[1], "base64");
    } else {
      buffer = Buffer.from(assetData, "utf8");
    }

    // Step 2: Binary Magic Byte Validation
    const securityCheck = validateMagicBytes(buffer, mimeType);
    if (!securityCheck.valid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: securityCheck.error }),
      };
    }

    // Step 3: Upload to Supabase Storage Bucket `lovecrafted-media`
    const supabase = getSupabaseClient();
    const assetId = `media-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const ext = filename ? filename.split(".").pop() : (assetType === "audio" ? "mp3" : "jpg");
    const filePath = `uploads/${assetId}.${ext}`;

    if (supabase) {
      const { data, error } = await supabase.storage
        .from("lovecrafted-media")
        .upload(filePath, buffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (error) {
        console.error("[upload-media Supabase Storage Error]", error);
        throw error;
      }

      // Generate Permanent Public HTTPS URL
      const { data: publicUrlData } = supabase.storage
        .from("lovecrafted-media")
        .getPublicUrl(filePath);

      const permanentUrl = publicUrlData.publicUrl;

      // Track in media_assets DB table
      await supabase.from("media_assets").insert({
        id: assetId,
        permanent_url: permanentUrl,
        mime_type: mimeType,
        file_size: buffer.length,
        status: "active",
      });

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
          mimeType,
          magicByteVerified: true,
          storageProvider: "Supabase_Storage",
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "SUPABASE_SERVICE_ROLE_KEY environment variable is not configured." }),
    };
  } catch (err) {
    console.error("[upload-media error]", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
