import "./index.css";
import "./fonts";
import { Composition } from "remotion";
import { AlfexIntro } from "./AlfexIntro";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AlfexIntro"
      component={AlfexIntro}
      durationInFrames={370}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
