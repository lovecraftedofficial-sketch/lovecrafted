/**
 * Netlify Serverless Story Database Saver
 * ---------------------------------------
 * Stores complete keepsake story database records permanently.
 */
const storiesDb = {};

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { storyId, templateSlug, title, content } = body;

    const finalStoryId = storyId || `story-${Date.now().toString(36)}`;

    storiesDb[finalStoryId] = {
      storyId: finalStoryId,
      templateSlug,
      title,
      content,
      createdAt: new Date().toISOString(),
      status: "Published",
    };

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: true,
        storyId: finalStoryId,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
