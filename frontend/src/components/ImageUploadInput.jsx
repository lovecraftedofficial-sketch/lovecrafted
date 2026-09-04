import React, { useRef, useState } from 'react';
import { Camera, Link2, Upload, Trash2, Loader2, Check } from 'lucide-react';
import { compressImageToDataUrl } from '@/editor/utils/imageUtils';
import { toast } from 'sonner';

export default function ImageUploadInput({ value, onChange, label, placeholder = 'https://images.unsplash.com/photo-...' }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');

  const handleFilePick = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;

    setIsUploading(true);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      onChange(dataUrl);
      setShowUrlInput(false);
      toast.success('Photo uploaded from your device! 📸');
    } catch (err) {
      console.error('Image compression failed:', err);
      toast.error(err.message || 'Failed to process image from device');
    } finally {
      setIsUploading(false);
    }
  };

  const handleApplyUrl = (e) => {
    e?.preventDefault();
    if (urlDraft.trim()) {
      onChange(urlDraft.trim());
      toast.success('Image link updated! 🔗');
      setShowUrlInput(false);
      setUrlDraft('');
    }
  };

  const handleRemove = () => {
    onChange('');
    setShowUrlInput(false);
  };

  const isLocalData = typeof value === 'string' && value.startsWith('data:');

  return (
    <div className="space-y-2">
      {label && <label className="text-xs text-[#dfc19c]/80 block font-medium">{label}</label>}

      <div className="relative rounded-xl overflow-hidden border border-[#dfc19c]/20 bg-[#0d0609] shadow-inner">
        {/* Thumbnail Preview Area */}
        {value ? (
          <div className="relative aspect-[16/10] sm:aspect-video w-full bg-black/60 overflow-hidden flex items-center justify-center group">
            <img
              src={value}
              alt="Memory Preview"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
              <span className="text-[11px] text-[#f5e6d3] font-medium tracking-wide flex items-center gap-1.5 truncate max-w-[70%]">
                {isLocalData ? (
                  <>
                    <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Device Photo (Saved)</span>
                  </>
                ) : (
                  <>
                    <Link2 size={12} className="text-[#dfc19c]" />
                    <span className="truncate">Web Photo Link</span>
                  </>
                )}
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="size-7 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 flex items-center justify-center transition-colors cursor-pointer"
                title="Remove photo"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ) : (
          <div className="py-7 px-4 flex flex-col items-center justify-center text-center space-y-2 bg-[#140a10]/40">
            <div className="size-10 rounded-full bg-[#dfc19c]/10 text-[#dfc19c] flex items-center justify-center shadow-inner">
              <Camera size={18} className="text-[#dfc19c]" />
            </div>
            <p className="text-xs text-[#c5b0a5]/80 font-sans max-w-xs">
              Upload a special memory photo from your phone/device or paste a link below.
            </p>
          </div>
        )}

        {/* Action Controls Bar */}
        <div className="p-2.5 bg-[#12070e] border-t border-[#dfc19c]/15 flex flex-wrap items-center gap-2">
          {/* Primary: Upload from Phone / Device Gallery */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex-1 min-w-[130px] h-9 px-3 rounded-lg bg-gradient-to-r from-[#e8b4b8] to-[#d48b95] text-[#0a0507] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                <span>Compressing...</span>
              </>
            ) : (
              <>
                <Upload size={13} />
                <span>{value ? 'Change Photo' : 'Upload from Device'}</span>
              </>
            )}
          </button>

          {/* Secondary: Toggle Paste Link */}
          <button
            type="button"
            onClick={() => {
              setShowUrlInput(!showUrlInput);
              if (!showUrlInput && typeof value === 'string' && !value.startsWith('data:')) {
                setUrlDraft(value);
              }
            }}
            className={`h-9 px-3 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              showUrlInput
                ? 'border-[#dfc19c] bg-[#dfc19c]/20 text-white'
                : 'border-[#dfc19c]/20 bg-[#160b11] text-[#c5b0a5] hover:text-[#f5e6d3] hover:border-[#dfc19c]/40'
            }`}
            title="Paste or edit an online image URL"
          >
            <Link2 size={13} />
            <span>Paste Link</span>
          </button>

          {/* Hidden File Input for Mobile Device Camera/Gallery */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFilePick}
            className="hidden"
          />
        </div>
      </div>

      {/* URL Input Drawer */}
      {showUrlInput && (
        <div className="p-3 rounded-xl bg-[#0e060c] border border-[#dfc19c]/25 space-y-2 animate-fadeIn">
          <label className="text-[11px] text-[#dfc19c] font-medium block">
            Paste Web Image Link:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder={placeholder}
              className="flex-1 h-9 px-3 rounded-lg bg-[#050204] border border-[#dfc19c]/20 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#e8b4b8]"
              onKeyDown={(e) => e.key === 'Enter' && handleApplyUrl(e)}
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="h-9 px-3 rounded-lg bg-[#dfc19c] hover:bg-[#e8b4b8] text-[#0a0507] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            >
              <Check size={13} /> Save Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
