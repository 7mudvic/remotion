import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, random} from 'remotion';
import {THEME} from '../theme';

/**
 * Slow drifting "bokeh" particles - golden dust motes that float upward.
 * Gives every static frame a sense of motion, depth, and warmth.
 */
export const Particles: React.FC<{
  count?: number;
  color?: string;
  blur?: number;
  speed?: number;
}> = ({count = 60, color = THEME.gold, blur = 6, speed = 1}) => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();

  const particles = useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => {
        const seed = `p-${i}`;
        return {
          x: random(`${seed}-x`) * width,
          yStart: random(`${seed}-y`) * height * 1.4,
          radius: 1.5 + random(`${seed}-r`) * 5,
          opacity: 0.18 + random(`${seed}-o`) * 0.55,
          drift: (random(`${seed}-d`) - 0.5) * 90,
          phase: random(`${seed}-p`) * Math.PI * 2,
          riseSpeed: 30 + random(`${seed}-s`) * 50,
        };
      }),
    [count, width, height],
  );

  return (
    <AbsoluteFill style={{pointerEvents: 'none', filter: `blur(${blur}px)`}}>
      {particles.map((p, i) => {
        const t = frame / durationInFrames;
        const y =
          ((p.yStart - frame * (p.riseSpeed / 30) * speed) % (height * 1.4) +
            height * 1.4) %
          (height * 1.4);
        const x = p.x + Math.sin(t * Math.PI * 2 + p.phase) * p.drift;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y - height * 0.2,
              width: p.radius * 2,
              height: p.radius * 2,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${color} 0%, rgba(0,0,0,0) 70%)`,
              opacity: p.opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
