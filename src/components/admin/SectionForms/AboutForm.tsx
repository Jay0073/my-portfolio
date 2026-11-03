import React from "react";
import { Controller, useFieldArray } from "react-hook-form";
import { Plus } from "lucide-react";
import { useSectionForm } from "../useSectionForm";
import { ListActions, SocialLinksField, TextListField } from "../EditorFields";
import type { PortfolioContent } from "../../../lib/contentSchema";

type AboutValues = PortfolioContent["about"];
const normalize = (values: AboutValues): AboutValues => ({ ...values, lottieUrl: values.lottieUrl?.trim() || undefined });

export const AboutForm: React.FC<{ content: AboutValues; revision: number; onChange: (data: AboutValues) => void }> = ({ content, revision, onChange }) => {
  const { register, control } = useSectionForm(content, revision, onChange, normalize);
  const { fields, append, remove, move } = useFieldArray({ control, name: "stats" });
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <div><label className="field-label" htmlFor="about-bio">Bio</label><textarea id="about-bio" {...register("bio")} rows={7} className="editor-field resize-y" placeholder="Your background and what you do…" /></div>
      <div className="space-y-3">
        <div className="flex items-center justify-between"><h3 className="text-sm font-medium">Stats</h3><button type="button" className="editor-add" onClick={() => append({ label: "", value: "" })}><Plus size={14} /> Add stat</button></div>
        <p className="editor-help">The same values and labels appear on desktop and mobile.</p>
        {fields.map((field, index) => (
          <div key={field.id} className="editor-card space-y-3">
            <div className="editor-card-heading"><span>Stat {index + 1}</span><ListActions index={index} count={fields.length} label={"stat " + (index + 1)} min={1} onMove={move} onRemove={() => remove(index)} /></div>
            <div><label className="field-label" htmlFor={"stat-value-" + index}>Value</label><input id={"stat-value-" + index} {...register(`stats.${index}.value`)} className="editor-field" placeholder="10+ Projects" /></div>
            <div><label className="field-label" htmlFor={"stat-label-" + index}>Label</label><input id={"stat-label-" + index} {...register(`stats.${index}.label`)} className="editor-field" placeholder="Delivered" /></div>
          </div>
        ))}
      </div>
      <Controller control={control} name="values" render={({ field }) => <TextListField label="Professional value" values={field.value} onChange={field.onChange} min={1} />} />
      <div><label className="field-label" htmlFor="about-resume">Resume URL</label><input id="about-resume" {...register("resumeUrl")} className="editor-field" placeholder="https://…" /></div>
      <details className="editor-details"><summary>Animation settings</summary><div className="space-y-3"><label className="field-label" htmlFor="about-animation">Animation URL (Lottie)</label><input id="about-animation" {...register("lottieUrl")} className="editor-field" placeholder="https://… .lottie" /><p className="editor-help">Optional. Shown on desktop with its original proportions. The website keeps this animation hidden on phones.</p></div></details>
      <details className="editor-details"><summary>Social links</summary><Controller control={control} name="socialLinks" render={({ field }) => <SocialLinksField value={field.value} onChange={field.onChange} />} /></details>
    </form>
  );
};
