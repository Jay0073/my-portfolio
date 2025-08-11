import React from 'react';

interface TimelineEntryProps {
  logo?: string;
  company: string;
  role: string;
  dates: string;
  description: string;
  skills: string[];
  isLeft: boolean;
}

const TimelineEntry: React.FC<TimelineEntryProps> = ({
  logo,
  company,
  role,
  dates,
  description,
  skills,
  isLeft,
}) => {
  return (
    <div className={`flex items-center mb-12 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      {/* Timeline connector */}
      <div className="hidden md:flex flex-col items-center">
        <div className="w-4 h-4 bg-white rounded-full border-4 border-[#1A1A1A]"></div>
        <div className="w-0.5 h-24 bg-[#BBBBBB] mt-2"></div>
      </div>
      
      {/* Content card */}
      <div className={`flex-1 ${isLeft ? 'md:mr-8' : 'md:ml-8'}`}>
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
                className="px-3 py-1 text-sm bg-white/10 text-white rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineEntry;