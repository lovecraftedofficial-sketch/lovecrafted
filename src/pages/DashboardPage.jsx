import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PenLine, Eye, Plus, Clock, Send, Sparkles, X } from "lucide-react";
import { DASHBOARD } from "@/constants/testIds";
import { listShippableTemplates, getTemplate } from "@/data/templateRegistry";
import PublishModal from "@/components/PublishModal";

export default function DashboardPage() {
    const shippable = listShippableTemplates();
    const [selectedDraft, setSelectedDraft] = useState(null);

    // Fictional website cards derived from registered templates.
    const mockWebsites = shippable.map((t, i) => ({
        id: `demo-${t.config.slug}`,
        title: `Website Draft ${i + 1}`,
        templateSlug: t.config.slug,
        status: "Draft Saved",
        lastEdited: "just now",
    }));

    return (
        <div data-testid={DASHBOARD.root} className="max-w-6xl mx-auto px-6 py-12 md:py-16">
            <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
                <div>
                    <div className="lws-pill mb-4 flex items-center gap-1.5">
                        <Sparkles size={12} /> Your Studio
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl">
                        <span className="lws-gradient-text">Your websites</span>
                    </h1>
                    <p className="text-[color:var(--lws-text-muted)] mt-2">
                        Customize your romantic website drafts or request your final shareable live link.
                    </p>
                </div>
                <Link
                    to="/templates"
                    data-testid={DASHBOARD.newSiteBtn}
                    className="lws-btn-primary text-sm flex items-center gap-1.5"
                >
                    <Plus size={14} /> Create a new website
                </Link>
            </div>

            {mockWebsites.length === 0 ? (
                <div data-testid={DASHBOARD.empty} className="lws-card p-14 text-center">
                    <div className="font-display text-2xl mb-2 lws-gradient-text">
                        No websites yet
                    </div>
                    <p className="text-[color:var(--lws-text-muted)] mb-6">
                        Pick a template from the marketplace to begin.
                    </p>
                    <Link to="/templates" className="lws-btn-primary">
                        Browse templates
                    </Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockWebsites.map((w) => {
                        const t = getTemplate(w.templateSlug);
                        return (
                            <article
                                key={w.id}
                                data-testid={DASHBOARD.websiteCard(w.id)}
                                className="lws-card overflow-hidden flex flex-col"
                            >
                                <div className="aspect-[16/10] bg-[color:var(--lws-surface-2)] overflow-hidden relative">
                                    {t?.config.coverImage && (
                                        <img
                                            src={t.config.coverImage}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <h3 className="font-display text-xl lws-gradient-text">
                                            {w.title}
                                        </h3>
                                        <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border border-[color:var(--lws-border-strong)] text-[color:var(--lws-pink)]">
                                            {w.status}
                                        </span>
                                    </div>
                                    <p className="text-xs uppercase tracking-widest text-[color:var(--lws-text-dim)] mb-4">
                                        {t?.config.name || w.templateSlug}
                                    </p>
                                    <div className="text-xs text-[color:var(--lws-text-dim)] flex items-center gap-2 mb-5">
                                        <Clock size={12} /> Last edited {w.lastEdited}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-auto flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/dashboard/websites/${w.templateSlug}/edit`}
                                                data-testid={DASHBOARD.editBtn(w.id)}
                                                className="lws-btn-ghost text-xs flex-1 justify-center py-2"
                                            >
                                                <PenLine size={13} /> Edit
                                            </Link>
                                            <Link
                                                to={`/templates/${w.templateSlug}`}
                                                data-testid={DASHBOARD.previewBtn(w.id)}
                                                className="lws-btn-ghost text-xs flex-1 justify-center py-2"
                                            >
                                                <Eye size={13} /> Preview
                                            </Link>
                                        </div>

                                        <button
                                            onClick={() => setSelectedDraft(w)}
                                            className="lws-btn-primary text-xs w-full justify-center py-2 flex items-center gap-1.5"
                                        >
                                            <Send size={13} /> Publish & Get Live Link
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            {/* ORDER & PAYMENT MODAL */}
            <PublishModal
                isOpen={!!selectedDraft}
                onClose={() => setSelectedDraft(null)}
                templateSlug={selectedDraft?.templateSlug}
                draftTitle={selectedDraft?.title}
                customContent={(() => {
                    if (!selectedDraft) return {};
                    try {
                        const raw = localStorage.getItem(`lws:draft:${selectedDraft.templateSlug}:demo`);
                        return raw ? JSON.parse(raw) : {};
                    } catch {
                        return {};
                    }
                })()}
            />
        </div>
    );
}