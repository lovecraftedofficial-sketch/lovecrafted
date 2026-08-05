import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    PenLine,
    Eye,
    Plus,
    Clock,
    Send,
    Sparkles,
    Search,
    Copy,
    Trash2,
    Share2,
    Check,
    AlertTriangle,
    X,
    Lock,
    Unlock,
    ExternalLink,
    CreditCard,
    FileText
} from "lucide-react";
import { DASHBOARD } from "@/constants/testIds";
import { listShippableTemplates, getTemplate } from "@/data/templateRegistry";
import { getOccasionBySlug } from "@/constants/occasions";
import PublishModal from "@/components/PublishModal";
import ShareModal from "@/components/ShareModal";

export default function DashboardPage() {
    const navigate = useNavigate();
    const shippable = listShippableTemplates();

    // Gift cards state persisted locally
    const [gifts, setGifts] = useState(() => {
        const stored = localStorage.getItem("lws:user_gifts");
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                /* ignore */
            }
        }
        // Fallback default starter drafts
        return shippable.slice(0, 3).map((t, i) => ({
            id: `gift-${t.config.slug}-${i}`,
            title: i === 0 ? "Anniversary Memory Website" : i === 1 ? "Special Proposal Keepsake" : "Our Love Story",
            templateSlug: t.config.slug,
            occasionSlug: (t.config.occasions && t.config.occasions[0]) || t.config.category.toLowerCase(),
            status: i === 0 ? "Published" : "Draft",
            paymentStatus: i === 0 ? "paid" : "unpaid",
            invoiceRef: i === 0 ? "INV-LC-8921" : null,
            slug: i === 0 ? "our-anniversary" : `story-${i}`,
            lastEdited: i === 0 ? "2 hours ago" : "Yesterday",
            createdAt: new Date().toISOString(),
        }));
    });

    const [filterTab, setFilterTab] = useState("all"); // 'all' | 'draft' | 'published'
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPublishDraft, setSelectedPublishDraft] = useState(null);
    const [selectedShareGift, setSelectedShareGift] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    // Delete Confirmation Modal State
    const [giftToDelete, setGiftToDelete] = useState(null);

    const saveGifts = (updatedGifts) => {
        setGifts(updatedGifts);
        try {
            localStorage.setItem("lws:user_gifts", JSON.stringify(updatedGifts));
        } catch {
            /* ignore */
        }
    };

    const handleDuplicateGift = (gift) => {
        const cloned = {
            ...gift,
            id: `gift-${gift.templateSlug}-${Date.now()}`,
            title: `${gift.title} (Copy)`,
            status: "Draft",
            paymentStatus: "unpaid",
            invoiceRef: null,
            slug: `${gift.slug || "story"}-copy-${Date.now().toString().slice(-4)}`,
            lastEdited: "Just now",
            createdAt: new Date().toISOString(),
        };
        const nextGifts = [cloned, ...gifts];
        saveGifts(nextGifts);
    };

    const handleTogglePublishStatus = (giftId) => {
        const nextGifts = gifts.map((g) => {
            if (g.id === giftId) {
                const nextStatus = g.status.toLowerCase() === "published" ? "Draft" : "Published";
                return { ...g, status: nextStatus, lastEdited: "Just now" };
            }
            return g;
        });
        saveGifts(nextGifts);
    };

    const handleConfirmDelete = () => {
        if (!giftToDelete) return;
        const nextGifts = gifts.filter((g) => g.id !== giftToDelete.id);
        saveGifts(nextGifts);
        setGiftToDelete(null);
    };

    const handleCopyPublicLink = (gift) => {
        const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://lovecrafted-official.netlify.app";
        const publicUrl = `${baseUrl}/story/${gift.slug || gift.id}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(publicUrl);
            setCopiedId(gift.id);
            setTimeout(() => setCopiedId(null), 2000);
        }
    };

    // Filter & Search logic
    const filteredGifts = useMemo(() => {
        return gifts.filter((g) => {
            // Filter Tab
            if (filterTab === "draft" && g.status.toLowerCase() !== "draft") return false;
            if (filterTab === "published" && g.status.toLowerCase() !== "published") return false;

            // Search Query
            if (searchQuery.trim() !== "") {
                const q = searchQuery.toLowerCase();
                const matchTitle = g.title.toLowerCase().includes(q);
                const matchTemplate = g.templateSlug.toLowerCase().includes(q);
                const matchOccasion = (g.occasionSlug || "").toLowerCase().includes(q);
                if (!matchTitle && !matchTemplate && !matchOccasion) return false;
            }

            return true;
        });
    }, [gifts, filterTab, searchQuery]);

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://lovecrafted-official.netlify.app";

    return (
        <div data-testid={DASHBOARD.root} className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-16 text-white">
            {/* Custom Delete Confirmation Modal */}
            {giftToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 relative">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                <AlertTriangle size={22} />
                            </div>
                            <div>
                                <h3 className="font-serif text-lg font-bold text-white">Delete Keepsake?</h3>
                                <p className="text-xs text-neutral-400">This action cannot be undone.</p>
                            </div>
                        </div>

                        <p className="text-xs text-neutral-300 leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                            Are you sure you want to delete "<strong className="text-white">{giftToDelete.title}</strong>"?
                        </p>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setGiftToDelete(null)}
                                className="px-4 py-2 rounded-xl text-xs font-medium bg-neutral-800 text-neutral-300 hover:bg-neutral-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                className="px-4 py-2 rounded-xl text-xs font-medium bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-colors cursor-pointer"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Studio Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <div className="lws-pill mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-300">
                        <Sparkles size={13} /> Your Studio
                    </div>
                    <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
                        <span className="lws-gradient-text">My Romantic Keepsakes</span>
                    </h1>
                    <p className="text-neutral-400 mt-2 text-xs sm:text-sm max-w-xl leading-relaxed">
                        Manage your customized website drafts, continue editing, or unlock publishing via Razorpay checkout.
                    </p>
                </div>

                <Link
                    to="/templates"
                    data-testid={DASHBOARD.newSiteBtn}
                    className="lws-btn-primary text-xs py-3 px-5 rounded-full inline-flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-transform shrink-0"
                >
                    <Plus size={16} /> Create New Keepsake
                </Link>
            </div>

            {/* Filter Tabs & Search Control Bar */}
            <div className="lws-card p-4 mb-8 bg-neutral-900/60 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Filter Tabs */}
                <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-full p-1 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={() => setFilterTab("all")}
                        className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            filterTab === "all"
                                ? "bg-rose-500 text-white shadow-md"
                                : "text-neutral-400 hover:text-white"
                        }`}
                    >
                        All Gifts ({gifts.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterTab("draft")}
                        className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            filterTab === "draft"
                                ? "bg-rose-500 text-white shadow-md"
                                : "text-neutral-400 hover:text-white"
                        }`}
                    >
                        Drafts ({gifts.filter((g) => g.status.toLowerCase() === "draft").length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilterTab("published")}
                        className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            filterTab === "published"
                                ? "bg-rose-500 text-white shadow-md"
                                : "text-neutral-400 hover:text-white"
                        }`}
                    >
                        Published ({gifts.filter((g) => g.status.toLowerCase() === "published").length})
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                    <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search gifts or occasions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 rounded-full bg-black/60 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-rose-500/50"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>
            </div>

            {/* Gift Grid or Guided Empty State */}
            {filteredGifts.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGifts.map((gift) => {
                        const templateEntry = getTemplate(gift.templateSlug);
                        const occasionObj = getOccasionBySlug(gift.occasionSlug);
                        const isPublished = gift.status.toLowerCase() === "published";
                        const isPaid = gift.paymentStatus === "paid" || isPublished;
                        const publicLink = `${baseUrl}/story/${gift.slug || gift.id}`;

                        return (
                            <article
                                key={gift.id}
                                data-testid={DASHBOARD.websiteCard(gift.id)}
                                className="lws-card overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/80 hover:border-rose-500/30 transition-all duration-300 flex flex-col group shadow-xl"
                            >
                                {/* Thumbnail Header */}
                                <div className="aspect-[16/10] bg-neutral-950 overflow-hidden relative">
                                    {templateEntry?.config?.coverImage ? (
                                        <img
                                            src={templateEntry.config.coverImage}
                                            alt={gift.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-neutral-600 text-xs">
                                            No preview cover
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                        <span
                                            className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest backdrop-blur-md border ${
                                                isPublished
                                                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                                    : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                            }`}
                                        >
                                            {isPublished ? "● Published" : "○ Draft Saved"}
                                        </span>

                                        <span
                                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide backdrop-blur-md border ${
                                                isPaid
                                                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                                    : "bg-neutral-800 text-neutral-400 border-white/10"
                                            }`}
                                        >
                                            {isPaid ? "Paid" : "Unpaid"}
                                        </span>
                                    </div>

                                    {/* Occasion Badge */}
                                    {occasionObj && (
                                        <div className="absolute bottom-3 left-3">
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/70 text-rose-300 border border-white/10 flex items-center gap-1 backdrop-blur-sm">
                                                {React.createElement(occasionObj.icon, { size: 11 })}
                                                <span>{occasionObj.name}</span>
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Body Info */}
                                <div className="p-5 flex-1 flex flex-col space-y-4">
                                    <div>
                                        <h3 className="font-serif text-lg font-bold text-white group-hover:text-rose-200 transition-colors">
                                            {gift.title}
                                        </h3>
                                        <p className="text-xs text-neutral-400 mt-1">
                                            Template: <strong className="text-neutral-300 font-medium">{templateEntry?.config?.name || gift.templateSlug}</strong>
                                        </p>
                                        {gift.invoiceRef && (
                                            <p className="text-[10px] font-mono text-emerald-300 mt-0.5 flex items-center gap-1">
                                                <FileText size={10} /> {gift.invoiceRef}
                                            </p>
                                        )}
                                    </div>

                                    <div className="text-[11px] text-neutral-400 flex items-center justify-between pt-1 border-t border-white/5">
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={12} className="text-rose-400" />
                                            <span>Last edited {gift.lastEdited}</span>
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => handleTogglePublishStatus(gift.id)}
                                            className="text-[10px] text-neutral-400 hover:text-rose-300 underline cursor-pointer"
                                        >
                                            {isPublished ? "Unpublish" : "Set Published"}
                                        </button>
                                    </div>

                                    {/* Quick Actions Grid */}
                                    <div className="pt-2 mt-auto space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link
                                                to={`/dashboard/websites/${gift.templateSlug}/edit`}
                                                data-testid={DASHBOARD.editBtn(gift.id)}
                                                className="lws-btn-ghost text-xs py-2 px-3 rounded-xl border border-white/10 hover:bg-white/10 text-neutral-200 justify-center flex items-center gap-1.5 font-medium cursor-pointer"
                                            >
                                                <PenLine size={13} className="text-rose-400" /> Edit
                                            </Link>

                                            {isPublished ? (
                                                <a
                                                    href={publicLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="lws-btn-ghost text-xs py-2 px-3 rounded-xl border border-white/10 hover:bg-white/10 text-neutral-200 justify-center flex items-center gap-1.5 font-medium cursor-pointer"
                                                >
                                                    <ExternalLink size={13} className="text-emerald-400" /> View Live
                                                </a>
                                            ) : (
                                                <Link
                                                    to={`/templates/${gift.templateSlug}`}
                                                    data-testid={DASHBOARD.previewBtn(gift.id)}
                                                    className="lws-btn-ghost text-xs py-2 px-3 rounded-xl border border-white/10 hover:bg-white/10 text-neutral-200 justify-center flex items-center gap-1.5 font-medium cursor-pointer"
                                                >
                                                    <Eye size={13} className="text-rose-400" /> Preview
                                                </Link>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {isPublished ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedShareGift(gift)}
                                                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-colors"
                                                >
                                                    <Share2 size={13} /> Share Link
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedPublishDraft(gift)}
                                                    className="flex-1 py-2 px-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-colors"
                                                >
                                                    <CreditCard size={13} /> Unlock & Publish
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => handleCopyPublicLink(gift)}
                                                title="Copy public link"
                                                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                                            >
                                                {copiedId === gift.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDuplicateGift(gift)}
                                                title="Duplicate gift"
                                                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                                            >
                                                <Copy size={13} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setGiftToDelete(gift)}
                                                title="Delete gift"
                                                className="p-2 rounded-xl bg-neutral-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 border border-white/10 transition-colors cursor-pointer"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            ) : (
                /* Guided Empty State */
                <div data-testid={DASHBOARD.empty} className="lws-card p-12 md:p-16 text-center rounded-3xl bg-neutral-900/40 border border-white/10 max-w-xl mx-auto space-y-5">
                    <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
                        <Heart size={26} className="animate-pulse fill-rose-500" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-serif text-2xl font-bold text-white">
                            No Keepsakes Found
                        </h3>
                        <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                            {searchQuery
                                ? `No romantic gifts match your search query "${searchQuery}".`
                                : "You haven't created any digital gifts yet. Pick a template from our luxury gallery to begin customizing."}
                        </p>
                    </div>

                    <div className="pt-2">
                        <Link
                            to="/templates"
                            className="lws-btn-primary text-xs py-3 px-6 rounded-full inline-flex items-center gap-2 cursor-pointer shadow-xl hover:scale-105 transition-transform"
                        >
                            <Plus size={14} /> Browse Templates & Create
                        </Link>
                    </div>
                </div>
            )}

            {/* PUBLISH & PAYMENTS MODAL */}
            <PublishModal
                isOpen={!!selectedPublishDraft}
                onClose={() => setSelectedPublishDraft(null)}
                templateSlug={selectedPublishDraft?.templateSlug}
                draftTitle={selectedPublishDraft?.title}
                customContent={(() => {
                    if (!selectedPublishDraft) return {};
                    try {
                        const raw = localStorage.getItem(`lws:draft:${selectedPublishDraft.templateSlug}:demo`);
                        return raw ? JSON.parse(raw) : {};
                    } catch {
                        return {};
                    }
                })()}
            />

            {/* SHARE MODAL */}
            <ShareModal
                isOpen={!!selectedShareGift}
                onClose={() => setSelectedShareGift(null)}
                publicUrl={selectedShareGift ? `${baseUrl}/story/${selectedShareGift.slug || selectedShareGift.id}` : ""}
                giftTitle={selectedShareGift?.title}
            />
        </div>
    );
}