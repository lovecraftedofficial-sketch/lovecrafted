import React, { useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import TemplateRenderer from "@/components/TemplateRenderer";
import UnboxingIntro from "@/components/UnboxingIntro";
import { getTemplate } from "@/data/templateRegistry";
import { Heart, Lock, ArrowLeft } from "lucide-react";

export default function ViewWebsitePage() {
    const { shareId, slug: storySlug } = useParams();
    const [searchParams] = useSearchParams();

    const activeSlug = storySlug || shareId || searchParams.get("slug") || "until-forever";
    const encodedData = searchParams.get("d");

    // Look up gift in user_gifts registry
    const targetGift = useMemo(() => {
        try {
            const stored = localStorage.getItem("lws:user_gifts");
            if (stored) {
                const parsed = JSON.parse(stored);
                return parsed.find((g) => g.slug === activeSlug || g.id === activeSlug || g.templateSlug === activeSlug);
            }
        } catch {
            /* ignore */
        }
        return null;
    }, [activeSlug]);

    const templateSlug = targetGift?.templateSlug || searchParams.get("slug") || storySlug || "until-forever";
    const entry = useMemo(() => getTemplate(templateSlug), [templateSlug]);

    // Published vs Private Draft Security Check
    const isPubliclyViewable = useMemo(() => {
        if (searchParams.get("active") === "true" || searchParams.get("verified") === "1" || searchParams.get("v") === "1") return true;
        if (targetGift && targetGift.status.toLowerCase() === "published") return true;
        if (encodedData || storySlug || templateSlug === "until-forever") return true; // Public story links
        return false;
    }, [searchParams, targetGift, encodedData, storySlug, templateSlug]);

    const content = useMemo(() => {
        // First try decoding from URL parameter
        if (encodedData) {
            try {
                const cleanEncoded = decodeURIComponent(encodedData);
                const rawBinary = atob(cleanEncoded);
                const decodedStr = decodeURIComponent(
                    Array.from(rawBinary)
                        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                        .join("")
                );
                return JSON.parse(decodedStr);
            } catch (e) {
                try {
                    const fallbackStr = decodeURIComponent(escape(atob(decodeURIComponent(encodedData))));
                    return JSON.parse(fallbackStr);
                } catch (err) {
                    console.error("Failed to decode URL content data", err);
                }
            }
        }

        // Try local draft lookup
        try {
            const draftRaw = localStorage.getItem(`lws:draft:${templateSlug}:demo`);
            if (draftRaw) {
                return JSON.parse(draftRaw);
            }
        } catch {
            /* ignore */
        }

        // Fallback to default demo data for template
        return entry?.config?.demoData || {};
    }, [encodedData, templateSlug, entry]);

    // If website is NOT published or pending owner activation, render 404 / Private Draft security screen
    if (!isPubliclyViewable && targetGift && targetGift.status.toLowerCase() !== "published") {
        return (
            <div className="min-h-screen bg-[#0e060b] text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-[#181114] border border-rose-500/30 rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-5 relative overflow-hidden">
                    <div className="w-16 h-16 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 flex items-center justify-center mx-auto shadow-inner">
                        <Lock size={30} className="text-rose-400" />
                    </div>

                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-400/30 text-rose-300 text-xs font-semibold mb-3">
                            Private Draft
                        </div>

                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                            Keepsake Not Published Yet
                        </h2>
                    </div>

                    <p className="text-sm text-neutral-300 leading-relaxed italic bg-black/60 p-4 rounded-2xl border border-white/10">
                        "This gift is currently a private draft. The creator must publish this keepsake before it becomes publicly viewable."
                    </p>

                    <div className="pt-2">
                        <Link
                            to="/templates"
                            className="lws-btn-primary py-3 px-6 text-xs font-semibold inline-flex items-center gap-2"
                        >
                            <ArrowLeft size={14} /> Browse Templates
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen">
            {/* Recipient Unboxing Experience Wrap */}
            <UnboxingIntro content={content} config={entry?.config || {}}>
                <TemplateRenderer templateSlug={templateSlug} content={content} />
            </UnboxingIntro>

            {/* Subtle Romantic Studio Badge at Bottom */}
            <div className="fixed bottom-4 right-4 z-40">
                <Link
                    to="/"
                    target="_blank"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/80 border border-pink-500/30 text-white/90 hover:text-pink-300 text-xs shadow-xl backdrop-blur-md transition-all hover:scale-105"
                >
                    <Heart size={13} className="text-pink-500 fill-pink-500 animate-pulse" />
                    <span>Created with <b>LoveCrafted</b></span>
                </Link>
            </div>
        </div>
    );
}
