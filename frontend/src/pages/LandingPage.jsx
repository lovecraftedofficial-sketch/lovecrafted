import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowRight,
    Sparkles,
    Heart,
    ShieldCheck,
    Wand2,
    Palette,
    Music2,
    ChevronDown,
} from "lucide-react";
import { LANDING } from "@/constants/testIds";
import { listMarketplaceTemplates } from "@/data/templateRegistry";
import TemplateCard from "@/components/TemplateCard";
import CustomerFeedbackSection from "@/components/CustomerFeedbackSection";
import { getPublicTestimonials } from "@/lib/feedbackService";

export default function LandingPage() {
    const templates = listMarketplaceTemplates();
    const featured = templates;
    const publicTestimonials = getPublicTestimonials();

    return (
        <div data-testid={LANDING.root}>
            {/* HERO */}
            <section className="relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <span
                            key={i}
                            className="floating-heart"
                            style={{
                                left: `${(i * 11 + 4) % 100}%`,
                                animationDelay: `${i * 1.9}s`,
                                fontSize: `${14 + (i % 4) * 5}px`,
                            }}
                        >
                            ❤
                        </span>
                    ))}
                </div>

                <div className="relative max-w-6xl mx-auto px-6 pt-24 md:pt-36 pb-16 md:pb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <div className="lws-pill mb-6">
                            <Sparkles size={12} /> Premium romantic websites, handcrafted
                        </div>
                        <h1
                            data-testid={LANDING.heroTitle}
                            className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-6"
                        >
                            <span className="sheen-text">Turn your love story</span>
                            <br />
                            <span className="font-italic-display text-[color:var(--lws-cream)] opacity-90">
                                into a website.
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-[color:var(--lws-text-muted)] max-w-2xl leading-relaxed mb-10">
                            LoveCrafted hands you a small collection of
                            hand-designed romantic templates. Pick one. Personalize
                            the words, photos, memories and music that matter. Share
                            a private link with the person you love.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/templates"
                                data-testid={LANDING.heroExploreBtn}
                                className="lws-btn-primary"
                            >
                                Explore Templates <ArrowRight size={16} />
                            </Link>
                            <a
                                href="#how"
                                data-testid={LANDING.heroHowItWorksBtn}
                                className="lws-btn-ghost"
                            >
                                See How It Works
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FEATURED TEMPLATES */}
            <section
                data-testid={LANDING.featuredSection}
                className="max-w-7xl mx-auto px-6 py-16 md:py-24"
            >
                <div className="flex items-end justify-between mb-10 md:mb-14 flex-wrap gap-4">
                    <div>
                        <div className="lws-pill mb-4">Featured</div>
                        <h2 className="font-display text-4xl md:text-5xl">
                            <span className="lws-gradient-text">
                                A small, obsessive collection
                            </span>
                        </h2>
                        <p className="text-[color:var(--lws-text-muted)] mt-3 max-w-xl">
                            Every template is crafted from scratch. No dashboards
                            full of copies. Just a few, made carefully.
                        </p>
                    </div>
                    <Link to="/templates" className="lws-btn-ghost text-sm">
                        View all templates <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featured.map((t) => (
                        <TemplateCard key={t.config.slug} entry={t} />
                    ))}
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section
                id="how"
                data-testid={LANDING.howItWorksSection}
                className="max-w-6xl mx-auto px-6 py-16 md:py-24"
            >
                <div className="lws-pill mb-4">How it works</div>
                <h2 className="font-display text-4xl md:text-5xl mb-14">
                    <span className="lws-gradient-text">Three quiet steps</span>
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        {
                            n: "01",
                            t: "Pick a template",
                            d: "Browse a handcrafted collection. Preview live. Choose the one that feels most like the two of you.",
                            icon: <Palette size={18} />,
                        },
                        {
                            n: "02",
                            t: "Make it yours",
                            d: "Personalize names, messages, photos, memories and music through a beautiful visual editor. No code.",
                            icon: <Wand2 size={18} />,
                        },
                        {
                            n: "03",
                            t: "Share the link",
                            d: "Publish and share a private link. Only the two of you know what waits behind it.",
                            icon: <Heart size={18} />,
                        },
                    ].map((s, i) => (
                        <motion.article
                            key={s.n}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.5, delay: i * 0.08 }}
                            className="lws-card p-7"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[color:var(--lws-pink)] text-xs tracking-widest">
                                    {s.n}
                                </span>
                                <span
                                    className="w-9 h-9 rounded-full flex items-center justify-center"
                                    style={{
                                        background:
                                            "linear-gradient(120deg, #f8b5c4, #d4a574)",
                                        color: "#2a0714",
                                    }}
                                >
                                    {s.icon}
                                </span>
                            </div>
                            <h3 className="font-display text-2xl mb-2">
                                {s.t}
                            </h3>
                            <p className="text-[color:var(--lws-text-muted)] leading-relaxed">
                                {s.d}
                            </p>
                        </motion.article>
                    ))}
                </div>
            </section>

            {/* WHY */}
            <section
                data-testid={LANDING.whySection}
                className="max-w-6xl mx-auto px-6 py-16 md:py-24"
            >
                <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 items-center">
                    <div>
                        <div className="lws-pill mb-4">Why us</div>
                        <h2 className="font-display text-4xl md:text-5xl mb-6">
                            <span className="lws-gradient-text">
                                Made by one person.
                            </span>
                            <br />
                            <span className="font-italic-display text-[color:var(--lws-cream)] opacity-90">
                                For one person.
                            </span>
                        </h2>
                        <p className="text-[color:var(--lws-text-muted)] leading-relaxed">
                            Every design here is coded by hand. No generic
                            drag-and-drop themes. No filler features. Every
                            interaction, animation and typographic detail is chosen
                            because it makes the finished website feel a little
                            more like a love letter — and a little less like a
                            product.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            {
                                icon: <ShieldCheck size={16} />,
                                t: "Private by design",
                                d: "Share only through a private link. Optional password protection is coming.",
                            },
                            {
                                icon: <Palette size={16} />,
                                t: "Editorial visuals",
                                d: "Editorial typography, controlled palettes, restrained animation.",
                            },
                            {
                                icon: <Music2 size={16} />,
                                t: "A song, together",
                                d: "Add a Spotify, YouTube or Apple Music track — or your own audio.",
                            },
                            {
                                icon: <Heart size={16} />,
                                t: "Made to last",
                                d: "Not another Valentine's Day gimmick. A keepsake you can revisit any evening.",
                            },
                        ].map((f) => (
                            <div key={f.t} className="lws-card p-5">
                                <span className="text-[color:var(--lws-pink)] mb-3 inline-flex">
                                    {f.icon}
                                </span>
                                <h4 className="font-display text-lg mb-1">{f.t}</h4>
                                <p className="text-sm text-[color:var(--lws-text-muted)] leading-relaxed">
                                    {f.d}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* LAUNCH PRICING */}
            <section
                data-testid={LANDING.tiersSection}
                className="max-w-5xl mx-auto px-6 py-16 md:py-24"
            >
                <div className="lws-pill mb-4">Launch Pricing</div>
                <h2 className="font-display text-4xl md:text-5xl mb-4 lws-gradient-text">
                    Choose your story
                </h2>
                <p className="text-[color:var(--lws-text-muted)] text-base md:text-lg max-w-2xl mb-10 leading-relaxed">
                    Every LoveCrafted website is made to feel personal — from a simple romantic surprise to a full cinematic love story.
                </p>

                <div className="grid sm:grid-cols-2 gap-6">
                    {[
                        {
                            tier: "SWEET & PERSONAL",
                            name: "For My Baby",
                            price: 99,
                            desc: "A cute, intimate romantic experience designed for comforting and surprising someone you love.",
                            accent: "#f8b5c4",
                            slug: "come-here-baby",
                        },
                        {
                            tier: "CINEMATIC",
                            name: "Until Forever",
                            price: 299,
                            desc: "A deeper interactive love-story experience with richer sections, memories and cinematic interactions.",
                            accent: "#d4a574",
                            slug: "until-forever",
                        },
                    ].map((p) => (
                        <div
                            key={p.tier}
                            className="lws-card p-7 md:p-8 relative overflow-hidden flex flex-col justify-between"
                            style={{
                                boxShadow: `0 40px 100px -40px ${p.accent}33 inset`,
                            }}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span
                                        className="text-[11px] uppercase tracking-widest px-3 py-1 rounded-full font-semibold"
                                        style={{
                                            color: p.accent,
                                            background: `${p.accent}15`,
                                            border: `1px solid ${p.accent}40`,
                                        }}
                                    >
                                        {p.tier}
                                    </span>
                                </div>
                                <h3 className="font-display text-2xl md:text-3xl text-[color:var(--lws-cream)] mb-2">
                                    {p.name}
                                </h3>
                                <div className="font-display text-5xl mb-4 text-white">
                                    ₹{p.price.toLocaleString("en-IN")}
                                </div>
                                <p className="text-sm text-[color:var(--lws-text-muted)] leading-relaxed mb-8">
                                    {p.desc}
                                </p>
                            </div>
                            <div>
                                <Link
                                    to={`/templates/${p.slug}`}
                                    className="lws-btn-primary w-full text-center justify-center text-sm py-3 font-semibold"
                                >
                                    View Experience <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* TESTIMONIALS PLACEHOLDER */}
            <section
                data-testid={LANDING.testimonialsSection}
                className="max-w-6xl mx-auto px-6 py-16 md:py-24"
            >
                <div className="lws-pill mb-4">Kind words</div>
                <h2 className="font-display text-4xl md:text-5xl mb-10 lws-gradient-text">
                    From the people who mattered
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {publicTestimonials.map((t) => (
                        <blockquote key={t.id || t.q || t.feedback} className="lws-card p-6 flex flex-col justify-between">
                            <p className="font-italic-display text-lg leading-relaxed text-[color:var(--lws-cream)]">
                                “{t.feedback || t.q}”
                            </p>
                            <footer className="text-xs uppercase tracking-widest text-[color:var(--lws-text-dim)] mt-4">
                                — {t.name || t.a}
                            </footer>
                        </blockquote>
                    ))}
                </div>
                <p className="text-xs text-[color:var(--lws-text-dim)] mt-4">
                    Verified customer stories — featured with explicit permission.
                </p>
            </section>

            {/* FAQ */}
            <section
                data-testid={LANDING.faqSection}
                className="max-w-4xl mx-auto px-6 py-16 md:py-24"
            >
                <div className="lws-pill mb-4">FAQ</div>
                <h2 className="font-display text-4xl md:text-5xl mb-8 lws-gradient-text">
                    Questions people have asked
                </h2>
                <div className="space-y-2">
                    {[
                        {
                            q: "Can I upload my own template design?",
                            a: "No. Every template is coded by the studio. You personalize the words, photos and music inside a template you choose.",
                        },
                        {
                            q: "What can I edit?",
                            a: "Each template lists exactly what's editable — names, messages, dates, photos, memories, reasons, open-when messages, music, letters. The visual editor adapts to the template you pick.",
                        },
                        {
                            q: "Is my website private?",
                            a: "Yes. Your website lives at a private random link. Password protection is coming.",
                        },
                        {
                            q: "How do I pay & get my keepsake?",
                            a: "You can pay securely through Razorpay using the payment options available at checkout. Once your payment is successfully completed and confirmed, you’ll get access to create your personalized LoveCrafted keepsake.",
                        },
                    ].map((f) => (
                        <details key={f.q} className="lws-card p-5 group">
                            <summary className="flex items-center justify-between cursor-pointer list-none">
                                <span className="font-display text-lg text-[color:var(--lws-cream)]">
                                    {f.q}
                                </span>
                                <ChevronDown
                                    size={16}
                                    className="text-[color:var(--lws-pink)] transition-transform group-open:rotate-180"
                                />
                            </summary>
                            <p className="pt-3 text-[color:var(--lws-text-muted)] leading-relaxed">
                                {f.a}
                            </p>
                        </details>
                    ))}
                </div>
            </section>

            {/* CUSTOMER FEEDBACK SECTION */}
            <CustomerFeedbackSection />

            {/* FINAL CTA */}
            <section className="max-w-4xl mx-auto px-6 py-20 md:py-32 text-center">
                <h2 className="font-display text-5xl md:text-6xl mb-6">
                    <span className="lws-gradient-text">Say it in a website</span>
                </h2>
                <p className="text-[color:var(--lws-text-muted)] text-lg mb-10">
                    Some feelings deserve more than a text message.
                </p>
                <Link
                    to="/templates"
                    data-testid={LANDING.finalCtaBtn}
                    className="lws-btn-primary"
                >
                    Choose a Template <ArrowRight size={16} />
                </Link>
            </section>
        </div>
    );
}