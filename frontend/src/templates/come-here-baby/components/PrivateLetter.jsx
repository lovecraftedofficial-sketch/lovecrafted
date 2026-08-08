import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Heart } from "lucide-react";

export default function PrivateLetter({ content = {} }) {
  const letterTitle = content.letterTitle || "A Letter From Me To You";
  const letterGreeting = content.letterGreeting || "Okay baby... this one is just for you. ❤️";
  const letterBody = content.letterBody || `Hey my baby,\n\nI know I can't take every uncomfortable day away from you.\n\nI can't magically make the tiredness disappear.\nI can't always fix the things that hurt.\n\nBut I can promise you one thing.\n\nYou never have to go through those moments feeling like you have to handle everything alone.\n\nOn the days you're happy, I'll celebrate with you.\nOn the days you're angry, I'll give you space and still love you.\nOn the days you're crying, I'll stay.\n\nAnd on the days when you don't even know what you need...\nI'll still be here asking,\n'Baby, what can I do for you?'\n\nI made this little place because sometimes I wish I could wrap you in a blanket, give you your favorite snack, hold your hand, kiss your forehead, and tell you that everything will be okay.\n\nUntil I can do that in person, come here whenever you need me.\n\nI love you.`;
  const letterSignature = content.letterSignature || `Always yours, ${content.senderName || "Rahul"} ❤️`;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="letter" className="relative min-h-screen bg-[#1c080e] text-[#f8b3c3] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-3xl w-full text-center space-y-8 z-10 py-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3d0a18] border border-[#f8b3c3]/20 text-xs tracking-widest text-[#f8b3c3]">
            <Mail size={13} className="text-[#f8b3c3]" />
            <span>Private Love Letter</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium">
            {letterTitle}
          </h2>
          <p className="text-sm font-serif italic text-[#f8b3c3]/80">
            {letterGreeting}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {!isOpen ? (
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setIsOpen(true)}
              className="p-10 sm:p-14 rounded-[2.5rem] bg-[#2a0c15] border border-[#f8b3c3]/30 shadow-2xl space-y-5 cursor-pointer text-center flex flex-col items-center justify-center border-dashed"
            >
              <div className="w-16 h-16 rounded-full bg-[#3d0a18] flex items-center justify-center shadow-lg">
                <Heart size={28} className="fill-[#f8b3c3] text-[#f8b3c3]" />
              </div>
              <div>
                <h3 className="text-2xl font-serif text-white font-medium">
                  {letterTitle}
                </h3>
                <p className="text-xs text-[#f8b3c3]/60 font-light mt-1">
                  Tap to unseal and read your letter
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="p-8 sm:p-12 rounded-[2.5rem] bg-[#2a0c15] border border-[#f8b3c3]/40 shadow-2xl text-left space-y-6 relative"
            >
              <p className="text-[#f8b3c3]/80 font-serif italic text-sm border-b border-[#f8b3c3]/15 pb-4">
                {letterGreeting}
              </p>

              <div className="space-y-4 text-base sm:text-lg font-serif text-white leading-relaxed whitespace-pre-line font-light">
                {letterBody}
              </div>

              <div className="pt-6 border-t border-[#f8b3c3]/15 text-right font-serif italic text-white text-lg">
                {letterSignature}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
