import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Heart, ChevronLeft, ChevronRight, Sparkles, RefreshCw } from "lucide-react";
import { resolveSongDetails } from "../../services/songResolver";

export default function WhispersOfLoveTemplate(props) {
  const data = props.data || props.content || props || {};

  const getVal = (key, fallback) => {
    if (data && data[key] !== undefined && data[key] !== null && data[key] !== "") {
      return data[key];
    }
    return fallback;
  };

  // Content Data
  const musicUrl = getVal("bgMusicUrl", "https://open.spotify.com/track/1wgJy9zGdOLRHGEkzpD5f0?si=8f0528522b574c5e");
  const songTitle = getVal("songTitle", "Saiyonee · Hiten & Ritika Raj");

  // Dynamic Audio Stream Resolver
  const [resolvedAudio, setResolvedAudio] = useState("");

  useEffect(() => {
    const rawUrl = musicUrl;
    if (rawUrl.includes(".mp3") || rawUrl.includes(".m4a") || rawUrl.startsWith("/audio/")) {
      setResolvedAudio(rawUrl);
    } else {
      resolveSongDetails(rawUrl).then((info) => {
        if (info && info.audioUrl) {
          setResolvedAudio(info.audioUrl);
        }
      });
    }
  }, [musicUrl]);

  // Page 1
  const heroSub = getVal("heroSubtitle", "A LOVE STORY");
  const heroTitle = getVal("heroTitle", "Love in Bloom 🌸");
  const heroQuote = getVal("heroQuote", "Every love story is beautiful...");
  const heroScrollText = getVal("heroScrollText", "Scroll to begin the journey");

  // Page 2
  const nightQuoteList = [
    getVal("nightQuote", "“In the quiet of the night, I found you.”"),
    "“Among millions of stars, you are my brightest light.”",
    "“Every quiet moment spent with you feels like a dream realized.”",
  ];
  const nightSubQuote = getVal("nightSubQuote", "You became my favorite chapter.");

  // Page 3
  const gardenSub = getVal("gardenSub", "OUR GARDEN");
  const gardenTitle = getVal("gardenTitle", "Garden of Love");

  // Page 4
  const letterSub = getVal("letterSub", "A MESSAGE FOR YOU");
  const letterTitle = getVal("letterTitle", "The Love Letter");
  const letterTo = getVal("letterTo", "To You, My Love...");
  const letterBody = getVal(
    "letterBody",
    "There are not enough words in any language to describe what you mean to me. You are the warmth of the morning sun, the calm of a quiet night, and the joy in between. Every day with you feels like a beautiful dream I never want to wake up from. You have changed my world in the most wonderful way, and I am so grateful that our paths crossed. Thank you for loving me."
  );

  // Page 5
  const memoriesSub = getVal("memoriesSub", "CAPTURED MOMENTS");
  const memoriesTitle = getVal("memoriesTitle", "Our Memories");

  const polaroids = [
    {
      img: getVal("card1Image", "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80"),
      caption: getVal("card1Caption", "You are the rose in my life 🌹"),
      tag: "With Love",
    },
    {
      img: getVal("card2Image", "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80"),
      caption: getVal("card2Caption", "I never want to let go of this hand 💛"),
      tag: "Forever",
    },
    {
      img: getVal("card3Image", "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=1200&q=80"),
      caption: getVal("card3Caption", "You light up my world ✨"),
      tag: "Good Dreams",
    },
  ];

  // Garden Quotes
  const gardenQuotes = [
    "Every moment with you is a petal in the garden of my heart.",
    "In a field of roses, you are the one that stole my soul.",
    "My love for you blooms stronger with every passing sunrise.",
    "You are the sweetest flower in my life's story.",
    "Where you are, love grows effortlessly.",
    "Every laugh we share is a blossom of pure happiness.",
    "Loving you is as natural as a garden blooming in spring.",
    "Forever rooted in your heart, forever in love with you.",
  ];

  // State Management
  const [isPlaying, setIsPlaying] = useState(false);
  const [roseIndex, setRoseIndex] = useState(0);
  const [nightQuoteIndex, setNightQuoteIndex] = useState(0);
  const [memoryIdx, setMemoryIdx] = useState(1);
  const [fallingPetals, setFallingPetals] = useState([]);
  const [clickSparks, setClickSparks] = useState([]);
  const [activePromiseModal, setActivePromiseModal] = useState(null);

  // Typewriter State for Page 4 Love Letter
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [typedChars, setTypedChars] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const typewriterTimerRef = useRef(null);
  const audioRef = useRef(null);

  // Toggle Audio
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Handle Letter Open / Close + Typewriter Transition
  const handleLetterToggle = () => {
    if (!isLetterOpen) {
      setIsLetterOpen(true);
      setTypedChars(0);
      setIsTyping(true);
    } else {
      setIsLetterOpen(false);
      setIsTyping(false);
      setTypedChars(0);
      if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
    }
  };

  const restartTypewriter = (e) => {
    e.stopPropagation();
    setTypedChars(0);
    setIsTyping(true);
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
      }, 25); // 25ms per character typing speed
    }
    return () => {
      if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
    };
  }, [isLetterOpen, isTyping, letterBody]);

  // Click Sparkle FX for Hero & Interactive sections
  const handleInteractiveClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const emojis = ["🌸", "💖", "✨", "🌷", "💕"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const newSpark = { id: Date.now() + Math.random(), x, y, emoji: randomEmoji };
    setClickSparks((prev) => [...prev, newSpark]);
    setTimeout(() => {
      setClickSparks((prev) => prev.filter((s) => s.id !== newSpark.id));
    }, 1200);
  };

  // Rose Picker Action
  const pickRose = () => {
    setRoseIndex((prev) => (prev + 1) % gardenQuotes.length);

    // Trigger Petal Shower FX
    const newPetals = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 80 + 10,
      size: Math.random() * 16 + 12,
      duration: Math.random() * 2 + 1.5,
    }));

    setFallingPetals((prev) => [...prev, ...newPetals]);
    setTimeout(() => {
      setFallingPetals((prev) => prev.filter((p) => !newPetals.includes(p)));
    }, 3000);
  };

  // Next / Prev Polaroid
  const nextMemory = () => {
    setMemoryIdx((prev) => (prev + 1) % polaroids.length);
  };

  const prevMemory = () => {
    setMemoryIdx((prev) => (prev - 1 + polaroids.length) % polaroids.length);
  };

  return (
    <div className="whispers-wrapper relative w-full min-h-screen font-sans bg-[#ffeef4] text-[#4a1c2e] overflow-x-hidden selection:bg-[#ffb5ca] selection:text-[#3d0e20]">
      {/* Background Audio Track */}
      <audio ref={audioRef} src={resolvedAudio || musicUrl} loop preload="auto" />

      {/* Floating Audio Control Button (Fixed at bottom-left on every page) */}
      <div
        className={`fixed bottom-4 z-40 transition-all duration-300 ${
          typeof window !== "undefined" && window.location.pathname.includes("/editor")
            ? "left-4 lg:left-[calc(41.666667%+1.5rem)]"
            : "left-4"
        }`}
      >
        <button
          onClick={toggleMusic}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#fff0f5] border border-[#ffb8ce] text-[#d81b5c] shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 font-bold text-xs tracking-wider uppercase cursor-pointer backdrop-blur-md"
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-4 h-4 animate-pulse text-[#d81b5c]" />
              <span>MUSIC PLAYING</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-[#d81b5c]" />
              <span>PLAY MUSIC</span>
            </>
          )}
        </button>
      </div>

      {/* ============================================================ */}
      {/* PAGE 1: HERO SECTION — WHISPERS OF LOVE */}
      {/* ============================================================ */}
      <section
        onClick={handleInteractiveClick}
        className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-[#fdf6f8] via-[#f7e8ed] to-[#f0cee0] text-[#3d0e20] overflow-hidden cursor-pointer selection:bg-[#ffb5ca]"
      >
        {/* Click Sparkles FX */}
        {clickSparks.map((spark) => (
          <div
            key={spark.id}
            className="absolute pointer-events-none text-2xl animate-ping"
            style={{ left: spark.x, top: spark.y, animationDuration: "1s" }}
          >
            {spark.emoji}
          </div>
        ))}

        {/* Tactile Soft Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#f895b2]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#e8a4c8]/20 blur-3xl pointer-events-none" />

        <div className="max-w-3xl z-10 space-y-6">
          {/* Subtitle Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-[#f3b5c8] shadow-sm backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c71850] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-[#9c143d] font-serif">
              {heroSub}
            </span>
          </div>

          {/* Main Title Calligraphy */}
          <h1
            className="text-6xl sm:text-7xl md:text-8xl font-normal text-[#8f1038] tracking-tight py-2 drop-shadow-sm transition-transform duration-500 hover:scale-[1.02]"
            style={{ fontFamily: "'Dancing Script', 'Great Vibes', cursive" }}
          >
            {heroTitle}
          </h1>

          {/* Subtitle Quote */}
          <p
            className="text-lg sm:text-xl md:text-2xl text-[#5e142e] font-serif italic max-w-xl mx-auto opacity-90 leading-relaxed"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            “{heroQuote}”
          </p>

          {/* Scroll Prompt */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
            }}
            className="pt-14 flex flex-col items-center gap-2 opacity-80 hover:opacity-100 transition-opacity cursor-pointer group"
          >
            <span className="text-xs sm:text-sm font-serif text-[#8f1038] tracking-wider italic group-hover:underline">
              {heroScrollText}
            </span>
            <div className="w-9 h-9 rounded-full border border-[#8f1038]/30 bg-white/50 backdrop-blur-sm flex items-center justify-center text-[#8f1038] shadow-sm animate-bounce group-hover:scale-110">
              ↓
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PAGE 2: STARRY NIGHT SCENE — IN THE QUIET OF THE NIGHT */}
      {/* ============================================================ */}
      <section
        onClick={() => setNightQuoteIndex((prev) => (prev + 1) % nightQuoteList.length)}
        className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-[#0f0718] via-[#1a0c28] to-[#12081c] text-[#fbf5f8] overflow-hidden cursor-pointer group"
      >
        {/* Soft Glowing Moon Crest */}
        <div className="absolute top-12 right-12 sm:top-16 sm:right-24 w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#fdf0f5] shadow-[0_0_80px_rgba(253,240,245,0.75)] opacity-90 pointer-events-none group-hover:scale-105 transition-transform duration-700 border border-white/40" />

        {/* Twinkling Starfield FX */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse opacity-65"
              style={{
                width: i % 3 === 0 ? "3px" : "1.5px",
                height: i % 3 === 0 ? "3px" : "1.5px",
                top: `${(i * 17) % 92 + 4}%`,
                left: `${(i * 23) % 94 + 3}%`,
                animationDuration: `${(i % 4) + 2}s`,
              }}
            />
          ))}
        </div>

        <div className="max-w-3xl z-10 space-y-8 p-8 sm:p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Main Night Quote */}
          <h2
            className="text-4xl sm:text-6xl md:text-7xl font-normal text-[#fff0f5] tracking-wide leading-tight drop-shadow-md transition-all duration-500 hover:scale-102"
            style={{ fontFamily: "'Dancing Script', 'Great Vibes', cursive" }}
          >
            {nightQuoteList[nightQuoteIndex]}
          </h2>

          {/* Subtitle Quote */}
          <p
            className="text-base sm:text-xl md:text-2xl text-[#f3c5d6] font-serif italic tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {nightSubQuote}
          </p>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] text-[#ffc5d5]/80 font-serif italic border border-white/15">
            <span>✨ Tap sky to unveil another midnight stanza</span>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PAGE 3: GARDEN OF LOVE — INTERACTIVE ROSE PICKER */}
      {/* ============================================================ */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-[#ffe6ef] via-[#ffd0df] to-[#ffb8cf] overflow-hidden">
        {/* Soft Background Blobs */}
        <div className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-[#ff739b]/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 rounded-full bg-[#ffa4be]/30 blur-3xl" />

        {/* Petal Burst FX */}
        {fallingPetals.map((p) => (
          <div
            key={p.id}
            className="absolute text-xl pointer-events-none animate-bounce"
            style={{
              left: `${p.left}%`,
              top: '20%',
              fontSize: `${p.size}px`,
              transition: `all ${p.duration}s ease-out`,
            }}
          >
            🌸
          </div>
        ))}

        <div className="max-w-2xl w-full z-10 space-y-8">
          {/* Section Header */}
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#c72557]">
              {gardenSub}
            </span>
            <h2
              className="text-5xl sm:text-6xl font-normal text-[#d81b5c] drop-shadow-sm"
              style={{ fontFamily: "'Dancing Script', 'Great Vibes', cursive" }}
            >
              {gardenTitle}
            </h2>
          </div>

          {/* Interactive Quote Card Box */}
          <div
            onClick={pickRose}
            className="bg-white/80 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-white/60 shadow-xl relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] cursor-pointer"
          >
            <p
              className="text-xl sm:text-2xl text-[#6b1638] font-serif italic leading-relaxed"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              “{gardenQuotes[roseIndex]}”
            </p>

            {/* Counter Pill */}
            <div className="mt-6 inline-flex px-4 py-1 rounded-full bg-[#ffd0df] text-[#a61c4a] text-xs font-semibold tracking-widest">
              {roseIndex + 1} / {gardenQuotes.length}
            </div>
          </div>

          {/* Pick a Rose Action Button */}
          <button
            onClick={pickRose}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#e61e5c] to-[#c2184b] text-white font-medium shadow-lg hover:shadow-red-500/30 hover:scale-105 active:scale-95 transition-all duration-300 text-sm tracking-wider uppercase cursor-pointer"
          >
            <span className="text-lg">🌹</span> Pick a Rose
          </button>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PAGE 4: THE LOVE LETTER — TYPEWRITER TRANSITION ON TAP */}
      {/* ============================================================ */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-[#faf2e9] via-[#f5e4d5] to-[#edd5c6] overflow-hidden text-[#471727]">
        <div className="max-w-3xl w-full z-10 space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#8a1d3e] font-serif">
              {letterSub}
            </span>
            <h2
              className="text-5xl sm:text-6xl font-normal text-[#851136] drop-shadow-sm"
              style={{ fontFamily: "'Dancing Script', 'Great Vibes', cursive" }}
            >
              {letterTitle}
            </h2>
          </div>

          {/* Interactive Wax Seal Envelope Button */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleLetterToggle}
              className="group relative w-38 h-26 sm:w-48 sm:h-30 bg-gradient-to-b from-[#f7cfd6] to-[#eb9cb0] rounded-2xl border-2 border-[#e67393] shadow-[0_15px_35px_rgba(180,40,80,0.2)] flex flex-col items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <div className="text-4xl sm:text-5xl group-hover:scale-115 transition-transform duration-300">
                {isLetterOpen ? "💌" : "✉️"}
              </div>
              {!isLetterOpen && (
                <span className="absolute -top-2.5 -right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#a61743] text-[10px] text-white font-bold shadow-md animate-pulse">
                  ✨
                </span>
              )}
            </button>
            <span className="text-xs font-serif italic text-[#701633] font-medium tracking-wide">
              {isLetterOpen
                ? "Tap envelope to fold letter 💌"
                : "Tap the wax seal envelope to open & read letter 💖"}
            </span>
          </div>

          {/* Unfolded Cotton Parchment Letter with Live Typewriter Effect */}
          {isLetterOpen && (
            <div className="transition-all duration-700 transform origin-top animate-fadeIn">
              <div className="bg-[#fffdf9] border border-[#e8d5c4] rounded-2xl p-8 sm:p-12 shadow-[0_25px_60px_rgba(100,20,50,0.18)] text-left relative overflow-hidden max-w-2xl mx-auto">
                {/* Notebook Paper Lines Background */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-15"
                  style={{
                    backgroundImage: "linear-gradient(#c25a76 1px, transparent 1px)",
                    backgroundSize: "100% 2.2rem",
                  }}
                />

                {/* Recipient Header */}
                <h3
                  className="text-2xl sm:text-3xl text-[#9c143d] font-semibold mb-6 flex items-center justify-between"
                  style={{ fontFamily: "'Dancing Script', cursive" }}
                >
                  <span>{letterTo}</span>
                  <button
                    onClick={restartTypewriter}
                    className="text-xs text-[#701633]/70 hover:text-[#9c143d] font-sans font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    title="Re-type letter"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Re-type
                  </button>
                </h3>

                {/* Typewriter Body Content */}
                <p
                  className="text-base sm:text-lg text-[#4a192a] leading-[2.2rem] font-serif italic whitespace-pre-line min-h-[140px]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {letterBody.substring(0, typedChars)}
                  <span className="inline-block text-[#9c143d] font-mono font-bold animate-pulse">
                    {typedChars < letterBody.length ? "▋" : ""}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* PAGE 5: OUR MEMORIES — 3D POLAROID CAROUSEL STACK */}
      {/* ============================================================ */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-[#ffd9e5] via-[#ffb8cf] to-[#ffa3c0] overflow-hidden">
        <div className="max-w-4xl w-full z-10 space-y-10">
          {/* Header */}
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#a61c47]">
              {memoriesSub}
            </span>
            <h2
              className="text-5xl sm:text-6xl font-normal text-[#c71850]"
              style={{ fontFamily: "'Dancing Script', 'Great Vibes', cursive" }}
            >
              {memoriesTitle}
            </h2>
          </div>

          {/* 3D Stacked Polaroid Carousel */}
          <div className="relative w-full h-[420px] sm:h-[480px] flex items-center justify-center">
            {polaroids.map((p, idx) => {
              const diff = (idx - memoryIdx + polaroids.length) % polaroids.length;
              let style = "";

              if (diff === 0) {
                // Center Active Polaroid
                style = "z-30 scale-105 rotate-0 shadow-2xl opacity-100 translate-x-0";
              } else if (diff === 1 || diff === -2) {
                // Right Polaroid
                style = "z-10 scale-90 rotate-6 shadow-lg opacity-85 translate-x-[90px] sm:translate-x-[160px]";
              } else {
                // Left Polaroid
                style = "z-10 scale-90 -rotate-6 shadow-lg opacity-85 -translate-x-[90px] sm:-translate-x-[160px]";
              }

              return (
                <div
                  key={idx}
                  onClick={() => setMemoryIdx(idx)}
                  className={`absolute w-[265px] sm:w-[325px] bg-white/95 rounded-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(160,20,70,0.22)] transition-all duration-500 cursor-pointer border border-white/80 backdrop-blur-sm ${style}`}
                >
                  {/* Decorative Washi Tape Strip */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-pink-200/50 border border-white/80 backdrop-blur-sm shadow-sm rotate-[-2deg] z-40 rounded-sm" />

                  {/* Photo Frame */}
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-rose-50/50 mb-4 border border-rose-100/60 shadow-inner">
                    <img
                      src={p.img}
                      alt={p.caption}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Caption */}
                  <p
                    className="text-center text-base sm:text-lg text-[#681c37] font-serif italic tracking-wide"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {p.caption}
                  </p>
                </div>
              );
            })}
          </div>

          {/* High-End Aesthetic Controls */}
          <div className="flex items-center justify-center gap-5 pt-6">
            <button
              type="button"
              onClick={prevMemory}
              className="w-12 h-12 rounded-full bg-white/40 border border-white/70 backdrop-blur-md shadow-[0_8px_25px_rgba(200,24,80,0.15)] flex items-center justify-center text-[#a61743] hover:bg-white/80 hover:scale-110 hover:shadow-[0_12px_30px_rgba(200,24,80,0.25)] active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Aesthetic Pill & Capsule Dots */}
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/30 border border-white/50 backdrop-blur-md shadow-inner">
              {polaroids.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMemoryIdx(i)}
                  className={`transition-all duration-500 rounded-full cursor-pointer ${
                    i === memoryIdx
                      ? "w-7 h-2.5 bg-gradient-to-r from-[#d81b5c] to-[#c71850] shadow-md shadow-rose-950/20"
                      : "w-2.5 h-2.5 bg-white/70 hover:bg-white hover:scale-125"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={nextMemory}
              className="w-12 h-12 rounded-full bg-white/40 border border-white/70 backdrop-blur-md shadow-[0_8px_25px_rgba(200,24,80,0.15)] flex items-center justify-center text-[#a61743] hover:bg-white/80 hover:scale-110 hover:shadow-[0_12px_30px_rgba(200,24,80,0.25)] active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PAGE 6: GRAND POEM & FOREVER PROMISES */}
      {/* ============================================================ */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-[#3a0d1f] via-[#5c1334] to-[#7d1d46] text-[#fff0f5] overflow-hidden">
        {/* Soft Ambient Orbs */}
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[#ff7395]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-[#ff94b1]/10 blur-3xl pointer-events-none" />

        <div className="max-w-3xl z-10 space-y-8">
          {/* Main Title Calligraphy */}
          <h2
            className="text-6xl sm:text-7xl md:text-8xl font-normal text-[#fff0f5] tracking-wide drop-shadow-md"
            style={{ fontFamily: "'Dancing Script', 'Great Vibes', cursive" }}
          >
            {getVal("page6Title", "Love in Bloom 🌸")}
          </h2>

          {/* Subtitle */}
          <p
            className="text-lg sm:text-2xl text-[#fbb5cc] font-serif italic tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {getVal("page6Subtitle", "You are my greatest adventure 💕")}
          </p>

          {/* Delicate Line Divider */}
          <div className="flex items-center justify-center gap-4 text-[#ffc5d5]/60 py-1">
            <div className="h-[1px] w-20 sm:w-28 bg-gradient-to-r from-transparent via-[#ffc5d5]/50 to-[#ffc5d5]/50" />
            <span className="text-xs text-[#ffc5d5]">♥</span>
            <div className="h-[1px] w-20 sm:w-28 bg-gradient-to-l from-transparent via-[#ffc5d5]/50 to-[#ffc5d5]/50" />
          </div>

          {/* 4 Line Romantic Stanza / Poem Card */}
          <div className="max-w-xl mx-auto py-2 p-8 sm:p-10 rounded-3xl bg-white/5 border border-white/15 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <p
              className="text-lg sm:text-2xl text-[#fff0f5] leading-relaxed sm:leading-[2.6rem] font-serif italic whitespace-pre-line drop-shadow-sm"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {getVal(
                "page6Poem",
                "In you, I found a love that feels like home,\nA gentle warmth that I have always known.\nThrough every season, through the years ahead,\nI'll love you more with every word unsaid."
              )}
            </p>
          </div>

          {/* 3 Interactive Promise Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 max-w-2xl mx-auto">
            {/* Card 1 */}
            <div
              onClick={() => setActivePromiseModal(getVal("promise1Text", "Every day with you is a beautiful gift"))}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl flex flex-col items-center justify-center gap-3 hover:scale-105 hover:bg-white/20 hover:border-white/40 transition-all duration-300 group cursor-pointer"
            >
              <span className="text-3xl group-hover:scale-125 transition-transform">🌹</span>
              <p className="text-xs sm:text-sm font-serif italic text-[#fff0f5] leading-snug">
                {getVal("promise1Text", "Every day with you is a beautiful gift")}
              </p>
            </div>

            {/* Card 2 */}
            <div
              onClick={() => setActivePromiseModal(getVal("promise2Text", "You are home wherever you are"))}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl flex flex-col items-center justify-center gap-3 hover:scale-105 hover:bg-white/20 hover:border-white/40 transition-all duration-300 group cursor-pointer"
            >
              <span className="text-3xl group-hover:scale-125 transition-transform">💌</span>
              <p className="text-xs sm:text-sm font-serif italic text-[#fff0f5] leading-snug">
                {getVal("promise2Text", "You are home wherever you are")}
              </p>
            </div>

            {/* Card 3 */}
            <div
              onClick={() => setActivePromiseModal(getVal("promise3Text", "I choose you a thousand times over"))}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl flex flex-col items-center justify-center gap-3 hover:scale-105 hover:bg-white/20 hover:border-white/40 transition-all duration-300 group cursor-pointer"
            >
              <span className="text-3xl group-hover:scale-125 transition-transform">✨</span>
              <p className="text-xs sm:text-sm font-serif italic text-[#fff0f5] leading-snug">
                {getVal("promise3Text", "I choose you a thousand times over")}
              </p>
            </div>
          </div>
        </div>

        {/* Promise Reaction Modal */}
        {activePromiseModal && (
          <div
            onClick={() => setActivePromiseModal(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn cursor-pointer"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-[#ffeef4] text-[#801e47] border border-[#ffb8ce] p-8 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-2xl animate-scaleUp"
            >
              <div className="text-5xl animate-bounce">💖</div>
              <h4 className="font-serif text-xl font-bold">Forever Promise</h4>
              <p className="font-serif italic text-base">“{activePromiseModal}”</p>
              <button
                onClick={() => setActivePromiseModal(null)}
                className="px-6 py-2 rounded-full bg-[#d81b5c] text-white text-xs font-semibold uppercase tracking-wider shadow-md hover:scale-105 transition-transform"
              >
                Close 💕
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
