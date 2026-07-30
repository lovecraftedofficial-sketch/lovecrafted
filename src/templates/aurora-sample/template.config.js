/**
 * Aurora Sample — Generic Demo Template
 * -------------------------------------------------------------
 * This is a PLATFORM DEMO TEMPLATE only. Its purpose is to
 * exercise every editable field type supported by the platform.
 *
 * All content in `demoData` is FICTIONAL and generic.
 * Images point to Unsplash generic placeholder photography.
 *
 * When adding a real template later:
 *   1. Copy this folder as `src/templates/<your-slug>/`
 *   2. Rewrite the template React component with your design.
 *   3. Update this config (id, slug, name, price, features, schema, demoData).
 *   4. Register it in `src/data/templateRegistry.js`.
 */

/** @type {import("../../types/templateTypes").TemplateConfig} */
const auroraSampleConfig = {
    id: "aurora-sample",
    slug: "aurora-sample",
    name: "Aurora Sample",
    category: "Demo",
    tier: "Premium",
    price: 1999,
    currency: "INR",
    description:
        "A generic demo template used to validate the Love Website Studio platform architecture. Exercises every editable field type — text, image, memories, reasons, open-when messages, and music.",
    coverImage:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
    previewImages: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1600&q=80",
    ],
    features: [
        "Custom hero message",
        "Daily love note",
        "Memory gallery",
        "Reasons list",
        "Open-when messages",
        "Music integration",
        "Handwritten love letter",
    ],

    // Fields the customer is allowed to edit — the source of truth.
    editableSchema: [
        {
            key: "partnerName",
            type: "text",
            label: "Partner's Name",
            required: true,
            maxLength: 50,
            placeholder: "Aarohi",
        },
        {
            key: "creatorName",
            type: "text",
            label: "Your Name",
            required: true,
            maxLength: 50,
            placeholder: "Someone Special",
        },
        {
            key: "heroMessage",
            type: "textarea",
            label: "Main Love Message",
            maxLength: 500,
            placeholder:
                "A little corner of the internet made just for you.",
        },
        {
            key: "relationshipDate",
            type: "date",
            label: "Relationship Start Date",
        },
        {
            key: "heroImage",
            type: "image",
            label: "Hero Photo",
        },
        {
            key: "accentTheme",
            type: "color-option",
            label: "Accent Theme",
            options: [
                { value: "blush", label: "Blush Pink", swatch: "#f8b5c4" },
                { value: "gold", label: "Warm Gold", swatch: "#d4a574" },
                { value: "burgundy", label: "Burgundy", swatch: "#6a1730" },
            ],
            default: "blush",
        },
        {
            key: "loveNote",
            type: "textarea",
            label: "Daily Love Note",
            maxLength: 300,
            placeholder: "You make ordinary days feel special.",
        },
        {
            key: "reasons",
            type: "repeatable-text",
            label: "Reasons I Love You",
            maxItems: 20,
            itemPlaceholder: "Because…",
        },
        {
            key: "memories",
            type: "memory-list",
            label: "Our Memories",
            maxItems: 15,
            fields: [
                { key: "image", type: "image", label: "Memory Photo" },
                {
                    key: "caption",
                    type: "text",
                    label: "Caption",
                    maxLength: 200,
                },
                { key: "date", type: "date", label: "Date" },
            ],
        },
        {
            key: "openWhenMessages",
            type: "repeatable-content",
            label: "Open When Messages",
            maxItems: 10,
            fields: [
                {
                    key: "title",
                    type: "text",
                    label: "Open When…",
                    maxLength: 80,
                    placeholder: "Open when you miss me",
                },
                {
                    key: "message",
                    type: "textarea",
                    label: "Message",
                    maxLength: 1000,
                },
            ],
        },
        {
            key: "songUrl",
            type: "song-url",
            label: "Our Song",
            hint: "Paste a Spotify, YouTube or Apple Music link — or upload an .mp3 / .m4a for temporary local preview.",
        },
        {
            key: "loveLetter",
            type: "textarea",
            label: "Love Letter",
            maxLength: 5000,
            placeholder:
                "This space was created to hold a few beautiful memories and words meant only for you.",
        },
    ],

    // Fictional, generic defaults. NEVER edit these to look like a real person.
    demoData: {
        partnerName: "Aarohi",
        creatorName: "Someone Special",
        heroMessage:
            "A little corner of the internet made just for you.",
        relationshipDate: "2023-02-14",
        heroImage:
            "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80",
        accentTheme: "blush",
        loveNote: "You make ordinary days feel special.",
        reasons: [
            "Because you laugh at your own jokes",
            "Because coffee tastes better when you're around",
            "Because you dance in the kitchen",
            "Because your kindness is quiet and steady",
        ],
        memories: [
            {
                image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1200&q=80",
                caption: "The evening we walked forever",
                date: "2023-06-11",
            },
            {
                image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80",
                caption: "Rainy day, warm chai",
                date: "2023-08-22",
            },
            {
                image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1200&q=80",
                caption: "That golden hour on the terrace",
                date: "2023-10-04",
            },
        ],
        openWhenMessages: [
            {
                title: "Open when you miss me",
                message:
                    "Close your eyes for a moment. I'm thinking of you too — probably at the exact same second.",
            },
            {
                title: "Open when you can't sleep",
                message:
                    "Breathe slowly. Picture our favourite quiet place. I'm right there beside you.",
            },
            {
                title: "Open when you need a laugh",
                message:
                    "Remember that time we tried to make pasta and set off the smoke alarm? Yeah. That.",
            },
        ],
        songUrl: {
            kind: "url",
            url: "https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp",
        },
        loveLetter:
            "This space was created to hold a few beautiful memories and words meant only for you. It isn't perfect — nothing worth keeping ever is — but it is honest, and it is yours. Come back to it on the days that feel heavy. Come back to it on the days that feel bright. And know that whatever version of you shows up, there's someone on the other side of these pages who is quietly, completely, ridiculously proud of you.",
    },
};

export default auroraSampleConfig;
