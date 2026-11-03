import React from "react";
import { Controller } from "react-hook-form";
import { useSectionForm } from "../useSectionForm";
import { SocialLinksField, TextListField } from "../EditorFields";
import type { PortfolioContent } from "../../../lib/contentSchema";

type FooterValues = PortfolioContent["footer"];
export const FooterForm: React.FC<{ content: FooterValues; revision: number; onChange: (data: FooterValues) => void }> = ({ content, revision, onChange }) => {
  const { register, control } = useSectionForm(content, revision, onChange);
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <div><label className="field-label" htmlFor="footer-quote">Quote</label><textarea id="footer-quote" {...register("quote")} rows={3} className="editor-field" /></div>
      <div><label className="field-label" htmlFor="footer-tagline">Tagline</label><textarea id="footer-tagline" {...register("tagline")} rows={3} className="editor-field" /></div>
      <div><label className="field-label" htmlFor="footer-copyright">Copyright line</label><input id="footer-copyright" {...register("copyright")} className="editor-field" /></div>
      <Controller control={control} name="words" render={({ field }) => <TextListField label="Rotating word" values={field.value} onChange={field.onChange} min={1} />} />
      <details className="editor-details"><summary>Social links</summary><Controller control={control} name="socialLinks" render={({ field }) => <SocialLinksField value={field.value} onChange={field.onChange} />} /></details>
    </form>
  );
};
