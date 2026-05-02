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

export const LogoIntro: React.FC<{
  brandName: string;
  brandNameAr: string;
  tagline: string;
  logoSrc?: string;
}> = ({brandName, brandNameAr, tagline, logoSrc}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  // Logo: spring scale-in + slow exhale
  const logoSpring = spring({
    frame: frame - 12,
    fps,
    config: {damping: 200, stiffness: 80, mass: 1.2},
  });
  const exhale = 1 + Math.sin(frame / 30) * 0.012;
  const logoScale = (0.6 + logoSpring * 0.4) * exhale;
  const logoOpacity = interpolate(frame, [12, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Brand name reveals after logo settles
  const titleOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const titleY = interpolate(frame, [40, 65], [24, 0], {
    extrapolateRight: 'clamp',
  });

  // Tagline letterspacing animation - elegant "spread" reveal
  const taglineSpread = interpolate(frame, [62, 95], [4, 18], {
    extrapolateRight: 'clamp',
  });
  const taglineOpacity = interpolate(frame, [62, 88], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Whole scene fade out at the end
  const sceneOpacity = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames - 2],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill style={{opacity: sceneOpacity, background: THEME.bgBottom}}>
      <CinematicBackground hue="gold" intensity={0.95} />
      <Particles count={70} />
      <LightLeak delay={20} duration={70} />
      <LightLeak delay={75} duration={50} angle={14} hue="rgba(255, 200, 130, 0.45)" />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 320,
            height: 320,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            filter: `drop-shadow(0 6px 24px ${THEME.goldShadow})`,
          }}
        >
          {logoSrc ? (
            <Img
              src={staticFile(logoSrc)}
              style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}}
            />
          ) : (
            <LogoPlaceholder />
          )}
        </div>

        {/* Arabic brand name */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontFamily: elMessiri,
            color: THEME.cream,
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: 2,
            textShadow: `0 4px 24px ${THEME.goldShadow}`,
            direction: 'rtl',
          }}
        >
          {brandNameAr}
        </div>

        {/* Latin brand name */}
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            fontFamily: cormorant,
            fontStyle: 'italic',
            color: THEME.goldHi,
            fontSize: 36,
            fontWeight: 500,
            letterSpacing: 14,
            textTransform: 'uppercase',
          }}
        >
          {brandName}
        </div>

        <div style={{marginTop: 8}}>
          <AnimatedDivider width={420} delay={70} />
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: taglineOpacity,
            fontFamily: cormorant,
            color: THEME.creamDim,
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: taglineSpread,
            textTransform: 'uppercase',
            marginTop: 10,
          }}
        >
          {tagline}
        </div>
      </AbsoluteFill>

      <Vignette strength={0.7} />
      <FilmGrain opacity={THEME.filmGrain} />
    </AbsoluteFill>
  );
};

/**
 * Decorative fallback when no logo file is provided yet.
 * A circular gold monogram so the scene still looks finished in preview.
 */
const LogoPlaceholder: React.FC = () => {
  return (
    <svg viewBox="0 0 200 200" width={260} height={260}>
      <defs>
        <radialGradient id="g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={THEME.goldHi} />
          <stop offset="100%" stopColor={THEME.goldLo} />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill="none" stroke="url(#g)" strokeWidth={2} />
      <circle cx="100" cy="100" r="78" fill="none" stroke={THEME.gold} strokeWidth={1} opacity={0.5} />
      <text
        x="100"
        y="120"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, serif"
        fontSize="90"
        fontStyle="italic"
        fill="url(#g)"
      >
        ✦
      </text>
    </svg>
  );
};
