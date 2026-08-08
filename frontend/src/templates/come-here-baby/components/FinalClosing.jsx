import React from "react";
import { Heart } from "lucide-react";

export default function FinalClosing({ content = {} }) {
  const finalTitle = content.finalTitle || "Okay baby, that's enough for today. ❤️";
  const finalLine1 = content.finalLine1 || "Go rest now.";
  const finalLine2 = content.finalLine2 || "Take care of yourself for me.";
  const finalLine3 = content.finalLine3 || "And remember...\nYou are loved.\nYou are safe.\nYou are precious to me.";
  const finalLine4 = content.finalLine4 || "I'll be right here whenever you need me.";
  const finalCoda = content.finalCoda || "Made with all my love, just for you. ❤️";

  return (
    <section id="final" className="relative min-h-[75vh] bg-[#1c080e] text-[#f8b3c3] flex flex-col items-center justify-between p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="my-auto max-w-2xl w-full text-center space-y-8 z-10">
        <Heart size={32} className="fill-[#f8b3c3] text-[#f8b3c3] mx-auto opacity-80" />

        <div className="space-y-4">
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium leading-tight">
            {finalTitle}
          </h2>

          <div className="space-y-2 text-[#f8b3c3]/90 font-serif text-lg sm:text-xl italic leading-relaxed whitespace-pre-line pt-2">
            <p>{finalLine1}</p>
            <p>{finalLine2}</p>
            <p className="text-white font-medium pt-2">{finalLine3}</p>
            <p className="pt-2">{finalLine4}</p>
          </div>
        </div>
      </div>

      <footer className="pt-12 text-center text-xs text-[#f8b3c3]/60 font-serif italic z-10 border-t border-[#f8b3c3]/10 w-full max-w-md">
        {finalCoda}
      </footer>
    </section>
  );
}
