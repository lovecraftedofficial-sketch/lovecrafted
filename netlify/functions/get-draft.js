/**
 * Production Netlify Serverless Draft Retriever
 * --------------------------------------------
 * Retrieves creator draft payload by userSessionId and templateSlug.
 */

const { query } = require("./lib/db");

exports.handler = async (event) => {
  const userSessionId = event.queryStringParameters?.userSessionId;
  const templateSlug = event.queryStringParameters?.templateSlug || "until-forever";

  if (!userSessionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing userSessionId parameter" }),
    };
  }

  try {
    const dbResult = await query(
      `SELECT content, updated_at FROM drafts WHERE user_session_id = $1 AND template_slug = $2 LIMIT 1;`,
      [userSessionId, templateSlug]
    );

    if (dbResult && dbResult.rows && dbResult.rows.length > 0) {
      const row = dbResult.rows[0];
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          success: true,
          content: typeof row.content === "string" ? JSON.parse(row.content) : row.content,
          updatedAt: row.updated_at,
        }),
      };
    }

    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Draft not found" }),
    };
  } catch (err) {
    console.error("[get-draft error]", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
