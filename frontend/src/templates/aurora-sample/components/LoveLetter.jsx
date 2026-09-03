import React from "react";
import { motion } from "framer-motion";

export default function LoveLetter({ content }) {
    const letter = (content?.loveLetter || "").trim();
    if (!letter) return null;
    const paragraphs = letter.split(/\n\s*\n/);
    return (
        <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
            <header className="mb-10 text-center">
                <div className="lws-pill mb-4">A letter</div>
                <h2 className="font-display text-4xl md:text-5xl">
                    <span className="lws-gradient-text">Just for you</span>
                </h2>
            </header>
            <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="lws-card p-8 md:p-12 space-y-5 font-italic-display text-lg md:text-xl leading-relaxed text-[color:var(--lws-cream)]"
            >
                {paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                ))}
                <div className="pt-6 text-right text-[color:var(--lws-pink)] font-display not-italic text-base tracking-widest uppercase">
                    — {content?.creatorName || "yours"}
                </div>
            </motion.article>
        </section>
    );
}
