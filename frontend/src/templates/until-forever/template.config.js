/**
 * Until Forever - Flagship Ultra-Luxury Template Configuration
 * -----------------------------------------------------------
 * Codename: Until Forever
 * Price: ₹4,999 INR
 * Tier: Ultra-Luxury Flagship
 */

const untilForeverConfig = {
  id: "until-forever",
  slug: "until-forever",
  name: "Until Forever",
  category: "Romantic",
  occasions: ["anniversary", "proposal", "birthday", "valentine"],
  tier: "Ultra-Luxury Flagship",
  price: 4999,
  currency: "INR",
  description:
    "LoveCrafted's flagship 12-chapter interactive love story experience. Featuring wax-sealed handwritten letters, scattered 3D scrapbook polaroids, situational voice memory cards, interactive starry night sky, vinyl song player, live relationship counter, and cinematic movie credits.",
  coverImage:
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1600&q=80",
  features: [
    "12-Chapter Interactive Cinematic Story Arc",
    "Tactile Wax-Sealed 3D Invitation Envelope",
    "Line-by-Line Ink Handwritten Parchment Letter",
    "Scattered 3D Tilt Memory Scrapbook Polaroids",
    "Situational 'Hear My Heart' Voice Cards",
    "'Open When...' Sealed Envelope Collection",
    "Floating Heart Galaxy Reasons Field",
    "Interactive Starry Constellation Sky",
    "Password-Protected Secret Gift Unwrapping Box",
    "Vinyl Record Player with Lyrics Visualizer",
    "Live Relationship Milestone Counter",
    "Pixar-Style Emotional Credits & Coda",
  ],
  editableSchema: [
    // CHAPTER 1: INVITATION
    { key: "recipientName", label: "Partner / Recipient Name", type: "text", defaultValue: "My Dearest Ananya" },
    { key: "senderName", label: "Your Name / Creator", type: "text", defaultValue: "Rahul" },
    { key: "invitationGreeting", label: "Chapter 1 Intro Line 1", type: "text", defaultValue: "I made something for you..." },
    { key: "invitationSubtext", label: "Chapter 1 Intro Line 2", type: "text", defaultValue: "No matter where you are right now, take a quiet breath and open this." },
    { key: "envelopeAddress", label: "Wax Seal Calligraphy Label", type: "text", defaultValue: "For Ananya ❤️ Only." },
    { key: "waxSealInitials", label: "Wax Seal Initials / Monogram", type: "text", defaultValue: "A ❤️ R" },

    // CHAPTER 2: HANDWRITTEN LETTER
    { key: "letterTitle", label: "Letter Opening Greeting", type: "text", defaultValue: "My Dearest Ananya," },
    { key: "letterContent", label: "Full Handwritten Letter Text", type: "textarea", defaultValue: "From the moment you entered my life, everything became quiet and warm. Thank you for the morning laughs, the late night drives, and for loving me so effortlessly." },
    { key: "letterSignature", label: "Letter Signature", type: "text", defaultValue: "Yours Always & Forever, Rahul" },
    { key: "letterDate", label: "Letter Date", type: "text", defaultValue: "February 14, 2026" },

    // CHAPTER 3: MUSEUM OF US KEEPSAKES
    { key: "keepsake1Title", label: "Keepsake 1 Title", type: "text", defaultValue: "Stained Movie Ticket Stub" },
    { key: "keepsake1Story", label: "Keepsake 1 Story", type: "textarea", defaultValue: "Saved from our 1st date. We sat in the back row and talked through half the movie." },
    { key: "keepsake2Title", label: "Keepsake 2 Title", type: "text", defaultValue: "Crinkled Coffee Napkin" },
    { key: "keepsake2Story", label: "Keepsake 2 Story", type: "textarea", defaultValue: "You scribbled your favorite song recommendations on this while we waited for rain to stop." },

    // CHAPTER 4: MEMORY BOX TREASURES
    { key: "boxItem1Title", label: "Memory Box Keepsake 1", type: "text", defaultValue: "Folded Secret Letter" },
    { key: "boxItem1Note", label: "Memory Box Keepsake 1 Note", type: "text", defaultValue: "Saved from our very first year together." },

    // CHAPTER 5: HEAR MY HEART (VOICE NOTES)
    { key: "voice1Title", label: "Voice Keepsake 1 Title", type: "text", defaultValue: "Vintage Mixtape Cassette" },
    { key: "voice1Note", label: "Voice Keepsake 1 Voice Note", type: "voice", defaultValue: "" },

    // CHAPTER 6: OUR SONG
    { key: "songTitle", label: "Our Song Title", type: "text", defaultValue: "Golden Hour Romance" },
    { key: "songStory", label: "Story Behind Our Song", type: "textarea", defaultValue: "Remember that late-night drive when this song played on repeat three times? You sang every word out of tune." },
    { key: "lyricsExcerpt", label: "Lyrics Excerpt", type: "text", defaultValue: "“In every lifetime, under every sky, I would still choose you...”" },
    { key: "songAudioUrl", label: "Our Song Music Provider / MP3", type: "song-url", defaultValue: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT" },

    // CHAPTER 7: BOOK OF REASONS
    { key: "reason1", label: "Reason #1", type: "textarea", defaultValue: "I still smile every time you steal food off my plate and pretend it wasn't you." },
    { key: "reason2", label: "Reason #2", type: "textarea", defaultValue: "The quiet way you squeeze my hand three times whenever we walk through a crowded room." },

    // CHAPTER 8: PLANETARIUM CONSTELLATIONS
    { key: "star1Title", label: "Constellation 1 Title", type: "text", defaultValue: "The Spark" },
    { key: "star1Note", label: "Constellation 1 Story", type: "textarea", defaultValue: "We sat on the bench until midnight talking about our favorite songs." },

    // CHAPTER 9: SEASONS WE SHARED
    { key: "springLine1", label: "Spring Verse 1", type: "text", defaultValue: "We turned ordinary coffee into unforgettable afternoons." },
    { key: "summerLine1", label: "Summer Verse 1", type: "text", defaultValue: "We watched hundreds of golden sunsets together." },

    // CHAPTER 10: OPEN WHEN...
    { key: "open1Title", label: "Open When #1 Title", type: "text", defaultValue: "Open when you miss me..." },
    { key: "open1Message", label: "Open When #1 Letter", type: "textarea", defaultValue: "Close your eyes for three seconds. Take a deep breath. Wherever I am, I am thinking of you too." },

    // CHAPTER 11: SECRET GIFT
    { key: "secretPassword", label: "Secret Gift Password", type: "text", defaultValue: "forever" },
    { key: "secretPromise", label: "Secret Promise Message", type: "textarea", defaultValue: "I saved this until the very end: No matter where life takes us, my hand is forever in yours." },

    // CHAPTER 12: FINAL CLOSURE
    { key: "closingTitle", label: "Final Chapter Name", type: "text", defaultValue: "Ananya" },
    { key: "closingLine1", label: "Final Sentence 1", type: "text", defaultValue: "Thank you for sharing your time, your heart, and your life with me." },
    { key: "closingLine2", label: "Final Sentence 2", type: "text", defaultValue: "Wherever tomorrow leads us, I am yours." },
    { key: "closingCoda", label: "Final Coda Signature", type: "text", defaultValue: "Until forever. ❤️" },

    // GLOBAL THEME & AMBIENCE
    { key: "bgMusicUrl", label: "Global Background Ambience", type: "audio", defaultValue: "/audio/romantic.mp3" },
  ],
  demoData: {
    recipientName: "My Dearest Ananya",
    senderName: "Rahul",
    invitationGreeting: "I made something for you...",
    invitationSubtext: "No matter where you are right now, take a quiet breath and open this.",
    envelopeAddress: "For Ananya ❤️ Only.",
    waxSealInitials: "A ❤️ R",

    letterTitle: "My Dearest Ananya,",
    letterContent: "From the moment you entered my life, everything became quiet and warm. Thank you for the morning laughs, the late night drives, and for loving me so effortlessly.",
    letterSignature: "Yours Always & Forever, Rahul",
    letterDate: "February 14, 2026",

    keepsake1Title: "Stained Movie Ticket Stub",
    keepsake1Story: "Saved from our 1st date. We sat in the back row and talked through half the movie.",
    keepsake2Title: "Crinkled Coffee Napkin",
    keepsake2Story: "You scribbled your favorite song recommendations on this while we waited for rain to stop.",

    boxItem1Title: "Folded Secret Letter",
    boxItem1Note: "Saved from our very first year together.",

    voice1Title: "Vintage Mixtape Cassette",
    voice1Note: "",

    songTitle: "Golden Hour Romance",
    songStory: "Remember that late-night drive when this song played on repeat three times? You sang every word out of tune.",
    lyricsExcerpt: "“In every lifetime, under every sky, I would still choose you...”",
    songAudioUrl: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",

    reason1: "I still smile every time you steal food off my plate and pretend it wasn't you.",
    reason2: "The quiet way you squeeze my hand three times whenever we walk through a crowded room.",

    star1Title: "The Spark",
    star1Note: "We sat on the bench until midnight talking about our favorite songs.",

    springLine1: "We turned ordinary coffee into unforgettable afternoons.",
    summerLine1: "We watched hundreds of golden sunsets together.",

    open1Title: "Open when you miss me...",
    open1Message: "Close your eyes for three seconds. Take a deep breath. Wherever I am, I am thinking of you too.",

    secretPassword: "forever",
    secretPromise: "I saved this until the very end: No matter where life takes us, my hand is forever in yours.",

    closingTitle: "Ananya",
    closingLine1: "Thank you for sharing your time, your heart, and your life with me.",
    closingLine2: "Wherever tomorrow leads us, I am yours.",
    closingCoda: "Until forever. ❤️",

    bgMusicUrl: "/audio/romantic.mp3",
  },
};

export default untilForeverConfig;
