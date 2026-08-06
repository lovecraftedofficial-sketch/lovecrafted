import React, { useState } from "react";
import BackgroundMusic from "@/components/BackgroundMusic";
import untilForeverConfig from "./template.config";
import Chapter1Invitation from "./components/Chapter1Invitation";
import Chapter2HandwrittenLetter from "./components/Chapter2HandwrittenLetter";
import Chapter3KeepsakeTable from "./components/Chapter3KeepsakeTable";
import Chapter4MemoryBox from "./components/Chapter4MemoryBox";
import Chapter5HearMyHeart from "./components/Chapter5HearMyHeart";
import Chapter6VinylPlayer from "./components/Chapter6VinylPlayer";

/**
 * UntilForeverTemplate.jsx
 * ------------------------
 * LoveCrafted Flagship Ultra-Luxury Digital Love Experience.
 * 12-Chapter Emotional Journey Orchestrator.
 */
export default function UntilForeverTemplate({ content = {}, config = {} }) {
  // Merge user custom content with default demo data
  const activeContent = {
    ...untilForeverConfig.demoData,
    ...(content || {}),
  };

  // Active Chapter Index (1 to 12)
  const [currentChapter, setCurrentChapter] = useState(1);

  return (
    <div className="min-h-screen bg-[#040103] text-white selection:bg-rose-500 selection:text-white font-sans overflow-x-hidden">
      {/* Central Single Source of Truth Audio Ambient Controller */}
      <BackgroundMusic />

      {/* CHAPTER 1: THE INVITATION */}
      {currentChapter === 1 && (
        <Chapter1Invitation
          content={activeContent}
          onComplete={() => setCurrentChapter(2)}
        />
      )}

      {/* CHAPTER 2: THE HANDWRITTEN LETTER */}
      {currentChapter === 2 && (
        <Chapter2HandwrittenLetter
          content={activeContent}
          onComplete={() => setCurrentChapter(3)}
        />
      )}

      {/* CHAPTER 3: THE KEEPSAKE TABLE (MUSEUM OF US) */}
      {currentChapter === 3 && (
        <Chapter3KeepsakeTable
          content={activeContent}
          onComplete={() => setCurrentChapter(4)}
        />
      )}

      {/* CHAPTER 4: THE VINTAGE WOODEN MEMORY BOX */}
      {currentChapter === 4 && (
        <Chapter4MemoryBox
          content={activeContent}
          onComplete={() => setCurrentChapter(5)}
        />
      )}

      {/* CHAPTER 5: HEAR MY HEART (DISCOVERED VOICE KEEPSAKES) */}
      {currentChapter === 5 && (
        <Chapter5HearMyHeart
          content={activeContent}
          onComplete={() => setCurrentChapter(6)}
        />
      )}

      {/* CHAPTER 6: OUR SONG (VINTAGE SPINNING VINYL PLAYER) */}
      {currentChapter === 6 && (
        <Chapter6VinylPlayer
          content={activeContent}
          onComplete={() => setCurrentChapter(7)}
        />
      )}

      {/* CHAPTER 7+: CONTINUATION PLACEHOLDER (Built Chapter-by-Chapter) */}
      {currentChapter > 6 && (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-fadeIn space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
            Chapter {currentChapter} Active
          </div>
          <h2 className="font-serif text-3xl font-bold text-white">
            "{activeContent.recipientName}"
          </h2>
          <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
            Chapter {currentChapter} is being crafted with award-winning emotional storytelling...
          </p>
          <button
            type="button"
            onClick={() => setCurrentChapter(1)}
            aria-label="Replay invitation chapter"
            className="text-xs text-rose-400 hover:text-rose-300 underline cursor-pointer pt-4"
          >
            ← Replay Chapter 1 Invitation
          </button>
        </div>
      )}
    </div>
  );
}
