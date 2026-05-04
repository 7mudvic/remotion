import React from 'react';
import {THEME} from '../../theme';
import {FONT_FAMILY} from '../../fonts';
import type {PriceItem} from '../PriceList';

type Tone = 'blue' | 'yellow';
type Props = {prices: PriceItem[]; tone: Tone};

/**
 * DESIGN 2 — Menu Receipt.
 *
 * One tall card with a small "قائمة الأسعار" header and three rows
 * separated by hairline dividers. Reads like a printed price column
 * on a vintage menu card.
 */
export const Design2Receipt: React.FC<Props> = ({prices, tone}) => {
  const inverted = tone === 'blue';
  const cardFill = inverted ? THEME.blue : THEME.yellow;
  const cardStroke = inverted ? THEME.yellowHi : THEME.blue;
  const headerColor = inverted ? THEME.yellowHi : THEME.blueLo;
  const labelColor = inverted ? THEME.cream : THEME.blue;
  const priceColor = inverted ? THEME.cream : THEME.blue;
  const dividerColor = inverted ? THEME.yellowLo : THEME.blue;

  return (
    <div
      style={{
        width: 360,
        background: cardFill,
        borderRadius: 26,
        border: `3px solid ${cardStroke}`,
        boxShadow: `0 22px 44px rgba(9, 18, 54, 0.5)`,
        padding: '34px 30px',
        direction: 'rtl',
      }}
    >
      <div
        style={{
          fontFamily: FONT_FAMILY.tajawal,
          fontWeight: 700,
          fontSize: 22,
          color: headerColor,
          textAlign: 'center',
          letterSpacing: 5,
          textTransform: 'uppercase',
          opacity: 0.85,
        }}
      >
        الأسعار
      </div>
      <div
        style={{
          height: 2,
          background: dividerColor,
          opacity: 0.55,
          margin: '14px -10px 6px -10px',
        }}
      />
      {prices.map((p, i) => (
        <React.Fragment key={p.label}>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              padding: '16px 4px',
            }}
          >
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
            <span
              style={{
                fontFamily: FONT_FAMILY.cairo,
                fontWeight: 900,
                fontSize: 38,
                color: priceColor,
                lineHeight: 1,
                letterSpacing: -1,
              }}
            >
              {p.value}
            </span>
          </div>
          {i < prices.length - 1 ? (
            <div
              style={{
                height: 1,
                background: dividerColor,
                opacity: 0.35,
              }}
            />
          ) : null}
        </React.Fragment>
      ))}
    </div>
  );
};
