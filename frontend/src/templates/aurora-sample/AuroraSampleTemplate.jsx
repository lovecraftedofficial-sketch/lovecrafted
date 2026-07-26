import React from "react";
import Hero from "./components/Hero";
import LoveNote from "./components/LoveNote";
import Memories from "./components/Memories";
import Reasons from "./components/Reasons";
import OpenWhen from "./components/OpenWhen";
import Music from "./components/Music";
import LoveLetter from "./components/LoveLetter";

/**
 * AuroraSampleTemplate — Generic demo template.
 * Rendered from customer `content` produced by the schema-driven editor.
 * The template never knows any customer identity. It only renders content.
 */
export default function AuroraSampleTemplate(props) {
    const content = props.content || props.data || props || {};
    return (
        <div className="relative">
            <Hero content={content} />
            <LoveNote content={content} />
            <Memories content={content} />
            <Reasons content={content} />
            <OpenWhen content={content} />
            <Music content={content} />
            <LoveLetter content={content} />
            <div className="text-center pb-16 text-xs uppercase tracking-[0.3em] text-[color:var(--lws-text-dim)]">
                made with love · love website studio
            </div>
        </div>
    );
}
