import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CAIRO_FAMILY } from "../fonts";

type Screen = {
  src: string;
  caption: string;
};

const screens: Screen[] = [
  { src: "screens/home.png", caption: "أهلاً، الأسواق العالمية مفتوحة" },
  { src: "screens/heat.png", caption: "مقياس حرارة السوق" },
  { src: "screens/news.png", caption: "تحليل لحظي بالذكاء الاصطناعي" },
  { src: "screens/settings.png", caption: "خصّص أخبارك حسب اهتماماتك" },
  { src: "screens/pricing.png", caption: "ارتقِ بتجربتك" },
];

export const PhoneSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const PER_SCREEN = fps * 1.4;
  const FADE = fps * 0.3;

  const introOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.45, 0, 0.55, 1),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000", opacity: introOpacity }}>
      {screens.map((screen, i) => {
        const screenStart = i * PER_SCREEN;
        const screenEnd = screenStart + PER_SCREEN;

        const opacity = interpolate(
          frame,
          [screenStart - FADE, screenStart, screenEnd, screenEnd + FADE],
          [0, 1, 1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.45, 0, 0.55, 1),
          },
        );

        const scale = interpolate(
          frame,
          [screenStart - FADE, screenEnd + FADE],
          [1.0, 1.05],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.45, 0, 0.55, 1),
          },
        );

        const captionProgress = interpolate(
          frame,
          [screenStart + fps * 0.15, screenStart + fps * 0.6],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          },
        );

        if (opacity <= 0) return null;

        return (
          <AbsoluteFill key={i} style={{ opacity }}>
            <div
              style={{
                position: "absolute",
                top: 110,
                left: 0,
                width,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                dir="rtl"
                style={{
                  fontFamily: CAIRO_FAMILY,
                  fontWeight: 500,
                  fontSize: 38,
                  color: "rgba(255,255,255,0.85)",
                  textAlign: "center",
                  letterSpacing: "0.5px",
                  opacity: captionProgress,
                  transform: `translateY(${(1 - captionProgress) * 14}px)`,
                  maxWidth: 900,
                  lineHeight: 1.4,
                }}
              >
                {screen.caption}
              </div>
            </div>

            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  height: 1500,
                  width: 1500 * (1320 / 2868),
                  borderRadius: 56,
                  overflow: "hidden",
                  boxShadow:
                    "0 0 0 1px rgba(255,255,255,0.06), 0 30px 80px rgba(0, 0, 0, 0.6), 0 0 100px rgba(0, 200, 255, 0.05)",
                  transform: `scale(${scale})`,
                  marginTop: 80,
                }}
              >
                <Img
                  src={staticFile(screen.src)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
