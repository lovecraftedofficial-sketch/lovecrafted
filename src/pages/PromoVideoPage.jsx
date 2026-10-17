import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Sparkles,
  Heart,
  Music,
  Image as ImageIcon,
  QrCode,
  ArrowLeft,
  Volume2,
  VolumeX,
  CheckCircle2,
  Film,
} from "lucide-react";
import { toast } from "sonner";

// 8 Cinematic Storyboard Scenes
const SCENES = [
  {
    id: "main-website",
    title: "1. Main Website",
    duration: 4.5,
    tag: "BRAND REVEAL",
    headline: "Where Love Meets Art",
    subtext: "Handcrafted digital keepsakes that capture your love story forever.",
  },
  {
    id: "templates-view",
    title: "2. Templates Gallery",
    duration: 4.5,
    tag: "CURATED COLLECTION",
    headline: "Bespoke Romantic Suites",
    subtext: "Explore designed experiences for anniversaries, proposals, and milestones.",
  },
  {
    id: "anniversary-intro",
    title: "3. Anniversary Keepsake",
    duration: 4.5,
    tag: "THE CROWN JEWEL",
    headline: "Aurora Noire Edition",
    subtext: "Crafted specially for Kabir & Alisha's 1st Anniversary.",
  },
  {
    id: "vinyl-player",
    title: "4. Spinning Vinyl Player",
    duration: 5.5,
    tag: "SOUNDTRACK OF LOVE",
    headline: "Interactive Vinyl Record",
    subtext: "Play your favorite couple song with continuous romantic audio.",
  },
  {
    id: "gallery-upload",
    title: "5. Phone Gallery Memories",
    duration: 5.0,
    tag: "ZERO EFFORT UPLOAD",
    headline: "Upload from Your Phone",
    subtext: "Direct gallery photos transformed into glowing Polaroid memories.",
  },
  {
    id: "love-notes",
    title: "6. Interactive Love Letters",
    duration: 4.5,
    tag: "HEARTFELT WORDS",
    headline: "Flip Adore & Love Notes",
    subtext: "Unfold hidden messages and confessions with a single gentle tap.",
  },
  {
    id: "heart-qr",
    title: "7. Printable Heart QR Card",
    duration: 4.5,
    tag: "PHYSICAL + DIGITAL",
    headline: "Scannable Heart QR Gift",
    subtext: "Print the luxury gold foil card. One scan unlocks forever.",
  },
  {
    id: "outro-cta",
    title: "8. Forever Memory",
    duration: 5.0,
    tag: "CELEBRATE YOUR LOVE",
    headline: "Gift Them Forever",
    subtext: "Create yours in 2 minutes for just ₹9 at lovecrafted-official.netlify.app",
  },
];

