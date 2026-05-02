import React from 'react';
import {AbsoluteFill, Img, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

type Pan = 'in' | 'out' | 'left' | 'right' | 'diagonal';

/**
 * Cinematic Ken-Burns image: slow zoom + pan with built-in fade in/out.
 * Adds a subtle saturation boost so dishes look mouth-watering on a TV screen.
 */
export const KenBurnsImage: React.FC<{
  src: string;
  pan?: Pan;
  fadeIn?: number;
  fadeOut?: number;
  startScale?: number;
  endScale?: number;
}> = ({
  src,
  pan = 'in',
  fadeIn = 18,
  fadeOut = 18,
  startScale = 1.05,
  endScale = 1.18,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const t = frame / durationInFrames;

  const scale = interpolate(t, [0, 1], [startScale, endScale]);

  const offset = {
    in: {x: 0, y: 0},
    out: {x: 0, y: 0},
    left: {x: interpolate(t, [0, 1], [40, -40]), y: 0},
    right: {x: interpolate(t, [0, 1], [-40, 40]), y: 0},
    diagonal: {
      x: interpolate(t, [0, 1], [-30, 30]),
      y: interpolate(t, [0, 1], [20, -20]),
    },
  }[pan];

  const opacity = Math.min(
    interpolate(frame, [0, fadeIn], [0, 1], {extrapolateRight: 'clamp'}),
    interpolate(
      frame,
      [durationInFrames - fadeOut, durationInFrames],
      [1, 0],
      {extrapolateLeft: 'clamp'},
    ),
  );

  return (
    <AbsoluteFill style={{overflow: 'hidden', opacity}}>
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)`,
          filter: 'saturate(1.12) contrast(1.05)',
        }}
      />
    </AbsoluteFill>
  );
};
