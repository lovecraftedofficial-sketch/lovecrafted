/**
 * Production Netlify Serverless Story Saver for Supabase
 * Project URL: https://jkszpflktmicbwfkowqx.supabase.co
 */

const { getSupabaseClient } = require("./lib/supabase");
const { generateSecureStoryId } = require("./lib/security");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { storyId, templateSlug, title, content, ownerPhone, paymentId, invoiceRef } = body;

    const finalStoryId = storyId && storyId !== "demo" ? storyId : generateSecureStoryId();

    const storyRecord = {
      id: finalStoryId,
      template_slug: templateSlug || "until-forever",
      title: title || "Until Forever Keepsake",
      content: content || {},
      owner_phone: ownerPhone || null,
      payment_id: paymentId || null,
      invoice_ref: invoiceRef || null,
      status: "published",
      updated_at: new Date().toISOString(),
    };

    const supabase = getSupabaseClient();

    if (supabase) {
      const { data, error } = await supabase
        .from("stories")
        .upsert(storyRecord, { onConflict: "id" })
        .select("id");

      if (error) {
        console.error("[save-story Supabase DB Error]", error);
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
          storyId: finalStoryId,
          persistedToSupabase: true,
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "SUPABASE_SERVICE_ROLE_KEY environment variable is not configured." }),
    };
  } catch (err) {
    console.error("[save-story error]", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
