import React from 'react';
import {Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {THEME} from '../theme';

/**
 * Hero product photo (PNG with transparent background).
 *
 * Springs in, breathes gently, and casts a soft blue shadow that follows
 * the alpha channel — so the shadow hugs the platter rather than a
 * rectangle.
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

  const t = frame / durationInFrames;
  const drift = Math.sin(t * Math.PI * 2) * 8;
  const breath = 1 + Math.sin(local / 28) * 0.014;
  const wobble = Math.sin(local / 60) * 0.6;

  const scale = (0.86 + pop * 0.14) * breath;
  const translateY = interpolate(pop, [0, 1], [50, 0]) + drift;
  const opacity = interpolate(local, [0, 14], [0, 1], {
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
        transform: `translateY(${translateY}px) scale(${scale}) rotate(${wobble}deg)`,
        opacity,
        // Stacked drop-shadows: the deeper one anchors the dish to the
        // background, the tighter one adds crispness near the rim.
        filter: `
          drop-shadow(0 36px 50px ${THEME.shadowBlue})
          drop-shadow(0 8px 14px rgba(9, 18, 54, 0.35))
        `,
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
        }}
      />
    </div>
  );
};
