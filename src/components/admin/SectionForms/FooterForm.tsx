import React from "react";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { getIconOptions } from "../../../lib/iconMap";
import { useSectionForm } from "../useSectionForm";

interface SocialLink {
  icon: string;
  href: string;
  label: string;
}

interface FooterValues {
  quote: string;
  words: string[];
  socialLinks: SocialLink[];
  tagline: string;
  copyright: string;
}

interface FooterFormProps {
  content: FooterValues;
  revision: number;
  onChange: (data: FooterValues) => void;
}

export const FooterForm: React.FC<FooterFormProps> = ({ content, revision, onChange }) => {
  const { register, control } = useSectionForm<FooterValues>(content, revision, onChange);
  const { fields: wordFields, append: appendWord, remove: removeWord } = useFieldArray({ control, name: "words" });
  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({ control, name: "socialLinks" });
  const iconOptions = getIconOptions("social");

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#BBBBBB] mb-2">Quote</label>
        <textarea {...register("quote")} rows={3} className="w-full px-4 py-2 bg-[#121212] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3] resize-y" placeholder="Your quote..." />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#BBBBBB] mb-2">Tagline (under "Let's ...")</label>
        <textarea {...register("tagline")} rows={2} className="w-full px-4 py-2 bg-[#121212] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3] resize-y" placeholder="Whether it's code, coffee..." />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#BBBBBB] mb-2">Copyright line</label>
        <input {...register("copyright")} className="w-full px-4 py-2 bg-[#121212] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" placeholder="© 2025 Your Name · ..." />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-[#BBBBBB]">Rotating Words</label>
          <button type="button" onClick={() => appendWord("")} className="text-sm text-[#61DAB3] hover:text-white flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
        </div>
        <div className="space-y-2">
          {wordFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <GripVertical className="w-5 h-5 text-[#666] cursor-grab" />
              <input {...register(`words.${index}`)} placeholder="Word" className="flex-1 px-3 py-2 bg-[#121212] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" />
              <button type="button" onClick={() => removeWord(index)} className="p-1 text-[#666] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
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
    </form>
  );
};
