import React, { useState, useEffect } from "react";
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
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
import ClickSpark from "./components/items/ClickSpark";

const CertificateModal: React.FC<{
  open: boolean;
  cert: CertificateType | null;
  onClose: () => void;
}> = ({ open, cert, onClose }) => {
  if (!open || !cert) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 md:top-12 md:right-24 text-white text-2xl md:text-4xl font-bold bg-black/60 rounded-full w-10 h-10 md:w-14 md:h-14 flex items-center justify-center hover:bg-black/80 transition z-[101] border-2 border-white shadow-xl pb-1"
        onClick={onClose}
        aria-label="Close"
        style={{ boxShadow: "0 4px 32px 0 rgba(0,0,0,0.4)" }}
      >
        &times;
      </button>
      <div
        className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/80 p-4 md:p-8 rounded-3xl shadow-2xl max-w-3xl w-full md:w-[95vw] flex flex-col items-center border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={cert.src}
          alt={cert.name}
          className="w-full h-auto max-h-[60vh] md:max-h-[70vh] rounded-2xl shadow-xl object-contain bg-white"
        />
        <div className="mt-4 md:mt-8 text-center">
          <p className="text-xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
            {cert.name}
          </p>
          <p className="text-sm md:text-lg text-white/80 font-medium">{cert.issuer}</p>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCert, setModalCert] = useState<CertificateType | null>(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true, // Enable smooth scrolling for mouse wheel
      gestureDirection: 'vertical',
    });

    // Create the animation loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  const handleCertClick = (cert: CertificateType) => {
    setModalCert(cert);
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setModalCert(null);
  };

  return (
    <ClickSpark
      sparkColor="#fff"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
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
    </ClickSpark>
  );
}

export default App;
