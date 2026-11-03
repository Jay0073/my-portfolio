import React, { useEffect, useState } from "react";
import { DotLottieReact, type DotLottie } from "@lottiefiles/dotlottie-react";
import useMediaQuery from "../items/useMediaQuery";

const layout = { fit: "contain" as const, align: [0.5, 0.5] as [number, number] };

const AboutAnimation: React.FC<{ src: string }> = ({ src }) => {
  const [player, setPlayer] = useState<DotLottie | null>(null);
  const [status, setStatus] = useState("loading");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (!player) return;
    const loaded = () => setStatus("loaded");
    const failed = () => setStatus("error");
    if (player.isLoaded) loaded();
    player.addEventListener("load", loaded);
    player.addEventListener("loadError", failed);
    player.addEventListener("renderError", failed);
    return () => {
      player.removeEventListener("load", loaded);
      player.removeEventListener("loadError", failed);
      player.removeEventListener("renderError", failed);
    };
  }, [player]);

  useEffect(() => {
    if (!player || status !== "loaded") return;
    if (reducedMotion) player.pause();
    else player.play();
  }, [player, reducedMotion, status]);

  return (
    <div className="w-full max-w-[560px] aspect-square mx-auto self-center relative" data-fit="about-animation" data-load-state={status} role="img" aria-label="Developer illustration">
      <DotLottieReact src={src} loop autoplay={!reducedMotion} layout={layout} dotLottieRefCallback={setPlayer} style={{ width: "100%", height: "100%" }} />
      {status === "error" && <p className="absolute inset-0 flex items-center justify-center text-sm text-[#999]">Illustration unavailable</p>}
    </div>
  );
};

export default AboutAnimation;
