import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {FONT_FAMILY} from '../fonts';
import {SunburstBackground} from '../components/SunburstBackground';
import {DecorPattern} from '../components/DecorPattern';
import {ProductCard} from '../components/ProductCard';
import {PriceBadge} from '../components/PriceBadge';
import {THEME} from '../theme';

export type Dish = {
  /** path inside public/, e.g. "dishes/dish-1.jpg" */
  image: string;
  nameAr: string;
  nameEn: string;
  /** kept in the data model for future use, no longer rendered */
  descriptionAr: string;
  /** e.g. "20 ر.س" */
  price: string;
  badge?: string;
};

/**
 * RTL dish hero scene. Three vertical zones, no overlap:
 *
 *   ┌───────────────────────────────┐
 *   │ TOP STRIP (index + badge)     │  10%
 *   ├───────────────────────────────┤
 *   │ TITLE (Arabic + EN subtitle)  │  18%
 *   ├───────────────────────────────┤
 *   │                               │
 *   │ HERO (dish + price banner)    │  72%
 *   │                               │
 *   └───────────────────────────────┘
 *
 * The HERO row holds the product photo and the price banner side-by-side
 * (RTL: dish on the right, banner on the left). A small top padding lifts
 * the row away from the title without losing vertical centring.
 */
export const DishShowcase: React.FC<{
  dish: Dish;
  index: number;
}> = ({dish, index}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, height} = useVideoConfig();

  // Title slides down from top
  const titleSpring = spring({
    frame: frame - 6,
    fps,
    config: {damping: 14, stiffness: 110, mass: 0.7},
  });
  const titleY = interpolate(titleSpring, [0, 1], [-40, 0]);
  const titleOpacity = interpolate(frame, [6, 22], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const subOpacity = interpolate(frame, [18, 36], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const pillOpacity = interpolate(frame, [3, 18], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Outgoing fade
  const outAt = durationInFrames - 18;
  const sceneOpacity = interpolate(frame, [outAt, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const variant = index % 2 === 1 ? 'blueTop' : 'yellowTop';
  const onYellow = variant === 'yellowTop';
  const titleColor = onYellow ? THEME.blue : THEME.cream;
  const subColor = onYellow ? THEME.blueLo : THEME.yellowHi;
  const badgeTextColor = onYellow ? THEME.blue : THEME.yellow;
  // Banner takes the *opposite* tone of the scene background for max contrast.
  const bannerTone: 'blue' | 'yellow' = onYellow ? 'blue' : 'yellow';

  // Three zones now (description removed). Hero gets the bulk of the screen.
  const TOP_H = Math.round(height * 0.10);
  const TITLE_H = Math.round(height * 0.18);
  const HERO_H = height - TOP_H - TITLE_H;

  return (
    <AbsoluteFill
      style={{
        opacity: sceneOpacity,
        direction: 'rtl',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <SunburstBackground variant={variant} />
      <DecorPattern color={onYellow ? THEME.blue : THEME.ink} opacity={0.40} delay={2} />

      {/* TOP STRIP */}
      <div
        style={{
          height: TOP_H,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 80px',
          opacity: pillOpacity,
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
          صنف {toArabicNumeral(index)}
        </div>

        {dish.badge ? (
          <div
            style={{
              fontFamily: FONT_FAMILY.cairo,
              fontWeight: 700,
              fontSize: 28,
              color: badgeTextColor,
              padding: '6px 22px',
              border: `3px dashed ${badgeTextColor}`,
              borderRadius: 14,
            }}
          >
            {dish.badge}
          </div>
        ) : null}
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
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          zIndex: 4,
        }}
      >
        <div
          style={{
            fontFamily: FONT_FAMILY.cairo,
            fontWeight: 900,
            // Long Arabic names auto-shrink so they always fit on one line.
            fontSize: dish.nameAr.length > 22 ? 88 : dish.nameAr.length > 16 ? 100 : 110,
            color: titleColor,
            lineHeight: 1,
            letterSpacing: -2,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            textShadow: onYellow ? 'none' : `0 6px 18px ${THEME.shadowBlue}`,
          }}
        >
          {dish.nameAr}
        </div>
        <div
          style={{
            marginTop: 12,
            fontFamily: FONT_FAMILY.reemKufi,
            fontWeight: 400,
            fontSize: 26,
            color: subColor,
            letterSpacing: 6,
            textTransform: 'uppercase',
            opacity: subOpacity,
            direction: 'ltr',
          }}
        >
          {dish.nameEn}
        </div>
      </div>

      {/* HERO ZONE — dish is absolutely centred on the screen; the price
          text is pinned to the left edge so the dish moving doesn't drag
          it along. Bottom padding lifts both away from the screen edge. */}
      <div
        style={{
          height: HERO_H,
          position: 'relative',
          zIndex: 3,
        }}
      >
        {/* Dish — geometric centre of the screen */}
        <div
          style={{
            position: 'absolute',
            inset: '0 0 60px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ProductCard
            src={staticFile(dish.image)}
            delay={4}
            width={1500}
            height={HERO_H - 60}
          />
        </div>

        {/* Price — pinned to the left, vertically centred with the dish */}
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
          <PriceBadge price={dish.price} delay={28} size={230} tone={bannerTone} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
function toArabicNumeral(n: number): string {
  return String(n)
    .split('')
    .map((d) => arabicDigits[Number(d)] ?? d)
    .join('');
}
