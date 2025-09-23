import React from "react";
import SectionWrapper from "../common/SectionWrapper";

export type CertificateType = {
  src: string;
  name: string;
  issuer: string;
};

const certificates: CertificateType[] = [
  {
    src: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&w=800&h=600",
    name: "Cybersecurity",
    issuer: "Cisco Networking Academy",
  },
  {
    src: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&w=800&h=600",
    name: "Machine Learning and AI with Python",
    issuer: "InternStudio",
  },
  {
    src: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&w=800&h=600",
    name: "Geo-Data Sharing and Cyber Security",
    issuer: "IIRS",
  },
  {
    src: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&w=800&h=600",
    name: "Generative AI with Diffusion Models",
    issuer: "NVIDIA",
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
    >
      <div className="relative w-full overflow-hidden">
        {/* Scrolling row */}
        <div
          className="flex gap-8 py-8 animate-scroll-x"
          style={{
            animation: "scroll-x 28s linear infinite",
            cursor: "pointer",
          }}
        >
          {[...certificates, ...certificates].map((cert, idx) => (
            <div
              key={idx}
              className="w-60 h-80 flex-shrink-0 flex flex-col items-center"
              onClick={() => onCertClick(cert)}
            >
              <div className="w-56 h-56 rounded-2xl overflow-hidden shadow-xl bg-white border border-gray-200 hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                <img
                  src={cert.src}
                  alt={cert.name}
                  className="object-cover w-full h-full"
                  draggable={false}
                  style={{ aspectRatio: "1/1", width: "100%", height: "100%" }}
                />
              </div>
              <p className="mt-4 text-center text-base font-semibold text-gray-500 leading-tight">
                {cert.name}
              </p>
              <p className="text-center text-sm text-gray-200">{cert.issuer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes scroll-x {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </SectionWrapper>
  );
};

export { certificates };
export default Certificates;
