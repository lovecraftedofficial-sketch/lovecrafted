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
    CheckCircle2,
    Clock,
    Sparkles,
    Heart,
    Camera,
    Calendar,
    Mail,
    MessageSquare,
    Music,
    Star,
    LayoutGrid,
    Check,
    Circle
} from "lucide-react";
import FieldRenderer from "@/editor/FieldRenderer";
import TemplateRenderer from "@/components/TemplateRenderer";

const DRAFT_KEY = (slug, siteId) => `lws:draft:${slug}:${siteId || "demo"}`;

const SECTION_DEFINITIONS = [
    {
        id: "all",
        label: "All Fields",
        icon: LayoutGrid,
        keys: [],
    },
    {
        id: "hero",
        label: "Hero & Header",
        icon: Heart,
        keys: ["partnerName", "creatorName", "heroMessage", "heroBadge", "heroTitle", "coupleNames", "relationshipDate", "quote", "accentTheme", "heroImage"],
    },
    {
        id: "memories",
        label: "Memories",
        icon: Camera,
        keys: ["card1Image", "card1Title", "card1Caption", "card2Image", "card2Title", "card2Caption", "card3Image", "card3Title", "card3Caption", "memories"],
    },
    {
        id: "timeline",
        label: "Timeline",
        icon: Calendar,
        keys: ["time1Date", "time1Title", "time1Desc", "time2Date", "time2Title", "time2Desc", "time3Date", "time3Title", "time3Desc"],
    },
    {
        id: "letter",
        label: "Love Letter",
        icon: Mail,
        keys: ["letterTitle", "letterMessage", "loveLetter"],
    },
    {
        id: "open-when",
        label: "Open-When Notes",
        icon: MessageSquare,
        keys: ["open1Title", "open1Message", "open2Title", "open2Message", "open3Title", "open3Message", "openWhenMessages"],
    },
    {
        id: "music",
        label: "Our Song & Music",
        icon: Music,
        keys: ["bgMusicUrl", "songTitle", "songUrl"],
    },
    {
        id: "notes",
        label: "Love Notes & Reasons",
        icon: Star,
        keys: ["loveNote", "loveNote1", "loveNote2", "loveNote3", "reasons"],
    },
];

