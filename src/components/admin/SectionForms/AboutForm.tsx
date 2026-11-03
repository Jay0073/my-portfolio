import React from "react";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useSectionForm } from "../useSectionForm";
import { getIconOptions } from "../../../lib/iconMap";

interface SocialLink {
  icon: string;
  href: string;
  label: string;
}

interface AboutValues {
  bio: string;
  stats: { label: string; value: string }[];
  values: string[];
  socialLinks: SocialLink[];
  resumeUrl: string;
  lottieUrl?: string;
}

interface AboutFormProps {
  content: AboutValues;
  revision: number;
  onChange: (data: AboutValues) => void;
}

export const AboutForm: React.FC<AboutFormProps> = ({ content, revision, onChange }) => {
  const { register, control } = useSectionForm<AboutValues>(content, revision, onChange);
  const { fields: statFields, append: appendStat, remove: removeStat } = useFieldArray({ control, name: "stats" });
  const { fields: valueFields, append: appendValue, remove: removeValue } = useFieldArray({ control, name: "values" });
  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({ control, name: "socialLinks" });
  const iconOptions = getIconOptions("social");

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#BBBBBB] mb-2">Bio</label>
        <textarea
          {...register("bio")}
          rows={4}
          className="w-full px-4 py-2 bg-[#121212] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3] resize-y"
          placeholder="Your bio..."
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-[#BBBBBB]">Stats</label>
          <button type="button" onClick={() => appendStat({ label: "", value: "" })} className="text-sm text-[#61DAB3] hover:text-white flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
        </div>
        <div className="space-y-2">
          {statFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <GripVertical className="w-5 h-5 text-[#666] cursor-grab" />
              <input {...register(`stats.${index}.label`)} placeholder="Label" className="flex-1 px-3 py-2 bg-[#121212] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" />
              <input {...register(`stats.${index}.value`)} placeholder="Value" className="flex-1 px-3 py-2 bg-[#121212] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" />
              <button type="button" onClick={() => removeStat(index)} className="p-1 text-[#666] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-[#BBBBBB]">Values</label>
          <button type="button" onClick={() => appendValue("")} className="text-sm text-[#61DAB3] hover:text-white flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
        </div>
        <div className="space-y-2">
          {valueFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <GripVertical className="w-5 h-5 text-[#666] cursor-grab" />
              <input {...register(`values.${index}`)} placeholder="Value" className="flex-1 px-3 py-2 bg-[#121212] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" />
              <button type="button" onClick={() => removeValue(index)} className="p-1 text-[#666] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-[#BBBBBB]">Social Links</label>
          <button type="button" onClick={() => appendLink({ icon: "Github", href: "", label: "" })} className="text-sm text-[#61DAB3] hover:text-white flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
        </div>
        <div className="space-y-2">
          {linkFields.map((field, index) => (
            <div key={field.id} className="space-y-2 pl-7">
              <div className="flex items-center gap-2">
                <GripVertical className="w-5 h-5 text-[#666] cursor-grab" />
                <select {...register(`socialLinks.${index}.icon`)} className="w-32 px-3 py-2 bg-[#121212] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#61DAB3]">
                  {iconOptions.map(opt => <option key={opt.name} value={opt.name}>{opt.name}</option>)}
                </select>
                <input {...register(`socialLinks.${index}.href`)} placeholder="URL" className="flex-1 px-3 py-2 bg-[#121212] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" />
                <input {...register(`socialLinks.${index}.label`)} placeholder="Label" className="w-32 px-3 py-2 bg-[#121212] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" />
                <button type="button" onClick={() => removeLink(index)} className="p-1 text-[#666] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#BBBBBB] mb-2">Resume URL</label>
        <input
          {...register("resumeUrl")}
          className="w-full px-4 py-2 bg-[#121212] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#BBBBBB] mb-2">Animation URL (Lottie)</label>
        <input
          {...register("lottieUrl")}
          className="w-full px-4 py-2 bg-[#121212] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]"
          placeholder="https://... .lottie"
        />
      </div>
    </form>
  );
};
