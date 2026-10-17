/**
 * LoveCrafted Serverless Analytics Endpoint
 * Handles background event logging & aggregates from Supabase.
 * Built with native fetch for 100% dependency-free Netlify bundling.
 */

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  const SUPABASE_URL = (process.env.SUPABASE_URL || "https://jkszpflktmicbwfkowqx.supabase.co").replace(/\/$/, "");
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  // 1. GET: Fetch global metrics from Supabase if connected
  if (event.httpMethod === "GET") {
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const [visitsRes, storiesRes] = await Promise.allSettled([
          fetch(`${SUPABASE_URL}/rest/v1/analytics_events?select=event_type,visitor_id,path,created_at,metadata&order=created_at.desc&limit=200`, {
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
            },
          }).then((r) => (r.ok ? r.json() : [])),
          fetch(`${SUPABASE_URL}/rest/v1/stories?select=id,template_slug,title,status,created_at&order=created_at.desc&limit=100`, {
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${SUPABASE_KEY}`,
            },
          }).then((r) => (r.ok ? r.json() : [])),
        ]);

        const events = visitsRes.status === "fulfilled" && Array.isArray(visitsRes.value) ? visitsRes.value : [];
        const stories = storiesRes.status === "fulfilled" && Array.isArray(storiesRes.value) ? storiesRes.value : [];

        const pageViews = events.filter((e) => e.event_type === "page_view");
        const uniqueVisitors = new Set(pageViews.map((e) => e.visitor_id).filter(Boolean));

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            cloud: true,
            totalVisits: pageViews.length,
            uniqueVisitorsCount: uniqueVisitors.size,
            totalStoriesCount: stories.length,
            stories,
            recentEvents: events.slice(0, 30),
          }),
        };
      } catch (e) {
        console.warn("[analytics GET error]", e);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, cloud: false, message: "Local storage mode active" }),
    };
  }

  // 2. POST: Record event via PostgREST
  try {
    let payload = {};
    if (event.body) {
      try {
        payload = JSON.parse(event.body);
      } catch {}
    }

    if (SUPABASE_URL && SUPABASE_KEY && payload.type) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/analytics_events`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            event_type: payload.type,
            visitor_id: payload.visitorId || null,
            path: payload.path || null,
            metadata: payload,
            created_at: new Date().toISOString(),
          }),
        });
      } catch (dbErr) {
        // Intentionally non-fatal
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: "ok",
        received: true,
        timestamp: new Date().toISOString(),
      }),
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: "ok" }),
    };
  }
};
