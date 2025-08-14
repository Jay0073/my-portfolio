import React from "react";
import SectionWrapper from "../common/SectionWrapper";
import Button from "../common/Button";
import IconList from "../common/IconList";
import {
  Github,
  Linkedin,
  Mail,
  Twitter,
  Instagram,
  Award,
  Code,
  Users,
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const About: React.FC = () => {
  const socialIcons = [
    {
      icon: Github,
      href: "https://github.com/[username]",
      label: "Open GitHub profile",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/[username]",
      label: "Open LinkedIn profile",
    },
    { icon: Mail, href: "mailto:your.email@example.com", label: "Send email" },
    {
      icon: Twitter,
      href: "https://twitter.com/[username]",
      label: "Open Twitter profile",
    },
    {
      icon: Instagram,
      href: "https://instagram.com/[username]",
      label: "Open Instagram profile",
    },
  ];

  const handleResumeDownload = () => {
    // Replace with actual resume URL
    window.open("/path-to-resume.pdf", "_blank");
  };

  return (
    <SectionWrapper
      id="about"
      title="About Me"
      subtitle="Professional Background and Expertise"
    >
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <DotLottieReact
          src="https://lottie.host/ec4e92c1-e225-456f-baf2-4c22c8e3744e/7l9Gqmco8d.lottie"
          loop
          autoplay
        />{" "}
        {/* Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <div>
            <p className="font-inter text-lg text-[#EEEEEE] leading-relaxed">
              I am Voutla Jayendra, a MERN stack developer with experience in
              building web applications and exploring machine learning
              solutions. My work focuses on efficient, scalable software
              development.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
              <Code className="mx-auto mb-2 text-white" size={24} />
              <p className="text-white font-semibold">2+ Years</p>
              <p className="text-[#BBBBBB] text-sm">in Development</p>
            </div>
            <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
              <Award className="mx-auto mb-2 text-white" size={24} />
              <p className="text-white font-semibold">10+ Projects</p>
              <p className="text-[#BBBBBB] text-sm">MERN Completed</p>
            </div>
            <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
              <Users className="mx-auto mb-2 text-white" size={24} />
              <p className="text-white font-semibold">5+ Certifications</p>
              <p className="text-[#BBBBBB] text-sm">Earned</p>
            </div>
          </div>

          {/* Professional Values */}
          <div>
            <h3 className="font-poppins font-semibold text-xl text-white mb-4">
              Professional Values
            </h3>
            <ul className="space-y-2">
              {[
                "Proficient in full-stack development",
                "Committed to clean, maintainable code",
                "Experienced in team collaboration",
              ].map((value, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span className="text-[#BBBBBB] font-inter">{value}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              text="Download Resume"
              onClick={handleResumeDownload}
              style="secondary"
            />
            <div className="flex justify-center sm:justify-start">
              <IconList icons={socialIcons} />
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default About;