export default function TemplateEditor({ templateEntry, siteId = "demo" }) {
    const config = templateEntry?.config || {};
    const slug = config.slug || "sunset-love";
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

    // Get section completion status: 'not-started' | 'in-progress' | 'completed'
    const getSectionStatus = useCallback(
        (sectionKeys) => {
            if (!sectionKeys || sectionKeys.length === 0) return "completed";
            const targetFields = schema.filter((f) => sectionKeys.includes(f.key));
            if (targetFields.length === 0) return "completed";

            let filledCount = 0;
            targetFields.forEach((f) => {
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

            if (filledCount === 0) return "not-started";
            if (filledCount === targetFields.length) return "completed";
            return "in-progress";
        },
        [schema, content]
    );

    // Filter fields based on active section
    const displayedFields = useMemo(() => {
        if (activeSection === "all") return schema;
        const currentDef = SECTION_DEFINITIONS.find((s) => s.id === activeSection);
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
        <div data-testid={EDITOR.root} className="min-h-screen flex flex-col bg-[color:var(--lws-bg,#0a0508)] text-white relative">
            {/* Custom Modern Reset Confirmation Modal */}
            {showResetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-neutral-900 border border-neutral-800 text-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-full bg-rose-500/10 text-rose-400">
                                <AlertTriangle size={20} />
                            </div>
                            <h3 className="font-serif text-lg font-semibold text-amber-100">Reset All Fields?</h3>
                        </div>
                        <p className="text-sm text-neutral-400 leading-relaxed">
                            Are you sure you want to reset all fields to default content? Any unsaved edits will be lost.
                        </p>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowResetModal(false)}
                                className="px-4 py-2 text-xs font-medium rounded-lg bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmReset}
                                className="px-4 py-2 text-xs font-medium rounded-lg bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-all"
                            >
                                Yes, Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Editor Header & Toolbar */}
            <div className="border-b border-white/10 bg-[#120910] sticky top-0 z-40 shrink-0 shadow-lg">
                <div className="max-w-[120rem] mx-auto px-4 md:px-6 py-2.5 flex items-center gap-3">
                    <Link
                        to="/dashboard"
                        data-testid={EDITOR.exitBtn}
                        className="lws-btn-ghost text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                    >
                        <ArrowLeft size={14} /> Exit
                    </Link>

                    <div className="flex-1 min-w-0 flex items-center gap-4">
                        <div>
                            <div className="text-[10px] uppercase tracking-widest text-neutral-400">
                                Editing Keepsake
                            </div>
                            <div className="font-display text-sm sm:text-base text-rose-200 font-semibold truncate">
                                {config.name || "Sunset Love"}
                            </div>
                        </div>

                        {/* Progress Tracker Pill Bar */}
                        <div className="hidden sm:flex items-center gap-2.5 bg-black/40 border border-white/10 px-3 py-1 rounded-full">
                            <div className="w-20 bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-rose-500 to-pink-400 h-full transition-all duration-500"
                                    style={{ width: `${completionPercentage}%` }}
                                />
                            </div>
                            <span className="text-[11px] font-bold text-rose-300 font-mono">
                                {completionPercentage}% Complete
                            </span>
                        </div>
                    </div>

                    {/* Save Status Indicator */}
                    <div className="hidden lg:flex items-center gap-1.5 text-xs text-neutral-400">
                        <Clock size={12} className={isSaving ? "animate-spin text-rose-400" : "text-neutral-500"} />
                        <span className="text-[11px] font-mono">{saveStatusText}</span>
                    </div>

                    {/* Mobile mode tabs */}
                    <div className="md:hidden flex gap-1 border border-white/10 rounded-full p-1 bg-black/40">
                        <button
                            type="button"
                            data-testid={EDITOR.tabsEdit}
                            onClick={() => setMobileMode("edit")}
                            className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 transition-colors ${
                                mobileMode === "edit" ? "bg-rose-500 text-white font-medium" : "text-white/60"
                            }`}
                        >
                            <PenLine size={12} /> Edit
                        </button>
                        <button
                            type="button"
                            data-testid={EDITOR.tabsPreview}
                            onClick={() => setMobileMode("preview")}
                            className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 transition-colors ${
                                mobileMode === "preview" ? "bg-rose-500 text-white font-medium" : "text-white/60"
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
                        className="lws-btn-ghost text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
                    >
                        <RotateCcw size={14} />
                        <span className="hidden md:inline">Reset</span>
                    </button>
                    <button
                        type="button"
                        onClick={save}
                        data-testid={EDITOR.saveBtn}
                        className="lws-btn-primary text-xs flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-medium shadow-md transition-all cursor-pointer"
                    >
                        <Save size={14} /> Save
                    </button>
                </div>
            </div>

            {/* Elegant Completion Celebration Banner (Appears at 100%) */}
            {completionPercentage === 100 && (
                <div className="bg-gradient-to-r from-rose-950/80 via-neutral-900 to-purple-950/80 border-b border-rose-500/30 px-4 py-2.5 animate-fadeIn">
                    <div className="max-w-[120rem] mx-auto flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2 text-rose-200">
                            <Sparkles size={16} className="text-amber-400 animate-pulse" />
                            <span className="font-semibold">🎉 Your gift is ready! Every required section is complete.</span>
                        </div>
                        <Link
                            to="/dashboard"
                            className="bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 px-3 py-1 rounded-full font-semibold transition-colors text-[11px]"
                        >
                            Ready to Publish →
                        </Link>
                    </div>
                </div>
            )}

            {/* Main Split Grid Container */}
            <div className="flex-1 grid md:grid-cols-[380px_1fr] lg:grid-cols-[420px_1fr] overflow-hidden">
                {/* Left Side Form & Guided Section Navigation */}
                <aside
                    data-testid={EDITOR.fieldsPanel}
                    className={`border-r border-white/10 bg-[#0d060b] p-4 md:p-5 space-y-5 overflow-y-auto h-[calc(100vh-65px)] ${
                        mobileMode === "edit" ? "block" : "hidden md:block"
                    }`}
                >
                    {/* Section Navigation Tabs Bar */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                            <span>Guided Sections</span>
                            <span>{completionPercentage}%</span>
                        </div>

                        {/* Horizontal Scrollable Section Selector */}
                        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none snap-x">
                            {SECTION_DEFINITIONS.map((section) => {
                                const IconComp = section.icon;
                                const isSelected = activeSection === section.id;
                                const status = getSectionStatus(section.keys);

                                // Hide section tab if template schema has no matching fields for it
                                if (
                                    section.id !== "all" &&
                                    !schema.some((f) => section.keys.includes(f.key))
                                ) {
                                    return null;
                                }

                                return (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() => setActiveSection(section.id)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 shrink-0 cursor-pointer snap-start ${
                                            isSelected
                                                ? "bg-rose-500 text-white shadow-md shadow-rose-500/20 font-semibold"
                                                : "bg-neutral-900 border border-white/10 text-neutral-300 hover:border-white/20 hover:text-white"
                                        }`}
                                    >
                                        <IconComp size={13} className={isSelected ? "text-white" : "text-rose-400"} />
                                        <span>{section.label}</span>
                                        {section.id !== "all" && (
                                            <span className="ml-0.5">
                                                {status === "completed" ? (
                                                    <CheckCircle2 size={12} className="text-emerald-400 inline" />
                                                ) : status === "in-progress" ? (
                                                    <span className="text-[10px] text-amber-400 font-bold">◐</span>
                                                ) : (
                                                    <Circle size={10} className="text-neutral-500 inline" />
                                                )}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Section Header Banner */}
                    <div className="pt-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-rose-300/80 mb-3 flex items-center justify-between">
                            <span>
                                {SECTION_DEFINITIONS.find((s) => s.id === activeSection)?.label || "Editable Content"}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-normal">
                                {displayedFields.length} field{displayedFields.length === 1 ? "" : "s"}
                            </span>
                        </div>

                        {/* Fields List */}
                        <div className="space-y-5">
                            {displayedFields.map((field) => (
                                <FieldRenderer
                                    key={field.key}
                                    field={field}
                                    value={content[field.key] ?? field.defaultValue ?? ""}
                                    onChange={(v) => updateField(field.key, v)}
                                />
                            ))}

                            {displayedFields.length === 0 && (
                                <div className="p-6 text-center rounded-2xl bg-neutral-900/50 border border-white/10 space-y-2">
                                    <Sparkles size={20} className="text-rose-400 mx-auto" />
                                    <p className="text-xs text-neutral-400">
                                        No fields in this section for the current template. Select "All Fields" above.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Right Side Sticky Live Preview */}
                <section
                    data-testid={EDITOR.previewFrame}
                    className={`h-[calc(100vh-65px)] overflow-y-auto bg-black/40 relative sticky top-16 ${
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