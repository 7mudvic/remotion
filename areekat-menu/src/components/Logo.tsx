import { COLORS } from "../theme";

type LogoProps = {
  size?: number;
};

export const Logo: React.FC<LogoProps> = ({ size = 220 }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: COLORS.blue,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `0 18px 40px ${COLORS.shadow}`,
        padding: size * 0.06,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: COLORS.yellow,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: size * 0.02,
          color: COLORS.blue,
          fontFamily: "Cairo, sans-serif",
          fontWeight: 600,
          lineHeight: 1.05,
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: size * 0.21 }}>عَريكة</span>
        <span style={{ fontSize: size * 0.21 }}>البَلَدَة</span>
      </div>
    </div>
  );
};
