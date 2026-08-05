/**
 * LoveCrafted Analytics Event Dispatcher
 * ---------------------------------------
 * Modular callback interface for tracking product interactions.
 * Connects to Google Analytics, Mixpanel, PostHog, or custom backends without modifying UI modules.
 */

import { isFeatureEnabled } from "@/config/featureFlags";

const eventListeners = new Set();

export function registerAnalyticsListener(listener) {
    if (typeof listener === "function") {
        eventListeners.add(listener);
    }
    return () => eventListeners.delete(listener);
}

export function trackAnalyticsEvent(eventName, payload = {}) {
    if (!isFeatureEnabled("ENABLE_ANALYTICS_HOOKS")) return;

    const event = {
        eventName,
        payload,
        timestamp: new Date().toISOString(),
    };

    if (process.env.NODE_ENV === "development") {
        console.log("[LoveCrafted Analytics]:", eventName, payload);
    }

    eventListeners.forEach((listener) => {
        try {
            listener(event);
        } catch (err) {
            console.warn("[Analytics Listener Error]:", err);
        }
    });
}
