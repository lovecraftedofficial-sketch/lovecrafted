import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Heart } from "lucide-react";

export default function PrivateLetter({ content = {} }) {
  const letterSectionTitle = content.letterSectionTitle || "A Letter Saved For You";
  const letterHeading = content.letterHeading || `My Dearest ${content.partnerName || "Ananya"},`;
  const letterBody = content.letterBody || `I built this quiet corner of the world because you deserve a place that is gentle to you.\n\nLife gets busy and loud, but in here, time slows down. I hope every word, note, and song in this little corner reminds you how deeply, effortlessly, and unconditionally you are loved.\n\nWhenever you need a hug, come back here.`;
  const letterSignature = content.letterSignature || `Yours Always & Forever, ${content.senderName || "Rahul"} ❤️`;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <section id="letter" className="relative min-h-screen bg-[#16080c] text-[#f7c5d1] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-3xl w-full text-center space-y-8 z-10 py-12">
        {/* Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2a0913] border border-[#f7c5d1]/20 text-xs tracking-widest text-[#f7c5d1]/80 uppercase">
            <Mail size={13} className="text-[#f7c5d1]" />
            <span>Private Love Letter</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium">
            {letterSectionTitle}
          </h2>
        </div>

        {/* Envelope / Letter Interactive Card */}
        <div className="max-w-2xl mx-auto">
          {!isOpen ? (
            /* Sealed Envelope */
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setIsOpen(true)}
              className="p-10 sm:p-14 rounded-[2.5rem] bg-[#2a0913] border border-[#f7c5d1]/30 shadow-2xl space-y-6 cursor-pointer text-center flex flex-col items-center justify-center border-dashed"
            >
              <div className="w-16 h-16 rounded-full bg-[#4a0e20] flex items-center justify-center shadow-lg">
                <Heart size={28} className="fill-[#f7c5d1] text-[#f7c5d1]" />
              </div>
              <div>
                <h3 className="text-2xl font-serif text-white font-medium">
                  {letterHeading}
                </h3>
                <p className="text-xs text-[#f7c5d1]/60 font-light mt-1">
                  Tap to unseal and read your letter
                </p>
              </div>
            </motion.div>
          ) : (
            /* Unfolded Parchment Paper Letter */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="p-8 sm:p-12 rounded-[2.5rem] bg-[#2a0913] border border-[#f7c5d1]/40 shadow-2xl text-left space-y-6 relative"
            >
              <h3 className="text-2xl font-serif text-white font-medium">
                {letterHeading}
              </h3>

              <div className="space-y-4 text-base sm:text-lg font-serif text-[#f7c5d1] leading-relaxed whitespace-pre-line font-light">
                {letterBody}
              </div>

              <div className="pt-6 border-t border-[#f7c5d1]/15 text-right font-serif italic text-white text-lg">
                {letterSignature}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
