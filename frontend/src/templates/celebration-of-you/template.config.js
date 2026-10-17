export const celebrationOfYouConfig = {
  id: "celebration-of-you",
  slug: "celebration-of-you",
  name: "Celebration of You 🎂",
  category: "Birthday & Celebration",
  tier: "Flagship Edition",
  price: 9,
  currency: "INR",
  description:
    "An extraordinary, high-emotion birthday digital keepsake featuring a realistic birthday cake with candle blow-out, wish jar, life story timeline, 3D polaroid memories, vinyl soundtrack player, typewriter birthday letter, and an unwrapping surprise gift box payoff.",
  coverImage:
    "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1600&q=80",
  features: [
    "Interactive Birthday Candle Blow-Out",
    "Secret Birthday Wish Jar Cards",
    "Chapters of Your Life Timeline",
    "3D Polaroid Photo Stack Gallery",
    "Spinning Vinyl Record & Custom Song",
    "Wax-Sealed Unfolding Birthday Letter",
    "Unwrapping Surprise Gift Box Payoff",
  ],
  editableSchema: [
    // Page 1: Hero & Candle Blowout
    { section: "Page 1: Birthday Opening & Candle", sectionIcon: "🎂", key: "birthdayName", label: "Birthday Person's Name", type: "text", defaultValue: "Rosea" },
    { section: "Page 1: Birthday Opening & Candle", sectionIcon: "🎂", key: "milestoneBadge", label: "Milestone / Age Badge", type: "text", defaultValue: "CELEBRATING ANOTHER MAGICAL YEAR" },
    { section: "Page 1: Birthday Opening & Candle", sectionIcon: "🎂", key: "heroGreeting", label: "Birthday Opening Subtitle", type: "textarea", defaultValue: "To someone who brings so much warmth and light into the world — today is all about celebrating the incredible person you are." },
    { section: "Page 1: Birthday Opening & Candle", sectionIcon: "🎂", key: "bgMusicUrl", label: "Background Music Track (Spotify / Saavn / MP3 Link)", type: "text", defaultValue: "https://open.spotify.com/track/0T5iIrXA4p5GsubkhuBIKV?si=ac94e5ceab2b4154" },
    { section: "Page 1: Birthday Opening & Candle", sectionIcon: "🎂", key: "songTitle", label: "Music Track Name", type: "text", defaultValue: "Until I Found You" },

    // Page 2: Secret Birthday Wish Jar
    { section: "Page 2: Secret Wish Jar", sectionIcon: "✨", key: "wishJarTitle", label: "Page 2 Section Title", type: "text", defaultValue: "Secret Birthday Wishes For You" },
    { section: "Page 2: Secret Wish Jar", sectionIcon: "✨", key: "wish1Title", label: "Wish 1 Title", type: "text", defaultValue: "Endless Adventures" },
    { section: "Page 2: Secret Wish Jar", sectionIcon: "✨", key: "wish1Text", label: "Wish 1 Content", type: "textarea", defaultValue: "May this coming year take you to beautiful new places, with spontaneous journeys and unforgettable sunset views." },
    { section: "Page 2: Secret Wish Jar", sectionIcon: "✨", key: "wish2Title", label: "Wish 2 Title", type: "text", defaultValue: "Peace & Pure Joy" },
    { section: "Page 2: Secret Wish Jar", sectionIcon: "✨", key: "wish2Text", label: "Wish 2 Content", type: "textarea", defaultValue: "May your days be filled with quiet morning comfort, effortless smiles, and zero worries." },
    { section: "Page 2: Secret Wish Jar", sectionIcon: "✨", key: "wish3Title", label: "Wish 3 Title", type: "text", defaultValue: "Unfiltered Laughter" },
    { section: "Page 2: Secret Wish Jar", sectionIcon: "✨", key: "wish3Text", label: "Wish 3 Content", type: "textarea", defaultValue: "May you always have late-night talks, shared stories, and moments that make you laugh until your stomach hurts." },
    { section: "Page 2: Secret Wish Jar", sectionIcon: "✨", key: "wish4Title", label: "Wish 4 Title", type: "text", defaultValue: "Your Deepest Wishes" },
    { section: "Page 2: Secret Wish Jar", sectionIcon: "✨", key: "wish4Text", label: "Wish 4 Content", type: "textarea", defaultValue: "May every quiet wish you hold in your heart today turn into your favorite reality tomorrow." },

    // Page 3: Life Journey Timeline
    { section: "Page 3: Life Chapters Timeline", sectionIcon: "🚀", key: "timelineTitle", label: "Page 3 Section Title", type: "text", defaultValue: "Chapters of Your Story" },
    { section: "Page 3: Life Chapters Timeline", sectionIcon: "🚀", key: "ch1Date", label: "Chapter 1 Badge / Era", type: "text", defaultValue: "Chapter 01 · The Beginning" },
    { section: "Page 3: Life Chapters Timeline", sectionIcon: "🚀", key: "ch1Title", label: "Chapter 1 Title", type: "text", defaultValue: "The Day You Stole Our Hearts" },
    { section: "Page 3: Life Chapters Timeline", sectionIcon: "🚀", key: "ch1Desc", label: "Chapter 1 Description", type: "textarea", defaultValue: "From the very start, your bright spirit and warmth lit up every room you walked into." },
    { section: "Page 3: Life Chapters Timeline", sectionIcon: "🚀", key: "ch2Date", label: "Chapter 2 Badge / Era", type: "text", defaultValue: "Chapter 02 · Unfiltered Memories" },
    { section: "Page 3: Life Chapters Timeline", sectionIcon: "🚀", key: "ch2Title", label: "Chapter 2 Title", type: "text", defaultValue: "Car Karaoke & Late Night Drives" },
    { section: "Page 3: Life Chapters Timeline", sectionIcon: "🚀", key: "ch2Desc", label: "Chapter 2 Description", type: "textarea", defaultValue: "Late-night drives, long conversations, and inside jokes that only we understand." },
    { section: "Page 3: Life Chapters Timeline", sectionIcon: "🚀", key: "ch3Date", label: "Chapter 3 Badge / Era", type: "text", defaultValue: "Chapter 03 · Today & Beyond" },
    { section: "Page 3: Life Chapters Timeline", sectionIcon: "🚀", key: "ch3Title", label: "Chapter 3 Title", type: "text", defaultValue: "Becoming Who You Are Today" },
    { section: "Page 3: Life Chapters Timeline", sectionIcon: "🚀", key: "ch3Desc", label: "Chapter 3 Description", type: "textarea", defaultValue: "So proud of the person you've become, how deeply you care, and the warmth you bring into our lives every single day." },

    // Page 4: 3D Polaroid Memories Stack
    { section: "Page 4: 3D Polaroid Memories", sectionIcon: "📸", key: "memoriesTitle", label: "Page 4 Section Title", type: "text", defaultValue: "Favorite Moments With You" },
    { section: "Page 4: 3D Polaroid Memories", sectionIcon: "📸", key: "card1Image", label: "Memory 1 Photo URL", type: "text", defaultValue: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80" },
    { section: "Page 4: 3D Polaroid Memories", sectionIcon: "📸", key: "card1Caption", label: "Memory 1 Caption", type: "text", defaultValue: "Your million-dollar birthday smile" },
    { section: "Page 4: 3D Polaroid Memories", sectionIcon: "📸", key: "card2Image", label: "Memory 2 Photo URL", type: "text", defaultValue: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80" },
    { section: "Page 4: 3D Polaroid Memories", sectionIcon: "📸", key: "card2Caption", label: "Memory 2 Caption", type: "text", defaultValue: "Cozy coffee & endless conversations" },
    { section: "Page 4: 3D Polaroid Memories", sectionIcon: "📸", key: "card3Image", label: "Memory 3 Photo URL", type: "text", defaultValue: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=1200&q=80" },
    { section: "Page 4: 3D Polaroid Memories", sectionIcon: "📸", key: "card3Caption", label: "Memory 3 Caption", type: "text", defaultValue: "Glowing under the golden sunset" },

    // Page 5: Vinyl Player & Soundtrack
    { section: "Page 5: Vinyl Player & Song", sectionIcon: "🎵", key: "musicArtist", label: "Song Artist Name", type: "text", defaultValue: "Stephen Sanchez" },

    // Page 6: Birthday Love Letter
    { section: "Page 6: Birthday Love Letter", sectionIcon: "💌", key: "letterTitle", label: "Page 6 Letter Header", type: "text", defaultValue: "A Letter From My Heart" },
    { section: "Page 6: Birthday Love Letter", sectionIcon: "💌", key: "letterTo", label: "Recipient Header", type: "text", defaultValue: "To My Favorite Human, Rosea..." },
    {
      section: "Page 6: Birthday Love Letter",
      sectionIcon: "💌",
      key: "letterBody",
      label: "Full Birthday Letter Content",
      type: "textarea",
      defaultValue:
        "Happy Birthday!\n\nLooking back at everything we've shared, I am so deeply grateful to have you in my life. You make the mundane feel extraordinary, and your presence is my favorite comforting constant.\n\nI hope this year brings you everything your heart has been quietly wishing for — boundless success, deep peace, spontaneous adventures, and endless reasons to smile.\n\nThank you for existing, for loving me, and for being uniquely, wonderfully YOU.\n\nHappy Birthday once again!",
    },

    // Page 7: Grand Surprise Gift Box Payoff
    { section: "Page 7: Surprise Gift Box Payoff", sectionIcon: "🎁", key: "giftTitle", label: "Surprise Section Title", type: "text", defaultValue: "Your Birthday Surprise" },
    { section: "Page 7: Surprise Gift Box Payoff", sectionIcon: "🎁", key: "giftInstruction", label: "Gift Box Prompt Text", type: "text", defaultValue: "Tap the present below to unwrap your birthday surprise" },
    { section: "Page 7: Surprise Gift Box Payoff", sectionIcon: "🎁", key: "surpriseHeader", label: "Surprise Card Heading", type: "text", defaultValue: "HAPPY BIRTHDAY, ROSEA!" },
    { section: "Page 7: Surprise Gift Box Payoff", sectionIcon: "🎁", key: "surpriseMessage", label: "Surprise Gift Message / Pledge", type: "textarea", defaultValue: "You've unlocked: A full day dedicated entirely to you — your favorite meal, zero responsibilities, and a special birthday celebration planned just for you." },
    { section: "Page 7: Surprise Gift Box Payoff", sectionIcon: "🎁", key: "senderSignoff", label: "Sender Sign-off Name", type: "text", defaultValue: "With all my love, Alex" }
  ],
  demoData: {
    birthdayName: "Rosea",
    milestoneBadge: "CELEBRATING ANOTHER MAGICAL YEAR",
    heroGreeting: "To someone who brings so much warmth and light into the world — today is all about celebrating the incredible person you are.",
    bgMusicUrl: "https://open.spotify.com/track/0T5iIrXA4p5GsubkhuBIKV?si=ac94e5ceab2b4154",
    songTitle: "Until I Found You",
    musicArtist: "Stephen Sanchez",
    wishJarTitle: "Secret Birthday Wishes For You",
    wish1Title: "Endless Adventures",
    wish1Text: "May this coming year take you to beautiful new places, with spontaneous journeys and unforgettable sunset views.",
    wish2Title: "Peace & Pure Joy",
    wish2Text: "May your days be filled with quiet morning comfort, effortless smiles, and zero worries.",
    wish3Title: "Unfiltered Laughter",
    wish3Text: "May you always have late-night talks, shared stories, and moments that make you laugh until your stomach hurts.",
    wish4Title: "Your Deepest Wishes",
    wish4Text: "May every quiet wish you hold in your heart today turn into your favorite reality tomorrow.",
    timelineTitle: "Chapters of Your Story",
    ch1Date: "Chapter 01 · The Beginning",
    ch1Title: "The Day You Stole Our Hearts",
    ch1Desc: "From the very start, your bright spirit and warmth lit up every room you walked into.",
    ch2Date: "Chapter 02 · Unfiltered Memories",
    ch2Title: "Car Karaoke & Late Night Drives",
    ch2Desc: "Late-night drives, long conversations, and inside jokes that only we understand.",
    ch3Date: "Chapter 03 · Today & Beyond",
    ch3Title: "Becoming Who You Are Today",
    ch3Desc: "So proud of the person you've become, how deeply you care, and the warmth you bring into our lives every single day.",
    memoriesTitle: "Favorite Moments With You",
    card1Image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
    card1Caption: "Your million-dollar birthday smile",
    card2Image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
    card2Caption: "Cozy coffee & endless conversations",
    card3Image: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=1200&q=80",
    card3Caption: "Glowing under the golden sunset",
    musicArtist: "Armaan Malik & Shraddha Kapoor",
    letterTitle: "A Letter From My Heart",
    letterTo: "To My Favorite Human, Rosea...",
    letterBody:
      "Happy Birthday!\n\nLooking back at everything we've shared, I am so deeply grateful to have you in my life. You make the mundane feel extraordinary, and your presence is my favorite comforting constant.\n\nI hope this year brings you everything your heart has been quietly wishing for — boundless success, deep peace, spontaneous adventures, and endless reasons to smile.\n\nThank you for existing, for loving me, and for being uniquely, wonderfully YOU.\n\nHappy Birthday once again!",
    giftTitle: "Your Birthday Surprise",
    giftInstruction: "Tap the present below to unwrap your birthday surprise",
    surpriseHeader: "HAPPY BIRTHDAY, ROSEA!",
    surpriseMessage: "You've unlocked: A full day dedicated entirely to you — your favorite meal, zero responsibilities, and a special birthday surprise date planned just for you.",
    senderSignoff: "With all my love, Alex"
  }
};

export default celebrationOfYouConfig;
