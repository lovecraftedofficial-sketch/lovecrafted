import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  Edit3,
  Eye,
  Heart,
  Image as ImageIcon,
  Mail,
  Music,
  Palette,
  Play,
  Pause,
  Plus,
  Save,
  Send,
  Sparkles,
  Trash2,
  Smile,
  Radio,
} from "lucide-react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import PublishModal from "../components/PublishModal";
import AnniversaryKeepsakeView from "../components/AnniversaryKeepsakeView";
import { resolveSongDetails } from "../services/songResolver";

import templateOccasions from "../data/templateOccasions.json";

const ACCENT_TONES = [
  { id: "rose-gold", label: "Rose Gold", hex: "#d48b95" },
  { id: "champagne", label: "Champagne", hex: "#dfc19c" },
  { id: "burgundy", label: "Burgundy", hex: "#4a0e1c" },
  { id: "emerald", label: "Emerald Noir", hex: "#11382b" },
  { id: "platinum", label: "Platinum", hex: "#e2e8f0" },
];

const FIELD_CLASS =
  "min-h-[44px] border-[#dfc19c]/20 bg-[#0d0609] text-[#f5e6d3] placeholder:text-[#c5b0a5]/50 focus-visible:border-[#e8b4b8]/50 focus-visible:ring-1 focus-visible:ring-[#e8b4b8]/50 rounded-lg";

