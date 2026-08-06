/**
 * Production Netlify Serverless Draft Saver
 * -----------------------------------------
 * Saves creator draft payloads to database `drafts` table.
 */

const { query } = require("./lib/db");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { userSessionId, templateSlug, content } = body;

    if (!userSessionId || !templateSlug) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing userSessionId or templateSlug" }),
      };
    }

    const draftId = `draft_${userSessionId}_${templateSlug}`;

    const dbResult = await query(
      `INSERT INTO drafts (id, user_session_id, template_slug, content, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (user_session_id, template_slug) DO UPDATE
       SET content = EXCLUDED.content, updated_at = NOW()
       RETURNING id;`,
      [draftId, userSessionId, templateSlug, JSON.stringify(content || {})]
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: true,
        draftId,
        persistedToDb: !!dbResult,
      }),
    };
  } catch (err) {
    console.error("[save-draft error]", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
