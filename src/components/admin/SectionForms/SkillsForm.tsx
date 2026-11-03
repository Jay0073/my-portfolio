import React from "react";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useSectionForm } from "../useSectionForm";
import { getIconOptions } from "../../../lib/iconMap";

interface SkillEntry {
  name: string;
  icon: string;
  percent: number | string;
  desc: string[] | string;
}

interface SkillValues {
  skills: SkillEntry[];
}

interface SkillsFormProps {
  content: SkillEntry[];
  revision: number;
  onChange: (data: SkillEntry[]) => void;
}

const toCsv = (arr: unknown): string =>
  Array.isArray(arr) ? arr.join(", ") : String(arr ?? "");

const transform = (values: SkillValues): SkillValues => ({
  skills: values.skills.map((s) => ({
    ...s,
    percent: Math.min(100, Math.max(0, Number(s.percent) || 0)),
    desc: toCsv(s.desc)
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
  })),
});

export const SkillsForm: React.FC<SkillsFormProps> = ({ content, revision, onChange }) => {
  const { register, control, watch } = useSectionForm<SkillValues>(
    { skills: content },
    revision,
    (data) => onChange(data.skills),
    transform
  );
  const { fields, append, remove } = useFieldArray({ control, name: "skills" });
  const iconOptions = getIconOptions("skills");

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-[#BBBBBB]">Skills</label>
        <button type="button" onClick={() => append({ name: "", icon: "FaReact", percent: 50, desc: [] })} className="text-sm text-[#61DAB3] hover:text-white flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="bg-[#121212] border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Skill #{index + 1}</h4>
              <div className="flex items-center gap-2">
                <GripVertical className="w-5 h-5 text-[#666] cursor-grab" />
                <button type="button" onClick={() => remove(index)} className="p-1 text-[#666] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs text-[#666] mb-1">Name</label>
                <input {...register(`skills.${index}.name`)} className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" placeholder="React" />
              </div>
              <div>
                <label className="block text-xs text-[#666] mb-1">Icon</label>
                <select {...register(`skills.${index}.icon`)} className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white focus:outline-none focus:ring-2 focus:ring-[#61DAB3]">
                  {iconOptions.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-[#666] mb-1">Proficiency %</label>
                <input {...register(`skills.${index}.percent`, { valueAsNumber: true })} type="range" min="0" max="100" className="w-full h-2 bg-[#1A1A1A] rounded-lg appearance-none accent-[#61DAB3]" />
                <div className="flex justify-between text-xs text-[#666] mt-1">
                  <span>0%</span>
                  <span>{watch(`skills.${index}.percent`)}%</span>
                  <span>100%</span>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-[#666] mb-1">Description lines (comma separated)</label>
                <input {...register(`skills.${index}.desc`)} className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" placeholder="Hooks, Context, SPA" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};
