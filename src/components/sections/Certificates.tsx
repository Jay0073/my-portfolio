import React, { useRef } from "react";
import SectionWrapper from "../common/SectionWrapper";
import cybersecurity from "../assets/cisco-cybersecurity.jpg";
import ethicalHack from "../assets/cisco-ethicalHack.jpg";
import iirs from "../assets/iirs.jpg";
import jetking from "../assets/jetking-python.jpg";
import diffusion from "../assets/nvidia-diffusion.png";
import dp from "../assets/nvidia-dp.png";
import transformer from "../assets/nvidia-transformer.png";

export type CertificateType = {
  src: string;
  name: string;
  issuer: string;
  year?: string;
};

const certificates: CertificateType[] = [
  {
    src: dp,
    name: "Getting Started with Deep Learning",
    issuer: "NVIDIA",
    year: "2024",
  },
  {
    src: cybersecurity,
    name: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    year: "2024",
  },
  {
    src: ethicalHack,
    name: "Ethical Hacker",
    issuer: "Cisco Networking Academy",
    year: "2025",
  },
  {
    src: iirs,
    name: "Geo-Data Sharing and Cyber Security",
    issuer: "IIRS",
    year: "2025",
  },
  {
    src: jetking,
    name: "Python Workshop",
    issuer: "Jetking ECIL",
    year: "2023",
  },
  {
    src: diffusion,
    name: "Generative AI with Diffusion Models",
    issuer: "NVIDIA",
    year: "2025",
  },
  {
    src: transformer,
    name: "Introduction to Transformer-Based Natural Language Processing",
    issuer: "NVIDIA",
    year: "2024",
  },
];

// --- Reusable Card Component (Original Design) ---
const CertCard = ({
  cert,
  onClick,
  isDragging = false,
  wasDragged = false,
}: {
  cert: CertificateType;
  onClick: (c: CertificateType) => void;
  isDragging?: boolean;
  wasDragged?: boolean;
}) => (
  <div
    onClick={(e) => {
      if (!isDragging && !wasDragged) onClick(cert);
    }}
    id="certificate-card"
    className="flex-shrink-0 w-[300px] h-[200px] sm:w-[380px] sm:h-[220px] 
               rounded-2xl shadow-xl hover:shadow-2xl transition-transform duration-300 
               relative overflow-hidden cursor-pointer group"
    // Prevent dragging images/text
    style={{ userSelect: isDragging ? "none" : undefined }}
  >
    <img
      src={cert.src}
      alt={cert.name}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
      draggable={false}
    />
    <div className="absolute inset-0 bg-black/30"></div>
    <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-md bg-black/30 z-10">
      <div className="text-white text-lg font-semibold mb-1 truncate select-none pointer-events-none">
        {cert.name}
      </div>
      <div className="text-gray-300 text-sm select-none pointer-events-none">
        {cert.issuer}
      </div>
      {cert.year && (
        <div className="text-gray-400 mt-2 text-xs select-none pointer-events-none">
          {cert.year}
        </div>
      )}
    </div>
  </div>
);

interface CertificatesProps {
  onCertClick: (cert: CertificateType) => void;
}

// Helper to repeat certificates so the row is always filled
function getInfiniteCertificates(
  certificates: CertificateType[],
  minCards: number
) {
  const arr = [];
  while (arr.length < minCards) {
    arr.push(...certificates);
  }
  return arr.slice(0, minCards);
}

// Drag-to-scroll hook
function useDragScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [dragging, setDragging] = React.useState(false);
  const [wasDragged, setWasDragged] = React.useState(false);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let moved = false;

    const onMouseDown = (e: MouseEvent | TouchEvent) => {
      isDragging.current = true;
      setDragging(true);
      setWasDragged(false);
      moved = false;
      startX.current =
        "touches" in e ? e.touches[0].pageX : (e as MouseEvent).pageX;
      scrollLeft.current = container.scrollLeft;
      container.classList.add("dragging");
      // Prevent text/image selection
      document.body.style.userSelect = "none";
    };

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      const x = "touches" in e ? e.touches[0].pageX : (e as MouseEvent).pageX;
      const walk = startX.current - x;
      if (Math.abs(walk) > 5) {
        moved = true;
        setWasDragged(true);
      }
      container.scrollLeft = scrollLeft.current + walk;
    };

    const onMouseUp = () => {
      isDragging.current = false;
      setDragging(false);
      setTimeout(() => setWasDragged(false), 100); // Reset after click event
      container.classList.remove("dragging");
      document.body.style.userSelect = "";
    };

    container.addEventListener("mousedown", onMouseDown as any);
    container.addEventListener("touchstart", onMouseDown as any, {
      passive: false,
    });
    window.addEventListener("mousemove", onMouseMove as any);
    window.addEventListener("touchmove", onMouseMove as any, {
      passive: false,
    });
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchend", onMouseUp);

    return () => {
      container.removeEventListener("mousedown", onMouseDown as any);
      container.removeEventListener("touchstart", onMouseDown as any);
      window.removeEventListener("mousemove", onMouseMove as any);
      window.removeEventListener("touchmove", onMouseMove as any);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchend", onMouseUp);
      document.body.style.userSelect = "";
    };
  }, []);

  return [containerRef, dragging, wasDragged] as const;
}

