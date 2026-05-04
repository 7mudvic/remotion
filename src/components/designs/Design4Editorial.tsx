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
 * DESIGN 4 — Editorial Typography.
 *
 * No boxes. Just clean stacked text: tiny size label above a huge
 * price number, with a small accent bar between rows. Magazine /
 * fine-dining card feel. Counts entirely on typography.
 */
export const Design4Editorial: React.FC<Props> = ({prices, tone}) => {
  const inverted = tone === 'blue';
  const labelColor = inverted ? THEME.blue : THEME.yellow;
  const numColor = inverted ? THEME.blue : THEME.yellow;
  const unitColor = inverted ? THEME.blueLo : THEME.yellowLo;
  const accent = inverted ? THEME.blue : THEME.yellow;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        direction: 'rtl',
      }}
    >
      {prices.map((p, i) => {
        const [num, unit] = splitNum(p.value);
        return (
          <React.Fragment key={p.label}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
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
                  marginBottom: 0,
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
                  width: 56,
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
