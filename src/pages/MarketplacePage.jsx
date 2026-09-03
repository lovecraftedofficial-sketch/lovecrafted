import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X, Archive, Sparkles } from "lucide-react";
import TemplateCard from "../components/TemplateCard";
import { Input } from "../components/ui/input";
import { TEMPLATE_SUITES } from "../data/suitesConfig";

const CATEGORIES = [
  "All settings",
  "Black Tie & Evening Gala",
  "Classical & Museum",
  "Coastal & Seaside",
  "Destination Wedding",
  "Estate & Villa",
  "Intimate & Micro-Wedding",
  "Metropolitan Ballroom",
  "Modern Loft & Studio",
  "Vineyard & Winery",
];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All settings");
  const [viewTab, setViewTab] = useState("published"); // "published" | "archived"

  const publishedSuites = TEMPLATE_SUITES.filter((s) => !s.archived);
  const archivedSuites = TEMPLATE_SUITES.filter((s) => s.archived);

  const currentPool = viewTab === "archived" ? archivedSuites : publishedSuites;

  const filteredSuites = currentPool.filter((suite) => {
    const matchesCategory =
      selectedCategory === "All settings" ||
      suite.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      search.trim() === "" ||
      suite.title.toLowerCase().includes(search.toLowerCase()) ||
      suite.category.toLowerCase().includes(search.toLowerCase()) ||
      suite.subtitle.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0a0507] text-[#f5e6d3] font-sans antialiased selection:bg-[#d48b95]/30 selection:text-[#f5e6d3]">
      {/* Top Header */}
      <section className="relative overflow-hidden bg-luxe-radial pt-16 pb-14 lg:pt-20 lg:pb-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-4">
          <p className="text-[0.65rem] tracking-[0.25em] uppercase font-semibold text-[#dfc19c]/70">
            THE COLLECTION
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-white font-medium">
            {viewTab === "archived"
              ? `${archivedSuites.length} archived studio draft${archivedSuites.length === 1 ? "" : "s"}.`
              : publishedSuites.length === 1
              ? "Handcrafted couture suite."
              : `${publishedSuites.length} couture invitation suites.`}
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-[#c5b0a5] sm:text-base">
            {viewTab === "archived"
              ? "These templates are safely archived. You can open, edit and publish them anytime for customer use."
              : "Each suite arrives fully composed and endlessly editable. Open the studio to make it yours."}
          </p>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div className="sticky top-20 z-40 border-y border-[#dfc19c]/15 bg-[#0a0507]/90 backdrop-blur-xl py-4">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#dfc19c]/50" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search suites, settings, moods…"
                className="h-11 border-[#dfc19c]/20 bg-[#140a0f] pl-10 text-sm text-[#f5e6d3] placeholder:text-[#c5b0a5]/50 focus-visible:border-[#e8b4b8]/50 focus-visible:ring-1 focus-visible:ring-[#e8b4b8]/50 rounded-lg"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#dfc19c]/60 hover:text-[#f5e6d3]"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              <SlidersHorizontal className="size-4 shrink-0 text-[#dfc19c]/40 mr-1 hidden sm:block" />
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`h-9 whitespace-nowrap rounded-full border px-4 text-xs font-medium tracking-wide transition-all duration-200 ${
                      selectedCategory === cat
                        ? "border-[#e8b4b8]/50 bg-[#d48b95]/20 text-[#e8b4b8] shadow-[0_0_20px_rgba(212,139,149,0.25)]"
                        : "border-[#dfc19c]/15 bg-[#140a0f]/60 text-[#c5b0a5] hover:border-[#dfc19c]/30 hover:text-[#f5e6d3]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <p className="text-xs tracking-wide text-[#c5b0a5] font-mono">
            {filteredSuites.length} beautiful occasion{filteredSuites.length === 1 ? "" : "s"}
            {viewTab === "archived" ? " (Archived Drafts)" : ""}
          </p>

          {/* Owner Published / Archive Tab Switcher */}
          <div className="inline-flex items-center rounded-full border border-[#dfc19c]/20 bg-[#140a0f] p-1 text-xs">
            <button
              type="button"
              onClick={() => setViewTab("published")}
              className={`px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                viewTab === "published"
                  ? "bg-[#d48b95] text-[#0a0507] font-semibold shadow-md"
                  : "text-[#c5b0a5] hover:text-white"
              }`}
            >
              Published ({publishedSuites.length})
            </button>
            <button
              type="button"
              onClick={() => setViewTab("archived")}
              className={`px-3.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                viewTab === "archived"
                  ? "bg-[#351824] text-[#e8b4b8] font-semibold border border-[#e8b4b8]/30"
                  : "text-[#c5b0a5] hover:text-white"
              }`}
              title="Owner view: Drafts stored safely in archive"
            >
              <Archive className="size-3 text-[#e8b4b8]" />
              <span>Archived Drafts</span>
              <span className="text-[0.65rem] px-1.5 py-0.2 rounded-full bg-[#1b0b14] border border-[#dfc19c]/20 text-[#dfc19c]">
                {archivedSuites.length}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {filteredSuites.map((suite, index) => (
            <TemplateCard key={suite.id} template={suite} index={index} />
          ))}
        </div>

        {filteredSuites.length === 0 && (
          <div className="rounded-2xl border border-[#dfc19c]/15 bg-[#140a0f] p-12 text-center my-12">
            <p className="font-serif text-xl text-[#f5e6d3]">No occasions match that filter</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All settings");
              }}
              className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-[#d48b95] px-6 text-xs font-medium text-[#0a0507] hover:bg-[#e8b4b8]"
            >
              Show all occasions
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
