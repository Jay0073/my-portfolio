import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

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

const Card: React.FC<{
  experience: ExperienceData;
  index: number;
  total: number;
  scrollPos: MotionValue<number>;
}> = ({ experience, index, total, scrollPos }) => {
  // Calculate distance from current card
  const distance = useTransform(scrollPos, (pos) => {
    return Math.abs(pos - index);
  });

  // Y-axis rotation - only spin when transitioning
  const rotateY = useTransform(
    scrollPos,
    [index - 0.5, index, index + 0.5],
    [-180, 0, 180]
  );

  // Vertical position - snap behavior
  const y = useTransform(
    scrollPos,
    [index - 0.5, index, index + 0.5],
    ["100%", "0%", "-100%"]
  );

  // Opacity - only show when very close to active index
  const opacity = useTransform(distance, [0, 0.3, 0.5], [1, 1, 0]);

  // Scale - only full size when active
  const scale = useTransform(distance, [0, 0.3, 0.5], [1, 0.95, 0.7]);

  // Z-index - only active card visible
  const zIndex = useTransform(distance, [0, 0.5, 1], [10, 1, 0]);

  return (
    <motion.div
      style={{
        y,
        rotateY,
        scale,
        opacity,
        zIndex,
        transformStyle: "preserve-3d",
      }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      {/* THE CARD "SLAB" */}
      <motion.div className="relative w-full max-w-md bg-[#1A1A1A] rounded-lg pointer-events-auto backface-hidden">
        {/* 3D Slab Thickness - Enhanced with gradient and depth */}
        <div className="absolute inset-0 rounded-lg">
          <div className="absolute inset-0 rounded-lg border border-white/5 bg-gradient-to-br from-white/5 to-transparent" />
          <div className="absolute -bottom-2 -right-2 inset-0 rounded-lg bg-gradient-to-tl from-black/60 to-transparent pointer-events-none" />
          <div className="absolute inset-0 rounded-lg border-b-4 border-r-4 border-black/50 pointer-events-none" />
        </div>

        {/* Original Content Structure Requested */}
        <div className="p-6 rounded-lg border border-white/5">
          <div className="flex items-center gap-3 mb-3">
            {experience.logo && (
              <img
                src={experience.logo}
                alt={`${experience.company} logo`}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <div>
              <h3 className="font-poppins font-semibold text-white">
                {experience.role}
              </h3>
              <p className="text-[#BBBBBB]">{experience.company}</p>
            </div>
            <span className="ml-auto text-sm text-[#BBBBBB] font-inter">
              {experience.dates}
            </span>
          </div>

          <p className="text-[#BBBBBB] font-inter leading-relaxed mb-4">
            {experience.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {experience.skills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm bg-white/10 text-white rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ExperienceMobile: React.FC<ExperienceMobileProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Snap scroll position to nearest card index
  const scrollPos = useTransform(scrollYProgress, [0, 1], [0, data.length - 1]);

  // Meteor Line - synced with scroll
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      // Each card gets 100vh for snapping behavior
      style={{ height: `${data.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-row">
        {/* LEFT COLUMN: Meteor Trail */}
        <div className="w-10 flex-shrink-0 relative h-full flex justify-center ml-2">
          <div className="absolute top-1/2 -translate-y-1/2 h-[70vh] w-[2px] bg-white/10 rounded-full">
            <motion.div
              style={{ height: lineHeight }}
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-transparent via-[rgb(97,218,251)] to-[rgb(97,218,251)]"
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                <div className="w-2 h-2 bg-[rgb(97,218,251)] rounded-full shadow-[0_0_15px_2px_rgba(97,218,251,0.8)] animate-pulse" />
              </div>
            </motion.div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D Stage */}
        <div className="flex-1 relative h-full flex items-center justify-center p-4">
          {/* Perspective Container */}
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{ perspective: "1500px" }}
          >
            {data.map((experience, i) => (
              <Card
                key={i}
                experience={experience}
                index={i}
                total={data.length}
                scrollPos={scrollPos}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceMobile;
