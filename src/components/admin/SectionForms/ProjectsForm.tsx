import React from "react";
import { useFieldArray, Controller } from "react-hook-form";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useSectionForm } from "../useSectionForm";
import { ImageField } from "../ImageField";

interface ProjectEntry {
  title: string;
  description: string;
  image: string;
  tags: string[] | string;
  links?: { demo?: string; repo?: string };
}

interface ProjectValues {
  projects: ProjectEntry[];
}

interface ProjectsFormProps {
  content: ProjectEntry[];
  revision: number;
  onChange: (data: ProjectEntry[]) => void;
}

const toCsv = (arr: unknown): string =>
  Array.isArray(arr) ? arr.join(", ") : String(arr ?? "");

const transform = (values: ProjectValues): ProjectValues => ({
  projects: values.projects.map((p) => ({
    ...p,
    tags: toCsv(p.tags)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    links: {
      demo: p.links?.demo || undefined,
      repo: p.links?.repo || undefined,
    },
  })),
});

export const ProjectsForm: React.FC<ProjectsFormProps> = ({ content, revision, onChange }) => {
  const { register, control } = useSectionForm<ProjectValues>(
    { projects: content },
    revision,
    (data) => onChange(data.projects),
    transform
  );
  const { fields, append, remove } = useFieldArray({ control, name: "projects" });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-[#BBBBBB]">Projects</label>
        <button type="button" onClick={() => append({ title: "", description: "", image: "", tags: [], links: {} })} className="text-sm text-[#61DAB3] hover:text-white flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="bg-[#121212] border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Project #{index + 1}</h4>
              <div className="flex items-center gap-2">
                <GripVertical className="w-5 h-5 text-[#666] cursor-grab" />
                <button type="button" onClick={() => remove(index)} className="p-1 text-[#666] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs text-[#666] mb-1">Title</label>
                <input {...register(`projects.${index}.title`)} className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" placeholder="Project title" />
              </div>
              <Controller
                control={control}
                name={`projects.${index}.image`}
                render={({ field }) => (
                  <ImageField label="Image" value={field.value ?? ""} onChange={field.onChange} placeholder="https://... or upload" />
                )}
              />
              <div className="md:col-span-2">
                <label className="block text-xs text-[#666] mb-1">Description</label>
                <textarea {...register(`projects.${index}.description`)} rows={3} className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3] resize-y" placeholder="Project description..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-[#666] mb-1">Tags (comma separated)</label>
                <input {...register(`projects.${index}.tags`)} className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" placeholder="React, Node.js, MongoDB" />
              </div>
              <div>
                <label className="block text-xs text-[#666] mb-1">Demo URL</label>
                <input {...register(`projects.${index}.links.demo`)} className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs text-[#666] mb-1">Repo URL</label>
                <input {...register(`projects.${index}.links.repo`)} className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" placeholder="https://github.com/..." />
              </div>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};
