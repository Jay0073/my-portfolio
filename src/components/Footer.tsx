import React from 'react';
import { Github, Linkedin, Mail, Twitter, Instagram } from 'lucide-react';
import IconList from './common/IconList';

const Footer: React.FC = () => {
  const socialIcons = [
    { icon: Github, href: 'https://github.com/Jay0073', label: 'Open GitHub profile' },
    { icon: Linkedin, href: 'https://linkedin.com/in/voutla-jayendra', label: 'Open LinkedIn profile' },
    { icon: Mail, href: 'mailto:voutlajay8765@gmail.com', label: 'Send email' },
    { icon: Twitter, href: 'https://twitter.com/[username]', label: 'Open Twitter profile' },
    { icon: Instagram, href: 'https://instagram.com/[username]', label: 'Open Instagram profile' },
  ];

  return (
    <footer className="bg-[#1A1A1A] py-8">
      <div className="max-w-7xl mx-auto px-8 text-center">
        <IconList icons={socialIcons} className="justify-center mb-4" />
        <p className="text-[#BBBBBB] font-inter">
          © 2025 Voutla Jayendra · Built with Passion
        </p>
      </div>
    </footer>
  );
};

export default Footer;