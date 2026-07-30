import React from "react";
import { EDITOR } from "@/constants/testIds";

export default function TextareaFieldEditor({ field, value, onChange }) {
    const len = (value || "").length;
    return (
        <div>
            <textarea
                data-testid={EDITOR.field.textarea(field.key)}
                value={value || ""}
                maxLength={field.maxLength}
                placeholder={field.placeholder}
                onChange={(e) => onChange(e.target.value)}
                rows={5}
                className="w-full bg-[color:var(--lws-surface-2)] border border-[color:var(--lws-border-strong)] rounded-lg px-4 py-2.5 text-[color:var(--lws-cream)] placeholder:text-[color:var(--lws-text-dim)] focus:border-[color:var(--lws-pink)] resize-y"
            />
            {field.maxLength && (
                <div className="text-xs text-[color:var(--lws-text-dim)] mt-1 text-right">
                    {len} / {field.maxLength}
                </div>
            )}
        </div>
    );
}
