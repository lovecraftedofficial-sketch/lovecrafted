/**
 * Come Here, Baby - Ultra Comfort Romantic Relationship Template Configuration
 * --------------------------------------------------------------------------
 * Codename: Come Here, Baby
 * Price: ₹2,999 INR
 * Tier: Ultra Comfort
 */

const comeHereBabyConfig = {
  id: "come-here-baby",
  slug: "come-here-baby",
  name: "Come Here, Baby",
  category: "Romantic",
  occasions: ["comfort", "anniversary", "just-because", "long-distance"],
  tier: "Ultra Comfort",
  price: 2999,
  currency: "INR",
  description:
    "A cute, deeply romantic, and emotionally comforting digital haven created for the girl you love on difficult or low-energy days. Features interactive mood responses, care checklist, mood-swing reassurance cards, virtual comfort box, 'if I could take the pain away' centerpiece, and an intimate love letter.",
  coverImage:
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1600&q=80",
  features: [
    "Deeply Personal Cute & Romantic Comfort Experience",
    "60fps Floating Hearts, Petals, Bokeh & Star Sparkles",
    "Interactive Mood Selector with Instant Loving Responses",
    "Playful 'Baby Care' Checklist with Progress Tracking",
    "Tactile 'Allowed to be Moody' Reassurance Cards",
    "Pick What You Need Choice Cards (Cuddles, Kisses, Quiet)",
    "Interactive Virtual Comfort Box (Chocolate, Hugs, Jokes)",
    "Emotional Centerpiece: 'If I Could Take The Pain Away'",
    "Unfolding Parchment Love Letter & Comfort Playlist",
  ],
  editorType: "sections",
  editorSections: [
    {
      id: "hero",
      label: "1. Welcome, Baby",
      keys: ["partnerName", "senderName", "heroBadge", "heroHeadline", "heroSubheading", "heroParagraph", "heroImage", "heroCaption", "ctaPrimary", "ctaSecondary"]
    },
    {
      id: "mood",
      label: "2. How Are You Feeling?",
      keys: ["moodSectionTitle", "moodSectionSubtitle", "mood1Resp", "mood2Resp", "mood3Resp", "mood4Resp", "mood5Resp", "mood6Resp", "mood7Resp", "mood8Resp"]
    },
    {
      id: "care",
      label: "3. Take Care Of You",
      keys: ["careSectionTitle", "careSectionSubtitle", "careItem1", "careItem2", "careItem3", "careItem4", "careItem5", "careItem6", "careItem7"]
    },
    {
      id: "moody",
      label: "4. Moody Baby",
      keys: ["moodySectionTitle", "moodySectionSubtitle", "moody1Q", "moody1A", "moody2Q", "moody2A", "moody3Q", "moody3A", "moody4Q", "moody4A", "moody5Q", "moody5A", "moody6Q", "moody6A"]
    },
    {
      id: "needs",
      label: "5. What You Need",
      keys: ["needsSectionTitle", "needsSectionSubtitle", "need1Msg", "need2Msg", "need3Msg", "need4Msg", "need5Msg", "need6Msg"]
    },
    {
      id: "things",
      label: "6. Things I Love",
      keys: ["thingsSectionTitle", "thingsSectionSubtitle", "thing1Title", "thing1Detail", "thing2Title", "thing2Detail", "thing3Title", "thing3Detail", "thing4Title", "thing4Detail"]
    },
    {
      id: "pain",
      label: "7. Take Your Pain Away",
      keys: ["painSectionTitle", "painHeading", "painSubheading", "painParagraph"]
    },
    {
      id: "comfortbox",
      label: "8. Comfort Box",
      keys: ["boxSectionTitle", "boxSectionSubtitle", "boxChocolateMsg", "boxCuddleMsg", "boxKissMsg", "boxJokeMsg", "boxNoteMsg", "boxHugMsg"]
    },
    {
      id: "letter",
      label: "9. Private Letter",
      keys: ["letterSectionTitle", "letterHeading", "letterBody", "letterSignature"]
    },
    {
      id: "crying",
      label: "10. When You're Crying",
      keys: ["cryingSectionTitle", "cryingHeading", "cryingText1", "cryingText2", "cryingText3", "cryingText4", "cryingCoda"]
    },
    {
      id: "playlist",
      label: "11. Our Playlist",
      keys: ["playlistSectionTitle", "playlistSectionSubtitle", "featuredSongTitle", "featuredSongArtist", "featuredSongUrl", "featuredSongCover"]
    },
    {
      id: "final",
      label: "12. Final Message",
      keys: ["finalHeading1", "finalHeading2", "finalHeading3", "finalHeading4", "finalMainLine", "finalSubLine", "footerLine"]
    }
  ],
  editableSchema: [
    // SECTION 1: HERO
    { key: "partnerName", label: "Partner Name / Pet Name", type: "text", defaultValue: "Ananya" },
    { key: "senderName", label: "Your Name", type: "text", defaultValue: "Rahul" },
    { key: "heroBadge", label: "Hero Badge Text", type: "text", defaultValue: "for my baby ♡" },
    { key: "heroHeadline", label: "Hero Main Heading", type: "text", defaultValue: "Come here, baby." },
    { key: "heroSubheading", label: "Hero Subheading", type: "text", defaultValue: "You don't have to be okay today." },
    { key: "heroParagraph", label: "Hero Intro Paragraph", type: "textarea", defaultValue: "If your tummy hurts, your mood is everywhere, or you just want to curl up and disappear for a while... come here. I've got you." },
    { key: "heroImage", label: "Hero Portrait Image URL", type: "image", defaultValue: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80" },
    { key: "heroCaption", label: "Hero Image Caption", type: "text", defaultValue: "my favorite girl." },
    { key: "ctaPrimary", label: "Primary Button Label", type: "text", defaultValue: "Come Cuddle ♡" },
    { key: "ctaSecondary", label: "Secondary Button Label", type: "text", defaultValue: "I Need Some Love" },

    // SECTION 2: MOOD SELECTOR
    { key: "moodSectionTitle", label: "Mood Section Title", type: "text", defaultValue: "Tell me what's going on, baby." },
    { key: "moodSectionSubtitle", label: "Mood Section Subtitle", type: "text", defaultValue: "Tap how you're feeling right now. Zero explanations needed." },
    { key: "mood1Resp", label: "Response for 🥺 I want cuddles", type: "textarea", defaultValue: "I know, baby. Come here. Arms are open and waiting right now." },
    { key: "mood2Resp", label: "Response for 😭 I might cry", type: "textarea", defaultValue: "You don't have to explain why you're crying. Just cry. I'm right here holding you." },
    { key: "mood3Resp", label: "Response for 😤 I'm grumpy", type: "textarea", defaultValue: "You're allowed to be grumpy. I'll still love you exactly the same." },
    { key: "mood4Resp", label: "Response for 🫠 Everything hurts", type: "textarea", defaultValue: "Then today your only job is surviving the day. I'll handle all the loving part." },
    { key: "mood5Resp", label: "Response for 😴 I just want to sleep", type: "textarea", defaultValue: "Go to sleep, bub. Blanket tucked in, forehead kissed. I'll be here when you wake up." },
    { key: "mood6Resp", label: "Response for 🫂 I need you", type: "textarea", defaultValue: "I'm right here, my girl. I am not going anywhere." },
    { key: "mood7Resp", label: "Response for 🍫 I need chocolate", type: "textarea", defaultValue: "Chocolate has officially been approved. Obviously. Emergency stash activated." },
    { key: "mood8Resp", label: "Response for 💗 I don't even know", type: "textarea", defaultValue: "You don't have to figure it out. Just rest your head right here." },

    // SECTION 3: CARE CHECKLIST
    { key: "careSectionTitle", label: "Care Corner Title", type: "text", defaultValue: "Today, let me worry about the little things." },
    { key: "careSectionSubtitle", label: "Care Corner Subtitle", type: "text", defaultValue: "Tick them off as you go. No rush, no pressure." },
    { key: "careItem1", label: "Care Item 1", type: "text", defaultValue: "💧 Drink some warm water" },
    { key: "careItem2", label: "Care Item 2", type: "text", defaultValue: "🍫 Have something sweet you love" },
    { key: "careItem3", label: "Care Item 3", type: "text", defaultValue: "🛏 Get under your softest blanket" },
    { key: "careItem4", label: "Care Item 4", type: "text", defaultValue: "🔥 Keep your tummy warm" },
    { key: "careItem5", label: "Care Item 5", type: "text", defaultValue: "🍲 Eat a warm, comforting meal" },
    { key: "careItem6", label: "Care Item 6", type: "text", defaultValue: "😴 Rest without feeling guilty for a second" },
    { key: "careItem7", label: "Care Item 7", type: "text", defaultValue: "🫂 Come get your extra cuddles" },

    // SECTION 4: MOODY BABY
    { key: "moodySectionTitle", label: "Moody Section Title", type: "text", defaultValue: "You can be a little difficult today. I can handle you." },
    { key: "moodySectionSubtitle", label: "Moody Section Subtitle", type: "text", defaultValue: "Tap any card below to see my answer." },
    { key: "moody1Q", label: "Card 1 Question", type: "text", defaultValue: "Want to yell at me?" },
    { key: "moody1A", label: "Card 1 Answer", type: "textarea", defaultValue: "I'll survive. Go ahead." },
    { key: "moody2Q", label: "Card 2 Question", type: "text", defaultValue: "Want to cry for no reason?" },
    { key: "moody2A", label: "Card 2 Answer", type: "textarea", defaultValue: "Come here. Tissues and hugs ready." },
    { key: "moody3Q", label: "Card 3 Question", type: "text", defaultValue: "Don't want to talk?" },
    { key: "moody3A", label: "Card 3 Answer", type: "textarea", defaultValue: "Okay. I'll just sit beside you in quiet." },
    { key: "moody4Q", label: "Card 4 Question", type: "text", defaultValue: "Want endless attention?" },
    { key: "moody4A", label: "Card 4 Answer", type: "textarea", defaultValue: "Congratulations. You have 100% of mine." },
    { key: "moody5Q", label: "Card 5 Question", type: "text", defaultValue: "Want to be left alone?" },
    { key: "moody5A", label: "Card 5 Answer", type: "textarea", defaultValue: "I'll give you space. But I'm right in the next room if you need me." },
    { key: "moody6Q", label: "Card 6 Question", type: "text", defaultValue: "Want to complain for 45 minutes?" },
    { key: "moody6A", label: "Card 6 Answer", type: "textarea", defaultValue: "Go ahead. I'm listening to every word." },

    // SECTION 5: WHAT YOU NEED
    { key: "needsSectionTitle", label: "Needs Section Title", type: "text", defaultValue: "So... what does my baby need right now?" },
    { key: "needsSectionSubtitle", label: "Needs Section Subtitle", type: "text", defaultValue: "Pick your comfort order." },
    { key: "need1Msg", label: "Cuddles Response", type: "textarea", defaultValue: "Come here. If I were there right now, you'd already be wrapped in my arms." },
    { key: "need2Msg", label: "Kisses Response", type: "textarea", defaultValue: "One forehead kiss, two cheek kisses, and one extra because you're cute." },
    { key: "need3Msg", label: "Quiet Company Response", type: "textarea", defaultValue: "Okay. No talking needed. Just you, me, and total peace." },
    { key: "need4Msg", label: "Chocolate & Snacks Response", type: "textarea", defaultValue: "Absolutely. Today you are getting completely spoiled." },
    { key: "need5Msg", label: "Reassurance Response", type: "textarea", defaultValue: "You are loved, you are safe, and you are my absolute favorite person." },
    { key: "need6Msg", label: "Just Stay Here Response", type: "textarea", defaultValue: "I'm not going anywhere. Right here with you." },

    // SECTION 6: THINGS I LOVE
    { key: "thingsSectionTitle", label: "Things I Love Title", type: "text", defaultValue: "Even on your grumpy days..." },
    { key: "thingsSectionSubtitle", label: "Things I Love Subtitle", type: "text", defaultValue: "...you're still my absolute favorite human." },
    { key: "thing1Title", label: "Thing 1 Title", type: "text", defaultValue: "Your sleepy voice" },
    { key: "thing1Detail", label: "Thing 1 Detail", type: "textarea", defaultValue: "How soft and raspy you sound when you first wake up." },
    { key: "thing2Title", label: "Thing 2 Title", type: "text", defaultValue: "Your pretend non-smile" },
    { key: "thing2Detail", label: "Thing 2 Detail", type: "textarea", defaultValue: "The way you try so hard to look serious when you're secretly fighting a grin." },
    { key: "thing3Title", label: "Thing 3 Title", type: "text", defaultValue: "Your little angry face" },
    { key: "thing3Detail", label: "Thing 3 Detail", type: "textarea", defaultValue: "Even when you're mad at the world, you are the cutest human alive." },
    { key: "thing4Title", label: "Thing 4 Title", type: "text", defaultValue: "How you need reassurance" },
    { key: "thing4Detail", label: "Thing 4 Detail", type: "textarea", defaultValue: "Even when you pretend you don't, I love being the one who gets to give it to you." },

    // SECTION 7: TAKE YOUR PAIN AWAY
    { key: "painSectionTitle", label: "Pain Section Title", type: "text", defaultValue: "If I Could Take It Away..." },
    { key: "painHeading", label: "Pain Main Heading", type: "text", defaultValue: "If I could take the pain away from you..." },
    { key: "painSubheading", label: "Pain Subheading", type: "text", defaultValue: "I would. Without a single second of hesitation." },
    { key: "painParagraph", label: "Pain Heartfelt Paragraph", type: "textarea", defaultValue: "If I could trade places with you for a day, I would do it without thinking twice. I hate knowing you're hurting and not being able to simply take it away. So until I can, let me be here. Let me listen. Let me hold you. Let me remind you that you don't have to carry the hard parts alone." },

    // SECTION 8: COMFORT BOX
    { key: "boxSectionTitle", label: "Comfort Box Title", type: "text", defaultValue: "Your Little Virtual Comfort Box" },
    { key: "boxSectionSubtitle", label: "Comfort Box Subtitle", type: "text", defaultValue: "Open any gift inside whenever you need a boost." },
    { key: "boxChocolateMsg", label: "Chocolate Message", type: "textarea", defaultValue: "🍫 Emergency chocolate delivered right to your heart. No questions asked." },
    { key: "boxCuddleMsg", label: "Cuddle Message", type: "textarea", defaultValue: "🧸 Come here. You're not escaping this long, tight hug." },
    { key: "boxKissMsg", label: "Kiss Message", type: "textarea", defaultValue: "💋 One forehead kiss, two cheek kisses, and a long one on your head." },
    { key: "boxJokeMsg", label: "Joke Message", type: "textarea", defaultValue: "😂 Why did the blanket go to school? Because it wanted to be a little smarter! (Okay bad joke, but smile for me?)" },
    { key: "boxNoteMsg", label: "Note Message", type: "textarea", defaultValue: "💌 Reminder: You are the best thing that ever happened to me." },
    { key: "boxHugMsg", label: "Hug Message", type: "textarea", defaultValue: "🫂 Squeezing you tight until all the tension melts out of your shoulders." },

    // SECTION 9: PRIVATE LETTER
    { key: "letterSectionTitle", label: "Private Letter Title", type: "text", defaultValue: "One Thing I Need You To Know" },
    { key: "letterHeading", label: "Letter Heading", type: "text", defaultValue: "My Dearest Ananya," },
    { key: "letterBody", label: "Letter Body", type: "textarea", defaultValue: "I made this tiny corner of the world because on days when you're tired, hurting, or overwhelmed, I want you to remember that you never have to be strong alone.\n\nYou are allowed to have bad days. You are allowed to rest. You are allowed to be grumpy, sleepy, or emotional. Through every single version of today, you are my favorite person in the entire universe.\n\nRest up, baby. I've got you." },
    { key: "letterSignature", label: "Letter Signature", type: "text", defaultValue: "Yours Always & Forever, Rahul ❤️" },

    // SECTION 10: WHEN YOU'RE CRYING
    { key: "cryingSectionTitle", label: "Crying Section Title", type: "text", defaultValue: "If You're Crying Right Now..." },
    { key: "cryingHeading", label: "Crying Heading", type: "text", defaultValue: "Don't hide it from me." },
    { key: "cryingText1", label: "Crying Line 1", type: "text", defaultValue: "Take a deep breath, bub." },
    { key: "cryingText2", label: "Crying Line 2", type: "text", defaultValue: "You don't have to stop or apologize for tears." },
    { key: "cryingText3", label: "Crying Line 3", type: "text", defaultValue: "You're still beautiful with tears in your eyes." },
    { key: "cryingText4", label: "Crying Line 4", type: "text", defaultValue: "And you're still my baby." },
    { key: "cryingCoda", label: "Crying Closing Line", type: "text", defaultValue: "Come back here whenever you need a safe place." },

    // SECTION 11: OUR PLAYLIST
    { key: "playlistSectionTitle", label: "Playlist Section Title", type: "text", defaultValue: "Our Comfort Playlist" },
    { key: "playlistSectionSubtitle", label: "Playlist Section Subtitle", type: "text", defaultValue: "Press play and close your eyes." },
    { key: "featuredSongTitle", label: "Featured Song Title", type: "text", defaultValue: "Warm Blanket Acoustic" },
    { key: "featuredSongArtist", label: "Featured Song Artist", type: "text", defaultValue: "Our Safe Space Songs" },
    { key: "featuredSongUrl", label: "Featured Song URL / Spotify Link", type: "song-url", defaultValue: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3" },
    { key: "featuredSongCover", label: "Featured Song Album Cover", type: "image", defaultValue: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80" },

    // SECTION 12: FINAL MESSAGE
    { key: "finalHeading1", label: "Final Line 1", type: "text", defaultValue: "Your pain will pass." },
    { key: "finalHeading2", label: "Final Line 2", type: "text", defaultValue: "Your mood will settle." },
    { key: "finalHeading3", label: "Final Line 3", type: "text", defaultValue: "Your cramps will ease." },
    { key: "finalHeading4", label: "Final Line 4", type: "text", defaultValue: "Your tears will dry." },
    { key: "finalMainLine", label: "Final Main Statement", type: "text", defaultValue: "But me loving you through all of it? That's not going anywhere." },
    { key: "finalSubLine", label: "Final Sub Line", type: "text", defaultValue: "So come here whenever you need me, baby." },
    { key: "footerLine", label: "Footer Line", type: "text", defaultValue: "Made with love, patience & way too many kisses ♡" },
    { key: "bgMusicUrl", label: "Background Music URL", type: "audio", defaultValue: "/audio/romantic.mp3" },
  ],
  demoData: {
    partnerName: "Ananya",
    senderName: "Rahul",
    heroBadge: "for my baby ♡",
    heroHeadline: "Come here, baby.",
    heroSubheading: "You don't have to be okay today.",
    heroParagraph: "If your tummy hurts, your mood is everywhere, or you just want to curl up and disappear for a while... come here. I've got you.",
    heroImage: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80",
    heroCaption: "my favorite girl.",
    ctaPrimary: "Come Cuddle ♡",
    ctaSecondary: "I Need Some Love",

    moodSectionTitle: "Tell me what's going on, baby.",
    moodSectionSubtitle: "Tap how you're feeling right now. Zero explanations needed.",
    mood1Resp: "I know, baby. Come here. Arms are open and waiting right now.",
    mood2Resp: "You don't have to explain why you're crying. Just cry. I'm right here holding you.",
    mood3Resp: "You're allowed to be grumpy. I'll still love you exactly the same.",
    mood4Resp: "Then today your only job is surviving the day. I'll handle all the loving part.",
    mood5Resp: "Go to sleep, bub. Blanket tucked in, forehead kissed. I'll be here when you wake up.",
    mood6Resp: "I'm right here, my girl. I am not going anywhere.",
    mood7Resp: "Chocolate has officially been approved. Obviously. Emergency stash activated.",
    mood8Resp: "You don't have to figure it out. Just rest your head right here.",

    careSectionTitle: "Today, let me worry about the little things.",
    careSectionSubtitle: "Tick them off as you go. No rush, no pressure.",
    careItem1: "💧 Drink some warm water",
    careItem2: "🍫 Have something sweet you love",
    careItem3: "🛏 Get under your softest blanket",
    careItem4: "🔥 Keep your tummy warm",
    careItem5: "🍲 Eat a warm, comforting meal",
    careItem6: "😴 Rest without feeling guilty for a second",
    careItem7: "🫂 Come get your extra cuddles",

    moodySectionTitle: "You can be a little difficult today. I can handle you.",
    moodySectionSubtitle: "Tap any card below to see my answer.",
    moody1Q: "Want to yell at me?",
    moody1A: "I'll survive. Go ahead.",
    moody2Q: "Want to cry for no reason?",
    moody2A: "Come here. Tissues and hugs ready.",
    moody3Q: "Don't want to talk?",
    moody3A: "Okay. I'll just sit beside you in quiet.",
    moody4Q: "Want endless attention?",
    moody4A: "Congratulations. You have 100% of mine.",
    moody5Q: "Want to be left alone?",
    moody5A: "I'll give you space. But I'm right in the next room if you need me.",
    moody6Q: "Want to complain for 45 minutes?",
    moody6A: "Go ahead. I'm listening to every word.",

    needsSectionTitle: "So... what does my baby need right now?",
    needsSectionSubtitle: "Pick your comfort order.",
    need1Msg: "Come here. If I were there right now, you'd already be wrapped in my arms.",
    need2Msg: "One forehead kiss, two cheek kisses, and one extra because you're cute.",
    need3Msg: "Okay. No talking needed. Just you, me, and total peace.",
    need4Msg: "Absolutely. Today you are getting completely spoiled.",
    need5Msg: "You are loved, you are safe, and you are my absolute favorite person.",
    need6Msg: "I'm not going anywhere. Right here with you.",

    thingsSectionTitle: "Even on your grumpy days...",
    thingsSectionSubtitle: "...you're still my absolute favorite human.",
    thing1Title: "Your sleepy voice",
    thing1Detail: "How soft and raspy you sound when you first wake up.",
    thing2Title: "Your pretend non-smile",
    thing2Detail: "The way you try so hard to look serious when you're secretly fighting a grin.",
    thing3Title: "Your little angry face",
    thing3Detail: "Even when you're mad at the world, you are the cutest human alive.",
    thing4Title: "How you need reassurance",
    thing4Detail: "Even when you pretend you don't, I love being the one who gets to give it to you.",

    painSectionTitle: "If I Could Take It Away...",
    painHeading: "If I could take the pain away from you...",
    painSubheading: "I would. Without a single second of hesitation.",
    painParagraph: "If I could trade places with you for a day, I would do it without thinking twice. I hate knowing you're hurting and not being able to simply take it away. So until I can, let me be here. Let me listen. Let me hold you. Let me remind you that you don't have to carry the hard parts alone.",

    boxSectionTitle: "Your Little Virtual Comfort Box",
    boxSectionSubtitle: "Open any gift inside whenever you need a boost.",
    boxChocolateMsg: "🍫 Emergency chocolate delivered right to your heart. No questions asked.",
    boxCuddleMsg: "🧸 Come here. You're not escaping this long, tight hug.",
    boxKissMsg: "💋 One forehead kiss, two cheek kisses, and a long one on your head.",
    boxJokeMsg: "😂 Why did the blanket go to school? Because it wanted to be a little smarter! (Okay bad joke, but smile for me?)",
    boxNoteMsg: "💌 Reminder: You are the best thing that ever happened to me.",
    boxHugMsg: "🫂 Squeezing you tight until all the tension melts out of your shoulders.",

    letterSectionTitle: "One Thing I Need You To Know",
    letterHeading: "My Dearest Ananya,",
    letterBody: "I made this tiny corner of the world because on days when you're tired, hurting, or overwhelmed, I want you to remember that you never have to be strong alone.\n\nYou are allowed to have bad days. You are allowed to rest. You are allowed to be grumpy, sleepy, or emotional. Through every single version of today, you are my favorite person in the entire universe.\n\nRest up, baby. I've got you.",
    letterSignature: "Yours Always & Forever, Rahul ❤️",

    cryingSectionTitle: "If You're Crying Right Now...",
    cryingHeading: "Don't hide it from me.",
    cryingText1: "Take a deep breath, bub.",
    cryingText2: "You don't have to stop or apologize for tears.",
    cryingText3: "You're still beautiful with tears in your eyes.",
    cryingText4: "And you're still my baby.",
    cryingCoda: "Come back here whenever you need a safe place.",

    playlistSectionTitle: "Our Comfort Playlist",
    playlistSectionSubtitle: "Press play and close your eyes.",
    featuredSongTitle: "Warm Blanket Acoustic",
    featuredSongArtist: "Our Safe Space Songs",
    featuredSongUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
    featuredSongCover: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",

    finalHeading1: "Your pain will pass.",
    finalHeading2: "Your mood will settle.",
    finalHeading3: "Your cramps will ease.",
    finalHeading4: "Your tears will dry.",
    finalMainLine: "But me loving you through all of it? That's not going anywhere.",
    finalSubLine: "So come here whenever you need me, baby.",
    footerLine: "Made with love, patience & way too many kisses ♡",
    bgMusicUrl: "/audio/romantic.mp3",
  },
};

export default comeHereBabyConfig;
