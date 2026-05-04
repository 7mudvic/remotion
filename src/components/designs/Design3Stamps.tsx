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
 * DESIGN 3 — Round Stamps.
 *
 * Three circular stamps stacked vertically with a slight per-stamp
 * rotation so they feel hand-applied. Big number front and centre,
 * size label small below it.
 */
export const Design3Stamps: React.FC<Props> = ({prices, tone}) => {
  const inverted = tone === 'blue';
  const fill = inverted ? THEME.blue : THEME.yellow;
  const stroke = inverted ? THEME.yellowHi : THEME.blue;
  const labelColor = inverted ? THEME.yellowHi : THEME.blueLo;
  const numColor = inverted ? THEME.cream : THEME.blue;
  const unitColor = inverted ? THEME.yellowHi : THEME.blue;

  const tilts = [-3, 2, -2];

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
      {prices.map((p, i) => {
        const [num, unit] = splitNum(p.value);
        return (
          <div
            key={p.label}
            style={{
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: fill,
              border: `4px solid ${stroke}`,
              boxShadow: `0 14px 28px rgba(9, 18, 54, 0.5)`,
              transform: `rotate(${tilts[i]}deg)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY.tajawal,
                fontWeight: 700,
                fontSize: 18,
                color: labelColor,
                opacity: 0.9,
                letterSpacing: 4,
                textTransform: 'uppercase',
                marginBottom: -4,
              }}
            >
              {p.label}
            </span>
            <span
              style={{
                fontFamily: FONT_FAMILY.cairo,
                fontWeight: 900,
                fontSize: 76,
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
                fontSize: 20,
                color: unitColor,
                lineHeight: 1,
                marginTop: -4,
              }}
            >
              {unit}
            </span>
          </div>
        );
      })}
    </div>
  );
};
