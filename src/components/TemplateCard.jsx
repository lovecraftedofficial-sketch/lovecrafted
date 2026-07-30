import React from "react";
import { Link } from "react-router-dom";
import { Lock, ArrowUpRight } from "lucide-react";
import { MARKETPLACE } from "@/constants/testIds";

function formatPrice(n, currency = "INR") {
    if (currency === "INR") return `₹${n.toLocaleString("en-IN")}`;
    return `${currency} ${n.toLocaleString()}`;
}

const tierAccent = {
    Basic: "#a08a95",
    Premium: "#f8b5c4",
    Luxury: "#d4a574",
};

export default function TemplateCard({ entry }) {
    const { config, comingSoon } = entry;
    const accent = tierAccent[config.tier] || "#f8b5c4";
    return (
        <article
            data-testid={MARKETPLACE.card(config.slug)}
            className="lws-card overflow-hidden group flex flex-col"
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-[color:var(--lws-surface-2)]">
                {config.coverImage ? (
                    <img
                        src={config.coverImage}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--lws-bg)] via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                    <span
                        className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full"
                        style={{
                            background: "rgba(10,5,7,0.7)",
                            color: accent,
                            border: `1px solid ${accent}55`,
                        }}
                    >
                        {config.tier}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/50 border border-[color:var(--lws-border-strong)] text-[color:var(--lws-text-muted)]">
                        {config.category}
                    </span>
                </div>
                {comingSoon && (
                    <div className="absolute top-3 right-3 lws-pill" style={{ borderColor: "#d4a57455", color: "#d4a574", background: "rgba(212,165,116,0.08)" }}>
                        <Lock size={11} /> Coming Soon
                    </div>
                )}
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-display text-2xl mb-2 flex items-center justify-between gap-3">
                    <span className="lws-gradient-text">{config.name}</span>
                    <span className="text-base font-body text-[color:var(--lws-cream)]">
                        {formatPrice(config.price, config.currency)}
                    </span>
                </h3>
                <p className="text-sm text-[color:var(--lws-text-muted)] leading-relaxed line-clamp-3 mb-4">
                    {config.description}
                </p>
                {Array.isArray(config.features) && config.features.length > 0 && (
                    <ul className="flex flex-wrap gap-1.5 mb-5">
                        {config.features.slice(0, 4).map((f) => (
                            <li
                                key={f}
                                className="text-[11px] px-2 py-1 rounded-full border border-[color:var(--lws-border-strong)] text-[color:var(--lws-text-muted)]"
                            >
                                {f}
                            </li>
                        ))}
                    </ul>
                )}
                <div className="mt-auto flex items-center gap-3">
                    <Link
                        to={`/templates/${config.slug}`}
                        data-testid={MARKETPLACE.cardPreviewBtn(config.slug)}
                        className="lws-btn-ghost text-sm flex-1 justify-center"
                    >
                        Preview
                    </Link>
                    {!comingSoon ? (
                        <Link
                            to={`/dashboard/websites/${config.slug}/edit`}
                            data-testid={MARKETPLACE.cardCreateBtn(config.slug)}
                            className="lws-btn-primary text-sm flex-1 justify-center"
                        >
                            Create Yours <ArrowUpRight size={14} />
                        </Link>
                    ) : (
                        <button
                            type="button"
                            disabled
                            data-testid={MARKETPLACE.cardCreateBtn(config.slug)}
                            className="lws-btn-ghost text-sm flex-1 justify-center opacity-50 cursor-not-allowed"
                        >
                            Locked
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}

export { formatPrice };
