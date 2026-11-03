import React from "react";
import {
  Save,
  Rocket,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Undo2,
  Redo2,
  History,
  ScanLine,
} from "lucide-react";

const barBtnBase =
  "px-4 py-2 rounded-md font-inter font-medium text-sm transition-all duration-300 border flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:pointer-events-none";

const barBtnStyles = {
  primary: "bg-white text-[#1A1A1A] border-white hover:bg-white/90",
  secondary: "bg-transparent text-white border-white/40 hover:border-white",
};

const BarButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  ariaLabel: string;
  title?: string;
  children: React.ReactNode;
}> = ({ onClick, disabled, variant = "secondary", ariaLabel, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    title={title}
    className={`${barBtnBase} ${barBtnStyles[variant]}`}
  >
    {children}
  </button>
);

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
  autosaveOn: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  onSave,
  onPublish,
  onExport,
  onImport,
  onUndo,
  onRedo,
  onHistory,
  onFitCheck,
  canUndo,
  canRedo,
  isSaving,
  isPublishing,
  isFitChecking,
  autosaveOn,
  lastSaved,
  hasUnsavedChanges,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      if (e.target) e.target.value = "";
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#1A1A1A]/95 backdrop-blur z-50">
      <div className="max-w-full mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <BarButton onClick={onSave} disabled={isSaving || !hasUnsavedChanges} variant="primary" ariaLabel="Save draft">
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Draft"}
          </BarButton>

          <BarButton onClick={onPublish} disabled={isPublishing} ariaLabel="Publish to live">
            <Rocket className="w-4 h-4" />
            {isPublishing ? "Publishing..." : "Publish"}
          </BarButton>

          <BarButton onClick={onUndo} disabled={!canUndo} ariaLabel="Undo" title="Undo (local)">
            <Undo2 className="w-4 h-4" />
          </BarButton>

          <BarButton onClick={onRedo} disabled={!canRedo} ariaLabel="Redo" title="Redo (local)">
            <Redo2 className="w-4 h-4" />
          </BarButton>

          <BarButton onClick={onHistory} ariaLabel="Version history" title="Published version history">
            <History className="w-4 h-4" />
          </BarButton>

          <BarButton onClick={onFitCheck} disabled={isFitChecking} ariaLabel="Run fit check" title="Check text fit and accessibility in preview">
            <ScanLine className="w-4 h-4" />
            {isFitChecking ? "Checking..." : "Fit Check"}
          </BarButton>

          <BarButton onClick={onExport} ariaLabel="Export JSON">
            <Download className="w-4 h-4" />
            Export
          </BarButton>

          <div className="relative">
            <BarButton onClick={handleImportClick} ariaLabel="Import JSON">
              <Upload className="w-4 h-4" />
              Import
            </BarButton>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              aria-label="Import JSON file"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-[#888]">
          {autosaveOn && !hasUnsavedChanges && lastSaved && (
            <span className="flex items-center gap-1 text-[#61DAB3]">
              <CheckCircle className="w-4 h-4" />
              Autosaved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {autosaveOn && hasUnsavedChanges && (
            <span className="flex items-center gap-1 text-yellow-400 animate-pulse">
              <AlertCircle className="w-4 h-4" />
              Saving...
            </span>
          )}
          {!autosaveOn && lastSaved && (
            <span className="flex items-center gap-1 text-[#61DAB3]">
              <CheckCircle className="w-4 h-4" />
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {!autosaveOn && hasUnsavedChanges && !lastSaved && (
            <span className="flex items-center gap-1 text-yellow-400">
              <AlertCircle className="w-4 h-4" />
              Unsaved changes
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
