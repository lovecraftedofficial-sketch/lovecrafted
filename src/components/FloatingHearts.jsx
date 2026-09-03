import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HEART_COLORS = [
  "#f43f5e", // Rose crimson
  "#e8b4b8", // Soft blush rose
  "#fb7185", // Pink
  "#fda4af", // Soft pastel pink
  "#dfc19c", // Warm champagne gold
  "#e11d48", // Vivid red
];

export default function FloatingHearts() {
  const [clickHearts, setClickHearts] = useState([]);

  // Generate a few subtle, elegant ambient floating hearts
  const ambientHearts = useMemo(() => {
    return Array.from({ length: 8 }).map((_, index) => {
      const size = Math.floor(Math.random() * 8) + 11; // 11px to 19px (delicate & dainty)
      const left = Math.floor(Math.random() * 90) + 5; // 5% to 95%
      const startPercent = Math.floor(Math.random() * 100); // initial vertical distribution
      const duration = Math.random() * 10 + 20; // 20s to 30s very calm, gentle float
      const opacity = Math.random() * 0.2 + 0.22; // 0.22 to 0.42 soft, subtle opacity
      const color = HEART_COLORS[index % HEART_COLORS.length];
      const drift = (Math.random() - 0.5) * 25;

      return {
        id: index,
        size,
        left: `${left}%`,
        startPercent,
        duration,
        opacity,
        color,
        drift,
      };
    });
  }, []);

  // Spawn just 2 tiny delicate floating hearts on click
  useEffect(() => {
    const handleClick = (e) => {
      // Don't interfere if clicked on text inputs or interactive controls
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target?.tagName)) return;

      const count = 2; // Only 2 subtle micro-hearts
      const x = e.clientX;
      const y = e.clientY;
      const newHearts = Array.from({ length: count }).map((_, i) => ({
        id: Date.now() + i + Math.random(),
        x,
        y,
        dx: (Math.random() - 0.5) * 50,
        dy: -40 - Math.random() * 50,
        size: Math.floor(Math.random() * 5) + 12,
        color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
        rotate: (Math.random() - 0.5) * 60,
      }));

      setClickHearts((prev) => [...prev.slice(-25), ...newHearts]);
      setTimeout(() => {
        setClickHearts((prev) => prev.filter((h) => !newHearts.find((nh) => nh.id === h.id)));
      }, 1600);
    };

    window.addEventListener("click", handleClick, { passive: true });
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden select-none"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 0px, transparent 115px, black 220px, black calc(100% - 40px), transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0px, transparent 115px, black 220px, black calc(100% - 40px), transparent 100%)",
      }}
      aria-hidden="true"
    >
      {/* 1. Ambient Gently Rising Floating Hearts */}
      {ambientHearts.map((h) => (
        <motion.div
          key={h.id}
          initial={{
            top: `${Math.max(22, h.startPercent)}%`,
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            top: ["105%", "14%"],
            x: [0, h.drift, -h.drift, 0],
            opacity: [0, h.opacity, h.opacity, 0],
            scale: [0.8, 1.1, 0.9, 0.4],
          }}
          transition={{
            top: {
              duration: h.duration,
              repeat: Infinity,
              ease: "linear",
            },
            x: {
              duration: h.duration / 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            },
            opacity: {
              duration: h.duration,
              repeat: Infinity,
              ease: "easeInOut",
            },
            scale: {
              duration: h.duration,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          style={{
            position: "absolute",
            left: h.left,
            filter: `drop-shadow(0 0 10px ${h.color}88)`,
          }}
        >
          <svg
            width={h.size}
            height={h.size}
            viewBox="0 0 24 24"
            fill={h.color}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}

      {/* 2. Interactive Click Burst Glowing Hearts */}
      <AnimatePresence>
        {clickHearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{
              x: h.x - h.size / 2,
              y: h.y - h.size / 2,
              opacity: 1,
              scale: 0.6,
              rotate: 0,
            }}
            animate={{
              x: h.x + h.dx,
              y: h.y + h.dy,
              opacity: 0,
              scale: 1.4,
              rotate: h.rotate,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              filter: `drop-shadow(0 0 12px ${h.color})`,
            }}
          >
            <svg
              width={h.size}
              height={h.size}
              viewBox="0 0 24 24"
              fill={h.color}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
