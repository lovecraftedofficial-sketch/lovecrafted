import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Edit3,
  ExternalLink,
  Eye,
  Heart,
  Plus,
  Send,
  Sparkles,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/button";

const INITIAL_DRAFTS = [
  {
    id: "draft_1",
    slug: "aurora-sample",
    title: "Website Draft 1",
    subtitle: "AURORA SAMPLE",
    templateName: "Aurora Noire Monogram",
    lastEdited: "Just now",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    status: "draft",
  },
  {
    id: "draft_2",
    slug: "sunset-love",
    title: "Website Draft 2",
    subtitle: "SUNSET LOVE",
    templateName: "Burgundy Botanica Archive",
    lastEdited: "Just now",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80",
    status: "draft",
  },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [drafts] = useState(INITIAL_DRAFTS);
  const [requestedLive, setRequestedLive] = useState({});

  const handleRequestLive = (id) => {
    setRequestedLive((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="min-h-screen bg-[#0a0507] text-[#f5e6d3] font-sans antialiased selection:bg-[#d48b95]/30 selection:text-[#f5e6d3]">
      {/* ---------- Header / Hero Section with Luxe Radial Glow ---------- */}
      <section className="relative overflow-hidden bg-luxe-radial pt-16 pb-14 lg:pt-20 lg:pb-16 border-b border-[#dfc19c]/10">
        <div
          className="pointer-events-none absolute -left-40 top-10 size-[32rem] rounded-full opacity-30 blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(212,139,149,0.35), transparent 70%)" }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#dfc19c]/30 bg-[#140a0f]/80 px-4 py-1.5 text-[0.65rem] tracking-[0.25em] uppercase font-semibold text-[#dfc19c]">
                <Sparkles className="size-3.5 text-[#e8b4b8]" />
                YOUR ATELIER STUDIO
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-medium text-white">
                Your websites
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-[#c5b0a5] sm:text-base">
                Customize your romantic website drafts or request your final shareable live link.
              </p>
            </div>

            <Link
              to="/marketplace"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#d48b95] px-7 text-sm font-medium text-[#0a0507] transition-all duration-300 hover:bg-[#e8b4b8] hover:shadow-[0_0_25px_rgba(212,139,149,0.35)] shrink-0"
            >
              <Plus className="size-4" />
              <span>Create a new website</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Drafts Grid ---------- */}
      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {drafts.map((draft) => (
            <motion.div
              key={draft.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="group overflow-hidden rounded-3xl border border-[#dfc19c]/15 bg-[#140a0f]/90 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-300 hover:border-[#e8b4b8]/30"
            >
              {/* Card Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0609]">
                <img
                  src={draft.image}
                  alt={draft.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140a0f] via-transparent to-transparent" />
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dfc19c]/25 bg-[#0a0507]/80 px-3 py-1 text-[0.65rem] uppercase tracking-wider text-[#dfc19c] backdrop-blur-md">
                    DRAFT SAVED
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-serif text-xl font-medium text-white">{draft.title}</h3>
                  <p className="text-[0.65rem] tracking-[0.2em] uppercase font-semibold text-[#dfc19c]/70 mt-1">
                    {draft.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#c5b0a5]/70 border-t border-[#dfc19c]/10 pt-4">
                  <Clock className="size-3.5 text-[#e8b4b8]" />
                  <span>Last edited {draft.lastEdited}</span>
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => navigate(`/editor/${draft.slug}`)}
                    className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#dfc19c]/20 bg-[#1b0e15] text-xs font-medium text-[#f5e6d3] hover:border-[#e8b4b8] hover:text-[#e8b4b8] transition-colors"
                  >
                    <Edit3 className="size-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/v/${draft.slug}`)}
                    className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#dfc19c]/20 bg-[#1b0e15] text-xs font-medium text-[#f5e6d3] hover:border-[#e8b4b8] hover:text-[#e8b4b8] transition-colors"
                  >
                    <Eye className="size-3.5" />
                    <span>Preview</span>
                  </button>
                </div>

                {/* Publish Live Link Action */}
                <div className="pt-2">
                  {requestedLive[draft.id] ? (
                    <div className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#e8b4b8]/40 bg-[#d48b95]/20 text-xs font-medium text-[#e8b4b8]">
                      <CheckCircle2 className="size-4 text-[#e8b4b8]" />
                      <span>Live Link Requested</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRequestLive(draft.id)}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e8b4b8] to-[#d48b95] text-xs font-semibold text-[#0a0507] hover:shadow-[0_0_20px_rgba(212,139,149,0.35)] transition-all"
                    >
                      <Send className="size-3.5" />
                      <span>Publish &amp; Get Live Link</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
