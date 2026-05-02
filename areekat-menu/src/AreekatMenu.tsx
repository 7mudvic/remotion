import { AbsoluteFill, Sequence } from "remotion";
import { DISHES } from "./data";
import { DishScene } from "./scenes/DishScene";

export const DISH_FRAMES = 240;

export const TOTAL_FRAMES = DISH_FRAMES * DISHES.length;

export const AreekatMenu: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B1638" }}>
      {DISHES.map((dish, index) => (
        <Sequence
          key={dish.id}
          from={index * DISH_FRAMES}
          durationInFrames={DISH_FRAMES}
        >
          <DishScene dish={dish} index={index} total={DISHES.length} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
