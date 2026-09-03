import React from "react";
import { EDITOR } from "@/constants/testIds";
import TextFieldEditor from "./fields/TextFieldEditor";
import TextareaFieldEditor from "./fields/TextareaFieldEditor";
import DateFieldEditor from "./fields/DateFieldEditor";
import ImageFieldEditor from "./fields/ImageFieldEditor";
import ColorOptionEditor from "./fields/ColorOptionEditor";
import RepeatableTextEditor from "./fields/RepeatableTextEditor";
import MemoryListEditor from "./fields/MemoryListEditor";
import RepeatableContentEditor from "./fields/RepeatableContentEditor";
import SongUrlEditor from "./fields/SongUrlEditor";

const registry = {
    text: TextFieldEditor,
    textarea: TextareaFieldEditor,
    date: DateFieldEditor,
    image: ImageFieldEditor,
    "color-option": ColorOptionEditor,
    "repeatable-text": RepeatableTextEditor,
    "memory-list": MemoryListEditor,
    "repeatable-content": RepeatableContentEditor,
    "song-url": SongUrlEditor,
};

export default function FieldRenderer({ field, value, onChange }) {
    const Comp = registry[field.type];
    if (!Comp) {
        return (
            <div className="text-xs text-[color:var(--lws-text-dim)]">
                Unsupported field type: <code>{field.type}</code>
            </div>
        );
    }
    return (
        <div data-testid={EDITOR.fieldWrapper(field.key)} className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
                <label className="text-xs uppercase tracking-[0.18em] text-[color:var(--lws-text-muted)]">
                    {field.label}
                    {field.required && (
                        <span className="text-[color:var(--lws-pink)] ml-1">*</span>
                    )}
                </label>
            </div>
            <Comp field={field} value={value} onChange={onChange} />
            {field.hint && (
                <p className="text-[11px] text-[color:var(--lws-text-dim)]">
                    {field.hint}
                </p>
            )}
        </div>
    );
}
