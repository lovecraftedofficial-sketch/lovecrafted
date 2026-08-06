import React, { useCallback, useEffect, useMemo, useState } from "react";
import { EDITOR } from "@/constants/testIds";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Eye,
  PenLine,
  AlertTriangle,
  Clock,
  Sparkles,
  Heart,
  Camera,
  Mail,
  MessageSquare,
  Music,
  Star,
  LayoutGrid,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Volume2,
  Lock,
  Sun,
  BookOpen,
  Compass,
  Gift,
  Palette,
  Upload
} from "lucide-react";
import FieldRenderer from "@/editor/FieldRenderer";
import TemplateRenderer from "@/components/TemplateRenderer";

const DRAFT_KEY = (slug, siteId) => `lws:draft:${slug}:${siteId || "demo"}`;

/**
 * 12-CHAPTER FLAGSHIP CREATOR STUDIO SECTIONS
 */
const CHAPTER_SECTIONS = [
  {
    id: "all",
    label: "All Chapters",
    icon: LayoutGrid,
    keys: [],
  },
  {
    id: "ch1",
    label: "Ch 1 · Invitation",
    icon: Mail,
    keys: ["recipientName", "senderName", "invitationGreeting", "invitationSubtext", "envelopeAddress", "waxSealInitials"],
  },
  {
    id: "ch2",
    label: "Ch 2 · Handwritten Letter",
    icon: PenLine,
    keys: ["letterTitle", "letterContent", "letterSignature", "letterDate"],
  },
  {
    id: "ch3",
    label: "Ch 3 · Museum of Us",
    icon: Camera,
    keys: ["keepsake1Title", "keepsake1Story", "keepsake2Title", "keepsake2Story"],
  },
  {
    id: "ch4",
    label: "Ch 4 · Memory Box",
    icon: Gift,
    keys: ["boxItem1Title", "boxItem1Note"],
  },
  {
    id: "ch5",
    label: "Ch 5 · Voice Keepsakes",
    icon: Volume2,
    keys: ["voice1Title", "voice1Note"],
  },
  {
    id: "ch6",
    label: "Ch 6 · Our Song",
    icon: Music,
    keys: ["songTitle", "songStory", "lyricsExcerpt"],
  },
  {
    id: "ch7",
    label: "Ch 7 · Book of Reasons",
    icon: BookOpen,
    keys: ["reason1", "reason2"],
  },
  {
    id: "ch8",
    label: "Ch 8 · Planetarium",
    icon: Compass,
    keys: ["star1Title", "star1Note"],
  },
  {
    id: "ch9",
    label: "Ch 9 · Seasons We Shared",
    icon: Sun,
    keys: ["springLine1", "summerLine1"],
  },
  {
    id: "ch10",
    label: "Ch 10 · Open When...",
    icon: MessageSquare,
    keys: ["open1Title", "open1Message"],
  },
  {
    id: "ch11",
    label: "Ch 11 · Secret Gift",
    icon: Lock,
    keys: ["secretPassword", "secretPromise"],
  },
  {
    id: "ch12",
    label: "Ch 12 · Final Goodbye",
    icon: Heart,
    keys: ["closingTitle", "closingLine1", "closingLine2", "closingCoda"],
  },
  {
    id: "theme",
    label: "Theme & Audio Studio",
    icon: Palette,
    keys: ["bgMusicUrl"],
  },
];

