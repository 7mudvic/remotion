import React from 'react';
import {AbsoluteFill, Img, staticFile, useVideoConfig} from 'remotion';
import {SunburstBackground} from '../components/SunburstBackground';
import {DecorPattern} from '../components/DecorPattern';
import {Design1Pills} from '../components/designs/Design1Pills';
import {Design2Receipt} from '../components/designs/Design2Receipt';
import {Design3Stamps} from '../components/designs/Design3Stamps';
import {Design4Editorial} from '../components/designs/Design4Editorial';
import {Design5Outlined} from '../components/designs/Design5Outlined';
import {THEME} from '../theme';
import {FONT_FAMILY} from '../fonts';
import type {PriceItem} from '../components/PriceList';

const PRICES: PriceItem[] = [
  {label: 'صغير', value: '16 ر.س'},
  {label: 'وسط', value: '21 ر.س'},
  {label: 'كبير', value: '37 ر.س'},
];

const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const toArabicNumeral = (n: number) =>
  String(n)
    .split('')
    .map((d) => arabicDigits[Number(d)] ?? d)
    .join('');

/**
 * MockupScene — a static, frame-independent variant of DishShowcase
 * used to render side-by-side design previews. It uses the same
 * background + zone layout as the real scenes so the user can pick the
 * winning design with full visual context.
 *
 * `design` selects which price layout to render.
 * `variant` flips the brand background (blueTop / yellowTop) — pass the
 * scene tone you want to preview the price design against.
 */
export const MockupScene: React.FC<{
  design: 1 | 2 | 3 | 4 | 5;
  variant?: 'blueTop' | 'yellowTop';
}> = ({design, variant = 'yellowTop'}) => {
  const {height} = useVideoConfig();
  const onYellow = variant === 'yellowTop';
  const titleColor = onYellow ? THEME.blue : THEME.cream;
  // Banner takes the *opposite* tone of the scene background, same
  // contrast rule used everywhere else.
  const tone: 'blue' | 'yellow' = onYellow ? 'blue' : 'yellow';

  const TOP_H = Math.round(height * 0.10);
  const TITLE_H = Math.round(height * 0.18);
  const HERO_H = height - TOP_H - TITLE_H;

  const PriceComp =
    design === 1
      ? Design1Pills
      : design === 2
        ? Design2Receipt
        : design === 3
          ? Design3Stamps
          : design === 4
            ? Design4Editorial
            : Design5Outlined;

  return (
    <AbsoluteFill
      style={{
        direction: 'rtl',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <SunburstBackground variant={variant} />
      <DecorPattern color={onYellow ? THEME.blue : THEME.ink} opacity={0.40} />

      {/* TOP STRIP — design number pill on the right */}
      <div
        style={{
          height: TOP_H,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 80px',
          zIndex: 4,
        }}
      >
        <div
          style={{
            padding: '8px 22px',
            borderRadius: 999,
            background: THEME.yellow,
            color: THEME.blue,
            fontFamily: FONT_FAMILY.cairo,
            fontWeight: 900,
            fontSize: 26,
            boxShadow: `0 8px 18px ${THEME.shadowBlue}`,
            border: `3px solid ${THEME.blue}`,
          }}
        >
          نموذج {toArabicNumeral(design)}
        </div>
      </div>

      {/* TITLE BLOCK */}
      <div
        style={{
          height: TITLE_H,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 80px',
          zIndex: 4,
        }}
      >
        <div
          style={{
            fontFamily: FONT_FAMILY.cairo,
            fontWeight: 900,
            fontSize: 110,
            color: titleColor,
            lineHeight: 1,
            letterSpacing: -2,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            textShadow: onYellow ? 'none' : `0 6px 18px ${THEME.shadowBlue}`,
          }}
        >
          عَريكة البلدة
        </div>
      </div>

      {/* HERO ZONE */}
      <div
        style={{
          height: HERO_H,
          position: 'relative',
          zIndex: 3,
        }}
      >
        {/* Dish — geometric centre */}
        <div
          style={{
            position: 'absolute',
            inset: '0 0 60px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Img
            src={staticFile('dishes/dish-22-areekat-al-balad.png')}
            style={{
              maxWidth: 1500,
              maxHeight: HERO_H - 60,
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              filter: `drop-shadow(0 36px 50px ${THEME.shadowBlue}) drop-shadow(0 8px 14px rgba(9, 18, 54, 0.35))`,
            }}
          />
        </div>

        {/* Price design — pinned to the left */}
        <div
          style={{
            position: 'absolute',
            left: 100,
            top: 0,
            bottom: 60,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <PriceComp prices={PRICES} tone={tone} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
