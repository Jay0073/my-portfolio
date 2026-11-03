import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Monitor, Smartphone } from "lucide-react";
import { Toaster, toast } from "sonner";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { DEFAULT_CONTENT, type PortfolioContent } from "../lib/defaultContent";
import { adminFetch, UnauthorizedError } from "../lib/adminApi";
import { ActionBar } from "../components/admin/ActionBar";
import { SessionModal, PublishGateModal, HistoryPanel, FitResultsModal } from "../components/admin/Modals";
import type { FitCheck } from "../lib/fitChecks";
import { HeroForm } from "../components/admin/SectionForms/HeroForm";
import { AboutForm } from "../components/admin/SectionForms/AboutForm";
import { ExperienceForm } from "../components/admin/SectionForms/ExperienceForm";
import { ProjectsForm } from "../components/admin/SectionForms/ProjectsForm";
import { SkillsForm } from "../components/admin/SectionForms/SkillsForm";
import { EducationForm } from "../components/admin/SectionForms/EducationForm";
import { CertificatesForm } from "../components/admin/SectionForms/CertificatesForm";
import { FooterForm } from "../components/admin/SectionForms/FooterForm";
import { HeaderForm } from "../components/admin/SectionForms/HeaderForm";
import { SeoForm } from "../components/admin/SectionForms/SeoForm";
import { QuotesForm } from "../components/admin/SectionForms/QuotesForm";

