import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {THEME} from '../theme';
import {FONT_FAMILY} from '../fonts';

/**
 * Big yellow circular price stamp. Springs in with a slight rotation, then
 * gently exhales. Designed to read instantly from across a restaurant.
 */
export const PriceBadge: React.FC<{
  price: string;
  delay?: number;
  size?: number;
}> = ({price, delay = 0, size = 220}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = Math.max(0, frame - delay);

  const pop = spring({
    frame: local,
    fps,
    config: {damping: 12, stiffness: 110, mass: 0.7},
  });
  const scale = pop;
  const rotate = interpolate(pop, [0, 1], [-25, -8]);
  const exhale = 1 + Math.sin(local / 22) * 0.018;

  // Split number from currency for typographic hierarchy
  const match = price.match(/^\s*([\d.,]+)\s*(.*)$/);
  const num = match?.[1] ?? price;
  const unit = match?.[2] ?? '';

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 30%, ${THEME.yellowHi} 0%, ${THEME.yellow} 60%, ${THEME.yellowLo} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        transform: `scale(${scale * exhale}) rotate(${rotate}deg)`,
        boxShadow: `0 16px 36px ${THEME.shadowBlue}, inset 0 -10px 24px rgba(168, 123, 20, 0.35), inset 0 6px 16px rgba(255, 255, 255, 0.25)`,
        border: `4px solid ${THEME.blue}`,
        opacity: pop,
      }}
    >
      <div
        style={{
          fontFamily: FONT_FAMILY.cairo,
          fontWeight: 900,
          fontSize: size * 0.35,
          color: THEME.blue,
          lineHeight: 1,
          letterSpacing: -1,
        }}
      >
        {num}
      </div>
      <div
        style={{
          fontFamily: FONT_FAMILY.tajawal,
          fontWeight: 700,
          fontSize: size * 0.13,
          color: THEME.blue,
          lineHeight: 1,
          direction: 'rtl',
        }}
      >
        {unit || 'ر.س'}
      </div>
    </div>
  );
};
