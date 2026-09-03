import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MailOpen, Mail } from "lucide-react";

export default function OpenWhen({ content }) {
    const items = Array.isArray(content?.openWhenMessages)
        ? content.openWhenMessages
        : [];
    const [openIdx, setOpenIdx] = useState(null);
    if (items.length === 0) return null;
    return (
        <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
            <header className="mb-10 md:mb-14">
                <div className="lws-pill mb-4">Envelopes</div>
                <h2 className="font-display text-4xl md:text-5xl">
                    <span className="lws-gradient-text">Open when…</span>
                </h2>
            </header>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((it, i) => {
                    const open = openIdx === i;
                    return (
                        <motion.button
                            key={i}
                            type="button"
                            onClick={() => setOpenIdx(open ? null : i)}
                            layout
                            className="lws-card text-left p-6 relative overflow-hidden"
                            whileHover={{ y: -2 }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <span
                                    className="w-9 h-9 rounded-full flex items-center justify-center"
                                    style={{
                                        background:
                                            "linear-gradient(120deg, #f8b5c4, #d4a574)",
                                        color: "#2a0714",
                                    }}
                                >
                                    {open ? (
                                        <MailOpen size={16} />
                                    ) : (
                                        <Mail size={16} />
                                    )}
                                </span>
                                <span className="font-display text-xl">
                                    {it?.title || "Open when…"}
                                </span>
                            </div>
                            <AnimatePresence initial={false}>
                                {open && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.35 }}
                                        className="text-[color:var(--lws-text-muted)] leading-relaxed overflow-hidden font-italic-display"
                                    >
                                        {it?.message}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                            {!open && (
                                <span className="text-xs uppercase tracking-widest text-[color:var(--lws-text-dim)]">
                                    tap to open
                                </span>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </section>
    );
}
