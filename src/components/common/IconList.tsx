import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface IconListProps {
  icons: {
    icon: LucideIcon;
    href: string;
    label: string;
  }[];
  className?: string;
}

const IconList: React.FC<IconListProps> = ({ icons, className = '' }) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {icons.map((item, index) => (
        <a
          key={index}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-[#BBBBBB] transition-all duration-300 hover:scale-105 p-2 rounded-full hover:bg-white/10"
          aria-label={item.label}
        >
          <item.icon size={24} />
        </a>
      ))}
    </div>
  );
};

export default IconList;