import React, { useEffect, useState } from "react";
import { Loader2, Lock, X, History, RotateCcw, ChevronRight } from "lucide-react";
import { adminFetch } from "../../lib/adminApi";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import type { VersionMeta } from "../../../api/admin/_lib/kv";

/* ---------- Session re-auth modal (shown on 401) ---------- */

export const SessionModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const { login } = useAdminAuth();

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setIsLoading(true);
    setError(false);
    try {
      const ok = await login(password);
      if (ok) {
        setPassword("");
        onClose();
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-label="Session expired">
      <div className="w-full max-w-md bg-[#1A1A1A] border border-white/10 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-yellow-400">
          <Lock className="w-5 h-5" />
          <h2 className="font-poppins font-semibold text-lg text-white">Session expired</h2>
        </div>
        <p className="text-sm text-[#BBBBBB]">Enter the admin password again. Your unsaved edits stay in the editor.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            disabled={isLoading}
            placeholder="Admin password"
            className="w-full px-4 py-3 bg-[#121212] border border-white/10 rounded-lg text-white placeholder-[#666] focus:outline-none focus:ring-2 focus:ring-[#61DAB3]"
          />
          {error && <p className="text-sm text-red-400">Wrong password. Try again.</p>}
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-[#BBBBBB] hover:text-white border border-white/20 rounded-lg">
              Later
            </button>
            <button type="submit" disabled={isLoading || !password.trim()} className="px-4 py-2 text-sm font-medium bg-[#61DAB3] text-[#1A1A1A] rounded-lg disabled:opacity-50 flex items-center gap-2">
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Re-authenticate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------- Publish gate modal ---------- */

interface PublishGateModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  hasUnsavedChanges: boolean;
  isPublishing: boolean;
  counts: { projects: number; skills: number; experience: number; certificates: number };
}

export const PublishGateModal: React.FC<PublishGateModalProps> = ({
  open,
  onClose,
  onConfirm,
  hasUnsavedChanges,
  isPublishing,
  counts,
}) => {
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    if (open) setReviewed(false);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-label="Publish confirmation">
      <div className="w-full max-w-lg bg-[#1A1A1A] border border-white/10 rounded-xl p-6 space-y-5">
        <h2 className="font-poppins font-semibold text-lg">Publish to live site?</h2>

        <div className="bg-[#121212] border border-white/10 rounded-lg p-4 text-sm text-[#BBBBBB] space-y-2">
          <div className="flex justify-between"><span>Projects</span><span className="text-white">{counts.projects}</span></div>
          <div className="flex justify-between"><span>Skills</span><span className="text-white">{counts.skills}</span></div>
          <div className="flex justify-between"><span>Experience entries</span><span className="text-white">{counts.experience}</span></div>
          <div className="flex justify-between"><span>Certificates</span><span className="text-white">{counts.certificates}</span></div>
          <div className="flex justify-between border-t border-white/10 pt-2">
            <span>Draft changes</span>
            <span className={hasUnsavedChanges ? "text-yellow-400" : "text-[#61DAB3]"}>
              {hasUnsavedChanges ? "Will be saved first" : "All saved"}
            </span>
          </div>
        </div>

        <label className="flex items-start gap-3 text-sm text-[#BBBBBB] cursor-pointer">
          <input
            type="checkbox"
            checked={reviewed}
            onChange={(e) => setReviewed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#61DAB3]"
          />
          I reviewed the preview (desktop and mobile) and the fit check.
        </label>

        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} disabled={isPublishing} className="px-4 py-2 text-sm text-[#BBBBBB] hover:text-white border border-white/20 rounded-lg">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!reviewed || isPublishing}
            className="px-4 py-2 text-sm font-medium bg-[#61DAB3] text-[#1A1A1A] rounded-lg disabled:opacity-50 flex items-center gap-2"
          >
            {isPublishing && <Loader2 className="w-4 h-4 animate-spin" />}
            {hasUnsavedChanges ? "Save & Publish" : "Publish"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Version history panel ---------- */

export const HistoryPanel: React.FC<{ open: boolean; onClose: () => void; onRestore: (content: unknown) => void }> = ({
  open,
  onClose,
  onRestore,
}) => {
  const [versions, setVersions] = useState<VersionMeta[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    adminFetch("/api/admin/versions")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("Failed to load"))))
      .then((data) => setVersions(data.versions ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [open]);

  if (!open) return null;

  const handleRestore = async (id: string) => {
    setRestoringId(id);
    setError(null);
    try {
      const res = await adminFetch(`/api/admin/versions?id=${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error("Failed to load version");
      const data = await res.json();
      onRestore(data.content);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Restore failed");
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex justify-end bg-black/50" onClick={onClose} role="dialog" aria-modal="true" aria-label="Version history">
      <div
        className="w-full max-w-md h-full bg-[#1A1A1A] border-l border-white/10 p-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-poppins font-semibold text-lg flex items-center gap-2">
            <History className="w-5 h-5" /> Publish history
          </h2>
          <button onClick={onClose} aria-label="Close history" className="p-1 text-[#666] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#888] mb-4">Every publish saves a snapshot. Restoring loads a snapshot into the editor as unsaved changes.</p>

        {loading && <p className="text-sm text-[#888]">Loading...</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="space-y-3">
          {versions?.map((v) => (
            <div key={v.id} className="bg-[#121212] border border-white/10 rounded-lg p-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-sm text-white">{new Date(v.publishedAt).toLocaleString()}</p>
                <p className="text-xs text-[#666]">{Math.round(v.bytes / 1024)} KB · {v.id}</p>
              </div>
              <button
                onClick={() => handleRestore(v.id)}
                disabled={restoringId !== null}
                className="px-3 py-1.5 text-xs border border-white/20 rounded-lg text-[#BBBBBB] hover:text-white hover:border-white/50 disabled:opacity-50 flex items-center gap-1"
              >
                {restoringId === v.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
                Restore
              </button>
            </div>
          ))}
          {versions && versions.length === 0 && !loading && (
            <p className="text-sm text-[#666]">No published versions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
