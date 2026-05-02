import { AbsoluteFill, Sequence } from "remotion";
import { DISHES } from "./data";
import { DishScene } from "./scenes/DishScene";
import { IntroScene } from "./scenes/IntroScene";
import { OutroScene } from "./scenes/OutroScene";

export const INTRO_FRAMES = 90;
export const DISH_FRAMES = 180;
export const OUTRO_FRAMES = 90;

export const TOTAL_FRAMES =
  INTRO_FRAMES + DISH_FRAMES * DISHES.length + OUTRO_FRAMES;

export const AreekatMenu: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B1638" }}>
      <Sequence durationInFrames={INTRO_FRAMES}>
        <IntroScene />
      </Sequence>
      {DISHES.map((dish, index) => (
        <Sequence
          key={dish.id}
          from={INTRO_FRAMES + index * DISH_FRAMES}
          durationInFrames={DISH_FRAMES}
        >
          <DishScene dish={dish} index={index} total={DISHES.length} />
        </Sequence>
      ))}
      <Sequence
        from={INTRO_FRAMES + DISH_FRAMES * DISHES.length}
        durationInFrames={OUTRO_FRAMES}
      >
        <OutroScene />
      </Sequence>
    </AbsoluteFill>
  );
};
