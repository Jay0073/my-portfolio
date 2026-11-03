import React from "react";
import { Controller } from "react-hook-form";
import { useSectionForm } from "../useSectionForm";
import { TextListField } from "../EditorFields";
import type { PortfolioContent } from "../../../lib/contentSchema";

type HeroValues = PortfolioContent["hero"];
export const HeroForm: React.FC<{ content: HeroValues; revision: number; onChange: (data: HeroValues) => void }> = ({ content, revision, onChange }) => {
  const { register, control } = useSectionForm(content, revision, onChange);
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <div><label className="field-label" htmlFor="hero-name">Name</label><input id="hero-name" {...register("name")} className="editor-field" placeholder="Your name" /></div>
      <div><label className="field-label" htmlFor="hero-button">Button text</label><input id="hero-button" {...register("buttonText")} className="editor-field" placeholder="Explore My Work" /></div>
      <Controller control={control} name="phrases" render={({ field }) => <TextListField label="Rotating phrase" values={field.value} onChange={field.onChange} min={1} />} />
      <p className="editor-help">The hero cycles through these phrases in order.</p>
    </form>
  );
};
