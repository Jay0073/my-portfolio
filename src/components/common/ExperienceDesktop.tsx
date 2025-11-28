import React from "react";
import TimelineEntry from "../common/TimelineEntry";

interface ExperienceDesktopProps {
  data: any[];
}

const ExperienceDesktop: React.FC<ExperienceDesktopProps> = ({ data }) => {
  return (
    <div className="relative">
      {/* Central Line */}
      <div
        className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-[#BBBBBB]"
        style={{
          filter: "drop-shadow(rgb(97, 218, 251) 0px 0px 6px)",
        }}
      ></div>

      <div className="space-y-8">
        {data.map((exp, index) => (
          <TimelineEntry
            key={index}
            logo={exp.logo}
            company={exp.company}
            role={exp.role}
            dates={exp.dates}
            description={exp.description}
            skills={exp.skills}
            isLeft={index % 2 === 0}
            stickyTop={exp.stickyTop}
          />
        ))}
      </div>
    </div>
  );
};

export default ExperienceDesktop;