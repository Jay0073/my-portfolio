import React from 'react';
import IconList from './common/IconList';
import { useContent } from '../lib/contentContext';
import { getIconComponent } from '../lib/iconMap';

const Header: React.FC = () => {
  const { content } = useContent();

  const socialIcons = content.header.socialLinks.map((link) => ({
    icon: getIconComponent(link.icon),
    href: link.href,
    label: link.label,
  }));

  return (
    <header
      className="transition-all duration-300 bg-transparent relative z-2"
    >
      <div className="flex justify-center md:justify-end items-center h-16 px-4 md:px-8">
        <IconList icons={socialIcons} />
      </div>
    </header>
  );
};

export default Header;
