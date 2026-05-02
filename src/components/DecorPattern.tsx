import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {THEME} from '../theme';

/**
 * Decorative comic-style dot grids and wavy lines, mirrored on both sides
 * of the frame. Matches the brand's existing marketing style.
 */
export const DecorPattern: React.FC<{
  color?: string;
  opacity?: number;
  delay?: number;
}> = ({color = THEME.ink, opacity = 0.55, delay = 0}) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame - delay, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const dotGrid = (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {Array.from({length: 5}).map((_, r) =>
        Array.from({length: 5}).map((__, c) => (
          <circle
            key={`${r}-${c}`}
            cx={12 + c * 24}
            cy={12 + r * 24}
            r={3.5}
            fill={color}
          />
        )),
      )}
    </svg>
  );

  const waves = (
    <svg width="180" height="60" viewBox="0 0 180 60">
      {[10, 30, 50].map((y) => (
        <path
          key={y}
          d={`M 0 ${y} q 22.5 -16 45 0 t 45 0 t 45 0 t 45 0`}
          stroke={color}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );

  return (
    <AbsoluteFill style={{opacity: opacity * reveal, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', top: 60, left: 60}}>{dotGrid}</div>
      <div style={{position: 'absolute', bottom: 60, left: 60}}>{dotGrid}</div>
      <div style={{position: 'absolute', top: 60, right: 60}}>{dotGrid}</div>
      <div style={{position: 'absolute', bottom: 60, right: 60}}>{dotGrid}</div>
      <div style={{position: 'absolute', top: '38%', left: 30}}>{waves}</div>
      <div
        style={{
          position: 'absolute',
          top: '38%',
          right: 30,
          transform: 'scaleX(-1)',
        }}
      >
        {waves}
      </div>
    </AbsoluteFill>
  );
};
