import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import type { DotLottieReactProps } from "@lottiefiles/dotlottie-react";

const DotLottieReact = lazy(() =>
  import("@lottiefiles/dotlottie-react").then(({ DotLottieReact }) => ({
    default: DotLottieReact,
  })),
);

type DotLottieInstance = Exclude<
  Parameters<NonNullable<DotLottieReactProps["dotLottieRefCallback"]>>[0],
  null
>;

interface LottiePlayerProps {
  src: string;
  label?: string;
  className?: string;
  loop?: boolean;
}

export function LottiePlayer({
  src,
  label,
  className = "",
  loop = true,
}: LottiePlayerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<DotLottieInstance | null>(null);
  const visibleRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const [failed, setFailed] = useState(false);

  const handleFailure = useCallback(() => {
    playerRef.current?.pause();
    setFailed(true);
  }, []);

  const updatePlayback = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    if (reducedMotionRef.current) {
      player.pause();
      player.setFrame(0);
    } else if (visibleRef.current) {
      player.play();
    } else {
      player.pause();
    }
  }, []);

  const handlePlayerRef = useCallback(
    (player: DotLottieInstance | null) => {
      const previousPlayer = playerRef.current;
      if (previousPlayer) {
        previousPlayer.removeEventListener("load", updatePlayback);
        previousPlayer.removeEventListener("loadError", handleFailure);
        previousPlayer.removeEventListener("renderError", handleFailure);
      }

      playerRef.current = player;
      if (!player) return;

      player.addEventListener("load", updatePlayback);
      player.addEventListener("loadError", handleFailure);
      player.addEventListener("renderError", handleFailure);
      updatePlayback();
    },
    [handleFailure, updatePlayback],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionPreference = () => {
      reducedMotionRef.current = mediaQuery.matches;
      updatePlayback();
    };

    handleMotionPreference();
    mediaQuery.addEventListener("change", handleMotionPreference);
    return () => mediaQuery.removeEventListener("change", handleMotionPreference);
  }, [updatePlayback]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !("IntersectionObserver" in window)) {
      visibleRef.current = true;
      updatePlayback();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        updatePlayback();
      },
      { threshold: 0.08 },
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [updatePlayback]);

  useEffect(
    () => () => {
      const player = playerRef.current;
      if (!player) return;
      player.removeEventListener("load", updatePlayback);
      player.removeEventListener("loadError", handleFailure);
      player.removeEventListener("renderError", handleFailure);
    },
    [handleFailure, updatePlayback],
  );

  const accessibilityProps = label
    ? { role: "img", "aria-label": label }
    : { "aria-hidden": true as const };

  return (
    <div
      ref={wrapperRef}
      className={`lottie-player ${className}`.trim()}
      data-failed={failed ? "true" : undefined}
      style={{ aspectRatio: "1 / 1", width: "100%" }}
      {...accessibilityProps}
    >
      <Suspense fallback={null}>
        <DotLottieReact
          src={src}
          loop={loop}
          autoplay={false}
          dotLottieRefCallback={handlePlayerRef}
          onError={handleFailure}
          style={{ display: failed ? "none" : "block", height: "100%", width: "100%" }}
        />
      </Suspense>
    </div>
  );
}
