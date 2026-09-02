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

export default function LandingPage() {
    const templates = listMarketplaceTemplates();
    const featured = templates;

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
                            <Sparkles size={12} /> Handcrafted Romantic Keepsakes
                        </div>
                        <h1
                            data-testid={LANDING.heroTitle}
                            className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-6"
                        >
                            <span className="sheen-text">Turn your memories</span>
                            <br />
                            <span className="font-italic-display text-[color:var(--lws-cream)] opacity-90">
                                into a digital keepsake they'll never forget.
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-[color:var(--lws-text-muted)] max-w-2xl leading-relaxed mb-10">
                            Choose a handcrafted experience, personalize it with your names, memories, photos and music, then share a private link with someone you love.
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
                            Every keepsake is crafted from scratch. No generic templates. Just a few, made carefully.
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
                            d: "Choose the experience that feels most like your story.",
                            icon: <Palette size={18} />,
                        },
                        {
                            n: "02",
                            t: "Make it yours",
                            d: "Add names, messages, photos, memories and music. No code required.",
                            icon: <Wand2 size={18} />,
                        },
                        {
                            n: "03",
                            t: "Share the surprise",
                            d: "Publish your keepsake and send the private link to them.",
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
                            because it makes the finished keepsake feel like a
                            personal love letter.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            {
                                icon: <ShieldCheck size={16} />,
                                t: "Private by design",
                                d: "Share only through a private link that opens directly on any device.",
                            },
                            {
                                icon: <Palette size={16} />,
                                t: "Editorial visuals",
                                d: "Curated typography, controlled palettes, and restrained romantic animation.",
                            },
                            {
                                icon: <Music2 size={16} />,
                                t: "A song, together",
                                d: "Add a Spotify or direct audio track to play during their experience.",
                            },
                            {
                                icon: <Heart size={16} />,
                                t: "Made to last",
                                d: "A personalized digital keepsake you and your partner can revisit anytime.",
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
                    Every LoveCrafted keepsake is made to feel personal — from a sweet comfort surprise to a full cinematic love story.
                </p>

                <div className="grid sm:grid-cols-2 gap-6">
                    {[
                        {
                            tier: "SWEET & PERSONAL",
                            name: "Always Beside You",
                            price: 99,
                            desc: "A reassuring, intimate romantic keepsake designed for comforting and surprising someone you love.",
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
                                    Preview <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* MADE FOR THE MOMENTS THAT MATTER */}
            <section
                data-testid={LANDING.testimonialsSection}
                className="max-w-6xl mx-auto px-6 py-16 md:py-24"
            >
                <div className="lws-pill mb-4">Moments</div>
                <h2 className="font-display text-4xl md:text-5xl mb-6 lws-gradient-text">
                    Made for the moments that matter
                </h2>
                <p className="text-[color:var(--lws-text-muted)] text-base md:text-lg max-w-2xl mb-12 leading-relaxed">
                    LoveCrafted turns your memories, words, photos and music into a private digital keepsake you can give to someone you love.
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        {
                            title: "Anniversaries & Milestones",
                            desc: "Celebrate the journey you have built together with a personalized story, your favorite photos, and a handwritten letter.",
                            badge: "Milestones",
                        },
                        {
                            title: "Comfort & Long Distance",
                            desc: "Be there even when you are far apart with comforting notes, gentle care checklists, open-when envelopes, and your shared songs.",
                            badge: "Connection",
                        },
                        {
                            title: "Proposals & Meaningful Gifts",
                            desc: "Say what words alone cannot capture with an interactive, cinematic surprise made specifically for them.",
                            badge: "Keepsake",
                        },
                    ].map((m) => (
                        <div key={m.title} className="lws-card p-7 flex flex-col justify-between">
                            <div>
                                <span className="text-[11px] uppercase tracking-widest text-[color:var(--lws-pink)] font-semibold mb-3 inline-block">
                                    {m.badge}
                                </span>
                                <h3 className="font-display text-2xl text-[color:var(--lws-cream)] mb-3">
                                    {m.title}
                                </h3>
                                <p className="text-sm text-[color:var(--lws-text-muted)] leading-relaxed">
                                    {m.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
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
                <div className="space-y-3">
                    {[
                        {
                            q: "What exactly am I buying?",
                            a: "You get access to personalize and publish a private, interactive digital keepsake. Your partner opens a unique link to experience your customized letters, photos, memory cards, and music in a beautifully animated presentation.",
                        },
                        {
                            q: "What can I edit and personalize?",
                            a: "Each template lets you customize partner names, your personal love letter, photo memories, date milestones, special notes, open-when envelopes, and background music without any coding.",
                        },
                        {
                            q: "Do I need any technical or coding knowledge?",
                            a: "None at all. Our visual creator studio lets you type your words, upload photos directly from your device, and see a live preview in real-time as you type.",
                        },
                        {
                            q: "How does the recipient receive it?",
                            a: "Once published, you get a clean, private link (e.g. lovecrafted.in/story/your-names) with 1-click sharing to WhatsApp or easy link copying to send through any message.",
                        },
                        {
                            q: "Is my keepsake link private?",
                            a: "Yes. Only someone who has your unique link can open and view your keepsake. It is never listed on public search engines.",
                        },
                        {
                            q: "Can I preview my keepsake before publishing?",
                            a: "Yes. You can explore a complete live demo in the marketplace, and while customizing, the visual editor updates a live preview as you make edits.",
                        },
                        {
                            q: "How does payment work?",
                            a: "You pay a simple one-time price securely through Razorpay using UPI, debit/credit cards, or netbanking. There are no recurring subscriptions or hidden fees.",
                        },
                        {
                            q: "What happens after payment?",
                            a: "Your keepsake is immediately published to a permanent private link, and you can share it right away with the person you love.",
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
                    <span className="lws-gradient-text">Say it with a keepsake</span>
                </h2>
                <p className="text-[color:var(--lws-text-muted)] text-lg mb-10">
                    Some feelings deserve more than a text message.
                </p>
                <Link
                    to="/templates"
                    data-testid={LANDING.finalCtaBtn}
                    className="lws-btn-primary"
                >
                    Explore Templates <ArrowRight size={16} />
                </Link>
            </section>
        </div>
    );
}