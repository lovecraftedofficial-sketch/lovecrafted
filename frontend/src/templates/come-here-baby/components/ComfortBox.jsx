import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, AlertCircle } from "lucide-react";

export default function ComfortBox({ content = {} }) {
  const boxSectionTitle = content.boxSectionTitle || "Your Little Virtual Comfort Box";
  const boxSectionSubtitle = content.boxSectionSubtitle || "Tap any gift below to send an instant WhatsApp request to my phone.";

  const [toastError, setToastError] = useState(null);

  const gifts = [
    {
      icon: "🍫",
      label: "Chocolate",
      reqText: content.boxChocolateReq || "Baby, mujhe chocolate chahiye 🥺🍫 Please pamper me a little.",
    },
    {
      icon: "🧸",
      label: "Cuddle",
      reqText: content.boxCuddleReq || "I need my cuddle right now 🥺🧸 Come here and hold me.",
    },
    {
      icon: "💋",
      label: "Kiss",
      reqText: content.boxKissReq || "I need a kiss from you 🥺💋 Please come here.",
    },
    {
      icon: "😂",
      label: "Bad Joke",
      reqText: content.boxJokeReq || "I'm having a bad day 😭😂 Make me laugh with your worst joke.",
    },
    {
      icon: "💌",
      label: "Love Note",
      reqText: content.boxNoteReq || "I need a little love note from you 🥺💌 Tell me something sweet.",
    },
    {
      icon: "🫂",
      label: "Big Hug",
      reqText: content.boxHugReq || "I need a really big hug right now 🥺🫂 Don't let go.",
    },
  ];

  const handleGiftClick = (gift) => {
    const rawPhone = content.whatsappPhoneNumber || content.partnerWhatsAppNumber || content.phoneNumber;
    const cleanPhone = rawPhone ? String(rawPhone).replace(/\D/g, "") : "";

    if (!cleanPhone || cleanPhone.length < 7) {
      setToastError("Add your WhatsApp number in customization settings first.");
      setTimeout(() => setToastError(null), 4000);
      return;
    }

    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(gift.reqText)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="comfortbox" className="relative min-h-screen bg-[#1c080e] text-[#f8b3c3] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-4xl w-full text-center space-y-8 z-10 py-12">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3d0a18] border border-[#f8b3c3]/20 text-xs tracking-widest text-[#f8b3c3]">
            <Gift size={13} className="text-[#f8b3c3]" />
            <span>Virtual Care Package</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium">
            {boxSectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#f8b3c3]/70 max-w-lg mx-auto font-light">
            {boxSectionSubtitle}
          </p>
        </div>

        {/* Missing Phone Number Toast Error Banner */}
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

        {/* Gift Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
          {gifts.map((g, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGiftClick(g)}
              className="p-6 rounded-3xl bg-[#2a0c15] border border-[#f8b3c3]/20 hover:border-[#f8b3c3]/40 shadow-xl space-y-2 text-center cursor-pointer transition-all"
            >
              <div className="text-4xl">{g.icon}</div>
              <p className="text-sm font-serif text-white font-medium">{g.label}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
