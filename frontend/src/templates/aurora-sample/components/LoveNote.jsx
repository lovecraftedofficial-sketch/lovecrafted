import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export default function LoveNote({ content }) {
    const { loveNote } = content || {};
    if (!loveNote) return null;
    return (
        <section className="max-w-4xl mx-auto px-6 py-16 md:py-24">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7 }}
                className="lws-card p-8 md:p-12 relative"
            >
                <Quote
                    size={40}
                    className="absolute -top-5 left-8 text-[color:var(--lws-pink)] opacity-70"
                />
                <p className="font-italic-display text-2xl md:text-3xl leading-relaxed text-[color:var(--lws-cream)]">
                    {loveNote}
                </p>
            </motion.div>
        </section>
    );
}
