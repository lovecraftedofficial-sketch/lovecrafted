import React, { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { MARKETPLACE } from "@/constants/testIds";
import { listMarketplaceTemplates } from "@/data/templateRegistry";
import { OCCASIONS, getOccasionCounts, getOccasionBySlug } from "@/constants/occasions";
import TemplateCard from "@/components/TemplateCard";
import { Filter, LayoutGrid, Sparkles, X, Clock, ArrowRight } from "lucide-react";

const TIERS = ["All", "Sweet & Personal", "Cinematic"];
const PRICE_BUCKETS = [
    { id: "all", label: "Any price", min: 0, max: Infinity },
    { id: "u100", label: "Under ₹100", min: 0, max: 100 },
    { id: "100-300", label: "₹100 – ₹300", min: 100, max: 300 },
    { id: "300p", label: "₹300+", min: 300, max: Infinity },
];

export default function MarketplacePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeOccasionSlug = searchParams.get("occasion") || "all";
    const tier = searchParams.get("tier") || "All";
    const price = searchParams.get("price") || "all";

    const all = useMemo(() => listMarketplaceTemplates(), []);

    // Compute dynamic template counts strictly for publicly visible marketplace templates
    const occasionCounts = useMemo(() => getOccasionCounts(all), [all]);

    // Derive active occasion chips dynamically ONLY for occasions that exist on at least 1 public template (count > 0)
    const activeOccasionsList = useMemo(() => {
        return OCCASIONS.filter((occ) => {
            const count = occasionCounts[occ.slug] || occasionCounts[occ.id] || 0;
            return count > 0 && occ.isActive !== false;
        });
    }, [occasionCounts]);

    const activeOccasionObj = useMemo(
        () => getOccasionBySlug(activeOccasionSlug),
        [activeOccasionSlug]
    );

    // Is the currently requested URL occasion inactive?
    const isInactiveOccasionUrl = activeOccasionObj && !activeOccasionObj.isActive;

    const handleOccasionChange = (slug) => {
        const newParams = new URLSearchParams(searchParams);
        if (slug === "all") {
            newParams.delete("occasion");
        } else {
            newParams.set("occasion", slug);
        }
        setSearchParams(newParams);
    };

    const handleTierChange = (newTier) => {
        const newParams = new URLSearchParams(searchParams);
        if (newTier === "All") {
            newParams.delete("tier");
        } else {
            newParams.set("tier", newTier);
        }
        setSearchParams(newParams);
    };

    const handlePriceChange = (newPrice) => {
        const newParams = new URLSearchParams(searchParams);
        if (newPrice === "all") {
            newParams.delete("price");
        } else {
            newParams.set("price", newPrice);
        }
        setSearchParams(newParams);
    };

    const handleResetAll = () => {
        setSearchParams({});
    };

    // Filter logic checking multi-occasion arrays
    const filtered = useMemo(() => {
        if (isInactiveOccasionUrl) return [];

        return all.filter((t) => {
            const c = t.config || {};
            const tOccasions = (c.occasions || []).map((o) => o.toLowerCase());
            const legacyCategory = (c.category || "").toLowerCase();

            // Occasion Filter
            if (activeOccasionSlug !== "all") {
                const target = activeOccasionSlug.toLowerCase();
                const matchesOccasion =
                    tOccasions.includes(target) ||
                    legacyCategory === target ||
                    (target === "anniversary" && legacyCategory === "romantic");

                if (!matchesOccasion) return false;
            }

            // Tier Filter
            if (tier !== "All" && c.tier !== tier) return false;

            // Price Bucket Filter
            const bucket = PRICE_BUCKETS.find((b) => b.id === price);
            if (bucket && (c.price < bucket.min || c.price > bucket.max)) return false;

            return true;
        });
    }, [all, activeOccasionSlug, tier, price, isInactiveOccasionUrl]);

    return (
        <div data-testid={MARKETPLACE.root} className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16 text-white">
            {/* Header Banner */}
            <div className="mb-8 md:mb-12">
                <div className="lws-pill mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-300">
                    <Sparkles size={13} /> Occasion Keepsakes
                </div>
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                    <span className="lws-gradient-text">Crafted for Every Special Moment</span>
                </h1>
                <p className="text-neutral-400 mt-3 max-w-2xl text-sm sm:text-base leading-relaxed">
                    Explore luxury digital keepsakes tailored for Anniversaries, Proposals, Weddings, Birthdays, and cherished relationships.
                </p>
            </div>

            {/* Dynamic Active Occasions Filter Bar */}
            <div className="mb-8 space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-widest text-neutral-400 font-semibold flex items-center gap-1.5">
                        <Filter size={13} className="text-rose-400" /> Select Occasion
                    </span>
                    {activeOccasionSlug !== "all" && (
                        <button
                            type="button"
                            onClick={() => handleOccasionChange("all")}
                            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                            <X size={12} /> Clear occasion filter
                        </button>
                    )}
                </div>

                {/* Horizontal Scroll Pill Bar (Renders ONLY active occasions) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
                    {/* "All Occasions" Pill */}
                    <button
                        type="button"
                        onClick={() => handleOccasionChange("all")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 shrink-0 cursor-pointer snap-start ${
                            activeOccasionSlug === "all"
                                ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/20 border border-rose-400/40"
                                : "bg-neutral-900/80 border border-white/10 text-neutral-300 hover:border-white/20 hover:text-white"
                        }`}
                    >
                        <LayoutGrid size={14} />
                        <span>All Occasions</span>
                        <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                activeOccasionSlug === "all"
                                    ? "bg-white/20 text-white"
                                    : "bg-white/10 text-neutral-400"
                            }`}
                        >
                            {all.length}
                        </span>
                    </button>

                    {/* Dynamically Generated Active Occasion Pills */}
                    {activeOccasionsList.map((occ) => {
                        const IconComp = occ.icon;
                        const isSelected = activeOccasionSlug === occ.slug;
                        const count = occasionCounts[occ.id] || 0;

                        return (
                            <button
                                key={occ.id}
                                type="button"
                                onClick={() => handleOccasionChange(occ.slug)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 shrink-0 cursor-pointer snap-start ${
                                    isSelected
                                        ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/20 border border-rose-400/40 scale-[1.02]"
                                        : "bg-neutral-900/80 border border-white/10 text-neutral-300 hover:border-rose-500/40 hover:text-white"
                                }`}
                            >
                                <IconComp
                                    size={14}
                                    className={isSelected ? "text-white" : "text-rose-400"}
                                />
                                <span>{occ.name}</span>
                                <span
                                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                        isSelected
                                            ? "bg-white/20 text-white"
                                            : "bg-white/10 text-neutral-400"
                                    }`}
                                >
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Active Occasion Info Banner */}
            {activeOccasionObj && !isInactiveOccasionUrl && (
                <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-neutral-900/80 to-purple-950/30 border border-rose-500/20 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fadeIn">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center justify-center shrink-0">
                            {React.createElement(activeOccasionObj.icon, { size: 20 })}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white font-serif">
                                {activeOccasionObj.name} Keepsakes
                            </h2>
                            <p className="text-xs text-neutral-400 mt-0.5">
                                {activeOccasionObj.shortDescription}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Inactive Occasion URL Fallback Banner */}
            {isInactiveOccasionUrl && (
                <div className="lws-card p-10 md:p-14 text-center rounded-3xl bg-neutral-900/60 border border-amber-500/30 max-w-xl mx-auto space-y-4 my-8 animate-fadeIn">
                    <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center justify-center mx-auto shadow-inner">
                        <Clock size={28} className="animate-pulse" />
                    </div>
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                            Upcoming Release
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-white">
                            This occasion is coming soon.
                        </h3>
                        <p className="text-xs text-neutral-400 leading-relaxed max-w-md mx-auto">
                            Customized keepsakes for <strong>{activeOccasionObj.name}</strong> are currently in development for our upcoming launch. Check out our active gift collections below!
                        </p>
                    </div>
                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={() => handleOccasionChange("all")}
                            className="lws-btn-primary text-xs py-3 px-6 rounded-full inline-flex items-center gap-2 cursor-pointer shadow-xl hover:scale-105 transition-transform"
                        >
                            Browse Available Occasions <ArrowRight size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* Secondary Controls Bar (Tier & Price Filters + Result Count) */}
            {!isInactiveOccasionUrl && (
                <div className="lws-card p-4 mb-8 flex flex-wrap items-center gap-3 bg-neutral-900/60 border border-white/10 rounded-2xl">
                    <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                        <Filter size={12} /> Refine:
                    </span>

                    {/* Tier Filter Dropdown */}
                    <select
                        data-testid={MARKETPLACE.filterTier}
                        value={tier}
                        onChange={(e) => handleTierChange(e.target.value)}
                        className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-rose-500/50 cursor-pointer"
                    >
                        {TIERS.map((t) => (
                            <option key={t} value={t} className="bg-neutral-900 text-white">
                                {t === "All" ? "All Tiers" : `${t} Tier`}
                            </option>
                        ))}
                    </select>

                    {/* Price Filter Dropdown */}
                    <select
                        data-testid={MARKETPLACE.filterPrice}
                        value={price}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-rose-500/50 cursor-pointer"
                    >
                        {PRICE_BUCKETS.map((b) => (
                            <option key={b.id} value={b.id} className="bg-neutral-900 text-white">
                                {b.label}
                            </option>
                        ))}
                    </select>

                    <div className="ml-auto flex items-center gap-3 text-xs text-neutral-400">
                        <span>
                            Showing <strong className="text-white font-semibold">{filtered.length}</strong> template{filtered.length === 1 ? "" : "s"}
                        </span>
                        {(activeOccasionSlug !== "all" || tier !== "All" || price !== "all") && (
                            <button
                                type="button"
                                onClick={handleResetAll}
                                className="text-xs text-rose-400 hover:text-rose-300 underline underline-offset-4 cursor-pointer"
                            >
                                Reset filters
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Template Grid or Empty State */}
            {!isInactiveOccasionUrl && filtered.length > 0 && (
                <div data-testid={MARKETPLACE.grid} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((t) => (
                        <TemplateCard key={t.config.slug} entry={t} />
                    ))}
                </div>
            )}

            {!isInactiveOccasionUrl && filtered.length === 0 && (
                <div data-testid={MARKETPLACE.emptyState} className="lws-card p-12 md:p-16 text-center rounded-3xl bg-neutral-900/40 border border-white/10 max-w-xl mx-auto space-y-4">
                    <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
                        <Sparkles size={22} />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-white">
                        No Keepsakes Found
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                        No templates currently match the selected combination of occasion, tier, and price filters.
                    </p>
                    <button
                        type="button"
                        onClick={handleResetAll}
                        className="lws-btn-primary text-xs py-2.5 px-5 rounded-full inline-flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                        <X size={14} /> Clear All Filters
                    </button>
                </div>
            )}
        </div>
    );
}
