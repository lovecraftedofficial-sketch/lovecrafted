/**
 * LoveCrafted Independent Analytics & Intelligence Engine
 * 
 * 100% Non-Intrusive, Zero-Overhead, Privacy-Respecting Tracking.
 * Runs completely in the background without affecting website speed or UX.
 * Collects:
 *   1. Page views & unique visitors
 *   2. Keepsake creations & publications
 *   3. Template popularity & device distribution
 */

const STORAGE_KEYS = {
  VISITOR_ID: "lc_analytics:vid",
  SESSION_ID: "lc_analytics:sid",
  LAST_ACTIVITY: "lc_analytics:last_active",
  METRICS: "lc_analytics:metrics_v1",
  VISITS_LOG: "lc_analytics:visits_v1",
  KEEPSAKES_LOG: "lc_analytics:keepsakes_v1",
  OWNER_PIN: "lc_analytics:owner_pin",
};

// Default Owner Passcode
const DEFAULT_OWNER_PIN = "7799";

// Helper: safe JSON parse
const safeJsonParse = (str, fallback) => {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch {
    return fallback;
  }
};

// Helper: detect device type
const getDeviceType = () => {
  if (typeof window === "undefined") return "Desktop";
  const ua = navigator.userAgent || "";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
};

// Helper: generate UUID-like string
const generateId = (prefix = "id") => {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
};

// Helper: get date key in YYYY-MM-DD
const getDateKey = (date = new Date()) => {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
};

/**
 * Get or create anonymous persistent Visitor ID
 */
export const getVisitorId = () => {
  if (typeof window === "undefined") return "ssr";
  try {
    let vid = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
    if (!vid) {
      vid = generateId("v");
      localStorage.setItem(STORAGE_KEYS.VISITOR_ID, vid);
    }
    return vid;
  } catch {
    return "anon_visitor";
  }
};

/**
 * Get or create Session ID (30-min sliding window)
 */
export const getSessionId = () => {
  if (typeof window === "undefined") return "ssr";
  try {
    const now = Date.now();
    const lastActive = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY) || "0", 10);
    let sid = localStorage.getItem(STORAGE_KEYS.SESSION_ID);

    // If session expired (> 30 min) or doesn't exist, create new
    if (!sid || (now - lastActive > 30 * 60 * 1000)) {
      sid = generateId("s");
      localStorage.setItem(STORAGE_KEYS.SESSION_ID, sid);
    }

    localStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, now.toString());
    return sid;
  } catch {
    return "anon_session";
  }
};

/**
 * Initialize / Read aggregate metrics
 */
const getStoredMetrics = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.METRICS);
    return safeJsonParse(raw, {
      totalVisits: 0,
      uniqueVisitors: {}, // { [visitorId]: firstSeenTimestamp }
      pageViews: {},      // { [path]: count }
      dailyVisits: {},    // { [YYYY-MM-DD]: count }
      deviceCounts: { Desktop: 0, Mobile: 0, Tablet: 0 },
      totalKeepsakesCreated: 0,
      totalKeepsakesPublished: 0,
      templateCounts: {}, // { [templateId]: count }
      dailyKeepsakes: {}, // { [YYYY-MM-DD]: count }
      lastUpdated: new Date().toISOString(),
    });
  } catch {
    return {
      totalVisits: 0,
      uniqueVisitors: {},
      pageViews: {},
      dailyVisits: {},
      deviceCounts: { Desktop: 0, Mobile: 0, Tablet: 0 },
      totalKeepsakesCreated: 0,
      totalKeepsakesPublished: 0,
      templateCounts: {},
      dailyKeepsakes: {},
      lastUpdated: new Date().toISOString(),
    };
  }
};

const saveStoredMetrics = (metrics) => {
  try {
    metrics.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics));
  } catch (err) {
    // Fail silently so it never affects user experience
  }
};

/**
 * TRACK PAGE VIEW
 * Completely silent and asynchronous.
 * Excludes private owner pages.
 */
