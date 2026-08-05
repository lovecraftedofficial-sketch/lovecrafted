import React, { useState } from "react";
import { X, Copy, Check, Share2, MessageCircle, QrCode, Sparkles, ExternalLink } from "lucide-react";

export default function ShareModal({ isOpen, onClose, publicUrl = "", giftTitle = "LoveCrafted Keepsake", recipientName = "" }) {
    const [copied, setCopied] = useState(false);
    const [showQrCode, setShowQrCode] = useState(false);

    if (!isOpen) return null;

    const shareText = `I created a special romantic keepsake website for ${recipientName || "you"}! Open your surprise here: ${publicUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicUrl)}`;

    const handleCopy = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(publicUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: giftTitle,
                    text: shareText,
                    url: publicUrl,
                });
            } catch {
                /* ignore cancel */
            }
        } else {
            handleCopy();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative max-w-md w-full bg-neutral-900 border border-white/15 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl overflow-hidden">
                {/* Ambient Background Glow */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <Share2 size={18} />
                        </div>
                        <div>
                            <span className="text-[10px] uppercase tracking-widest text-neutral-400 block font-semibold">
                                Published Keepsake
                            </span>
                            <h3 className="font-serif text-lg font-bold text-white">
                                Share Your Gift
                            </h3>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Public Link Box */}
                <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                        Your Unique Shareable Link
                    </label>
                    <div className="flex items-center gap-2 bg-black/60 border border-white/10 p-2.5 rounded-2xl">
                        <input
                            type="text"
                            readOnly
                            value={publicUrl}
                            className="bg-transparent text-xs font-mono text-neutral-200 focus:outline-none w-full select-all px-1"
                        />
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1 cursor-pointer transition-colors shadow-md"
                        >
                            {copied ? (
                                <>
                                    <Check size={13} /> Copied
                                </>
                            ) : (
                                <>
                                    <Copy size={13} /> Copy
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* QR Code Section (Expandable) */}
                {showQrCode ? (
                    <div className="p-4 rounded-2xl bg-black/60 border border-white/10 text-center space-y-3 animate-fadeIn">
                        <div className="bg-white p-3 rounded-xl inline-block mx-auto shadow-2xl">
                            <img src={qrCodeUrl} alt="Gift QR Code" className="w-40 h-40 mx-auto" />
                        </div>
                        <p className="text-[11px] text-neutral-400">
                            Scan with smartphone camera to open website instantly
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowQrCode(false)}
                            className="text-xs text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
                        >
                            Hide QR Code
                        </button>
                    </div>
                ) : null}

                {/* Sharing Options Grid */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="py-3 px-4 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                        <MessageCircle size={16} /> WhatsApp Share
                    </a>

                    <button
                        type="button"
                        onClick={() => setShowQrCode((v) => !v)}
                        className="py-3 px-4 rounded-2xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                        <QrCode size={16} /> QR Code
                    </button>

                    {typeof navigator !== "undefined" && navigator.share && (
                        <button
                            type="button"
                            onClick={handleNativeShare}
                            className="col-span-2 py-3 px-4 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                            <Share2 size={15} /> More Share Options (Mobile)
                        </button>
                    )}
                </div>

                {/* Visit Public Link Button */}
                <div className="pt-2">
                    <a
                        href={publicUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-white/10"
                    >
                        <ExternalLink size={14} /> Open Published Keepsake
                    </a>
                </div>
            </div>
        </div>
    );
}
