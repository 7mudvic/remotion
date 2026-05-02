import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {FONT_FAMILY} from '../fonts';
import {CinematicBackground} from '../components/CinematicBackground';
import {Particles} from '../components/Particles';
import {LightLeak} from '../components/LightLeak';
import {Vignette} from '../components/Vignette';
import {FilmGrain} from '../components/FilmGrain';
import {AnimatedDivider} from '../components/AnimatedDivider';
import {THEME} from '../theme';

const cormorant = FONT_FAMILY.cormorant;
const elMessiri = FONT_FAMILY.elMessiri;

export const Outro: React.FC<{
  brandNameAr: string;
  callToActionAr: string;
  logoSrc?: string;
}> = ({brandNameAr, callToActionAr, logoSrc}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const logoSpring = spring({
    frame: frame - 6,
    fps,
    config: {damping: 200, stiffness: 70, mass: 1},
  });
  const logoScale = 0.7 + logoSpring * 0.3;
  const logoOpacity = interpolate(frame, [6, 28], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const titleOpacity = interpolate(frame, [28, 50], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const ctaOpacity = interpolate(frame, [55, 80], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 22, durationInFrames - 2],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill style={{background: THEME.bgBottom, opacity: fadeOut}}>
      <CinematicBackground hue="royal" intensity={1} />
      <Particles count={80} />
      <LightLeak delay={10} duration={70} />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <div
          style={{
            width: 220,
            height: 220,
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: `drop-shadow(0 6px 24px ${THEME.goldShadow})`,
          }}
        >
          {logoSrc ? (
            <Img
              src={staticFile(logoSrc)}
              style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}}
            />
          ) : (
            <DiamondMark />
          )}
        </div>

        <div
          style={{
            fontFamily: elMessiri,
            color: THEME.cream,
            fontSize: 64,
            fontWeight: 700,
            opacity: titleOpacity,
            direction: 'rtl',
            textShadow: `0 4px 24px ${THEME.goldShadow}`,
          }}
        >
          {brandNameAr}
        </div>

        <AnimatedDivider width={360} delay={48} />

        <div
          style={{
            fontFamily: elMessiri,
            color: THEME.goldHi,
            fontSize: 30,
            opacity: ctaOpacity,
            direction: 'rtl',
            letterSpacing: 1,
          }}
        >
          {callToActionAr}
        </div>

        <div
          style={{
            fontFamily: cormorant,
            fontStyle: 'italic',
            color: THEME.creamDim,
            fontSize: 18,
            opacity: ctaOpacity,
            letterSpacing: 14,
            textTransform: 'uppercase',
            marginTop: 6,
          }}
        >
          Bon Appétit
        </div>
      </AbsoluteFill>

      <Vignette strength={0.7} />
      <FilmGrain opacity={THEME.filmGrain} />
    </AbsoluteFill>
  );
};

const DiamondMark: React.FC = () => (
  <svg viewBox="0 0 200 200" width={200} height={200}>
    <defs>
      <linearGradient id="diamond" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={THEME.goldHi} />
        <stop offset="100%" stopColor={THEME.goldLo} />
      </linearGradient>
    </defs>
    <polygon
      points="100,10 190,100 100,190 10,100"
      fill="none"
      stroke="url(#diamond)"
      strokeWidth={2}
    />
    <polygon
      points="100,40 160,100 100,160 40,100"
      fill="none"
      stroke={THEME.gold}
      strokeWidth={1}
      opacity={0.5}
    />
  </svg>
);
