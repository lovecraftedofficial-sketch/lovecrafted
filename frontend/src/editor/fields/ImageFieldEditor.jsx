import React, { useRef, useEffect } from "react";
import { EDITOR } from "@/constants/testIds";
import { ImagePlus, Replace, Trash2 } from "lucide-react";
import {
    createLocalImage,
    revokeLocalImage,
    resolveImage,
    ACCEPTED_IMAGE_EXT,
} from "@/editor/utils/imageUtils";

export default function ImageFieldEditor({ field, value, onChange }) {
    const inputRef = useRef(null);
    const previousLocalRef = useRef(null);
    const src = resolveImage(value);
    const testKey = field.key;

    // Track the previous local-object-URL value so we can revoke it whenever the
    // field changes to something else (replacement, removal, or unmount).
    useEffect(() => {
        return () => {
            revokeLocalImage(previousLocalRef.current);
        };
    }, []);

    const setNext = (next) => {
        if (previousLocalRef.current && previousLocalRef.current !== next) {
            revokeLocalImage(previousLocalRef.current);
        }
        previousLocalRef.current =
            next && next.kind === "local" ? next : null;
        onChange(next);
    };

    const onPick = (e) => {
        const file = e.target.files && e.target.files[0];
        e.target.value = "";
        if (!file) return;
        const res = createLocalImage(file);
        if (!res.ok) {
            alert(res.error);
            return;
        }
        setNext(res.value);
    };

    const onRemove = () => setNext(null);

    return (
        <div data-testid={EDITOR.field.image(testKey)}>
            <div className="lws-card overflow-hidden">
                <div className="aspect-video bg-[color:var(--lws-surface-2)] flex items-center justify-center">
                    {src ? (
                        <img
                            src={src}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-[color:var(--lws-text-dim)] font-italic-display">
                            No image selected
                        </span>
                    )}
                </div>
                <div className="p-3 flex items-center gap-2 border-t border-[color:var(--lws-border)]">
                    {!src ? (
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="lws-btn-ghost text-xs flex-1 justify-center"
                        >
                            <ImagePlus size={14} /> Add image
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                data-testid={EDITOR.field.imageReplaceBtn(testKey)}
                                className="lws-btn-ghost text-xs flex-1 justify-center"
                            >
                                <Replace size={14} /> Replace
                            </button>
                            <button
                                type="button"
                                onClick={onRemove}
                                data-testid={EDITOR.field.imageRemoveBtn(testKey)}
                                className="lws-btn-ghost text-xs justify-center"
                                style={{ color: "#f8b5c4" }}
                            >
                                <Trash2 size={14} /> Remove
                            </button>
                        </>
                    )}
                    <input
                        ref={inputRef}
                        data-testid={EDITOR.field.imageFileInput(testKey)}
                        type="file"
                        accept={ACCEPTED_IMAGE_EXT.join(",")}
                        onChange={onPick}
                        className="hidden"
                    />
                </div>
            </div>
            <p className="text-[11px] text-[color:var(--lws-text-dim)] mt-2">
                Phase 1: images are previewed locally in your browser only.
                Nothing is uploaded.
            </p>
        </div>
    );
}
