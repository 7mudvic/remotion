import { Img, staticFile } from "remotion";
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
        borderRadius: 28,
        overflow: "hidden",
        boxShadow: `0 18px 40px ${COLORS.shadow}, 0 0 0 4px ${COLORS.yellow}`,
        background: COLORS.blue,
      }}
    >
      <Img
        src={staticFile("images/logo.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
};
