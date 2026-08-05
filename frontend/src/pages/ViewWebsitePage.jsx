import React, { useMemo } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import TemplateRenderer from "@/components/TemplateRenderer";
import UnboxingIntro from "@/components/UnboxingIntro";
import { getTemplate } from "@/data/templateRegistry";
import { Heart, Lock, Clock, Send } from "lucide-react";

export default function ViewWebsitePage() {
    const { shareId } = useParams();
    const [searchParams] = useSearchParams();

    const templateSlug = searchParams.get("slug") || "sunset-love";
    const encodedData = searchParams.get("d");

    // Payment verification security check
    const isActivated = searchParams.get("active") === "true" || searchParams.get("verified") === "1" || searchParams.get("v") === "1";

    const entry = useMemo(() => getTemplate(templateSlug), [templateSlug]);

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
        return entry?.config?.demoData || {};
    }, [shareId, templateSlug, encodedData, entry]);

    // If website is NOT activated by Owner yet, show security verification pending screen
    if (!isActivated) {
        return (
            <div className="min-h-screen bg-[#0e060b] text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-[#181114] border border-amber-500/30 rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-5 relative overflow-hidden">
                    <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mx-auto shadow-inner">
                        <Lock size={30} className="animate-pulse text-amber-400" />
                    </div>

                    <div>
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-3">
                            <Clock size={13} className="animate-spin" /> Payment Verification In Progress
                        </div>

                        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100">
                            Website Pending Owner Activation
                        </h2>
                    </div>

                    <p className="text-sm text-stone-300 leading-relaxed italic bg-black/60 p-4 rounded-2xl border border-white/10">
                        "This customized romantic experience is reserved for payment verification by <b>LoveCrafted Owner</b>. As soon as Studio Owner verifies ₹1,999 in bank account, your active live link will be emailed to you!"
                    </p>

                    <div className="space-y-3 pt-2">
                        <a
                            href="mailto:lovecrafted.official@gmail.com?subject=Payment%20Verification%20Followup"
                            className="w-full bg-rose-600 hover:bg-rose-500 text-white rounded-xl py-3 flex items-center justify-center gap-2 text-xs font-semibold shadow-lg transition-colors"
                        >
                            <Send size={14} /> Contact Owner at lovecrafted.official@gmail.com
                        </a>

                        <Link
                            to="/templates"
                            className="inline-block text-xs text-stone-400 hover:text-pink-300 transition-colors"
                        >
                            ← Return to LoveCrafted Templates
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
