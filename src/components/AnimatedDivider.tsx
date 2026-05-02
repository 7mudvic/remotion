import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {THEME} from '../theme';

/**
 * A delicate gold divider with a centered diamond ornament that draws
 * itself outward from the middle. Used between dish title and price.
 */
export const AnimatedDivider: React.FC<{
  width?: number;
  delay?: number;
}> = ({width = 360, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = Math.max(0, frame - delay);

  const grow = spring({
    frame: local,
    fps,
    config: {damping: 200, stiffness: 90, mass: 0.6},
  });
  const opacity = interpolate(local, [0, 8], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        opacity,
      }}
    >
      <div
        style={{
          width: (width / 2) * grow,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${THEME.gold})`,
        }}
      />
      <div
        style={{
          width: 8,
          height: 8,
          transform: `rotate(45deg) scale(${grow})`,
          background: THEME.goldHi,
          boxShadow: `0 0 10px ${THEME.goldShadow}`,
        }}
      />
      <div
        style={{
          width: (width / 2) * grow,
          height: 1,
          background: `linear-gradient(270deg, transparent, ${THEME.gold})`,
        }}
      />
    </div>
  );
};
