import React, { useEffect, useRef } from "react";
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
  // 1. Create a ref to target the specific DOM element for this component
  const containerRef = useRef<HTMLDivElement>(null);

  // 2. Initialize Tippy inside useEffect
  useEffect(() => {
    if (!containerRef.current) return;

    // Select the anchor tags specifically within THIS component's container
    const targets = containerRef.current.querySelectorAll(".tippy-target");

    // Initialize tippy
    const instances = tippy(targets, {
      content: (reference) => reference.getAttribute("aria-label") || "",
      placement: "bottom",
      duration: 50,
      animateFill: true,
      plugins: [animateFill],
      arrow: false,
      touch: false,
    });

    // 3. CLEANUP: Destroy instances when component unmounts to prevent memory leaks
    return () => {
      // Tippy returns an array of instances, or a single instance. Normalize to array.
      const instancesArray = Array.isArray(instances) ? instances : [instances];
      instancesArray.forEach((instance) => instance.destroy());
    };
  }, [icons]); // Re-run only if the 'icons' prop changes

  return (
    <div 
      ref={containerRef} 
      className={`flex items-center gap-4 ${className}`}
    >
      {icons.map((item, index) => (
        <a
          key={index}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="tippy-target text-white md:hover:text-[#AAAAAA] transition-all duration-300 md:hover:scale-105 active:scale-95 p-2"
          aria-label={item.label}
        >
          <item.icon size={24} />
        </a>
      ))}
    </div>
  );
};

export default IconList;