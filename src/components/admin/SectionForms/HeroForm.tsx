import React from "react";
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useSectionForm } from "../useSectionForm";

interface HeroValues {
  name: string;
  phrases: string[];
  buttonText: string;
}

interface HeroFormProps {
  content: HeroValues;
  revision: number;
  onChange: (data: HeroValues) => void;
}

export const HeroForm: React.FC<HeroFormProps> = ({ content, revision, onChange }) => {
  const { register, control, watch } = useSectionForm<HeroValues>(content, revision, onChange);
  const { fields, append, remove } = useFieldArray({ control, name: "phrases" });
  const phrases = watch("phrases");

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#BBBBBB] mb-2">Name</label>
        <input
          {...register("name")}
          className="w-full px-4 py-2 bg-[#121212] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]"
          placeholder="Your name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#BBBBBB] mb-2">Button Text</label>
        <input
          {...register("buttonText")}
          className="w-full px-4 py-2 bg-[#121212] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]"
          placeholder="Explore My Work"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-[#BBBBBB]">Rotating Phrases</label>
          <button
            type="button"
            onClick={() => append("")}
            className="text-sm text-[#61DAB3] hover:text-white flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <GripVertical className="w-5 h-5 text-[#666] cursor-grab" />
              <input
                {...register(`phrases.${index}`)}
                className="flex-1 px-4 py-2 bg-[#121212] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]"
                placeholder={`Phrase ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-1 text-[#666] hover:text-red-400 transition-colors"
                aria-label="Remove phrase"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#666] mt-2">
          {phrases?.length ?? 0} phrase(s). The hero cycles through them.
        </p>
      </div>
    </form>
  );
};
