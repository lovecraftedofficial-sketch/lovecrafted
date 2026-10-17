import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Heart,
  Gift,
  Flame,
  Music,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Clock,
  Mail,
  Smile,
  Star,
  CheckCircle2,
  Calendar,
  Compass,
  Award,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { resolveSongDetails } from "../../services/songResolver";

export default function CelebrationOfYouTemplate(props) {
  const draft = props.content || props.draft || props.data || props || {};

  // Safe fallback values
  const birthdayName = draft.birthdayName || "Rosea";
  const milestoneBadge = draft.milestoneBadge || "CELEBRATING ANOTHER MAGICAL YEAR";
  const heroGreeting =
    draft.heroGreeting ||
    "To someone who brings so much warmth and light into the world — today is all about celebrating the incredible person you are.";

  const songTitle = draft.songTitle || "Until I Found You";
  const musicArtist = draft.musicArtist || "Stephen Sanchez";
  const bgMusicUrl = draft.bgMusicUrl || "https://open.spotify.com/track/0T5iIrXA4p5GsubkhuBIKV?si=ac94e5ceab2b4154";

  // Dynamic Audio Stream Resolver
  const [resolvedAudio, setResolvedAudio] = useState(
    "https://p.scdn.co/mp3-preview/f813247a989bb9e3c008b573d52a61f39a3e8823"
  );

  useEffect(() => {
    const rawUrl = draft.bgMusicUrl || bgMusicUrl;
    if (rawUrl.includes(".mp3") || rawUrl.includes(".m4a") || rawUrl.startsWith("/audio/")) {
      setResolvedAudio(rawUrl);
    } else {
      resolveSongDetails(rawUrl).then((info) => {
        if (info && info.audioUrl) {
          setResolvedAudio(info.audioUrl);
        }
      });
    }
  }, [draft.bgMusicUrl, bgMusicUrl]);

  const wishJarTitle = draft.wishJarTitle || "Secret Birthday Wishes For You";
  const wishes = [
    {
      title: draft.wish1Title || "Endless Adventures",
      text: draft.wish1Text || "May this coming year take you to beautiful new places, with spontaneous journeys and unforgettable sunset views.",
      icon: Compass,
      color: "#f472b6",
    },
    {
      title: draft.wish2Title || "Peace & Pure Joy",
      text: draft.wish2Text || "May your days be filled with quiet morning comfort, effortless smiles, and zero worries.",
      icon: Smile,
      color: "#fcd34d",
    },
    {
      title: draft.wish3Title || "Unfiltered Laughter",
      text: draft.wish3Text || "May you always have late-night talks, shared stories, and moments that make you laugh until your stomach hurts.",
      icon: Sparkles,
      color: "#e879f9",
    },
    {
      title: draft.wish4Title || "Your Deepest Wishes",
      text: draft.wish4Text || "May every quiet wish you hold in your heart today turn into your favorite reality tomorrow.",
      icon: Star,
      color: "#38bdf8",
    },
  ];

  const timelineTitle = draft.timelineTitle || "Chapters of Your Story";
  const chapters = [
    {
      date: draft.ch1Date || "Chapter 01 · The Beginning",
      title: draft.ch1Title || "The Day You Stole Our Hearts",
      desc: draft.ch1Desc || "From the very start, your bright spirit and warmth lit up every room you walked into.",
    },
    {
      date: draft.ch2Date || "Chapter 02 · Unfiltered Memories",
      title: draft.ch2Title || "Car Karaoke & Late Night Drives",
      desc: draft.ch2Desc || "Late-night drives, long conversations, and inside jokes that only we understand.",
    },
    {
      date: draft.ch3Date || "Chapter 03 · Today & Beyond",
      title: draft.ch3Title || "Becoming Who You Are Today",
      desc: draft.ch3Desc || "So proud of the person you've become, how deeply you care, and the warmth you bring into our lives every single day.",
    },
  ];

  const memoriesTitle = draft.memoriesTitle || "Favorite Moments With You";
  const polaroids = [
    {
      img: draft.card1Image || "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
      caption: draft.card1Caption || "Your million-dollar birthday smile",
    },
    {
      img: draft.card2Image || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
      caption: draft.card2Caption || "Cozy coffee & endless conversations",
    },
    {
      img: draft.card3Image || "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=1200&q=80",
      caption: draft.card3Caption || "Glowing under the golden sunset",
    },
  ];

  const letterTitle = draft.letterTitle || "A Letter From My Heart";
  const letterTo = draft.letterTo || `To My Favorite Human, ${birthdayName}...`;
  const letterBody =
    draft.letterBody ||
    `Happy Birthday!\n\nLooking back at everything we've shared, I am so deeply grateful to have you in my life. You make the mundane feel extraordinary, and your presence is my favorite comforting constant.\n\nI hope this year brings you everything your heart has been quietly wishing for — boundless success, deep peace, spontaneous adventures, and endless reasons to smile.\n\nThank you for existing, for loving me, and for being uniquely, wonderfully YOU.\n\nHappy Birthday once again!`;

  const giftTitle = draft.giftTitle || "Your Birthday Surprise";
  const giftInstruction = draft.giftInstruction || "Tap the present below to unwrap your birthday surprise";
  const surpriseHeader = draft.surpriseHeader || `HAPPY BIRTHDAY, ${birthdayName.toUpperCase()}!`;
  const surpriseMessage =
    draft.surpriseMessage ||
    `You've unlocked: A full day dedicated entirely to you — your favorite meal, zero responsibilities, and a special birthday surprise date planned just for you.`;
  const senderSignoff = draft.senderSignoff || "With all my love, Alex";

  // Interactive States
  const [candleBlown, setCandleBlown] = useState(false);
  const [collectedWishes, setCollectedWishes] = useState({});
  const [activeWishIndex, setActiveWishIndex] = useState(null); // Currently open drawn note
  const [drawnWishes, setDrawnWishes] = useState([]); // List of wish indices drawn from jar
  const [isJarShaking, setIsJarShaking] = useState(false);

  const [activeModalImage, setActiveModalImage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Typewriter Letter
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [typedChars, setTypedChars] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const typewriterTimerRef = useRef(null);

  // Gift Unwrapping State
  const [giftUnwrapped, setGiftUnwrapped] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState([]);
  const audioRef = useRef(null);

  // Audio Progress
  const [audioProgress, setAudioProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState("00:00");
  const [durationStr, setDurationStr] = useState("04:02");

  // Particle Spawner
  const spawnConfetti = (e, count = 24) => {
    const originX = e?.clientX || (typeof window !== "undefined" ? window.innerWidth / 2 : 300);
    const originY = e?.clientY || (typeof window !== "undefined" ? window.innerHeight / 2 : 400);
    const emojis = ["✨", "💖", "🌸", "⭐", "💫", "📜"];

    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      originX,
      originY,
      x: (Math.random() - 0.5) * 320,
      y: -140 - Math.random() * 260,
      scale: 0.7 + Math.random() * 0.9,
      rotate: (Math.random() - 0.5) * 100,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setConfettiParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setConfettiParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 2400);
  };

  // Candle Blow-out Action
  const handleCandleBlow = (e) => {
    e?.stopPropagation();
    if (!candleBlown) {
      setCandleBlown(true);
      spawnConfetti(e, 30);
      toast.success(`Happy Birthday, ${birthdayName}! Your wish is sent to the stars! ✨`);
    } else {
      setCandleBlown(false);
      toast.info("Candle relit! Make another wish ✨");
    }
  };

  // Draw Wish Note From Glass Jar
  const handleDrawWish = (e, targetIdx = null) => {
    e?.stopPropagation();
    setIsJarShaking(true);
    setTimeout(() => setIsJarShaking(false), 500);

    let nextIdx = targetIdx;
    if (nextIdx === null) {
      // Find next undrawn wish or cycle
      const undrawn = wishes.map((_, i) => i).filter((i) => !drawnWishes.includes(i));
      if (undrawn.length > 0) {
        nextIdx = undrawn[0];
      } else {
        nextIdx = (activeWishIndex === null ? 0 : (activeWishIndex + 1) % wishes.length);
      }
    }

    if (!drawnWishes.includes(nextIdx)) {
      setDrawnWishes((prev) => [...prev, nextIdx]);
    }
    setActiveWishIndex(nextIdx);
    spawnConfetti(e, 12);
    toast.success(`You caught a glowing Jugnu! 🪲✨ Secret wish released!`);
  };

  // Gift Unwrap Action
  const handleGiftUnwrap = (e) => {
    e?.stopPropagation();
    if (!giftUnwrapped) {
      setGiftUnwrapped(true);
      spawnConfetti(e, 36);
      toast.success(`Surprise Unwrapped! Happy Birthday, ${birthdayName}! ✨🎉`);
    } else {
      setGiftUnwrapped(false);
    }
  };

  // Collect Love on Wish Note
  const toggleCollectWish = (idx, e) => {
    e?.stopPropagation();
    setCollectedWishes((prev) => ({
      ...prev,
      [idx]: (prev[idx] || 0) + 1,
    }));
    spawnConfetti(e, 5);
  };

  // Typewriter Character Interval Effect
  useEffect(() => {
    if (isLetterOpen && isTyping) {
      if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);

      typewriterTimerRef.current = setInterval(() => {
        setTypedChars((prev) => {
          if (prev >= letterBody.length) {
            clearInterval(typewriterTimerRef.current);
            setIsTyping(false);
            return letterBody.length;
          }
          return prev + 1;
        });
      }, 25);
    }
    return () => {
      if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
    };
  }, [isLetterOpen, isTyping, letterBody]);

  const restartTypewriter = (e) => {
    e.stopPropagation();
    setTypedChars(0);
    setIsTyping(true);
  };

  // Audio Scrubber Handlers
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

  return (
    <div className="relative w-full text-[#f5e6d3] selection:bg-[#f472b6] selection:text-[#0a0507] overflow-hidden bg-[#0a0409] min-h-screen">
      {/* Background MP3 Track */}
      <audio
        ref={audioRef}
        src={draft.audio_preview_url || resolvedAudio}
        loop
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
      />

      {/* Floating Sparkle Particle Layer */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
        <AnimatePresence>
          {confettiParticles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, scale: p.scale * 0.5, x: 0, y: 0, rotate: 0 }}
              animate={{ opacity: [1, 1, 0], y: p.y, x: p.x, scale: p.scale, rotate: p.rotate }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.2, ease: "easeOut" }}
              style={{
                position: "fixed",
                left: p.originX,
                top: p.originY,
              }}
              className="text-xl drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]"
            >
              {p.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Ambient Lighting Layers */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-gradient-to-b from-[#f472b6]/15 via-[#e879f9]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[35%] right-0 w-[500px] h-[500px] bg-[#fbbf24]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 py-12 space-y-20">
        {/* =========================================================================
            SECTION 1: PERSONALIZED BIRTHDAY OPENING & REALISTIC SVG CANDLE CAKE
           ========================================================================= */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-7 pt-4"
        >
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f472b6]/30 bg-[#160714]/80 backdrop-blur-md px-4 py-1.5 shadow-[0_0_20px_rgba(244,114,182,0.15)]">
            <Sparkles className="size-3.5 text-[#f472b6] animate-pulse" />
            <span className="text-[0.68rem] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#f472b6]">
              {milestoneBadge}
            </span>
          </div>

          {/* Birthday Person Title */}
          <div className="space-y-3">
            <h1 className="font-serif text-4xl sm:text-6xl text-white font-normal tracking-wide drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
              Happy Birthday, <span className="italic font-normal text-[#f472b6]">{birthdayName}</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#fcd34d]/90 tracking-widest font-serif flex items-center justify-center gap-2">
              <Calendar className="size-3.5 text-[#fcd34d]" />
              <span>Celebrating You Today &amp; Always</span>
            </p>
          </div>

          {/* Realistic 3D Birthday Cake & Candle Component */}
          <div className="py-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={handleCandleBlow}
              className="relative inline-flex flex-col items-center justify-center p-8 sm:p-10 rounded-3xl border border-[#fcd34d]/25 bg-gradient-to-b from-[#220a1c]/90 via-[#150412]/95 to-[#0b0209] shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl cursor-pointer group"
            >
              {/* Realistic Candle with Flickering Flame */}
              <div className="relative flex flex-col items-center justify-center mb-1">
                {/* Flame Container */}
                <div className="relative h-10 w-8 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {!candleBlown ? (
                      <motion.div
                        key="flame-active"
                        animate={{
                          scale: [1, 1.15, 0.95, 1.1, 1],
                          rotate: [-2, 3, -3, 2, 0],
                        }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="relative flex items-center justify-center cursor-pointer"
                      >
                        {/* Ambient Flame Aura Glow */}
                        <div className="absolute size-10 rounded-full bg-[#fbbf24]/30 blur-md animate-pulse" />
                        {/* Outer Red Flame */}
                        <div className="w-4 h-7 rounded-full bg-gradient-to-t from-[#ef4444] via-[#f97316] to-[#fef08a] blur-[0.5px] shadow-[0_0_15px_rgba(251,191,36,0.9)]" />
                        {/* Inner Yellow Core */}
                        <div className="absolute bottom-0 w-2 h-4 rounded-full bg-[#ffffff] blur-[0.2px]" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="smoke-trail"
                        initial={{ opacity: 1, y: 0, scale: 0.8 }}
                        animate={{ opacity: [1, 0.6, 0], y: -30, scale: 1.4 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="flex flex-col items-center text-xs font-serif text-slate-300 font-medium"
                      >
                        <span className="text-[0.68rem] text-[#fcd34d] font-serif italic tracking-wide">
                          Wish Sent ✨
                        </span>
                        <div className="w-1 h-5 bg-gradient-to-t from-slate-400 to-transparent blur-sm rounded-full mt-1" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Candle Wick */}
                <div className="w-0.5 h-2 bg-[#222] mx-auto rounded-t-sm" />

                {/* Tapered Wax Candle Body */}
                <div className="w-3.5 h-12 bg-gradient-to-b from-[#fcd34d] via-[#f472b6] to-[#ec4899] rounded-t-sm shadow-md border-x border-white/20 relative overflow-hidden">
                  <div className="absolute inset-x-0 top-2 h-1 bg-white/30 rounded-full" />
                  <div className="absolute inset-x-0 top-5 h-1 bg-white/20 rounded-full" />
                </div>
              </div>

              {/* Realistic SVG Birthday Cake */}
              <div className="w-44 sm:w-52 h-24 relative flex flex-col items-center justify-end">
                {/* Cake Tier 2 (Top Frosting Layer) */}
                <div className="w-36 sm:w-42 h-10 rounded-t-2xl bg-gradient-to-b from-[#f472b6] to-[#db2777] border-t border-x border-[#fbcfe8]/40 shadow-inner relative flex items-center justify-center">
                  {/* Frosting Drips */}
                  <div className="absolute -bottom-2 inset-x-0 flex justify-around px-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="w-3 h-3 rounded-full bg-[#f472b6] shadow-sm" />
                    ))}
                  </div>
                </div>

                {/* Cake Tier 1 (Base Layer) */}
                <div className="w-44 sm:w-52 h-12 rounded-t-xl bg-gradient-to-b from-[#831843] via-[#500724] to-[#300314] border-t border-x border-[#f472b6]/30 shadow-2xl relative flex items-center justify-center">
                  <div className="absolute inset-x-3 top-2 h-0.5 bg-[#fcd34d]/40 rounded-full" />
                </div>

                {/* Gold Plate Base */}
                <div className="w-48 sm:w-56 h-3 rounded-full bg-gradient-to-r from-[#b45309] via-[#fcd34d] to-[#b45309] shadow-lg border border-[#fef08a]/40" />
              </div>

              {/* Action Hint */}
              <div className="mt-4 space-y-0.5 text-center">
                <span className="text-[0.68rem] uppercase tracking-widest text-[#fcd34d] font-semibold block">
                  {candleBlown ? "✨ Wish Sent to the Stars" : "Tap candle flame to blow out & make a wish"}
                </span>
                <p className="text-[0.65rem] text-[#f472b6] italic font-serif">
                  {candleBlown ? "Tap again to relit candle" : "Interactive birthday wish experience"}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Birthday Greeting Card */}
          <div className="rounded-3xl border border-[#f472b6]/25 bg-gradient-to-b from-[#1c0817]/90 to-[#10030d]/95 p-6 sm:p-8 text-left shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#f472b6]/15">
              <span className="text-[0.68rem] uppercase tracking-widest text-[#f472b6] font-semibold flex items-center gap-2">
                <Smile className="size-4 text-[#f472b6]" />
                A Warm Birthday Note
              </span>
              <span className="text-[0.65rem] px-2.5 py-0.5 rounded-full bg-[#f472b6]/15 text-[#f472b6] border border-[#f472b6]/20">
                Special Edition
              </span>
            </div>

            <p className="font-serif text-base sm:text-lg italic leading-relaxed text-[#f5e6d3]/95 pt-4">
              &ldquo;{heroGreeting}&rdquo;
            </p>
          </div>
        </motion.section>

        {/* Elegant Divider */}
        <div className="flex items-center justify-center gap-4 text-[#f472b6]/30">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#f472b6]/40" />
          <Sparkles className="size-4 text-[#f472b6]" />
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#f472b6]/40" />
        </div>

        {/* =========================================================================
            SECTION 2: REAL INTERACTIVE GLASS MASON BIRTHDAY WISH JAR WITH GLOWING JUGNU
           ========================================================================= */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[0.68rem] uppercase tracking-[0.3em] text-[#fcd34d] font-semibold flex items-center justify-center gap-2">
              <Sparkles className="size-3.5 text-[#fcd34d] animate-pulse" />
              MAGIC JUGNU WISH JAR
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              {wishJarTitle}
            </h2>
            <p className="text-xs text-[#e879f9]/90 max-w-md mx-auto">
              Inside this glass jar float glowing fireflies (Jugnu). Tap any glowing Jugnu to release a secret birthday wish! ✨🪲
            </p>
          </div>

          {/* Glass Mason Wish Jar Component */}
          <div className="flex flex-col items-center justify-center pt-2">
            <motion.div
              animate={isJarShaking ? { rotate: [-6, 6, -6, 6, 0], scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5 }}
              onClick={(e) => handleDrawWish(e)}
              className="relative flex flex-col items-center justify-center cursor-pointer group select-none"
            >
              {/* Wooden Cork Lid */}
              <div className="w-28 sm:w-32 h-6 rounded-t-lg bg-gradient-to-r from-[#9a3412] via-[#d97706] to-[#9a3412] border-b border-[#fef08a]/40 shadow-lg flex items-center justify-center relative z-20">
                <div className="w-16 h-1.5 rounded-full bg-[#fcd34d]/50" />
              </div>

              {/* Glass Rim */}
              <div className="w-32 sm:w-36 h-4 bg-gradient-to-r from-white/20 via-white/40 to-white/20 border-x border-[#f472b6]/40 shadow-sm relative z-10" />

              {/* Main Glass Jar Body */}
              <div className="w-48 sm:w-56 h-72 rounded-b-[44px] rounded-t-lg border-2 border-[#f472b6]/40 bg-gradient-to-b from-[#1c0817]/80 via-[#0d030c]/95 to-[#160614] shadow-[0_20px_60px_rgba(244,114,182,0.35)] backdrop-blur-md relative overflow-hidden flex flex-col items-center justify-between p-4">
                {/* Glass Light Reflection Strips */}
                <div className="absolute top-4 left-4 w-3.5 h-56 bg-gradient-to-b from-white/35 via-white/10 to-transparent rounded-full blur-[0.5px] pointer-events-none" />
                <div className="absolute top-8 right-5 w-1.5 h-44 bg-gradient-to-b from-white/25 to-transparent rounded-full blur-[0.5px] pointer-events-none" />

                {/* Ambient Night Dust / Tiny Star Specks inside Jar */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={`star-${i}`}
                      animate={{
                        opacity: [0.2, 0.9, 0.2],
                        scale: [0.6, 1.2, 0.6],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2 + (i % 4) * 0.7,
                        delay: i * 0.2,
                      }}
                      className="absolute size-1 rounded-full bg-[#fef08a] shadow-[0_0_6px_#fcd34d]"
                      style={{
                        left: `${(i * 19) % 85 + 8}%`,
                        top: `${(i * 23) % 75 + 12}%`,
                      }}
                    />
                  ))}
                </div>

                {/* Inside Jar: Pure Floating Glowing Fireflies (Jugnu) - NO Text inside Jar */}
                <div className="relative w-full h-full pointer-events-auto flex items-center justify-center">
                  {wishes.map((w, idx) => {
                    const isDrawn = drawnWishes.includes(idx);
                    const jugnuThemes = [
                      { core: "#fef08a", aura: "rgba(253, 224, 71, 0.95)", glowColor: "#fcd34d" },
                      { core: "#f472b6", aura: "rgba(244, 114, 182, 0.95)", glowColor: "#f472b6" },
                      { core: "#38bdf8", aura: "rgba(56, 189, 248, 0.95)", glowColor: "#38bdf8" },
                      { core: "#e879f9", aura: "rgba(232, 121, 249, 0.95)", glowColor: "#e879f9" },
                    ];
                    const theme = jugnuThemes[idx % jugnuThemes.length];

                    // Floating path animation presets for each Jugnu inside jar
                    const trajectories = [
                      { x: [-18, 22, -15, -18], y: [-20, 15, 25, -20] },
                      { x: [25, -15, 18, 25], y: [18, -25, -10, 18] },
                      { x: [-22, 16, -25, -22], y: [15, 32, -15, 15] },
                      { x: [16, -25, 15, 16], y: [-32, -10, 22, -32] },
                    ];
                    const traj = trajectories[idx % trajectories.length];

                    return (
                      <motion.div
                        key={idx}
                        animate={{
                          x: isDrawn ? 0 : traj.x,
                          y: isDrawn ? 0 : traj.y,
                          opacity: isDrawn ? 0.3 : [0.5, 1, 0.65, 1, 0.5],
                          scale: isDrawn ? 0.8 : [0.9, 1.3, 0.85, 1.2, 0.9],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 3 + idx * 0.7,
                          ease: "easeInOut",
                        }}
                        whileHover={{ scale: 1.5, zIndex: 30 }}
                        onClick={(e) => handleDrawWish(e, idx)}
                        className="absolute cursor-pointer flex items-center justify-center group/jugnu"
                        style={{
                          left: `${20 + (idx % 2 === 0 ? (idx * 22) % 45 : 55 - (idx * 16) % 35)}%`,
                          top: `${20 + Math.floor(idx / 2) * 38}%`,
                        }}
                      >
                        {/* Outer Glow Aura */}
                        <div
                          className="absolute size-12 rounded-full blur-md animate-pulse pointer-events-none"
                          style={{ backgroundColor: theme.glowColor, opacity: isDrawn ? 0.15 : 0.75 }}
                        />

                        {/* Tiny Fluttering Wings */}
                        <div className="relative flex items-center justify-center mb-0.5 pointer-events-none">
                          <motion.div
                            animate={{ rotate: [-30, 35, -30] }}
                            transition={{ repeat: Infinity, duration: 0.1 }}
                            className="w-3 h-1.5 rounded-full border border-white/60 bg-white/70 origin-bottom-right transform -rotate-45"
                          />
                          <motion.div
                            animate={{ rotate: [30, -35, 30] }}
                            transition={{ repeat: Infinity, duration: 0.1 }}
                            className="w-3 h-1.5 rounded-full border border-white/60 bg-white/70 origin-bottom-left transform rotate-45"
                          />
                        </div>

                        {/* Jugnu Glowing Center Body Core */}
                        <div
                          className={`size-4 sm:size-5 rounded-full shadow-lg relative flex items-center justify-center transition-all ${
                            isDrawn ? "bg-slate-600/50 border border-white/20" : "bg-white border-2"
                          }`}
                          style={{
                            borderColor: theme.core,
                            boxShadow: isDrawn ? "none" : `0 0 25px ${theme.aura}, 0 0 12px ${theme.core}`,
                          }}
                        >
                          <div
                            className="size-2 rounded-full animate-ping"
                            style={{ backgroundColor: theme.core, animationDuration: "1.8s" }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Additional Ambient Glowing Fireflies for Density */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={`ambient-jugnu-${i}`}
                      animate={{
                        x: [10 - i * 15, -15 + i * 20, 10 - i * 15],
                        y: [-10 + i * 18, 15 - i * 12, -10 + i * 18],
                        opacity: [0.3, 0.85, 0.3],
                        scale: [0.7, 1.1, 0.7],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 4.2 + i * 0.9,
                        ease: "easeInOut",
                      }}
                      className="absolute size-3 rounded-full bg-white blur-[0.5px] pointer-events-none"
                      style={{
                        left: `${35 + i * 18}%`,
                        top: `${30 + i * 20}%`,
                        boxShadow: "0 0 18px rgba(253, 224, 71, 0.9), 0 0 8px #fef08a",
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Status & Action Controls Outside Jar */}
            <div className="mt-4 flex flex-col items-center justify-center gap-2">
              <span className="text-[0.68rem] text-[#fcd34d] font-serif italic tracking-wide">
                {drawnWishes.length === wishes.length
                  ? "✨ All Fireflies Caught! Tap jar to release them back"
                  : `🪲 ${wishes.length - drawnWishes.length} Glowing Fireflies remaining inside jar`}
              </span>

              <button
                type="button"
                onClick={(e) => handleDrawWish(e)}
                className="h-11 px-7 rounded-full bg-gradient-to-r from-[#f472b6] via-[#e879f9] to-[#fcd34d] text-[#0a0507] text-xs font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-[0_0_25px_rgba(244,114,182,0.4)] cursor-pointer"
              >
                <Sparkles className="size-4 text-[#0a0507]" />
                <span>{drawnWishes.length === 0 ? "Catch a Glowing Firefly 🪲✨" : "Catch Next Glowing Firefly 🪲✨"}</span>
              </button>
            </div>
          </div>

          {/* Currently Drawn Note Pop-out Card / Small Note Display */}
          <AnimatePresence>
            {activeWishIndex !== null && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="mt-6 p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#280c23]/95 via-[#1a0616]/95 to-[#10030d]/95 border-2 border-[#fcd34d]/40 shadow-[0_20px_50px_rgba(244,114,182,0.3)] backdrop-blur-xl relative space-y-4 max-w-lg mx-auto"
              >
                {/* Ribbon Tag */}
                <div className="flex items-center justify-between border-b border-[#f472b6]/20 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-[#3b1232] border border-[#fcd34d]/40 text-[#fcd34d] shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                      🪲✨
                    </span>
                    <div>
                      <span className="text-[0.62rem] uppercase tracking-widest text-[#fcd34d] font-semibold block">
                        CAUGHT JUGNU WISH NOTE #{activeWishIndex + 1}
                      </span>
                      <h3 className="font-serif text-lg font-bold text-white">
                        {wishes[activeWishIndex].title}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveWishIndex(null)}
                    className="size-8 rounded-full bg-[#1e0a1b] text-[#c5b0a5] hover:text-white flex items-center justify-center transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                {/* Small Note Body Content */}
                <div className="rounded-2xl bg-[#120410]/90 border border-[#f472b6]/20 p-4 sm:p-5 shadow-inner">
                  <p className="font-serif text-sm sm:text-base italic leading-relaxed text-[#f5e6d3] whitespace-pre-line">
                    &ldquo;{wishes[activeWishIndex].text}&rdquo;
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <button
                    type="button"
                    onClick={(e) => toggleCollectWish(activeWishIndex, e)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#35122e] border border-[#f472b6]/30 text-[#f472b6] hover:bg-[#f472b6] hover:text-[#0a0507] transition-all cursor-pointer font-medium"
                  >
                    <Heart className="size-3.5 fill-current" />
                    <span>Collect Love ({collectedWishes[activeWishIndex] || 1})</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDrawWish(e)}
                    className="flex items-center gap-1 text-[#fcd34d] hover:underline font-serif italic cursor-pointer"
                  >
                    <span>Catch Another Jugnu 🪲 →</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid of All Drawn Notes for Easy Re-Reading */}
          {drawnWishes.length > 0 && (
            <div className="pt-4 space-y-3">
              <span className="text-[0.65rem] uppercase tracking-widest text-[#f472b6] font-semibold block text-center">
                COLLECTED SECRET BIRTHDAY NOTES ({drawnWishes.length} / {wishes.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {drawnWishes.map((idx) => {
                  const w = wishes[idx];
                  const isCurrent = activeWishIndex === idx;

                  return (
                    <div
                      key={idx}
                      onClick={(e) => handleDrawWish(e, idx)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-1 ${
                        isCurrent
                          ? "bg-[#2a0e23] border-[#fcd34d] shadow-md"
                          : "bg-[#140612]/80 border-[#f472b6]/20 hover:border-[#f472b6]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-serif font-bold text-white">
                        <span>📜 {w.title}</span>
                        <span className="text-[0.62rem] text-[#fcd34d] font-mono">Note #{idx + 1}</span>
                      </div>
                      <p className="text-xs text-[#c5b0a5] line-clamp-2 italic font-sans">{w.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        {/* Elegant Divider */}
        <div className="flex items-center justify-center gap-4 text-[#f472b6]/30">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#f472b6]/40" />
          <Star className="size-4 text-[#fcd34d]" />
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#f472b6]/40" />
        </div>

        {/* =========================================================================
            SECTION 3: CHAPTERS OF YOUR LIFE TIMELINE
           ========================================================================= */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[0.68rem] uppercase tracking-[0.3em] text-[#fcd34d] font-semibold flex items-center justify-center gap-2">
              <Clock className="size-3.5" />
              LIFE STORY TIMELINE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              {timelineTitle}
            </h2>
          </div>

          <div className="space-y-4">
            {chapters.map((ch, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.01 }}
                className="rounded-2xl border border-[#fcd34d]/25 bg-gradient-to-r from-[#1c0a18]/90 to-[#120410]/95 p-6 shadow-xl space-y-2"
              >
                <span className="text-[0.65rem] uppercase tracking-widest text-[#fcd34d] font-semibold block">
                  {ch.date}
                </span>
                <h3 className="font-serif text-lg font-medium text-white">{ch.title}</h3>
                <p className="text-xs sm:text-sm text-[#c5b0a5] leading-relaxed font-sans">{ch.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Elegant Divider */}
        <div className="flex items-center justify-center gap-4 text-[#f472b6]/30">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#f472b6]/40" />
          <Camera className="size-4 text-[#f472b6]" />
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#f472b6]/40" />
        </div>

        {/* =========================================================================
            SECTION 4: 3D POLAROID PHOTO MEMORIES
           ========================================================================= */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[0.68rem] uppercase tracking-[0.3em] text-[#f472b6] font-semibold flex items-center justify-center gap-2">
              <Camera className="size-3.5" />
              PHOTO MEMORIES
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              {memoriesTitle}
            </h2>
            <p className="text-xs text-[#c5b0a5]">Tap photograph to enlarge memory</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {polaroids.map((photo, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, rotate: idx % 2 === 0 ? -2 : 2 }}
                onClick={() => setActiveModalImage(photo.img)}
                className="rounded-2xl bg-[#180916] p-3 border border-[#f472b6]/30 shadow-xl hover:shadow-[0_15px_35px_rgba(244,114,182,0.25)] transition-all cursor-pointer group"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#0a0507]">
                  <img
                    src={photo.img}
                    alt={photo.caption}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                    <span className="text-[0.62rem] text-white flex items-center gap-1 font-serif">
                      <Maximize2 className="size-3" /> Zoom photo
                    </span>
                  </div>
                </div>
                <p className="pt-3 text-center text-xs font-serif italic text-white line-clamp-2">
                  {photo.caption}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Elegant Divider */}
        <div className="flex items-center justify-center gap-4 text-[#f472b6]/30">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#f472b6]/40" />
          <Music className="size-4 text-[#f472b6]" />
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#f472b6]/40" />
        </div>

        {/* =========================================================================
            SECTION 5: BIRTHDAY VINYL SOUNDTRACK PLAYER
           ========================================================================= */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[0.68rem] uppercase tracking-[0.3em] text-[#f472b6] font-semibold flex items-center justify-center gap-2">
              <Music className="size-3.5" />
              YOUR BIRTHDAY SOUNDTRACK
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">{songTitle}</h2>
            <p className="text-xs text-[#fcd34d] font-serif italic">{musicArtist}</p>
          </div>

          {/* Luxury Vinyl Record Card */}
          <div className="rounded-3xl border border-[#f472b6]/25 bg-gradient-to-b from-[#1c0817]/90 via-[#10030d]/95 to-[#080206] p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center gap-8 justify-center">
              {/* Spinning Vinyl Record */}
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: "linear" }}
                  className="size-36 sm:size-44 rounded-full bg-gradient-to-tr from-[#050505] via-[#1a1a1a] to-[#0a0a0a] border-4 border-[#222] shadow-[0_15px_35px_rgba(0,0,0,0.8)] relative flex items-center justify-center"
                >
                  <div className="absolute inset-2 rounded-full border border-white/5" />
                  <div className="absolute inset-6 rounded-full border border-white/5" />
                  <div className="size-14 sm:size-16 rounded-full bg-gradient-to-tr from-[#f472b6] to-[#fcd34d] border-2 border-[#0a0507] flex flex-col items-center justify-center shadow-inner text-center px-1 overflow-hidden relative">
                    <span className="font-serif text-[0.68rem] font-bold text-[#0a0507] tracking-wider leading-tight">
                      {birthdayName}
                    </span>
                    <span className="text-[0.48rem] uppercase font-sans font-bold text-[#0a0507]/80 tracking-tighter truncate max-w-full">
                      B-Day Track
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Controls */}
              <div className="space-y-4 text-center sm:text-left flex-1 max-w-xs">
                <div>
                  <span className="text-[0.65rem] uppercase tracking-widest text-[#fcd34d] font-semibold block">
                    NOW PLAYING
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl text-white font-medium line-clamp-1">{songTitle}</h3>
                  <p className="text-xs text-[#f472b6] italic font-serif">{musicArtist}</p>
                </div>

                {/* Scrubber */}
                <div className="space-y-1 pt-0.5">
                  <div
                    className="w-full bg-[#200d1a] h-1.5 rounded-full overflow-hidden border border-[#f472b6]/20 cursor-pointer"
                    onClick={(e) => {
                      if (!audioRef.current || !audioRef.current.duration) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                      audioRef.current.currentTime = pos * audioRef.current.duration;
                    }}
                  >
                    <div
                      style={{ width: `${audioProgress}%` }}
                      className="h-full bg-gradient-to-r from-[#f472b6] to-[#fcd34d] transition-all duration-100"
                    />
                  </div>
                  <div className="flex justify-between text-[0.62rem] text-[#c5b0a5]/80 font-mono">
                    <span>{currentTimeStr}</span>
                    <span className="text-[#f472b6]">{isPlaying ? "Playing 🎵" : "Paused"}</span>
                    <span>{durationStr}</span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="h-11 px-6 rounded-full bg-gradient-to-r from-[#f472b6] to-[#fcd34d] text-[#0a0507] text-xs font-semibold flex items-center gap-2 hover:scale-105 transition-all shadow-lg cursor-pointer"
                  >
                    {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 ml-0.5" />}
                    <span>{isPlaying ? "Pause Song" : "Play Birthday Song"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="size-11 rounded-full border border-[#f472b6]/30 bg-[#160b11] text-[#f472b6] flex items-center justify-center hover:bg-[#200f1a] transition-all cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="size-4 text-rose-400" /> : <Volume2 className="size-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Elegant Divider */}
        <div className="flex items-center justify-center gap-4 text-[#f472b6]/30">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#f472b6]/40" />
          <Mail className="size-4 text-[#f472b6]" />
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#f472b6]/40" />
        </div>

        {/* =========================================================================
            SECTION 6: HANDWRITTEN BIRTHDAY LOVE LETTER IN VINTAGE ENVELOPE
           ========================================================================= */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[0.68rem] uppercase tracking-[0.3em] text-[#fcd34d] font-semibold flex items-center justify-center gap-2">
              <Mail className="size-3.5 text-[#fcd34d]" />
              HANDWRITTEN LOVE LETTER
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">{letterTitle}</h2>
            <p className="text-xs text-[#f472b6] font-serif italic">
              {!isLetterOpen ? "Tap the wax seal envelope to open letter ✉️✨" : "Unfolded vintage parchment letter"}
            </p>
          </div>

          <div className="relative max-w-xl mx-auto">
            <AnimatePresence mode="wait">
              {!isLetterOpen ? (
                /* SEALED VINTAGE WAX ENVELOPE CARD */
                <motion.div
                  key="sealed-envelope"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.4 }}
                  onClick={(e) => {
                    setIsLetterOpen(true);
                    setTypedChars(0);
                    setIsTyping(true);
                    spawnConfetti(e, 18);
                    toast.success("Envelope unsealed! Reading letter... 💌");
                  }}
                  className="relative rounded-3xl border-2 border-[#fcd34d]/40 bg-gradient-to-b from-[#2a0e23] via-[#1a0616] to-[#0f030d] p-8 sm:p-12 shadow-[0_20px_50px_rgba(244,114,182,0.25)] cursor-pointer group hover:scale-[1.02] transition-transform select-none overflow-hidden text-center flex flex-col items-center justify-center space-y-5"
                >
                  {/* Decorative Diagonal Flap Border */}
                  <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#3b1232]/80 to-transparent border-b border-[#f472b6]/20 pointer-events-none" />

                  {/* Wax Stamp Seal Icon */}
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                    className="relative z-10 size-20 sm:size-24 rounded-full bg-gradient-to-tr from-[#991b1b] via-[#dc2626] to-[#7f1d1d] border-4 border-[#fcd34d]/70 shadow-[0_0_30px_rgba(220,38,38,0.8)] flex flex-col items-center justify-center text-white cursor-pointer"
                  >
                    <Mail className="size-8 text-[#fcd34d] animate-bounce" />
                    <span className="text-[0.55rem] font-serif font-bold uppercase tracking-wider text-[#fcd34d] mt-1">
                      SEALED
                    </span>
                  </motion.div>

                  <div className="relative z-10 space-y-1">
                    <h3 className="font-serif text-xl sm:text-2xl text-white font-bold tracking-wide">
                      {letterTo}
                    </h3>
                    <p className="text-xs text-[#fcd34d] font-serif italic">
                      Tap to break wax seal &amp; unfold handwritten letter ✉️
                    </p>
                  </div>
                </motion.div>
              ) : (
                /* OPENED VINTAGE FLORAL PARCHMENT LETTER */
                <motion.div
                  key="opened-letter"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="relative rounded-3xl border-2 border-[#fcd34d]/50 p-6 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-left overflow-hidden"
                  style={{
                    backgroundImage: `url('/assets/vintage_floral_parchment.png')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Subtle Darkening Overlay for Readable Ink Contrast */}
                  <div className="absolute inset-0 bg-amber-950/10 pointer-events-none rounded-3xl" />

                  {/* Letter Header Controls */}
                  <div className="relative z-10 pb-4 border-b border-[#7c2d12]/20 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest font-serif font-bold text-[#451a03]">
                      {letterTo}
                    </span>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={restartTypewriter}
                        className="text-xs text-[#7c2d12] hover:text-[#451a03] font-serif flex items-center gap-1 font-semibold cursor-pointer underline"
                      >
                        <RefreshCw className="size-3.5" /> Re-type
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsLetterOpen(false)}
                        className="text-xs px-2.5 py-1 rounded-full bg-[#7c2d12]/15 text-[#451a03] font-serif hover:bg-[#7c2d12]/30 transition-all font-semibold cursor-pointer"
                      >
                        Fold Letter ✉️
                      </button>
                    </div>
                  </div>

                  {/* Typewriter Parchment Text */}
                  <div className="relative z-10 pt-6 pb-4">
                    <p className="font-serif text-sm sm:text-base italic leading-relaxed text-[#2c1810] font-medium whitespace-pre-line min-h-[220px] drop-shadow-xs">
                      {letterBody.substring(0, typedChars)}
                      <span className="inline-block text-[#991b1b] font-mono font-bold animate-pulse ml-0.5">
                        {typedChars < letterBody.length ? "✒️" : ""}
                      </span>
                    </p>
                  </div>

                  {/* Bottom Sign-off Seal */}
                  <div className="relative z-10 pt-4 border-t border-[#7c2d12]/20 flex items-center justify-between text-xs text-[#7c2d12] font-serif italic">
                    <span>Written with endless love ♡</span>
                    <span className="font-bold text-[#451a03]">Happy Birthday 🌸</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Elegant Divider */}
        <div className="flex items-center justify-center gap-4 text-[#f472b6]/30">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#f472b6]/40" />
          <Gift className="size-4 text-[#fcd34d]" />
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#f472b6]/40" />
        </div>

        {/* =========================================================================
            SECTION 7: GRAND SURPRISE GIFT BOX PAYOFF
           ========================================================================= */}
        <section className="space-y-6 pb-12">
          <div className="text-center space-y-2">
            <span className="text-[0.68rem] uppercase tracking-[0.35em] text-[#fcd34d] font-semibold flex items-center justify-center gap-2">
              <Gift className="size-3.5" />
              SURPRISE PAYOFF
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal">{giftTitle}</h2>
            <p className="text-xs text-[#f472b6] font-serif italic">{giftInstruction}</p>
          </div>

          {/* Wrapped Present Action Box */}
          <div className="rounded-3xl border border-[#fcd34d]/30 bg-gradient-to-b from-[#240a1d] via-[#160412] to-[#0a0208] p-6 sm:p-10 text-center space-y-6 shadow-2xl relative overflow-hidden">
            {!giftUnwrapped ? (
              <motion.div
                whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                onClick={handleGiftUnwrap}
                className="size-32 sm:size-36 mx-auto rounded-3xl bg-gradient-to-tr from-[#f472b6] via-[#e879f9] to-[#fcd34d] border border-white/40 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(244,114,182,0.35)] cursor-pointer group"
              >
                <Gift className="size-14 sm:size-16 text-[#0a0507] group-hover:scale-110 transition-transform" />
                <span className="text-[0.65rem] font-bold text-[#0a0507] uppercase tracking-wider mt-1.5">
                  TAP TO UNWRAP
                </span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#2a0e23]/95 via-[#1c0a17]/95 to-[#10030d]/95 border border-[#f472b6]/40 text-center space-y-4 shadow-2xl backdrop-blur-xl"
              >
                <div className="size-12 mx-auto rounded-full bg-gradient-to-br from-[#f472b6]/20 to-[#fcd34d]/30 border border-[#f472b6]/40 flex items-center justify-center text-xl shadow-[0_0_25px_rgba(244,114,182,0.4)]">
                  <Sparkles className="size-6 text-[#fcd34d]" />
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
                  {surpriseHeader}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-[#f472b6] font-serif italic max-w-md mx-auto">
                  &ldquo;{surpriseMessage}&rdquo;
                </p>
                <div className="pt-2 flex items-center justify-center gap-2 text-[0.72rem] tracking-[0.25em] uppercase font-semibold text-[#fcd34d]">
                  <span className="text-[#c5b0a5]">With all my love,</span>
                  <span className="text-white">{senderSignoff}</span>
                  <span>♡</span>
                </div>
                <button
                  type="button"
                  onClick={handleGiftUnwrap}
                  className="mt-3 text-xs text-[#c5b0a5]/70 hover:text-white underline cursor-pointer"
                >
                  Wrap present again
                </button>
              </motion.div>
            )}
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
            <div className="relative max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden border border-[#f472b6]/30 shadow-2xl">
              <img src={activeModalImage} alt="Enlarged Birthday Memory" className="w-full h-full object-contain" />
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
