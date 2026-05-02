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
import {KenBurnsImage} from '../components/KenBurnsImage';
import {CinematicBackground} from '../components/CinematicBackground';
import {Vignette} from '../components/Vignette';
import {FilmGrain} from '../components/FilmGrain';
import {Particles} from '../components/Particles';
import {LightLeak} from '../components/LightLeak';
import {GoldFrame} from '../components/GoldFrame';
import {AnimatedDivider} from '../components/AnimatedDivider';
import {THEME} from '../theme';

const cormorant = FONT_FAMILY.cormorant;
const elMessiri = FONT_FAMILY.elMessiri;
const playfair = FONT_FAMILY.playfair;

export type Dish = {
  /** path inside public/, e.g. "dishes/burger.jpg" */
  image: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  /** e.g. "45 SAR" */
  price: string;
  badge?: string;
  panDirection?: 'in' | 'out' | 'left' | 'right' | 'diagonal';
};

/**
 * The hero scene for each dish: full-bleed Ken Burns photo on the right
 * with a glass / gold-bordered text panel sliding in from the left.
 */
export const DishShowcase: React.FC<{
  dish: Dish;
  index: number;
}> = ({dish, index}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // Panel slides in
  const panelSpring = spring({
    frame: frame - 8,
    fps,
    config: {damping: 200, stiffness: 90, mass: 0.8},
  });
  const panelX = interpolate(panelSpring, [0, 1], [-120, 0]);
  const panelOpacity = interpolate(frame, [8, 28], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Text reveals
  const dishOpacityAr = interpolate(frame, [22, 42], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const dishYAr = interpolate(frame, [22, 42], [16, 0], {
    extrapolateRight: 'clamp',
  });
  const dishOpacityEn = interpolate(frame, [30, 50], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const descOpacity = interpolate(frame, [50, 75], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const priceSpring = spring({
    frame: frame - 70,
    fps,
    config: {damping: 200, stiffness: 110, mass: 0.6},
  });
  const priceScale = 0.7 + priceSpring * 0.3;

  // Index badge
  const indexOpacity = interpolate(frame, [4, 24], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Outgoing slide
  const outAt = durationInFrames - 24;
  const outProgress = interpolate(frame, [outAt, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const sceneOpacity = 1 - outProgress;

  return (
    <AbsoluteFill style={{background: THEME.bgBottom, opacity: sceneOpacity}}>
      {/* Background image with Ken Burns - takes the right 58% of the frame */}
      <AbsoluteFill style={{left: '42%'}}>
        <KenBurnsImage
          src={staticFile(dish.image)}
          pan={dish.panDirection ?? 'in'}
          fadeIn={10}
          fadeOut={20}
        />
        {/* Gradient mask blending image into the panel */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(90deg, ${THEME.bgBottom} 0%, transparent 22%, transparent 100%)`,
          }}
        />
      </AbsoluteFill>

      {/* Cinematic backdrop fills the panel side */}
      <AbsoluteFill style={{right: '58%'}}>
        <CinematicBackground hue="amber" intensity={0.85} />
      </AbsoluteFill>

      <Particles count={40} blur={4} />
      <LightLeak delay={4} duration={50} />

      {/* Text panel */}
      <AbsoluteFill
        style={{
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '0 88px',
          opacity: panelOpacity,
          transform: `translateX(${panelX}px)`,
        }}
      >
        <div style={{maxWidth: 720, width: '100%'}}>
          {/* Index pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              opacity: indexOpacity,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: '50%',
                border: `1px solid ${THEME.gold}`,
                color: THEME.goldHi,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: playfair,
                fontStyle: 'italic',
                fontSize: 22,
                background: 'rgba(212,168,90,0.07)',
              }}
            >
              {String(index).padStart(2, '0')}
            </div>
            <div
              style={{
                fontFamily: cormorant,
                color: THEME.creamDim,
                letterSpacing: 8,
                fontSize: 14,
                textTransform: 'uppercase',
              }}
            >
              {dish.badge ?? "Chef's Selection"}
            </div>
          </div>

          {/* Arabic name */}
          <div
            style={{
              fontFamily: elMessiri,
              color: THEME.cream,
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.05,
              direction: 'rtl',
              opacity: dishOpacityAr,
              transform: `translateY(${dishYAr}px)`,
              textShadow: `0 4px 24px rgba(0,0,0,0.55)`,
            }}
          >
            {dish.nameAr}
          </div>

          {/* Latin name */}
          <div
            style={{
              fontFamily: cormorant,
              fontStyle: 'italic',
              color: THEME.goldHi,
              fontSize: 32,
              letterSpacing: 6,
              textTransform: 'uppercase',
              marginTop: 8,
              opacity: dishOpacityEn,
            }}
          >
            {dish.nameEn}
          </div>

          {/* Divider */}
          <div style={{margin: '28px 0'}}>
            <AnimatedDivider width={420} delay={42} />
          </div>

          {/* Description (Arabic) */}
          <div
            style={{
              fontFamily: elMessiri,
              color: THEME.creamDim,
              fontSize: 28,
              lineHeight: 1.55,
              direction: 'rtl',
              maxWidth: 620,
              opacity: descOpacity,
            }}
          >
            {dish.descriptionAr}
          </div>

          {/* Price */}
          <div
            style={{
              marginTop: 40,
              display: 'inline-flex',
              alignItems: 'baseline',
              gap: 12,
              padding: '14px 28px',
              border: `1px solid ${THEME.gold}`,
              background: 'rgba(212, 168, 90, 0.08)',
              boxShadow: `0 8px 32px ${THEME.goldShadow}`,
              transform: `scale(${priceScale})`,
              transformOrigin: 'left center',
              opacity: priceSpring,
            }}
          >
            <span
              style={{
                fontFamily: playfair,
                fontStyle: 'italic',
                color: THEME.creamDim,
                fontSize: 18,
                letterSpacing: 4,
                textTransform: 'uppercase',
              }}
            >
              Price
            </span>
            <span
              style={{
                fontFamily: cormorant,
                color: THEME.goldHi,
                fontSize: 48,
                fontWeight: 600,
                letterSpacing: 1,
              }}
            >
              {dish.price}
            </span>
          </div>
        </div>
      </AbsoluteFill>

      <GoldFrame inset={50} delay={6} />
      <Vignette strength={0.5} />
      <FilmGrain opacity={THEME.filmGrain} />
    </AbsoluteFill>
  );
};
