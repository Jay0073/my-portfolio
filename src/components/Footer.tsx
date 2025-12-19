import React, { useState, useEffect } from "react";
import {
  Github,
  Linkedin,
  Mail,
  Twitter,
  Instagram,
  Heart,
} from "lucide-react";
import IconList from "./common/IconList";
import Button from "./common/Button";
import CountUp from "./items/CountUp";
import useMediaQuery from "./items/useMediaQuery";

// Configuration for Storage
const STORAGE_KEY = "portfolio_like_status";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Social Icons Data
const socialIcons = [
  {
    icon: Github,
    href: "https://github.com/Jay0073",
    label: "My code vault",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/in/voutla-jayendra",
    label: "Let's get Professional",
  },
  {
    icon: Mail,
    href: "mailto:voutlajay8765@gmail.com",
    label: "Inbox open 24/7",
  },
  {
    icon: Twitter,
    href: "https://twitter.com/",
    label: "Memes and more",
  },
  {
    icon: Instagram,
    href: "https://instagram.com/__nameisjay_",
    label: "Nothing to look here!",
  },
];

const Footer: React.FC = () => {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetch("/api/like")
      .then((res) => res.json())
      .then((data) => setLikes(data.count))
      .catch(console.error);

    const checkLikeStatus = () => {
      const savedData = localStorage.getItem(STORAGE_KEY);
      
      if (savedData) {
        try {
          const { timestamp } = JSON.parse(savedData);
          const now = Date.now();

          if (now - timestamp < ONE_WEEK_MS) {
            setLiked(true);
          } else {
            localStorage.removeItem(STORAGE_KEY);
            setLiked(false);
          }
        } catch (e) {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    };

    checkLikeStatus();
  }, []);

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        liked: true,
        timestamp: Date.now(),
      })
    );

    try {
      const res = await fetch("/api/like", { method: "POST" });
      const data = await res.json();
      setLikes(data.count);
    } catch (err) {
      console.error("Failed to post like:", err);
    }
  };

  const words = [
    "Connect.",
    "Collaborate.",
    "Code.",
    "Build.",
    "Grow Together.",
  ];
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const quotefontsize = useMediaQuery("(min-width: 768px)") ? "text-4xl" : "text-2xl";

  useEffect(() => {
    const currentWord = words[index];
    let typingSpeed = isDeleting ? 80 : 150;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        if (displayText.length + 1 === currentWord.length) {
          setTimeout(() => setIsDeleting(true), 1200);
        }
      } else {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, index, words]);

  return (
    <footer className="bg-[rgb(26,26,26)] pt-12 pb-3 md:pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6 md:gap-28 justify-between">
          {/* Contact */}
          <div>
            <h2 className="text-white font-poppins text-3xl font-semibold mb-4">
              Let’s{" "}
              <span
                style={{ filter: "drop-shadow(rgb(97, 218, 251) 0px 0px 6px)" }}
                className="text-white-400"
              >
                {displayText}
              </span>
              <span className={`cursor`}>|</span>
            </h2>
            <p className="text-[#BBBBBB] font-inter mb-4 text-base leading-relaxed">
              Whether it’s code, coffee, or conversation - I’m just one click
              away.
            </p>

            <IconList icons={socialIcons} className="justify-start gap-6" />

            <div className="mt-4">
              <Button
                text="Say Hello"
                onClick={() =>
                  (window.location.href = "mailto:voutlajay8765@gmail.com")
                }
                style="primary"
                className="px-7 pt-3 text-base"
              />
              <p className="text-[10px] pt-[1px]">
                I reply faster than your Wi-Fi reconnects ;)
              </p>
            </div>
          </div>

          {/* Quote + Like */}
          <div className="flex flex-col items-start">
            <p className={`text-white font-poppins ${quotefontsize} italic leading-relaxed`}>
              “Behind every great UI is a sleepless night and a stubborn
              developer.”
            </p>
            <div className="flex items-center gap-2 mt-4 ml-1">
              <button
                onClick={handleLike}
                aria-label="Like portfolio"
                disabled={liked}
                className={`transition-all duration-200 ${
                  liked ? "scale-110 cursor-default" : "hover:scale-110 cursor-pointer"
                }`}
              >
                <Heart
                  size={24}
                  className={
                    liked
                      ? "text-red-500 fill-red-500" // Filled red if liked
                      : "text-gray-400 hover:text-red-400"
                  }
                />
              </button>
              <span className="text-[#BBBBBB] font-inter text-base">
                <CountUp
                  from={0}
                  to={likes}
                  separator=","
                  direction="up"
                  duration={2}
                  delay={1}
                  className="count-up-text"
                />{" "}
                {likes === 1 ? "Like" : "Likes"}
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-4 pt-2 md:mt-10 md:pt-6 border-t border-white/10 w-full text-center">
          <p className="text-[#999] font-inter text-[9px] md:text-sm">
            © 2025 Voutla Jayendra <br className="md:hidden"/>· Designed to impress 👀 Debugged to
            perfection ✨
          </p>
        </div>
      </div>

      <style>{`
        .blinking-cursor {
          display: inline-block;
          margin-left: 2px;
          width: 2px;
          background: #fff;
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;