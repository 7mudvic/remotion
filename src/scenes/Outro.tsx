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
    config: {damping: 12, stiffness: 90, mass: 1},
  });
  const logoScale = 0.55 + logoSpring * 0.45;
  const logoOpacity = interpolate(frame, [6, 26], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const brandOpacity = interpolate(frame, [22, 42], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const brandY = interpolate(frame, [22, 42], [30, 0], {
    extrapolateRight: 'clamp',
  });

  const ctaSpring = spring({
    frame: frame - 50,
    fps,
    config: {damping: 14, stiffness: 110, mass: 0.7},
  });
  const ctaScale = 0.85 + ctaSpring * 0.15;
  const ctaOpacity = interpolate(frame, [50, 72], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 22, durationInFrames - 2],
    [1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  return (
    <AbsoluteFill style={{opacity: fadeOut, direction: 'rtl'}}>
      <SunburstBackground variant="yellowTop" />
      <DecorPattern color={THEME.blue} opacity={0.5} delay={2} />

      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 28,
          padding: 80,
        }}
      >
        <div
          style={{
            width: 300,
            height: 230,
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            filter: `drop-shadow(0 18px 36px ${THEME.shadowBlue})`,
          }}
        >
          {logoSrc ? (
            <Img
              src={staticFile(logoSrc)}
              style={{maxWidth: '100%', maxHeight: '100%', objectFit: 'contain'}}
            />
          ) : null}
        </div>

        <div
          style={{
            fontFamily: FONT_FAMILY.cairo,
            fontWeight: 900,
            fontSize: 84,
            color: THEME.blue,
            lineHeight: 1,
            opacity: brandOpacity,
            transform: `translateY(${brandY}px)`,
          }}
        >
          {brandNameAr}
        </div>

        {/* CTA stamp */}
        <div
          style={{
            marginTop: 12,
            padding: '20px 56px',
            background: THEME.blue,
            borderRadius: 999,
            color: THEME.yellow,
            fontFamily: FONT_FAMILY.cairo,
            fontWeight: 900,
            fontSize: 44,
            letterSpacing: -0.5,
            transform: `scale(${ctaScale})`,
            opacity: ctaOpacity,
            boxShadow: `0 16px 36px ${THEME.shadowBlue}`,
            border: `4px solid ${THEME.yellow}`,
          }}
        >
          {callToActionAr}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
