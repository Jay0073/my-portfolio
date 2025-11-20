import React from "react";
import SectionWrapper from "../common/SectionWrapper";
import cybersecurity from "../assets/cisco-cybersecurity.jpg";
import ethicalHack from "../assets/cisco-ethicalHack.jpg";
import iirs from "../assets/iirs.jpg";
import jetking from "../assets/jetking-python.jpg";
import diffusion from "../assets/nvidia-diffusion.png";
import dp from "../assets/nvidia-dp.png";
import transformer from "../assets/nvidia-transformer.png";

export type CertificateType = {
  src: string;
  name: string;
  issuer: string;
  year?: string;
};

const certificates: CertificateType[] = [
  {
    src: dp,
    name: "Getting Started with Deep Learning",
    issuer: "NVIDIA",
    year: "2024",
  },
  {
    src: cybersecurity,
    name: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    year: "2024",
  },
  {
    src: ethicalHack,
    name: "Ethical Hacker",
    issuer: "Cisco Networking Academy",
    year: "2025",
  },
  {
    src: iirs,
    name: "Geo-Data Sharing and Cyber Security",
    issuer: "IIRS",
    year: "2025",
  },
  {
    src: jetking,
    name: "Python Workshop",
    issuer: "Jetking ECIL",
    year: "2023",
  },
  {
    src: diffusion,
    name: "Generative AI with Diffusion Models",
    issuer: "NVIDIA",
    year: "2025",
  },
  {
    src: transformer,
    name: "Introduction to Transformer-Based Natural Language Processing",
    issuer: "NVIDIA",
    year: "2024",
  },
];

interface CertificatesProps {
  onCertClick: (cert: CertificateType) => void;
}

const Certificates: React.FC<CertificatesProps> = ({ onCertClick }) => {
  return (
    <SectionWrapper
      id="certificates"
      title="Certificates"
      subtitle="My Achievements & Credentials"
      className="p-0"
      headingClass="mb-6"
    >
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll 60s linear infinite;
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="flex flex-col items-center">
        <div className="flex w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_68px,_black_calc(100%-68px),transparent_100%)]">
          <div className="flex gap-8 py-10 animate-scroll">
            {[...certificates, ...certificates].map((cert, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-[300px] h-[200px] sm:w-[380px] sm:h-[220px] rounded-2xl shadow-xl hover:shadow-2xl transition-transform duration-300 relative overflow-hidden cursor-pointer group"
                onClick={() => onCertClick(cert)}
                id="certificate-card"
              >
                {/* Background image */}
                <img
                  src={cert.src}
                  alt={cert.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Dark overlay for better contrast */}
                <div className="absolute inset-0 bg-black/30"></div>

                {/* Blurred background behind text */}
                <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-md bg-black/30 z-10">
                  <div className="text-white text-lg font-semibold mb-1">
                    {cert.name}
                  </div>
                  <div className="text-gray-300 text-sm">{cert.issuer}</div>
                  {cert.year && (
                    <div className="text-gray-400 mt-2 text-xs">{cert.year}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export { certificates };
export default Certificates;
