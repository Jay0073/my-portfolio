import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import Experience from "./components/sections/Experience";
import Skills from "./components/sections/Skills";
import Footer from "./components/Footer";
import QuoteCard from "./components/QuoteCard";
import Education from "./components/sections/Education";
import Certificates, {
  certificates as certificatesList,
  CertificateType,
} from "./components/sections/Certificates";

const CertificateModal: React.FC<{
  open: boolean;
  cert: CertificateType | null;
  onClose: () => void;
}> = ({ open, cert, onClose }) => {
  if (!open || !cert) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button outside image container */}
      <button
        className="absolute top-8 right-12 pb-1 md:top-12 md:right-24 text-white text-4xl font-bold bg-black/60 rounded-full w-14 h-14 flex items-center justify-center hover:bg-black/80 transition z-[101] border-2 border-white shadow-xl"
        onClick={onClose}
        aria-label="Close"
        style={{ boxShadow: "0 4px 32px 0 rgba(0,0,0,0.4)" }}
      >
        &times;
      </button>
      <div
        className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/80 p-8 rounded-3xl shadow-2xl max-w-3xl w-[95vw] flex flex-col items-center border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={cert.src}
          alt={cert.name}
          className="w-full h-auto max-h-[70vh] rounded-2xl shadow-xl object-contain bg-white"
        />
        <div className="mt-8 text-center">
          <p className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
            {cert.name}
          </p>
          <p className="text-lg text-white/80 font-medium">{cert.issuer}</p>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCert, setModalCert] = useState<CertificateType | null>(null);

  const handleCertClick = (cert: CertificateType) => {
    setModalCert(cert);
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setModalCert(null);
  };

  return (
    <div className="relative min-h-screen text-white font-inter">
      <div className="matrix-bg">
        <div className="matrix-overlay"></div>
      </div>
      <Header />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Certificates onCertClick={handleCertClick} />
      </main>
      <QuoteCard />
      <Footer />
      <CertificateModal
        open={modalOpen}
        cert={modalCert}
        onClose={handleModalClose}
      />
    </div>
  );
}

export default App;
