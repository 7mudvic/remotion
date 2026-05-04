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
 * DESIGN 1 — Filled Pills.
 *
 * Three solid colour chips with rounded ends. Label on right (RTL),
 * price + unit on left. Soft drop shadow + thin contrast border. Bold
 * and confident; reads instantly.
 */
export const Design1Pills: React.FC<Props> = ({prices, tone}) => {
  const inverted = tone === 'blue';
  const fill = inverted ? THEME.blue : THEME.yellow;
  const stroke = inverted ? THEME.yellowHi : THEME.blueLo;
  const labelColor = inverted ? THEME.yellowHi : THEME.blue;
  const numColor = inverted ? THEME.cream : THEME.blue;
  const unitColor = inverted ? THEME.yellowHi : THEME.blue;

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
      {prices.map((p) => {
        const [num, unit] = splitNum(p.value);
        return (
          <div
            key={p.label}
            style={{
              width: 320,
              height: 86,
              borderRadius: 22,
              background: fill,
              border: `2px solid ${stroke}`,
              boxShadow: `0 12px 22px rgba(9, 18, 54, 0.45)`,
              direction: 'rtl',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 22px',
            }}
          >
            <span
              style={{
                fontFamily: FONT_FAMILY.cairo,
                fontWeight: 700,
                fontSize: 30,
                color: labelColor,
              }}
            >
              {p.label}
            </span>
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
                  fontSize: 46,
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
