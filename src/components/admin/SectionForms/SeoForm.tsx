import React from "react";
import { useSectionForm } from "../useSectionForm";

interface MetaValues {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
}

interface SeoFormProps {
  content: MetaValues;
  revision: number;
  onChange: (data: MetaValues) => void;
}

export const SeoForm: React.FC<SeoFormProps> = ({ content, revision, onChange }) => {
  const { register } = useSectionForm<MetaValues>(content, revision, onChange);

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <p className="text-xs text-[#888]">
        Used for the page title, description, social preview cards, and search engines.
      </p>

      <div>
        <label className="block text-sm font-medium text-[#BBBBBB] mb-2">Page title</label>
        <input
          {...register("title")}
          className="w-full px-4 py-2 bg-[#121212] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]"
          placeholder="Your Name | Role"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#BBBBBB] mb-2">Meta description</label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full px-4 py-2 bg-[#121212] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3] resize-y"
          placeholder="One or two sentences for search results..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#BBBBBB] mb-2">Canonical URL</label>
        <input
          {...register("canonical")}
          className="w-full px-4 py-2 bg-[#121212] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]"
          placeholder="https://your-domain.com/"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#BBBBBB] mb-2">Social preview image URL</label>
        <input
          {...register("ogImage")}
          className="w-full px-4 py-2 bg-[#121212] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]"
          placeholder="https://.../og-image.png"
        />
      </div>
    </form>
  );
};
