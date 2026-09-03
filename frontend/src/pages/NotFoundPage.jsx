import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <div className="max-w-2xl mx-auto text-center py-32 px-6">
            <div className="lws-pill mb-6">404</div>
            <h1 className="font-display text-5xl md:text-6xl mb-4 lws-gradient-text">
                This page got lost in the mail
            </h1>
            <p className="text-[color:var(--lws-text-muted)] mb-8">
                The link you followed might be old, broken, or made up entirely.
            </p>
            <Link to="/" className="lws-btn-primary">
                Back to safety
            </Link>
        </div>
    );
}
