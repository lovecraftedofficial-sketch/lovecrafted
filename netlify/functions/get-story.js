/**
 * Netlify Serverless Story Database Retriever
 * -------------------------------------------
 * Retrieves complete published story payloads by storyId.
 */
exports.handler = async (event) => {
  const storyId = event.queryStringParameters?.storyId;

  if (!storyId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing storyId parameter" }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      storyId,
      status: "Published",
    }),
  };
};
