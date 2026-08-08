/**
 * For My Baby - Ultra Comfort Romantic Relationship Template Configuration
 * -----------------------------------------------------------------------
 * Name: For My Baby
 * Subtitle: The little place I made just for you.
 * Codename: come-here-baby
 * Price: ₹2,999 INR
 * Tier: Ultra Comfort
 */

const comeHereBabyConfig = {
  id: "come-here-baby",
  slug: "come-here-baby",
  name: "For My Baby",
  subtitle: "The little place I made just for you.",
  category: "Romantic",
  occasions: ["comfort", "anniversary", "just-because", "long-distance"],
  tier: "Ultra Comfort",
  price: 2999,
  currency: "INR",
  description:
    "A cute, deeply romantic, nurturing, and emotionally comforting digital gift made by a boyfriend for his girlfriend when she is tired, exhausted, moody, sad, overwhelmed, or having a difficult day. Features a random love-note generator, pamper checklist, Spotify music player, things I love cards, 10 WhatsApp request actions, love jar, open-when notes, and a private letter.",
  coverImage:
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1600&q=80",
  features: [
    "Deeply Personal Cute & Nurturing Comfort Experience",
    "60fps Ambient Floating Hearts, Petals & Bokeh Sparkles",
    "Interactive Random Love-Note Generator (8+ Pre-written Notes)",
    "Wholesome Pamper Checklist with Encouraging Progress Tracker",
    "Spotify & Direct Audio Music Player with Auto-Provider Detection",
    "Affectionate 'Things I Love About You' Reassurance Cards",
    "10 WhatsApp Request Actions (Ek Hug, Chocolate, Thodi Pampering, Extra Pyaar, etc.)",
    "Interactive 'Jar Full of Love' Random Message Revealer",
    "7 Open-When Comfort Letters & Handwritten Love Letter",
  ],
  editorType: "sections",
  editorSections: [
    {
      id: "hero",
      label: "1. Hero",
      keys: ["partnerName", "senderName", "heroBadge", "heroGreeting", "heroHeadline", "heroCopy1", "heroCopy2", "heroCopy3", "heroImage", "ctaPrimary", "ctaSecondary"]
    },
    {
      id: "notes",
      label: "2. A Little Note From Me",
      keys: ["notesTitle", "notesSubtitle", "note1", "note2", "note3", "note4", "note5", "note6", "note7", "note8"]
    },
    {
      id: "care",
      label: "3. Care / Pamper Corner",
      keys: ["careTitle", "careSubtitle", "careItem1", "careItem2", "careItem3", "careItem4", "careItem5", "careItem6"]
    },
    {
      id: "songs",
      label: "4. Songs For My Baby",
      keys: ["songsTitle", "songsSubtitle", "featuredSongTitle", "featuredSongArtist", "featuredSongUrl", "featuredSongCover", "musicProvider"]
    },
    {
      id: "things",
      label: "5. Things I Love About You",
      keys: ["thingsTitle", "thingsSubtitle", "love1Title", "love1Msg", "love2Title", "love2Msg", "love3Title", "love3Msg", "love4Title", "love4Msg", "love5Title", "love5Msg", "love6Title", "love6Msg", "love7Title", "love7Msg", "love8Title", "love8Msg"]
    },
    {
      id: "needs",
      label: "6. Tell Me What You Need",
      keys: [
        "needsTitle",
        "needsSubtitle",
        "whatsappPhoneNumber",
        "option1",
        "option2",
        "option3",
        "option4",
        "option5",
        "option6",
        "option7",
        "option8",
        "option9",
        "option10"
      ]
    },
    {
      id: "jar",
      label: "7. A Jar Full of Love",
      keys: ["jarTitle", "jarSubtitle", "jar1", "jar2", "jar3", "jar4", "jar5", "jar6", "jar7", "jar8"]
    },
    {
      id: "openwhen",
      label: "8. For The Days You Need Me",
      keys: ["openTitle", "openSubtitle", "openTired", "openHurting", "openAngry", "openCrying", "openMiss", "openReassurance", "openLoved"]
    },
    {
      id: "letter",
      label: "9. Private Letter",
      keys: ["letterTitle", "letterGreeting", "letterBody", "letterSignature"]
    },
    {
      id: "final",
      label: "10. Final Closing",
      keys: ["finalTitle", "finalLine1", "finalLine2", "finalLine3", "finalLine4", "finalCoda"]
    }
  ],
  editableSchema: [
    // SECTION 1: HERO
    { key: "partnerName", label: "Partner Name / Pet Name", type: "text", defaultValue: "My Baby" },
    { key: "senderName", label: "Your Name", type: "text", defaultValue: "Rahul" },
    { key: "heroBadge", label: "Hero Badge Text", type: "text", defaultValue: "♡ just for my baby ♡" },
    { key: "heroGreeting", label: "Hero Greeting", type: "text", defaultValue: "Heyy, my baby. ❤️" },
    { key: "heroHeadline", label: "Hero Headline", type: "text", defaultValue: "Aaj bohot tiring feel ho raha hai na?" },
    { key: "heroCopy1", label: "Supporting Line 1", type: "text", defaultValue: "Don't worry, baby. I'm always right beside you." },
    { key: "heroCopy2", label: "Supporting Line 2", type: "textarea", defaultValue: "I know today might feel a little heavier than usual, so I made something small for you. 🥺" },
    { key: "heroCopy3", label: "Final Hero Line", type: "text", defaultValue: "Come, check it out. I hope it makes you smile. ❤️" },
    { key: "heroImage", label: "Hero Portrait Image URL", type: "image", defaultValue: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80" },
    { key: "ctaPrimary", label: "Primary Button Label", type: "text", defaultValue: "💗 See What I Made For You" },
    { key: "ctaSecondary", label: "Secondary Button Label", type: "text", defaultValue: "🫂 Come Get Your Hug" },

    // SECTION 2: A LITTLE NOTE FROM ME
    { key: "notesTitle", label: "Notes Section Title", type: "text", defaultValue: "A Little Note From Me" },
    { key: "notesSubtitle", label: "Notes Section Subtitle", type: "text", defaultValue: "Whenever you need a tiny reminder that you're loved." },
    { key: "note1", label: "Love Note 1", type: "textarea", defaultValue: "Baby, you don't have to do everything today. Rest a little. I'll still be proud of you. ❤️" },
    { key: "note2", label: "Love Note 2", type: "textarea", defaultValue: "You're allowed to be grumpy today. I still think you're the cutest." },
    { key: "note3", label: "Love Note 3", type: "textarea", defaultValue: "Drink some water for me, okay? Yes, that's an order from your boyfriend. 🤭❤️" },
    { key: "note4", label: "Love Note 4", type: "textarea", defaultValue: "If today hurts a little more than usual, come sit here with me for a while." },
    { key: "note5", label: "Love Note 5", type: "textarea", defaultValue: "You don't have to pretend you're okay with me." },
    { key: "note6", label: "Love Note 6", type: "textarea", defaultValue: "Even on your most tired days, you're still my favorite person." },
    { key: "note7", label: "Love Note 7", type: "textarea", defaultValue: "Nothing about one difficult day can make me love you less." },
    { key: "note8", label: "Love Note 8", type: "textarea", defaultValue: "Come back here whenever you need a little extra love." },

    // SECTION 3: CARE / PAMPER CORNER
    { key: "careTitle", label: "Care Section Title", type: "text", defaultValue: "Okay Baby, Let Me Take Care of You" },
    { key: "careSubtitle", label: "Care Section Subtitle", type: "text", defaultValue: "Just a few tiny things before you go back to being my adorable little grump. 🥺❤️" },
    { key: "careItem1", label: "Care Checklist Item 1", type: "text", defaultValue: "💧 Drink some water for me" },
    { key: "careItem2", label: "Care Checklist Item 2", type: "text", defaultValue: "🍫 Have something you like" },
    { key: "careItem3", label: "Care Checklist Item 3", type: "text", defaultValue: "🛌 Get some proper rest" },
    { key: "careItem4", label: "Care Checklist Item 4", type: "text", defaultValue: "🫂 Take your virtual hug" },
    { key: "careItem5", label: "Care Checklist Item 5", type: "text", defaultValue: "🌸 Take a little break" },
    { key: "careItem6", label: "Care Checklist Item 6", type: "text", defaultValue: "🥺 Don't be too hard on yourself" },

    // SECTION 4: SONGS FOR MY BABY
    { key: "songsTitle", label: "Songs Section Title", type: "text", defaultValue: "Songs For My Baby" },
    { key: "songsSubtitle", label: "Songs Section Subtitle", type: "text", defaultValue: "Close your eyes for a minute. Let me keep you company." },
    { key: "featuredSongTitle", label: "Featured Song Title", type: "text", defaultValue: "Tera Chehra" },
    { key: "featuredSongArtist", label: "Featured Song Artist", type: "text", defaultValue: "Himesh Reshammiya, Arijit Singh" },
    { key: "musicProvider", label: "Music Provider / Source Type", type: "text", defaultValue: "spotify", helpText: "Auto-detected or specify: spotify, youtube, apple, or direct" },
    { key: "featuredSongUrl", label: "Song URL / Spotify Link / Direct MP3", type: "song-url", defaultValue: "https://open.spotify.com/track/0fU73va0bnroitbOzudBU4" },
    { key: "featuredSongCover", label: "Featured Album Cover URL", type: "image", defaultValue: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80" },

    // SECTION 5: THINGS I LOVE ABOUT YOU
    { key: "thingsTitle", label: "Things I Love Section Title", type: "text", defaultValue: "Things I Love About You" },
    { key: "thingsSubtitle", label: "Things I Love Section Subtitle", type: "text", defaultValue: "Just in case you ever forget." },
    { key: "love1Title", label: "Thing 1 Title", type: "text", defaultValue: "♡ Your Little Smile" },
    { key: "love1Msg", label: "Thing 1 Message", type: "textarea", defaultValue: "How your whole face lights up and makes all my worries vanish in a second." },
    { key: "love2Title", label: "Thing 2 Title", type: "text", defaultValue: "♡ Your Random Mood Swings" },
    { key: "love2Msg", label: "Thing 2 Message", type: "textarea", defaultValue: "Even when you're grumpy, you're still my baby. Your little moods don't scare me away." },
    { key: "love3Title", label: "Thing 3 Title", type: "text", defaultValue: "♡ The Way You Talk" },
    { key: "love3Msg", label: "Thing 3 Message", type: "textarea", defaultValue: "The soft, adorable way you explain things when you're super excited or sleepy." },
    { key: "love4Title", label: "Thing 4 Title", type: "text", defaultValue: "♡ Your Cute Anger" },
    { key: "love4Msg", label: "Thing 4 Message", type: "textarea", defaultValue: "You try so hard to look dangerous when you're mad, but you're just pure cuteness." },
    { key: "love5Title", label: "Thing 5 Title", type: "text", defaultValue: "♡ How You Care About Everyone" },
    { key: "love5Msg", label: "Thing 5 Message", type: "textarea", defaultValue: "Your golden heart that's always thinking about making everyone around you happy." },
    { key: "love6Title", label: "Thing 6 Title", type: "text", defaultValue: "♡ Your Silly Side" },
    { key: "love6Msg", label: "Thing 6 Message", type: "textarea", defaultValue: "The goofy version of you that nobody else in the world gets to see except me." },
    { key: "love7Title", label: "Thing 7 Title", type: "text", defaultValue: "♡ How You Make Ordinary Days Better" },
    { key: "love7Msg", label: "Thing 7 Message", type: "textarea", defaultValue: "Just knowing you exist and you're mine makes every mundane day feel special." },
    { key: "love8Title", label: "Thing 8 Title", type: "text", defaultValue: "♡ Simply... You." },
    { key: "love8Msg", label: "Thing 8 Message", type: "textarea", defaultValue: "I love every single version of you — happy, sleepy, grumpy, or emotional. Always." },

    // SECTION 6: TELL ME WHAT YOU NEED (GENTLE BOYFRIEND OFFERS -> SHORT WHATSAPP REQUESTS)
    { key: "needsTitle", label: "Needs Section Title", type: "text", defaultValue: "Baby, What Do You Need? 🥺" },
    { key: "needsSubtitle", label: "Needs Section Subtitle", type: "text", defaultValue: "Pick whatever would make you feel a little better. ❤️" },
    { key: "whatsappPhoneNumber", label: "Partner WhatsApp Number", type: "text", defaultValue: "919876543210", placeholder: "e.g. 919876543210", helpText: "Include country code without + or spaces. Example: 919876543210" },
    { key: "option1", label: "Option 1 (e.g. 🫂 Ek Hug?)", type: "text", defaultValue: "🫂 Ek Hug?" },
    { key: "option2", label: "Option 2 (e.g. 🍫 Chocolate Laaun?)", type: "text", defaultValue: "🍫 Chocolate Laaun?" },
    { key: "option3", label: "Option 3 (e.g. 🥺 Thodi Pampering?)", type: "text", defaultValue: "🥺 Thodi Pampering?" },
    { key: "option4", label: "Option 4 (e.g. 💕 Extra Pyaar?)", type: "text", defaultValue: "💕 Extra Pyaar?" },
    { key: "option5", label: "Option 5 (e.g. 🧸 Thoda Laad?)", type: "text", defaultValue: "🧸 Thoda Laad?" },
    { key: "option6", label: "Option 6 (e.g. 📞 Thodi Der Baat Karein?)", type: "text", defaultValue: "📞 Thodi Der Baat Karein?" },
    { key: "option7", label: "Option 7 (e.g. 🌷 Mood Theek Karein?)", type: "text", defaultValue: "🌷 Mood Theek Karein?" },
    { key: "option8", label: "Option 8 (e.g. 🫶 Thoda Sa Saath?)", type: "text", defaultValue: "🫶 Thoda Sa Saath?" },
    { key: "option9", label: "Option 9 (e.g. ☕ Kuch Warm Laaun?)", type: "text", defaultValue: "☕ Kuch Warm Laaun?" },
    { key: "option10", label: "Option 10 (e.g. 💌 Ek Pyaara Sa Note?)", type: "text", defaultValue: "💌 Ek Pyaara Sa Note?" },

    // SECTION 7: A LITTLE JAR FULL OF LOVE
    { key: "jarTitle", label: "Jar Section Title", type: "text", defaultValue: "A Little Jar Full of Love" },
    { key: "jarSubtitle", label: "Jar Section Subtitle", type: "text", defaultValue: "I put tiny reminders inside for the days when you forget how special you are." },
    { key: "jar1", label: "Jar Reminder 1", type: "textarea", defaultValue: "You make my life softer." },
    { key: "jar2", label: "Jar Reminder 2", type: "textarea", defaultValue: "I'm proud of you." },
    { key: "jar3", label: "Jar Reminder 3", type: "textarea", defaultValue: "You don't have to earn my love." },
    { key: "jar4", label: "Jar Reminder 4", type: "textarea", defaultValue: "You are my favorite notification." },
    { key: "jar5", label: "Jar Reminder 5", type: "textarea", defaultValue: "You're doing better than you think." },
    { key: "jar6", label: "Jar Reminder 6", type: "textarea", defaultValue: "Somewhere in the world, your boyfriend is thinking about you right now. ❤️" },
    { key: "jar7", label: "Jar Reminder 7", type: "textarea", defaultValue: "You're precious to me, even on your messiest days." },
    { key: "jar8", label: "Jar Reminder 8", type: "textarea", defaultValue: "You are loved exactly as you are." },

    // SECTION 8: FOR THE DAYS YOU NEED ME
    { key: "openTitle", label: "Open When Section Title", type: "text", defaultValue: "For The Days You Need Me" },
    { key: "openSubtitle", label: "Open When Section Subtitle", type: "text", defaultValue: "Open one whenever you need a little piece of me." },
    { key: "openTired", label: "Note: Open when you're tired", type: "textarea", defaultValue: "Hey baby. Take off your shoes, lie down, and let your body rest. You've done enough for today. I'm so proud of how hard you try every day." },
    { key: "openHurting", label: "Note: Open when you're hurting", type: "textarea", defaultValue: "If your body or heart is hurting today, I wish I could hold your hand and carry it for you. Just lie still, breathe slowly, and let me pamper you." },
    { key: "openAngry", label: "Note: Open when you're angry", type: "textarea", defaultValue: "You're allowed to be mad at the world today! Vent to me all you want. I won't get defensive, I'm on your team forever." },
    { key: "openCrying", label: "Note: Open when you feel like crying", type: "textarea", defaultValue: "If you're reading this while crying, let the tears come. You don't have to hide them from me. I wish I could sit beside you right now, hold your hand, and stay until you feel lighter. Just breathe, baby. I'm here." },
    { key: "openMiss", label: "Note: Open when you miss me", type: "textarea", defaultValue: "Close your eyes for three seconds. I am thinking of you right at this exact moment. My arms are wrapped right around you." },
    { key: "openReassurance", label: "Note: Open when you need reassurance", type: "textarea", defaultValue: "You are safe, you are cherished, and nothing you do or feel today will ever change how deeply I love you." },
    { key: "openLoved", label: "Note: Open when you just want to feel loved", type: "textarea", defaultValue: "You are my favorite human in the entire universe. Thank you for being my girl." },

    // SECTION 9: PRIVATE LETTER
    { key: "letterTitle", label: "Private Letter Title", type: "text", defaultValue: "A Letter From Me To You" },
    { key: "letterGreeting", label: "Letter Opening Line", type: "text", defaultValue: "Okay baby... this one is just for you. ❤️" },
    { key: "letterBody", label: "Letter Content", type: "textarea", defaultValue: "Hey my baby,\n\nI know I can't take every uncomfortable day away from you.\n\nI can't magically make the tiredness disappear.\nI can't always fix the things that hurt.\n\nBut I can promise you one thing.\n\nYou never have to go through those moments feeling like you have to handle everything alone.\n\nOn the days you're happy, I'll celebrate with you.\nOn the days you're angry, I'll give you space and still love you.\nOn the days you're crying, I'll stay.\n\nAnd on the days when you don't even know what you need...\nI'll still be here asking,\n'Baby, what can I do for you?'\n\nI made this little place because sometimes I wish I could wrap you in a blanket, give you your favorite snack, hold your hand, kiss your forehead, and tell you that everything will be okay.\n\nUntil I can do that in person, come here whenever you need me.\n\nI love you." },
    { key: "letterSignature", label: "Letter Signature", type: "text", defaultValue: "Always yours, ❤️" },

    // SECTION 10: FINAL CLOSING
    { key: "finalTitle", label: "Final Section Title", type: "text", defaultValue: "Okay baby, that's enough for today. ❤️" },
    { key: "finalLine1", label: "Final Message Line 1", type: "text", defaultValue: "Go rest now." },
    { key: "finalLine2", label: "Final Message Line 2", type: "text", defaultValue: "Take care of yourself for me." },
    { key: "finalLine3", label: "Final Message Line 3", type: "textarea", defaultValue: "And remember...\nYou are loved.\nYou are safe.\nYou are precious to me.\nI'll be right here whenever you need me." },
    { key: "finalLine4", label: "Final Line 4", type: "text", defaultValue: "I'll be right here whenever you need me." },
    { key: "finalCoda", label: "Final Footer Coda", type: "text", defaultValue: "Made with all my love, just for you. ❤️" },
    { key: "bgMusicUrl", label: "Background Audio URL", type: "audio", defaultValue: "/audio/romantic.mp3" },
  ],
  demoData: {
    partnerName: "My Baby",
    senderName: "Rahul",
    heroBadge: "♡ just for my baby ♡",
    heroGreeting: "Heyy, my baby. ❤️",
    heroHeadline: "Aaj bohot tiring feel ho raha hai na?",
    heroCopy1: "Don't worry, baby. I'm always right beside you.",
    heroCopy2: "I know today might feel a little heavier than usual, so I made something small for you. 🥺",
    heroCopy3: "Come, check it out. I hope it makes you smile. ❤️",
    heroImage: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80",
    ctaPrimary: "💗 See What I Made For You",
    ctaSecondary: "🫂 Come Get Your Hug",

    notesTitle: "A Little Note From Me",
    notesSubtitle: "Whenever you need a tiny reminder that you're loved.",
    note1: "Baby, you don't have to do everything today. Rest a little. I'll still be proud of you. ❤️",
    note2: "You're allowed to be grumpy today. I still think you're the cutest.",
    note3: "Drink some water for me, okay? Yes, that's an order from your boyfriend. 🤭❤️",
    note4: "If today hurts a little more than usual, come sit here with me for a while.",
    note5: "You don't have to pretend you're okay with me.",
    note6: "Even on your most tired days, you're still my favorite person.",
    note7: "Nothing about one difficult day can make me love you less.",
    note8: "Come back here whenever you need a little extra love.",

    careTitle: "Okay Baby, Let Me Take Care of You",
    careSubtitle: "Just a few tiny things before you go back to being my adorable little grump. 🥺❤️",
    careItem1: "💧 Drink some water for me",
    careItem2: "🍫 Have something you like",
    careItem3: "🛌 Get some proper rest",
    careItem4: "🫂 Take your virtual hug",
    careItem5: "🌸 Take a little break",
    careItem6: "🥺 Don't be too hard on yourself",

    songsTitle: "Songs For My Baby",
    songsSubtitle: "Close your eyes for a minute. Let me keep you company.",
    featuredSongTitle: "Tera Chehra",
    featuredSongArtist: "Himesh Reshammiya, Arijit Singh",
    musicProvider: "spotify",
    featuredSongUrl: "https://open.spotify.com/track/0fU73va0bnroitbOzudBU4",
    featuredSongCover: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",

    thingsTitle: "Things I Love About You",
    thingsSubtitle: "Just in case you ever forget.",
    love1Title: "♡ Your Little Smile",
    love1Msg: "How your whole face lights up and makes all my worries vanish in a second.",
    love2Title: "♡ Your Random Mood Swings",
    love2Msg: "Even when you're grumpy, you're still my baby. Your little moods don't scare me away.",
    love3Title: "♡ The Way You Talk",
    love3Msg: "The soft, adorable way you explain things when you're super excited or sleepy.",
    love4Title: "♡ Your Cute Anger",
    love4Msg: "You try so hard to look dangerous when you're mad, but you're just pure cuteness.",
    love5Title: "♡ How You Care About Everyone",
    love5Msg: "Your golden heart that's always thinking about making everyone around you happy.",
    love6Title: "♡ Your Silly Side",
    love6Msg: "The goofy version of you that nobody else in the world gets to see except me.",
    love7Title: "♡ How You Make Ordinary Days Better",
    love7Msg: "Just knowing you exist and you're mine makes every mundane day feel special.",
    love8Title: "♡ Simply... You.",
    love8Msg: "I love every single version of you — happy, sleepy, grumpy, or emotional. Always.",

    needsTitle: "Baby, What Do You Need? 🥺",
    needsSubtitle: "Pick whatever would make you feel a little better. ❤️",
    whatsappPhoneNumber: "919876543210",
    option1: "🫂 Ek Hug?",
    option2: "🍫 Chocolate Laaun?",
    option3: "🥺 Thodi Pampering?",
    option4: "💕 Extra Pyaar?",
    option5: "🧸 Thoda Laad?",
    option6: "📞 Thodi Der Baat Karein?",
    option7: "🌷 Mood Theek Karein?",
    option8: "🫶 Thoda Sa Saath?",
    option9: "☕ Kuch Warm Laaun?",
    option10: "💌 Ek Pyaara Sa Note?",

    jarTitle: "A Little Jar Full of Love",
    jarSubtitle: "I put tiny reminders inside for the days when you forget how special you are.",
    jar1: "You make my life softer.",
    jar2: "I'm proud of you.",
    jar3: "You don't have to earn my love.",
    jar4: "You are my favorite notification.",
    jar5: "You're doing better than you think.",
    jar6: "Somewhere in the world, your boyfriend is thinking about you right now. ❤️",
    jar7: "You're precious to me, even on your messiest days.",
    jar8: "You are loved exactly as you are.",

    openTitle: "For The Days You Need Me",
    openSubtitle: "Open one whenever you need a little piece of me.",
    openTired: "Hey baby. Take off your shoes, lie down, and let your body rest. You've done enough for today. I'm so proud of how hard you try every day.",
    openHurting: "If your body or heart is hurting today, I wish I could hold your hand and carry it for you. Just lie still, breathe slowly, and let me pamper you.",
    openAngry: "You're allowed to be mad at the world today! Vent to me all you want. I won't get defensive, I'm on your team forever.",
    openCrying: "If you're reading this while crying, let the tears come. You don't have to hide them from me. I wish I could sit beside you right now, hold your hand, and stay until you feel lighter. Just breathe, baby. I'm here.",
    openMiss: "Close your eyes for three seconds. I am thinking of you right at this exact moment. My arms are wrapped right around you.",
    openReassurance: "You are safe, you are cherished, and nothing you do or feel today will ever change how deeply I love you.",
    openLoved: "You are my favorite human in the entire universe. Thank you for being my girl.",

    letterTitle: "A Letter From Me To You",
    letterGreeting: "Okay baby... this one is just for you. ❤️",
    letterBody: "Hey my baby,\n\nI know I can't take every uncomfortable day away from you.\n\nI can't magically make the tiredness disappear.\nI can't always fix the things that hurt.\n\nBut I can promise you one thing.\n\nYou never have to go through those moments feeling like you have to handle everything alone.\n\nOn the days you're happy, I'll celebrate with you.\nOn the days you're angry, I'll give you space and still love you.\nOn the days you're crying, I'll stay.\n\nAnd on the days when you don't even know what you need...\nI'll still be here asking,\n'Baby, what can I do for you?'\n\nI made this little place because sometimes I wish I could wrap you in a blanket, give you your favorite snack, hold your hand, kiss your forehead, and tell you that everything will be okay.\n\nUntil I can do that in person, come here whenever you need me.\n\nI love you.",
    letterSignature: "Always yours, ❤️",

    finalTitle: "Okay baby, that's enough for today. ❤️",
    finalLine1: "Go rest now.",
    finalLine2: "Take care of yourself for me.",
    finalLine3: "And remember...\nYou are loved.\nYou are safe.\nYou are precious to me.\nI'll be right here whenever you need me.",
    finalLine4: "I'll be right here whenever you need me.",
    finalCoda: "Made with all my love, just for you. ❤️",
    bgMusicUrl: "/audio/romantic.mp3",
  },
};

export default comeHereBabyConfig;
