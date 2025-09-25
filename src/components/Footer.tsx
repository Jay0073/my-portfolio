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

const Footer: React.FC = () => {
  const socialIcons = [
    { icon: Github, href: "https://github.com/Jay0073", label: "Open GitHub" },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/voutla-jayendra",
      label: "Open LinkedIn",
    },
    { icon: Mail, href: "mailto:voutlajay8765@gmail.com", label: "Send Email" },
    { icon: Twitter, href: "https://twitter.com/[username]", label: "Twitter" },
    {
      icon: Instagram,
      href: "https://instagram.com/[username]",
      label: "Instagram",
    },
  ];

  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetch("/api/like")
      .then((res) => res.json())
      .then((data) => setLikes(data.count))
      .catch(console.error);
  }, []);

  const handleLike = async () => {
    if (liked) return;
    setLiked(true);

    try {
      const res = await fetch("/api/like", { method: "POST" });
      const data = await res.json();
      setLikes(data.count);
    } catch (err) {
      console.error(err);
    }
  };

  // heading animation
  const words = ["Connect.", "Collaborate.", "Code.", "Build.", "Grow Together."];
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

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
    <footer className="bg-[rgb(26,26,26)] pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-28 justify-between">
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
              <p className="text-[10px] pt-[1px]">I reply faster than your Wi-Fi reconnects ;)</p>
            </div>
          </div>

          {/* Quote + Like */}
          <div className="flex flex-col items-start">
            <p className="text-white font-poppins text-4xl italic leading-relaxed">
              “Behind every great UI is a sleepless night and a stubborn
              developer.”
            {/* <span className="text-[12px] ml-5">(If this made you smile, tap that like ❤️)</span> */}
            </p>
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={handleLike}
                aria-label="Like portfolio"
                className={`transition-transform duration-200 ${
                  liked ? "scale-110" : "hover:scale-110"
                }`}
              >
                <Heart
                  size={24}
                  className={
                    liked ? "text-red-500 fill-red-500" : "text-gray-400"
                  }
                />
              </button>
              <span className="text-[#BBBBBB] font-inter text-base">
                {likes} {likes === 1 ? "Like" : "Likes"}
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-white/10 w-full text-center">
          <p className="text-[#999] font-inter text-sm">
            © 2025 Voutla Jayendra · Designed to impress 👀 Debugged to
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