export default function TemplateEditor({ templateEntry, siteId = "demo" }) {
  const config = templateEntry?.config || {};
  const slug = config.slug || "until-forever";
  const schema = useMemo(() => config.editableSchema || [], [config.editableSchema]);

  // Fallback default state built dynamically from schema keys & defaultValues
  const defaultDataFromSchema = useMemo(() => {
    const schemaDefaults = {};
    schema.forEach((f) => {
      if (f.key) schemaDefaults[f.key] = f.defaultValue || "";
    });
    return { ...schemaDefaults, ...(config.demoData || {}) };
  }, [schema, config.demoData]);

  const initialContent = useMemo(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY(slug, siteId));
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...defaultDataFromSchema, ...stripDeadLocalObjects(parsed) };
      }
    } catch {
      /* ignore */
    }
    return JSON.parse(JSON.stringify(defaultDataFromSchema || {}));
  }, [slug, siteId, defaultDataFromSchema]);

  const [content, setContent] = useState(initialContent);
  const [mobileMode, setMobileMode] = useState("edit");
  const [savedAt, setSavedAt] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("all");

  // State for Custom Reset Modal Popup
  const [showResetModal, setShowResetModal] = useState(false);

  const updateField = useCallback((key, value) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  }, []);

  const save = useCallback(() => {
    setIsSaving(true);
    try {
      const cleaned = stripLocalObjectsForStorage(content);
      localStorage.setItem(DRAFT_KEY(slug, siteId), JSON.stringify(cleaned));
      setSavedAt(new Date());
    } catch (e) {
      console.error("Draft save failed", e);
    } finally {
      setTimeout(() => setIsSaving(false), 400);
    }
  }, [content, slug, siteId]);

  const handleConfirmReset = () => {
    setContent(JSON.parse(JSON.stringify(defaultDataFromSchema || {})));
    try {
      localStorage.removeItem(DRAFT_KEY(slug, siteId));
    } catch {
      /* ignore */
    }
    setSavedAt(null);
    setShowResetModal(false);
  };

  // Keyboard shortcut: ⌘/Ctrl + S
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  // Calculate Completion Percentage across schema fields
  const completionPercentage = useMemo(() => {
    if (!schema || schema.length === 0) return 100;
    let filledCount = 0;
    schema.forEach((f) => {
      const val = content[f.key];
      if (
        val !== undefined &&
        val !== null &&
        val !== "" &&
        (typeof val !== "object" || (Array.isArray(val) ? val.length > 0 : Object.keys(val).length > 0))
      ) {
        filledCount++;
      }
    });
    return Math.min(100, Math.round((filledCount / schema.length) * 100));
  }, [schema, content]);

  // Filter fields based on active section
  const displayedFields = useMemo(() => {
    if (activeSection === "all") return schema;
    const currentDef = CHAPTER_SECTIONS.find((s) => s.id === activeSection);
    if (!currentDef || !currentDef.keys) return schema;
    return schema.filter((f) => currentDef.keys.includes(f.key));
  }, [schema, activeSection]);

  // Format Save Status Text
  const saveStatusText = useMemo(() => {
    if (isSaving) return "Saving draft...";
    if (!savedAt) return "Draft unsaved";
    const now = new Date();
    const diffSec = Math.floor((now - savedAt) / 1000);
    if (diffSec < 10) return "Saved just now";
    if (diffSec < 60) return `Saved ${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    return `Last saved ${diffMin} min ago`;
  }, [isSaving, savedAt]);

  return (
    <div data-testid={EDITOR.root} className="min-h-screen flex flex-col bg-[#080306] text-white relative font-sans">
      {/* Custom Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#14080e] border border-rose-500/30 text-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle size={20} />
              </div>
              <h3 className="font-serif text-lg font-bold text-rose-100">Reset Creator Studio?</h3>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed italic">
              Are you sure you want to reset all chapter customizations to default content?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-all cursor-pointer"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flagship Creator Studio Top Header */}
      <div className="border-b border-rose-500/20 bg-[#120509]/90 backdrop-blur-md sticky top-0 z-40 shrink-0 shadow-xl">
        <div className="max-w-[120rem] mx-auto px-4 md:px-6 py-3 flex items-center gap-3">
          <Link
            to="/dashboard"
            data-testid={EDITOR.exitBtn}
            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Dashboard
          </Link>

          <div className="flex-1 min-w-0 flex items-center gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-amber-300/80 font-mono">
                Flagship Creator Studio
              </div>
              <div className="font-serif text-base sm:text-lg text-rose-100 font-normal truncate">
                "{config.name || "Until Forever"}"
              </div>
            </div>

            {/* Progress Tracker Pill Bar */}
            <div className="hidden sm:flex items-center gap-2.5 bg-black/60 border border-rose-500/20 px-3.5 py-1.5 rounded-full">
              <div className="w-24 bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-rose-500 via-amber-400 to-rose-400 h-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-amber-300 font-mono">
                {completionPercentage}% Customized
              </span>
            </div>
          </div>

          {/* Save Status Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-neutral-400">
            <Clock size={12} className={isSaving ? "animate-spin text-rose-400" : "text-amber-400"} />
            <span className="text-[11px] font-mono">{saveStatusText}</span>
          </div>

          {/* Mobile Mode Tabs */}
          <div className="md:hidden flex gap-1 border border-rose-500/20 rounded-full p-1 bg-black/60">
            <button
              type="button"
              data-testid={EDITOR.tabsEdit}
              onClick={() => setMobileMode("edit")}
              className={`text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1 transition-colors cursor-pointer ${
                mobileMode === "edit" ? "bg-rose-600 text-white font-medium" : "text-white/60"
              }`}
            >
              <PenLine size={12} /> Studio
            </button>
            <button
              type="button"
              data-testid={EDITOR.tabsPreview}
              onClick={() => setMobileMode("preview")}
              className={`text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1 transition-colors cursor-pointer ${
                mobileMode === "preview" ? "bg-rose-600 text-white font-medium" : "text-white/60"
              }`}
            >
              <Eye size={12} /> Preview
            </button>
          </div>

          {/* Toolbar Actions */}
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            data-testid={EDITOR.resetBtn}
            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            <span className="hidden md:inline">Reset</span>
          </button>
          <button
            type="button"
            onClick={save}
            data-testid={EDITOR.saveBtn}
            className="text-xs flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold shadow-lg shadow-rose-950/50 transition-all cursor-pointer"
          >
            <Save size={14} /> Save Keepsake
          </button>
        </div>
      </div>

      {/* Main Split Grid Workspace */}
      <div className="flex-1 grid md:grid-cols-[400px_1fr] lg:grid-cols-[460px_1fr] overflow-hidden">
        {/* Left Side Flagship Chapter Editing Panel */}
        <aside
          data-testid={EDITOR.fieldsPanel}
          className={`border-r border-rose-500/15 bg-[#0e0509] p-4 md:p-6 space-y-6 overflow-y-auto h-[calc(100vh-65px)] ${
            mobileMode === "edit" ? "block" : "hidden md:block"
          }`}
        >
          {/* Chapter Selector Navigation Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-amber-300/80 font-mono">
              <span>Chapter Workspaces</span>
              <span>12 Chapters</span>
            </div>

            {/* Horizontal Scrollable Chapter Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
              {CHAPTER_SECTIONS.map((section) => {
                const IconComp = section.icon;
                const isSelected = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-serif transition-all duration-300 shrink-0 cursor-pointer snap-start ${
                      isSelected
                        ? "bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-lg shadow-rose-950/60 font-semibold"
                        : "bg-[#180911] border border-rose-500/20 text-neutral-300 hover:border-rose-400/40 hover:text-white"
                    }`}
                  >
                    <IconComp size={13} className={isSelected ? "text-white" : "text-rose-400"} />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section Fields Panel */}
          <div className="space-y-5 pt-2">
            <div className="text-xs font-mono uppercase tracking-wider text-rose-300/80 flex items-center justify-between border-b border-rose-500/15 pb-2">
              <span>
                {CHAPTER_SECTIONS.find((s) => s.id === activeSection)?.label || "Custom Memory Content"}
              </span>
              <span className="text-[10px] text-neutral-500 font-normal">
                {displayedFields.length} field{displayedFields.length === 1 ? "" : "s"}
              </span>
            </div>

            {/* Dynamic Editable Schema Fields */}
            <div className="space-y-6">
              {displayedFields.map((field) => (
                <FieldRenderer
                  key={field.key}
                  field={field}
                  value={content[field.key] ?? field.defaultValue ?? ""}
                  onChange={(v) => updateField(field.key, v)}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Right Side Sticky Live Preview */}
        <section
          data-testid={EDITOR.previewFrame}
          className={`h-[calc(100vh-65px)] overflow-y-auto bg-black relative sticky top-16 ${
            mobileMode === "preview" ? "block" : "hidden md:block"
          }`}
        >
          <div className="w-full min-h-full">
            <TemplateRenderer templateSlug={slug} content={content} />
          </div>
        </section>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ */
/* Helpers                                                      */
/* ------------------------------------------------------------ */

function isLocalObjectURL(v) {
  return v && typeof v === "object" && v.kind === "local";
}

function stripLocalObjectsForStorage(node) {
  if (Array.isArray(node)) return node.map(stripLocalObjectsForStorage);
  if (node && typeof node === "object") {
    if (isLocalObjectURL(node)) return null;
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      out[k] = stripLocalObjectsForStorage(v);
    }
    return out;
  }
  return node;
}

function stripDeadLocalObjects(node) {
  if (Array.isArray(node)) return node.map(stripDeadLocalObjects);
  if (node && typeof node === "object") {
    if (isLocalObjectURL(node)) return null;
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      out[k] = stripDeadLocalObjects(v);
    }
    return out;
  }
  return node;
}