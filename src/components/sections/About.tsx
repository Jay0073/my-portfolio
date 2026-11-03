import React from "react";
import SectionWrapper from "../common/SectionWrapper";
import Button from "../common/Button";
import IconList from "../common/IconList";
import useMediaQuery from "../items/useMediaQuery";
import {
  Award,
  Code,
  Users,
} from "lucide-react";
import AboutAnimation from "./AboutAnimation";
import { useContent } from "../../lib/contentContext";
import { getIconComponent } from "../../lib/iconMap";

const statIcons = [Code, Award, Users];

const About: React.FC = () => {
  const { content } = useContent();
  const about = content.about;

  const socialIcons = about.socialLinks.map((link) => ({
    icon: getIconComponent(link.icon),
    href: link.href,
    label: link.label,
  }));

  const handleResumeDownload = () => {
    window.open(about.resumeUrl, "_blank");
  };

  const isMd = useMediaQuery("(min-width: 768px)");

  return (
    <SectionWrapper
      id="about"
      title="About Me"
      subtitle="Professional Background and Expertise"
      className="pb-0 md:py-16"
    >
      <div className={`grid gap-8 md:gap-12 items-center ${about.lottieUrl ? "md:grid-cols-2 md:-mt-8" : "max-w-3xl mx-auto"}`}>
        {isMd && about.lottieUrl && (
          <AboutAnimation key={about.lottieUrl} src={about.lottieUrl} />
        )}

        {/* Content */}
        <div className="space-y-6 md:space-y-8 min-w-0">
          <div>
            <p className="font-inter text-left text-lg text-[#EEEEEE] leading-relaxed break-words">
              {about.bio}
            </p>
          </div>


          <div className="hidden md:grid grid-cols-3 gap-4">
            {about.stats.map((stat, i) => {
              const Icon = statIcons[i % statIcons.length];
              return (
                <div key={i} className="min-w-0 text-center p-3 bg-[#1A1A1A] rounded-lg break-words" data-fit="about-stat">
                  <Icon className="mx-auto mb-2 text-white" size={24} />
                  <p className="text-white font-semibold">{stat.value}</p>
                  <p className="text-[#BBBBBB] text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 md:hidden">
            {about.stats.map((stat, i) => {
              const Icon = statIcons[i % statIcons.length];
              return (
                <div key={i} className="flex items-center gap-3 min-w-0" data-fit="about-stat">
                  <Icon size={32} className="bg-white/10 p-2 rounded-lg shrink-0" />
                  <span className="text-[#BBBBBB] text-sm break-words min-w-0">
                    <span className="text-white text-[17px] font-semibold">{stat.value}</span>{" "}
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div>
            <h3 className="font-poppins font-semibold text-xl text-white mb-4">
              Professional Values
            </h3>
            <ul className="space-y-2">
              {about.values.map((value, index) => (
                <li key={index} className="flex items-start gap-3 ml-2">
                  <div className="w-2 h-2 mt-2 shrink-0 bg-white rounded-full"></div>
                  <span className="text-[#EEEEEE] font-inter break-words min-w-0">{value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            <div className="w-full md:w-auto [&>button]:w-full [&>button]:md:w-auto">
              <Button
                text="Download Resume"
                onClick={handleResumeDownload}
                style="secondary"
                aria-label="Download Resume"
              />
            </div>

            <div className="flex justify-center md:justify-start w-full md:w-auto">
              <IconList icons={socialIcons} />
            </div>

          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default About;
