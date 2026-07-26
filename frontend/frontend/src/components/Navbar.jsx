import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";
import { NAV } from "@/constants/testIds";

export default function Navbar() {
    const [open, setOpen] = useState(false);

    const linkClass = ({ isActive }) =>
        `text-sm tracking-wide transition-colors ${
            isActive
                ? "text-[color:var(--lws-pink)]"
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
                    <span className="lws-gradient-text tracking-wide">
                        Love Website Studio
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
                    <Link
                        data-testid={NAV.ctaExplore}
                        to="/templates"
                        className="lws-btn-primary text-sm"
                    >
                        Explore Templates
                    </Link>
                </nav>

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
