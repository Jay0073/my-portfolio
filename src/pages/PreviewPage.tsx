import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { ContentProvider, useContent } from "../lib/contentContext";
import { PortfolioContentSchema, type PortfolioContent } from "../lib/contentSchema";
import { runFitChecks, type FitCheck } from "../lib/fitChecks";
import { ProjectContent } from "../components/sections/Projects";
import SitePage from "./SitePage";

const ProjectAuditFrames: React.FC = () => {
  const { content } = useContent();
  const projects = content.projects;
  if (projects.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      data-fit="audit-root"
      style={{
        position: "absolute",
        top: 0,
        left: -100000,
        pointerEvents: "none",
        opacity: 0,
        zIndex: -1,
      }}
    >
      {projects.map((project, i) => (
        <React.Fragment key={i}>
          <div
            data-fit="project-frame"
            data-project-title={project.title}
            data-project-size="desktop 560x600"
            style={{
              width: 560,
              height: 600,
              overflow: "hidden",
              border: "1px solid #333",
            }}
          >
            <ProjectContent
              project={project}
              projectNumber={i + 1}
              totalProjects={projects.length}
            />
          </div>
          <div
            data-fit="project-frame"
            data-project-title={project.title}
            data-project-size="mobile 343x550"
            style={{
              width: 343,
              height: 550,
              overflow: "hidden",
              border: "1px solid #333",
            }}
          >
            <ProjectContent
              project={project}
              projectNumber={i + 1}
              totalProjects={projects.length}
              isMobile
            />
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

const PreviewShell: React.FC<{ override: PortfolioContent | null }> = ({ override }) => (
  <ContentProvider override={override}>
    <Helmet>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <SitePage />
    <ProjectAuditFrames />
  </ContentProvider>
);

const PreviewPage: React.FC = () => {
  const [override, setOverride] = useState<PortfolioContent | null>(null);

  useEffect(() => {
    const origin = window.location.origin;
    window.parent.postMessage({ source: "portfolio-preview", type: "ready" }, origin);

    const onMessage = async (event: MessageEvent) => {
      if (event.origin !== origin) return;
      const msg = event.data as {
        source?: string;
        type?: string;
        content?: unknown;
      } | null;
      if (!msg || msg.source !== "portfolio-editor") return;

      if (msg.type === "content") {
        const parsed = PortfolioContentSchema.safeParse(msg.content);
        if (parsed.success) {
          setOverride(parsed.data);
        }
      } else if (msg.type === "fit-check") {
        const results: FitCheck[] = await runFitChecks();
        window.parent.postMessage(
          { source: "portfolio-preview", type: "fit-results", results },
          origin
        );
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return <PreviewShell override={override} />;
};

export default PreviewPage;
