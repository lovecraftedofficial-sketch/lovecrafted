import React, { useState, useEffect } from "react";
import { X, UserPlus, Check, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function GoogleAccountChooserModal({ isOpen, onClose }) {
  const { loginWithGoogle } = useAuth();
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [showAddAccount, setShowAddAccount] = useState(false);

  // Accounts list (includes saved recent accounts or sample accounts)
  const [accounts, setAccounts] = useState(() => {
    try {
      const saved = localStorage.getItem("lovecrafted:google_recent_accounts");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: "acc_1",
        name: "Pawan Devi",
        email: "pawan.devi@gmail.com",
        picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      },
      {
        id: "acc_2",
        name: "Kabir Verma",
        email: "kabir.verma@gmail.com",
        picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      },
    ];
  });

  // Try official Google Identity Services if client ID is set in env
  useEffect(() => {
    if (!isOpen) return;
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (clientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) {
              // Decode JWT payload
              try {
                const base64Url = response.credential.split(".")[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const jsonPayload = decodeURIComponent(
                  atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
                );
                const payload = JSON.parse(jsonPayload);
                loginWithGoogle({
                  name: payload.name,
                  email: payload.email,
                  picture: payload.picture,
                });
                onClose();
              } catch (err) {
                console.warn("JWT parse error:", err);
              }
            }
          },
        });
        window.google.accounts.id.renderButton(
          document.getElementById("official-google-button"),
          { theme: "outline", size: "large", width: "100%" }
        );
      } catch (e) {
        console.warn("Google GIS init error:", e);
      }
    }
  }, [isOpen, loginWithGoogle, onClose]);

  if (!isOpen) return null;

  const handleSelectAccount = (account) => {
    loginWithGoogle(account);
    onClose();
  };

  const handleCreateCustomGoogleAccount = (e) => {
    e.preventDefault();
    if (!customEmail) return;

    const formattedName = customName.trim() || customEmail.split("@")[0] || "Google User";
    const newAcc = {
      id: `acc_${Date.now()}`,
      name: formattedName,
      email: customEmail.trim(),
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        formattedName
      )}&background=d48b95&color=0a0507&bold=true&rounded=true`,
    };

    const updated = [newAcc, ...accounts.filter((a) => a.email !== newAcc.email)];
    setAccounts(updated);
    try {
      localStorage.setItem("lovecrafted:google_recent_accounts", JSON.stringify(updated));
    } catch (e) {}

    loginWithGoogle(newAcc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl border border-[#dfc19c]/25 bg-[#12080f] p-6 sm:p-7 text-[#f5e6d3] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] space-y-5">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-[#c5b0a5] hover:text-white transition-colors"
        >
          <X className="size-5" />
        </button>

        {/* Google Header */}
        <div className="text-center space-y-1.5 pt-1">
          {/* Multi-colored official Google G icon */}
          <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-white shadow-md">
            <svg className="size-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-serif font-semibold text-white">Choose an account</h2>
          <p className="text-xs text-[#dfc19c]/70">to continue to <strong className="text-white">LoveCrafted</strong></p>
        </div>

        {/* Official Google SDK container if client ID is configured */}
        <div id="official-google-button" className="flex justify-center" />

        {/* Accounts List */}
        <div className="space-y-2 divide-y divide-[#dfc19c]/10">
          <div className="space-y-1.5 pb-2">
            {accounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleSelectAccount(acc)}
                className="w-full flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-[#200f1a] transition-all text-left group border border-transparent hover:border-[#dfc19c]/20 cursor-pointer"
              >
                <img
                  src={acc.picture}
                  alt={acc.name}
                  className="size-10 rounded-full object-cover border border-[#dfc19c]/30 group-hover:scale-105 transition-transform shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white group-hover:text-[#e8b4b8] transition-colors truncate">
                    {acc.name}
                  </p>
                  <p className="text-xs text-[#c5b0a5]/70 truncate">{acc.email}</p>
                </div>
                <div className="size-6 rounded-full bg-[#dfc19c]/10 flex items-center justify-center text-[#dfc19c] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Check className="size-3.5" />
                </div>
              </button>
            ))}
          </div>

          {/* Use another Google account toggle */}
          <div className="pt-2">
            {!showAddAccount ? (
              <button
                type="button"
                onClick={() => setShowAddAccount(true)}
                className="w-full flex items-center gap-3.5 p-2.5 rounded-2xl hover:bg-[#200f1a] transition-all text-left text-xs font-medium text-[#e8b4b8] hover:text-white cursor-pointer"
              >
                <div className="size-10 rounded-full border border-dashed border-[#dfc19c]/30 flex items-center justify-center bg-[#1a0b15]">
                  <UserPlus className="size-4 text-[#dfc19c]" />
                </div>
                <span>Use another Google account</span>
              </button>
            ) : (
              <form onSubmit={handleCreateCustomGoogleAccount} className="space-y-3 pt-2">
                <p className="text-xs font-serif italic text-[#dfc19c]/80">Enter your Google details:</p>
                <input
                  type="text"
                  placeholder="Your Full Name (e.g. Rohan Sharma)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#dfc19c]/25 bg-[#0a0507] px-3.5 text-xs text-white placeholder:text-[#c5b0a5]/50 focus:border-[#e8b4b8] focus:outline-none"
                  required
                />
                <input
                  type="email"
                  placeholder="Google Email (e.g. rohan@gmail.com)"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="h-10 w-full rounded-xl border border-[#dfc19c]/25 bg-[#0a0507] px-3.5 text-xs text-white placeholder:text-[#c5b0a5]/50 focus:border-[#e8b4b8] focus:outline-none"
                  required
                />
                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 h-9 rounded-xl bg-gradient-to-r from-[#e8b4b8] to-[#d48b95] text-[#0a0507] text-xs font-semibold hover:opacity-90 transition-all cursor-pointer"
                  >
                    Sign In with Google ✨
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddAccount(false)}
                    className="px-3 h-9 rounded-xl border border-[#dfc19c]/20 text-[#c5b0a5] text-xs hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Google Privacy Disclaimer */}
        <p className="text-[0.62rem] text-[#c5b0a5]/60 text-center leading-relaxed">
          To continue, Google will share your name, email address, and profile picture with LoveCrafted.
        </p>
      </div>
    </div>
  );
}
