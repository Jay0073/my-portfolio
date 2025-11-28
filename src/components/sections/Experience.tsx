import React from "react";
import useMediaQuery from "../items/useMediaQuery";
import ExperienceDesktop from "../common/ExperienceDesktop";
import ExperienceMobile from "../common/ExperienceMobile";
import SectionWrapper from "../common/SectionWrapper";
import Button from "../common/Button";


const experiences = [
  {
      company: "Workelate",
      logo: "https://www.workelate.com/images/header/workelate-logo.svg",
      role: "Full Stack Developer Intern",
      dates: "Apr 2025 – Sept 2025",
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

const Experience: React.FC = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleLinkedInClick = () => {
    window.open("https://www.linkedin.com/in/voutla-jayendra/", "_blank");
  };

  return (
    <SectionWrapper
      id="experience"
      title="Experience"
      subtitle="Professional Roles and Contributions"
      className=""
    >
      {isDesktop ? (
        <ExperienceDesktop data={experiences} />
      ) : (
        <ExperienceMobile data={experiences} />
      )}

      {/* Shared Bottom CTA */}
      <div className="text-center mt-16 relative z-20">
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