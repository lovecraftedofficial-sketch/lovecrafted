import React, { useMemo, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    ArrowRight,
    ArrowLeft,
    Check,
    Lock,
    Sparkles,
    Clock,
    Eye,
    Heart,
    Music,
    Camera,
    Mail,
    Calendar,
    MessageSquare,
    Mic,
    Share2,
    Wand2,
    Crown,
    Gift,
    ShieldCheck
} from "lucide-react";
import { getTemplate } from "@/data/templateRegistry";
import { OCCASIONS } from "@/constants/occasions";
import TemplateRenderer from "@/components/TemplateRenderer";
import { TEMPLATE_DETAILS } from "@/constants/testIds";
import { formatPrice } from "@/components/TemplateCard";

export default function TemplateDetailsPage() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const entry = getTemplate(slug);
    const demoRef = useRef(null);

    // Filter matching occasion objects for "Perfect For" section
    const matchingOccasions = useMemo(() => {
        if (!entry?.config) return [];
        const config = entry.config;
        const occIds = (config.occasions || [config.category]).map((o) => o.toLowerCase());
        return OCCASIONS.filter((o) =>
            occIds.includes(o.id) ||
            occIds.includes(o.slug) ||
            (o.id === "anniversary" && config.category === "Romantic")
        );
    }, [entry]);

    if (!entry) {
        return (
            <div data-testid={TEMPLATE_DETAILS.notFound} className="max-w-xl mx-auto text-center py-24 px-6 space-y-6">
                <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                    <Sparkles size={28} />
                </div>
                <div className="lws-pill">Keepsake Not Found</div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-white">
                    <span className="lws-gradient-text">Template Unavailable</span>
                </h1>
                <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                    The requested keepsake template slug "<code className="text-rose-300 font-mono">{slug}</code>" does not exist in our catalog.
                </p>
                <div className="pt-2">
                    <Link to="/templates" className="lws-btn-primary px-6 py-3 text-sm inline-flex items-center gap-2">
                        <ArrowLeft size={16} /> Browse All Templates
                    </Link>
                </div>
            </div>
        );
    }

    const { config, comingSoon } = entry;

    const scrollToDemo = () => {
        if (demoRef.current) {
            demoRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const whatsIncludedItems = [
        {
            title: "Handwritten Love Letter",
            desc: "Full-page romantic letter with custom title & gold wax seal effect",
            icon: Mail,
            status: "included",
        },
        {
            title: "3D Tilt Polaroid Gallery",
            desc: "Interactive memory cards with realistic tilt reflection on hover",
            icon: Camera,
            status: "included",
        },
        {
            title: "Love Story Timeline",
            desc: "Chronological milestone timeline from first date to present day",
            icon: Calendar,
            status: "included",
        },
        {
            title: "Background Music Player",
            desc: "Floating vinyl player supporting custom MP3 audio tracks",
            icon: Music,
            status: "included",
        },
        {
            title: "Live Relationship Counter",
            desc: "Real-time live counter tracking days, hours, minutes together",
            icon: Clock,
            status: "included",
        },
        {
            title: "Secret Open-When Notes",
            desc: "Interactive envelope cards that reveal hidden messages on click",
            icon: MessageSquare,
            status: "included",
        },
        {
            title: "Virtual Hug & Heart Shower",
            desc: "Animated particle effects and interactive heart shower button",
            icon: Heart,
            status: "included",
        },
        {
            title: "HD Voice Recording Player",
            desc: "Embedded audio recorder for intimate voice note messages",
            icon: Mic,
            status: "coming-soon",
        },
    ];

    const howItWorksSteps = [
        {
            step: "01",
            title: "Choose Template",
            desc: "Select this luxury template design crafted specifically for your occasion.",
            icon: Sparkles,
        },
        {
            step: "02",
            title: "Personalize Content",
            desc: "Add your photos, dates, love letter, and background music in under 10 minutes.",
            icon: Wand2,
        },
        {
            step: "03",
            title: "Share & Surprise",
            desc: "Send your unique private link to surprise and touch their heart.",
            icon: Share2,
        },
    ];

    return (
        <div data-testid={TEMPLATE_DETAILS.root} className="min-h-screen bg-[#0a0508] text-white">
            {/* Navigation Breadcrumb Bar */}
            <div className="border-b border-white/10 bg-neutral-900/40 backdrop-blur-md sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
                    <Link
                        to="/templates"
                        className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
                    >
                        <ArrowLeft size={14} /> Back to Marketplace
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] uppercase tracking-widest text-neutral-400">
                            {config.tier} Collection
                        </span>
                    </div>
                </div>
            </div>

            {/* Hero Main Section */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-16 pb-12">
                <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-14 items-center">
                    {/* Left Column: Info & Actions */}
                    <div className="space-y-6">
                        {/* Badges Bar */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="lws-pill text-xs px-3 py-1 font-semibold text-rose-300 border-rose-500/30 bg-rose-500/10">
                                {config.category}
                            </span>
                            <span className="lws-pill text-xs px-3 py-1 font-semibold text-amber-300 border-amber-500/30 bg-amber-500/10 inline-flex items-center gap-1">
                                <Crown size={12} /> {config.tier} Tier
                            </span>
                            <span className="lws-pill text-xs px-3 py-1 font-medium text-neutral-300 border-white/10 bg-white/5 inline-flex items-center gap-1">
                                <Clock size={12} className="text-rose-400" /> ~5–10 min setup
                            </span>
                            {comingSoon && (
                                <span className="lws-pill text-xs px-3 py-1 font-bold text-purple-300 border-purple-500/30 bg-purple-500/20 inline-flex items-center gap-1">
                                    <Lock size={12} /> Coming Soon
                                </span>
                            )}
                        </div>

                        {/* Title & Description */}
                        <div>
                            <h1 data-testid={TEMPLATE_DETAILS.title} className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                                <span className="lws-gradient-text">{config.name}</span>
                            </h1>
                            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mt-4 max-w-xl">
                                {config.description}
                            </p>
                        </div>

                        {/* Price Badge */}
                        <div className="flex items-baseline gap-3 pt-2">
                            <span className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight">
                                {formatPrice(config.price, config.currency)}
                            </span>
                            <div className="text-xs text-neutral-400">
                                <div className="font-semibold text-neutral-300 uppercase tracking-widest text-[10px]">
                                    One-Time Payment
                                </div>
                                <div>Private shareable link included</div>
                            </div>
                        </div>

                        {/* Primary Action Buttons Bar */}
                        <div className="flex flex-wrap items-center gap-3 pt-4">
                            {!comingSoon ? (
                                <button
                                    type="button"
                                    onClick={() => navigate(`/dashboard/websites/${config.slug}/edit`)}
                                    data-testid={TEMPLATE_DETAILS.createBtn}
                                    className="lws-btn-primary text-sm py-3.5 px-7 rounded-full font-semibold shadow-xl shadow-rose-500/20 flex items-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform"
                                >
                                    Create Yours <ArrowRight size={16} />
                                </button>
                            ) : (
                                <button disabled className="lws-btn-ghost opacity-50 cursor-not-allowed py-3.5 px-6 rounded-full border border-white/10 text-neutral-400">
                                    Coming Soon
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={scrollToDemo}
                                className="lws-btn-ghost text-sm py-3.5 px-6 rounded-full border border-white/10 hover:bg-white/10 text-neutral-200 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                            >
                                <Eye size={16} className="text-rose-400" /> Live Preview
                            </button>

                            <Link
                                to="/templates"
                                className="text-xs text-neutral-400 hover:text-white px-3 py-3 font-medium transition-colors cursor-pointer"
                            >
                                Browse All
                            </Link>
                        </div>

                        {/* Trust Guarantee */}
                        <div className="flex items-center gap-4 text-xs text-neutral-400 pt-2">
                            <span className="flex items-center gap-1.5 text-emerald-400">
                                <ShieldCheck size={14} /> Instant Access
                            </span>
                            <span>•</span>
                            <span>No coding required</span>
                            <span>•</span>
                            <span>Mobile optimized</span>
                        </div>
                    </div>

                    {/* Right Column: Hero Cover Preview Card */}
                    <div className="relative group">
                        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-rose-500/30 to-purple-600/30 blur-xl opacity-75 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative lws-card overflow-hidden rounded-3xl border border-white/15 bg-neutral-900/90 shadow-2xl">
                            {config.coverImage ? (
                                <img
                                    src={config.coverImage}
                                    alt={config.name}
                                    className="w-full h-auto object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="aspect-[4/3] bg-neutral-900 flex items-center justify-center text-neutral-500">
                                    No preview cover available
                                </div>
                            )}

                            <div className="p-4 bg-black/80 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-xs">
                                <span className="text-neutral-300 font-medium">✨ {config.name} Experience</span>
                                <button
                                    onClick={scrollToDemo}
                                    className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
                                >
                                    Interactive Demo ↓
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What's Included Section */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 border-t border-white/10">
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                    <div className="lws-pill inline-flex items-center gap-1 text-xs font-semibold text-rose-300">
                        <Gift size={13} /> Complete Keepsake Package
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                        <span className="lws-gradient-text">What's Included in This Template</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                        Every feature is crafted to evoke joy, nostalgia, and tears of happiness.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {whatsIncludedItems.map((item, idx) => {
                        const IconComponent = item.icon;
                        const isComing = item.status === "coming-soon";

                        return (
                            <div
                                key={idx}
                                className={`p-5 rounded-2xl border transition-all duration-300 ${
                                    isComing
                                        ? "bg-neutral-900/30 border-white/5 opacity-60"
                                        : "bg-neutral-900/70 border-white/10 hover:border-rose-500/40 hover:bg-neutral-900/90 shadow-lg"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-2.5 rounded-xl ${isComing ? "bg-white/5 text-neutral-500" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                                        <IconComponent size={20} />
                                    </div>
                                    {isComing ? (
                                        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                            Coming Soon
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                            <Check size={10} /> Included
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-semibold text-sm text-white mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-xs text-neutral-400 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Perfect For Occasions Section */}
            {matchingOccasions.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 md:px-6 py-14 border-t border-white/10">
                    <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                        <div className="lws-pill inline-flex items-center gap-1 text-xs font-semibold text-rose-300">
                            <Heart size={13} /> Occasion Match
                        </div>
                        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                            Perfect For These Moments
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {matchingOccasions.map((occ) => {
                            const IconComp = occ.icon;

                            return (
                                <div
                                    key={occ.id}
                                    className="p-6 rounded-2xl bg-gradient-to-b from-neutral-900/80 to-black/60 border border-white/10 hover:border-rose-500/30 transition-all space-y-3"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/20 flex items-center justify-center">
                                        <IconComp size={20} />
                                    </div>
                                    <h3 className="font-serif text-lg font-bold text-white">
                                        {occ.name}
                                    </h3>
                                    <p className="text-xs text-neutral-400 leading-relaxed">
                                        {occ.shortDescription}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* How It Works Section */}
            <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 border-t border-white/10 bg-neutral-950/50">
                <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                    <div className="lws-pill inline-flex items-center gap-1 text-xs font-semibold text-rose-300">
                        <Wand2 size={13} /> Simple 3-Step Process
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                        <span className="lws-gradient-text">How It Works</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
                    {howItWorksSteps.map((stepItem, i) => {
                        const StepIcon = stepItem.icon;

                        return (
                            <div key={i} className="relative p-6 rounded-2xl bg-neutral-900/60 border border-white/10 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center font-bold">
                                        <StepIcon size={20} />
                                    </div>
                                    <span className="font-display text-2xl font-bold text-white/20">
                                        {stepItem.step}
                                    </span>
                                </div>
                                <h3 className="font-bold text-base text-white">
                                    {stepItem.title}
                                </h3>
                                <p className="text-xs text-neutral-400 leading-relaxed">
                                    {stepItem.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Interactive Live Demo Preview Section */}
            <section ref={demoRef} className="max-w-7xl mx-auto px-4 md:px-6 py-16 border-t border-white/10">
                <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <div className="lws-pill mb-2 inline-flex items-center gap-1 text-xs font-semibold text-rose-300">
                            <Eye size={13} /> Interactive Experience
                        </div>
                        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
                            <span className="lws-gradient-text">Live Interactive Demo</span>
                        </h2>
                        <p className="text-xs text-neutral-400 mt-1">
                            Experience the exact website your partner or recipient will see.
                        </p>
                    </div>

                    {!comingSoon && (
                        <button
                            type="button"
                            onClick={() => navigate(`/dashboard/websites/${config.slug}/edit`)}
                            className="lws-btn-primary text-xs py-2.5 px-5 rounded-full inline-flex items-center gap-2 cursor-pointer shadow-lg"
                        >
                            Customize This Design <ArrowRight size={14} />
                        </button>
                    )}
                </div>

                {/* Interactive Demo Frame */}
                <div
                    data-testid={TEMPLATE_DETAILS.previewFrame}
                    className="lws-card overflow-hidden rounded-3xl border border-white/15 bg-black shadow-2xl"
                >
                    <TemplateRenderer
                        templateSlug={config.slug}
                        content={config.demoData || {}}
                    />
                </div>
            </section>
        </div>
    );
}
