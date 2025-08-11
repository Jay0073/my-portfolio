import React, { useEffect, useRef, useState } from 'react';

interface SectionWrapperProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  title,
  subtitle,
  children,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`py-16 md:py-24 px-8 ${className}`}
    >
      <div className="max-w-6xl mx-auto">
        {(title || subtitle) && (
          <div
            className={`text-center mb-16 ${
              isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            {title && (
              <h2 className="font-poppins font-bold text-3xl md:text-4xl text-white mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-[#BBBBBB] text-lg md:text-xl font-inter max-w-2xl mx-auto">
                {subtitle}
              </p>
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