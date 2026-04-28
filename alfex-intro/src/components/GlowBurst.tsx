import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const GlowBurst: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const burstStart = fps * 2.55;
  const burstEnd = fps * 3.4;

  const progress = interpolate(frame, [burstStart, burstEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const opacity = interpolate(progress, [0, 0.3, 1], [0, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const radius = interpolate(progress, [0, 1], [40, 900], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cx = 1080;
  const cy = 920;

  return (
    <svg
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    >
      <defs>
        <radialGradient id="burstGradient">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="30%" stopColor="#00FF88" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00FF88" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={radius} fill="url(#burstGradient)" opacity={opacity} />
    </svg>
  );
};
