import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Toaster, toast } from "sonner";
import { useAdminAuth } from "../hooks/useAdminAuth";
import { DEFAULT_CONTENT, type PortfolioContent } from "../lib/defaultContent";
import { adminFetch, UnauthorizedError } from "../lib/adminApi";
import { ActionBar } from "../components/admin/ActionBar";
import { SessionModal, PublishGateModal, HistoryPanel } from "../components/admin/Modals";
import { FitResultsModal } from "../components/admin/FitResultsModal";
import { PreviewPane } from "../components/admin/PreviewPane";
import { PREVIEW_DEVICES, previewSection, type PreviewDeviceId } from "../lib/previewDevices";
import { PortfolioContentSchema } from "../lib/contentSchema";
import { runResponsiveFitChecks } from "../lib/responsiveFitChecks";
import "../components/admin/editor.css";
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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [undoStack, setUndoStack] = useState<PortfolioContent[]>([]);
  const [redoStack, setRedoStack] = useState<PortfolioContent[]>([]);

  const [deviceId, setDeviceId] = useState<PreviewDeviceId>(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 900px)").matches ? "phone" : "desktop"
  );
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [panelWidth, setPanelWidth] = useState(380);
  const [previewError, setPreviewError] = useState<string | null>(null);
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
  const fitAbortRef = useRef<AbortController | null>(null);
  const visibleContentIdRef = useRef("");
  const [fitProgress, setFitProgress] = useState("");
  const [checkedJson, setCheckedJson] = useState<string | null>(null);
  const saveQueueRef = useRef<Promise<unknown>>(Promise.resolve());

  const contentJson = useMemo(() => JSON.stringify(content), [content]);
  const validation = useMemo(() => PortfolioContentSchema.safeParse(content), [content]);
  const hasUnsavedChanges = loaded && contentJson !== savedJson;
  const device = PREVIEW_DEVICES.find((item) => item.id === deviceId) ?? PREVIEW_DEVICES[0];
  const isSettings = ["quotes", "header", "footer", "meta"].includes(activeSection);
  const visibleSections = SECTIONS.filter((section) => ["quotes", "header", "footer", "meta"].includes(section.id) === isSettings);

  /* ---------- load draft ---------- */

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      navigate("/admin");
      return;
    }
    (async () => {
      setLoadError(null);
      try {
        const res = await adminFetch("/api/admin/content?mode=draft");
        if (!res.ok) throw new Error("Your draft could not be loaded. Retry before editing.");
        if (res.ok) {
          const { content: draftContent } = await res.json();
          if (draftContent) {
            const parsed = PortfolioContentSchema.safeParse(draftContent);
            if (!parsed.success) throw new Error("The saved draft has invalid fields. Import a valid backup to recover it.");
            setContent(parsed.data);
            setSavedJson(JSON.stringify(parsed.data));
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
        setLoadError(err instanceof Error ? err.message : "Your draft could not be loaded.");
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

  const saveDraft = useCallback((silent = false): Promise<boolean> => {
    const task = async (): Promise<boolean> => {
      if (!loadedRef.current) return false;
      const parsed = PortfolioContentSchema.safeParse(contentRef.current);
      if (!parsed.success) {
        setSaveError("Complete " + parsed.error.issues[0].path.join(" → ") + " before saving.");
        return false;
      }
      setIsSaving(true);
      setSaveError(null);
      try {
        const payload = parsed.data;
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
        setSaveError(err instanceof Error ? err.message : "Save failed");
        if (!silent) toast.error("Draft could not be saved. Retry.");
        return false;
      } finally {
        setIsSaving(false);
      }
    };
    const request = saveQueueRef.current.then(task, task);
    saveQueueRef.current = request;
    return request;
  }, []);

  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!loaded || !hasUnsavedChanges || !validation.success) return;
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

  const syncPreview = useCallback(() => {
    const contentId = crypto.randomUUID();
    visibleContentIdRef.current = contentId;
    postToPreview({ source: "portfolio-editor", type: "content", contentId, content: contentRef.current });
  }, [postToPreview]);

  useEffect(() => {
    if (!previewReady || !loaded) return;
    const t = setTimeout(() => {
      syncPreview();
    }, PREVIEW_SYNC_DELAY);
    return () => clearTimeout(t);
  }, [contentJson, previewReady, loaded, syncPreview]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== iframeRef.current?.contentWindow) return;
      const msg = event.data as { source?: string; type?: string; contentId?: string; detail?: string } | null;
      if (!msg || msg.source !== "portfolio-preview") return;

      if (msg.type === "ready") {
        if (loadedRef.current) syncPreview();
      } else if (msg.contentId === visibleContentIdRef.current) {
        if (msg.type === "content-applied") { setPreviewReady(true); setPreviewError(null); }
        if (msg.type === "content-error") { setPreviewReady(true); setPreviewError(msg.detail ?? "Complete required fields to update the preview."); }
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [syncPreview]);

  useEffect(() => {
    if (!previewReady || !loaded) return;
    const timer = setTimeout(() => postToPreview({ source: "portfolio-editor", type: "navigate", section: previewSection(activeSection) }), 130);
    return () => clearTimeout(timer);
  }, [activeSection, deviceId, previewReady, loaded, postToPreview]);

  const handleFitCheck = useCallback(async () => {
    if (fitAbortRef.current) { setShowFitResults(true); return; }
    const parsed = PortfolioContentSchema.safeParse(contentRef.current);
    if (!parsed.success) { toast.error("Complete " + parsed.error.issues[0].path.join(" → ") + " before checking fit."); return; }
    const controller = new AbortController();
    fitAbortRef.current = controller;
    setIsFitChecking(true);
    setFitResults(null);
    setShowFitResults(true);
    setCheckedJson(JSON.stringify(parsed.data));
    try {
      const results = await runResponsiveFitChecks(parsed.data, setFitProgress, controller.signal);
      setFitResults(results);
    } catch (error) {
      if (!controller.signal.aborted) setFitResults([{ section: "hero", group: "Page", name: "Check interrupted", status: "skipped", detail: error instanceof Error ? error.message : "Try again.", viewport: "All screens" }]);
    } finally {
      if (fitAbortRef.current === controller) fitAbortRef.current = null;
      setIsFitChecking(false);
    }
  }, []);

  useEffect(() => () => fitAbortRef.current?.abort(), []);

  /* ---------- publish ---------- */

  const handlePublishConfirm = async () => {
    setIsPublishing(true);
    try {
      if (hasUnsavedChanges) {
        const saved = await saveDraft(true);
        if (!saved) return;
      }
      const res = await adminFetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
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
      const blob = new Blob([JSON.stringify(contentRef.current, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `portfolio-content-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Current draft exported");
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
    <div className="content-editor">
      <Toaster position="top-right" theme="dark" />
      <header className="editor-header">
        <div className="editor-heading">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0"><h1>Content Editor</h1><p>Edit your portfolio and see changes as you work.</p></div>
            <span className="editor-draft">DRAFT</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="editor-segmented editor-mobile-switch" role="group" aria-label="Editor view">
              <button onClick={() => setMobileView("edit")} aria-pressed={mobileView === "edit"}>Edit</button>
              <button onClick={() => setMobileView("preview")} aria-pressed={mobileView === "preview"}>Preview</button>
            </div>
            <button onClick={handleLogout} className="editor-action-button" aria-label="Logout"><LogOut size={15} /><span className="logout-label">Logout</span></button>
          </div>
        </div>
        <nav className="editor-nav" aria-label="Editor sections">
          <div className="editor-nav-group">
            <button aria-pressed={!isSettings} onClick={() => setActiveSection("hero")}>Content</button>
            <button aria-pressed={isSettings} onClick={() => setActiveSection("footer")}>Site settings</button>
          </div>
          <div className="editor-tabs" role="tablist" aria-label={isSettings ? "Site settings" : "Content sections"}>
            {visibleSections.map((section) => <button key={section.id} role="tab" aria-selected={activeSection === section.id} onClick={() => setActiveSection(section.id)}>{section.label}</button>)}
          </div>
        </nav>
      </header>
      <div className="editor-workspace" data-view={mobileView} style={{ "--editor-width": panelWidth + "px" } as React.CSSProperties}>
        <aside className="editor-form-pane" aria-label="Content form">
          <div className="editor-form-heading"><h2>{SECTIONS.find((section) => section.id === activeSection)?.label}</h2><p>Changes appear in the draft preview. Complete required fields to save.</p></div>
          {!loaded && <div className="editor-validation">{loadError ?? "Loading your saved draft…"}{loadError && <button className="editor-add block mt-2" onClick={() => setReloadKey((key) => key + 1)}>Retry loading</button>}</div>}
          {loaded && !validation.success && <div className="editor-validation" role="alert">Complete {validation.error.issues[0].path.join(" → ")} before saving, checking fit, or publishing. Your edits stay here.</div>}
          {loaded && saveError && <div className="editor-validation" role="alert">{saveError}</div>}
          {loaded && ActiveForm && <div className="admin-form"><ActiveForm content={content[activeSection] as never} revision={revision} onChange={handleSectionChange(activeSection)} /></div>}
        </aside>
        <div className="editor-divider" role="separator" aria-label="Resize editor" aria-orientation="vertical" aria-valuemin={320} aria-valuemax={520} aria-valuenow={panelWidth} tabIndex={0}
          onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); event.preventDefault(); }}
          onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) setPanelWidth(Math.max(320, Math.min(520, event.clientX))); }}
          onPointerUp={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
          onKeyDown={(event) => { if (event.key === "ArrowRight") setPanelWidth((value) => Math.min(520, value + 20)); if (event.key === "ArrowLeft") setPanelWidth((value) => Math.max(320, value - 20)); }} />
        <PreviewPane frameRef={iframeRef} ready={previewReady} error={previewError} device={device} onDevice={setDeviceId} onReload={() => { setPreviewReady(false); setPreviewError(null); iframeRef.current?.contentWindow?.location.reload(); }} />
      </div>
      <ActionBar onSave={() => { void saveDraft(false); }} onPublish={() => setShowPublishModal(true)} onExport={handleExport} onImport={handleImport} onUndo={handleUndo} onRedo={handleRedo} onHistory={() => setShowHistory(true)} onFitCheck={() => { void handleFitCheck(); }} canUndo={canUndo} canRedo={canRedo} isSaving={isSaving} isPublishing={isPublishing} isFitChecking={isFitChecking} lastSaved={lastSaved} hasUnsavedChanges={hasUnsavedChanges} disabled={!loaded || !validation.success} saveError={saveError} />

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
      <FitResultsModal
        open={showFitResults}
        onClose={() => setShowFitResults(false)}
        results={fitResults}
        progress={fitProgress}
        running={isFitChecking}
        stale={checkedJson !== null && checkedJson !== contentJson}
        onCancel={() => { fitAbortRef.current?.abort(); setShowFitResults(false); }}
        onRerun={() => { void handleFitCheck(); }}
        onInspect={(result) => {
          if (result.deviceId) setDeviceId(result.deviceId);
          const target = result.section === "footer" ? "footer" : result.section;
          if (SECTIONS.some((section) => section.id === target)) setActiveSection(target as SectionId);
          setMobileView("preview");
          setShowFitResults(false);
        }}
      />
    </div>
  );
};

export default AdminEditor;
