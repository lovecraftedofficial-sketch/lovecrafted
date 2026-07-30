import React from "react";
import { EDITOR } from "@/constants/testIds";
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronRight } from "lucide-react";
import TextFieldEditor from "./TextFieldEditor";
import TextareaFieldEditor from "./TextareaFieldEditor";
import DateFieldEditor from "./DateFieldEditor";
import ImageFieldEditor from "./ImageFieldEditor";

const nestedFieldComponent = {
    text: TextFieldEditor,
    textarea: TextareaFieldEditor,
    date: DateFieldEditor,
    image: ImageFieldEditor,
};

export default function RepeatableContentEditor({ field, value, onChange }) {
    const items = Array.isArray(value) ? value : [];
    const [openIdx, setOpenIdx] = React.useState(items.length > 0 ? 0 : null);
    const max = field.maxItems || 100;

    const setItems = (next) => onChange(next);
    const emptyItem = () =>
        Object.fromEntries((field.fields || []).map((f) => [f.key, ""]));
    const add = () => {
        if (items.length >= max) return;
        const next = [...items, emptyItem()];
        setItems(next);
        setOpenIdx(next.length - 1);
    };
    const remove = (i) => {
        const next = items.filter((_, idx) => idx !== i);
        setItems(next);
        if (openIdx === i) setOpenIdx(null);
    };
    const move = (i, dir) => {
        const j = i + dir;
        if (j < 0 || j >= items.length) return;
        const next = [...items];
        [next[i], next[j]] = [next[j], next[i]];
        setItems(next);
        setOpenIdx(j);
    };
    const updateNested = (i, key, v) => {
        setItems(items.map((it, idx) => (idx === i ? { ...it, [key]: v } : it)));
    };

    return (
        <div data-testid={EDITOR.field.repeatableContent(field.key)} className="space-y-3">
            {items.map((item, i) => {
                const open = openIdx === i;
                const first = field.fields?.[0]?.key;
                const summary =
                    (first && item?.[first]) || `Item ${i + 1}`;
                return (
                    <div
                        key={i}
                        data-testid={EDITOR.field.repeatableContentItem(field.key, i)}
                        className="lws-card"
                    >
                        <div className="flex items-center gap-2 p-3">
                            <button
                                type="button"
                                onClick={() => setOpenIdx(open ? null : i)}
                                className="p-1.5 rounded-md text-[color:var(--lws-text-muted)] hover:text-[color:var(--lws-pink)]"
                                aria-label={open ? "Collapse" : "Expand"}
                            >
                                {open ? (
                                    <ChevronDown size={16} />
                                ) : (
                                    <ChevronRight size={16} />
                                )}
                            </button>
                            <div className="flex-1 truncate text-sm text-[color:var(--lws-cream)]">
                                {summary}
                            </div>
                            <button
                                type="button"
                                onClick={() => move(i, -1)}
                                data-testid={EDITOR.field.repeatableContentUp(field.key, i)}
                                className="p-2 rounded-md border border-[color:var(--lws-border-strong)] text-[color:var(--lws-text-muted)] hover:text-[color:var(--lws-pink)]"
                                aria-label="Move up"
                            >
                                <ArrowUp size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => move(i, 1)}
                                data-testid={EDITOR.field.repeatableContentDown(field.key, i)}
                                className="p-2 rounded-md border border-[color:var(--lws-border-strong)] text-[color:var(--lws-text-muted)] hover:text-[color:var(--lws-pink)]"
                                aria-label="Move down"
                            >
                                <ArrowDown size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => remove(i)}
                                data-testid={EDITOR.field.repeatableContentRemove(field.key, i)}
                                className="p-2 rounded-md border border-[color:var(--lws-border-strong)] text-[color:var(--lws-pink)]"
                                aria-label="Remove"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                        {open && (
                            <div className="p-4 border-t border-[color:var(--lws-border)] space-y-4">
                                {(field.fields || []).map((sub) => {
                                    const Comp = nestedFieldComponent[sub.type];
                                    if (!Comp) return null;
                                    return (
                                        <div key={sub.key}>
                                            <label className="block text-xs uppercase tracking-widest text-[color:var(--lws-text-muted)] mb-2">
                                                {sub.label}
                                            </label>
                                            <Comp
                                                field={{
                                                    ...sub,
                                                    key: `${field.key}.${i}.${sub.key}`,
                                                }}
                                                value={item?.[sub.key]}
                                                onChange={(v) =>
                                                    updateNested(i, sub.key, v)
                                                }
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
            <button
                type="button"
                onClick={add}
                data-testid={EDITOR.field.repeatableContentAdd(field.key)}
                disabled={items.length >= max}
                className="lws-btn-ghost text-xs disabled:opacity-40"
            >
                <Plus size={14} /> Add item {items.length}/{max}
            </button>
        </div>
    );
}
