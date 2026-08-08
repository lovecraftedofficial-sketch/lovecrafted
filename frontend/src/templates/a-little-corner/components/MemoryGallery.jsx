import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X } from "lucide-react";
import { resolveImage } from "@/editor/utils/imageUtils";

export default function MemoryGallery({ content = {} }) {
  const gallerySectionTitle = content.gallerySectionTitle || "Our Treasured Moments";
  const gallerySectionSubtitle = content.gallerySectionSubtitle || "Snapshots of peace, laughter, and quiet happiness.";

  const photos = [
    {
      url: resolveImage(content.photo1Url || "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80"),
      title: content.photo1Title || "Sunset Walk",
      date: content.photo1Date || "October 14, 2025"
    },
    {
      url: resolveImage(content.photo2Url || "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"),
      title: content.photo2Title || "Coffee Afternoon",
      date: content.photo2Date || "November 02, 2025"
    },
    {
      url: resolveImage(content.photo3Url || "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=800&q=80"),
      title: content.photo3Title || "Starry Night",
      date: content.photo3Date || "December 24, 2025"
    }
  ];

  const [activePhoto, setActivePhoto] = useState(null);

  return (
    <section id="gallery" className="relative min-h-screen bg-[#16080c] text-[#f7c5d1] flex flex-col items-center justify-center p-6 sm:p-12 overflow-x-clip font-sans">
      <div className="max-w-5xl w-full text-center space-y-8 z-10 py-12">
        {/* Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2a0913] border border-[#f7c5d1]/20 text-xs tracking-widest text-[#f7c5d1]/80 uppercase">
            <Camera size={13} className="text-[#f7c5d1]" />
            <span>Polaroid Keepsakes</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white font-medium">
            {gallerySectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-[#f7c5d1]/70 max-w-lg mx-auto font-light">
            {gallerySectionSubtitle}
          </p>
        </div>

        {/* Polaroid Editorial Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {photos.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6, rotate: idx % 2 === 0 ? 1 : -1 }}
              onClick={() => setActivePhoto(item)}
              className="p-4 bg-[#2a0913] rounded-2xl border border-[#f7c5d1]/20 shadow-2xl space-y-4 cursor-pointer text-left transition-all"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-black/40">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="px-1 space-y-1">
                <h3 className="text-base sm:text-lg font-serif text-white font-medium">
                  {item.title}
                </h3>
                <p className="text-xs font-mono text-[#f7c5d1]/60">
                  {item.date}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full bg-[#2a0913] p-6 rounded-3xl border border-[#f7c5d1]/30 shadow-2xl space-y-4 relative"
            >
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black text-white cursor-pointer"
              >
                <X size={18} />
              </button>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-xl font-serif text-white">{activePhoto.title}</h3>
                <p className="text-xs font-mono text-[#f7c5d1]/70">{activePhoto.date}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
