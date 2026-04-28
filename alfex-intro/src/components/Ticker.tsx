import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { INTER_FAMILY } from "../fonts";

type Quote = {
  symbol: string;
  price: string;
  change: string;
  up: boolean;
};

const quotes: Quote[] = [
  { symbol: "BTC", price: "67,420.18", change: "+2.41%", up: true },
  { symbol: "ETH", price: "3,512.04", change: "+1.78%", up: true },
  { symbol: "AAPL", price: "189.32", change: "-0.62%", up: false },
  { symbol: "TSLA", price: "248.91", change: "+3.12%", up: true },
  { symbol: "GOLD", price: "2,341.50", change: "+0.45%", up: true },
  { symbol: "SPX", price: "5,418.22", change: "+0.88%", up: true },
  { symbol: "NDX", price: "19,210.55", change: "-0.21%", up: false },
  { symbol: "OIL", price: "78.42", change: "+1.05%", up: true },
];

type TickerProps = {
  y: number;
  speed?: number;
  reverse?: boolean;
};

export const Ticker: React.FC<TickerProps> = ({ y, speed = 1, reverse = false }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, fps * 0.6, fps * 4.0, fps * 4.8],
    [0, 0.55, 0.55, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.45, 0, 0.55, 1),
    },
  );

  const offset = (frame * 3 * speed) % 1500;
  const direction = reverse ? 1 : -1;

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 0,
        width,
        height: 50,
        opacity,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 60,
          transform: `translateX(${direction * offset}px)`,
          whiteSpace: "nowrap",
        }}
      >
        {[...quotes, ...quotes, ...quotes].map((q, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 14,
              fontFamily: INTER_FAMILY,
              fontWeight: 500,
              fontSize: 22,
              color: "#FFFFFF",
              letterSpacing: "0.5px",
            }}
          >
            <span style={{ color: "#888" }}>{q.symbol}</span>
            <span>{q.price}</span>
            <span style={{ color: q.up ? "#00FF88" : "#FF3355" }}>{q.change}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
