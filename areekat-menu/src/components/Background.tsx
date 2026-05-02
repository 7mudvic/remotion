import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLORS } from "../theme";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.15) % 200;

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at top right, ${COLORS.blue} 0%, ${COLORS.blueDark} 55%, ${COLORS.blueDeep} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${COLORS.yellow}22 1.5px, transparent 1.5px)`,
          backgroundSize: "40px 40px",
          backgroundPosition: `${drift}px ${drift}px`,
          opacity: 0.6,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 15% 85%, ${COLORS.yellow}26 0%, transparent 35%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 85% 15%, ${COLORS.yellow}18 0%, transparent 30%)`,
        }}
      />
    </AbsoluteFill>
  );
};
