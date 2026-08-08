import React from "react";
import { Heart } from "lucide-react";

export default function WhenCrying({ content = {} }) {
  const cryingSectionTitle = content.cryingSectionTitle || "If You're Crying Right Now...";
  const cryingHeading = content.cryingHeading || "Don't hide it from me.";
  const cryingText1 = content.cryingText1 || "Take a deep breath, bub.";
  const cryingText2 = content.cryingText2 || "You don't have to stop or apologize for tears.";
  const cryingText3 = content.cryingText3 || "You're still beautiful with tears in your eyes.";
  const cryingText4 = content.cryingText4 || "And you're still my baby.";
  const cryingCoda = content.cryingCoda || "Come back here whenever you need a safe place.";

  return (
    <section id="crying" className="relative min-h-[80vh] bg-[#1c080e] text-[#f8b3c3] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-2xl w-full text-center space-y-8 z-10 py-12">
        <div className="w-12 h-12 rounded-full bg-[#3d0a18] flex items-center justify-center mx-auto shadow-lg">
          <Heart size={20} className="fill-[#f8b3c3] text-[#f8b3c3]" />
        </div>

        <div className="space-y-3">
          <span className="text-xs uppercase tracking-widest font-mono text-[#f8b3c3]/60">
            {cryingSectionTitle}
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium">
            {cryingHeading}
          </h2>
        </div>

        <div className="p-8 sm:p-10 rounded-[2.5rem] bg-[#2a0c15] border border-[#f8b3c3]/20 shadow-2xl space-y-4 text-center">
          <p className="text-lg sm:text-xl font-serif text-white italic">{cryingText1}</p>
          <p className="text-base sm:text-lg font-serif text-[#f8b3c3]/90">{cryingText2}</p>
          <p className="text-base sm:text-lg font-serif text-[#f8b3c3]/90">{cryingText3}</p>
          <p className="text-xl sm:text-2xl font-serif text-white font-medium italic pt-2">{cryingText4}</p>
        </div>

        <p className="text-xs font-serif italic text-[#f8b3c3]/60">
          ♡ {cryingCoda} ♡
        </p>
      </div>
    </section>
  );
}
