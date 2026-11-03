import React from "react";
import { useFieldArray } from "react-hook-form";
import { Plus } from "lucide-react";
import { ListActions } from "../EditorFields";
import { getIconOptions } from "../../../lib/iconMap";
import { useSectionForm } from "../useSectionForm";

interface EducationEntry {
  year: string;
  institution: string;
  course: string;
  icon: string;
}

interface EducationFormProps {
  content: EducationEntry[];
  revision: number;
  onChange: (data: EducationEntry[]) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({ content, revision, onChange }) => {
  const { register, control } = useSectionForm<{ education: EducationEntry[] }>(
    { education: content },
    revision,
    (data) => onChange(data.education)
  );
  const { fields, append, remove, move } = useFieldArray({ control, name: "education" });
  const iconOptions = getIconOptions("education");

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-[#BBBBBB]">Education</label>
        <button type="button" onClick={() => append({ year: "", institution: "", course: "", icon: "MdEngineering" })} className="text-sm text-[#61DAB3] hover:text-white flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="bg-[#121212] border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Education #{index + 1}</h4>
              <div className="flex items-center gap-2">
                <ListActions index={index} count={fields.length} label={"education " + (index + 1)} onMove={move} onRemove={() => remove(index)} />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs text-[#666] mb-1">Year</label>
                <input {...register(`education.${index}.year`)} className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" placeholder="2026" />
              </div>
              <div>
                <label className="block text-xs text-[#666] mb-1">Icon</label>
                <select {...register(`education.${index}.icon`)} className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-[#61DAB3]">
                  {iconOptions.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-[#666] mb-1">Institution</label>
                <input {...register(`education.${index}.institution`)} className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" placeholder="University name" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-[#666] mb-1">Course</label>
                <input {...register(`education.${index}.course`)} className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" placeholder="Degree program" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};
