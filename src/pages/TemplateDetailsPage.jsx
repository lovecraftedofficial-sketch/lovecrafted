import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, Check, Lock } from "lucide-react";
import { getTemplate } from "@/data/templateRegistry";
import TemplateRenderer from "@/components/TemplateRenderer";
import { TEMPLATE_DETAILS } from "@/constants/testIds";
import { formatPrice } from "@/components/TemplateCard";

export default function TemplateDetailsPage() {
    const { slug } = useParams();
    const entry = getTemplate(slug);

    if (!entry) {
        return (
            <div data-testid={TEMPLATE_DETAILS.notFound} className="max-w-2xl mx-auto text-center py-32 px-6">
                <div className="lws-pill mb-6">Not found</div>
                <h1 className="font-display text-4xl md:text-5xl mb-4 lws-gradient-text">
                    Template not found
                </h1>
                <Link to="/templates" className="lws-btn-primary">
                    Browse templates
                </Link>
            </div>
        );
    }

    const { config, comingSoon } = entry;

    return (
        <div data-testid={TEMPLATE_DETAILS.root}>
            {/* Hero band */}
            <section className="max-w-7xl mx-auto px-6 pt-14 pb-10">
                <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 items-start">
                    <div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="lws-pill">{config.category}</span>
                            <span className="lws-pill" style={{ borderColor: "#d4a57455", background: "#d4a5740f", color: "#d4a574" }}>
                                {config.tier}
                            </span>
                            {comingSoon && (
                                <span className="lws-pill" style={{ borderColor: "#f8b5c455", background: "#f8b5c40f" }}>
                                    <Lock size={11} /> Coming Soon
                                </span>
                            )}
                        </div>
                        <h1
                            data-testid={TEMPLATE_DETAILS.title}
                            className="font-display text-5xl md:text-6xl mb-4"
                        >
                            <span className="lws-gradient-text">{config.name}</span>
                        </h1>
                        <p className="text-[color:var(--lws-text-muted)] text-lg leading-relaxed max-w-xl">
                            {config.description}
                        </p>
                        <div className="flex items-baseline gap-3 mt-6 mb-8">
                            <span className="font-display text-4xl text-[color:var(--lws-cream)]">
                                {formatPrice(config.price, config.currency)}
                            </span>
                            <span className="text-xs uppercase tracking-widest text-[color:var(--lws-text-dim)]">
                                one-time · per website
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {!comingSoon ? (
                                <Link
                                    to={`/dashboard/websites/${config.slug}/edit`}
                                    data-testid={TEMPLATE_DETAILS.createBtn}
                                    className="lws-btn-primary"
                                >
                                    Create Yours <ArrowRight size={14} />
                                </Link>
                            ) : (
                                <button disabled className="lws-btn-ghost opacity-50 cursor-not-allowed">
                                    Coming Soon
                                </button>
                            )}
                            <Link to="/templates" className="lws-btn-ghost">
                                All templates
                            </Link>
                        </div>
                    </div>
                    {config.coverImage && (
                        <div className="lws-card overflow-hidden">
                            <img
                                src={config.coverImage}
                                alt={config.name}
                                className="w-full h-full object-cover aspect-[4/3]"
                            />
                        </div>
                    )}
                </div>

                {Array.isArray(config.features) && config.features.length > 0 && (
                    <ul
                        data-testid={TEMPLATE_DETAILS.featureList}
                        className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 gap-2"
                    >
                        {config.features.map((f) => (
                            <li
                                key={f}
                                className="lws-card px-4 py-3 flex items-center gap-3 text-sm text-[color:var(--lws-cream)]"
                            >
                                <Check size={14} className="text-[color:var(--lws-pink)]" />
                                {f}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Live demo preview */}
            <section className="max-w-7xl mx-auto px-6 pb-24">
                <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                    <h2 className="font-display text-3xl md:text-4xl lws-gradient-text">
                        Live demo preview
                    </h2>
                    <span className="text-xs uppercase tracking-widest text-[color:var(--lws-text-dim)]">
                        Fictional demo content · not a real customer
                    </span>
                </div>
                <div
                    data-testid={TEMPLATE_DETAILS.previewFrame}
                    className="lws-card overflow-hidden"
                >
                    <TemplateRenderer
                        templateSlug={config.slug}
                        content={config.demoData || {}}
                    />
                </div>
            </section>
        </div>
    );
}
