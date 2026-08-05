import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Volume2, Gift } from "lucide-react";

export default function UnboxingIntro({ content = {}, config = {}, children }) {
    // Check if intro is skipped by content or config
    const shouldSkip = Boolean(content.skipIntro || config.skipIntro);

    const [isOpened, setIsOpened] = useState(shouldSkip);

    const partnerName = content.partnerName || content.recipientName || "My Dearest";
    const greetingTitle = content.introGreeting || `A Special Keepsake For ${partnerName}`;
    const introMessage =
        content.introMessage ||
        "Someone who loves you deeply created this personalized website just for you. Take a quiet breath, turn up your volume, and open your surprise.";

    const handleOpenSurprise = () => {
        setIsOpened(true);

        // Attempt background audio autoplay on user interaction if track exists
        if (content.bgMusicUrl) {
            try {
                const audio = new Audio(content.bgMusicUrl);
                audio.loop = true;
                audio.play().catch(() => {
                    /* Audio autoplay block fallback */
                });
            } catch {
                /* ignore */
            }
        }
    };

    if (isOpened) {
        return <div className="animate-fadeIn">{children}</div>;
    }

    return (
        <div className="fixed inset-0 z-50 bg-[#0a0408] text-white flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* Background Floating Ambient Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0, scale: 0.94, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative max-w-md w-full text-center space-y-6 z-10"
                >
                    {/* Glowing Envelope & Gift Icon Badge */}
                    <div className="relative inline-block">
                        <div className="absolute -inset-2 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full blur-md opacity-60 animate-pulse" />
                        <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-rose-950 via-neutral-900 to-purple-950 border border-rose-500/40 text-rose-300 flex items-center justify-center mx-auto shadow-2xl">
                            <Gift size={36} className="animate-bounce" />
                        </div>
                    </div>

                    {/* Intro Title & Tagline */}
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                            <Sparkles size={12} /> You Received a Keepsake
                        </div>
                        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
                            <span className="lws-gradient-text">{greetingTitle}</span>
                        </h1>
                    </div>

                    {/* Warm Emotional Message Box */}
                    <div className="p-5 rounded-2xl bg-neutral-900/80 border border-white/10 backdrop-blur-md shadow-xl">
                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic">
                            "{introMessage}"
                        </p>
                    </div>

                    {/* Audio Recommendation Pill */}
                    {content.bgMusicUrl && (
                        <div className="inline-flex items-center gap-2 text-[11px] text-rose-300/80 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                            <Volume2 size={13} className="animate-pulse text-rose-400" />
                            <span>Audio track attached · Turn your sound on 🔊</span>
                        </div>
                    )}

                    {/* Primary Unboxing Action Button */}
                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={handleOpenSurprise}
                            className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-semibold text-sm sm:text-base shadow-xl shadow-rose-500/25 border border-rose-400/40 transition-all duration-300 hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                        >
                            <Heart size={18} className="fill-white text-white animate-pulse" />
                            <span>Open My Surprise</span>
                        </button>
                    </div>

                    {/* Footer Subtle Note */}
                    <p className="text-[11px] text-neutral-500">
                        Crafted with love · LoveCrafted Keepsakes
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
