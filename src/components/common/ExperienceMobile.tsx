import React, { useRef, useEffect, useState } from "react";

interface ExperienceMobileProps {
  data: any[];
}

const ExperienceMobile: React.FC<ExperienceMobileProps> = ({ data }) => {
  // Track scroll position for moving dot
  const timelineRef = useRef<HTMLDivElement>(null);
  const [dotOffset, setDotOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      const timelineRect = timelineRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      // Calculate scroll progress relative to timeline height
      const timelineHeight = timelineRef.current.offsetHeight;
      const scrollY = window.scrollY + viewportHeight / 2;
      const timelineTop = timelineRef.current.offsetTop;
      let progress = (scrollY - timelineTop) / timelineHeight;
      progress = Math.max(0, Math.min(1, progress));
      setDotOffset(progress * timelineHeight);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative flex min-h-screen pb-24">
      {/* ------------------------------------------
        1. STICKY TIMELINE (Left Column)
        ------------------------------------------ */}
      <div className="w-12 flex-shrink-0 relative" style={{ height: "100vh" }}>
        <div ref={timelineRef} className="sticky top-0 h-full">
          {/* The Fixed Line Track */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] bg-[#333]"></div>
          {/* Moving Glowing Dot */}
          <div
            className="absolute left-1/2 -translate-x-1/2 z-50"
            style={{
              top: dotOffset - 12, // center the dot (dot is 24px tall)
              transition: "top 0.1s linear",
            }}
          >
            <div className="relative w-6 h-6 rounded-full bg-[#1A1A1A] border-2 border-[#61DAFB] shadow-[0_0_16px_#61DAFB] flex items-center justify-center">
              <div className="absolute inset-0 bg-[#61DAFB] opacity-50 blur-[4px] rounded-full animate-pulse"></div>
              <div className="w-3 h-3 rounded-full bg-[#61DAFB]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------
        2. THE CARDS (Right Column)
        ------------------------------------------ */}
      <div className="flex-1 pr-4 pt-10">
        {data.map((exp, index) => (
          <div
            key={index}
            className="sticky"
            style={{
              top: `calc(15vh + ${index * 3.5}rem)`,
              zIndex: index + 10,
              overflow: "visible", // allow overflow for longer cards
            }}
          >
            <div
              className="bg-[#121212] border border-white/10 rounded-t-2xl shadow-2xl overflow-visible"
              style={{
                // Remove minHeight so card height is content-based
                backgroundColor: "#121212",
                boxShadow: "0 -4px 20px rgba(0,0,0,0.6)",
              }}
            >
              {/* Highlight line at the top for 3D edge effect */}
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <div className="p-5">
                {/* HEADER (Always visible when stacked) */}
                <div className="flex items-center gap-3 mb-4 h-[3.5rem]">
                  {exp.logo && (
                    <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-black/40 border border-white/5 p-1.5 flex items-center justify-center">
                      <img
                        src={exp.logo}
                        alt={exp.company}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <h3 className="text-white font-bold text-lg leading-tight truncate">
                      {exp.role}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[#61DAFB] text-xs font-medium tracking-wide">
                        {exp.company}
                      </p>
                      <span className="text-[10px] text-white/40">•</span>
                      <span className="text-[10px] text-white/50 font-mono">
                        {exp.dates}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CONTENT BODY */}
                <div className="mt-2 pl-1">
                  <p className="text-[#BBBBBB] text-sm leading-relaxed mb-4 font-light">
                    {exp.description}
                  </p>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {exp.skills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-[11px] text-white/80 px-2.5 py-1 bg-white/5 rounded-full border border-white/5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* Extra space at bottom to allow scrolling past the last card */}
        <div className="h-32"></div>
      </div>
    </div>
  );
};

export default ExperienceMobile;
