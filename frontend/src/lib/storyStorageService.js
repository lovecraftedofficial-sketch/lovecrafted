/**
 * Story Storage & Database Service for LoveCrafted
 * -----------------------------------------------
 * Persists published gifts and drafts as database records.
 * Generates short story IDs (`/story/{storyId}`) eliminating Base64 payload links.
 */

const LOCAL_STORIES_KEY = "lws:published_stories_db";

/**
 * Save a complete published story payload to permanent database storage.
 * Returns the generated permanent short story ID.
 */
export async function saveStoryToDatabase({ storyId, templateSlug, title, content, customSlug }) {
  const finalSlug = customSlug || storyId || `story-${Date.now().toString(36)}`;

  const storyRecord = {
    storyId: finalSlug,
    templateSlug,
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "Published",
  };

  try {
    // Attempt Serverless Database Storage API call
    const res = await fetch("/.netlify/functions/save-story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(storyRecord),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.storyId) {
        storyRecord.storyId = data.storyId;
      }
    }
  } catch (err) {
    console.warn("[StoryStorageService] Serverless DB fallback:", err);
  }

  // Backup to client persistent stories DB in localStorage
  try {
    const raw = localStorage.getItem(LOCAL_STORIES_KEY);
    const db = raw ? JSON.parse(raw) : {};
    db[storyRecord.storyId] = storyRecord;
    localStorage.setItem(LOCAL_STORIES_KEY, JSON.stringify(db));
  } catch {}

  return storyRecord.storyId;
}

/**
 * Fetch a published story payload by short story ID from permanent database storage.
 */
export async function fetchStoryFromDatabase(storyId) {
  if (!storyId) return null;

  try {
    const res = await fetch(`/.netlify/functions/get-story?storyId=${encodeURIComponent(storyId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.content) {
        return data;
      }
    }
  } catch (err) {
    console.warn("[StoryStorageService] Serverless fetch fallback:", err);
  }

  // Backup lookup from client persistent stories DB
  try {
    const raw = localStorage.getItem(LOCAL_STORIES_KEY);
    if (raw) {
      const db = JSON.parse(raw);
      if (db[storyId]) return db[storyId];
    }
  } catch {}

  return null;
}
