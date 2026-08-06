/**
 * Production Netlify Serverless Story Retriever for Supabase
 * Project URL: https://jkszpflktmicbwfkowqx.supabase.co
 */

const { getSupabaseClient } = require("./lib/supabase");

exports.handler = async (event) => {
  const storyId = event.queryStringParameters?.storyId;

  if (!storyId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing storyId parameter" }),
    };
  }

  try {
    const supabase = getSupabaseClient();

    if (supabase) {
      const { data, error } = await supabase
        .from("stories")
        .select("id, template_slug, title, content, status, created_at")
        .eq("id", storyId)
        .single();

      if (error || !data) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Story not found in Supabase database" }),
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
          storyId: data.id,
          templateSlug: data.template_slug,
          title: data.title,
          content: typeof data.content === "string" ? JSON.parse(data.content) : data.content,
          status: data.status,
          createdAt: data.created_at,
          source: "Supabase PostgreSQL",
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "SUPABASE_SERVICE_ROLE_KEY environment variable is not configured." }),
    };
  } catch (err) {
    console.error("[get-story error]", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
