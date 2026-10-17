export const whispersOfLoveConfig = {
  id: "whispers-of-love",
  slug: "whispers-of-love",
  name: "Love in Bloom 🌸",
  category: "Romantic",
  tier: "Flagship",
  price: 9,
  currency: "INR",
  description:
    "An enchanting romantic website suite featuring soft pastel hero, starry night quote, Garden of Love rose picker, animated love letter, 3D Polaroid memories, and grand poem forever promises.",
  coverImage:
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1600&q=80",
  features: [
    "Love in Bloom Soft Hero",
    "Starry Night Moonlit Scene",
    "Interactive 'Garden of Love' Rose Picker",
    "Animated Envelope & Notebook Love Letter",
    "3D Polaroid Memories Stack",
    "Grand Love Poem & 3 Forever Promises Cards",
    "Custom Background Soundtrack & Falling Petals",
  ],
  editableSchema: [
    // Page 1: Hero & Soundtrack
    { section: "Page 1: Hero & Background Music", sectionIcon: "🌸", key: "bgMusicUrl", label: "Background Music URL (Spotify / Saavn / MP3 Link)", type: "text", defaultValue: "https://open.spotify.com/track/1wgJy9zGdOLRHGEkzpD5f0?si=8f0528522b574c5e" },
    { section: "Page 1: Hero & Background Music", sectionIcon: "🌸", key: "songTitle", label: "Music Track Name", type: "text", defaultValue: "Saiyonee · Hiten & Ritika Raj" },
    { section: "Page 1: Hero & Background Music", sectionIcon: "🌸", key: "heroSubtitle", label: "Page 1 Badge / Subtitle", type: "text", defaultValue: "A LOVE STORY" },
    { section: "Page 1: Hero & Background Music", sectionIcon: "🌸", key: "heroTitle", label: "Page 1 Main Title", type: "text", defaultValue: "Love in Bloom 🌸" },
    { section: "Page 1: Hero & Background Music", sectionIcon: "🌸", key: "heroQuote", label: "Page 1 Subtitle Quote", type: "text", defaultValue: "Every love story is beautiful..." },
    { section: "Page 1: Hero & Background Music", sectionIcon: "🌸", key: "heroScrollText", label: "Scroll Prompt Text", type: "text", defaultValue: "Scroll to begin the journey" },

    // Page 2: Night Quote
    { section: "Page 2: Starry Night Quote", sectionIcon: "🌌", key: "nightQuote", label: "Page 2 Main Night Quote", type: "text", defaultValue: "“In the quiet of the night, I found you.”" },
    { section: "Page 2: Starry Night Quote", sectionIcon: "🌌", key: "nightSubQuote", label: "Page 2 Subtitle Quote", type: "text", defaultValue: "You became my favorite chapter." },

    // Page 3: Garden of Love
    { section: "Page 3: Garden of Love", sectionIcon: "🌹", key: "gardenSub", label: "Page 3 Subtitle Badge", type: "text", defaultValue: "OUR GARDEN" },
    { section: "Page 3: Garden of Love", sectionIcon: "🌹", key: "gardenTitle", label: "Page 3 Main Title", type: "text", defaultValue: "Garden of Love" },

    // Page 4: Love Letter
    { section: "Page 4: Animated Love Letter", sectionIcon: "💌", key: "letterSub", label: "Page 4 Subtitle Badge", type: "text", defaultValue: "A MESSAGE FOR YOU" },
    { section: "Page 4: Animated Love Letter", sectionIcon: "💌", key: "letterTitle", label: "Page 4 Main Title", type: "text", defaultValue: "The Love Letter" },
    { section: "Page 4: Animated Love Letter", sectionIcon: "💌", key: "letterTo", label: "Letter Recipient Header", type: "text", defaultValue: "To You, My Love..." },
    {
      section: "Page 4: Animated Love Letter",
      sectionIcon: "💌",
      key: "letterBody",
      label: "Full Love Letter Content",
      type: "textarea",
      defaultValue:
        "There are not enough words in any language to describe what you mean to me. You are the warmth of the morning sun, the calm of a quiet night, and the joy in between. Every day with you feels like a beautiful dream I never want to wake up from. You have changed my world in the most wonderful way, and I am so grateful that our paths crossed. Thank you for loving me.",
    },

    // Page 5: Our Memories
    { section: "Page 5: 3D Polaroid Memories", sectionIcon: "📸", key: "memoriesSub", label: "Page 5 Subtitle Badge", type: "text", defaultValue: "CAPTURED MOMENTS" },
    { section: "Page 5: 3D Polaroid Memories", sectionIcon: "📸", key: "memoriesTitle", label: "Page 5 Main Title", type: "text", defaultValue: "Our Memories" },
    { section: "Page 5: 3D Polaroid Memories", sectionIcon: "📸", key: "card1Image", label: "Memory 1 Photo URL", type: "text", defaultValue: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80" },
    { section: "Page 5: 3D Polaroid Memories", sectionIcon: "📸", key: "card1Caption", label: "Memory 1 Caption", type: "text", defaultValue: "You are the rose in my life 🌹" },
    { section: "Page 5: 3D Polaroid Memories", sectionIcon: "📸", key: "card2Image", label: "Memory 2 Photo URL", type: "text", defaultValue: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80" },
    { section: "Page 5: 3D Polaroid Memories", sectionIcon: "📸", key: "card2Caption", label: "Memory 2 Caption", type: "text", defaultValue: "I never want to let go of this hand 💛" },
    { section: "Page 5: 3D Polaroid Memories", sectionIcon: "📸", key: "card3Image", label: "Memory 3 Photo URL", type: "text", defaultValue: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=1200&q=80" },
    { section: "Page 5: 3D Polaroid Memories", sectionIcon: "📸", key: "card3Caption", label: "Memory 3 Caption", type: "text", defaultValue: "You light up my world ✨" },

    // Page 6: Grand Poem & Promises
    { section: "Page 6: Poem & Forever Promises", sectionIcon: "💍", key: "page6Title", label: "Page 6 Main Title", type: "text", defaultValue: "Love in Bloom 🌸" },
    { section: "Page 6: Poem & Forever Promises", sectionIcon: "💍", key: "page6Subtitle", label: "Page 6 Subtitle", type: "text", defaultValue: "You are my greatest adventure 💕" },
    {
      section: "Page 6: Poem & Forever Promises",
      sectionIcon: "💍",
      key: "page6Poem",
      label: "Page 6 Romantic Stanza / Poem",
      type: "textarea",
      defaultValue:
        "In you, I found a love that feels like home,\nA gentle warmth that I have always known.\nThrough every season, through the years ahead,\nI'll love you more with every word unsaid.",
    },
    { section: "Page 6: Poem & Forever Promises", sectionIcon: "💍", key: "promise1Text", label: "Promise Card 1 Text", type: "text", defaultValue: "Every day with you is a beautiful gift" },
    { section: "Page 6: Poem & Forever Promises", sectionIcon: "💍", key: "promise2Text", label: "Promise Card 2 Text", type: "text", defaultValue: "You are home wherever you are" },
    { section: "Page 6: Poem & Forever Promises", sectionIcon: "💍", key: "promise3Text", label: "Promise Card 3 Text", type: "text", defaultValue: "I choose you a thousand times over" },
  ],
  demoData: {
    bgMusicUrl: "https://open.spotify.com/track/1wgJy9zGdOLRHGEkzpD5f0?si=8f0528522b574c5e",
    songTitle: "Saiyonee · Hiten & Ritika Raj",
    heroSubtitle: "A LOVE STORY",
    heroTitle: "Love in Bloom 🌸",
    heroQuote: "Every love story is beautiful...",
    heroScrollText: "Scroll to begin the journey",

    nightQuote: "“In the quiet of the night, I found you.”",
    nightSubQuote: "You became my favorite chapter.",

    gardenSub: "OUR GARDEN",
    gardenTitle: "Garden of Love",

    letterSub: "A MESSAGE FOR YOU",
    letterTitle: "The Love Letter",
    letterTo: "To You, My Love...",
    letterBody:
      "There are not enough words in any language to describe what you mean to me. You are the warmth of the morning sun, the calm of a quiet night, and the joy in between. Every day with you feels like a beautiful dream I never want to wake up from. You have changed my world in the most wonderful way, and I am so grateful that our paths crossed. Thank you for being my anchor and my happiness.",

    memoriesSub: "CAPTURED MOMENTS",
    memoriesTitle: "Our Memories",

    card1Image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80",
    card1Caption: "You are the rose in my life 🌹",

    card2Image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
    card2Caption: "I never want to let go of this hand 💛",

    card3Image: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=1200&q=80",
    card3Caption: "You light up my world ✨",

    page6Title: "Love in Bloom 🌸",
    page6Subtitle: "You are my greatest adventure 💕",
    page6Poem:
      "In you, I found a love that feels like home,\nA gentle warmth that I have always known.\nThrough every season, through the years ahead,\nI'll love you more with every word unsaid.",
    promise1Text: "Every day with you is a beautiful gift",
    promise2Text: "You are home wherever you are",
    promise3Text: "I choose you a thousand times over",
  },
};

export default whispersOfLoveConfig;
