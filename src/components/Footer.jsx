import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full py-12 border-t border-white/10 bg-black/40 backdrop-blur-sm mt-20">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center justify-center gap-4 text-center">
        
        {/* Brand Name */}
        <div className="flex items-center gap-2">
          <span className="text-pink-400 text-lg">💖</span>
          <span className="font-serif text-lg tracking-wide text-white/90 font-bold">
            LoveCrafted
          </span>
        </div>

        {/* Contact Email Link */}
        <div className="flex items-center gap-2 text-neutral-400 hover:text-pink-300 transition-colors duration-200 text-sm">
          <span>📩</span>
          <a 
            href="mailto:lovecrafted.official@gmail.com" 
            className="underline underline-offset-4 decoration-neutral-600 hover:decoration-pink-300 font-medium"
          >
            lovecrafted.official@gmail.com
          </a>
        </div>

        {/* Tagline & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-neutral-500 mt-2">
          <span>HANDCRAFTED ROMANTIC WEBSITES · ONE TEMPLATE AT A TIME</span>
          <span className="hidden sm:inline">•</span>
          <span>© 2026 · LoveCrafted</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;