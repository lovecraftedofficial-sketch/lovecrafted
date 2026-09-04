import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Edit3,
  Eye,
  Heart,
  Plus,
  Send,
  Sparkles,
  Clock,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PublishModal from "../components/PublishModal";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isPublishOpen, setIsPublishOpen] = useState(false);

  // Load user's actual customized keepsake draft
  const [keepsakeDraft, setKeepsakeDraft] = useState({
    slug: "aurora-noire",
    partner1: "Kabir",
    partner2: "Ananya",
    title: "Kabir & Ananya",
    subtitle: "ANNIVERSARY EDITION · DIGITAL KEEPSAKE",
    anniversaryDate: "2023-11-24",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    lastEdited: "Active Draft",
  });

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem("lws:draft:aurora-noire") ||
        localStorage.getItem("lws:draft:aurora-noire:demo");
      if (saved) {
        const parsed = JSON.parse(saved);
        setKeepsakeDraft((prev) => ({
          ...prev,
          partner1: parsed.partner1_name || "Kabir",
          partner2: parsed.partner2_name || "Ananya",
          title: `${parsed.partner1_name || "Kabir"} & ${parsed.partner2_name || "Ananya"}`,
          anniversaryDate: parsed.relationship_date || "2023-11-24",
          coverImage:
            parsed.memories_section1?.[0]?.image ||
            parsed.memories?.[0]?.image ||
            prev.coverImage,
          lastEdited: "Saved in Studio",
        }));
      }
    } catch (e) {
      console.warn("Could not read local draft:", e);
    }
  }, []);

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
                {user ? `WELCOME, ${user.name.toUpperCase()}` : "YOUR ATELIER STUDIO"}
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-medium text-white">
                {user ? `${user.name.split(" ")[0]}'s Keepsakes` : "Your Romantic Keepsakes"}
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-[#c5b0a5] sm:text-base">
                Customize your romantic keepsakes, revisit drafts, or publish your shareable private link.
              </p>
            </div>

            <Link
              to="/editor/aurora-noire"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e8b4b8] to-[#d48b95] px-7 text-sm font-semibold text-[#0a0507] transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,139,149,0.4)] hover:scale-[1.02] shrink-0"
            >
              <Plus className="size-4" />
              <span>Customize Keepsake</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Keepsakes Grid ---------- */}
      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Active Keepsake Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="group overflow-hidden rounded-3xl border border-[#dfc19c]/20 bg-[#140a0f]/90 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-300 hover:border-[#e8b4b8]/40"
          >
            {/* Card Image */}
            <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0609]">
              <img
                src={keepsakeDraft.coverImage}
                alt={keepsakeDraft.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#140a0f] via-transparent to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dfc19c]/25 bg-[#0a0507]/80 px-3 py-1 text-[0.65rem] uppercase tracking-wider text-[#dfc19c] backdrop-blur-md">
                  ACTIVE KEEPSAKE
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-serif text-2xl font-medium text-white">{keepsakeDraft.title}</h3>
                <p className="text-[0.65rem] tracking-[0.2em] uppercase font-semibold text-[#dfc19c]/70 mt-1">
                  {keepsakeDraft.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-[#c5b0a5]/70 border-t border-[#dfc19c]/10 pt-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-[#dfc19c]" />
                  <span>Anniversary: {keepsakeDraft.anniversaryDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3.5 text-[#e8b4b8]" />
                  <span>{keepsakeDraft.lastEdited}</span>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate(`/editor/${keepsakeDraft.slug}`)}
                  className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#dfc19c]/20 bg-[#1b0e15] text-xs font-medium text-[#f5e6d3] hover:border-[#e8b4b8] hover:text-[#e8b4b8] transition-colors cursor-pointer"
                >
                  <Edit3 className="size-3.5" />
                  <span>Edit in Studio</span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/v/${keepsakeDraft.slug}?preview=true`)}
                  className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#dfc19c]/20 bg-[#1b0e15] text-xs font-medium text-[#f5e6d3] hover:border-[#e8b4b8] hover:text-[#e8b4b8] transition-colors cursor-pointer"
                >
                  <Eye className="size-3.5" />
                  <span>Live Preview</span>
                </button>
              </div>

              {/* Publish Live Link Action */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsPublishOpen(true)}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e8b4b8] to-[#d48b95] text-xs font-semibold text-[#0a0507] hover:shadow-[0_0_20px_rgba(212,139,149,0.35)] transition-all cursor-pointer"
                >
                  <Send className="size-3.5" />
                  <span>Publish &amp; Share on WhatsApp</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Atelier Future Keepsake Placeholder Card */}
          <div className="flex flex-col items-center justify-center p-8 rounded-3xl border border-dashed border-[#dfc19c]/20 bg-[#140a0f]/40 text-center space-y-3 min-h-[350px]">
            <div className="grid size-12 place-items-center rounded-full bg-[#dfc19c]/10 text-[#dfc19c]">
              <Heart className="size-6 text-[#e8b4b8]" />
            </div>
            <h4 className="font-serif text-lg font-medium text-white">More Keepsake Editions</h4>
            <p className="text-xs text-[#c5b0a5]/70 max-w-xs leading-relaxed">
              New romantic keepsake editions (Proposal, Valentine, Birthday, Long Distance) are handcrafted by our atelier regularly.
            </p>
            <Link
              to="/marketplace"
              className="text-xs font-semibold text-[#e8b4b8] hover:underline pt-2 inline-flex items-center gap-1"
            >
              <span>Explore Collection</span>
              <Sparkles className="size-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Publish Modal */}
      <PublishModal
        isOpen={isPublishOpen}
        onClose={() => setIsPublishOpen(false)}
        templateId={keepsakeDraft.slug}
        draft={keepsakeDraft}
      />
    </div>
  );
}
