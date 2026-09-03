import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Edit3,
  Eye,
  Palette,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { TEMPLATE_SUITES } from "../data/suitesConfig";

const HIGHLIGHTS = [
  {
    icon: Palette,
    title: "Recolour in one tap",
    body: "Five accent tones restyle typography, dividers and buttons across the whole suite.",
  },
  {
    icon: Eye,
    title: "Live studio preview",
    body: "Every word you type appears instantly in a faithful rendering of your invitation.",
  },
  {
    icon: ShieldCheck,
    title: "Saved to your atelier",
    body: "Your customised invitation is stored securely and can be reopened at any time.",
  },
];

const ALL_SUITES_MAP = {
  "aurora-noire": {
    id: "aurora-noire",
    title: "Aurora Noire Monogram",
    subtitle: "Anniversary Edition: Warm teasing, little quirks, our song, 2 galleries & proposing again",
    description: "Celebrate your anniversary with a warm romantic greeting, playful teasing, small notes about what you love about your partner, full song playback, two personal photo galleries, and proposing to her all over again.",
    category: "Modern Loft & Studio",
    tier: "Anniversary Edition",
    price: 9,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Warm greeting & playful teasing header",
      "Special notes about the little things you love",
      "Full song playback & Spotify integration",
      "2 personal photo gallery sections (Milestones & Candids)",
      "Proposing all over again heartfelt love letter",
      "Red Heart-Shaped QR keepsake download",
    ],
  },
  "burgundy-botanica": {
    id: "burgundy-botanica",
    title: "Burgundy Botanica Archive",
    subtitle: "Earthy dark flora on hand-pressed parchment",
    description: "Rich botanical textures, hand-pressed parchment details, and warm romantic typography.",
    category: "Intimate & Micro-Wedding",
    tier: "Minimalist Luxury",
    price: 1299,
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Botanical foliage motifs",
      "Hand-pressed parchment feel",
      "RSVP & Gift registry support",
      "Instant share link",
    ],
  },
  "chateau-velvet": {
    id: "chateau-velvet",
    title: "Chateau de Velvet & Rose",
    subtitle: "Warm rose gold foil and wax-sealed French aesthetics",
    description: "French Chateau inspired luxury aesthetic with wax seals, gold foil accents, and romantic velvet tones.",
    category: "Destination Wedding",
    tier: "Exclusive Atelier",
    price: 1999,
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
    features: [
      "Wax-seal reveal animation",
      "French chateau typography",
      "Multi-day schedule planner",
      "Instant share link",
    ],
  },
};

const DEFAULT_SUITE = ALL_SUITES_MAP["aurora-noire"];

