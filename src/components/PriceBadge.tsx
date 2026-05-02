import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {THEME} from '../theme';
import {FONT_FAMILY} from '../fonts';

/**
 * Brand-true price badge — a starburst "sticker" stamp.
 *
 * Layout:
 *   ┌─────── starburst ribbon (yellow, blue stroke) ───────┐
 *   │  ┌── inner circle (cream → yellow gradient) ──┐      │
 *   │  │             "السعر"  (small)                │      │
 *   │  │              ٢٠     (huge Cairo 900)        │      │
 *   │  │             ر.س   (small Tajawal)            │      │
 *   │  └──────────────────────────────────────────────┘    │
 *   └──────────────────────────────────────────────────────┘
 *
 * Animations:
 *   • Spring scale-in from 0 → 1 with a tiny over-shoot
 *   • Continuous −5° → +5° wobble so the sticker "lives"
 *   • Slow inner pulse (±1.5%) on the inner disc
 */
export const PriceBadge: React.FC<{
  price: string;
  delay?: number;
  /** outer diameter in px */
  size?: number;
}> = ({price, delay = 0, size = 240}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = Math.max(0, frame - delay);

  // Pop-in spring with a slight bounce
  const pop = spring({
    frame: local,
    fps,
    config: {damping: 10, stiffness: 130, mass: 0.7, overshootClamping: false},
  });
  const wobble = Math.sin(local / 28) * 5; // ±5° forever
  const introTilt = interpolate(pop, [0, 1], [-20, 0]);

  const innerPulse = 1 + Math.sin(local / 24) * 0.015;

  // Split numeric vs unit
  const m = price.match(/^\s*([\d.,٠-٩]+)\s*(.*)$/);
  const num = m?.[1] ?? price;
  const unit = m?.[2] || 'ر.س';

  // Build a 16-point starburst SVG path. Outer points = ribbon tips,
  // inner points = the ribbon valleys. The ratio inner/outer controls
  // how spiky vs round the sticker feels.
  const points = 16;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2;
  const innerR = outerR * 0.9; // keep tips short and rounded
  let path = '';
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    path += `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  path += 'Z';

  const discRadius = outerR * 0.74;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        transform: `scale(${pop}) rotate(${introTilt + wobble}deg)`,
        opacity: pop,
        filter: `drop-shadow(0 18px 28px ${THEME.shadowBlue})`,
      }}
    >
      {/* Starburst ribbon */}
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{position: 'absolute', inset: 0}}
      >
        <defs>
          <linearGradient id="pb-ribbon" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={THEME.yellowHi} />
            <stop offset="100%" stopColor={THEME.yellow} />
          </linearGradient>
          <radialGradient id="pb-disc" cx="38%" cy="32%" r="70%">
            <stop offset="0%" stopColor={THEME.cream} />
            <stop offset="55%" stopColor={THEME.yellowHi} />
            <stop offset="100%" stopColor={THEME.yellow} />
          </radialGradient>
        </defs>

        {/* Spiky ribbon */}
        <path
          d={path}
          fill="url(#pb-ribbon)"
          stroke={THEME.blue}
          strokeWidth={4}
          strokeLinejoin="round"
        />

        {/* Inner disc with dashed blue ring */}
        <circle
          cx={cx}
          cy={cy}
          r={discRadius * innerPulse}
          fill="url(#pb-disc)"
          stroke={THEME.blue}
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      </svg>

      {/* Centered price text */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
          // Counter-rotate the text so it stays upright while the sticker wobbles
          transform: `rotate(${-(introTilt + wobble)}deg)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT_FAMILY.tajawal,
            fontWeight: 700,
            fontSize: size * 0.075,
            color: THEME.blue,
            opacity: 0.75,
            letterSpacing: 2,
            marginBottom: -2,
          }}
        >
          السعر
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY.cairo,
            fontWeight: 900,
            fontSize: size * 0.42,
            color: THEME.blue,
            lineHeight: 0.95,
            letterSpacing: -2,
            textShadow: `0 2px 0 rgba(255, 255, 255, 0.45)`,
          }}
        >
          {num}
        </div>
        <div
          style={{
            fontFamily: FONT_FAMILY.cairo,
            fontWeight: 900,
            fontSize: size * 0.13,
            color: THEME.blue,
            direction: 'rtl',
            marginTop: -2,
            letterSpacing: 1,
          }}
        >
          {unit}
        </div>
      </div>
    </div>
  );
};
