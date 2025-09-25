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
    { icon: Github, href: 'https://github.com/Jay0073', label: 'My code vault' },
    { icon: Linkedin, href: 'https://linkedin.com/in/voutla-jayendra', label: "Let's get Professional" },
    { icon: Mail, href: 'mailto:voutlajay8765@gmail.com', label: 'Inbox open 24/7' },
    { icon: Twitter, href: 'https://twitter.com/[username]', label: 'Memes and more' },
    { icon: Instagram, href: 'https://instagram.com/__nameisjay_', label: 'Nothing to look here!' },
  ];

  return (
    <header
      className="transition-all duration-300 bg-transparent"
    >
      <div className="flex justify-end items-center h-16 px-8">
        <IconList icons={socialIcons} />
      </div>
    </header>
  );
};

export default Header;