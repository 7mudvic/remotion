import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

type Candle = {
  x: number;
  bodyTop: number;
  bodyBottom: number;
  wickTop: number;
  wickBottom: number;
  isUp: boolean;
};

const seededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
};

const buildCandles = (count: number, width: number, height: number): Candle[] => {
  const rand = seededRandom(7);
  const margin = 80;
  const usableWidth = width - margin * 2;
  const candleWidth = 18;
  const gap = (usableWidth - count * candleWidth) / (count - 1);
  const verticalCenter = height * 0.55;
  const verticalRange = height * 0.18;

  let lastClose = verticalCenter;

  return Array.from({ length: count }).map((_, i) => {
    const x = margin + i * (candleWidth + gap);

    const drift = (i / count - 0.4) * verticalRange * 0.6;
    const noise = (rand() - 0.5) * verticalRange * 0.5;
    const open = lastClose;
    const close = verticalCenter - drift + noise;
    const wickTopExt = rand() * 30 + 8;
    const wickBottomExt = rand() * 30 + 8;
    const isUp = close < open;

    const bodyTop = Math.min(open, close);
    const bodyBottom = Math.max(open, close);
    const wickTop = bodyTop - wickTopExt;
    const wickBottom = bodyBottom + wickBottomExt;

    lastClose = close;

    return { x, bodyTop, bodyBottom, wickTop, wickBottom, isUp };
  });
};

export const Candlesticks: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const candles = buildCandles(28, width, height);

  const globalOpacity = interpolate(
    frame,
    [fps * 0.3, fps * 1.2, fps * 3.0, fps * 4.0],
    [0, 0.18, 0.18, 0.05],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.45, 0, 0.55, 1),
    },
  );

  return (
    <svg
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        opacity: globalOpacity,
        filter: "blur(0.5px)",
      }}
    >
      {candles.map((c, i) => {
        const enterStart = fps * 0.35 + i * 0.6;
        const candleOpacity = interpolate(
          frame,
          [enterStart, enterStart + fps * 0.4],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          },
        );
        const color = c.isUp ? "#00FF88" : "#FF3355";
        const candleWidth = 18;

        return (
          <g key={i} opacity={candleOpacity}>
            <line
              x1={c.x + candleWidth / 2}
              y1={c.wickTop}
              x2={c.x + candleWidth / 2}
              y2={c.wickBottom}
              stroke={color}
              strokeWidth={1.5}
            />
            <rect
              x={c.x}
              y={c.bodyTop}
              width={candleWidth}
              height={Math.max(c.bodyBottom - c.bodyTop, 4)}
              fill={color}
              rx={1}
            />
          </g>
        );
      })}
    </svg>
  );
};
