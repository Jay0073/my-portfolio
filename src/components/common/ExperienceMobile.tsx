import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ExperienceData {
  company: string;
  logo: string;
  role: string;
  dates: string;
  description: string;
  skills: string[];
}

interface ExperienceMobileProps {
  data: ExperienceData[];
}

// Individual card component with smooth reveal animations
const Card: React.FC<{
  experience: ExperienceData;
  index: number;
  total: number;
  scrollProgress: any;
}> = ({ experience, index, total, scrollProgress }) => {
  // Calculate when this card should be active (each card gets equal portion of scroll)
  const cardStart = index / total;
  const cardEnd = (index + 1) / total;

  // Scale: Card grows to full size when active
  const scale = useTransform(
    scrollProgress,
    [
      Math.max(0, cardStart - 0.1),
      cardStart,
      cardEnd,
      Math.min(1, cardEnd + 0.1),
    ],
    [0.85, 1, 1, 0.85]
  );

  // Opacity: Fade in as card becomes active, fade out as it passes
  const opacity = useTransform(
    scrollProgress,
    [
      Math.max(0, cardStart - 0.15),
      cardStart,
      cardEnd,
      Math.min(1, cardEnd + 0.1),
    ],
    [0.3, 1, 1, 0.3]
  );

  // Blur: Sharp when active, blurred when not
  const blur = useTransform(
    scrollProgress,
    [
      Math.max(0, cardStart - 0.1),
      cardStart,
      cardEnd,
      Math.min(1, cardEnd + 0.1),
    ],
    [8, 0, 0, 8]
  );

  // Y position: Stack cards with slight offset
  const y = useTransform(
    scrollProgress,
    [cardStart, cardEnd],
    [index * 20, (index - 1) * 20]
  );

  return (
    <motion.div
      style={{
        scale,
        opacity,
        y,
        filter: useTransform(blur, (b) => `blur(${b}px)`),
        position: "sticky",
        top: "80px",
        zIndex: total - index,
      }}
      className="mb-6"
    >
      <div className="bg-[#1A1A1A] p-6 rounded-2xl shadow-2xl border border-white/5 backdrop-blur-sm">
        {/* Header Section */}
        <div className="flex items-start gap-4 mb-4">
          {experience.logo && (
            <div className="shrink-0">
              <img
                src={experience.logo}
                alt={`${experience.company} logo`}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/10"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-xl leading-tight mb-1">
              {experience.role}
            </h3>

            <p className="text-[#999] text-sm mb-2">{experience.company}</p>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[rgb(97,218,251)]/10 border border-[rgb(97,218,251)]/20 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-[rgb(97,218,251)] animate-pulse" />
              <p className="text-xs text-[rgb(97,218,251)] font-medium">
                {experience.dates}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-[#BBB] text-sm leading-relaxed mb-4">
          {experience.description}
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-2">
          {experience.skills.map((skill, i) => (
            <span
              key={i}
              className="px-3 py-1.5 text-xs bg-white/5 text-white/90 rounded-lg font-medium border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const ExperienceMobile: React.FC<ExperienceMobileProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress of entire container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end center"],
  });

  // Comet line grows from 0% to 100%
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Comet position (slightly ahead of line for smooth effect)
  const cometY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex flex-row pb-20"
      style={{
        height: `${data.length * 100}vh`,
      }}
    >
      {/* ==========================================
          LEFT: The Comet Trail
          ========================================== */}
      <div className="w-8 flex-shrink-0 relative mr-4">
        <div className="sticky left-0 h-screen" style={{ top: 0 }}>
          {/* Background track */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-[2px] bg-white/10"
            style={{
              top: "80px",
              bottom: "20%",
            }}
          />

          {/* Animated comet trail */}
          <motion.div
            style={{
              height: lineHeight,
              top: "80px",
            }}
            className="absolute left-1/2 -translate-x-1/2 w-[2px] overflow-visible"
          >
            {/* Gradient trail */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgb(97,218,251)]/50 to-[rgb(97,218,251)] shadow-[0_0_20px_rgba(97,218,251,0.5)]" />

            {/* Comet head with glow */}
            <motion.div
              style={{ y: cometY }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2"
            >
              {/* Outer glow */}
              <div className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[rgb(97,218,251)] opacity-30 blur-xl" />

              {/* Middle glow */}
              <div className="absolute inset-0 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[rgb(97,218,251)] opacity-60 blur-md" />

              {/* Core */}
              <div className="absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[rgb(97,218,251)] shadow-[0_0_20px_rgba(97,218,251,0.8)]" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ==========================================
          RIGHT: The Stacking Cards
          ========================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        {data.map((experience, index) => (
          <Card
            key={index}
            experience={experience}
            index={index}
            total={data.length}
            scrollProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
};

export default ExperienceMobile;
