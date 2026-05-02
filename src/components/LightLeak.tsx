import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';

/**
 * Anamorphic light leak / lens flare that sweeps across the frame.
 * Used between scenes for cinematic flair.
 */
export const LightLeak: React.FC<{
  delay?: number;
  duration?: number;
  angle?: number;
  hue?: string;
}> = ({delay = 0, duration = 30, angle = -12, hue = 'rgba(255, 220, 160, 0.55)'}) => {
  const frame = useCurrentFrame();
  const {width} = useVideoConfig();
  const local = frame - delay;

  const x = interpolate(local, [0, duration], [-width * 0.5, width * 1.2], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(
    local,
    [0, duration * 0.3, duration * 0.7, duration],
    [0, 0.9, 0.9, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: x,
          top: '-30%',
          width: '40%',
          height: '160%',
          transform: `rotate(${angle}deg)`,
          background: `linear-gradient(90deg, transparent, ${hue}, transparent)`,
          filter: 'blur(40px)',
          opacity,
          mixBlendMode: 'screen',
        }}
      />
    </AbsoluteFill>
  );
};
