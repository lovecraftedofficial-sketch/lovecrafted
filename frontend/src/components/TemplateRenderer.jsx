import React from "react";
import { Link } from "react-router-dom";
import { getTemplate } from "@/data/templateRegistry";

/**
 * TemplateRenderer
 * ----------------
 * Reads the template registry, resolves the requested component, and renders
 * the customer content. Never renders customer text via dangerouslySetInnerHTML.
 */
export default function TemplateRenderer({ templateSlug, content }) {
    const entry = getTemplate(templateSlug);

    if (!entry) {
        return (
            <div className="max-w-2xl mx-auto text-center py-32 px-6">
                <div className="lws-pill mb-6">Template Not Found</div>
                <h1 className="font-display text-4xl md:text-5xl mb-4 lws-gradient-text">
                    We couldn&apos;t find that template
                </h1>
                <p className="text-[color:var(--lws-text-muted)] mb-8">
                    The template <code className="text-[color:var(--lws-pink)]">{templateSlug}</code>{" "}
                    isn&apos;t registered.
                </p>
                <Link to="/templates" className="lws-btn-primary">
                    Browse templates
                </Link>
            </div>
        );
    }

    if (entry.comingSoon || !entry.component) {
        return (
            <div className="max-w-2xl mx-auto text-center py-32 px-6">
                <div className="lws-pill mb-6">Coming Soon</div>
                <h1 className="font-display text-4xl md:text-5xl mb-4 lws-gradient-text">
                    {entry.config.name}
                </h1>
                <p className="text-[color:var(--lws-text-muted)] mb-8">
                    This template is being crafted. Check back soon.
                </p>
                <Link to="/templates" className="lws-btn-primary">
                    Browse available templates
                </Link>
            </div>
        );
    }

    const TemplateComponent = entry.component;
    return <TemplateComponent content={content} />;
}
