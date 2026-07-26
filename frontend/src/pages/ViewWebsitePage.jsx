import React, { useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import TemplateRenderer from "@/components/TemplateRenderer";
import { getTemplate } from "@/data/templateRegistry";
import { Heart, Sparkles } from "lucide-react";

export default function ViewWebsitePage() {
    const { shareId } = useParams();
    const [searchParams] = useSearchParams();

    const templateSlug = searchParams.get("slug") || "sunset-love";
    const encodedData = searchParams.get("d");

    const content = useMemo(() => {
        // First try decoding from URL parameter
        if (encodedData) {
            try {
                const decodedStr = decodeURIComponent(escape(atob(decodeURIComponent(encodedData))));
                return JSON.parse(decodedStr);
            } catch (e) {
                console.error("Failed to decode URL content data", e);
            }
        }

        // Fallback to localStorage lookup by shareId
        if (shareId) {
            try {
                const storedRaw = localStorage.getItem(`lws:published:${templateSlug}:${shareId}`);
                if (storedRaw) {
                    const parsed = JSON.parse(storedRaw);
                    return parsed.content || {};
                }
            } catch {
                /* ignore */
            }

            try {
                const draftRaw = localStorage.getItem(`lws:draft:${templateSlug}:demo`);
                if (draftRaw) {
                    return JSON.parse(draftRaw);
                }
            } catch {
                /* ignore */
            }
        }

        // Fallback to default demo data for template
        const entry = getTemplate(templateSlug);
        return entry?.config?.demoData || {};
    }, [shareId, templateSlug, encodedData]);

    return (
        <div className="relative min-h-screen">
            {/* Fullscreen Render of Partner's Custom Website */}
            <TemplateRenderer templateSlug={templateSlug} content={content} />

            {/* Subtle Romantic Studio Badge at Bottom */}
            <div className="fixed bottom-4 right-4 z-50">
                <Link
                    to="/"
                    target="_blank"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/80 border border-pink-500/30 text-white/90 hover:text-pink-300 text-xs shadow-xl backdrop-blur-md transition-all hover:scale-105"
                >
                    <Heart size={13} className="text-pink-500 fill-pink-500 animate-pulse" />
                    <span>Created with <b>Love Website Studio</b></span>
                </Link>
            </div>
        </div>
    );
}
