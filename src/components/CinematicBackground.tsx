import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {THEME} from '../theme';

type Hue = 'royal' | 'honey' | 'midnight';

/**
 * Slowly drifting radial gradient that gives every scene a "studio lighting"
 * feel in the brand's royal-blue + warm-yellow palette. The hotspot pans so
 * static layouts never look flat.
 */
export const CinematicBackground: React.FC<{
  hue?: Hue;
  intensity?: number;
}> = ({hue = 'royal', intensity = 1}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = frame / Math.max(durationInFrames, 1);

  const cx = interpolate(t, [0, 1], [38, 62]);
  const cy = interpolate(t, [0, 1], [42, 58]);

  const hot = {
    royal: 'rgba(46, 82, 196, 0.65)',
    honey: 'rgba(245, 194, 51, 0.40)',
    midnight: 'rgba(30, 63, 163, 0.50)',
  }[hue];

  const mid = hue === 'midnight' ? THEME.bgBottom : THEME.bgMid;
  const bottom = THEME.bgBottom;

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 120% at ${cx}% ${cy}%, ${hot} 0%, ${mid} 38%, ${bottom} 80%)`,
        opacity: intensity,
      }}
    />
  );
};
