import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {THEME} from '../../theme';
import {FONT_FAMILY} from '../../fonts';
import type {PriceItem} from '../PriceList';

type Tone = 'blue' | 'yellow';
type Props = {prices: PriceItem[]; tone: Tone; delay?: number};

const splitNum = (v: string): [string, string] => {
  const m = v.match(/^\s*([\d.,٠-٩]+)\s*(.*)$/);
  return [m?.[1] ?? v, m?.[2] || 'ر.س'];
};

/**
 * DESIGN 4 — Editorial Typography (animated).
 *
 * No boxes. Pure stacked typography:
 *   - tiny size label above
 *   - huge price number underneath, baseline-aligned with a smaller "ر.س"
 *   - thin accent bar between rows that draws itself in horizontally
 *
 * Each row staggers in with a spring (slide-up + fade), and the accent
 * bar grows from 0 → 56 px width synchronised with the row's spring.
 * The whole stack continues to float ±2 px after settling so the layout
 * never feels frozen on a TV loop.
 */
export const Design4Editorial: React.FC<Props> = ({prices, tone, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = Math.max(0, frame - delay);

  const float = Math.sin(local / 32) * 2;

  const inverted = tone === 'blue';
  const labelColor = inverted ? THEME.blue : THEME.yellow;
  const numColor = inverted ? THEME.blue : THEME.yellow;
  // Unit text matches the number colour exactly for visual unity.
  const unitColor = numColor;
  const accent = inverted ? THEME.blue : THEME.yellow;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        direction: 'rtl',
        transform: `translateY(${float}px)`,
      }}
    >
      {prices.map((p, i) => {
        const stagger = i * 8;
        const f = local - stagger;

        const rowSpring = spring({
          frame: f,
          fps,
          config: {damping: 14, stiffness: 110, mass: 0.7},
        });
        const rowOpacity = interpolate(f, [0, 14], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const rowY = interpolate(rowSpring, [0, 1], [16, 0]);
        const numScale = interpolate(rowSpring, [0, 1], [0.85, 1]);
        const accentWidth = interpolate(rowSpring, [0, 1], [0, 56]);

        const [num, unit] = splitNum(p.value);
        return (
          <React.Fragment key={p.label}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                opacity: rowOpacity,
                transform: `translateY(${rowY}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: FONT_FAMILY.tajawal,
                  fontWeight: 700,
                  fontSize: 22,
                  color: labelColor,
                  letterSpacing: 6,
                  opacity: 0.7,
                  textTransform: 'uppercase',
                }}
              >
                {p.label}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 8,
                  marginTop: -4,
                  transform: `scale(${numScale})`,
                  transformOrigin: 'right center',
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_FAMILY.cairo,
                    fontWeight: 900,
                    fontSize: 86,
                    color: numColor,
                    lineHeight: 0.95,
                    letterSpacing: -3,
                  }}
                >
                  {num}
                </span>
                <span
                  style={{
                    fontFamily: FONT_FAMILY.cairo,
                    fontWeight: 700,
                    fontSize: 28,
                    color: unitColor,
                    lineHeight: 1,
                  }}
                >
                  {unit}
                </span>
              </div>
            </div>
            {i < prices.length - 1 ? (
              <div
                style={{
                  width: accentWidth,
                  height: 3,
                  background: accent,
                  opacity: 0.5,
                  margin: '8px 0',
                }}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};
