import React, { useId } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { getIconOptions } from "../../lib/iconMap";
import type { SocialLink } from "../../lib/contentSchema";

export const ListActions: React.FC<{ index: number; count: number; label: string; onMove: (from: number, to: number) => void; onRemove: () => void; min?: number }> = ({ index, count, label, onMove, onRemove, min = 0 }) => (
  <div className="editor-list-actions">
    <button type="button" className="editor-icon-button" aria-label={`Move ${label} up`} disabled={index === 0} onClick={() => onMove(index, index - 1)}><ArrowUp size={14} /></button>
    <button type="button" className="editor-icon-button" aria-label={`Move ${label} down`} disabled={index === count - 1} onClick={() => onMove(index, index + 1)}><ArrowDown size={14} /></button>
    <button type="button" className="editor-icon-button hover:!text-red-400" aria-label={`Remove ${label}`} disabled={count <= min} onClick={onRemove}><Trash2 size={14} /></button>
  </div>
);

export const TextListField: React.FC<{ label: string; values: string[]; onChange: (values: string[]) => void; min?: number }> = ({ label, values, onChange, min = 0 }) => {
  const id = useId();
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2"><h3 className="text-sm font-medium">{label}</h3><button type="button" className="editor-add" onClick={() => onChange([...values, ""])}><Plus size={14} /> Add</button></div>
      {values.map((value, index) => (
        <div key={index} className="editor-card">
          <div className="editor-card-heading"><label htmlFor={`${id}-${index}`}>{label} {index + 1}</label><ListActions index={index} count={values.length} min={min} label={`${label.toLowerCase()} ${index + 1}`} onMove={(from, to) => { const next = [...values]; next.splice(to, 0, next.splice(from, 1)[0]); onChange(next); }} onRemove={() => onChange(values.filter((_, i) => i !== index))} /></div>
          <input id={`${id}-${index}`} className="editor-field" value={value} onChange={(e) => onChange(values.map((item, i) => i === index ? e.target.value : item))} />
        </div>
      ))}
    </div>
  );
};

export const SocialLinksField: React.FC<{ value: SocialLink[]; onChange: (links: SocialLink[]) => void }> = ({ value, onChange }) => {
  const id = useId();
  const options = getIconOptions("social");
  const update = (index: number, field: keyof SocialLink, next: string) => onChange(value.map((link, i) => i === index ? { ...link, [field]: next } : link));
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between"><h3 className="text-sm">Social links</h3><button type="button" className="editor-add" onClick={() => onChange([...value, { icon: "Github", href: "", label: "" }])}><Plus size={14} /> Add link</button></div>
      {value.map((link, index) => (
        <div key={index} className="editor-card space-y-3">
          <div className="editor-card-heading"><span>Link {index + 1}</span><ListActions index={index} count={value.length} label={`social link ${index + 1}`} onMove={(from, to) => { const next = [...value]; next.splice(to, 0, next.splice(from, 1)[0]); onChange(next); }} onRemove={() => onChange(value.filter((_, i) => i !== index))} /></div>
          <div><label className="field-label" htmlFor={`${id}-icon-${index}`}>Icon</label><select id={`${id}-icon-${index}`} className="editor-field" value={link.icon} onChange={(e) => update(index, "icon", e.target.value)}>{options.map((option) => <option key={option.name}>{option.name}</option>)}</select></div>
          <div><label className="field-label" htmlFor={`${id}-url-${index}`}>URL</label><input id={`${id}-url-${index}`} className="editor-field" value={link.href} onChange={(e) => update(index, "href", e.target.value)} placeholder="https://…" /></div>
          <div><label className="field-label" htmlFor={`${id}-label-${index}`}>Accessible label</label><input id={`${id}-label-${index}`} className="editor-field" value={link.label} onChange={(e) => update(index, "label", e.target.value)} /></div>
        </div>
      ))}
    </div>
  );
};
