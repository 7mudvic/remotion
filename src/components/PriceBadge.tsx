import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {THEME} from '../theme';
import {FONT_FAMILY} from '../fonts';

type Tone = 'blue' | 'yellow';

/**
 * Plain price text — no background, no banner shape, no border.
 * Just a clean stacked typography block:
 *
 *     السعر       (small label)
 *      ٢٠         (HUGE number)
 *     ر.س         (unit)
 *
 * The `tone` prop sets the colour of the entire stack:
 *   tone="blue"   → blue text   (use on yellow scenes)
 *   tone="yellow" → yellow text (use on blue scenes)
 */
export const PriceBadge: React.FC<{
  price: string;
  delay?: number;
  /** controls the visual scale of the whole stack */
  size?: number;
  tone?: Tone;
}> = ({price, delay = 0, size = 360, tone = 'blue'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = Math.max(0, frame - delay);

  // Spring pop-in for the whole block
  const pop = spring({
    frame: local,
    fps,
    config: {damping: 12, stiffness: 110, mass: 0.7, overshootClamping: false},
  });
  const float = Math.sin(local / 32) * 2;

  // Number / unit split
  const m = price.match(/^\s*([\d.,٠-٩]+)\s*(.*)$/);
  const num = m?.[1] ?? price;
  const unit = m?.[2] || 'ر.س';

  // Per-tone palette
  const palette =
    tone === 'yellow'
      ? {
          label: THEME.yellow,
          number: THEME.yellowHi,
          unit: THEME.yellow,
          numberShadow: 'rgba(0, 0, 0, 0.45)',
        }
      : {
          label: THEME.blue,
          number: THEME.blueDeep,
          unit: THEME.blue,
          numberShadow: 'rgba(255, 255, 255, 0.45)',
        };

  const labelOpacity = interpolate(local, [4, 18], [0, 1], {extrapolateRight: 'clamp'});
  const numOpacity = interpolate(local, [10, 26], [0, 1], {extrapolateRight: 'clamp'});
  const unitOpacity = interpolate(local, [16, 30], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        transform: `translateY(${float}px) scale(${pop})`,
        opacity: pop,
      }}
    >
      {/* السعر label */}
      <div
        style={{
          fontFamily: FONT_FAMILY.tajawal,
          fontWeight: 700,
          fontSize: size * 0.13,
          color: palette.label,
          letterSpacing: 6,
          textTransform: 'uppercase',
          opacity: labelOpacity,
        }}
      >
        السعر
      </div>

      {/* The number — huge, hard-stamped */}
      <div
        style={{
          fontFamily: FONT_FAMILY.cairo,
          fontWeight: 900,
          fontSize: size * 0.95,
          color: palette.number,
          lineHeight: 0.9,
          letterSpacing: -4,
          textShadow: `0 4px 0 ${palette.numberShadow}`,
          opacity: numOpacity,
        }}
      >
        {num}
      </div>

      {/* ر.س unit */}
      <div
        style={{
          fontFamily: FONT_FAMILY.cairo,
          fontWeight: 900,
          fontSize: size * 0.26,
          color: palette.unit,
          lineHeight: 1,
          letterSpacing: 1,
          direction: 'rtl',
          opacity: unitOpacity,
        }}
      >
        {unit}
      </div>
    </div>
  );
};
