import "./fonts";
import { Composition } from "remotion";
import { AreekatMenu, TOTAL_FRAMES } from "./AreekatMenu";
import { DISHES } from "./data";
import { DishScene } from "./scenes/DishScene";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AreekatMenu"
        component={AreekatMenu}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DishPreview"
        component={DishScene}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          dish: DISHES[0],
          index: 0,
          total: DISHES.length,
        }}
      />
    </>
  );
};
