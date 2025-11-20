import React, { useState, useMemo, useEffect } from "react";
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

// --- CONSTANTS FOR ALIGNMENT ---
// Shared configuration to ensure holes line up with rings exactly
const SPACING_CONFIG = {
  count: 12, // Reduced slightly to fit better vertically
  gap: "gap-[14px] md:gap-5", // Responsive gap
};

// --- COMPONENT: SPIRAL SPINE ---
const SpiralSpine: React.FC = () => {
  const rings = Array.from({ length: SPACING_CONFIG.count });

  return (
    <div className="relative z-50 w-8 md:w-10 h-full shrink-0 flex flex-col justify-center items-center select-none">
      {/* Binding Shadow */}
      <div className="absolute inset-y-4 inset-x-3 bg-neutral-900/60 rounded-full blur-sm" />

      <div className={`flex flex-col ${SPACING_CONFIG.gap} py-4`}>
        {rings.map((_, i) => (
          <div
            key={i}
            className="relative w-full h-4 md:h-6 flex items-center justify-center"
          >
            {/* Realistic Metal Spiral SVG */}
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

// --- COMPONENT: PUNCH HOLES ---
const PunchHoles: React.FC<{ position: "left" | "right" }> = ({ position }) => {
  const holes = Array.from({ length: SPACING_CONFIG.count });

  return (
    <div
      className={`absolute top-0 bottom-0 w-6 flex flex-col justify-center z-20 py-4 ${
        position === "left" ? "left-1 md:left-2" : "right-1 md:right-2"
      }`}
    >
      <div
        className={`flex flex-col gap-[14px] md:gap-[32px] ${
          position === "left" ? "items-start" : "items-end"
        }`}
      >
        {holes.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-[#121212] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)]"
          />
        ))}
      </div>
    </div>
  );
};

// --- COMPONENT: CONTENT PAGES ---
// Add projectNumber and totalProjects props for numbering
const TextContent = ({
  project,
  projectNumber,
  totalProjects,
}: {
  project: Project;
  projectNumber: number;
  totalProjects: number;
}) => (
  <div className="w-full h-full p-6 md:p-10 flex flex-col justify-center bg-[#1a1a1a] relative">
    <div className="relative z-10">
      {/* Project Number moved to bottom left, so removed from here */}
      <div className="flex flex-wrap gap-2 mb-5">
        {project.tags.map((tag, index) => (
          <span
              key={index}
              className="px-3 py-1 text-sm bg-white/10 text-white rounded-full"
            >
              {tag}
            </span>
        ))}
      </div>
      <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 font-poppins tracking-tighter">
        {project.title}
      </h3>
      <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-8 line-clamp-4 md:line-clamp-none">
        {project.description}
      </p>
      <div className="flex gap-4">
        {project.links?.demo && <Button
          text={
            <span className="flex items-center gap-2">
              <ExternalLink size={16} /> Demo
            </span>
          }
          onClick={() =>
            project.links?.demo && window.open(project.links.demo, "_blank")
          }
          style="primary"
          className="!px-4 !py-2 !text-xs md:!px-5 md:!py-2.5 md:!text-sm"
        />}
        {project.links?.repo && <Button
          text={
            <span className="flex items-center gap-2">
              <Github size={16} /> Code
            </span>
          }
          onClick={() =>
            project.links?.repo && window.open(project.links.repo, "_blank")
          }
          style="secondary"
          className="!px-4 !py-2 !text-xs md:!px-5 md:!py-2.5 md:!text-sm"
        />}
      </div>
    </div>
    {/* Project Number at bottom left */}
    <div className="absolute left-6 md:left-10 bottom-6 md:bottom-10 text-xs md:text-sm font-inter text-neutral-500 tracking-widest select-none z-20">
      {String(projectNumber).padStart(2, "0")}/
      {String(totalProjects).padStart(2, "0")}
    </div>
    <PunchHoles position="right" />
  </div>
);

// Helper to check if a file is a video
const isVideo = (src: string) => {
  return /\.(mp4|webm|ogg)$/i.test(src);
};

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
    <PunchHoles position="left" />
  </div>
);

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
    tags: ["Python", "CNN", "TensorFlow", "OpenCV", "Transfer Learning", "AI"],
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
    tags: ["Python", "Telegram Bot", "Job Aggregation", "Scheduling", "Automation"],
    links: {
      demo: "https://t.me/P_gieon_bot",
    },
  },
];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const total = projects.length;
  const animDuration = 800;

  const getIndex = (i: number) => (i + total) % total;

  const currentProject = projects[currentIndex];
  const nextProject = projects[getIndex(currentIndex + 1)];
  const prevProject = projects[getIndex(currentIndex - 1)];

  // --- STATIC PAGES LOGIC ---
  // When Animating NEXT: Left shows Old Text (Static), Right shows New Image (Static revealed under flipper)
  // When Animating PREV: Left shows New Text (Static revealed under flipper), Right shows Old Image (Static)
  // When Idle: Left shows Current Text, Right shows Current Image
  let leftStaticProject = currentProject;
  let rightStaticProject = currentProject;

  if (direction === "next") {
    rightStaticProject = nextProject; // The flipper leaves this spot, revealing next
  } else if (direction === "prev") {
    leftStaticProject = prevProject; // The flipper leaves this spot, revealing prev
  }

  const handleNext = () => {
    if (isAnimating) return;
    setDirection("next");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => getIndex(prev + 1));
      setIsAnimating(false);
      setDirection(null);
    }, animDuration);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setDirection("prev");
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => getIndex(prev - 1));
      setIsAnimating(false);
      setDirection(null);
    }, animDuration);
  };

  // --- FLIPPER STYLE CALCULATIONS ---
  // 50% of container - half of spine (16px or 24px).
  // Using calc to stay perfectly responsive.
  const halfSpineWidth = "16px md:24px";

  return (
    <SectionWrapper
      id="projects"
      title="Projects"
      subtitle="Featured Works"
      className="overflow-hidden"
      headingClass="mb-0"
    >
      <div className="w-full min-h-[700px] flex flex-col items-center justify-center perspective-[2000px] py-10">
        {/* MAIN BOOK CONTAINER */}
        <div className="relative flex items-center justify-center z-10 h-[450px] md:h-[600px] w-full max-w-6xl">
          {/* === STATIC LEFT PAGE === */}
          <div className="relative flex-1 h-full rounded-l-3xl overflow-hidden border border-white/5 bg-[#1a1a1a] shadow-2xl z-0">
            <TextContent
              project={leftStaticProject}
              projectNumber={
                getIndex(
                  direction === "prev" ? currentIndex - 1 : currentIndex
                ) + 1
              }
              totalProjects={total}
            />
            {/* Shadow overlay when flipping PREV (page lands here) */}
            {direction === "prev" && (
              <div className="absolute inset-0 bg-black/50 animate-shadow-land" />
            )}
          </div>

          {/* === SPINE === */}
          <SpiralSpine />

          {/* === STATIC RIGHT PAGE === */}
          <div className="relative flex-1 h-full rounded-r-3xl overflow-hidden border border-white/5 bg-black shadow-2xl z-0">
            <ImageContent project={rightStaticProject} />
            {/* Shadow overlay when flipping NEXT (page lands here) */}
            {direction === "next" && (
              <div className="absolute inset-0 bg-black/50 animate-shadow-land" />
            )}
          </div>

          {/* === FLIPPER (THE MOVING PAGE) === */}
          {isAnimating && (
            <div
              className="absolute top-0 bottom-0 z-50 h-full"
              style={{
                // Width is exactly half container minus spine width
                width: `calc(50% - 16px)`,
                // Mobile responsive calculation handled via CSS below if needed,
                // but here we approximate the logic:

                // POSITIONING & ANCHORING
                left: direction === "next" ? "50%" : "auto",
                right: direction === "prev" ? "50%" : "auto",
                marginLeft: direction === "next" ? "16px" : "0", // Half spine offset
                marginRight: direction === "prev" ? "16px" : "0", // Half spine offset

                transformStyle: "preserve-3d",

                // CRITICAL: Set pivot point to the spine edge
                transformOrigin:
                  direction === "next" ? "center left" : "center right",

                animation:
                  direction === "next"
                    ? `flipNext ${animDuration}ms cubic-bezier(0.645, 0.045, 0.355, 1.000) forwards`
                    : `flipPrev ${animDuration}ms cubic-bezier(0.645, 0.045, 0.355, 1.000) forwards`,
              }}
            >
              {/* FRONT OF FLIPPER */}
              {/* If Next: Current Image (Right side). If Prev: Current Text (Left side). */}
              <div
                className={`absolute inset-0 w-full h-full backface-hidden overflow-hidden border border-white/5 bg-[#1a1a1a] ${
                  direction === "next" ? "rounded-r-2xl" : "rounded-l-2xl"
                }`}
              >
                {direction === "next" ? (
                  <ImageContent project={currentProject} />
                ) : (
                  <TextContent
                    project={currentProject}
                    projectNumber={currentIndex + 1}
                    totalProjects={total}
                  />
                )}

                {/* Lighting: Gets darker as it lifts */}
                <div className="absolute inset-0 bg-black/0 animate-shadow-lift pointer-events-none" />
              </div>

              {/* BACK OF FLIPPER */}
              {/* If Next: Next Text (Left side). If Prev: Prev Image (Right side). */}
              <div
                className={`absolute inset-0 w-full h-full backface-hidden overflow-hidden border border-white/5 bg-[#1a1a1a] ${
                  direction === "next" ? "rounded-l-2xl" : "rounded-r-2xl"
                }`}
                style={{ transform: "rotateY(180deg)" }}
              >
                {direction === "next" ? (
                  <TextContent
                    project={nextProject}
                    projectNumber={getIndex(currentIndex + 1) + 1}
                    totalProjects={total}
                  />
                ) : (
                  <ImageContent project={prevProject} />
                )}

                {/* Lighting: Starts dark, gets brighter as it lands */}
                <div className="absolute inset-0 bg-black/50 animate-shadow-land-reverse pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* --- CONTROLS --- */}
        <div className="absolute -bottom-4 md:-bottom-8 flex gap-6 z-50">
          <Button
            text={<ChevronLeft size={24} />}
            onClick={handlePrev}
            style="secondary"
            className="!p-4 !rounded-full !border !border-white/10 !text-white !bg-transparent hover:!bg-white hover:!text-[#1A1A1A] hover:!scale-110 transition-all disabled:opacity-30"
            disabled={isAnimating}
          />
          <Button
            text={<ChevronRight size={24} />}
            onClick={handleNext}
            style="secondary"
            className="!p-4 !rounded-full !border !border-white/10 !text-white !bg-transparent hover:!bg-white hover:!text-[#1A1A1A] hover:!scale-110 transition-all disabled:opacity-30"
            disabled={isAnimating}
          />
        </div>

        <style>{`
          .backface-hidden {
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }

          /* NEXT: Rotate from 0 (Right) to -180 (Left) */
          @keyframes flipNext {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(-180deg); }
          }
          
          /* PREV: Rotate from 0 (Left) to 180 (Right) */
          @keyframes flipPrev {
            0% { transform: rotateY(0deg); }
            100% { transform: rotateY(180deg); }
          }

          /* SHADOWS */
          /* Lift: Transparent -> Dark (as page turns 90deg) */
          @keyframes shadowLift {
            0% { background-color: rgba(0,0,0,0); }
            50% { background-color: rgba(0,0,0,0.4); }
            100% { background-color: rgba(0,0,0,0.8); }
          }

          /* Land: Dark -> Transparent */
          @keyframes shadowLandReverse {
             0% { background-color: rgba(0,0,0,0.8); }
             50% { background-color: rgba(0,0,0,0.4); }
             100% { background-color: rgba(0,0,0,0); }
          }
          
          /* Mobile adjustment for spine calculation if needed */
          @media (min-width: 768px) {
             .flipper-width { width: calc(50% - 24px); }
          }
        `}</style>
      </div>
    </SectionWrapper>
  );
};

export default ProjectsBook;
