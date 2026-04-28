import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const GridBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const opacity = interpolate(frame, [0, fps * 0.8], [0, 0.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const cellSize = 120;
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);

  return (
    <svg
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        opacity,
      }}
    >
      {Array.from({ length: cols + 1 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * cellSize}
          y1={0}
          x2={i * cellSize}
          y2={height}
          stroke="#00FF88"
          strokeWidth={1}
        />
      ))}
      {Array.from({ length: rows + 1 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1={0}
          y1={i * cellSize}
          x2={width}
          y2={i * cellSize}
          stroke="#00FF88"
          strokeWidth={1}
        />
      ))}
    </svg>
  );
};
