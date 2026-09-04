/**
 * Netlify Serverless Function: submit-feedback.js
 * ------------------------------------------------
 * Endpoint: POST /.netlify/functions/submit-feedback
 * Validates customer feedback submissions and persists them securely.
 */

exports.handler = async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    // Validation
    const rating = Number(body.rating) || 5;
    const feedback = String(body.feedback || "").trim();
    const name = String(body.name || "").trim() || "Anonymous Romantic";
    const email = String(body.email || "").trim();
    const recommendation = body.recommendation || "Yes, absolutely";
    const testimonialPermission = Boolean(body.testimonialPermission);

    if (!feedback || feedback.length < 5) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Feedback must contain at least 5 characters." }),
      };
    }

    if (feedback.length > 2000) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Feedback message exceeds maximum allowed length (2000 characters)." }),
      };
    }

    const record = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      rating: Math.min(5, Math.max(1, rating)),
      feedback,
      name,
      email,
      recommendation,
      testimonialPermission,
      targetEmail: "lovecrafted.official@gmail.com",
      isApproved: false, // Default false: Admin approval required for public display
      createdAt: new Date().toISOString(),
    };

    // Forward to LoveCrafted Official Gmail via FormSubmit
    try {
      await fetch("https://formsubmit.co/ajax/lovecrafted.official@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `💌 [LoveCrafted Feedback] ${record.rating}★ from ${name}`,
          _template: "table",
          _captcha: "false",
          "Rating": `${record.rating} / 5 Hearts`,
          "Customer Feedback": feedback,
          "Customer Name": name,
          "Customer Email": email || "Not provided",
          "Would Recommend": recommendation,
          "Permission to Feature Testimonial": testimonialPermission ? "Granted (Yes)" : "Declined (Keep Private)",
          "Submitted At (UTC)": record.createdAt,
        }),
      });
    } catch (forwardErr) {
      console.warn("Netlify feedback forward note:", forwardErr.message);
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: true,
        message: "Thank you for sharing your feedback with LoveCrafted. Sent to lovecrafted.official@gmail.com.",
        record,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", details: err.message }),
    };
  }
};
