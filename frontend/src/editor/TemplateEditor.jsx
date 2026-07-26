import React, { useCallback, useEffect, useMemo, useState } from "react";
import { EDITOR } from "@/constants/testIds";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, RotateCcw, Eye, PenLine, AlertTriangle } from "lucide-react";
import FieldRenderer from "@/editor/FieldRenderer";
import TemplateRenderer from "@/components/TemplateRenderer";

const DRAFT_KEY = (slug, siteId) => `lws:draft:${slug}:${siteId || "demo"}`;

/**
 * TemplateEditor
 * --------------
 * Schema-driven visual editor. Fully generic — reuses across any template.
 */
export default function TemplateEditor({ templateEntry, siteId = "demo" }) {
    const config = templateEntry?.config || {};
    const slug = config.slug || "sunset-love";
    const schema = config.editableSchema || [];

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

    // State for Custom Reset Modal Popup
    const [showResetModal, setShowResetModal] = useState(false);

    const updateField = useCallback((key, value) => {
        setContent((prev) => ({ ...prev, [key]: value }));
    }, []);

    const save = useCallback(() => {
        try {
            const cleaned = stripLocalObjectsForStorage(content);
            localStorage.setItem(DRAFT_KEY(slug, siteId), JSON.stringify(cleaned));
            setSavedAt(new Date());
        } catch (e) {
            console.error("Draft save failed", e);
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

            {/* Toolbar Header */}
            <div className="border-b border-[color:var(--lws-border)] bg-[color:var(--lws-bg-2,#120910)] sticky top-0 z-40 shrink-0">
                <div className="max-w-[120rem] mx-auto px-4 md:px-6 py-3 flex items-center gap-3">
                    <Link
                        to="/dashboard"
                        data-testid={EDITOR.exitBtn}
                        className="lws-btn-ghost text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5"
                    >
                        <ArrowLeft size={14} /> Exit
                    </Link>
                    <div className="flex-1 min-w-0">
                        <div className="text-[10px] uppercase tracking-widest text-white/40">
                            Editing template
                        </div>
                        <div className="font-display text-base text-rose-200 font-medium truncate">
                            {config.name || "Sunset Love"}
                        </div>
                    </div>

                    {/* Mobile tabs */}
                    <div className="md:hidden flex gap-1 border border-white/10 rounded-full p-1 bg-black/20">
                        <button
                            type="button"
                            data-testid={EDITOR.tabsEdit}
                            onClick={() => setMobileMode("edit")}
                            className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${
                                mobileMode === "edit"
                                    ? "bg-rose-500 text-white"
                                    : "text-white/60"
                            }`}
                        >
                            <PenLine size={12} /> Edit
                        </button>
                        <button
                            type="button"
                            data-testid={EDITOR.tabsPreview}
                            onClick={() => setMobileMode("preview")}
                            className={`text-xs px-3 py-1 rounded-full flex items-center gap-1 ${
                                mobileMode === "preview"
                                    ? "bg-rose-500 text-white"
                                    : "text-white/60"
                            }`}
                        >
                            <Eye size={12} /> Preview
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowResetModal(true)}
                        data-testid={EDITOR.resetBtn}
                        className="lws-btn-ghost text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5"
                    >
                        <RotateCcw size={14} />
                        <span className="hidden md:inline">Reset</span>
                    </button>
                    <button
                        type="button"
                        onClick={save}
                        data-testid={EDITOR.saveBtn}
                        className="lws-btn-primary text-xs flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-medium shadow-md transition"
                    >
                        <Save size={14} /> Save
                    </button>
                </div>
                {savedAt && (
                    <div className="max-w-[120rem] mx-auto px-4 md:px-6 pb-2 text-[11px] text-white/40">
                        Draft saved locally · {savedAt.toLocaleTimeString()}
                    </div>
                )}
            </div>

            {/* Main Split Grid Container */}
            <div className="flex-1 grid md:grid-cols-[380px_1fr] lg:grid-cols-[420px_1fr] overflow-hidden">
                {/* Left Side Form Fields */}
                <aside
                    data-testid={EDITOR.fieldsPanel}
                    className={`border-r border-[color:var(--lws-border)] bg-[#0d060b] p-4 md:p-6 space-y-6 overflow-y-auto h-[calc(100vh-65px)] ${
                        mobileMode === "edit" ? "block" : "hidden md:block"
                    }`}
                >
                    <h2 className="text-xs font-bold uppercase tracking-wider text-rose-300/80 mb-4">
                        Editable Content
                    </h2>

                    {schema.map((field) => (
                        <FieldRenderer
                            key={field.key}
                            field={field}
                            value={content[field.key] ?? field.defaultValue ?? ""}
                            onChange={(v) => updateField(field.key, v)}
                        />
                    ))}

                    {schema.length === 0 && (
                        <p className="text-sm text-white/40">
                            This template has no editable fields configured.
                        </p>
                    )}
                </aside>

                {/* Right Side Clean Live Preview */}
                <section
                    data-testid={EDITOR.previewFrame}
                    className={`h-[calc(100vh-65px)] overflow-y-auto bg-black/40 relative ${
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