import React, { useState, useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
// Components
import Header from "./components/Header";
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import Experience from "./components/sections/Experience";
import Skills from "./components/sections/Skills";
import Footer from "./components/Footer";
import QuoteCard from "./components/QuoteCard";
import Education from "./components/sections/Education";
import Certificates, { CertificateType } from "./components/sections/Certificates";
import ClickSpark from "./components/items/ClickSpark";
// Backgrounds
import Snowfall from "react-snowfall";
import { BackgroundLines } from "./components/items/Backgroundlines";
import { BackgroundBeamsWithCollision } from "./components/items/BackgroundBeams";

const getInitialBackground = () => {
  const EXPIRY_TIME_MS = 60 * 60 * 1000; // 1 Hour
  
  try {
    const savedData = localStorage.getItem("bg_pref");
    if (savedData) {
      const { variant, timestamp } = JSON.parse(savedData);
      const now = Date.now();
      
      if (now - timestamp < EXPIRY_TIME_MS) {
        return variant;
      }
    }
  } catch (e) {
    console.error("Error reading local storage", e);
  }

  const newVariant = Math.floor(Math.random() * 4);
  
  localStorage.setItem("bg_pref", JSON.stringify({
    variant: newVariant,
    timestamp: Date.now()
  }));

  return newVariant;
};

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
       {/* <button
        className="absolute top-4 right-12 md:top-2 md:right-[22rem] text-white text-2xl md:text-4xl font-bold bg-black/60 rounded-full w-10 h-10 md:w-14 md:h-14 flex items-center justify-center hover:bg-black/80 transition z-[101] border-2 border-white shadow-xl pb-1"
        onClick={onClose}
        aria-label="Close"
        style={{ boxShadow: "0 4px 32px 0 rgba(0,0,0,0.4)" }}
      >
        &times;
      </button> */}
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

  const [bgVariant] = useState<number>(getInitialBackground);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      gestureDirection: "vertical",
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  const handleCertClick = (cert: CertificateType) => {
    setModalCert(cert);
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setModalCert(null);
  };

  const renderBackground = () => {
    switch (bgVariant) {
      case 0: // Matrix
        return (
          <div className="matrix-bg">
            <div className="matrix-overlay"></div>
          </div>
        );
      case 1: // Snowfall
        return (
          <Snowfall
            color="#dee4fd"
            snowflakeCount={50}
            opacity={[0.2, 0.8]}
            // enable3DRotation
            style={{
              position: "fixed",
              width: "100vw",
              height: "100vh",
              top: 0,
              left: 0,
              zIndex: 0,
            }}
          />
        );
      case 2: // Background Lines
        return (
          <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
            <BackgroundLines />
          </div>
        );
      case 3: // Background Beams
        return (
          <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
            <BackgroundBeamsWithCollision />
          </div>
        );
      default:
        return <div className="fixed inset-0 bg-black -z-50" />;
    }
  };

  return (
    <ClickSpark
      sparkColor="#fff"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <div className="relative min-h-screen text-white font-inter bg-black selection:bg-white/20">
        
        {/* Render Background */}
        {renderBackground()}
        <Header />

        <main className="relative z-20">
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Education />
          <Certificates onCertClick={handleCertClick} />
        </main>

        <QuoteCard />
        
        <div className="relative z-50 bg-black">
          <Footer />
        </div>
        
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