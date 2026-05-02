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

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 90 },
  });

  const logoScale = interpolate(logoSpring, [0, 1], [0.4, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  const taglineOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateRight: "clamp",
  });
  const taglineY = interpolate(frame, [25, 40], [30, 0], {
    extrapolateRight: "clamp",
  });

  const exitStart = durationInFrames - 15;
  const exitOpacity = interpolate(
    frame,
    [exitStart, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        opacity: exitOpacity,
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
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
          }}
        >
          <Logo size={420} />
        </div>
        <div
          style={{
            opacity: taglineOpacity,
            transform: `translateY(${taglineY}px)`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 42,
              color: COLORS.yellow,
              fontWeight: 500,
              letterSpacing: 4,
              marginBottom: 12,
            }}
          >
            أهلاً بكم في
          </div>
          <div
            style={{
              fontSize: 92,
              color: COLORS.white,
              fontWeight: 600,
              letterSpacing: 2,
            }}
          >
            عَريكة البَلَدَة
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
