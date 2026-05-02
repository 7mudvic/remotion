import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "../components/Background";
import { DishPlatter } from "../components/DishPlatter";
import { Logo } from "../components/Logo";
import { PriceRow } from "../components/PriceRow";
import { Dish } from "../data";
import { COLORS } from "../theme";

type DishSceneProps = {
  dish: Dish;
  index: number;
  total: number;
};

export const DishScene: React.FC<DishSceneProps> = ({ dish, index, total }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const ENTER_DURATION = 18;
  const EXIT_START = durationInFrames - 22;

  const entry = interpolate(
    frame,
    [0, ENTER_DURATION],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    },
  );
  const exit = interpolate(
    frame,
    [EXIT_START, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.4, 0, 1, 1),
    },
  );

  const sceneOpacity = entry * exit;
  const sceneShift = interpolate(entry, [0, 1], [40, 0]);
  const exitShift = interpolate(exit, [0, 1], [-40, 0]);

  const headerSpring = spring({
    frame: frame - 4,
    fps,
    config: { damping: 18, stiffness: 90 },
  });
  const headerY = interpolate(headerSpring, [0, 1], [-50, 0]);
  const headerOpacity = interpolate(headerSpring, [0, 1], [0, 1]);

  const imageSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 18, stiffness: 70 },
  });
  const imageX = interpolate(imageSpring, [0, 1], [140, 0]);
  const imageOpacity = interpolate(imageSpring, [0, 1], [0, 1]);

  const kenBurnsScale = interpolate(
    frame,
    [0, durationInFrames],
    [1.0, 1.06],
    { extrapolateRight: "clamp" },
  );

  const titleSpring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 16, stiffness: 95 },
  });
  const titleX = interpolate(titleSpring, [0, 1], [-100, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const taglineOpacity = interpolate(frame, [32, 50], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        fontFamily: "Cairo, sans-serif",
        direction: "rtl",
        opacity: sceneOpacity,
        transform: `translateY(${sceneShift + exitShift}px)`,
      }}
    >
      <Background />

      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          top: 50,
          left: 60,
          right: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Logo size={120} />
          <div style={{ color: COLORS.white }}>
            <div style={{ fontSize: 22, opacity: 0.75, fontWeight: 500 }}>
              قائمتنا المميّزة
            </div>
            <div
              style={{
                fontSize: 38,
                fontWeight: 600,
                color: COLORS.yellow,
                lineHeight: 1.1,
              }}
            >
              عَريكة البَلَدَة
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === index ? 70 : 14,
                height: 14,
                borderRadius: 7,
                background: i === index ? COLORS.yellow : `${COLORS.white}55`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 80,
          right: 80,
          bottom: 80,
          display: "flex",
          alignItems: "center",
          gap: 80,
        }}
      >
        {/* Right side: dish info */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 38,
            opacity: titleOpacity,
            transform: `translateX(${titleX}px)`,
          }}
        >
          <div>
            <div
              style={{
                display: "inline-block",
                background: COLORS.yellow,
                color: COLORS.blueDeep,
                padding: "10px 28px",
                borderRadius: 999,
                fontSize: 24,
                fontWeight: 600,
                marginBottom: 22,
                letterSpacing: 1,
              }}
            >
              صنف رقم {index + 1}
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 116,
                fontWeight: 600,
                color: COLORS.white,
                lineHeight: 1.05,
                textShadow: `0 6px 30px ${COLORS.shadow}`,
              }}
            >
              {dish.name}
            </h1>
            <div
              style={{
                marginTop: 18,
                fontSize: 32,
                color: COLORS.cream,
                fontWeight: 400,
                opacity: taglineOpacity,
                lineHeight: 1.5,
              }}
            >
              {dish.tagline}
            </div>
          </div>

          <PriceRow sizes={dish.sizes} startFrame={50} />
        </div>

        {/* Left side: dish image */}
        <div
          style={{
            flex: 1.1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: imageOpacity,
            transform: `translateX(${imageX}px) scale(${kenBurnsScale})`,
          }}
        >
          <DishPlatter image={dish.image} width={780} height={520} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
