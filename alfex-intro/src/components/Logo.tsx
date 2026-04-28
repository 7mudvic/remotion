import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { INTER_FAMILY } from "../fonts";

export const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const enterStart = fps * 2.7;
  const progress = interpolate(frame, [enterStart, enterStart + fps * 0.9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const opacity = progress;
  const scale = interpolate(progress, [0, 1], [0.85, 1]);
  const letterSpacingProgress = interpolate(progress, [0, 1], [40, 12]);

  const glowPulse = 1 + 0.08 * Math.sin((frame - enterStart) * 0.12);
  const glowOpacity = interpolate(
    frame,
    [enterStart, enterStart + fps * 0.6, fps * 5],
    [0, 1, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          transform: `translateY(-60px) scale(${scale})`,
          opacity,
          fontFamily: INTER_FAMILY,
          fontWeight: 700,
          fontSize: 180,
          color: "#FFFFFF",
          letterSpacing: `${letterSpacingProgress}px`,
          textShadow: `0 0 ${40 * glowPulse}px rgba(0, 255, 136, ${0.5 * glowOpacity}), 0 0 ${80 * glowPulse}px rgba(0, 255, 136, ${0.3 * glowOpacity})`,
        }}
      >
        Alfex
      </div>
    </div>
  );
};
