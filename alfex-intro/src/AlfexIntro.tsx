import { AbsoluteFill } from "remotion";
import { CinematicLogo } from "./scenes/CinematicLogo";

export const AlfexIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <CinematicLogo />
    </AbsoluteFill>
  );
};
