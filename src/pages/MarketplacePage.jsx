import React, { useMemo, useState } from "react";
import { MARKETPLACE } from "@/constants/testIds";
import { listTemplates } from "@/data/templateRegistry";
import TemplateCard from "@/components/TemplateCard";
import { Filter } from "lucide-react";

export default function MarketplacePage() {
    const all = useMemo(() => listTemplates(), []);
    const categories = useMemo(
        () => ["All", ...Array.from(new Set(all.map((t) => t.config.category)))],
        [all],
    );
    const tiers = ["All", "Basic", "Premium", "Luxury"];
    const priceBuckets = [
        { id: "all", label: "Any price", min: 0, max: Infinity },
        { id: "u1000", label: "Under ₹1,000", min: 0, max: 999 },
        { id: "1000-2000", label: "₹1,000 – ₹2,000", min: 1000, max: 2000 },
        { id: "2000p", label: "₹2,000+", min: 2000, max: Infinity },
    ];

    const [category, setCategory] = useState("All");
    const [tier, setTier] = useState("All");
    const [price, setPrice] = useState("all");

    const filtered = all.filter((t) => {
        const c = t.config;
        if (category !== "All" && c.category !== category) return false;
        if (tier !== "All" && c.tier !== tier) return false;
        const bucket = priceBuckets.find((b) => b.id === price);
        if (bucket && (c.price < bucket.min || c.price > bucket.max)) return false;
        return true;
    });

    return (
        <div data-testid={MARKETPLACE.root} className="max-w-7xl mx-auto px-6 py-14 md:py-20">
            <div className="mb-10 md:mb-14">
                <div className="lws-pill mb-4">Marketplace</div>
                <h1 className="font-display text-5xl md:text-6xl">
                    <span className="lws-gradient-text">Every template, one place</span>
                </h1>
                <p className="text-[color:var(--lws-text-muted)] mt-3 max-w-2xl">
                    Handcrafted romantic websites. Each has its own personality, editable
                    fields and price. Browse, preview and choose.
                </p>
            </div>

            <div className="lws-card p-4 md:p-5 mb-8 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[color:var(--lws-text-muted)]">
                    <Filter size={12} /> Filters
                </span>

                <select
                    data-testid={MARKETPLACE.filterCategory}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-[color:var(--lws-surface-2)] border border-[color:var(--lws-border-strong)] rounded-full px-4 py-1.5 text-sm text-[color:var(--lws-cream)]"
                >
                    {categories.map((c) => (
                        <option key={c} value={c}>
                            {c === "All" ? "Category: All" : c}
                        </option>
                    ))}
                </select>

                <select
                    data-testid={MARKETPLACE.filterTier}
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    className="bg-[color:var(--lws-surface-2)] border border-[color:var(--lws-border-strong)] rounded-full px-4 py-1.5 text-sm text-[color:var(--lws-cream)]"
                >
                    {tiers.map((t) => (
                        <option key={t} value={t}>
                            {t === "All" ? "Tier: All" : t}
                        </option>
                    ))}
                </select>

                <select
                    data-testid={MARKETPLACE.filterPrice}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-[color:var(--lws-surface-2)] border border-[color:var(--lws-border-strong)] rounded-full px-4 py-1.5 text-sm text-[color:var(--lws-cream)]"
                >
                    {priceBuckets.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.label}
                        </option>
                    ))}
                </select>

                <span className="ml-auto text-xs text-[color:var(--lws-text-dim)]">
                    {filtered.length} template{filtered.length === 1 ? "" : "s"}
                </span>
            </div>

            {filtered.length > 0 ? (
                <div data-testid={MARKETPLACE.grid} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((t) => (
                        <TemplateCard key={t.config.slug} entry={t} />
                    ))}
                </div>
            ) : (
                <div data-testid={MARKETPLACE.emptyState} className="lws-card p-14 text-center">
                    <div className="font-display text-2xl mb-2 lws-gradient-text">
                        Nothing matches those filters yet
                    </div>
                    <p className="text-[color:var(--lws-text-muted)]">
                        Try a wider price range or different tier.
                    </p>
                </div>
            )}
        </div>
    );
}
