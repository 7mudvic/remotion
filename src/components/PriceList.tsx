import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {THEME} from '../theme';
import {FONT_FAMILY} from '../fonts';

type Tone = 'blue' | 'yellow';

export type PriceItem = {
  /** small label, e.g. "صغير" / "وسط" / "كبير" */
  label: string;
  /** numeric price + unit, e.g. "16 ر.س" */
  value: string;
};

/**
 * Multi-price stacked list — a column of rounded "chips" that each show
 * one size + price. Used for dishes that come in multiple sizes.
 *
 *   ┌──────────────────────────┐
 *   │  صغير            ١٦ ر.س  │ ← spring in first
 *   └──────────────────────────┘
 *   ┌──────────────────────────┐
 *   │  وسط             ٢١ ر.س  │ ← spring in 8 frames later
 *   └──────────────────────────┘
 *   ┌──────────────────────────┐
 *   │  كبير            ٣٧ ر.س  │ ← spring in 16 frames later
 *   └──────────────────────────┘
 *
 * Tone follows the same rule as <PriceBadge>:
 *   tone="yellow" (use on blue scenes) → yellow chips, blue text
 *   tone="blue"   (use on yellow scenes) → blue chips, yellow text
 *
 * Each chip enters with a spring scale-from-left + soft drop shadow.
 * Subtle continuous float ±2 px on the whole stack.
 */
export const PriceList: React.FC<{
  prices: PriceItem[];
  delay?: number;
  tone?: Tone;
}> = ({prices, delay = 0, tone = 'blue'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = Math.max(0, frame - delay);

  const float = Math.sin(local / 32) * 2;

  const palette =
    tone === 'yellow'
      ? {
          fillTop: THEME.yellowHi,
          fillBottom: THEME.yellow,
          stroke: THEME.blueLo,
          label: THEME.blue,
          number: THEME.blue,
          unit: THEME.blueLo,
          shadow: 'rgba(9, 18, 54, 0.45)',
          highlight: 'rgba(255, 255, 255, 0.55)',
        }
      : {
          fillTop: THEME.blueHi,
          fillBottom: THEME.blue,
          stroke: THEME.yellowLo,
          label: THEME.yellowHi,
          number: THEME.cream,
          unit: THEME.yellowHi,
          shadow: 'rgba(9, 18, 54, 0.55)',
          highlight: 'rgba(255, 215, 107, 0.35)',
        };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        transform: `translateY(${float}px)`,
      }}
    >
      {prices.map((p, i) => (
        <PriceChip
          key={p.label}
          item={p}
          stagger={i * 8}
          localFrame={local}
          fps={fps}
          palette={palette}
        />
      ))}
    </div>
  );
};

type Palette = {
  fillTop: string;
  fillBottom: string;
  stroke: string;
  label: string;
  number: string;
  unit: string;
  shadow: string;
  highlight: string;
};

const PriceChip: React.FC<{
  item: PriceItem;
  stagger: number;
  localFrame: number;
  fps: number;
  palette: Palette;
}> = ({item, stagger, localFrame, fps, palette}) => {
  const f = localFrame - stagger;

  // Spring pop-in
  const pop = spring({
    frame: f,
    fps,
    config: {damping: 14, stiffness: 130, mass: 0.7, overshootClamping: false},
  });
  // Slide from the left so the stack feels assembled
  const slideX = interpolate(pop, [0, 1], [-50, 0]);
  const opacity = interpolate(f, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Inner contents fade slightly after the chip body so the eye sees the
  // chip shape first, then the text.
  const textOpacity = interpolate(f, [4, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Split number from unit
  const m = item.value.match(/^\s*([\d.,٠-٩]+)\s*(.*)$/);
  const num = m?.[1] ?? item.value;
  const unit = m?.[2] || 'ر.س';

  return (
    <div
      style={{
        position: 'relative',
        width: 320,
        height: 86,
        borderRadius: 22,
        background: `linear-gradient(180deg, ${palette.fillTop} 0%, ${palette.fillBottom} 100%)`,
        border: `2px solid ${palette.stroke}`,
        boxShadow: `0 12px 22px ${palette.shadow}`,
        transform: `translateX(${slideX}px) scale(${0.94 + pop * 0.06})`,
        opacity,
        overflow: 'hidden',
        direction: 'rtl',
      }}
    >
      {/* Top highlight — gives a glassy "premium" feel */}
      <div
        style={{
          position: 'absolute',
          top: 2,
          left: 14,
          right: 14,
          height: 16,
          borderRadius: '50%',
          background: palette.highlight,
          filter: 'blur(6px)',
          opacity: 0.7,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: '0 22px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: textOpacity,
        }}
      >
        {/* Label (right in RTL) */}
        <div
          style={{
            fontFamily: FONT_FAMILY.cairo,
            fontWeight: 700,
            fontSize: 30,
            color: palette.label,
            letterSpacing: 0.5,
          }}
        >
          {item.label}
        </div>

        {/* Price + unit (left in RTL) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline',
            gap: 6,
          }}
        >
          <div
            style={{
              fontFamily: FONT_FAMILY.cairo,
              fontWeight: 900,
              fontSize: 46,
              color: palette.number,
              lineHeight: 1,
              letterSpacing: -1,
            }}
          >
            {num}
          </div>
          <div
            style={{
              fontFamily: FONT_FAMILY.cairo,
              fontWeight: 700,
              fontSize: 22,
              color: palette.unit,
              lineHeight: 1,
            }}
          >
            {unit}
          </div>
        </div>
      </div>
    </div>
  );
};
