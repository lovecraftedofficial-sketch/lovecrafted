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
    { key: "recipientName", label: "Partner / Recipient Name", type: "text", defaultValue: "My Dearest" },
    { key: "senderName", label: "Your Name", type: "text", defaultValue: "Alex" },
    { key: "invitationGreeting", label: "Chapter 1 Intro Line 1", type: "text", defaultValue: "I made something for you..." },
    { key: "invitationSubtext", label: "Chapter 1 Intro Line 2", type: "text", defaultValue: "No matter where you are right now, take a quiet breath and open this." },
    { key: "bgMusicUrl", label: "Background Music Track (MP3 Link)", type: "text", defaultValue: "/audio/romantic.mp3" },
    { key: "relationshipDate", label: "Relationship Start Date (YYYY-MM-DD)", type: "text", defaultValue: "2023-02-14" },
    { key: "secretPassword", label: "Secret Gift Box Password / Answer", type: "text", defaultValue: "forever" },
  ],
  demoData: {
    recipientName: "My Dearest Ananya",
    senderName: "Rahul",
    invitationGreeting: "I made something for you...",
    invitationSubtext: "No matter where you are right now, take a quiet breath and open this.",
    bgMusicUrl: "/audio/romantic.mp3",
    relationshipDate: "2023-02-14",
    secretPassword: "forever",
  },
};

export default untilForeverConfig;
