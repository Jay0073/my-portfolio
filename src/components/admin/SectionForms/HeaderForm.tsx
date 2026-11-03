import React from "react";
import { Controller } from "react-hook-form";
import { useSectionForm } from "../useSectionForm";
import { SocialLinksField } from "../EditorFields";
import type { PortfolioContent } from "../../../lib/contentSchema";

type HeaderValues = PortfolioContent["header"];
export const HeaderForm: React.FC<{ content: HeaderValues; revision: number; onChange: (data: HeaderValues) => void }> = ({ content, revision, onChange }) => {
  const { control } = useSectionForm(content, revision, onChange);
  return <form onSubmit={(e) => e.preventDefault()}><Controller control={control} name="socialLinks" render={({ field }) => <SocialLinksField value={field.value} onChange={field.onChange} />} /></form>;
};
