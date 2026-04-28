import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Candlesticks } from "./components/Candlesticks";
import { GlowBurst } from "./components/GlowBurst";
import { GridBackground } from "./components/GridBackground";
import { Logo } from "./components/Logo";
import { Slogan } from "./components/Slogan";
import { StockLine } from "./components/StockLine";
import { Ticker } from "./components/Ticker";

export const AlfexIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const vignetteOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  const finalFade = interpolate(frame, [fps * 4.6, fps * 5.0], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <AbsoluteFill style={{ opacity: finalFade }}>
        <GridBackground />
        <Candlesticks />
        <Ticker y={140} speed={1} />
        <Ticker y={1730} speed={0.7} reverse />
        <StockLine />
        <GlowBurst />
        <Logo />
        <Slogan />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%)",
            opacity: vignetteOpacity,
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
