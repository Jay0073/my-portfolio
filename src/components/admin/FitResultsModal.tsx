import React, { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, CircleSlash, Loader2, X, XCircle } from "lucide-react";
import type { FitCheck } from "../../lib/fitChecks";

interface Props {
  open: boolean;
  onClose: () => void;
  results: FitCheck[] | null;
  progress: string;
  running: boolean;
  stale: boolean;
  onCancel: () => void;
  onRerun: () => void;
  onInspect: (result: FitCheck) => void;
}

export const FitResultsModal: React.FC<Props> = ({ open, onClose, results, progress, running, stale, onCancel, onRerun, onInspect }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [issuesOnly, setIssuesOnly] = useState(true);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    return () => previous?.focus();
  }, [open]);
  if (!open) return null;
  const counts = { fail: 0, warning: 0, skipped: 0, pass: 0 };
  results?.forEach((result) => counts[result.status]++);
  const devices = Array.from(new Set(results?.map((result) => result.viewport)));
  const icons = { pass: <CheckCircle2 size={16} className="text-[#61DAB3]" />, fail: <XCircle size={16} className="text-red-300" />, warning: <AlertTriangle size={16} className="text-amber-300" />, skipped: <CircleSlash size={16} className="text-[#999]" /> };
  return (
    <div className="fixed inset-0 z-[70] bg-black/75 p-3 sm:p-6 flex items-center justify-center" onClick={onClose} role="dialog" aria-modal="true" aria-label="Fit check results" onKeyDown={(event) => {
      if (event.key === "Escape") { event.stopPropagation(); onClose(); }
      if (event.key !== "Tab") return;
      const buttons = panelRef.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
      if (!buttons?.length) return;
      const first = buttons[0]; const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }}>
      <div ref={panelRef} className="bg-[#1a1a1a] border border-white/15 rounded-xl w-full max-w-3xl max-h-[90dvh] flex flex-col overflow-hidden" onClick={(event) => event.stopPropagation()}>
        <div className="p-5 border-b border-white/10 flex items-start justify-between gap-4">
          <div><h2 className="font-poppins font-semibold text-lg">Fit Check</h2><p className="editor-help mt-1">Your draft across desktop, laptop, and three phone sizes.</p></div>
          <button className="editor-icon-button" onClick={onClose} aria-label="Close results"><X size={18} /></button>
        </div>
        <div className="p-5 overflow-y-auto space-y-5" aria-live="polite">
          {running && <div className="flex items-center gap-3 text-sm"><Loader2 size={18} className="animate-spin text-[#61DAB3] shrink-0" /><div><p>{progress || "Preparing the latest draft…"}</p><p className="editor-help mt-1">Your working preview stays in place.</p></div></div>}
          {stale && <p className="editor-validation !mb-0">Your draft changed after this check started. Run it again to check the latest edits.</p>}
          {results && <>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm"><span className={counts.fail ? "text-red-300" : "text-[#61DAB3]"}>{counts.fail} failures</span><span className="text-amber-200">{counts.warning} warnings</span><span className="text-[#aaa]">{counts.skipped} skipped</span><span className="text-[#61DAB3]">{counts.pass} passed</span></div>
            <p className="editor-help">Skipped items are explained below. Layout checks help find problems; compare the preview before publishing.</p>
            <button className="editor-action-button" onClick={() => setIssuesOnly(!issuesOnly)} aria-pressed={issuesOnly}>{issuesOnly ? "Show passed checks too" : "Show issues and skipped checks"}</button>
            {devices.map((device) => {
              const checks = results.filter((result) => result.viewport === device && (!issuesOnly || result.status !== "pass"));
              return <section key={device ?? "unknown"} className="space-y-2"><h3 className="text-sm font-semibold text-[#61DAB3]">{device ?? "Preview"}</h3>{checks.length === 0 ? <p className="editor-help">All checks passed for this screen.</p> : checks.map((result, index) => <div key={index} className={"fit-result fit-result-" + result.status}>
                <div className="flex gap-2 items-start"><span className="shrink-0 mt-0.5">{icons[result.status]}</span><div className="min-w-0 flex-1"><p className="text-white font-medium">{result.section.charAt(0).toUpperCase() + result.section.slice(1)} · {result.name}</p><p className="editor-help mt-1 break-words">{result.detail}</p></div></div>
                {(result.status === "fail" || result.status === "warning") && <button className="editor-add ml-6 mt-2" onClick={() => onInspect(result)}>Inspect section →</button>}
              </div>)}</section>;
            })}
          </>}
        </div>
        <div className="p-4 border-t border-white/10 flex justify-end gap-2">
          {running ? <button className="editor-action-button" onClick={onCancel}>Cancel check</button> : <button className="editor-action-button" onClick={onRerun}>Run again</button>}
          <button className="editor-action-button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};
