import React, { useEffect, useState } from 'react';
import Button from '../common/Button';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    
    const handleScroll = () => {
      setShowScrollIndicator(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleExploreClick = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center text-center px-8 relative">
      <div className="max-w-4xl mx-auto">
        <h1 
          className={`font-poppins font-bold text-4xl md:text-6xl text-white mb-6 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Voutla Jayendra
        </h1>
        
        <p 
          className={`font-inter text-xl md:text-2xl text-[#BBBBBB] mb-8 transition-all duration-800 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          MERN Stack Developer | Machine Learning Enthusiast
        </p>
        
        <div 
          className={`transition-all duration-800 delay-400 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Button
            text="Explore My Work"
            onClick={handleExploreClick}
            style="secondary"
          />
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-500 ${
          showScrollIndicator ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <ChevronDown 
          size={32} 
          className="text-[#BBBBBB] animate-bounce cursor-pointer hover:text-white transition-colors"
          onClick={handleExploreClick}
        />
      </div>
    </section>
  );
};

export default Hero;