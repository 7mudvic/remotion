import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CURRENCY, DishSize } from "../data";
import { COLORS } from "../theme";

type PriceRowProps = {
  sizes: DishSize[];
  startFrame: number;
};

const mixColor = (a: string, b: string, t: number): string => {
  const parse = (hex: string) => {
    const h = hex.replace("#", "");
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  };
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r}, ${g}, ${bl})`;
};

export const PriceRow: React.FC<PriceRowProps> = ({ sizes, startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rowSpring = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 16, stiffness: 90 },
  });
  const rowY = interpolate(rowSpring, [0, 1], [60, 0]);
  const rowOpacity = interpolate(rowSpring, [0, 1], [0, 1]);

  const t0 = startFrame + 18;
  const HOLD = 30;
  const TRANSITION = 18;

  const highlightIndex = interpolate(
    frame,
    [
      t0,
      t0 + HOLD,
      t0 + HOLD + TRANSITION,
      t0 + HOLD * 2 + TRANSITION,
      t0 + HOLD * 2 + TRANSITION * 2,
    ],
    [0, 0, 1, 1, 2],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.34, 1.2, 0.64, 1),
    },
  );

  const middleBoost = Math.max(0, 1 - Math.abs(highlightIndex - 1));

  return (
    <div
      style={{
        display: "flex",
        gap: 26,
        direction: "rtl",
        opacity: rowOpacity,
        transform: `translateY(${rowY}px)`,
        alignItems: "center",
      }}
    >
      {sizes.map((size, i) => {
        const distance = Math.abs(i - highlightIndex);
        const proximity = Math.max(0, 1 - distance);
        const scale = 1 + proximity * (0.10 + middleBoost * 0.14);
        const yLift = -proximity * (8 + middleBoost * 14);

        const bg = mixColor(COLORS.white, COLORS.yellow, proximity);
        const border = mixColor(
          "#E0E5F5",
          COLORS.yellowDeep,
          proximity,
        );
        const textColor = mixColor("#1E3470", "#0B1638", proximity);

        const glow = proximity * (0.4 + middleBoost * 0.5);

        return (
          <div
            key={size.label}
            style={{
              flex: 1,
              minWidth: 0,
              background: bg,
              color: textColor,
              borderRadius: 26,
              padding: "30px 22px",
              textAlign: "center",
              transform: `translateY(${yLift}px) scale(${scale})`,
              boxShadow: `0 ${18 + proximity * 22}px ${40 + proximity * 30}px rgba(245, 200, 66, ${glow}), 0 14px 30px rgba(0,0,0,${0.18 + proximity * 0.18}), 0 0 0 ${3 + proximity * 2}px ${border}`,
              fontFamily: "Cairo, sans-serif",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              transition: "background 0.05s linear",
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: 1,
                opacity: 0.85,
              }}
            >
              {size.label}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 60 + proximity * 16,
                  fontWeight: 600,
                  lineHeight: 1,
                  textShadow:
                    proximity > 0.5
                      ? `0 4px 20px rgba(0,0,0,${proximity * 0.25})`
                      : "none",
                }}
              >
                {size.price}
              </span>
              <span style={{ fontSize: 22, fontWeight: 500, opacity: 0.78 }}>
                {CURRENCY}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