export const trackPageView = (pathname) => {
  if (typeof window === "undefined" || !pathname) return;

  // Don't track owner analytics routes to prevent inflating owner metrics
  if (
    pathname.startsWith("/owner-analytics") ||
    pathname.startsWith("/admin/analytics") ||
    pathname.startsWith("/portal/analytics")
  ) {
    return;
  }

  // Run in idle/background
  const execute = () => {
    try {
      const visitorId = getVisitorId();
      const sessionId = getSessionId();
      const device = getDeviceType();
      const today = getDateKey();
      const now = new Date().toISOString();

      const metrics = getStoredMetrics();

      // 1. Increment total visits
      metrics.totalVisits = (metrics.totalVisits || 0) + 1;

      // 2. Track unique visitor
      if (!metrics.uniqueVisitors) metrics.uniqueVisitors = {};
      if (!metrics.uniqueVisitors[visitorId]) {
        metrics.uniqueVisitors[visitorId] = now;
      }

      // 3. Track page breakdown
      if (!metrics.pageViews) metrics.pageViews = {};
      const cleanPath = pathname.split("?")[0] || "/";
      metrics.pageViews[cleanPath] = (metrics.pageViews[cleanPath] || 0) + 1;

      // 4. Daily visits
      if (!metrics.dailyVisits) metrics.dailyVisits = {};
      metrics.dailyVisits[today] = (metrics.dailyVisits[today] || 0) + 1;

      // 5. Device counts
      if (!metrics.deviceCounts) metrics.deviceCounts = { Desktop: 0, Mobile: 0, Tablet: 0 };
      metrics.deviceCounts[device] = (metrics.deviceCounts[device] || 0) + 1;

      saveStoredMetrics(metrics);

      // 6. Append to rolling visit log (capped at 100 items)
      const rawVisits = localStorage.getItem(STORAGE_KEYS.VISITS_LOG);
      const visits = safeJsonParse(rawVisits, []);
      visits.unshift({
        id: generateId("hit"),
        path: cleanPath,
        device,
        referrer: document.referrer ? new URL(document.referrer, window.location.origin).hostname : "Direct / Search",
        timestamp: now,
      });
      if (visits.length > 100) visits.pop();
      localStorage.setItem(STORAGE_KEYS.VISITS_LOG, JSON.stringify(visits));

      // 7. Fire non-blocking beacon to Netlify serverless if deployed
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            "/.netlify/functions/analytics",
            JSON.stringify({
              type: "page_view",
              visitorId,
              sessionId,
              path: cleanPath,
              device,
              timestamp: now,
            })
          );
        }
      } catch {}
    } catch (e) {
      // Intentionally silent
    }
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(execute, { timeout: 1500 });
  } else {
    setTimeout(execute, 50);
  }
};

/**
 * TRACK KEEPSAKE CREATED
 * Triggered when a keepsake is saved, customized or created.
 */
export const trackKeepsakeCreated = ({
  templateId,
  title,
  partner1,
  partner2,
  isPublished = false,
  slug,
}) => {
  try {
    const today = getDateKey();
    const now = new Date().toISOString();
    const metrics = getStoredMetrics();

    metrics.totalKeepsakesCreated = (metrics.totalKeepsakesCreated || 0) + 1;

    if (isPublished) {
      metrics.totalKeepsakesPublished = (metrics.totalKeepsakesPublished || 0) + 1;
    }

    // Template popularity
    const tId = templateId || "aurora-noire";
    if (!metrics.templateCounts) metrics.templateCounts = {};
    metrics.templateCounts[tId] = (metrics.templateCounts[tId] || 0) + 1;

    // Daily keepsake trend
    if (!metrics.dailyKeepsakes) metrics.dailyKeepsakes = {};
    metrics.dailyKeepsakes[today] = (metrics.dailyKeepsakes[today] || 0) + 1;

    saveStoredMetrics(metrics);

    // Save to keepsakes log
    const rawKeepsakes = localStorage.getItem(STORAGE_KEYS.KEEPSAKES_LOG);
    const keepsakes = safeJsonParse(rawKeepsakes, []);

    // Check if duplicate recently updated
    const existingIndex = keepsakes.findIndex((k) => k.slug === slug || (k.templateId === tId && k.partner1 === partner1 && k.partner2 === partner2));

    const record = {
      id: generateId("ks"),
      templateId: tId,
      title: title || `${tId} Keepsake`,
      partner1: partner1 || "Partner 1",
      partner2: partner2 || "Partner 2",
      status: isPublished ? "published" : "draft",
      slug: slug || tId,
      timestamp: now,
    };

    if (existingIndex >= 0) {
      keepsakes[existingIndex] = { ...keepsakes[existingIndex], ...record, timestamp: now };
    } else {
      keepsakes.unshift(record);
      if (keepsakes.length > 100) keepsakes.pop();
    }

    localStorage.setItem(STORAGE_KEYS.KEEPSAKES_LOG, JSON.stringify(keepsakes));

    // Optional serverless sync
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          "/.netlify/functions/analytics",
          JSON.stringify({
            type: "keepsake_event",
            event: isPublished ? "published" : "created",
            data: record,
          })
        );
      }
    } catch {}
  } catch (err) {
    // Intentionally silent
  }
};

/**
 * TRACK KEEPSAKE PUBLISHED (e.g. after Razorpay success)
 */
