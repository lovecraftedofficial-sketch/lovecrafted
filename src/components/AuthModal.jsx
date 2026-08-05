import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, Mail, Lock, User, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function AuthModal() {
    const {
        isAuthModalOpen,
        authModalTab,
        closeAuthModal,
        login,
        signup,
        loginWithGoogle,
        resetPassword
    } = useAuth();

    const [tab, setTab] = useState(authModalTab || "signin");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [resetSent, setResetSent] = useState(false);
    const [error, setError] = useState("");

    if (!isAuthModalOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (tab === "signin") {
            if (!email || !password) {
                setError("Please enter your email and password.");
                return;
            }
            login(email, password);
        } else if (tab === "signup") {
            if (!name || !email || !password) {
                setError("Please fill in all required fields.");
                return;
            }
            signup(name, email, password);
        } else if (tab === "forgot") {
            if (!email) {
                setError("Please enter your email address.");
                return;
            }
            resetPassword(email);
            setResetSent(true);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-md bg-neutral-900 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white overflow-hidden">
                {/* Background Ambient Glow */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Header & Close Button */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <Sparkles size={18} />
                        </div>
                        <span className="font-display text-lg font-bold lws-gradient-text">
                            LoveCrafted Studio
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={closeAuthModal}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Tab Switcher */}
                <div className="flex border-b border-white/10">
                    <button
                        type="button"
                        onClick={() => {
                            setTab("signin");
                            setResetSent(false);
                            setError("");
                        }}
                        className={`flex-1 pb-3 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                            tab === "signin"
                                ? "border-rose-500 text-rose-300"
                                : "border-transparent text-neutral-400 hover:text-white"
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setTab("signup");
                            setResetSent(false);
                            setError("");
                        }}
                        className={`flex-1 pb-3 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
                            tab === "signup"
                                ? "border-rose-500 text-rose-300"
                                : "border-transparent text-neutral-400 hover:text-white"
                        }`}
                    >
                        Create Account
                    </button>
                </div>

                {/* Forgot Password Reset Success */}
                {tab === "forgot" && resetSent ? (
                    <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                        <CheckCircle2 size={32} className="text-emerald-400 mx-auto" />
                        <h3 className="font-bold text-sm text-white">Reset Link Sent</h3>
                        <p className="text-xs text-neutral-300 leading-relaxed">
                            We have emailed a password reset link to <strong className="text-white">{email}</strong>.
                        </p>
                        <button
                            type="button"
                            onClick={() => setTab("signin")}
                            className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline cursor-pointer"
                        >
                            Return to Sign In
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                                {error}
                            </div>
                        )}

                        {tab === "signup" && (
                            <div className="space-y-1">
                                <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                                    Your Name
                                </label>
                                <div className="relative">
                                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                                    <input
                                        type="text"
                                        placeholder="Alex Morgan"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-rose-500/50"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-rose-500/50"
                                />
                            </div>
                        </div>

                        {tab !== "forgot" && (
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                                        Password
                                    </label>
                                    {tab === "signin" && (
                                        <button
                                            type="button"
                                            onClick={() => setTab("forgot")}
                                            className="text-[11px] text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
                                        >
                                            Forgot password?
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-rose-500/50"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold text-xs shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-all mt-2"
                        >
                            <span>
                                {tab === "signin"
                                    ? "Sign In to Studio"
                                    : tab === "signup"
                                    ? "Create Account"
                                    : "Send Reset Link"}
                            </span>
                            <ArrowRight size={14} />
                        </button>
                    </form>
                )}

                {/* Google Sign In Option */}
                {tab !== "forgot" && (
                    <div className="space-y-4 pt-2">
                        <div className="relative flex items-center justify-center">
                            <div className="border-t border-white/10 w-full" />
                            <span className="bg-neutral-900 px-3 text-[10px] text-neutral-400 uppercase tracking-widest absolute">
                                Or Continue With
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={loginWithGoogle}
                            className="w-full py-2.5 px-4 rounded-full bg-neutral-800 hover:bg-neutral-700 border border-white/10 text-xs text-white font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                            <span>Sign in with Google</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
