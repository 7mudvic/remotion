import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {THEME} from '../theme';

/**
 * Brand-true sunburst background: blue top half + yellow bottom half (or
 * inverted), with radial rays that slowly rotate. Matches the marketing
 * imagery the restaurant already uses.
 */
export const SunburstBackground: React.FC<{
  /** 'blueTop' = blue top + yellow bottom, 'yellowTop' = inverted */
  variant?: 'blueTop' | 'yellowTop' | 'allBlue' | 'allYellow';
  /** Degrees per second for the slow ray rotation */
  spinDegPerSec?: number;
  rayCount?: number;
}> = ({variant = 'blueTop', spinDegPerSec = 4, rayCount = 36}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const angle = (frame / fps) * spinDegPerSec;

  const top = variant === 'yellowTop' || variant === 'allYellow' ? THEME.yellow : THEME.blue;
  const bottom = variant === 'blueTop' || variant === 'allBlue' ? THEME.blue : THEME.yellow;

  const rayLight =
    variant === 'allBlue' || variant === 'blueTop'
      ? 'rgba(255,255,255,0.07)'
      : 'rgba(9,18,54,0.07)';
  const rayDark =
    variant === 'allYellow' || variant === 'yellowTop'
      ? 'rgba(9,18,54,0.10)'
      : 'rgba(255,255,255,0.10)';

  const conicStops: string[] = [];
  for (let i = 0; i < rayCount; i++) {
    const isDark = i % 2 === 0;
    const start = (360 / rayCount) * i;
    const end = (360 / rayCount) * (i + 1);
    conicStops.push(`${isDark ? rayDark : rayLight} ${start}deg ${end}deg`);
  }

  return (
    <AbsoluteFill>
      {/* Two-tone background */}
      <AbsoluteFill
        style={{
          background:
            variant === 'allBlue'
              ? THEME.blue
              : variant === 'allYellow'
                ? THEME.yellow
                : `linear-gradient(180deg, ${top} 0%, ${top} 50%, ${bottom} 50%, ${bottom} 100%)`,
        }}
      />
      {/* Sunburst rays — conic gradient anchored just above the seam */}
      <AbsoluteFill
        style={{
          background: `conic-gradient(from ${angle}deg at 50% 50%, ${conicStops.join(', ')})`,
          mixBlendMode: 'overlay',
        }}
      />
      {/* Subtle radial highlight to lift the seam */}
      <div
        style={{
          position: 'absolute',
          left: width / 2 - height * 0.7,
          top: height / 2 - height * 0.7,
          width: height * 1.4,
          height: height * 1.4,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
