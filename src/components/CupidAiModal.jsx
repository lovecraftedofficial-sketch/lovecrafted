import React, { useState, useEffect } from "react";
import { X, Sparkles, Heart, Wand2, MessageCircle, Send, Check, RefreshCw, Zap, Cpu } from "lucide-react";
import { toast } from "sonner";

export default function CupidAiModal({ isOpen, onClose, draft, onAutoFill }) {
  const [activeTab, setActiveTab] = useState("autofill"); // 'autofill' or 'chat'
  
  // Auto-Fill Form State
  const [partnerName, setPartnerName] = useState(
    draft?.birthdayName || draft?.partner2_name || draft?.coupleNames?.split("&")[1]?.trim() || ""
  );
  const [specialDate, setSpecialDate] = useState(
    draft?.relationship_date || draft?.relationshipDate || "2023-02-14"
  );
  const [vibe, setVibe] = useState("romantic");
  const [isGenerating, setIsGenerating] = useState(false);

  // Llama Local Engine State
  const [llamaModel, setLlamaModel] = useState("llama3.2:3b");
  const [isLlamaActive, setIsLlamaActive] = useState(false);

  // AI Chat Assistant State
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hi there! I am Cupid AI 💖 powered by your local Llama 3.2 model. How can I help customize your LoveCrafted keepsake today?"
    }
  ]);
  const [userQuery, setUserQuery] = useState("");

  // Check Ollama Llama availability on mount
  useEffect(() => {
    if (!isOpen) return;

    fetch("http://localhost:11434/api/tags")
      .then(res => res.json())
      .then(data => {
        if (data.models && data.models.length > 0) {
          const foundModel = data.models.find(m => m.name.includes("llama")) || data.models[0];
          setLlamaModel(foundModel.name);
          setIsLlamaActive(true);
        }
      })
      .catch(() => {
        setIsLlamaActive(false);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  // Llama 3.2 AI Content Generator
  const handleGenerateContent = async () => {
    const name = partnerName.trim() || "My Love";
    const uppercaseName = name.toUpperCase();
    setIsGenerating(true);

    let generatedData = {};
    let usedLlama = false;

    if (isLlamaActive) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        const llamaPrompt = `Generate romantic content for a love website for a partner named "${name}", vibe: "${vibe}". Return ONLY a JSON object with keys:
"heroGreeting" (1 line greeting),
"quote" (1 romantic quote),
"letterTitle" (short title),
"letterBody" (3 paragraph emotional love letter),
"open1Title" (e.g. Open when you miss me),
"open1Message" (sweet note),
"surpriseHeader" (e.g. HAPPY CELEBRATION ${uppercaseName}!),
"surpriseMessage" (1 sentence gift promise).
Do not include any extra markdown formatting outside the JSON.`;

        const res = await fetch("http://localhost:11434/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            model: llamaModel,
            prompt: llamaPrompt,
            stream: false
          })
        });

        clearTimeout(timeoutId);

        const data = await res.json();
        if (data.response) {
          try {
            const jsonStart = data.response.indexOf("{");
            const jsonEnd = data.response.lastIndexOf("}") + 1;
            if (jsonStart !== -1 && jsonEnd !== -1) {
              const parsed = JSON.parse(data.response.substring(jsonStart, jsonEnd));
              generatedData = {
                birthdayName: name,
                partner2_name: name,
                partner_name: name,
                coupleNames: `Alex & ${name}`,
                heroGreeting: parsed.heroGreeting || `To ${name}, the person who makes every ordinary day feel like a magical scene.`,
                quote: parsed.quote || `“In every lifetime, in every universe, my heart will always find its way to you, ${name}.”`,
                letterTitle: parsed.letterTitle || `A Letter From My Heart to Yours 💌`,
                letterTo: `To My Favorite Human, ${name}...`,
                letterBody: parsed.letterBody || `Dearest ${name},\n\nFrom the very first day we met, my world became brighter and softer...\n\nYours Always.`,
                letterMessage: parsed.letterBody || `Dearest ${name},\n\nFrom the very first day we met, my world became brighter and softer...\n\nYours Always.`,
                open1Title: parsed.open1Title || `Open when you miss me 💌`,
                open1Message: parsed.open1Message || `Close your eyes for a second, ${name}. Sending you the warmest hug!`,
                surpriseHeader: parsed.surpriseHeader || `HAPPY CELEBRATION, ${uppercaseName}!`,
                surpriseMessage: parsed.surpriseMessage || `You unlocked a special day planned just for ${name}.`
              };
              usedLlama = true;
            }
          } catch (e) {
            console.warn("Llama JSON parse error, using fallback template:", e);
          }
        }
      } catch (err) {
        console.warn("Llama fetch error or timeout, using built-in engine:", err);
      }
    }

    // Built-in romantic engine fallback if Llama is offline
    if (!usedLlama) {
      const baseLetter = `Dearest ${name},\n\nFrom the very first day we met, my world became brighter, warmer, and softer. Looking back at everything we've shared, I am so deeply grateful to have you in my life.\n\nThank you for your warm hugs, your infectious smile, and the gentle way you love me effortlessly.\n\nI choose you today, tomorrow, and for every single day that follows.\n\nYours Forever & Always.`;

      generatedData = {
        birthdayName: name,
        partner2_name: name,
        partner_name: name,
        coupleNames: `Alex & ${name}`,
        heroGreeting: `To ${name} — someone who brings so much warmth and light into the world. Today is all about celebrating the incredible person you are.`,
        greeting_teaser: `To ${name}, the person who makes every ordinary day feel like a magical movie scene. Happy Anniversary!`,
        quote: `“In every lifetime, in every universe, my heart will always find its way to you, ${name}.”`,
        letterTitle: `A Letter From My Heart to Yours 💌`,
        letterTo: `To My Favorite Human, ${name}...`,
        letterBody: baseLetter,
        letterMessage: baseLetter,
        wishJarTitle: `Secret Birthday Wishes For ${name}`,
        open1Title: `Open when you miss me 💌`,
        open1Message: `Close your eyes for a second, ${name}. Sending you the warmest hug across the distance.`,
        open2Title: `Open when you can't sleep 🌙`,
        open2Message: `Breathe in slowly. Picture us walking together under a quiet starry night. You are safe and loved.`,
        open3Title: `Open when you need a smile 😊`,
        open3Message: `Remember: You, ${name}, are the most adorable and special person in my universe!`,
        surpriseHeader: `HAPPY CELEBRATION, ${uppercaseName}!`,
        surpriseMessage: `You've unlocked: A full day dedicated entirely to ${name} — your favorite meal, zero responsibilities, and a special celebration planned just for you.`,
        songTitle: `Saiyonee · Hiten & Ritika Raj`,
        bg_music_url: `https://open.spotify.com/track/1wgJy9zGdOLRHGEkzpD5f0?si=8f0528522b574c5e`
      };
    }

    onAutoFill(generatedData);
    setIsGenerating(false);
    toast.success(
      usedLlama
        ? `🦙 Llama 3.2 generated custom content for ${name}!`
        : `✨ Cupid AI successfully auto-filled your keepsake for ${name}!`
    );
    onClose();
  };

  // AI Chat Assistant Helper Query (Queries Local Llama 3.2 if available)
  const handleSendQuery = async (e) => {
    if (e) e.preventDefault();
    if (!userQuery.trim()) return;

    const query = userQuery.trim();
    const newMessages = [...chatMessages, { id: Date.now(), sender: "user", text: query }];
    setChatMessages(newMessages);
    setUserQuery("");

    if (isLlamaActive) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const res = await fetch("http://localhost:11434/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            model: llamaModel,
            prompt: `You are Cupid AI, a helpful romantic assistant for the LoveCrafted website. Answer the user question concisely and warmly: "${query}"`,
            stream: false
          })
        });

        clearTimeout(timeoutId);

        const data = await res.json();
        if (data.response) {
          setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: "ai", text: data.response.trim() }]);
          return;
        }
      } catch (err) {
        console.warn("Llama chat fetch error or timeout:", err);
      }
    }

    // Static fallback if Llama is offline
    setTimeout(() => {
      let reply = "I can help you customize text, upload photos, set custom Spotify music, or generate romantic quotes!";
      const q = query.toLowerCase();

      if (q.includes("music") || q.includes("song") || q.includes("spotify")) {
        reply = "🎵 To add background music: Go to 'Our Song' section in the editor. You can paste any Spotify song link or upload your own MP3 audio file!";
      } else if (q.includes("photo") || q.includes("image") || q.includes("gallery")) {
        reply = "📸 To add photos: Open the Memory Gallery section in the editor and click 'Upload Photo' to pick images from your phone or laptop!";
      } else if (q.includes("letter") || q.includes("write")) {
        reply = "💌 For love letters: Use our '1-Click AI Auto-Fill' tab! Just enter your partner's name and vibe, and I will draft a romantic letter for you.";
      } else if (q.includes("share") || q.includes("publish")) {
        reply = "✨ Once you finish editing, click 'Save & Publish Keepsake' button at the bottom to get your private shareable link!";
      }

      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: "ai", text: reply }]);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl border border-[#ffb8ce]/30 bg-gradient-to-b from-[#1a0712] via-[#12040c] to-[#0a0207] p-6 text-[#f5e6d3] shadow-[0_25px_60px_-15px_rgba(255,115,149,0.3)] space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ffb8ce]/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#ff7395] to-[#d81b5c] flex items-center justify-center shadow-lg shadow-rose-500/20 text-white font-bold">
              🦙
            </div>
            <div>
              <h2 className="text-base font-serif font-bold text-white flex items-center gap-1.5">
                Cupid AI Assistant
                {isLlamaActive ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono flex items-center gap-1">
                    <Cpu className="size-2.5" /> Llama 3.2 (Active)
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ff7395]/20 text-[#ffb8ce] border border-[#ff7395]/40 font-mono">v2.0</span>
                )}
              </h2>
              <p className="text-xs text-[#ffc5d5]/70">
                {isLlamaActive ? "Powered by your local Llama 3.2 AI model" : "Auto-fill templates & instant creator assistance"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#ffc5d5]/60 hover:text-white transition-colors cursor-pointer">
            <X className="size-5" />
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex gap-2 p-1.5 rounded-2xl border border-[#ffb8ce]/20 bg-[#200713]">
          <button
            type="button"
            onClick={() => setActiveTab("autofill")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "autofill"
                ? "bg-gradient-to-r from-[#ff7395] to-[#d81b5c] text-white shadow-md"
                : "text-[#ffc5d5]/70 hover:text-white"
            }`}
          >
            <Wand2 className="size-3.5" />
            <span>1-Click Llama Auto-Fill</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === "chat"
                ? "bg-gradient-to-r from-[#ff7395] to-[#d81b5c] text-white shadow-md"
                : "text-[#ffc5d5]/70 hover:text-white"
            }`}
          >
            <MessageCircle className="size-3.5" />
            <span>Ask Llama 3.2 AI</span>
          </button>
        </div>

        {/* TAB 1: 1-CLICK AI AUTO-FILL */}
        {activeTab === "autofill" && (
          <div className="space-y-4 pt-1">
            <div className="p-3.5 rounded-2xl border border-[#ffb8ce]/20 bg-[#290f20]/50 space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#ffd0e0]">Partner's Name or Nickname</label>
                <input
                  type="text"
                  placeholder="e.g. ✨ / My Love"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#ffb8ce]/30 bg-[#160712] px-3 text-xs text-white placeholder:text-[#ffc5d5]/40 focus:border-[#ff7395] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#ffd0e0]">Special Date / Anniversary</label>
                <input
                  type="date"
                  value={specialDate}
                  onChange={(e) => setSpecialDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#ffb8ce]/30 bg-[#160712] px-3 text-xs text-white focus:border-[#ff7395] focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#ffd0e0]">Choose Vibe / Mood</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "romantic", label: "Deeply Romantic ❤️" },
                    { id: "playful", label: "Playful & Cute 🌸" },
                    { id: "sunset", label: "Golden Sunset 🌅" },
                  ].map(v => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVibe(v.id)}
                      className={`p-2 rounded-xl border text-[11px] font-medium transition-all text-center cursor-pointer ${
                        vibe === v.id
                          ? "border-[#ff7395] bg-[#ff7395]/20 text-white font-bold shadow-sm"
                          : "border-[#ffb8ce]/20 bg-[#160712] text-[#ffc5d5]/70 hover:text-white"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateContent}
              disabled={isGenerating}
              className="w-full h-11 rounded-2xl bg-gradient-to-r from-[#ff8dae] via-[#e61e5c] to-[#c2184b] text-xs font-bold text-white shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="size-4 animate-spin" />
                  <span>{isLlamaActive ? "Llama 3.2 is Generating..." : "Generating Content..."}</span>
                </>
              ) : (
                <>
                  <Zap className="size-4" />
                  <span>{isLlamaActive ? "Generate with Llama 3.2 ✨" : "Auto-Fill Template Now ✨"}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* TAB 2: AI CHAT ASSISTANT */}
        {activeTab === "chat" && (
          <div className="space-y-3 pt-1">
            <div className="h-56 overflow-y-auto space-y-2.5 p-3 rounded-2xl border border-[#ffb8ce]/20 bg-[#160712] shadow-inner font-sans text-xs">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] p-2.5 rounded-2xl leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#ff7395] text-white rounded-br-none"
                        : "bg-[#290f20] text-[#fff0f5] border border-[#ffb8ce]/20 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendQuery} className="flex gap-2">
              <input
                type="text"
                placeholder={isLlamaActive ? "Ask Llama 3.2 anything (e.g. Write a poem for Rosea)" : "Ask Cupid AI..."}
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                className="h-10 flex-1 rounded-xl border border-[#ffb8ce]/30 bg-[#160712] px-3.5 text-xs text-white placeholder:text-[#ffc5d5]/40 focus:border-[#ff7395] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 h-10 rounded-xl bg-gradient-to-r from-[#ff7395] to-[#d81b5c] text-white font-bold text-xs hover:opacity-90 transition-all cursor-pointer flex items-center justify-center"
              >
                <Send className="size-3.5" />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
