/**
 * Production Netlify Serverless Story Retriever for Supabase
 * Project URL: https://jkszpflktmicbwfkowqx.supabase.co
 * Uses native fetch for 100% fail-safe Netlify bundling.
 */

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const storyId = event.queryStringParameters?.storyId;

  if (!storyId) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Missing storyId parameter" }),
    };
  }

  const SUPABASE_URL = (process.env.SUPABASE_URL || "https://jkszpflktmicbwfkowqx.supabase.co").replace(/\/$/, "");
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/stories?id=eq.${encodeURIComponent(storyId)}&select=*&limit=1`, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });

      if (res.ok) {
        const rows = await res.json();
        if (Array.isArray(rows) && rows.length > 0) {
          const data = rows[0];
          return {
            statusCode: 200,
            headers,
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
      }
    } catch (err) {
      console.warn("[get-story DB error]", err);
    }
  }

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify({ error: "Story not found in database" }),
  };
};
