import React, { useEffect, useState } from "react";
import Button from "../common/Button";
import "./commonCss.css";
import AnimatedContent from "../items/AnimatedContent";

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [showIndicator, setShowIndicator] = useState(true);

  const phrases = [
    "Full-Stack Developer & AI Innovator.",
    "From Code to Experience, End-to-End.",
    "Engineering Complex Ideas into Scalable Solutions."
  ];

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      setParallax({ x: dx * 10, y: dy * 10 });
    };
    const onScroll = () => setShowIndicator(window.scrollY < 40);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq.matches) window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY < 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const currentPhraseText = phrases[currentPhrase];
    let index = 0;

    const typeInterval = setInterval(() => {
      if (index < currentPhraseText.length) {
        setDisplayText(currentPhraseText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setIsTyping(false);
          setTimeout(() => {
            setCurrentPhrase((prev) => (prev + 1) % phrases.length);
            setDisplayText("");
            setIsTyping(true);
          }, 1000);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [currentPhrase]);

  const handleExploreClick = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center text-center px-8 relative">
      <div className="max-w-4xl mx-auto mb-32">
        <AnimatedContent
          distance={200}
          direction="vertical"
          reverse={false}
          duration={0.8}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity
          scale={1}
          threshold={0.1}
        >
          <h1
            className={`mytitle-cursor text-5xl md:text-7xl font-poppins font-bold text-white mb-4 transition-all duration-100 animate-fade-in ${isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
              }`}
            style={{
              transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
            }}
          >
            Hi!&nbsp; I'm Voutla Jayendra
          </h1>

          <div className="text-[#BBBBBB] mb-8 text-xl font-semibold">
            <span className="typing-text mytitle-cursor">{displayText}</span>
            <span className={`cursor ${isTyping ? "blink" : ""}`}>|</span>
          </div>

          <div
            className={`transition-all duration-800 delay-400 ${isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
              }`}
          >
            <Button
              text="Explore My Work"
              onClick={handleExploreClick}
              style="secondary"
            />
          </div>
        </AnimatedContent>
      </div>

      <div className="down-indicator" onClick={handleExploreClick}>
        <div className="down-arrow"></div>
      </div>

      {/* Scroll Indicator */}
      {/* <div
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-500 ${
          showScrollIndicator ? "opacity-100" : "opacity-0"
        }`}
      >
        <ChevronDown
          size={32}
          className="text-[#BBBBBB] animate-bounce cursor-pointer hover:text-white transition-colors"
          onClick={handleExploreClick}
        />
      </div> */}
    </section>
  );
};

export default Hero;
