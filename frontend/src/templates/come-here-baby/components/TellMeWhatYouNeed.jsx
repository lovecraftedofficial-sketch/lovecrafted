import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, AlertCircle } from "lucide-react";

export default function TellMeWhatYouNeed({ content = {} }) {
  const needsTitle = content.needsTitle || "Baby, What Do You Need? 🥺";
  const needsSubtitle = content.needsSubtitle || "Pick whatever would make you feel a little better. ❤️";

  const [toastError, setToastError] = useState(null);

  const options = [
    content.option1 || "🫂 Ek Hug?",
    content.option2 || "🍫 Chocolate Laaun?",
    content.option3 || "🥺 Thodi Pampering?",
    content.option4 || "💕 Extra Pyaar?",
    content.option5 || "🧸 Thoda Laad?",
    content.option6 || "📞 Thodi Der Baat Karein?",
    content.option7 || "🌷 Mood Theek Karein?",
    content.option8 || "🫶 Thoda Sa Saath?",
    content.option9 || "☕ Kuch Warm Laaun?",
    content.option10 || "💌 Ek Pyaara Sa Note?",
  ];

  const handleCardClick = (optionText) => {
    const rawPhone = content.whatsappPhoneNumber || content.partnerWhatsAppNumber || content.phoneNumber;
    const cleanPhone = rawPhone ? String(rawPhone).replace(/\D/g, "") : "";

    if (!cleanPhone || cleanPhone.length < 7) {
      setToastError("Add the WhatsApp number in your customization settings first. ❤️");
      setTimeout(() => setToastError(null), 4000);
      return;
    }

    // Open WhatsApp with ONLY the short selected card text pre-filled
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(optionText)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="needs" className="relative min-h-screen bg-[#1c080e] text-[#f8b3c3] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-4xl w-full text-center space-y-8 z-10 py-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3d0a18] border border-[#f8b3c3]/20 text-xs tracking-widest text-[#f8b3c3]">
            <Heart size={12} className="fill-[#f8b3c3]" />
            <span>Gentle Comfort Options</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium">
            {needsTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#f8b3c3]/70 max-w-lg mx-auto font-light">
            {needsSubtitle}
          </p>
        </div>

        {/* Missing Phone Number Toast Banner */}
        <AnimatePresence>
          {toastError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto p-4 rounded-2xl bg-[#3d0a18] border border-[#f8b3c3]/50 text-white text-xs font-serif flex items-center justify-center gap-2 shadow-xl"
            >
              <AlertCircle size={16} className="text-[#f8b3c3] shrink-0" />
              <span>{toastError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 10 Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 pt-2">
          {options.map((optText, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleCardClick(optText)}
              className="p-5 sm:p-6 rounded-3xl bg-[#2a0c15] border border-[#f8b3c3]/20 hover:border-[#f8b3c3]/40 shadow-xl flex items-center justify-center text-center cursor-pointer transition-all min-h-[110px]"
            >
              <p className="text-base sm:text-lg font-serif text-white font-medium leading-snug">
                {optText}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
