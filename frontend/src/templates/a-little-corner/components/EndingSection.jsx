import React from "react";
import { Heart } from "lucide-react";

export default function EndingSection({ content = {} }) {
  const endingMessage = content.endingMessage || "This little corner will always be here for you.";
  const endingCoda = content.endingCoda || `Made with love for ${content.partnerName || "Ananya"} ❤️`;

  return (
    <section id="ending" className="relative min-h-[70vh] bg-[#16080c] text-[#f7c5d1] flex flex-col items-center justify-between p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="my-auto max-w-2xl w-full text-center space-y-6 z-10">
        <Heart size={28} className="fill-[#f7c5d1] text-[#f7c5d1] mx-auto opacity-70" />
        <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium leading-tight">
          “{endingMessage}”
        </h2>
      </div>

      {/* Footer */}
      <footer className="pt-12 text-center text-xs text-[#f7c5d1]/50 font-serif italic z-10 border-t border-[#f7c5d1]/10 w-full max-w-md">
        {endingCoda}
      </footer>
    </section>
  );
}
