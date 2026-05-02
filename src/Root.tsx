import React from 'react';
import {Composition} from 'remotion';
import {MenuShow, TOTAL_FRAMES} from './MenuShow';
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
    </>
  );
};
