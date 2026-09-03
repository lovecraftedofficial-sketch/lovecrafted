import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Crown,
  Heart,
  Music,
  Palette,
  ShieldCheck,
  Sparkles,
  Wand2,
  Lock,
} from "lucide-react";
import TemplateCard from "../components/TemplateCard";
import { TEMPLATE_SUITES } from "../data/suitesConfig";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1612611450392-826af708c34a?auto=format&fit=crop&w=1200&q=85";

const ATMOSPHERE_IMAGE =
  "https://images.pexels.com/photos/33968050/pexels-photo-33968050.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    icon: Palette,
    title: "Pick a template",
    body: "Browse a handcrafted collection. Preview live. Choose the one that feels most like the two of you.",
  },
  {
    step: "02",
    icon: Wand2,
    title: "Make it yours",
    body: "Personalize names, messages, photos, memories and music through a beautiful visual editor. No code.",
  },
  {
    step: "03",
    icon: Heart,
    title: "Share the link",
    body: "Publish and share a private link. Only the two of you know what waits behind it.",
  },
];

const WHY_US_CARDS = [
  {
    icon: Lock,
    title: "Private by design",
    body: "Share only through a private link. Optional password protection is coming.",
  },
  {
    icon: Sparkles,
    title: "Editorial visuals",
    body: "Editorial typography, controlled palettes, restrained animation.",
  },
  {
    icon: Music,
    title: "A song, together",
    body: "Add a Spotify, YouTube or Apple Music track — or your own audio.",
  },
  {
    icon: Heart,
    title: "Made to last",
    body: "Not another Valentine's Day gimmick. A keepsake you can revisit any evening.",
  },
];

const FAQS = [
  {
    question: "Can I upload my own template design?",
    answer:
      "No. Every template is coded by the studio. You personalize the words, photos and music inside a template you choose.",
  },
  {
    question: "What can I edit?",
    answer:
      "Each template lists exactly what's editable — names, messages, dates, photos, memories, reasons, open-when messages, music, letters. The visual editor adapts to the template you pick.",
  },
  {
    question: "Is my keepsake private?",
    answer:
      "Yes. Your love keepsake lives at a private secret link meant only for the two of you.",
  },
  {
    question: "How do I pay & get my keepsake?",
    answer:
      "You can pay securely through Razorpay using the payment options available at checkout. Once your payment is successfully completed and confirmed, you'll get access to create your personalized LoveCrafted keepsake.",
  },
];

const DEMO_SUITES = TEMPLATE_SUITES.filter((suite) => !suite.archived);

const SECTION_REVEAL = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.55, ease: "easeOut" },
};

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-[#0a0507] text-[#f5e6d3] font-sans antialiased selection:bg-[#d48b95]/30 selection:text-[#f5e6d3]">
      {/* ---------- Hero Section ---------- */}
      <section className="relative overflow-hidden bg-luxe-radial pt-16 pb-24 lg:pt-28 lg:pb-36">
        <div
          className="pointer-events-none absolute -left-40 top-10 size-[32rem] rounded-full opacity-30 blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(212,139,149,0.35), transparent 70%)" }}
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
          {/* Hero Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-7"
          >
            {/* Pill Eyebrow */}
            <span className="inline-flex items-center gap-2 rounded-full border border-[#dfc19c]/30 bg-[#140a0f]/80 px-4 py-1.5 text-[0.65rem] tracking-[0.25em] uppercase font-semibold text-[#dfc19c]">
              <Sparkles className="size-3.5 text-[#e8b4b8]" />
              HANDCRAFTED ROMANTIC KEEPSAKES
            </span>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-[4.25rem] font-medium leading-[1.08] tracking-tight text-white">
              Turn your memories{" "}
              <span className="block italic text-[#e8b4b8] font-normal mt-1">
                into a digital keepsake they&apos;ll never forget.
              </span>
            </h1>

            {/* Paragraph */}
            <p className="max-w-xl text-base leading-relaxed text-[#c5b0a5] sm:text-lg">
              Choose a handcrafted romantic template, customize your love letter, open-when notes,
              memory gallery and background songs in real-time — no designer needed.
            </p>

            {/* Pill CTA Bar */}
            <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-[#dfc19c]/15 bg-[#140a0f]/70 p-2.5 backdrop-blur-xl sm:flex-row sm:items-center sm:rounded-full max-w-xl">
              <Link
                to="/marketplace"
                className="group relative inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#d48b95] px-7 text-sm font-medium text-[#0a0507] transition-all duration-300 hover:bg-[#e8b4b8] hover:shadow-[0_0_25px_rgba(212,139,149,0.35)] sm:w-auto"
              >
                <span>Explore the collection</span>
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <p className="px-4 text-center text-xs text-[#c5b0a5] sm:text-left">
                Handcrafted romantic keepsakes <span className="mx-2 text-[#dfc19c]/30">|</span> Live customisation studio
              </p>
            </div>
          </motion.div>

          {/* Hero Right Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:col-span-5"
          >
            <div className="relative overflow-hidden rounded-3xl border border-[#dfc19c]/20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)]">
              <img
                src={HERO_IMAGE}
                alt="Handcrafted romantic keepsake"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0507]/80 via-transparent to-transparent" />
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-4 rounded-2xl border border-[#dfc19c]/20 bg-[#140a0f]/90 p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:-left-8 max-w-xs">
              <p className="text-[0.65rem] tracking-[0.25em] uppercase font-semibold text-[#dfc19c]/70">
                OUR LOVE KEEPSAKE
              </p>
              <p className="mt-2 font-serif text-lg font-medium text-[#f5e6d3]">You &amp; Me</p>
              <p className="mt-1 text-xs text-[#c5b0a5]">Together Since 08 Jan — Forever &amp; Always</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- How It Works Section ---------- */}
      <motion.section
        {...SECTION_REVEAL}
        className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24"
      >
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#dfc19c]/20 bg-[#140a0f] px-3.5 py-1 text-[0.65rem] tracking-[0.25em] uppercase font-semibold text-[#dfc19c]">
            HOW IT WORKS
          </span>
          <h2 className="font-serif mt-5 text-3xl sm:text-4xl text-[#f5e6d3] font-medium">
            Three quiet steps
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((stepItem, index) => (
            <motion.div
              key={stepItem.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.08 }}
              whileHover={{ y: -5 }}
              className="rounded-2xl border border-[#dfc19c]/15 bg-[#140a0f]/80 p-8 backdrop-blur-xl transition-all duration-300 hover:border-[#e8b4b8]/30 hover:shadow-[0_0_30px_rgba(212,139,149,0.15)] space-y-5"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-medium text-[#c5b0a5]">{stepItem.step}</span>
                <span className="grid size-9 place-items-center rounded-full border border-[#dfc19c]/25 bg-[#1b0e15] text-[#e8b4b8]">
                  <stepItem.icon className="size-4" />
                </span>
              </div>
              <h3 className="font-serif text-xl text-[#f5e6d3] font-medium">{stepItem.title}</h3>
              <p className="text-xs leading-relaxed text-[#c5b0a5]">{stepItem.body}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ---------- Why Us Section ---------- */}
      <motion.section
        {...SECTION_REVEAL}
        className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          {/* Left Text */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#dfc19c]/20 bg-[#140a0f] px-3.5 py-1 text-[0.65rem] tracking-[0.25em] uppercase font-semibold text-[#dfc19c]">
              WHY US
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-medium leading-[1.1]">
              Made by one person.{" "}
              <span className="block italic text-[#e8b4b8] font-normal mt-1">For one person.</span>
            </h2>
            <p className="text-sm leading-relaxed text-[#c5b0a5]">
              Every design here is crafted by hand. No generic drag-and-drop themes. No filler features.
              Every interaction, animation and typographic detail is chosen because this is never just a website —
              it is a living emotion, a love letter, and a timeless keepsake to cherish forever.
            </p>
          </div>

          {/* Right 2x2 Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHY_US_CARDS.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="rounded-2xl border border-[#dfc19c]/15 bg-[#140a0f]/80 p-6 backdrop-blur-xl space-y-3 hover:border-[#e8b4b8]/30 transition-colors"
              >
                <span className="grid size-9 place-items-center rounded-full border border-[#dfc19c]/25 bg-[#1b0e15] text-[#e8b4b8]">
                  <card.icon className="size-4" />
                </span>
                <h3 className="font-serif text-base text-[#f5e6d3] font-medium">{card.title}</h3>
                <p className="text-xs leading-relaxed text-[#c5b0a5]">{card.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ---------- Featured Collection Section ---------- */}
      <motion.section
        {...SECTION_REVEAL}
        className="mx-auto max-w-7xl px-6 pb-20 lg:px-8 lg:pb-28"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#dfc19c]/20 bg-[#140a0f] px-3.5 py-1 text-[0.65rem] tracking-[0.25em] uppercase font-semibold text-[#dfc19c]">
              FEATURED
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#f5e6d3] font-medium">
              A small, obsessive collection
            </h2>
            <p className="max-w-xl text-xs sm:text-sm text-[#c5b0a5]">
              Every template is crafted from scratch. No dashboards full of copies. Just a few, made carefully.
            </p>
          </div>
          <Link
            to="/marketplace"
            className="group inline-flex items-center gap-2 text-xs font-medium text-[#e8b4b8] transition-colors hover:text-[#f5e6d3] shrink-0"
          >
            View all templates
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {DEMO_SUITES.map((template, index) => (
            <TemplateCard key={template.id} template={template} index={index} />
          ))}
        </div>
      </motion.section>

      {/* ---------- FAQ Accordion Section ---------- */}
      <motion.section
        {...SECTION_REVEAL}
        className="mx-auto max-w-4xl px-6 py-20 lg:px-8 lg:py-24"
      >
        <div className="text-center space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#dfc19c]/20 bg-[#140a0f] px-3.5 py-1 text-[0.65rem] tracking-[0.25em] uppercase font-semibold text-[#dfc19c]">
            FAQ
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#f5e6d3] font-medium">
            Questions people have asked
          </h2>
        </div>

        <div className="mt-12 space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-[#dfc19c]/15 bg-[#140a0f]/80 overflow-hidden backdrop-blur-xl transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="flex w-full items-center justify-between p-6 text-left font-serif text-lg font-medium text-[#f5e6d3] hover:text-[#e8b4b8] transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`size-5 text-[#dfc19c]/60 transition-transform duration-300 ${
                    openFaq === index ? "rotate-180 text-[#e8b4b8]" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-[#dfc19c]/10 px-6 pb-6 pt-3 text-sm leading-relaxed text-[#c5b0a5]">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ---------- Closing Section ---------- */}
      <motion.section
        {...SECTION_REVEAL}
        className="mx-auto max-w-3xl px-6 py-20 text-center lg:px-8"
      >
        <Heart className="mx-auto size-6 text-[#d48b95]" />
        <h2 className="font-serif mt-6 text-3xl sm:text-4xl text-[#f5e6d3]">
          Your love story deserves a digital keepsake.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#c5b0a5]">
          Pick a suite, open the studio, and create a heartfelt romantic keepsake before your coffee cools.
        </p>
        <div className="mt-10">
          <Link
            to="/marketplace"
            className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#d48b95] px-8 text-sm font-medium text-[#0a0507] transition-all hover:bg-[#e8b4b8] hover:shadow-[0_0_30px_rgba(212,139,149,0.4)]"
          >
            Explore the collection
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
