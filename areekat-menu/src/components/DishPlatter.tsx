import { Img, staticFile } from "remotion";
import { COLORS } from "../theme";

type DishPlatterProps = {
  image: string;
  width: number;
  height: number;
};

export const DishPlatter: React.FC<DishPlatterProps> = ({
  image,
  width,
  height,
}) => {
  return (
    <div
      style={{
        width,
        height,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -20,
          borderRadius: 36,
          background: `linear-gradient(135deg, ${COLORS.yellow}, ${COLORS.yellowDeep})`,
          filter: "blur(40px)",
          opacity: 0.45,
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: `0 35px 80px ${COLORS.shadow}, 0 0 0 6px ${COLORS.yellow}, 0 0 0 12px ${COLORS.blueDark}`,
        }}
      >
        <Img
          src={staticFile(image)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    </div>
  );
};
