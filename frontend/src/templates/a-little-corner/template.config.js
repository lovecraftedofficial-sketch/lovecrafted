/**
 * A Little Corner - Premium Intimate Comfort Template Configuration
 * ---------------------------------------------------------------
 * Codename: A Little Corner
 * Price: ₹2,999 INR
 * Tier: Bespoke Comfort
 */

const aLittleCornerConfig = {
  id: "a-little-corner",
  slug: "a-little-corner",
  name: "A Little Corner",
  category: "Romantic",
  occasions: ["anniversary", "birthday", "comfort", "just-because"],
  tier: "Bespoke Comfort",
  price: 2999,
  currency: "INR",
  description:
    "A deeply personal, comforting, and intimate digital safe haven for the person you love. Featuring a random love note generator (50+ editable notes), daily self-care checklist, song player with Spotify support, interactive reasons flip cards, open-when comfort cards, polaroid gallery, and an unwrap envelope letter.",
  coverImage:
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=80",
  features: [
    "Deeply Personal Intimate Comfort Experience",
    "Single-Page Natural Document Scrolling",
    "Random Love Note Generator (50+ Editable Notes)",
    "Interactive Daily Self-Care Checklist (Resets Daily)",
    "Custom Music Player with Spotify Embed & Local Audio",
    "Tactile Flip Card Reasons Collection",
    "Open When... Expandable Comfort Cards",
    "Editorial Polaroid Memory Gallery & Lightbox",
    "Unfolding Parchment Private Love Letter",
  ],
  editorType: "sections",
  editorSections: [
    {
      id: "hero",
      label: "Hero",
      keys: ["partnerName", "senderName", "heroGreeting", "heroHeadline", "heroSubtext", "heroImage", "heroBadge"]
    },
    {
      id: "note",
      label: "Today's Little Note",
      keys: ["noteSectionTitle", "noteSectionSubtitle", "noteSignature"]
    },
    {
      id: "care",
      label: "Little Care Corner",
      keys: ["careSectionTitle", "careSectionSubtitle", "careItem1", "careItem2", "careItem3", "careItem4", "careItem5", "careItem6"]
    },
    {
      id: "songs",
      label: "Our Sanctuary Songs",
      keys: ["songsSectionTitle", "songsSectionSubtitle", "featuredSongTitle", "featuredSongArtist", "featuredSongUrl", "featuredSongCover"]
    },
    {
      id: "reasons",
      label: "Reasons I Love You",
      keys: ["reasonsSectionTitle", "reasonsSectionSubtitle", "reason1Title", "reason1Text", "reason2Title", "reason2Text", "reason3Title", "reason3Text", "reason4Title", "reason4Text"]
    },
    {
      id: "openwhen",
      label: "Open When...",
      keys: ["openSectionTitle", "openSectionSubtitle", "open1Title", "open1Text", "open2Title", "open2Text", "open3Title", "open3Text"]
    },
    {
      id: "gallery",
      label: "Memory Gallery",
      keys: ["gallerySectionTitle", "gallerySectionSubtitle", "photo1Url", "photo1Title", "photo1Date", "photo2Url", "photo2Title", "photo2Date"]
    },
    {
      id: "letter",
      label: "Private Letter",
      keys: ["letterSectionTitle", "letterHeading", "letterBody", "letterSignature"]
    },
    {
      id: "ending",
      label: "Ending",
      keys: ["endingMessage", "endingCoda", "bgMusicUrl"]
    }
  ],
  editableSchema: [
    // SECTION 1: HERO
    { key: "partnerName", label: "Partner Name / Beloved", type: "text", defaultValue: "Ananya" },
    { key: "senderName", label: "Your Name", type: "text", defaultValue: "Rahul" },
    { key: "heroGreeting", label: "Hero Personalized Greeting", type: "text", defaultValue: "Welcome to your safe space," },
    { key: "heroHeadline", label: "Hero Romantic Headline", type: "text", defaultValue: "I made a little corner on the internet just for you." },
    { key: "heroSubtext", label: "Hero Intro Paragraph", type: "textarea", defaultValue: "Whenever the world gets too loud, or you need a quiet reminder of how deeply you are cherished, come here. I'm always right beside you." },
    { key: "heroImage", label: "Hero Portrait Image URL", type: "image", defaultValue: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80" },
    { key: "heroBadge", label: "Hero Floating Badge Label", type: "text", defaultValue: "Your Safe Haven · Forever" },

    // SECTION 2: TODAY'S LITTLE NOTE
    { key: "noteSectionTitle", label: "Note Section Title", type: "text", defaultValue: "Today's Little Note" },
    { key: "noteSectionSubtitle", label: "Note Section Subtitle", type: "text", defaultValue: "A random whisper of love picked just for this moment." },
    { key: "noteSignature", label: "Note Handwritten Signature", type: "text", defaultValue: "Forever yours, Rahul ❤️" },

    // SECTION 3: CARE CORNER
    { key: "careSectionTitle", label: "Care Corner Title", type: "text", defaultValue: "Little Care Corner" },
    { key: "careSectionSubtitle", label: "Care Corner Subtitle", type: "text", defaultValue: "Your gentle daily reminders. Check them off as you take care of yourself today." },
    { key: "careItem1", label: "Care Checklist Item 1", type: "text", defaultValue: "Drink a warm glass of water 💧" },
    { key: "careItem2", label: "Care Checklist Item 2", type: "text", defaultValue: "Eat a nourishing meal 🍲" },
    { key: "careItem3", label: "Care Checklist Item 3", type: "text", defaultValue: "Take a 5-minute quiet break 🌸" },
    { key: "careItem4", label: "Care Checklist Item 4", type: "text", defaultValue: "Stretch your body gently 🧘" },
    { key: "careItem5", label: "Care Checklist Item 5", type: "text", defaultValue: "Give yourself a soft smile 😊" },
    { key: "careItem6", label: "Care Checklist Item 6", type: "text", defaultValue: "Promise to rest early tonight 🌙" },

    // SECTION 4: OUR SONGS
    { key: "songsSectionTitle", label: "Songs Section Title", type: "text", defaultValue: "Our Sanctuary Songs" },
    { key: "songsSectionSubtitle", label: "Songs Section Subtitle", type: "text", defaultValue: "Press play whenever you want to feel like we're sharing earphones." },
    { key: "featuredSongTitle", label: "Featured Song Title", type: "text", defaultValue: "Golden Hour Romance" },
    { key: "featuredSongArtist", label: "Featured Song Artist", type: "text", defaultValue: "Our Acoustic Playlist" },
    { key: "featuredSongUrl", label: "Featured Song Provider / URL", type: "song-url", defaultValue: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT" },
    { key: "featuredSongCover", label: "Featured Song Album Cover", type: "image", defaultValue: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80" },

    // SECTION 5: REASONS I LOVE YOU
    { key: "reasonsSectionTitle", label: "Reasons Section Title", type: "text", defaultValue: "Reasons I Love You" },
    { key: "reasonsSectionSubtitle", label: "Reasons Section Subtitle", type: "text", defaultValue: "Tap any card to uncover a quiet truth." },
    { key: "reason1Title", label: "Reason 1 Title", type: "text", defaultValue: "Your Kindness" },
    { key: "reason1Text", label: "Reason 1 Message", type: "textarea", defaultValue: "The soft, effortless way you care for everyone around you without expecting anything in return." },
    { key: "reason2Title", label: "Reason 2 Title", type: "text", defaultValue: "Your Morning Smile" },
    { key: "reason2Text", label: "Reason 2 Message", type: "textarea", defaultValue: "How your eyes crinkle before you even say a word when you wake up." },
    { key: "reason3Title", label: "Reason 3 Title", type: "text", defaultValue: "Your Laugh" },
    { key: "reason3Text", label: "Reason 3 Message", type: "textarea", defaultValue: "It instantly fills any room with warmth and makes all my worries dissolve." },
    { key: "reason4Title", label: "Reason 4 Title", type: "text", defaultValue: "Our Silence" },
    { key: "reason4Text", label: "Reason 4 Message", type: "textarea", defaultValue: "Even when we don't speak a single word, being in the same room with you feels completely whole." },

    // SECTION 6: OPEN WHEN...
    { key: "openSectionTitle", label: "Open When Title", type: "text", defaultValue: "Open When..." },
    { key: "openSectionSubtitle", label: "Open When Subtitle", type: "text", defaultValue: "Written long before you needed them. Tap an envelope whenever your heart asks for it." },
    { key: "open1Title", label: "Open When 1 Title", type: "text", defaultValue: "Open when you miss me..." },
    { key: "open1Text", label: "Open When 1 Note", type: "textarea", defaultValue: "Close your eyes for three seconds. Take a deep, slow breath. Wherever I am right now, I am thinking of you too. My hand is right inside yours." },
    { key: "open2Title", label: "Open When 2 Title", type: "text", defaultValue: "Open when you're sad..." },
    { key: "open2Text", label: "Open When 2 Note", type: "textarea", defaultValue: "It is okay to rest. You don't have to carry everything alone. Let me hold the weight for a little while." },
    { key: "open3Title", label: "Open When 3 Title", type: "text", defaultValue: "Open when you can't sleep..." },
    { key: "open3Text", label: "Open When 3 Note", type: "textarea", defaultValue: "Breathe in softly. Picture us sitting together on a quiet porch under a million quiet stars. Goodnight my love." },

    // SECTION 7: MEMORY GALLERY
    { key: "gallerySectionTitle", label: "Gallery Section Title", type: "text", defaultValue: "Our Treasured Moments" },
    { key: "gallerySectionSubtitle", label: "Gallery Section Subtitle", type: "text", defaultValue: "Snapshots of peace, laughter, and quiet happiness." },
    { key: "photo1Url", label: "Photo 1 Image", type: "image", defaultValue: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80" },
    { key: "photo1Title", label: "Photo 1 Title", type: "text", defaultValue: "Sunset Walk" },
    { key: "photo1Date", label: "Photo 1 Date", type: "text", defaultValue: "October 14, 2025" },
    { key: "photo2Url", label: "Photo 2 Image", type: "image", defaultValue: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80" },
    { key: "photo2Title", label: "Photo 2 Title", type: "text", defaultValue: "Coffee Afternoon" },
    { key: "photo2Date", label: "Photo 2 Date", type: "text", defaultValue: "November 02, 2025" },

    // SECTION 8: PRIVATE LETTER
    { key: "letterSectionTitle", label: "Private Letter Title", type: "text", defaultValue: "A Letter Saved For You" },
    { key: "letterHeading", label: "Letter Opening Heading", type: "text", defaultValue: "My Dearest Ananya," },
    { key: "letterBody", label: "Full Letter Content", type: "textarea", defaultValue: "I built this quiet corner of the world because you deserve a place that is gentle to you.\n\nLife gets busy and loud, but in here, time slows down. I hope every word, note, and song in this little corner reminds you how deeply, effortlessly, and unconditionally you are loved.\n\nWhenever you need a hug, come back here." },
    { key: "letterSignature", label: "Letter Signature Line", type: "text", defaultValue: "Yours Always & Forever, Rahul ❤️" },

    // SECTION 9: ENDING
    { key: "endingMessage", label: "Final Ending Message", type: "textarea", defaultValue: "This little corner will always be here for you." },
    { key: "endingCoda", label: "Final Footer Line", type: "text", defaultValue: "Made with love for Ananya ❤️" },
    { key: "bgMusicUrl", label: "Background Ambience Audio", type: "audio", defaultValue: "/audio/romantic.mp3" },
  ],
  demoData: {
    partnerName: "Ananya",
    senderName: "Rahul",
    heroGreeting: "Welcome to your safe space,",
    heroHeadline: "I made a little corner on the internet just for you.",
    heroSubtext: "Whenever the world gets too loud, or you need a quiet reminder of how deeply you are cherished, come here. I'm always right beside you.",
    heroImage: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80",
    heroBadge: "Your Safe Haven · Forever",

    noteSectionTitle: "Today's Little Note",
    noteSectionSubtitle: "A random whisper of love picked just for this moment.",
    noteSignature: "Forever yours, Rahul ❤️",

    careSectionTitle: "Little Care Corner",
    careSectionSubtitle: "Your gentle daily reminders. Check them off as you take care of yourself today.",
    careItem1: "Drink a warm glass of water 💧",
    careItem2: "Eat a nourishing meal 🍲",
    careItem3: "Take a 5-minute quiet break 🌸",
    careItem4: "Stretch your body gently 🧘",
    careItem5: "Give yourself a soft smile 😊",
    careItem6: "Promise to rest early tonight 🌙",

    songsSectionTitle: "Our Sanctuary Songs",
    songsSectionSubtitle: "Press play whenever you want to feel like we're sharing earphones.",
    featuredSongTitle: "Golden Hour Romance",
    featuredSongArtist: "Our Acoustic Playlist",
    featuredSongUrl: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
    featuredSongCover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",

    reasonsSectionTitle: "Reasons I Love You",
    reasonsSectionSubtitle: "Tap any card to uncover a quiet truth.",
    reason1Title: "Your Kindness",
    reason1Text: "The soft, effortless way you care for everyone around you without expecting anything in return.",
    reason2Title: "Your Morning Smile",
    reason2Text: "How your eyes crinkle before you even say a word when you wake up.",
    reason3Title: "Your Laugh",
    reason3Text: "It instantly fills any room with warmth and makes all my worries dissolve.",
    reason4Title: "Our Silence",
    reason4Text: "Even when we don't speak a single word, being in the same room with you feels completely whole.",

    openSectionTitle: "Open When...",
    openSectionSubtitle: "Written long before you needed them. Tap an envelope whenever your heart asks for it.",
    open1Title: "Open when you miss me...",
    open1Text: "Close your eyes for three seconds. Take a deep, slow breath. Wherever I am right now, I am thinking of you too. My hand is right inside yours.",
    open2Title: "Open when you're sad...",
    open2Text: "It is okay to rest. You don't have to carry everything alone. Let me hold the weight for a little while.",
    open3Title: "Open when you can't sleep...",
    open3Text: "Breathe in softly. Picture us sitting together on a quiet porch under a million quiet stars. Goodnight my love.",

    gallerySectionTitle: "Our Treasured Moments",
    gallerySectionSubtitle: "Snapshots of peace, laughter, and quiet happiness.",
    photo1Url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
    photo1Title: "Sunset Walk",
    photo1Date: "October 14, 2025",
    photo2Url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    photo2Title: "Coffee Afternoon",
    photo2Date: "November 02, 2025",

    letterSectionTitle: "A Letter Saved For You",
    letterHeading: "My Dearest Ananya,",
    letterBody: "I built this quiet corner of the world because you deserve a place that is gentle to you.\n\nLife gets busy and loud, but in here, time slows down. I hope every word, note, and song in this little corner reminds you how deeply, effortlessly, and unconditionally you are loved.\n\nWhenever you need a hug, come back here.",
    letterSignature: "Yours Always & Forever, Rahul ❤️",

    endingMessage: "This little corner will always be here for you.",
    endingCoda: "Made with love for Ananya ❤️",
    bgMusicUrl: "/audio/romantic.mp3",
  },
};

export default aLittleCornerConfig;
