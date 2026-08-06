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
import AmbienceAudioEditor from "./fields/AmbienceAudioEditor";
import VoiceRecorderEditor from "./fields/VoiceRecorderEditor";

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
    audio: AmbienceAudioEditor,
    voice: VoiceRecorderEditor,
};

const GUIDED_PLACEHOLDERS = {
    partnerName: "e.g. Aarohi or Alex",
    creatorName: "e.g. Someone Special",
    heroMessage: "Tell your partner what made you fall in love...",
    quote: "“In every universe, I would still choose you.”",
    letterMessage: "Write your heartfelt love letter here...",
    bgMusicUrl: "Paste an MP3 audio URL (e.g. https://...)",
    card1Caption: "Golden hour, soft breeze, and endless conversations...",
    loveNote: "You make ordinary days feel special...",
};

export default function FieldRenderer({ field, value, onChange }) {
    const Comp = registry[field.type] || registry.text;

    const guidedPlaceholder =
        field.placeholder || GUIDED_PLACEHOLDERS[field.key] || "Enter content...";

    const fieldWithPlaceholder = {
        ...field,
        placeholder: guidedPlaceholder,
    };

    return (
        <div data-testid={EDITOR.fieldWrapper(field.key)} className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
                <label className="text-xs uppercase tracking-[0.18em] text-[color:var(--lws-text-muted)] font-semibold">
                    {field.label}
                    {field.required && (
                        <span className="text-[color:var(--lws-pink)] ml-1">*</span>
                    )}
                </label>
            </div>
            <Comp field={fieldWithPlaceholder} value={value} onChange={onChange} />
            {field.hint && (
                <p className="text-[11px] text-[color:var(--lws-text-dim)] leading-relaxed">
                    {field.hint}
                </p>
            )}
        </div>
    );
}
