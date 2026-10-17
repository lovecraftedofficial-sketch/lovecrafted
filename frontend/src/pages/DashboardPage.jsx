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
  Calendar,
  Layers,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import PublishModal from "../components/PublishModal";
import { TEMPLATE_SUITES } from "../data/suitesConfig";
import { templateRegistry } from "../data/templateRegistry";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [selectedPublishSuite, setSelectedPublishSuite] = useState(null);
  const [syncedDrafts, setSyncedDrafts] = useState({});

  // Dynamic template sync: Get all published suites automatically
  const publishedSuites = TEMPLATE_SUITES.filter((s) => !s.archived);

  // Load saved local drafts for each published template
  useEffect(() => {
    const loaded = {};
    publishedSuites.forEach((suite) => {
      try {
        const saved =
          localStorage.getItem(`lws:draft:${suite.id}`) ||
          localStorage.getItem(`lws:draft:${suite.id}:demo`);

        const regData = templateRegistry[suite.id]?.config?.demoData;

        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.heroTitle === "Whispers of Love") {
            parsed.heroTitle = "Love in Bloom 🌸";
            try {
              localStorage.setItem(`lws:draft:${suite.id}`, JSON.stringify(parsed));
            } catch (err) {}
          }
          loaded[suite.id] = {
            ...suite,
            partner1: parsed.partner1_name || (parsed.heroTitle && parsed.heroTitle !== "Whispers of Love" ? parsed.heroTitle : suite.title),
            partner2: parsed.partner2_name || "",
            customTitle: (parsed.heroTitle && parsed.heroTitle !== "Whispers of Love") ? parsed.heroTitle : suite.title,
            customSubtitle: parsed.heroSubtitle || suite.subtitle,
            coverImage:
              parsed.card1Image ||
              parsed.memories_section1?.[0]?.image ||
              parsed.memories?.[0]?.image ||
              suite.image,
            lastEdited: "Saved in Studio",
            rawDraft: parsed,
          };
        } else {
          loaded[suite.id] = {
            ...suite,
            customTitle: suite.title,
            customSubtitle: regData?.heroSubtitle || suite.subtitle,
            coverImage: regData?.card1Image || suite.image,
            lastEdited: "Default Atelier Draft",
            rawDraft: regData || {},
          };
        }
      } catch (e) {
        loaded[suite.id] = { ...suite, lastEdited: "Default Draft" };
      }
    });

    setSyncedDrafts(loaded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0507] text-[#f5e6d3] font-sans antialiased selection:bg-[#d48b95]/30 selection:text-[#f5e6d3]">
      {/* ---------- Header / Hero Section ---------- */}
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
                {publishedSuites.length} active keepsakes synced. Customize your romantic suites, revisit studio drafts, or publish shareable links.
              </p>
            </div>

            <Link
              to="/marketplace"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#e8b4b8] to-[#d48b95] px-7 text-sm font-semibold text-[#0a0507] transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,139,149,0.4)] hover:scale-[1.02] shrink-0"
            >
              <Plus className="size-4" />
              <span>Explore All Templates</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Dynamic Synced Keepsakes Grid ---------- */}
      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="flex items-center justify-between pb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#dfc19c]">
            <Layers className="size-4 text-[#e8b4b8]" />
            <span>Synced Keepsake Editions ({publishedSuites.length})</span>
          </div>
          <span className="text-xs text-[#c5b0a5]/60 font-serif italic">
            Auto-syncs whenever templates are added or modified
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {publishedSuites.map((suite, index) => {
            const draftInfo = syncedDrafts[suite.id] || suite;
            const displayTitle = (draftInfo.customTitle && draftInfo.customTitle !== "Whispers of Love") ? draftInfo.customTitle : suite.title;

            return (
              <motion.div
                key={suite.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group overflow-hidden rounded-3xl border border-[#dfc19c]/20 bg-[#140a0f]/90 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-300 hover:border-[#e8b4b8]/40"
              >
                {/* Card Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0609]">
                  <img
                    src={draftInfo.coverImage || suite.image}
                    alt={displayTitle}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140a0f] via-transparent to-transparent" />

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#dfc19c]/25 bg-[#0a0507]/80 px-3 py-1 text-[0.65rem] uppercase tracking-wider text-[#dfc19c] backdrop-blur-md">
                      SYNCED SUITE
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-serif text-2xl font-medium text-white">{displayTitle}</h3>
                    <p className="text-[0.65rem] tracking-[0.2em] uppercase font-semibold text-[#dfc19c]/70 mt-1">
                      {suite.category} · {suite.tier || "FLAGSHIP"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#c5b0a5]/70 border-t border-[#dfc19c]/10 pt-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-[#dfc19c]" />
                      <span>Price: ₹{suite.price || 9}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-[#e8b4b8]" />
                      <span>{draftInfo.lastEdited || "Synced"}</span>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/editor/${suite.id}`)}
                      className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#dfc19c]/20 bg-[#1b0e15] text-xs font-medium text-[#f5e6d3] hover:border-[#e8b4b8] hover:text-[#e8b4b8] transition-colors cursor-pointer"
                    >
                      <Edit3 className="size-3.5" />
                      <span>Edit in Studio</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/v/${suite.id}?preview=true`)}
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
                      onClick={() => setSelectedPublishSuite(suite)}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e8b4b8] to-[#d48b95] text-xs font-semibold text-[#0a0507] hover:shadow-[0_0_20px_rgba(212,139,149,0.35)] transition-all cursor-pointer"
                    >
                      <Send className="size-3.5" />
                      <span>Publish Keepsake (₹{suite.price || 9})</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Atelier Placeholder Card */}
          <div className="flex flex-col items-center justify-center p-8 rounded-3xl border border-dashed border-[#dfc19c]/20 bg-[#140a0f]/40 text-center space-y-3 min-h-[350px]">
            <div className="grid size-12 place-items-center rounded-full bg-[#dfc19c]/10 text-[#dfc19c]">
              <Heart className="size-6 text-[#e8b4b8]" />
            </div>
            <h4 className="font-serif text-lg font-medium text-white">Custom Atelier Request</h4>
            <p className="text-xs text-[#c5b0a5]/70 max-w-xs leading-relaxed">
              Want a bespoke custom design? Our studio team builds custom romantic website suites on demand.
            </p>
            <Link
              to="/marketplace"
              className="text-xs font-semibold text-[#e8b4b8] hover:underline pt-2 inline-flex items-center gap-1"
            >
              <span>Explore Marketplace</span>
              <Sparkles className="size-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Publish Modal */}
      {selectedPublishSuite && (
        <PublishModal
          isOpen={!!selectedPublishSuite}
          onClose={() => setSelectedPublishSuite(null)}
          templateSlug={selectedPublishSuite.id}
          draftTitle={selectedPublishSuite.title}
          price={selectedPublishSuite.price || 9}
          draft={syncedDrafts[selectedPublishSuite.id]?.rawDraft || {}}
        />
      )}
    </div>
  );
}
