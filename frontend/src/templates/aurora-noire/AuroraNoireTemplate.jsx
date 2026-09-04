import React from "react";
import AnniversaryKeepsakeView from "@/components/AnniversaryKeepsakeView";

export default function AuroraNoireTemplate(props) {
  const content = props.content || props.draft || props.data || props || {};
  return <AnniversaryKeepsakeView draft={content} />;
}
