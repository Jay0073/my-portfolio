import React, { useEffect, useRef, useState } from "react";
import { Save, Rocket, Download, Upload, Undo2, Redo2, History, ScanLine, MoreHorizontal } from "lucide-react";

interface ActionBarProps {
  onSave: () => void;
  onPublish: () => void;
  onExport: () => void;
  onImport: (file: File) => void;
  onUndo: () => void;
  onRedo: () => void;
  onHistory: () => void;
  onFitCheck: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  isFitChecking: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  disabled: boolean;
  saveError: string | null;
}

export const ActionBar: React.FC<ActionBarProps> = (props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState(false);
  useEffect(() => {
    if (!more) return;
    const close = (event: PointerEvent) => { if (!moreRef.current?.contains(event.target as Node)) setMore(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setMore(false); moreRef.current?.querySelector("button")?.focus(); } };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, [more]);
  const action = (callback: () => void) => { setMore(false); callback(); };
  return (
    <footer className="editor-actionbar" aria-label="Editor actions">
      <div className="editor-action-primary">
        <button className="editor-action-button editor-action-button-primary" onClick={props.onSave} disabled={props.disabled || props.isSaving || !props.hasUnsavedChanges} aria-label="Save draft"><Save size={14} />{props.isSaving ? "Saving…" : "Save draft"}</button>
        <button className="editor-action-button" onClick={props.onPublish} disabled={props.disabled || props.isPublishing} aria-label="Publish to live"><Rocket size={14} />Publish</button>
        <button className="editor-action-button" onClick={props.onFitCheck} disabled={props.disabled} aria-label="Run fit check"><ScanLine size={14} />{props.isFitChecking ? "Checking…" : "Fit Check"}</button>
      </div>
      <p className="editor-save-status" role="status">{props.saveError ? <span className="text-amber-300">Save failed · retry Save draft</span> : props.isSaving ? "Saving your draft…" : props.hasUnsavedChanges ? "Unsaved edits" : props.lastSaved ? "Saved " + props.lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Draft loaded"}</p>
      <div className="editor-more" ref={moreRef}>
        <button className="editor-action-button" onClick={() => setMore(!more)} aria-label="More editor actions" aria-expanded={more}><MoreHorizontal size={16} /></button>
        {more && <div className="editor-more-menu" aria-label="More actions">
          <button onClick={() => action(props.onUndo)} disabled={!props.canUndo}><Undo2 size={15} />Undo</button>
          <button onClick={() => action(props.onRedo)} disabled={!props.canRedo}><Redo2 size={15} />Redo</button>
          <button onClick={() => action(props.onHistory)}><History size={15} />Version history</button>
          <button onClick={() => action(props.onExport)} disabled={props.disabled}><Download size={15} />Export draft</button>
          <button onClick={() => action(() => fileRef.current?.click())} disabled={props.disabled}><Upload size={15} />Import content</button>
        </div>}
        <input ref={fileRef} type="file" accept=".json,application/json" className="hidden" aria-label="Import JSON file" onChange={(event) => { const file = event.target.files?.[0]; if (file) props.onImport(file); event.target.value = ""; }} />
      </div>
    </footer>
  );
};
