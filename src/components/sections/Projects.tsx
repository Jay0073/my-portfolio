import React, { useState } from "react";
import SectionWrapper from "../common/SectionWrapper";
import { ChevronLeft, ChevronRight, Github, ExternalLink } from "lucide-react";
import Button from "../common/Button";
// --- TYPES ---
interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  links?: {
    demo?: string;
    repo?: string;
  };
}
// --- CONSTANTS ---
const DESKTOP_HOLE_COUNT = 12;
const MOBILE_HOLE_COUNT = 8;

// Independent gaps for holes and spiral lines
const DESKTOP_HOLE_GAP = "gap-8";
const DESKTOP_SPIRAL_GAP = "gap-5";
const MOBILE_HOLE_GAP = "gap-10";
const MOBILE_SPIRAL_GAP = "gap-9";

// --- COMPONENT: DESKTOP SPIRAL SPINE (Original) ---
const DesktopSpiralSpine: React.FC = () => {
  const rings = Array.from({ length: DESKTOP_HOLE_COUNT });
  return (
    <div className="relative z-50 w-8 md:w-10 h-full shrink-0 flex flex-col justify-center items-center select-none">
      <div className="absolute inset-y-4 inset-x-3 bg-neutral-900/60 rounded-full blur-sm" />
      <div className={`flex flex-col ${DESKTOP_SPIRAL_GAP} py-4`}>
        {rings.map((_, i) => (
          <div
            key={i}
            className="relative w-full h-6 flex items-center justify-center"
          >
            <svg
              viewBox="0 0 60 20"
              className="w-[160%] h-full drop-shadow-lg"
              style={{ overflow: "visible" }}
            >
              <path
                d="M 0,12 Q 30,-8 60,12"
                fill="none"
                stroke="#525252"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 0,12 Q 30,-8 60,12"
                fill="none"
                stroke="#a3a3a3"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="opacity-60"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};
// --- COMPONENT: MOBILE SPIRAL ---
const MobileSpiral: React.FC = () => {
  const rings = Array.from({ length: MOBILE_HOLE_COUNT });

  return (
    <div className="absolute left-0 top-0 bottom-0 w-8 z-50 flex flex-col justify-center py-6 mt-2 pointer-events-none">
      <div
        className={`flex flex-col w-full h-full justify-center ${MOBILE_SPIRAL_GAP}`}
      >
        {rings.map((_, i) => (
          <div
            key={i}
            className="relative w-full h-4 flex items-center justify-center"
          >
            <svg
              viewBox="0 0 40 15"
              className="absolute -left-4 top-1/2 -translate-y-1/2 w-[180%] h-[40px] z-20"
              style={{ overflow: "visible" }}
            >
              {/* Main Dark Stroke */}
              <path
                d="M 10,13 C 0,13 0,3 20,5"
                fill="none"
                stroke="#525252"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Lighter Highlight/Shadow Stroke */}
              <path
                d="M 10,13 C 0,13 0,3 20,5"
                fill="none"
                stroke="#a3a3a3"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="opacity-70"
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
};
// --- COMPONENT: PUNCH HOLES ---
const PunchHoles: React.FC<{
  position: "left" | "right";
  isMobile?: boolean;
}> = ({ position, isMobile = false }) => {
  const count = isMobile ? MOBILE_HOLE_COUNT : DESKTOP_HOLE_COUNT;
  const holes = Array.from({ length: count });
  // Use independent gap for holes
  const gap = isMobile ? MOBILE_HOLE_GAP : DESKTOP_HOLE_GAP;
  return (
    <div
      className={`absolute top-0 bottom-0 flex flex-col justify-center z-20 py-4 pointer-events-none ${
        position === "left"
          ? isMobile
            ? "left-2"
            : "left-1 md:left-2"
          : "right-1 md:right-2"
      } ${isMobile ? "w-6 py-6" : "w-6"}`}
    >
      <div
        className={`flex flex-col ${gap} ${
          position === "left" ? "items-start" : "items-end"
        }`}
      >
        {holes.map((_, i) => (
          <div
            key={i}
            className={`
              bg-[#121212] 
              shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]
              w-3 h-3 rounded-full
              border border-neutral-800
            `}
          />
        ))}
      </div>
    </div>
  );
};
// --- COMPONENT: CONTENT DISPLAY ---
const ProjectContent = ({
  project,
  projectNumber,
  totalProjects,
  isMobile = false,
}: {
  project: Project;
  projectNumber: number;
  totalProjects: number;
  isMobile?: boolean;
}) => (
  <div className="w-full h-full flex flex-col justify-center bg-[#1a1a1a] relative z-10">
    {isMobile && (
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/40 to-transparent z-10 pointer-events-none" />
    )}
    <div
      className={`flex flex-col h-full ${
        isMobile
          ? "px-4 pl-10 py-3" // reduce vertical padding
          : "p-10"
      }`}
      style={
        isMobile
          ? {
              flex: 1,
              minHeight: 0,
              maxHeight: "100%",
              overflow: "hidden",
            }
          : undefined
      }
    >
      <div
        className="flex-1 flex flex-col justify-center"
        style={
          isMobile
            ? {
                minHeight: 0,
                maxHeight: "100%",
                overflow: "auto",
                WebkitOverflowScrolling: "touch",
                paddingBottom: "0.5rem",
              }
            : undefined
        }
      >
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, isMobile ? 3 : 6).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-sm bg-white/5 text-white rounded-full whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4 font-poppins tracking-tighter leading-tight">
          {project.title}
        </h3>

        <p
          className={`text-neutral-400 text-sm md:text-base leading-relaxed md:leading-relaxed mb-6 md:mb-8 ${
            isMobile ? "" : "line-clamp-6 md:line-clamp-none"
          }`}
        >
          {project.description}
        </p>
        <div className="flex gap-3 md:gap-4">
          {project.links?.demo && (
            <Button
              text={
                <span className="flex items-center gap-2">
                  <ExternalLink size={isMobile ? 14 : 16} /> Demo
                </span>
              }
              onClick={() =>
                project.links?.demo && window.open(project.links.demo, "_blank")
              }
              style="primary"
              className="!px-4 !py-2 !text-xs md:!px-5 md:!py-2.5 md:!text-sm"
            />
          )}
          {project.links?.repo && (
            <Button
              text={
                <span className="flex items-center gap-2">
                  <Github size={isMobile ? 14 : 16} /> Code
                </span>
              }
              onClick={() =>
                project.links?.repo && window.open(project.links.repo, "_blank")
              }
              style="secondary"
              className="!px-4 !py-2 !text-xs md:!px-5 md:!py-2.5 md:!text-sm"
            />
          )}
        </div>
      </div>
      <div className="mt-4 md:mt-0 md:absolute md:left-10 md:bottom-10 text-[10px] md:text-sm font-inter text-neutral-600 tracking-widest select-none">
        {String(projectNumber).padStart(2, "0")} /{" "}
        {String(totalProjects).padStart(2, "0")}
      </div>
    </div>
  </div>
);
// Helper for Video/Image
const isVideo = (src: string) => /\.(mp4|webm|ogg)$/i.test(src);
const ImageContent = ({ project }: { project: Project }) => (
  <div className="w-full h-full relative bg-black overflow-hidden">
    {isVideo(project.image) ? (
      <video
        src={project.image}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-90"
      />
    ) : (
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-cover opacity-90"
      />
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
  </div>
);
// --- HOOK: useMediaQuery ---
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);
  return matches;
}
// --- MAIN COMPONENT ---
const ProjectsBook: React.FC = () => {
  const projects: Project[] = [
    {
      title: "CrowdFund",
      description:
        "A secure, full-stack crowdfunding platform where fundraisers launch campaigns and receive donations via Stripe. Built with React, Node.js, and JWT authentication, it ensures smooth user flows and robust security. Real-time dashboards track donations and campaign progress. Designed for scalability and optimized load times, it handles 500+ concurrent API requests, supports 1,000+ active sessions, and processes 200+ transactions per hour with modular architecture.",
      image:
        "https://images.pexels.com/photos/1591060/pexels-photo-1591060.jpeg?auto=compress&cs=tinysrgb&w=1200",
      tags: ["React", "Node.js", "Stripe", "JWT", "MongoDB"],
      links: {
        demo: "https://crowdfund-eo0d.onrender.com",
        repo: "https://github.com/Jay0073/CrowdFund",
      },
    },
    {
      title: "Waste Classifier",
      description:
        "An AI-powered image classification tool that identifies recyclable vs non-recyclable waste. Trained on 22,000+ images using 3 layer Convolutional Neural Networks, it achieves 92% accuracy. The training pipeline included regularization, early stopping, and learning rate scheduling to ensure robust performance under noisy environments. Built to support sustainability efforts through smart waste sorting.",
      image:
        "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=1200",
      tags: [
        "Python",
        "CNN",
        "TensorFlow",
        "OpenCV",
        "Transfer Learning",
        "AI",
      ],
      links: {
        demo: "https://github.com/Jay0073/Waste-Classifier",
        repo: "https://github.com/Jay0073/Waste-Classifier",
      },
    },
    {
      title: "QuickBill",
      description:
        "A lightning-fast billing system tailored for business owners and cashiers. Users input items and prices, and the app instantly generates bills with all necessary details. Sales data and customer orders are visualized in a unified dashboard for easy analysis. Built for speed and efficiency, it streamlines billing and decision-making in real time.",
      image:
        "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1200",
      tags: ["React", "Express", "MongoDB", "Chart.js", "Automation"],
      links: {
        demo: "https://github.com/Jay0073/Quick-Bill",
        repo: "https://github.com/Jay0073/Quick-Bill",
      },
    },
    {
      title: "Lifease",
      description:
        "An accessibility suite designed for differently abled users including the blind, deaf, and speech-impaired. Offers voice, gesture, and text-based interactions to support daily tasks and communication. Built with inclusive design principles and modular onboarding flows. The app aims to bridge digital gaps and empower users with adaptive tech.",
      image:
        "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1200",
      tags: ["React Native", "Accessibility", "Firebase", "UX Design"],
      links: {
        repo: "https://github.com/Jay0073/Lifease",
      },
    },
    {
      title: "Pigeon Feed",
      description:
        "A Telegram-based job and tech digest engine that fetches high-quality listings from multiple platforms and delivers them within hours of posting. Users receive personalized job alerts and curated tech news digests, helping them stay ahead without the noise of traditional platforms. The system processes and dispatches updates in under 30 minutes, ensuring relevance and speed.",
      image:
        "https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg?auto=compress&cs=tinysrgb&w=1200",
      tags: [
        "Python",
        "Telegram Bot",
        "Job Aggregation",
        "Scheduling",
        "Automation",
      ],
      links: {
        demo: "https://t.me/P_gieon_bot",
      },
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const total = projects.length;
  const animDuration = 800; // ms for desktop
  const mobileAnimDuration = 700; // slightly slower for clean swing
  const getIndex = (i: number) => (i + total) % total;
  // Derived indices
  const prevIndex = getIndex(currentIndex - 1);
  const nextIndex = getIndex(currentIndex + 1);
  const currentProject = projects[currentIndex];
  const nextProjectObj = projects[nextIndex];
  const prevProjectObj = projects[prevIndex];
  const handleNext = () => {
    if (isAnimating) return;
    setDirection("next");
    setIsAnimating(true);
    setTimeout(
      () => {
        setCurrentIndex((prev) => getIndex(prev + 1));
        setIsAnimating(false);
        setDirection(null);
      },
      window.innerWidth < 768 ? mobileAnimDuration : animDuration
    );
  };
  const handlePrev = () => {
    if (isAnimating) return;
    setDirection("prev");
    setIsAnimating(true);
    setTimeout(
      () => {
        setCurrentIndex((prev) => getIndex(prev - 1));
        setIsAnimating(false);
        setDirection(null);
      },
      window.innerWidth < 768 ? mobileAnimDuration : animDuration
    );
  };
  const isMd = useMediaQuery("(min-width: 768px)");

  // --- Mobile Button Animation State ---
  const [mobileLeftActive, setMobileLeftActive] = useState(false);
  const [mobileRightActive, setMobileRightActive] = useState(false);

  // --- Button Handlers ---
  const handleMobileLeft = () => {
    if (isAnimating) return;
    setDirection("prev");
    setIsAnimating(true);
    setMobileLeftActive(true);
    setPendingIndex(getIndex(currentIndex - 1));
    setTimeout(() => {
      setCurrentIndex((prev) => getIndex(prev - 1));
      setIsAnimating(false);
      setDirection(null);
      setPendingIndex(null);
      setMobileLeftActive(false);
    }, mobileAnimDuration);
  };
  const handleMobileRight = () => {
    if (isAnimating) return;
    setCurrentIndex((prev) => getIndex(prev + 1)); // update immediately for next
    setDirection("next");
    setIsAnimating(true);
    setMobileRightActive(true);
    setPendingIndex(null);
    setTimeout(() => {
      setIsAnimating(false);
      setDirection(null);
      setMobileRightActive(false);
    }, mobileAnimDuration);
  };

  return (
    <SectionWrapper
      id="projects"
      title="Projects"
      subtitle="Featured Works"
      className="overflow-hidden pb-0 !pl-0 !pr-4 md:!pr-0"
      headingClass="mb-4 md:mb-0"
    >
      <div className="w-full flex flex-col items-center justify-center pt-2 md:pt-10 overflow-hidden relative">
        {/* ==============================================
            MOBILE VIEW (Text Page Only: Flip Behind)
           ============================================== */}
        <div className="flex md:hidden w-full max-w-md mx-auto h-[550px] relative z-10 pl-8 pr-2">
          {/* Container with Perspective for 3D Page Turn */}
          <div className="relative w-full h-full perspective-[2000px] overflow-visible">
            {/* Mobile Spiral OUTSIDE page layers */}
            <MobileSpiral />
            {/* --- STATIC LAYER (Bottom: New Page) --- */}
            <div className="absolute inset-0 bg-[#1a1a1a] rounded-r-3xl rounded-l-[4px] border border-l-0 border-white/10 overflow-hidden z-10">
              <PunchHoles position="left" isMobile={true} />
              <ProjectContent
                project={currentProject}
                projectNumber={currentIndex + 1}
                totalProjects={total}
                isMobile={true}
              />
            </div>
            {/* --- ANIMATING LAYER (Top: Old Page Flipping Away) --- */}
            {isAnimating && (
              <div
                className={`
          absolute inset-0 bg-[#1a1a1a]
          rounded-r-3xl rounded-l-[4px]
          border border-l-0 border-white/10 shadow-2xl
          origin-left z-30
          overflow-visible
          ${
            direction === "next"
              ? "animate-mobile-flip-next"
              : "animate-mobile-flip-prev"
          }
        `}
                style={{
                  left: 0,
                  top: 0,
                  width: "100%",
                  height: "100%",
                  willChange: "transform",
                  transformStyle: "preserve-3d",
                  transformOrigin: "left center",
                  zIndex: 30,
                }}
              >
                {/* Front face: text content */}
                <div
                  className="absolute inset-0 w-full h-full backface-hidden overflow-hidden"
                  style={{ borderRadius: "1.5rem 0.25rem 1.5rem 0.25rem" }}
                >
                  <PunchHoles position="left" isMobile={true} />
                  <ProjectContent
                    project={
                      direction === "next"
                        ? projects[getIndex(currentIndex - 1)] // show previous project text during next animation (old page flipping away)
                        : currentProject // show current project text during prev animation (old page flipping away)
                    }
                    projectNumber={
                      direction === "next"
                        ? getIndex(currentIndex - 1) + 1
                        : currentIndex + 1
                    }
                    totalProjects={total}
                    isMobile={true}
                  />
                  <div className="absolute inset-0 bg-black/0 animate-shadow-lift pointer-events-none" />
                </div>
                {/* Back face: image/video content */}
                <div
                  className="absolute inset-0 w-full h-full backface-hidden overflow-hidden"
                  style={{
                    transform: "rotateY(180deg)",
                    borderRadius: "1.5rem 0.25rem 1.5rem 0.25rem",
                  }}
                >
                  <PunchHoles position="left" isMobile={true} />
                  <ImageContent
                    project={
                      direction === "next"
                        ? currentProject // after next, currentProject is already next
                        : projects[getIndex(currentIndex - 1)] // after prev, currentProject is still old, so show previous project's image
                    }
                  />
                  <div className="absolute inset-0 bg-black/50 animate-shadow-land-reverse pointer-events-none" />
                </div>
              </div>
            )}
            {/* If IDLE: Top Layer (Current) */}
            {!isAnimating && (
              <div className="absolute inset-0 bg-[#1a1a1a] rounded-r-3xl rounded-l-[4px] border border-l-0 border-white/10 z-20 overflow-hidden">
                <PunchHoles position="left" isMobile={true} />
                <ProjectContent
                  project={currentProject}
                  projectNumber={currentIndex + 1}
                  totalProjects={total}
                  isMobile={true}
                />
              </div>
            )}
            {/* DECORATIVE BACKGROUND STACK - Offset to right */}
            <div className="absolute inset-0 bg-[#161616] rounded-r-3xl rounded-l-[4px] border border-white/5 -z-10 translate-x-2 translate-y-2 scale-[0.98]">
              <div className="absolute left-0 top-0 bottom-0 w-8 border-r border-white/5 bg-black/20" />
            </div>
          </div>
        </div>
        {/* ==============================================
            DESKTOP VIEW (Double Spread: Image Left, Text Right)
           ============================================== */}
        <div className="hidden md:flex relative items-center justify-center z-10 h-[600px] w-full max-w-6xl perspective-[2000px]">
          {/* Decorative Background Layer - Left Page */}
          <div
            className="absolute left-0 top-0 h-full w-1/2 ml-3 pointer-events-none z-0"
            style={{ width: "calc(50% - 14px" }}
          >
            <div className="absolute inset-0 bg-[#161616] rounded-l-3xl overflow-hidden border border-white/5 -translate-x-3 translate-y-1.5 scale-[0.99]">
              <div className="absolute right-0 top-0 bottom-0 w-8 border-l border-white/5 bg-black/20" />
            </div>
          </div>
          {/* Decorative Background Layer - Right Page */}
          <div
            className="absolute right-0 top-0 h-full w-1/2 pointer-events-none mr-3 z-0"
            style={{ width: "calc(50% - 14px)" }}
          >
            <div className="absolute inset-0 bg-[#161616] rounded-r-3xl overflow-hidden border border-white/5 translate-x-3 translate-y-1.5 scale-[0.99]">
              <div className="absolute left-0 top-0 bottom-0 w-8 border-r border-white/5 bg-black/20" />
            </div>
          </div>
          {/* Static Left Page (Image) */}
          <div className="relative flex-1 h-full rounded-l-3xl overflow-hidden border border-white/5 bg-[#1a1a1a] shadow-2xl z-10">
            {/* Gradient shadow on right edge (towards center) */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/40 to-transparent z-20 pointer-events-none" />
            <PunchHoles position="right" />
            <ImageContent
              project={direction === "prev" ? prevProjectObj : currentProject}
            />
            {direction === "prev" && (
              <div className="absolute inset-0 bg-black/50 animate-shadow-land" />
            )}
          </div>
          {/* Desktop Spine */}
          <DesktopSpiralSpine />
          {/* Static Right Page (Text) */}
          <div className="relative flex-1 h-full rounded-r-3xl overflow-hidden border border-white/5 bg-black shadow-2xl z-10">
            {/* Gradient shadow on left edge (towards center) */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/40 to-transparent z-20 pointer-events-none" />
            <PunchHoles position="left" />
            <ProjectContent
              project={direction === "next" ? nextProjectObj : currentProject}
              projectNumber={
                (direction === "next" ? nextIndex : currentIndex) + 1
              }
              totalProjects={total}
            />
            {direction === "next" && (
              <div className="absolute inset-0 bg-black/50 animate-shadow-land" />
            )}
          </div>
          {/* FLIPPER */}
          {isAnimating && (
            <div
              className="absolute top-0 bottom-0 z-50 h-full w-[calc(50%-20px)]"
              style={{
                left: direction === "next" ? "50%" : "auto",
                right: direction === "prev" ? "50%" : "auto",
                marginLeft: direction === "next" ? "20px" : "0",
                marginRight: direction === "prev" ? "20px" : "0",
                transformStyle: "preserve-3d",
                transformOrigin:
                  direction === "next" ? "center left" : "center right",
                animation:
                  direction === "next"
                    ? `flipNext ${animDuration}ms cubic-bezier(0.645, 0.045, 0.355, 1.000) forwards`
                    : `flipPrev ${animDuration}ms cubic-bezier(0.645, 0.045, 0.355, 1.000) forwards`,
              }}
            >
              {/* Front of Flipper */}
              <div
                className={`absolute inset-0 w-full h-full backface-hidden overflow-hidden border border-white/5 bg-[#1a1a1a] ${
                  direction === "next" ? "rounded-r-3xl" : "rounded-l-3xl"
                }`}
              >
                {/* Layered Depth for Front */}
                {direction === "next" ? (
                  // Right page offset (right)
                  <div className="absolute inset-0 bg-[#161616] rounded-r-3xl overflow-hidden border border-white/5 translate-x-0.5 translate-y-2 scale-[0.99]">
                    <div className="absolute left-0 top-0 bottom-0 w-8 border-r border-white/5 bg-black/20" />
                  </div>
                ) : (
                  // Left page offset (left)
                  <div className="absolute inset-0 bg-[#161616] rounded-l-3xl overflow-hidden border border-white/5 -translate-x-1 translate-y-2 scale-[0.99]">
                    <div className="absolute right-0 top-0 bottom-0 w-8 border-l border-white/5 bg-black/20" />
                  </div>
                )}
                <PunchHoles
                  position={direction === "next" ? "left" : "right"}
                />
                {direction === "next" ? (
                  <ProjectContent
                    project={currentProject}
                    projectNumber={currentIndex + 1}
                    totalProjects={total}
                  />
                ) : (
                  <ImageContent project={currentProject} />
                )}
                <div className="absolute inset-0 bg-black/0 animate-shadow-lift pointer-events-none" />
              </div>
              {/* Back of Flipper */}
              <div
                className={`absolute inset-0 w-full h-full backface-hidden overflow-hidden border border-white/5 bg-[#1a1a1a] ${
                  direction === "next" ? "rounded-l-3xl" : "rounded-r-3xl"
                }`}
                style={{ transform: "rotateY(180deg)" }}
              >
                {/* Layered Depth for Back */}
                {direction === "next" ? (
                  // Left page offset (left)
                  <div className="absolute inset-0 bg-[#161616] rounded-l-3xl overflow-hidden border border-white/5 -translate-x-1 translate-y-1 scale-[0.99]">
                    <div className="absolute right-0 top-0 bottom-0 w-8 border-l border-white/5 bg-black/20" />
                  </div>
                ) : (
                  // Right page offset (right)
                  <div className="absolute inset-0 bg-[#161616] rounded-r-3xl overflow-hidden border border-white/5 translate-x-0.5 translate-y-1 scale-[0.99]">
                    <div className="absolute left-0 top-0 bottom-0 w-8 border-r border-white/5 bg-black/20" />
                  </div>
                )}
                <PunchHoles
                  position={direction === "next" ? "right" : "left"}
                />
                {direction === "next" ? (
                  <ImageContent project={nextProjectObj} />
                ) : (
                  <ProjectContent
                    project={prevProjectObj}
                    projectNumber={prevIndex + 1}
                    totalProjects={total}
                  />
                )}
                <div className="absolute inset-0 bg-black/50 animate-shadow-land-reverse pointer-events-none" />
              </div>
            </div>
          )}
        </div>
        {/* --- CONTROLS --- */}
        <div className="mt-8 mb-6 flex gap-6 z-50">
          <Button
            text={<ChevronLeft size={24} />}
            onClick={isMd ? handlePrev : handleMobileLeft}
            style="secondary"
            className={
              isMd
                ? "!p-3 md:!p-4 !rounded-full !border !border-white/10 !text-white !bg-transparent hover:!bg-white hover:!text-[#1A1A1A] hover:!scale-110 active:!bg-white active:!text-[#1A1A1A] active:!scale-110 transition-all disabled:opacity-30"
                : `!p-3 !rounded-full !border !border-white/10 !text-white !bg-transparent transition-all disabled:opacity-30
                  ${
                    mobileLeftActive
                      ? "!bg-white !text-[#1A1A1A] !scale-110"
                      : ""
                  }
                `
            }
            disabled={isAnimating}
          />
          <Button
            text={<ChevronRight size={24} />}
            onClick={isMd ? handleNext : handleMobileRight}
            style="secondary"
            className={
              isMd
                ? "!p-3 md:!p-4 !rounded-full !border !border-white/10 !text-white !bg-transparent hover:!bg-white hover:!text-[#1A1A1A] hover:!scale-110 active:!bg-white active:!text-[#1A1A1A] active:!scale-110 transition-all disabled:opacity-30"
                : `!p-3 !rounded-full !border !border-white/10 !text-white !bg-transparent transition-all disabled:opacity-30
                  ${
                    mobileRightActive
                      ? "!bg-white !text-[#1A1A1A] !scale-110"
                      : ""
                  }
                `
            }
            disabled={isAnimating}
          />
        </div>
        <style>{`
  .backface-hidden {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }
  
  /* DESKTOP ANIMATIONS (Unchanged) */
  @keyframes flipNext { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(-180deg); } }
  @keyframes flipPrev { 0% { transform: rotateY(0deg); } 100% { transform: rotateY(180deg); } }

  /* MOBILE ANIMATIONS: 270-Degree Flip Behind */
  
  /* NEXT: Flip from flat (0) to tucked behind (-270) */
  @keyframes mobileFlipNext {
    0% { 
      transform: rotateY(0deg); 
      box-shadow: 0 0 0 rgba(0,0,0,0);
    }
    50% { 
      box-shadow: 20px 0 50px rgba(0,0,0,0.5); /* Shadow peaks mid-turn */
    }
    100% { 
      transform: rotateY(-270deg); 
      box-shadow: 0 0 0 rgba(0,0,0,0);
    }
  }

  /* PREV: Flip from tucked behind (-270) back to flat (0) */
  @keyframes mobileFlipPrev {
    0% { 
      transform: rotateY(-270deg); 
      box-shadow: 0 0 0 rgba(0,0,0,0);
    }
    50% { 
      box-shadow: 20px 0 50px rgba(0,0,0,0.5);
    }
    100% { 
      transform: rotateY(0deg); 
      box-shadow: 0 0 0 rgba(0,0,0,0);
    }
  }

  .animate-mobile-flip-next {
    animation: mobileFlipNext 0.8s cubic-bezier(0.645, 0.045, 0.355, 1.000) forwards;
  }
  
  .animate-mobile-flip-prev {
    animation: mobileFlipPrev 0.8s cubic-bezier(0.645, 0.045, 0.355, 1.000) forwards;
  }

  /* SHARED SHADOWS */
  @keyframes shadowLift { 0% { background-color: rgba(0,0,0,0); } 50% { background-color: rgba(0,0,0,0.4); } 100% { background-color: rgba(0,0,0,0.6); } }
  @keyframes shadowLandReverse { 0% { background-color: rgba(0,0,0,0.8); } 50% { background-color: rgba(0,0,0,0.4); } 100% { background-color: rgba(0,0,0,0); } }
  @keyframes shadowLand { 0% { background-color: rgba(0,0,0,0.8); } 100% { background-color: rgba(0,0,0,0); } }
`}</style>
      </div>
    </SectionWrapper>
  );
};
export default ProjectsBook;