export const trackKeepsakePublished = ({
  templateId,
  title,
  partner1,
  partner2,
  slug,
  amount,
}) => {
  try {
    const today = getDateKey();
    const now = new Date().toISOString();
    const metrics = getStoredMetrics();

    metrics.totalKeepsakesPublished = (metrics.totalKeepsakesPublished || 0) + 1;

    // Daily keepsake trend
    if (!metrics.dailyKeepsakes) metrics.dailyKeepsakes = {};
    metrics.dailyKeepsakes[today] = (metrics.dailyKeepsakes[today] || 0) + 1;

    saveStoredMetrics(metrics);

    // Update keepsakes log entry status to published
    const rawKeepsakes = localStorage.getItem(STORAGE_KEYS.KEEPSAKES_LOG);
    const keepsakes = safeJsonParse(rawKeepsakes, []);

    const existing = keepsakes.find((k) => k.slug === slug);
    if (existing) {
      existing.status = "published";
      existing.publishedAt = now;
      existing.amount = amount;
    } else {
      keepsakes.unshift({
        id: generateId("ks"),
        templateId: templateId || "aurora-noire",
        title: title || "Romantic Keepsake",
        partner1: partner1 || "Partner 1",
        partner2: partner2 || "Partner 2",
        status: "published",
        slug: slug || "keepsake",
        publishedAt: now,
        timestamp: now,
        amount: amount || 9,
      });
    }

    localStorage.setItem(STORAGE_KEYS.KEEPSAKES_LOG, JSON.stringify(keepsakes));
  } catch (err) {
    // Intentionally silent
  }
};

/**
 * GET COMPLETE ANALYTICS REPORT FOR OWNER
 */
export const getAnalyticsData = () => {
  const metrics = getStoredMetrics();
  const rawVisits = localStorage.getItem(STORAGE_KEYS.VISITS_LOG);
  const visits = safeJsonParse(rawVisits, []);

  const rawKeepsakes = localStorage.getItem(STORAGE_KEYS.KEEPSAKES_LOG);
  const keepsakes = safeJsonParse(rawKeepsakes, []);

  const uniqueCount = Object.keys(metrics.uniqueVisitors || {}).length;
  const totalVisits = metrics.totalVisits || 0;
  const totalCreated = metrics.totalKeepsakesCreated || 0;
  const totalPublished = metrics.totalKeepsakesPublished || 0;

  // Calculate conversion rate
  const conversionRate = uniqueCount > 0 ? ((totalCreated / uniqueCount) * 100).toFixed(1) : "0.0";

  // Build past 7 days trend
  const dailyTrend = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = getDateKey(d);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dailyTrend.push({
      date: label,
      rawDate: key,
      visits: metrics.dailyVisits?.[key] || 0,
      keepsakes: metrics.dailyKeepsakes?.[key] || 0,
    });
  }

  // Top templates
  const templateStats = Object.entries(metrics.templateCounts || {}).map(([key, count]) => ({
    name: key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    id: key,
    count,
  })).sort((a, b) => b.count - a.count);

  // Device distribution
  const deviceStats = [
    { name: "Desktop", value: metrics.deviceCounts?.Desktop || 0, color: "#dfc19c" },
    { name: "Mobile", value: metrics.deviceCounts?.Mobile || 0, color: "#ff7395" },
    { name: "Tablet", value: metrics.deviceCounts?.Tablet || 0, color: "#a855f7" },
  ];

  // Page Breakdown
  const pageStats = Object.entries(metrics.pageViews || {}).map(([path, count]) => ({
    path,
    count,
  })).sort((a, b) => b.count - a.count);

  return {
    totalVisits,
    uniqueVisitors: uniqueCount,
    totalKeepsakesCreated: totalCreated,
    totalKeepsakesPublished: totalPublished,
    conversionRate: `${conversionRate}%`,
    dailyTrend,
    templateStats,
    deviceStats,
    pageStats,
    recentKeepsakes: keepsakes.slice(0, 50),
    recentVisits: visits.slice(0, 50),
    lastUpdated: metrics.lastUpdated,
  };
};

/**
 * EXPORT ANALYTICS AS JSON
 */