const SECTIONS = [
  { id: "hero", label: "Hero", component: HeroForm },
  { id: "about", label: "About", component: AboutForm },
  { id: "experience", label: "Experience", component: ExperienceForm },
  { id: "projects", label: "Projects", component: ProjectsForm },
  { id: "skills", label: "Skills", component: SkillsForm },
  { id: "education", label: "Education", component: EducationForm },
  { id: "certificates", label: "Certificates", component: CertificatesForm },
  { id: "quotes", label: "Quotes", component: QuotesForm },
  { id: "header", label: "Header", component: HeaderForm },
  { id: "footer", label: "Footer", component: FooterForm },
  { id: "meta", label: "SEO", component: SeoForm },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const UNDO_LIMIT = 60;
const AUTOSAVE_DELAY = 800;
const PREVIEW_SYNC_DELAY = 300;
const UNDO_COALESCE_MS = 800;

const AdminEditor: React.FC = () => {
  const { isAuthenticated, isLoading, logout } = useAdminAuth();
  const navigate = useNavigate();

  const [content, setContent] = useState<PortfolioContent>(DEFAULT_CONTENT);
  const [revision, setRevision] = useState(0);
  const [activeSection, setActiveSection] = useState<SectionId>("hero");

  const [savedJson, setSavedJson] = useState<string>("{}");
  const [loaded, setLoaded] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [undoStack, setUndoStack] = useState<PortfolioContent[]>([]);
  const [redoStack, setRedoStack] = useState<PortfolioContent[]>([]);

  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [previewReady, setPreviewReady] = useState(false);

  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [fitResults, setFitResults] = useState<FitCheck[] | null>(null);
  const [showFitResults, setShowFitResults] = useState(false);
  const [isFitChecking, setIsFitChecking] = useState(false);

  const contentRef = useRef(content);
  contentRef.current = content;

  const loadedRef = useRef(loaded);
  loadedRef.current = loaded;

  const savedJsonRef = useRef(savedJson);
  savedJsonRef.current = savedJson;

  const lastUndoPushRef = useRef(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const contentJson = useMemo(() => JSON.stringify(content), [content]);
  const hasUnsavedChanges = loaded && contentJson !== savedJson;

  /* ---------- load draft ---------- */

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate("/admin");
      return;
    }
    (async () => {
      try {
        const res = await adminFetch("/api/admin/content?mode=draft");
        if (res.ok) {
          const { content: draftContent } = await res.json();
          if (draftContent) {
            setContent(draftContent);
            setSavedJson(JSON.stringify(draftContent));
            setRevision((r) => r + 1);
          } else {
            setSavedJson(JSON.stringify(DEFAULT_CONTENT));
          }
        }
        setLoaded(true);
      } catch (err) {
        if (err instanceof UnauthorizedError) {
          // Keep loaded=false so autosave cannot overwrite the draft with
          // defaults. The load retries after re-authentication.
          return;
        }
        console.error("Failed to load draft:", err);
        toast.error("Failed to load draft content");
        setLoaded(true);
      }
    })();
  }, [isAuthenticated, isLoading, navigate, reloadKey]);

  /* ---------- 401 → session modal ---------- */

  useEffect(() => {
    const onUnauthorized = () => {
      if (!loadedRef.current) setReloadKey((k) => k + 1);
      setShowSessionModal(true);
    };
    window.addEventListener("admin:unauthorized", onUnauthorized);
    return () => window.removeEventListener("admin:unauthorized", onUnauthorized);
  }, []);

  /* ---------- unsaved-changes gate ---------- */

  useEffect(() => {
    if (!hasUnsavedChanges) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [hasUnsavedChanges]);

  /* ---------- save / autosave ---------- */

  const saveDraft = useCallback(async (silent = false): Promise<boolean> => {
    setIsSaving(true);
    try {
      const payload = contentRef.current;
      const res = await adminFetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to save draft");
      }
      setSavedJson(JSON.stringify(payload));
      setLastSaved(new Date());
      if (!silent) toast.success("Draft saved");
      return true;
    } catch (err) {
      if (err instanceof UnauthorizedError) return false;
      if (!silent) toast.error(err instanceof Error ? err.message : "Failed to save draft");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!loaded || !hasUnsavedChanges) return;
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    autosaveTimerRef.current = setTimeout(() => {
      saveDraft(true);
    }, AUTOSAVE_DELAY);
    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentJson, hasUnsavedChanges]);

  /* ---------- change handling with undo/redo ---------- */

  const applyExternal = useCallback((next: PortfolioContent) => {
    const prev = contentRef.current;
    const now = Date.now();
    if (now - lastUndoPushRef.current > UNDO_COALESCE_MS) {
      setUndoStack((s) => [...s.slice(-UNDO_LIMIT + 1), prev]);
      lastUndoPushRef.current = now;
    }
    setRedoStack([]);
    contentRef.current = next;
    setContent(next);
    setRevision((r) => r + 1);
  }, []);

  const handleSectionChange = useCallback((section: SectionId) => (data: unknown) => {
    const prev = contentRef.current;
    if (JSON.stringify(prev[section]) === JSON.stringify(data)) return;
    const next = { ...prev, [section]: data } as PortfolioContent;
    const now = Date.now();
    if (now - lastUndoPushRef.current > UNDO_COALESCE_MS) {
      setUndoStack((s) => [...s.slice(-UNDO_LIMIT + 1), prev]);
      lastUndoPushRef.current = now;
    }
    setRedoStack([]);
    contentRef.current = next;
    setContent(next);
  }, []);

  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack(undoStack.slice(0, -1));
    setRedoStack((r) => [...r, contentRef.current]);
    contentRef.current = prev;
    setContent(prev);
    setRevision((rev) => rev + 1);
  }, [undoStack]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(redoStack.slice(0, -1));
    setUndoStack((u) => [...u.slice(-UNDO_LIMIT + 1), contentRef.current]);
    contentRef.current = next;
    setContent(next);
    setRevision((rev) => rev + 1);
  }, [redoStack]);

  /* ---------- preview sync ---------- */

  const postToPreview = useCallback((msg: unknown) => {
    const frame = iframeRef.current;
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage(msg, window.location.origin);
  }, []);

  useEffect(() => {
    if (!previewReady) return;
    const t = setTimeout(() => {
      postToPreview({ source: "portfolio-editor", type: "content", content: contentRef.current });
    }, PREVIEW_SYNC_DELAY);
    return () => clearTimeout(t);
  }, [contentJson, previewReady, postToPreview]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      const msg = event.data as { source?: string; type?: string; results?: FitCheck[] } | null;
      if (!msg || msg.source !== "portfolio-preview") return;

      if (msg.type === "ready") {
        setPreviewReady(true);
        postToPreview({ source: "portfolio-editor", type: "content", content: contentRef.current });
      } else if (msg.type === "fit-results") {
        setIsFitChecking(false);
        if (fitTimeoutRef.current) clearTimeout(fitTimeoutRef.current);
        setFitResults(msg.results ?? []);
        setShowFitResults(true);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [postToPreview]);

  const handleFitCheck = useCallback(() => {
    setIsFitChecking(true);
    setFitResults(null);
    setShowFitResults(true);
    postToPreview({ source: "portfolio-editor", type: "fit-check" });
    if (fitTimeoutRef.current) clearTimeout(fitTimeoutRef.current);
    fitTimeoutRef.current = setTimeout(() => {
      setIsFitChecking(false);
      setFitResults([
        {
          group: "Images",
          name: "Fit check timed out",
          pass: false,
          detail: "The preview did not answer in 30s. Try reloading the preview.",
        },
      ]);
    }, 30000);
  }, [postToPreview]);

  /* ---------- publish ---------- */

  const handlePublishConfirm = async () => {
    setIsPublishing(true);
    try {
      if (hasUnsavedChanges) {
        const saved = await saveDraft(true);
        if (!saved) return;
      }
      const res = await adminFetch("/api/admin/publish", { method: "POST" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to publish");
      }
      toast.success("Published! Changes are now live.");
      setShowPublishModal(false);
    } catch (err) {
      if (!(err instanceof UnauthorizedError)) {
        toast.error(err instanceof Error ? err.message : "Failed to publish");
      }
    } finally {
      setIsPublishing(false);
    }
  };

  /* ---------- export / import ---------- */

  const handleExport = async () => {
    try {
      const res = await adminFetch("/api/admin/export");
      if (!res.ok) throw new Error("Failed to export");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `portfolio-content-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Content exported");
    } catch (err) {
      if (!(err instanceof UnauthorizedError)) toast.error("Failed to export");
    }
  };

  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const imported = JSON.parse(text);
      const res = await adminFetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(imported),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to import");
      }
      const { content: newContent } = await res.json();
      applyExternal(newContent);
      toast.success("Content imported. Review and save draft.");
    } catch (err) {
      if (!(err instanceof UnauthorizedError)) {
        toast.error(err instanceof Error ? err.message : "Invalid file or import failed");
      }
    }
  };

  const handleRestoreVersion = (restored: unknown) => {
    applyExternal(restored as PortfolioContent);
    toast.success("Version loaded into editor as unsaved changes.");
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(26,26,26)]">
        <div className="animate-spin w-8 h-8 border-2 border-[#61DAB3] border-t-transparent rounded-full" />
      </div>
    );
  }

  const ActiveForm = SECTIONS.find((s) => s.id === activeSection)?.component;
  const counts = {
    projects: content.projects?.length ?? 0,
    skills: content.skills?.length ?? 0,
    experience: content.experience?.length ?? 0,
    certificates: content.certificates?.length ?? 0,
  };

  return (
    <div className="min-h-screen bg-[rgb(26,26,26)] text-white font-inter">
      <Toaster position="top-right" theme="dark" />

      <header className="border-b border-white/10 bg-[#1A1A1A]/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="font-poppins font-bold text-xl">Content Editor</h1>
            <span className="px-2 py-0.5 text-xs bg-[#61DAB3]/20 text-[#61DAB3] rounded">DRAFT</span>
            {hasUnsavedChanges && (
              <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded animate-pulse">Unsaved</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex border border-white/10 rounded-lg overflow-hidden" role="group" aria-label="Preview size">
              <button
                onClick={() => setPreviewMode("desktop")}
                aria-pressed={previewMode === "desktop"}
                aria-label="Desktop preview"
                className={`px-3 py-1.5 text-sm flex items-center gap-1.5 ${previewMode === "desktop" ? "bg-[#61DAB3] text-[#1A1A1A]" : "text-[#BBBBBB] hover:text-white"}`}
              >
                <Monitor className="w-4 h-4" /> Desktop
              </button>
              <button
                onClick={() => setPreviewMode("mobile")}
                aria-pressed={previewMode === "mobile"}
                aria-label="Mobile preview"
                className={`px-3 py-1.5 text-sm flex items-center gap-1.5 ${previewMode === "mobile" ? "bg-[#61DAB3] text-[#1A1A1A]" : "text-[#BBBBBB] hover:text-white"}`}
              >
                <Smartphone className="w-4 h-4" /> Mobile
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-[#BBBBBB] hover:text-white transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        <nav className="border-t border-white/10 overflow-x-auto pb-2 px-4" role="tablist">
          <div className="flex gap-1 min-w-max">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                role="tab"
                aria-selected={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                  activeSection === section.id
                    ? "bg-[#61DAB3] text-[#1A1A1A]"
                    : "text-[#BBBBBB] hover:text-white hover:bg-white/5"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <div className="flex h-[calc(100vh-7.5rem)]">
        <aside className="w-full md:w-96 lg:w-[380px] border-r border-white/10 bg-[#1A1A1A] overflow-y-auto p-4 pb-24">
          <div className="space-y-6">
            {ActiveForm && (
              <ActiveForm
                content={content[activeSection] as never}
                revision={revision}
                onChange={handleSectionChange(activeSection)}
              />
            )}
          </div>
        </aside>

        <main className="flex-1 overflow-auto p-4 md:p-8 pb-24">
          <div
            className={`mx-auto bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
              previewMode === "mobile" ? "w-[390px] h-[740px] border-8 border-[#333] rounded-3xl" : "w-full h-full min-h-[600px]"
            }`}
          >
            <iframe
              ref={iframeRef}
              src="/preview"
              title="Site preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
          {!previewReady && (
            <p className="text-center text-sm text-[#666] mt-3">Loading preview...</p>
          )}
        </main>
      </div>

      <ActionBar
        onSave={() => saveDraft(false)}
        onPublish={() => setShowPublishModal(true)}
        onExport={handleExport}
        onImport={handleImport}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onHistory={() => setShowHistory(true)}
        onFitCheck={handleFitCheck}
        canUndo={canUndo}
        canRedo={canRedo}
        isSaving={isSaving}
        isPublishing={isPublishing}
        isFitChecking={isFitChecking}
        autosaveOn
        lastSaved={lastSaved}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      <SessionModal open={showSessionModal} onClose={() => setShowSessionModal(false)} />
      <PublishGateModal
        open={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onConfirm={handlePublishConfirm}
        hasUnsavedChanges={hasUnsavedChanges}
        isPublishing={isPublishing}
        counts={counts}
      />
      <HistoryPanel open={showHistory} onClose={() => setShowHistory(false)} onRestore={handleRestoreVersion} />
      <FitResultsModal open={showFitResults} onClose={() => setShowFitResults(false)} results={fitResults} />
    </div>
  );
};

export default AdminEditor;
