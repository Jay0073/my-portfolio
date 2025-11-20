import React from "react";
import SectionWrapper from "../common/SectionWrapper";
import { FaUserTie, FaUserGraduate } from "react-icons/fa6";
import { MdEngineering } from "react-icons/md";
import { MdOutlineKeyboardDoubleArrowUp } from "react-icons/md";

const educationData = [
  {
    year: "2026",
    institution: "Siddartha Institute of Technology and Sciences",
    course: "Bachelor of Technology in Computer Science (expected)",
    icon: MdEngineering,
  },
  {
    year: "2023",
    institution: "Mahaveer Institute of Science and Technology",
    course: "Diploma in Electrical and Electronic Engineering",
    icon: FaUserGraduate,
  },
  {
    year: "2020",
    institution: "St. Mary's High School",
    course: "10th standard",
    icon: FaUserTie,
  },
];

const EducationWatermarkInCard: React.FC = () => {
  return (
    <SectionWrapper
      id="education"
      title="Education"
      subtitle="Academic Journey & Milestones"
    >
      <MdOutlineKeyboardDoubleArrowUp
        size={56}
        style={{ filter: "drop-shadow(rgb(97, 218, 251) 0px 0px 6px)" }}
        className="absolute top-[26%] left-[19%] text-3xl text-white/70 animate-bounce"
      />
      <MdOutlineKeyboardDoubleArrowUp
        size={56}
        style={{ filter: "drop-shadow(rgb(97, 218, 251) 0px 0px 6px)" }}
        className="absolute top-[66%] left-[19%] text-3xl text-white/70 animate-bounce"
      />

      <div className="relative flex flex-col gap-12 max-w-[820px] mx-auto">
        {educationData.map((edu) => {
          const Icon = edu.icon;
          const iconSize =
            edu.year === "2026"
              ? "text-[120px] bottom-[-14px] right-0 "
              : "text-[90px] bottom-0 right-7";
          return (
            <div key={edu.year} className="flex items-center gap-6 relative">
              {/* Year */}
              <div className="min-w-[90px] text-5xl md:text-6xl font-bold text-white flex items-center justify-center">
                {edu.year}
              </div>

              {/* Card */}
              <div className="relative flex flex-col gap-2 bg-[#1a1a1a] rounded-lg px-6 py-6 shadow-lg animate-fade-in-up flex-1 overflow-hidden">
                <div className="text-lg md:text-xl font-semibold text-white relative z-10">
                  {edu.institution}
                </div>
                <div className="text-base text-[#BBBBBB] font-medium relative z-10">
                  {edu.course}
                </div>

                {/* Transparent Icon in card */}
                <div
                  className={`absolute ${iconSize} text-white/5 pointer-events-none select-none`}
                >
                  <Icon />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
};

export default EducationWatermarkInCard;
