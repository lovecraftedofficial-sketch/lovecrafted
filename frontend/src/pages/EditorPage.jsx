import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import TemplateEditor from "@/editor/TemplateEditor";
import { getTemplate } from "@/data/templateRegistry";
import { Send, X, Sparkles } from "lucide-react";
import PublishModal from "@/components/PublishModal";

export default function EditorPage() {
    const { slug } = useParams();
    const entry = getTemplate(slug);
    const [showPayModal, setShowPayModal] = useState(false);

    if (!entry || entry.comingSoon || !entry.component) {
        return (
            <div className="max-w-2xl mx-auto text-center py-32 px-6">
                <div className="lws-pill mb-6">Editor unavailable</div>
                <h1 className="font-display text-4xl md:text-5xl mb-4 lws-gradient-text">
                    This template isn&apos;t ready to edit
                </h1>
                <p className="text-[color:var(--lws-text-muted)] mb-8">
                    Pick a shippable template to open the visual editor.
                </p>
                <Link to="/templates" className="lws-btn-primary">
                    Browse templates
                </Link>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            {/* Top Quick Action Bar */}
            <div className="bg-[#181114]/90 backdrop-blur-md border-b border-white/10 px-6 py-2.5 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-[color:var(--lws-text-muted)] hidden sm:inline">
                        Editing Template:
                    </span>
                    <span className="text-xs font-semibold text-pink-300">
                        {entry.config?.name || slug}
                    </span>
                </div>
                <button
                    onClick={() => setShowPayModal(true)}
                    className="lws-btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5"
                >
                    <Send size={13} /> Publish & Get Live Link
                </button>
            </div>

            {/* Visual Editor */}
            <TemplateEditor templateEntry={entry} />

            {/* ORDER & PAYMENT MODAL */}
            <PublishModal
                isOpen={showPayModal}
                onClose={() => setShowPayModal(false)}
                templateSlug={slug}
                draftTitle={entry.config?.name || slug}
                customContent={(() => {
                    try {
                        const raw = localStorage.getItem(`lws:draft:${slug}:demo`);
                        return raw ? JSON.parse(raw) : {};
                    } catch {
                        return {};
                    }
                })()}
            />
        </div>
    );
}