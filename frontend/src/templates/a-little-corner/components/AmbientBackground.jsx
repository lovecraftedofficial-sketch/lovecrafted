import React, { useMemo } from "react";
import { Heart } from "lucide-react";

/**
 * AmbientBackground.jsx
 * --------------------
 * High-performance, 60fps GPU-accelerated romantic ambient background layer.
 * Features:
 * - 30 small floating hearts (8–18px) with gentle vertical drift, horizontal sway & soft rotation
 * - 15 soft bokeh specks & glowing dust particles
 * - Soft burgundy/blush radial light blooms
 * - Cinematic page edge vignette
 * - 100% pointer-events: none, stays strictly behind all content (z-index 0)
 * - Supports prefers-reduced-motion
 */
export default function AmbientBackground() {
  // Deterministic seed generation for 30 subtle floating heart particles
  const hearts = useMemo(() => {
    return Array.from({ length: 32 }).map((_, idx) => {
      const size = 8 + (idx % 4) * 3.5; // 8px, 11.5px, 15px, 18.5px
      const left = (idx * 3.1 + (idx % 5) * 6.5) % 94 + 3; // 3% to 97% X-spread
      const duration = 18 + (idx % 7) * 3; // 18s to 36s duration
      const delay = (idx * 1.4) % 15; // staggered 0s to 15s delays
      const opacity = 0.12 + (idx % 5) * 0.05; // 0.12 to 0.32
      const sway = (idx % 2 === 0 ? 1 : -1) * (12 + (idx % 3) * 6); // sway px

      return {
        id: idx,
        size,
        left: `${left}%`,
        duration: `${duration}s`,
        delay: `${delay}s`,
        opacity,
        sway: `${sway}px`,
      };
    });
  }, []);

  // 15 Bokeh dust specks
  const dustSpecks = useMemo(() => {
    return Array.from({ length: 16 }).map((_, idx) => {
      const size = 2 + (idx % 3) * 2; // 2px to 6px
      const left = (idx * 6.2) % 92 + 4;
      const duration = 22 + (idx % 5) * 4;
      const delay = (idx * 2.1) % 16;
      const opacity = 0.15 + (idx % 4) * 0.06;

      return {
        id: idx,
        size,
        left: `${left}%`,
        duration: `${duration}s`,
        delay: `${delay}s`,
        opacity,
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Soft Burgundy/Blush Ambient Light Blooms */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#4a0e20]/20 rounded-full blur-[150px] transform-gpu" />
      <div className="absolute top-[40%] right-[-10%] w-[550px] h-[550px] bg-[#2a0913]/25 rounded-full blur-[160px] transform-gpu" />
      <div className="absolute bottom-[-10%] left-[25%] w-[650px] h-[650px] bg-[#4a0e20]/15 rounded-full blur-[170px] transform-gpu" />

      {/* 2. Bokeh Dust Specks */}
      <div className="absolute inset-0">
        {dustSpecks.map((speck) => (
          <div
            key={speck.id}
            className="absolute rounded-full bg-[#f7c5d1] blur-[1px] animate-ambient-dust transform-gpu"
            style={{
              width: `${speck.size}px`,
              height: `${speck.size}px`,
              left: speck.left,
              bottom: "-20px",
              opacity: speck.opacity,
              animationDuration: speck.duration,
              animationDelay: speck.delay,
            }}
          />
        ))}
      </div>

      {/* 3. Small Floating Hearts Particle System */}
      <div className="absolute inset-0">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute text-[#f7c5d1] animate-ambient-heart transform-gpu"
            style={{
              left: heart.left,
              bottom: "-30px",
              opacity: heart.opacity,
              animationDuration: heart.duration,
              animationDelay: heart.delay,
              "--sway-x": heart.sway,
            }}
          >
            <Heart size={heart.size} className="fill-[#f7c5d1]" />
          </div>
        ))}
      </div>

      {/* 4. Cinematic Soft Page Edge Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(10,3,6,0.65)] pointer-events-none" />

      {/* 5. Custom GPU Animations CSS */}
      <style>{`
        @keyframes ambient-heart {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: var(--tw-opacity, 0.25);
          }
          50% {
            transform: translateY(-60vh) translateX(var(--sway-x, 15px)) rotate(12deg);
          }
          85% {
            opacity: var(--tw-opacity, 0.2);
          }
          100% {
            transform: translateY(-125vh) translateX(0px) rotate(-15deg);
            opacity: 0;
          }
        }

        @keyframes ambient-dust {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0;
          }
          20% {
            opacity: 0.3;
          }
          80% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-120vh) scale(1.2);
            opacity: 0;
          }
        }

        .animate-ambient-heart {
          will-change: transform, opacity;
          animation: ambient-heart linear infinite;
        }

        .animate-ambient-dust {
          will-change: transform, opacity;
          animation: ambient-dust linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-ambient-heart,
          .animate-ambient-dust {
            animation: none !important;
            opacity: 0.1 !important;
          }
        }
      `}</style>
    </div>
  );
}
