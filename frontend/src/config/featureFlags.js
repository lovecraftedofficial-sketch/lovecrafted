/**
 * LoveCrafted Production Feature Flags
 * -------------------------------------
 * Centralized feature toggles to safely enable/disable modules
 * without removing underlying production code.
 */

export const FEATURE_FLAGS = {
    ENABLE_PASSWORD_PROTECTION: process.env.REACT_APP_ENABLE_PASSWORD_PROTECTION !== "false",
    ENABLE_ADVANCED_AUDIO_MANAGER: process.env.REACT_APP_ENABLE_ADVANCED_AUDIO_MANAGER !== "false",
    ENABLE_ANALYTICS_HOOKS: process.env.REACT_APP_ENABLE_ANALYTICS_HOOKS !== "false",
};

export function isFeatureEnabled(flagName) {
    return Boolean(FEATURE_FLAGS[flagName]);
}
