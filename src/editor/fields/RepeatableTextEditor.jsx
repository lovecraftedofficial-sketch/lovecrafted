import React from "react";
import { EDITOR } from "@/constants/testIds";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

export default function RepeatableTextEditor({ field, value, onChange }) {
    const items = Array.isArray(value) ? value : [];
    const max = field.maxItems || 100;

    const setItems = (next) => onChange(next);
    const add = () => {
        if (items.length >= max) return;
        setItems([...items, ""]);
    };
    const update = (i, v) =>
        setItems(items.map((it, idx) => (idx === i ? v : it)));
    const remove = (i) => setItems(items.filter((_, idx) => idx !== i));
    const move = (i, dir) => {
        const j = i + dir;
        if (j < 0 || j >= items.length) return;
        const next = [...items];
        [next[i], next[j]] = [next[j], next[i]];
        setItems(next);
    };

    return (
        <div data-testid={EDITOR.field.repeatableText(field.key)} className="space-y-2">
            {items.map((it, i) => (
                <div
                    key={i}
                    data-testid={EDITOR.field.repeatableTextItem(field.key, i)}
                    className="flex items-center gap-2"
                >
                    <input
                        type="text"
                        value={it}
                        placeholder={field.itemPlaceholder || "Enter value"}
                        onChange={(e) => update(i, e.target.value)}
                        className="flex-1 bg-[color:var(--lws-surface-2)] border border-[color:var(--lws-border-strong)] rounded-lg px-3 py-2 text-sm text-[color:var(--lws-cream)] focus:border-[color:var(--lws-pink)]"
                    />
                    <button
                        type="button"
                        onClick={() => move(i, -1)}
                        data-testid={EDITOR.field.repeatableTextItemUp(field.key, i)}
                        className="p-2 rounded-md border border-[color:var(--lws-border-strong)] text-[color:var(--lws-text-muted)] hover:text-[color:var(--lws-pink)]"
                        aria-label="Move up"
                    >
                        <ArrowUp size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => move(i, 1)}
                        data-testid={EDITOR.field.repeatableTextItemDown(field.key, i)}
                        className="p-2 rounded-md border border-[color:var(--lws-border-strong)] text-[color:var(--lws-text-muted)] hover:text-[color:var(--lws-pink)]"
                        aria-label="Move down"
                    >
                        <ArrowDown size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => remove(i)}
                        data-testid={EDITOR.field.repeatableTextItemRemove(field.key, i)}
                        className="p-2 rounded-md border border-[color:var(--lws-border-strong)] text-[color:var(--lws-pink)]"
                        aria-label="Remove"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            ))}
            <button
                type="button"
                onClick={add}
                data-testid={EDITOR.field.repeatableTextAdd(field.key)}
                disabled={items.length >= max}
                className="lws-btn-ghost text-xs disabled:opacity-40"
            >
                <Plus size={14} /> Add {items.length}/{max}
            </button>
        </div>
    );
}
