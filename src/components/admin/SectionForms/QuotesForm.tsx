import React from "react";
import { useFieldArray } from "react-hook-form";
import { Plus } from "lucide-react";
import { ListActions } from "../EditorFields";
import { useSectionForm } from "../useSectionForm";

interface QuoteEntry {
  text: string;
  author: string;
}

interface QuoteValues {
  quotes: QuoteEntry[];
}

interface QuotesFormProps {
  content: QuoteEntry[];
  revision: number;
  onChange: (data: QuoteEntry[]) => void;
}

export const QuotesForm: React.FC<QuotesFormProps> = ({ content, revision, onChange }) => {
  const { register, control } = useSectionForm<QuoteValues>(
    { quotes: content },
    revision,
    (data) => onChange(data.quotes)
  );
  const { fields, append, remove, move } = useFieldArray({ control, name: "quotes" });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <p className="text-xs text-[#888]">
        Shown in the pop-up quote card on first visit. One quote is picked at random.
      </p>

      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-[#BBBBBB]">Quotes</label>
        <button
          type="button"
          onClick={() => append({ text: "", author: "" })}
          className="text-sm text-[#61DAB3] hover:text-white flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="bg-[#121212] border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Quote #{index + 1}</h4>
              <div className="flex items-center gap-2">
                <ListActions index={index} count={fields.length} label={"quote " + (index + 1)} onMove={move} onRemove={() => remove(index)} />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#666] mb-1">Text</label>
              <textarea
                {...register(`quotes.${index}.text`)}
                rows={2}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3] resize-y"
                placeholder="Quote text..."
              />
            </div>
            <div>
              <label className="block text-xs text-[#666] mb-1">Author</label>
              <input
                {...register(`quotes.${index}.author`)}
                className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]"
                placeholder="Author name"
              />
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};
