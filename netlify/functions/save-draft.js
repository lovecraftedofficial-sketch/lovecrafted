/**
 * Production Netlify Serverless Draft Saver for Supabase
 * Project URL: https://jkszpflktmicbwfkowqx.supabase.co
 */

const { getSupabaseClient } = require("./lib/supabase");

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
    const supabase = getSupabaseClient();

    if (supabase) {
      const { data, error } = await supabase
        .from("drafts")
        .upsert(
          {
            id: draftId,
            user_session_id: userSessionId,
            template_slug: templateSlug,
            content: content || {},
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_session_id, template_slug" }
        )
        .select("id");

      if (error) {
        console.error("[save-draft Supabase Error]", error);
        throw error;
      }

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          success: true,
          draftId,
          persistedToSupabase: true,
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "SUPABASE_SERVICE_ROLE_KEY environment variable is not configured." }),
    };
  } catch (err) {
    console.error("[save-draft error]", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
