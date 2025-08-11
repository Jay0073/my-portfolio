import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Twitter, Instagram } from 'lucide-react';
import IconList from './common/IconList';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const socialIcons = [
    { icon: Github, href: 'https://github.com/[username]', label: 'Open GitHub profile' },
    { icon: Linkedin, href: 'https://linkedin.com/in/[username]', label: 'Open LinkedIn profile' },
    { icon: Mail, href: 'mailto:your.email@example.com', label: 'Send email' },
    { icon: Twitter, href: 'https://twitter.com/[username]', label: 'Open Twitter profile' },
    { icon: Instagram, href: 'https://instagram.com/[username]', label: 'Open Instagram profile' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#1A1A1A]' : 'bg-transparent'
      }`}
    >
      <div className="flex justify-end items-center h-16 px-8">
        <IconList icons={socialIcons} />
      </div>
    </header>
  );
};

export default Header;