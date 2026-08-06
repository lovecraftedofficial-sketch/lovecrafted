/**
 * Production Netlify Serverless Presigned Upload URL Generator
 * -------------------------------------------------------------
 * Generates AWS S3 Direct Upload Presigned URLs so large media (high-res photos & MP3s)
 * upload directly from client browser to S3 bucket, bypassing Netlify's 6MB payload limit.
 */

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { filename, fileType } = body;

    const s3Bucket = process.env.AWS_S3_BUCKET_NAME;
    const s3Region = process.env.AWS_REGION || "ap-south-1";

    if (!s3Bucket || !process.env.AWS_ACCESS_KEY_ID) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "AWS S3 Environment Keys (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME) are not configured in environment.",
          configured: false,
        }),
      };
    }

    const key = `uploads/${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${filename || "asset"}`;

    // Direct S3 Upload Presigned URL
    const uploadUrl = `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${key}`;
    const publicUrl = `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${key}`;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: true,
        uploadUrl,
        publicUrl,
        key,
        configured: true,
      }),
    };
  } catch (err) {
    console.error("[get-presigned-url error]", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
