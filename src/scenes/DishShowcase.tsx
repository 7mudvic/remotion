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
  descriptionAr: string;
  /** e.g. "20 ر.س" */
  price: string;
  badge?: string;
};

/**
 * RTL dish hero scene laid out as a strict vertical column so nothing
 * overlaps:
 *
 *   ┌───────────────────────────────┐
 *   │ TOP STRIP (index + badge)     │  10%
 *   ├───────────────────────────────┤
 *   │ TITLE (Arabic + EN subtitle)  │  18%
 *   ├───────────────────────────────┤
 *   │ HERO IMAGE                    │  50%
 *   ├───────────────────────────────┤
 *   │ FOOTER (price + description)  │  22%
 *   └───────────────────────────────┘
 */
export const DishShowcase: React.FC<{
  dish: Dish;
  index: number;
}> = ({dish, index}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames, width, height} = useVideoConfig();

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

  // Description slides up from bottom
  const descSpring = spring({
    frame: frame - 30,
    fps,
    config: {damping: 18, stiffness: 110, mass: 0.7},
  });
  const descY = interpolate(descSpring, [0, 1], [30, 0]);
  const descOpacity = interpolate(frame, [30, 50], [0, 1], {
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
  const descColor = onYellow ? THEME.blueLo : THEME.cream;
  const badgeTextColor = onYellow ? THEME.blue : THEME.yellow;

  // Zone heights (px @ 1080)
  const TOP_H = Math.round(height * 0.10);
  const TITLE_H = Math.round(height * 0.18);
  const HERO_H = Math.round(height * 0.50);
  const FOOTER_H = height - TOP_H - TITLE_H - HERO_H;

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

      {/* TOP STRIP — index pill (right in RTL) + badge label (left in RTL) */}
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
            fontSize: 110,
            color: titleColor,
            lineHeight: 1,
            letterSpacing: -2,
            textAlign: 'center',
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

      {/* HERO IMAGE */}
      <div
        style={{
          height: HERO_H,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3,
        }}
      >
        <ProductCard
          src={staticFile(dish.image)}
          delay={4}
          width={Math.min(width - 240, 1280)}
          height={HERO_H - 30}
        />
      </div>

      {/* FOOTER — price (left in RTL) + description (right in RTL) */}
      <div
        style={{
          height: FOOTER_H,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 100px',
          gap: 60,
          zIndex: 4,
        }}
      >
        <PriceBadge price={dish.price} delay={36} size={200} />

        <div
          style={{
            flex: 1,
            maxWidth: 1100,
            opacity: descOpacity,
            transform: `translateY(${descY}px)`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_FAMILY.cairo,
              fontWeight: 700,
              fontSize: 38,
              lineHeight: 1.45,
              color: descColor,
              direction: 'rtl',
              textAlign: 'right',
            }}
          >
            {dish.descriptionAr}
          </div>
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
