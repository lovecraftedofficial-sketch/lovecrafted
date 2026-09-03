import React from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { resolveImage } from "@/editor/utils/imageUtils";

const themeToken = {
    blush: "#f8b5c4",
    gold: "#d4a574",
    burgundy: "#6a1730",
};

export default function Hero({ content }) {
    const {
        partnerName = "",
        creatorName = "",
        heroMessage = "",
        heroImage,
        accentTheme = "blush",
        relationshipDate,
    } = content || {};

    const accent = themeToken[accentTheme] || themeToken.blush;
    const imgSrc = resolveImage(heroImage);

    const days = relationshipDate
        ? Math.max(
              0,
              Math.floor(
                  (Date.now() - new Date(relationshipDate).getTime()) /
                      (1000 * 60 * 60 * 24),
              ),
          )
        : null;

    return (
        <section className="relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 6 }).map((_, i) => (
                    <span
                        key={i}
                        className="floating-heart"
                        style={{
                            left: `${(i * 17 + 8) % 100}%`,
                            animationDelay: `${i * 2.6}s`,
                            fontSize: `${18 + (i % 3) * 6}px`,
                            color: accent,
                        }}
                    >
                        ❤
                    </span>
                ))}
            </div>

            <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-28 grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="lws-pill mb-6" style={{ borderColor: `${accent}55`, background: `${accent}0f`, color: accent }}>
                        <Sparkles size={12} /> A love letter, made a website
                    </div>
                    <h1 className="font-display text-5xl md:text-7xl leading-[0.95] mb-6">
                        <span className="lws-gradient-text">For {partnerName || "you"}</span>
                        <br />
                        <span className="font-italic-display text-[color:var(--lws-cream)] opacity-90 text-4xl md:text-5xl">
                            with all of me.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-[color:var(--lws-text-muted)] max-w-xl leading-relaxed">
                        {heroMessage}
                    </p>
                    <div className="mt-8 flex items-center gap-4 text-sm text-[color:var(--lws-text-muted)]">
                        <span className="inline-flex items-center gap-2">
                            <Heart size={14} style={{ color: accent }} />
                            From {creatorName || "someone"}
                        </span>
                        {days !== null && (
                            <span className="inline-flex items-center gap-2">
                                • {days.toLocaleString()} days & counting
                            </span>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.1, delay: 0.15 }}
                    className="relative"
                >
                    <div
                        className="aspect-[4/5] w-full rounded-[2rem] overflow-hidden lws-glass"
                        style={{
                            boxShadow: `0 40px 120px -30px ${accent}55, 0 0 0 1px ${accent}22 inset`,
                        }}
                    >
                        {imgSrc ? (
                            <img
                                src={imgSrc}
                                alt=""
                                className="w-full h-full object-cover"
                                draggable={false}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[color:var(--lws-text-dim)] font-italic-display text-2xl">
                                Add a photo of the two of you
                            </div>
                        )}
                    </div>
                    <div
                        className="absolute -bottom-6 -left-6 lws-glass rounded-2xl px-5 py-3 font-italic-display text-lg"
                        style={{ color: accent }}
                    >
                        “always & always”
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
