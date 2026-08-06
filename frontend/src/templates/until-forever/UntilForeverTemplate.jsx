import React, { useState } from "react";
import BackgroundMusic from "@/components/BackgroundMusic";
import untilForeverConfig from "./template.config";
import Chapter1Invitation from "./components/Chapter1Invitation";
import Chapter2HandwrittenLetter from "./components/Chapter2HandwrittenLetter";
import Chapter3KeepsakeTable from "./components/Chapter3KeepsakeTable";
import Chapter4MemoryBox from "./components/Chapter4MemoryBox";
import Chapter5HearMyHeart from "./components/Chapter5HearMyHeart";
import Chapter6VinylPlayer from "./components/Chapter6VinylPlayer";
import Chapter7BookOfReasons from "./components/Chapter7BookOfReasons";
import Chapter8StarlightPlanetarium from "./components/Chapter8StarlightPlanetarium";
import Chapter9SeasonsWeShared from "./components/Chapter9SeasonsWeShared";
import Chapter10OpenWhen from "./components/Chapter10OpenWhen";
import Chapter11SecretGift from "./components/Chapter11SecretGift";
import Chapter12FinalClosure from "./components/Chapter12FinalClosure";

/**
 * UntilForeverTemplate.jsx
 * ------------------------
 * LoveCrafted Flagship Ultra-Luxury Digital Love Experience.
 * Complete 12-Chapter Emotional Journey Orchestrator.
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

      {/* CHAPTER 7: THE BOOK OF REASONS (LEATHER JOURNAL) */}
      {currentChapter === 7 && (
        <Chapter7BookOfReasons
          content={activeContent}
          onComplete={() => setCurrentChapter(8)}
        />
      )}

      {/* CHAPTER 8: THE STARLIGHT PLANETARIUM */}
      {currentChapter === 8 && (
        <Chapter8StarlightPlanetarium
          content={activeContent}
          onComplete={() => setCurrentChapter(9)}
        />
      )}

      {/* CHAPTER 9: THE SEASONS WE SHARED */}
      {currentChapter === 9 && (
        <Chapter9SeasonsWeShared
          content={activeContent}
          onComplete={() => setCurrentChapter(10)}
        />
      )}

      {/* CHAPTER 10: OPEN WHEN... (SACRED COMFORT ENVELOPES) */}
      {currentChapter === 10 && (
        <Chapter10OpenWhen
          content={activeContent}
          onComplete={() => setCurrentChapter(11)}
        />
      )}

      {/* CHAPTER 11: THE SECRET GIFT (INTIMATE SAVED PROMISE) */}
      {currentChapter === 11 && (
        <Chapter11SecretGift
          content={activeContent}
          onComplete={() => setCurrentChapter(12)}
        />
      )}

      {/* CHAPTER 12: THE FINAL CHAPTER (QUIET CLOSURE TO BLACK) */}
      {currentChapter === 12 && (
        <Chapter12FinalClosure content={activeContent} />
      )}
    </div>
  );
}