export default function TemplateEditor() {
  const { id = "aurora-noire" } = useParams();
  const [mobileTab, setMobileTab] = useState("edit");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [proposalAccepted, setProposalAccepted] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const audioRef = useRef(null);

  // Accordion sections
  const [essentialsOpen, setEssentialsOpen] = useState(true);
  const [notesOpen, setNotesOpen] = useState(true);
  const [musicOpen, setMusicOpen] = useState(true);
  const [memories1Open, setMemories1Open] = useState(true);
  const [memories2Open, setMemories2Open] = useState(true);
  const [proposalOpen, setProposalOpen] = useState(true);
  const [accentOpen, setAccentOpen] = useState(false);

  const initialData = templateOccasions[id] || templateOccasions["aurora-noire"];
  const [draft, setDraft] = useState(initialData);

  useEffect(() => {
    if (templateOccasions[id]) {
      setDraft(templateOccasions[id]);
    }
  }, [id]);

  const activeHex = ACCENT_TONES.find((t) => t.id === draft.accent_tone)?.hex || "#d48b95";
  const update = (key, value) => setDraft((prev) => ({ ...prev, [key]: value }));

  // Helper for Spotify Track ID extraction
  const getSpotifyTrackId = (url) => {
    if (!url) return null;
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  const spotifyTrackId = getSpotifyTrackId(draft.bg_music_url);

  // Safe accessors for special notes
  const specialNotes = draft.special_notes || draft.open_when_notes || [];

  const updateSpecialNote = (index, field, value) => {
    const updated = [...specialNotes];
    updated[index] = { ...updated[index], [field]: value };
    setDraft((prev) => ({
      ...prev,
      special_notes: updated,
      open_when_notes: updated,
    }));
  };

  const addSpecialNote = () => {
    const newNote = {
      id: Date.now(),
      emoji: "❤️",
      title: "Something I Adore About You",
      content: "Write a specific sweet memory, habit, or thing you love about them...",
    };
    const updated = [...specialNotes, newNote];
    setDraft((prev) => ({
      ...prev,
      special_notes: updated,
      open_when_notes: updated,
    }));
  };

  const removeSpecialNote = (index) => {
    const updated = specialNotes.filter((_, i) => i !== index);
    setDraft((prev) => ({
      ...prev,
      special_notes: updated,
      open_when_notes: updated,
    }));
  };

  // Safe accessors for Memory Gallery 1 (Milestones)
  const memoriesSection1 =
    draft.memories_section1 || (draft.memories ? draft.memories.slice(0, 2) : []);

  const updateMemory1 = (index, field, value) => {
    const updated = [...memoriesSection1];
    updated[index] = { ...updated[index], [field]: value };
    setDraft((prev) => ({ ...prev, memories_section1: updated }));
  };

  const addMemory1 = () => {
    const newMem = {
      id: Date.now(),
      title: "Our Milestone Moment",
      caption: "Add a romantic memory caption...",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    };
    setDraft((prev) => ({
      ...prev,
      memories_section1: [...memoriesSection1, newMem],
    }));
  };

  const removeMemory1 = (index) => {
    setDraft((prev) => ({
      ...prev,
      memories_section1: memoriesSection1.filter((_, i) => i !== index),
    }));
  };

  // Safe accessors for Memory Gallery 2 (Candids)
  const memoriesSection2 =
    draft.memories_section2 || (draft.memories ? draft.memories.slice(2, 4) : []);

  const updateMemory2 = (index, field, value) => {
    const updated = [...memoriesSection2];
    updated[index] = { ...updated[index], [field]: value };
    setDraft((prev) => ({ ...prev, memories_section2: updated }));
  };

  const addMemory2 = () => {
    const newMem = {
      id: Date.now(),
      title: "Our Goofy Moment",
      caption: "Unfiltered laughter and real moments...",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    };
    setDraft((prev) => ({
      ...prev,
      memories_section2: [...memoriesSection2, newMem],
    }));
  };

  const removeMemory2 = (index) => {
    setDraft((prev) => ({
      ...prev,
      memories_section2: memoriesSection2.filter((_, i) => i !== index),
    }));
  };

  // Audio Playback Controller
  const toggleAudioPlayback = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => setIsPlayingAudio(true));
    }
  };

  const [isDetectingSong, setIsDetectingSong] = useState(false);

  const autoDetectSong = async (inputUrl) => {
    const url = (inputUrl !== undefined ? inputUrl : draft.bg_music_url || "").trim();
    if (!url) {
      toast.info("Please paste a song link (Spotify, JioSaavn, YouTube, or MP3).");
      return;
    }

    setIsDetectingSong(true);
    try {
      const songInfo = await resolveSongDetails(url);
      if (songInfo && songInfo.title) {
        update("music_title", songInfo.title);
        update("music_artist", songInfo.artist);
        if (songInfo.cover) update("music_cover", songInfo.cover);
        if (songInfo.audioUrl) update("audio_preview_url", songInfo.audioUrl);
        toast.success(`✨ Auto-detected: "${songInfo.title}" by ${songInfo.artist}!`);
      } else {
        toast.info("Song link updated! You can refine the title and singer below.");
      }
    } catch (err) {
      console.error("Auto detect failed:", err);
      toast.error("Could not fetch song details automatically. Please enter title manually.");
    } finally {
      setIsDetectingSong(false);
    }
  };

  const [isSaved, setIsSaved] = useState(false);

  const handleSaveClick = () => {
    try {
      localStorage.setItem(`lws:draft:${id}`, JSON.stringify(draft));
      localStorage.setItem(`lws:draft:${id}:demo`, JSON.stringify(draft));
      setIsSaved(true);
      toast.success("Anniversary draft saved successfully!");
      setTimeout(() => setIsSaved(false), 2500);
    } catch (e) {
      console.error(e);
      toast.error("Failed to save draft locally");
    }
  };

  const handlePublishClick = () => {
    try {
      localStorage.setItem(`lws:draft:${id}`, JSON.stringify(draft));
      localStorage.setItem(`lws:draft:${id}:demo`, JSON.stringify(draft));
    } catch {}
    setIsPublishModalOpen(true);
  };

  // Left Side Editor Form
  const editForm = (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#e8b4b8]/30 bg-[#160b11] p-4 text-center space-y-1">
        <span className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-[#e8b4b8] flex items-center justify-center gap-1.5">
          <Sparkles className="size-3" />
          {draft.occasion_badge || "🥂 Happy Anniversary Keepsake"}
        </span>
        <p className="text-xs text-[#c5b0a5] font-serif italic">Customizing Anniversary Edition for {draft.partner2_name || "Your Partner"}</p>
      </div>

      {/* SECTION 1: Warm Greeting & Playful Teasing */}
      <section className="rounded-xl border border-[#dfc19c]/15 bg-[#160b11] overflow-hidden">
        <button
          type="button"
          onClick={() => setEssentialsOpen(!essentialsOpen)}
          className="flex min-h-[52px] w-full items-center justify-between px-5 text-left font-medium text-[#f5e6d3] hover:bg-[#1f0e18]"
        >
          <span className="flex items-center gap-2.5 text-sm">
            <Heart className="size-4 text-[#e8b4b8]" />
            1. Warm Greeting &amp; Playful Teasing
          </span>
          <ChevronDown className={`size-4 text-[#dfc19c]/60 transition-transform ${essentialsOpen ? "rotate-180" : ""}`} />
        </button>

        {essentialsOpen && (
          <div className="space-y-4 border-t border-[#dfc19c]/10 px-5 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-[#dfc19c]/80">Your Name (Creator)</Label>
                <Input
                  value={draft.partner1_name || ""}
                  onChange={(e) => update("partner1_name", e.target.value)}
                  className={FIELD_CLASS}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-[#dfc19c]/80">Partner's Name</Label>
                <Input
                  value={draft.partner2_name || ""}
                  onChange={(e) => update("partner2_name", e.target.value)}
                  className={FIELD_CLASS}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-[#dfc19c]/80">Anniversary / Special Date</Label>
              <Input
                type="date"
                value={draft.relationship_date || ""}
                onChange={(e) => update("relationship_date", e.target.value)}
                className={FIELD_CLASS}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-[#dfc19c]/80">Header Badge Text</Label>
              <Input
                value={draft.occasion_badge || ""}
                onChange={(e) => update("occasion_badge", e.target.value)}
                className={FIELD_CLASS}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-[#dfc19c]/80">Playful Teasing &amp; Warm Greeting Message</Label>
              <Textarea
                rows={3}
                value={draft.greeting_teaser || draft.occasion_title || ""}
                onChange={(e) => {
                  update("greeting_teaser", e.target.value);
                  update("occasion_title", e.target.value);
                }}
                className="border-[#dfc19c]/20 bg-[#0d0609] text-[#f5e6d3] text-sm leading-relaxed rounded-lg"
                placeholder="Write a warm greeting with a playful joke or teasing..."
              />
            </div>
          </div>
        )}
      </section>

      {/* SECTION 2: Little Notes / Special Specific Things I Love About You */}
      <section className="rounded-xl border border-[#dfc19c]/15 bg-[#160b11] overflow-hidden">
        <button
          type="button"
          onClick={() => setNotesOpen(!notesOpen)}
          className="flex min-h-[52px] w-full items-center justify-between px-5 text-left font-medium text-[#f5e6d3] hover:bg-[#1f0e18]"
        >
          <span className="flex items-center gap-2.5 text-sm">
            <Sparkles className="size-4 text-[#e8b4b8]" />
            2. Little Things I Adore About You ({specialNotes.length})
          </span>
          <ChevronDown className={`size-4 text-[#dfc19c]/60 transition-transform ${notesOpen ? "rotate-180" : ""}`} />
        </button>

        {notesOpen && (
          <div className="space-y-4 border-t border-[#dfc19c]/10 px-5 py-5">
            <p className="text-xs text-[#c5b0a5]/80">
              Mention specific cute habits, inside jokes, or small things that make you fall in love with them every day:
            </p>

            {specialNotes.map((note, idx) => (
              <div key={note.id || idx} className="p-4 rounded-lg border border-[#dfc19c]/15 bg-[#0d0609] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{note.emoji || "✨"}</span>
                    <span className="text-xs font-medium text-[#e8b4b8]">Special Note #{idx + 1}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSpecialNote(idx)}
                    className="text-[#c5b0a5] hover:text-[#ff6b6b] transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <Input
                    value={note.emoji || "✨"}
                    onChange={(e) => updateSpecialNote(idx, "emoji", e.target.value)}
                    placeholder="Emoji"
                    className="col-span-1 border-[#dfc19c]/20 bg-[#160b11] text-[#f5e6d3] text-center text-xs rounded-lg"
                  />
                  <Input
                    value={note.title || ""}
                    onChange={(e) => updateSpecialNote(idx, "title", e.target.value)}
                    placeholder="Cute Habit / Thing You Love"
                    className={`col-span-3 ${FIELD_CLASS}`}
                  />
                </div>

                <Textarea
                  rows={2}
                  value={note.content || ""}
                  onChange={(e) => updateSpecialNote(idx, "content", e.target.value)}
                  placeholder="Why this habit is so special and makes you love them..."
                  className="border-[#dfc19c]/20 bg-[#160b11] text-[#f5e6d3] text-xs rounded-lg"
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addSpecialNote}
              className="inline-flex items-center gap-2 text-xs font-medium text-[#e8b4b8] hover:text-[#f5e6d3] pt-1 cursor-pointer"
            >
              <Plus className="size-3.5" /> Add Another Sweet Note
            </button>
          </div>
        )}
      </section>

      {/* SECTION 3: Song Section (Spotify / Full MP3 / JioSaavn) */}
      <section className="rounded-xl border border-[#dfc19c]/15 bg-[#160b11] overflow-hidden">
        <button
          type="button"
          onClick={() => setMusicOpen(!musicOpen)}
          className="flex min-h-[52px] w-full items-center justify-between px-5 text-left font-medium text-[#f5e6d3] hover:bg-[#1f0e18]"
        >
          <span className="flex items-center gap-2.5 text-sm">
            <Music className="size-4 text-[#e8b4b8]" />
            3. Our Song (Spotify, Full MP3, or JioSaavn)
          </span>
          <ChevronDown className={`size-4 text-[#dfc19c]/60 transition-transform ${musicOpen ? "rotate-180" : ""}`} />
        </button>

        {musicOpen && (
          <div className="space-y-4 border-t border-[#dfc19c]/10 px-5 py-5">
            <div className="flex gap-2 p-1 rounded-lg border border-[#dfc19c]/15 bg-[#0d0609]">
              <button
                type="button"
                onClick={() => update("music_type", "spotify")}
                className={`flex-1 h-9 rounded-md text-xs font-medium transition-all ${
                  draft.music_type === "spotify"
                    ? "bg-[#1db954] text-[#0a0507] font-semibold"
                    : "text-[#c5b0a5]"
                }`}
              >
                Spotify Embed
              </button>
              <button
                type="button"
                onClick={() => update("music_type", "mp3")}
                className={`flex-1 h-9 rounded-md text-xs font-medium transition-all ${
                  draft.music_type === "mp3"
                    ? "bg-[#d48b95] text-[#0a0507] font-semibold"
                    : "text-[#c5b0a5]"
                }`}
              >
                Custom MP3 Link
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[0.68rem] uppercase tracking-wider text-[#dfc19c]/70 font-semibold block">
                Popular Romantic Song Presets
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => autoDetectSong("Sab Tera Armaan Malik")}
                  className="px-3 py-1.5 rounded-lg border border-[#e8b4b8]/40 bg-[#e8b4b8]/15 text-[#e8b4b8] text-xs font-medium hover:bg-[#e8b4b8]/25 transition-all cursor-pointer"
                >
                  🎵 Sab Tera
                </button>
                <button
                  type="button"
                  onClick={() => autoDetectSong("Kesariya Pritam Arijit Singh")}
                  className="px-3 py-1.5 rounded-lg border border-[#dfc19c]/30 bg-[#160b11] text-[#dfc19c] text-xs font-medium hover:bg-[#200f19] transition-all cursor-pointer"
                >
                  🧡 Kesariya
                </button>
                <button
                  type="button"
                  onClick={() => autoDetectSong("Until I Found You Stephen Sanchez")}
                  className="px-3 py-1.5 rounded-lg border border-[#dfc19c]/30 bg-[#160b11] text-[#dfc19c] text-xs font-medium hover:bg-[#200f19] transition-all cursor-pointer"
                >
                  🎻 Until I Found You
                </button>
                <button
                  type="button"
                  onClick={() => autoDetectSong("Tum Hi Ho Arijit Singh")}
                  className="px-3 py-1.5 rounded-lg border border-[#dfc19c]/30 bg-[#160b11] text-[#dfc19c] text-xs font-medium hover:bg-[#200f19] transition-all cursor-pointer"
                >
                  ✨ Tum Hi Ho
                </button>
              </div>
            </div>

            {/* Song Link & Instant Auto-Detect */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-[#dfc19c]/80">
                  Song Link or Track Name (Spotify, JioSaavn, YouTube, MP3)
                </Label>
                <button
                  type="button"
                  onClick={() => autoDetectSong()}
                  disabled={isDetectingSong}
                  className="text-[0.68rem] text-[#e8b4b8] hover:text-[#f5e6d3] font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Sparkles className="size-3" />
                  <span>{isDetectingSong ? "Fetching details..." : "Auto-Detect Song Details"}</span>
                </button>
              </div>

              <div className="relative flex items-center">
                <Input
                  value={draft.bg_music_url || ""}
                  onChange={(e) => update("bg_music_url", e.target.value)}
                  onPaste={(e) => {
                    const pasted = e.clipboardData.getData("text");
                    if (pasted) {
                      update("bg_music_url", pasted);
                      setTimeout(() => autoDetectSong(pasted), 50);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      autoDetectSong(draft.bg_music_url);
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value && e.target.value !== "/audio/sab-tera.mp3") {
                      autoDetectSong(e.target.value);
                    }
                  }}
                  className={`${FIELD_CLASS} pr-24`}
                  placeholder="Paste Spotify, JioSaavn, YouTube link or type song name..."
                />
                <button
                  type="button"
                  onClick={() => autoDetectSong(draft.bg_music_url)}
                  disabled={isDetectingSong || !draft.bg_music_url}
                  className="absolute right-2 px-2.5 py-1 rounded-md bg-[#d48b95]/20 hover:bg-[#d48b95]/30 text-[#e8b4b8] text-[0.68rem] font-medium border border-[#d48b95]/30 transition-all cursor-pointer disabled:opacity-40"
                >
                  {isDetectingSong ? "Detecting..." : "Auto-Fill ✨"}
                </button>
              </div>

              <p className="text-[0.65rem] text-[#c5b0a5]/60 italic">
                💡 Paste any Spotify link, JioSaavn URL, YouTube track, or MP3 link — Title, Singer, HD Album Art, and Vinyl audio stream will update automatically!
              </p>
            </div>

            {/* Live Detected Song Card Preview */}
            {draft.music_title && (
              <div className="flex items-center gap-3 p-3 rounded-xl border border-[#dfc19c]/25 bg-gradient-to-r from-[#1b0c16] to-[#12070e] shadow-md animate-fadeIn">
                {draft.music_cover ? (
                  <img
                    src={draft.music_cover}
                    alt={draft.music_title}
                    className="size-12 rounded-lg object-cover border border-[#dfc19c]/30 shadow-md shrink-0"
                  />
                ) : (
                  <div className="size-12 rounded-lg bg-[#200d1a] border border-[#dfc19c]/20 flex items-center justify-center text-lg shrink-0">
                    🎵
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <span className="text-[0.6rem] uppercase tracking-wider text-[#dfc19c]/70 font-semibold block">
                    Vinyl Record Soundtrack
                  </span>
                  <p className="text-sm font-serif font-bold text-white truncate">{draft.music_title}</p>
                  <p className="text-xs text-[#e8b4b8] truncate font-serif italic">{draft.music_artist}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="inline-flex items-center gap-1 text-[0.65rem] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Auto-Loaded
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-[#dfc19c]/80">Song Title</Label>
                <Input
                  value={draft.music_title || ""}
                  onChange={(e) => update("music_title", e.target.value)}
                  className={FIELD_CLASS}
                  placeholder="e.g. Sab Tera"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-[#dfc19c]/80">Artist / Singer</Label>
                <Input
                  value={draft.music_artist || ""}
                  onChange={(e) => update("music_artist", e.target.value)}
                  className={FIELD_CLASS}
                  placeholder="e.g. Armaan Malik, Shraddha Kapoor"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 4: Photo Gallery 1 · Milestone Moments */}
      <section className="rounded-xl border border-[#dfc19c]/15 bg-[#160b11] overflow-hidden">
        <button
          type="button"
          onClick={() => setMemories1Open(!memories1Open)}
          className="flex min-h-[52px] w-full items-center justify-between px-5 text-left font-medium text-[#f5e6d3] hover:bg-[#1f0e18]"
        >
          <span className="flex items-center gap-2.5 text-sm">
            <ImageIcon className="size-4 text-[#e8b4b8]" />
            4. Gallery 1: Milestone Moments ({memoriesSection1.length})
          </span>
          <ChevronDown className={`size-4 text-[#dfc19c]/60 transition-transform ${memories1Open ? "rotate-180" : ""}`} />
        </button>

        {memories1Open && (
          <div className="space-y-4 border-t border-[#dfc19c]/10 px-5 py-5">
            <div className="space-y-1.5">
              <Label className="text-xs text-[#dfc19c]/80">Section 1 Heading</Label>
              <Input
                value={draft.memories_section1_title || "Where It All Began · Milestone Moments"}
                onChange={(e) => update("memories_section1_title", e.target.value)}
                className={FIELD_CLASS}
              />
            </div>

            {memoriesSection1.map((mem, idx) => (
              <div key={mem.id || idx} className="p-4 rounded-lg border border-[#dfc19c]/15 bg-[#0d0609] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#e8b4b8]">Milestone Photo #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeMemory1(idx)}
                    className="text-[#c5b0a5] hover:text-[#ff6b6b] transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                <Input
                  value={mem.title || ""}
                  onChange={(e) => updateMemory1(idx, "title", e.target.value)}
                  placeholder="Photo Title (e.g. Our First Date)"
                  className={FIELD_CLASS}
                />
                <Input
                  value={mem.caption || ""}
                  onChange={(e) => updateMemory1(idx, "caption", e.target.value)}
                  placeholder="Romantic Caption"
                  className={FIELD_CLASS}
                />
                <Input
                  value={mem.image || ""}
                  onChange={(e) => updateMemory1(idx, "image", e.target.value)}
                  placeholder="Photo URL"
                  className={FIELD_CLASS}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addMemory1}
              className="inline-flex items-center gap-2 text-xs font-medium text-[#e8b4b8] hover:text-[#f5e6d3] pt-1 cursor-pointer"
            >
              <Plus className="size-3.5" /> Add Milestone Photo
            </button>
          </div>
        )}
      </section>

      {/* SECTION 5: Photo Gallery 2 · Candid & Silly Moments */}
      <section className="rounded-xl border border-[#dfc19c]/15 bg-[#160b11] overflow-hidden">
        <button
          type="button"
          onClick={() => setMemories2Open(!memories2Open)}
          className="flex min-h-[52px] w-full items-center justify-between px-5 text-left font-medium text-[#f5e6d3] hover:bg-[#1f0e18]"
        >
          <span className="flex items-center gap-2.5 text-sm">
            <Smile className="size-4 text-[#e8b4b8]" />
            5. Gallery 2: Candid &amp; Silly Moments ({memoriesSection2.length})
          </span>
          <ChevronDown className={`size-4 text-[#dfc19c]/60 transition-transform ${memories2Open ? "rotate-180" : ""}`} />
        </button>

        {memories2Open && (
          <div className="space-y-4 border-t border-[#dfc19c]/10 px-5 py-5">
            <div className="space-y-1.5">
              <Label className="text-xs text-[#dfc19c]/80">Section 2 Heading</Label>
              <Input
                value={draft.memories_section2_title || "Unfiltered Love · Our Candid & Silly Moments"}
                onChange={(e) => update("memories_section2_title", e.target.value)}
                className={FIELD_CLASS}
              />
            </div>

            {memoriesSection2.map((mem, idx) => (
              <div key={mem.id || idx} className="p-4 rounded-lg border border-[#dfc19c]/15 bg-[#0d0609] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#e8b4b8]">Candid Photo #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeMemory2(idx)}
                    className="text-[#c5b0a5] hover:text-[#ff6b6b] transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
                <Input
                  value={mem.title || ""}
                  onChange={(e) => updateMemory2(idx, "title", e.target.value)}
                  placeholder="Photo Title (e.g. Goofy Afternoon)"
                  className={FIELD_CLASS}
                />
                <Input
                  value={mem.caption || ""}
                  onChange={(e) => updateMemory2(idx, "caption", e.target.value)}
                  placeholder="Playful / Sweet Caption"
                  className={FIELD_CLASS}
                />
                <Input
                  value={mem.image || ""}
                  onChange={(e) => updateMemory2(idx, "image", e.target.value)}
                  placeholder="Photo URL"
                  className={FIELD_CLASS}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addMemory2}
              className="inline-flex items-center gap-2 text-xs font-medium text-[#e8b4b8] hover:text-[#f5e6d3] pt-1 cursor-pointer"
            >
              <Plus className="size-3.5" /> Add Candid Photo
            </button>
          </div>
        )}
      </section>

      {/* SECTION 6: Final Love Letter & Re-Proposal */}
      <section className="rounded-xl border border-[#dfc19c]/15 bg-[#160b11] overflow-hidden">
        <button
          type="button"
          onClick={() => setProposalOpen(!proposalOpen)}
          className="flex min-h-[52px] w-full items-center justify-between px-5 text-left font-medium text-[#f5e6d3] hover:bg-[#1f0e18]"
        >
          <span className="flex items-center gap-2.5 text-sm">
            <Mail className="size-4 text-[#e8b4b8]" />
            6. Propose Her Again Letter &amp; Thank You
          </span>
          <ChevronDown className={`size-4 text-[#dfc19c]/60 transition-transform ${proposalOpen ? "rotate-180" : ""}`} />
        </button>

        {proposalOpen && (
          <div className="space-y-4 border-t border-[#dfc19c]/10 px-5 py-5">
            <div className="space-y-1.5">
              <Label className="text-xs text-[#dfc19c]/80">Proposal Header Title</Label>
              <Input
                value={draft.proposal_letter_title || "Will You Keep Choosing Me? (A Proposal All Over Again) 💍"}
                onChange={(e) => update("proposal_letter_title", e.target.value)}
                className={FIELD_CLASS}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-[#dfc19c]/80">
                Heartfelt Letter (Saying Thank You &amp; Asking Her to Stay by Your Side Forever)
              </Label>
              <Textarea
                rows={6}
                value={draft.love_letter || ""}
                onChange={(e) => update("love_letter", e.target.value)}
                className="border-[#dfc19c]/20 bg-[#0d0609] text-[#f5e6d3] text-sm leading-relaxed rounded-lg"
                placeholder="Write your heartfelt letter proposing to her all over again and thanking her for being together..."
              />
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#dfc19c]/10">
              <Label className="text-xs text-[#dfc19c]/80 flex items-center gap-1.5">
                <span>Sweet Response Note (Shown to her right after she presses YES 💍)</span>
              </Label>
              <Textarea
                rows={3}
                value={draft.proposal_yes_message || ""}
                onChange={(e) => update("proposal_yes_message", e.target.value)}
                className="border-[#dfc19c]/20 bg-[#0d0609] text-[#f5e6d3] text-xs leading-relaxed rounded-lg"
                placeholder="E.g. Thank you for saying YES to me, my love. I promise to hold your hand through everything and love you more with each passing breath..."
              />
            </div>
          </div>
        )}
      </section>

      {/* SECTION 7: Accent Tone Theme */}
      <section className="rounded-xl border border-[#dfc19c]/15 bg-[#160b11] p-5 space-y-4">
        <span className="flex items-center gap-2.5 text-sm font-medium text-[#f5e6d3]">
          <Palette className="size-4 text-[#e8b4b8]" />
          Romantic Accent Tone
        </span>
        <div className="flex flex-wrap gap-2.5">
          {ACCENT_TONES.map((tone) => (
            <button
              key={tone.id}
              type="button"
              onClick={() => update("accent_tone", tone.id)}
              className={`flex h-10 items-center gap-2 rounded-lg border px-3 text-xs font-medium transition-all ${
                draft.accent_tone === tone.id
                  ? "border-[#e8b4b8] bg-[#0d0609] text-[#f5e6d3] shadow-[0_0_15px_rgba(212,139,149,0.3)]"
                  : "border-[#dfc19c]/15 text-[#c5b0a5] hover:border-[#dfc19c]/30"
              }`}
            >
              <span className="size-3.5 rounded-full border border-white/20" style={{ backgroundColor: tone.hex }} />
              {tone.label}
              {draft.accent_tone === tone.id && <Check className="size-3 text-[#e8b4b8]" />}
            </button>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={handlePublishClick}
        className="flex min-h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-[#d48b95] text-sm font-medium text-[#0a0507] transition-all hover:bg-[#e8b4b8] cursor-pointer shadow-lg shadow-rose-950/40"
      >
        <Save className="size-4" />
        <span>Save &amp; Publish Keepsake (₹9)</span>
      </button>
    </div>
  );

  // Right Side Live Preview (Expansive, beautifully aligned & 100% interactive)
  const preview = (
    <div className="w-full max-w-2xl min-h-full pb-20 px-1 sm:px-0">
      <AnniversaryKeepsakeView draft={draft} />
    </div>
  );

  return (
    <div className="flex h-screen flex-col bg-[#070304] text-[#f5e6d3] overflow-hidden">
      <header className="sticky top-0 z-40 border-b border-[#dfc19c]/15 bg-[#140a0f]/95 backdrop-blur-xl shrink-0">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3 shrink min-w-0">
            <Link
              to="/marketplace"
              className="grid size-8 sm:size-9 place-items-center rounded-full border border-[#dfc19c]/20 bg-[#0a0507] text-[#c5b0a5] hover:text-[#e8b4b8] shrink-0"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div className="min-w-0">
              <p className="text-[0.58rem] sm:text-[0.6rem] uppercase tracking-[0.2em] text-[#dfc19c]/60">Romantic Studio</p>
              <p className="text-xs sm:text-sm font-serif text-white font-medium truncate max-w-[130px] sm:max-w-xs">{draft.template_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={handleSaveClick}
              className="inline-flex h-8 sm:h-9 items-center gap-1 sm:gap-2 rounded-full border border-[#dfc19c]/30 bg-[#160b11] px-2.5 sm:px-4 text-xs font-medium text-[#f5e6d3] hover:bg-[#25101c] hover:border-[#dfc19c]/50 transition-all cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="size-3 text-emerald-400" />
                  <span className="text-emerald-300 font-medium text-[0.75rem]">Saved!</span>
                </>
              ) : (
                <>
                  <Save className="size-3 sm:size-3.5 text-[#dfc19c]" />
                  <span className="text-[0.75rem] sm:text-xs">Save</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePublishClick}
              className="inline-flex h-8 sm:h-9 items-center gap-1 sm:gap-2 rounded-full bg-[#d48b95] px-3 sm:px-5 text-xs font-semibold text-[#0a0507] hover:bg-[#e8b4b8] shadow-md shadow-rose-950/30 transition-all cursor-pointer"
            >
              <Send className="size-3 sm:size-3.5" />
              <span className="text-[0.75rem] sm:text-xs">Publish (₹9)</span>
            </button>
          </div>
        </div>
      </header>

      <div className="hidden lg:grid lg:grid-cols-12 flex-1 overflow-hidden">
        <aside className="col-span-5 h-[calc(100vh-4rem)] overflow-y-auto border-r border-[#dfc19c]/15 bg-[#12070c] p-6 scrollbar-thin">
          {editForm}
        </aside>
        <section id="editor-preview-column" className="col-span-7 h-[calc(100vh-4rem)] overflow-y-auto bg-gradient-to-b from-[#0c0409] via-[#070205] to-[#030102] px-4 py-8 flex justify-center scrollbar-thin">
          {preview}
        </section>
      </div>

      {/* Fully Scrollable Mobile Experience */}
      <div id="mobile-editor-scroll-container" className="flex flex-1 flex-col lg:hidden overflow-y-auto scrollbar-thin">
        <div className="flex-1 p-3 sm:p-4 pb-28">
          {mobileTab === "edit" ? editForm : <div className="flex justify-center">{preview}</div>}
        </div>

        {/* Bottom Floating Navigation for Mobile */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#dfc19c]/15 bg-[#140a0f]/95 p-2.5 sm:p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
          <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setMobileTab("edit")}
              className={`flex h-11 items-center justify-center gap-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                mobileTab === "edit"
                  ? "bg-gradient-to-r from-[#e8b4b8] to-[#d48b95] text-[#0a0507] shadow-lg shadow-rose-950/40"
                  : "border border-[#dfc19c]/20 bg-[#1a0c15]/60 text-[#c5b0a5] hover:text-white"
              }`}
            >
              <Edit3 className="size-4" /> Edit Details
            </button>
            <button
              type="button"
              onClick={() => setMobileTab("preview")}
              className={`flex h-11 items-center justify-center gap-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                mobileTab === "preview"
                  ? "bg-gradient-to-r from-[#e8b4b8] to-[#d48b95] text-[#0a0507] shadow-lg shadow-rose-950/40"
                  : "border border-[#dfc19c]/20 bg-[#1a0c15]/60 text-[#c5b0a5] hover:text-white"
              }`}
            >
              <Eye className="size-4" /> Live Preview
            </button>
          </div>
        </div>
      </div>

      {/* Render Publish Modal on Save & Publish Click */}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        draftTitle={draft.template_name}
        templateSlug={id}
        price={id === "aurora-noire" ? 9 : 99}
        customContent={draft}
      />
    </div>
  );
}