import { AbsoluteFill, Sequence } from "remotion";
import { BrandClose } from "./scenes/BrandClose";
import { BrandOpen } from "./scenes/BrandOpen";
import { PhoneSequence } from "./scenes/PhoneSequence";

export const AlfexIntro: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <Sequence durationInFrames={75}>
        <BrandOpen />
      </Sequence>
      <Sequence from={70} durationInFrames={220}>
        <PhoneSequence />
      </Sequence>
      <Sequence from={285} durationInFrames={85}>
        <BrandClose />
      </Sequence>
    </AbsoluteFill>
  );
};