const Certificates: React.FC<CertificatesProps> = ({ onCertClick }) => {
  // Estimate how many cards to fill the row (for infinite effect)
  const minCardsDesktop = 16;
  const minCardsMobile = 16;

  // Drag scroll refs
  const [desktopRowRef, desktopDragging, desktopWasDragged] = useDragScroll();
  const [mobileRow1Ref, mobileDragging1, mobileWasDragged1] = useDragScroll();
  const [mobileRow2Ref, mobileDragging2, mobileWasDragged2] = useDragScroll();

  // Infinite certificate arrays
  const infiniteDesktop = getInfiniteCertificates(
    certificates,
    minCardsDesktop
  );
  const infiniteMobile = getInfiniteCertificates(certificates, minCardsMobile);

  return (
    <SectionWrapper
      id="certificates"
      title="Certificates"
      subtitle="My Achievements & Credentials"
      className="px-0"
      headingClass="mb-6"
    >
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scroll-reverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
          .animate-scroll-reverse {
            animation: scroll-reverse 30s linear infinite;
          }
          .animate-scroll:hover,
          .animate-scroll-reverse:hover {
            animation-play-state: paused;
          }
          .dragging .animate-scroll,
          .dragging .animate-scroll-reverse {
            animation-play-state: paused !important;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .dragging {
            user-select: none !important;
          }
        `}
      </style>

      {/* Desktop */}
      <div className="hidden md:flex flex-col items-center">
        <div
          ref={desktopRowRef}
          className="flex w-full overflow-x-auto overflow-hidden no-scrollbar cursor-grab [mask-image:_linear-gradient(to_right,transparent_0,_black_68px,_black_calc(100%-68px),transparent_100%)]"
        >
          <div className="flex gap-8 py-10 animate-scroll min-w-max">
            {infiniteDesktop.map((cert, idx) => (
              <CertCard
                key={idx}
                cert={cert}
                onClick={onCertClick}
                isDragging={desktopDragging}
                wasDragged={desktopWasDragged}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden flex-col gap-6 w-full px-2">
        <div
          ref={mobileRow1Ref}
          className="w-full overflow-x-auto overflow-hidden no-scrollbar cursor-grab [mask-image:_linear-gradient(to_right,transparent_0,_black_32px,_black_calc(100%-32px),transparent_100%)]"
        >
          <div className="flex gap-4 py-2 animate-scroll min-w-max">
            {infiniteMobile.map((cert, idx) => (
              <div
                key={`m1-${idx}`}
                className="snap-center pl-2 first:pl-4 last:pr-4"
              >
                <CertCard
                  cert={cert}
                  onClick={onCertClick}
                  isDragging={mobileDragging1}
                  wasDragged={mobileWasDragged1}
                />
              </div>
            ))}
          </div>
        </div>
        <div
          ref={mobileRow2Ref}
          className="w-full overflow-x-auto overflow-hidden no-scrollbar cursor-grab [mask-image:_linear-gradient(to_right,transparent_0,_black_32px,_black_calc(100%-32px),transparent_100%)]"
        >
          <div className="flex gap-4 py-2 animate-scroll-reverse min-w-max">
            {infiniteMobile.map((cert, idx) => (
              <div
                key={`m2-${idx}`}
                className="snap-center pl-2 first:pl-4 last:pr-4"
              >
                <CertCard
                  cert={cert}
                  onClick={onCertClick}
                  isDragging={mobileDragging2}
                  wasDragged={mobileWasDragged2}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export { certificates };
export default Certificates;
