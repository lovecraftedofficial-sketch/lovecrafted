import React, { useRef, useState } from "react";
import { EDITOR } from "@/constants/testIds";
import { ImagePlus, Trash2, Camera, Link2, Upload, Loader2, Check } from "lucide-react";
import {
    compressImageToDataUrl,
    resolveImage,
    ACCEPTED_IMAGE_EXT,
} from "@/editor/utils/imageUtils";
import { toast } from "sonner";

export default function ImageFieldEditor({ field, value, onChange }) {
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [urlDraft, setUrlDraft] = useState("");

    const src = resolveImage(value);
    const testKey = field?.key || "image";

    const handleFilePick = async (e) => {
        const file = e.target.files && e.target.files[0];
        e.target.value = "";
        if (!file) return;

        setIsUploading(true);
        try {
            const dataUrl = await compressImageToDataUrl(file);
            onChange(dataUrl);
            setShowUrlInput(false);
            toast.success("Photo uploaded from device! 📸");
        } catch (err) {
            toast.error(err.message || "Failed to load image from device");
        } finally {
            setIsUploading(false);
        }
    };

    const handleApplyUrl = (e) => {
        e?.preventDefault();
        if (urlDraft.trim()) {
            onChange(urlDraft.trim());
            toast.success("Image link updated! 🔗");
            setShowUrlInput(false);
            setUrlDraft("");
        }
    };

    const handleRemove = () => {
        onChange("");
        setShowUrlInput(false);
    };

    return (
        <div data-testid={EDITOR.field.image(testKey)} className="space-y-2.5">
            {/* Image Preview / Empty Container */}
            <div className="relative rounded-2xl overflow-hidden border border-[#dfc19c]/20 bg-[#12080f] shadow-inner group">
                {src ? (
                    <div className="relative aspect-[16/10] sm:aspect-video w-full bg-black/40 overflow-hidden flex items-center justify-center">
                        <img
                            src={src}
                            alt="Preview"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <span className="text-[10px] text-[#f5e6d3] tracking-wide truncate max-w-full">
                                {typeof value === "string" && value.startsWith("data:")
                                    ? "📱 Photo uploaded from local device"
                                    : (typeof value === "string" ? value : "Custom Photo")}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-2 bg-[#140a10]/50">
                        <div className="size-10 rounded-full bg-[#dfc19c]/10 text-[#dfc19c] flex items-center justify-center">
                            <Camera size={20} className="text-[#dfc19c]" />
                        </div>
                        <p className="text-xs text-[#c5b0a5]/70 font-sans">
                            No photo chosen yet. Upload directly from your phone or paste a link.
                        </p>
                    </div>
                )}

                {/* Primary Dual Actions Bar */}
                <div className="p-2.5 bg-[#0e060c] border-t border-[#dfc19c]/15 flex flex-wrap items-center gap-2">
                    {/* 1. Upload from Phone / Device Gallery Button */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex-1 min-w-[140px] h-9 px-3 rounded-xl bg-gradient-to-r from-[#e8b4b8] to-[#d48b95] text-[#0a0507] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 size={13} className="animate-spin" />
                                <span>Compressing...</span>
                            </>
                        ) : (
                            <>
                                <Upload size={13} />
                                <span>{src ? "Replace from Device" : "Upload from Device"}</span>
                            </>
                        )}
                    </button>

                    {/* 2. Toggle Image Link Input */}
                    <button
                        type="button"
                        onClick={() => {
                            setShowUrlInput(!showUrlInput);
                            if (!showUrlInput && typeof value === "string" && !value.startsWith("data:")) {
                                setUrlDraft(value);
                            }
                        }}
                        className={`h-9 px-3 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                            showUrlInput
                                ? "border-[#dfc19c] bg-[#dfc19c]/20 text-white"
                                : "border-[#dfc19c]/20 bg-[#160b11] text-[#c5b0a5] hover:text-[#f5e6d3] hover:border-[#dfc19c]/40"
                        }`}
                        title="Paste or edit an online image URL"
                    >
                        <Link2 size={13} />
                        <span className="hidden xs:inline">Paste Link</span>
                    </button>

                    {/* 3. Remove Button (if image exists) */}
                    {src && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="h-9 px-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 text-xs font-medium flex items-center justify-center transition-colors cursor-pointer"
                            title="Remove Photo"
                        >
                            <Trash2 size={13} />
                        </button>
                    )}

                    {/* Hidden Native File Input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={ACCEPTED_IMAGE_EXT.join(",")}
                        onChange={handleFilePick}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Optional URL Paste Form Drawer */}
            {showUrlInput && (
                <div className="p-3 rounded-xl bg-[#12080f] border border-[#dfc19c]/25 space-y-2 animate-fadeIn">
                    <label className="text-[11px] text-[#dfc19c] font-medium block">
                        Paste Web Image Link (Unsplash, Pinterest, etc.):
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="url"
                            value={urlDraft}
                            onChange={(e) => setUrlDraft(e.target.value)}
                            placeholder="https://images.unsplash.com/photo-..."
                            className="flex-1 h-9 px-3 rounded-lg bg-[#0a0507] border border-[#dfc19c]/20 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#e8b4b8]"
                            onKeyDown={(e) => e.key === "Enter" && handleApplyUrl(e)}
                        />
                        <button
                            type="button"
                            onClick={handleApplyUrl}
                            className="h-9 px-3 rounded-lg bg-[#dfc19c] hover:bg-[#e8b4b8] text-[#0a0507] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                            <Check size={13} /> Set
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
