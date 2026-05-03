import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {THEME} from '../theme';
import {FONT_FAMILY} from '../fonts';

type Tone = 'blue' | 'yellow';

/**
 * Luxury vertical price banner — a "pennant" / ribbon stamped against the
 * brand backdrop. Designed to read instantly from across a restaurant.
 *
 * Anatomy (top → bottom):
 *   ┌──────────────┐  rounded top
 *   │   ◆◆ ◆◆      │  small filigree
 *   │   السعر       │  small label
 *   │     ٢٠       │  HUGE number
 *   │    ر.س       │  unit
 *   │   ◆◆ ◆◆      │  small filigree
 *   └──────╲╱──────┘  chevron tail at the bottom (ribbon end)
 *
 * The `tone` prop flips the entire palette so the banner can sit on
 * either a blue or a yellow scene with maximum contrast:
 *   tone="blue"   → blue body + gold border (use on yellow scenes)
 *   tone="yellow" → yellow body + blue border (use on blue scenes)
 */
export const PriceBadge: React.FC<{
  price: string;
  delay?: number;
  /** outer width in px — height auto-derives at 1.42:1 ratio */
  size?: number;
  /** banner palette — pass the *opposite* of the scene background */
  tone?: Tone;
}> = ({price, delay = 0, size = 280, tone = 'blue'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = Math.max(0, frame - delay);

  // Spring pop-in
  const pop = spring({
    frame: local,
    fps,
    config: {damping: 12, stiffness: 110, mass: 0.7, overshootClamping: false},
  });
  const float = Math.sin(local / 32) * 3;
  const introTilt = interpolate(pop, [0, 1], [-6, 0]);

  // Number / unit split
  const m = price.match(/^\s*([\d.,٠-٩]+)\s*(.*)$/);
  const num = m?.[1] ?? price;
  const unit = m?.[2] || 'ر.س';

  const W = size;
  const H = Math.round(W * 1.42);
  const tail = Math.round(H * 0.13);
  const radius = 18;

  const path = [
    `M ${radius} 0`,
    `L ${W - radius} 0`,
    `Q ${W} 0 ${W} ${radius}`,
    `L ${W} ${H - tail}`,
    `L ${W / 2} ${H}`,
    `L 0 ${H - tail}`,
    `L 0 ${radius}`,
    `Q 0 0 ${radius} 0`,
    'Z',
  ].join(' ');

  const inset = 10;
  const innerPath = [
    `M ${radius} ${inset}`,
    `L ${W - radius} ${inset}`,
    `Q ${W - inset} ${inset} ${W - inset} ${radius}`,
    `L ${W - inset} ${H - tail - inset / 2}`,
    `L ${W / 2} ${H - inset}`,
    `L ${inset} ${H - tail - inset / 2}`,
    `L ${inset} ${radius}`,
    `Q ${inset} ${inset} ${radius} ${inset}`,
    'Z',
  ].join(' ');

  const labelOpacity = interpolate(local, [4, 16], [0, 1], {extrapolateRight: 'clamp'});
  const numOpacity = interpolate(local, [10, 24], [0, 1], {extrapolateRight: 'clamp'});
  const unitOpacity = interpolate(local, [16, 28], [0, 1], {extrapolateRight: 'clamp'});

  // Per-tone palette. Each tone keeps the same component contract so the
  // banner reads identically — only the colours flip.
  const palette =
    tone === 'yellow'
      ? {
          fillTop: THEME.yellowHi,
          fillMid: THEME.yellow,
          fillBottom: THEME.yellowLo,
          strokeTop: THEME.blueHi,
          strokeBottom: THEME.blueLo,
          innerHairline: THEME.blue,
          filigree: THEME.blue,
          labelColor: THEME.blue,
          numberColor: THEME.blueDeep,
          unitColor: THEME.blue,
          numShadow: 'rgba(255, 255, 255, 0.45)',
        }
      : {
          fillTop: THEME.blueHi,
          fillMid: THEME.blue,
          fillBottom: THEME.blueDeep,
          strokeTop: THEME.yellowHi,
          strokeBottom: THEME.yellowLo,
          innerHairline: THEME.yellow,
          filigree: THEME.yellow,
          labelColor: THEME.yellow,
          numberColor: THEME.cream,
          unitColor: THEME.yellowHi,
          numShadow: 'rgba(0, 0, 0, 0.35)',
        };

  return (
    <div
      style={{
        position: 'relative',
        width: W,
        height: H,
        transform: `translateY(${float}px) scale(${pop}) rotate(${introTilt}deg)`,
        opacity: pop,
        filter: `drop-shadow(0 22px 36px ${THEME.shadowBlue})`,
      }}
    >
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{position: 'absolute', inset: 0}}
      >
        <defs>
          <linearGradient id={`banner-fill-${tone}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.fillTop} />
            <stop offset="55%" stopColor={palette.fillMid} />
            <stop offset="100%" stopColor={palette.fillBottom} />
          </linearGradient>
          <linearGradient id={`banner-stroke-${tone}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.strokeTop} />
            <stop offset="100%" stopColor={palette.strokeBottom} />
          </linearGradient>
        </defs>

        <path
          d={path}
          fill={`url(#banner-fill-${tone})`}
          stroke={`url(#banner-stroke-${tone})`}
          strokeWidth={4}
          strokeLinejoin="round"
        />
        <path
          d={innerPath}
          fill="none"
          stroke={palette.innerHairline}
          strokeWidth={1.2}
          opacity={0.6}
        />

        <Filigree x={W / 2} y={36} color={palette.filigree} />
        <Filigree x={W / 2} y={H - tail - 18} color={palette.filigree} flip />
      </svg>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          paddingTop: 60,
          paddingBottom: tail + 30,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            fontFamily: FONT_FAMILY.tajawal,
            fontWeight: 700,
            fontSize: W * 0.10,
            color: palette.labelColor,
            letterSpacing: 2,
            opacity: labelOpacity,
            textTransform: 'uppercase',
          }}
        >
          السعر
        </div>

        <div
          style={{
            fontFamily: FONT_FAMILY.cairo,
            fontWeight: 900,
            fontSize: W * 0.55,
            color: palette.numberColor,
            lineHeight: 0.9,
            letterSpacing: -2,
            textShadow: `0 2px 0 ${palette.numShadow}`,
            opacity: numOpacity,
          }}
        >
          {num}
        </div>

        <div
          style={{
            fontFamily: FONT_FAMILY.cairo,
            fontWeight: 900,
            fontSize: W * 0.16,
            color: palette.unitColor,
            lineHeight: 1,
            letterSpacing: 1,
            direction: 'rtl',
            opacity: unitOpacity,
          }}
        >
          {unit}
        </div>
      </div>
    </div>
  );
};

const Filigree: React.FC<{x: number; y: number; color: string; flip?: boolean}> = ({
  x,
  y,
  color,
  flip,
}) => {
  const transform = flip ? `translate(${x}, ${y}) rotate(180)` : `translate(${x}, ${y})`;
  return (
    <g transform={transform}>
      <line x1={-30} y1={0} x2={-12} y2={0} stroke={color} strokeWidth={1.2} opacity={0.7} />
      <line x1={12} y1={0} x2={30} y2={0} stroke={color} strokeWidth={1.2} opacity={0.7} />
      <g fill={color}>
        <polygon points="-9,0 -5,-4 -1,0 -5,4" />
        <polygon points="-3,0 0,-5 3,0 0,5" opacity={0.9} />
        <polygon points="9,0 5,-4 1,0 5,4" />
      </g>
    </g>
  );
};
