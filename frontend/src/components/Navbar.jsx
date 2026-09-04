import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Lock, Mail, X, User, ArrowRight, ChevronDown, LogOut, Sparkles } from "lucide-react";
import { Input } from "./ui/input";
import { useAuth } from "../context/AuthContext";
import GoogleAccountChooserModal from "./GoogleAccountChooserModal";

export default function Navbar() {
  const location = useLocation();
  const { user, logout, loginWithEmail, showGoogleChooser, setShowGoogleChooser } = useAuth();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [authMode, setAuthMode] = useState("signin"); // "signin" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleAuth = (e) => {
    if (e) e.preventDefault();
    loginWithEmail(email, name);
    setShowAuthModal(false);
  };

  const handleGoogleAuth = () => {
    setShowAuthModal(false);
    setShowGoogleChooser(true);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[#dfc19c]/10 bg-[#0a0507]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo: Heart Icon + LoveCrafted */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="grid size-8 sm:size-9 place-items-center rounded-full bg-gradient-to-br from-[#e8b4b8] to-[#d48b95] text-[#0a0507] shadow-[0_0_20px_rgba(212,139,149,0.4)] transition-transform group-hover:scale-105">
              <Heart className="size-3.5 sm:size-4 fill-[#0a0507]" />
            </div>
            <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-[#f5e6d3] group-hover:text-[#e8b4b8] transition-colors">
              LoveCrafted
            </span>
          </Link>

          {/* Center Navigation Links: Home, Templates, Dashboard */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-sans">
            <Link
              to="/"
              className={`transition-colors py-1 relative ${
                location.pathname === "/"
                  ? "text-[#e8b4b8] font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#e8b4b8]"
                  : "text-[#c5b0a5] hover:text-[#f5e6d3]"
              }`}
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className={`transition-colors py-1 relative ${
                location.pathname === "/marketplace" || location.pathname === "/templates"
                  ? "text-[#e8b4b8] font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#e8b4b8]"
                  : "text-[#c5b0a5] hover:text-[#f5e6d3]"
              }`}
            >
              Templates
            </Link>
            <Link
              to="/dashboard"
              className={`transition-colors py-1 relative ${
                location.pathname === "/dashboard"
                  ? "text-[#e8b4b8] font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#e8b4b8]"
                  : "text-[#c5b0a5] hover:text-[#f5e6d3]"
              }`}
            >
              Dashboard
            </Link>
          </nav>

          {/* Right Section: Sign In / User Profile + Explore Templates */}
          <div className="flex items-center gap-2.5 sm:gap-5">
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 rounded-full border border-[#dfc19c]/25 bg-[#140a0f] py-1 pl-1.5 pr-2.5 sm:pr-3 text-xs font-medium text-[#f5e6d3] hover:border-[#e8b4b8]/50 hover:bg-[#1f0e18] transition-all cursor-pointer group shadow-sm"
                >
                  <img
                    src={user.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
                    alt={user.name}
                    className="size-6 sm:size-7 rounded-full object-cover border border-[#dfc19c]/40 group-hover:scale-105 transition-transform shrink-0"
                  />
                  <span className="max-w-[70px] sm:max-w-[120px] truncate text-xs font-semibold text-[#f5e6d3] group-hover:text-[#e8b4b8] transition-colors">
                    {user.name ? user.name.split(" ")[0] : "Account"}
                  </span>
                  <ChevronDown
                    className={`size-3 text-[#dfc19c]/60 group-hover:text-white transition-transform duration-200 ${
                      showUserDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* User Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-[#dfc19c]/25 bg-[#140a0f]/95 p-4 shadow-2xl backdrop-blur-xl z-50 animate-fadeIn space-y-3">
                    <div className="flex items-center gap-3 pb-3 border-b border-[#dfc19c]/15">
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="size-11 rounded-full object-cover border border-[#dfc19c]/30 shrink-0 shadow-md"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white truncate font-serif">{user.name}</p>
                        <p className="text-[0.68rem] text-[#c5b0a5]/70 truncate">{user.email}</p>
                        {user.provider === "google" && (
                          <span className="inline-flex items-center gap-1 mt-1 text-[0.6rem] px-2 py-0.5 rounded-full bg-[#4285F4]/15 text-[#8ab4f8] border border-[#4285F4]/30 font-medium">
                            <svg className="size-2.5" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                            </svg>
                            Google Connected
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl text-[#f5e6d3] hover:bg-[#200f1a] hover:text-[#e8b4b8] transition-colors"
                      >
                        <Heart className="size-3.5 text-[#e8b4b8]" />
                        <span>My Keepsakes</span>
                      </Link>
                      <Link
                        to="/marketplace"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2.5 p-2 rounded-xl text-[#f5e6d3] hover:bg-[#200f1a] hover:text-[#e8b4b8] transition-colors"
                      >
                        <Sparkles className="size-3.5 text-[#dfc19c]" />
                        <span>Explore Collection</span>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-[#dfc19c]/15">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setShowUserDropdown(false);
                        }}
                        className="flex w-full items-center gap-2 p-2 rounded-xl text-xs text-rose-300 hover:bg-rose-950/30 hover:text-rose-200 transition-colors cursor-pointer"
                      >
                        <LogOut className="size-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowAuthModal(true)}
                className="text-xs sm:text-sm font-medium text-[#c5b0a5] hover:text-[#f5e6d3] transition-colors py-1 px-1.5 sm:px-2 cursor-pointer"
              >
                Sign In
              </button>
            )}

            <Link
              to="/marketplace"
              className="inline-flex h-9 sm:min-h-[44px] items-center justify-center rounded-full bg-gradient-to-r from-[#e8b4b8] to-[#d48b95] px-3.5 sm:px-6 text-xs sm:text-sm font-semibold text-[#0a0507] transition-all hover:shadow-[0_0_25px_rgba(212,139,149,0.4)] hover:scale-[1.02]"
            >
              Explore
            </Link>
          </div>
        </div>
      </header>

      {/* Dark-Romantic Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#070304]/80 p-4 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-[#dfc19c]/20 bg-[#140a0f] p-7 sm:p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] text-[#f5e6d3] space-y-6">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowAuthModal(false)}
              className="absolute right-5 top-5 text-[#c5b0a5] hover:text-[#f5e6d3] transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center space-y-2">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-gradient-to-br from-[#e8b4b8] to-[#d48b95] text-[#0a0507]">
                <Heart className="size-6 fill-[#0a0507]" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-white">
                {authMode === "signin" ? "Welcome Back to LoveCrafted" : "Create Your LoveCrafted Account"}
              </h2>
              <p className="text-xs text-[#c5b0a5]">
                {authMode === "signin"
                  ? "Sign in to access your romantic keepsakes & story editor."
                  : "Start building your handcrafted romantic love stories."}
              </p>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              className="flex min-h-[46px] w-full items-center justify-center gap-3 rounded-xl border border-[#dfc19c]/20 bg-[#1b0e15] text-xs font-medium text-[#f5e6d3] hover:border-[#e8b4b8] hover:bg-[#25131e] transition-all shadow-sm cursor-pointer"
            >
              <svg className="size-4" viewBox="0 0 24 24">
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
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-[#dfc19c]/10" />
              <span className="absolute bg-[#140a0f] px-3 text-[0.65rem] uppercase tracking-wider text-[#c5b0a5]/60">
                or continue with email
              </span>
            </div>

            {/* Email Form */}
            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === "signup" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#dfc19c]/80">Your Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#c5b0a5]" />
                    <Input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Morgan"
                      className="h-11 border-[#dfc19c]/20 bg-[#0d0609] pl-10 text-sm text-[#f5e6d3] rounded-xl"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#dfc19c]/80">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#c5b0a5]" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="h-11 border-[#dfc19c]/20 bg-[#0d0609] pl-10 text-sm text-[#f5e6d3] rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#dfc19c]/80">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#c5b0a5]" />
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 border-[#dfc19c]/20 bg-[#0d0609] pl-10 text-sm text-[#f5e6d3] rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e8b4b8] to-[#d48b95] text-sm font-medium text-[#0a0507] hover:shadow-[0_0_20px_rgba(212,139,149,0.4)] transition-all cursor-pointer"
              >
                <span>{authMode === "signin" ? "Sign In to Account" : "Create Account"}</span>
                <ArrowRight className="size-4" />
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="text-center pt-2 text-xs text-[#c5b0a5]">
              {authMode === "signin" ? (
                <p>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthMode("signup")}
                    className="font-semibold text-[#e8b4b8] hover:underline cursor-pointer"
                  >
                    Sign Up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthMode("signin")}
                    className="font-semibold text-[#e8b4b8] hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Google Account Chooser Modal */}
      <GoogleAccountChooserModal
        isOpen={showGoogleChooser}
        onClose={() => setShowGoogleChooser(false)}
      />
    </>
  );
}
