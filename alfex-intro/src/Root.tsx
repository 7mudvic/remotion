import "./index.css";
import "./fonts";
import { Composition } from "remotion";
import { AlfexIntro } from "./AlfexIntro";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AlfexIntro"
      component={AlfexIntro}
      durationInFrames={480}
      fps={60}
      width={1080}
      height={1920}
    />
  );
};
