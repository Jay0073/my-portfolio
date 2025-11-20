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
      dates: "May 2025 – Sept 2025",
      description:
        "Played a key role in shaping core products - TaskNetic, FormNetic, and xNetic - within a dynamic startup ecosystem. Migrated outdated codebases to modern stacks, resolving version conflicts and upgrading dependencies to ensure long‑term scalability. Delivered collaborative Kanban workflows in TaskNetic and dynamic form experiences in FormNetic, features that significantly improved user engagement and reduced bounce rates. Partnered with leadership to refine UI/UX across products, optimized backend media handling with AWS S3, and consistently delivered enhancements with 90% post‑release stability. Recognized by the co‑founder for combining technical rigor with user‑centric design in a fast‑moving product ecosystem.",
      skills: [
        "React",
        "Redux",
        "Node.js",
        "Express",
        "MongoDB",
        "AWS (Lambda, S3)",
        "Postman",
        "Agile Collaboration",
      ],
      stickyTop: 270,
    },
    {
      company: "Centennial Infotech",
      logo: "https://centennialinfotech.com/img/logo.png",
      role: "Web Developer Intern",
      dates: "Jan 2025 – March 2025",
      description:
        "Optimized enterprise web solutions by refactoring React components, improving responsiveness by 35% and reducing load times by 40%. Collaborated with designers to deliver intuitive, user‑centric interfaces while integrating backend APIs for smoother business logic automation. Supported deployments with CI/CD pipelines and contributed to a modular, maintainable codebase in a fast‑paced environment.",
      skills: ["React", "TailwindCSS", "Express", "Node.js", "MySQL", "MongoDB", "CI/CD", "Postman"],
      stickyTop: 270,
    },
    {
      company: "Motion Cut",
      logo: "https://motioncut.in/wp-content/uploads/2023/05/MOTION-CUT1-e1751999514735.png",
      role: "Frontend Intern",
      dates: "Nov 2024 – Dec 2024",
      description:
        "Transformed static designs into interactive, responsive UIs using TailwindCSS and Figma, boosting UX metrics by 30%. Coordinated with backend teams to integrate APIs and improve performance across applications. Delivered mobile‑friendly layouts that aligned with Motion Cut’s project‑based learning ethos, ensuring accessibility and consistency across platforms.",
      skills: [
        "React",
        "Bootstrap",
        "TailwindCSS",
        "Figma",
        "UI/UX Optimization",
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
        <div
          className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-[#BBBBBB]"
          style={{
            filter: "drop-shadow(rgb(97, 218, 251) 0px 0px 6px)",
          }}
        ></div>

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
