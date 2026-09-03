import React from "react";
import { EDITOR } from "@/constants/testIds";
import { Check } from "lucide-react";

export default function ColorOptionEditor({ field, value, onChange }) {
    const options = field.options || [];
    const current = value || field.default || options[0]?.value;
    return (
        <div data-testid={EDITOR.field.colorOption(field.key)} className="flex flex-wrap gap-2">
            {options.map((opt) => {
                const active = current === opt.value;
                return (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-full border transition ${
                            active
                                ? "border-[color:var(--lws-pink)] bg-[rgba(248,181,196,0.08)]"
                                : "border-[color:var(--lws-border-strong)] hover:border-[color:var(--lws-pink)]"
                        }`}
                    >
                        <span
                            className="w-4 h-4 rounded-full inline-block"
                            style={{ background: opt.swatch || opt.value }}
                        />
                        <span className="text-xs text-[color:var(--lws-cream)]">
                            {opt.label}
                        </span>
                        {active && (
                            <Check size={12} className="text-[color:var(--lws-pink)]" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
