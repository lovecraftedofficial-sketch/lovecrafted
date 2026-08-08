import React from "react";
import { Heart } from "lucide-react";

export default function TakePainAway({ content = {} }) {
  const painSectionTitle = content.painSectionTitle || "If I Could Take It Away...";
  const painHeading = content.painHeading || "If I could take the pain away from you...";
  const painSubheading = content.painSubheading || "I would. Without a single second of hesitation.";
  const painParagraph = content.painParagraph || "If I could trade places with you for a day, I would do it without thinking twice. I hate knowing you're hurting and not being able to simply take it away. So until I can, let me be here. Let me listen. Let me hold you. Let me remind you that you don't have to carry the hard parts alone.";

  return (
    <section id="pain" className="relative min-h-[85vh] bg-[#1c080e] text-[#f8b3c3] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-3xl w-full text-center space-y-8 z-10 py-12">
        <Heart size={28} className="fill-[#f8b3c3] text-[#f8b3c3] mx-auto opacity-80" />

        <div className="space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] font-mono text-[#f8b3c3]/60">
            {painSectionTitle}
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium leading-tight">
            {painHeading}
          </h2>
          <p className="text-xl sm:text-2xl font-serif italic text-[#f8b3c3] font-light">
            “{painSubheading}”
          </p>
        </div>

        {/* Quiet Heartfelt Note Box */}
        <div className="p-8 sm:p-12 rounded-[2.5rem] bg-[#2a0c15]/90 border border-[#f8b3c3]/25 shadow-2xl space-y-4 text-left">
          <p className="text-base sm:text-xl font-serif text-white leading-relaxed whitespace-pre-line font-light">
            {painParagraph}
          </p>
        </div>
      </div>
    </section>
  );
}
