import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Sparkles,
  Music,
  Play,
  Pause,
  Disc,
  Clock,
  Mail,
  Check,
  Calendar,
  Smile,
  Volume2,
  VolumeX,
  RotateCcw,
  ExternalLink,
  Flame,
  Star,
  Coffee,
  X,
  Maximize2,
} from "lucide-react";
import { toast } from "sonner";

export default function AnniversaryKeepsakeView({ draft, isStandalone = false }) {
  // Safe Fallback Data
  const partner1 = draft?.partner1_name || "Kabir";
  const partner2 = draft?.partner2_name || "Ananya";
  const anniversaryDate = draft?.relationship_date || "2023-11-24";
  const occasionBadge = draft?.occasion_badge || "🥂 Happy Anniversary, My Favorite Human ❤️";
  const greetingTeaser =
    draft?.greeting_teaser ||
    draft?.occasion_title ||
    "Can you believe we've made it another year without driving each other crazy? Happy Anniversary, my love! You're still the only person I'd willingly share my fries and blanket with (and you know that's saying a lot!). Here's to surviving each other, laughing till our stomachs hurt, and falling harder in love every single day.";

  const specialNotes =
    draft?.special_notes || draft?.open_when_notes || [
      {
        id: 1,
        emoji: "🥰",
        title: "Your Sleepy Morning Smile",
        content: "The adorable squint you make when the alarm rings and you stubbornly pull the blanket over your head.",
      },
      {
        id: 2,
        emoji: "✨",
        title: "That Unfiltered Laugh",
        content: "The way you laugh so hard you lose your breath at silly inside jokes that nobody else understands.",
      },
      {
        id: 3,
        emoji: "🤝",
        title: "How You Reach For My Hand",
        content: "The unconscious way you find my fingers whenever we're in crowded places or crossing the street.",
      },
      {
        id: 4,
        emoji: "🍟",
        title: "Our Midnight Cravings",
        content: "How a random 1 AM Maggi run or ice cream drive feels like the sweetest adventure when I'm with you.",
      },
    ];

  const memories1 =
    draft?.memories_section1 || (draft?.memories ? draft.memories.slice(0, 2) : [
      {
        id: 1,
        title: "Our Very First Date",
        caption: "The rainy evening where two hours felt like two seconds.",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 2,
        title: "The First Roadtrip",
        caption: "Bad singing, wrong turns, and the most unforgettable sunset.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      },
    ]);

  const memories2 =
    draft?.memories_section2 || (draft?.memories ? draft.memories.slice(2, 4) : [
      {
        id: 1,
        title: "Goofy Afternoon",
        caption: "You trying to take a serious aesthetic picture while I couldn't stop teasing you.",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: 2,
        title: "Coffee & Cozy Chaos",
        caption: "Messy hair, oversized hoodies, and pure comfort.",
        image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
      },
    ]);

  const proposalTitle = draft?.proposal_letter_title || "Will You Keep Choosing Me? (A Proposal All Over Again) 💍";
  const loveLetter =
    draft?.love_letter ||
    "My love, looking back at our journey, every single day with you feels like a gift I never take for granted. Thank you for choosing me, for holding my hand when life gets messy, and for filling my world with your light and warmth. If I had to live this life a thousand times over, in every universe, I would search for you and choose you every single time. So here is me asking you all over again: Will you stay by my side, hold my hand, and be my forever love? Happy Anniversary, my heart.";

  const songTitle = draft?.music_title || "Sab Tera";
  const songArtist = draft?.music_artist || "Armaan Malik, Shraddha Kapoor";

  // Spotify Track extractor
  const getSpotifyTrackId = (url) => {
    if (!url) return null;
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };
  const spotifyTrackId = getSpotifyTrackId(draft?.bg_music_url || "https://open.spotify.com/track/5uUEytfFSWfTzu5EqZxQju");

  // Interactive States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [revealedTruth, setRevealedTruth] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(true);
  const [proposalAnswer, setProposalAnswer] = useState(null); // 'yes' | 'tease'
  const [loveNoteLikes, setLoveNoteLikes] = useState({});
  const [photoHearts, setPhotoHearts] = useState({});
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [activeModalImage, setActiveModalImage] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});
  const [timeTogether, setTimeTogether] = useState({ days: 365, hours: 14, mins: 28, secs: 40 });

  const audioRef = useRef(null);

  // Live Relationship Time Counter
  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(anniversaryDate || "2023-11-24").getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeTogether({ days, hours, mins, secs });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [anniversaryDate]);

  // Reload audio stream when song changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      audioRef.current.load();
    }
  }, [draft?.audio_preview_url, draft?.bg_music_url]);

  // Audio Time & Scrubber State
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState("00:00");
  const [durationStr, setDurationStr] = useState("04:02");

  const formatTime = (secs) => {
    if (isNaN(secs) || secs === 0) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 242;
    setAudioProgress((cur / dur) * 100);
    setCurrentTimeStr(formatTime(cur));
    if (audioRef.current.duration) {
      setDurationStr(formatTime(audioRef.current.duration));
    }
  };

  // Audio Playback
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(true));
    }
  };

  // Floating Heart Spawner
  const spawnHearts = (e, count = 16) => {
    const originX = e?.clientX || (typeof window !== "undefined" ? window.innerWidth / 2 : 300);
    const originY = e?.clientY || (typeof window !== "undefined" ? window.innerHeight / 2 : 400);
    const emojis = ["❤️", "💖", "💕", "✨", "🌸", "💍"];

    const newHearts = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      originX,
      originY,
      x: (Math.random() - 0.5) * 260,
      y: -120 - Math.random() * 220,
      scale: 0.8 + Math.random() * 0.9,
      rotate: (Math.random() - 0.5) * 70,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setFloatingHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => !newHearts.find((nh) => nh.id === h.id)));
    }, 2200);
  };

  const handleLikeNote = (index, e) => {
    e?.stopPropagation();
    setLoveNoteLikes((prev) => ({
      ...prev,
      [index]: (prev[index] || 1) + 1,
    }));
    spawnHearts(e, 3);
  };

  const handlePhotoHeart = (key, e) => {
    e?.stopPropagation();
    setPhotoHearts((prev) => ({
      ...prev,
      [key]: (prev[key] || 1) + 1,
    }));
    spawnHearts(e, 3);
  };

  const toggleCardFlip = (key) => {
    setFlippedCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="relative w-full text-[#f5e6d3] selection:bg-[#e8b4b8] selection:text-[#070304] overflow-hidden">
      {/* Background MP3 Audio */}
      <audio
        ref={audioRef}
        src={
          draft?.audio_preview_url ||
          (draft?.bg_music_url && (draft.bg_music_url.includes(".mp3") || draft.bg_music_url.includes(".m4a") || draft.bg_music_url.startsWith("/audio/")))
            ? (draft?.audio_preview_url || draft.bg_music_url)
            : "/audio/sab-tera.mp3"
        }
        loop
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Floating Hearts Particle Layer */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
        <AnimatePresence>
          {floatingHearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 1, scale: h.scale * 0.5, x: 0, y: 0, rotate: 0 }}
              animate={{ opacity: [1, 1, 0], y: h.y, x: h.x, scale: h.scale, rotate: h.rotate }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeOut" }}
              style={{
                position: "fixed",
                left: h.originX,
                top: h.originY,
              }}
              className="text-2xl drop-shadow-[0_0_15px_rgba(244,63,94,0.9)]"
            >
              {h.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#e8b4b8]/15 via-[#d48b95]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[40%] right-0 w-[500px] h-[500px] bg-[#dfc19c]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[20%] left-0 w-[500px] h-[500px] bg-[#e8b4b8]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-20">
        {/* =========================================================================
            SECTION 1: HERO, WARM GREETING & PLAYFUL TEASING
           ========================================================================= */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-7 pt-4"
        >
          {/* Occasion Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e8b4b8]/30 bg-[#160b11]/80 backdrop-blur-md px-4 py-1.5 shadow-[0_0_20px_rgba(232,180,184,0.15)]">
            <Sparkles className="size-3.5 text-[#e8b4b8] animate-pulse" />
            <span className="text-[0.7rem] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#e8b4b8]">
              {occasionBadge}
            </span>
          </div>

          {/* Couple Names */}
          <div className="space-y-3">
            <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal tracking-wide drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
              {partner1} <span className="italic font-light text-[#e8b4b8]">&amp;</span> {partner2}
            </h1>
            <p className="text-xs sm:text-sm text-[#dfc19c]/90 tracking-widest font-serif flex items-center justify-center gap-2">
              <Calendar className="size-3.5 text-[#e8b4b8]" />
              <span>Anniversary Date: {anniversaryDate}</span>
            </p>
          </div>

          {/* Live Relationship Counter Capsules */}
          <div className="py-2">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[#c5b0a5]/80 mb-3 font-semibold">
              COUNTING EVERY HEARTBEAT TOGETHER
            </p>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto">
              {[
                { label: "DAYS", value: timeTogether.days },
                { label: "HOURS", value: timeTogether.hours },
                { label: "MINUTES", value: timeTogether.mins },
                { label: "SECONDS", value: timeTogether.secs },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[#dfc19c]/20 bg-gradient-to-b from-[#1c0c16]/90 to-[#12070e]/90 p-3 text-center shadow-lg hover:border-[#e8b4b8]/50 transition-all hover:scale-105"
                >
                  <span className="font-serif text-xl sm:text-2xl font-bold text-white block drop-shadow-sm">
                    {item.value}
                  </span>
                  <span className="text-[0.6rem] tracking-wider text-[#dfc19c]/80 font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Warm Greeting & Playful Teasing Card (Interactive) */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="rounded-3xl border border-[#dfc19c]/25 bg-gradient-to-b from-[#180a13]/80 via-[#12060e]/90 to-[#0d040a]/95 p-6 sm:p-8 text-left shadow-2xl backdrop-blur-xl relative overflow-hidden group"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#dfc19c]/10">
              <span className="text-[0.68rem] uppercase tracking-widest text-[#e8b4b8] font-semibold flex items-center gap-2">
                <Smile className="size-4 text-[#e8b4b8]" />
                A Warm Greeting &amp; A Little Teasing
              </span>
              <span className="text-[0.65rem] px-2.5 py-0.5 rounded-full bg-[#e8b4b8]/15 text-[#e8b4b8] border border-[#e8b4b8]/20">
                Playful &amp; Sweet
              </span>
            </div>

            <p className="font-serif text-base sm:text-lg italic leading-relaxed text-[#f5e6d3]/95 pt-4">
              &ldquo;{greetingTeaser}&rdquo;
            </p>

            {/* Interactive Reveal Button */}
            <div className="pt-5 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setRevealedTruth(!revealedTruth)}
                className="inline-flex items-center gap-2 text-xs font-serif font-medium text-[#e8b4b8] hover:text-[#dfc19c] transition-all cursor-pointer group/btn"
              >
                <Mail className="size-3.5 group-hover/btn:rotate-12 transition-transform" />
                <span>{revealedTruth ? "Hide secret truth" : "Tap to reveal the uncensored truth 💌"}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  spawnHearts(e, 14);
                  toast.success("Sent a shower of love! 💖");
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#e8b4b8]/15 hover:bg-[#e8b4b8]/25 text-[#e8b4b8] border border-[#e8b4b8]/30 transition-all hover:scale-105 cursor-pointer"
              >
                <Heart className="size-3.5 fill-[#e8b4b8]" />
                <span>Send Love Shower</span>
              </button>
            </div>

            {/* Hidden Truth Reveal */}
            <AnimatePresence>
              {revealedTruth && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-[#dfc19c]/15 text-xs sm:text-sm font-serif italic text-[#dfc19c] bg-[#1a0813]/60 p-4 rounded-xl"
                >
                  <p className="leading-relaxed">
                    ❤️ <strong>The Real Truth:</strong> &ldquo;Okay fine, you got me. I love you more than all the fries
                    in the world, more than extra sleep on lazy Sunday mornings, and more than words could ever explain.
                    Thank you for being my anchor and my happy place.&rdquo;
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.section>

        {/* Elegant Golden Divider */}
        <div className="flex items-center justify-center gap-4 text-[#dfc19c]/30">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#dfc19c]/40" />
          <Sparkles className="size-4 text-[#e8b4b8]" />
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#dfc19c]/40" />
        </div>

        {/* =========================================================================
            SECTION 2: LITTLE THINGS I ADORE ABOUT YOU (INTERACTIVE SPECIAL NOTES)
           ========================================================================= */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[0.68rem] uppercase tracking-[0.3em] text-[#e8b4b8] font-semibold flex items-center justify-center gap-2">
              <Sparkles className="size-3.5" />
              LITTLE THINGS I ADORE ABOUT YOU
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              The Quirks That Make Me Fall in Love
            </h2>
            <p className="text-xs text-[#c5b0a5] max-w-md mx-auto">
              Tap any memory to flip and read the sweet details or tap the heart to react!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {specialNotes.map((note, idx) => {
              const key = `note-${idx}`;
              const isFlipped = flippedCards[key];
              const likes = loveNoteLikes[idx] || 1;

              return (
                <motion.div
                  key={note.id || idx}
                  whileHover={{ y: -4 }}
                  onClick={() => toggleCardFlip(key)}
                  className="rounded-2xl border border-[#dfc19c]/20 bg-gradient-to-b from-[#180a13]/85 to-[#0e050b]/90 p-5 space-y-3 cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(212,139,149,0.15)] hover:border-[#e8b4b8]/50 transition-all relative overflow-hidden group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl sm:text-2xl p-2 rounded-xl bg-[#220d1a] border border-[#e8b4b8]/20 group-hover:scale-110 transition-transform">
                        {note.emoji || "✨"}
                      </span>
                      <div>
                        <span className="text-[0.65rem] text-[#dfc19c]/70 uppercase tracking-widest font-semibold block">
                          Quirk #{idx + 1}
                        </span>
                        <h3 className="font-serif text-sm sm:text-base font-medium text-white">{note.title}</h3>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleLikeNote(idx, e)}
                      className="flex items-center gap-1 text-[0.68rem] px-2.5 py-1 rounded-full bg-[#200c19] border border-[#e8b4b8]/30 text-[#e8b4b8] hover:bg-[#d48b95] hover:text-[#0a0507] transition-all cursor-pointer"
                    >
                      <Heart className="size-3 fill-current" />
                      <span>{likes}</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-[#c5b0a5] leading-relaxed font-sans">{note.content}</p>

                  <div className="pt-1 flex items-center justify-between text-[0.65rem] text-[#dfc19c]/60">
                    <span className="italic">Click to send extra love ❤️</span>
                    <span className="text-[#e8b4b8]">Always Adored</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Elegant Golden Divider */}
        <div className="flex items-center justify-center gap-4 text-[#dfc19c]/30">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#dfc19c]/40" />
          <Music className="size-4 text-[#e8b4b8]" />
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#dfc19c]/40" />
        </div>

        {/* =========================================================================
            SECTION 3: OUR SPECIAL SONG (INTERACTIVE VINYL RECORD & FULL PLAYBACK)
           ========================================================================= */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[0.68rem] uppercase tracking-[0.3em] text-[#e8b4b8] font-semibold flex items-center justify-center gap-2">
              <Music className="size-3.5" />
              OUR ANNIVERSARY SOUNDTRACK
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              {songTitle}
            </h2>
            <p className="text-xs text-[#dfc19c]/90 font-serif italic">
              {songArtist}
            </p>
          </div>

          {/* Luxury Vinyl Record Card — Single Unified Audio Player */}
          <div className="rounded-3xl border border-[#dfc19c]/25 bg-gradient-to-b from-[#180a13]/90 via-[#10050c]/95 to-[#090306] p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center gap-8 justify-center">
              {/* Spinning Vinyl Record */}
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: "linear" }}
                  className="size-36 sm:size-44 rounded-full bg-gradient-to-tr from-[#050505] via-[#1a1a1a] to-[#0a0a0a] border-4 border-[#222] shadow-[0_15px_35px_rgba(0,0,0,0.8)] relative flex items-center justify-center"
                >
                  {/* Vinyl Grooves */}
                  <div className="absolute inset-2 rounded-full border border-white/5" />
                  <div className="absolute inset-5 rounded-full border border-white/5" />
                  <div className="absolute inset-8 rounded-full border border-white/5" />
                  <div className="absolute inset-11 rounded-full border border-white/5" />

                  {/* Vinyl Center Label */}
                  <div className="size-14 sm:size-16 rounded-full bg-gradient-to-tr from-[#d48b95] to-[#e8b4b8] border-2 border-[#0a0507] flex flex-col items-center justify-center shadow-inner text-center px-1 overflow-hidden relative">
                    {draft?.music_cover ? (
                      <img
                        src={draft.music_cover}
                        alt={songTitle}
                        className="size-full object-cover rounded-full"
                      />
                    ) : (
                      <>
                        <span className="font-serif text-[0.68rem] font-bold text-[#0a0507] tracking-wider leading-tight">
                          {partner1[0]} &amp; {partner2[0]}
                        </span>
                        <span className="text-[0.48rem] uppercase font-sans font-bold text-[#0a0507]/80 tracking-tighter truncate max-w-full">
                          {songTitle}
                        </span>
                      </>
                    )}
                  </div>
                </motion.div>

                {/* Stylus Needle Indicator */}
                <div
                  className={`absolute -top-2 -right-1 w-10 h-16 pointer-events-none transition-transform duration-500 origin-top-right ${
                    isPlaying ? "rotate-[20deg]" : "rotate-0 opacity-60"
                  }`}
                >
                  <div className="w-1.5 h-12 bg-gradient-to-b from-[#dfc19c] to-[#997f62] rounded-full mx-auto shadow-md" />
                  <div className="size-3 rounded-full bg-[#dfc19c] border border-white/40 mx-auto" />
                </div>
              </div>

              {/* Vinyl Player Controls */}
              <div className="space-y-4 text-center sm:text-left flex-1 max-w-xs">
                <div>
                  <span className="text-[0.65rem] uppercase tracking-widest text-[#dfc19c]/70 font-semibold block">
                    NOW PLAYING
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl text-white font-medium line-clamp-1">
                    {songTitle}
                  </h3>
                  <p className="text-xs text-[#e8b4b8] italic font-serif">
                    {songArtist}
                  </p>
                  <p className="text-[0.68rem] text-[#c5b0a5]/70 pt-0.5">
                    Continuous romantic playback
                  </p>
                </div>

                {/* Waveform Soundwave Equalizer */}
                <div className="flex items-center gap-1 h-7">
                  {[40, 80, 30, 95, 60, 85, 45, 100, 70, 40, 90, 50, 80, 30, 95, 60, 40, 85, 30, 70].map((h, i) => (
                    <span
                      key={i}
                      style={{ height: isPlaying ? `${h}%` : "20%" }}
                      className="flex-1 bg-gradient-to-t from-[#d48b95] to-[#e8b4b8] rounded-full transition-all duration-300"
                    />
                  ))}
                </div>

                {/* Interactive Scrubber & Time */}
                <div className="space-y-1 pt-0.5">
                  <div
                    className="w-full bg-[#200d1a] h-1.5 rounded-full overflow-hidden border border-[#dfc19c]/20 cursor-pointer"
                    onClick={(e) => {
                      if (!audioRef.current || !audioRef.current.duration) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                      audioRef.current.currentTime = pos * audioRef.current.duration;
                    }}
                  >
                    <div
                      style={{ width: `${audioProgress}%` }}
                      className="h-full bg-gradient-to-r from-[#e8b4b8] to-[#d48b95] transition-all duration-100"
                    />
                  </div>
                  <div className="flex justify-between text-[0.62rem] text-[#c5b0a5]/80 font-mono">
                    <span>{currentTimeStr}</span>
                    <span className="text-[#e8b4b8]">{isPlaying ? "Playing 🎵" : "Paused"}</span>
                    <span>{durationStr}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="h-11 px-6 rounded-full bg-gradient-to-r from-[#e8b4b8] to-[#d48b95] text-[#0a0507] text-xs font-semibold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-rose-950/40 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
                    <span>{isPlaying ? "Pause Song" : "Play Our Song"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="size-11 rounded-full border border-[#dfc19c]/30 bg-[#160b11] text-[#dfc19c] flex items-center justify-center hover:bg-[#200f1a] transition-all cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="size-4 text-rose-400" /> : <Volume2 className="size-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Elegant Golden Divider */}
        <div className="flex items-center justify-center gap-4 text-[#dfc19c]/30">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#dfc19c]/40" />
          <Heart className="size-4 text-[#e8b4b8]" />
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#dfc19c]/40" />
        </div>

        {/* =========================================================================
            SECTION 4: PHOTO GALLERY 1 — MILESTONE MOMENTS (WHERE IT ALL BEGAN)
           ========================================================================= */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[0.68rem] uppercase tracking-[0.3em] text-[#e8b4b8] font-semibold flex items-center justify-center gap-2">
              <Sparkles className="size-3.5" />
              SECTION 1 · MILESTONE MOMENTS
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              {draft?.memories_section1_title || "Where It All Began"}
            </h2>
            <p className="text-xs text-[#c5b0a5]">Tap any photograph to zoom or leave a heart reaction ❤️</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {memories1.map((photo, idx) => {
              const photoKey = `milestone-${idx}`;
              const hearts = photoHearts[photoKey] || 12;

              return (
                <motion.div
                  key={photo.id || idx}
                  whileHover={{ y: -6, rotate: idx % 2 === 0 ? -1 : 1 }}
                  onClick={() => setActiveModalImage(photo.image)}
                  className="rounded-2xl bg-[#160b11] p-3 border border-[#dfc19c]/25 shadow-xl hover:shadow-[0_15px_35px_rgba(232,180,184,0.2)] transition-all cursor-pointer group"
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#0a0507]">
                    <img
                      src={photo.image}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-[0.65rem] text-white flex items-center gap-1 font-serif">
                        <Maximize2 className="size-3" /> Tap to expand
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 px-1 flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <h3 className="font-serif text-sm font-medium text-white">{photo.title}</h3>
                      <p className="text-xs text-[#c5b0a5] italic leading-snug">{photo.caption}</p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handlePhotoHeart(photoKey, e)}
                      className="flex items-center gap-1 text-[0.68rem] px-2.5 py-1 rounded-full bg-[#200c19] border border-[#e8b4b8]/30 text-[#e8b4b8] hover:bg-[#d48b95] hover:text-[#0a0507] transition-all cursor-pointer"
                    >
                      <Heart className="size-3 fill-current" />
                      <span>{hearts}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: PHOTO GALLERY 2 — CANDID & SILLY MOMENTS (UNFILTERED LOVE)
           ========================================================================= */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[0.68rem] uppercase tracking-[0.3em] text-[#e8b4b8] font-semibold flex items-center justify-center gap-2">
              <Smile className="size-3.5" />
              SECTION 2 · UNFILTERED LOVE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              {draft?.memories_section2_title || "Our Candid & Silly Moments"}
            </h2>
            <p className="text-xs text-[#c5b0a5]">No poses, just raw laughs, messy hair, and real memories.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {memories2.map((photo, idx) => {
              const photoKey = `candid-${idx}`;
              const hearts = photoHearts[photoKey] || 16;

              return (
                <motion.div
                  key={photo.id || idx}
                  whileHover={{ y: -6, rotate: idx % 2 === 0 ? 1 : -1 }}
                  onClick={() => setActiveModalImage(photo.image)}
                  className="rounded-2xl bg-[#160b11] p-3 border border-[#dfc19c]/25 shadow-xl hover:shadow-[0_15px_35px_rgba(232,180,184,0.2)] transition-all cursor-pointer group"
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#0a0507]">
                    <img
                      src={photo.image}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#0a0507]/80 backdrop-blur-md border border-[#e8b4b8]/30 text-[0.6rem] font-serif text-[#e8b4b8]">
                      ✨ 100% Candid
                    </div>
                  </div>

                  <div className="pt-3 px-1 flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <h3 className="font-serif text-sm font-medium text-white">{photo.title}</h3>
                      <p className="text-xs text-[#c5b0a5] italic leading-snug">{photo.caption}</p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handlePhotoHeart(photoKey, e)}
                      className="flex items-center gap-1 text-[0.68rem] px-2.5 py-1 rounded-full bg-[#200c19] border border-[#e8b4b8]/30 text-[#e8b4b8] hover:bg-[#d48b95] hover:text-[#0a0507] transition-all cursor-pointer"
                    >
                      <Heart className="size-3 fill-current" />
                      <span>{hearts}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Elegant Golden Divider */}
        <div className="flex items-center justify-center gap-4 text-[#dfc19c]/30">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#dfc19c]/40" />
          <Sparkles className="size-4 text-[#e8b4b8]" />
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#dfc19c]/40" />
        </div>

        {/* =========================================================================
            SECTION 6: PROPOSAL LOVE LETTER & INTERACTIVE PROPOSAL (BOTTOM)
           ========================================================================= */}
        <section className="space-y-6 pb-8">
          <div className="text-center space-y-2">
            <span className="text-[0.68rem] uppercase tracking-[0.35em] text-[#e8b4b8] font-semibold flex items-center justify-center gap-2">
              <Sparkles className="size-3.5" />
              A PROPOSAL ALL OVER AGAIN
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal">{proposalTitle}</h2>
          </div>

          {/* Sealed Wax Envelope Card */}
          <div className="rounded-3xl border border-[#e8b4b8]/35 bg-gradient-to-b from-[#1c0c16] via-[#14060f] to-[#0a0307] p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-center space-y-7 relative overflow-hidden">
            {/* Wax Seal / Ring Icon */}
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="size-16 rounded-full bg-gradient-to-tr from-[#d48b95] via-[#dfc19c] to-[#e8b4b8] text-[#0a0507] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(232,180,184,0.4)] cursor-pointer"
              onClick={(e) => spawnHearts(e, 16)}
            >
              <Heart className="size-8 fill-[#0a0507] text-[#0a0507]" />
            </motion.div>

            {/* Proposal Love Letter Body */}
            <div className="rounded-2xl border border-[#dfc19c]/20 bg-[#0d040a]/80 p-6 sm:p-8 max-w-xl mx-auto shadow-inner text-left relative">
              <div className="text-xs uppercase tracking-widest text-[#dfc19c]/60 font-serif mb-4 flex items-center justify-between">
                <span>From: {partner1}</span>
                <span>To: My Forever Love, {partner2}</span>
              </div>
              <p className="font-serif text-sm sm:text-base italic leading-relaxed text-[#f5e6d3]/95 whitespace-pre-line">
                &ldquo;{loveLetter}&rdquo;
              </p>
              <div className="pt-4 text-right">
                <span className="font-serif text-sm text-[#e8b4b8] font-semibold block">Forever Yours,</span>
                <span className="font-serif text-xs text-[#dfc19c]/80">{partner1}</span>
              </div>
            </div>

            {/* Interactive Proposal Response Actions */}
            <div className="pt-2 max-w-md mx-auto space-y-3">
              {proposalAnswer === "yes" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#2a0e1b]/95 via-[#1c0a13]/95 to-[#12050b]/95 border border-[#e8b4b8]/40 text-center space-y-3 shadow-[0_0_35px_rgba(232,180,184,0.25)] backdrop-blur-xl"
                >
                  <div className="size-11 mx-auto rounded-full bg-gradient-to-br from-[#e8b4b8]/20 to-[#d48b95]/30 border border-[#e8b4b8]/40 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(232,180,184,0.3)]">
                    💍
                  </div>
                  <p className="font-serif text-lg sm:text-xl font-semibold text-[#f5e6d3] tracking-wide">
                    {draft?.proposal_yes_title || "You just made me the happiest person in the universe... all over again! 💍❤️"}
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed text-[#e8b4b8] font-serif italic max-w-md mx-auto">
                    &ldquo;{draft?.proposal_yes_message || `Thank you for saying YES to me, ${partner2 || "my love"}. I promise to hold your hand through every high and low, make you laugh on your hardest days, and love you deeper with each passing breath. My forever was always you.`}&rdquo;
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-2 text-[0.7rem] tracking-[0.25em] uppercase font-semibold text-[#dfc19c]">
                    <span>Forever Yours,</span>
                    <span className="text-[#f5e6d3]">{partner1 || "Always"}</span>
                    <span>♡</span>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      setProposalAnswer("yes");
                      spawnHearts(e, 8);
                      toast.success(`My heart is yours forever, ${partner2 || "my love"}! 💍❤️`);
                    }}
                    className="h-12 px-7 rounded-full bg-gradient-to-r from-[#e8b4b8] via-[#dfc19c] to-[#d48b95] text-[#0a0507] text-sm font-semibold flex items-center justify-center gap-2.5 shadow-xl shadow-rose-950/50 hover:scale-105 hover:opacity-95 transition-all cursor-pointer w-full sm:w-auto"
                  >
                    <Sparkles className="size-4" />
                    <span>YES! A Million Times Over! 💍</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      spawnHearts(e, 4);
                      toast.info("Error 404: Saying no is not an option! You are stuck with me forever! 😉❤️");
                    }}
                    className="h-12 px-5 rounded-full border border-[#dfc19c]/30 bg-[#160b11] text-[#dfc19c] text-xs font-medium hover:bg-[#200f19] hover:border-[#dfc19c]/60 transition-all cursor-pointer w-full sm:w-auto"
                  >
                    <span>Let Me Think 😜</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Lightbox / Zoom Modal */}
      <AnimatePresence>
        {activeModalImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden border border-[#e8b4b8]/30 shadow-2xl">
              <img src={activeModalImage} alt="Enlarged Memory" className="w-full h-full object-contain" />
              <button
                type="button"
                onClick={() => setActiveModalImage(null)}
                className="absolute top-3 right-3 size-9 rounded-full bg-[#0a0507]/80 text-white flex items-center justify-center hover:bg-rose-900 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
