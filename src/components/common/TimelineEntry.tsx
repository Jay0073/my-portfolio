import React from "react";
import "./styles.css";

interface TimelineEntryProps {
  logo?: string;
  company: string;
  role: string;
  dates: string;
  description: string;
  skills: string[];
  isLeft: boolean;
  logoAlt?: string;
  stickyTop?: number;
}

const TimelineEntry: React.FC<TimelineEntryProps> = ({
  logo,
  company,
  role,
  dates,
  description,
  skills,
  isLeft,
  logoAlt = "",
  stickyTop = 270,
}) => {
  const Card = (
    <div className="flex-1">
      <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          {logo && (
            <img
              src={logo}
              alt={`${company} logo`}
              className="w-8 h-8 rounded-full"
            />
          )}
          <div>
            <h3 className="font-poppins font-semibold text-white">{role}</h3>
            <p className="text-[#BBBBBB]">{company}</p>
          </div>
          <span className="ml-auto text-sm text-[#BBBBBB] font-inter">
            {dates}
          </span>
        </div>

        <p className="text-[#BBBBBB] font-inter leading-relaxed mb-4">
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 text-sm bg-white/5 text-white rounded-md"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const Indicator = (
    <div
      className="relative hidden md:block"
      style={{
        filter: "drop-shadow(rgb(97, 218, 251) 0px 0px 6px)",
      }}
    >
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-[#BBBBBB]" />
    </div>
  );

  const OppositeImage = (
    <div className="relative hidden md:block">
      <div
        className="sticky"
        style={{
          top: `${stickyTop}px`,
          marginLeft: isLeft ? "33px" : "255px",
        }}
      >
        {logo && (
          <div className="relative inline-block">
            <img
              src={logo}
              alt={logoAlt}
              className="w-[14rem] object-contain rounded-lg shadow-lg"
            />
            <span
              className={[
                "pointer-events-none absolute top-1/2 -translate-y-1/2 block h-[2.5px] rounded-sm bg-[#BBBBBB]",
                isLeft
                  ? "right-full mr-8 w-16"
                  : "left-full responsive-ml w-16",
              ].join(" ")}
              style={{
                filter: "drop-shadow(rgb(97, 218, 251) 0px 0px 6px)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="mb-16">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_4rem_1fr] md:gap-8 items-stretch">
        {isLeft ? (
          <>
            {Card}
            {Indicator}
            {OppositeImage}
          </>
        ) : (
          <>
            {OppositeImage}
            {Indicator}
            {Card}
          </>
        )}
      </div>

      <div className="md:hidden mt-4">
        {logo && (
          <img
            src={logo}
            alt={logoAlt}
            className="w-24 h-24 object-cover rounded-lg shadow"
          />
        )}
      </div>
    </div>
  );
};

export default TimelineEntry;
