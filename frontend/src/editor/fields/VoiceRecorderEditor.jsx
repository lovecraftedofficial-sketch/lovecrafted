import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, Trash2, Upload, Check, AlertCircle } from "lucide-react";

const ACCEPTED_FORMATS = [".mp3", ".m4a", ".aac", ".wav"];

export default function VoiceRecorderEditor({ field, value, onChange }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(typeof value === "string" ? value : value?.url || "");
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioPreviewRef = useRef(null);
  const fileInputRef = useRef(null);

  // Clean up audio preview & recording timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // Format seconds into MM:SS
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Start Browser Voice Recording
  const startRecording = async () => {
    setErrorMessage("");
    audioChunksRef.current = [];
    setRecordingTime(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
        const localBlobUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(localBlobUrl);
        onChange(localBlobUrl);

        // Stop stream tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access denied:", err);
      setErrorMessage("Microphone access permission required to record audio.");
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
  };

  // Toggle Play / Pause Audio Preview
  const togglePlayPreview = () => {
    if (!audioPreviewRef.current) return;
    if (isPlayingPreview) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      audioPreviewRef.current.play().catch(() => {});
      setIsPlayingPreview(true);
    }
  };

  // Upload Local Audio File
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!ACCEPTED_FORMATS.includes(ext)) {
      setErrorMessage(`Unsupported format. Supported: ${ACCEPTED_FORMATS.join(", ")}`);
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setAudioUrl(localUrl);
    onChange(localUrl);
    setErrorMessage("");
  };

  // Clear Audio
  const handleClear = () => {
    if (audioUrl && audioUrl.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(audioUrl);
      } catch {}
    }
    setAudioUrl("");
    onChange("");
  };

  return (
    <div className="space-y-3 bg-[#160a11] border border-rose-500/20 p-4 rounded-2xl">
      {errorMessage && (
        <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/30">
          <AlertCircle size={14} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Recording in progress banner */}
      {isRecording && (
        <div className="flex items-center justify-between bg-rose-950/60 border border-rose-500/40 p-3 rounded-xl animate-pulse">
          <div className="flex items-center gap-2 text-xs text-rose-200">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="font-mono font-bold">Recording ({formatTime(recordingTime)})</span>
          </div>

          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500 transition-colors cursor-pointer"
          >
            <Square size={12} /> Stop & Save
          </button>
        </div>
      )}

      {/* Existing / Uploaded Audio Preview Bar */}
      {audioUrl && !isRecording && (
        <div className="flex items-center justify-between bg-black/60 border border-rose-500/30 p-3 rounded-xl">
          <audio
            ref={audioPreviewRef}
            src={audioUrl}
            onEnded={() => setIsPlayingPreview(false)}
            onPause={() => setIsPlayingPreview(false)}
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={togglePlayPreview}
              className="p-2 rounded-full bg-rose-500 text-white hover:bg-rose-400 transition-colors cursor-pointer"
            >
              {isPlayingPreview ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <span className="text-xs text-rose-200 font-mono truncate max-w-[160px]">
              Voice Note Preserved
            </span>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="p-2 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {/* Primary Action Buttons */}
      {!isRecording && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={startRecording}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Mic size={14} /> Record Direct
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-2 px-3 rounded-xl bg-neutral-900 border border-rose-500/30 text-rose-200 hover:bg-neutral-800 text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Upload size={14} /> Upload Audio
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FORMATS.join(",")}
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
