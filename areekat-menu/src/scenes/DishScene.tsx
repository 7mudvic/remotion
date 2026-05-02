import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background } from "../components/Background";
import { DishPlatter } from "../components/DishPlatter";
import { Logo } from "../components/Logo";
import { PriceCard } from "../components/PriceCard";
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

  const headerSpring = spring({
    frame: frame - 5,
    fps,
    config: { damping: 16, stiffness: 90 },
  });
  const headerY = interpolate(headerSpring, [0, 1], [-60, 0]);
  const headerOpacity = interpolate(headerSpring, [0, 1], [0, 1]);

  const imageSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 16, stiffness: 80 },
  });
  const imageX = interpolate(imageSpring, [0, 1], [120, 0]);
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
    config: { damping: 16, stiffness: 90 },
  });
  const titleX = interpolate(titleSpring, [0, 1], [-80, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);

  const taglineOpacity = interpolate(frame, [28, 42], [0, 1], {
    extrapolateRight: "clamp",
  });

  const exitStart = durationInFrames - 18;
  const exitOpacity = interpolate(
    frame,
    [exitStart, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        fontFamily: "Cairo, sans-serif",
        direction: "rtl",
        opacity: exitOpacity,
      }}
    >
      <Background />

      {/* Top bar with logo + counter */}
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
          <Logo size={110} />
          <div style={{ color: COLORS.white }}>
            <div style={{ fontSize: 22, opacity: 0.7, fontWeight: 500 }}>
              قائمتنا المميّزة
            </div>
            <div style={{ fontSize: 36, fontWeight: 600, color: COLORS.yellow }}>
              عَريكة البَلَدَة
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === index ? 60 : 14,
                height: 14,
                borderRadius: 7,
                background: i === index ? COLORS.yellow : `${COLORS.white}55`,
                transition: "all 0.4s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          position: "absolute",
          top: 230,
          left: 80,
          right: 80,
          bottom: 80,
          display: "flex",
          alignItems: "center",
          gap: 70,
        }}
      >
        {/* Right side: dish info (RTL: right comes first visually) */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 36,
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
                fontSize: 26,
                fontWeight: 600,
                marginBottom: 24,
                letterSpacing: 1,
              }}
            >
              صنف رقم {index + 1}
            </div>
            <h1
              style={{
                margin: 0,
                fontSize: 110,
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

          <div
            style={{
              display: "flex",
              gap: 22,
              direction: "rtl",
            }}
          >
            {dish.sizes.map((size, i) => (
              <PriceCard
                key={size.label}
                label={size.label}
                price={size.price}
                delay={30 + i * 8}
                highlight={i === 1}
              />
            ))}
          </div>
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
