import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#dfc19c]/10 bg-[#0a0507] text-[#c5b0a5] pt-20 pb-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 mb-16">
          {/* Col 1: LoveCrafted Brand info */}
          <div className="lg:col-span-5 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-[#e8b4b8] to-[#d48b95] text-[#0a0507]">
                <Heart className="size-4 fill-[#0a0507]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#f5e6d3]">
                LoveCrafted
              </span>
            </Link>

            <p className="text-sm leading-relaxed max-w-md text-[#c5b0a5]/80">
              Turn your love story into a handcrafted keepsake of pure emotion. Personalize romantic notes,
              secret open-when letters, photo galleries, and background songs for your special someone.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#dfc19c]/80">
              NAVIGATION
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-[#f5e6d3] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="hover:text-[#f5e6d3] transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-[#f5e6d3] transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-[#f5e6d3] transition-colors">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Heritage */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#dfc19c]/80">
              LOVECRAFTED ATELIER
            </h4>
            <p className="text-sm leading-relaxed text-[#c5b0a5]/80">
              Composing handcrafted romantic keepsakes and digital love letters for couples, anniversaries, proposals, and lifetime memories.
            </p>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="border-t border-[#dfc19c]/10 pt-8 text-center text-xs text-[#c5b0a5]/60">
          Crafted with <span className="text-[#e8b4b8]">♡</span> by LoveCrafted
        </div>
      </div>
    </footer>
  );
}
