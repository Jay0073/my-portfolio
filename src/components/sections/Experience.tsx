import React from "react";
import SectionWrapper from "../common/SectionWrapper";
import TimelineEntry from "../common/TimelineEntry";
import Button from "../common/Button";
import Workelate from "../assets/workelate.svg";

const Experience: React.FC = () => {
  const experiences = [
    {
      company: "Workelate",
      logo: "https://www.workelate.com/images/header/workelate-logo.svg",
      role: "Web Developer Intern",
      dates: "May 2025 – Present",
      description:
        "Developed microservices in Node.js, containerized with Docker, reducing deployment times by 30%. Collaborated in Agile teams and integrated with AWS Lambda. Implemented CI/CD pipelines using GitHub Actions.",
      skills: [
        "Node.js",
        "Express",
        "Docker",
        "AWS (Lambda, S3)",
        "Git",
        "Scrum",
      ],
      stickyTop: 270,
    },
    {
      company: "Centennial Infotech",
      logo: "https://centennialinfotech.com/img/logo.png",
      role: "Web Developer Intern",
      dates: "Jan 2025 – March 2025",
      description:
        "Improved UI responsiveness by 25% and reduced page-load times by 20% through React refactoring. Collaborated with designers to implement a more intuitive user interface. Implemented CI/CD pipelines using GitHub Actions. Improved UI responsiveness by 25% and reduced page-load times by 20% through React refactoring. Collaborated with designers to implement a more intuitive user interface. Implemented CI/CD pipelines using GitHub Actions.",
      skills: ["React", "TailwindCSS", "JavaScript", "Git", "Agile"],
      stickyTop: 270,
    },
    {
      company: "Motion Cut",
      logo: "https://motioncut.in/wp-content/uploads/2023/05/MOTION-CUT1-e1751999514735.png",
      role: "Frontend Intern",
      dates: "Nov 2024 – Dec 2024",
      description:
        "Converted designs to interactive UIs, enhancing UX metrics by 30% using TailwindCSS. Collaborated with backend developers to integrate APIs and improve overall application performance. Created responsive layouts using Figma.",
      skills: [
        "HTML/CSS",
        "JavaScript",
        "TailwindCSS",
        "Figma",
        "Responsive Design",
      ],
      stickyTop: 270,
    },
  ];

  const handleLinkedInClick = () => {
    window.open("https://linkedin.com/in/[username]", "_blank");
  };

  return (
    <SectionWrapper
      id="experience"
      title="Experience"
      subtitle="Professional Roles and Contributions"
    >
      <div className="relative">
        {/* Timeline line */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-[#BBBBBB]"></div>

        {/* Timeline entries */}
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <TimelineEntry
              key={index}
              logo={exp.logo}
              company={exp.company}
              role={exp.role}
              dates={exp.dates}
              description={exp.description}
              skills={exp.skills}
              isLeft={index % 2 === 0}
            />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16">
        <Button
          text="View LinkedIn Profile"
          onClick={handleLinkedInClick}
          style="secondary"
        />
      </div>
    </SectionWrapper>
  );
};

export default Experience;
