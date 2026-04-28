import { Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { INTER_FAMILY } from "../fonts";

export const BrandOpen: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const atomScale = interpolate(frame, [0, fps * 1.0], [0.4, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const atomOpacity = interpolate(frame, [0, fps * 0.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  const float = Math.sin((frame / fps) * 1.2) * 8;

  const wordmarkProgress = interpolate(frame, [fps * 0.6, fps * 1.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const wordmarkLetterSpacing = interpolate(wordmarkProgress, [0, 1], [40, 16]);

  const outroOpacity = interpolate(frame, [fps * 2.2, fps * 2.5], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: outroOpacity,
      }}
    >
      <div
        style={{
          width: 560,
          height: 560,
          opacity: atomOpacity,
          transform: `scale(${atomScale}) translateY(${float}px)`,
          marginBottom: 16,
          filter: "drop-shadow(0 0 60px rgba(0, 200, 255, 0.4))",
          maskImage:
            "radial-gradient(circle at center, black 35%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 35%, transparent 70%)",
        }}
      >
        <Img
          src={staticFile("screens/atom-crop.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>
      <div
        style={{
          fontFamily: INTER_FAMILY,
          fontSize: 130,
          fontWeight: 600,
          color: "#FFFFFF",
          letterSpacing: `${wordmarkLetterSpacing}px`,
          opacity: wordmarkProgress,
          transform: `translateY(${(1 - wordmarkProgress) * 24}px)`,
        }}
      >
        Alfex
      </div>
    </div>
  );
};
