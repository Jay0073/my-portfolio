import React, { useMemo } from "react";
import useMediaQuery from "../items/useMediaQuery";
import ExperienceDesktop from "../common/ExperienceDesktop";
import ExperienceMobile from "../common/ExperienceMobile";
import SectionWrapper from "../common/SectionWrapper";
import Button from "../common/Button";
import { useContent } from "../../lib/contentContext";

const Experience: React.FC = () => {
  const { content } = useContent();
  const experiences = content.experience;
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const linkedinUrl = useMemo(() => {
    const link = content.header.socialLinks.find((l) => l.icon.toLowerCase() === "linkedin");
    return link?.href ?? "https://www.linkedin.com/in/voutla-jayendra/";
  }, [content.header.socialLinks]);

  const handleLinkedInClick = () => {
    window.open(linkedinUrl, "_blank");
  };

  return (
    <SectionWrapper
      id="experience"
      title="Experience"
      subtitle="Professional Roles and Contributions"
      className="!px-2 md:px-8"
    >
      {isDesktop ? (
        <ExperienceDesktop data={experiences} />
      ) : (
        <ExperienceMobile data={experiences} />
      )}

      {/* Shared Bottom CTA */}
      <div className="text-center md:mt-16 relative z-20">
        <Button
          text="View LinkedIn Profile"
          onClick={handleLinkedInClick}
          style="secondary"
          aria-label="View LinkedIn Profile"
        />
      </div>
    </SectionWrapper>
  );
};

export default Experience;