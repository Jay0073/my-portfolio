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
      { icon: Github, href: 'https://github.com/Jay0073', label: 'My code vault' },
      { icon: Linkedin, href: 'https://linkedin.com/in/voutla-jayendra', label: "Let's get Professional" },
      { icon: Mail, href: 'mailto:voutlajay8765@gmail.com', label: 'Inbox open 24/7' },
      { icon: Twitter, href: 'https://twitter.com/[username]', label: 'Memes and more' },
      { icon: Instagram, href: 'https://instagram.com/__nameisjay_', label: 'Nothing to look here!' },
    ];

  const handleResumeDownload = () => {
    window.open("https://drive.google.com/file/d/1xld6QHhyoDQxZqKAnfFqL2Kk1xgGrnmx/view?usp=drive_link", "_blank");
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
              I’m Voutla Jayendra, a full‑stack developer passionate about engineering scalable web applications and exploring AI solutions. My focus is on building efficient systems with clean design and lasting impact.
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
              <p className="text-[#BBBBBB] text-sm">Full‑Stack Delivered</p>
            </div>
            <div className="text-center p-4 bg-[#1A1A1A] rounded-lg">
              <Users className="mx-auto mb-2 text-white" size={24} />
              <p className="text-white font-semibold">5+ Certifications</p>
              <p className="text-[#BBBBBB] text-sm">Across AI & Cloud</p>
            </div>
          </div>

          {/* Professional Values */}
          <div>
            <h3 className="font-poppins font-semibold text-xl text-white mb-4">
              Professional Values
            </h3>
            <ul className="space-y-2">
              {[
                "Skilled in full‑stack engineering",
                "Dedicated to clean, reliable code", 
                "Collaborative and growth‑oriented",
              ].map((value, index) => (
                <li key={index} className="flex items-center gap-3 ml-2">
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
