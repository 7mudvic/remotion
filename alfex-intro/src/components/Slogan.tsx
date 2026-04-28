import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CAIRO_FAMILY } from "../fonts";

export const Slogan: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const enterStart = fps * 3.2;
  const progress = interpolate(frame, [enterStart, enterStart + fps * 0.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const opacity = progress;
  const translateY = interpolate(progress, [0, 1], [30, 0]);

  const lineProgress = interpolate(
    frame,
    [enterStart + fps * 0.2, enterStart + fps * 1.2],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.65, 0, 0.35, 1),
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
        dir="rtl"
        style={{
          transform: `translateY(${100 + translateY}px)`,
          opacity,
          fontFamily: CAIRO_FAMILY,
          fontWeight: 500,
          fontSize: 56,
          color: "#FFFFFF",
          letterSpacing: "1px",
          textAlign: "center",
        }}
      >
        ذكاء الأسواق بين يديك
      </div>
      <div
        style={{
          transform: `translateY(${130 + translateY}px)`,
          marginTop: 24,
          width: 240 * lineProgress,
          height: 2,
          background:
            "linear-gradient(90deg, transparent 0%, #00FF88 50%, transparent 100%)",
          opacity,
        }}
      />
    </div>
  );
};
