import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {THEME} from '../theme';
import {FONT_FAMILY} from '../fonts';

/**
 * Luxury vertical price banner — a "pennant" / ribbon stamped against the
 * brand backdrop. Designed to read instantly from across a restaurant.
 *
 * Anatomy (top → bottom):
 *   ┌──────────────┐  rounded top
 *   │   ◆◆ ◆◆      │  small gold filigree
 *   │   السعر       │  small label, gold
 *   │     ٢٠       │  HUGE number in cream
 *   │    ر.س       │  unit, gold
 *   │   ◆◆ ◆◆      │  small gold filigree
 *   └──────╲╱──────┘  chevron tail at the bottom (ribbon end)
 *
 * Colours: royal-blue gradient with a thick gold inner border.
 * Animations: spring scale-in + subtle float ±3 px so it feels alive.
 */
export const PriceBadge: React.FC<{
  price: string;
  delay?: number;
  /** outer width in px — height auto-derives at 1.42:1 ratio */
  size?: number;
}> = ({price, delay = 0, size = 280}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = Math.max(0, frame - delay);

  // Spring pop-in
  const pop = spring({
    frame: local,
    fps,
    config: {damping: 12, stiffness: 110, mass: 0.7, overshootClamping: false},
  });
  const float = Math.sin(local / 32) * 3; // ±3 px continuous float
  const introTilt = interpolate(pop, [0, 1], [-6, 0]);

  // Number / unit split
  const m = price.match(/^\s*([\d.,٠-٩]+)\s*(.*)$/);
  const num = m?.[1] ?? price;
  const unit = m?.[2] || 'ر.س';

  const W = size;
  const H = Math.round(W * 1.42); // 280 → 398
  const tail = Math.round(H * 0.13); // chevron tail height
  const radius = 18;

  // Outer banner shape: rounded top corners + chevron bottom point
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

  // Inner hairline that follows the banner shape, inset 10 px
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
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id="banner-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={THEME.blueHi} />
            <stop offset="55%" stopColor={THEME.blue} />
            <stop offset="100%" stopColor={THEME.blueDeep} />
          </linearGradient>
          <linearGradient id="banner-stroke" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={THEME.yellowHi} />
            <stop offset="100%" stopColor={THEME.yellowLo} />
          </linearGradient>
        </defs>

        {/* Body */}
        <path d={path} fill="url(#banner-fill)" stroke="url(#banner-stroke)" strokeWidth={4} strokeLinejoin="round" />
        {/* Inner hairline */}
        <path d={innerPath} fill="none" stroke={THEME.yellow} strokeWidth={1.2} opacity={0.6} />

        {/* Filigree ornaments */}
        <Filigree x={W / 2} y={36} color={THEME.yellow} />
        <Filigree x={W / 2} y={H - tail - 18} color={THEME.yellow} flip />
      </svg>

      {/* Centered text content */}
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
            color: THEME.yellow,
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
            color: THEME.cream,
            lineHeight: 0.9,
            letterSpacing: -2,
            textShadow: `0 2px 0 rgba(0,0,0,0.35)`,
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
            color: THEME.yellowHi,
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

/**
 * Tiny SVG filigree — 3 diamonds in a row with a gold flourish.
 * Used at top and bottom of the banner for a "menu card" feel.
 */
const Filigree: React.FC<{x: number; y: number; color: string; flip?: boolean}> = ({x, y, color, flip}) => {
  const transform = flip ? `translate(${x}, ${y}) rotate(180)` : `translate(${x}, ${y})`;
  return (
    <g transform={transform}>
      {/* line */}
      <line x1={-30} y1={0} x2={-12} y2={0} stroke={color} strokeWidth={1.2} opacity={0.7} />
      <line x1={12} y1={0} x2={30} y2={0} stroke={color} strokeWidth={1.2} opacity={0.7} />
      {/* 3 diamonds */}
      <g fill={color}>
        <polygon points="-9,0 -5,-4 -1,0 -5,4" />
        <polygon points="-3,0 0,-5 3,0 0,5" opacity={0.9} />
        <polygon points="9,0 5,-4 1,0 5,4" />
      </g>
    </g>
  );
};
