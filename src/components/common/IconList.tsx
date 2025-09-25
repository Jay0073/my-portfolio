import React from "react";
import { DivideIcon as LucideIcon } from "lucide-react";
import tippy, { animateFill } from "tippy.js";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

interface IconListProps {
  icons: {
    icon: LucideIcon;
    href: string;
    label: string;
  }[];
  className?: string;
}

const IconList: React.FC<IconListProps> = ({ icons, className = "" }) => {
  tippy("#tippy", {
    content: (reference) => reference.getAttribute("aria-label") || "",
    placement: "bottom",
    duration: 0,
    animateFill: true,
    plugins: [animateFill],
    arrow: false,
  });
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {icons.map((item, index) => (
        <a
          key={index}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-[#AAAAAA] transition-all duration-300 hover:scale-105 p-2"
          aria-label={item.label}
          id="tippy"
        >
          <item.icon size={24} />
        </a>
      ))}
    </div>
  );
};

export default IconList;
