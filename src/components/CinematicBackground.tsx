import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {THEME} from '../theme';

/**
 * A slowly drifting radial gradient that gives every scene a warm, premium
 * "studio lighting" feel. The hotspot pans across the frame so static layouts
 * never look flat.
 */
export const CinematicBackground: React.FC<{
  hue?: 'gold' | 'amber' | 'crimson';
  intensity?: number;
}> = ({hue = 'gold', intensity = 1}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const t = frame / Math.max(durationInFrames, 1);

  const cx = interpolate(t, [0, 1], [38, 62]);
  const cy = interpolate(t, [0, 1], [42, 58]);

  const hot =
    hue === 'crimson'
      ? 'rgba(166, 60, 50, 0.55)'
      : hue === 'amber'
        ? 'rgba(214, 145, 60, 0.55)'
        : 'rgba(214, 168, 90, 0.55)';

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 120% at ${cx}% ${cy}%, ${hot} 0%, ${THEME.bgMid} 38%, ${THEME.bgBottom} 80%)`,
        opacity: intensity,
      }}
    />
  );
};
