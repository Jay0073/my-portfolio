import React, { useRef, useState } from "react";
import { Upload, ImageIcon, Loader2 } from "lucide-react";
import { uploadImage } from "../../lib/adminApi";

interface ImageFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * URL text field + "Upload" button (stores image in Vercel Blob).
 * Stores the file as-is (no re-compression), warns above 2 MB.
 */
export const ImageField: React.FC<ImageFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = "https://... or upload",
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (file.size > 2 * 1024 * 1024) {
      setError("File is larger than 2 MB. Please use a smaller image.");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-xs text-[#666] mb-1">{label}</label>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 px-3 py-2 bg-[#1A1A1A] border border-white/10 rounded text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-3 py-2 border border-white/20 rounded text-[#BBBBBB] hover:text-white hover:border-white/50 transition-colors disabled:opacity-50 flex items-center gap-1 text-xs whitespace-nowrap"
          aria-label={`Upload ${label}`}
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
      </div>
      {value && (
        <div className="mt-2 flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-[#666]" />
          <img
            src={value}
            alt=""
            className="h-10 max-w-[120px] object-contain rounded border border-white/10 bg-white/5"
            loading="lazy"
          />
        </div>
      )}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
};
