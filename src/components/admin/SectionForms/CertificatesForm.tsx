import React from "react";
import { useFieldArray, Controller } from "react-hook-form";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useSectionForm } from "../useSectionForm";
import { ImageField } from "../ImageField";

interface CertificateEntry {
  src: string;
  name: string;
  issuer: string;
  year?: string;
}

interface CertificateValues {
  certificates: CertificateEntry[];
}

interface CertificatesFormProps {
  content: CertificateEntry[];
  revision: number;
  onChange: (data: CertificateEntry[]) => void;
}

export const CertificatesForm: React.FC<CertificatesFormProps> = ({ content, revision, onChange }) => {
  const { register, control } = useSectionForm<CertificateValues>(
    { certificates: content },
    revision,
    (data) => onChange(data.certificates)
  );
  const { fields, append, remove } = useFieldArray({ control, name: "certificates" });

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-[#BBBBBB]">Certificates</label>
        <button type="button" onClick={() => append({ src: "", name: "", issuer: "", year: "" })} className="text-sm text-[#61DAB3] hover:text-white flex items-center gap-1"><Plus className="w-4 h-4" /> Add</button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="bg-[#121212] border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Certificate #{index + 1}</h4>
              <div className="flex items-center gap-2">
                <GripVertical className="w-5 h-5 text-[#666] cursor-grab" />
                <button type="button" onClick={() => remove(index)} className="p-1 text-[#666] hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Controller
                control={control}
                name={`certificates.${index}.src`}
                render={({ field }) => (
                  <ImageField
                    label="Image"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    placeholder="/assets/cert.png or upload"
                  />
                )}
              />
              <div>
                <label className="block text-xs text-[#666] mb-1">Year (optional)</label>
                <input {...register(`certificates.${index}.year`)} className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" placeholder="2024" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-[#666] mb-1">Name</label>
                <input {...register(`certificates.${index}.name`)} className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" placeholder="Certificate name" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs text-[#666] mb-1">Issuer</label>
                <input {...register(`certificates.${index}.issuer`)} className="w-full px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]" placeholder="Issuing organization" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </form>
  );
};
