import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function Reasons({ content }) {
    const reasons = Array.isArray(content?.reasons) ? content.reasons : [];
    if (reasons.length === 0) return null;
    return (
        <section className="max-w-5xl mx-auto px-6 py-16 md:py-24">
            <header className="mb-10 md:mb-14 text-center">
                <div className="lws-pill mb-4">Reasons</div>
                <h2 className="font-display text-4xl md:text-5xl">
                    <span className="lws-gradient-text">
                        {reasons.length} reasons I love you
                    </span>
                </h2>
            </header>
            <ul className="grid md:grid-cols-2 gap-3 md:gap-4">
                {reasons.map((r, i) => (
                    <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
                        className="lws-card px-5 py-4 flex items-start gap-3"
                    >
                        <span className="mt-1 text-[color:var(--lws-pink)]">
                            <Heart size={14} />
                        </span>
                        <span className="text-[color:var(--lws-cream)] leading-relaxed">
                            {r}
                        </span>
                    </motion.li>
                ))}
            </ul>
        </section>
    );
}
