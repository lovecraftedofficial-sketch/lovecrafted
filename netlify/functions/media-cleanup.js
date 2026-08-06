/**
 * Production Netlify Serverless Media Cleanup Handler
 * ---------------------------------------------------
 * Garbage collection job that identifies and purges unassigned/abandoned media assets.
 */

const { query } = require("./lib/db");

exports.handler = async (event) => {
  try {
    // Delete media assets that were created > 24 hours ago and remain unassigned to any published story
    const dbResult = await query(
      `DELETE FROM media_assets 
       WHERE story_id IS NULL AND created_at < NOW() - INTERVAL '24 hours'
       RETURNING id, permanent_url;`
    );

    const deletedCount = dbResult && dbResult.rowCount ? dbResult.rowCount : 0;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: true,
        purgedAssetCount: deletedCount,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (err) {
    console.error("[media-cleanup error]", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
