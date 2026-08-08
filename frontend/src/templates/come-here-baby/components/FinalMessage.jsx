import React from "react";
import { Heart } from "lucide-react";

export default function FinalMessage({ content = {} }) {
  const finalHeading1 = content.finalHeading1 || "Your pain will pass.";
  const finalHeading2 = content.finalHeading2 || "Your mood will settle.";
  const finalHeading3 = content.finalHeading3 || "Your cramps will ease.";
  const finalHeading4 = content.finalHeading4 || "Your tears will dry.";
  const finalMainLine = content.finalMainLine || "But me loving you through all of it? That's not going anywhere.";
  const finalSubLine = content.finalSubLine || "So come here whenever you need me, baby.";
  const footerLine = content.footerLine || "Made with love, patience & way too many kisses ♡";

  return (
    <section id="final" className="relative min-h-[75vh] bg-[#1c080e] text-[#f8b3c3] flex flex-col items-center justify-between p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="my-auto max-w-2xl w-full text-center space-y-8 z-10">
        <Heart size={32} className="fill-[#f8b3c3] text-[#f8b3c3] mx-auto opacity-80" />

        <div className="space-y-2 text-[#f8b3c3]/80 font-serif text-lg sm:text-xl italic">
          <p>{finalHeading1}</p>
          <p>{finalHeading2}</p>
          <p>{finalHeading3}</p>
          <p>{finalHeading4}</p>
        </div>

        <div className="pt-4 space-y-3">
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium leading-tight">
            {finalMainLine}
          </h2>
          <p className="text-lg sm:text-xl font-serif italic text-[#f8b3c3]">
            {finalSubLine}
          </p>
        </div>
      </div>

      <footer className="pt-12 text-center text-xs text-[#f8b3c3]/50 font-serif italic z-10 border-t border-[#f8b3c3]/10 w-full max-w-md">
        {footerLine}
      </footer>
    </section>
  );
}
