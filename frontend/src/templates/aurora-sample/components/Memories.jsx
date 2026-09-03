import React from "react";
import { motion } from "framer-motion";
import { resolveImage } from "@/editor/utils/imageUtils";

function formatDate(d) {
    if (!d) return "";
    try {
        return new Date(d).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return "";
    }
}

export default function Memories({ content }) {
    const memories = Array.isArray(content?.memories) ? content.memories : [];
    if (memories.length === 0) return null;
    return (
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
            <header className="mb-10 md:mb-14">
                <div className="lws-pill mb-4">Memories</div>
                <h2 className="font-display text-4xl md:text-5xl">
                    <span className="lws-gradient-text">Moments we keep</span>
                </h2>
            </header>
            <div className="grid md:grid-cols-3 gap-5 md:gap-7">
                {memories.map((m, i) => {
                    const src = resolveImage(m?.image);
                    return (
                        <motion.figure
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.6, delay: i * 0.06 }}
                            className="lws-card overflow-hidden"
                        >
                            <div className="aspect-[4/5] bg-[color:var(--lws-surface-2)]">
                                {src ? (
                                    <img
                                        src={src}
                                        alt={m?.caption || ""}
                                        className="w-full h-full object-cover"
                                        draggable={false}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[color:var(--lws-text-dim)] font-italic-display">
                                        no image yet
                                    </div>
                                )}
                            </div>
                            <figcaption className="p-4">
                                <p className="font-italic-display text-lg text-[color:var(--lws-cream)] leading-snug">
                                    {m?.caption || "…"}
                                </p>
                                {m?.date && (
                                    <span className="text-xs uppercase tracking-widest text-[color:var(--lws-text-dim)] mt-2 inline-block">
                                        {formatDate(m.date)}
                                    </span>
                                )}
                            </figcaption>
                        </motion.figure>
                    );
                })}
            </div>
        </section>
    );
}
