import { getTemplate } from "../data/templateRegistry.js";

const LEGACY_DEFAULTS = [
  "Anniversary Memory Website",
  "Special Proposal Keepsake",
  "Our Love Story",
];

/**
 * Generates a clean, sensible project title for a gift/project based on template context
 * and user partnerName content. Safely preserves custom user-defined titles.
 */
export function getGiftTitle(gift) {
  if (!gift) return "My Romantic Keepsake";

  const templateEntry = getTemplate(gift.templateSlug);
  const templateName = templateEntry?.config?.name || gift.templateSlug || "Keepsake";

  // 1. If gift has a custom title that is NOT a legacy hardcoded default, preserve it!
  const rawTitle = (gift.title || "").trim();
  if (rawTitle && !LEGACY_DEFAULTS.includes(rawTitle)) {
    return rawTitle;
  }

  // 2. Look up draft content to extract partnerName
  let partnerName = "";
  try {
    const draftKey = `lws:draft:${gift.templateSlug}:demo`;
    const draftRaw = localStorage.getItem(draftKey);
    if (draftRaw) {
      const parsed = JSON.parse(draftRaw);
      partnerName = (parsed.partnerName || parsed.recipientName || "").trim();
    }
  } catch {}

  // 3. Generate title based on partnerName if available
  if (partnerName) {
    return `For ${partnerName} ❤️`;
  }

  // 4. Default fallback: ${templateName} — My Gift
  return `${templateName} — My Gift`;
}
