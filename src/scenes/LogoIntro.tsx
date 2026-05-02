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
import {SunburstBackground} from '../components/SunburstBackground';
import {DecorPattern} from '../components/DecorPattern';
import {THEME} from '../theme';

export const LogoIntro: React.FC<{
  brandNameAr: string;
  taglineAr?: string;
  logoSrc?: string;
}> = ({brandNameAr, taglineAr, logoSrc}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const logoSpring = spring({
    frame: frame - 8,
    fps,
    config: {damping: 12, stiffness: 90, mass: 1},
  });
  const logoScale = 0.6 + logoSpring * 0.4;
  const logoOpacity = interpolate(frame, [8, 28], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const logoBreath = 1 + Math.sin(frame / 26) * 0.012;

  const titleSpring = spring({
    frame: frame - 32,
    fps,
    config: {damping: 16, stiffness: 110, mass: 0.7},
  });
  const titleY = interpolate(titleSpring, [0, 1], [40, 0]);
  const titleOpacity = interpolate(frame, [32, 50], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const taglineOpacity = interpolate(frame, [56, 80], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const sceneOpacity = interpolate(
    frame,
    [durationInFrames - 18, durationInFrames - 2],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill style={{opacity: sceneOpacity, direction: 'rtl'}}>
      <SunburstBackground variant="blueTop" />
      <DecorPattern color={THEME.yellow} opacity={0.45} delay={2} />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 36,
          padding: 80,
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 460,
            height: 360,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${logoScale * logoBreath})`,
            opacity: logoOpacity,
            filter: `drop-shadow(0 18px 36px ${THEME.shadowBlue})`,
          }}
        >
          {logoSrc ? (
            <Img
              src={staticFile(logoSrc)}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          ) : (
            <div
              style={{
                width: 360,
                height: 260,
                borderRadius: '50%',
                background: THEME.yellow,
                border: `6px solid ${THEME.blue}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: THEME.blue,
                fontFamily: FONT_FAMILY.cairo,
                fontWeight: 900,
                fontSize: 70,
                lineHeight: 1,
                textAlign: 'center',
              }}
            >
              عَريكة
              <br />
              البلدة
            </div>
          )}
        </div>

        {/* Brand name (Arabic) */}
        <div
          style={{
            fontFamily: FONT_FAMILY.cairo,
            fontWeight: 900,
            fontSize: 96,
            color: THEME.cream,
            lineHeight: 1,
            letterSpacing: -1,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
            textShadow: `0 6px 24px ${THEME.shadowBlue}`,
          }}
        >
          {brandNameAr}
        </div>

        {/* Tagline */}
        {taglineAr ? (
          <div
            style={{
              fontFamily: FONT_FAMILY.tajawal,
              fontWeight: 500,
              fontSize: 38,
              color: THEME.yellowHi,
              opacity: taglineOpacity,
              direction: 'rtl',
              textAlign: 'center',
            }}
          >
            {taglineAr}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
