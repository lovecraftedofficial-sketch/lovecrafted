/**
 * Production Netlify Serverless Draft Retriever for Supabase
 * Project URL: https://jkszpflktmicbwfkowqx.supabase.co
 */

const { getSupabaseClient } = require("./lib/supabase");

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
    const supabase = getSupabaseClient();

    if (supabase) {
      const { data, error } = await supabase
        .from("drafts")
        .select("content, updated_at")
        .eq("user_session_id", userSessionId)
        .eq("template_slug", templateSlug)
        .single();

      if (error || !data) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Draft not found in Supabase database" }),
        };
      }

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          success: true,
          content: typeof data.content === "string" ? JSON.parse(data.content) : data.content,
          updatedAt: data.updated_at,
          source: "Supabase PostgreSQL",
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "SUPABASE_SERVICE_ROLE_KEY environment variable is not configured." }),
    };
  } catch (err) {
    console.error("[get-draft error]", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