export default function TemplateDetailsPage() {
  const { id = "aurora-noire" } = useParams();
  const navigate = useNavigate();

  const template = ALL_SUITES_MAP[id] || {
    ...DEFAULT_SUITE,
    id: id,
    title: id.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
  };

  const suiteConfig = TEMPLATE_SUITES.find((s) => s.id === id);
  const isArchived = suiteConfig ? suiteConfig.archived : id !== "aurora-noire";
  const formattedPrice = isArchived
    ? "Coming Soon"
    : `₹${template.price?.toLocaleString("en-IN") || "9"}`;

  return (
    <div className="min-h-screen bg-[#0a0507] text-[#f5e6d3] font-sans antialiased selection:bg-[#d48b95]/30 selection:text-[#f5e6d3]">
      {/* Top Back Navigation Bar */}
      <div className="mx-auto max-w-7xl px-6 pt-6 lg:px-8">
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 text-xs font-medium text-[#c5b0a5] hover:text-[#e8b4b8] transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to the collection
        </Link>
      </div>

      {/* Main Details Grid */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12"
      >
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Preview Image + 3 Feature Highlights */}
          <div className="lg:col-span-7 space-y-10">
            {/* Cinematic Preview Image Container */}
            <div className="relative overflow-hidden rounded-3xl border border-[#dfc19c]/15 bg-[#140a0f] p-2 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)]">
              <img
                src={template.image}
                alt={template.title}
                className="w-full aspect-[4/3] rounded-2xl object-cover"
              />
            </div>

            {/* 3 Highlight Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {HIGHLIGHTS.map((highlight, index) => (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="rounded-2xl border border-[#dfc19c]/15 bg-[#140a0f]/80 p-5 backdrop-blur-xl"
                >
                  <span className="grid size-9 place-items-center rounded-full border border-[#dfc19c]/25 bg-[#1b0e15] text-[#e8b4b8] mb-3">
                    <highlight.icon className="size-4" />
                  </span>
                  <h3 className="font-serif text-sm font-medium text-[#f5e6d3]">
                    {highlight.title}
                  </h3>
                  <p className="mt-2 text-[0.7rem] leading-relaxed text-[#c5b0a5]">
                    {highlight.body}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Atelier Quote Card */}
            <div className="rounded-2xl border border-[#dfc19c]/15 bg-[#140a0f]/60 p-7 backdrop-blur-xl space-y-4">
              <p className="text-[0.65rem] tracking-[0.25em] uppercase font-semibold text-[#dfc19c]/70">
                FROM THE ATELIER
              </p>
              <p className="font-serif text-lg sm:text-xl italic leading-relaxed text-[#f5e6d3]">
                &ldquo;Some stories deserve more than a message. They deserve a place you can return to.&rdquo;
              </p>
              <div className="flex items-center gap-2 text-xs">
                <span className="font-serif font-semibold text-[#e8b4b8]">LoveCrafted</span>
                <span className="text-[#dfc19c]/40">—</span>
                <span className="text-[#c5b0a5]">Made for the moments worth keeping.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Purchase & Customise Panel */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-3xl border border-[#dfc19c]/15 bg-[#140a0f]/90 p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl space-y-6">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e8b4b8]/30 bg-[#0a0507] px-3 py-1 text-[0.65rem] uppercase tracking-wider text-[#e8b4b8]">
                    <Sparkles className="size-3 text-[#e8b4b8]" />
                    {template.tier}
                  </span>
                  <span className="rounded-full border border-[#dfc19c]/20 px-3 py-1 text-[0.65rem] uppercase tracking-wider text-[#dfc19c]/80">
                    {template.category}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h1 className="font-serif text-3xl sm:text-4xl font-medium text-white">
                    {template.title}
                  </h1>
                  <p className="mt-2 text-xs leading-relaxed text-[#c5b0a5]">
                    {template.subtitle}
                  </p>
                </div>

                {/* Price Section */}
                <div className="flex items-baseline gap-2 border-y border-[#dfc19c]/10 py-5">
                  <span
                    className={`font-serif ${
                      isArchived ? "text-2xl sm:text-3xl text-amber-300" : "text-4xl text-[#f5e6d3]"
                    } font-semibold`}
                  >
                    {formattedPrice}
                  </span>
                  <span className="text-xs text-[#c5b0a5]">
                    {isArchived ? "In Atelier · Under Preparation" : "one-time, yours forever"}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs leading-relaxed text-[#c5b0a5]">
                  {template.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 pt-2">
                  {template.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-xs text-[#f5e6d3]">
                      <Check className="size-4 text-[#e8b4b8] shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Customise CTA Button */}
                <button
                  type="button"
                  onClick={() => navigate(`/editor/${template.id}`)}
                  className="mt-6 inline-flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#d48b95] text-sm font-medium text-[#0a0507] transition-all hover:bg-[#e8b4b8] hover:shadow-[0_0_30px_rgba(212,139,149,0.35)] cursor-pointer"
                >
                  <Edit3 className="size-4" />
                  <span>{isArchived ? "Preview & Edit Draft in Studio" : "Customise this suite"}</span>
                </button>

                <p className="text-center text-[0.7rem] text-[#c5b0a5]/70">
                  Opens the live studio — nothing is charged here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
