import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ContentProvider, useContent } from "../lib/contentContext";
import { PortfolioContentSchema, type PortfolioContent } from "../lib/contentSchema";
import { runFitChecks } from "../lib/fitChecks";
import { ProjectContent } from "../components/sections/Projects";
import SitePage from "./SitePage";

const ProjectAuditFrames: React.FC = () => {
  const { content } = useContent();
  const [width, setWidth] = useState(0);
  const mobile = window.innerWidth < 768;
  useEffect(() => {
    const page = Array.from(document.querySelectorAll<HTMLElement>('#projects [data-fit="project-page"]')).find((element) => element.clientWidth > 0);
    if (!page) return;
    const resize = () => setWidth(page.clientWidth);
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(page);
    return () => observer.disconnect();
  }, [content.projects]);
  if (!width) return null;
  return (
    <div aria-hidden="true" data-fit="audit-root" style={{ position: "fixed", top: 0, left: -10000, pointerEvents: "none", opacity: 0 }}>
      {content.projects.map((project, index) => (
        <div key={index} data-fit="project-frame" data-project-title={project.title} style={{ width, height: mobile ? 550 : 600, overflow: "hidden" }}>
          <ProjectContent project={project} projectNumber={index + 1} totalProjects={content.projects.length} isMobile={mobile} />
        </div>
      ))}
    </div>
  );
};

const PreviewPage: React.FC = () => {
  const [snapshot, setSnapshot] = useState<{ content: PortfolioContent; id: string } | null>(null);
  const contentRef = useRef<PortfolioContent | null>(null);
  const idRef = useRef("");
  const navigationRef = useRef(0);
  const audit = new URLSearchParams(window.location.search).get("audit") === "1";
  const post = (message: object) => window.parent.postMessage({ source: "portfolio-preview", ...message }, window.location.origin);

  useEffect(() => {
    post({ type: "ready" });
    const onMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== window.parent) return;
      const message = event.data;
      if (!message || message.source !== "portfolio-editor") return;
      if (message.type === "ping") post({ type: "ready" });
      if (message.type === "content") {
        const parsed = PortfolioContentSchema.safeParse(message.content);
        if (!parsed.success) {
          const issue = parsed.error.issues[0];
          post({ type: "content-error", contentId: message.contentId, detail: "Complete " + issue.path.join(" → ") + " to update the preview. Showing the last complete draft." });
          return;
        }
        contentRef.current = parsed.data;
        idRef.current = message.contentId ?? "";
        setSnapshot({ content: parsed.data, id: idRef.current });
      }
      if (message.type === "navigate" && typeof message.section === "string") {
        const navigation = ++navigationRef.current;
        const scroll = (attempt: number) => {
          if (navigation !== navigationRef.current) return;
          const section = document.getElementById(message.section);
          if (section) section.scrollIntoView({ behavior: "instant", block: "start" });
          else if (attempt < 40) setTimeout(() => scroll(attempt + 1), 50);
        };
        scroll(0);
      }
      if (message.type === "fit-check" && contentRef.current && message.contentId === idRef.current) {
        try {
          const results = await runFitChecks(contentRef.current);
          post({ type: "fit-results", contentId: message.contentId, results });
        } catch (error) {
          post({ type: "fit-results", contentId: message.contentId, results: [{ section: "hero", group: "Page", name: "Check interrupted", status: "skipped", detail: error instanceof Error ? error.message : "Reload and try again." }] });
        }
      }
    };
    window.addEventListener("message", onMessage);
    const pendingNavigation = navigationRef;
    return () => { window.removeEventListener("message", onMessage); pendingNavigation.current++; };
  }, []);

  useEffect(() => {
    if (!snapshot) return;
    let second = 0;
    const first = requestAnimationFrame(() => { second = requestAnimationFrame(() => post({ type: "content-applied", contentId: snapshot.id })); });
    return () => { cancelAnimationFrame(first); cancelAnimationFrame(second); };
  }, [snapshot]);

  return (
    <ContentProvider override={snapshot?.content}>
      <Helmet><meta name="robots" content="noindex, nofollow" /></Helmet>
      <SitePage />
      {audit && <ProjectAuditFrames />}
    </ContentProvider>
  );
};

export default PreviewPage;
