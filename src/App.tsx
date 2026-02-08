import React, { useState, useEffect, Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Core Components (Loaded Immediately)
import Header from "./components/Header";
import Hero from "./components/sections/Hero";
import QuoteCard from "./components/QuoteCard";
import ClickSpark from "./components/items/ClickSpark";
import { CertificateType } from "./components/sections/Certificates";

// Lazy Loaded Sections
const About = lazy(() => import("./components/sections/About"));
const Projects = lazy(() => import("./components/sections/Projects"));
const Experience = lazy(() => import("./components/sections/Experience"));
const Skills = lazy(() => import("./components/sections/Skills"));
const Education = lazy(() => import("./components/sections/Education"));
const Certificates = lazy(() => import("./components/sections/Certificates"));
const Footer = lazy(() => import("./components/Footer"));

// --- Internal SectionLoader Component ---
const SectionLoader = ({ height = "min-h-[50vh]" }: { height?: string }) => (
  <div className={`w-full ${height} flex flex-col items-center justify-center py-16 px-6 md:px-20`}>
    {/* Centered Title Placeholder */}
    <div className="w-48 h-12 mb-12 animate-skeleton rounded-lg" />
    
    {/* Big Single Container Placeholder */}
    <div className="w-full max-w-6xl flex-1 min-h-[300px] animate-skeleton rounded-3xl opacity-80" />
  </div>
);

// --- Modal Component (Defined outside App to prevent re-creation on render) ---
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
      <div
        className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/80 p-4 md:p-8 rounded-3xl shadow-2xl max-w-3xl w-full md:w-[95vw] flex flex-col items-center border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={cert.src}
          alt={cert.name}
          width="1000"
          height="800"
          loading="eager"
          className="w-full h-auto max-h-[60vh] md:max-h-[70vh] rounded-2xl shadow-xl object-contain bg-white"
        />
        <div className="mt-4 md:mt-8 text-center">
          <p className="text-xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
            {cert.name}
          </p>
          <p className="text-sm md:text-lg text-white/80 font-medium">
            {cert.issuer}
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCert, setModalCert] = useState<CertificateType | null>(null);

  useEffect(() => {
    // Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
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

  return (
    <ClickSpark
      sparkColor="#fff"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <Helmet>
        {/* Standard Metadata */}
        <title>Voutla Jayendra | Full Stack Developer & AI Engineer</title>
        <meta name="description" content="Portfolio of Voutla Jayendra. Expert in MERN Stack, Python, and AI/ML solutions. View my projects and resume." />
        <link rel="canonical" href="https://voutla-jayendra.vercel.app/" />

        {/* Open Graph / Facebook / WhatsApp */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://voutla-jayendra.vercel.app/" />
        <meta property="og:title" content="Voutla Jayendra - Full Stack Dev" />
        <meta property="og:description" content="Check out my projects in AI and Web Development." />
        <meta property="og:image" content="https://voutla-jayendra.vercel.app/og-image.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://voutla-jayendra.vercel.app/" />
        <meta name="twitter:title" content="Voutla Jayendra - Full Stack Dev" />
        <meta name="twitter:description" content="Check out my projects in AI and Web Development." />
        <meta name="twitter:image" content="https://voutla-jayendra.vercel.app/og-image.png" />
      </Helmet>

      <div className="relative min-h-screen text-white font-inter">
        {/* Background Layer */}
        <div className="matrix-bg">
          <div className="matrix-overlay"></div>
        </div>

        <Header />

        <main>
          <Hero />

          <Suspense fallback={<SectionLoader height="h-[757px] md:h-[754px]" />}>
            <About />
          </Suspense>

          <Suspense fallback={<SectionLoader height="h-[1648px] md:h-[1351px]" />}>
            <Experience />
          </Suspense>

          <Suspense fallback={<SectionLoader height="h-[799px] !pb-0 md:h-[877px]" />}>
            <Projects />
          </Suspense>

          <Suspense fallback={<SectionLoader height="h-[720px] md:h-[844px]" />}>
            <Skills />
          </Suspense>

          <Suspense fallback={<SectionLoader height="h-[720px] md:h-[672px]" />}>
            <Education />
          </Suspense>

          <Suspense fallback={<SectionLoader height="h-[664px] md:h-[512px]" />}>
            <Certificates onCertClick={handleCertClick} />
          </Suspense>
        </main>

        <QuoteCard />

        <div className="relative z-50">
          <Suspense fallback={<div className="h-20 bg-transparent" />}>
            <Footer />
          </Suspense>
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