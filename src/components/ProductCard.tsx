import React from 'react';
import {Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {THEME} from '../theme';

/**
 * Hero product photo, displayed without crop and at a comfortable size.
 * Springs in, drifts slowly, and casts a soft drop-shadow against the
 * brand background.
 */
export const ProductCard: React.FC<{
  src: string;
  delay?: number;
  width: number;
  height: number;
}> = ({src, delay = 0, width, height}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const local = Math.max(0, frame - delay);

  const pop = spring({
    frame: local,
    fps,
    config: {damping: 14, stiffness: 90, mass: 1},
  });

  // gentle drift over the scene's lifetime
  const t = frame / durationInFrames;
  const drift = Math.sin(t * Math.PI * 2) * 6;
  const breath = 1 + Math.sin(local / 28) * 0.012;

  const scale = (0.86 + pop * 0.14) * breath;
  const translateY = interpolate(pop, [0, 1], [40, 0]) + drift;
  const opacity = interpolate(local, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity,
        filter: `drop-shadow(0 30px 60px ${THEME.shadowBlue})`,
      }}
    >
      <Img
        src={src}
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          borderRadius: 24,
        }}
      />
    </div>
  );
};
