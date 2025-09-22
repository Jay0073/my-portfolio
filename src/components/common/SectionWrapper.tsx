import React, { useEffect, useRef, useState } from 'react';

interface SectionWrapperProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headingClass?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  title,
  subtitle,
  children,
  className = '',
  headingClass = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        } else if (!entry.isIntersecting && hasAnimated) {
          // Reset animation when section is out of view
          setIsVisible(false);
          setHasAnimated(false);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`py-16 md:py-24 px-8 ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        {(title || subtitle) && (
          <div
            className={`text-center mb-16 ${headingClass} ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            {title && (
              <div className="relative inline-block">
                <h2 className="font-poppins font-bold text-3xl md:text-4xl text-white mb-3">
                  {title}
                </h2>
                <div 
                  className={`rounded mx-auto h-2 bg-white transition-all duration-500 ease-out ${
                    isVisible ? 'w-[80%]' : 'w-0'
                  }`}
                  style={{
                    transitionDelay: isVisible ? '0.3s' : '0s'
                  }}
                />
              </div>
            )}

          </div>
        )}
        <div className={isVisible ? 'animate-fade-in-up' : 'opacity-0'}>
          {children}
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper;