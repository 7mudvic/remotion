import { Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CAIRO_FAMILY, INTER_FAMILY } from "../fonts";

export const BrandClose: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const introOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  const atomProgress = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const wordmarkProgress = interpolate(frame, [fps * 0.35, fps * 1.0], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const sloganProgress = interpolate(frame, [fps * 0.85, fps * 1.6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const lineProgress = interpolate(frame, [fps * 1.2, fps * 2.0], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

  const finalFade = interpolate(frame, [fps * 2.4, fps * 2.7], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  const float = Math.sin((frame / fps) * 1.2) * 6;

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
        opacity: introOpacity * finalFade,
      }}
    >
      <div
        style={{
          width: 440,
          height: 440,
          opacity: atomProgress,
          transform: `scale(${0.7 + atomProgress * 0.3}) translateY(${float}px)`,
          filter: "drop-shadow(0 0 50px rgba(0, 200, 255, 0.35))",
          maskImage:
            "radial-gradient(circle at center, black 35%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, black 35%, transparent 70%)",
        }}
      >
        <Img
          src={staticFile("screens/atom-crop.png")}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      <div
        style={{
          marginTop: 8,
          fontFamily: INTER_FAMILY,
          fontSize: 130,
          fontWeight: 600,
          color: "#FFFFFF",
          letterSpacing: "16px",
          opacity: wordmarkProgress,
          transform: `translateY(${(1 - wordmarkProgress) * 20}px)`,
        }}
      >
        Alfex
      </div>

      <div
        style={{
          marginTop: 30,
          width: 220 * lineProgress,
          height: 2,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0, 200, 255, 0.8) 50%, transparent 100%)",
          opacity: lineProgress,
        }}
      />

      <div
        dir="rtl"
        style={{
          marginTop: 40,
          fontFamily: CAIRO_FAMILY,
          fontWeight: 500,
          fontSize: 56,
          color: "rgba(255, 255, 255, 0.9)",
          letterSpacing: "1px",
          opacity: sloganProgress,
          transform: `translateY(${(1 - sloganProgress) * 16}px)`,
        }}
      >
        ذكاء الأسواق بين يديك
      </div>
    </div>
  );
};
