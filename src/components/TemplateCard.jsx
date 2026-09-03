import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function TemplateCard({ template, index = 0 }) {
  // Format price in INR format (e.g., ₹1,499 or ₹9)
  const formattedPrice =
    typeof template.price === "number"
      ? `₹${template.price.toLocaleString("en-IN")}`
      : `₹${template.price || "1,499"}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-[#dfc19c]/15 bg-[#140a0f]/90 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl transition-all duration-300 hover:border-[#e8b4b8]/35 hover:shadow-[0_0_35px_rgba(212,139,149,0.2)]"
      data-testid={`template-card-${template.id}`}
    >
      {/* Top Image Showcase */}
      <div className="relative aspect-[16/11] overflow-hidden bg-[#0d0609]">
        <img
          src={template.image}
          alt={template.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#140a0f] via-transparent to-transparent" />

        {/* Top Badges: Tier & Price Chip */}
        <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
          {template.archived ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-[#0a0507]/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-amber-300 backdrop-blur-md">
              <Sparkles className="size-3 text-amber-400" />
              In Atelier
            </span>
          ) : template.tier ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e8b4b8]/30 bg-[#0a0507]/80 px-3.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-[#e8b4b8] backdrop-blur-md">
              <Sparkles className="size-3 text-[#e8b4b8]" />
              {template.tier}
            </span>
          ) : null}

          <span
            className={`ml-auto rounded-full px-3 py-1 text-xs shadow-md ${
              template.archived
                ? "bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-400/40 text-amber-200 font-medium tracking-wide"
                : "bg-[#d48b95] text-[#0a0507] font-serif font-bold"
            }`}
          >
            {template.archived ? "Coming Soon" : formattedPrice}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex flex-1 flex-col justify-between p-6 space-y-4">
        <div className="space-y-2">
          <p className="text-[0.65rem] tracking-[0.2em] uppercase font-semibold text-[#dfc19c]/70">
            {template.category}
          </p>
          <h3 className="font-serif text-xl font-medium text-[#f5e6d3] group-hover:text-white transition-colors">
            {template.title}
          </h3>
          <p className="text-xs leading-relaxed text-[#c5b0a5] line-clamp-2">
            {template.subtitle || template.description}
          </p>
        </div>

        {/* CTA Link */}
        <div className="pt-2 border-t border-[#dfc19c]/10">
          <Link
            to={template.archived ? `/editor/${template.id}` : `/templates/${template.id}`}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#e8b4b8] group-hover:text-[#f5e6d3] transition-colors"
          >
            <span>{template.archived ? "Open & Edit Draft in Studio" : "View the suite"}</span>
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
