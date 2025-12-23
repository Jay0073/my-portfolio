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

const Card: React.FC<{
  experience: ExperienceData;
  index: number;
  total: number;
}> = ({ experience }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Track the scroll position of THIS specific card relative to the viewport
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"], // Triggers as card enters/leaves viewport
  });

  // --- PARALLAX & STACK EFFECTS ---
  const scale = useTransform(scrollYProgress, [0.8, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0.8, 1], [1, 0.5]);

  return (
    <motion.div
      ref={cardRef}
      style={{ scale, opacity }}
      className="mb-12 w-full flex flex-col items-center"
    >
      <div className="w-full max-w-sm relative rounded-xl bg-[#1a1a1a] backdrop-blur-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {experience.logo ? (
                <img
                  src={experience.logo}
                  alt={experience.company}
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-xs text-white">{experience.company[0]}</span>
                </div>
              )}
              <div>
                <h3 className="text-white font-poppins font-semibold text-lg leading-tight">
                  {experience.role}
                </h3>
                <p className="text-[rgb(97,218,251)] text-sm font-medium">
                  {experience.company}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
             <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-[#BBBBBB] font-inter">
                {experience.dates}
             </span>
          </div>

          <p className="text-[#EEEEEE] font-inter text-sm leading-relaxed mb-6">
            {experience.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {experience.skills.slice(0, 4).map((skill, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-xs font-medium bg-white/5 text-white/80 rounded-md border border-white/5"
              >
                {skill}
              </span>
            ))}
             {experience.skills.length > 4 && (
                <span className="px-2.5 py-1 text-xs font-medium bg-white/5 text-white/50 rounded-md border border-white/5">
                    +{experience.skills.length - 4}
                </span>
             )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ExperienceMobile: React.FC<ExperienceMobileProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll of the entire container for the timeline
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  // Height of the "Tail" (fills up as you scroll)
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={containerRef}
      className="relative w-full pl-4 pr-2 py-10 flex gap-4"
    >
      {/* --- REALISTIC COMET TIMELINE --- */}
      {/* Fixed to the left side */}
      <div className="w-6 flex-shrink-0 relative">
        
        {/* The Track (Invisible container for the tail) */}
        {/* Removed bg-white/10 to hide the gray line */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] rounded-full overflow-hidden">
          
          {/* The Tail (Gradient Trail) */}
          {/* Modified gradient to look like a fading comet tail */}
          <motion.div 
             style={{ height: lineHeight }}
             className="w-full bg-gradient-to-b from-transparent via-[rgba(97,218,251,0.4)] to-[rgb(97,218,251)]"
          />
        </div>

        {/* The Head (Realistic Glowing Comet) */}
        <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none">
            <motion.div 
                style={{ top: lineHeight }}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                {/* <div className="relative flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full z-20 shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]" />
                    
                    <div className="absolute w-4 h-4 bg-[rgb(97,218,251)] rounded-full blur-[4px] opacity-80 z-10" />
                    
                    <div className="absolute w-10 h-10 bg-[rgb(97,218,251)] rounded-full blur-[10px] opacity-40" />
                    
                    <div className="absolute w-16 h-16 bg-[rgb(97,218,251)] rounded-full blur-[20px] opacity-20" />
                </div> */}
            </motion.div>
        </div>
      </div>

      {/* --- CARDS LIST --- */}
      <div className="flex-1 min-w-0">
         {data.map((experience, i) => (
            <Card
              key={i}
              experience={experience}
              index={i}
              total={data.length}
            />
         ))}
      </div>
    </div>
  );
};

export default ExperienceMobile;