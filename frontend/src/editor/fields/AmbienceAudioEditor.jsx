import React, { useState, useRef } from "react";
import { Music, Upload, Link as LinkIcon, Disc, Play, Pause, Check, AlertCircle, X } from "lucide-react";

const BUILTIN_AMBIENCES = [
  { name: "Romantic Piano", icon: "🎹", url: "/audio/romantic.mp3" },
  { name: "Soft Rain", icon: "🌧️", url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3" },
  { name: "Cozy Fireplace", icon: "🔥", url: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_9829f07ab9.mp3" },
  { name: "Ocean Waves", icon: "🌊", url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b939f1eb.mp3" },
  { name: "Night Forest", icon: "🌲", url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3" },
  { name: "Calm Instrumental", icon: "🎻", url: "https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92c21.mp3" },
];

const ACCEPTED_FORMATS = [".mp3", ".m4a", ".aac", ".wav", ".ogg"];

export default function AmbienceAudioEditor({ field, value, onChange }) {
  const currentUrl = typeof value === "string" ? value : value?.url || "/audio/romantic.mp3";

  // Mode: "library" | "upload" | "url"
  const [mode, setMode] = useState("library");
  const [urlInput, setUrlInput] = useState(currentUrl.startsWith("http") ? currentUrl : "");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);

  const fileInputRef = useRef(null);
  const previewAudioRef = useRef(null);

  // Handle Built-in Ambience Select
  const handleSelectBuiltin = (itemUrl) => {
    onChange(itemUrl);
    setErrorMessage("");
  };

  // Handle Direct File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!ACCEPTED_FORMATS.includes(ext)) {
      setErrorMessage(`Unsupported format "${ext}". Supported: ${ACCEPTED_FORMATS.join(", ")}`);
      return;
    }

    const localUrl = URL.createObjectURL(file);
    onChange(localUrl);
    setErrorMessage("");
  };

  // Handle URL Submit
  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    try {
      new URL(urlInput);
      onChange(urlInput.trim());
      setErrorMessage("");
    } catch {
      setErrorMessage("Please enter a valid HTTP/HTTPS direct MP3 audio URL.");
    }
  };

  // Toggle Live Preview
  const togglePreview = () => {
    if (!previewAudioRef.current) return;
    if (isPlayingPreview) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      previewAudioRef.current.play().catch(() => {});
      setIsPlayingPreview(true);
    }
  };

  return (
    <div className="space-y-4 bg-[#14080e] border border-rose-500/20 p-4 rounded-2xl">
      {/* Hidden Preview Audio */}
      <audio
        ref={previewAudioRef}
        src={currentUrl}
        onEnded={() => setIsPlayingPreview(false)}
        onPause={() => setIsPlayingPreview(false)}
      />

      {/* Mode Selector Tabs */}
      <div className="flex gap-1.5 bg-black/60 p-1 rounded-xl border border-rose-500/15">
        <button
          type="button"
          onClick={() => setMode("library")}
          className={`flex-1 py-1.5 text-xs font-serif rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
            mode === "library" ? "bg-rose-600 text-white font-semibold shadow-md" : "text-neutral-400 hover:text-white"
          }`}
        >
          <Disc size={12} /> Built-in Library
        </button>

        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex-1 py-1.5 text-xs font-serif rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
            mode === "upload" ? "bg-rose-600 text-white font-semibold shadow-md" : "text-neutral-400 hover:text-white"
          }`}
        >
          <Upload size={12} /> Upload MP3
        </button>

        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex-1 py-1.5 text-xs font-serif rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer ${
            mode === "url" ? "bg-rose-600 text-white font-semibold shadow-md" : "text-neutral-400 hover:text-white"
          }`}
        >
          <LinkIcon size={12} /> MP3 URL
        </button>
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/30">
          <AlertCircle size={14} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* MODE 1: BUILT-IN AMBIENCE GALLERY */}
      {mode === "library" && (
        <div className="grid grid-cols-2 gap-2">
          {BUILTIN_AMBIENCES.map((item) => {
            const isSelected = currentUrl === item.url;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => handleSelectBuiltin(item.url)}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-rose-500/20 border-rose-500 text-rose-100 font-semibold shadow-md"
                    : "bg-black/40 border-rose-500/15 text-neutral-300 hover:border-rose-400/40 hover:text-white"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-xs font-serif truncate flex-1">{item.name}</span>
                {isSelected && <Check size={14} className="text-amber-400" />}
              </button>
            );
          })}
        </div>
      )}

      {/* MODE 2: UPLOAD MP3 FILE */}
      {mode === "upload" && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-rose-500/30 hover:border-rose-500/60 rounded-2xl p-6 text-center bg-black/40 hover:bg-rose-950/20 transition-all cursor-pointer space-y-2"
        >
          <Upload size={24} className="text-rose-400 mx-auto" />
          <p className="text-xs font-serif text-rose-100">
            Click to upload your custom MP3 background ambience
          </p>
          <p className="text-[10px] text-neutral-400 font-mono">
            Supported: MP3, M4A, AAC, WAV, OGG (Max 25MB)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FORMATS.join(",")}
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {/* MODE 3: DIRECT MP3 URL */}
      {mode === "url" && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/audio/my-song.mp3"
              className="flex-1 bg-black/60 border border-rose-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-rose-500"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* LIVE PREVIEW PLAYER BAR */}
      <div className="flex items-center justify-between bg-black/80 border border-rose-500/25 p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePreview}
            className="p-2 rounded-full bg-rose-600 text-white hover:bg-rose-500 transition-colors cursor-pointer shadow-md"
          >
            {isPlayingPreview ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-amber-300 font-mono">Active Ambience</div>
            <div className="text-xs text-rose-100 font-serif truncate max-w-[180px]">
              {BUILTIN_AMBIENCES.find((b) => b.url === currentUrl)?.name || "Custom MP3 Ambience"}
            </div>
          </div>
        </div>

        <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
          <Check size={12} /> Active
        </span>
      </div>
    </div>
  );
}
