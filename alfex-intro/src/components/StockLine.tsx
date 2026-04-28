import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const points: Array<[number, number]> = [
  [0, 1480],
  [70, 1500],
  [140, 1460],
  [210, 1490],
  [280, 1430],
  [360, 1455],
  [440, 1380],
  [520, 1410],
  [600, 1330],
  [680, 1360],
  [760, 1270],
  [840, 1200],
  [920, 1110],
  [1000, 1010],
  [1080, 920],
];

const segmentLengths = points
  .slice(1)
  .map(([x, y], i) => {
    const [px, py] = points[i];
    return Math.hypot(x - px, y - py);
  });
const totalLength = segmentLengths.reduce((a, b) => a + b, 0);
const cumulativeLengths = segmentLengths.reduce<number[]>((acc, len) => {
  acc.push((acc[acc.length - 1] ?? 0) + len);
  return acc;
}, []);

const positionAt = (progress: number): [number, number] => {
  const target = progress * totalLength;
  if (target <= 0) return points[0];
  for (let i = 0; i < cumulativeLengths.length; i++) {
    if (target <= cumulativeLengths[i]) {
      const prevCum = i === 0 ? 0 : cumulativeLengths[i - 1];
      const segProgress = (target - prevCum) / segmentLengths[i];
      const [x1, y1] = points[i];
      const [x2, y2] = points[i + 1];
      return [x1 + (x2 - x1) * segProgress, y1 + (y2 - y1) * segProgress];
    }
  }
  return points[points.length - 1];
};

const pathD = points
  .map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`))
  .join(" ");

export const StockLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const drawStart = fps * 0.5;
  const drawEnd = fps * 2.6;

  const progress = interpolate(frame, [drawStart, drawEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.65, 0, 0.35, 1),
  });

  const fadeOut = interpolate(frame, [fps * 3.4, fps * 4.2], [1, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  const dashOffset = (1 - progress) * 100;
  const [tipX, tipY] = positionAt(progress);

  const tipVisible = progress > 0.001 && progress < 1.0;
  const tipPulse = 1 + 0.15 * Math.sin(frame * 0.3);

  return (
    <svg
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        opacity: fadeOut,
      }}
    >
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00FF88" stopOpacity="0.3" />
          <stop offset="60%" stopColor="#00FF88" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
        </linearGradient>
        <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="tipGlow">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="40%" stopColor="#00FF88" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00FF88" stopOpacity="0" />
        </radialGradient>
      </defs>

      <path
        d={pathD}
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={100}
        strokeDasharray={100}
        strokeDashoffset={dashOffset}
        filter="url(#lineGlow)"
      />

      {tipVisible && (
        <>
          <circle
            cx={tipX}
            cy={tipY}
            r={60 * tipPulse}
            fill="url(#tipGlow)"
            opacity={0.6}
          />
          <circle cx={tipX} cy={tipY} r={10} fill="#FFFFFF" />
          <circle
            cx={tipX}
            cy={tipY}
            r={20}
            fill="none"
            stroke="#00FF88"
            strokeWidth={2}
            opacity={0.8}
          />
        </>
      )}
    </svg>
  );
};
