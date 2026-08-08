import React from "react";
import comeHereBabyConfig from "./template.config";
import AmbientBackground from "./components/AmbientBackground";
import Hero from "./components/Hero";
import MoodSelector from "./components/MoodSelector";
import CareChecklist from "./components/CareChecklist";
import MoodyReassurance from "./components/MoodyReassurance";
import PickYourNeed from "./components/PickYourNeed";
import ThingsILove from "./components/ThingsILove";
import TakePainAway from "./components/TakePainAway";
import ComfortBox from "./components/ComfortBox";
import PrivateLetter from "./components/PrivateLetter";
import WhenCrying from "./components/WhenCrying";
import OurPlaylist from "./components/OurPlaylist";
import FinalMessage from "./components/FinalMessage";
import { Heart } from "lucide-react";

export default function ComeHereBabyTemplate({ content = {}, config = {} }) {
  const activeContent = {
    ...comeHereBabyConfig.demoData,
    ...(content || {}),
  };

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "mood", label: "Mood" },
    { id: "care", label: "Care" },
    { id: "moody", label: "Moody" },
    { id: "needs", label: "Needs" },
    { id: "things", label: "Love" },
    { id: "pain", label: "Comfort" },
    { id: "box", label: "Box" },
    { id: "letter", label: "Letter" },
    { id: "playlist", label: "Songs" },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#1c080e] text-white font-sans selection:bg-[#3d0a18] selection:text-white relative overflow-x-clip">
      {/* 60fps Ambient Background Atmosphere */}
      <AmbientBackground />

      {/* Sticky Top Comfort Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#1c080e]/85 backdrop-blur-md border-b border-[#f8b3c3]/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2 text-sm font-serif font-medium text-white cursor-pointer"
          >
            <Heart size={16} className="fill-[#f8b3c3] text-[#f8b3c3]" />
            <span>Come Here, Baby</span>
          </button>

          <nav className="hidden md:flex items-center gap-5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-xs text-[#f8b3c3]/70 hover:text-white transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* 12 Sections */}
      <Hero content={activeContent} onNavigate={scrollToSection} />
      <MoodSelector content={activeContent} />
      <CareChecklist content={activeContent} />
      <MoodyReassurance content={activeContent} />
      <PickYourNeed content={activeContent} />
      <ThingsILove content={activeContent} />
      <TakePainAway content={activeContent} />
      <ComfortBox content={activeContent} />
      <PrivateLetter content={activeContent} />
      <WhenCrying content={activeContent} />
      <OurPlaylist content={activeContent} />
      <FinalMessage content={activeContent} />
    </div>
  );
}
