import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Key, Copy, Check, ExternalLink, ShieldCheck, Heart, Sparkles } from "lucide-react";

export default function ActivatePage() {
    const [inputUrl, setInputUrl] = useState("");
    const [activeUrl, setActiveUrl] = useState("");
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const handleActivate = (e) => {
        if (e && e.preventDefault) e.preventDefault();

        if (!inputUrl.trim()) {
            setError("Please paste a customer's draft link or URL string.");
            return;
        }

        setError("");

        try {
            let rawUrl = inputUrl.trim();
            
            // If user enters just a slug (e.g., lalit-and-puja)
            if (!rawUrl.includes("http") && !rawUrl.includes("/v/")) {
                const origin = typeof window !== "undefined" ? window.location.origin : "https://lovecrafted-official.netlify.app";
                rawUrl = `${origin}/v/${rawUrl}?slug=sunset-love`;
            }

            const urlObj = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`);
            urlObj.searchParams.set("active", "true");
            urlObj.searchParams.set("verified", "1");

            setActiveUrl(urlObj.toString());
        } catch {
            // Fallback string manipulation
            let fixed = inputUrl.trim();
            if (!fixed.includes("active=true")) {
                fixed += fixed.includes("?") ? "&active=true" : "?active=true";
            }
            setActiveUrl(fixed);
        }
    };

    const handleCopy = () => {
        if (navigator.clipboard) navigator.clipboard.writeText(activeUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#0e060b] text-white flex flex-col items-center justify-center p-6">
            <div className="bg-[#181114] border border-pink-500/30 rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6 text-center relative overflow-hidden">
                <div className="w-14 h-14 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 flex items-center justify-center mx-auto shadow-inner">
                    <Key size={26} className="text-pink-400" />
                </div>

                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold mb-2">
                        <ShieldCheck size={13} /> Studio Owner Control Panel
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                        Link Activation Tool
                    </h2>
                    <p className="text-stone-400 text-xs mt-1">
                        Paste any customer's draft link below to instantly generate their verified active live link after verifying ₹1,999 in your bank account.
                    </p>
                </div>

                <form onSubmit={handleActivate} className="space-y-4 text-left">
                    <div>
                        <label className="block text-xs font-semibold text-stone-300 mb-1">
                            Paste Customer's Draft Link or URL *
                        </label>
                        <textarea
                            rows={3}
                            placeholder="e.g. https://lovecrafted-official.netlify.app/v/lalit-and-puja?slug=aurora-sample&d=..."
                            value={inputUrl}
                            onChange={(e) => {
                                setInputUrl(e.target.value);
                                if (e.target.value.trim()) setError("");
                            }}
                            className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs font-mono text-white focus:outline-none focus:border-pink-500"
                        />
                        {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full lws-btn-primary py-3 flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer shadow-lg"
                    >
                        <Sparkles size={16} /> Generate Active Live Link
                    </button>
                </form>

                {activeUrl && (
                    <div className="bg-black/80 border border-emerald-500/40 rounded-2xl p-4 text-left space-y-3 animate-fadeIn">
                        <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold">
                            <span className="flex items-center gap-1">
                                <Check size={14} /> Activated Live Link Ready!
                            </span>
                            <span className="bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30 text-[10px]">
                                Verified
                            </span>
                        </div>

                        <div className="text-xs font-mono text-neutral-200 break-all bg-neutral-900/90 p-3 rounded-xl border border-white/10 select-all">
                            {activeUrl}
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="lws-btn-primary text-xs py-2 px-3 flex-1 justify-center cursor-pointer"
                            >
                                {copied ? (
                                    <>
                                        <Check size={14} /> Copied to Clipboard!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={14} /> Copy Active Link
                                    </>
                                )}
                            </button>

                            <a
                                href={activeUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="lws-btn-ghost text-xs py-2 px-3 flex-1 justify-center border border-white/10 hover:bg-white/10 flex items-center gap-1 cursor-pointer"
                            >
                                <ExternalLink size={14} /> Test Live Site
                            </a>
                        </div>
                    </div>
                )}

                <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs text-stone-500">
                    <Link to="/templates" className="hover:text-pink-300 transition-colors">
                        ← Back to Templates
                    </Link>
                    <span>LoveCrafted Admin System</span>
                </div>
            </div>
        </div>
    );
}
