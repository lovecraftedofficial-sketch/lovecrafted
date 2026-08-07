import React, { useState } from "react";
import aLittleCornerConfig from "./template.config";
import Hero from "./components/Hero";
import TodaysNote from "./components/TodaysNote";
import CareCorner from "./components/CareCorner";
import OurSongs from "./components/OurSongs";
import ReasonsGrid from "./components/ReasonsGrid";
import OpenWhenSection from "./components/OpenWhenSection";
import MemoryGallery from "./components/MemoryGallery";
import PrivateLetter from "./components/PrivateLetter";
import EndingSection from "./components/EndingSection";
import { Heart } from "lucide-react";

export default function ALittleCornerTemplate({ content = {}, config = {} }) {
  const activeContent = {
    ...aLittleCornerConfig.demoData,
    ...(content || {}),
  };

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "note", label: "Today's Note" },
    { id: "care", label: "Care Corner" },
    { id: "songs", label: "Songs" },
    { id: "reasons", label: "Reasons" },
    { id: "openwhen", label: "Open When" },
    { id: "gallery", label: "Memories" },
    { id: "letter", label: "Letter" },
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#16080c] text-white font-sans selection:bg-[#4a0e20] selection:text-white relative overflow-x-clip">
      {/* Sticky Top Comfort Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#16080c]/80 backdrop-blur-md border-b border-[#f7c5d1]/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2 text-sm font-serif font-medium text-white cursor-pointer"
          >
            <Heart size={16} className="fill-[#f7c5d1] text-[#f7c5d1]" />
            <span>A Little Corner</span>
          </button>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-xs text-[#f7c5d1]/70 hover:text-white transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Floating Soft Hearts Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="floating-heart"
            style={{
              left: `${15 + i * 15}%`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${16 + i * 2}s`
            }}
          >
            <Heart size={16 + (i % 3) * 6} />
          </div>
        ))}
      </div>

      {/* Section 1: Hero */}
      <Hero content={activeContent} onNavigate={scrollToSection} />

      {/* Section 2: Today's Little Note */}
      <TodaysNote content={activeContent} />

      {/* Section 3: Little Care Corner */}
      <CareCorner content={activeContent} />

      {/* Section 4: Our Songs */}
      <OurSongs content={activeContent} />

      {/* Section 5: Reasons I Love You */}
      <ReasonsGrid content={activeContent} />

      {/* Section 6: Open When... */}
      <OpenWhenSection content={activeContent} />

      {/* Section 7: Memory Gallery */}
      <MemoryGallery content={activeContent} />

      {/* Section 8: Private Letter */}
      <PrivateLetter content={activeContent} />

      {/* Section 9: Ending */}
      <EndingSection content={activeContent} />
    </div>
  );
}
