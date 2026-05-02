import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "../components/Background";
import { Logo } from "../components/Logo";
import { COLORS } from "../theme";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);
  const logoScale = interpolate(logoSpring, [0, 1], [0.7, 1]);

  const messageOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateRight: "clamp",
  });
  const messageY = interpolate(frame, [20, 40], [30, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        fontFamily: "Cairo, sans-serif",
      }}
    >
      <Background />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 50,
        }}
      >
        <div
          style={{
            opacity: logoOpacity,
            transform: `scale(${logoScale})`,
          }}
        >
          <Logo size={360} />
        </div>
        <div
          style={{
            opacity: messageOpacity,
            transform: `translateY(${messageY}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 64,
              color: COLORS.white,
              fontWeight: 600,
              marginBottom: 14,
            }}
          >
            بانتظار زيارتكم
          </div>
          <div
            style={{
              fontSize: 36,
              color: COLORS.yellow,
              fontWeight: 500,
              letterSpacing: 3,
            }}
          >
            عَريكة البَلَدَة
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
