import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Heart, Menu, X, User, LogOut, Sparkles } from "lucide-react";
import { NAV } from "@/constants/testIds";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { user, openAuthModal, logout } = useAuth();

    const linkClass = ({ isActive }) =>
        `text-sm tracking-wide transition-colors ${
            isActive
                ? "text-[color:var(--lws-pink)] font-semibold"
                : "text-[color:var(--lws-text-muted)] hover:text-[color:var(--lws-cream)]"
        }`;

    return (
        <header
            data-testid={NAV.root}
            className="sticky top-0 z-40 lws-glass border-b border-[color:var(--lws-border)]"
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link
                    to="/"
                    data-testid={NAV.logo}
                    className="flex items-center gap-2 font-display text-xl"
                >
                    <span
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                            background: "linear-gradient(120deg, #f8b5c4, #d4a574)",
                            color: "#2a0714",
                        }}
                    >
                        <Heart size={16} fill="#2a0714" />
                    </span>
                    <span className="lws-gradient-text tracking-wide font-bold">
                        LoveCrafted
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <NavLink data-testid={NAV.linkHome} to="/" end className={linkClass}>
                        Home
                    </NavLink>
                    <NavLink
                        data-testid={NAV.linkTemplates}
                        to="/templates"
                        className={linkClass}
                    >
                        Templates
                    </NavLink>
                    <NavLink
                        data-testid={NAV.linkDashboard}
                        to="/dashboard"
                        className={linkClass}
                    >
                        Dashboard
                    </NavLink>
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-3 bg-neutral-900/80 border border-white/10 px-3 py-1.5 rounded-full">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-6 h-6 rounded-full object-cover border border-rose-400/40"
                                />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold flex items-center justify-center border border-rose-500/30">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className="text-xs font-semibold text-neutral-200">
                                {user.name}
                            </span>
                            <button
                                type="button"
                                onClick={logout}
                                title="Sign Out"
                                className="text-neutral-400 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                            >
                                <LogOut size={13} />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => openAuthModal("signin")}
                            className="text-xs font-semibold text-neutral-300 hover:text-white px-3 py-2 transition-colors cursor-pointer"
                        >
                            Sign In
                        </button>
                    )}

                    <Link
                        data-testid={NAV.ctaExplore}
                        to="/templates"
                        className="lws-btn-primary text-xs py-2 px-4"
                    >
                        Explore Templates
                    </Link>
                </div>

                <button
                    className="md:hidden text-[color:var(--lws-cream)]"
                    onClick={() => setOpen((v) => !v)}
                    aria-label={open ? "Close menu" : "Open menu"}
                >
                    {open ? <X /> : <Menu />}
                </button>
            </div>

            {open && (
                <div className="md:hidden border-t border-[color:var(--lws-border)] bg-[color:var(--lws-bg-2)]">
                    <div className="px-6 py-4 flex flex-col gap-4">
                        <NavLink onClick={() => setOpen(false)} to="/" end className={linkClass}>
                            Home
                        </NavLink>
                        <NavLink
                            onClick={() => setOpen(false)}
                            to="/templates"
                            className={linkClass}
                        >
                            Templates
                        </NavLink>
                        <NavLink
                            onClick={() => setOpen(false)}
                            to="/dashboard"
                            className={linkClass}
                        >
                            Dashboard
                        </NavLink>

                        {user ? (
                            <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-900 border border-white/10">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold flex items-center justify-center">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-xs font-medium text-white">
                                        {user.name}
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        logout();
                                        setOpen(false);
                                    }}
                                    className="text-xs text-rose-400 hover:underline"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => {
                                    openAuthModal("signin");
                                    setOpen(false);
                                }}
                                className="text-xs text-neutral-300 text-left font-medium"
                            >
                                Sign In / Register
                            </button>
                        )}

                        <Link
                            onClick={() => setOpen(false)}
                            to="/templates"
                            className="lws-btn-primary text-sm justify-center"
                        >
                            Explore Templates
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
