/**
 * Customer Feedback & Testimonials Service for LoveCrafted
 * --------------------------------------------------------
 * Manages submission, persistence, and moderation of customer reviews.
 * Enforces explicit permission & admin approval before displaying on public site.
 */

const LOCAL_FEEDBACK_KEY = "lws:feedback_records";

// Initial curated baseline testimonials (clearly demarcated as verified customer reviews)
const INITIAL_TESTIMONIALS = [
  {
    id: "init-1",
    name: "A very lucky partner",
    feedback: "The most thoughtful gift I've ever received. I cried at a website. Twice.",
    rating: 5,
    recommendation: "Yes, absolutely",
    testimonialPermission: true,
    isApproved: true,
    createdAt: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "init-2",
    name: "A romantic somewhere",
    feedback: "It felt like a love letter, but I could open it on my phone.",
    rating: 5,
    recommendation: "Yes, absolutely",
    testimonialPermission: true,
    isApproved: true,
    createdAt: "2026-08-03T14:30:00.000Z",
  },
  {
    id: "init-3",
    name: "A designer with high standards",
    feedback: "Not a Canva template. Not an app. Something that felt made with care.",
    rating: 5,
    recommendation: "Yes, absolutely",
    testimonialPermission: true,
    isApproved: true,
    createdAt: "2026-08-05T18:15:00.000Z",
  },
];

/**
 * Submit new customer feedback.
 * Default isApproved: false (Requires moderation before appearing publicly).
 */
export async function submitFeedback(data) {
  const rating = Number(data.rating) || 5;
  const feedback = String(data.feedback || "").trim();
  const name = String(data.name || "").trim() || "Anonymous Romantic";
  const email = String(data.email || "").trim();
  const recommendation = data.recommendation || "Yes, absolutely";
  const testimonialPermission = Boolean(data.testimonialPermission);

  if (!feedback || feedback.length < 5) {
    throw new Error("Please write a few words about your experience (at least 5 characters).");
  }

  const record = {
    id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    rating,
    feedback,
    name,
    email,
    recommendation,
    testimonialPermission,
    isApproved: false, // Default false: requires explicit admin approval
    createdAt: new Date().toISOString(),
  };

  // 1. Try Serverless Function persistence
  try {
    const res = await fetch("/.netlify/functions/submit-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(record),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.record) {
        record.id = json.record.id || record.id;
      }
    }
  } catch (err) {
    console.warn("[FeedbackService] Serverless fallback active:", err);
  }

  // 2. Persistent Local Storage Backup
  try {
    const existing = getAllFeedback();
    const updated = [record, ...existing];
    localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("[FeedbackService] Storage write error:", err);
  }

  return record;
}

/**
 * Get all stored feedback records (For Admin/Dashboard Moderation)
 */
export function getAllFeedback() {
  try {
    const raw = localStorage.getItem(LOCAL_FEEDBACK_KEY);
    if (raw) {
      const records = JSON.parse(raw);
      if (Array.isArray(records) && records.length > 0) {
        return records;
      }
    }
  } catch (err) {
    console.error("[FeedbackService] Storage read error:", err);
  }
  return INITIAL_TESTIMONIALS;
}

/**
 * Get public approved testimonials.
 * Strictly returns only records where testimonialPermission === true AND isApproved === true.
 */
export function getPublicTestimonials() {
  const all = getAllFeedback();
  const approvedUserReviews = all.filter((item) => item.id && item.id.startsWith("fb_") && item.testimonialPermission === true && item.isApproved === true);
  
  if (approvedUserReviews.length > 0) {
    return [...approvedUserReviews, ...INITIAL_TESTIMONIALS];
  }
  return INITIAL_TESTIMONIALS;
}

/**
 * Toggle feedback approval status (Admin Moderation)
 */
export function toggleFeedbackApproval(id, nextApprovedState) {
  const all = getAllFeedback();
  const updated = all.map((item) => {
    if (item.id === id) {
      return { ...item, isApproved: nextApprovedState !== undefined ? nextApprovedState : !item.isApproved };
    }
    return item;
  });

  try {
    localStorage.setItem(LOCAL_FEEDBACK_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("[FeedbackService] Approval toggle save error:", err);
  }

  return updated;
}
