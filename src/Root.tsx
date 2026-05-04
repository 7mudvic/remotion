import React from 'react';
import {Composition} from 'remotion';
import {MenuShow, TOTAL_FRAMES} from './MenuShow';
import {MockupScene} from './scenes/MockupScene';
import {FPS} from './data';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MenuShow"
        component={MenuShow}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
      {/* 4K master for premium TVs / future-proofing */}
      <Composition
        id="MenuShow4K"
        component={MenuShow}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={3840}
        height={2160}
      />
      {/* Vertical edit for social / digital signage */}
      <Composition
        id="MenuShowVertical"
        component={MenuShow}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />

      {/* —— Static mockups for picking the price design (yellow scene) —— */}
      {([1, 2, 3, 4, 5] as const).map((d) => (
        <Composition
          key={`mock-y-${d}`}
          id={`PriceMockup${d}`}
          component={MockupScene}
          durationInFrames={1}
          fps={FPS}
          width={1920}
          height={1080}
          defaultProps={{design: d, variant: 'yellowTop' as const}}
        />
      ))}
    </>
  );
};
