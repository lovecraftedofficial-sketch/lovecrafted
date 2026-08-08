import React, { useMemo } from "react";
import { Heart, Sparkle, Star } from "lucide-react";

/**
 * AmbientBackground.jsx - "Come Here, Baby" Atmosphere
 * ---------------------------------------------------
 * 60fps GPU-accelerated night-time romantic particles.
 * 28-35 particles visible:
 * - Tiny floating hearts (8-18px)
 * - Soft pink petals & bubbles
 * - Glowing star sparkles & dust
 * - Deep chocolate burgundy & warm rose light blooms
 * - 100% pointer-events: none, stays strictly behind content (z-index 0)
 * - Supports prefers-reduced-motion
 */
export default function AmbientBackground() {
  const particles = useMemo(() => {
    return Array.from({ length: 32 }).map((_, idx) => {
      const type = idx % 3 === 0 ? "heart" : idx % 3 === 1 ? "star" : "bubble";
      const size = 8 + (idx % 4) * 3; // 8px to 17px
      const left = (idx * 3.1 + (idx % 5) * 6.2) % 94 + 3; // 3% to 97% X-spread
      const duration = 18 + (idx % 7) * 3; // 18s to 36s
      const delay = (idx * 1.3) % 14;
      const opacity = 0.12 + (idx % 5) * 0.05; // 0.12 to 0.32
      const sway = (idx % 2 === 0 ? 1 : -1) * (10 + (idx % 3) * 6);

      return {
        id: idx,
        type,
        size,
        left: `${left}%`,
        duration: `${duration}s`,
        delay: `${delay}s`,
        opacity,
        sway: `${sway}px`,
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Deep Chocolate Burgundy & Rose Light Blooms */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#3d0a18]/25 rounded-full blur-[150px] transform-gpu" />
      <div className="absolute top-[35%] right-[-10%] w-[550px] h-[550px] bg-[#1c080e]/40 rounded-full blur-[160px] transform-gpu" />
      <div className="absolute bottom-[-10%] left-[20%] w-[650px] h-[650px] bg-[#3d0a18]/20 rounded-full blur-[170px] transform-gpu" />

      {/* Floating Particles System */}
      <div className="absolute inset-0">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute text-[#f8b3c3] animate-chb-float transform-gpu"
            style={{
              left: p.left,
              bottom: "-30px",
              opacity: p.opacity,
              animationDuration: p.duration,
              animationDelay: p.delay,
              "--sway-x": p.sway,
            }}
          >
            {p.type === "heart" && <Heart size={p.size} className="fill-[#f8b3c3]" />}
            {p.type === "star" && <Star size={p.size} className="fill-[#fcd34d] text-[#fcd34d]" />}
            {p.type === "bubble" && (
              <div
                className="rounded-full bg-[#f8b3c3] blur-[1px]"
                style={{ width: `${p.size}px`, height: `${p.size}px` }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Edge Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_140px_rgba(10,3,6,0.7)] pointer-events-none" />

      {/* CSS Keyframes */}
      <style>{`
        @keyframes chb-float {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: var(--tw-opacity, 0.25);
          }
          50% {
            transform: translateY(-60vh) translateX(var(--sway-x, 12px)) rotate(10deg);
          }
          85% {
            opacity: var(--tw-opacity, 0.2);
          }
          100% {
            transform: translateY(-125vh) translateX(0px) rotate(-12deg);
            opacity: 0;
          }
        }

        .animate-chb-float {
          will-change: transform, opacity;
          animation: chb-float linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-chb-float {
            animation: none !important;
            opacity: 0.1 !important;
          }
        }
      `}</style>
    </div>
  );
}
