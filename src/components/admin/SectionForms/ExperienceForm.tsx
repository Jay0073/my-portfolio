import React from "react";
import { useFieldArray, Controller } from "react-hook-form";
import { Plus } from "lucide-react";
import { ListActions } from "../EditorFields";
import { useSectionForm } from "../useSectionForm";
import { ImageField } from "../ImageField";

interface ExperienceEntry {
  company: string;
  logo: string;
  role: string;
  dates: string;
  description: string;
  skills: string[] | string;
  stickyTop: number | string;
}

interface ExperienceValues {
  experiences: ExperienceEntry[];
}

interface ExperienceFormProps {
  content: ExperienceEntry[];
  revision: number;
  onChange: (data: ExperienceEntry[]) => void;
}

const toCsv = (arr: unknown): string =>
  Array.isArray(arr) ? arr.join(", ") : String(arr ?? "");

const transform = (values: ExperienceValues): ExperienceValues => ({
  experiences: values.experiences.map((e) => ({
    ...e,
    skills: toCsv(e.skills)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    stickyTop: Number(e.stickyTop) || 0,
  })),
});

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ content, revision, onChange }) => {
  const { register, control } = useSectionForm<ExperienceValues>(
    { experiences: content },
    revision,
    (data) => onChange(data.experiences),
    transform
  );
  const { fields, append, remove, move } = useFieldArray({ control, name: "experiences" });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-[#BBBBBB]">Experiences</label>
        <button type="button" onClick={() => append({
          company: "", logo: "", role: "", dates: "", description: "", skills: [], stickyTop: 270
        })} className="text-sm text-[#61DAB3] hover:text-white flex items-center gap-1">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="bg-[#121212] border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Experience #{index + 1}</h4>
              <div className="flex items-center gap-2">
                <ListActions index={index} count={fields.length} label={"experience " + (index + 1)} onMove={move} onRemove={() => remove(index)} />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs text-[#666] mb-1">Company</label>
                <input {...register(`experiences.${index}.company`)} className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" placeholder="Company name" />
              </div>
              <Controller
                control={control}
                name={`experiences.${index}.logo`}
                render={({ field }) => (
                  <ImageField label="Logo" value={field.value ?? ""} onChange={field.onChange} />
                )}
              />
              <div>
                <label className="block text-xs text-[#666] mb-1">Role</label>
                <input {...register(`experiences.${index}.role`)} className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" placeholder="Your role" />
              </div>
              <div>
                <label className="block text-xs text-[#666] mb-1">Dates</label>
                <input {...register(`experiences.${index}.dates`)} className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" placeholder="Jan 2025 – Mar 2025" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-[#666] mb-1">Description</label>
                <textarea {...register(`experiences.${index}.description`)} rows={3} className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3] resize-y" placeholder="Description..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-[#666] mb-1">Skills (comma separated)</label>
                <input
                  {...register(`experiences.${index}.skills`)}
                  className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <div>
                <label className="block text-xs text-[#666] mb-1">Sticky Top (px)</label>
                <input {...register(`experiences.${index}.stickyTop`, { valueAsNumber: true })} type="number" className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" placeholder="270" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};
