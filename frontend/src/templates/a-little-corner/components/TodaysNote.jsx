import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Heart, Quote } from "lucide-react";

export default function TodaysNote({ content = {} }) {
  const partnerName = content.partnerName || "My Love";
  const noteSectionTitle = content.noteSectionTitle || "Today's Little Note";
  const noteSectionSubtitle = content.noteSectionSubtitle || "A random whisper of love picked just for this moment.";
  const noteSignature = content.noteSignature || `Forever yours, ${content.senderName || "Rahul"} ❤️`;

  // 50+ Comfort & Love Notes Collection
  const defaultNotes = [
    `You don't have to carry the whole world today, ${partnerName}. Just take one soft step at a time.`,
    `My absolute favorite place in the universe is anywhere right beside you.`,
    `Whenever you start doubting yourself, remember that I believe in you with my whole heart.`,
    `In case nobody told you today: You are doing so much better than you think.`,
    `You are the warmest, quietest kind of magic in my life.`,
    `I love the sound of your laugh more than my favorite song.`,
    `Even on your quiet days, you are deeply cherished.`,
    `Thank you for being my safe place, ${partnerName}.`,
    `If today feels heavy, just leave a little piece of it for me to carry with you.`,
    `You make the world a much softer, kinder place just by being in it.`,
    `I am so proud of how hard you try, even when things are difficult.`,
    `My love for you doesn't depend on how productive or perfect you are. It just is.`,
    `Take a deep breath right now. Unclench your jaw. Relax your shoulders. I'm here.`,
    `I would choose you over and over again in every single lifetime.`,
    `You are my favorite notification, my favorite thought, and my favorite person.`,
    `Nothing about you is ever 'too much' or 'too little' for me.`,
    `I hope your coffee is warm, your day is gentle, and your heart is at peace today.`,
    `No matter how far apart we are, my thoughts are always sitting right next to you.`,
    `You have the gentlest soul, ${partnerName}. Never let the world harden it.`,
    `Whenever you need a hug, just close your eyes for a second. I am holding you.`,
    `You make even the most mundane Tuesdays feel like a cozy adventure.`,
    `I love the way your eyes light up when you talk about things you care about.`,
    `You are the first thing I want to tell good news to, and the only one I want near when things go wrong.`,
    `Resting is not a reward—it is a necessity. Please take care of yourself today.`,
    `Your happiness is my absolute favorite thing to protect.`,
    `Whatever is worrying you right now, we will handle it together.`,
    `You are worthy of the same kindness you give so freely to everyone else.`,
    `I love you not just for who you are, but for how peaceful I feel when I am with you.`,
    `Even on days when you feel invisible, you are the center of my world.`,
    `Just a gentle reminder: You are loved beyond measure.`,
    `You don't need to fix everything today. Just being here is enough.`,
    `My heart feels completely at home whenever I am near you.`,
    `I promise to always be the person you can run to without hesitation.`,
    `Your smile is my absolute favorite view in the world.`,
    `You bring so much light into places you don't even realize.`,
    `Thank you for existing, ${partnerName}.`,
    `I hope something small brings a big smile to your face today.`,
    `You are my favorite quiet thought in the middle of a busy day.`,
    `No distance or busy schedule can ever change how deeply I care for you.`,
    `You are allowed to take up space, speak your mind, and just be yourself.`,
    `Every moment spent with you is saved in my favorite memory folder.`,
    `You are my favorite cozy blanket on a cold rainy day.`,
    `I love your heart, your mind, your kindness, and everything about you.`,
    `You don't have to be strong all the time. It is okay to just be.`,
    `I'm always cheering for you, even when you can't hear me.`,
    `You make me want to be a gentler, better person every single day.`,
    `Whatever today holds, remember that you are never alone in it.`,
    `I love you today more than yesterday, and less than tomorrow.`,
    `You are my safe haven, ${partnerName}. Always.`,
    `Sending you the softest, warmest hug right through this screen.`
  ];

  // Custom user notes from content state or default set
  const loveNotes = [
    content.loveNote1,
    content.loveNote2,
    content.loveNote3,
    content.noteText,
    ...defaultNotes
  ].filter(Boolean);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextNote = () => {
    setCurrentIndex((prev) => (prev + 1) % loveNotes.length);
  };

  return (
    <section id="note" className="relative min-h-screen bg-[#16080c] text-[#f7c5d1] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-3xl w-full text-center space-y-8 z-10 py-12">
        {/* Header */}
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium">
            {noteSectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#f7c5d1]/70 max-w-lg mx-auto font-light">
            {noteSectionSubtitle}
          </p>
        </div>

        {/* Paper Quote Card */}
        <div className="relative p-8 sm:p-12 rounded-[2.5rem] bg-[#2a0913] border border-[#f7c5d1]/20 shadow-2xl text-left space-y-6">
          <Quote size={32} className="text-[#f7c5d1]/30" />

          <div className="min-h-[120px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-xl sm:text-2xl font-serif text-white leading-relaxed font-light"
              >
                “{loveNotes[currentIndex]}”
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="pt-4 border-t border-[#f7c5d1]/10 flex flex-wrap items-center justify-between gap-4">
            <span className="text-sm font-serif italic text-[#f7c5d1]/80">
              {noteSignature}
            </span>
            <span className="text-xs text-[#f7c5d1]/40 font-mono">
              Note #{currentIndex + 1} of {loveNotes.length}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={handleNextNote}
            className="px-8 py-3.5 rounded-full bg-[#4a0e20] hover:bg-[#5a1228] text-white text-sm font-medium border border-[#f7c5d1]/30 shadow-lg transition-all flex items-center gap-2 mx-auto cursor-pointer"
          >
            <RefreshCw size={15} />
            <span>Show Another Note</span>
          </button>
        </div>
      </div>
    </section>
  );
}
