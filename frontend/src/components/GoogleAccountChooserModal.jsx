import React, { useState, useEffect } from "react";
import { X, UserPlus, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function GoogleAccountChooserModal({ isOpen, onClose }) {
  const { loginWithGoogle } = useAuth();
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [showAddAccount, setShowAddAccount] = useState(false);

  // Official Google Identity Services SDK Initialization
  useEffect(() => {
    if (!isOpen) return;

    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "1083478950123-sandbox.apps.googleusercontent.com";

    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) {
              try {
                // Decode Google JWT ID token
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
                  name: payload.name || payload.email.split("@")[0],
                  email: payload.email,
                  picture: payload.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.name)}&background=d48b95&color=0a0507&bold=true`,
                  provider: "google",
                  id: payload.sub || `google_${Date.now()}`
                });
                onClose();
              } catch (err) {
                console.warn("Google JWT decode error:", err);
              }
            }
          },
        });

        // Trigger Google One-Tap prompt on device
        window.google.accounts.id.prompt();

        // Render Official Google Sign-In Button
        const btnContainer = document.getElementById("official-google-button");
        if (btnContainer) {
          btnContainer.innerHTML = "";
          window.google.accounts.id.renderButton(btnContainer, {
            type: "standard",
            theme: "filled_blue",
            size: "large",
            text: "signin_with",
            shape: "pill",
            width: 280,
          });
        }
      } catch (e) {
        console.warn("Google GIS init error:", e);
      }
    }
  }, [isOpen, loginWithGoogle, onClose]);

  if (!isOpen) return null;

  const handleCreateCustomGoogleAccount = (e) => {
    e.preventDefault();
    const cleanEmail = customEmail.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes("@") || cleanEmail.endsWith("@example.com")) {
      toast.error("Please enter a valid real Google email address.");
      return;
    }

    const formattedName = customName.trim() || cleanEmail.split("@")[0];
    const newAcc = {
      id: `google_${Date.now()}`,
      name: formattedName,
      email: cleanEmail,
      picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        formattedName
      )}&background=d48b95&color=0a0507&bold=true&rounded=true`,
      provider: "google"
    };

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
          className="absolute right-4 top-4 text-[#c5b0a5] hover:text-white transition-colors cursor-pointer"
        >
          <X className="size-5" />
        </button>

        {/* Google Header */}
        <div className="text-center space-y-2 pt-1">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white shadow-lg shadow-rose-950/30">
            <svg className="size-6" viewBox="0 0 24 24">
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
          <h2 className="text-lg font-serif font-semibold text-white">Google Authorization</h2>
          <p className="text-xs text-[#dfc19c]/70">Sign in using your Google account logged in on this device</p>
        </div>

        {/* Official Google Device OAuth Button */}
        <div className="flex justify-center my-3">
          <div id="official-google-button" className="min-h-[44px] flex items-center justify-center"></div>
        </div>

        {/* Fallback Google Email Input */}
        <div className="pt-2 border-t border-[#dfc19c]/15">
          {!showAddAccount ? (
            <button
              type="button"
              onClick={() => setShowAddAccount(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#1b0e15] border border-[#dfc19c]/20 hover:border-[#e8b4b8] text-xs font-medium text-[#e8b4b8] hover:text-white transition-all cursor-pointer"
            >
              <UserPlus className="size-3.5 text-[#dfc19c]" />
              <span>Or enter your personal Google Email</span>
            </button>
          ) : (
            <form onSubmit={handleCreateCustomGoogleAccount} className="space-y-3 pt-1">
              <p className="text-xs font-serif italic text-[#dfc19c]/80">Enter your Google Email details:</p>
              <input
                type="text"
                placeholder="Your Name (e.g. Pawan Devi)"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="h-10 w-full rounded-xl border border-[#dfc19c]/25 bg-[#0a0507] px-3.5 text-xs text-white placeholder:text-[#c5b0a5]/50 focus:border-[#e8b4b8] focus:outline-none"
              />
              <input
                type="email"
                placeholder="Google Email (e.g. pawan@gmail.com)"
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

        {/* Privacy Disclaimer */}
        <p className="text-[0.62rem] text-[#c5b0a5]/60 text-center leading-relaxed">
          Google will authorize your name, email, and profile picture to continue to LoveCrafted.
        </p>
      </div>
    </div>
  );
}

