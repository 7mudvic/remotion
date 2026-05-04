import React from 'react';
import {THEME} from '../../theme';
import {FONT_FAMILY} from '../../fonts';
import type {PriceItem} from '../PriceList';

type Tone = 'blue' | 'yellow';
type Props = {prices: PriceItem[]; tone: Tone};

const splitNum = (v: string): [string, string] => {
  const m = v.match(/^\s*([\d.,٠-٩]+)\s*(.*)$/);
  return [m?.[1] ?? v, m?.[2] || 'ر.س'];
};

/**
 * DESIGN 5 — Outlined Boxes (transparent fill).
 *
 * Three rounded boxes drawn only with a thick contrast stroke — no
 * fill. Lets the brand background show through. Modern, airy, premium
 * boutique feel. A small dot indicator (size growing per row) sits
 * inside each box on the right.
 */
export const Design5Outlined: React.FC<Props> = ({prices, tone}) => {
  const inverted = tone === 'blue';
  const stroke = inverted ? THEME.blue : THEME.yellow;
  const labelColor = inverted ? THEME.blue : THEME.yellow;
  const numColor = inverted ? THEME.blue : THEME.yellow;
  const unitColor = inverted ? THEME.blueLo : THEME.yellowLo;

  // Indicator dot diameter per row (small / medium / large)
  const dots = [10, 16, 24];

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
      {prices.map((p, i) => {
        const [num, unit] = splitNum(p.value);
        return (
          <div
            key={p.label}
            style={{
              width: 320,
              height: 90,
              borderRadius: 22,
              background: 'transparent',
              border: `3.5px solid ${stroke}`,
              direction: 'rtl',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 22px',
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <span
                style={{
                  width: dots[i],
                  height: dots[i],
                  borderRadius: '50%',
                  background: stroke,
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontFamily: FONT_FAMILY.cairo,
                  fontWeight: 700,
                  fontSize: 28,
                  color: labelColor,
                }}
              >
                {p.label}
              </span>
            </div>
            <span
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 6,
              }}
            >
              <span
                style={{
                  fontFamily: FONT_FAMILY.cairo,
                  fontWeight: 900,
                  fontSize: 48,
                  color: numColor,
                  lineHeight: 1,
                  letterSpacing: -1,
                }}
              >
                {num}
              </span>
              <span
                style={{
                  fontFamily: FONT_FAMILY.cairo,
                  fontWeight: 700,
                  fontSize: 22,
                  color: unitColor,
                  lineHeight: 1,
                }}
              >
                {unit}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
};
