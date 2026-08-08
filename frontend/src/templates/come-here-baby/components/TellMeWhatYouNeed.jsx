import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, AlertCircle } from "lucide-react";

export default function TellMeWhatYouNeed({ content = {} }) {
  const needsTitle = content.needsTitle || "Tell Me What You Need";
  const needsSubtitle = content.needsSubtitle || "You don't even have to explain. Just pick one. ❤️";

  const [toastError, setToastError] = useState(null);

  const cards = [
    { icon: "🫂", label: "I Need a Hug", req: content.reqHug || "Baby, I need my hug now 🥺🫂" },
    { icon: "🍫", label: "I Want Chocolate", req: content.reqChocolate || "Baby, emergency chocolate request please 🍫🥺❤️" },
    { icon: "💗", label: "I Need Some Love", req: content.reqLove || "I need some extra love today 🥺❤️" },
    { icon: "😂", label: "Make Me Laugh", req: content.reqLaugh || "Baby, make me laugh. I'm having a difficult day 😭😂" },
    { icon: "💌", label: "Send Me Something Sweet", req: content.reqSweet || "Can you send me something sweet? I need a little reminder that I'm loved. 💌❤️" },
    { icon: "🥺", label: "I Need You", req: content.reqNeedYou || "I just need you right now. 🥺❤️" },
  ];

  const handleCardClick = (card) => {
    const rawPhone = content.whatsappPhoneNumber || content.partnerWhatsAppNumber || content.phoneNumber;
    const cleanPhone = rawPhone ? String(rawPhone).replace(/\D/g, "") : "";

    if (!cleanPhone || cleanPhone.length < 7) {
      setToastError("Add the WhatsApp number in your customization settings first. ❤️");
      setTimeout(() => setToastError(null), 4000);
      return;
    }

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(card.req)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="needs" className="relative min-h-screen bg-[#1c080e] text-[#f8b3c3] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-4xl w-full text-center space-y-8 z-10 py-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3d0a18] border border-[#f8b3c3]/20 text-xs tracking-widest text-[#f8b3c3]">
            <Heart size={12} className="fill-[#f8b3c3]" />
            <span>Instant Comfort Request</span>
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

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
          {cards.map((c, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleCardClick(c)}
              className="p-6 rounded-3xl bg-[#2a0c15] border border-[#f8b3c3]/20 hover:border-[#f8b3c3]/40 shadow-xl space-y-2 text-center cursor-pointer transition-all"
            >
              <div className="text-4xl">{c.icon}</div>
              <p className="text-sm font-serif text-white font-medium">{c.label}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
