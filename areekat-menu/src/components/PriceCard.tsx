import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";
import { CURRENCY } from "../data";

type PriceCardProps = {
  label: string;
  price: number;
  delay: number;
  highlight?: boolean;
};

export const PriceCard: React.FC<PriceCardProps> = ({
  label,
  price,
  delay,
  highlight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  const translateY = interpolate(enter, [0, 1], [40, 0]);
  const opacity = interpolate(enter, [0, 1], [0, 1]);

  return (
    <div
      style={{
        flex: 1,
        background: highlight ? COLORS.yellow : COLORS.white,
        color: highlight ? COLORS.blueDeep : COLORS.blueDark,
        borderRadius: 24,
        padding: "28px 20px",
        textAlign: "center",
        boxShadow: highlight
          ? `0 25px 55px rgba(245, 200, 66, 0.45), 0 0 0 4px ${COLORS.yellowDeep}`
          : `0 18px 40px rgba(0,0,0,0.25)`,
        transform: `translateY(${translateY}px) ${highlight ? "scale(1.06)" : ""}`,
        opacity,
        fontFamily: "Cairo, sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: 1,
          opacity: 0.85,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 64, fontWeight: 600, lineHeight: 1 }}>
          {price}
        </span>
        <span style={{ fontSize: 24, fontWeight: 500, opacity: 0.75 }}>
          {CURRENCY}
        </span>
      </div>
    </div>
  );
};
