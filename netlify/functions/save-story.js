/**
 * Production Netlify Serverless Story Database Saver
 * --------------------------------------------------
 * Saves complete keepsake story records to production database.
 */

const { query } = require("./lib/db");
const { generateSecureStoryId } = require("./lib/security");

// Fallback in-memory map if DB connection string not supplied in env
const memoryDb = {};

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { storyId, templateSlug, title, content, ownerPhone, paymentId, invoiceRef } = body;

    // Generate cryptographically secure story ID if not provided
    const finalStoryId = storyId && storyId !== "demo" ? storyId : generateSecureStoryId();

    const storyRecord = {
      storyId: finalStoryId,
      templateSlug: templateSlug || "until-forever",
      title: title || "Until Forever Keepsake",
      content: content || {},
      ownerPhone: ownerPhone || null,
      paymentId: paymentId || null,
      invoiceRef: invoiceRef || null,
      status: "Published",
      createdAt: new Date().toISOString(),
    };

    // Attempt Production Database Insert
    const dbResult = await query(
      `INSERT INTO stories (id, template_slug, title, content, owner_phone, payment_id, invoice_ref, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO UPDATE
       SET content = EXCLUDED.content, title = EXCLUDED.title, updated_at = NOW()
       RETURNING id;`,
      [
        storyRecord.storyId,
        storyRecord.templateSlug,
        storyRecord.title,
        JSON.stringify(storyRecord.content),
        storyRecord.ownerPhone,
        storyRecord.paymentId,
        storyRecord.invoiceRef,
        storyRecord.status,
      ]
    );

    if (!dbResult) {
      // In-memory fallback if DATABASE_URL not set
      memoryDb[finalStoryId] = storyRecord;
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
        persistedToDb: !!dbResult,
      }),
    };
  } catch (err) {
    console.error("[save-story error]", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