export default function PromoVideoPage() {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);

  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const sceneTimerRef = useRef(null);

  const currentScene = SCENES[currentSceneIdx];

  // Auto-advance scenes when playing
  useEffect(() => {
    if (!isPlaying) {
      if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
      return;
    }

    const durationMs = currentScene.duration * 1000;
    sceneTimerRef.current = setTimeout(() => {
      setCurrentSceneIdx((prev) => (prev + 1) % SCENES.length);
    }, durationMs);

    return () => {
      if (sceneTimerRef.current) clearTimeout(sceneTimerRef.current);
    };
  }, [isPlaying, currentSceneIdx]);

  // Audio Playback
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying && !isMuted) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMuted]);

  // Record video using Canvas / MediaRecorder
  const handleRecordVideo = async () => {
    if (isRecording) return;
    setIsRecording(true);
    setRecordingProgress(0);
    toast.info("Recording high-definition promo video... Please keep this tab open.", { duration: 6000 });

    try {
      // Create off-screen canvas for 1080x1920 9:16 export
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext("2d");

      const stream = canvas.captureStream(30); // 30 FPS
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";

      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 8000000, // 8 Mbps High Quality
      });

      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `lovecrafted_anniversary_showcase_${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setIsRecording(false);
        setRecordingProgress(100);
        toast.success("Promo video exported and downloaded successfully! 🎉🎬");
      };

      recorder.start();

      // Draw frames
      const totalDuration = SCENES.reduce((sum, s) => sum + s.duration, 0);
      let elapsed = 0;
      const fps = 30;
      const intervalMs = 1000 / fps;

      const renderInterval = setInterval(() => {
        elapsed += 1 / fps;
        const progressPct = Math.min(99, Math.floor((elapsed / totalDuration) * 100));
        setRecordingProgress(progressPct);

        // Find active scene
        let t = 0;
        let activeIdx = 0;
        for (let i = 0; i < SCENES.length; i++) {
          if (elapsed >= t && elapsed < t + SCENES[i].duration) {
            activeIdx = i;
            break;
          }
          t += SCENES[i].duration;
        }

        const scene = SCENES[activeIdx];

        // Background
        const grad = ctx.createLinearGradient(0, 0, 0, 1920);
        grad.addColorStop(0, "#080305");
        grad.addColorStop(0.5, "#150810");
        grad.addColorStop(1, "#0a0406");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1920);

        // Floating particles
        ctx.fillStyle = "rgba(232, 180, 184, 0.25)";
        for (let p = 0; p < 25; p++) {
          const px = (Math.sin(elapsed * 0.5 + p) * 0.5 + 0.5) * 1080;
          const py = (Math.cos(elapsed * 0.3 + p * 2) * 0.5 + 0.5) * 1920;
          ctx.beginPath();
          ctx.arc(px, py, 3 + (p % 4), 0, Math.PI * 2);
          ctx.fill();
        }

        // Top Brand Header
        ctx.fillStyle = "#dfc19c";
        ctx.font = "bold 32px serif";
        ctx.textAlign = "center";
        ctx.fillText("LOVECRAFTED", 540, 140);
        ctx.fillStyle = "rgba(223, 193, 156, 0.7)";
        ctx.font = "18px sans-serif";
        ctx.fillText("HANDCRAFTED ROMANTIC KEEPSAKES", 540, 180);

        // Scene Badge
        ctx.fillStyle = "rgba(212, 139, 149, 0.18)";
        ctx.beginPath();
        ctx.roundRect(390, 240, 300, 48, 24);
        ctx.fill();
        ctx.strokeStyle = "rgba(232, 180, 184, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = "#e8b4b8";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText(`✨ ${scene.tag}`, 540, 272);

        // Scene Headline
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 56px serif";
        ctx.fillText(scene.headline, 540, 390);

        // Scene Subtext
        ctx.fillStyle = "rgba(197, 176, 165, 0.9)";
        ctx.font = "28px sans-serif";
        ctx.fillText(scene.subtext, 540, 460);

        // Scene Center Card Graphic
        ctx.fillStyle = "rgba(22, 11, 17, 0.95)";
        ctx.beginPath();
        ctx.roundRect(140, 560, 800, 950, 40);
        ctx.fill();
        ctx.strokeStyle = "rgba(223, 193, 156, 0.35)";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Inner Card Visual based on Scene
        if (activeIdx === 0) {
          // Main Website Hero
          ctx.fillStyle = "#e8b4b8";
          ctx.font = "italic 44px serif";
          ctx.fillText("Make Moments Permanent", 540, 800);
          ctx.fillStyle = "rgba(245, 230, 211, 0.85)";
          ctx.font = "26px sans-serif";
          ctx.fillText("An unforgettable romantic experience,", 540, 880);
          ctx.fillText("reserved for the one who holds your heart.", 540, 930);

          ctx.fillStyle = "rgba(212, 139, 149, 0.25)";
          ctx.beginPath();
          ctx.roundRect(340, 1060, 400, 80, 40);
          ctx.fill();
          ctx.strokeStyle = "#e8b4b8";
          ctx.stroke();
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 28px sans-serif";
          ctx.fillText("Explore Keepsakes →", 540, 1110);
        } else if (activeIdx === 1) {
          // Templates Gallery
          ctx.fillStyle = "#dfc19c";
          ctx.font = "32px serif";
          ctx.fillText("Featured Keepsake Suites", 540, 750);

          const suites = ["1. Aurora Noire (Anniversary)", "2. Sunset Love (Proposals)", "3. Candlelit Forever (Milestones)"];
          suites.forEach((s, idx) => {
            ctx.fillStyle = "rgba(32, 14, 25, 0.9)";
            ctx.beginPath();
            ctx.roundRect(220, 840 + idx * 170, 640, 120, 20);
            ctx.fill();
            ctx.strokeStyle = "rgba(223, 193, 156, 0.25)";
            ctx.stroke();
            ctx.fillStyle = "#ffffff";
            ctx.font = "26px serif";
            ctx.fillText(s, 540, 910 + idx * 170);
          });
        } else if (activeIdx === 2) {
          // Anniversary Keepsake Intro
          ctx.fillStyle = "#e8b4b8";
          ctx.font = "italic 36px serif";
          ctx.fillText("Kabir & Alisha", 540, 780);
          ctx.fillStyle = "rgba(223, 193, 156, 0.85)";
          ctx.font = "26px sans-serif";
          ctx.fillText("Celebrating 365 Days of Pure Love", 540, 850);
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.font = "30px serif";
          ctx.fillText("“You are every melody I have ever loved.”", 540, 1020);
        } else if (activeIdx === 3) {
          // Spinning Vinyl Record
          const angle = elapsed * 1.5;
          ctx.save();
          ctx.translate(540, 960);
          ctx.rotate(angle);

          // Vinyl Body
          ctx.fillStyle = "#111111";
          ctx.beginPath();
          ctx.arc(0, 0, 240, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "#333333";
          ctx.lineWidth = 6;
          ctx.stroke();

          // Grooves
          [70, 120, 170, 210].forEach((r) => {
            ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.stroke();
          });

          // Center Sticker
          ctx.fillStyle = "#d48b95";
          ctx.beginPath();
          ctx.arc(0, 0, 75, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#0a0507";
          ctx.font = "bold 20px serif";
          ctx.fillText("Zaalima", 0, -5);
          ctx.font = "14px sans-serif";
          ctx.fillText("Arijit Singh", 0, 22);

          ctx.restore();

          // Now Playing label
          ctx.fillStyle = "#e8b4b8";
          ctx.font = "bold 26px sans-serif";
          ctx.fillText("🎵 NOW PLAYING: Zaalima", 540, 1340);
        } else if (activeIdx === 4) {
          // Photo Memories
          ctx.fillStyle = "#f5e6d3";
          ctx.font = "bold 34px serif";
          ctx.fillText("Our Milestone Moments", 540, 760);

          ctx.fillStyle = "#160b11";
          ctx.beginPath();
          ctx.roundRect(280, 840, 520, 480, 24);
          ctx.fill();
          ctx.strokeStyle = "rgba(212, 139, 149, 0.4)";
          ctx.stroke();

          ctx.fillStyle = "rgba(212, 139, 149, 0.15)";
          ctx.beginPath();
          ctx.roundRect(320, 880, 440, 320, 16);
          ctx.fill();

          ctx.fillStyle = "#e8b4b8";
          ctx.font = "64px sans-serif";
          ctx.fillText("📸", 540, 1060);

          ctx.fillStyle = "#ffffff";
          ctx.font = "24px serif";
          ctx.fillText("“The Day Everything Changed”", 540, 1260);
        } else if (activeIdx === 5) {
          // Love Letters
          ctx.fillStyle = "#e8b4b8";
          ctx.font = "bold 32px serif";
          ctx.fillText("Little Things & Open-When Notes", 540, 780);

          ctx.fillStyle = "rgba(74, 14, 28, 0.5)";
          ctx.beginPath();
          ctx.roundRect(240, 860, 600, 380, 24);
          ctx.fill();
          ctx.strokeStyle = "rgba(232, 180, 184, 0.35)";
          ctx.stroke();

          ctx.fillStyle = "#ffffff";
          ctx.font = "italic 32px serif";
          ctx.fillText("Open When: You Miss Me", 540, 960);
          ctx.fillStyle = "rgba(245, 230, 211, 0.85)";
          ctx.font = "24px sans-serif";
          ctx.fillText("“Look at the stars tonight.", 540, 1040);
          ctx.fillText("They shine with the love I have for you.”", 540, 1090);
        } else if (activeIdx === 6) {
          // Heart QR Card
          ctx.fillStyle = "#dfc19c";
          ctx.font = "bold 34px serif";
          ctx.fillText("Printable Heart QR Gift Card", 540, 760);

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.roundRect(360, 840, 360, 360, 24);
          ctx.fill();

          ctx.fillStyle = "#0a0507";
          ctx.font = "110px sans-serif";
          ctx.fillText("❤️", 540, 1050);

          ctx.fillStyle = "rgba(223, 193, 156, 0.9)";
          ctx.font = "24px sans-serif";
          ctx.fillText("Scan with Phone Camera to Open Keepsake", 540, 1290);
        } else if (activeIdx === 7) {
          // Outro & CTA
          ctx.fillStyle = "#e8b4b8";
          ctx.font = "italic 44px serif";
          ctx.fillText("A Love Story Made Immortal", 540, 800);

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 52px sans-serif";
          ctx.fillText("Only ₹9 · Lifetime Live", 540, 920);

          ctx.fillStyle = "rgba(212, 139, 149, 0.9)";
          ctx.beginPath();
          ctx.roundRect(260, 1020, 560, 90, 45);
          ctx.fill();

          ctx.fillStyle = "#0a0507";
          ctx.font = "bold 32px sans-serif";
          ctx.fillText("Create Yours Today 💍", 540, 1076);

          ctx.fillStyle = "rgba(223, 193, 156, 0.8)";
          ctx.font = "22px monospace";
          ctx.fillText("lovecrafted-official.netlify.app", 540, 1200);
        }

        // Bottom Progress Bar
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.fillRect(100, 1780, 880, 8);
        ctx.fillStyle = "#d48b95";
        ctx.fillRect(100, 1780, (elapsed / totalDuration) * 880, 8);

        if (elapsed >= totalDuration) {
          clearInterval(renderInterval);
          recorder.stop();
        }
      }, intervalMs);
    } catch (err) {
      console.error(err);
      setIsRecording(false);
      toast.error("Failed to export video: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#070305] text-[#f5e6d3] font-sans antialiased selection:bg-[#d48b95]/30 selection:text-[#f5e6d3] py-8 px-4 sm:px-6 lg:px-8">
      {/* Background Audio */}
      <audio
        ref={audioRef}
        src="/audio/sab-tera.mp3"
        loop
        muted={isMuted}
      />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#dfc19c]/15 pb-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#dfc19c]/20 bg-[#140a0f] text-xs text-[#dfc19c] hover:border-[#dfc19c]/40 transition-colors"
            >
              <ArrowLeft className="size-3.5" />
              Back to Home
            </Link>
            <div className="flex items-center gap-2">
              <Film className="size-4 text-[#e8b4b8]" />
              <h1 className="font-serif text-lg text-white font-medium">LoveCrafted Cinematic Promo Reel</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#dfc19c]/20 bg-[#140a0f] text-xs text-[#dfc19c] hover:border-[#dfc19c]/40 transition-colors"
            >
              {isMuted ? <VolumeX className="size-3.5 text-rose-400" /> : <Volume2 className="size-3.5 text-emerald-400" />}
              <span>{isMuted ? "Unmute Audio" : "Romantic Audio On"}</span>
            </button>

            <button
              type="button"
              onClick={handleRecordVideo}
              disabled={isRecording}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#e8b4b8] to-[#d48b95] px-5 py-2 text-xs font-semibold text-[#0a0507] hover:brightness-110 shadow-[0_0_20px_rgba(212,139,149,0.3)] transition-all disabled:opacity-50 cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>{isRecording ? `Exporting Reel (${recordingProgress}%)...` : "Download Reel Video (.webm)"}</span>
            </button>
          </div>
        </div>

        {/* Main Reel Presentation Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 9:16 Vertical Reel Player (Smartphone Mockup) */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              ref={containerRef}
              className="relative w-[340px] sm:w-[380px] h-[670px] sm:h-[740px] rounded-[48px] border-4 border-[#dfc19c]/30 bg-gradient-to-b from-[#12070e] via-[#090306] to-[#14070f] p-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col justify-between"
            >
              {/* Phone Speaker & Camera Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-4 rounded-full bg-black/80 flex items-center justify-center gap-2 z-30">
                <div className="size-2 rounded-full bg-[#333]" />
                <div className="w-8 h-1 rounded-full bg-[#222]" />
              </div>

              {/* Reel Story Progress Bar (Top) */}
              <div className="relative z-20 pt-4 flex gap-1 px-2">
                {SCENES.map((scene, idx) => {
                  const isActive = idx === currentSceneIdx;
                  const isPast = idx < currentSceneIdx;
                  return (
                    <div key={scene.id} className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-[#e8b4b8] to-[#d48b95] transition-all duration-300 ${
                          isPast ? "w-full" : isActive ? "w-full animate-pulse" : "w-0"
                        }`}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Active Scene Content */}
              <div className="relative z-10 flex-1 flex flex-col justify-between pt-4 pb-2 px-2">
                {/* Scene Header */}
                <div className="text-center space-y-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#dfc19c]/30 bg-[#160b11] text-[0.62rem] uppercase tracking-widest text-[#dfc19c] font-semibold">
                    <Sparkles className="size-2.5 text-[#e8b4b8]" />
                    {currentScene.tag}
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl text-white font-medium leading-tight">
                    {currentScene.headline}
                  </h2>
                  <p className="text-[0.72rem] text-[#c5b0a5] leading-relaxed line-clamp-2">
                    {currentScene.subtext}
                  </p>
                </div>

                {/* Animated Interactive Center Mockup */}
                <div className="my-auto py-2">
                  <AnimatePresence mode="wait">
                    {currentSceneIdx === 0 && (
                      <motion.div
                        key="scene-main"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="rounded-3xl border border-[#dfc19c]/25 bg-[#170911]/90 p-5 text-center space-y-4 shadow-xl"
                      >
                        <div className="size-16 mx-auto rounded-full bg-gradient-to-tr from-[#d48b95] to-[#e8b4b8] grid place-items-center shadow-[0_0_20px_rgba(212,139,149,0.5)]">
                          <span className="font-serif font-bold text-xl text-[#0a0507]">LC</span>
                        </div>
                        <h3 className="font-serif text-lg text-white font-semibold">LoveCrafted</h3>
                        <p className="text-xs text-[#c5b0a5] leading-relaxed italic">
                          &ldquo;Because some feelings are meant to be felt forever.&rdquo;
                        </p>
                        <div className="pt-2">
                          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d48b95]/20 text-xs text-[#e8b4b8] border border-[#d48b95]/30">
                            ⭐ Handcrafted Luxury Romantic Suites
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {currentSceneIdx === 1 && (
                      <motion.div
                        key="scene-templates"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-2.5"
                      >
                        {[
                          { title: "Aurora Noire", tag: "Anniversary Suite", price: "₹9", border: "border-[#e8b4b8]/40" },
                          { title: "Sunset Love", tag: "Proposal Edition", price: "₹9", border: "border-[#dfc19c]/25" },
                          { title: "Candlelit Forever", tag: "Milestone Story", price: "₹9", border: "border-[#dfc19c]/25" },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-2xl border ${item.border} bg-[#160a10] flex items-center justify-between`}
                          >
                            <div className="text-left">
                              <span className="text-[0.6rem] uppercase tracking-wider text-[#dfc19c]/70 font-semibold block">
                                {item.tag}
                              </span>
                              <p className="font-serif text-sm font-semibold text-white">{item.title}</p>
                            </div>
                            <span className="text-xs font-bold text-[#e8b4b8] px-2.5 py-1 rounded-full bg-[#d48b95]/20">
                              {item.price}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {currentSceneIdx === 2 && (
                      <motion.div
                        key="scene-anniversary"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4 }}
                        className="rounded-3xl border border-[#dfc19c]/30 bg-gradient-to-b from-[#200d18] to-[#12070e] p-5 text-center space-y-3 shadow-2xl"
                      >
                        <span className="text-xs uppercase tracking-widest text-[#e8b4b8] font-serif font-bold">
                          🥂 Happy 1st Anniversary
                        </span>
                        <h3 className="font-serif text-2xl text-white font-medium">Kabir &amp; Alisha</h3>
                        <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-[#dfc19c] to-transparent mx-auto" />
                        <p className="text-xs text-[#f5e6d3] italic font-serif leading-relaxed">
                          &ldquo;Every second with you feels like a dream I never want to wake up from.&rdquo;
                        </p>
                      </motion.div>
                    )}

                    {currentSceneIdx === 3 && (
                      <motion.div
                        key="scene-vinyl"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                        className="rounded-3xl border border-[#dfc19c]/30 bg-[#14080e] p-5 text-center space-y-4"
                      >
                        {/* Spinning Vinyl Record */}
                        <div className="relative size-36 mx-auto flex items-center justify-center">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 4.5, ease: "linear" }}
                            className="size-full rounded-full bg-gradient-to-tr from-[#0a0a0a] via-[#1a1a1a] to-[#050505] border-2 border-[#333] relative flex items-center justify-center shadow-xl"
                          >
                            <div className="absolute inset-2 rounded-full border border-white/10" />
                            <div className="absolute inset-5 rounded-full border border-white/10" />
                            <div className="size-12 rounded-full bg-gradient-to-tr from-[#d48b95] to-[#e8b4b8] flex flex-col items-center justify-center text-center">
                              <span className="text-[0.55rem] font-bold text-[#0a0507] font-serif">K &amp; A</span>
                            </div>
                          </motion.div>
                        </div>

                        <div>
                          <p className="font-serif text-sm font-semibold text-white">Zaalima</p>
                          <p className="text-[0.68rem] text-[#e8b4b8] italic">Arijit Singh &amp; Harshdeep Kaur</p>
                          <span className="inline-flex items-center gap-1 text-[0.62rem] text-emerald-300 mt-1">
                            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Continuous romantic soundtrack
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {currentSceneIdx === 4 && (
                      <motion.div
                        key="scene-gallery"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="rounded-3xl border border-[#dfc19c]/25 bg-[#170a10] p-4 text-center space-y-3"
                      >
                        <div className="p-3 rounded-2xl bg-[#0a0407] border border-[#dfc19c]/15 text-center space-y-2">
                          <div className="h-32 rounded-xl bg-gradient-to-tr from-[#3a131f] to-[#1f0913] flex items-center justify-center border border-[#e8b4b8]/20">
                            <ImageIcon className="size-8 text-[#e8b4b8]/60" />
                          </div>
                          <p className="font-serif text-xs text-white font-medium">Our First Sunset at Marine Drive</p>
                          <span className="text-[0.62rem] text-[#dfc19c]/70 font-mono">14 Feb 2025</span>
                        </div>
                        <span className="inline-flex items-center gap-1 text-xs text-[#e8b4b8]">
                          <CheckCircle2 className="size-3.5" />
                          Direct Phone Gallery Upload
                        </span>
                      </motion.div>
                    )}

                    {currentSceneIdx === 5 && (
                      <motion.div
                        key="scene-notes"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4 }}
                        className="rounded-3xl border border-[#dfc19c]/30 bg-gradient-to-b from-[#2a0e1a] to-[#15070e] p-5 text-center space-y-3"
                      >
                        <span className="text-[0.65rem] uppercase tracking-widest text-[#dfc19c] font-semibold">
                          💌 Open When: You Miss Me
                        </span>
                        <p className="text-xs text-[#f5e6d3] italic font-serif leading-relaxed">
                          &ldquo;Close your eyes and listen to our song. No matter the distance, my heart is right beside yours.&rdquo;
                        </p>
                        <div className="pt-1">
                          <span className="text-[0.65rem] text-[#e8b4b8] border border-[#e8b4b8]/30 px-3 py-1 rounded-full bg-[#e8b4b8]/10">
                            Tap to reveal hidden promises
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {currentSceneIdx === 6 && (
                      <motion.div
                        key="scene-qr"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="rounded-3xl border border-[#dfc19c]/30 bg-[#160910] p-5 text-center space-y-3 shadow-xl"
                      >
                        <div className="size-32 mx-auto rounded-2xl bg-white p-3 shadow-lg flex items-center justify-center">
                          <QrCode className="size-24 text-[#0a0507]" />
                        </div>
                        <p className="font-serif text-xs text-white font-medium">Printable Luxury Heart QR Card</p>
                        <p className="text-[0.65rem] text-[#c5b0a5]">Scan with any phone camera to experience</p>
                      </motion.div>
                    )}

                    {currentSceneIdx === 7 && (
                      <motion.div
                        key="scene-cta"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="rounded-3xl border border-[#dfc19c]/35 bg-gradient-to-b from-[#2a0d1b] via-[#1a0711] to-[#0c0408] p-6 text-center space-y-4 shadow-2xl"
                      >
                        <span className="text-xs uppercase tracking-widest text-[#e8b4b8] font-bold">
                          LoveCrafted Studio
                        </span>
                        <h3 className="font-serif text-2xl text-white font-medium">Surprise Your Person Today</h3>
                        <p className="text-xs text-[#c5b0a5]">Lifetime romantic keepsake for only ₹9</p>
                        <Link
                          to="/marketplace"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e8b4b8] to-[#d48b95] py-2.5 text-xs font-semibold text-[#0a0507] hover:brightness-110 shadow-lg transition-all"
                        >
                          <span>Start Your Keepsake (₹9)</span>
                          <Heart className="size-3.5 fill-[#0a0507]" />
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom Controls inside Phone */}
                <div className="pt-2 flex items-center justify-between text-xs border-t border-[#dfc19c]/15">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="inline-flex items-center gap-1.5 text-white hover:text-[#e8b4b8]"
                  >
                    {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                    <span>{isPlaying ? "Pause" : "Play"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentSceneIdx(0)}
                    className="inline-flex items-center gap-1 text-[#c5b0a5] hover:text-white text-[0.68rem]"
                  >
                    <RotateCcw className="size-3" />
                    <span>Restart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Scene Breakdown & Director Guide */}
          <div className="lg:col-span-7 space-y-6">
            {/* Storyboard Navigation Tabs */}
            <div className="p-6 rounded-3xl border border-[#dfc19c]/20 bg-[#12070c] space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg text-white font-medium">Interactive Storyboard</h3>
                  <p className="text-xs text-[#c5b0a5]">Click any scene to preview its animation and visual highlights.</p>
                </div>
                <span className="text-xs font-mono text-[#dfc19c]">
                  Scene {currentSceneIdx + 1} of {SCENES.length}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SCENES.map((scene, idx) => {
                  const isCurrent = idx === currentSceneIdx;
                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => {
                        setCurrentSceneIdx(idx);
                        setIsPlaying(false);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isCurrent
                          ? "border-[#e8b4b8]/50 bg-[#250d18] shadow-[0_0_15px_rgba(212,139,149,0.2)]"
                          : "border-[#dfc19c]/15 bg-[#0e0509] hover:border-[#dfc19c]/30"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[0.62rem] font-bold uppercase tracking-wider text-[#dfc19c]">
                          {scene.title}
                        </span>
                        <span className="text-[0.6rem] font-mono text-[#c5b0a5]">{scene.duration}s</span>
                      </div>
                      <p className="text-xs font-serif font-medium text-white mt-1 truncate">{scene.headline}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Viral Reel Script & Voiceover Guide */}
            <div className="p-6 rounded-3xl border border-[#dfc19c]/20 bg-[#12070c] space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-[#e8b4b8]" />
                <h3 className="font-serif text-lg text-white font-medium">
                  Instagram Reel Voiceover &amp; Audio Guide
                </h3>
              </div>

              <div className="space-y-3 text-xs text-[#c5b0a5] leading-relaxed">
                <div className="p-3.5 rounded-xl border border-[#dfc19c]/15 bg-[#180a11] space-y-1.5">
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#dfc19c] block">
                    🎙️ Voiceover Script (Hinglish / Hindi):
                  </span>
                  <p className="italic text-white">
                    &ldquo;Apne person ko wahi purane chocolates aur mugs dene ke bajaye, unhe ek aisa romantic keepsake do jo lifetime unke dil ke paas rahe. Meet LoveCrafted — jahan aap sirf 2 minute me unke liye ek personalized digital keepsake bana sakte ho. Unka favorite gaana vinyl record par, phone gallery se unki favorite yaadein, aur ek luxury Heart QR gift card! Sirf ₹9 me unhe surprise karo — link in bio.&rdquo;
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-[#dfc19c]/15 bg-[#0e0509]">
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#dfc19c] block mb-1">
                      🎵 Trending Audio Recommendations:
                    </span>
                    <ul className="space-y-1 text-[0.72rem]">
                      <li>• Zaalima (Acoustic / Lofi)</li>
                      <li>• Kesariya (Slowed &amp; Reverb)</li>
                      <li>• Until I Found You - Stephen Sanchez</li>
                      <li>• Co2 - Prateek Kuhad</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl border border-[#dfc19c]/15 bg-[#0e0509]">
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#dfc19c] block mb-1">
                      🏷️ High-Converting Hashtags:
                    </span>
                    <p className="text-[0.72rem] text-[#e8b4b8] font-mono leading-relaxed">
                      #anniversarygift #romanticgift #lovekeepsake #lovecrafted #couplegifts #firstanniversary #giftideasforher
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
