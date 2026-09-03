import React from "react";
import { EDITOR } from "@/constants/testIds";

export default function TextFieldEditor({ field, value, onChange }) {
    return (
        <input
            data-testid={EDITOR.field.text(field.key)}
            type="text"
            value={value || ""}
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[color:var(--lws-surface-2)] border border-[color:var(--lws-border-strong)] rounded-lg px-4 py-2.5 text-[color:var(--lws-cream)] placeholder:text-[color:var(--lws-text-dim)] focus:border-[color:var(--lws-pink)]"
        />
    );
}
