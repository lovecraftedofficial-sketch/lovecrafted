import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Heart, Sparkles, Clock, Lock, Unlock, Send, Compass } from "lucide-react";

export default function SunsetLoveTemplate(props) {
  // Support any shape of content passed from editor
  const data = props.data || props.content || props || {};

  const getVal = (key, fallback) => {
    if (data && data[key] !== undefined && data[key] !== null && data[key] !== "") {
      return data[key];
    }
    return fallback;
  };

  // Content Data
  const musicUrl = getVal("bgMusicUrl", "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3");
  const songTitle = getVal("songTitle", "Golden Hour Romance");
  const badge = getVal("heroBadge", "✨ SUNSET LOVE COLLECTION");
  const title = getVal("heroTitle", "Our Love Story Under the Golden Sunset");
  const names = getVal("coupleNames", "Alex & Sam");
  const startDate = getVal("relationshipDate", "2023-02-14");
  const quote = getVal("quote", "“In every universe, in every lifetime, I would still find you and choose you.”");

  // Polaroids
  const card1Img = getVal("card1Image", "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80");
  const card1Title = getVal("card1Title", "Our First Sunset Walk 🌅");
  const card1Caption = getVal("card1Caption", "Golden hour, soft breeze, and endless conversations.");

  const card2Img = getVal("card2Image", "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80");
  const card2Title = getVal("card2Title", "Caramel Latte & Smiles ☕");
  const card2Caption = getVal("card2Caption", "That cute little coffee place on a rainy afternoon.");

  const card3Img = getVal("card3Image", "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=1200&q=80");
  const card3Title = getVal("card3Title", "Under the Starry Night ✨");
  const card3Caption = getVal("card3Caption", "Promises made when the world went quiet.");

  // Timeline
  const time1Date = getVal("time1Date", "First Date · June 15");
  const time1Title = getVal("time1Title", "The First Spark ✨");
  const time1Desc = getVal("time1Desc", "We talked for 4 hours like we had known each other forever.");

  const time2Date = getVal("time2Date", "First Trip · Nov 04");
  const time2Title = getVal("time2Title", "Escaping the World 🏞️");
  const time2Desc = getVal("time2Desc", "Late night drives, favorite songs, and golden sunsets.");

  const time3Date = getVal("time3Date", "Forever · Today");
  const time3Title = getVal("time3Title", "Every Single Tomorrow 💖");
  const time3Desc = getVal("time3Desc", "Choosing you every day, in every moment.");

  // Love Letter
  const letterTitle = getVal("letterTitle", "A Letter From My Heart 💌");
  const letterMsg = getVal("letterMessage", "My Dearest,\n\nFrom the moment you stepped into my life, everything felt brighter—like warm golden sunlight after a long winter. Thank you for the laughs, the quiet comforting silences, and for loving me so effortlessly.\n\nYours Always.");

  // Open When Messages
  const open1Title = getVal("open1Title", "Open when you miss me 💌");
  const open1Msg = getVal("open1Message", "Close your eyes for a second. I am thinking of you right now too.");

  const open2Title = getVal("open2Title", "Open when you can't sleep 🌙");
  const open2Msg = getVal("open2Message", "Breathe in slowly. Picture us walking together under the stars. Goodnight my love.");

  const open3Title = getVal("open3Title", "Open when you need a smile 😊");
  const open3Msg = getVal("open3Message", "Remember: You are my absolute favorite person in the entire universe!");

  // Love Notes
  const note1 = getVal("loveNote1", "You make every single day feel like golden hour. 🌄");
  const note2 = getVal("loveNote2", "My favorite place in the world is right beside you. 💖");
  const note3 = getVal("loveNote3", "Forever is just the beginning of our story. ✨");

  // State Management
  const [isPlaying, setIsPlaying] = useState(false);
  const [openCards, setOpenCards] = useState({});
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [timeTogether, setTimeTogether] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const audioRef = useRef(null);

  // Calculate live relationship counter
  useEffect(() => {
    const calcTime = () => {
      const start = new Date(startDate || "2023-02-14").getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeTogether({ days, hours, mins, secs });
    };

    calcTime();
    const interval = setInterval(calcTime, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

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

  const toggleOpenCard = (id) => {
    setOpenCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const triggerHeartShower = () => {
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() + i,
      left: Math.random() * 90 + 5,
      size: Math.random() * 20 + 16,
      duration: Math.random() * 2 + 2,
    }));
    setFloatingHearts((prev) => [...prev, ...newHearts]);

    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => !newHearts.includes(h)));
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#0e060b] text-[#fbf3f5] font-sans selection:bg-rose-500/30 relative overflow-x-hidden pb-28">
      <audio ref={audioRef} src={musicUrl} loop prefetch="auto" />

      {/* Floating Hearts Animation Container */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingHearts.map((h) => (
          <div
            key={h.id}
            className="absolute bottom-0 text-rose-400 animate-bounce"
            style={{
              left: `${h.left}%`,
              fontSize: `${h.size}px`,
              animation: `floatUp ${h.duration}s ease-out forwards`,
            }}
          >
            💖
          </div>
        ))}
      </div>

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.8); opacity: 1; }
          100% { transform: translateY(-100vh) scale(1.4); opacity: 0; }
        }
      `}</style>

      {/* Background ambience is handled globally by <BackgroundMusic /> in App.js */}

      {/* Golden Hour Ambient Glow Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-amber-500/20 via-rose-500/15 to-transparent blur-[140px] pointer-events-none" />

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-16 px-6 text-center max-w-4xl mx-auto space-y-7">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs tracking-widest font-semibold uppercase shadow-inner">
          <Sparkles size={13} className="text-amber-300 animate-spin" />
          <span>{badge}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-rose-200 to-amber-300 tracking-tight leading-[1.15]">
          {title}
        </h1>

        <p className="text-2xl sm:text-3xl font-serif italic text-rose-300 font-semibold tracking-wide">
          {names}
        </p>

        {/* Live Days Together Counter */}
        <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/15 to-amber-500/10 border border-amber-400/20 rounded-3xl p-6 shadow-2xl backdrop-blur-md max-w-2xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] font-semibold text-amber-300/90">
            <Clock size={14} className="text-amber-400" />
            <span>Time Together In Love</span>
          </div>

          <div className="grid grid-cols-4 gap-3 text-center pt-1">
            <div className="bg-black/40 border border-white/10 rounded-2xl p-3">
              <span className="block font-serif text-2xl sm:text-4xl font-extrabold text-amber-200">{timeTogether.days}</span>
              <span className="text-[10px] uppercase tracking-wider text-rose-300/70 font-semibold">Days</span>
            </div>
            <div className="bg-black/40 border border-white/10 rounded-2xl p-3">
              <span className="block font-serif text-2xl sm:text-4xl font-extrabold text-amber-200">{timeTogether.hours}</span>
              <span className="text-[10px] uppercase tracking-wider text-rose-300/70 font-semibold">Hours</span>
            </div>
            <div className="bg-black/40 border border-white/10 rounded-2xl p-3">
              <span className="block font-serif text-2xl sm:text-4xl font-extrabold text-amber-200">{timeTogether.mins}</span>
              <span className="text-[10px] uppercase tracking-wider text-rose-300/70 font-semibold">Mins</span>
            </div>
            <div className="bg-black/40 border border-white/10 rounded-2xl p-3">
              <span className="block font-serif text-2xl sm:text-4xl font-extrabold text-amber-200">{timeTogether.secs}</span>
              <span className="text-[10px] uppercase tracking-wider text-rose-300/70 font-semibold">Secs</span>
            </div>
          </div>
        </div>

        <p className="text-base sm:text-lg text-stone-300/90 max-w-2xl mx-auto leading-relaxed font-light italic bg-white/[0.03] p-5 rounded-2xl border border-white/10 shadow-xl">
          {quote}
        </p>
      </section>

      {/* 3D POLAROID GALLERY SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs uppercase tracking-[0.35em] font-bold text-amber-400/80 block">
            Polaroid Memories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-amber-100 font-extrabold">
            Frozen Moments in Time
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {/* Card 1 */}
          <div className="group bg-[#faf6ef] p-4 pb-7 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500 hover:-translate-y-3 hover:rotate-2 border border-amber-200/50 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-amber-400/80 rounded-full border-2 border-white shadow-md z-10 flex items-center justify-center text-[10px]">📌</div>
            <div className="relative overflow-hidden rounded-xl aspect-[4/5] bg-stone-200 shadow-inner">
              <img src={card1Img} alt={card1Title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            </div>
            <div className="mt-5 text-center px-2 space-y-1">
              <h3 className="font-serif font-bold text-xl text-stone-900 block">{card1Title}</h3>
              <p className="text-xs text-stone-600 font-serif italic block leading-relaxed">{card1Caption}</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group bg-[#faf6ef] p-4 pb-7 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500 hover:-translate-y-3 hover:-rotate-2 md:translate-y-6 border border-amber-200/50 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-rose-400/80 rounded-full border-2 border-white shadow-md z-10 flex items-center justify-center text-[10px]">📌</div>
            <div className="relative overflow-hidden rounded-xl aspect-[4/5] bg-stone-200 shadow-inner">
              <img src={card2Img} alt={card2Title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            </div>
            <div className="mt-5 text-center px-2 space-y-1">
              <h3 className="font-serif font-bold text-xl text-stone-900 block">{card2Title}</h3>
              <p className="text-xs text-stone-600 font-serif italic block leading-relaxed">{card2Caption}</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group bg-[#faf6ef] p-4 pb-7 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-500 hover:-translate-y-3 hover:rotate-2 border border-amber-200/50 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-amber-400/80 rounded-full border-2 border-white shadow-md z-10 flex items-center justify-center text-[10px]">📌</div>
            <div className="relative overflow-hidden rounded-xl aspect-[4/5] bg-stone-200 shadow-inner">
              <img src={card3Img} alt={card3Title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
            </div>
            <div className="mt-5 text-center px-2 space-y-1">
              <h3 className="font-serif font-bold text-xl text-stone-900 block">{card3Title}</h3>
              <p className="text-xs text-stone-600 font-serif italic block leading-relaxed">{card3Caption}</p>
            </div>
          </div>
        </div>
      </section>

      {/* LOVE STORY TIMELINE SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs uppercase tracking-[0.35em] font-bold text-amber-400/80 block">
            Love Timeline
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-amber-100 font-extrabold">
            Chapters of Us 📖
          </h2>
        </div>

        <div className="relative border-l-2 border-amber-400/30 ml-4 sm:ml-32 space-y-10">
          {/* Chapter 1 */}
          <div className="relative pl-6 sm:pl-10">
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-amber-400 border-4 border-[#0e060b] shadow-lg" />
            <div className="bg-gradient-to-r from-white/[0.05] to-transparent border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-300 block">{time1Date}</span>
              <h3 className="font-serif text-xl font-bold text-amber-100">{time1Title}</h3>
              <p className="text-sm text-stone-300 font-serif italic">{time1Desc}</p>
            </div>
          </div>

          {/* Chapter 2 */}
          <div className="relative pl-6 sm:pl-10">
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-rose-400 border-4 border-[#0e060b] shadow-lg" />
            <div className="bg-gradient-to-r from-white/[0.05] to-transparent border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-rose-300 block">{time2Date}</span>
              <h3 className="font-serif text-xl font-bold text-amber-100">{time2Title}</h3>
              <p className="text-sm text-stone-300 font-serif italic">{time2Desc}</p>
            </div>
          </div>

          {/* Chapter 3 */}
          <div className="relative pl-6 sm:pl-10">
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-amber-400 border-4 border-[#0e060b] shadow-lg" />
            <div className="bg-gradient-to-r from-white/[0.05] to-transparent border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-300 block">{time3Date}</span>
              <h3 className="font-serif text-xl font-bold text-amber-100">{time3Title}</h3>
              <p className="text-sm text-stone-300 font-serif italic">{time3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* HANDWRITTEN LOVE LETTER SECTION */}
      <section className="max-w-3xl mx-auto px-6 py-14">
        <div className="relative bg-gradient-to-b from-[#1c0f18] via-[#150a12] to-[#10060e] border border-amber-400/30 rounded-3xl p-8 sm:p-14 shadow-2xl space-y-6">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 p-3.5 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 shadow-2xl">
            <Heart size={24} className="fill-rose-400 text-rose-400 animate-pulse" />
          </div>

          <h2 className="text-center font-serif text-3xl sm:text-4xl text-amber-100 font-bold pt-3 tracking-wide">
            {letterTitle}
          </h2>

          <div className="whitespace-pre-line font-serif italic text-stone-200 text-base sm:text-lg leading-relaxed text-center px-2 sm:px-8 border-t border-b border-white/10 py-6">
            {letterMsg}
          </div>
        </div>
      </section>

      {/* INTERACTIVE OPEN WHEN CARDS SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <div className="text-center mb-10 space-y-2">
          <span className="text-xs uppercase tracking-[0.35em] font-bold text-rose-300/80 block">
            Secret Envelope Notes
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-amber-100 font-extrabold">
            Open When Messages 💌
          </h2>
          <p className="text-xs text-stone-400 italic">Click on an envelope to reveal your secret message</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Open When 1 */}
          <div
            onClick={() => toggleOpenCard("card1")}
            className="cursor-pointer bg-gradient-to-b from-rose-950/40 to-black/60 border border-rose-400/30 hover:border-rose-400 p-6 rounded-2xl shadow-xl transition-all hover:scale-105 space-y-3 relative group text-center"
          >
            <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-400/30 flex items-center justify-center mx-auto text-rose-300">
              {openCards["card1"] ? <Unlock size={18} /> : <Lock size={18} />}
            </div>
            <h3 className="font-serif font-bold text-base text-amber-100">{open1Title}</h3>
            {openCards["card1"] ? (
              <p className="text-xs text-rose-200 font-serif italic leading-relaxed pt-2 border-t border-rose-500/20 animate-fadeIn">
                "{open1Msg}"
              </p>
            ) : (
              <span className="text-[10px] uppercase tracking-wider text-rose-400 font-semibold block pt-1">
                Tap to Unlock Secret
              </span>
            )}
          </div>

          {/* Open When 2 */}
          <div
            onClick={() => toggleOpenCard("card2")}
            className="cursor-pointer bg-gradient-to-b from-amber-950/40 to-black/60 border border-amber-400/30 hover:border-amber-400 p-6 rounded-2xl shadow-xl transition-all hover:scale-105 space-y-3 relative group text-center"
          >
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-400/30 flex items-center justify-center mx-auto text-amber-300">
              {openCards["card2"] ? <Unlock size={18} /> : <Lock size={18} />}
            </div>
            <h3 className="font-serif font-bold text-base text-amber-100">{open2Title}</h3>
            {openCards["card2"] ? (
              <p className="text-xs text-amber-200 font-serif italic leading-relaxed pt-2 border-t border-amber-500/20 animate-fadeIn">
                "{open2Msg}"
              </p>
            ) : (
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold block pt-1">
                Tap to Unlock Secret
              </span>
            )}
          </div>

          {/* Open When 3 */}
          <div
            onClick={() => toggleOpenCard("card3")}
            className="cursor-pointer bg-gradient-to-b from-rose-950/40 to-black/60 border border-rose-400/30 hover:border-rose-400 p-6 rounded-2xl shadow-xl transition-all hover:scale-105 space-y-3 relative group text-center"
          >
            <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-400/30 flex items-center justify-center mx-auto text-rose-300">
              {openCards["card3"] ? <Unlock size={18} /> : <Lock size={18} />}
            </div>
            <h3 className="font-serif font-bold text-base text-amber-100">{open3Title}</h3>
            {openCards["card3"] ? (
              <p className="text-xs text-rose-200 font-serif italic leading-relaxed pt-2 border-t border-rose-500/20 animate-fadeIn">
                "{open3Msg}"
              </p>
            ) : (
              <span className="text-[10px] uppercase tracking-wider text-rose-400 font-semibold block pt-1">
                Tap to Unlock Secret
              </span>
            )}
          </div>
        </div>
      </section>

      {/* VIRTUAL HUG & KISS SHOWER BUTTON */}
      <section className="max-w-md mx-auto px-6 py-8 text-center space-y-4">
        <button
          onClick={triggerHeartShower}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-serif font-bold text-base shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20"
        >
          <Heart size={20} className="fill-white animate-pulse" /> Send Virtual Hug & Kisses 💖
        </button>
      </section>

      {/* ROMANTIC LITTLE REMINDERS NOTES */}
      <section className="max-w-2xl mx-auto px-6 py-8 space-y-4 text-center">
        <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-amber-300/70 mb-6">
          Little Reminders
        </h3>

        <div className="space-y-3">
          {[note1, note2, note3].map((note, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-stone-200 text-sm sm:text-base font-serif italic shadow-lg hover:border-amber-400/40 transition-all"
            >
              {note}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}