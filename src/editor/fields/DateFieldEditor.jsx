import React from "react";
import { EDITOR } from "@/constants/testIds";

export default function DateFieldEditor({ field, value, onChange }) {
    return (
        <input
            data-testid={EDITOR.field.date(field.key)}
            type="date"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[color:var(--lws-surface-2)] border border-[color:var(--lws-border-strong)] rounded-lg px-4 py-2.5 text-[color:var(--lws-cream)] focus:border-[color:var(--lws-pink)]"
        />
    );
}
