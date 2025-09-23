import React from "react";
import SectionWrapper from "../common/SectionWrapper";
import { FaSchool, FaUserGraduate } from "react-icons/fa";
import { MdEngineering } from "react-icons/md";

const educationData = [
  {
    year: "2026",
    institution: "Siddartha Institute of Technology and Sciences",
    course: "Bachelor of Technology in Computer Science (expected)",
    icon: <MdEngineering className="text-7xl text-white opacity-70" />,
  },
  {
    year: "2023",
    institution: "Mahaveer Institute of Science and Technology",
    course: "Diploma in Electrical and Electronic Engineering",
    icon: <FaUserGraduate className="text-7xl text-white opacity-70" />,
  },
  {
    year: "2020",
    institution: "St. Mary's High School",
    course: "10th standard",
    icon: <FaSchool className="text-7xl text-white opacity-70" />,
  },
];

const Education: React.FC = () => {
  return (
    <SectionWrapper
      id="education"
      title="Education"
      subtitle="Academic Journey & Milestones"
    >
      <div className="relative flex flex-col gap-16 max-w-[820px] mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", top: "75px", right: "145px", width: "100%", height: "100%", pointerEvents: "none" }} viewBox="0 0 800 600" fill="none">
  <path d="M80 10c-130 180 210 -80 80 180" stroke="rgba(255,255,255,0.25)" fill="none"/>
</svg>


        {/* Cards */}
        {educationData.map((edu) => (
          <div
            key={edu.year}
            className="flex items-center gap-6"
            style={{
              flexDirection: "row-reverse",
              justifyContent: "flex-end",
            }}
          >
            {/* Card */}
            <div className="flex items-center gap-6 bg-[#181818] rounded-lg px-6 py-6 shadow-lg animate-fade-in-up flex-1">
              {/* Year */}
              <div className="text-4xl md:text-5xl font-bold text-white min-w-[70px] text-left leading-none">
                {edu.year}
              </div>

              {/* Text */}
              <div className="flex flex-col justify-center text-left">
                <div className="text-lg md:text-xl font-semibold text-white mb-1">
                  {edu.institution}
                </div>
                <div className="text-base text-[#BBBBBB] font-medium">
                  {edu.course}
                </div>
              </div>
            </div>

            {/* Icon */}
            <div className="relative w-28">{edu.icon}</div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default Education;