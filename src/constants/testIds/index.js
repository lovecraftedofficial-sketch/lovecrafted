/**
 * Centralized data-testid constants for Love Website Studio.
 * Grouped by surface. Keep kebab-case and describe function, not style.
 */

export const NAV = {
    root: "app-navbar",
    logo: "nav-logo",
    linkHome: "nav-link-home",
    linkTemplates: "nav-link-templates",
    linkDashboard: "nav-link-dashboard",
    ctaExplore: "nav-cta-explore",
};

export const LANDING = {
    root: "landing-page",
    heroTitle: "landing-hero-title",
    heroExploreBtn: "landing-hero-explore-btn",
    heroHowItWorksBtn: "landing-hero-how-btn",
    featuredSection: "landing-featured-section",
    howItWorksSection: "landing-how-section",
    whySection: "landing-why-section",
    tiersSection: "landing-tiers-section",
    testimonialsSection: "landing-testimonials-section",
    faqSection: "landing-faq-section",
    finalCtaBtn: "landing-final-cta-btn",
};

export const MARKETPLACE = {
    root: "marketplace-page",
    filterCategory: "marketplace-filter-category",
    filterTier: "marketplace-filter-tier",
    filterPrice: "marketplace-filter-price",
    grid: "marketplace-grid",
    card: (slug) => `marketplace-card-${slug}`,
    cardPreviewBtn: (slug) => `marketplace-card-preview-${slug}`,
    cardCreateBtn: (slug) => `marketplace-card-create-${slug}`,
    emptyState: "marketplace-empty",
};

export const TEMPLATE_DETAILS = {
    root: "template-details-page",
    title: "template-details-title",
    previewFrame: "template-details-preview",
    createBtn: "template-details-create-btn",
    featureList: "template-details-features",
    notFound: "template-details-not-found",
};

export const DASHBOARD = {
    root: "dashboard-page",
    newSiteBtn: "dashboard-new-site-btn",
    websiteCard: (id) => `dashboard-website-card-${id}`,
    editBtn: (id) => `dashboard-edit-btn-${id}`,
    previewBtn: (id) => `dashboard-preview-btn-${id}`,
    empty: "dashboard-empty",
};

export const EDITOR = {
    root: "template-editor",
    tabsEdit: "editor-tab-edit",
    tabsPreview: "editor-tab-preview",
    saveBtn: "editor-save-btn",
    resetBtn: "editor-reset-btn",
    exitBtn: "editor-exit-btn",
    previewFrame: "editor-preview-frame",
    fieldsPanel: "editor-fields-panel",
    fieldWrapper: (key) => `editor-field-${key}`,
    field: {
        text: (key) => `field-text-${key}`,
        textarea: (key) => `field-textarea-${key}`,
        date: (key) => `field-date-${key}`,
        image: (key) => `field-image-${key}`,
        imageFileInput: (key) => `field-image-input-${key}`,
        imageRemoveBtn: (key) => `field-image-remove-${key}`,
        imageReplaceBtn: (key) => `field-image-replace-${key}`,
        colorOption: (key) => `field-color-${key}`,
        repeatableText: (key) => `field-rtext-${key}`,
        repeatableTextAdd: (key) => `field-rtext-add-${key}`,
        repeatableTextItem: (key, i) => `field-rtext-item-${key}-${i}`,
        repeatableTextItemRemove: (key, i) => `field-rtext-remove-${key}-${i}`,
        repeatableTextItemUp: (key, i) => `field-rtext-up-${key}-${i}`,
        repeatableTextItemDown: (key, i) => `field-rtext-down-${key}-${i}`,
        memoryList: (key) => `field-memory-${key}`,
        memoryAdd: (key) => `field-memory-add-${key}`,
        memoryItem: (key, i) => `field-memory-item-${key}-${i}`,
        memoryItemRemove: (key, i) => `field-memory-remove-${key}-${i}`,
        memoryItemUp: (key, i) => `field-memory-up-${key}-${i}`,
        memoryItemDown: (key, i) => `field-memory-down-${key}-${i}`,
        repeatableContent: (key) => `field-rcontent-${key}`,
        repeatableContentAdd: (key) => `field-rcontent-add-${key}`,
        repeatableContentItem: (key, i) => `field-rcontent-item-${key}-${i}`,
        repeatableContentRemove: (key, i) =>
            `field-rcontent-remove-${key}-${i}`,
        repeatableContentUp: (key, i) => `field-rcontent-up-${key}-${i}`,
        repeatableContentDown: (key, i) => `field-rcontent-down-${key}-${i}`,
        songUrl: (key) => `field-song-${key}`,
        songUrlInput: (key) => `field-song-url-${key}`,
        songLocalFile: (key) => `field-song-local-${key}`,
        songClear: (key) => `field-song-clear-${key}`,
    },
};

export const HOME = {
    emergentLink: "emergent-link",
};
