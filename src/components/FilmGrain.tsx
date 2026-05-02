import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, random} from 'remotion';
import {noise2D} from '@remotion/noise';

/**
 * Dynamic film-grain overlay. Uses @remotion/noise for animated, deterministic
 * texture so the render is bit-exact reproducible.
 */
export const FilmGrain: React.FC<{opacity?: number; cell?: number}> = ({
  opacity = 0.08,
  cell = 4,
}) => {
  const frame = useCurrentFrame();

  const dataUri = useMemo(() => {
    const size = 96;
    const canvas =
      typeof document !== 'undefined' ? document.createElement('canvas') : null;
    if (!canvas) return '';
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    const img = ctx.createImageData(size, size);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const n = noise2D('grain', x / cell + frame * 0.6, y / cell);
        const v = Math.floor(((n + 1) / 2) * 255);
        const i = (y * size + x) * 4;
        img.data[i] = v;
        img.data[i + 1] = v;
        img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
    // Add a tiny random shift so adjacent frames don't look identical even at
    // sub-pixel scales (extra perceptual texture).
    void random(`grain-${frame}`);
    return canvas.toDataURL('image/png');
  }, [frame, cell]);

  return (
    <AbsoluteFill
      style={{
        backgroundImage: dataUri ? `url(${dataUri})` : undefined,
        backgroundSize: '320px 320px',
        mixBlendMode: 'overlay',
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};
