import {
    Heart,
    Sparkles,
    Crown,
    Cake,
    GraduationCap,
    Compass,
    Users,
    Smile,
    Trophy,
    Clock
} from "lucide-react";

/**
 * Single Source of Truth for LoveCrafted Occasions
 * ------------------------------------------------
 * Easily toggle `isActive: true/false` to control visible occasion filters across the marketplace.
 */
export const OCCASIONS = [
    {
        id: "anniversary",
        name: "Anniversary",
        slug: "anniversary",
        icon: Heart,
        color: "rose",
        shortDescription: "Celebrate your milestone journey & timeless love together",
        heroImage: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80",
        isComingSoon: false,
        isActive: true,
    },
    {
        id: "proposal",
        name: "Proposal",
        slug: "proposal",
        icon: Sparkles,
        color: "amber",
        shortDescription: "Create a magical, unforgettable 'Will You Marry Me?' moment",
        heroImage: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80",
        isComingSoon: false,
        isActive: true,
    },
    {
        id: "wedding",
        name: "Wedding",
        slug: "wedding",
        icon: Crown,
        color: "purple",
        shortDescription: "Share your royal wedding story, schedule & memories with guests",
        heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
        isComingSoon: false,
        isActive: true,
    },
    {
        id: "birthday",
        name: "Birthday",
        slug: "birthday",
        icon: Cake,
        color: "pink",
        shortDescription: "Surprise your favorite person with a dazzling birthday keepsake",
        heroImage: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80",
        isComingSoon: false,
        isActive: true,
    },
    {
        id: "long-distance",
        name: "Long Distance",
        slug: "long-distance",
        icon: Compass,
        color: "cyan",
        shortDescription: "Bridge the miles with open-when notes & romantic timelines",
        heroImage: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=1200&q=80",
        isComingSoon: false,
        isActive: true,
    },
    {
        id: "graduation",
        name: "Graduation",
        slug: "graduation",
        icon: GraduationCap,
        color: "blue",
        shortDescription: "Commemorate academic success & big dreams achieved",
        heroImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
        isComingSoon: false,
        isActive: false,
    },
    {
        id: "parents",
        name: "Parents & Family",
        slug: "parents",
        icon: Users,
        color: "emerald",
        shortDescription: "Honor Mom, Dad & family with a heartwarming tribute",
        heroImage: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80",
        isComingSoon: false,
        isActive: false,
    },
    {
        id: "friendship",
        name: "Friendship",
        slug: "friendship",
        icon: Smile,
        color: "yellow",
        shortDescription: "Celebrate endless laughs, late-night chats & bestie memories",
        heroImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
        isComingSoon: false,
        isActive: false,
    },
    {
        id: "promotion",
        name: "Promotion & Career",
        slug: "promotion",
        icon: Trophy,
        color: "orange",
        shortDescription: "Cheer on career milestones, promotions & new chapters",
        heroImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
        isComingSoon: false,
        isActive: false,
    },
    {
        id: "coming-soon",
        name: "Coming Soon",
        slug: "coming-soon",
        icon: Clock,
        color: "fuchsia",
        shortDescription: "Preview upcoming luxury keepsakes currently in development",
        heroImage: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80",
        isComingSoon: true,
        isActive: false,
    },
];

/**
 * Get active occasions only (for filters and navigation)
 */
export function getActiveOccasions() {
    return OCCASIONS.filter((o) => o.isActive);
}

/**
 * Get occasion metadata by slug or ID
 */
export function getOccasionBySlug(slug) {
    if (!slug) return null;
    return OCCASIONS.find((o) => o.slug === slug || o.id === slug) || null;
}

/**
 * Helper to dynamically calculate template counts for each occasion
 */
export function getOccasionCounts(templates = []) {
    const counts = {};
    OCCASIONS.forEach((o) => {
        counts[o.id] = 0;
    });

    templates.forEach((template) => {
        const config = template?.config || {};
        const templateOccasions = config.occasions || (config.category ? [config.category.toLowerCase()] : []);

        templateOccasions.forEach((occId) => {
            const normalizedId = occId.toLowerCase().replace(/\s+/g, "-");
            if (counts[normalizedId] !== undefined) {
                counts[normalizedId] += 1;
            } else if (normalizedId === "romantic") {
                // Map legacy "romantic" category to anniversary & proposal
                counts["anniversary"] = (counts["anniversary"] || 0) + 1;
            }
        });
    });

    return counts;
}
