import React, { useRef, useState } from 'react';
import { FileAudio, Link2, Upload, Trash2, Loader2, Check, Music } from 'lucide-react';
import { toast } from 'sonner';

export default function AudioUploadInput({
  value,
  onChange,
  songTitle,
  onSongTitleChange,
  label = 'Custom MP3 / Audio File',
}) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');

  const handleFilePick = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.includes('audio') && !file.name.match(/\.(mp3|m4a|wav|aac|ogg|flac)$/i)) {
      toast.error('Please select a valid audio file (.mp3, .m4a, .wav, .aac)');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const dataUrl = event.target.result;
      onChange(dataUrl);

      // Auto-extract clean song title from filename
      const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ').trim();
      if (onSongTitleChange && (!songTitle || songTitle.includes('Whispers of Love') || songTitle.includes('Sab Tera'))) {
        onSongTitleChange(rawName);
      }

      setIsUploading(false);
      setShowUrlInput(false);
      toast.success(`✨ Audio "${rawName}" uploaded from your device! 🎵`);
    };

    reader.onerror = (err) => {
      console.error('Audio upload failed:', err);
      toast.error('Could not read audio file from device.');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (e) => {
    e?.preventDefault();
    if (urlDraft.trim()) {
      onChange(urlDraft.trim());
      toast.success('Audio link updated! 🔗');
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
    <div className="space-y-3">
      {label && <label className="text-xs text-[#ffd0e0] block font-semibold">{label}</label>}

      <div className="rounded-xl overflow-hidden border border-[#ffb8ce]/25 bg-[#1f0a17] shadow-inner p-4 space-y-3">
        {/* Audio File Status Display */}
        {value ? (
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#2b0f23] border border-[#ffb8ce]/30 shadow-md">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 rounded-full bg-gradient-to-r from-[#ff7395] to-[#d81b5c] text-white flex items-center justify-center shrink-0 shadow-md">
                <Music size={18} className="animate-pulse" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate max-w-[180px] sm:max-w-xs">
                  {songTitle || 'Custom Device Song'}
                </p>
                <p className="text-[0.68rem] text-[#ffc5d5]/70 flex items-center gap-1 mt-0.5">
                  {isLocalData ? (
                    <>
                      <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Device MP3 Audio File (Saved)</span>
                    </>
                  ) : (
                    <>
                      <Link2 size={11} className="text-[#ff7395]" />
                      <span className="truncate">Direct Web MP3 Link</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="size-8 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Remove audio file"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : (
          <div className="py-5 px-4 flex flex-col items-center justify-center text-center space-y-2 bg-[#170612]/60 rounded-xl border border-dashed border-[#ffb8ce]/20">
            <div className="size-11 rounded-full bg-[#ff7395]/15 text-[#ff7395] flex items-center justify-center shadow-inner">
              <FileAudio size={22} />
            </div>
            <p className="text-xs text-[#ffc5d5]/80 font-sans max-w-xs">
              Upload any MP3 or audio file directly from your phone/computer device storage.
            </p>
          </div>
        )}

        {/* Primary File Picker Action Button */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex-1 min-w-[140px] h-10 px-4 rounded-xl bg-gradient-to-r from-[#ff7395] via-[#e61e5c] to-[#c2184b] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Reading Audio File...</span>
              </>
            ) : (
              <>
                <Upload size={15} />
                <span>{value ? 'Upload Different Audio File' : '📁 Upload Audio File from Device'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowUrlInput(!showUrlInput);
              if (!showUrlInput && typeof value === 'string' && !value.startsWith('data:')) {
                setUrlDraft(value);
              }
            }}
            className={`h-10 px-3.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              showUrlInput
                ? 'border-[#ff7395] bg-[#ff7395]/20 text-white'
                : 'border-[#ffb8ce]/20 bg-[#250d1d] text-[#ffc5d5] hover:text-white hover:border-[#ffb8ce]/40'
            }`}
            title="Or paste direct MP3 link"
          >
            <Link2 size={14} />
            <span>Paste Link</span>
          </button>

          {/* Native Mobile / Desktop File Input for Audio */}
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,.mp3,.m4a,.wav,.aac,.ogg,.flac"
            onChange={handleFilePick}
            className="hidden"
          />
        </div>
      </div>

      {/* Optional Direct Link Drawer */}
      {showUrlInput && (
        <div className="p-3 rounded-xl bg-[#170512] border border-[#ffb8ce]/30 space-y-2 animate-fadeIn">
          <label className="text-[11px] text-[#ffd0e0] font-semibold block">
            Paste Direct MP3 Audio Link:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="url"
              value={urlDraft}
              onChange={(e) => setUrlDraft(e.target.value)}
              placeholder="https://example.com/song.mp3"
              className="flex-1 h-9 px-3 rounded-lg bg-[#0e030b] border border-[#ffb8ce]/30 text-xs text-white placeholder-white/30 focus-outline-none focus:border-[#ff7395]"
              onKeyDown={(e) => e.key === 'Enter' && handleApplyUrl(e)}
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="h-9 px-3.5 rounded-lg bg-[#ff7395] hover:bg-[#d81b5c] text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
            >
              <Check size={14} /> Save Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