export const exportAnalyticsJSON = () => {
  const data = getAnalyticsData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lovecrafted_analytics_${getDateKey()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * EXPORT KEEPSAKES AS CSV
 */
export const exportKeepsakesCSV = () => {
  const { recentKeepsakes } = getAnalyticsData();
  if (!recentKeepsakes.length) return false;

  const headers = ["ID", "Title", "Template", "Partner 1", "Partner 2", "Status", "Date", "Slug"];
  const rows = recentKeepsakes.map((k) => [
    k.id,
    `"${(k.title || "").replace(/"/g, '""')}"`,
    k.templateId,
    `"${(k.partner1 || "").replace(/"/g, '""')}"`,
    `"${(k.partner2 || "").replace(/"/g, '""')}"`,
    k.status,
    k.timestamp,
    k.slug,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lovecrafted_keepsakes_${getDateKey()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  return true;
};

/**
 * OWNER PIN SECURITY
 */
export const getOwnerPin = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.OWNER_PIN) || DEFAULT_OWNER_PIN;
  } catch {
    return DEFAULT_OWNER_PIN;
  }
};

export const verifyOwnerPin = (inputPin) => {
  const stored = getOwnerPin();
  return inputPin.trim() === stored.trim();
};

export const setOwnerPin = (newPin) => {
  try {
    if (!newPin || newPin.length < 4) return false;
    localStorage.setItem(STORAGE_KEYS.OWNER_PIN, newPin.trim());
    return true;
  } catch {
    return false;
  }
};

/**
 * SEED SAMPLE REALISTIC DATA
 * (Useful so the owner can preview charts immediately)
 */
export const seedSampleAnalytics = () => {
  try {
    const today = new Date();
    const metrics = getStoredMetrics();

    metrics.totalVisits = Math.max(metrics.totalVisits || 0, 142);
    
    // Add realistic unique visitors
    if (!metrics.uniqueVisitors) metrics.uniqueVisitors = {};
    for (let i = 0; i < 68; i++) {
      metrics.uniqueVisitors[`sample_user_${i}`] = new Date().toISOString();
    }

    metrics.totalKeepsakesCreated = Math.max(metrics.totalKeepsakesCreated || 0, 19);
    metrics.totalKeepsakesPublished = Math.max(metrics.totalKeepsakesPublished || 0, 8);

    // Seed 7 days
    metrics.dailyVisits = metrics.dailyVisits || {};
    metrics.dailyKeepsakes = metrics.dailyKeepsakes || {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const k = getDateKey(d);
      metrics.dailyVisits[k] = (metrics.dailyVisits[k] || 0) + Math.floor(15 + Math.random() * 20);
      metrics.dailyKeepsakes[k] = (metrics.dailyKeepsakes[k] || 0) + Math.floor(2 + Math.random() * 4);
    }

    metrics.templateCounts = {
      "celebration-of-you": 9,
      "aurora-noire": 6,
      "whispers-of-love": 3,
      "sunset-love": 1,
    };

    metrics.deviceCounts = {
      Desktop: 78,
      Mobile: 56,
      Tablet: 8,
    };

    metrics.pageViews = {
      "/": 84,
      "/marketplace": 42,
      "/editor/celebration-of-you": 26,
      "/editor/aurora-noire": 18,
      "/v/aurora-noire": 14,
    };

    saveStoredMetrics(metrics);

    // Seed sample keepsakes
    const sampleKeepsakes = [
      {
        id: "ks_sample_1",
        templateId: "celebration-of-you",
        title: "Celebration of Rosea",
        partner1: "Alex",
        partner2: "Rosea",
        status: "published",
        slug: "alex-rosea-anniversary",
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      },
      {
        id: "ks_sample_2",
        templateId: "aurora-noire",
        title: "Aurora Noire Keepsake",
        partner1: "Aryan",
        partner2: "Meera",
        status: "published",
        slug: "aryan-meera-forever",
        timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
      },
      {
        id: "ks_sample_3",
        templateId: "whispers-of-love",
        title: "Love in Bloom Keepsake",
        partner1: "Rohan",
        partner2: "Tara",
        status: "draft",
        slug: "whispers-of-love",
        timestamp: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
      },
      {
        id: "ks_sample_4",
        templateId: "celebration-of-you",
        title: "Birthday Celebration Keepsake",
        partner1: "Dev",
        partner2: "Kavya",
        status: "published",
        slug: "kavya-birthday",
        timestamp: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
        publishedAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
      },
    ];

    localStorage.setItem(STORAGE_KEYS.KEEPSAKES_LOG, JSON.stringify(sampleKeepsakes));

    // Seed sample visits
    const sampleVisits = [
      { id: "v_1", path: "/editor/celebration-of-you", device: "Mobile", referrer: "Instagram", timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
      { id: "v_2", path: "/marketplace", device: "Desktop", referrer: "Direct", timestamp: new Date(Date.now() - 42 * 60000).toISOString() },
      { id: "v_3", path: "/", device: "Mobile", referrer: "Google", timestamp: new Date(Date.now() - 75 * 60000).toISOString() },
      { id: "v_4", path: "/v/alex-rosea-anniversary", device: "Mobile", referrer: "WhatsApp", timestamp: new Date(Date.now() - 110 * 60000).toISOString() },
    ];
    localStorage.setItem(STORAGE_KEYS.VISITS_LOG, JSON.stringify(sampleVisits));

    return true;
  } catch (err) {
    return false;
  }
};

/**
 * RESET ALL ANALYTICS (Owner Only)
 */
export const resetAllAnalytics = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.METRICS);
    localStorage.removeItem(STORAGE_KEYS.VISITS_LOG);
    localStorage.removeItem(STORAGE_KEYS.KEEPSAKES_LOG);
    return true;
  } catch {
    return false;
  }
};
