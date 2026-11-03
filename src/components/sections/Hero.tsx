import React, { useEffect, useState } from "react";
import Button from "../common/Button";
import { useContent } from "../../lib/contentContext";
import "./commonCss.css";

const Hero: React.FC = () => {
  const { content } = useContent();
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const phrases = content.hero.phrases;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      setParallax({ x: dx * 10, y: dy * 10 });
    };
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq.matches) window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  useEffect(() => {
    const currentPhraseText = phrases[currentPhrase % phrases.length] ?? "";
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
  }, [currentPhrase, phrases]);

  const handleExploreClick = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-[100svh] flex items-center justify-center text-center px-4 md:px-8 relative z-10">
      <div className="max-w-4xl mx-auto mb-16 md:mb-32">

        {/* LCP ELEMENT: Using CSS Animation instead of JS/GSAP */}
        {/* This renders INSTANTLY with the animation */}
        <div className="animate-hero-entry">
          <h1
            className="mytitle-cursor text-4xl md:text-7xl font-poppins font-bold text-white mb-4"
            style={{
              // Keep the parallax effect, it's cheap
              transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0)`,
              willChange: "transform, opacity"
            }}
          >
            Hi!&nbsp; I'm <br className="md:hidden" /> {content.hero.name}
          </h1>
        </div>

        {/* Subtext can wait slightly, that's fine */}
        <div className="text-[#BBBBBB] mb-3 text-lg md:text-xl font-semibold min-h-[5rem] md:min-h-[3rem] flex items-start justify-center animate-hero-entry" style={{ animationDelay: "0.2s" }}>
          <span className="w-full">
            <span className="typing-text mytitle-cursor">{displayText}</span>
            <span className={`cursor ${isTyping ? "blink" : ""}`}>|</span>
          </span>
        </div>

        {/* Button appears last */}
        <div className="animate-hero-entry" style={{ animationDelay: "0.4s" }}>
          <Button
            text={content.hero.buttonText}
            onClick={handleExploreClick}
            style="secondary"
            aria-label={content.hero.buttonText}
          />
        </div>

      </div>

      <div className="down-indicator" onClick={handleExploreClick}>
        <div className="down-arrow"></div>
      </div>
    </section>
  );
};

export default Hero;